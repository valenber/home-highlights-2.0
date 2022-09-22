import { AgendaEvent } from 'data/dbSchema';

export interface SearchResult {
  id: AgendaEvent['id'];
  name: AgendaEvent['name'];
}

export function eventsMatcher(
  events: AgendaEvent[],
  searchTerm: string,
): SearchResult[] {
  const term = searchTerm.trim().toLowerCase();

  if (term.length < 4) {
    return [];
  }
  return events
    .filter((event) => event.name.trim().toLowerCase().includes(term))
    .map((event) => ({ id: event.id, name: event.name }));
}
