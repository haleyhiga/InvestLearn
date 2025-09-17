export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // For now, just return a mock response
  res.status(200).json({
    message: 'Login endpoint working',
    email: email,
    timestamp: new Date().toISOString()
  });
}