import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  Clock,
  Star,
  Award,
  BarChart3,
  PieChart
} from "lucide-react";
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
  progress?: number;
  completed?: boolean;
  completedAt?: string;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUserStats(),
        loadModules()
      ]);
    } catch (error) {
      console.error('Failed to load progress data:', error);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const completedModules = modules.filter(m => m.completed);
  const inProgressModules = modules.filter(m => m.progress && m.progress > 0 && !m.completed);
  const notStartedModules = modules.filter(m => !m.progress || m.progress === 0);

  const completionRate = stats && stats.totalModules > 0 ? (stats.completedModules / stats.totalModules) * 100 : 0;
  const averageProgress = stats && stats.averageProgress ? stats.averageProgress : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground">
          Track your learning journey and see how far you've come!
        </p>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedModules}</div>
              <p className="text-xs text-muted-foreground">
                out of {stats.totalModules} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                across all quizzes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bestScore || 0}%</div>
              <p className="text-xs text-muted-foreground">
                personal best
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                overall progress
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{averageProgress}%</span>
              </div>
              <Progress value={averageProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedModules.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{inProgressModules.length}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{notStartedModules.length}</div>
                <div className="text-xs text-muted-foreground">Not Started</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats && stats.totalQuizzes > 0 ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span>{stats.averageScore || 0}%</span>
                  </div>
                  <Progress value={stats.averageScore || 0} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                    <div className="text-xs text-muted-foreground">Quizzes Taken</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.bestScore || 0}%</div>
                    <div className="text-xs text-muted-foreground">Best Score</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quiz data available yet</p>
                <p className="text-sm text-muted-foreground">Take some quizzes to see your performance!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Module Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Module Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{module.title}</h3>
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {module.topic}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{module.progress || 0}%</div>
                      <Progress value={module.progress || 0} className="w-20 h-2" />
                    </div>
                    {module.completed && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No modules available</p>
              <p className="text-sm text-muted-foreground">Load some modules to start tracking your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
