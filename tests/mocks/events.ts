import { AgendaEvent } from '../../data/dbSchema';

export const firstEvent: AgendaEvent = {
  id: '111',
  name: 'Event one',
  end: new Date(),
  state: {
    music: 'candidate',
  },
};

export const secondEvent: AgendaEvent = {
  id: '222',
  name: 'Event two',
  end: new Date(),
  state: {
    music: 'highlight',
  },
};
