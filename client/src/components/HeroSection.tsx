import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@assets/generated_images/Learning_hero_illustration_075fc319.png";

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export default function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Master Investments with
            <span className="block text-primary-foreground bg-primary/90 px-4 py-2 rounded-lg mt-2 backdrop-blur-sm">
              AI-Powered Learning
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto" data-testid="text-hero-description">
            Learn stocks, crypto, and interest rates through personalized paths, 
            interactive quizzes, and intelligent recommendations tailored to your progress.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary/90 backdrop-blur-sm border border-primary/20"
              onClick={onGetStarted}
              data-testid="button-get-started"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={onWatchDemo}
              data-testid="button-watch-demo"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="relative z-10 -mt-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/95 backdrop-blur-sm border-border/50" data-testid="card-feature-personalized">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized Learning</h3>
                <p className="text-muted-foreground text-sm">
                  AI adapts to your progress and suggests modules based on quiz performance
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/95 backdrop-blur-sm border-border/50" data-testid="card-feature-quizzes">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Generated Quizzes</h3>
                <p className="text-muted-foreground text-sm">
                  Dynamic quizzes created by AI to test your knowledge and reinforce learning
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/95 backdrop-blur-sm border-border/50" data-testid="card-feature-assistant">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">24/7 AI Assistant</h3>
                <p className="text-muted-foreground text-sm">
                  Get instant answers and explanations from your personal learning assistant
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}