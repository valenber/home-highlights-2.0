type FixMeLater = any;

const _db_name = process.env.UNBOUNDED_DB_NAME;

type getAllEventsRes = {
  status: 200 | 204;
  list: Array<any>;
};

async function getAllAgendaEvents(
  client: FixMeLater,
): Promise<getAllEventsRes> {
  const getRes = await client
    .database(_db_name)
    .query()
    .match({})
    .send();

  const statusCode = getRes.length ? 200 : 204;

  return { status: statusCode, list: [...getRes] };
}

async function createNewAgendaEvent(client, eventObject) {
  return null;
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
  deleteAgendaEvent,
  updateAgendaEvent,
};
