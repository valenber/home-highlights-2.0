import mongoose from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { EventEmitter } from 'events';

import eventsEndpointHandler from '../pages/api/events';

export async function connectMongo(databaseName: string) {
  const mongoURL = `mongodb://127.0.0.1:27017/${databaseName}`;
  await mongoose.connect(mongoURL, {
    // mongoose has deprecated some characteristics and needs those options
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function disconnectMongo() {
  await mongoose.connection.close();
}

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
