import { firstEvent, secondEvent, thirdEvent } from 'mock-events';
import { eventsMatcher } from './eventsMatcher';

test('returns event with matching name', () => {
  const result = eventsMatcher([firstEvent, secondEvent, thirdEvent], 'three');

  expect(result).toEqual([{ id: '333', name: 'Event three' }]);
});

test('returns all events with matching name', () => {
  const result = eventsMatcher([secondEvent, thirdEvent], 'event');

  expect(result).toEqual([
    { id: '222', name: 'Event two' },
    { id: '333', name: 'Event three' },
  ]);
});

test('returns empty list when no matches found', () => {
  const result = eventsMatcher([secondEvent, thirdEvent], 'blip');

  expect(result).toEqual([]);
});

test('returns empty list when search is empty', () => {
  const result = eventsMatcher([secondEvent, thirdEvent], '');

  expect(result).toEqual([]);
});

test('returns empty list when search is shorter than 4 chars', () => {
  const result = eventsMatcher([firstEvent, thirdEvent], 'one');

  expect(result).toEqual([]);
});
