import { ApiResponse } from '../pages/api/events';
import { AgendaEvent } from './dbSchema';
import faunadb, { Client } from 'faunadb';

let dbClient: Client | null = null;
const targetCollection = 'testAgendaEvents';

function extractRefString(ref: string): string {
  return ref.toString().split('"')[3];
}

function getDB(): [Client, typeof faunadb.query] {
  if(!dbClient) {
    dbClient = new faunadb.Client({secret: process.env.FAUNA_DB_KEY});
  }

  const query = faunadb.query;

  return [ dbClient, query ];
}

async function getAllAgendaEvents(): Promise<AgendaEvent[]> {

  const [client, q] = getDB();

  const { data } = await client.query(q.Map(
    q.Paginate(q.Match(q.Index('all_events'))),
    q.Lambda('X', q.Get(q.Var('X')))
  ));

  interface FdbEvent {
    data: AgendaEvent;
  }

  return data.map((event: FdbEvent) => event.data);
};

interface CreateNewAgendaEventResponse extends ApiResponse {
  data: {
    id?: string;
    providedObject?: Partial<AgendaEvent>;
  };
}

async function createNewAgendaEvent(
  newEventObject: Partial<AgendaEvent>,
): Promise<CreateNewAgendaEventResponse> {
  const [client, q] = getDB();
  const {name, end, state} = newEventObject;

  const {ref} = await client.query(
    q.Create(
      q.Collection(targetCollection), {
        data: { name, end, state },
      },)
  );
  const newRecordRef: string = extractRefString(ref);

  return { status: 200, message: 'OK', data: { id: newRecordRef } };
}

async function deleteAgendaEvent(id: string): Promise<ApiResponse> {
  const [client, q] = getDB();
  const {ref} = await client.query(q.Delete(
    q.Ref(q.Collection(targetCollection), id)
  ));

  const deletedRecordRef: string = extractRefString(ref);

  return {
    status: 200,
    message: 'OK',
    data: deletedRecordRef,
  };
}

async function updateAgendaEvent(
  eventObject: Partial<AgendaEvent>,
): Promise<ApiResponse> {
  const { id } = eventObject;
  delete eventObject.id;

  const [client, q] = getDB();

  const { ref } = await client.query(
    q.Update(
      q.Ref(q.Collection(targetCollection, id)),
      eventObject
    )
  );

  const updatedRecordRef: string = extractRefString(ref);

  return {
    status: 200,
    message: 'OK',
    data: { id: updatedRecordRef},
  };
}

export const databaseService = {
  getAllAgendaEvents,
  createNewAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
};
