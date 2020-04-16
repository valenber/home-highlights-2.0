import { createRequest, createResponse } from 'node-mocks-http';
import { EventEmitter } from 'events';

import eventsEndpointHandler from '../pages/api/events';

type apiCallMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

export function mockRequest(method: apiCallMethods, body = null) {
  const req = createRequest({
    method,
    body,
  });
  const res = createResponse({ eventEmitter: EventEmitter });

  eventsEndpointHandler(req, res);
  return { req, res };
}
