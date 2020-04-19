import { mockRequest } from '../utils';

jest.mock('../../services/databaseService');
import {
  getAllAgendaEvents,
  createNewAgendaEvent,
  deleteAgendaEvent,
  updateAgendaEvent,
} from '../../services/databaseService';

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET method', () => {
  test('is allowed by API', () => {
    const { res } = mockRequest('GET');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('calls getAllAgendaEvents method', (done) => {
    const { res } = mockRequest('GET');

    res.on('end', () => {
      expect(getAllAgendaEvents).toHaveBeenCalledTimes(1);
      done();
    });
  });
});

describe('POST method', () => {
  test('is  allowed by API', () => {
    const { res } = mockRequest('POST');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('calls createNewAgendaEvent method', (done) => {
    const { res } = mockRequest('POST');

    res.on('end', () => {
      expect(createNewAgendaEvent).toHaveBeenCalledTimes(1);
      done();
    });
  });
});

describe('DELETE method', () => {
  test('is allowed by API', () => {
    const { res } = mockRequest('DELETE');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('calls deleteAgendaEvent method', (done) => {
    const { res } = mockRequest('DELETE');

    res.on('end', () => {
      expect(deleteAgendaEvent).toHaveBeenCalledTimes(1);
      done();
    });
  });
});

describe('PUT method', () => {
  test('is allowed by API', () => {
    const { res } = mockRequest('PUT');
    expect(res._getStatusCode()).not.toBe(405);
  });

  test('calls updateAgendaEvent method', (done) => {
    const { res } = mockRequest('PUT');

    res.on('end', () => {
      expect(updateAgendaEvent).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
