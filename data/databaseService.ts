import { ApiResponse } from '../pages/api/events';

function getAllAgendaEvents(): ApiResponse {
  return { status: 200, message: 'OK', data: {} };
}

function createNewAgendaEvent(): ApiResponse {
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
