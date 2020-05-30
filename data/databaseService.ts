import { ApiResponse } from '../pages/api/events';
import { AgendaEvent } from './dbSchema';
import faunadb, { Client } from 'faunadb';

let dbClient: Client | null = null;

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
  console.log('got new object', newEventObject);
  // TODO: talk to the database
  return { status: 200, message: 'OK', data: { id: 'new_event_record_id' } };
}

async function deleteAgendaEvent(id: string): Promise<ApiResponse> {
  return {
    status: 200,
    message: 'OK',
    data: id,
  };
}

async function updateAgendaEvent(
  eventObject: Partial<AgendaEvent>,
): Promise<ApiResponse> {
  const { id } = eventObject;

  // no ID is provided
  if (typeof id === 'undefined' || !id.trim().length)
    return {
      status: 422,
      message: 'Missing event ID',
    };

  // only ID is provided
  if (Object.keys(eventObject).length === 1) {
    return {
      status: 422,
      message: 'No properties to update',
    };
  }
  return {
    status: 200,
    message: 'OK',
    data: { id: 'updated_event_record_id' },
  };
}

export const databaseService = {
  getAllAgendaEvents,
  createNewAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
};
