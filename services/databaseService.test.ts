import dbs from './databaseService';

// mock of the Unbounded DB client
// NOTE: these tests are specific to Unbounded DB API
const mockMethod_send = jest.fn();

const mockUnboundedDBclient = {
  database: jest.fn(),
  query: jest.fn(),
  match: jest.fn(),
  add: jest.fn(),
  send: mockMethod_send,
};

mockUnboundedDBclient.database.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.query.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.match.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.add.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.send.mockImplementation(() => Promise.resolve([]));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllAgendaEvents', () => {
  test('returns 200 and list when DB returns items', async () => {
    const mockDBresult = [{ name: 'Event1' }, { name: 'Event2' }];
    mockUnboundedDBclient.send.mockImplementation(() =>
      Promise.resolve(mockDBresult),
    );
    const result = await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({ status: 200, list: mockDBresult });
  });

  test('returns 404 and error message when DB returns nothing', async () => {
    mockUnboundedDBclient.send.mockImplementation(() => Promise.resolve([]));
    const result = await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({
      status: 404,
      message: 'Database has no records',
    });
  });
});

describe('new event validation method', () => {
  const eventObjectVariants = [
    {},
    {
      name: ' ',
    },
    { name: 'Event' },
    {
      name: 'Event',
      end: '1/2/2019',
    },
    {
      name: 'Event',
      end: new Date('1/2/2019'),
    },
  ];

  test.each(eventObjectVariants)(
    'returns error when receives %o',
    (newEventObject) => {
      // @ts-ignore
      // we ignore type here to be able to pass invalid objects
      // as we want this validation to occur at runtime inside API lambda
      const result = dbs.validNewEvent(newEventObject);
      expect(result).toBeFalsy();
    },
  );
});

describe('createNewAgendaEvent', () => {
  test.todo('does not call database with invalid event object');
  test.todo('returns database error if DB returns error');
  test.todo('returns 200 when record is added');
});
