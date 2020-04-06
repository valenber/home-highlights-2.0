import { createMocks } from 'node-mocks-http';
import { eventsEndpointHandler } from '../pages/api/events';

type APIresponse = { _getStatusCode: () => any; _getData: () => any };

describe('GET', () => {
  let response: APIresponse;

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    response = res;
    eventsEndpointHandler(req, res);
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

describe('POST', () => {
  let response: APIresponse;

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'POST',
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

describe('DELETE', () => {
  let response: APIresponse;

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'DELETE',
    });
    response = res;
    eventsEndpointHandler(req, res);
  });

  test('method allowed by API', () => {
    expect(response._getStatusCode()).not.toBe(405);
  });

  test('returns deleted event Object', () => {
    const APIres = JSON.parse(response._getData());
    expect(typeof APIres).toBe('object');
    expect(APIres.length).not.toBeDefined();
  });
});

describe('PUT', () => {
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
