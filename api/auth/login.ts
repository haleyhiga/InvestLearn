// Vercel serverless function for user login
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // For now, just return success without database
    res.status(200).json({
      message: 'Login endpoint is working!',
      user: {
        email,
        id: 'temp-id',
        fullName: 'Test User'
      },
      token: 'temp-token'
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
}
