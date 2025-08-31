import { createClient } from './server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => [{ name: 'test-cookie', value: 'test-value' }]),
    set: jest.fn(),
  })),
}));

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(),
  })),
}));

const mockedCreateServerClient = createServerClient as jest.MockedFunction<
  typeof createServerClient
>;
const mockedCookies = cookies as jest.MockedFunction<typeof cookies>;

describe('Supabase Server Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a server client with cookie handling', async () => {
    const client = await createClient();

    expect(mockedCookies).toHaveBeenCalled();
    expect(mockedCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      }),
    );

    expect(client).toHaveProperty('auth');
    expect(client).toHaveProperty('from');
  });

  it('should handle cookie operations correctly', async () => {
    const mockCookieStore = {
      getAll: jest.fn(() => [
        { name: 'session-cookie', value: 'session-value' },
      ]),
      set: jest.fn(),
    } as unknown as ReturnType<typeof cookies>;

    mockedCookies.mockReturnValue(mockCookieStore);

    await createClient();

    const cookieConfig = mockedCreateServerClient.mock.calls[0][2];

    // Test getAll
    const allCookies = cookieConfig.cookies.getAll();
    expect(allCookies).toEqual([
      { name: 'session-cookie', value: 'session-value' },
    ]);

    // Test setAll
    const testCookies = [
      { name: 'new-cookie', value: 'new-value', options: { httpOnly: true } },
    ];

    cookieConfig.cookies.setAll(testCookies);

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      'new-cookie',
      'new-value',
      { httpOnly: true },
    );
  });

  it('should handle setAll errors gracefully', async () => {
    const mockCookieStore = {
      getAll: jest.fn(() => []),
      set: jest.fn(() => {
        throw new Error('Cookie setting failed');
      }),
    } as unknown as ReturnType<typeof cookies>;

    mockedCookies.mockReturnValue(mockCookieStore);

    await createClient();

    const cookieConfig = mockedCreateServerClient.mock.calls[0][2];

    // This should not throw - errors are caught
    expect(() => {
      cookieConfig.cookies.setAll([
        { name: 'test', value: 'test', options: {} },
      ]);
    }).not.toThrow();
  });
});
