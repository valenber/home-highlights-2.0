export type AgendaEvent = {
  id: string;
  name: string;
  start?: string;
  end: string;
  state: Partial<Record<AgendaEventCategory, AgendaEventStatus>>;
  tags?: string[] | null;
};

export type AgendaEventCategory =
  | 'current'
  | 'exhibitions'
  | 'theatreanddance'
  | 'music'
  | 'sports'
  | 'fairs'
  | 'events'
  | 'christmas';

export type AgendaEventStatus = 'candidate' | 'highlight' | 'mainfocus';

// this is an examle of a valid agenda event object
export const exampleAgendaEvent: AgendaEvent = {
  id: 'djwk2odim10dm20',
  name: 'PhotoEspaña 2020',
  start: '2020-01-26T00:00:00.000Z',
  end: '2020-04-26T00:00:00.000Z',
  state: {
    current: 'highlight',
    fairs: 'mainfocus',
  },
  tags: ['new'],
};
