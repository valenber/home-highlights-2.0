import dbs from './databaseService';

// mock of the Unbounded DB client
const mockMethod_database = jest.fn();
const mockMethod_query = jest.fn();
const mockMethod_match = jest.fn();
const mockMethod_send = jest.fn();

const mockUnboundedDBclient = {
  database: mockMethod_database,
  query: mockMethod_query,
  match: mockMethod_match,
  send: mockMethod_send,
};

mockUnboundedDBclient.database.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.query.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.match.mockImplementation(() => mockUnboundedDBclient);
mockUnboundedDBclient.send.mockImplementation(() => Promise.resolve([]));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllAgendaEvents', () => {
  test('connects to DB', async () => {
    await dbs.getAllAgendaEvents(mockUnboundedDBclient);
    expect(mockMethod_database).toHaveBeenCalledTimes(1);
  });

  test('forms a query that matches any record', async () => {
    await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(mockMethod_query).toHaveBeenCalledTimes(1);
    expect(mockMethod_match).toHaveBeenCalledTimes(1);
    expect(mockMethod_match).toHaveBeenCalledWith({});
  });

  test('sends the query', async () => {
    await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(mockMethod_send).toHaveBeenCalledTimes(1);
  });

  test('returns 200 and list when DB returns items', async () => {
    const mockDBresult = [{ name: 'Event1' }, { name: 'Event2' }];
    mockUnboundedDBclient.send.mockImplementation(() =>
      Promise.resolve(mockDBresult),
    );
    const result = await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({ status: 200, list: mockDBresult });
  });

  test('returns 204 and empty list when DB returns nothing', async () => {
    mockUnboundedDBclient.send.mockImplementation(() => Promise.resolve([]));
    const result = await dbs.getAllAgendaEvents(mockUnboundedDBclient);

    expect(result).toEqual({ status: 204, list: [] });
  });
});
