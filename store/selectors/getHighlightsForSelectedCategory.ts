import { AppState } from '../index';
import { AgendaEvent } from '../../data/dbSchema';

export function getHighlightsForSelectedCategory(
  state: AppState,
): AgendaEvent[] {
  const { selectedCategory } = state.events;

  return state.events.list.filter((event: AgendaEvent) => {
    return (
      Object.keys(event.state).includes(selectedCategory) &&
      event.state[selectedCategory] !== 'candidate'
    );
  });
}
