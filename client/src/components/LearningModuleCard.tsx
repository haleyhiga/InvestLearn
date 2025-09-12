import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Coins, Percent, Clock, Star } from "lucide-react";

export interface LearningModuleData {
  id: string;
  title: string;
  description: string;
  topic: 'stocks' | 'crypto' | 'interest-rates';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  estimatedTime: string;
  rating: number;
  completed: boolean;
}

interface LearningModuleCardProps {
  module: LearningModuleData;
  onStart: (moduleId: string) => void;
  onContinue: (moduleId: string) => void;
}

const topicIcons = {
  stocks: TrendingUp,
  crypto: Coins,
  'interest-rates': Percent,
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function LearningModuleCard({ module, onStart, onContinue }: LearningModuleCardProps) {
  const IconComponent = topicIcons[module.topic];
  
  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`card-module-${module.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold" data-testid={`text-title-${module.id}`}>
                {module.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={difficultyColors[module.difficulty]}>
                  {module.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  <span data-testid={`text-rating-${module.id}`}>{module.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm" data-testid={`text-description-${module.id}`}>
          {module.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-progress-${module.id}`}>{module.progress}%</span>
          </div>
          <Progress value={module.progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-time-${module.id}`}>{module.estimatedTime}</span>
          </div>
          
          {module.progress === 0 ? (
            <Button 
              onClick={() => onStart(module.id)} 
              size="sm"
              data-testid={`button-start-${module.id}`}
            >
              Start Learning
            </Button>
          ) : module.completed ? (
            <Button 
              onClick={() => onContinue(module.id)} 
              variant="outline" 
              size="sm"
              data-testid={`button-review-${module.id}`}
            >
              Review
            </Button>
          ) : (
            <Button 
              onClick={() => onContinue(module.id)} 
              size="sm"
              data-testid={`button-continue-${module.id}`}
            >
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}