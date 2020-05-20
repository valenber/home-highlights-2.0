import { eventsEndpointHandler } from '../../pages/api/events';
import { databaseService as db } from '../../data/databaseService';
import { validationService } from '../../data/validationService';

afterEach(() => {
  jest.clearAllMocks();
});

test('returns 422 to requests with unsupported method', async () => {
  const response = await eventsEndpointHandler({ method: 'TELLME' });

  expect(response).toEqual({
    message: 'Unsupported request method',
    status: 422,
  });
});

describe('GET request', () => {
  test('calls getAllAgendaEvents method on valid request', async () => {
    db.getAllAgendaEvents = jest.fn().mockImplementation(() => true);

    await eventsEndpointHandler({ method: 'GET' });

    expect(db.getAllAgendaEvents).toHaveBeenCalledTimes(1);
  });

  test('returns response object with data from database', async () => {
    db.getAllAgendaEvents = jest.fn().mockImplementation(() => [1, 2]);

    const result = await eventsEndpointHandler({ method: 'GET' });

    expect(result).toEqual({ status: 200, message: 'OK', data: [1, 2] });
  });

  test('returns error object on DB error', async () => {
    db.getAllAgendaEvents = jest.fn().mockImplementation(() => {
      throw new Error('collection not found');
    });

    const result = await eventsEndpointHandler({ method: 'GET' });

    expect(result).toEqual({
      status: 500,
      message: 'Error on getAllAgendaEvents: collection not found',
    });
  });
});

describe('POST request', () => {
  test('calls validationService method', async () => {
    validationService.newEvent = jest.fn();

    await eventsEndpointHandler({ method: 'POST' });

    expect(validationService.newEvent).toHaveBeenCalledTimes(1);
  });

  test('does not call createNewEvent on invalid request', async () => {
    validationService.newEvent = jest.fn().mockImplementation(() => false);
    db.createNewAgendaEvent = jest.fn();

    await eventsEndpointHandler({ method: 'POST' });

    expect(db.createNewAgendaEvent).not.toHaveBeenCalled();
  });

  test('returns error on invalid request (invalid event object))', async () => {
    validationService.newEvent = jest.fn().mockImplementation(() => false);

    const result = await eventsEndpointHandler({ method: 'POST', body: {} });

    expect(result).toEqual({
      status: 422,
      message: 'Invalid new event object',
      data: { providedObject: {} },
    });
  });

  test('calls createNewEvent method on valid request', async () => {
    validationService.newEvent = jest.fn().mockImplementation(() => true);
    db.createNewAgendaEvent = jest.fn();

    await eventsEndpointHandler({ method: 'POST', body: {} });

    expect(db.createNewAgendaEvent).toHaveBeenCalledTimes(1);
  });

  test('returns response object with data received from database', async () => {
    const dbResponse = { id: 'new_event_record_id' };
    validationService.newEvent = jest.fn().mockImplementation(() => true);
    db.createNewAgendaEvent = jest.fn().mockImplementation(() => dbResponse);

    const result = await eventsEndpointHandler({ method: 'POST', body: {} });

    expect(result).toEqual({
      status: 200,
      message: 'OK',
      data: dbResponse,
    });
  });

  test('returns error on DB error/timeout', async () => {
    validationService.newEvent = jest.fn().mockImplementation(() => true);
    db.createNewAgendaEvent = jest.fn().mockImplementation(() => {
      throw new Error('connection timed out');
    });

    const result = await eventsEndpointHandler({ method: 'POST', body: {} });

    expect(result).toEqual({
      status: 500,
      message: 'Error on createNewAgendaEvent: connection timed out.',
    });
  });
});

describe('DELETE request', () => {
  test('does not call deleteAgendaEvent on invalid request', async () => {
    db.deleteAgendaEvent = jest.fn();

    await eventsEndpointHandler({
      method: 'DELETE',
      body: {},
    });

    expect(db.deleteAgendaEvent).not.toHaveBeenCalled();
  });

  test('returns error on invalid request (no id)', async () => {
    db.deleteAgendaEvent = jest.fn();

    const result = await eventsEndpointHandler({
      method: 'DELETE',
      body: {},
    });

    expect(result).toEqual({
      status: 422,
      message: 'Can not delete an event. Missing ID.',
    });
  });

  test('calls deleteEvent on valid request', async () => {
    db.deleteAgendaEvent = jest.fn().mockImplementation(() => {
      return {
        status: 200,
        message: 'OK',
        data: { id: 'deleted_event_record_id' },
      };
    });
    await eventsEndpointHandler({
      method: 'DELETE',
      body: { id: 'event_to_delete' },
    });

    expect(db.deleteAgendaEvent).toHaveBeenCalledTimes(1);
  });

  test('returns response object with data from database', async () => {
    db.deleteAgendaEvent = jest.fn().mockImplementation(() => 'old_event_id');

    const result = await eventsEndpointHandler({
      method: 'DELETE',
      body: { id: 'old_event_id' },
    });

    expect(result).toEqual({
      status: 200,
      message: 'OK',
      data: 'old_event_id',
    });
  });

  test('returns error on DB error/timeout', async () => {
    db.deleteAgendaEvent = jest.fn().mockImplementation(() => {
      throw new Error('document not found');
    });

    const result = await eventsEndpointHandler({
      method: 'DELETE',
      body: { id: 'event_id' },
    });

    expect(result).toEqual({
      status: 500,
      message: 'Error on deleteAgendaEvent: document not found.',
    });
  });
});

describe('PUT request', () => {
  test('does not call updateEvent on invalid request', async () => {
    db.updateAgendaEvent = jest.fn();

    await eventsEndpointHandler({ method: 'PUT' });

    expect(db.updateAgendaEvent).not.toHaveBeenCalled();
  });

  test('returns error object on invalid request (no event id)', async () => {
    const result = await eventsEndpointHandler({ method: 'PUT' });

    expect(result).toEqual({
      status: 422,
      message: 'Can not update event. Missing ID.',
    });
  });

  test('calls updateEvent on valid request', async () => {
    db.updateAgendaEvent = jest.fn().mockImplementation(() => {
      return 'ok';
    });

    await eventsEndpointHandler({ method: 'PUT', body: { id: 'event_id' } });

    expect(db.updateAgendaEvent).toHaveBeenCalledTimes(1);
  });

  test('returns response object with data from database', async () => {
    db.updateAgendaEvent = jest
      .fn()
      .mockImplementation(() => 'existing_event_id');

    const result = await eventsEndpointHandler({
      method: 'PUT',
      body: { id: 'existing_event_id' },
    });

    expect(result).toEqual({
      status: 200,
      message: 'OK',
      data: 'existing_event_id',
    });
  });

  test('returns error on DB error/timeout', async () => {
    db.updateAgendaEvent = jest.fn().mockImplementation(() => {
      throw new Error('document not found');
    });

    const result = await eventsEndpointHandler({
      method: 'PUT',
      body: { id: 'event_id' },
    });

    expect(result).toEqual({
      status: 500,
      message: 'Error on updateAgendaEvent: document not found.',
    });
  });
});
