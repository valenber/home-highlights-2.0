import { eventsEndpointHandler } from '../../pages/api/events';
import { databaseService as db } from '../../data/databaseService';

afterEach(() => {
  jest.clearAllMocks();
});

test('returns 422 to requests with unsupported method', async () => {
  const response = await eventsEndpointHandler({ method: 'BLA' });

  expect(response).toEqual({
    message: 'Unsupported request method',
    status: 422,
  });
});

test('calls getAllEvents on GET request', async () => {
  db.getAllAgendaEvents = jest.fn().mockImplementation(() => {
    return { status: 200, message: 'OK', data: {} };
  });
  await eventsEndpointHandler({ method: 'GET' });

  expect(db.getAllAgendaEvents).toHaveBeenCalledTimes(1);
});

test('calls createNewEvent on POST request', async () => {
  db.createNewAgendaEvent = jest.fn().mockImplementation(() => {
    return { status: 200, message: 'OK', data: { id: 'new_event_record_id' } };
  });
  await eventsEndpointHandler({ method: 'POST' });

  expect(db.createNewAgendaEvent).toHaveBeenCalledTimes(1);
});

test('calls deleteEvent on DELETE request', async () => {
  db.deleteAgendaEvent = jest.fn().mockImplementation(() => {
    return {
      status: 200,
      message: 'OK',
      data: { id: 'deleted_event_record_id' },
    };
  });
  await eventsEndpointHandler({ method: 'DELETE' });

  expect(db.deleteAgendaEvent).toHaveBeenCalledTimes(1);
});

test('calls updateEvent on PUT request', async () => {
  db.updateAgendaEvent = jest.fn().mockImplementation(() => {
    return {
      status: 200,
      message: 'OK',
      data: { id: 'updated_event_record_id' },
    };
  });
  await eventsEndpointHandler({ method: 'PUT' });

  expect(db.updateAgendaEvent).toHaveBeenCalledTimes(1);
});
