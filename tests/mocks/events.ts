import { AgendaEvent } from '../../data/dbSchema';

export const firstEvent: AgendaEvent = {
  id: '111',
  name: 'Event one',
  end: '2020-04-26T00:00:00.000Z',
  state: {
    music: 'candidate',
  },
};

export const secondEvent: AgendaEvent = {
  id: '222',
  name: 'Event two',
  end: '2020-04-16T00:00:00.000Z',
  state: {
    music: 'highlight',
  },
};

export const thirdEvent: AgendaEvent = {
  id: '333',
  name: 'Event three',
  end: '2020-04-06T00:00:00.000Z',
  state: {
    music: 'highlight',
  },
};
