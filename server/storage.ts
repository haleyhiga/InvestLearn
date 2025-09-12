import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";
import { 
  users, 
  learningModules, 
  userProgress, 
  quizResults,
  type User, 
  type InsertUser,
  type LearningModule,
  type InsertLearningModule,
  type UserProgress,
  type InsertUserProgress,
  type QuizResult,
  type InsertQuizResult
} from "@shared/schema";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Learning module methods
  getAllModules(): Promise<LearningModule[]>;
  getModule(id: string): Promise<LearningModule | undefined>;
  createModule(module: InsertLearningModule): Promise<LearningModule>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined>;
  updateProgress(data: InsertUserProgress): Promise<UserProgress>;

  // Quiz results methods
  getUserQuizResults(userId: string): Promise<QuizResult[]>;
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getUserStats(userId: string): Promise<{
    modulesCompleted: number;
    totalModules: number;
    averageScore: number;
    totalQuizzes: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { 
      ...user, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Learning module methods
  async getAllModules(): Promise<LearningModule[]> {
    return await db.select().from(learningModules).orderBy(learningModules.createdAt);
  }

  async getModule(id: string): Promise<LearningModule | undefined> {
    const result = await db.select().from(learningModules).where(eq(learningModules.id, id)).limit(1);
    return result[0];
  }

  async createModule(module: InsertLearningModule): Promise<LearningModule> {
    const id = randomUUID();
    const newModule = { 
      ...module, 
      id,
      createdAt: new Date()
    };
    const result = await db.insert(learningModules).values(newModule).returning();
    return result[0];
  }

  // User progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.updatedAt));
  }

  async getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined> {
    const result = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)))
      .limit(1);
    return result[0];
  }

  async updateProgress(data: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getModuleProgress(data.userId, data.moduleId);
    
    if (existing) {
      const result = await db
        .update(userProgress)
        .set({
          progress: data.progress,
          completed: data.completed,
          completedAt: data.completed ? new Date() : null,
          updatedAt: new Date()
        })
        .where(and(eq(userProgress.userId, data.userId), eq(userProgress.moduleId, data.moduleId)))
        .returning();
      return result[0];
    } else {
      const id = randomUUID();
      const newProgress = {
        ...data,
        id,
        startedAt: new Date(),
        completedAt: data.completed ? new Date() : null,
        updatedAt: new Date()
      };
      const result = await db.insert(userProgress).values(newProgress).returning();
      return result[0];
    }
  }

  // Quiz results methods
  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    return await db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.createdAt));
  }

  async saveQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = randomUUID();
    const newResult = {
      ...result,
      id,
      createdAt: new Date()
    };
    const dbResult = await db.insert(quizResults).values(newResult).returning();
    return dbResult[0];
  }

  async getUserStats(userId: string): Promise<{
    modulesCompleted: number;
    totalModules: number;
    averageScore: number;
    totalQuizzes: number;
  }> {
    const [progressData, quizData, totalModulesData] = await Promise.all([
      db.select().from(userProgress).where(eq(userProgress.userId, userId)),
      db.select().from(quizResults).where(eq(quizResults.userId, userId)),
      db.select().from(learningModules)
    ]);

    const modulesCompleted = progressData.filter(p => p.completed).length;
    const totalModules = totalModulesData.length;
    const totalQuizzes = quizData.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(quizData.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
      : 0;

    return {
      modulesCompleted,
      totalModules,
      averageScore,
      totalQuizzes
    };
  }
}

export const storage = new DatabaseStorage();
