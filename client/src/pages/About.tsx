import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, TrendingUp, Users, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">


      
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold" data-testid="text-about-title">About InvestLearn</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered investment learning journey starts here. Master the fundamentals of investing 
          with personalized education and interactive quizzes.
        </p>
      </div>

       {/* Creator Information */}
       <Card data-testid="card-creator">
        <CardHeader>
          <CardTitle className="text-center">App Published by</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <img src="/snowboard.png" alt="Haley Higa" className="h-24 w-24 rounded-full object-cover" />
              </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Haley Higa</h3>
              <p className="text-lg text-muted-foreground">Full-Stack Developer & Financial Education Enthusiast</p>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate about creating accessible educational tools that empower individuals to take control 
                of their financial future. InvestLearn represents the intersection of technology, education, 
                and financial literacy.  Recent graduate of Utah Tech University with a Bachelor of Science in Computer Science.  Loves to code, snowboard, and surf in her free time.  Learn more about Haley on her website haleyhiga.com.
              </p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Badge variant="outline">React Developer</Badge>
              <Badge variant="outline">TypeScript</Badge>
              <Badge variant="outline">AI Integration</Badge>
              <Badge variant="outline">Financial Education</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Section */}
      <Card data-testid="card-mission">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            InvestLearn democratizes financial education by making investment concepts accessible, 
            engaging, and personalized. We believe everyone deserves the knowledge to make informed 
            financial decisions and build wealth through smart investing.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card data-testid="card-feature-ai">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI-Powered Learning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Our advanced AI creates personalized quizzes and learning paths based on your progress 
              and interests, ensuring optimal learning outcomes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Adaptive Quizzes</Badge>
              <Badge variant="secondary">Smart Recommendations</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-topics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Comprehensive Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Learn about stocks, cryptocurrency, interest rates, and more with structured modules 
              designed for all skill levels.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Stocks</Badge>
              <Badge variant="secondary">Crypto</Badge>
              <Badge variant="secondary">Interest Rates</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-tracking">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Progress Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Monitor your learning journey with detailed analytics, achievement badges, 
              and personalized insights to stay motivated.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Analytics</Badge>
              <Badge variant="secondary">Achievements</Badge>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-security">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Safe & Secure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Your data is protected with industry-standard security measures. We prioritize 
              privacy and never share your personal information.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Encrypted</Badge>
              <Badge variant="secondary">Privacy First</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Section */}
      <Card data-testid="card-community">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Join Our Community (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect with fellow learners, share insights, and grow your investment knowledge together. 
            Our supportive community is here to help you succeed on your financial journey.
          </p>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Use the AI Assistant (chat button) for personalized help and explanations 
              as you progress through your learning modules.
            </p>
          </div>
        </CardContent>
      </Card>

     
    </div>
  );
}