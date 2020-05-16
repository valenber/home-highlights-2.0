import { databaseService as db } from './databaseService';
import { validationService } from './validationService';

test('createNewAgendaEvent calls validation method', () => {
  validationService.newEvent = jest.fn().mockImplementation(() => true);

  db.createNewAgendaEvent();
  expect(validationService.newEvent).toHaveBeenCalledTimes(1);
});
