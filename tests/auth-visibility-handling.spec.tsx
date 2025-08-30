import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthProvider, useAuth } from '../services/auth';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Test component that uses the auth context
const TestComponent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Authenticated as {user.email}</div>;
  return <div>Not authenticated</div>;
};

describe('AuthProvider Visibility Change Handling', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Mock successful initial auth check
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
        },
      }),
    });
  });

  afterEach(() => {
    // Clear any pending timers
    jest.clearAllTimers();
  });

  it('should re-validate session when user returns to visible tab', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(
        screen.getByText('Authenticated as test@example.com'),
      ).toBeInTheDocument();
    });

    // Clear the initial fetch call
    mockFetch.mockClear();

    // Mock successful session validation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
        },
      }),
    });

    // Simulate user switching away from tab
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: true,
    });

    // Simulate user returning to tab
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false,
    });

    // Trigger visibility change event
    const visibilityChangeEvent = new Event('visibilitychange');
    document.dispatchEvent(visibilityChangeEvent);

    // Wait for session validation
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth');
    });

    jest.useRealTimers();
  });

  it('should clear user session when validation fails on visibility change', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(
        screen.getByText('Authenticated as test@example.com'),
      ).toBeInTheDocument();
    });

    // Clear the initial fetch call
    mockFetch.mockClear();

    // Mock failed session validation (e.g., session expired)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    // Simulate user returning to tab
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false,
    });

    // Trigger visibility change event
    const visibilityChangeEvent = new Event('visibilitychange');
    document.dispatchEvent(visibilityChangeEvent);

    // Wait for session validation and user state update
    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('should refresh session when needsRefresh flag is set', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(
        screen.getByText('Authenticated as test@example.com'),
      ).toBeInTheDocument();
    });

    // Clear the initial fetch call
    mockFetch.mockClear();

    // Mock session validation with needsRefresh flag
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
          needsRefresh: true,
        },
      }),
    });

    // Mock successful session refresh
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
        },
      }),
    });

    // Simulate user returning to tab
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false,
    });

    // Trigger visibility change event
    const visibilityChangeEvent = new Event('visibilitychange');
    document.dispatchEvent(visibilityChangeEvent);

    // Wait for session validation and refresh
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // Check that refresh was called with PUT method
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/auth');
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/auth', {
      method: 'PUT',
    });

    jest.useRealTimers();
  });

  it('should validate session periodically when tab is visible', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(
        screen.getByText('Authenticated as test@example.com'),
      ).toBeInTheDocument();
    });

    // Clear the initial fetch call
    mockFetch.mockClear();

    // Mock successful periodic validation
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          id: 'user123',
          email: 'test@example.com',
        },
      }),
    });

    // Ensure tab is visible
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false,
    });

    // Fast-forward 5 minutes to trigger periodic validation
    jest.advanceTimersByTime(5 * 60 * 1000);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/auth');
    });

    jest.useRealTimers();
  });

  it('should not validate when tab is hidden during periodic check', async () => {
    jest.useFakeTimers();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(
        screen.getByText('Authenticated as test@example.com'),
      ).toBeInTheDocument();
    });

    // Clear the initial fetch call
    mockFetch.mockClear();

    // Ensure tab is hidden
    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: true,
    });

    // Fast-forward 5 minutes
    jest.advanceTimersByTime(5 * 60 * 1000);

    // Should not have made any validation calls since tab is hidden
    expect(mockFetch).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
