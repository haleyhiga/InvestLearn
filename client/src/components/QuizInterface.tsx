import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizInterfaceProps {
  questions: QuizQuestion[];
  title: string;
  onComplete: (results: { correct: number; total: number; answers: Record<string, string> }) => void;
}

export default function QuizInterface({ questions, title, onComplete }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id];
  const isCorrect = answers[currentQuestion?.id] === currentQuestion?.correctAnswer;
  
  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      // Quiz completed
      const correct = questions.reduce((count, q) => 
        count + (answers[q.id] === q.correctAnswer ? 1 : 0), 0
      );
      setQuizCompleted(true);
      onComplete({ correct, total: questions.length, answers });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const progress = ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  if (quizCompleted) {
    const correctCount = questions.reduce((count, q) => 
      count + (answers[q.id] === q.correctAnswer ? 1 : 0), 0
    );
    const percentage = Math.round((correctCount / questions.length) * 100);
    
    return (
      <Card className="max-w-2xl mx-auto" data-testid="card-quiz-results">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary" data-testid="text-score-percentage">
              {percentage}%
            </div>
            <p className="text-lg text-muted-foreground" data-testid="text-score-summary">
              You got {correctCount} out of {questions.length} questions correct
            </p>
            <Badge 
              className={`text-lg px-4 py-2 ${
                percentage >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
              data-testid="badge-performance"
            >
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </Badge>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRestart} variant="outline" data-testid="button-retake">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={() => console.log('Continue learning')} data-testid="button-continue-learning">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto" data-testid="card-quiz-interface">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle data-testid="text-quiz-title">{title}</CardTitle>
          <Badge variant="outline" data-testid="text-question-counter">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="mt-2" data-testid="progress-quiz" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-start gap-2" data-testid={`text-question-${currentQuestion?.id}`}>
            <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
            {currentQuestion?.question}
          </h3>
          
          {currentQuestion?.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    !isAnswered ? "outline" :
                    option === currentQuestion.correctAnswer ? "default" :
                    option === answers[currentQuestion.id] ? "destructive" : 
                    "outline"
                  }
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => !isAnswered && handleAnswer(option)}
                  disabled={!!isAnswered}
                  data-testid={`button-option-${index}`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {isAnswered && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {isAnswered && option === answers[currentQuestion.id] && option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="flex-1">{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
          
          {currentQuestion?.type === 'fill-blank' && (
            <div className="space-y-4">
              <Input
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                disabled={!!showExplanation}
                data-testid="input-fill-blank"
              />
              {!showExplanation && (
                <Button 
                  onClick={() => handleAnswer(answers[currentQuestion.id] || '')}
                  disabled={!answers[currentQuestion.id]?.trim()}
                  data-testid="button-submit-answer"
                >
                  Submit Answer
                </Button>
              )}
            </div>
          )}
        </div>
        
        {showExplanation && (
          <Card className={`border-l-4 ${isCorrect ? 'border-l-green-500 bg-green-50 dark:bg-green-950' : 'border-l-red-500 bg-red-50 dark:bg-red-950'}`}>
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="space-y-2">
                  <p className="font-medium" data-testid="text-answer-feedback">
                    {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="text-explanation">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {showExplanation && (
          <div className="flex justify-end">
            <Button onClick={handleNext} data-testid="button-next-question">
              {currentQuestionIndex < questions.length - 1 ? (
                <>Next Question <ArrowRight className="h-4 w-4 ml-2" /></>
              ) : (
                'Finish Quiz'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}