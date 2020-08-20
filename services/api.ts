import fetch from 'isomorphic-unfetch';
import { AgendaEvent } from '../data/dbSchema';

export interface ApiEventsResponse {
  events: AgendaEvent[] | null;
  error: string | null;
}

export async function getAllApiEvents(): Promise<ApiEventsResponse> {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const events = await res.json().then((json) => json.data);

    return { events, error: null };
  } catch (error) {
    console.log(error.code);
    return { error: error.message, events: null };
  }
}
