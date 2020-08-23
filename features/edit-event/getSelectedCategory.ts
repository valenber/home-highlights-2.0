import { AppState } from '../../store/';
import { AgendaEventCategory } from '../../data/dbSchema';

export function getSelectedCategory(state: AppState): AgendaEventCategory {
  return state.events.selectedCategory;
}
