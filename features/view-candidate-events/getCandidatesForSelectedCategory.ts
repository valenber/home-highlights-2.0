import { AppState } from '../../store/';
import { AgendaEvent } from '../../data/dbSchema';

export function getCandidatesForSelectedCategory(
  state: AppState,
): AgendaEvent[] {
  const { selectedCategory } = state.events;

  return state.events.list.filter((event: AgendaEvent) => {
    return (
      Object.keys(event.state).includes(selectedCategory) &&
      event.state[selectedCategory] === 'candidate'
    );
  });
}
