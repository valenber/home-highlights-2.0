import { createClient } from '@supabase/supabase-js';
import { AgendaEvent } from './dbSchema';

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Table name in Supabase
const eventsTable = 'agenda_events';

// Create a supabase client for the entire app
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function getAllAgendaEvents(): Promise<AgendaEvent[]> {
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

export const supabaseService = {
  getAllAgendaEvents,
};
