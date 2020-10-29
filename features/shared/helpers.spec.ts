import { byEndDateOldToNew, byStartDateOldToNew } from './helpers';
import { firstEvent, secondEvent, thirdEvent } from '../../tests/mocks/events';
import { AgendaEvent } from '../../data/dbSchema';

test('sorts events by end date oldest to newest', () => {
  const input: AgendaEvent[] = [firstEvent, secondEvent, thirdEvent];

  const result = input.sort(byEndDateOldToNew);

  expect(result).toEqual([thirdEvent, secondEvent, firstEvent]);
});

test('sorts events by start date oldest to newest', () => {
  const input: AgendaEvent[] = [firstEvent, secondEvent, thirdEvent];

  const result = input.sort(byStartDateOldToNew);

  expect(result).toEqual([thirdEvent, secondEvent, firstEvent]);
});
