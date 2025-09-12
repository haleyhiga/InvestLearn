import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import QuizInterface, { type QuizQuestion } from "@/components/QuizInterface";
import { Sparkles, Settings, BookOpen, Target, Clock } from "lucide-react";

// Mock generated quiz data - todo: remove mock functionality
const mockGeneratedQuiz: QuizQuestion[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What is the primary purpose of dollar-cost averaging in investment strategy?',
    options: [
      'To maximize returns in bull markets',
      'To reduce the impact of market volatility over time',
      'To minimize transaction fees',
      'To guarantee positive returns'
    ],
    correctAnswer: 'To reduce the impact of market volatility over time',
    explanation: 'Dollar-cost averaging helps smooth out the effects of market volatility by investing fixed amounts regularly, regardless of market conditions. This strategy reduces the average cost basis over time.'
  },
  {
    id: '2',
    type: 'fill-blank',
    question: 'The ______ is a measure of how much a stock\'s price moves relative to the overall market.',
    correctAnswer: 'beta',
    explanation: 'Beta measures a stock\'s volatility relative to the market. A beta of 1 means the stock moves with the market, above 1 means more volatile, and below 1 means less volatile.'
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'In cryptocurrency, what does "HODL" originally stand for?',
    options: [
      'Hold On for Dear Life',
      'Hold Original Digital Logic',
      'It\'s a misspelling of "hold"',
      'High Order Digital Ledger'
    ],
    correctAnswer: 'It\'s a misspelling of "hold"',
    explanation: 'HODL originated from a misspelled "hold" in a Bitcoin forum post in 2013. It has since become a popular investment strategy meaning to hold cryptocurrency long-term despite price volatility.'
  }
];

export default function AIQuizGenerator() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState([5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic || !difficulty) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation - todo: remove mock functionality and integrate OpenAI
    setTimeout(() => {
      setGeneratedQuiz(mockGeneratedQuiz.slice(0, questionCount[0]));
      setIsGenerating(false);
    }, 3000);
  };

  const handleQuizComplete = (results: { correct: number; total: number; answers: Record<string, string> }) => {
    console.log('Quiz results:', results);
    setQuizCompleted(true);
    // todo: remove mock functionality - save results and provide recommendations
  };

  const handleStartNew = () => {
    setGeneratedQuiz(null);
    setQuizCompleted(false);
    setTopic("");
    setDifficulty("");
  };

  if (generatedQuiz) {
    return (
      <div className="space-y-6" data-testid="page-ai-quiz-active">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleStartNew}
              data-testid="button-back-to-generator"
            >
              ← Back to Generator
            </Button>
            <Badge className="bg-primary/10 text-primary">
              AI Generated
            </Badge>
          </div>
        </div>
        
        <QuizInterface
          questions={generatedQuiz}
          title={`${topic} Quiz - ${difficulty} Level`}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-ai-quiz-generator">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" data-testid="text-generator-title">
            AI Quiz Generator
          </h1>
          <Badge className="bg-primary/10 text-primary flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            New
          </Badge>
        </div>
        <p className="text-muted-foreground" data-testid="text-generator-description">
          Generate personalized quizzes using AI based on your learning preferences and current progress
        </p>
      </div>

      {/* Generator Settings */}
      <Card data-testid="card-quiz-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Topic
            </label>
            <Select value={topic} onValueChange={setTopic} data-testid="select-quiz-topic">
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic for your quiz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stocks">Stock Market Investing</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
                <SelectItem value="interest-rates">Interest Rates & Bonds</SelectItem>
                <SelectItem value="portfolio">Portfolio Management</SelectItem>
                <SelectItem value="mixed">Mixed Topics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Difficulty Level
            </label>
            <Select value={difficulty} onValueChange={setDifficulty} data-testid="select-quiz-difficulty">
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - Basic concepts</SelectItem>
                <SelectItem value="intermediate">Intermediate - Applied knowledge</SelectItem>
                <SelectItem value="advanced">Advanced - Complex scenarios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Number of Questions: {questionCount[0]}
            </label>
            <div className="px-2">
              <Slider
                value={questionCount}
                onValueChange={setQuestionCount}
                max={10}
                min={3}
                step={1}
                className="w-full"
                data-testid="slider-question-count"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>3 questions</span>
                <span>10 questions</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated time: {Math.ceil(questionCount[0] * 1.5)} - {questionCount[0] * 2} minutes
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuiz}
            disabled={!topic || !difficulty || isGenerating}
            className="w-full"
            size="lg"
            data-testid="button-generate-quiz"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Features Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card data-testid="card-feature-personalized">
          <CardContent className="p-4 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Questions generated using advanced AI based on your learning level
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-adaptive">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Adaptive Difficulty</h3>
            <p className="text-sm text-muted-foreground">
              Difficulty adjusts based on your previous quiz performance
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-feature-instant">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Instant Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed explanations and learning recommendations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}