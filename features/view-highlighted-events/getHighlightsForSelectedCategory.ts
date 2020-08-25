import { AppState } from '../../store/';
import { AgendaEvent } from '../../data/dbSchema';

export function getHighlightsForSelectedCategory(
  state: AppState,
): AgendaEvent[] {
  const { activeCategory } = state;

  return state.events.filter((event: AgendaEvent) => {
    return (
      Object.keys(event.state).includes(activeCategory) &&
      event.state[activeCategory] !== 'candidate'
    );
  });
}
