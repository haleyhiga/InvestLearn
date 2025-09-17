export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  // For now, just return a mock response
  res.status(201).json({
    message: 'Registration endpoint working',
    user: { email, fullName },
    timestamp: new Date().toISOString()
  });
}