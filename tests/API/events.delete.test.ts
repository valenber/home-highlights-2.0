import mongoose from 'mongoose';
import httpMocks from 'node-mocks-http';
import { EventEmitter } from 'events';

import eventsEndpointHandler from '../../pages/api/events';
import Events from '../../data/db_model.events';

describe.skip('DELETE', () => {
  test.todo('method allowed by API');

  test.todo('returns deleted event Object');
});
