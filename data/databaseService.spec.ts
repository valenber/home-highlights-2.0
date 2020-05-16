import { databaseService as db } from './databaseService';
import { validationService } from './validationService';
import { MongoClient } from 'mongodb';
import { mockMongoClient } from './mockMongoClient';

describe('getAllAgendaEvents', () => {
  test('checks that the client is connected', async () => {
    const client = mockMongoClient();
    await db.getAllAgendaEvents(client as MongoClient);
    expect(client.isConnected).toHaveBeenCalledTimes(1);
  });

  test('returns data received from DB', async () => {
    const client = mockMongoClient();
    const response = await db.getAllAgendaEvents(client as MongoClient);

    expect(response).toEqual({
      status: 200,
      message: 'OK',
      data: { events: [{ id: '1', name: 'event' }] },
    });
  });

  test.todo('returns error if DB does not reply');
});
test('createNewAgendaEvent calls validation method', () => {
  validationService.newEvent = jest.fn().mockImplementation(() => true);

  db.createNewAgendaEvent({});
  expect(validationService.newEvent).toHaveBeenCalledTimes(1);
});

test('deleteAgendaEvent returns error if ID is not provided', () => {
  const response = db.deleteAgendaEvent('  ');

  expect(response.status).toBe(422);
  expect(response.message).toBe('Missing event ID');
});

test('updateAgendaEvent returns error if ID is not provided', () => {
  const response = db.updateAgendaEvent({ name: 'Other Event' });

  expect(response.status).toBe(422);
  expect(response.message).toBe('Missing event ID');
});
test('updateAgendaEvent returns error if no updatable properties are provided', () => {
  const response = db.updateAgendaEvent({ id: 'event_to_edit_id' });

  expect(response.status).toBe(422);
  expect(response.message).toBe('No properties to update');
});
