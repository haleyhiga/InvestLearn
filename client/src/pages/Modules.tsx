import { useState, useEffect } from "react";
import LearningModuleCard, { type LearningModuleData } from "@/components/LearningModuleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Coins, Percent, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
    description: 'Master how interest rates affect investments and learn about bond fundamentals and strategies.',
    topic: 'interest-rates',
    difficulty: 'intermediate',
    progress: 100,
    estimatedTime: '50 min',
    rating: 4.8,
    completed: true,
  },
  {
    id: '6',
    title: 'Central Bank Policy Impact',
    description: 'Understand how central bank decisions affect markets and investment opportunities.',
    topic: 'interest-rates',
    difficulty: 'advanced',
    progress: 0,
    estimatedTime: '55 min',
    rating: 4.5,
    completed: false,
  },
];

const topicFilters = [
  { key: 'all', label: 'All Topics', icon: null, count: mockModules.length },
  { key: 'stocks', label: 'Stocks', icon: TrendingUp, count: mockModules.filter(m => m.topic === 'stocks').length },
  { key: 'crypto', label: 'Crypto', icon: Coins, count: mockModules.filter(m => m.topic === 'crypto').length },
  { key: 'interest-rates', label: 'Interest Rates', icon: Percent, count: mockModules.filter(m => m.topic === 'interest-rates').length },
];

const difficultyFilters = [
  { key: 'all', label: 'All Levels' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

export default function Modules() {
  const { isAuthenticated } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadModules();
    }
  }, [isAuthenticated]);

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
    } finally {
      setLoading(false);
    }
  };
  
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === 'all' || module.topic === topicFilter;
    const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
    
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  const handleStartModule = (moduleId: string) => {
    console.log('Starting module:', moduleId);
    // todo: remove mock functionality - navigate to module content
  };

  const handleContinueModule = (moduleId: string) => {
    console.log('Continuing module:', moduleId);
    // todo: remove mock functionality - navigate to module content
  };

  return (
    <div className="space-y-6" data-testid="page-modules">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="text-modules-title">
          Learning Modules
        </h1>
        <p className="text-muted-foreground" data-testid="text-modules-description">
          Choose from our comprehensive library of investment education modules
        </p>
      </div>

      {/* Search and Filters */}
      <Card data-testid="card-filters">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-modules"
            />
          </div>

          {/* Topic Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <div className="flex flex-wrap gap-2">
              {topicFilters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Button
                    key={filter.key}
                    variant={topicFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopicFilter(filter.key)}
                    data-testid={`button-filter-${filter.key}`}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4 mr-1" />}
                    {filter.label}
                    <Badge variant="secondary" className="ml-2">
                      {filter.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficultyFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={difficultyFilter === filter.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficultyFilter(filter.key)}
                  data-testid={`button-difficulty-${filter.key}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" data-testid="text-results-count">
            {filteredModules.length} Module{filteredModules.length !== 1 ? 's' : ''} Found
          </h2>
        </div>
        
        <div className="grid gap-4 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading modules...</p>
              </div>
            </div>
          ) : filteredModules.length > 0 ? (
            filteredModules.map((module) => (
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
                  rating: 4.5, // Default rating
                  completed: module.completed || false,
                }}
                onStart={handleStartModule}
                onContinue={handleContinueModule}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No modules found</h3>
              <p className="text-muted-foreground">
                {searchQuery || topicFilter !== 'all' || difficultyFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No modules available. Load some modules to get started!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}