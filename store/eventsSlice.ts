import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgendaEvent } from '../data/dbSchema';

const events = createSlice({
  name: 'events',
  initialState: [] as AgendaEvent[],
  reducers: {
    addOne(state, action: PayloadAction<AgendaEvent>): void {
      state.push(action.payload);
    },

    addMultiple(state, action: PayloadAction<AgendaEvent[]>): AgendaEvent[] {
      return [...state, ...action.payload];
    },

    removeById(state, action: PayloadAction<string>): AgendaEvent[] {
      return state.filter((event) => event.id !== action.payload);
    },
  },
});

const { reducer } = events;

export { reducer as eventsReducer };
export const { addOne, addMultiple, removeById } = events.actions;
