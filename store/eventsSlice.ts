import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgendaEvent } from '../data/dbSchema';

export type EventsSlice = AgendaEvent[] | null;

const events = createSlice({
  name: 'events',
  initialState: null,
  reducers: {
    addEvent(state, action: PayloadAction<AgendaEvent>): void {
      state.push(action.payload);
    },

    addEventsList(state, action: PayloadAction<AgendaEvent[]>): EventsSlice {
      const { payload } = action;

      return payload ? [...payload] : state;
    },

    removeEventById(state, action: PayloadAction<string>): EventsSlice {
      return state.filter((event: AgendaEvent) => event.id !== action.payload);
    },

    patchEvent(state, action: PayloadAction<AgendaEvent>): EventsSlice {
      const { payload } = action;
      return state.map((event: AgendaEvent) =>
        event.id === payload.id ? payload : event,
      );
    },
  },
});

const { reducer } = events;

export { reducer as eventsReducer };
export const {
  addEvent,
  addEventsList,
  removeEventById,
  patchEvent,
} = events.actions;
