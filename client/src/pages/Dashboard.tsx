import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import LearningModuleCard, { type LearningModuleData } from "@/components/LearningModuleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, Sparkles, ArrowRight, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserStats {
  totalModules: number;
  completedModules: number;
  averageProgress: number;
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  estimatedTime: string;
  content: any;
  progress?: number;
  completed?: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [recommendations, setRecommendations] = useState<LearningModule[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUserStats(),
        loadModules(),
        loadRecommendations()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadModules = async () => {
    try {
      const response = await fetch('/api/modules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setModules(data.modules || []);
      }
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/modules/recommendations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations?.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const seedModules = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch('/api/modules/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Modules initialized:', data);
        // Reload dashboard data to show new modules
        await loadDashboardData();
      } else {
        console.error('Failed to initialize modules');
      }
    } catch (error) {
      console.error('Error initializing modules:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleStartModule = (moduleId: string) => {
    console.log('Starting module:', moduleId);
    // Navigate to modules page to start the module
    window.location.href = '/modules';
  };

  const handleContinueModule = (moduleId: string) => {
    console.log('Continuing module:', moduleId);
    // Navigate to modules page to continue the module
    window.location.href = '/modules';
  };

  const handleGenerateQuiz = () => {
    window.location.href = '/ai-quiz';
  };

  const handleViewProgress = () => {
    window.location.href = '/progress';
  };

  return (
    <div className="space-y-8" data-testid="page-dashboard">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="text-welcome-title">
          Welcome back, {user?.fullName || user?.email || 'Investor'}! 👋
        </h1>
        <p className="text-muted-foreground" data-testid="text-welcome-message">
          {stats ? 
            `You've completed ${stats.completedModules} modules and have an average score of ${stats.averageScore || 0}%. Keep up the great work!` :
            'Continue your investment learning journey. You\'re doing great!'
          }
        </p>
      </div>

      {/* Stats Overview */}
      {stats && <DashboardStats stats={{
        modulesCompleted: stats.completedModules || 0,
        totalModules: stats.totalModules || 0,
        averageScore: stats.averageScore || 0,
        totalStudyTime: '24h', // TODO: Calculate from actual data
        currentStreak: 5, // TODO: Calculate from actual data
        achievements: stats.completedModules || 0, // Use completed modules as achievements for now
      }} />}

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
            <Button onClick={seedModules} variant="outline" disabled={isSeeding}>
              <Database className="h-4 w-4 mr-2" />
              {isSeeding ? "Loading 15 Modules..." : "Load 15 Learning Modules"}
            </Button>
            <Button onClick={handleGenerateQuiz} data-testid="button-generate-quiz">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Quiz
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/modules'} data-testid="button-browse-modules">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Modules
            </Button>
            <Button variant="outline" onClick={handleViewProgress} data-testid="button-view-progress">
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
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.slice(0, 2).map((module) => (
              <LearningModuleCard
                key={module.id}
                module={{
                  id: module.id,
                  title: module.title,
                  description: module.description,
                  topic: module.topic,
                  difficulty: module.difficulty,
                  progress: module.progress || 0,
                  estimatedTime: module.estimatedTime,
                  rating: 4.5,
                  completed: module.completed || false,
                }}
                onStart={handleStartModule}
                onContinue={handleContinueModule}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No recommendations available. Complete some modules to get personalized recommendations!
            </div>
          )}
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
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : modules.length > 0 ? (
            modules.slice(0, 2).map((module) => (
              <LearningModuleCard
                key={module.id}
                module={{
                  id: module.id,
                  title: module.title,
                  description: module.description,
                  topic: module.topic,
                  difficulty: module.difficulty,
                  progress: module.progress || 0,
                  estimatedTime: module.estimatedTime,
                  rating: 4.5,
                  completed: module.completed || false,
                }}
                onStart={handleStartModule}
                onContinue={handleContinueModule}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              No modules available. Load some modules to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}