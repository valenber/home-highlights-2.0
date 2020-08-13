import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgendaEvent } from '../data/dbSchema';

const events = createSlice({
  name: 'events',
  initialState: [] as AgendaEvent[],
  reducers: {
    addEvent(state, action: PayloadAction<AgendaEvent>): void {
      state.push(action.payload);
    },

    addEventsList(state, action: PayloadAction<AgendaEvent[]>): AgendaEvent[] {
      return [...state, ...action.payload];
    },

    removeEventById(state, action: PayloadAction<string>): AgendaEvent[] {
      return state.filter((event) => event.id !== action.payload);
    },
  },
});

const { reducer } = events;

export { reducer as eventsReducer };
export const { addEvent, addEventsList, removeEventById } = events.actions;
