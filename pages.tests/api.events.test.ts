import { createMocks } from 'node-mocks-http';
import { eventsEndpointHandler } from '../pages/api/events';

describe('GET', () => {
  let response: { _getStatusCode: () => any; _getData: () => any };

  beforeEach(() => {
    const { req, res } = createMocks({
      method: 'GET',
    });
    response = res;
    eventsEndpointHandler(req, res);
  });

  test('returns 200', () => {
    expect(response._getStatusCode()).toBe(200);
  });

  test('returns correct moto', () => {
    expect(response._getData()).toBe(JSON.stringify({ moto: 'Akuna Matata' }));
  });
});
