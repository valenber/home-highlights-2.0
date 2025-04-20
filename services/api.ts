import fetch from 'isomorphic-unfetch';
import { AgendaEvent } from '../data/dbSchema';

const API_EVENTS_URL = '/api/v1/events';
export const API_EVENTS_URL_2 = '/api/v2/events';

interface ApiResponse {
  error: string | null;
}

export interface ApiGetEventsResponse extends ApiResponse {
  events: AgendaEvent[] | null;
}

export async function getAllApiEvents(): Promise<ApiGetEventsResponse> {
  try {
    const res = await fetch(API_EVENTS_URL);
    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const events = await res.json().then((json) => json.data);

    return { events, error: null };
  } catch (error) {
    return { error: error.message, events: null };
  }
}

export interface ApiUpdateEventResponse extends ApiResponse {
  event: AgendaEvent | null;
}

export async function updateEventProps(
  updateObject: Partial<AgendaEvent>,
): Promise<ApiUpdateEventResponse> {
  try {
    const res = await fetch(API_EVENTS_URL, {
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

export interface ApiCreateEventResponse extends ApiResponse {
  event: AgendaEvent | null;
}

export async function createNewEvent(
  newEventObject: Partial<AgendaEvent>,
): Promise<ApiCreateEventResponse> {
  try {
    const res = await fetch(API_EVENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEventObject),
    });

    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const createdEvent = await res.json().then((json) => json.data);

    return { event: createdEvent, error: null };
  } catch (error) {
    return { event: null, error: error.message };
  }
}

interface ApiDeleteEventResponse extends ApiResponse {
  event: string | null;
}

export async function deleteEvent(
  eventId: string,
): Promise<ApiDeleteEventResponse> {
  try {
    const res = await fetch(API_EVENTS_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: eventId }),
    });

    if (!res.ok) {
      throw new Error(`Bad server response - ${res.status}: ${res.statusText}`);
    }

    const deletedEvent = await res.json().then((json) => json.data);

    return { event: deletedEvent, error: null };
  } catch (error) {
    return { event: null, error: error.message };
  }
}
