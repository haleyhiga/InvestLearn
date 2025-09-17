import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Clock, Target, CheckCircle, Star, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  estimatedTime: string;
  content: {
    objectives: string[];
    content: Array<{
      section: string;
      text: string;
      examples: string[];
    }>;
    keyTakeaways: string[];
    practiceQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
    resources: string[];
  };
}

interface LearningModuleViewerProps {
  module: LearningModule;
  onComplete: (moduleId: string, score: number) => void;
  onBack: () => void;
}

export default function LearningModuleViewer({ module, onComplete, onBack }: LearningModuleViewerProps) {
  const { isAuthenticated } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<boolean[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    // Initialize completed sections array
    setCompletedSections(new Array(module.content.content.length).fill(false));
    setQuizAnswers(new Array(module.content.practiceQuestions.length).fill(-1));
  }, [module]);

  const handleSectionComplete = (sectionIndex: number) => {
    const newCompleted = [...completedSections];
    newCompleted[sectionIndex] = true;
    setCompletedSections(newCompleted);
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const calculateProgress = () => {
    const completedCount = completedSections.filter(Boolean).length;
    return Math.round((completedCount / module.content.content.length) * 100);
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    module.content.practiceQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / module.content.practiceQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    // Update progress in backend
    updateProgress(100, true);
    onComplete(module.id, score);
  };

  const updateProgress = async (progress: number, completed: boolean) => {
    try {
      await fetch('/api/progress/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          moduleId: module.id,
          progress,
          completed,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const progress = calculateProgress();

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setShowQuiz(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content
          </Button>
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Practice Quiz
            </CardTitle>
            <p className="text-muted-foreground">
              Test your knowledge with these practice questions
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {module.content.practiceQuestions.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Question {questionIndex + 1}: {question.question}
                </h3>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Checkbox
                        id={`q${questionIndex}-a${optionIndex}`}
                        checked={quizAnswers[questionIndex] === optionIndex}
                        onCheckedChange={() => handleQuizAnswer(questionIndex, optionIndex)}
                      />
                      <label
                        htmlFor={`q${questionIndex}-a${optionIndex}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {quizSubmitted && (
                  <div className={`p-3 rounded-md ${
                    quizAnswers[questionIndex] === question.correctAnswer 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    <p className="text-sm font-medium">
                      {quizAnswers[questionIndex] === question.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-sm">{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {!quizSubmitted ? (
              <Button onClick={handleQuizSubmit} className="w-full">
                Submit Quiz
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold">
                  Quiz Score: {quizScore}%
                </div>
                <div className="flex items-center justify-center gap-2">
                  {quizScore >= 80 ? (
                    <>
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <span className="text-lg font-semibold text-green-600">Excellent!</span>
                    </>
                  ) : quizScore >= 60 ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                      <span className="text-lg font-semibold text-blue-600">Good job!</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-6 w-6 text-orange-500" />
                      <span className="text-lg font-semibold text-orange-600">Keep studying!</span>
                    </>
                  )}
                </div>
                <Button onClick={onBack} className="w-full">
                  Back to Modules
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Button>
        <Badge className={getDifficultyColor(module.difficulty)}>
          {module.difficulty}
        </Badge>
      </div>

      {/* Module Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{module.title}</CardTitle>
          <p className="text-muted-foreground">{module.description}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {module.estimatedTime}
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {module.content.objectives.length} objectives
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {module.content.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-6">
        {module.content.content.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {index + 1}. {section.section}
                </CardTitle>
                {completedSections[index] && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {section.text}
                </p>
              </div>
              
              {section.examples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Examples:</h4>
                  <ul className="space-y-1">
                    {section.examples.map((example, exampleIndex) => (
                      <li key={exampleIndex} className="text-sm text-muted-foreground">
                        • {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!completedSections[index] && (
                <Button 
                  onClick={() => handleSectionComplete(index)}
                  className="w-full"
                >
                  Mark as Complete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Takeaways */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {module.content.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{takeaway}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Practice Quiz Button */}
      {progress === 100 && (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready for the Quiz?</h3>
            <p className="text-muted-foreground mb-4">
              Test your knowledge with practice questions
            </p>
            <Button onClick={() => setShowQuiz(true)} size="lg">
              <Target className="h-4 w-4 mr-2" />
              Start Practice Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
