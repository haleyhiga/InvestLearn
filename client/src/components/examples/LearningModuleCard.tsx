import LearningModuleCard, { type LearningModuleData } from '../LearningModuleCard';

const sampleModules: LearningModuleData[] = [
  {
    id: '1',
    title: 'Stock Market Basics',
    description: 'Learn fundamental concepts of stock investing, market terminology, and how to evaluate companies.',
    topic: 'stocks',
    difficulty: 'beginner',
    progress: 0,
    estimatedTime: '45 min',
    rating: 4.8,
    completed: false,
  },
  {
    id: '2', 
    title: 'Understanding Cryptocurrency',
    description: 'Explore digital currencies, blockchain technology, and crypto investment strategies.',
    topic: 'crypto',
    difficulty: 'intermediate',
    progress: 65,
    estimatedTime: '60 min',
    rating: 4.6,
    completed: false,
  },
  {
    id: '3',
    title: 'Interest Rates & Bonds',
    description: 'Master how interest rates affect investments and learn about bond fundamentals.',
    topic: 'interest-rates',
    difficulty: 'advanced',
    progress: 100,
    estimatedTime: '30 min',
    rating: 4.9,
    completed: true,
  },
];

export default function LearningModuleCardExample() {
  const handleStart = (moduleId: string) => {
    console.log('Starting module:', moduleId);
  };

  const handleContinue = (moduleId: string) => {
    console.log('Continuing module:', moduleId);
  };

  return (
    <div className="grid gap-4 max-w-2xl">
      {sampleModules.map((module) => (
        <LearningModuleCard 
          key={module.id}
          module={module}
          onStart={handleStart}
          onContinue={handleContinue}
        />
      ))}
    </div>
  );
}