# Investment Learning Platform

## Overview

InvestLearn is an AI-powered educational platform designed to teach investment concepts through structured learning modules, interactive quizzes, and personalized AI assistance. The platform focuses on three core investment topics: stocks, cryptocurrency, and interest rates. Built with a modern full-stack architecture using React, Express, and PostgreSQL, it provides gamified learning experiences with progress tracking, achievement systems, and intelligent content recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Authentication**: JWT-based authentication with React Context for global auth state

### Backend Architecture
- **Runtime**: Node.js with TypeScript and ESM modules
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Database**: PostgreSQL (configured for Neon Database serverless)

### Design System
- **Color Scheme**: Educational blue primary (#1e3a8a) with success green accents, supporting both light and dark themes
- **Typography**: Inter for UI text, JetBrains Mono for code/numbers
- **Layout**: Card-based design with Khan Academy-inspired educational aesthetics
- **Responsive**: Mobile-first design with Tailwind's responsive utilities

### Data Architecture
The database schema supports:
- **User Management**: Custom authentication with user profiles and avatars
- **Learning Content**: Modular course structure with JSON-based content storage
- **Progress Tracking**: Individual user progress per module with completion states
- **Assessment System**: Quiz results tracking with detailed answer analysis
- **Gamification**: Achievement system and progress statistics

### Key Features
- **Adaptive Learning**: AI-generated quizzes based on user progress and topic preferences
- **Interactive Components**: Quiz interfaces with multiple choice and fill-in-the-blank questions
- **Progress Visualization**: Dashboard with completion rates, average scores, and streak tracking
- **AI Assistant**: Contextual chatbot for explaining concepts and providing learning support
- **Content Management**: Structured learning modules organized by topic and difficulty level

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide Icons**: Consistent icon library for UI elements
- **Google Fonts**: Inter and JetBrains Mono font families

### Development Tools
- **Vite**: Fast build tool with HMR for development
- **TypeScript**: Static type checking for both frontend and backend
- **ESBuild**: Fast bundling for production builds
- **React Hook Form**: Form validation and management with Zod schemas

### Authentication and Security
- **bcrypt**: Password hashing for secure user authentication
- **jsonwebtoken**: JWT token generation and validation
- **Zod**: Schema validation for API inputs and form data

### State and Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Context**: Global authentication and theme state management