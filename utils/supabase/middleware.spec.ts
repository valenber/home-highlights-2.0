import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './middleware';
import { createServerClient } from '@supabase/ssr';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock @supabase/ssr
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
  },
};

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => mockSupabaseClient),
}));

// Mock NextResponse
const mockResponse = {
  cookies: {
    set: jest.fn(),
    getAll: jest.fn(() => []),
  },
};

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => mockResponse),
    redirect: jest.fn((url: URL) => ({ redirect: url.href })),
  },
}));

const mockedCreateServerClient = createServerClient as jest.MockedFunction<
  typeof createServerClient
>;
const mockedNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

interface MockCookies {
  getAll: jest.MockedFunction<() => Array<{ name: string; value: string }>>;
  set: jest.MockedFunction<(name: string, value: string) => void>;
}

interface MockNextUrl {
  pathname: string;
  clone: jest.MockedFunction<() => { pathname: string; href: string }>;
}

interface MockRequest {
  cookies: MockCookies;
  nextUrl: MockNextUrl;
}

describe('Supabase Middleware', () => {
  let mockRequest: MockRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      cookies: {
        getAll: jest.fn(() => [{ name: 'sb-session', value: 'session-token' }]),
        set: jest.fn(),
      },
      nextUrl: {
        pathname: '/dashboard',
        clone: jest.fn(() => ({
          pathname: '/dashboard',
          href: 'http://localhost:3000/dashboard',
        })),
      },
    };
  });

  it('should create server client and call getUser', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user123', email: 'test@example.com' } },
    });

    const response = await updateSession(mockRequest as unknown as NextRequest);

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

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
    expect(response).toBe(mockResponse);
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    const mockUrl = {
      pathname: '/login',
      href: 'http://localhost:3000/login',
    };
    mockRequest.nextUrl.clone = jest.fn(() => mockUrl);

    await updateSession(mockRequest as unknown as NextRequest);

    expect(mockedNextResponse.redirect).toHaveBeenCalledWith(mockUrl);
  });

  it('should not redirect when user is authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user123', email: 'test@example.com' } },
    });

    const response = await updateSession(mockRequest as unknown as NextRequest);

    expect(mockedNextResponse.redirect).not.toHaveBeenCalled();
    expect(response).toBe(mockResponse);
  });

  it('should not redirect when on login page', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    mockRequest.nextUrl.pathname = '/login';

    const response = await updateSession(mockRequest as unknown as NextRequest);

    expect(mockedNextResponse.redirect).not.toHaveBeenCalled();
    expect(response).toBe(mockResponse);
  });

  it('should not redirect when on auth page', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
    });

    mockRequest.nextUrl.pathname = '/auth/callback';

    const response = await updateSession(mockRequest as unknown as NextRequest);

    expect(mockedNextResponse.redirect).not.toHaveBeenCalled();
    expect(response).toBe(mockResponse);
  });

  it('should handle cookie operations in setAll', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user123' } },
    });

    await updateSession(mockRequest as unknown as NextRequest);

    const cookieConfig = mockedCreateServerClient.mock.calls[0][2];

    // Test getAll
    const cookies = cookieConfig.cookies.getAll();
    expect(cookies).toEqual([{ name: 'sb-session', value: 'session-token' }]);

    // Test setAll
    const testCookies = [
      { name: 'new-session', value: 'new-token', options: { httpOnly: true } },
    ];

    cookieConfig.cookies.setAll(testCookies);

    expect(mockRequest.cookies.set).toHaveBeenCalledWith(
      'new-session',
      'new-token',
    );
    expect(mockedNextResponse.next).toHaveBeenCalledWith({
      request: mockRequest,
    });
    expect(mockResponse.cookies.set).toHaveBeenCalledWith(
      'new-session',
      'new-token',
      { httpOnly: true },
    );
  });
});
