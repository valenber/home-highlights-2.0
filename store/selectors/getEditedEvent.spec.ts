import { getEditedEvent } from './getEditedEvent';
import { AppState } from '..';
import { exampleAgendaEvent, AgendaEvent } from '../../data/dbSchema';

const mockState: AppState = {
  events: [exampleAgendaEvent],
  activeCategory: 'home',
  editedEvent: false,
};

test('return false when there is no event', () => {
  const result = getEditedEvent(mockState);

  expect(result).toEqual(false);
});

test('returns event when an existing event is edited', () => {
  const state = { ...mockState, editedEvent: exampleAgendaEvent.id };
  const result = getEditedEvent(state);

  expect(result).toEqual(exampleAgendaEvent);
});

test('throws when no event in store corresponds to the id', () => {
  const state = { ...mockState, editedEvent: 'invalid_id_string' };

  expect(() => {
    getEditedEvent(state);
  }).toThrow('there is no event with the id marked for editing');
});

test('returns event scaffold when null is in store', () => {
  const state = { ...mockState, editedEvent: null };
  const eventScaffold: Partial<AgendaEvent> = {
    name: '',
    start: '',
    end: '',
    state: {
      home: 'candidate',
    },
  };
  const result = getEditedEvent(state);

  expect(result).toEqual(eventScaffold);
});
