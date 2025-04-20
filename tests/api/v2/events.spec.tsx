import { eventsEndpointHandler } from '../../../pages/api/v2/events';
import { AgendaEvent } from '../../../data/dbSchema';

// Mock the modules
jest.mock('services/rollbar', () => ({
  rollbarReporter: {
    error: jest.fn(),
  },
}));

jest.mock('../../../data/supabaseService', () => ({
  supabaseService: {
    getAllAgendaEvents: jest.fn(),
  },
}));

// Import the mocks after mocking
import { rollbarReporter } from 'services/rollbar';
import { supabaseService as db } from '../../../data/supabaseService';

afterEach(() => {
  jest.clearAllMocks();
});

test('returns 422 to requests with unsupported method', async () => {
  const response = await eventsEndpointHandler({ method: 'POST' });

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
