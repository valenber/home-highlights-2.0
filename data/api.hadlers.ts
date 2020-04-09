// here we define methods that process calls to the DB
import Events, { AgendaEvent } from './db_model.events';

type dbResponse = {
  status: number;
  message: string;
  documents: any;
};

const databaseResponse: dbResponse = {
  status: null,
  message: null,
  documents: '',
};

export async function getAllEvents(): Promise<dbResponse> {
  try {
    const dbDocList = await Events.find({});
    databaseResponse.status = 200;
    databaseResponse.documents = dbDocList;
  } catch (err) {
    databaseResponse.status = 503;
    databaseResponse.message = 'can not read from DB';
  }
  return databaseResponse;
}

export async function createNewEvent(
  eventData: AgendaEvent,
): Promise<dbResponse> {
  const { name, start } = eventData;
  const newEvent = {
    name: name ? name : 'NO_NAME',
    start: start ? start : '18/08/1981',
  };
  try {
    const dbDoc = await Events.create(newEvent);
    databaseResponse.status = 200;
    databaseResponse.message = dbDoc._id;
  } catch (err) {
    databaseResponse.status = 503;
    databaseResponse.message = 'can not write to DB';
  }
  return databaseResponse;
}

export function deleteEvent({ id }) {}

export function updateEvent({ id }) {}
