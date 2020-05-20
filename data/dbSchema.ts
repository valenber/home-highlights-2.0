export type AgendaEvent = {
  id: string;
  name: string;
  start?: Date;
  end: Date;
  state: AgendaEventState;
};

type AgendaEventState = {
  [category in AgendaEventCategory]?: AgendaEventStatus;
};

type AgendaEventCategory =
  | 'home'
  | 'current'
  | 'exhibitions'
  | 'theatreanddance'
  | 'music'
  | 'sports'
  | 'fairs'
  | 'events'
  | 'christmas';

type AgendaEventStatus = 'candidate' | 'highlight' | 'mainfocus';

// this is an examle of a valid agenda event object
export const exampleAgendaEvent: AgendaEvent = {
  id: 'djwk2odim10dm20',
  name: 'PhotoEspaña 2020',
  start: new Date('1/4/2020'),
  end: new Date('24/5/2020'),
  state: {
    home: 'candidate',
    current: 'highlight',
    fairs: 'mainfocus',
  },
};
