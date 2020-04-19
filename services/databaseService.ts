type FixMeLater = any;

const _db_name = process.env.UNBOUNDED_DB_NAME;

type getAllEventsRes = {
  status: 200 | 404;
  list?: Array<any>;
  message?: string;
};

async function getAllAgendaEvents(
  client: FixMeLater,
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

async function createNewAgendaEvent(client, eventObject) {
  // await client.database(_db_name).add({
  //   name: 'Sabina Concert',
  //   starts: '11/09/2020',
  // });

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
