import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the Supabase client
const mockAuth = {
  getSession: jest.fn(),
  onAuthStateChange: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: mockAuth,
  })),
}));

// Mock environment variables for test
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

const TestComponent = () => {
  const { user, loading } = useAuth();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p data-testid="user-status">
          {user ? `Logged in as ${user.email}` : 'Not logged in'}
        </p>
      )}
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockAuth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
  });

  it('should show loading state initially', async () => {
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show not logged in when no session', async () => {
    mockAuth.getSession.mockResolvedValue({
      data: { session: null },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'Not logged in',
      );
    });
  });

  it('should show user when session exists', async () => {
    const mockUser = {
      id: 'user123',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
    };

    mockAuth.getSession.mockResolvedValue({
      data: {
        session: {
          user: mockUser,
          access_token: 'token',
        },
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'Logged in as test@example.com',
      );
    });
  });
});
