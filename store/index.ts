import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { eventsReducer } from './eventsSlice';
import { activeCategoryReducer } from './categorySlice';
import { editedEventReducer } from './editorSlice';

export const rootReducer = combineReducers({
  events: eventsReducer,
  activeCategory: activeCategoryReducer,
  editedEvent: editedEventReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

// this adds store-specific types to the useDispatch hook from react-redux
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
