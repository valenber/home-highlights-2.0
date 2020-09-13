import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorSlice = string | null | false;

const editedEvent = createSlice({
  name: 'eventToEdit',
  initialState: false as EditorSlice,
  reducers: {
    selectEventToEdit(_state, action: PayloadAction<EditorSlice>): EditorSlice {
      return action.payload;
    },
  },
});

const { reducer } = editedEvent;

export { reducer as editedEventReducer };
export const { selectEventToEdit } = editedEvent.actions;
