import { AgendaEvent } from './dbSchema';

// createNewAgendaEvent validation
export function validNewEvent(eventObject: Partial<AgendaEvent>) {
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
