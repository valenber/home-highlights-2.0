import { createMocks } from 'node-mocks-http';
import handler from './confirm';
import { EmailOtpType } from '@supabase/supabase-js';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock the server client
const mockSupabaseClient = {
  auth: {
    verifyOtp: jest.fn(),
  },
};

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('/api/auth/confirm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify OTP and redirect on success', async () => {
    mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
      error: null,
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        token_hash: 'test-token-hash',
        type: 'signup' as EmailOtpType,
        next: '/dashboard',
      },
    });

    await handler(req, res);

    expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
      type: 'signup',
      token_hash: 'test-token-hash',
    });

    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/dashboard');
  });

  it('should redirect to root when no next parameter is provided', async () => {
    mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
      error: null,
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        token_hash: 'test-token-hash',
        type: 'signup' as EmailOtpType,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/');
  });

  it('should redirect to error page when verification fails', async () => {
    mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
      error: { message: 'Invalid token' },
    });

    const { req, res } = createMocks({
      method: 'GET',
      query: {
        token_hash: 'invalid-token-hash',
        type: 'signup' as EmailOtpType,
        next: '/dashboard',
      },
    });

    await handler(req, res);

    expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
      type: 'signup',
      token_hash: 'invalid-token-hash',
    });

    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/error');
  });

  it('should redirect to error page when token_hash is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        type: 'signup' as EmailOtpType,
        next: '/dashboard',
      },
    });

    await handler(req, res);

    expect(mockSupabaseClient.auth.verifyOtp).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/error');
  });

  it('should redirect to error page when type is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        token_hash: 'test-token-hash',
        next: '/dashboard',
      },
    });

    await handler(req, res);

    expect(mockSupabaseClient.auth.verifyOtp).not.toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(302);
    expect(res._getRedirectUrl()).toBe('/error');
  });

  it('should handle different OTP types correctly', async () => {
    mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
      error: null,
    });

    const otpTypes: EmailOtpType[] = [
      'signup',
      'invite',
      'magiclink',
      'recovery',
      'email_change',
    ];

    for (const type of otpTypes) {
      const { req, res } = createMocks({
        method: 'GET',
        query: {
          token_hash: `test-token-${type}`,
          type,
          next: '/success',
        },
      });

      await handler(req, res);

      expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
        type,
        token_hash: `test-token-${type}`,
      });

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe('/success');

      // Clear mock for next iteration
      jest.clearAllMocks();
      mockSupabaseClient.auth.verifyOtp.mockResolvedValue({ error: null });
    }
  });
});
