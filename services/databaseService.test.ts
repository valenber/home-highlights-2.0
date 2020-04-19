import { getAllAgendaEvents, createNewAgendaEvent } from './databaseService';
import { validNewEvent } from './dbValidaton';
jest.mock('./dbValidaton');

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
    const result = await getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({ status: 200, list: mockDBresult });
  });

  test('returns 404 and error message when DB returns nothing', async () => {
    mockUnboundedDBclient.send.mockImplementation(() => Promise.resolve([]));
    const result = await getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({
      status: 404,
      message: 'Database has no records',
    });
  });
});

describe('createNewAgendaEvent', () => {
  test('validation check is called once with passed object', () => {
    const newEventObject = {
      name: 'Event',
      end: new Date('1/12/1981'),
    };

    createNewAgendaEvent(mockUnboundedDBclient, newEventObject);

    expect(validNewEvent).toHaveBeenCalledWith(newEventObject);
    expect(validNewEvent).toHaveBeenCalledTimes(1);
  });
  test.todo('returns 400 and an error message with invalid event object');
  test.todo('does not call database with invalid event object');
  test.todo('returns 500 and error if DB returns error');
  test.todo('returns 200 and recordId when record is added');
});
