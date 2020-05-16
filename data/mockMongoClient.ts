import { MongoClient } from 'mongodb';

export function mockMongoClient(): Partial<MongoClient> {
  const clientIsConnected = jest.fn();
  const clientConnect = jest.fn();
  const clientDb = jest.fn();

  const dbCollection = jest.fn();
  const dbFind = jest.fn();
  const dbToArray = jest.fn();

  const client: Partial<MongoClient> = {
    isConnected: clientIsConnected,
    connect: clientConnect,
    db: clientDb,
  };

  const database: {} = {
    collection: dbCollection,
    find: dbFind,
    toArray: dbToArray,
  };

  clientDb.mockImplementation(() => database);
  dbCollection.mockImplementation(() => database);
  dbFind.mockImplementation(() => database);
  dbToArray.mockImplementation(() => [{ id: '1', name: 'event' }]);

  return client;
}
