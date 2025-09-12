import { useState } from "react";
import DashboardStats from "@/components/DashboardStats";
import LearningModuleCard, { type LearningModuleData } from "@/components/LearningModuleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, Sparkles, ArrowRight } from "lucide-react";

// Mock data - todo: remove mock functionality
const mockStats = {
  modulesCompleted: 8,
  totalModules: 12,
  averageScore: 87,
  totalStudyTime: '24h',
  currentStreak: 5,
  achievements: 12,
};

const mockRecommendedModules: LearningModuleData[] = [
  {
    id: '1',
    title: 'Portfolio Diversification',
    description: 'Learn how to spread risk across different investment types and asset classes.',
    topic: 'stocks',
    difficulty: 'intermediate',
    progress: 0,
    estimatedTime: '35 min',
    rating: 4.7,
    completed: false,
  },
  {
    id: '2',
    title: 'DeFi Fundamentals',
    description: 'Understand decentralized finance protocols and yield farming strategies.',
    topic: 'crypto',
    difficulty: 'advanced',
    progress: 25,
    estimatedTime: '50 min',
    rating: 4.9,
    completed: false,
  },
];

const mockRecentModules: LearningModuleData[] = [
  {
    id: '3',
    title: 'Stock Market Basics',
    description: 'Master fundamental stock market concepts and terminology.',
    topic: 'stocks',
    difficulty: 'beginner',
    progress: 100,
    estimatedTime: '45 min',
    rating: 4.8,
    completed: true,
  },
];

export default function Dashboard() {
  const [modules] = useState([...mockRecommendedModules, ...mockRecentModules]);

  const handleStartModule = (moduleId: string) => {
    console.log('Starting module:', moduleId);
    // todo: remove mock functionality - navigate to module
  };

  const handleContinueModule = (moduleId: string) => {
    console.log('Continuing module:', moduleId);
    // todo: remove mock functionality - navigate to module
  };

  const handleGenerateQuiz = () => {
    console.log('Generating AI quiz');
    // todo: remove mock functionality - navigate to AI quiz generator
  };

  return (
    <div className="space-y-8" data-testid="page-dashboard">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="text-welcome-title">
          Welcome back to InvestLearn! 👋
        </h1>
        <p className="text-muted-foreground" data-testid="text-welcome-message">
          Continue your investment learning journey. You're doing great!
        </p>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={mockStats} />

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateQuiz} data-testid="button-generate-quiz">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Quiz
            </Button>
            <Button variant="outline" data-testid="button-browse-modules">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Modules
            </Button>
            <Button variant="outline" data-testid="button-view-progress">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold" data-testid="text-recommended-title">
            Recommended for You
          </h2>
          <Badge className="bg-primary/10 text-primary">
            Personalized by AI
          </Badge>
        </div>
        
        <div className="grid gap-4 lg:grid-cols-2">
          {mockRecommendedModules.map((module) => (
            <LearningModuleCard
              key={module.id}
              module={module}
              onStart={handleStartModule}
              onContinue={handleContinueModule}
            />
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold" data-testid="text-recent-title">
            Recently Completed
          </h2>
          <Button variant="ghost" size="sm" data-testid="button-view-all">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid gap-4 lg:grid-cols-2">
          {mockRecentModules.map((module) => (
            <LearningModuleCard
              key={module.id}
              module={module}
              onStart={handleStartModule}
              onContinue={handleContinueModule}
            />
          ))}
        </div>
      </div>
    </div>
  );
}