# InvestLearn - AI-Powered Investment Learning Platform

A comprehensive learning platform that helps users master investment concepts through personalized learning paths, AI-generated quizzes, and intelligent recommendations.

## Features

- 📚 **Learning Modules**: 15 comprehensive modules covering beginner to advanced investment topics
- 🤖 **AI-Powered Chat**: Finance-focused chatbot for instant help
- 📊 **Progress Tracking**: Detailed analytics and achievement system
- 🎯 **Personalized Recommendations**: AI-driven module suggestions based on skill level
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔐 **Secure Authentication**: JWT-based user authentication
- 🎮 **Gamification**: Points, achievements, and progress tracking

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4 for chat and content generation
- **Authentication**: JWT with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/investlearn.git
cd investlearn
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your actual values:
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

5. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── hooks/          # Custom hooks
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── modules-data.ts    # Hardcoded learning modules
├── shared/                 # Shared types and schemas
└── migrations/             # Database migrations
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Learning Modules
- `GET /api/modules` - Get all modules
- `POST /api/modules/initialize` - Initialize hardcoded modules
- `GET /api/modules/recommendations` - Get personalized recommendations

### Progress & Analytics
- `GET /api/user/stats` - Get user statistics
- `POST /api/progress/update` - Update module progress
- `GET /api/achievements` - Get user achievements

### AI Features
- `POST /api/chat` - AI chatbot for finance questions
- `POST /api/quiz/generate` - Generate AI quizzes



