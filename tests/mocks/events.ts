import { AgendaEvent } from '../../data/dbSchema';

export const firstEvent: AgendaEvent = {
  id: '111',
  name: 'Event one',
  start: '2020-03-26T00:00:00.000Z',
  end: '2020-04-26T00:00:00.000Z',
  state: {
    music: 'candidate',
  },
};

export const secondEvent: AgendaEvent = {
  id: '222',
  name: 'Event two',
  start: '2020-03-16T00:00:00.000Z',
  end: '2020-04-16T00:00:00.000Z',
  state: {
    music: 'highlight',
  },
};

export const thirdEvent: AgendaEvent = {
  id: '333',
  name: 'Event three',
  start: '2020-03-06T00:00:00.000Z',
  end: '2020-04-06T00:00:00.000Z',
  state: {
    music: 'highlight',
  },
};

export const fourthEvent: AgendaEvent = {
  id: '333',
  name: 'Event four',
  start: '2020-03-06T00:00:00.000Z',
  end: '2020-04-06T00:00:00.000Z',
  state: {
    music: 'candidate',
  },
};
