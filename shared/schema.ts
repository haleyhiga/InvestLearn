import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for Supabase Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Learning modules table
export const learningModules = pgTable("learning_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  topic: varchar("topic", { length: 50 }).notNull(), // 'stocks', 'crypto', 'interest-rates'
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // 'beginner', 'intermediate', 'advanced'
  content: jsonb("content").notNull(), // Module content as JSON
  estimatedTime: text("estimated_time").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id").notNull().references(() => learningModules.id, { onDelete: "cascade" }),
  progress: integer("progress").notNull().default(0), // 0-100
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Quiz results tracking
export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: varchar("module_id").references(() => learningModules.id, { onDelete: "set null" }),
  quizType: varchar("quiz_type", { length: 20 }).notNull(), // 'module', 'ai-generated'
  questions: jsonb("questions").notNull(), // Quiz questions as JSON
  answers: jsonb("answers").notNull(), // User answers as JSON
  score: integer("score").notNull(), // Percentage score
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  avatarUrl: true,
});

export const insertLearningModuleSchema = createInsertSchema(learningModules);

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  moduleId: true,
  progress: true,
  completed: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LearningModule = typeof learningModules.$inferSelect;
export type InsertLearningModule = z.infer<typeof insertLearningModuleSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
