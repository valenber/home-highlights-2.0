import { connectMongo, disconnectMongo, mockRequest } from '../utils';
import Events from '../../data/db_model.events';

beforeAll(async () => {
  // setup connection to mongo db running in docker container
  // that was launched in pretest script
  connectMongo('mongoDBget');
});

afterAll(async () => {
  // close connection to mongo db
  disconnectMongo();
});

const testEventOne = { name: 'Event One' };
const testEventTwo = { name: 'Event Two' };

describe('GET', () => {
  beforeEach(async () => {
    await Events.deleteMany({});
  });

  test('method allowed by API', (done) => {
    const { res } = mockRequest('GET');
    res.on('end', () => {
      expect(res._getStatusCode()).not.toBe(405);
      done();
    });
  });

  test('returns an Array of two Events added to the DB', async (done) => {
    //seed database
    await Events.create(testEventOne);
    await Events.create(testEventTwo);

    // read from database
    const { res } = mockRequest('GET');

    res.on('end', () => {
      const data = JSON.parse(res._getData());
      const [recordOne, recordTwo, recordThree] = data;

      expect(data).toHaveLength(2);
      expect(recordOne.name).toBe(testEventOne.name);
      expect(recordTwo.name).toBe(testEventTwo.name);
      expect(recordThree).toBeUndefined();

      done();
    });
  });
});
