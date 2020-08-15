import { AppState } from '../index';
import { AgendaEvent } from '../../data/dbSchema';

export function getHighlightsForSelectedCategory(
  state: AppState,
): AgendaEvent[] {
  if (!state.events.selectedCategory) {
    throw new Error('No event category is selected');
  }

  return [];
}
