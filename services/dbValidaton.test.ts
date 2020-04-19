import { validNewEvent } from './dbValidaton';

const invalidObjects = [
  {},
  { name: ' ' },
  { name: 'Event' },
  { name: 'Event', end: '1/2/2019' },
  { name: 'Event', end: new Date('1/2/2019') },
];

test.each(invalidObjects)(
  'returns false when receives %o',
  (newEventObject) => {
    // @ts-ignore
    // we ignore type here to be able to pass invalid objects
    // this validation needs to occur at runtime inside API lambda
    const result = validNewEvent(newEventObject);
    expect(result).toBe(false);
  },
);
