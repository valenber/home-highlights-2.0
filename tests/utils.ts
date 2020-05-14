import { createRequest, createResponse } from 'node-mocks-http';
import { EventEmitter } from 'events';

import eventsEndpoint from '../pages/api/events';
import { NextApiRequest, NextApiResponse } from 'next';

type apiCallMethods = 'GET' | 'POST' | 'DELETE' | 'PUT';

type ReturnType = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export function mockRequest(method: apiCallMethods, body = null): ReturnType {
  const req = createRequest({
    method,
    body,
  });
  const res = createResponse({ eventEmitter: EventEmitter });

  eventsEndpoint(req, res);
  return { req, res };
}
