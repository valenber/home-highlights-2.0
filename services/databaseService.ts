import { AgendaEvent } from './dbSchema';
import { validNewEvent } from './dbValidaton';

type dbClient = any;

const _db_name = process.env.UNBOUNDED_DB_NAME;

type getAllEventsRes = {
  status: 200 | 404;
  list?: Array<any>;
  message?: string;
};

export async function getAllAgendaEvents(
  client: dbClient,
): Promise<getAllEventsRes> {
  const getRes = await client
    .database(_db_name)
    .query()
    .match({})
    .send();

  if (!getRes.length) {
    return { status: 404, message: 'Database has no records' };
  }

  return { status: 200, list: [...getRes] };
}

export async function createNewAgendaEvent(
  client: dbClient,
  newEventObject: Partial<AgendaEvent>,
) {
  if (!validNewEvent(newEventObject)) {
    return { status: 400, message: 'Invalid new AgendaEvent' };
  }
  // const postRes = await client.database(_db_name).add(newEventObject);

  return { status: 200, message: 'OK', id: 'newRecordId' };
}

export async function deleteAgendaEvent(client, eventId: string) {
  return null;
}

export async function updateAgendaEvent(client, eventId: string, payload: {}) {
  return null;
}
