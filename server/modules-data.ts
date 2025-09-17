export const hardcodedModules = [
  // BEGINNER MODULES
  {
    title: "Introduction to Personal Finance",
    description: "Learn the fundamentals of managing your money, budgeting, and building a strong financial foundation.",
    topic: "personal-finance",
    difficulty: "beginner",
    estimatedTime: "25 minutes",
    content: {
      objectives: [
        "Understand the basics of personal finance and money management",
        "Learn how to create and maintain a budget",
        "Identify different types of financial goals",
        "Understand the importance of emergency funds"
      ],
      content: [
        {
          section: "What is Personal Finance?",
          text: "Personal finance is the management of your money and financial decisions. It includes budgeting, saving, investing, and planning for the future. Good personal finance habits help you achieve financial security and reach your life goals.",
          examples: [
            "Creating a monthly budget to track income and expenses",
            "Setting up automatic savings transfers",
            "Building an emergency fund for unexpected expenses"
          ]
        },
        {
          section: "The 50/30/20 Rule",
          text: "A popular budgeting method where 50% of income goes to needs (rent, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. This provides a simple framework for managing money.",
          examples: [
            "If you earn $3,000/month: $1,500 for needs, $900 for wants, $600 for savings",
            "Adjust percentages based on your income and circumstances",
            "Prioritize building an emergency fund before other savings"
          ]
        }
      ],
      keyTakeaways: [
        "Start with a budget to understand your money flow",
        "Pay yourself first by saving before spending",
        "Build an emergency fund equal to 3-6 months of expenses",
        "Set specific, measurable financial goals"
      ],
      practiceQuestions: [
        {
          question: "What percentage of your income should go to savings according to the 50/30/20 rule?",
          options: ["10%", "20%", "30%", "40%"],
          correctAnswer: 1,
          explanation: "The 50/30/20 rule allocates 20% of income to savings and debt repayment."
        }
      ],
      resources: [
        "Mint.com - Free budgeting tool",
        "YNAB (You Need A Budget) - Comprehensive budgeting app",
        "Dave Ramsey's 'Total Money Makeover' book"
      ]
    }
  },
  {
    title: "Understanding Budgeting Basics",
    description: "Master the art of budgeting with practical techniques and tools to take control of your finances.",
    topic: "budgeting",
    difficulty: "beginner",
    estimatedTime: "30 minutes",
    content: {
      objectives: [
        "Learn different budgeting methods and choose the right one",
        "Understand how to track income and expenses",
        "Identify areas where you can reduce spending",
        "Create a realistic and sustainable budget"
      ],
      content: [
        {
          section: "Types of Budgeting Methods",
          text: "There are several budgeting approaches: zero-based budgeting (every dollar assigned), envelope method (cash in envelopes), 50/30/20 rule, and percentage-based budgeting. Choose the method that fits your lifestyle and financial situation.",
          examples: [
            "Zero-based: Assign every dollar to a category before the month begins",
            "Envelope method: Use cash for different spending categories",
            "50/30/20: Fixed percentages for needs, wants, and savings"
          ]
        }
      ],
      keyTakeaways: [
        "Track all expenses for at least one month before creating a budget",
        "Choose a budgeting method that you'll actually use consistently",
        "Review and adjust your budget monthly",
        "Be realistic about your spending habits"
      ],
      practiceQuestions: [
        {
          question: "What is the main purpose of tracking expenses before creating a budget?",
          options: ["To save money", "To understand spending patterns", "To avoid overspending", "To earn rewards"],
          correctAnswer: 1,
          explanation: "Tracking expenses helps you understand where your money actually goes, which is essential for creating an accurate budget."
        }
      ],
      resources: [
        "EveryDollar - Dave Ramsey's budgeting app",
        "PocketGuard - Simple expense tracking",
        "Excel/Google Sheets budget templates"
      ]
    }
  },
  {
    title: "Introduction to Savings Accounts",
    description: "Explore different types of savings accounts and learn how to maximize your savings potential.",
    topic: "savings",
    difficulty: "beginner",
    estimatedTime: "20 minutes",
    content: {
      objectives: [
        "Understand different types of savings accounts",
        "Learn how interest rates work",
        "Compare savings options to find the best rates",
        "Set up an effective savings strategy"
      ],
      content: [
        {
          section: "Types of Savings Accounts",
          text: "Traditional savings accounts offer basic interest, high-yield savings accounts provide better rates, money market accounts combine checking and savings features, and certificates of deposit (CDs) offer fixed rates for specific terms.",
          examples: [
            "High-yield savings: 3-4% APY vs traditional 0.01% APY",
            "CDs: Lock in rates for 6 months to 5 years",
            "Money market: Check-writing privileges with higher rates"
          ]
        }
      ],
      keyTakeaways: [
        "Shop around for the best interest rates",
        "Take advantage of compound interest by starting early",
        "Consider high-yield savings for better returns",
        "Don't put all your savings in one account"
      ],
      practiceQuestions: [
        {
          question: "What is compound interest?",
          options: ["Interest on principal only", "Interest on principal and previously earned interest", "Interest paid monthly", "Interest on loans"],
          correctAnswer: 1,
          explanation: "Compound interest is interest earned on both the original principal and previously earned interest, allowing money to grow exponentially over time."
        }
      ],
      resources: [
        "Bankrate.com - Compare savings rates",
        "NerdWallet - Financial product comparisons",
        "FDIC - Understanding deposit insurance"
      ]
    }
  },
  {
    title: "Credit Cards and Credit Scores",
    description: "Learn how credit cards work, how to build good credit, and understand credit scores.",
    topic: "credit",
    difficulty: "beginner",
    estimatedTime: "35 minutes",
    content: {
      objectives: [
        "Understand how credit cards work and their benefits/risks",
        "Learn what affects your credit score",
        "Know how to build and maintain good credit",
        "Understand credit card fees and how to avoid them"
      ],
      content: [
        {
          section: "How Credit Cards Work",
          text: "Credit cards allow you to borrow money up to a credit limit. You must pay back what you borrow, usually monthly. If you pay the full balance by the due date, you avoid interest charges. Credit cards can help build credit history when used responsibly.",
          examples: [
            "Purchase $100, pay $100 by due date = no interest",
            "Purchase $100, pay $25 minimum = interest on remaining $75",
            "Credit utilization: keeping balances below 30% of limit"
          ]
        }
      ],
      keyTakeaways: [
        "Pay credit card balances in full each month",
        "Keep credit utilization below 30%",
        "Make all payments on time",
        "Don't apply for too many credit cards at once"
      ],
      practiceQuestions: [
        {
          question: "What is the most important factor in your credit score?",
          options: ["Credit utilization", "Payment history", "Length of credit history", "Number of credit cards"],
          correctAnswer: 1,
          explanation: "Payment history accounts for 35% of your credit score, making it the most important factor."
        }
      ],
      resources: [
        "Credit Karma - Free credit monitoring",
        "AnnualCreditReport.com - Free credit reports",
        "Experian, Equifax, TransUnion - Credit bureaus"
      ]
    }
  },
  {
    title: "Introduction to Retirement Planning",
    description: "Start planning for retirement early with 401(k)s, IRAs, and other retirement savings options.",
    topic: "retirement",
    difficulty: "beginner",
    estimatedTime: "30 minutes",
    content: {
      objectives: [
        "Understand different retirement accounts (401k, IRA, Roth IRA)",
        "Learn about employer matching and how to maximize it",
        "Calculate how much you need to save for retirement",
        "Understand the power of starting early"
      ],
      content: [
        {
          section: "Types of Retirement Accounts",
          text: "401(k)s are employer-sponsored plans with potential matching, traditional IRAs offer tax-deferred growth, and Roth IRAs provide tax-free withdrawals in retirement. Each has different contribution limits and tax benefits.",
          examples: [
            "401(k): Up to $22,500 in 2023, employer may match",
            "Traditional IRA: Up to $6,500 in 2023, tax-deductible",
            "Roth IRA: Up to $6,500 in 2023, after-tax contributions"
          ]
        }
      ],
      keyTakeaways: [
        "Start saving for retirement as early as possible",
        "Take advantage of employer 401(k) matching",
        "Aim to save 10-15% of your income for retirement",
        "Consider both traditional and Roth accounts"
      ],
      practiceQuestions: [
        {
          question: "What is the main advantage of starting retirement savings early?",
          options: ["Higher contribution limits", "More time for compound interest", "Better investment options", "Lower taxes"],
          correctAnswer: 1,
          explanation: "Starting early gives your money more time to benefit from compound interest, which can significantly increase your retirement savings."
        }
      ],
      resources: [
        "Vanguard - Retirement planning tools",
        "Fidelity - 401(k) and IRA guidance",
        "Social Security Administration - Benefits calculator"
      ]
    }
  },
  // INTERMEDIATE MODULES
  {
    title: "Stock Market Analysis Fundamentals",
    description: "Learn fundamental analysis techniques to evaluate stocks and make informed investment decisions.",
    topic: "stock-analysis",
    difficulty: "intermediate",
    estimatedTime: "40 minutes",
    content: {
      objectives: [
        "Understand key financial ratios and metrics",
        "Learn how to read financial statements",
        "Evaluate company fundamentals and competitive position",
        "Apply valuation methods to assess stock prices"
      ],
      content: [
        {
          section: "Key Financial Ratios",
          text: "P/E ratio compares stock price to earnings, P/B ratio compares price to book value, debt-to-equity shows financial leverage, and ROE measures profitability. These ratios help compare companies and identify potential investments.",
          examples: [
            "P/E of 15 means you pay $15 for every $1 of earnings",
            "Low P/E might indicate undervalued stock or poor prospects",
            "Compare ratios within the same industry for context"
          ]
        }
      ],
      keyTakeaways: [
        "Always compare ratios within the same industry",
        "Look for consistent revenue and earnings growth",
        "Consider both quantitative metrics and qualitative factors",
        "Diversify across different sectors and company sizes"
      ],
      practiceQuestions: [
        {
          question: "What does a P/E ratio of 20 mean?",
          options: ["The stock pays 20% dividend", "You pay $20 for every $1 of earnings", "The stock has grown 20%", "The company has $20 in assets"],
          correctAnswer: 1,
          explanation: "A P/E ratio of 20 means investors are willing to pay $20 for every $1 of the company's annual earnings."
        }
      ],
      resources: [
        "Yahoo Finance - Financial data and ratios",
        "Morningstar - Investment research and analysis",
        "SEC EDGAR - Official company filings"
      ]
    }
  },
  {
    title: "Bond Investment Strategies",
    description: "Master bond investing with strategies for different market conditions and risk profiles.",
    topic: "bonds",
    difficulty: "intermediate",
    estimatedTime: "35 minutes",
    content: {
      objectives: [
        "Understand different types of bonds and their characteristics",
        "Learn how interest rates affect bond prices",
        "Develop strategies for bond portfolio construction",
        "Evaluate bond credit quality and default risk"
      ],
      content: [
        {
          section: "Types of Bonds",
          text: "Government bonds (Treasuries) are safest with lowest yields, corporate bonds offer higher yields with more risk, municipal bonds provide tax advantages, and international bonds add diversification. Each serves different portfolio purposes.",
          examples: [
            "10-year Treasury: ~4% yield, virtually no default risk",
            "Corporate bonds: 5-8% yield depending on credit rating",
            "Municipal bonds: Tax-free income for residents"
          ]
        }
      ],
      keyTakeaways: [
        "Diversify across different bond types and maturities",
        "Consider your time horizon when choosing bond terms",
        "Higher yields usually mean higher risk",
        "Bonds provide portfolio stability and income"
      ],
      practiceQuestions: [
        {
          question: "What happens to bond prices when interest rates rise?",
          options: ["They increase", "They decrease", "They stay the same", "It depends on the bond type"],
          correctAnswer: 1,
          explanation: "Bond prices have an inverse relationship with interest rates - when rates rise, existing bond prices fall because new bonds offer higher yields."
        }
      ],
      resources: [
        "Bond Buyer - Municipal bond information",
        "TreasuryDirect - Government bond purchases",
        "Fidelity - Bond research and trading"
      ]
    }
  },
  {
    title: "Real Estate Investment Basics",
    description: "Explore real estate as an investment vehicle, including REITs, rental properties, and market analysis.",
    topic: "real-estate",
    difficulty: "intermediate",
    estimatedTime: "45 minutes",
    content: {
      objectives: [
        "Understand different real estate investment options",
        "Learn how to analyze rental property investments",
        "Evaluate REITs as a real estate investment alternative",
        "Assess real estate market conditions and trends"
      ],
      content: [
        {
          section: "Direct Real Estate Investment",
          text: "Buying rental properties involves analyzing cash flow, appreciation potential, and market conditions. Consider location, property condition, rental demand, and financing options. Direct ownership provides control but requires active management.",
          examples: [
            "Calculate cap rate: Net operating income ÷ Property value",
            "Positive cash flow: Rental income exceeds all expenses",
            "Location factors: Schools, employment, transportation access"
          ]
        }
      ],
      keyTakeaways: [
        "Real estate can provide both income and appreciation",
        "REITs offer easier access to real estate investing",
        "Location is crucial for real estate success",
        "Consider your time commitment and expertise level"
      ],
      practiceQuestions: [
        {
          question: "What is a REIT?",
          options: ["A type of mortgage", "A real estate investment trust", "A property management company", "A real estate agent"],
          correctAnswer: 1,
          explanation: "A REIT (Real Estate Investment Trust) is a company that owns and operates income-producing real estate and trades like a stock."
        }
      ],
      resources: [
        "NAREIT - REIT industry information",
        "Zillow - Property values and market data",
        "BiggerPockets - Real estate investment education"
      ]
    }
  },
  {
    title: "Portfolio Risk Management",
    description: "Learn advanced risk management techniques to protect and optimize your investment portfolio.",
    topic: "risk-management",
    difficulty: "intermediate",
    estimatedTime: "40 minutes",
    content: {
      objectives: [
        "Understand different types of investment risk",
        "Learn diversification strategies across asset classes",
        "Implement position sizing and risk controls",
        "Use hedging techniques to protect portfolios"
      ],
      content: [
        {
          section: "Types of Investment Risk",
          text: "Market risk affects all investments, credit risk involves default possibility, liquidity risk means difficulty selling, and concentration risk comes from overexposure to one asset. Understanding these helps create effective risk management strategies.",
          examples: [
            "Market risk: Stock market crashes affect all stocks",
            "Credit risk: Corporate bonds can default",
            "Liquidity risk: Real estate harder to sell than stocks"
          ]
        }
      ],
      keyTakeaways: [
        "Diversification is the most important risk management tool",
        "Regular rebalancing maintains risk levels",
        "Don't put more than 5-10% in any single investment",
        "Consider your risk tolerance and time horizon"
      ],
      practiceQuestions: [
        {
          question: "What is the primary benefit of portfolio diversification?",
          options: ["Higher returns", "Lower risk", "Tax benefits", "Easier management"],
          correctAnswer: 1,
          explanation: "Diversification primarily reduces risk by spreading investments across different assets, sectors, and regions."
        }
      ],
      resources: [
        "Portfolio Visualizer - Backtesting and analysis",
        "Riskalyze - Risk assessment tools",
        "Vanguard - Portfolio construction guidance"
      ]
    }
  },
  {
    title: "Tax Planning for Investors",
    description: "Optimize your investment returns through strategic tax planning and account selection.",
    topic: "tax-planning",
    difficulty: "intermediate",
    estimatedTime: "35 minutes",
    content: {
      objectives: [
        "Understand tax implications of different investments",
        "Learn about tax-advantaged accounts and their benefits",
        "Implement tax-loss harvesting strategies",
        "Plan for long-term tax efficiency"
      ],
      content: [
        {
          section: "Tax-Advantaged Accounts",
          text: "401(k)s and traditional IRAs offer tax-deferred growth, Roth accounts provide tax-free withdrawals, HSAs offer triple tax benefits, and 529 plans help with education expenses. Choose accounts based on current and future tax situations.",
          examples: [
            "Traditional IRA: Deduct contributions, pay taxes on withdrawals",
            "Roth IRA: After-tax contributions, tax-free withdrawals",
            "HSA: Deductible contributions, tax-free growth and withdrawals"
          ]
        }
      ],
      keyTakeaways: [
        "Maximize tax-advantaged accounts first",
        "Consider current vs future tax rates",
        "Use tax-loss harvesting to offset gains",
        "Keep detailed records of all transactions"
      ],
      practiceQuestions: [
        {
          question: "What is the main advantage of a Roth IRA?",
          options: ["Tax-deductible contributions", "Tax-free withdrawals in retirement", "Higher contribution limits", "No required minimum distributions"],
          correctAnswer: 1,
          explanation: "Roth IRAs offer tax-free withdrawals in retirement, making them valuable for those who expect to be in higher tax brackets later."
        }
      ],
      resources: [
        "IRS Publication 590 - IRA information",
        "TurboTax - Tax planning tools",
        "TaxAct - Investment tax guidance"
      ]
    }
  },
  // ADVANCED MODULES
  {
    title: "Options Trading Strategies",
    description: "Master sophisticated options strategies for hedging, income generation, and speculation.",
    topic: "options",
    difficulty: "advanced",
    estimatedTime: "50 minutes",
    content: {
      objectives: [
        "Understand options terminology and mechanics",
        "Learn basic and advanced options strategies",
        "Implement risk management for options trading",
        "Use options for portfolio hedging and income"
      ],
      content: [
        {
          section: "Options Basics",
          text: "Call options give the right to buy at a strike price, put options give the right to sell. Options have expiration dates and intrinsic/extrinsic value. Greeks measure sensitivity to various factors. Options can be used for speculation, hedging, or income generation.",
          examples: [
            "Buy call: Right to buy stock at $100, expires in 30 days",
            "Sell put: Obligation to buy stock at $100 if assigned",
            "Covered call: Sell call on stock you own for income"
          ]
        }
      ],
      keyTakeaways: [
        "Options are complex instruments requiring significant knowledge",
        "Start with simple strategies before advanced ones",
        "Always understand maximum risk before trading",
        "Use options to hedge existing positions"
      ],
      practiceQuestions: [
        {
          question: "What does buying a call option give you?",
          options: ["The obligation to buy", "The right to buy", "The right to sell", "The obligation to sell"],
          correctAnswer: 1,
          explanation: "Buying a call option gives you the right, but not the obligation, to buy the underlying asset at the strike price before expiration."
        }
      ],
      resources: [
        "CBOE - Options education and tools",
        "TastyTrade - Options trading education",
        "Options Alpha - Strategy guides and backtesting"
      ]
    }
  },
  {
    title: "Derivatives and Complex Financial Instruments",
    description: "Explore advanced derivatives including futures, swaps, and structured products.",
    topic: "derivatives",
    difficulty: "advanced",
    estimatedTime: "45 minutes",
    content: {
      objectives: [
        "Understand various derivative instruments and their uses",
        "Learn about futures and forwards markets",
        "Explore swap agreements and their applications",
        "Assess risks and benefits of complex products"
      ],
      content: [
        {
          section: "Futures and Forwards",
          text: "Futures are standardized contracts traded on exchanges, while forwards are customized over-the-counter agreements. Both allow speculation and hedging but differ in liquidity, counterparty risk, and standardization. Used by institutions and sophisticated investors.",
          examples: [
            "S&P 500 futures: Hedge equity exposure",
            "Oil futures: Speculate on energy prices",
            "Currency forwards: Hedge foreign exchange risk"
          ]
        }
      ],
      keyTakeaways: [
        "Derivatives are complex and carry significant risk",
        "Most suitable for institutional and sophisticated investors",
        "Can be used for hedging existing positions",
        "Require deep understanding of underlying assets"
      ],
      practiceQuestions: [
        {
          question: "What is the main difference between futures and forwards?",
          options: ["Futures are riskier", "Forwards are standardized", "Futures are traded on exchanges", "Forwards have no expiration"],
          correctAnswer: 2,
          explanation: "Futures are standardized contracts traded on exchanges, while forwards are customized agreements traded over-the-counter."
        }
      ],
      resources: [
        "CME Group - Futures education",
        "ISDA - Derivatives documentation",
        "CFTC - Regulatory information"
      ]
    }
  },
  {
    title: "Quantitative Investment Analysis",
    description: "Apply mathematical and statistical methods to investment analysis and portfolio management.",
    topic: "quantitative",
    difficulty: "advanced",
    estimatedTime: "55 minutes",
    content: {
      objectives: [
        "Learn quantitative analysis techniques and models",
        "Understand factor investing and risk models",
        "Apply statistical methods to investment decisions",
        "Implement algorithmic trading strategies"
      ],
      content: [
        {
          section: "Factor Analysis",
          text: "Factor models explain stock returns using common factors like market, size, value, momentum, and quality. Fama-French three-factor model adds size and value to market factor. Multi-factor models help understand return drivers and construct portfolios.",
          examples: [
            "Market factor: Overall market movement",
            "Size factor: Small cap outperformance",
            "Value factor: Low P/E stocks outperform high P/E"
          ]
        }
      ],
      keyTakeaways: [
        "Quantitative analysis requires strong mathematical skills",
        "Factor models help understand return drivers",
        "Risk models are essential for portfolio management",
        "Backtesting validates strategies before implementation"
      ],
      practiceQuestions: [
        {
          question: "What does the Fama-French three-factor model include?",
          options: ["Market, size, value", "Market, momentum, quality", "Size, value, momentum", "Market, volatility, liquidity"],
          correctAnswer: 0,
          explanation: "The Fama-French three-factor model includes market factor, size factor (small vs large cap), and value factor (value vs growth)."
        }
      ],
      resources: [
        "AQR - Factor investing research",
        "Kenneth French's data library",
        "QuantLib - Quantitative finance library"
      ]
    }
  },
  {
    title: "Alternative Investment Strategies",
    description: "Explore hedge funds, private equity, commodities, and other alternative investments.",
    topic: "alternatives",
    difficulty: "advanced",
    estimatedTime: "50 minutes",
    content: {
      objectives: [
        "Understand different alternative investment categories",
        "Learn about hedge fund strategies and structures",
        "Evaluate private equity and venture capital",
        "Assess commodities and other alternative assets"
      ],
      content: [
        {
          section: "Hedge Fund Strategies",
          text: "Hedge funds use various strategies: long/short equity, market neutral, global macro, event-driven, and relative value. They often use leverage, short selling, and derivatives. Performance fees and high minimums are common characteristics.",
          examples: [
            "Long/short: Buy undervalued, short overvalued stocks",
            "Market neutral: Zero net market exposure",
            "Global macro: Bet on economic trends and policies"
          ]
        }
      ],
      keyTakeaways: [
        "Alternatives can provide diversification and higher returns",
        "Often require high minimum investments and long lock-ups",
        "Due diligence is crucial for alternative investments",
        "Consider fees and liquidity constraints"
      ],
      practiceQuestions: [
        {
          question: "What is a key characteristic of hedge funds?",
          options: ["Guaranteed returns", "Low fees", "High minimum investments", "Daily liquidity"],
          correctAnswer: 2,
          explanation: "Hedge funds typically require high minimum investments, often $1 million or more, and have limited liquidity."
        }
      ],
      resources: [
        "Preqin - Alternative investment data",
        "Hedge Fund Research - Performance data",
        "Cambridge Associates - Investment consulting"
      ]
    }
  },
  {
    title: "Advanced Portfolio Optimization",
    description: "Master modern portfolio theory, mean-variance optimization, and advanced allocation techniques.",
    topic: "optimization",
    difficulty: "advanced",
    estimatedTime: "60 minutes",
    content: {
      objectives: [
        "Understand modern portfolio theory and efficient frontier",
        "Learn mean-variance optimization techniques",
        "Implement risk parity and other advanced allocation methods",
        "Apply Monte Carlo simulation to portfolio planning"
      ],
      content: [
        {
          section: "Modern Portfolio Theory",
          text: "MPT shows how to construct optimal portfolios by balancing expected return and risk. The efficient frontier represents portfolios with highest return for given risk level. Diversification reduces portfolio risk without sacrificing expected return.",
          examples: [
            "Efficient frontier: Curve of optimal risk-return combinations",
            "Capital market line: Risk-free rate to market portfolio",
            "Sharpe ratio: Risk-adjusted return measure"
          ]
        }
      ],
      keyTakeaways: [
        "Optimization requires accurate return and risk estimates",
        "Past performance doesn't guarantee future results",
        "Regular rebalancing is crucial for maintaining allocations",
        "Consider transaction costs and taxes in optimization"
      ],
      practiceQuestions: [
        {
          question: "What does the efficient frontier represent?",
          options: ["Highest risk portfolios", "Lowest return portfolios", "Optimal risk-return combinations", "All possible portfolios"],
          correctAnswer: 2,
          explanation: "The efficient frontier represents portfolios that offer the highest expected return for a given level of risk, or the lowest risk for a given expected return."
        }
      ],
      resources: [
        "Portfolio Visualizer - Optimization tools",
        "Riskalyze - Risk-based allocation",
        "AQR - Portfolio construction research"
      ]
    }
  }
];
