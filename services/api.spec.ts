import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getAllApiEvents } from './api';

const server = setupServer();

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('get all events', () => {
  test('500 is handled', async () => {
    server.use(
      rest.get('/api/events', (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: 'DB is not responding' }),
        );
      }),
    );

    const events = await getAllApiEvents();

    expect(events).toEqual({});
  });
});
