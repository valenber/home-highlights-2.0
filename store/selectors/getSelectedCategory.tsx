import { AgendaEventCategory } from '../../data/dbSchema';
import { AppState } from '../index';

export function getSelectedCategory(state: AppState): AgendaEventCategory {
  return state.activeCategory;
}
