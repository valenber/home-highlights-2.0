import { createMocks } from 'node-mocks-http';
import handler from '../../../pages/api/v1/auth';
import { supabaseService } from '../../../data/supabaseService';

// Mock the supabaseService
jest.mock('../../../data/supabaseService', () => ({
  supabaseService: {
    signInWithEmail: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    refreshSession: jest.fn(),
  },
}));

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth (sign in)', () => {
    it('should return 400 if email or password is missing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });

      await handler(req, res);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Email and password are required',
      });
    });

    it('should set httpOnly cookie and return user data on successful login', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      const mockAuthData = {
        user: mockUser,
        session: { access_token: 'mock-token' },
      };

      (supabaseService.signInWithEmail as jest.Mock).mockResolvedValueOnce(
        mockAuthData,
      );

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      await handler(req, res);

      // Check response
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        data: mockUser,
        error: null,
      });

      // Check that Supabase service was called correctly
      expect(supabaseService.signInWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );

      // Check that a cookie was set
      const setCookieHeader = res.getHeader('Set-Cookie');
      expect(setCookieHeader).toBeDefined();
      expect(typeof setCookieHeader).toBe('string');

      // Verify cookie is HttpOnly and contains userId
      const cookieString = setCookieHeader as string;
      expect(cookieString).toContain('HttpOnly');
      expect(cookieString).toContain('user123');
    });

    it('should return 401 on login failure', async () => {
      (supabaseService.signInWithEmail as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Invalid credentials',
        data: null,
      });
    });
  });

  describe('DELETE /api/v1/auth (sign out)', () => {
    it('should clear auth cookie and return success response', async () => {
      (supabaseService.signOut as jest.Mock).mockResolvedValueOnce({});

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await handler(req, res);

      // Check response
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        error: null,
      });

      // Check that Supabase service was called
      expect(supabaseService.signOut).toHaveBeenCalled();

      // Check that cookie was cleared
      const setCookieHeader = res.getHeader('Set-Cookie');
      expect(setCookieHeader).toBeDefined();
      expect(typeof setCookieHeader).toBe('string');

      // Verify cookie is being expired
      const cookieString = setCookieHeader as string;
      expect(cookieString).toContain('auth_session=;');
      expect(cookieString).toContain('Max-Age=0');
    });

    it('should return 500 on sign out failure', async () => {
      (supabaseService.signOut as jest.Mock).mockRejectedValueOnce(
        new Error('Sign out failed'),
      );

      const { req, res } = createMocks({
        method: 'DELETE',
      });

      await handler(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Sign out failed',
      });
    });
  });

  describe('GET /api/v1/auth (get user)', () => {
    it('should return user data when valid session cookie exists and matches user', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      (supabaseService.getCurrentUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({ userId: 'user123' }),
        },
      });

      await handler(req, res);

      // Check response
      expect(res.statusCode).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data.id).toBe(mockUser.id);
      expect(responseData.data.email).toBe(mockUser.email);
      // needsRefresh might be added, we don't care about its value in this test
      expect(responseData.error).toBeNull();

      // Check that Supabase service was called
      expect(supabaseService.getCurrentUser).toHaveBeenCalled();
    });

    it('should include needsRefresh flag when cookie is close to expiration', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      (supabaseService.getCurrentUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      // Create timestamp for cookie that was created 12.5 days ago
      // (clearly under the 48-hour threshold before expiry of a 14-day cookie)
      const oldTimestamp = Date.now() - 12.5 * 24 * 60 * 60 * 1000;

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: oldTimestamp,
          }),
        },
      });

      // Test the calculation directly
      const COOKIE_TTL = 60 * 60 * 24 * 14; // 14 days in seconds
      const cookieAgeInSeconds = (Date.now() - oldTimestamp) / 1000;
      const remainingSeconds = COOKIE_TTL - cookieAgeInSeconds;
      const remainingHours = remainingSeconds / 3600;

      // Should be less than or equal to 48 hours remaining
      expect(remainingHours).toBeLessThanOrEqual(48);

      await handler(req, res);

      // Check response - should include needsRefresh flag
      expect(res.statusCode).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data).toHaveProperty('needsRefresh', true);
    });

    it('should not include needsRefresh flag when cookie expiration is far away', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      (supabaseService.getCurrentUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      // Create timestamp for cookie that was created just 1 day ago
      // (well before the 48-hour threshold before expiry)
      const recentTimestamp = Date.now() - 1 * 24 * 60 * 60 * 1000;

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: recentTimestamp,
          }),
        },
      });

      await handler(req, res);

      // Check response - should not include needsRefresh flag or should be false
      expect(res.statusCode).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data.needsRefresh).toBeFalsy();
    });

    it('should return 401 when no session cookie exists', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        // No cookies provided
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'No valid session cookie',
        data: null,
      });
    });

    it('should return 401 when cookie userId does not match current user', async () => {
      // This simulates when a cookie has a valid format but contains
      // a userId that doesn't match the current authenticated user
      const mockUser = {
        id: 'different-user-id', // Different from cookie
        email: 'test@example.com',
      };

      (supabaseService.getCurrentUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now(), // Add createdAt to match format
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Session user mismatch',
        data: null,
      });

      // Check that Supabase service was called
      expect(supabaseService.getCurrentUser).toHaveBeenCalled();
    });

    it('should return 401 when getCurrentUser fails', async () => {
      (supabaseService.getCurrentUser as jest.Mock).mockRejectedValueOnce(
        new Error('Unable to get current user'),
      );

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now(),
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      // We don't test the exact error message since it depends on what error is thrown
      const response = JSON.parse(res._getData());
      expect(response.error).toBeTruthy();
      expect(response.data).toBeNull();
    });
  });

  describe('PUT /api/v1/auth (refresh session)', () => {
    it('should refresh the session when valid cookie exists', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      (supabaseService.refreshSession as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: { access_token: 'new-token' },
      });

      const { req, res } = createMocks({
        method: 'PUT',
        cookies: {
          auth_session: JSON.stringify({ userId: 'user123' }),
        },
      });

      await handler(req, res);

      // Check response
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        data: mockUser,
        error: null,
      });

      // Check that Supabase service was called
      expect(supabaseService.refreshSession).toHaveBeenCalled();

      // Check that cookie was refreshed
      const setCookieHeader = res.getHeader('Set-Cookie');
      expect(setCookieHeader).toBeDefined();
      expect(typeof setCookieHeader).toBe('string');

      // Verify cookie has proper data and TTL
      const cookieString = setCookieHeader as string;
      expect(cookieString).toContain('user123');

      // Check for 14-day (2 week) TTL - 60 * 60 * 24 * 14 = 1209600 seconds
      expect(cookieString).toContain('Max-Age=1209600');
    });

    it('should not refresh the session when no cookie exists', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        // No cookies provided
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'No valid session cookie',
        data: null,
      });

      // Check that Supabase service was not called
      expect(supabaseService.refreshSession).not.toHaveBeenCalled();
    });

    it('should return 401 when refreshSession fails', async () => {
      (supabaseService.refreshSession as jest.Mock).mockRejectedValueOnce(
        new Error('Session refresh failed'),
      );

      const { req, res } = createMocks({
        method: 'PUT',
        cookies: {
          auth_session: JSON.stringify({ userId: 'user123' }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Session refresh failed',
        data: null,
      });
    });
  });
});
