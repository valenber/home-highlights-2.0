import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/v1/auth';
import { supabaseService } from '../data/supabaseService';

// Mock the supabaseService
jest.mock('../data/supabaseService', () => ({
  supabaseService: {
    signInWithEmail: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    refreshSession: jest.fn(),
  },
}));

describe('Auth Session Persistence Issue #1428', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Session validation after tab switching', () => {
    it('should maintain valid session when user returns to tab with valid JWT', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      // Mock getCurrentUser to return valid user (simulating valid JWT)
      (supabaseService.getCurrentUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data.id).toBe(mockUser.id);
      expect(responseData.error).toBeNull();
    });

    it('should return 401 when JWT is invalid but cookie exists', async () => {
      // Mock getCurrentUser to throw error (simulating invalid JWT)
      (supabaseService.getCurrentUser as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid JWT'),
      );

      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data).toBeNull();
      expect(responseData.error).toBeTruthy();
    });

    it('should handle session refresh when JWT is expired but refresh token is valid', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      // Mock refreshSession to return valid user
      (supabaseService.refreshSession as jest.Mock).mockResolvedValueOnce({
        user: mockUser,
        session: { access_token: 'new-token' },
      });

      const { req, res } = createMocks({
        method: 'PUT',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(200);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data.id).toBe(mockUser.id);
      expect(responseData.error).toBeNull();

      // Check that a new cookie was set with updated timestamp
      const setCookieHeader = res.getHeader('Set-Cookie');
      expect(setCookieHeader).toBeDefined();
      expect(typeof setCookieHeader).toBe('string');

      const cookieString = setCookieHeader as string;
      expect(cookieString).toContain('user123');
    });

    it('should return 401 when both JWT and refresh token are invalid', async () => {
      // Mock refreshSession to throw error (simulating invalid refresh token)
      (supabaseService.refreshSession as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid refresh token'),
      );

      const { req, res } = createMocks({
        method: 'PUT',
        cookies: {
          auth_session: JSON.stringify({
            userId: 'user123',
            createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago (expired)
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      const responseData = JSON.parse(res._getData());
      expect(responseData.data).toBeNull();
      expect(responseData.error).toBe('Invalid refresh token');
    });
  });

  describe('Cookie malformation issues', () => {
    it('should handle malformed session cookies gracefully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: 'malformed-json-string',
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Invalid session cookie format');
      expect(responseData.data).toBeNull();
    });

    it('should handle missing userId in cookie', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        cookies: {
          auth_session: JSON.stringify({
            // Missing userId
            createdAt: Date.now(),
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Invalid session cookie');
      expect(responseData.data).toBeNull();
    });
  });

  describe('Session mismatch scenarios', () => {
    it('should detect and reject session when cookie userId does not match Supabase user', async () => {
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
            userId: 'user123', // Different from mockUser.id
            createdAt: Date.now(),
          }),
        },
      });

      await handler(req, res);

      expect(res.statusCode).toBe(401);
      const responseData = JSON.parse(res._getData());
      expect(responseData.error).toBe('Session user mismatch');
      expect(responseData.data).toBeNull();
    });
  });
});
