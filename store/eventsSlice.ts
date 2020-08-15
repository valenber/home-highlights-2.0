import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgendaEvent, AgendaEventCategory } from '../data/dbSchema';

export interface EventsSlice {
  list: AgendaEvent[];
  selectedCategory: AgendaEventCategory;
}

export const initialState: EventsSlice = {
  list: [],
  selectedCategory: 'home',
};

const events = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent(state, action: PayloadAction<AgendaEvent>): void {
      state.list.push(action.payload);
    },

    addEventsList(state, action: PayloadAction<AgendaEvent[]>): EventsSlice {
      return { ...state, list: [...state.list, ...action.payload] };
    },

    removeEventById(state, action: PayloadAction<string>): EventsSlice {
      return {
        ...state,
        list: state.list.filter((event) => event.id !== action.payload),
      };
    },

    selectEventCategory(
      state,
      action: PayloadAction<AgendaEventCategory>,
    ): void {
      state.selectedCategory = action.payload;
    },
  },
});

const { reducer } = events;

export { reducer as eventsReducer };
export const {
  addEvent,
  addEventsList,
  removeEventById,
  selectEventCategory,
} = events.actions;
