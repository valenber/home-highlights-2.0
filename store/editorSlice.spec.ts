import { editedEventReducer, selectEventToEdit } from './editorSlice';

describe('updates editedEvent value', () => {
  test('event from the list', () => {
    const newState = editedEventReducer(false, selectEventToEdit('id_string'));

    expect(newState).toBe('id_string');
  });

  test('new empty event', () => {
    const newState = editedEventReducer(false, selectEventToEdit(null));

    expect(newState).toBe(null);
  });

  test('nothing', () => {
    const newState = editedEventReducer(false, selectEventToEdit(false));

    expect(newState).toBe(false);
  });
});
