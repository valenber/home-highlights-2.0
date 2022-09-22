import { AgendaEvent } from 'data/dbSchema';

export interface SearchResult {
  id: AgendaEvent['id'];
  name: AgendaEvent['name'];
}

export function eventsMatcher(
  events: AgendaEvent[],
  searchTerm: string,
): SearchResult[] {
  if (!searchTerm.length) {
    return [];
  }
  return events
    .filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((event) => ({ id: event.id, name: event.name }));
}
