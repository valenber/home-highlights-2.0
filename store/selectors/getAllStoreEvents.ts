import { AppState } from '../index';
import { AgendaEvent } from '../../data/dbSchema';

export function getAllStoreEvents(state: AppState): AgendaEvent[] {
  return state.events;
}
