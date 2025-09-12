import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Clock, Award } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    modulesCompleted: number;
    totalModules: number;
    averageScore: number;
    totalStudyTime: string;
    currentStreak: number;
    achievements: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const completionRate = Math.round((stats.modulesCompleted / stats.totalModules) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card data-testid="card-completion-progress">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold" data-testid="text-completion-rate">
              {completionRate}%
            </div>
            <Progress value={completionRate} className="h-2" />
            <p className="text-xs text-muted-foreground" data-testid="text-modules-progress">
              {stats.modulesCompleted} of {stats.totalModules} modules completed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-average-score">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-average-score">
            {stats.averageScore}%
          </div>
          <Badge 
            className={`mt-2 ${
              stats.averageScore >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              stats.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}
          >
            {stats.averageScore >= 85 ? 'Excellent' : stats.averageScore >= 70 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </CardContent>
      </Card>

      <Card data-testid="card-study-time">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-study-time">
            {stats.totalStudyTime}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                {stats.currentStreak} day streak
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-achievements">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-achievements-count">
            {stats.achievements}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Badges earned
          </p>
        </CardContent>
      </Card>
    </div>
  );
}