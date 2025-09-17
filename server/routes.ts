import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "fallback-jwt-secret-for-dev";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded as { userId: string; email: string };
    next();
  });
};

// --- Auth schemas ---
// API-level schema: what client sends
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6), // plain password, not stored
  fullName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

// --- Routes ---
export async function registerRoutes(app: Express): Promise<Server> {
  // --- Register ---
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

      // Build DB user data
      const userData = {
        email: validatedData.email,
        passwordHash: hashedPassword, // ✅ guaranteed
        fullName: validatedData.fullName ?? null,
        avatarUrl: validatedData.avatarUrl ?? null,
      };

      const user = await storage.createUser(userData);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // --- Login ---
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        validatedData.password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ user, token });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // --- Session validation ---
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

  // --- Protected user routes ---
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

  // --- Learning modules ---
  app.get("/api/modules", authenticateToken, async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json({ modules, count: modules.length });
    } catch (error) {
      console.error("Modules fetch error:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  // Check if modules exist
  app.get("/api/modules/status", async (req, res) => {
    try {
      const modules = await storage.getAllModules();
      res.json({ 
        hasModules: modules.length > 0,
        count: modules.length,
        needsGeneration: modules.length === 0
      });
    } catch (error) {
      console.error("Module status error:", error);
      res.status(500).json({ message: "Failed to check module status" });
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

  // --- Gamification ---
  app.post("/api/progress/update", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { moduleId, progress, completed } = req.body;
      
      // Update or create user progress
      const userProgress = await storage.updateUserProgress({
        userId: req.user.userId,
        moduleId,
        progress: Math.min(progress, 100),
        completed: completed || false,
      });

      // Check for achievements
      const achievements = await storage.checkAchievements(req.user.userId);

      res.json({ 
        progress: userProgress,
        achievements: achievements
      });
    } catch (error) {
      console.error("Progress update error:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get("/api/achievements", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const achievements = await storage.getUserAchievements(req.user.userId);
      res.json({ achievements });
    } catch (error) {
      console.error("Achievements fetch error:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // --- Daily Usage Tracking ---
  app.get("/api/usage/daily", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const usage = await storage.getDailyUsage(req.user.userId);
      res.json({ usage });
    } catch (error) {
      console.error("Daily usage fetch error:", error);
      res.status(500).json({ message: "Failed to fetch daily usage" });
    }
  });

  app.post("/api/usage/track", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { action } = req.body; // 'module_started' or 'module_completed'
      const usage = await storage.trackDailyUsage(req.user.userId, action);
      res.json({ usage });
    } catch (error) {
      console.error("Usage tracking error:", error);
      res.status(500).json({ message: "Failed to track usage" });
    }
  });

  // --- Module Recommendations ---
  app.get("/api/modules/recommendations", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const recommendations = await storage.getModuleRecommendations(req.user.userId);
      res.json({ recommendations });
    } catch (error) {
      console.error("Recommendations fetch error:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // --- Learning Modules ---
  const generateModuleSchema = z.object({
    topic: z.string().min(1).max(100),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTime: z.string().optional().default("15 minutes"),
  });

  // Initialize hardcoded modules
  app.post("/api/modules/initialize", authenticateToken, async (req, res) => {
    try {
      // Check if modules already exist
      const existingModules = await storage.getAllModules();
      if (existingModules.length > 0) {
        return res.json({ message: "Modules already initialized", modules: existingModules });
      }

      // Import hardcoded modules
      const { hardcodedModules } = await import('./modules-data');

      // Create all modules
      const createdModules = [];
      for (const moduleData of hardcodedModules) {
        const module = await storage.createLearningModule(moduleData);
        createdModules.push(module);
      }

      res.json({ 
        message: "Hardcoded modules initialized successfully", 
        modules: createdModules,
        count: createdModules.length
      });
    } catch (error) {
      console.error("Module initialization error:", error);
      res.status(500).json({ message: "Failed to initialize modules" });
    }
  });

  // Seed premade modules
  app.post("/api/modules/seed", authenticateToken, async (req, res) => {
    try {
      const premadeModules = [
        {
          title: "Introduction to Investing",
          description: "Learn the fundamentals of investing and how to get started with your first investment.",
          topic: "investing-basics",
          difficulty: "beginner",
          estimatedTime: "20 minutes",
          content: {
            objectives: [
              "Understand what investing means and why it's important",
              "Learn about different types of investments",
              "Know how to start investing with small amounts",
              "Understand the concept of risk vs return"
            ],
            content: [
              {
                section: "What is Investing?",
                text: "Investing is the act of putting money into financial schemes, shares, property, or a commercial venture with the expectation of achieving a profit. Unlike saving, which preserves your money, investing aims to grow your wealth over time through compound interest and capital appreciation.",
                examples: [
                  "Buying stocks of companies you believe will grow",
                  "Investing in real estate properties",
                  "Putting money into retirement accounts like 401(k)s"
                ]
              },
              {
                section: "Types of Investments",
                text: "There are several main types of investments: stocks (ownership in companies), bonds (loans to governments or corporations), mutual funds (collections of stocks and bonds), ETFs (exchange-traded funds), and real estate. Each has different risk levels and potential returns.",
                examples: [
                  "Stocks: Apple, Microsoft, Tesla shares",
                  "Bonds: US Treasury bonds, corporate bonds",
                  "Mutual Funds: S&P 500 index funds"
                ]
              }
            ],
            keyTakeaways: [
              "Start investing early to benefit from compound interest",
              "Diversify your investments to reduce risk",
              "Only invest money you can afford to lose",
              "Consider your risk tolerance and investment timeline"
            ],
            practiceQuestions: [
              {
                question: "What is the main difference between saving and investing?",
                options: [
                  "Saving preserves money, investing aims to grow it",
                  "There is no difference",
                  "Saving is riskier than investing",
                  "Investing is only for rich people"
                ],
                correctAnswer: 0,
                explanation: "Saving preserves your money in safe accounts, while investing aims to grow your wealth over time through various financial instruments."
              }
            ],
            resources: [
              "Investopedia: Introduction to Investing",
              "SEC: Investor.gov - Getting Started"
            ]
          }
        },
        {
          title: "Understanding Stocks",
          description: "Dive deep into how stocks work, what affects their prices, and how to analyze them.",
          topic: "stocks",
          difficulty: "intermediate",
          estimatedTime: "25 minutes",
          content: {
            objectives: [
              "Understand how stocks represent ownership in companies",
              "Learn what factors influence stock prices",
              "Know how to read basic financial statements",
              "Understand different stock analysis methods"
            ],
            content: [
              {
                section: "What Are Stocks?",
                text: "Stocks represent ownership shares in a company. When you buy a stock, you become a partial owner of that company. Stock prices fluctuate based on supply and demand, company performance, market conditions, and investor sentiment.",
                examples: [
                  "Buying 100 shares of Apple makes you a partial owner",
                  "Stock prices change throughout the trading day",
                  "Companies can pay dividends to shareholders"
                ]
              },
              {
                section: "Stock Analysis",
                text: "There are two main approaches to stock analysis: fundamental analysis (examining company financials, management, and industry) and technical analysis (studying price charts and patterns). Both methods help investors make informed decisions.",
                examples: [
                  "Fundamental: Analyzing P/E ratios, revenue growth",
                  "Technical: Looking at moving averages, support/resistance levels"
                ]
              }
            ],
            keyTakeaways: [
              "Stocks represent ownership in companies",
              "Stock prices are influenced by many factors",
              "Both fundamental and technical analysis have value",
              "Diversification reduces individual stock risk"
            ],
            practiceQuestions: [
              {
                question: "What does it mean when you own 100 shares of a company?",
                options: [
                  "You own 100% of the company",
                  "You are a partial owner of the company",
                  "You owe the company money",
                  "You have a 100-year contract with the company"
                ],
                correctAnswer: 1,
                explanation: "Owning shares means you have partial ownership in the company proportional to the number of shares you own."
              }
            ],
            resources: [
              "Yahoo Finance: Stock Research Tools",
              "Morningstar: Stock Analysis Reports"
            ]
          }
        },
        {
          title: "Portfolio Diversification",
          description: "Learn how to spread risk across different investments to protect your portfolio.",
          topic: "portfolio-management",
          difficulty: "intermediate",
          estimatedTime: "30 minutes",
          content: {
            objectives: [
              "Understand the concept of diversification",
              "Learn how to build a diversified portfolio",
              "Know the benefits and limitations of diversification",
              "Understand asset allocation strategies"
            ],
            content: [
              {
                section: "What is Diversification?",
                text: "Diversification is the practice of spreading your investments across different asset classes, industries, and geographic regions to reduce risk. The idea is that if one investment performs poorly, others may perform well, balancing out your overall returns.",
                examples: [
                  "Investing in both stocks and bonds",
                  "Holding stocks from different industries",
                  "Including international investments"
                ]
              },
              {
                section: "Asset Allocation",
                text: "Asset allocation is the process of deciding how to distribute your investments among different asset classes. Common strategies include the 60/40 rule (60% stocks, 40% bonds) or age-based allocation (100 - your age = percentage in stocks).",
                examples: [
                  "Conservative: 30% stocks, 70% bonds",
                  "Moderate: 60% stocks, 40% bonds",
                  "Aggressive: 80% stocks, 20% bonds"
                ]
              }
            ],
            keyTakeaways: [
              "Don't put all your eggs in one basket",
              "Diversification reduces unsystematic risk",
              "Asset allocation should match your risk tolerance",
              "Rebalance your portfolio periodically"
            ],
            practiceQuestions: [
              {
                question: "What is the main benefit of portfolio diversification?",
                options: [
                  "It guarantees higher returns",
                  "It reduces risk by spreading investments",
                  "It eliminates all investment risk",
                  "It makes investing easier"
                ],
                correctAnswer: 1,
                explanation: "Diversification reduces risk by spreading investments across different assets, but it doesn't guarantee higher returns or eliminate all risk."
              }
            ],
            resources: [
              "Vanguard: Portfolio Diversification Guide",
              "Bogleheads: Asset Allocation"
            ]
          }
        },
        {
          title: "Cryptocurrency Fundamentals",
          description: "Understand blockchain technology and how digital currencies work.",
          topic: "crypto",
          difficulty: "beginner",
          estimatedTime: "25 minutes",
          content: {
            objectives: [
              "Understand what cryptocurrency is",
              "Learn about blockchain technology",
              "Know the risks and benefits of crypto investing",
              "Understand how to safely store cryptocurrencies"
            ],
            content: [
              {
                section: "What is Cryptocurrency?",
                text: "Cryptocurrency is digital or virtual currency that uses cryptography for security and operates on decentralized networks based on blockchain technology. Unlike traditional currencies, cryptocurrencies are not controlled by any central authority.",
                examples: [
                  "Bitcoin - the first and most well-known cryptocurrency",
                  "Ethereum - a platform for smart contracts",
                  "Litecoin - often called 'digital silver'"
                ]
              },
              {
                section: "Blockchain Technology",
                text: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records (blocks) that are linked and secured using cryptography. It's the underlying technology that makes cryptocurrencies possible.",
                examples: [
                  "Each block contains transaction data",
                  "Blocks are connected in a chain",
                  "The ledger is maintained by a network of computers"
                ]
              }
            ],
            keyTakeaways: [
              "Cryptocurrency is highly volatile and risky",
              "Only invest what you can afford to lose",
              "Use secure wallets to store your crypto",
              "Do thorough research before investing"
            ],
            practiceQuestions: [
              {
                question: "What makes cryptocurrency different from traditional money?",
                options: [
                  "It's always worth more",
                  "It's controlled by central banks",
                  "It's decentralized and not controlled by any authority",
                  "It's only used online"
                ],
                correctAnswer: 2,
                explanation: "Cryptocurrency is decentralized, meaning it's not controlled by any central authority like a government or bank."
              }
            ],
            resources: [
              "Coinbase Learn: Cryptocurrency Basics",
              "Binance Academy: Blockchain Education"
            ]
          }
        },
        {
          title: "Advanced Trading Strategies",
          description: "Master sophisticated trading techniques used by professional investors.",
          topic: "trading",
          difficulty: "advanced",
          estimatedTime: "40 minutes",
          content: {
            objectives: [
              "Understand advanced trading strategies",
              "Learn about options and derivatives",
              "Know how to manage trading risks",
              "Understand market timing and technical indicators"
            ],
            content: [
              {
                section: "Options Trading",
                text: "Options are financial derivatives that give you the right, but not the obligation, to buy or sell an asset at a specific price within a certain time frame. They can be used for hedging, speculation, or generating income.",
                examples: [
                  "Call options - right to buy at strike price",
                  "Put options - right to sell at strike price",
                  "Covered calls - selling calls on owned stock"
                ]
              },
              {
                section: "Risk Management",
                text: "Advanced traders use sophisticated risk management techniques including position sizing, stop-loss orders, portfolio hedging, and correlation analysis to protect their capital and manage downside risk.",
                examples: [
                  "Never risk more than 2% of portfolio on one trade",
                  "Use stop-loss orders to limit losses",
                  "Hedge positions with inverse ETFs or options"
                ]
              }
            ],
            keyTakeaways: [
              "Advanced strategies require significant knowledge",
              "Risk management is crucial for success",
              "Options can amplify both gains and losses",
              "Professional trading requires discipline and education"
            ],
            practiceQuestions: [
              {
                question: "What is the main advantage of using options for hedging?",
                options: [
                  "Options always make money",
                  "Options provide leverage and flexibility",
                  "Options are risk-free",
                  "Options are easier than stocks"
                ],
                correctAnswer: 1,
                explanation: "Options provide leverage and flexibility for hedging strategies, allowing traders to protect positions with limited capital."
              }
            ],
            resources: [
              "CBOE: Options Education",
              "TastyTrade: Advanced Trading Strategies"
            ]
          }
        }
      ];

      // Check if modules already exist
      const existingModules = await storage.getAllModules();
      if (existingModules.length > 0) {
        return res.json({ message: "Modules already seeded", modules: existingModules });
      }

      // Create modules
      const createdModules = [];
      for (const moduleData of premadeModules) {
        const module = await storage.createLearningModule(moduleData);
        createdModules.push(module);
      }

      res.json({ message: "Modules seeded successfully", modules: createdModules });
    } catch (error) {
      console.error("Module seeding error:", error);
      res.status(500).json({ message: "Failed to seed modules" });
    }
  });

  app.post("/api/modules/generate", authenticateToken, async (req, res) => {
    try {
      const { topic, difficulty, estimatedTime } = generateModuleSchema.parse(req.body);

      const systemPrompt = `You are an expert financial educator creating comprehensive learning modules. Create a detailed, interactive learning module about "${topic}" for ${difficulty} level students.

The module should include:
1. A clear title and engaging description
2. Learning objectives (3-5 key points)
3. Main content broken into digestible sections
4. Real-world examples and case studies
5. Key takeaways
6. Practice questions (3-5 questions with answers)
7. Additional resources for further learning

Format the response as JSON with this structure:
{
  "title": "Module Title",
  "description": "Brief description of what students will learn",
  "objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "content": [
    {
      "section": "Section Title",
      "text": "Detailed content here with examples",
      "examples": ["Example 1", "Example 2"]
    }
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "practiceQuestions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ],
  "resources": ["Resource 1", "Resource 2"],
  "estimatedTime": "${estimatedTime}",
  "difficulty": "${difficulty}"
}

Make the content engaging, practical, and appropriate for ${difficulty} level learners.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a learning module about ${topic}` }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "{}";
      const moduleData = JSON.parse(response);

      // Save the generated module to database
      const savedModule = await storage.createLearningModule({
        title: moduleData.title,
        description: moduleData.description,
        topic: topic.toLowerCase().replace(/\s+/g, '-'),
        difficulty: difficulty,
        content: moduleData,
        estimatedTime: estimatedTime,
      });

      res.json({ module: savedModule });

    } catch (error) {
      console.error("Module generation error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate learning module" });
    }
  });

  // --- Finance Chatbot ---
  const chatSchema = z.object({
    message: z.string().min(1).max(1000),
    conversationHistory: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional().default([]),
  });

  app.post("/api/chat", authenticateToken, async (req, res) => {
    try {
      const { message, conversationHistory } = chatSchema.parse(req.body);

      // Create system prompt for finance-focused chatbot
      const systemPrompt = `You are a knowledgeable and friendly financial advisor AI assistant. Your role is to help users understand financial concepts, investment strategies, personal finance, and answer their money-related questions.

Key guidelines:
- Provide accurate, helpful financial information
- Explain complex financial concepts in simple, understandable terms
- Always remind users that your advice is for educational purposes and they should consult with qualified financial professionals for personalized advice
- Be encouraging and supportive, especially for beginners
- Focus on practical, actionable advice when appropriate
- If asked about specific investments, remind users about diversification and risk management
- Keep responses concise but comprehensive
- Use examples when helpful to illustrate concepts

You can help with topics like:
- Basic financial concepts (budgeting, saving, investing)
- Investment types (stocks, bonds, mutual funds, ETFs, etc.)
- Retirement planning
- Tax implications
- Risk management
- Market analysis and trends
- Personal finance strategies
- Financial goal setting

Remember to be encouraging and make financial topics accessible to everyone, regardless of their current knowledge level.`;

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...conversationHistory,
        { role: 'user' as const, content: message }
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";

      res.json({ 
        response,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', content: message },
          { role: 'assistant', content: response }
        ]
      });

    } catch (error) {
      console.error("Chat error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}