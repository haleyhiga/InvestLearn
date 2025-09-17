import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Clock, Star, Play, Trophy, Target, Search, Filter, Crown, Lock, Zap, TrendingUp, Database } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LearningModuleViewer from "@/components/LearningModuleViewer";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  estimatedTime: string;
  progress: number;
  completed: boolean;
  content?: any;
}

interface DailyUsage {
  date: string;
  modulesStarted: number;
  modulesCompleted: number;
  modulesRemaining: number;
  isLimitReached: boolean;
  isPremium: boolean;
}

interface Recommendations {
  skillLevel: string;
  recommendations: LearningModule[];
  completedCount: number;
  nextLevel: string;
}

export default function ModulesEnhanced() {
  const { isAuthenticated } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const generateModules = async () => {
    setIsGenerating(true);
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
        // Reload data to show new modules
        await loadData();
      } else {
        console.error('Failed to initialize modules');
      }
    } catch (error) {
      console.error('Error initializing modules:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadData = async () => {
    await Promise.all([
      loadModules(),
      loadRecommendations(),
      loadDailyUsage()
    ]);
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
        setRecommendations(data.recommendations);
      } else {
        // Fallback: show all modules if recommendations fail
        setRecommendations({
          skillLevel: 'beginner',
          recommendations: modules.slice(0, 6),
          completedCount: 0,
          nextLevel: 'intermediate'
        });
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fallback: show all modules if recommendations fail
      setRecommendations({
        skillLevel: 'beginner',
        recommendations: modules.slice(0, 6),
        completedCount: 0,
        nextLevel: 'intermediate'
      });
    }
  };

  const loadDailyUsage = async () => {
    try {
      const response = await fetch('/api/usage/daily', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDailyUsage(data.usage);
      }
    } catch (error) {
      console.error('Failed to load daily usage:', error);
    }
  };

  const handleStartModule = async (moduleId: string) => {
    try {
      // Track module start
      await fetch('/api/usage/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ action: 'module_started' }),
      });

      // Update daily usage
      await loadDailyUsage();
      
      // Find and set the selected module
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        setSelectedModule(module);
      }
    } catch (error: any) {
      if (error.message.includes('limit reached')) {
        setShowPremiumDialog(true);
      } else {
        console.error('Failed to start module:', error);
      }
    }
  };

  const handleModuleComplete = async (moduleId: string, score: number) => {
    try {
      // Update progress in backend
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          moduleId,
          progress: 100,
          completed: true,
        }),
      });

      // Update local state
      setModules(prev => prev.map(m => 
        m.id === moduleId 
          ? { ...m, progress: 100, completed: true }
          : m
      ));

      // Close module viewer
      setSelectedModule(null);
      
      // Reload data to update recommendations
      await loadData();
    } catch (error) {
      console.error('Failed to update module progress:', error);
    }
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
  };

  const handleContinueModule = async (moduleId: string) => {
    // Find and set the selected module
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || module.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "text-green-600";
      case "intermediate": return "text-yellow-600";
      case "advanced": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const completedModules = modules.filter(m => m.completed).length;
  const inProgressModules = modules.filter(m => m.progress > 0 && !m.completed).length;
  const totalPoints = completedModules * 50 + inProgressModules * 10;

  // If a module is selected, show the module viewer
  if (selectedModule) {
    return (
      <LearningModuleViewer
        module={selectedModule}
        onComplete={handleModuleComplete}
        onBack={handleBackToModules}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Modules</h1>
          <p className="text-muted-foreground">
            Master financial concepts through interactive learning modules
          </p>
        </div>
        <Button onClick={() => setShowPremiumDialog(true)} variant="outline">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>

      {/* Daily Usage Alert */}
      {dailyUsage && !dailyUsage.isPremium && (
        <Alert className={dailyUsage.isLimitReached ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
          <Target className="h-4 w-4" />
          <AlertDescription>
            {dailyUsage.isLimitReached ? (
              <div className="flex items-center justify-between">
                <span>Daily limit reached! You've used {dailyUsage.modulesStarted}/2 modules today.</span>
                <Button size="sm" onClick={() => setShowPremiumDialog(true)}>
                  Upgrade to Premium
                </Button>
              </div>
            ) : (
              `You have ${dailyUsage.modulesRemaining} modules remaining today (${dailyUsage.modulesStarted}/2 used)`
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Skill Level & Recommendations */}
      {recommendations && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Learning Journey
                </CardTitle>
                <p className="text-muted-foreground">
                  {recommendations.completedCount} modules completed
                </p>
              </div>
              <div className="text-right">
                <Badge className={`text-lg px-3 py-1 ${getSkillLevelColor(recommendations.skillLevel)}`}>
                  {recommendations.skillLevel.charAt(0).toUpperCase() + recommendations.skillLevel.slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Next: {recommendations.nextLevel}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold">Recommended for you:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.recommendations.slice(0, 3).map((module) => (
                  <Card key={module.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{module.title}</h4>
                        <Badge className={getDifficultyColor(module.difficulty)} size="sm">
                          {module.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.estimatedTime}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleStartModule(module.id)}
                          disabled={dailyUsage?.isLimitReached && !dailyUsage?.isPremium}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Modules</p>
                <p className="text-2xl font-bold">{modules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Points Earned</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            {["all", "beginner", "intermediate", "advanced"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                onClick={() => setSelectedDifficulty(difficulty)}
                className="capitalize"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules available</h3>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered learning modules to get started!
            </p>
            <Button onClick={generateModules} disabled={isGenerating}>
              <Database className="h-4 w-4 mr-2" />
              {isGenerating ? "Loading 15 Modules..." : "Load 15 Learning Modules"}
            </Button>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredModules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
                </div>
                {module.completed && (
                  <Trophy className="h-6 w-6 text-yellow-500" />
                )}
                {dailyUsage?.isLimitReached && !dailyUsage?.isPremium && !module.completed && (
                  <Lock className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{module.estimatedTime}</span>
              </div>
              
              {module.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>
              )}
              
              <Button 
                className="w-full" 
                variant={module.completed ? "outline" : "default"}
                onClick={() => module.progress > 0 ? handleContinueModule(module.id) : handleStartModule(module.id)}
                disabled={dailyUsage?.isLimitReached && !dailyUsage?.isPremium && !module.completed}
              >
                {module.completed ? (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Completed
                  </>
                ) : module.progress > 0 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </>
                ) : dailyUsage?.isLimitReached && !dailyUsage?.isPremium ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Premium Required
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Premium Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Upgrade to Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Unlock Unlimited Learning</h3>
              <p className="text-muted-foreground">
                Get unlimited access to all learning modules and premium features
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <span>Unlimited daily modules</span>
              </div>
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>Premium AI-generated content</span>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span>Exclusive achievements</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-green-500" />
                <span>Advanced learning paths</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">$9.99/month</div>
              <p className="text-sm text-muted-foreground">Cancel anytime</p>
            </div>
            
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setShowPremiumDialog(false)}>
                Start Free Trial
              </Button>
              <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
