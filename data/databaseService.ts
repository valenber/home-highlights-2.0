/* eslint-disable @typescript-eslint/camelcase */
import { AgendaEvent } from './dbSchema';
import faunadb, { Client } from 'faunadb';

let dbClient: Client | null = null;
const targetCollection = process.env.FAUNA_DB_COLLECTION;

function extractRefString(ref: string): string {
  return ref.toString().split('"')[3];
}

function getDB(): [Client, typeof faunadb.query] {
  if (!dbClient) {
    dbClient = new faunadb.Client({ secret: process.env.FAUNA_DB_KEY });
  }

  const query = faunadb.query;

  return [dbClient, query];
}

async function getAllAgendaEvents(): Promise<AgendaEvent[]> {
  const [client, q] = getDB();

  const { data } = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection(targetCollection)), { size: 600 }),
      q.Lambda((x) => q.Get(x)),
    ),
  );

  interface FdbEvent {
    data: AgendaEvent;
    ref: string;
  }

  return data.map((event: FdbEvent) => ({
    ...event.data,
    id: extractRefString(event.ref),
  }));
}

async function createNewAgendaEvent(
  newEventPayload: Partial<AgendaEvent> | string,
): Promise<Partial<AgendaEvent>> {
  const newEventObject =
    typeof newEventPayload === 'string'
      ? JSON.parse(newEventPayload)
      : newEventPayload;

  const [client, q] = getDB();
  const { name, start, end, state, last_update } = newEventObject;

  interface FaunaDbRecord {
    data: Partial<AgendaEvent>;
    ref: string;
  }

  const newEventDbRecord: FaunaDbRecord = await client.query(
    q.Create(q.Collection(targetCollection), {
      data: { name, start, end, state, last_update },
    }),
  );
  const newRecordRef: string = extractRefString(newEventDbRecord.ref);
  const newEvent = { ...newEventDbRecord.data, id: newRecordRef };

  return newEvent;
}

async function deleteAgendaEvent(id: string): Promise<string> {
  const [client, q] = getDB();
  const { ref } = await client.query(
    q.Delete(q.Ref(q.Collection(targetCollection), id)),
  );

  const deletedRecordRef: string = extractRefString(ref);

  return deletedRecordRef;
}

async function updateAgendaEvent(
  eventObject: Partial<AgendaEvent>,
): Promise<AgendaEvent> {
  const { id } = eventObject;
  delete eventObject.id;

  const [client, q] = getDB();

  const { ref, data } = await client.query(
    q.Update(q.Ref(q.Collection(targetCollection), id), { data: eventObject }),
  );

  const updatedRecordRef: string = extractRefString(ref);

  return { ...data, id: updatedRecordRef };
}

export const databaseService = {
  getAllAgendaEvents,
  createNewAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
};
