import QuizInterface, { type QuizQuestion } from '../QuizInterface';

const sampleQuestions: QuizQuestion[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'What does P/E ratio stand for in stock analysis?',
    options: [
      'Price to Earnings ratio',
      'Profit to Expense ratio',
      'Portfolio to Equity ratio',
      'Performance to Evaluation ratio'
    ],
    correctAnswer: 'Price to Earnings ratio',
    explanation: 'The P/E ratio (Price-to-Earnings ratio) compares a company\'s stock price to its earnings per share, helping investors evaluate if a stock is overvalued or undervalued.'
  },
  {
    id: '2',
    type: 'fill-blank',
    question: 'Complete this sentence: "When interest rates increase, bond prices typically ______."',
    correctAnswer: 'decrease',
    explanation: 'When interest rates rise, existing bonds with lower interest rates become less attractive, causing their market prices to fall. This inverse relationship is a fundamental bond market principle.'
  },
  {
    id: '3',
    type: 'multiple-choice',
    question: 'What is the primary technology behind most cryptocurrencies?',
    options: [
      'Cloud computing',
      'Blockchain',
      'Artificial intelligence',
      'Quantum computing'
    ],
    correctAnswer: 'Blockchain',
    explanation: 'Blockchain is a distributed ledger technology that records transactions across multiple computers in a way that makes them difficult to alter, providing the foundation for most cryptocurrencies.'
  }
];

export default function QuizInterfaceExample() {
  const handleQuizComplete = (results: { correct: number; total: number; answers: Record<string, string> }) => {
    console.log('Quiz completed:', results);
  };

  return (
    <QuizInterface 
      questions={sampleQuestions}
      title="Investment Basics Quiz"
      onComplete={handleQuizComplete}
    />
  );
}