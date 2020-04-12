import { mockRequest } from '../utils';
import databaseService from '../../services/databaseService';

databaseService.getAllAgendaEvents = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('GET');
    expect(res._getStatusCode()).not.toBe(405);
  });
  test('triggers call to getAllEvents on databaseService', () => {
    const { res } = mockRequest('GET');
    res.on('end', () => {
      expect(databaseService.getAllAgendaEvents).toHaveBeenCalledTimes(1);
    });
  });
});

describe('POST', () => {
  test('method is  allowed by API', () => {
    const { res } = mockRequest('POST');
    expect(res._getStatusCode()).not.toBe(405);
  });
});

describe('DELETE', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('PUT');
    expect(res._getStatusCode()).not.toBe(405);
  });
});

describe('PUT', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('PUT');
    expect(res._getStatusCode()).not.toBe(405);
  });
});
