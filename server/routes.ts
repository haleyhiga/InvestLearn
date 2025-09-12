import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-jwt-secret-for-dev";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded as { userId: string; email: string };
    next();
  });
};

// Auth schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user with hashed password
      const userData = {
        email: validatedData.email,
        passwordHash: hashedPassword,
        fullName: validatedData.fullName,
        avatarUrl: validatedData.avatarUrl,
      };
      
      const user = await storage.createUser(userData);
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({ user, token });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ user, token });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Session validation endpoint
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Protected routes
  app.get("/api/user/profile", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get("/api/user/stats", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const stats = await storage.getUserStats(req.user.userId);
      res.json({ stats });
    } catch (error) {
      console.error("Stats fetch error:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Learning modules routes
  app.get("/api/modules", authenticateToken, async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json({ modules });
    } catch (error) {
      console.error("Modules fetch error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.get("/api/user/progress", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const progress = await storage.getUserProgress(req.user.userId);
      res.json({ progress });
    } catch (error) {
      console.error("Progress fetch error:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}