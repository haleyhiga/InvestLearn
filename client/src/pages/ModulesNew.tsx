import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Clock, Star, Play, Trophy, Target, Plus, Sparkles, Zap, Search, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

export default function ModulesNew() {
  const { isAuthenticated } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newModule, setNewModule] = useState({
    topic: "",
    difficulty: "beginner",
    estimatedTime: "15 minutes"
  });

  // Load modules on component mount
  useEffect(() => {
    loadModules();
  }, []);

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

  const generateModule = async () => {
    if (!newModule.topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/modules/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(newModule),
      });

      if (response.ok) {
        const data = await response.json();
        setModules(prev => [data.module, ...prev]);
        setShowCreateDialog(false);
        setNewModule({ topic: "", difficulty: "beginner", estimatedTime: "15 minutes" });
      } else {
        throw new Error('Failed to generate module');
      }
    } catch (error) {
      console.error('Failed to generate module:', error);
    } finally {
      setIsGenerating(false);
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

  const completedModules = modules.filter(m => m.completed).length;
  const inProgressModules = modules.filter(m => m.progress > 0 && !m.completed).length;
  const totalPoints = completedModules * 50 + inProgressModules * 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-modules-title">Learning Modules</h1>
          <p className="text-muted-foreground" data-testid="text-modules-subtitle">
            Master financial concepts through AI-powered interactive learning modules
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-module">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate AI Learning Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Compound Interest, Stock Analysis, Portfolio Diversification"
                  value={newModule.topic}
                  onChange={(e) => setNewModule(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={newModule.difficulty} onValueChange={(value) => setNewModule(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time">Estimated Time</Label>
                <Select value={newModule.estimatedTime} onValueChange={(value) => setNewModule(prev => ({ ...prev, estimatedTime: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 minutes">10 minutes</SelectItem>
                    <SelectItem value="15 minutes">15 minutes</SelectItem>
                    <SelectItem value="20 minutes">20 minutes</SelectItem>
                    <SelectItem value="25 minutes">25 minutes</SelectItem>
                    <SelectItem value="30 minutes">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={generateModule} 
                disabled={!newModule.topic.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Module
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
        {filteredModules.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground mb-4">Generate your first AI-powered learning module!</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Module
            </Button>
          </div>
        ) : (
          filteredModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">
                      {module.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                  </div>
                  {module.completed && (
                    <Trophy className="h-6 w-6 text-yellow-500" />
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  variant={module.completed ? "outline" : "default"}
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
    </div>
  );
}
