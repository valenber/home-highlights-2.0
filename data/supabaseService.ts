import { createClient } from '@/utils/supabase/server';
import { AgendaEvent } from './dbSchema';

// Table name in Supabase
const eventsTable = 'agenda_events';

async function getAllAgendaEvents(): Promise<AgendaEvent[]> {
  const supabaseClient = await createClient();
  const { data, error } = await supabaseClient.from(eventsTable).select('*');

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  return data.map(({ start_date, end_date, ...rest }) => ({
    ...rest,
    start: start_date,
    end: end_date,
  })) as AgendaEvent[];
}

async function createNewAgendaEvent(
  event: Partial<AgendaEvent>,
): Promise<AgendaEvent> {
  const supabaseClient = await createClient();
  // Transform the event object to match database schema (start → start_date, end → end_date)
  const { start, end, ...restEventData } = event;
  const dbEvent = {
    ...restEventData,
    start_date: start.length ? start : null,
    end_date: end,
  };

  const { data, error } = await supabaseClient
    .from(eventsTable)
    .insert(dbEvent)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  // Transform the response back to the application schema
  const { start_date, end_date, ...rest } = data;
  return {
    ...rest,
    start: start_date,
    end: end_date,
  } as AgendaEvent;
}

async function updateAgendaEvent(
  id: string,
  event: Partial<AgendaEvent>,
): Promise<AgendaEvent> {
  const supabaseClient = await createClient();
  // Transform the event object to match database schema (start → start_date, end → end_date)
  const { start, end, ...restEventData } = event;

  // Build the update object, only including fields that are provided
  const dbEvent: Record<string, unknown> = { ...restEventData };
  if (start !== undefined) dbEvent.start_date = start;
  if (end !== undefined) dbEvent.end_date = end;

  const { data, error } = await supabaseClient
    .from(eventsTable)
    .update(dbEvent)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  // Transform the response back to the application schema
  const { start_date, end_date, ...rest } = data;
  return {
    ...rest,
    start: start_date,
    end: end_date,
  } as AgendaEvent;
}

async function deleteAgendaEvent(id: string): Promise<string> {
  const supabaseClient = await createClient();
  const { error } = await supabaseClient
    .from(eventsTable)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }

  return id;
}

export const supabaseService = {
  // Database operations
  getAllAgendaEvents,
  createNewAgendaEvent,
  updateAgendaEvent,
  deleteAgendaEvent,
};
