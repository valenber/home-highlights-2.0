import { AgendaEvent } from '../data/dbSchema';
import { eventsReducer, addOne, removeById, addMultiple } from './eventsSlice';

const firstEvent: AgendaEvent = {
  id: '111',
  name: 'Event one',
  end: new Date(),
  state: {
    music: 'candidate',
  },
};

const secondEvent: AgendaEvent = {
  id: '222',
  name: 'Event two',
  end: new Date(),
  state: {
    music: 'highlight',
  },
};

describe('reducers', () => {
  test('add single event', () => {
    const newState = eventsReducer([firstEvent], addOne(secondEvent));

    expect(newState).toEqual([firstEvent, secondEvent]);
  });

  test('add multiple events', () => {
    const newState = eventsReducer([], addMultiple([secondEvent, firstEvent]));
    expect(newState).toEqual([secondEvent, firstEvent]);
  });

  test('remove single event by Id', () => {
    const newState = eventsReducer(
      [firstEvent, secondEvent],
      removeById('111'),
    );

    expect(newState).toEqual([secondEvent]);
  });
});
