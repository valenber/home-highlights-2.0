import { connectMongo, disconnectMongo, mockRequest } from '../utils';
import Events from '../../data/db_model.events';

beforeAll(async () => {
  // setup connection to mongo db running in docker container
  // that was launched in pretest script
  connectMongo('mongoDBpost');
});
afterAll(async () => {
  // close connection to mongo db
  disconnectMongo();
});

describe('POST', () => {
  const testEvent = {
    name: 'PhotoEspana 2019',
    start: '1/1/2019',
  };

  afterEach(async () => {
    // clear up the collection
    await Events.deleteMany({});
  });

  test('method allowed by API', (done) => {
    const { res } = mockRequest('POST');
    res.on('end', () => {
      expect(res._getStatusCode()).not.toBe(405);

      done();
    });
  });

  test('returns _id that is a string of 24 characters', (done) => {
    const { res } = mockRequest('POST', testEvent);
    res.on('end', () => {
      const resData = res._getJSONData();

      expect(resData).toHaveProperty('_id');
      expect(resData._id).toHaveLength(24); // mongo ids have this length
      expect(typeof resData._id).toBe('string');

      done();
    });
  });

  test('posted event is saved in the DB', async (done) => {
    const { res } = mockRequest('POST', testEvent);
    res.on('end', async () => {
      const [testRecord] = await Events.find({ name: testEvent.name });

      expect(testRecord.name).toBe(testEvent.name);
      expect(testRecord.start).toBe(testEvent.start);

      done();
    });
  });
});
