import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, BookOpen, Zap, Crown, Medal, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

export default function Achievements() {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/achievements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
        
        // Calculate total points
        const points = data.achievements?.reduce((sum: number, achievement: Achievement) => 
          achievement.earned ? sum + achievement.points : sum, 0) || 0;
        setTotalPoints(points);
        
        // Calculate user level (every 100 points = 1 level)
        setUserLevel(Math.floor(points / 100) + 1);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const getAchievementIcon = (icon: string) => {
    const iconMap: { [key: string]: any } = {
      '🎯': Target,
      '📚': BookOpen,
      '🏆': Trophy,
      '⭐': Star,
      '⚡': Zap,
      '👑': Crown,
      '🥇': Medal,
      '🏅': Award,
    };
    const IconComponent = iconMap[icon] || Trophy;
    return <IconComponent className="h-8 w-8" />;
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return "text-purple-600";
    if (level >= 5) return "text-blue-600";
    if (level >= 3) return "text-green-600";
    return "text-gray-600";
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return "Financial Master";
    if (level >= 5) return "Investment Expert";
    if (level >= 3) return "Learning Enthusiast";
    return "Getting Started";
  };

  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Track your learning progress and unlock rewards
        </p>
      </div>

      {/* User Level Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className={`h-6 w-6 ${getLevelColor(userLevel)}`} />
                <h2 className="text-2xl font-bold">Level {userLevel}</h2>
                <Badge variant="secondary" className={getLevelColor(userLevel)}>
                  {getLevelTitle(userLevel)}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {totalPoints} total points earned
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {totalPoints}
              </div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{totalPoints % 100}/100 points</span>
            </div>
            <Progress value={(totalPoints % 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">{earnedAchievements}/{totalAchievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {totalAchievements > 0 ? Math.round((earnedAchievements / totalAchievements) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-200 ${
                achievement.earned 
                  ? 'ring-2 ring-yellow-400 bg-yellow-50/50' 
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    achievement.earned 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <Badge variant={achievement.earned ? "default" : "secondary"}>
                        {achievement.points} pts
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1" 
                        />
                      </div>
                    )}
                    
                    {achievement.earned && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        <Trophy className="h-3 w-3" />
                        Earned!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      {earnedAchievements < totalAchievements && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Keep Learning!</h3>
            <p className="text-muted-foreground mb-4">
              You're making great progress. Complete more modules and quizzes to unlock new achievements!
            </p>
            <div className="text-sm text-muted-foreground">
              {totalAchievements - earnedAchievements} achievements remaining
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
