import { useState } from "react";
import LearningModuleCard, { type LearningModuleData } from "@/components/LearningModuleCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Coins, Percent } from "lucide-react";

// Mock data - todo: remove mock functionality
const mockModules: LearningModuleData[] = [
  {
    id: '1',
    title: 'Stock Market Fundamentals',
    description: 'Learn the basics of stock market investing, including how to read financial statements and evaluate companies.',
    topic: 'stocks',
    difficulty: 'beginner',
    progress: 100,
    estimatedTime: '45 min',
    rating: 4.8,
    completed: true,
  },
  {
    id: '2',
    title: 'Technical Analysis Basics',
    description: 'Understand chart patterns, indicators, and technical analysis tools for better trading decisions.',
    topic: 'stocks',
    difficulty: 'intermediate',
    progress: 65,
    estimatedTime: '60 min',
    rating: 4.6,
    completed: false,
  },
  {
    id: '3',
    title: 'Cryptocurrency Introduction',
    description: 'Explore the world of digital currencies, blockchain technology, and crypto investment strategies.',
    topic: 'crypto',
    difficulty: 'beginner',
    progress: 0,
    estimatedTime: '40 min',
    rating: 4.7,
    completed: false,
  },
  {
    id: '4',
    title: 'DeFi and Yield Farming',
    description: 'Advanced concepts in decentralized finance, liquidity pools, and earning yield on crypto assets.',
    topic: 'crypto',
    difficulty: 'advanced',
    progress: 30,
    estimatedTime: '75 min',
    rating: 4.9,
    completed: false,
  },
  {
    id: '5',
    title: 'Interest Rates & Bonds',
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
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  
  const filteredModules = mockModules.filter(module => {
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
          {filteredModules.map((module) => (
            <LearningModuleCard
              key={module.id}
              module={module}
              onStart={handleStartModule}
              onContinue={handleContinueModule}
            />
          ))}
        </div>
        
        {filteredModules.length === 0 && (
          <Card className="text-center py-8" data-testid="card-no-results">
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No modules found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}