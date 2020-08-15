import {
  eventsReducer,
  addEvent,
  addEventsList,
  removeEventById,
  initialState,
  selectEventCategory,
} from './eventsSlice';
import { secondEvent, firstEvent } from '../tests/mocks/events';

describe('reducers', () => {
  test('add single event', () => {
    const newState = eventsReducer(
      { ...initialState, list: [firstEvent] },
      addEvent(secondEvent),
    );

    expect(newState).toEqual({
      ...initialState,
      list: [firstEvent, secondEvent],
    });
  });

  test('add multiple events', () => {
    const newState = eventsReducer(
      { ...initialState, list: [firstEvent] },
      addEventsList([secondEvent, firstEvent]),
    );
    expect(newState).toEqual({
      ...initialState,
      list: [firstEvent, secondEvent, firstEvent],
    });
  });

  test('remove single event by Id', () => {
    const newState = eventsReducer(
      { ...initialState, list: [firstEvent, secondEvent] },
      removeEventById('111'),
    );

    expect(newState).toEqual({ ...initialState, list: [secondEvent] });
  });

  test('select event category', () => {
    const newState = eventsReducer(initialState, selectEventCategory('fairs'));

    expect(newState.selectedCategory).toBe('fairs');
  });

  test('unselect event category', () => {
    const newState = eventsReducer(initialState, selectEventCategory(null));

    expect(newState.selectedCategory).toBe(null);
  });
});
