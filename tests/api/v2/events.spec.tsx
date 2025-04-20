import { eventsEndpointHandler } from '../../../pages/api/v2/events';
import { AgendaEvent } from '../../../data/dbSchema';

// Mock the modules
jest.mock('services/rollbar', () => ({
  rollbarReporter: {
    error: jest.fn(),
  },
}));

jest.mock('../../../data/validationService', () => ({
  validationService: {
    newEvent: jest.fn(),
  },
}));

jest.mock('../../../data/supabaseService', () => ({
  supabaseService: {
    getAllAgendaEvents: jest.fn(),
    createNewAgendaEvent: jest.fn(),
    updateAgendaEvent: jest.fn(),
  },
}));

// Import the mocks after mocking
import { rollbarReporter } from 'services/rollbar';
import { supabaseService as db } from '../../../data/supabaseService';
import { validationService } from '../../../data/validationService';

afterEach(() => {
  jest.clearAllMocks();
});

test('returns 422 to requests with unsupported method', async () => {
  const response = await eventsEndpointHandler({ method: 'OPTIONS' });

  expect(response).toEqual({
    message: 'Unsupported request method',
    status: 422,
  });
});

describe('GET request', () => {
  test('calls getAllAgendaEvents method on valid request', async () => {
    (db.getAllAgendaEvents as jest.Mock).mockResolvedValueOnce([]);

    await eventsEndpointHandler({ method: 'GET' });

    expect(db.getAllAgendaEvents).toHaveBeenCalledTimes(1);
  });

  test('returns response object with data from database', async () => {
    const mockEvents: AgendaEvent[] = [
      {
        id: '1',
        name: 'Test Event 1',
        start: '2023-01-01T00:00:00.000Z',
        end: '2023-01-31T00:00:00.000Z',
        state: { current: 'highlight' },
        tags: ['test'],
      },
      {
        id: '2',
        name: 'Test Event 2',
        start: '2023-02-01T00:00:00.000Z',
        end: '2023-02-28T00:00:00.000Z',
        state: { exhibitions: 'candidate' },
        tags: null,
      },
    ];

    (db.getAllAgendaEvents as jest.Mock).mockResolvedValueOnce(mockEvents);

    const result = await eventsEndpointHandler({ method: 'GET' });

    expect(result).toEqual({
      status: 200,
      message: 'OK',
      data: mockEvents,
    });
  });

  test('reports to rollbar on DB error', async () => {
    const errorMessage = 'Database connection error';
    (db.getAllAgendaEvents as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    await eventsEndpointHandler({ method: 'GET' });

    expect(rollbarReporter.error).toHaveBeenCalledWith(
      'DB: failed to getAllAgendaEvents',
    );
  });

  test('returns error object on DB error', async () => {
    const errorMessage = 'Database connection error';
    (db.getAllAgendaEvents as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const result = await eventsEndpointHandler({ method: 'GET' });

    expect(result).toEqual({
      status: 500,
      message: `Error on getAllAgendaEvents: ${errorMessage}`,
    });
  });
});

describe('POST request', () => {
  const validEvent: Omit<AgendaEvent, 'id'> = {
    name: 'New Event',
    end: '2023-12-31T00:00:00.000Z',
    state: { current: 'highlight' as const },
    tags: ['test'],
  };

  test('validates the event object', async () => {
    (validationService.newEvent as jest.Mock).mockReturnValueOnce(true);
    (db.createNewAgendaEvent as jest.Mock).mockResolvedValueOnce({
      id: '123',
      ...validEvent,
    });

    await eventsEndpointHandler({ method: 'POST', body: validEvent });

    expect(validationService.newEvent).toHaveBeenCalledWith(validEvent);
  });

  test('returns 422 if the event is invalid', async () => {
    (validationService.newEvent as jest.Mock).mockReturnValueOnce(false);

    const response = await eventsEndpointHandler({
      method: 'POST',
      body: validEvent,
    });

    expect(response).toEqual({
      status: 422,
      message: 'Invalid new event object',
      data: { providedObject: validEvent },
    });
    expect(db.createNewAgendaEvent).not.toHaveBeenCalled();
  });

  test('calls createNewAgendaEvent with valid event', async () => {
    (validationService.newEvent as jest.Mock).mockReturnValueOnce(true);
    (db.createNewAgendaEvent as jest.Mock).mockResolvedValueOnce({
      id: '123',
      ...validEvent,
    });

    await eventsEndpointHandler({ method: 'POST', body: validEvent });

    expect(db.createNewAgendaEvent).toHaveBeenCalledWith(validEvent);
  });

  test('returns the created event on success', async () => {
    const createdEvent = {
      id: '123',
      ...validEvent,
    };

    (validationService.newEvent as jest.Mock).mockReturnValueOnce(true);
    (db.createNewAgendaEvent as jest.Mock).mockResolvedValueOnce(createdEvent);

    const response = await eventsEndpointHandler({
      method: 'POST',
      body: validEvent,
    });

    expect(response).toEqual({
      status: 200,
      message: 'OK',
      data: createdEvent,
    });
  });

  test('reports to rollbar on DB error', async () => {
    const errorMessage = 'Database connection error';

    (validationService.newEvent as jest.Mock).mockReturnValueOnce(true);
    (db.createNewAgendaEvent as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    await eventsEndpointHandler({ method: 'POST', body: validEvent });

    expect(rollbarReporter.error).toHaveBeenCalledWith(
      'DB: failed to createNewAgendaEvent',
    );
  });

  test('returns error object on DB error', async () => {
    const errorMessage = 'Database connection error';

    (validationService.newEvent as jest.Mock).mockReturnValueOnce(true);
    (db.createNewAgendaEvent as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const response = await eventsEndpointHandler({
      method: 'POST',
      body: validEvent,
    });

    expect(response).toEqual({
      status: 500,
      message: `Error on createNewAgendaEvent: ${errorMessage}.`,
    });
  });
});

describe('PUT request', () => {
  const eventId = '123';
  const validUpdateEvent: Partial<AgendaEvent> = {
    id: eventId,
    name: 'Updated Event Name',
    state: { current: 'mainfocus' as const },
  };

  const updatedEvent: AgendaEvent = {
    id: eventId,
    name: 'Updated Event Name',
    start: '2023-01-01T00:00:00.000Z',
    end: '2023-12-31T00:00:00.000Z',
    state: { current: 'mainfocus' },
    tags: ['updated'],
  };

  test('returns 422 if event ID is missing', async () => {
    const response = await eventsEndpointHandler({
      method: 'PUT',
      body: { name: 'Updated Event Name' },
    });

    expect(response).toEqual({
      status: 422,
      message: 'Can not update event. Missing ID.',
    });
    expect(db.updateAgendaEvent).not.toHaveBeenCalled();
  });

  test('returns 422 if only ID is provided with no update values', async () => {
    const response = await eventsEndpointHandler({
      method: 'PUT',
      body: { id: eventId },
    });

    expect(response).toEqual({
      status: 422,
      message: 'Can not update event. Missing values to be updated.',
    });
    expect(db.updateAgendaEvent).not.toHaveBeenCalled();
  });

  test('calls updateAgendaEvent with correct parameters', async () => {
    (db.updateAgendaEvent as jest.Mock).mockResolvedValueOnce(updatedEvent);

    await eventsEndpointHandler({
      method: 'PUT',
      body: validUpdateEvent,
    });

    // Check that we pass ID and the rest of the body separately
    expect(db.updateAgendaEvent).toHaveBeenCalledWith(eventId, {
      name: 'Updated Event Name',
      state: { current: 'mainfocus' },
    });
  });

  test('returns the updated event on success', async () => {
    (db.updateAgendaEvent as jest.Mock).mockResolvedValueOnce(updatedEvent);

    const response = await eventsEndpointHandler({
      method: 'PUT',
      body: validUpdateEvent,
    });

    expect(response).toEqual({
      status: 200,
      message: 'OK',
      data: updatedEvent,
    });
  });

  test('reports to rollbar on DB error', async () => {
    const errorMessage = 'Database update error';

    (db.updateAgendaEvent as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    await eventsEndpointHandler({
      method: 'PUT',
      body: validUpdateEvent,
    });

    expect(rollbarReporter.error).toHaveBeenCalledWith(
      'DB: failed to updateAgendaEvent',
    );
  });

  test('returns error object on DB error', async () => {
    const errorMessage = 'Database update error';

    (db.updateAgendaEvent as jest.Mock).mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    const response = await eventsEndpointHandler({
      method: 'PUT',
      body: validUpdateEvent,
    });

    expect(response).toEqual({
      status: 500,
      message: `Error on updateAgendaEvent: ${errorMessage}.`,
    });
  });
});
