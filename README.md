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
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **AI**: OpenAI GPT-4 for chat and content generation
- **Authentication**: JWT with bcrypt password hashing
- **Hosting**: Supabase for database and authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
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

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings → Database to get your connection string
   - Copy the connection string for your `.env` file

4. Set up environment variables:
```bash
cp .env.example .env
```

5. Configure your `.env` file with your actual values:
```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
SESSION_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
PORT=5000
NODE_ENV=development
```

6. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

7. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Supabase Setup

This application uses Supabase as the backend database. Here's how to set it up:

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Choose a region close to your users

2. **Get Database Connection String:**
   - Go to Settings → Database
   - Copy the "Connection string" under "Connection parameters"
   - Use the "URI" format for your `DATABASE_URL`

3. **Database Schema:**
   - The application will automatically create the required tables
   - Run `npm run db:migrate` to set up the schema
   - Tables include: `users`, `learning_modules`, `user_progress`, `quiz_results`

4. **Authentication:**
   - This app uses custom JWT authentication (not Supabase Auth)
   - User data is stored in the `users` table
   - Passwords are hashed with bcrypt

5. **Database Tables:**
   - `users` - User accounts and authentication
   - `learning_modules` - Course content and modules
   - `user_progress` - Individual progress tracking
   - `quiz_results` - Quiz scores and performance

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



