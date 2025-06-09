import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';
import { act } from 'react-dom/test-utils';

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock global fetch
const originalFetch = global.fetch;

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
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.useRealTimers();
  });

  it('should automatically check for user on mount', async () => {
    // Mock successful auth check
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { id: 'user123', email: 'test@example.com' },
        error: null,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent(
        'Logged in as test@example.com',
      );
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/v1/auth');
  });

  it('should automatically refresh session when server indicates refresh is needed', async () => {
    // Initial auth check response with needsRefresh flag
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
          needsRefresh: true, // Server indicates refresh is needed
        },
        error: null,
      }),
    });

    // Refresh session response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
        },
        error: null,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenLastCalledWith('/api/v1/auth', {
        method: 'PUT',
      });
    });
  });

  it('should not refresh session when server does not indicate refresh is needed', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
          // No needsRefresh flag
        },
        error: null,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial auth check
  });
});
