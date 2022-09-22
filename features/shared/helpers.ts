import { AgendaEvent } from '../../data/dbSchema';

export const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function getFormattedEventDates(event: AgendaEvent): {
  startDate: string;
  endDate: string;
} {
  try {
    const startDate = dateFormat.format(new Date(event.start));
    const endDate = dateFormat.format(new Date(event.end));
    return { startDate, endDate };
  } catch (error) {
    console.error('Failed to parse event dates', error);
    console.dir(event);
  }
}

export function byEndDateOldToNew(
  eventA: AgendaEvent,
  eventB: AgendaEvent,
): number {
  let result = 0;

  const { end: endA } = eventA;
  const { end: endB } = eventB;

  if (endA > endB) {
    result = 1;
  } else if (endB > endA) {
    result = -1;
  }

  return result;
}

export function byStartDateOldToNew(
  eventA: AgendaEvent,
  eventB: AgendaEvent,
): number {
  let result = 0;

  const { start: startA } = eventA;
  const { start: startB } = eventB;

  if (startA > startB) {
    result = 1;
  } else if (startB > startA) {
    result = -1;
  }

  return result;
}
