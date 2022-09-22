import {
  byEndDateOldToNew,
  byStartDateOldToNew,
  getFormattedEventDates,
} from './helpers';
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

describe('getFormattedEventDates', () => {
  test('returns formattted dates object', () => {
    const { startDate, endDate } = getFormattedEventDates(firstEvent);

    expect(startDate).toBe('26 Mar 2020');
    expect(endDate).toBe('26 Apr 2020');
  });

  test('returns same date if start is missing', () => {
    const { startDate, endDate } = getFormattedEventDates({
      ...firstEvent,
      start: '',
    });

    expect(startDate).toBe('26 Apr 2020');
    expect(endDate).toBe('26 Apr 2020');
  });
});
