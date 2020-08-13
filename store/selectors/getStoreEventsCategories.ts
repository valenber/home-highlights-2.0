import { AppState } from '../index';

export function getStoreEventsCategories(state: AppState): string[] {
  const allStates = state.events.reduce((acc, event) => {
    return { ...acc, ...event.state };
  }, {});

  return Object.keys(allStates);
}
