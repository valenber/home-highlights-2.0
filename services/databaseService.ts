import { AgendaEvent } from './dbSchema';

type dbClient = any;

const _db_name = process.env.UNBOUNDED_DB_NAME;

type getAllEventsRes = {
  status: 200 | 404;
  list?: Array<any>;
  message?: string;
};

async function getAllAgendaEvents(client: dbClient): Promise<getAllEventsRes> {
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

async function createNewAgendaEvent(
  client: dbClient,
  newEventObject: AgendaEvent,
) {
  if (!validNewEvent(newEventObject)) {
    return { status: 400, message: 'Invalid new AgendaEvent' };
  }
  // const postRes = await client.database(_db_name).add(newEventObject);

  return null;
}
// createNewAgendaEvent validation
function validNewEvent(eventObject: Partial<AgendaEvent>) {
  // event must have:
  // a NAME,
  if (
    // typeof eventObject.name === 'undefined' ||
    !eventObject.hasOwnProperty('name') ||
    eventObject.name.trim().length <= 0
  ) {
    return false;
  }

  // END DATE
  if (!(eventObject.end instanceof Date)) {
    return false;
  }

  // non-empty STATE
  if (!eventObject.hasOwnProperty('state')) {
    return false;
  }

  return true;
}

async function deleteAgendaEvent(client, eventId: string) {
  return null;
}

async function updateAgendaEvent(client, eventId: string, payload: {}) {
  return null;
}

export default {
  getAllAgendaEvents,
  createNewAgendaEvent,
  validNewEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
};
