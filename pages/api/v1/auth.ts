import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../data/supabaseService';
import { serialize } from 'cookie';

// Cookie settings
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict' as const,
  maxAge: 60 * 60 * 24 * 14, // 2 weeks
  path: '/',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  // Handle different HTTP methods
  switch (method) {
    case 'POST': // Sign in
      return handleSignIn(req, res);
    case 'DELETE': // Sign out
      return handleSignOut(req, res);
    case 'GET': // Get current user
      return handleGetUser(req, res);
    case 'PUT': // Refresh session
      return handleRefreshSession(req, res);
    default:
      res.setHeader('Allow', ['POST', 'DELETE', 'GET', 'PUT']);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}

// Handle sign in
async function handleSignIn(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const authData = await supabaseService.signInWithEmail(email, password);

    // Set auth cookie with userId and creation timestamp
    res.setHeader(
      'Set-Cookie',
      serialize(
        'auth_session',
        JSON.stringify({
          userId: authData.user.id,
          createdAt: Date.now(),
        }),
        COOKIE_OPTIONS,
      ),
    );

    res.status(200).json({ data: authData.user, error: null });
  } catch (error) {
    res.status(401).json({ error: error.message, data: null });
  }
}

// Handle sign out
async function handleSignOut(req: NextApiRequest, res: NextApiResponse) {
  try {
    await supabaseService.signOut();

    // Clear auth cookie
    res.setHeader(
      'Set-Cookie',
      serialize('auth_session', '', {
        ...COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      }),
    );

    res.status(200).json({ error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle get current user
async function handleGetUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if session cookie exists
    const sessionCookie = req.cookies.auth_session;
    if (!sessionCookie) {
      return res.status(401).json({
        error: 'No valid session cookie',
        data: null,
      });
    }

    // Parse the cookie
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie);
    } catch (e) {
      return res.status(401).json({
        error: 'Invalid session cookie format',
        data: null,
      });
    }

    // Validate cookie content
    if (!sessionData.userId) {
      return res.status(401).json({
        error: 'Invalid session cookie',
        data: null,
      });
    }

    // Get the current user from Supabase
    const user = await supabaseService.getCurrentUser();

    // Validate that the user ID in the cookie matches the current user
    if (user.id !== sessionData.userId) {
      return res.status(401).json({
        error: 'Session user mismatch',
        data: null,
      });
    }

    // Check if session needs to be refreshed (less than 48 hours remaining of the total TTL)
    let needsRefresh = false;

    if (sessionData.createdAt) {
      const cookieAgeInHours =
        (Date.now() - sessionData.createdAt) / (1000 * 60 * 60);
      const totalTTLInHours = COOKIE_OPTIONS.maxAge / (60 * 60);
      const remainingHours = totalTTLInHours - cookieAgeInHours;

      // If less than 48 hours remaining before cookie expires
      if (remainingHours <= 48) {
        needsRefresh = true;
      }
    }

    // Add needsRefresh flag to user data
    const userData = {
      ...user,
      needsRefresh,
    };

    // Return the enhanced user data
    res.status(200).json({ data: userData, error: null });
  } catch (error) {
    res.status(401).json({ error: error.message, data: null });
  }
}

// Handle session refresh
async function handleRefreshSession(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if session cookie exists
    const sessionCookie = req.cookies.auth_session;
    if (!sessionCookie) {
      return res.status(401).json({
        error: 'No valid session cookie',
        data: null,
      });
    }

    // Parse the cookie
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie);
    } catch (e) {
      return res.status(401).json({
        error: 'Invalid session cookie format',
        data: null,
      });
    }

    // Validate cookie content
    if (!sessionData.userId) {
      return res.status(401).json({
        error: 'Invalid session cookie',
        data: null,
      });
    }

    // Refresh the session
    const refreshData = await supabaseService.refreshSession();
    const user = refreshData.user;

    // Validate that the user ID in the cookie matches the refreshed user
    if (user.id !== sessionData.userId) {
      return res.status(401).json({
        error: 'Session user mismatch',
        data: null,
      });
    }

    // Set refreshed auth cookie with new timestamp but same user ID
    res.setHeader(
      'Set-Cookie',
      serialize(
        'auth_session',
        JSON.stringify({
          userId: sessionData.userId,
          createdAt: Date.now(),
        }),
        COOKIE_OPTIONS,
      ),
    );

    res.status(200).json({ data: user, error: null });
  } catch (error) {
    res.status(401).json({ error: error.message, data: null });
  }
}
