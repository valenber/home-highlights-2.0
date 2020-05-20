import { MongoClient } from 'mongodb';

import { ApiResponse } from '../pages/api/events';
import { AgendaEvent } from './dbSchema';

const { MONGO_USER, MONGO_PASS, MONGO_URL_SUFFIX } = process.env;

const dbClient = new MongoClient(
  `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL_SUFFIX}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

async function getAllAgendaEvents(): Promise<AgendaEvent[]> {
  if (!dbClient.isConnected()) await dbClient.connect();

  const events: AgendaEvent[] = await dbClient
    .db('demo-home-highlights')
    .collection('events')
    .find({})
    .toArray();

  return events;
}

interface CreateNewAgendaEventResponse extends ApiResponse {
  data: {
    id?: string;
    providedObject?: Partial<AgendaEvent>;
  };
}

async function createNewAgendaEvent(
  newEventObject: Partial<AgendaEvent>,
): Promise<CreateNewAgendaEventResponse> {
  console.log(newEventObject);
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
