import { validationService } from './validationService';

describe('newEvent', () => {
  const invalidEventObjects = [
    {},
    { name: '  ' },
    { name: 'Event' },
    { name: 'Event', end: {} },
    { name: 'Event', end: '01/2/2025' },
    // { name: 'Event', end: new Date('1/2/2025') },
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

  test('returns true when receives a valid object', () => {
    const validNewEvent = {
      name: 'Big Event',
      end: '13/07/1981',
      state: { home: 'candidate' },
    };

    expect(validationService.newEvent(validNewEvent)).toBe(true);
  });
});
