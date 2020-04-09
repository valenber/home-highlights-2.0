import mongoose from 'mongoose';
import { createMocks } from 'node-mocks-http';
import eventsEndpointHandler from '../pages/api/events';
import Events from '../data/db_model.events';

type APIresponse = { _getStatusCode: () => any; _getData: () => any };

// setup connection to mongo db running in docker container
// that was launched in pretest script
beforeAll(async () => {
  const mongoURL = 'mongodb://127.0.0.1:27017/testDB';
  await mongoose.connect(mongoURL, {
    // mongoose has deprecated some characteristics and needs those options
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
// close connection to mongo db
afterAll(async () => {
  await mongoose.connection.close();
});

describe.skip('GET', () => {
  let response: APIresponse;

  beforeEach(async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    response = res;
    await eventsEndpointHandler(req, res);
  });

  test('method allowed by API', () => {
    expect(response._getStatusCode()).not.toBe(405);
  });

  test('returns an Array of objects', () => {
    const dataObject = JSON.parse(response._getData());

    expect(typeof dataObject).toBe('object');
    expect(dataObject.length).toBeGreaterThanOrEqual(1);
    expect(typeof dataObject[0]).toBe('object');
  });
});

async function mockRequest(method: any, body = {}) {
  const { req, res } = createMocks({
    method,
    body,
  });
  eventsEndpointHandler(req, res);
  return { req, res };
}

describe('POST', () => {
  const testEvent = {
    name: 'PhotoEspana 2019',
    start: '1/1/2019',
  };

  afterEach(() => {
    // clear up the collection
    Events.remove({});
  });

  test.only('method allowed by API', async (done) => {
    const { res } = await mockRequest('POST');
    expect(res._getStatusCode()).not.toBe(405);
    done();
  });

  test('returns non-empty string', async (done) => {
    const { res } = await mockRequest('POST');
    const APIres = res._getData();
    console.log(res._getData());
    expect(typeof APIres).toBe('string');
    expect(APIres.length).toBeGreaterThanOrEqual(1);
    done();
  });

  test('posted event is saved in the DB', async (done) => {
    const [firstDocument] = await Events.find();
    expect(firstDocument).toEqual(testEvent);
    done();
  });
});

describe.skip('DELETE', () => {
  let response: APIresponse;

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'DELETE',
    });
    response = res;
    eventsEndpointHandler(req, res);
  });

  test('method allowed by API', (done) => {
    const result = response._getStatusCode();
    expect(result).not.toBe(405);
    done();
  });

  test('returns deleted event Object', () => {
    const APIres = JSON.parse(response._getData());
    expect(typeof APIres).toBe('object');
    expect(APIres.length).not.toBeDefined();
  });
});

describe.skip('PUT', () => {
  let response: APIresponse;

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'PUT',
    });
    response = res;
    eventsEndpointHandler(req, res);
  });

  test('method allowed by API', () => {
    expect(response._getStatusCode()).not.toBe(405);
  });

  test('returns non-empty string', () => {
    const APIres = response._getData();
    expect(typeof APIres).toBe('string');
    expect(APIres.length).toBeGreaterThanOrEqual(1);
  });
});
