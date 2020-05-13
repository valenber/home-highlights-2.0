import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';
import { EventEmitter } from 'events';

import eventsEndpointHandler from '../pages/api/events';

type apiCallMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

type ReturnType = {
  req: MockRequest<e.Request>;
  res: MockResponse<e.Request>;
};

export function mockRequest(method: apiCallMethods, body = null): null {
  const req = createRequest({
    method,
    body,
  });
  const res = createResponse({ eventEmitter: EventEmitter });

  eventsEndpointHandler(req, res);
  return { req, res };
}
