import { validationService } from './validationService';

const invalidEventObjects = [
  {},
  { name: '  ' },
  { name: 'Event', end: {} },
  { name: 'Event', end: '1/2/2025' },
  { name: 'Event', end: new Date('1/2/2025') },
  { name: 'Event', end: new Date('1/2/2025'), state: {} },
  {
    name: 'Event',
    end: new Date('1/2/2025'),
    state: { disco: 'mainfocus', home: 'candidate' },
  },
  {
    name: 'Event',
    end: new Date('1/2/2025'),
    state: { home: 'sweet home!' },
  },
];

test.each(invalidEventObjects)(
  'returns false when receives %o',
  (newEventObject) => {
    expect(validationService.newEvent(newEventObject)).toBe(false);
  },
);
