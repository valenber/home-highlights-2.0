import { validationService } from './validationService';

import { ApiResponse } from '../pages/api/events';
import { AgendaEvent } from './dbSchema';

interface AllAgendaEventsResponse extends ApiResponse {
  data: {
    events: AgendaEvent[];
  };
}

function getAllAgendaEvents(): AllAgendaEventsResponse {
  return { status: 200, message: 'OK', data: { events: [] } };
}

// type NewEventObject = Pick<AgendaEvent, 'name' | 'end' | 'state'>;

function createNewAgendaEvent(): ApiResponse {
  if (!validationService.newEvent({})) {
    return {
      status: 422,
      message: 'Invalid new event object',
      data: { id: 'provided_object' },
    };
  }
  return { status: 200, message: 'OK', data: { id: 'new_event_record_id' } };
}

function deleteAgendaEvent(): ApiResponse {
  return {
    status: 200,
    message: 'OK',
    data: { id: 'deleted_event_record_id' },
  };
}

function updateAgendaEvent(): ApiResponse {
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
