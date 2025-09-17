import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql, and } from "drizzle-orm";
import * as schema from "../shared/schema";

// Create a connection pool to Supabase Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Drizzle instance
export const db = drizzle(pool, { schema });

// Example helper methods
export class DatabaseStorage {
  // Get user by email
  async getUserByEmail(email: string) {
    const result = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });
    return result;
  }

  // Get user by ID
  async getUser(userId: string) {
    const result = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });
    return result;
  }

  // Create new user
  async createUser(data: {
    email: string;
    passwordHash: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  }) {
    const result = await db
      .insert(schema.users)
      .values(data)
      .returning();
    return result[0];
  }

  // Get user stats
  async getUserStats(userId: string) {
    // Get basic user progress stats
    const progressStats = await db
      .select({
        totalModules: sql<number>`count(*)::int`,
        completedModules: sql<number>`count(case when completed = true then 1 end)::int`,
        averageProgress: sql<number>`avg(progress)::int`,
      })
      .from(schema.userProgress)
      .where(eq(schema.userProgress.userId, userId));

    // Get quiz stats
    const quizStats = await db
      .select({
        totalQuizzes: sql<number>`count(*)::int`,
        averageScore: sql<number>`avg(score)::int`,
        bestScore: sql<number>`max(score)::int`,
      })
      .from(schema.quizResults)
      .where(eq(schema.quizResults.userId, userId));

    return {
      ...progressStats[0],
      ...quizStats[0],
    };
  }

  // Get all learning modules
  async getAllModules() {
    return await db.select().from(schema.learningModules);
  }

  // Create a new learning module
  async createLearningModule(data: {
    title: string;
    description: string;
    topic: string;
    difficulty: string;
    content: any;
    estimatedTime: string;
  }) {
    const result = await db
      .insert(schema.learningModules)
      .values({
        title: data.title,
        description: data.description,
        topic: data.topic,
        difficulty: data.difficulty,
        content: data.content,
        estimatedTime: data.estimatedTime,
      })
      .returning();
    return result[0];
  }

  // Get user progress
  async getUserProgress(userId: string) {
    return await db
      .select()
      .from(schema.userProgress)
      .where(eq(schema.userProgress.userId, userId));
  }

  // Update user progress
  async updateUserProgress(data: {
    userId: string;
    moduleId: string;
    progress: number;
    completed: boolean;
  }) {
    // Check if progress already exists
    const existing = await db
      .select()
      .from(schema.userProgress)
      .where(and(
        eq(schema.userProgress.userId, data.userId),
        eq(schema.userProgress.moduleId, data.moduleId)
      ))
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      const result = await db
        .update(schema.userProgress)
        .set({
          progress: data.progress,
          completed: data.completed,
          completedAt: data.completed ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(and(
          eq(schema.userProgress.userId, data.userId),
          eq(schema.userProgress.moduleId, data.moduleId)
        ))
        .returning();
      return result[0];
    } else {
      // Create new progress
      const result = await db
        .insert(schema.userProgress)
        .values({
          userId: data.userId,
          moduleId: data.moduleId,
          progress: data.progress,
          completed: data.completed,
          completedAt: data.completed ? new Date() : null,
        })
        .returning();
      return result[0];
    }
  }

  // Check for new achievements
  async checkAchievements(userId: string) {
    const achievements = [];
    
    // Get user progress stats
    const progressStats = await this.getUserStats(userId);
    
    // First module completed
    if (progressStats.completedModules >= 1) {
      achievements.push({
        id: 'first-module',
        title: 'Getting Started',
        description: 'Completed your first learning module!',
        icon: '🎯',
        points: 10,
      });
    }
    
    // 5 modules completed
    if (progressStats.completedModules >= 5) {
      achievements.push({
        id: 'dedicated-learner',
        title: 'Dedicated Learner',
        description: 'Completed 5 learning modules!',
        icon: '📚',
        points: 50,
      });
    }
    
    // 10 modules completed
    if (progressStats.completedModules >= 10) {
      achievements.push({
        id: 'knowledge-master',
        title: 'Knowledge Master',
        description: 'Completed 10 learning modules!',
        icon: '🏆',
        points: 100,
      });
    }
    
    // Perfect quiz score
    if (progressStats.bestScore >= 100) {
      achievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieved a perfect quiz score!',
        icon: '⭐',
        points: 25,
      });
    }
    
    return achievements;
  }

  // Get user achievements
  async getUserAchievements(userId: string) {
    // For now, return all possible achievements
    // In a real app, you'd store earned achievements in a separate table
    return await this.checkAchievements(userId);
  }

  // Daily usage tracking
  async getDailyUsage(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's usage from user progress
    const todayProgress = await db
      .select()
      .from(schema.userProgress)
      .where(and(
        eq(schema.userProgress.userId, userId),
        sql`DATE(updated_at) = ${today}`
      ));

    const modulesStarted = todayProgress.length;
    const modulesCompleted = todayProgress.filter((p: any) => p.completed).length;
    
    return {
      date: today,
      modulesStarted,
      modulesCompleted,
      modulesRemaining: Math.max(0, 2 - modulesStarted),
      isLimitReached: modulesStarted >= 2,
      isPremium: false // Will be implemented later
    };
  }

  async trackDailyUsage(userId: string, action: string) {
    const usage = await this.getDailyUsage(userId);
    
    if (action === 'module_started' && usage.isLimitReached && !usage.isPremium) {
      throw new Error('Daily module limit reached. Upgrade to premium for unlimited access.');
    }
    
    return usage;
  }

  // Module recommendations based on user level
  async getModuleRecommendations(userId: string) {
    try {
      // Get user's completed modules to determine skill level
      const userProgress = await this.getUserProgress(userId);
      const completedModules = userProgress.filter(p => p.completed);
      
      // Determine user skill level
      let skillLevel = 'beginner';
      if (completedModules.length >= 5) {
        skillLevel = 'advanced';
      } else if (completedModules.length >= 2) {
        skillLevel = 'intermediate';
      }

      // Get all modules
      const allModules = await this.getAllModules();
      
      // Filter modules based on skill level and completion status
      const completedModuleIds = completedModules.map(p => p.moduleId);
      const availableModules = allModules.filter(m => !completedModuleIds.includes(m.id));
      
      // Recommend modules based on skill level
      const recommendations = availableModules.filter(m => {
        if (skillLevel === 'beginner') {
          return m.difficulty === 'beginner';
        } else if (skillLevel === 'intermediate') {
          return m.difficulty === 'intermediate' || m.difficulty === 'beginner';
        } else {
          return true; // Advanced users can access all modules
        }
      });

      return {
        skillLevel,
        recommendations: recommendations.slice(0, 6), // Limit to 6 recommendations
        completedCount: completedModules.length,
        nextLevel: skillLevel === 'beginner' ? 'intermediate' : 
                   skillLevel === 'intermediate' ? 'advanced' : 'expert'
      };
    } catch (error) {
      console.error('Error getting module recommendations:', error);
      return {
        skillLevel: 'beginner',
        recommendations: [],
        completedCount: 0,
        nextLevel: 'intermediate'
      };
    }
  }

  // Example: get all users
  async getAllUsers() {
    return await db.select().from(schema.users);
  }
}

// ✅ Export a ready-to-use instance
export const storage = new DatabaseStorage();