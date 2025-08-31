import { createClient } from './client';
import { createBrowserClient } from '@supabase/ssr';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  })),
}));

const mockedCreateBrowserClient = createBrowserClient as jest.MockedFunction<
  typeof createBrowserClient
>;

describe('Supabase Browser Client', () => {
  it('should create a browser client with correct environment variables', () => {
    const client = createClient();

    expect(mockedCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
    );

    expect(client).toHaveProperty('auth');
  });
});
