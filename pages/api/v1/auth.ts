import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseService } from '../../../data/supabaseService';

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
    default:
      res.setHeader('Allow', ['POST', 'DELETE', 'GET']);
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
    res.status(200).json({ data: authData.user, error: null });
  } catch (error) {
    res.status(401).json({ error: error.message, data: null });
  }
}

// Handle sign out
async function handleSignOut(req: NextApiRequest, res: NextApiResponse) {
  try {
    await supabaseService.signOut();
    res.status(200).json({ error: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle get current user
async function handleGetUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await supabaseService.getCurrentUser();
    res.status(200).json({ data: user, error: null });
  } catch (error) {
    res.status(401).json({ error: error.message, data: null });
  }
}
