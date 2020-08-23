import fetch from 'isomorphic-unfetch';
import { AgendaEvent } from '../data/dbSchema';

export interface ApiGetEventsResponse {
  events: AgendaEvent[] | null;
  error: string | null;
}

export async function getAllApiEvents(): Promise<ApiGetEventsResponse> {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const events = await res.json().then((json) => json.data);

    return { events, error: null };
  } catch (error) {
    return { error: error.message, events: null };
  }
}

export interface ApiUpdateEventResponse {
  event: AgendaEvent | null;
  error: string | null;
}

export async function updateEventProps(
  updateObject: Partial<AgendaEvent>,
): Promise<ApiUpdateEventResponse> {
  try {
    const res = await fetch('/api/events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateObject),
    });

    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const updatedEvent = await res.json().then((json) => json.data);

    return { event: updatedEvent, error: null };
  } catch (error) {
    return { event: null, error: error.message };
  }
}
