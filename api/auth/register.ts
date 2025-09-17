// Vercel serverless function for user registration
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, fullName } = req.body;

    // For now, just return success without database
    res.status(201).json({
      message: 'Registration endpoint is working!',
      user: {
        email,
        fullName,
        id: 'temp-id'
      },
      token: 'temp-token'
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
}
