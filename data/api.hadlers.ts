// here we define methods that process calls to the DB
import Events, { AgendaEvent } from './db_model.events';

type dbResponse = {
  status: number;
  message: string;
};
export function getAllEvents() {}

export async function createNewEvent(
  eventData: AgendaEvent,
): Promise<dbResponse> {
  const { name, start } = eventData;
  const newEvent = {
    name,
    start: start ? start : '18/08/1981',
  };
  try {
    const dbDoc = await Events.create(newEvent);
    return {
      status: 200,
      message: dbDoc._id,
    };
  } catch (err) {
    return {
      status: 500,
      message: 'not ok',
    };
  }
}

export function deleteEvent({ id }) {}

export function updateEvent({ id }) {}
