import { validationService } from './validationService';

import { ApiResponse } from '../pages/api/events';
import { AgendaEvent } from './dbSchema';

import { MongoClient } from 'mongodb';

interface AllAgendaEventsResponse extends ApiResponse {
  data: {
    events: AgendaEvent[];
  };
}

const { MONGO_USER, MONGO_PASS, MONGO_URL_SUFFIX } = process.env;

const client = new MongoClient(
  `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_URL_SUFFIX}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

async function getAllAgendaEvents(): Promise<AllAgendaEventsResponse> {
  if (!client.isConnected()) await client.connect();

  const events = await client
    .db('demo-home-highlights')
    .collection('events')
    .find({})
    .toArray();

  console.log(events.length);

  return { status: 200, message: 'OK', data: { events: [] } };
}

interface CreateNewAgendaEventResponse extends ApiResponse {
  data: {
    id?: string;
    providedObject?: Partial<AgendaEvent>;
  };
}

function createNewAgendaEvent(
  newEventObject: Partial<AgendaEvent>,
): CreateNewAgendaEventResponse {
  if (!validationService.newEvent(newEventObject)) {
    return {
      status: 422,
      message: 'Invalid new event object',
      data: { providedObject: newEventObject },
    };
  }
  // TODO: talk to the database
  return { status: 200, message: 'OK', data: { id: 'new_event_record_id' } };
}

function deleteAgendaEvent(id: string): ApiResponse {
  if (typeof id === 'undefined' || !id.trim().length)
    return {
      status: 422,
      message: 'Missing event ID',
    };

  return {
    status: 200,
    message: 'OK',
    data: { id: 'deleted_event_record_id' },
  };
}

function updateAgendaEvent(eventObject: Partial<AgendaEvent>): ApiResponse {
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
