import DashboardStats from '../DashboardStats';

const sampleStats = {
  modulesCompleted: 8,
  totalModules: 12,
  averageScore: 87,
  totalStudyTime: '24h',
  currentStreak: 5,
  achievements: 12,
};

export default function DashboardStatsExample() {
  return <DashboardStats stats={sampleStats} />;
}