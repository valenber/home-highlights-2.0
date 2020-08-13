import { eventsReducer } from './eventsSlice';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

export const rootReducer = combineReducers({
  events: eventsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
});

// this adds store-specific types to the useDispatch hook from react-redux
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
