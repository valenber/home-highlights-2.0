import {
  eventsReducer,
  addEvent,
  addEventsList,
  removeEventById,
  patchEvent,
} from './eventsSlice';
import { secondEvent, firstEvent } from '../tests/mocks/events';

describe('reducers', () => {
  test('add single event', () => {
    const newState = eventsReducer([firstEvent], addEvent(secondEvent));

    expect(newState).toEqual([firstEvent, secondEvent]);
  });

  test('add multiple events', () => {
    const newState = eventsReducer(
      null,
      addEventsList([secondEvent, firstEvent]),
    );
    expect(newState).toEqual([secondEvent, firstEvent]);
  });

  test('remove single event by Id', () => {
    const newState = eventsReducer(
      [firstEvent, secondEvent],
      removeEventById('111'),
    );

    expect(newState).toEqual([secondEvent]);
  });

  test('update event props by id', () => {
    const updatedEvent = { ...firstEvent, name: 'Event twenty one' };
    const newState = eventsReducer(
      [firstEvent, secondEvent],
      patchEvent(updatedEvent),
    );
    expect(newState).toEqual([updatedEvent, secondEvent]);
  });
});
