import { mockRequest } from '../utils';
import databaseService from '../../services/databaseService';

databaseService.getAllAgendaEvents = jest.fn();
databaseService.createNewAgendaEvent = jest.fn();
databaseService.deleteAgendaEvent = jest.fn();
databaseService.updateAgendaEvent = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('GET');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('triggers call to getAllEvents', () => {
    mockRequest('GET');
    expect(databaseService.getAllAgendaEvents).toHaveBeenCalledTimes(1);
  });
});

describe('POST', () => {
  test('method is  allowed by API', () => {
    const { res } = mockRequest('POST');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('triggers call to createNewAgendaEvent', () => {
    mockRequest('POST');
    expect(databaseService.createNewAgendaEvent).toHaveBeenCalledTimes(1);
  });
});

describe('DELETE', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('DELETE');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('triggers call to deleteAgendaEvent', () => {
    mockRequest('DELETE');
    expect(databaseService.deleteAgendaEvent).toHaveBeenCalledTimes(1);
  });
});

describe('PUT', () => {
  test('method is allowed by API', () => {
    const { res } = mockRequest('PUT');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('triggers call to updateAgendaEvent', () => {
    mockRequest('PUT');
    expect(databaseService.updateAgendaEvent).toHaveBeenCalledTimes(1);
  });
});
