import { AppState } from '../index';
import { AgendaEvent, AgendaEventCategory } from '../../data/dbSchema';

export const getEventsByCategory = (category: AgendaEventCategory) => {
  return (state: AppState): AgendaEvent[] => {
    return state.events.reduce((acc, event) => {
      if (event.state && Object.keys(event.state).includes(category)) {
        acc.push(event);
      }
      return acc;
    }, []);
  };
};
