import { databaseService as db } from './databaseService';
import { validationService } from './validationService';

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
