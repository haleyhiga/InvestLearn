// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    hasSessionSecret: !!process.env.SESSION_SECRET
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Basic auth endpoint (without database for now)
app.post('/api/auth/test', (req, res) => {
  res.json({ 
    message: 'Auth endpoint is working!',
    body: req.body
  });
});

// Catch all route
app.get('*', (req, res) => {
  res.json({ 
    message: 'InvestLearn API is running!',
    path: req.path,
    method: req.method
  });
});

export default app;