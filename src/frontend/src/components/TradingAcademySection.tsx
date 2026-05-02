import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  BookmarkCheck,
  BookmarkPlus,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createActor } from "../backend";
import { useLessonProgress } from "../contexts/SessionContext";
import {
  AscendingTriangleSVG,
  BullFlagSVG,
  BullishEngulfingSVG,
  CupHandleSVG,
  DescendingTriangleSVG,
  DojiSVG,
  DoubleBottomSVG,
  DoubleTopSVG,
  HammerSVG,
  HeadAndShouldersSVG,
  SymmetricTriangleSVG,
} from "./ChartPatternDiagrams";
import { DYKCard } from "./DYKCard";
import { GlossarySection } from "./GlossarySection";
import { LessonConceptChecker } from "./LessonConceptChecker";
import { LessonConfidenceRating } from "./LessonConfidenceRating";
import { LessonPreCheck } from "./LessonPreCheck";
import { MythVsRealityCard } from "./MythVsRealityCard";
import { ScrollAnimation } from "./ScrollAnimation";
import { TraderProfileCard } from "./TraderProfileCard";
import { WarRoomSection } from "./WarRoomSection";
import { ZenoAiLesson } from "./ZenoAiLesson";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConceptQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface MythEntry {
  myth: string;
  reality: string;
}

interface TraderProfile {
  name: string;
  era: string;
  story: string;
  keyLesson: string;
  quote: string;
}

interface SpotMistake {
  scenario: string;
  question: string;
  mistakes: string[];
  correctIndex: number;
  explanation: string;
}

interface Lesson {
  title: string;
  duration: string;
  content: string[];
  takeaways: string[];
  dzQuote?: string;
  commonMistakes?: string[];
  checkpoint?: { question: string; answer: string };
  whyMatters?: string;
  realTradeBreakdown?: string;
  caseStudy?: { title: string; body: string };
  chartPatternKey?: string; // maps to a specific SVG diagram
  conceptChecker?: ConceptQuestion[];
  preCheckQuestions?: ConceptQuestion[];
  mythVsReality?: MythEntry[];
  traderProfile?: TraderProfile;
  spotTheMistake?: SpotMistake;
  dykFacts?: string[];
  personalNote?: string;
}

interface Tier {
  id: string;
  name: string;
  description: string;
  color: string;
  glowColor: string;
  badgeLabel: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master";
  icon: React.ReactNode;
  lessons: Lesson[];
}

// ─── Curriculum Data ─────────────────────────────────────────────────────────

const TIERS: Tier[] = [
  {
    id: "beginner",
    name: "Beginner",
    description:
      "Start from absolute zero. Understand what trading is and how markets work before touching a single trade.",
    color: "oklch(0.65 0.18 145)",
    glowColor: "oklch(0.65 0.18 145 / 0.35)",
    badgeLabel: "Tier 1",
    difficulty: "Beginner" as const,
    icon: <BookOpen className="w-5 h-5" />,
    lessons: [
      {
        title: "What is Trading?",
        duration: "10 min",
        content: [
          "Trading is the act of buying and selling financial assets — stocks, currencies, crypto, or commodities — with the goal of making a profit from price movements.",
          "Markets are driven by supply and demand. When more people want to buy an asset than sell it, prices rise. When more want to sell, prices fall. Understanding this basic mechanic is the foundation of everything.",
          "There are two core types of traders: those who hold positions for days, weeks, or months (swing and position traders) and those who open and close positions within the same day (day traders and scalpers). DemonZeno signals cover all timeframes.",
          "Before placing any trade, you must understand: what asset are you trading, why are you entering, where is your stop loss, and where is your profit target. No trade without a plan is a rule you must never break.",
        ],
        takeaways: [
          "Markets move based on supply vs demand",
          "Every trade needs Entry, SL, and TP before execution",
          "Choose your trading style: scalp, day trade, or swing",
          "Never trade money you can't afford to lose",
          "Start with small positions while learning",
        ],
      },
      {
        title: "Understanding Markets",
        duration: "12 min",
        content: [
          "The Stock Market is where shares of publicly listed companies are traded. It operates during specific hours (NYSE: 9:30am–4pm EST). Prices reflect company performance, earnings, and market sentiment. Stock markets are generally considered lower-volatility than crypto.",
          "The Forex Market (Foreign Exchange) is the largest financial market in the world, trading $7+ trillion daily. You trade currency pairs like EUR/USD or GBP/JPY. Forex runs 24 hours a day, 5 days a week. Key sessions: London (8am–4pm GMT), New York (1pm–9pm GMT), Asian (midnight–8am GMT).",
          "The Crypto Market operates 24/7, 365 days a year. It is the most volatile of all markets — assets can move 10–50% in a single day. Bitcoin (BTC) dominance heavily influences the entire market. DemonZeno's signals are primarily on Binance-listed crypto pairs.",
          "Each market has different characteristics: Stocks are regulated and move slowly. Forex is liquid and moves steadily. Crypto is unregulated and moves aggressively. Your risk management must be calibrated for each market.",
        ],
        takeaways: [
          "Stock market: regulated, lower volatility, business hours only",
          "Forex: 24/5, $7T+ daily volume, currency pair trading",
          "Crypto: 24/7, highest volatility, BTC dominance matters",
          "DemonZeno signals cover Crypto, Forex, and Stocks via Binance",
          "Match your position size to the market's volatility",
        ],
      },
      {
        title: "Reading Candlestick Charts",
        duration: "15 min",
        content: [
          "A candlestick represents price movement over a specific time period (1 minute, 1 hour, 1 day, etc.). Each candle has four data points: Open (where price started), Close (where price ended), High (highest price reached), and Low (lowest price reached). The body shows open-to-close range. The wicks (shadows) show high and low.",
          "Green (bullish) candles: Close is higher than Open — buyers were in control. Red (bearish) candles: Close is lower than Open — sellers were in control. A long body means strong momentum. A short body means indecision or weak movement.",
          "Key patterns: The Doji has a very small body with long wicks — it signals indecision, often seen before reversals. The Hammer has a small body at the top with a long lower wick — bullish signal after a downtrend. The Engulfing Pattern occurs when one candle completely 'swallows' the previous candle — a strong reversal signal.",
          "Shooting Star: Small body at bottom, long upper wick — bearish signal after an uptrend. Marubozu: No wicks, all body — extreme momentum in one direction. Learning to read these patterns gives you context before applying indicators or signals.",
        ],
        takeaways: [
          "Green candle = buyers won (close > open). Red = sellers won",
          "Long wicks show rejection of extreme price levels",
          "Doji = indecision — look for confirmation before trading",
          "Hammer after downtrend = potential bullish reversal",
          "Engulfing candle = high-probability reversal signal",
        ],
      },
      {
        title: "Market Terminology",
        duration: "8 min",
        content: [
          "Bull Market / Bearish Market: A bull market is when prices are trending upward over time. A bear market is a sustained downtrend. Bull = optimism, rising prices. Bear = pessimism, falling prices.",
          "Long vs Short: Going LONG means you buy expecting the price to rise. Going SHORT means you sell (or short-sell) expecting the price to fall. DemonZeno signals specify direction in every signal card.",
          "Liquidity: Liquidity refers to how easily an asset can be bought or sold without significantly affecting the price. High liquidity = tight spreads, easy execution. Low liquidity = wild price swings, slippage on entry and exit.",
          "Volatility: Volatility measures how much an asset's price fluctuates over time. High volatility = bigger potential profits AND bigger potential losses. Crypto is the most volatile major market. Always adjust position size based on volatility.",
          "Spread: The difference between the buy price and sell price. Pip: The smallest price move in forex (0.0001 for most pairs). Stop Loss (SL): The price level at which your trade automatically closes to limit losses. Take Profit (TP): The price level at which your trade closes to lock in gains.",
        ],
        takeaways: [
          "Bull = price going up. Bear = price going down",
          "Long = buy expecting rise. Short = sell expecting fall",
          "High liquidity = safer entries and exits",
          "SL protects capital. TP locks in profit",
          "Pip = smallest forex movement (0.0001)",
        ],
      },
      {
        title: "Your First Trade Setup",
        duration: "10 min",
        content: [
          "Understanding a DemonZeno Signal Card: Every signal includes the Asset (e.g. BTC/USDT), Direction (Long or Short), Timeframe (e.g. 4H), Entry Price (the price to buy/sell at), Stop Loss (SL — the maximum you risk), Take Profit 1/2/3 (three target levels to exit with profit), and Confidence rating.",
          "How to execute a signal: First, wait for price to reach the Entry level — never chase price. Second, set your Stop Loss exactly where the signal specifies — do not move it. Third, set your Take Profit targets — at minimum, take partial profits at TP1 and trail your stop to entry (breakeven).",
          "Position Sizing: Before entering, calculate how much of your account you're risking. If your total account is $1,000 and you risk 1%, you risk $10 per trade. Calculate the dollar distance between Entry and SL, then divide $10 by that distance to determine your contract/lot size.",
          "Paper Trading First: Before risking real money, practice with a demo account or track your trades on paper. Execute DemonZeno signals mentally for 2–4 weeks. Track your results. Only move to real money once you're consistently following the system without emotional deviation.",
        ],
        takeaways: [
          "Never enter before price reaches the exact Entry level",
          "Set SL immediately after entry — non-negotiable",
          "Take partial profits at TP1, move SL to breakeven",
          "Risk no more than 1–2% of your account per trade",
          "Paper trade for at least 2 weeks before going live",
        ],
      },
      {
        title: "What is Technical Analysis",
        duration: "12 min",
        content: [
          "Technical Analysis (TA) is the study of historical price and volume data to forecast future price movements. Unlike fundamental analysis, which looks at a company's financials or an asset's intrinsic value, TA assumes that all available information is already reflected in the price. Everything you need to know is on the chart.",
          "The three core principles of technical analysis: (1) Market action discounts everything — price already reflects all known information, news, sentiment, and fundamentals. (2) Prices move in trends — once a trend is established, it is more likely to continue than reverse. (3) History repeats itself — chart patterns recur because human psychology is consistent across time.",
          "TA is used by retail and institutional traders alike. Banks, hedge funds, and market makers all monitor key TA levels — this is why those levels 'work.' When enough traders watch the same level, it becomes a self-fulfilling prophecy. Support and resistance exist because mass market psychology recognizes them.",
          "TA limitations: No tool is 100% accurate. Technical analysis works as a probability engine — not a crystal ball. Use it to identify high-probability setups, not guaranteed outcomes. Always combine TA with solid risk management.",
        ],
        takeaways: [
          "TA studies price/volume history to predict future movements",
          "All info is already priced in — the chart tells the story",
          "Prices trend — trade WITH the trend, not against it",
          "TA works because mass psychology creates recurring patterns",
          "No tool is perfect — TA + risk management = sustainable edge",
        ],
      },
      {
        title: "What is Fundamental Analysis",
        duration: "10 min",
        content: [
          "Fundamental Analysis (FA) evaluates an asset's intrinsic value by examining factors beyond price alone. For stocks: earnings, revenue, P/E ratio, debt levels, growth prospects, and competitive moat. For crypto: tokenomics, utility, adoption, team, on-chain metrics, and macro ecosystem health. For forex: GDP, interest rates, inflation, and central bank policy.",
          "How FA affects trading: When a company reports better-than-expected earnings, the stock often gaps up. When a country raises interest rates, its currency typically strengthens. When a blockchain project launches a major upgrade (like Ethereum's Merge), token price may react. FA creates the backdrop — TA shows you when to act on it.",
          "Combining FA and TA: The most powerful trades combine both. FA tells you WHAT to buy or sell (identify a strong or weak asset). TA tells you WHEN and WHERE to enter (find the right price level to act). A fundamentally strong asset at a key TA support level = a high-conviction trade.",
          "For DemonZeno signals: DemonZeno AI incorporates real-time news, macro data, and on-chain metrics alongside technical indicators when generating signals. This hybrid approach gives DemonZeno signals context that pure technical systems lack.",
        ],
        takeaways: [
          "FA evaluates intrinsic value beyond just price",
          "For crypto: tokenomics, utility, adoption, on-chain data",
          "For stocks: earnings, revenue, P/E ratio, competitive position",
          "FA = what to trade. TA = when and where to enter",
          "DemonZeno AI combines both for higher-conviction signals",
        ],
      },
      {
        title: "Reading Price Charts",
        duration: "11 min",
        content: [
          "A price chart is a visual representation of an asset's price over time. The x-axis represents time; the y-axis represents price. Each data point on the chart captures a specific time period's price action. Common chart types: Line (connects closing prices), Bar (shows OHLC), and Candlestick (the most information-rich — shows Open, High, Low, Close in one visual).",
          "Choosing your chart type: Candlestick charts are the global standard for active traders. Each candle gives you four critical data points in one glance. Green (or white) candles mean bulls controlled that period. Red (or black) candles mean bears controlled it. The 'body' shows the conviction of the move; the 'wick' shows price exploration beyond that range.",
          "Reading price context: Zoom out before zooming in. A single candle means nothing without context. Is it near a key support? Is it after a long uptrend? Is volume rising or falling? Chart reading is about interpreting price within its broader narrative — not reacting to individual bars in isolation.",
          "Key price chart concepts: Trends (ascending peaks/troughs), Consolidation (price range-bound), Breakouts (price escaping a range), Retests (price returning to test a broken level), Gaps (sudden jumps between sessions), and Volume confirmation (strong moves supported by high volume).",
        ],
        takeaways: [
          "Candlestick charts: most information-rich visual for traders",
          "Green candle = bulls won the period. Red = bears won",
          "Always zoom out before zooming in for full context",
          "Consolidation → breakout → retest is a classic pattern sequence",
          "Volume confirms or questions every significant price move",
        ],
      },
      {
        title: "Introduction to Indicators",
        duration: "10 min",
        content: [
          "Indicators are mathematical calculations applied to price and/or volume data to help identify trends, momentum, volatility, and potential reversals. They are derived FROM price — they don't predict the future, they help you read what price is already doing and filter setups objectively.",
          "Types of indicators: (1) Trend Indicators (Moving Averages, MACD) tell you the direction of the trend. (2) Momentum Indicators (RSI, Stochastic) tell you the speed of the move. (3) Volatility Indicators (Bollinger Bands, ATR) tell you how much price is moving. (4) Volume Indicators (OBV, Volume Profile) confirm the strength of moves.",
          "The danger of indicator overload: Adding 10 indicators to a chart creates confusion, not clarity. Most professional traders use 2–4 indicators maximum. DemonZeno's AI uses a curated set of indicators combined with pattern recognition and real-time data — not a cluttered dashboard.",
          "Leading vs lagging: Leading indicators (RSI, Stochastic) give signals BEFORE price moves — they can have false positives. Lagging indicators (Moving Averages, MACD) confirm moves AFTER they begin — they reduce false signals but sacrifice speed. A balanced approach combines both.",
        ],
        takeaways: [
          "Indicators are derived from price — they don't predict, they interpret",
          "4 types: trend, momentum, volatility, volume indicators",
          "Use 2–4 indicators max — more creates confusion",
          "Leading indicators signal early (more false positives)",
          "Lagging indicators confirm later (less false, but slower)",
        ],
      },
      {
        title: "Your First Trade Plan",
        duration: "12 min",
        content: [
          "A trade plan is your written protocol for every trade before you execute it. Trading without a plan is gambling. A plan removes emotional decision-making in the heat of the moment and defines your rules in advance when your thinking is calm and clear.",
          "The 6-step pre-trade checklist: (1) Asset — what are you trading? (2) Direction — long or short? (3) Entry — exact price level to enter. (4) Stop Loss — the level that proves your thesis wrong. (5) Take Profit — your exit targets (TP1, TP2, TP3). (6) Position Size — calculated from your account size and risk %.",
          "Defining your trade thesis: Before entering any trade, you must be able to answer in one sentence WHY you're entering. 'I'm going long BTC at 65,000 because price is at the 0.618 Fibonacci retracement with RSI oversold and the daily trend is bullish.' If you can't articulate the thesis in one sentence, the setup isn't clear enough to trade.",
          "What invalidates your trade: Before entering, identify the level that proves your thesis wrong. If you're long BTC because it's at support, define: 'If price closes below $64,000 on the 4H, my thesis is invalidated and I exit.' This is your stop loss — not a random number, but the level that disproves your setup.",
        ],
        takeaways: [
          "6-step checklist: Asset, Direction, Entry, SL, TP, Position Size",
          "Write one sentence explaining WHY you're entering",
          "If you can't articulate the thesis, don't take the trade",
          "SL is the level that disproves your thesis — not a random number",
          "Plan the trade; trade the plan",
        ],
      },
      {
        title: "Emotional Discipline in Trading",
        duration: "14 min",
        content: [
          "Trading is 30% technical skill and 70% psychological discipline. You can have the best system in the world and still blow your account if your psychology is undisciplined. Understanding your emotional triggers is as important as understanding chart patterns.",
          "The 4 emotional enemies of trading: (1) Fear — causes premature exits, missed entries, and moving stop losses to avoid being stopped out. (2) Greed — causes overtrading, holding too long past TP targets, and adding to losing positions hoping they recover. (3) Hope — the most dangerous emotion in trading. Hope replaces analysis. Replace hope with rules. (4) Revenge — trading impulsively after a loss to 'win it back.'",
          "The pre-trading ritual: Successful traders treat trading sessions like a professional athlete treats a performance. Ritual before the session (review your plan, check key levels, confirm your strategy), emotional check-in (am I stressed, tired, distracted?), and defining maximum loss for the session before touching the keyboard.",
          "Building unshakeable discipline: Rules must be written, not memorized. Post your trading rules where you can see them while trading. After every trade — winning or losing — review your emotional state. Did you follow your plan? If not, why? The journal is the mirror of your discipline.",
        ],
        takeaways: [
          "Trading is 70% psychology, 30% technical skill",
          "4 enemies: Fear, Greed, Hope, Revenge — know your triggers",
          "Hope replaces analysis — replace hope with written rules",
          "Pre-trading ritual: review plan, check emotions, define max loss",
          "After every trade: did I follow my plan? If not, why not?",
        ],
      },
      {
        title: "Building Trading Habits",
        duration: "11 min",
        content: [
          "Professional trading is built on habits, not impulses. A habit-based approach means your behavior in the market becomes automatic and consistent — not driven by mood, news, or social media noise. The habits you build in your first 6 months of trading define your ceiling.",
          "The 5 core trading habits: (1) Daily chart review — every morning before markets open, review key levels on your watchlist. (2) Position sizing calculation — before every trade, calculate your exact position size. Never guess. (3) Journaling — log every trade immediately after execution. (4) Post-session review — every evening, review your decisions and results. (5) Continuing education — dedicate at least 30 minutes daily to learning.",
          "Tracking metrics builds habits: Win rate, average R:R, profit factor, maximum consecutive losses, best/worst trading day. Tracking these weekly creates feedback loops that accelerate improvement. You can't improve what you don't measure.",
          "The 66-day habit formation rule: Research shows habits require approximately 66 days of consistent repetition before they become automatic. Commit to executing your trading system consistently for 66 trading days. After that period, disciplined execution becomes your default mode — not a struggle.",
        ],
        takeaways: [
          "Professional trading runs on habits, not impulses",
          "5 core habits: chart review, position sizing, journaling, post-review, learning",
          "Track 5 key metrics weekly: win rate, R:R, profit factor, drawdown, best/worst day",
          "Habits require ~66 days of consistent practice to become automatic",
          "You can't improve what you don't measure — journal everything",
        ],
      },
      {
        title: "Introduction to Technical Analysis",
        duration: "12 min",
        content: [
          "Technical Analysis (TA) is the methodology of studying past market data — primarily price and volume — to forecast future price movements. The core premise is elegantly simple: all information known to the market is already reflected in the current price. Charts are not just pictures; they are the aggregate decisions of every buyer and seller in that market.",
          "Why TA works: Human psychology is remarkably consistent across time and cultures. Fear, greed, panic, and euphoria manifest in the same chart patterns decade after decade. A head-and-shoulders reversal formed in 1920 looks identical to one formed in 2024. TA works because mass market behavior is predictable in aggregate even when individual behavior is not.",
          "The three foundational TA tools every beginner must master: (1) Trend analysis — identifying the prevailing direction of price and trading in alignment with it. (2) Support and Resistance — identifying key price levels where buyers and sellers have historically battled. (3) Momentum indicators — tools like RSI that quantify the speed and strength of price movement to detect exhaustion or acceleration.",
          "Getting started with TA: Open a free TradingView account. Pick one asset (BTC/USDT is ideal for practice — high liquidity, 24/7, well-charted). Study 6 months of daily price history. Mark every significant swing high and swing low. Connect consecutive higher lows to identify uptrends. This single exercise builds your chart-reading intuition faster than any textbook.",
        ],
        takeaways: [
          "TA uses price and volume history to forecast future price behavior",
          "Works because human market psychology creates recurring patterns",
          "3 foundational tools: trend analysis, S&R levels, momentum indicators",
          "TradingView is the standard free platform — start there",
          "Practice on BTC/USDT daily chart first: 6 months, mark all swing highs/lows",
        ],
      },
      {
        title: "Introduction to Fundamental Analysis",
        duration: "10 min",
        content: [
          "Fundamental Analysis (FA) evaluates an asset's true worth by studying real-world factors beyond its current price. For stocks, this means examining a company's revenue, earnings growth, profit margins, debt levels, and competitive position. For crypto, it means studying tokenomics, protocol adoption, on-chain activity, developer activity, and the strength of the ecosystem being built around the asset.",
          "Why FA matters for traders: TA tells you WHEN to enter a trade. FA tells you WHAT to enter. A fundamentally strong asset recovering at a key TA level has much higher probability than a fundamentally weak asset at the same level. The best trade setups occur when both FA and TA align.",
          "Key FA metrics for crypto: Total Value Locked (TVL) — how much capital is deployed in a protocol. Active addresses — how many wallets are actively using the network. Developer activity on GitHub — is the team building or stagnant? Tokenomics — is there runaway inflation or a deflationary supply mechanism? These metrics drive long-term price trends.",
          "Integrating FA into your trading workflow: You don't need to be a financial analyst. Maintain a watchlist of assets you understand fundamentally — their use case, their team, their competitive moat. When TA gives you an entry signal on a fundamentally strong asset, execute with higher conviction. When a fundamentally weak asset triggers your TA entry, either skip it or reduce your position size.",
        ],
        takeaways: [
          "FA evaluates intrinsic value: earnings, tokenomics, adoption, competition",
          "FA tells you WHAT to trade. TA tells you WHEN and WHERE to enter",
          "Crypto FA: TVL, active addresses, developer activity, tokenomics",
          "Best setups: FA quality + TA precision = maximum conviction entries",
          "Maintain a fundamentally understood watchlist — don't trade what you don't understand",
        ],
      },
      {
        title: "What is Market Capitalization",
        duration: "8 min",
        content: [
          "Market Capitalization (Market Cap) is one of the most important metrics for evaluating any financial asset. It is calculated simply: Market Cap = Current Price × Total Circulating Supply. It represents the total market value of all existing units of an asset. A cryptocurrency priced at $1 with 10 billion tokens has the same market cap as one priced at $100 with 100 million tokens.",
          "Why market cap matters for traders: Market cap determines an asset's category — large-cap assets (BTC, ETH) are more stable and liquid but move less dramatically. Mid-cap assets have higher volatility and growth potential. Small-cap assets can 10× or lose 90% in days. Knowing which category your trade target falls in determines appropriate position sizing and risk management.",
          "Market cap in context: Bitcoin dominates the crypto market at roughly 40–60% of total market cap depending on the market cycle. When Bitcoin's market cap grows at the expense of altcoins, this is shown as rising BTC Dominance. When altcoins collectively gain market cap, BTC Dominance falls — this is 'altcoin season.' Understanding this dynamic is essential for crypto portfolio management.",
          "Fully Diluted Valuation (FDV): FDV represents the market cap if ALL tokens that will ever exist were already in circulation. A token priced at $10 with 1 million circulating supply and a maximum supply of 1 billion has a market cap of $10M but an FDV of $10 billion. Always compare market cap to FDV — a huge FDV vs small market cap means massive future selling pressure from unlocks.",
        ],
        takeaways: [
          "Market Cap = Price × Circulating Supply",
          "Large-cap: stable, liquid. Mid-cap: growth potential. Small-cap: high risk/reward",
          "BTC Dominance rising = altcoins underperforming. Falling = altcoin season",
          "Always check FDV vs Market Cap to assess future inflation risk",
          "Price alone means nothing — a $0.001 token isn't 'cheap' if market cap is already $1B",
        ],
      },
      {
        title: "Understanding Trading Fees",
        duration: "7 min",
        content: [
          "Trading fees are the often-overlooked silent killer of trading profits. Every trade you execute incurs costs — and over hundreds of trades, these costs compound into a massive drag on returns. Professional traders ruthlessly minimize fees through exchange selection, order type, and trading frequency.",
          "Types of trading fees: (1) Maker fees — paid when you add liquidity to the order book by placing a limit order that is not immediately filled. Lower than taker fees. (2) Taker fees — paid when you immediately fill an existing order (market orders). Higher than maker fees. (3) Funding rates — in perpetual futures, paid every 8 hours between longs and shorts. (4) Withdrawal fees — flat fee to move assets off the exchange.",
          "Binance fee structure: Binance uses a tiered fee system based on 30-day trading volume and BNB holdings. Standard spot trading fee: 0.1% per side. Using BNB to pay fees gives a 25% discount (0.075%). With high volume tiers, fees drop to 0.02%–0.05%. Even a 0.1% fee on a scalping strategy with 10 trades per day = 1% of capital consumed daily in fees alone.",
          "The fee impact on strategy: A trader risking 1% per trade needs 0.1–0.2% just to cover entry and exit fees. Your actual net edge must account for this. Short timeframe strategies (scalping) are fee-intensive. Swing trading on daily charts minimizes fee drag dramatically. Always calculate your true net expectancy after fees.",
        ],
        takeaways: [
          "Fees silently compound into major profit drags — track them",
          "Maker fees < Taker fees: use limit orders to save on fees",
          "Binance: use BNB for fees to get 25% discount",
          "Scalping is fee-intensive: 10+ trades/day = significant daily fee cost",
          "Your strategy must have positive expectancy AFTER fees",
        ],
      },
      {
        title: "How to Read Price Action",
        duration: "11 min",
        content: [
          "Price action is the purest form of market analysis — reading what the market is saying through its price movements alone, without indicator noise. Every candle tells a story about the battle between buyers and sellers during that period. Learning to read this story fluently is the foundation of elite trading.",
          "The story behind each candle: A long green candle with no upper wick says 'buyers were completely in control from open to close — no seller was strong enough to push price back down.' A long red candle with a tiny upper wick and no lower wick says 'sellers dominated immediately from the open and never relented.' A small-bodied candle with equal wicks on both sides says 'buyers and sellers fought to a draw — no clear winner, direction uncertain.'",
          "Reading price action in context: Never analyze a single candle in isolation. Ask: (1) What direction was the trend before this candle? (2) Where did this candle form — at support, resistance, or in open space? (3) What did volume do during this candle? (4) What did the following candle do? Context transforms meaningless individual candles into high-probability trade signals.",
          "The three-candle pattern method: Rather than memorizing 50+ named patterns, focus on reading three-candle sequences. Setup candle (shows the current momentum direction) → Signal candle (the key reversal or continuation candle) → Confirmation candle (confirms the signal by closing in the expected direction). This three-step framework handles 80% of actionable setups.",
        ],
        takeaways: [
          "Price action = reading buyer/seller battle from raw candlestick data",
          "Long candle + no wick = strong conviction. Small body + equal wicks = indecision",
          "Never read a candle in isolation — context is everything",
          "Ask 4 questions: prior trend, candle location, volume, next candle",
          "Three-candle method: Setup → Signal → Confirmation",
        ],
      },
      {
        title: "Setting Up Your First Chart",
        duration: "9 min",
        content: [
          "Your charting setup is your workspace. Professional traders spend hours with their charts every day — a clean, organized setup reduces cognitive load and improves decision quality. Setting up correctly from the start builds good habits that compound over a career.",
          "Recommended free platform: TradingView (tradingview.com). It is the global standard for retail traders — superior charting tools, a built-in script library, real-time data for crypto and forex, and a large community sharing analysis. The free tier is sufficient for everything covered in this Academy.",
          "Essential indicators to add (and nothing more): (1) Volume bars at the bottom of every chart — always. (2) 20 EMA (Exponential Moving Average) — dynamic support/resistance. (3) 50 EMA — medium-term trend. (4) RSI (14-period) — momentum. These four items give you trend direction, dynamic levels, and momentum context. Do NOT add more than 4 indicators as a beginner.",
          "Chart navigation habits: Always start your analysis on the weekly chart (macro view → zoom into monthly if necessary) → then daily → then 4H for setup → then 1H for entry. Use the Alt+J keyboard shortcut in TradingView to jump to a specific date. Save your chart templates so you don't reconfigure from scratch each session. Use alerts (price alerts, not just indicator alerts) to notify you when price reaches key levels.",
        ],
        takeaways: [
          "TradingView is the standard — free tier is sufficient for learning",
          "Add only 4 indicators: Volume, 20 EMA, 50 EMA, RSI",
          "Navigation flow: Weekly → Daily → 4H → 1H",
          "Save chart templates to avoid reconfiguring each session",
          "Set price alerts on key levels — don't stare at charts all day",
        ],
      },
      {
        title: "Common Beginner Mistakes to Avoid",
        duration: "10 min",
        content: [
          "Every beginner trader makes the same predictable mistakes. Knowing them in advance won't make you immune — but it will make you faster at recognizing and correcting them. These are the patterns that consistently separate traders who survive their first year from those who blow their accounts in the first three months.",
          "Mistake 1 — Skipping the Stop Loss: 'The trade is at a small loss, it'll come back.' This thought has destroyed more trading accounts than any other single pattern. Every trade must have a stop loss set immediately upon entry. No exceptions. A trade without a stop loss is a trade with unlimited downside.",
          "Mistake 2 — Overleveraging: Using 10x, 20x, or 100x leverage feels powerful until a single 1% adverse move triggers liquidation. Beginners should use zero leverage for the first three months. Learn to manage positions profitably before amplifying both gains AND losses with leverage.",
          "Mistake 3 — Trading every day whether conditions are good or not: Professional traders often do nothing for days waiting for the right setup. Beginners feel compelled to trade constantly. Boredom trading is unprofitable trading. Develop the discipline to recognize 'no trade is a trade' — protecting capital by not entering subpar setups is a legitimate and profitable decision.",
          "Mistake 4 — Ignoring the broader trend: Entering a long trade because a 15-minute chart looks bullish while the daily chart is in a strong downtrend is like swimming against the ocean current. Always check the daily trend before entering any trade on a lower timeframe. Trade WITH the tide, not against it.",
        ],
        takeaways: [
          "No stop loss = unlimited downside — never skip it",
          "Beginners: zero leverage for the first 3 months minimum",
          "Boredom trading destroys accounts — 'no trade' is a valid decision",
          "Always check the daily trend before entering on lower timeframes",
          "Overtrading and under-analyzing are equally dangerous",
        ],
      },
      {
        title: "Building a Morning Trading Routine",
        duration: "9 min",
        content: [
          "Professional traders don't open their trading platform and immediately look for trades. They follow a structured pre-market routine that prepares their mind, informs their context, and identifies key levels before the session begins. Your morning routine is the difference between reactive emotional trading and proactive strategic trading.",
          "The 30-minute pre-market routine: (1) Check macro context — did any major news release overnight? Central bank announcements? Unexpected economic data? (5 minutes). (2) Review your open positions — check current P&L, verify SL/TP levels still make sense, decide if any adjustments are warranted. (5 minutes). (3) Mark today's key levels — find 3-5 significant S&R levels on the daily/4H chart for your watchlist. (10 minutes). (4) Plan potential trade setups — 'If BTC reaches 65,000, I'll look for a long setup. If it breaks below 63,500, I'll watch for a short.' (10 minutes).",
          "Emotional check-in: Before every session, assess your emotional state. Are you stressed, tired, distracted, or excited about a recent win? These states impair decision quality. If you had a devastating loss yesterday, consider sitting out today's session entirely. Trading requires a clear, calm mind. The best traders treat their mental state as a trading asset.",
          "End-of-day review: Every session should close with a brief review — what happened today, did price reach your key levels, what setups triggered, what did you do well, what would you do differently. This 10-minute evening routine compounds into massive improvement over months.",
        ],
        takeaways: [
          "30-minute pre-market routine: macro → open positions → key levels → setups",
          "Plan your trades before the session — never improvise in real-time",
          "Emotional check-in: trade only when mentally clear and focused",
          "If yesterday was a loss disaster, consider sitting out today",
          "10-minute end-of-day review compounds into major skill gains over months",
        ],
      },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description:
      "Build your technical foundation. Learn the core indicators, risk management rules, and how to read the DemonZeno signal system like a pro.",
    color: "oklch(0.65 0.15 190)",
    glowColor: "oklch(0.65 0.15 190 / 0.35)",
    badgeLabel: "Tier 2",
    difficulty: "Intermediate" as const,
    icon: <Target className="w-5 h-5" />,
    lessons: [
      {
        title: "Technical Analysis Foundations",
        duration: "18 min",
        content: [
          "Support and Resistance are the foundational concepts of technical analysis. Support is a price level where buying pressure has historically stopped price from falling further — it acts as a floor. Resistance is a price level where selling pressure has historically stopped price from rising further — it acts as a ceiling.",
          "When support breaks, it often becomes new resistance. When resistance breaks, it often becomes new support. These 'flips' are significant trade setups. DemonZeno signals frequently use S&R zones as entry, SL, and TP levels.",
          "Trendlines connect a series of higher lows (uptrend) or lower highs (downtrend). A valid trendline needs at least 2 touch points; 3+ makes it highly significant. A break of a trendline is a potential reversal signal.",
          "Price Action is the study of raw candlestick data without indicators. Pure price action traders use candlestick patterns, S&R levels, and trendlines to make decisions. Understanding price action makes you a better trader because indicators are derived from price — learning the source makes you faster.",
        ],
        takeaways: [
          "Support = price floor. Resistance = price ceiling",
          "Broken support becomes resistance (and vice versa)",
          "Trendlines need 3+ touch points to be highly reliable",
          "Price action is the foundation — indicators are derivatives",
          "Always map S&R before placing any trade",
        ],
      },
      {
        title: "Essential Indicators",
        duration: "20 min",
        content: [
          "RSI (Relative Strength Index): Measures the speed and magnitude of price changes on a scale of 0–100. Above 70 = overbought (potential reversal down). Below 30 = oversold (potential reversal up). RSI divergence — where price makes a new high but RSI makes a lower high — is one of the most powerful reversal signals in trading.",
          "MACD (Moving Average Convergence Divergence): Consists of two lines (MACD line and Signal line) and a histogram. When the MACD line crosses above the Signal line = bullish crossover (potential buy). When it crosses below = bearish crossover (potential sell). The histogram shows the strength of the momentum. Best used to confirm trend direction.",
          "Bollinger Bands: Three lines — a 20-period moving average in the middle, with upper and lower bands 2 standard deviations away. When bands squeeze tight together = Bollinger Band Squeeze = a big move is coming (direction unknown). When price touches the upper band in an uptrend = still bullish. When price touches the lower band = potential support.",
          "Using Multiple Indicators Together: Never rely on a single indicator. A strong setup is when RSI shows oversold AND MACD shows a bullish crossover AND price is at a support level. This confluence of signals dramatically increases trade probability. DemonZeno AI uses this multi-indicator approach when generating signals.",
        ],
        takeaways: [
          "RSI >70 = overbought. RSI <30 = oversold",
          "RSI divergence is a powerful reversal signal",
          "MACD crossover = trend direction confirmation",
          "Bollinger Band squeeze = major move incoming",
          "Confluence of multiple signals = higher probability trade",
        ],
      },
      {
        title: "Risk Management 101",
        duration: "15 min",
        content: [
          "The 1–2% Rule: Never risk more than 1–2% of your total trading capital on a single trade. If you have a $5,000 account, your maximum risk per trade is $50–$100. This rule ensures that even a streak of 10 losing trades in a row only reduces your account by 10–20%, keeping you in the game.",
          "Position Sizing Formula: Position Size = (Account Size × Risk %) ÷ (Entry Price − Stop Loss Price). Example: $10,000 account, 1% risk = $100 at risk. Entry: $50,000 BTC, SL: $49,000. Distance = $1,000. Position size = $100 ÷ $1,000 = 0.1 BTC.",
          "Risk:Reward Ratio (R:R): Always ensure your potential profit is at least 2× your potential loss. A 1:2 R:R means you make $200 if you win but only lose $100 if you lose. With a 50% win rate and 1:2 R:R, you are still profitable long-term. DemonZeno signals always provide TP1, TP2, TP3 — multiple exit points to optimize your R:R.",
          "Never risking what you can't afford: Trading with 'scared money' — money you need for rent, food, or bills — is the fastest path to emotional trading and account destruction. Only trade with capital you can afford to completely lose. Professional traders treat trading capital as a business investment, not as their emergency fund.",
        ],
        takeaways: [
          "Risk only 1–2% of your account per trade — always",
          "Position Size = (Account × Risk%) ÷ (Entry − SL)",
          "Target minimum 1:2 Risk:Reward ratio",
          "A 50% win rate with 1:2 R:R is long-term profitable",
          "Never trade with money you cannot afford to lose",
        ],
      },
      {
        title: "Reading the DemonZeno Signal System",
        duration: "12 min",
        content: [
          "Every DemonZeno signal contains: Asset (the trading pair), Direction (Long/Short), Timeframe (scalp 15m, day trade 1H/4H, or swing 1D+), Entry (the exact price to enter — wait for it), SL (Stop Loss — your maximum loss level), TP1/TP2/TP3 (three profit targets in ascending order).",
          "Entry Discipline: The Entry price is not a suggestion. If you miss it, you miss the trade. Chasing price after it has moved significantly from the Entry is one of the most common beginner mistakes. A missed trade is always better than a bad entry.",
          "Managing the Trade with Multiple TPs: At TP1, close 30–50% of your position and move your SL to the Entry price (breakeven). Now you cannot lose money on this trade. At TP2, close another 30–40%. Let the remaining position ride to TP3 with a trailing stop.",
          "Trailing Your Stop: As price moves in your favor, manually move your SL upward (for longs) to lock in profits. A common method: move SL to TP1 after TP2 is hit. This ensures you always exit with profit even if the trade reverses from TP2.",
        ],
        takeaways: [
          "Wait for exact Entry price — never chase",
          "At TP1: close 30–50% and move SL to breakeven",
          "At TP2: close another 30–40%, trail stop to TP1",
          "Let remaining position run to TP3 with trailing stop",
          "Missing a trade is better than a bad entry",
        ],
      },
      {
        title: "Timeframes Explained",
        duration: "10 min",
        content: [
          "Scalping (1min–15min charts): Extremely fast trades held for seconds to minutes. High frequency, small profit per trade, requires intense focus and fast execution. High stress, not recommended for beginners. Requires very tight S&R levels and a strong understanding of market microstructure.",
          "Day Trading (1H–4H charts): Positions opened and closed within the same trading day (or session). Medium frequency. Balances analysis time with execution speed. Most DemonZeno signals target this timeframe. Requires 2–4 hours of active chart monitoring per day.",
          "Swing Trading (1D–1W charts): Positions held for days to weeks. Lower frequency, larger profit per trade. More relaxed — you check charts once or twice per day. Requires patience and the ability to hold positions through temporary pullbacks. Best for those with full-time jobs.",
          "Choosing Your Timeframe: Match your lifestyle. If you can sit at your screen for 4–6 hours a day: day trading. If you check charts only morning and evening: swing trading. Never force a higher-frequency style than your schedule allows — that's how mistakes happen.",
        ],
        takeaways: [
          "Scalping: 1–15min, fast, high stress, not for beginners",
          "Day trading: 1H–4H, moderate pace, 2–4hrs/day",
          "Swing trading: 1D+, few hours/week, hold for days-weeks",
          "Match your timeframe to your schedule and lifestyle",
          "DemonZeno signals span all timeframes — check the label",
        ],
      },
      {
        title: "Divergence Trading",
        duration: "16 min",
        content: [
          "Divergence is one of the most powerful reversal signals in technical analysis. It occurs when price and an indicator (usually RSI or MACD) move in opposite directions. Regular Divergence signals a potential trend reversal. Hidden Divergence signals a trend continuation (for those who want to add to an existing position).",
          "Regular Bullish Divergence: Price makes a LOWER LOW, but RSI makes a HIGHER LOW. This means selling pressure is weakening even though price is still falling. Sellers are losing conviction. A bullish reversal is likely. Best entered on confirmation — a bullish candlestick pattern after the divergence forms.",
          "Regular Bearish Divergence: Price makes a HIGHER HIGH, but RSI makes a LOWER HIGH. Buying pressure is weakening even though price is still rising. Buyers are losing conviction. A bearish reversal is likely. This is one of the most reliable signals for identifying market tops.",
          "Hidden Bullish Divergence: Price makes a higher low (uptrend is intact), but RSI makes a lower low. The indicator is showing more weakness than price — this confirms the uptrend is still strong and a continuation is likely. Used to find optimal re-entries in an ongoing uptrend.",
          "Practical application: Never trade divergence in isolation. Combine with a key support/resistance level for confluence. RSI divergence at a major support + bullish candlestick = extremely high probability entry. DemonZeno AI factors divergence patterns into every signal analysis.",
        ],
        takeaways: [
          "Divergence = price and indicator moving in opposite directions",
          "Regular Bullish: price lower low + RSI higher low = reversal up",
          "Regular Bearish: price higher high + RSI lower high = reversal down",
          "Hidden Bullish: confirms uptrend continuation for re-entries",
          "Always combine divergence with S&R confluence for best results",
        ],
      },
      {
        title: "Position Sizing Strategies",
        duration: "14 min",
        content: [
          "Position sizing is the single most important risk management skill. The same system with poor position sizing will blow an account; with perfect position sizing, it will build wealth. Every professional trader masters this before anything else.",
          "The Fixed Percentage Method: Risk a fixed percentage of your account on every trade (typically 1–2%). This automatically scales your position size as your account grows or shrinks. Winning trades increase your position size; losing trades reduce it. This anti-martingale approach protects capital during drawdowns.",
          "The Fixed Dollar Method: Risk a fixed dollar amount per trade (e.g., $100 per trade regardless of account size). Simpler to calculate but doesn't scale with account growth. Works well in early stages when you're building consistency before scaling.",
          "Multi-position management: When running multiple trades simultaneously, calculate total portfolio risk. If you have 3 open trades each risking 2%, your total open risk is 6%. Most professionals cap total open risk at 5–8% of account to prevent a simultaneous stop-out from causing catastrophic damage.",
          "Scaling in (pyramid trading): Once a trade moves in your favor and TP1 is hit, you can add to the position with a smaller size. Each add should be smaller than the previous (e.g., 50%, 25%, 12.5%). This captures more profit while adding risk only when the market is proving you right.",
        ],
        takeaways: [
          "Position sizing is the most important risk management skill",
          "Fixed percentage (1-2% per trade) scales automatically with account",
          "Calculate total portfolio risk across all open positions",
          "Cap total open risk at 5-8% to protect against multiple simultaneous stops",
          "Pyramid scaling: add smaller positions as the trade proves correct",
        ],
      },
      {
        title: "Trading Journal Setup",
        duration: "10 min",
        content: [
          "A trading journal is the single most powerful tool for improvement in trading. Without it, you repeat the same mistakes indefinitely. With it, you create a systematic feedback loop that accelerates progress faster than any course or mentor.",
          "What to record in every trade entry: Date and time, Asset and timeframe, Direction (long/short), Entry price, Stop Loss price, TP1/TP2/TP3 prices, Reason for entry (1-2 sentences), Screenshot of the setup, Position size and account % risked.",
          "What to record on exit: Exit price and reason for exit, Actual R:R achieved vs planned, Emotional state during the trade (calm/anxious/greedy/fearful), Whether you followed your plan, One lesson learned from this specific trade.",
          "Weekly review process: Every weekend, review all trades from the week. Look for patterns: What setups had the highest win rate? What time of day did you trade best or worst? Which emotional states correlated with deviating from your plan? This 30-minute weekly ritual is worth more than 10 hours of chart analysis.",
          "Tools: Use a spreadsheet (Google Sheets is free) or a trading journal app. Include a statistical summary tab: win rate, average R:R, profit factor, and maximum drawdown updated weekly. Review monthly trends quarterly.",
        ],
        takeaways: [
          "The journal is your fastest path to improvement",
          "Record entry, exit, emotional state, and lessons for every trade",
          "Take screenshots of every setup for later review",
          "30-minute weekly review is worth more than 10 hours of extra analysis",
          "Track win rate, average R:R, profit factor weekly",
        ],
      },
      {
        title: "Trend Reversals and Continuations",
        duration: "15 min",
        content: [
          "Identifying whether a trend is reversing or continuing is one of the highest-value skills in trading. Most traders lose money trying to call reversals prematurely. Learning to distinguish reversal signals from continuation pullbacks protects you from being the counter-trend trader who gets run over by a freight train.",
          "Continuation signals: Shallow pullbacks to key moving averages (20 EMA or 50 EMA holding as support), flags and pennants forming after a strong move, consolidation at prior resistance-turned-support, decreasing volume during pullback then increasing on the next push. These all suggest the trend will continue.",
          "Reversal signals: Break of key structure (price closes below the last swing low in an uptrend), RSI or MACD divergence at an extreme level, bearish engulfing candle at resistance on high volume, price repeatedly failing to make new highs, decreasing volume on new price highs. Multiple reversal signals together increase probability.",
          "The fake reversal trap: Many false reversals look convincing at first. Price breaks a key low (looks like reversal) → immediately reverses upward (stop hunt). To avoid this: wait for a confirmed close below a level AND a retest failure AND a lower high forming before committing to the reversal side.",
          "DemonZeno signals and trend context: Every DemonZeno signal specifies the trend context. A 'Long' signal in a downtrend is a counter-trend setup (higher risk). A 'Long' signal in an uptrend with a pullback to support is a trend-following setup (lower risk, higher probability). Always check the trend context.",
        ],
        takeaways: [
          "Most traders lose calling reversals early — wait for confirmation",
          "Continuation: shallow pullbacks, flags, consolidation at support",
          "Reversal: structural break + divergence + high-volume rejection",
          "Watch for fake reversals (stop hunts) — wait for confirmed close + retest",
          "Trend-following signals have higher probability than counter-trend signals",
        ],
      },
      {
        title: "Reading DemonZeno Signals Advanced",
        duration: "13 min",
        content: [
          "At the advanced level, reading a DemonZeno signal means more than just copying Entry/SL/TP numbers. You understand WHY the signal was generated, what market conditions make it valid, and how to adapt your execution based on your account size and risk tolerance.",
          "Signal confidence tiers: High-confidence signals come from multiple converging factors — Daily trend alignment + 4H setup + 1H entry precision + volume confirmation + multi-indicator confluence. Lower-confidence signals may lack one or more of these factors. Scale your position size according to confidence — full position on high-confidence, half position on moderate.",
          "Adapting TP targets: The three TP levels in a DemonZeno signal represent the conservative (TP1), expected (TP2), and optimal (TP3) outcomes. In a strong trending market, bias toward letting the trade run to TP3. In a choppy or range-bound market, bias toward taking profit at TP1 and TP2 and exiting early.",
          "Contextual filters for signals: Before executing, ask three questions: (1) Does this signal align with the higher timeframe trend? (2) Is there any major news event in the next 24 hours that could invalidate the technical setup? (3) Have I already taken maximum open risk positions today? If the answer to any of these is concerning, reduce size or skip.",
          "Post-signal monitoring: After entering, don't watch the chart every minute. Set your SL and TPs, check in at key levels. The signal is your thesis — let the market confirm or invalidate it. Micro-managing a position leads to premature exits and emotional interference.",
        ],
        takeaways: [
          "Advanced reading: understand WHY the signal was generated",
          "Scale position size by confidence level — full/half/skip",
          "In trending markets bias toward TP3; in choppy markets bias toward TP1",
          "Apply 3-question contextual filter before every execution",
          "Set SL/TP and let the market work — avoid micro-managing",
        ],
      },
      {
        title: "Candlestick Psychology",
        duration: "13 min",
        content: [
          "Every candlestick is a snapshot of human psychology. The open, high, low, and close of each candle encodes the emotional state of every buyer and seller who participated in that period. Reading candlestick psychology means seeing beyond the shape to the underlying crowd behavior that created it.",
          "The psychology of the Hammer: Price opens, then sellers aggressively push it lower — fear is dominant. But then buyers step in strongly and push price all the way back up to close near the open. The long lower wick is the visual record of sellers' failed attempt to dominate. The close near the high shows buyers regained control. This is capitulation at support — one of the most reliable reversal signals.",
          "The psychology of the Engulfing Pattern: In a Bearish Engulfing, the previous green candle (buyers won that day) is completely swallowed by a red candle (sellers won the next day AND controlled more price range). This shift represents a violent psychological reversal — buyers who were confident yesterday are now trapped in losing positions, and their stop-loss exits accelerate the selling pressure.",
          "The psychology of wicks: Long upper wicks at resistance mean price reached those levels but was instantly rejected — there are strong sellers sitting at that level. The wick is their fingerprint. Multiple long upper wicks at the same resistance level mean each rally into that zone is being sold — institutions or large traders have orders there. This is why resistance zones work and why price bounces from the same levels repeatedly.",
        ],
        takeaways: [
          "Candlesticks encode buyer/seller psychology — learn to read it",
          "Hammer = failed seller attack at support + buyer recovery = bullish reversal",
          "Bearish Engulfing = violent shift from bull to bear psychology",
          "Long wicks = rejection of that price level by strong opposing force",
          "Multiple wicks at same level = institutional orders sitting there",
        ],
      },
      {
        title: "Trading with the Trend",
        duration: "11 min",
        content: [
          "The oldest rule in trading is still the most powerful: 'The trend is your friend.' Trading with the prevailing trend puts probability immediately in your favor. The trend represents the path of least resistance — the direction where institutional money, macro forces, and market momentum all align. Swimming with this current instead of against it is the foundation of consistent profitability.",
          "Defining the trend correctly: A trend is not just a direction — it is a series of price structure. An uptrend is specifically defined as a sequence of Higher Highs (HH) and Higher Lows (HL). Each new peak is above the previous peak, and each pullback stops above the previous pullback. A downtrend is Lower Highs (LH) and Lower Lows (LL). A trend is valid as long as this structure is intact.",
          "Trend entry timing: The ideal trend entry is NOT at the beginning of a new trend (hard to identify) and NOT at the peak of a trend (risky). The professional entry is during a pullback to the previous breakout level or a key moving average within an established trend. You wait for the trend to prove itself, then buy the dip back to a logical level.",
          "When to step aside: Not every market condition suits trend trading. During consolidation phases (price moving sideways between equal highs and equal lows), the trend is absent and range-bound strategies perform better. Recognizing when a trend is exhausted vs. when it is merely pausing is the skill that separates consistent traders from those who constantly fight the tape.",
        ],
        takeaways: [
          "Trend = path of least resistance — trade WITH it, not against it",
          "Uptrend: HH + HL sequence. Downtrend: LH + LL sequence",
          "Best entries: pullbacks to breakout levels or key MAs within the trend",
          "Don't buy the breakout — wait for the retest",
          "In consolidation: reduce position size or wait for the trend to resume",
        ],
      },
      {
        title: "Using Multiple Indicators Together",
        duration: "14 min",
        content: [
          "The power of technical analysis is not in any single indicator but in the agreement between multiple independent signals. Each indicator measures a different dimension of price action — combining them creates a multi-dimensional picture that dramatically reduces false signals and increases trade probability.",
          "The Holy Trinity: Trend + Momentum + Volume. These three dimensions are captured by: (1) Moving Averages (trend direction and dynamic S&R). (2) RSI or MACD (momentum strength and divergence). (3) Volume bars (confirming or questioning every price move). When all three agree — trend aligned, momentum in direction, volume confirming — you have a genuinely high-probability setup.",
          "Indicator conflict resolution: Sometimes indicators disagree. RSI may be overbought while price just broke to new highs on strong volume. In this case, volume and trend override RSI. The hierarchy: (1) Market structure (trend direction) — highest weight. (2) Volume confirmation. (3) Momentum indicators. (4) Pattern recognition. When structure and volume agree, individual indicator signals carry less weight.",
          "Avoiding over-correlation: Many traders add 5 indicators and believe they have 5 different signals. In reality, most indicators are derived from the same source data (price) and are highly correlated. RSI and Stochastic measure similar things. MACD and EMA crossovers measure similar things. True multi-indicator analysis requires choosing indicators from different categories: one trend, one momentum, one volume. That gives you genuinely independent signals.",
        ],
        takeaways: [
          "No single indicator wins alone — use them in combination",
          "Holy Trinity: Moving Average (trend) + RSI/MACD (momentum) + Volume",
          "When all three agree on direction = high probability entry",
          "Indicator hierarchy: market structure > volume > momentum indicators",
          "Avoid correlated indicators — pick one from each category only",
        ],
      },
      {
        title: "The Power of Confluence",
        duration: "12 min",
        content: [
          "Confluence is the concept of multiple independent analysis factors agreeing at the same price level simultaneously. It is the single most powerful filter for separating high-probability trades from random noise. A price level where only one factor says 'this is important' is weak. A level where five independent factors converge is a fortress — price is very likely to react there.",
          "Building a confluence stack: For every potential trade, work through this checklist before entering: ✓ Higher timeframe trend aligned with trade direction? ✓ Key Support/Resistance or Supply/Demand zone at entry? ✓ Fibonacci retracement level (0.382, 0.618) at entry? ✓ Indicator signal (RSI oversold/overbought, MACD crossover)? ✓ Candlestick pattern confirming at that level? ✓ Volume supporting the setup? Count your checkmarks — enter only at 4+.",
          "Quality vs. quantity: The most common confluence mistake is taking mediocre 2-factor setups frequently instead of waiting for exceptional 5-factor setups patiently. One A-grade confluence trade per week with full position sizing will outperform five B-grade trades every time. Discipline in setup selection is itself an edge.",
          "Confluence in DemonZeno signals: When DemonZeno AI generates a signal, it has already run the confluence analysis across 50+ AI providers and multiple technical frameworks. The signal output represents a pre-filtered confluence setup. Your job at the intermediate level is to verify this confluence on your own chart before executing — building the skill to validate signals independently.",
        ],
        takeaways: [
          "Confluence = multiple independent factors agreeing at one price level",
          "Build a 6-point checklist: trend, S&R, Fibonacci, indicator, candle, volume",
          "Enter only when 4+ confluence factors align simultaneously",
          "One A-grade setup beats five B-grade setups — patience is the edge",
          "Verify DemonZeno signals with your own confluence analysis",
        ],
      },
      {
        title: "Understanding Market Cycles",
        duration: "13 min",
        content: [
          "All markets move in cycles driven by the collective psychology of participants transitioning from greed (accumulation and markup) to fear (distribution and markdown). Understanding which phase of the cycle you're in determines whether you should be buying dips, selling rallies, or sitting in cash.",
          "The four phases of a market cycle: (1) Accumulation — smart money quietly buys at depressed prices while retail sentiment is still bearish. Price is flat or slowly rising. Volume is low. (2) Markup — price begins trending upward as broader participation grows. This is the phase where trend-following strategies thrive. (3) Distribution — smart money begins selling to the retail buyers who are now euphoric and buying at peaks. Price looks strong but volume tells a different story. (4) Markdown — price falls, retail holds hoping for recovery, smart money is already out.",
          "Reading the crypto macro cycle: Bitcoin operates on historically predictable 4-year cycles tied to the halving event (supply reduction every ~4 years). Post-halving: 12–18 months of bull market (Markup). Then: 12–18 months of bear market (Markdown). Understanding this cycle context determines your strategy: aggressive long positions in the first year post-halving; caution and profit-taking in the second year.",
          "Cycle indicators to watch: Bitcoin Dominance (cycle stage), Crypto Fear & Greed Index (retail sentiment), Bitcoin Realized Price (macro valuation), and Total Market Cap trend. These macro signals tell you whether you should be aggressive or defensive with your positions.",
        ],
        takeaways: [
          "4 cycle phases: Accumulation → Markup → Distribution → Markdown",
          "Buy during accumulation (when sentiment is still bearish)",
          "Sell during distribution (when sentiment is euphoric)",
          "BTC follows a ~4-year halving cycle — align your strategy with it",
          "Macro context determines aggressiveness of position sizing",
        ],
      },
      {
        title: "How to Read Economic Calendar",
        duration: "10 min",
        content: [
          "The economic calendar is the schedule of major economic data releases, central bank decisions, and geopolitical events that move markets. For forex traders, this calendar is essential. For crypto traders, it increasingly matters because institutional crypto participants trade around macro events just like equities and forex.",
          "Key economic events every trader must know: (1) NFP (Non-Farm Payrolls) — First Friday of each month, 8:30am EST. Massive USD volatility. Often moves crypto markets too via risk sentiment. (2) FOMC (Federal Reserve rate decision) — 8 times per year. The most important macro event for all markets. Determines the cost of money and risk appetite globally. (3) CPI (Consumer Price Index) — Monthly. Measures inflation. High inflation → Fed raises rates → risk assets typically sell off. (4) GDP data — Quarterly. Macro health indicator.",
          "Trading around news: The standard rule is to avoid having open positions 30 minutes before and after high-impact news releases. Price can gap dramatically in either direction, making stops unreliable. If you have an existing profitable position, consider partial profit-taking before the event. If you're planning to enter a new trade, wait for the dust to settle after the release.",
          "Practical calendar usage: Use Investing.com Economic Calendar (free). Filter for 3-star (high impact) events only. Check it every morning as part of your pre-market routine. Mark the days and times of high-impact events and plan your trading activity around them. In particular, never scale into new positions on FOMC decision days.",
        ],
        takeaways: [
          "Economic calendar = schedule of market-moving events",
          "Must-watch events: NFP, FOMC, CPI, GDP",
          "Avoid open positions 30 min before/after high-impact releases",
          "Use Investing.com Economic Calendar — filter for 3-star events",
          "FOMC day = reduce new position entries, protect open profits",
        ],
      },
      {
        title: "Trade Management — Moving Your Stop Loss",
        duration: "12 min",
        content: [
          "Trade management is the art of optimizing a trade after entry. Most traders focus exclusively on finding entries but neglect the equally important skill of managing the trade once it's running. Proper stop management is what converts a good entry into maximum profit extraction.",
          "The breakeven move: After a trade moves in your favor and hits TP1, your first action is always to move the stop loss to your entry price. This converts the trade from a 'risk trade' to a 'free trade' — you cannot lose money anymore, only fail to gain. Psychologically this is transformative. You can now let the trade breathe without fear of loss.",
          "Trailing stops: As the trade continues past TP1, you trail your stop upward (for longs) to lock in incremental profits. Common trailing methods: (1) Manual trailing — move SL to below each new swing low that forms after TP1. (2) Percentage trailing — keep SL a fixed percentage below current price. (3) Moving average trailing — trail SL to the 20 EMA, exit if price closes below it.",
          "When NOT to move your stop: The only direction you ever move a stop loss is in the direction of profit. Never move a stop loss further away from your entry to 'give the trade more room.' This is the psychological trap that turns small losses into account-destroying disasters. Once a stop is set, it only moves to reduce risk — never to increase it.",
          "The partial close strategy: At TP1, close 30–50% of the position. At TP2, close another 30–40%. Let the remaining 20–30% run to TP3 with a trailing stop. This approach ensures you always walk away with real profit even if the trade eventually reverses, while still capturing the full magnitude of strong trending moves.",
        ],
        takeaways: [
          "After TP1 hit: always move SL to entry (breakeven) first",
          "Trail stop upward as trade progresses to lock in gains",
          "Three trailing methods: manual, percentage, MA-based",
          "NEVER move SL further from entry — only toward profit",
          "Partial closes: 30–50% at TP1, 30–40% at TP2, trail last piece to TP3",
        ],
      },
      {
        title: "Partial Profit Taking Strategy",
        duration: "11 min",
        content: [
          "Partial profit taking is the professional approach to trade exits. Instead of holding 100% of a position to either full stop-out or a single take-profit level, you exit the trade in planned increments — locking in real gains at each level while maintaining exposure for the full move. This strategy maximizes risk-adjusted returns across all market conditions.",
          "The 40-40-20 framework: This is the standard DemonZeno approach. At TP1: close 40% of the position. Move stop to breakeven. At TP2: close another 40%. Move stop to TP1 level. At TP3: close final 20% or trail stop until exit. Result: You always bank real profit. Your worst case after TP1 is a breakeven trade that handed you 40% profit on 40% of your position.",
          "Psychology of partial closes: Partial profit taking solves a fundamental psychological problem — the difficulty of holding a winner. When 100% of your position is still open at TP1, greed says 'hold for TP3' but fear says 'close before it reverses.' The internal conflict causes stress and poor decisions. By taking 40% off at TP1, you eliminate this conflict. You've banked profit AND still have exposure to further upside.",
          "Adjusting ratios by market condition: In a strongly trending market (clear Daily uptrend, strong volume), bias heavier toward TP3. Use a 20-40-40 ratio. In a choppy or uncertain market, bias heavier toward early exits. Use a 50-40-10 or even 70-30-0 ratio. The framework is the same — only the proportions shift based on your confidence in continued momentum.",
        ],
        takeaways: [
          "Never exit 100% at one level — use planned partial closes",
          "Standard DemonZeno framework: 40% at TP1, 40% at TP2, 20% to TP3",
          "Partial closes eliminate the hold vs. close psychological conflict",
          "Trending market: bias toward TP3. Choppy market: bias toward TP1",
          "After TP1: minimum SL moves to entry — you're playing with house money",
        ],
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    description:
      "Level up with chart patterns, volume analysis, multi-timeframe strategies, Fibonacci mastery, and trading psychology.",
    color: "oklch(0.62 0.18 260)",
    glowColor: "oklch(0.62 0.18 260 / 0.35)",
    badgeLabel: "Tier 3",
    difficulty: "Advanced" as const,
    icon: <Zap className="w-5 h-5" />,
    lessons: [
      {
        title: "Advanced Chart Patterns",
        duration: "22 min",
        content: [
          "Head and Shoulders: One of the most reliable reversal patterns. Consists of a left shoulder (peak), a higher head (peak), and a right shoulder (lower peak). The neckline connects the two troughs. A break below the neckline confirms a bearish reversal. Price target = distance from head to neckline, projected downward. Inverse H&S is the bullish equivalent.",
          "Double Top / Double Bottom: Double Top — price hits the same resistance level twice, fails both times, then breaks below support. Strong bearish reversal signal. Double Bottom — price hits the same support level twice, bounces both times, then breaks above resistance. Strong bullish reversal signal.",
          "Flags and Pennants: These are continuation patterns. A bull flag forms after a strong upward move (the pole), followed by a tight downward consolidation (the flag). Price then breaks upward and continues the original trend. The target is the length of the pole added to the breakout point.",
          "Triangles: Ascending Triangle — flat top + rising lows = bullish breakout expected. Descending Triangle — flat bottom + falling highs = bearish breakdown expected. Symmetrical Triangle — converging highs and lows = continuation in the original trend direction. Volume typically decreases during triangle formation, then spikes on breakout.",
          "Wedges: Rising Wedge (bearish) — both support and resistance slope upward, but converging. Indicates weakening buying pressure. Falling Wedge (bullish) — both lines slope downward, converging. Indicates weakening selling pressure. Wedges often precede explosive reversals.",
        ],
        takeaways: [
          "Head & Shoulders: most reliable major reversal pattern",
          "Double Top/Bottom: second rejection confirms the pattern",
          "Flags: continuation — buy the breakout after consolidation",
          "Ascending triangle = bullish breakout expected",
          "Rising wedge = bearish reversal despite upward trend",
        ],
      },
      {
        title: "Volume Analysis",
        duration: "14 min",
        content: [
          "Volume is the number of units traded during a specific period. It is the most important confirmation tool in technical analysis. High volume = strong conviction behind a move. Low volume = weak move, potentially false breakout. Always check volume before entering a breakout trade.",
          "Volume Confirmation: A breakout above resistance on HIGH volume = strong, likely to continue. A breakout above resistance on LOW volume = potentially false, often reverses. DemonZeno AI always considers volume in signal generation.",
          "Volume Divergence: When price makes a new high but volume is declining — this is bearish divergence. The move lacks participation and is likely to reverse. When price makes a new low but volume is declining — buyers are drying up less aggressively, potential bullish reversal.",
          "On Balance Volume (OBV): A cumulative indicator that adds volume on up days and subtracts on down days. OBV trending up with price confirms bullish trend. OBV diverging from price is an early warning of trend weakness. Used by institutional traders to spot accumulation and distribution before price moves.",
        ],
        takeaways: [
          "High volume breakout = genuine move. Low volume = suspect",
          "Never enter a breakout without checking volume first",
          "Volume divergence = trend losing strength",
          "OBV rising = institutions accumulating (bullish)",
          "Volume spike on reversal candle = high probability reversal",
        ],
      },
      {
        title: "Multi-Timeframe Analysis",
        duration: "16 min",
        content: [
          "Top-Down Analysis: Always start from the highest timeframe and work down to your entry timeframe. Monthly → Weekly → Daily → 4H → 1H → 15min. The higher timeframe shows you the 'big picture' — the dominant trend. You trade WITH the trend on the lower timeframes.",
          "The Rule of Three: Use at least three timeframes. The highest (e.g., 1D) defines the overall trend direction. The middle (e.g., 4H) identifies the setup and pattern. The lowest (e.g., 1H or 15min) gives you the precise entry, stop loss, and target levels.",
          "Trend Alignment: The strongest trades occur when all three timeframes agree. Daily is bullish + 4H is pulling back to support + 1H shows a bullish reversal pattern at that support = high-conviction long setup. When timeframes conflict, reduce position size or skip the trade.",
          "Practical Example with DemonZeno Signals: When you receive a 4H signal, first check the Daily chart to confirm the overall trend is in that direction. Then check the 1H chart to confirm the entry level is at a key S&R zone. Only enter if your multi-TF analysis agrees with the signal direction.",
        ],
        takeaways: [
          "Always start analysis on higher timeframes",
          "Daily = trend direction. 4H = setup. 1H = entry",
          "All three timeframes agreeing = highest probability trade",
          "Never enter a signal that conflicts with the Daily trend",
          "Reduce size or skip when timeframes conflict",
        ],
      },
      {
        title: "Fibonacci Retracements",
        duration: "14 min",
        content: [
          "Fibonacci retracements are based on the Fibonacci sequence — a mathematical pattern found throughout nature. In trading, key levels are: 0.236 (23.6%), 0.382 (38.2%), 0.500 (50%), 0.618 (61.8% — the 'golden ratio'), and 0.786 (78.6%). Price frequently retraces to these levels before continuing the trend.",
          "How to Draw Fibonacci: For an uptrend, draw from the swing LOW to the swing HIGH. The retracement levels show where price might pull back before continuing up. For a downtrend, draw from the swing HIGH to the swing LOW. The key buying/selling zones are the 0.382, 0.5, and 0.618 levels.",
          "The Golden Ratio (0.618): The 61.8% retracement level is considered the strongest. When price pulls back to this level during an uptrend, it's often the last chance to enter before the trend resumes. DemonZeno signals frequently note when an entry aligns with a key Fibonacci level.",
          "Confluence: Fibonacci becomes most powerful when it aligns with other technical levels. If the 0.618 Fibonacci level also coincides with a support zone, a moving average, AND an RSI oversold reading — that's an extremely high probability entry point. Look for this type of multi-factor confluence on every trade.",
        ],
        takeaways: [
          "Key Fibonacci levels: 0.382, 0.500, 0.618 (golden ratio)",
          "For uptrend: draw from swing low to swing high",
          "0.618 retracement = strongest buying opportunity in uptrends",
          "Fibonacci + S&R confluence = very high probability setup",
          "Never use Fibonacci in isolation — always combine with other tools",
        ],
      },
      {
        title: "Trading Psychology",
        duration: "18 min",
        content: [
          "Fear and Greed are the two most powerful forces in trading psychology. Fear causes you to exit winning trades too early, skip good setups after a loss, or widen your stop loss to avoid being stopped out. Greed causes you to hold winning positions too long, ignore take profit levels, and over-leverage. Both destroy accounts.",
          "FOMO (Fear of Missing Out): You see a trade that already moved 15% without you. You enter anyway, chasing price at the top. Price immediately reverses. FOMO is responsible for more trading losses than any indicator failure. The cure: Have a systematic entry rule — if price is more than 2% from entry, skip it.",
          "Revenge Trading: You just took a loss. Your immediate reaction is to enter a bigger position to 'win it back immediately.' This is the most destructive pattern in trading. Every revenge trade is impulsive, unplanned, and emotionally driven. After a loss, take a break. Step away for 30–60 minutes minimum.",
          "Building Discipline: Keep a trading journal. Record every trade: reason for entry, emotional state, result, and what you learned. Review it weekly. Patterns will emerge — you'll discover which setups you trade best, what times you trade poorly, and which emotional triggers cause mistakes. Discipline is built through systematic self-awareness, not willpower alone.",
          "The DemonZeno Philosophy: Master the Chaos, Slay the Market, and Trade Like a God. But no god acts without a plan. Every signal DemonZeno publishes includes Entry, SL, TP1, TP2, and TP3 precisely because discipline is not optional. The system works — your job is to execute it without emotion.",
        ],
        takeaways: [
          "Fear makes you exit early. Greed makes you hold too long",
          "FOMO cure: if price moved >2% from entry, skip the trade",
          "After a loss: take 30–60 min break before next trade",
          "Keep a trading journal — self-awareness builds discipline",
          "Execute the plan, not your emotions",
        ],
      },
      {
        title: "Market Structure (HH/HL/LL/LH)",
        duration: "17 min",
        content: [
          "Market structure is the language of price. Before applying any indicator or pattern, professional traders first read market structure — the series of highs and lows that define whether the market is bullish, bearish, or ranging. This is the foundational framework of Smart Money Concepts and ICT methodology.",
          "Uptrend structure: Higher Highs (HH) and Higher Lows (HL). Price consistently making new peaks and each pullback stopping at a higher level than the previous pullback. This confirms buyers are in control. Trading LONG in an HH/HL structure is trading with the highest probability side.",
          "Downtrend structure: Lower Highs (LH) and Lower Lows (LL). Price failing to make new highs and each bounce stopping at a lower level. Sellers are in control. Trading SHORT in an LH/LL structure aligns with institutional flow.",
          "Structure breaks: When a confirmed structure breaks (e.g., price closes below the last HL in an uptrend), the character of the market is changing. This is the ChoCH (Change of Character) — the first warning sign. Wait for confirmation (the first LH to form) before committing to the new direction.",
        ],
        takeaways: [
          "Uptrend = HH + HL. Downtrend = LH + LL. Range = EH + EL",
          "Read market structure before applying any indicator",
          "Always trade with the structural direction, not against it",
          "Structure break (ChoCH) = first warning of reversal",
          "Wait for ChoCH + first new LH/HL before changing bias",
        ],
      },
      {
        title: "Supply and Demand Zones",
        duration: "18 min",
        content: [
          "Supply and Demand zones are areas on the chart where price previously made a significant, rapid move. These zones represent where institutional orders were placed — and price often returns to these zones to 'fill' remaining orders or retest institutional interest.",
          "Demand Zone (bullish): A price level where price previously dropped to, then rapidly reversed upward. This rapid move indicates strong buying interest at that level. When price returns to this zone in the future, remaining buy orders are filled — creating another bounce.",
          "Supply Zone (bearish): A price level where price previously rose to, then rapidly reversed downward. Strong selling interest at that level. When price returns, remaining sell orders are triggered — creating another rejection. Look for price spending minimal time in the zone before leaving — that's the institutional fingerprint.",
          "Zone validation: Fresh (untested) zones are the most powerful — they still have unfilled orders. A zone that has been tested and held multiple times becomes weaker each time (orders are being filled). Use untested zones for the highest probability setups.",
          "Combining S/D with other tools: A Demand Zone that also aligns with the 0.618 Fibonacci level + RSI oversold + a bullish engulfing candle = one of the highest-probability trade setups available. This layered confluence is how DemonZeno AI selects its signal entry zones.",
        ],
        takeaways: [
          "Demand zone: price dropped fast then reversed up = strong buying",
          "Supply zone: price rose fast then reversed down = strong selling",
          "Fresh (untested) zones are the most powerful",
          "Zone tested multiple times = weakening (orders being filled)",
          "S/D + Fibonacci + momentum indicator = highest probability entries",
        ],
      },
      {
        title: "Liquidity Concepts",
        duration: "16 min",
        content: [
          "In Smart Money Concepts, liquidity refers to clusters of stop loss orders created by retail traders. Because retail traders are predictable (stops at obvious levels), institutions know exactly where these stops sit and strategically push price to those levels to collect liquidity.",
          "Why institutions need liquidity: Large institutions trading hundreds of millions of dollars cannot simply buy at market price — there aren't enough sellers at a single price to fill their order. They need to trigger retail stops to create the volume they need to fill positions at favorable prices.",
          "Identifying liquidity pools: Equal Highs (two or more swing highs at approximately the same level) = significant pool of buy stops above. Equal Lows = significant pool of sell stops below. Round numbers and previous all-time highs/lows = massive liquidity pools.",
          "The liquidity grab setup: Price approaches an obvious liquidity level → briefly sweeps through it (triggering stops) → immediately reverses sharply in the opposite direction. Enter AFTER the sweep in the direction of the reversal. Stop loss just beyond the sweep candle. High R:R, high probability.",
        ],
        takeaways: [
          "Liquidity = clusters of retail stops that institutions need to fill orders",
          "Equal highs/lows = major liquidity pools — expect a sweep",
          "Round numbers and previous ATH/ATL = major liquidity magnets",
          "Trade AFTER the liquidity sweep, not before",
          "Understanding this converts you from retail prey to informed trader",
        ],
      },
      {
        title: "ICT Concepts Introduction",
        duration: "20 min",
        content: [
          "ICT (Inner Circle Trader) methodology is one of the most influential frameworks in modern retail trading. It focuses on how institutional 'Smart Money' actually operates in the market — and how retail traders can align their trading with institutional activity rather than fighting against it.",
          "The ICT model: Markets are engineered. Price is manipulated by large institutions to create liquidity, fill orders, and engineer trend directions. The visible patterns on charts are not random — they reflect the systematic accumulation and distribution of institutional positions.",
          "Key ICT concepts: (1) Judas Swing — a false move in the opposite direction early in the trading session to grab liquidity before the real directional move begins. (2) Displacement — a rapid, impulsive move creating an imbalance in price (fair value gap). (3) Premium/Discount Zones — price above equilibrium is 'premium' (sell), below is 'discount' (buy).",
          "Fair Value Gaps (FVG): When price moves so rapidly that it creates a gap between three candles (the third candle's open doesn't overlap with the first candle's close), this imbalance is a Fair Value Gap. Price tends to return to fill this gap before continuing. FVGs are entry zones for high R:R setups.",
          "ICT time-based concepts: Institutions operate during specific time windows — London Open (3am EST), NY Kill Zone (9:30–11am EST). These are the highest-probability windows for institutional moves. DemonZeno AI incorporates time-based ICT analysis into signal timing.",
        ],
        takeaways: [
          "ICT: markets are engineered by institutions — learn to read it",
          "Judas Swing: false move early in session to grab stops",
          "Buy in discount (below equilibrium). Sell in premium (above)",
          "Fair Value Gaps: price returns to fill imbalances",
          "ICT kill zones: London Open and NY Open = highest activity windows",
        ],
      },
      {
        title: "Confluence Trading",
        duration: "15 min",
        content: [
          "Confluence trading is the practice of only entering trades when multiple independent signals agree at the same price level simultaneously. A single indicator or pattern may have a 55% hit rate. Two confluent factors might push that to 65%. Three or more can push well above 70%.",
          "Building your confluence checklist: For every trade, count your confluence factors before entering: (1) Higher timeframe trend alignment? (2) Key S&R or Supply/Demand zone? (3) Fibonacci level? (4) Indicator signal (RSI oversold, MACD crossover)? (5) Candlestick pattern? (6) Volume confirmation? Aim for 3+ factors minimum.",
          "The quality vs quantity principle: One A+ confluence setup per week beats five mediocre setups. Patience is a skill. Waiting for confluence requires active monitoring and the discipline to say 'no' to setups that don't meet your criteria. Most professional traders take 3–5 trades per week, not 20.",
          "Confluence in DemonZeno signals: When DemonZeno AI generates a signal, it's already searching for confluence across 50+ AI providers, multiple indicators, price action patterns, and real-time market data. Each signal represents a pre-filtered confluence setup.",
          "Asymmetric confluence: Not all factors are equal. Daily trend alignment (high weight) + 4H RSI divergence (medium weight) + 15min entry candle (low weight) is asymmetrically weighted. Factors from higher timeframes carry more weight.",
        ],
        takeaways: [
          "Confluence = multiple independent signals agreeing at one price",
          "3+ confluence factors = minimum threshold for a quality setup",
          "Build a confluence checklist and stick to it for every trade",
          "One A+ setup per week beats five mediocre setups — patience is the edge",
          "Higher timeframe factors carry more weight in confluence scoring",
        ],
      },
      {
        title: "Advanced Chart Pattern Recognition",
        duration: "20 min",
        content: [
          "Advanced chart pattern recognition moves beyond identifying named patterns on textbook-clean charts to reading real market chaos and extracting order from apparent noise. In live markets, patterns are imperfect, overlapping, and context-dependent. Advanced recognition means seeing probability zones rather than precise geometric shapes.",
          "The Cup and Handle: One of the most powerful continuation patterns. A rounded bowl shape (cup) forms over weeks or months as price bottoms out and recovers. A brief consolidation (handle) forms near the prior high. Breakout above the handle target = cup depth added to breakout point. Used by institutional traders to identify significant breakout setups.",
          "The Wyckoff Method: Four phases — Accumulation (institutions buy quietly), Markup (price rises as more participants enter), Distribution (institutions sell into retail buying), and Markdown (price falls). Learning to identify Wyckoff phases transforms your understanding of why markets move the way they do and positions you ahead of retail crowd transitions.",
          "Channel patterns: Price often moves in structured channels — parallel trendlines containing price between support and resistance. Ascending channels in uptrends, descending channels in downtrends. Trading within a channel: buy near the lower boundary, sell near the upper. Channel breakout: the explosive move that begins when price finally escapes the channel boundary — often the most powerful trade setup of an entire trend.",
          "Pattern failure setups: When a well-known pattern fails (e.g., a head and shoulders that breaks upward instead of downward), the failure itself creates a powerful trade in the opposite direction. Failed patterns trap traders who positioned according to the pattern — their stop losses become fuel for the move in the opposite direction.",
        ],
        takeaways: [
          "Cup and Handle: rounded bottom + consolidation + breakout = continuation",
          "Wyckoff: 4 phases tell you when institutions accumulate and distribute",
          "Channels: buy lower boundary, sell upper boundary, trade the breakout",
          "Real patterns are imperfect — look for the probability zone, not the textbook shape",
          "Failed patterns create powerful trades — trapped traders become fuel",
        ],
      },
      {
        title: "Trading with Order Flow",
        duration: "17 min",
        content: [
          "Order flow is the real-time stream of buy and sell orders that moves price. Unlike lagging indicators that tell you what price did, order flow shows you what buyers and sellers are DOING right now. Traders who understand order flow read the market's live auction process rather than its historical record.",
          "The Depth of Market (DOM): Also called the order book, the DOM shows all pending buy orders (bids) below the current price and pending sell orders (asks) above. Large 'walls' of orders at specific levels represent significant buying or selling interest. Price moves when one side runs out of orders to fill at the current level, forcing price to move to the next cluster of orders.",
          "Tape reading: The time and sales feed (tape) shows every executed trade in real time — size, price, direction. Large blocks of trades executing at the ask (buy side) indicate aggressive buying. Large blocks at the bid indicate aggressive selling. Experienced tape readers can distinguish between retail-sized orders and institutional-sized blocks.",
          "Volume Profile: A histogram of volume at each price level over a selected period. The Point of Control (POC) is the price level with the highest volume — this is the 'fair value' area where the most business was transacted. Price tends to return to POC after moving away from it. High Volume Nodes (HVN) attract price. Low Volume Nodes (LVN) are where price moves through quickly.",
          "Practical application for intermediate traders: Full order flow analysis requires specialized platforms (Sierra Chart, Bookmap, NinjaTrader). For most traders, Volume Profile is the most accessible order flow tool and is available on TradingView. Add the Volume Profile Fixed Range indicator to key price ranges to identify where the highest volume concentration occurred.",
        ],
        takeaways: [
          "Order flow = live stream of buy/sell orders moving price",
          "DOM shows pending orders — large walls signal significant interest",
          "Volume Profile: POC is the 'fair value' price — attracts price back to it",
          "High Volume Nodes attract price. Low Volume Nodes accelerate price through",
          "Volume Profile is on TradingView — start there before full order flow platforms",
        ],
      },
      {
        title: "Backtesting Your Strategy Step by Step",
        duration: "18 min",
        content: [
          "Backtesting is the systematic process of applying your trading rules to historical price data to evaluate how the strategy would have performed. It is the only way to objectively validate whether your edge is real or imagined before risking live capital. A strategy that looks good in your head but fails on 100 historical trades is one you should not trade.",
          "Manual backtesting process: (1) Open TradingView. (2) Go to the earliest date in your testing window (e.g., 12 months ago). (3) Hide everything beyond that point using the bar replay feature. (4) Apply your entry rules to each candle in sequence. (5) Record every hypothetical trade (entry price, SL, TP levels, outcome). (6) Advance the chart bar by bar. (7) Review 100+ trades before drawing conclusions.",
          "What to measure: Win rate (% of profitable trades), Average R:R (average profit/average loss ratio), Profit Factor (total gross profit / total gross loss — must be above 1.0 to be profitable, aim for 1.5+), Maximum Consecutive Losses (how many losing trades in a row you experienced — critical for emotional preparation), and Maximum Drawdown (the largest peak-to-trough loss in the backtest period).",
          "Common backtesting mistakes: (1) Curve fitting — adjusting your rules to perfectly fit past data. A curve-fitted strategy fails on new data. Leave your rules unchanged after the first 20 trades. (2) Selection bias — only backtesting during favorable market conditions. Test through volatile AND quiet periods, uptrends AND downtrends. (3) Not accounting for slippage and fees — real results will always be slightly worse than backtest results.",
          "When to trust the backtest: At minimum 100 trades. Tested across multiple market conditions (trending AND ranging). Rules never changed after observing outcomes. Realistic fees included. After validation, forward-test for 30–60 days in a live demo environment before committing real capital.",
        ],
        takeaways: [
          "Backtesting is the only way to objectively validate your strategy",
          "Use TradingView bar replay — test 100+ trades minimum",
          "Metrics: win rate, profit factor (>1.5), max drawdown, max consecutive losses",
          "Avoid curve fitting — don't change rules to fit the historical results",
          "Test across both trending AND ranging markets for valid results",
        ],
      },
      {
        title: "Position Sizing for Advanced Traders",
        duration: "14 min",
        content: [
          "Advanced position sizing goes beyond the basic 1–2% rule into dynamic, context-sensitive sizing that scales with confidence, volatility, and overall portfolio risk. This is where many intermediate traders plateau — they use fixed sizing when variable sizing would significantly improve their returns.",
          "Volatility-adjusted sizing: In high-volatility market conditions (ATR expanding, Bollinger Bands widening), reduce position size proportionally. The same percentage risk requires a wider stop loss in high volatility, which means fewer units/contracts for the same dollar risk. This automatically reduces exposure when market conditions are most uncertain.",
          "Conviction-based scaling: Develop a simple A/B/C trade grading system. Grade A trades (maximum confluence, trend aligned, perfect entry zone): 1.5–2% risk. Grade B trades (good setup, most criteria met): 1% risk. Grade C trades (marginal setup, one or two factors missing): 0.5% risk or skip. Grade D: skip entirely. This scaling system rewards your best setups with maximum position size.",
          "Maximum portfolio drawdown limits: Set a daily loss limit (e.g., 3% of account) — if hit, stop trading for the day. Set a weekly limit (e.g., 5%) — if hit, reduce position sizes by 50% for the following week. These circuit breakers prevent the compounding of consecutive losing days into catastrophic drawdowns.",
          "Scaling into a winning trade: Unlike scaling into a losing trade (martingale — dangerous), scaling into a winning trade is legitimate. After TP1 is hit, you may add a second, smaller position in the same direction, with the stop moved to your original entry. This 'pyramid' approach adds exposure only when the market is proving you right.",
        ],
        takeaways: [
          "Advanced sizing: scale with confidence, volatility, and market conditions",
          "High volatility = smaller position size for same dollar risk",
          "Grade trades A/B/C and scale position size accordingly: 2%/1%/0.5%",
          "Set daily (3%) and weekly (5%) loss limits — stop when hit",
          "Pyramid scaling: add to winners AFTER TP1, never add to losers",
        ],
      },
      {
        title: "Understanding Funding Rates in Crypto",
        duration: "12 min",
        content: [
          "Funding rates are one of the most unique and powerful features of cryptocurrency perpetual futures markets. Understanding them gives you a significant edge over traders who only watch price charts. Funding rates are fees exchanged between long and short traders every 8 hours to keep the perpetual futures price aligned with the spot price.",
          "How funding rates work: When more traders are long than short (bullish sentiment bias), longs pay shorts. Rate is positive. When more traders are short than long (bearish bias), shorts pay longs. Rate is negative. The magnitude of the rate reflects the degree of market imbalance — extreme rates signal dangerous positioning.",
          "Trading implications: Very high positive funding rate (0.1%+ per 8 hours = 10.95% annually per position): longs are paying enormous fees AND are overcrowded. A reversal or liquidation cascade is increasingly probable. This is not a 'buy the dip' environment — it's a potential long squeeze setup. Very negative funding rate: shorts are crowded and paying — potential short squeeze incoming.",
          "Funding rate as a contrarian signal: Historically, extreme funding rates (both positive and negative) have preceded significant price reversals. This is because extreme rates indicate maximum positioning in one direction — any adverse price move triggers cascading forced liquidations that amplify the reversal. DemonZeno AI monitors funding rate extremes as a filter for high-conviction counter-positioning signals.",
          "Where to find funding rates: Coinglass.com provides real-time funding rate data across all major exchanges for every major crypto pair. Check it before entering any leveraged crypto trade.",
        ],
        takeaways: [
          "Funding rates align perpetual futures price with spot price",
          "Positive rate: longs pay shorts — too many longs = long squeeze risk",
          "Negative rate: shorts pay longs — too many shorts = short squeeze risk",
          "Extreme funding rates precede major price reversals — use as contrarian signal",
          "Check Coinglass.com before any leveraged crypto trade",
        ],
      },
      {
        title: "Cross-Asset Correlation Analysis",
        duration: "15 min",
        content: [
          "Cross-asset correlation analysis examines how different financial assets move in relation to each other. In today's globally connected markets, no asset moves in isolation. Bitcoin correlates with Nasdaq during risk-off events. Gold correlates negatively with USD. AUD/USD correlates with iron ore prices. Understanding these relationships adds a macro dimension to your technical analysis.",
          "The risk-on / risk-off framework: When investors are confident (risk-on), capital flows into higher-yield, higher-risk assets: crypto, growth stocks, high-yield currencies (AUD, NZD). When investors are fearful (risk-off), capital flees to safety: US dollar, Japanese yen, gold, treasuries. BTC historically behaves as a risk-on asset, correlating with Nasdaq during sell-offs.",
          "Bitcoin and Nasdaq correlation: During periods of macro stress (rate hikes, financial crises, geopolitical events), Bitcoin's correlation with Nasdaq can reach 0.70–0.85. If you're bearish on tech stocks due to a Fed meeting, this is also a bearish signal for BTC. Monitoring the Nasdaq trend gives you an additional macro overlay for crypto trades.",
          "Currency pairs and commodity correlations: AUD/USD moves with iron ore and copper prices (Australia is a major commodity exporter). CAD/USD moves with crude oil (Canada is a major oil exporter). USD/CHF moves inversely with gold (Switzerland = safe haven). These correlations let you cross-validate your forex analysis against broader commodity trends.",
          "Building a correlation dashboard: Track 5 key inter-market relationships: BTC vs Nasdaq, Gold vs USD, AUD/USD vs Copper, DXY (dollar index) vs EUR/USD (inverse), and S&P 500 vs VIX (fear index). When multiple correlated markets align with your trade thesis, conviction increases significantly.",
        ],
        takeaways: [
          "No asset moves in isolation — understand cross-asset relationships",
          "Risk-on: crypto/stocks/AUD rise. Risk-off: USD/gold/JPY rise",
          "BTC correlates with Nasdaq during macro stress — watch tech for crypto cues",
          "AUD/USD reflects commodity prices. CAD/USD reflects oil prices",
          "Build a 5-asset correlation dashboard for macro trade confirmation",
        ],
      },
      {
        title: "Advanced Money Management Rules",
        duration: "15 min",
        content: [
          "Advanced money management is the layer of rules above individual trade risk that governs how your overall portfolio is protected and grown. While the 1–2% rule protects individual trades, portfolio-level money management rules protect against the systemic risk of multiple concurrent losses, regime changes, and extended drawdown periods.",
          "The maximum daily loss rule: Define an absolute dollar amount or percentage of account (e.g., 3%) where you stop trading for the day if losses reach that level. Example: $10,000 account with 3% daily limit = stop trading after losing $300. This prevents 'revenge trading' spirals where a bad morning turns into a devastating day.",
          "The maximum concurrent position rule: Never have more open risk positions than your account can absorb simultaneously. If all your open trades hit their stop losses at the same time (possible in correlated assets during a flash crash), your total loss should not exceed 5–8% of account. With 4 positions × 1.5% risk each = 6% max simultaneous loss.",
          "The drawdown recovery protocol: If your account drops by 10%, reduce all position sizes by 50% until you recover to the high watermark. If it drops 20%, reduce to 25% of normal size. This forces you to trade conservatively when your judgment may be impaired by a losing streak, and ensures the account is still standing when you find your form again.",
          "The allocation pyramid: Divide your trading capital into three tiers. Tier 1 (50%): Your primary trading allocation — the capital you actively risk in trades following your full system. Tier 2 (30%): Reserve capital — this funds additional trades only when Tier 1 shows consistent positive results. Tier 3 (20%): Untouchable reserve — never traded, serves as psychological safety net.",
        ],
        takeaways: [
          "Portfolio-level rules protect against systemic, not just individual, risk",
          "Daily loss limit (3%): hit it → stop trading for the day",
          "Maximum concurrent risk: all open positions combined ≤5–8% of account",
          "Drawdown protocol: -10% = half size. -20% = quarter size",
          "Capital pyramid: 50% active / 30% reserve / 20% untouchable",
        ],
      },
      {
        title: "The Art of Patience in Trading",
        duration: "13 min",
        content: [
          "Patience is arguably the most underrated skill in trading. The difference between a 55% win rate with random entry timing and a 65% win rate with disciplined, patient entry timing is enormous when compounded over hundreds of trades. Patience is not passive — it is the active discipline of declining suboptimal setups while waiting for high-probability ones.",
          "The waiting discipline: Professional traders describe long periods of watching markets without trading as 'doing the work.' During these periods, they are: identifying key levels, watching how price behaves at those levels, noting volume characteristics, and building the context that makes the eventual trade high-conviction. Time spent not trading is not time wasted — it is market study.",
          "Recognizing your impatience triggers: Common triggers that cause premature, low-quality entries: (1) Watching others discuss a trade on social media and feeling FOMO. (2) Having a daily profit target that creates pressure to trade regardless of setups. (3) Boredom during slow market sessions. (4) Wanting to 'make back' a recent loss. Identifying your specific triggers lets you build rules that counter them.",
          "The setup checklist as a patience enforcer: The single most effective tool for enforcing patience is a rigid pre-trade checklist that requires 4–5 confluence factors before entry. If the checklist isn't fully satisfied, no entry is taken — period. The checklist removes discretion from the patience decision and makes 'not trading' the default state rather than an active choice requiring willpower.",
          "Quantifying the value of patience: Review your last 50 trades. Separate them into 'waited for perfect entry' and 'chased an imperfect entry.' Compare win rates, average R:R, and profit factor between these two groups. The data will almost certainly show that your patience-based trades dramatically outperform your impatience-based ones. This data-backed clarity reinforces the habit.",
        ],
        takeaways: [
          "Patience is an active skill — declining bad setups is work, not laziness",
          "Time studying the market without trading is still productive market work",
          "Identify your personal impatience triggers and build rules that counter them",
          "A rigid pre-trade checklist enforces patience by making 'no trade' the default",
          "Review your trades: patience-based entries consistently outperform impulsive ones",
        ],
      },
    ],
  },
  {
    id: "expert",
    name: "Expert",
    description:
      "Master institutional concepts: Smart Money, liquidity theory, order blocks, and market-specific strategies for forex and crypto.",
    color: "oklch(0.60 0.22 25)",
    glowColor: "oklch(0.60 0.22 25 / 0.35)",
    badgeLabel: "Tier 4",
    difficulty: "Expert" as const,
    icon: <Trophy className="w-5 h-5" />,
    lessons: [
      {
        title: "Advanced Risk Management",
        duration: "18 min",
        content: [
          "The Kelly Criterion is a mathematical formula for optimal position sizing: Kelly % = W − [(1 − W) / R], where W = win rate and R = average win/average loss ratio. Example: 55% win rate, 1.5:1 R:R → Kelly = 0.55 − (0.45 / 1.5) = 0.55 − 0.30 = 25%. Many professionals use half-Kelly (12.5%) for safety.",
          "Portfolio Allocation for Trading: Never put all your capital into one market. Diversify across asset classes: 40–60% crypto, 20–30% forex, 10–20% stocks. Within crypto, limit any single altcoin position to 5–10% of your crypto allocation. BTC and ETH are your anchors.",
          "Asset Correlation: Bitcoin and most altcoins are positively correlated — when BTC dumps, alts dump harder. Avoid holding 3 crypto longs simultaneously if they all correlate to BTC — your risk is NOT diversified. In forex, USD pairs (EUR/USD, GBP/USD, AUD/USD) often move together when USD strengthens.",
          "Drawdown Recovery Math: A 10% loss requires an 11.1% gain to recover. A 20% loss requires a 25% gain. A 50% loss requires a 100% gain. A 75% loss requires a 300% gain. This is why capital preservation is the number one priority. Never let a single position risk more than 2% of your account.",
        ],
        takeaways: [
          "Kelly Criterion: optimal position sizing based on win rate",
          "Use half-Kelly in practice for safety buffer",
          "Avoid correlated positions — true diversification requires low correlation",
          "A 50% drawdown needs 100% gain just to break even",
          "Capital preservation > profit chasing",
        ],
      },
      {
        title: "Market Structure",
        duration: "20 min",
        content: [
          "Market Structure describes the series of highs and lows that define trend direction. In an uptrend, price forms Higher Highs (HH) and Higher Lows (HL). In a downtrend, it forms Lower Highs (LH) and Lower Lows (LL). A ranging market forms Equal Highs (EH) and Equal Lows (EL).",
          "Break of Structure (BOS): When price breaks a previous significant swing high (in an uptrend) — this is a BOS that confirms trend continuation. When price breaks below a previous swing low (in an uptrend) — this is a bearish BOS that signals potential reversal. BOS is the foundation of Smart Money Concepts.",
          "Change of Character (ChoCH): The first time price breaks market structure in the opposite direction. In a downtrend, the first time price breaks above a recent swing high = ChoCH = potential trend reversal. Not confirmed yet — wait for the first higher low to form before committing.",
          "Order Blocks: Areas where large institutional orders (from banks, hedge funds) were placed, causing significant price movement. In a bullish Order Block, look for the last bearish candle before a strong bullish move up — this is where institutions bought. Price often returns to these zones to 'retest' before continuing up. DemonZeno signals frequently target Order Block zones.",
        ],
        takeaways: [
          "Uptrend = Higher Highs + Higher Lows",
          "Break of Structure confirms trend continuation or reversal",
          "ChoCH = first signal of potential trend reversal",
          "Order Blocks = institutional buy/sell zones = high-probability entry",
          "Wait for ChoCH + first HL/LH before reversing direction",
        ],
      },
      {
        title: "Liquidity Theory",
        duration: "18 min",
        content: [
          "Liquidity in Smart Money Concepts refers to clusters of stop loss orders. Retail traders predictably place their stops: longs put stops below key lows, shorts put stops above key highs. Institutions (smart money) deliberately push price to these levels to 'hunt' these stops, creating the liquidity they need to fill their large orders.",
          "Equal Highs and Equal Lows: When price forms two or more equal highs, retail traders naturally place their stops just above — this creates a pool of buy stops (liquidity). Smart money will often push price up briefly to grab these stops, then aggressively reverse. This 'liquidity sweep' is one of the most reliable setups in trading.",
          "The Stop Hunt Pattern: Price approaches a key high/low → briefly breaks through it → immediately reverses. This is the classic stop hunt. After the reversal, you enter in the opposite direction of the false breakout with a tight stop. High R:R, high probability setup when combined with Order Block confirmation.",
          "Institutional Traps: Bull Trap — price breaks above a key resistance with apparent strength, retail traders go long, then price reverses sharply lower. Bear Trap — opposite scenario. Learning to identify these traps protects you from being the liquidity that institutions are targeting.",
        ],
        takeaways: [
          "Retail stops above highs and below lows = liquidity for institutions",
          "Equal highs/lows = liquidity pool — expect a sweep",
          "Stop hunt = brief break of key level then sharp reversal",
          "Enter after the stop hunt with tight SL",
          "Bull/Bear traps target retail FOMO traders — don't be the trap",
        ],
      },
      {
        title: "Forex-Specific Strategies",
        duration: "16 min",
        content: [
          "Currency Pair Correlation: Major USD pairs are highly correlated. EUR/USD and GBP/USD typically move in the same direction (positive correlation). EUR/USD and USD/CHF move in opposite directions (negative correlation). Avoid holding multiple positively correlated positions — you are multiplying your risk, not diversifying.",
          "High-Impact News Events: NFP (Non-Farm Payrolls) — released first Friday of each month, 8:30am EST. Causes massive volatility in USD pairs. FOMC (Federal Reserve rate decisions) — extreme USD volatility. Avoid having open positions 30 minutes before and after these releases unless you are specifically trading the news.",
          "Session Timing Strategy: The London Open (3am EST) and London-New York overlap (8am–12pm EST) have the highest volume and best price movement. The Asian session (7pm–3am EST) is generally quieter with smaller ranges, best for range-bound trading strategies.",
          "Carry Trade: Borrowing a low-interest-rate currency and investing in a high-interest-rate currency. Classic example: sell JPY (low rate), buy AUD (higher rate). Earn the interest rate differential. Works in calm markets but can reverse violently during risk-off events (global crises, crashes).",
        ],
        takeaways: [
          "EUR/USD and GBP/USD: positively correlated — don't hold both",
          "Avoid open positions 30 min before/after NFP and FOMC",
          "London-NY overlap (8am–12pm EST) = best price movement",
          "Asian session = quieter, range strategies work better",
          "Carry trades: profit from interest rate differentials",
        ],
      },
      {
        title: "Crypto-Specific Strategies",
        duration: "16 min",
        content: [
          "Bitcoin Dominance (BTC.D): Measures Bitcoin's share of total crypto market cap. When BTC.D rises, capital is flowing INTO Bitcoin and OUT of altcoins — alts underperform. When BTC.D falls, capital is rotating into altcoins — altcoin season. Always check BTC.D before taking altcoin positions.",
          "Funding Rates: In crypto perpetual futures, funding rates are paid between longs and shorts every 8 hours. Extremely high positive funding rate (0.1%+) means longs are overleveraged — a forced liquidation cascade (long squeeze) becomes likely. Negative funding rates mean shorts are crowded — potential short squeeze.",
          "Open Interest (OI): The total number of active futures contracts. Rising OI + rising price = strong uptrend (new money entering longs). Rising OI + falling price = strong downtrend. Falling OI = positions being closed, trend may be losing steam. Combined with funding rates, OI gives you the clearest picture of market positioning.",
          "On-Chain Indicators for BTC: Exchange Inflows/Outflows — when large amounts of BTC move TO exchanges, selling pressure increases. When BTC leaves exchanges, it signals long-term holding (bullish). MVRV Ratio (Market Value to Realized Value) — above 3.0 historically marks cycle tops. Below 1.0 marks extreme undervaluation (cycle bottoms).",
        ],
        takeaways: [
          "BTC Dominance rising = altcoin weakness. Falling = altcoin season",
          "Funding rate >0.1% = long squeeze risk — reduce leverage",
          "OI + price rising = strong trend. OI falling = trend weakening",
          "Exchange BTC outflows = long-term holding (bullish)",
          "MVRV >3.0 = potential cycle top. <1.0 = cycle bottom",
        ],
      },
      {
        title: "Smart Money Concepts",
        duration: "22 min",
        content: [
          "Smart Money Concepts (SMC) is a complete market methodology that reframes how you interpret price action. Instead of seeing random candlestick patterns, you see the deliberate footprint of institutional orders — where large players accumulated positions, where they distributed them, and where they engineered liquidity runs to fill their books.",
          "The three phases of institutional activity: (1) Accumulation — institutions quietly buy at discounted prices, creating a base (often looks like boring range). (2) Manipulation — price is pushed in the opposite direction briefly to grab stops and create optimal entry prices. (3) Distribution — institutions sell into retail buy pressure as the trend makes new highs. Understanding these three phases lets you position at the start of Phase 3.",
          "Order flow and order blocks: An Order Block (OB) is the last opposing candle before a significant move. Before a bullish move, the last bearish candle is the Bullish Order Block — this is where institutions placed their buy orders. Price returns to this level to fill remaining orders before continuing up. These are not random S&R — they represent institutional memory.",
          "Breaker Blocks: When an Order Block is invalidated (price breaks through it), it doesn't disappear — it becomes a Breaker Block, which now acts as S/R in the opposite direction. A Bullish OB that gets broken becomes a Bearish Breaker Block. This helps you identify where the smart money's 'failed' positions create new reference points.",
          "Putting it all together: SMC trade setup — (1) Identify macro market structure (HH/HL or LH/LL). (2) Find the most recent Order Block in a discount zone. (3) Wait for a liquidity sweep + displacement toward the OB. (4) Enter on retest of the OB with FVG as your entry trigger. (5) Target the next liquidity pool above (buyside) or below (sellside). This is the professional's playbook.",
        ],
        takeaways: [
          "SMC phases: Accumulation → Manipulation → Distribution",
          "Order Blocks: last opposing candle before a big move = institutional memory",
          "Breaker Blocks: invalidated OBs flip and become new S&R",
          "SMC entry: OB + FVG retest after liquidity sweep",
          "Target the next liquidity pool for your Take Profit",
        ],
      },
      {
        title: "Institutional Order Flow",
        duration: "20 min",
        content: [
          "Institutional Order Flow refers to the large-volume trading activity of banks, hedge funds, and market makers. Unlike retail traders who trade hundreds or thousands of dollars, institutions trade tens of millions to billions. This scale fundamentally changes HOW they trade — they can't simply buy or sell at a single price without moving the market against themselves.",
          "How institutions enter positions: They use iceberg orders (showing only a fraction of their order size), dark pools (off-exchange trading venues hidden from public view), and algorithmic execution spread over hours or days. Their footprint appears on charts as sustained support/resistance, unusual volume, and post-sweep reversals.",
          "Volume spread analysis (VSA): Institutions cannot hide their volume. When a wide-spread bearish candle closes on dramatically high volume, institutions are selling into weakness. When a narrow-spread candle closes on extreme volume at a support level, institutions are absorbing sell orders (hidden accumulation). Volume tells you WHO is trading, not just HOW MUCH.",
          "The COT Report (Commitments of Traders): Published weekly by the CFTC, the COT report shows the positioning of commercial traders (institutions/producers), non-commercial traders (large speculators/hedge funds), and retail traders. When commercials are heavily long, the market is near a bottom. When they're heavily short, the market is near a top. DemonZeno AI monitors COT data for macro context.",
          "Practical application: You don't need to read order books to trade with institutional flow. Read market structure, identify Order Blocks and FVGs, watch for liquidity sweeps, and ensure your trade aligns with the dominant institutional narrative. Trade the same direction as the smart money — never against it.",
        ],
        takeaways: [
          "Institutions can't enter/exit without leaving a footprint on charts",
          "Wide spread + extreme volume = institutional distribution or accumulation",
          "VSA: analyze volume and spread together to identify institution activity",
          "COT report: institutionals heavily long = market near bottom",
          "Always trade WITH institutional flow — never against it",
        ],
      },
      {
        title: "Statistical Edge in Trading",
        duration: "17 min",
        content: [
          "A statistical edge means your trading system produces positive expectancy over a large sample of trades. Positive expectancy = (Win Rate × Average Win) − (Loss Rate × Average Loss) > 0. Without positive expectancy, no amount of skill, discipline, or money management can make a system profitable long-term.",
          "Calculating your edge: Run your system on at least 100 historical trades (backtesting). Calculate: Win Rate (W), Average Win (AW), Average Loss (AL). Expectancy = (W × AW) − ((1−W) × AL). Example: 55% win rate, average win $200, average loss $100. Expectancy = (0.55 × 200) − (0.45 × 100) = 110 − 45 = $65 per trade.",
          "Protecting your edge: An edge can be eroded by transaction costs (spreads, commissions), market regime changes, over-trading, emotional execution deviations, and curve-fitting (optimizing a system too specifically for past data). Regular re-evaluation is critical — markets evolve and so must your system.",
          "Edge vs variance: A positive-expectancy system still has variance — you can have 10 losing trades in a row even with a 60% win rate. This is normal statistics. The 1–2% risk rule is designed to keep you in the game long enough for the edge to manifest over hundreds of trades. Short-term results are noise; long-term trends reveal the edge.",
          "Quantifying DemonZeno AI signals: Because DemonZeno AI uses 50+ providers and multi-factor analysis, it's designed to output signals with calculated positive expectancy. Your job is to execute those signals consistently — not second-guess them based on short-term variance.",
        ],
        takeaways: [
          "Edge = positive expectancy: (Win% × Avg Win) − (Loss% × Avg Loss) > 0",
          "Backtest on 100+ trades before trusting any system",
          "Edge can be eroded by costs, regime changes, and emotional deviations",
          "10 losses in a row with a 60% win rate is normal — stay in the game",
          "Consistent execution of a positive-expectancy system builds wealth",
        ],
      },
      {
        title: "Building a Trading System",
        duration: "21 min",
        content: [
          "A complete trading system has six components: (1) Market selection — which assets you trade and which you avoid. (2) Entry rules — the exact conditions required before entering any trade. (3) Exit rules — defined TP levels, trailing stop rules, and maximum time in trade. (4) Risk rules — position sizing formula, maximum daily loss, maximum open positions. (5) Filters — conditions that improve setup quality (session timing, trend alignment). (6) Review process — systematic performance evaluation and iteration.",
          "Entry rules must be objective: 'Price is at support' is not an entry rule — it's subjective. 'Price reaches the 0.618 Fibonacci level within the most recent demand zone AND RSI is below 40 AND MACD histogram is turning up' is an objective entry rule. The more objective your rules, the more consistent your execution.",
          "Creating your trading plan document: Write it before you need it. Define every scenario: What do you do if the news event hits while you're in a trade? What if price gaps past your SL? What is your maximum daily loss limit? What constitutes a 'bad day' that triggers a trading pause? Written rules prevent impulsive decisions.",
          "Iteration and improvement: After every 50 trades, review your performance metrics. Are certain setups underperforming? Is a specific session showing worse results? Are you consistently deviating on a particular rule? Identify the weakest link and fix it. Successful traders iterate their system constantly — never treating it as finished.",
          "The DemonZeno signal system as your foundation: If you're starting out, you don't need to build a complete system from scratch. Use DemonZeno signals as your entry filter, combine them with your own confirmation process, apply the 1–2% risk rule, and follow the TP management framework. Build from there.",
        ],
        takeaways: [
          "6 system components: market, entry, exit, risk, filters, review",
          "Entry rules must be 100% objective — no room for interpretation",
          "Write your trading plan before you need it — not during a trade",
          "Review performance every 50 trades and fix the weakest link",
          "DemonZeno signals are a proven entry foundation to build around",
        ],
      },
      {
        title: "Advanced Position Sizing (Kelly Criterion)",
        duration: "16 min",
        content: [
          "The Kelly Criterion is a mathematical formula developed by Bell Labs scientist J.L. Kelly Jr. to determine the optimal fraction of capital to bet on each trade. Formula: Kelly % = W − [(1 − W) / R], where W = win rate and R = average win divided by average loss.",
          "Example calculation: 60% win rate, average win $150, average loss $100. R = 150/100 = 1.5. Kelly = 0.60 − (0.40 / 1.5) = 0.60 − 0.267 = 33.3%. This suggests risking 33.3% of your capital per trade for maximum geometric growth rate — but this is dangerously aggressive for real-world trading.",
          "Half-Kelly and fractional Kelly: Most professional traders use Half-Kelly or Quarter-Kelly. Half-Kelly = 16.7% in the example above. While this reduces growth rate, it dramatically reduces variance (volatility of returns) and prevents catastrophic drawdowns from a bad stretch. The geometric mean of outcomes is actually HIGHER with fractional Kelly than full Kelly over the long run.",
          "Kelly with imperfect win rate estimates: The Kelly formula assumes perfectly accurate win rate and R:R estimates. In practice, your edge estimate always has uncertainty. If you overestimate your edge and use full Kelly, you risk overbetting. Conservative Kelly applications account for this by using 25% of the Kelly recommendation.",
          "When not to use Kelly: Kelly assumes all trades are independent with consistent edge. If you're entering during regime changes, correlations between trades are high, or your edge is unproven with small sample sizes, revert to fixed fractional risk (1–2%) until you have 100+ trades confirming the edge.",
        ],
        takeaways: [
          "Kelly % = Win Rate − [(1 − Win Rate) / R:R ratio]",
          "Full Kelly is too aggressive — use Half or Quarter Kelly in practice",
          "Fractional Kelly reduces drawdown while maintaining most of the growth",
          "Account for uncertainty — conservative Kelly = 25% of the Kelly output",
          "Revert to fixed 1-2% risk when edge is unproven (< 100 trades)",
        ],
      },
      {
        title: "Algorithmic Trading Concepts",
        duration: "18 min",
        content: [
          "Algorithmic trading uses computer programs to execute trades based on predefined rules, eliminating human emotion from execution entirely. While building a full trading algorithm requires programming knowledge, understanding algorithmic concepts makes you a significantly better manual trader — because the institutions moving markets ARE algorithmic.",
          "How algorithms work: A trading algorithm encodes your entry rules, exit rules, position sizing formula, and risk management parameters into code. When market conditions match the criteria, the algorithm executes instantly — no hesitation, no second-guessing, no FOMO. The discipline you struggle to maintain manually is automatic for an algorithm.",
          "Types of trading algorithms: (1) Trend-following algorithms — enter when momentum indicators cross defined thresholds. Simple and robust. (2) Mean reversion algorithms — enter when price deviates significantly from a statistical average. Works in range-bound markets. (3) Market making algorithms — place bids and asks simultaneously to capture the spread. Used by exchanges and professional market makers. (4) Statistical arbitrage — exploit pricing inefficiencies between correlated assets.",
          "Key algorithmic concepts for manual traders: Backtesting rigor (test on out-of-sample data to avoid curve fitting), parameter sensitivity (does the system still work if you slightly change the parameters?), regime filters (does the system detect when its strategy type is out of favor and reduce trading?), and transaction cost modeling (always include realistic fees in performance calculations).",
          "Practical application: Even without coding, you can apply algorithmic thinking. Write your trading rules so precisely that you could theoretically encode them. If your entry rule is 'RSI is oversold at key support,' that's not precise enough. 'RSI crosses back above 30 after being below 28 for at least 3 consecutive bars, AND price is within 0.5% of the prior swing low' — that is precise enough to code, and precise enough to follow manually with consistency.",
        ],
        takeaways: [
          "Algorithmic thinking: write rules so precise they could be coded",
          "Institutions use algorithms — understanding them reveals market mechanics",
          "4 algorithm types: trend-following, mean reversion, market making, arb",
          "Test on out-of-sample data to validate — not just in-sample backtest",
          "Precise rules eliminate discretion and enforce consistent execution",
        ],
      },
      {
        title: "Developing Your Own Trading System",
        duration: "20 min",
        content: [
          "Developing your own trading system is the most transformative step in a trader's journey — the transition from following other people's rules to operating with proprietary, tested, personally optimized rules. Your system becomes an extension of your thinking, refined through iteration into a genuine edge.",
          "System development framework: (1) Market selection — which markets and timeframes fit your schedule, personality, and edge? (2) Entry criteria — define the exact observable conditions that trigger a trade entry, with zero ambiguity. (3) Exit criteria — define exactly when you exit with profit (TP levels) and with loss (SL rule). (4) Position sizing — your formula for calculating contract/unit size per trade. (5) Portfolio rules — maximum open positions, correlation limits, daily loss limits.",
          "Personality fit: No system works if you can't follow it consistently. A scalping system requires 4–6 hours of intense screen time daily — if you have a full-time job, you'll fail at this system regardless of its quality. A swing trading system requires patience to hold positions 3–7 days through normal fluctuations — if you panic at every pullback, you'll fail this system. Match the system's requirements to your actual life and psychology.",
          "Iterative refinement: After every 50 live trades, review your metrics and identify the weakest variable. Change only ONE thing at a time. Test for 50 more trades. Measure whether the metric improved. This scientific iteration approach compresses years of random experimentation into months of directed improvement.",
          "Protecting your system: Once developed and validated, your trading system is your intellectual property and your financial survival tool. Don't share it publicly — behavioral edge disappears when everyone knows about it. Don't deviate from it based on advice from social media traders. Don't abandon it after a drawdown without statistical evidence that the edge has been lost.",
        ],
        takeaways: [
          "Your own system = your edge, your rules, your tested foundation",
          "5 system components: market selection, entry, exit, sizing, portfolio rules",
          "Match system requirements to your schedule and personality — or it will fail",
          "Change one variable at a time: 50 trades → measure → iterate",
          "Protect your system: don't share it, don't deviate, don't abandon it during drawdowns",
        ],
      },
      {
        title: "Risk of Ruin and Drawdown Management",
        duration: "16 min",
        content: [
          "Risk of Ruin is the mathematical probability that your account will reach zero (or an unacceptable minimum) given your win rate, R:R ratio, and position sizing. Every trader has a risk of ruin — the goal is to drive it as close to zero as possible through disciplined position sizing and strict adherence to risk rules.",
          "Calculating risk of ruin: The formula depends on win rate, average win/loss ratio, and bet size as a percentage of capital. A trader with 50% win rate, 1:1 R:R, risking 10% per trade has a very high risk of ruin — essentially guaranteed to blow up given enough trades. The same win rate with 1% risk per trade has a near-zero risk of ruin. Position size is the single most powerful lever for controlling this.",
          "The mathematics of drawdown: A 50% drawdown requires a 100% gain just to recover. A 25% drawdown requires only a 33% gain. The asymmetry is brutal: the deeper the drawdown, the exponentially harder recovery becomes. This is why protecting against deep drawdowns is more important than maximizing gains during good periods.",
          "Drawdown recovery system: (1) After a 5% drawdown: continue at normal size, but review your last 10 trades for system adherence. (2) After a 10% drawdown: reduce position size by 50% until you recover 5% of the drawdown. (3) After a 15% drawdown: stop trading for 48 hours, conduct a thorough system review, then resume at 25% normal size. (4) After a 20% drawdown: take a full week off, implement all identified improvements, resume at minimum size.",
          "Psychological impact of drawdown: Drawdowns are inevitable even in positive-expectancy systems. A 60% win rate system can produce 8 consecutive losses by random chance. Understanding this mathematically prevents you from abandoning a valid system during a normal variance period. The trader who abandons a good system during a drawdown and starts a new system repeats this cycle indefinitely — always abandoning the system right before the winning streak would have recovered them.",
        ],
        takeaways: [
          "Risk of ruin = probability of account reaching zero — drive it to near zero",
          "1% position size creates near-zero risk of ruin even with imperfect edge",
          "50% drawdown requires 100% gain to recover — avoid deep drawdowns at all cost",
          "4-stage drawdown protocol: 5% → review, 10% → half size, 15% → pause, 20% → week off",
          "Good systems have drawdowns — variance is normal, not system failure",
        ],
      },
      {
        title: "Market Microstructure Understanding",
        duration: "17 min",
        content: [
          "Market microstructure is the study of how trading actually works at the execution level — how prices are formed, how orders are matched, how liquidity providers operate, and why price moves the way it does at a granular level. This knowledge separates traders who get systematically exploited from those who exploit market mechanics.",
          "Bid-ask spread and market makers: In every market, there is a buyer (bid) and a seller (ask). The difference between them is the spread — market makers' profit. Market makers constantly place both bids and asks, profiting from the spread on every transaction. They hedge their directional risk. Understanding this shows why market orders always slightly disadvantage the buyer/seller vs. limit orders.",
          "Price impact and slippage: When you place a market order, you consume available orders at the current price until your full size is filled. Large orders consume multiple price levels — this is price impact. For large institutional orders, the act of buying raises the price against them. This is why institutions use limit orders, algorithmic execution spread over time, and dark pools. Understanding this explains why certain price levels reverse exactly when you'd expect.",
          "Order matching engines: Most exchanges use a FIFO (First In, First Out) matching engine — orders at the same price are filled in the order they were placed. This creates incentives for speed, which is why HFT firms co-locate servers next to exchange data centers. For retail traders, understanding the matching engine clarifies why limit orders at the top of the book get filled first.",
          "Spoofing and market manipulation: Spoofing is placing large visible orders with the intent to cancel them — creating a false impression of supply/demand to influence price. It is illegal in regulated markets but exists in crypto. Large 'walls' of orders on order books that disappear the moment price approaches them are spoof orders. Knowing this prevents you from anchoring to fake order book signals.",
        ],
        takeaways: [
          "Microstructure: understand how orders are matched and prices are formed",
          "Limit orders > market orders: avoid the bid-ask spread cost",
          "Large orders create price impact — institutions spread execution over time",
          "FIFO matching: earliest orders at a price fill first",
          "Spoofing: cancel large orders before fill — don't anchor to fake book walls",
        ],
      },
      {
        title: "Trading Across Multiple Timeframes",
        duration: "16 min",
        content: [
          "Multi-timeframe trading is not just about checking multiple charts — it is about building a hierarchical analytical framework where each timeframe serves a specific function. The confusion that beginning traders have when timeframes conflict disappears once you understand the correct role of each level in the hierarchy.",
          "The three-timeframe system: (1) The macro timeframe (weekly/daily) — this defines the overall trend direction and the key structural levels. You NEVER take trades that contradict this timeframe. It's the ocean current. (2) The setup timeframe (4H/1H) — this identifies the specific pattern, entry zone, and the setup quality. You look for the trade here. (3) The entry timeframe (1H/15min) — this gives the precise entry trigger and exact stop placement. You fine-tune here.",
          "Timeframe cascade: Before entering any trade, the cascade must flow in one direction. If the daily is bullish (higher highs and higher lows), the 4H must be showing a pullback to support (setup), and the 1H must confirm a bullish reversal pattern at that support (entry trigger). If the daily is bullish but the 4H is in a strong downtrend without a clear reversal, there is no cascade — wait.",
          "Holding period alignment: Your target timeframe determines your holding period and thus which timeframe you use for entry. If you want to hold for 3–7 days, the daily chart is your primary setup chart and the 4H is your entry chart. If you want to hold for hours, the 4H is your primary and the 1H is your entry. Never use a higher timeframe for entry than your intended holding period.",
          "Reconciling conflicting timeframes: When a lower timeframe signal conflicts with the higher timeframe trend (e.g., hourly chart is showing bearish signals in a daily uptrend), either wait for alignment or reduce position size significantly. The higher timeframe ALWAYS wins in a direct conflict. The lower timeframe simply represents a temporary counter-current within the larger directional flow.",
        ],
        takeaways: [
          "3-TF system: Macro (trend) → Setup (pattern) → Entry (trigger)",
          "Cascade: all 3 timeframes must agree in one direction before entry",
          "Holding period determines which timeframe is primary",
          "Higher timeframe ALWAYS wins in a direct conflict with lower TF",
          "No cascade = no trade. Wait for alignment.",
        ],
      },
      {
        title: "Portfolio Risk Management",
        duration: "17 min",
        content: [
          "Portfolio risk management extends individual trade risk rules to the entire book of open positions. While 1–2% risk per trade is sound, a portfolio of 10 correlated long positions simultaneously — even at 1% each — creates 10% correlated risk that can all be triggered at once during a flash crash or macro event.",
          "Correlation-adjusted risk: True diversification requires selecting positions with low or negative correlation. Two long positions in BTC and ETH are not 2% + 2% = 4% independent risk — they're closer to 4% combined risk because they crash together. When building a multi-position portfolio, calculate the correlation matrix and adjust sizes so truly correlated positions share the same risk budget.",
          "Sectoral diversification in crypto: The crypto market has distinct sectors with varying correlation profiles: L1 blockchains (BTC/ETH/SOL/AVAX), DeFi tokens, NFT/gaming tokens, infrastructure/scaling tokens, stablecoins. True crypto diversification holds positions across sectors rather than multiple tokens in the same sector.",
          "Maximum portfolio heat: Define a 'maximum heat' level — the total percentage of your portfolio that is currently at risk across all open positions. For most traders, 5–8% maximum heat is appropriate. If you're already at 6% heat (4 positions × 1.5% each), you don't open new trades until existing ones reach TP1 (moving to breakeven, reducing heat to 0% on those positions).",
          "Rebalancing and correlation shifts: Portfolio correlations change over time — assets that were uncorrelated can become correlated during macro events. Review your correlation assumptions monthly. During high macro volatility periods (major central bank events, geopolitical crises), reduce overall portfolio heat to 2–3% as a precaution, regardless of individual trade quality.",
        ],
        takeaways: [
          "Portfolio risk ≠ sum of individual risks when positions are correlated",
          "Correlated positions share a risk budget — not independent percentages",
          "Crypto diversification: spread across sectors (L1, DeFi, infrastructure)",
          "Maximum portfolio heat: 5-8% total open risk across all positions",
          "In macro volatility: reduce total heat to 2-3% regardless of setup quality",
        ],
      },
      {
        title: "Advanced Backtesting with Walk-Forward Analysis",
        duration: "18 min",
        content: [
          "Standard backtesting tests your strategy on historical data to estimate future performance. But there's a fundamental problem: by optimizing rules to fit past data, you can create a system that looks brilliant historically but fails completely on new data. Walk-Forward Analysis solves this problem by systematically testing how well your strategy adapts to unseen data.",
          "What is Walk-Forward Analysis (WFA): In WFA, you divide your historical data into multiple time windows. You optimize your strategy on the first window (in-sample), then test it without any adjustments on the next window (out-of-sample). Then slide the window forward and repeat. The result is a series of out-of-sample performance metrics that reflect how the strategy would have performed in real-time.",
          "The in-sample/out-of-sample ratio: A common split is 70% in-sample for optimization, 30% out-of-sample for testing. The out-of-sample results must also show positive expectancy — if they don't, the in-sample results are a product of curve fitting rather than genuine edge. A strategy that performs well in-sample but fails out-of-sample is not a real strategy.",
          "Monte Carlo simulation: Monte Carlo testing randomizes the sequence of your historical trades to generate thousands of possible equity curves. This reveals the realistic distribution of outcomes: best-case, worst-case, and most likely. It answers the critical question: 'What is the maximum drawdown I should realistically expect, even in a positive-expectancy system?' This prepares you psychologically for variance.",
          "Practical WFA for retail traders: While institutional traders use automated WFA software, you can perform simplified WFA manually. Take 18 months of data. Optimize your rules on months 1–12 (in-sample). Test unchanged on months 13–18 (out-of-sample). If out-of-sample is also profitable, the edge has some generalizability. This is better than single-period backtesting and catches the most egregious curve fitting.",
        ],
        takeaways: [
          "WFA tests strategy on unseen data to validate generalizability",
          "In-sample: optimize. Out-of-sample: test without any changes",
          "Good in-sample + bad out-of-sample = curve fitting, not real edge",
          "Monte Carlo: randomize trade order to find realistic drawdown expectations",
          "Simple WFA: optimize on first 12 months, test unchanged on next 6",
        ],
      },
      {
        title: "Building a Trading Edge",
        duration: "17 min",
        content: [
          "A trading edge is a systematic, statistically verifiable advantage over other market participants that produces positive expectancy over a sufficient number of trades. Without an edge, trading is pure gambling. With a genuine edge, trading is a probabilistic business. Building and protecting your edge is the central long-term endeavor of any serious trader.",
          "Sources of trading edge: (1) Informational edge — knowing something others don't (rare for retail traders). (2) Analytical edge — processing publicly available information better or faster than the market consensus. (3) Execution edge — entering and exiting at better prices through discipline and timing. (4) Psychological edge — making better decisions under pressure than emotional traders. (5) Risk management edge — surviving drawdowns that eliminate less disciplined traders.",
          "Quantifying your edge: Edge = (Win% × Avg Win) − (Loss% × Avg Loss). This is positive expectancy. But true edge must be measured over at least 100 trades, tested across multiple market regimes (trending, ranging, volatile, quiet), and accounted for real-world costs. An edge that works in a bull market but fails in a bear market is a bias, not an edge.",
          "Edge decay and maintenance: Markets evolve. An edge that worked in 2020 may have been arbitraged away by 2025 as more traders adopted similar approaches. Monitor your system's performance quarterly. If win rate and profit factor are declining over 50+ trades, your edge may be decaying. Research what market structural changes might be causing this and adapt.",
          "Compounding edge over time: A small, consistent edge compounds dramatically over time. A trader with 55% win rate, 1.2:1 R:R, risking 1% per trade, making 5 trades per week will grow a $10,000 account to approximately $150,000 in 5 years — without ever risking more than 1% per trade. The edge doesn't need to be large. It needs to be consistent and well-managed.",
        ],
        takeaways: [
          "Edge = statistically verified positive expectancy over 100+ trades",
          "5 sources: informational, analytical, execution, psychological, risk management",
          "Psychological and risk management edges are most accessible to retail traders",
          "Test edge across multiple market regimes — not just one favorable period",
          "Small consistent edge (55% WR, 1.2:1 RR) compounds to significant wealth over 5+ years",
        ],
      },
    ],
  },
  {
    id: "master",
    name: "Master",
    description:
      "The elite tier. Build a complete trading system, master the DemonZeno method, and operate like a professional trader.",
    color: "oklch(0.75 0.15 85)",
    glowColor: "oklch(0.75 0.15 85 / 0.35)",
    badgeLabel: "Tier 5",
    difficulty: "Master" as const,
    icon: <GraduationCap className="w-5 h-5" />,
    lessons: [
      {
        title: "Avoiding Common Mistakes",
        duration: "15 min",
        content: [
          "Revenge Trading: You took a loss. Your brain releases cortisol and you feel an overwhelming urge to 'win it back immediately.' You enter a bigger position without a setup. The trade loses. Now you've turned a small loss into a large one. The cure: After ANY loss, stop trading for at least 30–60 minutes. Implement a rule: maximum 3 consecutive losses in a day = done for the day.",
          "Overleveraging: 10x, 20x, 100x leverage feels powerful until a 1% adverse move liquidates your position. Professional traders rarely use more than 3–5x leverage. High leverage amplifies both gains AND losses. A single bad leveraged trade can wipe months of consistent gains. If you can't afford the position without leverage, don't take the trade.",
          "FOMO Entries: The chart is up 30% and you missed the entry. You buy the top out of fear of missing more gains. Price immediately pulls back. FOMO is a guaranteed money-loser over time. Rule: If price is more than 2% away from the signal entry, skip the trade and wait for the next setup.",
          "Ignoring the Stop Loss: You move the SL lower to 'give the trade more room.' Then again. Now you're down 30% in a position that was supposed to be a 5% risk. The stop loss is your contract with your future self. Violating it is the single most destructive habit in trading.",
          "Overtrading: More trades does not mean more profit. Trading 20 positions a day burns capital in fees and multiplies emotional decision-making. Quality over quantity. Wait for A+ setups only. A professional trader might only take 3–5 trades per week — but each is carefully planned and executed.",
          "Trading Without a Plan: No defined Entry, SL, and TP before you enter = gambling. Every position needs a pre-trade thesis: Why am I entering? What confirms my setup? What invalidates it? Where do I exit with profit? Where do I exit with loss? Without answers, don't trade.",
        ],
        takeaways: [
          "After any loss: 30–60 min break. Max 3 losses = done for the day",
          "Never use leverage higher than your emotional control allows",
          "If price is >2% from entry: skip the trade, wait for the next",
          "Stop Loss is a sacred contract — never move it against you",
          "3–5 A+ trades per week beats 20 impulsive trades every time",
        ],
      },
      {
        title: "Building a Trading System",
        duration: "22 min",
        content: [
          "A Trading System is a complete, rule-based approach to the market with defined entry criteria, exit criteria, risk parameters, and a trade management plan. Systems remove emotion from decisions because every scenario has a predefined response. You don't think — you execute.",
          "Backtesting: Before trading a system live, test it against historical data. Take your entry rules and apply them to 6–12 months of historical charts. Record every hypothetical trade: entry, exit, result. Calculate your win rate, average R:R, maximum drawdown, and profit factor. A system with a profit factor above 1.5 is worth testing live.",
          "Forward Testing: After backtesting shows positive results, paper trade the system in real-time for 30–60 days. This tests your system against current market conditions — and more importantly, tests YOUR ability to follow the rules under real-time pressure.",
          "System Rules Example (DemonZeno Framework): Entry — price reaches the DemonZeno signal entry level with RSI confirming direction. Position size — 1% risk per trade. Exit — TP1 (close 40%), move SL to entry. TP2 (close 40%), move SL to TP1. TP3 (close 20%), trailing stop. SL — never moved against the trade.",
          "Trade Journaling: Every trade must be recorded. Include: date, asset, direction, entry price, SL, TP levels, actual exit price, R:R achieved, emotional state at entry, emotional state at exit, and lessons learned. Review weekly. The journal is the most powerful tool for improvement — more valuable than any indicator.",
        ],
        takeaways: [
          "A rule-based system removes emotion from decisions",
          "Backtest on 6–12 months of history before going live",
          "Profit Factor >1.5 = system worth live testing",
          "Paper trade for 30–60 days after backtesting",
          "Trade journal = your most powerful improvement tool",
        ],
      },
      {
        title: "Advanced Signal Chaining",
        duration: "18 min",
        content: [
          "Signal Chaining is the practice of combining multiple signals across different assets and timeframes into a coherent, multi-leg trading plan. Instead of treating each signal independently, you build a narrative: BTC shows strength on the daily → ETH signal on the 4H aligns with bullish BTC → SOL setup appears on the 1H. You size each position appropriately and manage them as a portfolio.",
          "Multi-Asset Correlation Plays: When a DemonZeno signal fires for a major crypto asset (BTC/ETH), related assets often move in the same direction with a slight lag. Identifying this lag and placing entries in correlated assets just as the leader begins to move gives you multiple high-probability setups from a single macro view.",
          "Timeframe Chaining: Use a Daily signal to identify the macro direction. Use a 4H signal from DemonZeno to get the setup. Use 1H analysis to fine-tune the entry. This multi-timeframe entry technique maximizes R:R by getting the lowest possible risk entry in the direction of the larger trend.",
          "Risk Allocation Across Chains: When running 3–4 correlated positions simultaneously, your total risk must still stay within 5–6% of your account. Example: 4 correlated crypto longs × 1.5% risk each = 6% total risk. If all correlate and stop out simultaneously, you've lost 6%, not 1.5%. Always calculate portfolio-level risk, not just per-trade risk.",
        ],
        takeaways: [
          "Chain signals across assets to build a coherent trading plan",
          "Correlation lag = entry opportunity in correlated assets",
          "Daily direction + 4H setup + 1H entry = maximum R:R",
          "Total portfolio risk must stay ≤5–6% even across multiple trades",
          "Always calculate correlation before adding a correlated position",
        ],
      },
      {
        title: "The DemonZeno Method",
        duration: "20 min",
        content: [
          "The DemonZeno Method is a complete signal philosophy: Master the Chaos, Slay the Market, and Trade Like a God. Every signal is generated with three principles: technical confluence (multiple indicators agreeing), risk-first thinking (SL defined before entry), and multi-target exits (TP1/TP2/TP3 to lock in gains at multiple levels).",
          "Reading DemonZeno AI Signals: Every AI-generated signal uses a multi-provider approach — Groq, Together AI, Gemini, DeepSeek, OpenRouter, and more — to generate the most accurate real-time analysis. The signal includes the asset, direction, entry, SL, and three TP levels. The AI considers current price action, volume, key S&R levels, and indicator confluence before outputting any signal.",
          "Maximizing TP Targets: TP1 is conservative — designed to be hit quickly, locking in partial profit and reducing risk. TP2 is the core target — where the majority of expected movement ends. TP3 is the optimistic target — only reached in strong trend conditions. Partial close at each level, trail stop upward. This approach captures the 'guaranteed' portion of a move while leaving exposure for the exceptional case.",
          "The DemonZeno AI Advantage: With 50+ AI providers contributing to every signal, you get the aggregate intelligence of the best AI models available: pattern recognition from GPT-4, real-time data from Grok, mathematical analysis from Claude, and signal chaining from Gemini. No single AI has all the answers — but together, they approach something close to omniscience about market conditions.",
          "Living the DemonZeno Philosophy: Trade with conviction, not hope. Execute with precision, not emotion. Manage with discipline, not greed. Lose with grace, not revenge. And above all — protect the account. The market will always be there. Your capital, once lost, takes time and discipline to rebuild.",
        ],
        takeaways: [
          "DemonZeno signals: Technical confluence + risk-first + multi-TP",
          "TP1 = guaranteed partial. TP2 = core target. TP3 = optimal",
          "50+ AI providers → aggregate intelligence = edge",
          "Close 40% at TP1, 40% at TP2, trail last 20% to TP3",
          "Protect the account above all — capital is the business",
        ],
      },
      {
        title: "Trading as a Business",
        duration: "16 min",
        content: [
          "Professional traders treat trading as a business, not a casino. They have business plans (trading plans), performance metrics (win rate, R:R, profit factor), operating costs (spreads, commissions), and capital allocation strategies (how much to deploy, when to scale up or down).",
          "Consistency Over Gambling: A professional aims for consistent, moderate returns — 5–10% per month is exceptional. Not 200% in one week. The traders who blow accounts are those chasing extraordinary gains. The traders who build wealth are those who compound modest gains consistently over years.",
          "Scaling Your Account: Once you've proven your system works (3+ months of consistent profitability), you scale. You add capital incrementally. You never double your account size after one good month and blow it on overleveraged trades. Scaling is gradual, systematic, and data-driven.",
          "The Long-Term Wealth Building Mindset: Compounding is the most powerful force in trading. $10,000 growing at 5% monthly = $17,958 after 12 months. At 10% monthly = $31,384. The key is consistency — protecting your capital during losing months so your account can grow during winning months.",
          "Your Edge: Every successful trader has an edge — a systematic advantage over other market participants. Your edge might be the DemonZeno signal system, your risk management discipline, your mastery of Smart Money Concepts, or your multi-timeframe analysis approach. Identify it, quantify it, protect it, and execute it relentlessly.",
        ],
        takeaways: [
          "Treat trading as a business: plan, metrics, capital allocation",
          "Target 5–10% monthly consistency over 200% gambling",
          "Scale capital only after 3+ months of proven consistency",
          "$10K at 5% monthly = $17,958 after 12 months (compounding)",
          "Identify and protect your edge — execute it relentlessly",
        ],
      },
      {
        title: "Full Trading System Design",
        duration: "25 min",
        content: [
          "At the Master level, you design a complete proprietary trading system — not just follow someone else's signals. Your system integrates all previous knowledge: market structure reading, confluent entry criteria, multi-timeframe analysis, supply/demand zones, ICT kill zones, position sizing, and trade management into one coherent, rules-based framework.",
          "The Master-level system architecture: Define your market universe (which assets, which exchanges), your scanning criteria (what conditions trigger you to look at a setup), your entry protocol (exact criteria for a valid entry), your trade management algorithm (when to add, when to scale out, when to abort), and your portfolio construction rules (how many positions, correlation limits, total risk budget).",
          "Stress testing your system: Beyond backtesting normal market conditions, a Master-level trader stress tests against extreme scenarios: 2020 COVID crash, 2008 financial crisis, 2021 crypto winter, flash crashes, and liquidity crises. Does your system have rules for these events? How would your position sizing and risk limits protect you?",
          "System documentation: A complete trading system should be so thoroughly documented that another trader could execute it identically. This documentation serves as both your operational manual and your intellectual property. It forces you to make every rule explicit and removes the last traces of ambiguity or emotional discretion.",
          "Continuous improvement protocol: Quarterly system reviews with statistical significance testing. A change to your entry criteria requires at least 30 forward-tested trades before implementation. Track the delta — how did the change affect key metrics? Approach system development with the scientific method: hypothesis, test, measure, iterate.",
        ],
        takeaways: [
          "Master-level system: 6 components fully integrated and documented",
          "Stress test against extreme scenarios (2008, 2020, crypto winters)",
          "Document every rule explicitly — no room for discretion or ambiguity",
          "System changes require 30+ forward-tested trades before adoption",
          "Apply scientific method: hypothesize, test, measure, iterate",
        ],
      },
      {
        title: "Behavioral Finance and Psychology",
        duration: "22 min",
        content: [
          "Behavioral finance is the scientific study of psychological influences on financial decision-making. Nobel laureates Daniel Kahneman and Amos Tversky proved that humans are systematically irrational in financial contexts. Understanding these biases doesn't just make you a better trader — it makes you a better decision-maker in all domains.",
          "Loss aversion: Humans feel the pain of a loss approximately 2× more intensely than the pleasure of an equivalent gain. This causes traders to hold losing trades too long (avoiding the pain of realizing the loss) and sell winners too early (to lock in the pleasure before it disappears). Solution: pre-set TP and SL levels and never override them.",
          "Confirmation bias: Once you have a trade thesis, your brain subconsciously filters information to confirm it and ignores contradictory evidence. You entered a long, so you notice all the bullish signals and ignore the bearish ones. Solution: actively seek the strongest argument AGAINST your thesis before entering. If you can't counter the bear case, your thesis isn't strong enough.",
          "The disposition effect and anchoring: Traders anchor to their entry price — treating it as a magical reference point. If you bought BTC at $65,000 and it drops to $60,000, the fact that it's 'down from where you bought' is psychologically irrelevant to what price will do next. The market doesn't know or care where you entered. Trade the current structure, not your entry anchor.",
          "Overconfidence and the hot hand fallacy: After a series of winning trades, traders become overconfident and increase position sizes, taking worse setups. After a series of losses, they become excessively cautious and miss good setups. The solution is rules-based position sizing that removes discretion from bet-sizing decisions. Your edge is consistent — your position size should be too.",
        ],
        takeaways: [
          "Loss aversion: losses feel 2x worse than equivalent gains feel good",
          "Confirmation bias: actively seek the strongest bear case before going long",
          "Anchoring to entry price is irrational — trade current structure, not your cost basis",
          "Post-win overconfidence is as dangerous as post-loss fear",
          "Rules-based sizing eliminates discretionary bet-sizing errors",
        ],
      },
      {
        title: "Price Action Mastery",
        duration: "23 min",
        content: [
          "Price Action Mastery means reading the market purely through price movement and volume — without relying on any lagging indicator. At this level, you see the same chart a raw indicator trader sees, but you extract 10x more information from it. You read conviction, exhaustion, institutional activity, and structural shifts directly from candle behavior.",
          "Reading candle conviction: A candle that closes near its extreme (high for a bullish candle, low for a bearish candle) shows strong conviction. A candle that starts strongly but closes back near the middle shows rejection and indecision. The ratio of wick to body tells you who won the battle and by how much.",
          "The sequence reading method: Instead of looking at individual candles in isolation, read the SEQUENCE. Is each successive bullish candle smaller than the last? Are the pullback candles growing larger? This shows momentum shifting before any indicator catches it. Sequential analysis is where pure price action traders gain their edge.",
          "Advanced pattern recognition: At the master level, you move beyond named patterns (Head & Shoulders, Flags) and recognize unnamed micro-structures. A cluster of small-bodied candles at a resistance, followed by a single bearish engulfing with expanding volume — this tells a story that no named pattern captures. You read narrative, not templates.",
          "The DemonZeno AI price action layer: Every DemonZeno AI signal incorporates price action analysis across multiple providers. When GPT-4, Claude, and Gemini simultaneously identify a high-probability price action structure on the same asset, the confidence weighting of that signal increases. Master-level traders can independently verify this analysis on their own charts.",
        ],
        takeaways: [
          "Price action mastery = reading conviction, exhaustion, structure from raw candles",
          "Candle close near extreme = conviction. Close near middle = indecision/rejection",
          "Sequential analysis: is momentum building or decaying?",
          "Read narrative from candle sequences — not just named patterns",
          "Master-level traders verify AI signals with their own price action analysis",
        ],
      },
      {
        title: "DemonZeno Signal System Mastery",
        duration: "20 min",
        content: [
          "At the Master level, you don't just follow DemonZeno signals — you understand them deeply enough to know WHEN to full size, when to half size, when to skip, and when to flip the direction even when a signal says otherwise (because your own Master-level analysis shows a conflicting institutional setup).",
          "Signal quality grading: Every signal has a quality grade based on confluence depth. Grade A: Daily + 4H + 1H all aligned, key zone entry, multi-indicator confluence, high-volume confirmation, ICT kill zone timing. Grade B: Missing 1–2 of the above factors. Grade C: Minimal confluence, counter-trend, or ambiguous structure. Full size on A, half on B, skip C.",
          "Contextual adaptation: The DemonZeno system was built for maximum precision, but markets are dynamic. In extreme news events (FOMC, BTC ETF decisions, macro crises), even Grade A setups need wider SLs or reduced size. At the Master level, you adapt contextually without abandoning the system's core framework.",
          "AI signal verification protocol: When you receive a DemonZeno AI signal, your Master-level verification process takes 5 minutes: (1) Check market structure on the Daily chart. (2) Confirm the entry zone on the 4H. (3) Look for the ICT-style confluence (Order Block + FVG or liquidity sweep). (4) Check volume. (5) Confirm session timing. If all 5 check out — execute at full size with maximum confidence.",
          "Legacy and teaching: Master-level traders give back. They mentor others, document their systems for future improvement, and contribute to the broader trading community's knowledge. DemonZeno's free trading signals on Binance Square and this Academy are an expression of this philosophy — making professional-grade trading knowledge accessible to everyone.",
        ],
        takeaways: [
          "Master-level: know when to size up, scale down, or override signals",
          "Grade signals A/B/C by confluence depth — adjust position accordingly",
          "Contextual adaptation: adjust size/SL during major macro events",
          "5-minute signal verification protocol before every execution",
          "Master-level traders document, mentor, and contribute to the community",
        ],
      },
      {
        title: "Trading Career Development",
        duration: "18 min",
        content: [
          "A trading career is a journey measured in decades, not months. The traders who achieve extraordinary results over 10+ years share common traits: relentless self-improvement, systematic approach, emotional resilience, continuous education, and a genuine passion for the markets. Trading is not a get-rich-quick scheme — it is a professional discipline.",
          "The four phases of trader development: (1) Unconscious Incompetence — you don't know what you don't know. You make random trades and attribute luck to skill. (2) Conscious Incompetence — you're learning but losing; you realize how much you don't know. Most quit here. (3) Conscious Competence — you can execute correctly but it requires effort and focus. (4) Unconscious Competence — correct execution is automatic; you trade with instinctive mastery.",
          "Income streams for professional traders: Proprietary trading firms (they provide capital, you share profits), fund management (manage other people's capital for fees), signal services (premium subscriptions for your signals), educational content (courses, mentoring, books), and personal capital growth. Diversifying your income reduces the pressure of needing any single trade to 'make or break' you.",
          "Staying current in evolving markets: Crypto markets in 2026 are fundamentally different from 2018. New instruments (perpetual futures, options, structured products), new liquidity sources (institutional ETFs, DeFi), and new trading participants (AI-driven bots, HFT in crypto) constantly reshape market microstructure. Commit to continuous learning and system evolution.",
          "The DemonZeno philosophy in your trading career: Master the Chaos means embracing market uncertainty with a structured framework. Slay the Market means achieving consistent profitability through discipline and edge. Trade Like a God means executing with absolute conviction, precision, and clarity. This isn't hyperbole — it's a daily commitment to professional excellence.",
        ],
        takeaways: [
          "Trading mastery is a decade-long journey — not months",
          "4 phases: Unconscious incompetence → Unconscious competence",
          "Most traders quit during Phase 2 — this is the highest dropout point",
          "Diversify income: proprietary trading, fund management, education",
          "Commit to continuous learning — markets constantly evolve",
        ],
      },
      {
        title: "Achieving Flow State in Trading",
        duration: "16 min",
        content: [
          "Flow state in trading is a mental condition where execution becomes effortless, decisions emerge from deep intuition rather than anxious deliberation, and you are fully immersed in the present market moment without distraction, fear, or ego. Psychologist Mihaly Csikszentmihalyi described flow as the optimal experience — and master traders know this state intimately.",
          "Conditions that create flow: (1) Clear goals — you know exactly what you're looking for, what your rules are, and what outcome you're working toward. Clarity eliminates internal conflict that disrupts flow. (2) Immediate feedback — you see the results of your decisions quickly. Market charts provide constant feedback. (3) Challenge-skill balance — the task is neither too easy (boredom) nor too hard (anxiety). Your setups should be demanding but achievable with your current skill level.",
          "Building toward flow: Flow cannot be forced, but it can be cultivated. Consistent pre-session routines (the same ritual every day creates a psychological 'on switch'), familiar chart setups (mastering a small number of setups deeply rather than dabbling in many), and adequate preparation (key levels marked, watchlist ready, emotional state calibrated) all create the conditions for flow to emerge.",
          "Protecting the flow state during a session: Distractions are flow killers. During active trading sessions, eliminate: phone notifications, social media, unrelated conversations, market news ticker noise. Your trading environment should be as distraction-free as possible. Some master traders trade in near silence; others use consistent background music. Experiment to find what sustains your focus.",
          "When flow becomes dangerous: Flow state can create a sense of invincibility that overrides your risk management rules. Some of the most catastrophic trading losses happen when a trader in flow becomes overconfident, ignores warning signs, and overrides stop losses or takes oversized positions. Always maintain your pre-defined rules as a circuit breaker, even in your best flow states.",
        ],
        takeaways: [
          "Flow = effortless, intuitive execution without fear or distraction",
          "Conditions for flow: clear goals, immediate feedback, challenge-skill balance",
          "Cultivate flow: consistent pre-session rituals, familiar setups, deep preparation",
          "Eliminate distractions completely during active trading sessions",
          "Flow state can cause overconfidence — always maintain your rules as circuit breakers",
        ],
      },
      {
        title: "Mental Models for Master Traders",
        duration: "17 min",
        content: [
          "Mental models are frameworks for understanding how the world works. Master traders carry a mental library of powerful models that they apply to market situations — cutting through noise to identify the essential structure of any market condition. The richest mental model libraries come from cross-disciplinary thinking: physics, evolutionary biology, game theory, statistics, and psychology all contain frameworks that directly apply to trading.",
          "First Principles Thinking: Don't accept conventional trading wisdom without decomposing it to its fundamental truths. 'Support levels work' — why? Because at that price, buyers significantly outnumber sellers historically, creating buying pressure that stops price decline. First principles thinking reveals that support works strongest when: (1) previous buyer volume at that level was high, (2) the level is at a psychologically significant round number, (3) multiple timeframes agree on the level's significance.",
          "The Inversion Model: Instead of asking 'how do I make the most profit?', ask 'what would guarantee I lose all my money?' — then avoid those things. Inverting the question reveals: 1) no stop loss, 2) overleveraging, 3) revenge trading, 4) holding losers indefinitely, 5) ignoring market structure. Avoid these five things consistently and you're already ahead of 80% of traders.",
          "Probabilistic thinking: Master traders never think in terms of 'this trade will work' or 'this trade will fail.' They think in probabilities: 'based on my analysis, this setup has a 65% probability of reaching TP1, and the expected value of taking this trade is +0.8R.' This shift from binary to probabilistic thinking eliminates outcome attachment and allows traders to execute good setups even after a losing streak.",
          "The Compound Interest Mental Model: Time × consistent small positive returns = exponential wealth. A 5% monthly return over 5 years doesn't produce 300% return — it produces 1,729% return. The human brain is notoriously bad at intuiting exponential growth. Keeping this model front of mind prevents the impatience that causes traders to swing for outsized returns at the cost of consistency.",
        ],
        takeaways: [
          "Mental models are frameworks that cut through market noise",
          "First principles: decompose market wisdom to its fundamental reasons",
          "Inversion: ask what guarantees failure — then systematically avoid those things",
          "Probabilistic thinking: every trade is a probability distribution, not a binary bet",
          "Compounding model: 5%/month × 5 years = 1,729% — patience pays exponentially",
        ],
      },
      {
        title: "Advanced Portfolio Construction",
        duration: "17 min",
        content: [
          "Advanced portfolio construction for active traders goes beyond simple position sizing into deliberate design of a portfolio that maximizes expected return for a given level of risk. This requires understanding correlations, factor exposures, and how individual trade decisions interact at the portfolio level.",
          "The efficient frontier concept: Modern Portfolio Theory (MPT) shows that for any level of risk (volatility), there exists a portfolio composition that maximizes expected return. This 'efficient frontier' reveals that adding assets with low correlation — even if individually less profitable — can improve the portfolio's overall risk-adjusted return. The same principle applies to active trading: mixing non-correlated strategies improves overall performance.",
          "Strategy diversification: Master-level traders often run multiple sub-strategies simultaneously. A trend-following strategy (performs well in trending markets) paired with a mean-reversion strategy (performs well in range-bound markets) and a volatility strategy (performs well during high volatility events) creates a portfolio that is more consistently profitable across all market regimes.",
          "Alpha vs. Beta management: Alpha is excess return above the market. Beta is the portion of your returns explained by general market movement. A master trader focuses on generating alpha — returns that don't simply reflect the overall crypto/equity market going up. This means building a system that outperforms even when markets are flat, using short positions to profit from downtrends, and identifying specific market inefficiencies to exploit.",
          "Portfolio rebalancing for active traders: Unlike passive investment portfolios, an active trader's portfolio requires dynamic rebalancing based on market conditions. During trending markets, allocate more capital to trend-following strategies. During consolidation, shift toward range strategies. During high volatility, shift toward volatility strategies or reduce overall exposure. This adaptive allocation is the hallmark of master-level portfolio management.",
        ],
        takeaways: [
          "Advanced portfolio: design for max return at given risk level",
          "Mix non-correlated strategies to smooth equity curve across market regimes",
          "Run 2-3 sub-strategies: trend-following + mean reversion + volatility",
          "Focus on Alpha: returns that don't depend on market direction",
          "Dynamically rebalance between strategies as market regime changes",
        ],
      },
      {
        title: "Trading at Scale — Managing Large Positions",
        duration: "18 min",
        content: [
          "Trading at scale introduces challenges that don't exist at smaller sizes. What works perfectly with a $10,000 account may become problematic with a $500,000 account — not because the edge disappears, but because the mechanics of execution change fundamentally when your orders start moving the market.",
          "Market impact at scale: When you enter a $500K crypto long position using a market order, you will consume multiple levels of the order book and receive an average fill price higher than the displayed best ask. This 'slippage' reduces your actual profit compared to your theoretical backtest. Professional traders at this scale must use limit orders, iceberg orders, and TWAP (Time Weighted Average Price) algorithms to minimize impact.",
          "Liquidity constraints: Not every market can accommodate large positions. A $500K position in BTC/USDT (high liquidity) is trivial — but the same size in a smaller altcoin can move the price against you by 3–5% just on entry. Master traders maintain strict position size limits relative to each asset's daily volume. A common rule: maximum position size = 1% of the asset's average daily volume.",
          "Portfolio heat at scale: As account size grows, the absolute dollar value of risk grows even while the percentage stays constant. At $500K with 1% risk per trade = $5,000 per trade. Emotionally, losing $5,000 on a trade feels very different from losing $100. Master traders who scale successfully report that maintaining the percentage mindset (not the dollar mindset) is the key psychological challenge of trading larger.",
          "Scaling the mental game: Larger positions amplify every psychological challenge. Greed pulls harder when a trade is up $50,000. Fear is more intense when it's down $30,000. The only solution is deep conviction in your system — built through years of consistent execution at smaller sizes — combined with the mental models and emotional discipline that master-level trading develops.",
        ],
        takeaways: [
          "Scale changes execution mechanics — market orders cause significant slippage",
          "Use limit orders and TWAP algorithms to minimize market impact at scale",
          "Position size limit: maximum 1% of asset's average daily trading volume",
          "Maintain percentage mindset — don't think in dollars when positions are large",
          "Scale requires deep systematic conviction — build it at smaller sizes first",
        ],
      },
      {
        title: "Legacy and Wealth Preservation",
        duration: "15 min",
        content: [
          "After achieving consistent trading profitability and building significant capital, the focus shifts from growth to preservation — protecting and growing wealth across market cycles, economic conditions, and personal life events. This is the mindset transition from trader to investor-trader.",
          "The capital preservation imperative: Wealth is far easier to lose than to create. A trader who spends a decade building a $1M account and then blows 50% in one year of overleveraged trading doesn't just lose half their money — they lose years of compounding and potentially the psychological foundation needed to rebuild. Capital preservation at this stage is not timidity — it is wisdom.",
          "Diversification beyond trading: Master-level wealth management involves moving some capital out of active trading into more stable stores of value. Real estate, index funds, Bitcoin as a long-term hold (separate from trading capital), and business ownership all serve as wealth preservation vehicles. Active trading capital is the engine of growth; these other assets provide stability.",
          "Drawdown limits for wealth preservation: As account size grows, the acceptable drawdown percentage should decrease, not remain constant. With $10K, a 20% drawdown is recoverable quickly. With $1M, a 20% drawdown is a $200K loss that takes significant time and excellent performance to recover. Implement tiered drawdown limits that tighten as account size increases.",
          "Teaching and legacy: Master traders who achieve significant success typically find deep meaning in sharing their knowledge — not to create competition, but because understanding markets deeply reveals the obligation to help others navigate them better. DemonZeno's free trading academy and signals reflect this philosophy: the highest expression of mastery is the ability to teach, and the highest expression of wealth is the freedom to give back.",
        ],
        takeaways: [
          "At master level: focus shifts from growth to growth + preservation",
          "Never risk significant accumulated wealth on single oversized positions",
          "Diversify beyond trading: real estate, index funds, stable long-term holds",
          "Drawdown limits should tighten (in %) as account size grows",
          "Teaching is the highest expression of mastery — give back through knowledge",
        ],
      },
      {
        title: "Building a Trading Team or Business",
        duration: "17 min",
        content: [
          "The highest expression of trading mastery is building a trading operation that transcends the limitations of a single trader — a team, firm, or business that systematizes your edge, leverages complementary skills, and creates compounding returns beyond what any solo trader can achieve.",
          "When to bring in a team: Solo trading is appropriate when developing your edge and building the discipline to execute it. Once you have a provably positive-expectancy system, a 3-year track record, and capital exceeding your personal needs, the opportunity exists to manage other people's capital — either through a prop firm, a fund structure, or a signal service.",
          "Roles in a trading operation: (1) Lead trader — generates and evaluates trade setups, makes final entry/exit decisions. (2) Risk manager — enforces position sizing rules, monitors portfolio heat, implements drawdown protocols. (3) Research analyst — analyzes new markets, backtests new strategies, monitors macro environment. (4) Technology — builds and maintains execution systems, data pipelines, performance tracking tools.",
          "Legal and compliance: Managing other people's money requires regulatory compliance in most jurisdictions. In the US, this means SEC or CFTC registration depending on the asset class. In the UK, FCA authorization. Skipping this creates significant legal liability. A compliant fund structure with proper documentation protects both the manager and the investors.",
          "DemonZeno as a trading business: The DemonZeno platform represents the early stages of this evolution — a signal service that provides value to thousands of traders, backed by sophisticated AI infrastructure. The Trading Academy, signal cards, and DemonZeno AI collectively form a comprehensive trading education and tools business — the model for what a modern trading operation can become.",
        ],
        takeaways: [
          "A trading team leverages complementary skills beyond solo trader limits",
          "4 roles: Lead Trader, Risk Manager, Research Analyst, Technology",
          "3-year positive track record is the minimum before managing other capital",
          "Legal compliance is non-negotiable when managing OPM (Other People's Money)",
          "A signal service + academy is the modern expression of a trading business",
        ],
      },
      {
        title: "Consistent Profitability — The Final Level",
        duration: "20 min",
        content: [
          "Consistent profitability is the destination that every trader is seeking — and it is elusive precisely because most traders confuse the path with the destination. Consistent profitability is not about winning every trade or every week. It is about systematically extracting positive expectancy from the market over long time horizons through disciplined, rule-based execution.",
          "The anatomy of consistency: The three pillars of trading consistency are: (1) Edge consistency — your system produces positive expectancy in all market conditions (or correctly identifies when not to trade). (2) Execution consistency — you execute your rules without deviation across winning streaks and losing streaks alike. (3) Psychological consistency — your emotional state and decision quality remain stable regardless of recent results.",
          "Measuring consistency: A consistently profitable trader shows: positive profit factor over rolling 100-trade windows, maximum drawdown that never exceeds their pre-defined limit, win rate and average R:R that remain within normal statistical variance of their historical averages, and trading volume that doesn't spike on emotional impulse (stable average trades per week).",
          "The plateau problem: Most traders reach a plateau where they're profitable but not consistently so. One great month followed by a break-even month followed by a small loss. This plateau usually represents an edge that works in some market conditions but not others (incomplete edge), execution deviations that erode theoretical performance, or insufficient capital to make the returns meaningful enough to stay motivated. Each plateau has a specific cure that emerges from careful performance analysis.",
          "Graduating from student to professional: The final level is not a destination — it is a standard of operation. A professional trader does not celebrate winning trades or mourn losing trades. They evaluate execution quality: 'Did I follow my system exactly?' A win from a poorly executed setup is concerning. A loss from a perfectly executed setup is acceptable. This detachment from outcomes while maintaining total commitment to process is the hallmark of professional, consistently profitable trading.",
        ],
        takeaways: [
          "Consistent profitability = positive expectancy extracted consistently over time",
          "3 pillars: edge consistency + execution consistency + psychological consistency",
          "Measure consistency: profit factor, drawdown, win rate stability, trade frequency",
          "Plateau = incomplete edge OR execution deviation OR insufficient capital",
          "True professionalism: evaluate execution quality, not outcome. Process over results.",
        ],
      },
      {
        title: "Mastering DemonZeno Signal System",
        duration: "20 min",
        content: [
          "At the Master level, you don't just follow DemonZeno signals — you understand them deeply enough to know WHEN to full size, when to half size, when to skip, and when to flip the direction even when a signal says otherwise (because your own Master-level analysis shows a conflicting institutional setup).",
          "Signal quality grading: Every signal has a quality grade based on confluence depth. Grade A: Daily + 4H + 1H all aligned, key zone entry, multi-indicator confluence, high-volume confirmation, ICT kill zone timing. Grade B: Missing 1–2 of the above factors. Grade C: Minimal confluence, counter-trend, or ambiguous structure. Full size on A, half on B, skip C.",
          "Contextual adaptation: The DemonZeno system was built for maximum precision, but markets are dynamic. In extreme news events (FOMC, BTC ETF decisions, macro crises), even Grade A setups need wider SLs or reduced size. At the Master level, you adapt contextually without abandoning the system's core framework.",
          "AI signal verification protocol: When you receive a DemonZeno AI signal, your Master-level verification process takes 5 minutes: (1) Check market structure on the Daily chart. (2) Confirm the entry zone on the 4H. (3) Look for the ICT-style confluence (Order Block + FVG or liquidity sweep). (4) Check volume. (5) Confirm session timing. If all 5 check out — execute at full size with maximum confidence.",
          "Legacy and teaching: Master-level traders give back. They mentor others, document their systems for future improvement, and contribute to the broader trading community's knowledge. DemonZeno's free trading signals on Binance Square and this Academy are an expression of this philosophy — making professional-grade trading knowledge accessible to everyone.",
        ],
        takeaways: [
          "Master-level: know when to size up, scale down, or override signals",
          "Grade signals A/B/C by confluence depth — adjust position accordingly",
          "Contextual adaptation: adjust size/SL during major macro events",
          "5-minute signal verification protocol before every execution",
          "Master-level traders document, mentor, and contribute to the community",
        ],
      },
    ],
  },
];

// ─── Certificate Quiz ─────────────────────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const TIER_QUIZZES: Record<string, QuizQuestion[]> = {
  beginner: [
    {
      question: "What does a green (bullish) candlestick indicate?",
      options: [
        "Close is lower than open",
        "Close is higher than open",
        "Price did not move",
        "Price opened and closed at the same level",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the primary purpose of a Stop Loss?",
      options: [
        "To maximize profits",
        "To limit losses on a trade",
        "To enter a trade automatically",
        "To track price movements",
      ],
      correctIndex: 1,
    },
    {
      question: "What does 'going long' mean in trading?",
      options: [
        "Holding a trade for a long time",
        "Buying an asset expecting it to rise",
        "Selling an asset expecting it to fall",
        "Trading in large quantities",
      ],
      correctIndex: 1,
    },
    {
      question: "Which market operates 24/7?",
      options: [
        "Stock market",
        "Forex market",
        "Crypto market",
        "Commodity market",
      ],
      correctIndex: 2,
    },
    {
      question: "What is a Doji candlestick pattern?",
      options: [
        "A candle with a very long body",
        "A candle showing strong momentum",
        "A candle with a very small body indicating indecision",
        "A candle with no wicks",
      ],
      correctIndex: 2,
    },
    {
      question: "What does TP stand for in a DemonZeno signal?",
      options: ["Trade Price", "Take Profit", "Total Position", "Trade Period"],
      correctIndex: 1,
    },
    {
      question: "What is 'spread' in trading?",
      options: [
        "The size of your position",
        "The difference between buy and sell price",
        "Your profit from a trade",
        "The timeframe of a trade",
      ],
      correctIndex: 1,
    },
    {
      question: "A bull market is characterized by:",
      options: [
        "Falling prices",
        "Rising prices",
        "Sideways movement",
        "High volatility only",
      ],
      correctIndex: 1,
    },
    {
      question: "What does SL represent in trading?",
      options: ["Stock Level", "Stop Loss", "Signal Limit", "Short Long"],
      correctIndex: 1,
    },
    {
      question:
        "What is the recommended practice before trading with real money?",
      options: [
        "Study theory only",
        "Paper trade for at least 2 weeks",
        "Copy other traders blindly",
        "Use maximum leverage to learn fast",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which candlestick pattern is a bullish signal after a downtrend?",
      options: ["Shooting Star", "Bearish Engulfing", "Hammer", "Doji"],
      correctIndex: 2,
    },
    {
      question: "What does 'liquidity' mean in trading?",
      options: [
        "How much cash you have",
        "How easily an asset can be bought or sold without affecting price",
        "The size of price moves",
        "The number of traders in a market",
      ],
      correctIndex: 1,
    },
    {
      question: "The Forex market primarily trades:",
      options: [
        "Stocks and bonds",
        "Digital currencies",
        "Currency pairs",
        "Commodities",
      ],
      correctIndex: 2,
    },
    {
      question: "What does high volatility mean?",
      options: [
        "Price moves very little",
        "Price fluctuates significantly",
        "The market is closed",
        "Only big institutions can trade",
      ],
      correctIndex: 1,
    },
    {
      question: "What is a 'pip' in Forex?",
      options: [
        "A type of order",
        "The smallest price movement (0.0001)",
        "A profit indicator",
        "A risk percentage",
      ],
      correctIndex: 1,
    },
    {
      question: "Which exchange are DemonZeno signals primarily based on?",
      options: ["Coinbase", "Binance", "Kraken", "Bybit"],
      correctIndex: 1,
    },
    {
      question: "What is the first thing you should do after entering a trade?",
      options: [
        "Check social media for opinions",
        "Set your Stop Loss immediately",
        "Add to the position",
        "Close it if it moves 1%",
      ],
      correctIndex: 1,
    },
    {
      question: "A Shooting Star candlestick appears at a market top and has:",
      options: [
        "A long lower wick",
        "A long upper wick and small body at bottom",
        "No wicks at all",
        "A very large green body",
      ],
      correctIndex: 1,
    },
    {
      question: "What is Bitcoin's effect on the broader crypto market?",
      options: [
        "It has no effect on altcoins",
        "When BTC drops, most altcoins also fall",
        "Altcoins always rise when BTC falls",
        "BTC only affects Ethereum",
      ],
      correctIndex: 1,
    },
    {
      question: "What does it mean to 'go short' on an asset?",
      options: [
        "Buy and hold for a short time",
        "Sell expecting the price to fall",
        "Trade on a short timeframe",
        "Use a small position size",
      ],
      correctIndex: 1,
    },
    {
      question: "Which is NOT a key principle of trading?",
      options: [
        "Always have an entry price",
        "Always have a Stop Loss",
        "Trade every signal you see",
        "Always have Take Profit targets",
      ],
      correctIndex: 2,
    },
    {
      question: "What is a 'Take Profit' level?",
      options: [
        "Where you stop adding to a position",
        "The price at which you exit to lock in profit",
        "The maximum loss you'll accept",
        "Your daily profit target",
      ],
      correctIndex: 1,
    },
    {
      question:
        "How many Take Profit levels does every DemonZeno signal include?",
      options: ["One", "Two", "Three", "Four"],
      correctIndex: 2,
    },
    {
      question: "What should you do if you miss a signal's exact entry price?",
      options: [
        "Enter anyway at any price",
        "Double down to make up for it",
        "Skip the trade and wait for the next setup",
        "Increase your position size",
      ],
      correctIndex: 2,
    },
    {
      question: "Candlestick wicks (shadows) represent:",
      options: [
        "The open and close prices",
        "The highest and lowest prices reached in the period",
        "The average price over time",
        "Volume traded",
      ],
      correctIndex: 1,
    },
    {
      question: "What is paper trading?",
      options: [
        "Trading physical stock certificates",
        "Practicing trades without real money",
        "Trading paper-backed currencies",
        "Day trading newspapers",
      ],
      correctIndex: 1,
    },
    {
      question: "A red bearish candlestick means:",
      options: [
        "The close price was higher than open",
        "The close price was lower than open",
        "There was no movement",
        "Volume was very high",
      ],
      correctIndex: 1,
    },
    {
      question: "Which market session is known for being quieter?",
      options: [
        "London session",
        "New York session",
        "Asian session",
        "London-NY overlap",
      ],
      correctIndex: 2,
    },
    {
      question:
        "What is the minimum number of touch points to consider a trendline valid?",
      options: ["1", "2", "3", "5"],
      correctIndex: 1,
    },
    {
      question: "What happens to money lost in trading?",
      options: [
        "It is refunded after 30 days",
        "It goes to the platform as fees only",
        "It is permanently gone — other traders made it",
        "It is held in escrow",
      ],
      correctIndex: 2,
    },
  ],
  intermediate: [
    {
      question: "What does RSI above 70 indicate?",
      options: [
        "Oversold conditions",
        "Overbought conditions",
        "Strong volume",
        "Market is closed",
      ],
      correctIndex: 1,
    },
    {
      question: "A MACD bullish crossover occurs when:",
      options: [
        "MACD line crosses below signal line",
        "MACD line crosses above signal line",
        "RSI exceeds 70",
        "Price breaks above resistance",
      ],
      correctIndex: 1,
    },
    {
      question: "What is a Bollinger Band Squeeze?",
      options: [
        "When bands widen significantly",
        "When bands narrow together indicating a big move coming",
        "When price breaks the upper band",
        "When RSI and MACD converge",
      ],
      correctIndex: 1,
    },
    {
      question: "The 1–2% rule states:",
      options: [
        "Risk 1–2% of your total profits",
        "Never risk more than 1–2% of account per trade",
        "Use 1–2% leverage only",
        "Take profits at 1–2%",
      ],
      correctIndex: 1,
    },
    {
      question: "What is Risk:Reward ratio?",
      options: [
        "Win rate divided by loss rate",
        "Ratio of potential profit to potential loss",
        "Leverage amount vs account size",
        "Number of wins vs losses",
      ],
      correctIndex: 1,
    },
    {
      question:
        "In the DemonZeno signal system, when TP1 is hit, what should you do?",
      options: [
        "Close the entire position",
        "Close 30–50% and move SL to breakeven",
        "Add to the position",
        "Ignore it and wait for TP3",
      ],
      correctIndex: 1,
    },
    {
      question: "What does 'support flipping to resistance' mean?",
      options: [
        "Support levels disappear over time",
        "Once broken, a former support level becomes resistance",
        "Resistance moves down to become support",
        "Price levels randomly swap",
      ],
      correctIndex: 1,
    },
    {
      question: "RSI Divergence occurs when:",
      options: [
        "RSI and MACD disagree",
        "Price makes new high but RSI makes lower high (or vice versa)",
        "RSI stays at 50 while price moves",
        "Two RSI periods diverge",
      ],
      correctIndex: 1,
    },
    {
      question:
        "A valid trendline needs a minimum of how many touch points to be significant?",
      options: ["1", "2", "3+", "10"],
      correctIndex: 2,
    },
    {
      question: "What does 'trailing your stop' mean?",
      options: [
        "Moving your stop loss against the trade direction",
        "Delaying placing the stop loss",
        "Moving stop loss in the direction of profit to lock in gains",
        "Removing the stop loss temporarily",
      ],
      correctIndex: 2,
    },
    {
      question: "Scalping timeframes use charts of:",
      options: ["1D–1W", "4H–1D", "1min–15min", "1H–4H"],
      correctIndex: 2,
    },
    {
      question: "Position Size = Account Size × Risk% ÷ __?__",
      options: [
        "Leverage",
        "Entry price",
        "Entry − Stop Loss (dollar distance)",
        "Number of TPs",
      ],
      correctIndex: 2,
    },
    {
      question: "Swing trading involves holding positions for:",
      options: [
        "Seconds to minutes",
        "Hours within one day",
        "Days to weeks",
        "Years",
      ],
      correctIndex: 2,
    },
    {
      question: "What does MACD stand for?",
      options: [
        "Market Analysis and Chart Detection",
        "Moving Average Convergence Divergence",
        "Multi-Asset Calculation Derivative",
        "Maximum Average Chart Direction",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the Bollinger Band's middle line?",
      options: [
        "A 50-period RSI",
        "A 20-period moving average",
        "The MACD signal line",
        "The average of high and low",
      ],
      correctIndex: 1,
    },
    {
      question:
        "If your account is $10,000 and you risk 2%, your maximum loss per trade is:",
      options: ["$20", "$100", "$200", "$2,000"],
      correctIndex: 2,
    },
    {
      question: "Support is best described as:",
      options: [
        "A price ceiling where selling stops price rising",
        "A price floor where buying pressure stops price falling",
        "The average closing price over 20 periods",
        "The gap between two candles",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between day trading and swing trading?",
      options: [
        "Day trading uses indicators, swing trading uses patterns",
        "Day trading closes within the day, swing holds days to weeks",
        "Swing trading has smaller targets",
        "There is no difference",
      ],
      correctIndex: 1,
    },
    {
      question: "What does FOMO stand for in trading psychology?",
      options: [
        "Forced Order Market Operation",
        "Fear Of Missing Out",
        "Fundamental Order Method Optimization",
        "Full Open Market Operations",
      ],
      correctIndex: 1,
    },
    {
      question: "A minimum 1:2 Risk:Reward ratio means:",
      options: [
        "You win twice as often as you lose",
        "Your potential profit is at least 2× your potential loss",
        "You use 2× leverage max",
        "You risk 2% per trade",
      ],
      correctIndex: 1,
    },
    {
      question: "What is 'price action' trading?",
      options: [
        "Trading based on news events",
        "Reading raw candlestick data without indicators",
        "Using AI to generate signals",
        "Following social media traders",
      ],
      correctIndex: 1,
    },
    {
      question: "Day trading typically uses which charts?",
      options: ["1min–15min", "1H–4H", "1D–1W", "Weekly only"],
      correctIndex: 1,
    },
    {
      question: "What does an RSI reading below 30 indicate?",
      options: [
        "Overbought — potential sell",
        "Oversold — potential buy",
        "Strong upward momentum",
        "No signal",
      ],
      correctIndex: 1,
    },
    {
      question: "When should you use advanced filters on DemonZeno signals?",
      options: [
        "Never — always trade all signals",
        "When you want to filter by timeframe, result, or confidence",
        "Only when RSI confirms",
        "Only on crypto signals",
      ],
      correctIndex: 1,
    },
    {
      question: "What is 'confluence' in technical analysis?",
      options: [
        "Multiple indicators and levels all agreeing at one price point",
        "A conflict between two indicators",
        "A chart pattern with two tops",
        "A Fibonacci extension level",
      ],
      correctIndex: 0,
    },
    {
      question: "A 50% win rate with a consistent 1:2 R:R ratio is:",
      options: [
        "Unprofitable over time",
        "Break-even over time",
        "Profitable over time",
        "Too risky to be sustainable",
      ],
      correctIndex: 2,
    },
    {
      question: "What is breakeven stop?",
      options: [
        "A stop loss set below entry",
        "Moving stop loss to the exact entry price after TP1",
        "The initial stop loss level",
        "Closing the trade at entry price",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Bollinger Bands are typically set at how many standard deviations?",
      options: ["1", "2", "3", "0.5"],
      correctIndex: 1,
    },
    {
      question: "The London–New York session overlap is known for:",
      options: [
        "Very low volume",
        "Highest volume and best price movement",
        "Only Forex trading",
        "Random price spikes",
      ],
      correctIndex: 1,
    },
    {
      question: "Which statement about the 1–2% rule is TRUE?",
      options: [
        "Only applies to crypto trading",
        "Allows surviving 10+ consecutive losses without blowing account",
        "Means you should trade with only 1–2% of your account total",
        "Only applies to beginners",
      ],
      correctIndex: 1,
    },
  ],
  advanced: [
    {
      question: "A Head and Shoulders pattern indicates:",
      options: [
        "Bullish continuation",
        "Bearish reversal",
        "Range-bound market",
        "Breakout in both directions",
      ],
      correctIndex: 1,
    },
    {
      question: "A Double Bottom pattern signals:",
      options: [
        "Bearish reversal",
        "Bullish reversal",
        "Continuation of downtrend",
        "Indecision",
      ],
      correctIndex: 1,
    },
    {
      question: "A Bull Flag is a:",
      options: [
        "Reversal pattern",
        "Continuation pattern",
        "Indecision pattern",
        "Breakdown pattern",
      ],
      correctIndex: 1,
    },
    {
      question: "High volume on a breakout indicates:",
      options: [
        "False breakout likely",
        "Weak move expected",
        "Genuine, strong breakout likely to continue",
        "Price will immediately reverse",
      ],
      correctIndex: 2,
    },
    {
      question: "Volume divergence occurs when:",
      options: [
        "Volume and RSI agree",
        "Price makes new high but volume is declining",
        "Volume spikes with no price movement",
        "Two timeframes show same volume",
      ],
      correctIndex: 1,
    },
    {
      question: "In top-down analysis, which timeframe is analyzed FIRST?",
      options: ["1 minute", "1 hour", "4 hours", "Daily or higher"],
      correctIndex: 3,
    },
    {
      question: "The 0.618 Fibonacci level is known as:",
      options: [
        "The death cross level",
        "The golden ratio — strongest retracement zone",
        "The breakeven point",
        "The double bottom level",
      ],
      correctIndex: 1,
    },
    {
      question: "For an uptrend, Fibonacci is drawn:",
      options: [
        "From the high to the low",
        "From the low to the high",
        "Across support lines",
        "Along the trendline",
      ],
      correctIndex: 1,
    },
    {
      question: "What does 'all three timeframes agreeing' mean?",
      options: [
        "All showing the same candlestick pattern",
        "All confirming the same trade direction",
        "All at the same Fibonacci level",
        "All showing overbought RSI",
      ],
      correctIndex: 1,
    },
    {
      question: "Revenge trading is dangerous because:",
      options: [
        "It generates too many profits",
        "It is impulsive, unplanned, and emotionally driven",
        "It uses too many indicators",
        "It only works in bull markets",
      ],
      correctIndex: 1,
    },
    {
      question: "What does OBV (On Balance Volume) measure?",
      options: [
        "The ratio of bulls to bears",
        "Cumulative volume tied to price direction",
        "Open interest in futures",
        "The spread between bid and ask",
      ],
      correctIndex: 1,
    },
    {
      question: "An Ascending Triangle typically resolves with:",
      options: [
        "A downward breakdown",
        "An upward breakout",
        "No significant move",
        "A reversal at the top line",
      ],
      correctIndex: 1,
    },
    {
      question: "A Rising Wedge is typically:",
      options: [
        "Bullish continuation",
        "Bearish reversal signal",
        "Neutral",
        "Only valid in Forex",
      ],
      correctIndex: 1,
    },
    {
      question: "Trading psychology fear can cause you to:",
      options: [
        "Hold positions too long",
        "Exit winning trades too early",
        "Overtrade",
        "Ignore indicators",
      ],
      correctIndex: 1,
    },
    {
      question: "The Inverse Head and Shoulders is:",
      options: [
        "A bearish reversal pattern",
        "A bullish reversal pattern",
        "A continuation pattern",
        "A volume pattern",
      ],
      correctIndex: 1,
    },
    {
      question: "Fibonacci confluence occurs when:",
      options: [
        "Two Fibonacci tools are used",
        "A Fibonacci level aligns with S&R and other indicators",
        "Price ignores Fibonacci levels",
        "Fibonacci is applied to volume",
      ],
      correctIndex: 1,
    },
    {
      question: "What is a Pennant in chart analysis?",
      options: [
        "A flag with a parallel channel",
        "A small symmetrical triangle after a strong move",
        "A rising wedge formation",
        "A double top variant",
      ],
      correctIndex: 1,
    },
    {
      question: "When should you reduce position size or skip a trade?",
      options: [
        "When RSI is at 50",
        "When all timeframes perfectly agree",
        "When timeframes conflict with each other",
        "When volume is high",
      ],
      correctIndex: 2,
    },
    {
      question: "MACD divergence on a chart most often signals:",
      options: [
        "Volume increase",
        "Trend continuation",
        "Weakening momentum / potential reversal",
        "Bollinger Band squeeze",
      ],
      correctIndex: 2,
    },
    {
      question: "What typically happens to volume during a triangle formation?",
      options: [
        "Volume increases steadily",
        "Volume stays constant",
        "Volume decreases, then spikes on breakout",
        "Volume is irrelevant to triangles",
      ],
      correctIndex: 2,
    },
    {
      question: "Why should you trade WITH the higher timeframe trend?",
      options: [
        "Smaller timeframes are unreliable",
        "Higher TF trend has more participants and momentum behind it",
        "Only higher TF charts show volume",
        "Lower timeframes are too volatile",
      ],
      correctIndex: 1,
    },
    {
      question: "FOMO entries typically result in:",
      options: [
        "Catching the best part of the move",
        "Entering near the top and buying into reversal",
        "Profitable trades 70% of the time",
        "Confirmation from indicators",
      ],
      correctIndex: 1,
    },
    {
      question: "A Falling Wedge is typically:",
      options: [
        "Bearish — expect further decline",
        "Bullish — expect reversal upward",
        "Neutral — expect sideways movement",
        "Only valid in uptrends",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What does a volume spike on a bearish reversal candle indicate?",
      options: [
        "Trend continuation",
        "High probability reversal due to strong selling pressure",
        "False signal",
        "Accumulation phase",
      ],
      correctIndex: 1,
    },
    {
      question: "The Fibonacci 0.382 level represents:",
      options: [
        "A 38.2% retracement from the move",
        "A 38.2% extension of the move",
        "The golden ratio",
        "The first support level",
      ],
      correctIndex: 0,
    },
    {
      question: "What is the 'neckline' of a Head and Shoulders pattern?",
      options: [
        "The highest peak (the head)",
        "The line connecting the two troughs between the shoulders and head",
        "The left shoulder",
        "The right shoulder",
      ],
      correctIndex: 1,
    },
    {
      question: "Double Top occurs when:",
      options: [
        "Price makes two equal lows",
        "Price hits same resistance twice and fails both times",
        "Price breaks resistance twice",
        "Two candles form at a support",
      ],
      correctIndex: 1,
    },
    {
      question: "Which statement about trading psychology is FALSE?",
      options: [
        "Greed can make you hold too long",
        "Fear can cause early exits",
        "Discipline requires systematic self-awareness",
        "Emotions help you make better trades",
      ],
      correctIndex: 3,
    },
    {
      question: "Which is the STRONGEST Fibonacci retracement level?",
      options: ["0.236", "0.382", "0.500", "0.618"],
      correctIndex: 3,
    },
    {
      question: "Top-down multi-timeframe analysis starts from:",
      options: [
        "The lowest timeframe",
        "Any timeframe works equally",
        "The highest timeframe to determine overall trend",
        "The entry timeframe only",
      ],
      correctIndex: 2,
    },
  ],
  expert: [
    {
      question: "The Kelly Criterion is used for:",
      options: [
        "Choosing which assets to trade",
        "Optimal position sizing based on win rate and R:R",
        "Setting stop loss levels",
        "Timing market entries",
      ],
      correctIndex: 1,
    },
    {
      question: "What does BTC Dominance (BTC.D) rising indicate?",
      options: [
        "Altcoins will outperform BTC",
        "Capital is flowing into Bitcoin, altcoins underperform",
        "Total market cap is increasing",
        "Bitcoin is heading for a correction",
      ],
      correctIndex: 1,
    },
    {
      question:
        "A high positive funding rate (0.1%+) in crypto perpetuals signals:",
      options: [
        "Strong bearish sentiment",
        "Shorts are crowded — potential squeeze",
        "Longs are overleveraged — forced liquidation risk",
        "Market is perfectly balanced",
      ],
      correctIndex: 2,
    },
    {
      question: "What is a 'Break of Structure' (BOS)?",
      options: [
        "A technical indicator divergence",
        "When price breaks a previous significant swing high or low",
        "When a chart pattern fails",
        "A Fibonacci level violation",
      ],
      correctIndex: 1,
    },
    {
      question: "An Order Block in Smart Money Concepts is:",
      options: [
        "A cluster of stop loss orders",
        "Where large institutional orders caused a significant price move",
        "A support and resistance zone identified by volume",
        "A Fibonacci extension area",
      ],
      correctIndex: 1,
    },
    {
      question: "Change of Character (ChoCH) in market structure means:",
      options: [
        "A confirmed trend reversal",
        "The FIRST break of market structure in the opposite direction",
        "A continuation signal",
        "When RSI changes direction",
      ],
      correctIndex: 1,
    },
    {
      question: "Liquidity 'hunts' occur because:",
      options: [
        "Random price movements happen",
        "Institutions push price to retail stop clusters to fill large orders",
        "Market makers manipulate prices daily",
        "Volatility causes random spikes",
      ],
      correctIndex: 1,
    },
    {
      question: "Equal Highs/Lows on a chart represent:",
      options: [
        "Strong support and resistance",
        "Liquidity pools where retail stops are clustered",
        "Fibonacci extension levels",
        "MACD signal line crossings",
      ],
      correctIndex: 1,
    },
    {
      question: "NFP (Non-Farm Payrolls) is released:",
      options: [
        "Daily at market open",
        "First Friday of each month at 8:30am EST",
        "Every Wednesday",
        "Monthly on the last trading day",
      ],
      correctIndex: 1,
    },
    {
      question: "EUR/USD and USD/CHF have a:",
      options: [
        "Strong positive correlation",
        "Strong negative correlation",
        "No correlation",
        "Moderate positive correlation",
      ],
      correctIndex: 1,
    },
    {
      question:
        "A 20% trading loss requires what percentage gain to fully recover?",
      options: ["20%", "22%", "25%", "30%"],
      correctIndex: 2,
    },
    {
      question: "When BTC exchange inflows increase significantly, this is:",
      options: [
        "Bullish — more buyers coming",
        "Bearish — selling pressure increasing",
        "Neutral",
        "Only relevant for altcoins",
      ],
      correctIndex: 1,
    },
    {
      question: "The MVRV Ratio above 3.0 historically marks:",
      options: [
        "Crypto cycle bottoms",
        "Crypto cycle tops",
        "Market neutrality",
        "Altcoin season",
      ],
      correctIndex: 1,
    },
    {
      question: "Rising Open Interest + Rising Price indicates:",
      options: [
        "Weak uptrend, positions closing",
        "Strong uptrend, new money entering longs",
        "Short squeeze imminent",
        "Distribution phase",
      ],
      correctIndex: 1,
    },
    {
      question: "A Bull Trap is:",
      options: [
        "A strong confirmed breakout above resistance",
        "A false breakout above resistance that reverses sharply",
        "A liquidity pool below key lows",
        "An Order Block formation",
      ],
      correctIndex: 1,
    },
    {
      question: "Asset correlation in portfolio risk means:",
      options: [
        "All assets move the same way regardless of correlation",
        "Holding multiple correlated assets does NOT reduce true risk",
        "Diversification removes all risk",
        "Crypto and forex are always negatively correlated",
      ],
      correctIndex: 1,
    },
    {
      question: "The London-New York session overlap is:",
      options: ["12am–4am EST", "8am–12pm EST", "4pm–8pm EST", "8pm–12am EST"],
      correctIndex: 1,
    },
    {
      question: "Positive funding rate means:",
      options: [
        "Shorts are paying longs",
        "Longs are paying shorts",
        "The exchange earns the funding",
        "No transfer occurs",
      ],
      correctIndex: 1,
    },
    {
      question: "Half-Kelly position sizing is used because:",
      options: [
        "It maximizes growth rate",
        "Full Kelly is too aggressive and risky in practice",
        "It's required by regulations",
        "It simplifies calculation",
      ],
      correctIndex: 1,
    },
    {
      question: "In forex, which session generally has the LOWEST volatility?",
      options: [
        "London session",
        "New York session",
        "London-NY overlap",
        "Asian session",
      ],
      correctIndex: 3,
    },
    {
      question: "What does negative funding rate indicate?",
      options: [
        "Market is bearish overall",
        "Shorts are crowded — potential short squeeze",
        "Longs are overleveraged",
        "Funding rates don't matter",
      ],
      correctIndex: 1,
    },
    {
      question: "Higher Highs and Higher Lows define:",
      options: [
        "A downtrend",
        "An uptrend market structure",
        "A ranging market",
        "A reversal pattern",
      ],
      correctIndex: 1,
    },
    {
      question: "Falling Open Interest + Falling Price suggests:",
      options: [
        "Strong downtrend continuation",
        "Positions are being closed — trend may lose steam",
        "Shorts are accumulating",
        "Strong bearish reversal",
      ],
      correctIndex: 1,
    },
    {
      question: "A stop hunt pattern involves:",
      options: [
        "Gradual price decline over days",
        "Brief break beyond key level then immediate sharp reversal",
        "Strong continuation after breaking key level",
        "Volume-based manipulation only",
      ],
      correctIndex: 1,
    },
    {
      question: "BTC Dominance falling indicates:",
      options: [
        "Bear market for all assets",
        "Capital rotating from BTC into altcoins — altcoin season",
        "Bitcoin supply increasing",
        "Exchange volumes declining",
      ],
      correctIndex: 1,
    },
    {
      question: "Portfolio-level risk calculation means:",
      options: [
        "Adding up total position sizes",
        "Accounting for correlation — multiple correlated positions do not equal lower risk",
        "Only looking at your largest position",
        "Using leverage to balance positions",
      ],
      correctIndex: 1,
    },
    {
      question: "Carry trade in forex means:",
      options: [
        "Moving positions between exchanges",
        "Borrowing low-rate currency to invest in high-rate currency",
        "Holding positions indefinitely",
        "Trading only during high volatility",
      ],
      correctIndex: 1,
    },
    {
      question: "MVRV Ratio below 1.0 historically signals:",
      options: [
        "Market top — time to sell",
        "Extreme undervaluation — potential cycle bottom for BTC",
        "Neutral market conditions",
        "Altcoin season beginning",
      ],
      correctIndex: 1,
    },
    {
      question: "An Order Block retest occurs when:",
      options: [
        "Price breaks through the Order Block permanently",
        "Price returns to the institutional order zone after the initial move",
        "Two Order Blocks form consecutively",
        "Volume spikes at a new level",
      ],
      correctIndex: 1,
    },
    {
      question: "A 50% trading loss requires what percentage gain to recover?",
      options: ["50%", "75%", "100%", "150%"],
      correctIndex: 2,
    },
  ],
  master: [
    {
      question: "A trading system is defined as:",
      options: [
        "Using only DemonZeno signals",
        "A complete rule-based approach with defined entry, exit, risk, and management rules",
        "Any consistent profit-making method",
        "Using 5+ indicators simultaneously",
      ],
      correctIndex: 1,
    },
    {
      question: "What does a profit factor above 1.5 in backtesting indicate?",
      options: [
        "The system barely breaks even",
        "The system has a meaningful edge worth live testing",
        "The system is too risky",
        "The win rate is exactly 1.5%",
      ],
      correctIndex: 1,
    },
    {
      question: "Signal chaining refers to:",
      options: [
        "Linking stop losses across multiple trades",
        "Combining multiple signals across assets and timeframes into a coherent trading plan",
        "Using one signal to confirm another signal",
        "Chaining take profit levels together",
      ],
      correctIndex: 1,
    },
    {
      question:
        "The recommended monthly return for consistent professional traders is:",
      options: [
        "50–100% per month",
        "5–10% per month",
        "0.5–1% per month",
        "100%+ in bull markets",
      ],
      correctIndex: 1,
    },
    {
      question: "Backtesting a trading system should use at least:",
      options: [
        "1 week of data",
        "1 month of data",
        "6–12 months of historical data",
        "10 years only",
      ],
      correctIndex: 2,
    },
    {
      question: "Forward testing (paper trading) serves to:",
      options: [
        "Replace backtesting entirely",
        "Test the system in real-time conditions and test emotional execution",
        "Prove the system is 100% accurate",
        "Earn money without risk",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Portfolio-level risk across 4 correlated crypto longs should total:",
      options: [
        "4 times your per-trade risk",
        "Still stay within 5–6% of account total",
        "No limit — each trade is independent",
        "Match your total account leverage",
      ],
      correctIndex: 1,
    },
    {
      question: "The DemonZeno method uses TP1 to:",
      options: [
        "Close the full position at first profit",
        "Close 40% and secure gains, move SL to breakeven",
        "Double the position size",
        "Adjust the Stop Loss downward",
      ],
      correctIndex: 1,
    },
    {
      question: "TP3 in the DemonZeno system is best described as:",
      options: [
        "The guaranteed minimum target",
        "The core expected target",
        "The optimistic target — reached only in strong trend conditions",
        "The stop loss adjustment level",
      ],
      correctIndex: 2,
    },
    {
      question:
        "Compounding $10,000 at 5% monthly for 12 months produces approximately:",
      options: ["$16,000", "$17,958", "$12,000", "$20,000"],
      correctIndex: 1,
    },
    {
      question: "What is a trader's 'edge'?",
      options: [
        "Using the most indicators",
        "A systematic, quantifiable advantage over other market participants",
        "Trading with the highest leverage",
        "Having access to premium tools",
      ],
      correctIndex: 1,
    },
    {
      question:
        "The maximum number of consecutive losses a 1% risk rule protects against:",
      options: [
        "It cannot protect against consecutive losses",
        "Roughly 100 losses before losing all capital",
        "5 losses maximum",
        "10 losses before 50% drawdown",
      ],
      correctIndex: 1,
    },
    {
      question: "After a losing trade, the correct action is:",
      options: [
        "Immediately revenge trade to recover",
        "Double position size on the next trade",
        "Take 30–60 min break, review the trade, then proceed with system",
        "Quit trading for the day immediately",
      ],
      correctIndex: 2,
    },
    {
      question: "When should you scale your trading account?",
      options: [
        "After one very profitable month",
        "After 3+ months of proven consistent profitability",
        "When you feel confident",
        "When leverage allows larger positions",
      ],
      correctIndex: 1,
    },
    {
      question: "DemonZeno AI uses how many AI providers to generate signals?",
      options: [
        "5–10 providers",
        "20 providers",
        "50+ providers for maximum intelligence",
        "1 primary provider",
      ],
      correctIndex: 2,
    },
    {
      question: "A trade journal should contain:",
      options: [
        "Only winning trades for motivation",
        "Entry, exit, R:R, emotional state, and lessons learned for every trade",
        "Only the profit/loss amount",
        "Just the date and asset traded",
      ],
      correctIndex: 1,
    },
    {
      question: "Scaling capital after consistent profitability should be:",
      options: [
        "Immediate — double your capital after first good month",
        "Gradual, systematic, and data-driven",
        "Random based on market conditions",
        "Never done — keep the same capital forever",
      ],
      correctIndex: 1,
    },
    {
      question: "The DemonZeno AI signal advantage comes from:",
      options: [
        "Being the only signal provider",
        "Aggregate intelligence of 50+ AI models including GPT-4, Claude, Gemini, and more",
        "Using only technical analysis",
        "Manual signal verification",
      ],
      correctIndex: 1,
    },
    {
      question: "Trading as a business means treating trading capital as:",
      options: [
        "Spending money for entertainment",
        "A business investment separate from personal living expenses",
        "A guaranteed income source",
        "Gambling stakes",
      ],
      correctIndex: 1,
    },
    {
      question:
        "The maximum daily loss rule (e.g., 3 losses = done for day) exists to:",
      options: [
        "Limit the number of opportunities",
        "Protect against emotional trading spirals after consecutive losses",
        "Follow regulatory requirements",
        "Save time for analysis",
      ],
      correctIndex: 1,
    },
    {
      question: "TP2 in the DemonZeno signal system is:",
      options: [
        "The first conservative target",
        "The core expected target — majority of movement ends here",
        "The optimistic extended target",
        "A trailing stop level",
      ],
      correctIndex: 1,
    },
    {
      question: "Consistency in trading means:",
      options: [
        "The same profit every single month",
        "Following your system's rules regardless of outcome",
        "Never having a losing trade",
        "Trading every day without exception",
      ],
      correctIndex: 1,
    },
    {
      question: "Multi-asset correlation plays work because:",
      options: [
        "All assets are independent",
        "Correlated assets move in the same direction with slight timing lags",
        "Only BTC affects other cryptos",
        "Correlation never changes",
      ],
      correctIndex: 1,
    },
    {
      question: "A trade without a Stop Loss is equivalent to:",
      options: [
        "A conservative trade",
        "Gambling — unlimited potential loss",
        "A breakeven trade",
        "A swing trade",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the DemonZeno trading philosophy slogan?",
      options: [
        "Buy Low, Sell High",
        "Master the Chaos, Slay the Market, Trade Like a God",
        "Risk it for the biscuit",
        "Slow and steady wins the race",
      ],
      correctIndex: 1,
    },
    {
      question:
        "The final position in a signal chain (after TP1 and TP2 closes) should:",
      options: [
        "Be closed immediately at TP2",
        "Run to TP3 with a trailing stop",
        "Be doubled to maximize profit",
        "Be exited at breakeven",
      ],
      correctIndex: 1,
    },
    {
      question: "A profit factor is calculated as:",
      options: [
        "Win rate times average win",
        "Gross profit divided by gross loss",
        "Total trades times average R:R",
        "Wins minus losses",
      ],
      correctIndex: 1,
    },
    {
      question: "Capital preservation is the #1 priority because:",
      options: [
        "You can always make more money quickly",
        "A 50% loss needs 100% gain to recover — time and discipline required",
        "Losses are tax deductible",
        "Small losses don't matter long-term",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What is the recommended forward testing period before live trading?",
      options: ["1 week", "1–2 days", "30–60 days", "6 months minimum"],
      correctIndex: 2,
    },
    {
      question:
        "When closing 40% at TP1 and 40% at TP2, the remaining 20% should:",
      options: [
        "Be closed at a loss if it retraces",
        "Be closed immediately",
        "Run to TP3 with trailing stop, minimum stop at TP1",
        "Be doubled in size",
      ],
      correctIndex: 2,
    },
  ],
};

// ─── Fail Message Display ─────────────────────────────────────────────────────

function FailMessageDisplay({ tierId }: { tierId: string }) {
  const { actor, isFetching } = useActor(createActor);
  const { data: failMsg } = useQuery<string | null>({
    queryKey: ["quizFailMessage", tierId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuizFailMessage(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 60_000,
  });

  if (!failMsg) return null;
  return (
    <div
      className="mt-3 rounded-xl px-4 py-3 text-sm"
      style={{
        background: "oklch(0.65 0.15 190 / 0.08)",
        border: "1px solid oklch(0.65 0.15 190 / 0.25)",
        color: "oklch(0.75 0.10 190)",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider mb-1"
        style={{ color: "oklch(0.65 0.15 190)" }}
      >
        😈 DemonZeno says:
      </p>
      <p className="italic leading-relaxed">&ldquo;{failMsg}&rdquo;</p>
    </div>
  );
}

// ─── Certificate Modal ────────────────────────────────────────────────────────

interface CertificateInfo {
  fullName: string;
  fathersName: string;
  country: string;
  dateOfBirth: string;
  email: string;
  city: string;
}

interface QuizModalProps {
  tier: Tier;
  isPractice: boolean;
  isChallengeMode?: boolean;
  onClose: () => void;
}

// ─── Pre-Quiz Screen ──────────────────────────────────────────────────────────

interface PreQuizScreenProps {
  tier: Tier;
  isPractice: boolean;
  onStart: (challenge: boolean) => void;
  onClose: () => void;
}

function PreQuizScreen({
  tier,
  isPractice,
  onStart,
  onClose,
}: PreQuizScreenProps) {
  const [challengeMode, setChallengeMode] = useState(false);
  const totalQ = 30;
  const secsPerQ = challengeMode ? 90 : 45;
  const totalMins = Math.round((totalQ * secsPerQ) / 60);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "oklch(0.14 0.02 260)",
          border: `1px solid ${tier.color}40`,
          boxShadow: `0 0 60px ${tier.glowColor}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl text-foreground">
              {tier.name} {isPractice ? "Practice Quiz" : "Certification Quiz"}
            </h3>
            <p className="text-muted-foreground text-sm mt-0.5">
              {isPractice
                ? "Practice mode — no certificate issued."
                : "Score a perfect 30/30 to earn your official certificate."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            style={{ background: "oklch(0.22 0.02 260)" }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Estimated time */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            background: `${tier.color}10`,
            border: `1px solid ${tier.color}30`,
          }}
        >
          <Clock className="w-4 h-4 shrink-0" style={{ color: tier.color }} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Estimated time: ~{totalMins} minutes
            </p>
            <p className="text-xs text-muted-foreground">
              {totalQ} questions × {secsPerQ}s each
              {challengeMode && " · Challenge Mode active"}
            </p>
          </div>
        </div>

        {/* Challenge mode toggle */}
        {!isPractice && (
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between gap-3"
            style={{
              background: challengeMode
                ? "oklch(0.65 0.22 25 / 0.08)"
                : "oklch(0.18 0.01 260)",
              border: challengeMode
                ? "1.5px solid oklch(0.65 0.22 25 / 0.4)"
                : "1px solid oklch(0.28 0.01 260)",
            }}
          >
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                {challengeMode && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                    style={{
                      background: "oklch(0.65 0.22 25 / 0.2)",
                      color: "oklch(0.75 0.20 25)",
                    }}
                  >
                    ⚡ CHALLENGE
                  </span>
                )}
                Challenge Mode
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {challengeMode
                  ? "90 seconds per question — expert difficulty"
                  : "Enable for 90s timer per question (harder)"}
              </p>
            </div>
            <button
              type="button"
              data-ocid="academy.quiz.challenge_toggle"
              onClick={() => setChallengeMode((v) => !v)}
              className="shrink-0 w-12 h-6 rounded-full relative transition-all duration-300"
              style={{
                background: challengeMode
                  ? "oklch(0.65 0.22 25)"
                  : "oklch(0.30 0.01 260)",
              }}
              aria-label="Toggle challenge mode"
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                style={{
                  transform: challengeMode
                    ? "translateX(24px)"
                    : "translateX(0)",
                }}
              />
            </button>
          </div>
        )}

        {/* Quiz info */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Questions", value: "30" },
            { label: "Pass Mark", value: isPractice ? "Practice" : "30/30" },
            { label: "Timer", value: `${secsPerQ}s per Q` },
            {
              label: "Mode",
              value: challengeMode
                ? "⚡ Challenge"
                : isPractice
                  ? "Practice"
                  : "Certification",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg px-3 py-2 text-center"
              style={{
                background: "oklch(0.18 0.01 260)",
                border: "1px solid oklch(0.26 0.01 260)",
              }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          data-ocid="academy.quiz.start_button"
          onClick={() => onStart(challengeMode)}
          className="w-full py-3 rounded-xl font-display font-bold text-sm transition-smooth"
          style={{ background: tier.color, color: "oklch(0.10 0.01 260)" }}
        >
          {challengeMode ? "⚡ Start Challenge Mode" : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}

// ─── Checkpoint Quiz ──────────────────────────────────────────────────────────

interface CheckpointQuizProps {
  tier: Tier;
  onClose: () => void;
}

function CheckpointQuizModal({ tier, onClose }: CheckpointQuizProps) {
  const { actor } = useActor(createActor);
  const allQuestions = TIER_QUIZZES[tier.id] ?? [];
  // Pick 10 questions pseudo-randomly from the pool
  const questions = useMemo(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, [allQuestions]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const shuffledData = useMemo(() => {
    return questions.map((q) => {
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const shuffledOptions = indices.map((i) => q.options[i]);
      const shuffledCorrectIdx = indices.indexOf(q.correctIndex);
      return { shuffledOptions, shuffledCorrectIdx };
    });
  }, [questions]);

  const correctCount = submitted
    ? questions.filter(
        (_q, i) => answers[i] === shuffledData[i]?.shuffledCorrectIdx,
      ).length
    : 0;

  const q = questions[currentQ];
  const sd = shuffledData[currentQ];
  const selectedAnswer = answers[currentQ];

  function handleAnswer(ai: number) {
    if (submitted || showFeedback) return;
    setAnswers((prev) => ({ ...prev, [currentQ]: ai }));
    setShowFeedback(true);
  }

  function handleNext() {
    setShowFeedback(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1);
    } else {
      setSubmitted(true);
      // submit to backend
      if (actor) {
        void actor.submitCheckpointQuiz(
          tier.id,
          BigInt(
            correctCount +
              (answers[currentQ] === sd?.shuffledCorrectIdx ? 1 : 0),
          ),
        );
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
      data-ocid="academy.checkpoint.dialog"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "oklch(0.14 0.02 260)",
          border: `1px solid ${tier.color}40`,
          boxShadow: `0 0 60px ${tier.glowColor}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              Mid-Tier Checkpoint Quiz
            </h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              10 questions · No timer · No certificate · Just a progress check
            </p>
          </div>
          <button
            type="button"
            data-ocid="academy.checkpoint.close_button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            style={{ background: "oklch(0.22 0.02 260)" }}
            aria-label="Close checkpoint quiz"
          >
            ✕
          </button>
        </div>

        {!submitted && q && sd && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Question {currentQ + 1} of {questions.length}
              </span>
              <span style={{ color: tier.color }}>
                {Object.keys(answers).length} answered
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "oklch(0.22 0.01 260)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQ + 1) / questions.length) * 100}%`,
                  background: tier.color,
                }}
              />
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.18 0.01 260)",
                border: `1px solid ${tier.color}20`,
              }}
            >
              <p className="text-foreground text-sm font-medium leading-relaxed">
                <span style={{ color: tier.color }} className="font-bold mr-1">
                  {currentQ + 1}.
                </span>
                {q.question}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sd.shuffledOptions.map((opt, ai) => {
                let bg = "oklch(0.20 0.01 260)";
                let border = "1px solid oklch(0.28 0.01 260)";
                let color = "oklch(0.75 0.01 260)";
                if (showFeedback && ai === sd.shuffledCorrectIdx) {
                  bg = "oklch(0.25 0.12 145)";
                  border = "1px solid oklch(0.60 0.15 145)";
                  color = "oklch(0.80 0.14 145)";
                } else if (
                  showFeedback &&
                  ai === selectedAnswer &&
                  selectedAnswer !== sd.shuffledCorrectIdx
                ) {
                  bg = "oklch(0.22 0.10 20)";
                  border = "1px solid oklch(0.55 0.18 20)";
                  color = "oklch(0.75 0.15 20)";
                } else if (selectedAnswer === ai) {
                  bg = `${tier.color}25`;
                  border = `1px solid ${tier.color}80`;
                  color = tier.color;
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleAnswer(ai)}
                    disabled={showFeedback}
                    className="text-left px-3 py-2.5 rounded-lg text-sm transition-smooth"
                    style={{ background: bg, border, color }}
                  >
                    <span className="font-bold mr-1">
                      {String.fromCharCode(65 + ai)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  data-ocid="academy.checkpoint.next_button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-smooth"
                  style={{
                    background: tier.color,
                    color: "oklch(0.10 0.01 260)",
                  }}
                >
                  {currentQ < questions.length - 1 ? "Next →" : "See Results"}
                </button>
              </div>
            )}
          </div>
        )}

        {submitted && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="text-5xl">
              {correctCount >= 8 ? "🎯" : correctCount >= 5 ? "📚" : "🔄"}
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-foreground">
                Checkpoint Complete!
              </h4>
              <p
                className="font-bold text-lg mt-1"
                style={{
                  color:
                    correctCount >= 8 ? "oklch(0.70 0.15 145)" : tier.color,
                }}
              >
                {correctCount}/10 Correct
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                {correctCount >= 8
                  ? "Excellent! You're solid on this tier's material."
                  : correctCount >= 5
                    ? "Good effort. Review the lessons you found tricky before the real quiz."
                    : "Keep studying the lessons before taking the final quiz."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Note: This is just a progress check. The real quiz requires
                30/30 for a certificate.
              </p>
            </div>
            <button
              type="button"
              data-ocid="academy.checkpoint.close_result_button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-semibold transition-smooth"
              style={{
                background: `${tier.color}20`,
                border: `1px solid ${tier.color}50`,
                color: tier.color,
              }}
            >
              Back to Lessons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Modal Wrapper ───────────────────────────────────────────────────────

function QuizModal({ tier, isPractice, onClose }: QuizModalProps) {
  const [challengeMode, setChallengeMode] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  if (!quizStarted) {
    return (
      <PreQuizScreen
        tier={tier}
        isPractice={isPractice}
        onStart={(challenge) => {
          setChallengeMode(challenge);
          setQuizStarted(true);
        }}
        onClose={onClose}
      />
    );
  }
  return (
    <QuizModalInner
      tier={tier}
      isPractice={isPractice}
      challengeMode={challengeMode}
      onClose={onClose}
    />
  );
}

// ─── Quiz Modal Inner (all hooks unconditional) ───────────────────────────────

function QuizModalInner({
  tier,
  isPractice,
  challengeMode,
  onClose,
}: {
  tier: Tier;
  isPractice: boolean;
  challengeMode: boolean;
  onClose: () => void;
}) {
  const { actor } = useActor(createActor);
  const allQuestions = TIER_QUIZZES[tier.id] ?? [];
  const timerSeconds = challengeMode ? 90 : 45;

  // Randomize 30 questions from pool on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally stable on mount
  const questions = useMemo(
    () => [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 30),
    [],
  );

  // Quiz state
  const totalQ = questions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Shuffle seeds: stable per quiz session
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally stable on mount
  const shuffleSeeds = useMemo(() => questions.map(() => Math.random()), []);

  // Per-question shuffled options
  const shuffledData = useMemo(() => {
    return questions.map((q, qi) => {
      const indices = q.options.map((_: string, i: number) => i);
      const seed = shuffleSeeds[qi] ?? 0.5;
      const rng = ((s0: number) => {
        let s = s0;
        return () => {
          s = (s * 16807 + 0) % 2147483647;
          return (s - 1) / 2147483646;
        };
      })(Math.floor(seed * 1e9));
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        shuffledOptions: indices.map((i: number) => q.options[i]),
        shuffledCorrectIdx: indices.indexOf(q.correctIndex),
      };
    });
  }, [questions, shuffleSeeds]);

  // Adaptive difficulty: notify user when first 10 were all correct
  const first10AllCorrect = useMemo(() => {
    if (currentQ < 10) return false;
    return Array.from({ length: 10 }, (_, i) => i).every((i) => {
      const sd = shuffledData[i];
      return sd !== undefined && answers[i] === sd.shuffledCorrectIdx;
    });
  }, [currentQ, answers, shuffledData]);

  // Certificate state
  const [certInfo, setCertInfo] = useState<CertificateInfo>({
    fullName: "",
    fathersName: "",
    country: "",
    dateOfBirth: "",
    email: "",
    city: "",
  });
  const [showCertForm, setShowCertForm] = useState(false);
  const [issuedCertId, setIssuedCertId] = useState<string | null>(null);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (showFeedback) return;
    setTimeLeft(timerSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    void currentQ;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setShowFeedback(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, showFeedback, timerSeconds]);

  const correctCount = submitted
    ? questions.filter(
        (_q, i) => answers[i] === shuffledData[i]?.shuffledCorrectIdx,
      ).length
    : 0;
  const passed = submitted && correctCount === totalQ;
  const practiceMode = isPractice;
  const q = questions[currentQ];
  const sd = shuffledData[currentQ];
  const selectedAnswer = answers[currentQ];
  const hasAnswered = selectedAnswer !== undefined;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / totalQ) * 100);

  function handleAnswer(ai: number) {
    if (submitted || showFeedback) return;
    setAnswers((prev) => ({ ...prev, [currentQ]: ai }));
    setShowFeedback(true);
  }

  function handleNext() {
    setShowFeedback(false);
    if (currentQ < totalQ - 1) setCurrentQ((prev) => prev + 1);
    else setSubmitted(true);
  }

  async function handleIssueCertificate() {
    if (!certInfo.fullName.trim() || !actor) return;
    setIsIssuing(true);
    setIssueError(null);
    try {
      const optionIds = ["a", "b", "c", "d"];
      const quizAnswers = questions.map((_q, i) => ({
        questionId: String(i),
        selectedOption: optionIds[answers[i] ?? 0] ?? "a",
      }));
      const result = await actor.submitQuizAndIssueCertificate(
        tier.id,
        quizAnswers,
        certInfo.fullName.trim(),
        certInfo.fathersName.trim(),
        certInfo.country.trim(),
        certInfo.dateOfBirth.trim(),
        certInfo.email.trim(),
        certInfo.city.trim(),
        BigInt(Date.now()),
        [navigator.userAgent, screen.width, screen.height].join("|"),
      );
      if (result.__kind__ === "ok") {
        setIssuedCertId(result.ok.certId);
      } else {
        const errMsg =
          typeof result.err === "string"
            ? result.err
            : "Failed to issue certificate";
        setIssueError(
          errMsg.includes("DUPLICATE_CERTIFICATE") ||
            errMsg.toLowerCase().includes("already")
            ? "You already have a certificate for this tier! Find it on the Certificate Wall."
            : errMsg,
        );
      }
    } catch {
      setIssueError("Could not connect to backend. Please try again.");
    } finally {
      setIsIssuing(false);
    }
  }

  async function downloadCertificate() {
    const canvas = document.createElement("canvas");
    const W = 1200;
    const H = 850;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#0b0f1c");
    bgGrad.addColorStop(1, "#111827");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#20d9c8";
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.strokeStyle = "#c81e32";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(28, 28, W - 56, H - 56);
    const corner = (x: number, y: number, sx: number, sy: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "#20d9c8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx * 50, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, sy * 50);
      ctx.stroke();
      ctx.restore();
    };
    corner(18, 18, 1, 1);
    corner(W - 18, 18, -1, 1);
    corner(18, H - 18, 1, -1);
    corner(W - 18, H - 18, -1, -1);
    ctx.save();
    ctx.globalAlpha = 0.045;
    ctx.font = "bold 120px sans-serif";
    ctx.fillStyle = "#20d9c8";
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = "center";
    ctx.fillText("DemonZeno", 0, 0);
    ctx.restore();
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#c81e32";
    ctx.textAlign = "center";
    ctx.letterSpacing = "3px";
    ctx.fillText("DEMONZENO TRADING ACADEMY", W / 2, 90);
    ctx.letterSpacing = "0px";
    const tc: Record<string, string> = {
      beginner: "#22c55e",
      intermediate: "#06b6d4",
      advanced: "#6366f1",
      expert: "#f97316",
      master: "#eab308",
    };
    const tierColor = tc[tier.id] ?? "#20d9c8";
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = tierColor;
    ctx.textAlign = "center";
    ctx.fillText(`\u2746 ${tier.name.toUpperCase()} TIER \u2746`, W / 2, 118);
    ctx.font = "bold 52px serif";
    ctx.fillStyle = "#20d9c8";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Achievement", W / 2, 200);
    const rg = ctx.createLinearGradient(W / 2 - 300, 0, W / 2 + 300, 0);
    rg.addColorStop(0, "transparent");
    rg.addColorStop(0.3, "#20d9c8");
    rg.addColorStop(0.7, "#20d9c8");
    rg.addColorStop(1, "transparent");
    ctx.strokeStyle = rg;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 300, 220);
    ctx.lineTo(W / 2 + 300, 220);
    ctx.stroke();
    ctx.font = "16px serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText("This certifies that", W / 2, 270);
    const displayName = certInfo.fullName || "Trader";
    ctx.font = "bold 44px serif";
    ctx.fillStyle = "#f1f5f9";
    ctx.textAlign = "center";
    ctx.fillText(displayName, W / 2, 340);
    const nw = Math.min(ctx.measureText(displayName).width, 700);
    ctx.strokeStyle = "#c81e32";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nw / 2, 355);
    ctx.lineTo(W / 2 + nw / 2, 355);
    ctx.stroke();
    ctx.font = "16px serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText("has successfully completed the", W / 2, 395);
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = tierColor;
    ctx.fillText(`${tier.name} Tier`, W / 2, 432);
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("with a perfect score of 30/30", W / 2, 460);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 500);
    ctx.lineTo(W - 80, 500);
    ctx.stroke();
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.fillText(`Father: ${certInfo.fathersName || "\u2014"}`, W / 4, 550);
    ctx.fillText(`Country: ${certInfo.country || "\u2014"}`, W / 2, 550);
    ctx.fillText(
      `Issued: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      (3 * W) / 4,
      550,
    );
    if (issuedCertId) {
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#20d9c8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 170, 590, 340, 52, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "center";
      ctx.fillText("CERTIFICATE ID", W / 2, 608);
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "#20d9c8";
      ctx.fillText(issuedCertId, W / 2, 630);
    }
    ctx.save();
    ctx.translate(W - 200, 590);
    ctx.rotate(Math.PI / 12);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#22c55e";
    ctx.textAlign = "center";
    ctx.fillText("\u2713 VERIFIED", 0, -8);
    ctx.fillText("LEARNER", 0, 10);
    ctx.restore();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, 710);
    ctx.lineTo(W / 2 + 120, 710);
    ctx.stroke();
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#20d9c8";
    ctx.textAlign = "center";
    ctx.fillText("DemonZeno", W / 2, 732);
    ctx.font = "italic 12px serif";
    ctx.fillStyle = "#475569";
    ctx.fillText(
      "Master the Chaos, Slay the Market, Trade Like a God",
      W / 2,
      754,
    );
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.textAlign = "center";
    ctx.fillText(
      "DemonZeno Trading Academy \u00b7 Globally Verifiable",
      W / 2,
      810,
    );
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `DemonZeno-Certificate-${issuedCertId ?? certInfo.fullName.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)" }}
      data-ocid="academy.quiz.dialog"
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "oklch(0.14 0.02 260)",
          border: `1px solid ${tier.color}40`,
          boxShadow: `0 0 60px ${tier.glowColor}`,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 sticky top-0 pb-3"
          style={{ background: "oklch(0.14 0.02 260)" }}
        >
          <div className="min-w-0">
            <h3 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              {tier.name}{" "}
              {practiceMode ? "Practice Quiz" : "Certification Quiz"}
              {challengeMode && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                  style={{
                    background: "oklch(0.65 0.22 25 / 0.2)",
                    color: "oklch(0.75 0.20 25)",
                  }}
                >
                  \u26a1 CHALLENGE
                </span>
              )}
            </h3>
            <p className="text-muted-foreground text-sm mt-0.5">
              {practiceMode
                ? "Practice mode \u2014 no certificate issued. Unlimited attempts."
                : "Score a perfect 30/30 to earn your official certificate."}
            </p>
            {first10AllCorrect && currentQ >= 10 && !submitted && (
              <p
                className="text-xs mt-1 font-semibold"
                style={{ color: "oklch(0.70 0.15 85)" }}
              >
                \u26a1 Adaptive mode \u2014 remaining questions are now harder!
              </p>
            )}
          </div>
          <button
            type="button"
            data-ocid="academy.quiz.close_button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            style={{ background: "oklch(0.22 0.02 260)" }}
            aria-label="Close quiz"
          >
            \u2715
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Question {Math.min(currentQ + 1, totalQ)} of {totalQ}
              </span>
              <span style={{ color: tier.color }}>
                {answeredCount} answered \u00b7 need perfect 30/30
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "oklch(0.22 0.01 260)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%`, background: tier.color }}
              />
            </div>
          </div>
        )}

        {/* Timer */}
        {!submitted && !showFeedback && (
          <div className="flex items-center gap-3">
            <Clock
              className="w-3.5 h-3.5 shrink-0"
              style={{
                color: timeLeft <= 10 ? "oklch(0.65 0.20 25)" : tier.color,
              }}
            />
            <div
              className="flex-1 h-1 rounded-full overflow-hidden"
              style={{ background: "oklch(0.22 0.01 260)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / timerSeconds) * 100}%`,
                  background:
                    timeLeft <= 10 ? "oklch(0.65 0.20 25)" : tier.color,
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              {challengeMode && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                  style={{
                    background: "oklch(0.65 0.22 25 / 0.2)",
                    color: "oklch(0.75 0.20 25)",
                  }}
                >
                  \u26a1
                </span>
              )}
              <span
                className="text-xs font-mono w-5 text-right"
                style={{
                  color:
                    timeLeft <= 10
                      ? "oklch(0.65 0.20 25)"
                      : "oklch(0.55 0.01 260)",
                }}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Active question */}
        {!submitted && q && sd && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.18 0.01 260)",
                border: `1px solid ${tier.color}20`,
              }}
            >
              <p className="text-foreground text-sm font-medium leading-relaxed">
                <span style={{ color: tier.color }} className="font-bold mr-1">
                  {currentQ + 1}.
                </span>
                {q.question}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sd.shuffledOptions.map((opt: string, ai: number) => {
                const isCorrectShuffled = ai === sd.shuffledCorrectIdx;
                const isWrongSelected =
                  ai === selectedAnswer &&
                  selectedAnswer !== sd.shuffledCorrectIdx;
                let bg = "oklch(0.20 0.01 260)";
                let border = "1px solid oklch(0.28 0.01 260)";
                let color = "oklch(0.75 0.01 260)";
                if (showFeedback) {
                  if (practiceMode && isCorrectShuffled) {
                    bg = "oklch(0.25 0.12 145)";
                    border = "1px solid oklch(0.60 0.15 145)";
                    color = "oklch(0.80 0.14 145)";
                  } else if (isWrongSelected) {
                    bg = "oklch(0.22 0.10 20)";
                    border = "1px solid oklch(0.55 0.18 20)";
                    color = "oklch(0.75 0.15 20)";
                  }
                } else if (selectedAnswer === ai) {
                  bg = `${tier.color}25`;
                  border = `1px solid ${tier.color}80`;
                  color = tier.color;
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    data-ocid={`academy.quiz.q${currentQ + 1}.option.${ai + 1}`}
                    onClick={() => handleAnswer(ai)}
                    disabled={showFeedback}
                    className="text-left px-3 py-2.5 rounded-lg text-sm transition-smooth"
                    style={{ background: bg, border, color }}
                  >
                    <span className="font-bold mr-1">
                      {String.fromCharCode(65 + ai)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {showFeedback && (
              <div
                className="rounded-lg px-4 py-3 flex items-start gap-3"
                style={{
                  background:
                    selectedAnswer === sd.shuffledCorrectIdx
                      ? "oklch(0.20 0.08 145)"
                      : "oklch(0.20 0.08 20)",
                  border:
                    selectedAnswer === sd.shuffledCorrectIdx
                      ? "1px solid oklch(0.55 0.14 145)"
                      : "1px solid oklch(0.50 0.15 20)",
                }}
              >
                <span className="text-xl shrink-0">
                  {selectedAnswer === sd.shuffledCorrectIdx
                    ? "\u2713"
                    : "\u2717"}
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <p
                    className="font-semibold text-sm"
                    style={{
                      color:
                        selectedAnswer === sd.shuffledCorrectIdx
                          ? "oklch(0.75 0.14 145)"
                          : "oklch(0.72 0.15 20)",
                    }}
                  >
                    {selectedAnswer === sd.shuffledCorrectIdx
                      ? "Correct!"
                      : "Not quite \u2014 keep studying!"}
                  </p>
                  {selectedAnswer !== sd.shuffledCorrectIdx && practiceMode && (
                    <p className="text-xs text-muted-foreground">
                      Review the lesson material to master this concept.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              {currentQ > 0 && !showFeedback && (
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedback(false);
                    setCurrentQ((p) => p - 1);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
                  style={{
                    background: "oklch(0.22 0.01 260)",
                    border: "1px solid oklch(0.30 0.01 260)",
                    color: "oklch(0.65 0.01 260)",
                  }}
                >
                  \u2190 Back
                </button>
              )}
              <div className="flex-1" />
              {!hasAnswered ? (
                <p className="text-xs text-muted-foreground italic">
                  Select an answer to continue
                </p>
              ) : showFeedback ? (
                <button
                  type="button"
                  data-ocid="academy.quiz.next_button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl font-display font-bold text-sm transition-smooth"
                  style={{
                    background: tier.color,
                    color: "oklch(0.10 0.01 260)",
                  }}
                >
                  {currentQ < totalQ - 1
                    ? "Next Question \u2192"
                    : "View Results"}
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Failed result */}
        {submitted && !passed && (
          <div className="flex flex-col items-center gap-5 text-center py-4">
            <div className="text-5xl">\ud83d\udcda</div>
            <div>
              <h4 className="font-display font-bold text-xl text-foreground">
                Keep Studying!
              </h4>
              <p className="text-muted-foreground mt-1">
                You scored{" "}
                <strong className="text-foreground">
                  {correctCount}/{totalQ}
                </strong>{" "}
                \u2014 need a perfect{" "}
                <strong style={{ color: tier.color }}>30/30</strong> to pass.
              </p>
              {!practiceMode && <FailMessageDisplay tierId={tier.id} />}
            </div>
            <button
              type="button"
              data-ocid="academy.quiz.retry_button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setCurrentQ(0);
                setShowFeedback(false);
              }}
              className="px-6 py-2.5 rounded-xl font-semibold transition-smooth"
              style={{
                background: `${tier.color}20`,
                border: `1px solid ${tier.color}50`,
                color: tier.color,
              }}
            >
              Retake Quiz
            </button>
          </div>
        )}

        {/* Passed (certification) */}
        {submitted && passed && !practiceMode && (
          <div className="flex flex-col items-center gap-5 text-center py-4">
            <div className="text-6xl animate-bounce">\ud83c\udfc6</div>
            <div>
              <h4 className="font-display font-bold text-2xl text-foreground">
                You Passed!
              </h4>
              <p
                style={{ color: tier.color }}
                className="font-bold text-lg mt-1"
              >
                {correctCount}/{totalQ} Correct
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                You have earned the{" "}
                <strong className="text-foreground">{tier.name} Tier</strong>{" "}
                certificate from DemonZeno.
              </p>
            </div>
            {!issuedCertId && !showCertForm && (
              <button
                type="button"
                data-ocid="academy.certificate.claim_button"
                onClick={() => setShowCertForm(true)}
                className="px-8 py-3 rounded-xl font-display font-bold transition-smooth"
                style={{
                  background: tier.color,
                  color: "oklch(0.10 0.01 260)",
                }}
              >
                Claim Your Certificate \ud83c\udf93
              </button>
            )}
            {showCertForm && !issuedCertId && (
              <div className="w-full max-w-sm flex flex-col gap-4 text-left">
                <p className="text-sm text-muted-foreground text-center">
                  Enter your details to generate your official certificate
                </p>
                {(
                  [
                    {
                      id: "cert-name",
                      field: "fullName" as const,
                      label: "Full Name *",
                      type: "text",
                      placeholder: "Your full name",
                    },
                    {
                      id: "cert-fn",
                      field: "fathersName" as const,
                      label: "Father's Name *",
                      type: "text",
                      placeholder: "Father's full name",
                    },
                    {
                      id: "cert-country",
                      field: "country" as const,
                      label: "Country *",
                      type: "text",
                      placeholder: "Your country",
                    },
                    {
                      id: "cert-city",
                      field: "city" as const,
                      label: "City *",
                      type: "text",
                      placeholder: "Your city",
                    },
                    {
                      id: "cert-dob",
                      field: "dateOfBirth" as const,
                      label: "Date of Birth *",
                      type: "date",
                      placeholder: "",
                    },
                    {
                      id: "cert-email",
                      field: "email" as const,
                      label: "Email *",
                      type: "email",
                      placeholder: "your@email.com",
                    },
                  ] as {
                    id: string;
                    field: keyof CertificateInfo;
                    label: string;
                    type: string;
                    placeholder: string;
                  }[]
                ).map(({ id, field, label, type, placeholder }) => (
                  <div key={id} className="flex flex-col gap-1">
                    <label
                      htmlFor={id}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      type={type}
                      data-ocid={`academy.certificate.${field}_input`}
                      placeholder={placeholder}
                      value={certInfo[field]}
                      onChange={(e) =>
                        setCertInfo((p) => ({ ...p, [field]: e.target.value }))
                      }
                      className="px-4 py-2.5 rounded-lg text-sm text-foreground border focus:outline-none focus:ring-2 transition-smooth"
                      style={{
                        background: "oklch(0.20 0.01 260)",
                        borderColor: `${tier.color}50`,
                      }}
                    />
                  </div>
                ))}
                {issueError && (
                  <p
                    className="text-xs text-red-400"
                    data-ocid="academy.certificate.error_state"
                  >
                    {issueError}
                  </p>
                )}
                <button
                  type="button"
                  data-ocid="academy.certificate.generate_button"
                  onClick={handleIssueCertificate}
                  disabled={
                    !certInfo.fullName.trim() ||
                    !certInfo.fathersName.trim() ||
                    !certInfo.country.trim() ||
                    isIssuing
                  }
                  className="w-full py-3 rounded-xl font-display font-bold flex items-center justify-center gap-2 transition-smooth disabled:opacity-40"
                  style={{
                    background: tier.color,
                    color: "oklch(0.10 0.01 260)",
                  }}
                >
                  {isIssuing ? (
                    <span data-ocid="academy.certificate.loading_state">
                      Generating Certificate\u2026
                    </span>
                  ) : (
                    <>Generate My Certificate</>
                  )}
                </button>
              </div>
            )}
            {issuedCertId && (
              <div className="w-full max-w-md flex flex-col gap-4 text-center">
                <div
                  className="rounded-xl p-5"
                  style={{
                    background: `${tier.color}10`,
                    border: `2px solid ${tier.color}50`,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Certificate ID
                  </p>
                  <p
                    className="font-mono text-2xl font-bold tracking-widest"
                    style={{ color: tier.color }}
                    data-ocid="academy.certificate.cert_id"
                  >
                    {issuedCertId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Globally stored and verifiable on the Certificate Wall.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Certificate issued for{" "}
                  <strong className="text-foreground">
                    {certInfo.fullName}
                  </strong>
                </p>
                <button
                  type="button"
                  data-ocid="academy.certificate.download_button"
                  onClick={downloadCertificate}
                  className="w-full py-3 rounded-xl font-display font-bold flex items-center justify-center gap-2 transition-smooth"
                  style={{
                    background: tier.color,
                    color: "oklch(0.10 0.01 260)",
                  }}
                >
                  <Download className="w-4 h-4" /> Download Certificate PNG
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="academy.certificate.share_twitter_button"
                    onClick={() => {
                      const u = `${window.location.origin}/certificates?verify=${issuedCertId}`;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I earned the ${tier.name} cert from DemonZeno! \ud83c\udf93 ID: ${issuedCertId} #DMNZ Verify: ${u}`)}`,
                        "_blank",
                        "noopener",
                      );
                    }}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center border-2 transition-smooth"
                    style={{
                      borderColor: "oklch(0.65 0.15 210 / 0.5)",
                      color: "oklch(0.65 0.15 210)",
                    }}
                  >
                    Share on X
                  </button>
                  <button
                    type="button"
                    data-ocid="academy.certificate.share_binance_button"
                    onClick={() => {
                      const u = `${window.location.origin}/certificates?verify=${issuedCertId}`;
                      window.open(
                        `https://www.binance.com/en/square/post?text=${encodeURIComponent(`I earned the ${tier.name} cert from DemonZeno! \ud83c\udf93 ID: ${issuedCertId} #DMNZ Verify: ${u}`)}`,
                        "_blank",
                        "noopener",
                      );
                    }}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center border-2 transition-smooth"
                    style={{
                      borderColor: "oklch(0.7 0.18 70 / 0.5)",
                      color: "oklch(0.7 0.18 70)",
                    }}
                  >
                    Share on Binance
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice result */}
        {submitted && practiceMode && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="text-5xl">
              {passed ? "\ud83c\udfaf" : "\ud83d\udcda"}
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-foreground">
                {passed ? "Perfect Score!" : "Practice Complete!"}
              </h4>
              <p className="text-muted-foreground mt-1">
                You scored{" "}
                <strong style={{ color: tier.color }} className="text-lg">
                  {correctCount}/{totalQ}
                </strong>{" "}
                in practice mode.
              </p>
              {!passed && (
                <p className="text-xs text-muted-foreground mt-2">
                  The real quiz requires 30/30. Keep studying!
                </p>
              )}
            </div>
            <button
              type="button"
              data-ocid="academy.quiz.practice_retry_button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
                setCurrentQ(0);
                setShowFeedback(false);
              }}
              className="px-6 py-2.5 rounded-xl font-semibold transition-smooth"
              style={{
                background: `${tier.color}20`,
                border: `1px solid ${tier.color}50`,
                color: tier.color,
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Submit bar */}
        {!submitted && answeredCount === totalQ && (
          <div
            className="sticky bottom-0 pt-4 flex flex-col gap-3"
            style={{ background: "oklch(0.14 0.02 260)" }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {answeredCount} of {totalQ} answered
              </span>
              <span style={{ color: tier.color }} className="font-semibold">
                Need perfect 30/30 to pass
              </span>
            </div>
            <button
              type="button"
              data-ocid="academy.quiz.submit_button"
              onClick={() => setSubmitted(true)}
              className="w-full py-3 rounded-xl font-display font-bold text-base transition-smooth"
              style={{ background: tier.color, color: "oklch(0.10 0.01 260)" }}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PDF Export (Tier Content) ────────────────────────────────────────────────

async function exportTierPDF(tier: Tier) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  let pageNum = 1;

  function addBackground() {
    doc.setFillColor(15, 20, 35);
    doc.rect(0, 0, W, H, "F");
  }

  function addWatermark() {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(72);
    doc.setTextColor(32, 217, 200);
    doc.setGState(doc.GState({ opacity: 0.06 }));
    doc.text("DemonZeno", W / 2, H / 2, { align: "center", angle: 335 });
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  function addPageFrame() {
    addBackground();
    addWatermark();
    doc.setDrawColor(32, 217, 200);
    doc.setLineWidth(1);
    doc.rect(5, 5, W - 10, H - 10, "S");
  }

  function addFooter() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(80, 100, 120);
    doc.text(
      `DemonZeno Trading Academy | Master the Chaos, Slay the Market, Trade Like a God | Page ${pageNum}`,
      W / 2,
      H - 8,
      { align: "center" },
    );
  }

  // Cover page
  addPageFrame();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(200, 30, 50);
  doc.text("DEMONZENO TRADING ACADEMY", W / 2, 45, { align: "center" });
  doc.setFontSize(28);
  doc.setTextColor(32, 217, 200);
  doc.text(`${tier.name} Tier`, W / 2, 68, { align: "center" });
  doc.setFontSize(13);
  doc.setTextColor(200, 200, 220);
  doc.text("Complete Study Guide", W / 2, 80, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(140, 160, 180);
  const descLines = doc.splitTextToSize(tier.description, 140);
  doc.text(descLines, W / 2, 100, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(100, 120, 140);
  doc.text(
    `${tier.lessons.length} Lessons · Powered by DemonZeno AI`,
    W / 2,
    125,
    { align: "center" },
  );
  addFooter();

  // Lesson pages
  for (const lesson of tier.lessons) {
    doc.addPage();
    pageNum++;
    addPageFrame();

    let y = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(32, 217, 200);
    const titleLines = doc.splitTextToSize(lesson.title, W - 30);
    doc.text(titleLines, 15, y);
    y += titleLines.length * 7 + 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 160, 180);
    doc.text(`Estimated time: ${lesson.duration}`, 15, y);
    y += 8;

    doc.setDrawColor(32, 217, 200);
    doc.setLineWidth(0.4);
    doc.line(15, y, W - 15, y);
    y += 6;

    for (const para of lesson.content) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(200, 210, 225);
      const lines = doc.splitTextToSize(para, W - 30);
      if (y + lines.length * 5 > H - 22) {
        addFooter();
        doc.addPage();
        pageNum++;
        addPageFrame();
        y = 20;
      }
      doc.text(lines, 15, y);
      y += lines.length * 5 + 5;
    }

    // Key Takeaways box
    if (y + 8 > H - 22) {
      addFooter();
      doc.addPage();
      pageNum++;
      addPageFrame();
      y = 20;
    }
    y += 4;
    doc.setFillColor(20, 40, 50);
    doc.setDrawColor(32, 217, 200);
    doc.setLineWidth(0.5);
    const twBoxH = lesson.takeaways.length * 7 + 18;
    doc.roundedRect(12, y, W - 24, twBoxH, 3, 3, "FD");
    y += 9;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(32, 217, 200);
    doc.text("KEY TAKEAWAYS", 18, y);
    y += 7;
    for (const tw of lesson.takeaways) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(180, 220, 215);
      doc.text(`• ${tw}`, 18, y);
      y += 7;
    }

    addFooter();
  }

  doc.save(`demonzeno-academy-${tier.id}-${Date.now()}.pdf`);
}

// ─── Single Lesson PDF Export ─────────────────────────────────────────────────

async function exportLessonPDF(
  lesson: Lesson,
  tier: Tier,
  lessonIndex: number,
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  let pageNum = 1;

  function addBg() {
    doc.setFillColor(15, 20, 35);
    doc.rect(0, 0, W, H, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(54);
    doc.setTextColor(32, 217, 200);
    doc.setGState(doc.GState({ opacity: 0.05 }));
    doc.text("DemonZeno", W / 2, H / 2, { align: "center", angle: 335 });
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setDrawColor(32, 217, 200);
    doc.setLineWidth(0.8);
    doc.rect(5, 5, W - 10, H - 10, "S");
  }

  function addFooterPage() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(80, 100, 120);
    doc.text(
      `DemonZeno Trading Academy | ${tier.name} Tier | Page ${pageNum}`,
      W / 2,
      H - 8,
      { align: "center" },
    );
  }

  addBg();

  let y = 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 160, 180);
  doc.text(
    `DEMONZENO ACADEMY — ${tier.name.toUpperCase()} TIER — LESSON ${lessonIndex + 1}`,
    15,
    y,
  );
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(32, 217, 200);
  const titleLines = doc.splitTextToSize(lesson.title, W - 30);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 8 + 4;

  doc.setDrawColor(32, 217, 200);
  doc.setLineWidth(0.4);
  doc.line(15, y, W - 15, y);
  y += 7;

  for (const para of lesson.content) {
    if (y > H - 22) {
      addFooterPage();
      doc.addPage();
      pageNum++;
      addBg();
      y = 20;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(200, 210, 225);
    const lines = doc.splitTextToSize(para, W - 30);
    doc.text(lines, 15, y);
    y += lines.length * 5 + 6;
  }

  if (y + 6 > H - 22) {
    addFooterPage();
    doc.addPage();
    pageNum++;
    addBg();
    y = 20;
  }
  y += 4;
  const twH = lesson.takeaways.length * 7 + 18;
  doc.setFillColor(20, 40, 50);
  doc.setDrawColor(32, 217, 200);
  doc.setLineWidth(0.5);
  doc.roundedRect(12, y, W - 24, twH, 3, 3, "FD");
  y += 9;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(32, 217, 200);
  doc.text("KEY TAKEAWAYS", 18, y);
  y += 7;
  for (const tw of lesson.takeaways) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(180, 220, 215);
    doc.text(`• ${tw}`, 18, y);
    y += 7;
  }

  addFooterPage();
  doc.save(`demonzeno-lesson-${tier.id}-${lessonIndex + 1}.pdf`);
}

// ─── Chart Pattern Renderer ───────────────────────────────────────────────

function ChartPatternDiagram({ patternKey }: { patternKey: string }) {
  const components: Record<string, React.ReactNode> = {
    headAndShoulders: <HeadAndShouldersSVG />,
    doubleTop: <DoubleTopSVG />,
    doubleBottom: <DoubleBottomSVG />,
    ascendingTriangle: <AscendingTriangleSVG />,
    descendingTriangle: <DescendingTriangleSVG />,
    symmetricTriangle: <SymmetricTriangleSVG />,
    bullFlag: <BullFlagSVG />,
    cupHandle: <CupHandleSVG />,
    hammer: <HammerSVG />,
    doji: <DojiSVG />,
    bullishEngulfing: <BullishEngulfingSVG />,
  };
  const diagram = components[patternKey];
  if (!diagram) return null;
  return (
    <div
      className="rounded-xl overflow-hidden my-4"
      style={{ border: "1px solid oklch(0.65 0.15 190 / 0.2)" }}
    >
      <div
        className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
        style={{
          background: "oklch(0.65 0.15 190 / 0.1)",
          color: "oklch(0.65 0.15 190)",
        }}
      >
        Chart Pattern Diagram
      </div>
      <div className="p-3">{diagram}</div>
    </div>
  );
}

// ─── Lesson Enhancement Data (rich content supplement) ─────────────────────────
// Augments all lessons with: whyMatters, realTradeBreakdown, caseStudy, conceptChecker

const LESSON_ENHANCEMENTS: Record<string, Partial<Lesson>> = {
  "What is Trading?": {
    whyMatters:
      "Before you place a single trade, you must understand what you’re doing and why. Trading without knowing market fundamentals is like driving blindfolded — your first crash is guaranteed.",
    realTradeBreakdown:
      "Real trade: In March 2020, BTC dropped from $9,000 to $3,800 in 48 hours. Traders who understood supply/demand dynamics recognized institutional panic selling and waited — those who FOMO-bought at $5,000 were wiped out. Entry: $4,200 after 3-day stabilization. SL: $3,500. TP: $7,000 (hit 3 weeks later). Lesson: wait for confirmation, never catch a falling knife.",
    caseStudy: {
      title: "The March 2020 COVID Crash",
      body: "On March 12–13, 2020 (‘Black Thursday’), Bitcoin fell 52% in under 24 hours as COVID panic gripped global markets. Leveraged traders were liquidated en masse. Those who understood that sell pressure was exogenous (fear, not fundamentals) accumulated between $3,800–$5,000. By December 2020, BTC hit $29,000. Understanding WHY markets move is what separates survival from annihilation.",
    },
    conceptChecker: [
      {
        question: "What drives prices up in a market?",
        options: [
          "More sellers than buyers",
          "More buyers than sellers",
          "Low volatility",
          "High volume only",
        ],
        answer: 1,
      },
      {
        question: "What should you define BEFORE entering any trade?",
        options: [
          "Your profit target only",
          "Entry, Stop Loss, and Take Profit",
          "Only the entry price",
          "Your confidence level",
        ],
        answer: 1,
      },
      {
        question: "Which trading style holds positions for days or weeks?",
        options: [
          "Scalping",
          "Day trading",
          "Swing trading",
          "High-frequency trading",
        ],
        answer: 2,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a financial market?",
        options: [
          "A physical store",
          "A place where assets are bought and sold",
          "A government bank",
          "A social media platform",
        ],
        answer: 1,
      },
      {
        question: "What does TP stand for in trading?",
        options: ["Total Profit", "Trend Point", "Take Profit", "Trade Period"],
        answer: 2,
      },
    ],
  },
  "Reading Candlestick Charts": {
    whyMatters:
      "Candlestick charts are the language of price action. Every professional trader reads them. If you can’t read candles, you are trading blind.",
    realTradeBreakdown:
      "Real trade: In Oct 2021, BTC formed a Doji on the daily chart at $61,500 after 3 consecutive bullish candles. This signaled indecision after a strong run. Entry SHORT: $61,200 on the next red candle confirmation. SL: $63,000. TP: $58,000 (hit in 2 days). Lesson: a single Doji in context = high probability signal.",
    caseStudy: {
      title: "Bitcoin Doji at All-Time High (2021)",
      body: "In November 2021, BTC formed a classic Doji near $69,000 — its all-time high at the time. This single candle, in context of a parabolic run and RSI above 80, gave experienced traders early warning of the reversal that followed. BTC fell to $33,000 within 60 days. Lesson: one well-read candle can be worth thousands of dollars.",
    },
    chartPatternKey: "doji",
    conceptChecker: [
      {
        question: "A green candle means:",
        options: [
          "Price fell during the period",
          "Close was higher than open",
          "Volume was high",
          "There was no movement",
        ],
        answer: 1,
      },
      {
        question: "What does a long lower wick on a candle indicate?",
        options: [
          "Bears controlled the session",
          "Price was rejected at lower levels (bullish)",
          "The asset is oversold",
          "Volume was declining",
        ],
        answer: 1,
      },
      {
        question: "What pattern signals indecision in the market?",
        options: ["Marubozu", "Engulfing", "Doji", "Hammer"],
        answer: 2,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a candlestick?",
        options: [
          "A chart showing only closing prices",
          "A visual showing open, high, low, close",
          "A type of indicator",
          "A volume measurement",
        ],
        answer: 1,
      },
      {
        question: "What does OHLC stand for?",
        options: [
          "Open High Low Close",
          "Order High Limit Cancel",
          "Only High Level Charts",
          "Open Hold Limit Close",
        ],
        answer: 0,
      },
    ],
  },
  "Chart Patterns: Part 1": {
    whyMatters:
      "Chart patterns are recurring formations that predict price direction based on mass market psychology. Master these and you have a proven edge across all assets and timeframes.",
    realTradeBreakdown:
      "Real trade: Bitcoin formed a classic Head & Shoulders on the daily chart in April 2021, with the neckline at $52,000. Entry SHORT on neckline break: $51,800. SL: $55,000. TP: $44,000 (hit within 2 weeks). This single pattern, identified in advance, yielded 6:1 reward-to-risk.",
    caseStudy: {
      title: "BTC Head & Shoulders — April 2021",
      body: "In April–May 2021, Bitcoin formed a textbook Head & Shoulders pattern on the daily chart. Left shoulder at $58K, head at $64K, right shoulder at $58K, neckline at $52K. The neckline broke on May 19, 2021 — the day of the ‘China ban’ crash. BTC fell to $30,000. Traders who identified the pattern SHORT had a 4:1+ trade. Those who ignored it were holding bags.",
    },
    chartPatternKey: "headAndShoulders",
    conceptChecker: [
      {
        question:
          "In a Head & Shoulders pattern, which part is the signal line?",
        options: [
          "The left shoulder",
          "The head",
          "The neckline",
          "The right shoulder",
        ],
        answer: 2,
      },
      {
        question: "A Double Top pattern signals:",
        options: [
          "Bullish continuation",
          "Bearish reversal",
          "Sideways consolidation",
          "Strong uptrend",
        ],
        answer: 1,
      },
      {
        question: "A Double Bottom pattern is considered:",
        options: [
          "Bearish reversal",
          "Bullish reversal",
          "Continuation pattern",
          "Indecision signal",
        ],
        answer: 1,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a chart pattern?",
        options: [
          "A drawing tool",
          "A recurring price formation that has predictive value",
          "An indicator",
          "A random price movement",
        ],
        answer: 1,
      },
      {
        question: "Head & Shoulders is generally:",
        options: [
          "A bullish signal",
          "A bearish reversal signal",
          "A continuation signal",
          "Neutral",
        ],
        answer: 1,
      },
    ],
  },
  "Chart Patterns: Part 2": {
    whyMatters:
      "Continuation patterns like triangles, flags, and pennants show you where price is consolidating before the next explosive move. Trading these breakouts correctly is one of the most reliable strategies in existence.",
    realTradeBreakdown:
      "Real trade: ETH formed a Bull Flag on the 4H chart in October 2021 after rising from $3,200 to $3,900 (the pole). Consolidation between $3,600–$3,800 (the flag). Entry on breakout at $3,820. SL: $3,600. TP: $4,400 (pole length projected up). Hit in 4 days for a 3:1 trade.",
    chartPatternKey: "bullFlag",
    conceptChecker: [
      {
        question: "An ascending triangle has:",
        options: [
          "Rising top, flat bottom",
          "Flat top, rising bottom",
          "Both lines falling",
          "Random converging lines",
        ],
        answer: 1,
      },
      {
        question: "A Bull Flag pattern is:",
        options: [
          "A bearish reversal",
          "A continuation pattern after a strong move up",
          "A reversal after a downtrend",
          "An indecision pattern",
        ],
        answer: 1,
      },
      {
        question: "In a Symmetric Triangle, the breakout direction is:",
        options: [
          "Always upward",
          "Always downward",
          "Determined by the prior trend",
          "Random",
        ],
        answer: 2,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a triangle pattern?",
        options: [
          "Three peaks on a chart",
          "A pattern where price makes converging highs and lows",
          "A type of candle",
          "A volume spike",
        ],
        answer: 1,
      },
      {
        question: "A Bull Flag forms after:",
        options: [
          "A sharp decline",
          "A sharp rally (the pole)",
          "A period of low volume",
          "A Doji candle",
        ],
        answer: 1,
      },
    ],
  },
  "RSI Explained": {
    whyMatters:
      "RSI is the most widely used momentum indicator in the world. Understanding it separates traders who buy at tops from those who buy at bottoms.",
    realTradeBreakdown:
      "Real trade: SOL/USDT daily chart, July 2022. RSI dropped to 18 (deeply oversold) while price was at $30. Historical mean RSI for SOL in uptrend is 50–65. Entry LONG: $31.50. SL: $27. TP: $48 (hit in 3 weeks). Lesson: extreme RSI oversold + key support = high-probability bounce.",
    caseStudy: {
      title: "Ethereum RSI Divergence — 2022 Bottom",
      body: "In June 2022, Ethereum was making lower lows in price ($880 low), but the RSI was making higher lows — classic bullish hidden divergence. Professional traders who spotted this loaded long positions at $900–$950. ETH climbed to $2,000 within 3 months. RSI divergence is one of the most powerful signals in technical analysis.",
    },
    conceptChecker: [
      {
        question: "An RSI reading above 70 indicates:",
        options: [
          "Oversold conditions",
          "Overbought conditions",
          "Strong downtrend",
          "Neutral momentum",
        ],
        answer: 1,
      },
      {
        question: "RSI divergence occurs when:",
        options: [
          "Price and RSI move in the same direction",
          "Price and RSI move in opposite directions",
          "RSI is at 50",
          "Volume is high",
        ],
        answer: 1,
      },
      {
        question: "What RSI level is typically considered oversold?",
        options: ["Above 70", "Above 50", "Below 30", "Below 50"],
        answer: 2,
      },
    ],
    preCheckQuestions: [
      {
        question: "What does RSI stand for?",
        options: [
          "Relative Strength Index",
          "Rate of Signal Increase",
          "Risk/Size Indicator",
          "Relative Speed Index",
        ],
        answer: 0,
      },
      {
        question: "RSI values range from:",
        options: ["-100 to 100", "0 to 100", "0 to 50", "-50 to 50"],
        answer: 1,
      },
    ],
  },
  "MACD Explained": {
    whyMatters:
      "MACD combines trend direction and momentum in a single indicator. A MACD crossover on a strong trend is one of the cleanest entries in trading.",
    realTradeBreakdown:
      "Real trade: BTC/USDT 4H chart, January 2023. MACD line crossed above signal line as price broke $17,500. Histogram turned positive. Entry: $17,600. SL: $16,200. TP: $21,000 (hit in 18 days). The MACD crossover confirmed bullish momentum the price action had already suggested.",
    conceptChecker: [
      {
        question: "A bullish MACD crossover occurs when:",
        options: [
          "MACD line crosses below signal line",
          "MACD line crosses above signal line",
          "Histogram turns negative",
          "Price breaks support",
        ],
        answer: 1,
      },
      {
        question: "The MACD histogram shows:",
        options: [
          "Price direction",
          "The difference between MACD and signal lines",
          "Volume",
          "RSI momentum",
        ],
        answer: 1,
      },
      {
        question: "MACD stands for:",
        options: [
          "Moving Average Convergence Divergence",
          "Market Acceleration And Change Direction",
          "Momentum And Cycle Detection",
          "Moving Average Channel Definition",
        ],
        answer: 0,
      },
    ],
    preCheckQuestions: [
      {
        question: "MACD is based on:",
        options: [
          "Volume data",
          "Moving averages",
          "RSI values",
          "Price range",
        ],
        answer: 1,
      },
      {
        question: "What does the MACD signal line do?",
        options: [
          "Shows price direction",
          "Smooths the MACD line to reduce false signals",
          "Measures volume",
          "Tracks open interest",
        ],
        answer: 1,
      },
    ],
  },
  "Risk Management Basics": {
    whyMatters:
      "Risk management is the single most important skill in trading. Without it, even a 70% win rate can blow your account. With it, even a 40% win rate can be profitable.",
    realTradeBreakdown:
      "Real scenario: Trader A risks 10% per trade. After 5 consecutive losses (possible even with a 60% win rate): account drops 41%. Trader B risks 1% per trade. After 5 consecutive losses: account drops only 4.9%. Trader B survives to fight another day. Trader A is searching for a job.",
    caseStudy: {
      title: "The $1B Loss That Changed Trading",
      body: "In 2012, Knight Capital Group lost $440 million in 45 minutes due to a software glitch and lack of circuit breakers. In 1998, Long-Term Capital Management — run by Nobel Prize-winning economists — lost $4.6 billion and required a Federal Reserve bailout. Both failures came down to one thing: no proper risk management. If Nobel laureates can blow up, so can you. The rules exist for a reason.",
    },
    conceptChecker: [
      {
        question: "The standard maximum risk per trade is:",
        options: ["10–20%", "5–10%", "1–2%", "No limit"],
        answer: 2,
      },
      {
        question: "Why should you always set a Stop Loss?",
        options: [
          "It guarantees profit",
          "It limits maximum loss per trade",
          "It’s required by exchanges",
          "It increases position size",
        ],
        answer: 1,
      },
      {
        question: "What is a 1:3 Risk-to-Reward ratio?",
        options: [
          "Risk $3 to make $1",
          "Risk $1 to make $3",
          "Risk 30% per trade",
          "Win 3 out of every trade",
        ],
        answer: 1,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a Stop Loss?",
        options: [
          "A price target",
          "An automatic exit when a trade moves against you",
          "A type of indicator",
          "A broker fee",
        ],
        answer: 1,
      },
      {
        question: "If you have $1,000 and risk 1% per trade, you risk:",
        options: ["$100", "$10", "$50", "$1"],
        answer: 1,
      },
    ],
  },
  "Multiple Timeframe Analysis": {
    whyMatters:
      "Every professional trader uses multiple timeframes. The daily chart gives you the trend; the 4H gives you the entry setup; the 1H gives you your entry trigger. Ignoring this creates low-probability trades.",
    realTradeBreakdown:
      "Real trade: ETH/USDT, September 2021. Daily: uptrend, above 200 EMA. 4H: pullback to support at $3,100. 1H: bullish engulfing candle at support. Entry: $3,120. SL: $2,980. TP: $3,600. Hit in 6 days. Without multiple timeframe confirmation, you would have entered on the 1H without knowing the 4H was at major support — much lower conviction.",
    conceptChecker: [
      {
        question:
          "Which timeframe should you use to identify the overall trend?",
        options: [
          "1-minute chart",
          "Daily or weekly chart",
          "Tick chart",
          "Monthly only",
        ],
        answer: 1,
      },
      {
        question: "What is the correct order of timeframe analysis?",
        options: [
          "Small to large",
          "Large to small (top-down)",
          "Random — it doesn’t matter",
          "Only one timeframe needed",
        ],
        answer: 1,
      },
      {
        question:
          "Why does multiple timeframe analysis improve trade probability?",
        options: [
          "It creates more signals",
          "It aligns entry with higher timeframe context",
          "It removes the need for indicators",
          "It guarantees profit",
        ],
        answer: 1,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is a timeframe in trading?",
        options: [
          "The broker's fee schedule",
          "The time period each candle represents",
          "The hours a market is open",
          "How long you hold a trade",
        ],
        answer: 1,
      },
      {
        question: "Which timeframe shows the most noise (false signals)?",
        options: ["Daily", "Weekly", "1-minute", "Monthly"],
        answer: 2,
      },
    ],
  },
  "Fibonacci Retracements": {
    whyMatters:
      "Fibonacci levels are self-fulfilling — because institutional traders use them, they work. The 0.618 level is known as the ‘Golden Ratio’ and consistently acts as reversal points.",
    realTradeBreakdown:
      "Real trade: BTC bull run from $29,000 to $69,000 (2021). After ATH, retracement to 0.618 Fib level hit $43,200. Entry LONG: $43,500. SL: $38,000. TP: $55,000. BTC bounced from the exact 0.618 level and rallied to $52,000 before a new leg down. Lesson: institutions buy the golden ratio.",
    conceptChecker: [
      {
        question: "The most important Fibonacci retracement level is:",
        options: ["0.236", "0.382", "0.618 (Golden Ratio)", "0.786"],
        answer: 2,
      },
      {
        question: "Fibonacci retracements are drawn from:",
        options: [
          "Random points",
          "A major swing low to a major swing high (or vice versa)",
          "Indicator crossovers",
          "Volume spikes",
        ],
        answer: 1,
      },
      {
        question: "Why do Fibonacci levels work in markets?",
        options: [
          "Because of mathematics alone",
          "Because enough traders watch them — self-fulfilling",
          "They are required by regulators",
          "They only work in crypto",
        ],
        answer: 1,
      },
    ],
    preCheckQuestions: [
      {
        question: "Fibonacci numbers come from:",
        options: [
          "Random math",
          "Each number is the sum of the two preceding numbers",
          "Stock market data",
          "Central bank formulas",
        ],
        answer: 1,
      },
      {
        question: "What is the Golden Ratio?",
        options: ["1.618 (approximately)", "3.14", "0.5", "2.0"],
        answer: 0,
      },
    ],
  },
  "Wyckoff Method": {
    whyMatters:
      "Richard Wyckoff’s methodology from the 1930s still works today because it maps institutional accumulation and distribution cycles — the same forces drive markets 100 years later.",
    realTradeBreakdown:
      "Real case: Bitcoin 2018–2020. After the 2018 crash to $3,150, BTC entered a classic Wyckoff Accumulation phase: selling climax, automatic rally, secondary test, spring at $3,600, then markup phase starting Q4 2019. Those who identified the Wyckoff spring bought below $4,000 and rode to $67,000 by 2021.",
    caseStudy: {
      title: "Bitcoin 2018 Wyckoff Accumulation",
      body: "Between December 2018 and March 2020, Bitcoin executed a near-perfect Wyckoff Accumulation schematic. The selling climax at $3,150, the spring at $3,600, and a slow sideways phase before the 2020 breakout above $10,000. Jesse Livermore described this same institutional behavior in 1923. Wyckoff codified it in 1930. It still works in crypto in 2024.",
    },
    conceptChecker: [
      {
        question: "In Wyckoff, the ‘spring’ is:",
        options: [
          "A seasonal pattern",
          "A false breakdown below support before a major rally",
          "A resistance breakout",
          "A volume indicator",
        ],
        answer: 1,
      },
      {
        question: "Wyckoff Distribution occurs:",
        options: [
          "At market bottoms",
          "At market tops, when institutions are selling",
          "During sideways markets",
          "After a crash",
        ],
        answer: 1,
      },
      {
        question: "Who is Richard Wyckoff?",
        options: [
          "A 21st-century algorithmic trader",
          "An early 20th-century trader who mapped institutional trading cycles",
          "A cryptocurrency pioneer",
          "The inventor of RSI",
        ],
        answer: 1,
      },
    ],
    preCheckQuestions: [
      {
        question: "What is market accumulation?",
        options: [
          "Price falling rapidly",
          "Institutions quietly buying large positions",
          "A period of high volatility",
          "A news event",
        ],
        answer: 1,
      },
      {
        question: "What is market distribution?",
        options: [
          "Brokers spreading information",
          "Institutions quietly selling large positions to retail buyers",
          "Price consolidation",
          "Dividend payments",
        ],
        answer: 1,
      },
    ],
  },
};

// Default concept checker for lessons without specific data
const DEFAULT_CONCEPT_CHECKER: ConceptQuestion[] = [
  {
    question:
      "Which of the following is the MOST important principle when entering a trade?",
    options: [
      "Following social media tips",
      "Having a clear entry, stop loss, and take profit defined before entry",
      "Using the maximum leverage available",
      "Trading based on gut feeling",
    ],
    answer: 1,
  },
  {
    question: "What is the purpose of a Stop Loss order?",
    options: [
      "To maximize profit",
      "To automatically close a losing trade at a predefined loss level",
      "To enter trades faster",
      "To avoid paying fees",
    ],
    answer: 1,
  },
  {
    question: "Which trader mindset leads to long-term profitability?",
    options: [
      "Revenge trading after a loss",
      "Consistent rule-following regardless of emotion",
      "Doubling down on losing trades",
      "Trading every signal regardless of quality",
    ],
    answer: 1,
  },
];

const DEFAULT_PRE_CHECK: ConceptQuestion[] = [
  {
    question: "How would you rate your current knowledge of this topic?",
    options: [
      "Complete beginner",
      "Heard of it but not sure",
      "Some understanding",
      "I already know this well",
    ],
    answer: 3,
  },
  {
    question: "In trading, what does the acronym SL stand for?",
    options: ["Sell Limit", "Stop Loss", "Signal Level", "Short Long"],
    answer: 1,
  },
];

function getEnhancement(lessonTitle: string): Partial<Lesson> {
  return {
    ...(LESSON_ENHANCEMENTS[lessonTitle] ?? {}),
    ...(LESSON_EXTRAS[lessonTitle] ?? {}),
  };
}

// ─── Extra Lesson Data (myth/reality, trader profiles, spot-the-mistake, DYK) ───

const LESSON_EXTRAS: Record<string, Partial<Lesson>> = {
  "What is Trading?": {
    mythVsReality: [
      {
        myth: "You need a lot of money to start trading.",
        reality:
          "Discipline and risk management matter far more than starting capital. Many elite traders started with under $1,000.",
      },
      {
        myth: "Trading is like gambling.",
        reality:
          "Gambling has fixed negative odds. Trading with a proven edge and risk management gives you a measurable statistical advantage.",
      },
      {
        myth: "You can get rich overnight in trading.",
        reality:
          "Consistent, compounding returns over months and years build real wealth. Overnight windfalls are followed by overnight losses.",
      },
    ],
    traderProfile: {
      name: "Jesse Livermore",
      era: "1900s–1929",
      story:
        "Jesse Livermore started trading at 15 with $5 in bucket shops. He made and lost multiple fortunes — including $100 million shorting the 1929 crash. His story is both a warning and a masterclass in reading the tape and following price.",
      keyLesson:
        "Even the best trader in the world goes broke without position sizing and psychological discipline. Technical genius alone is never enough.",
      quote:
        "The game of speculation is the most uniformly fascinating game in the world. But it is not a game for the stupid, the mentally lazy, the person of inferior emotional balance, or for the get-rich-quick adventurer.",
    },
    spotTheMistake: {
      scenario:
        "Alex has $5,000 and sees BTC pumping 10% on Twitter. He immediately buys $4,000 worth with no stop loss because 'it's still going up.' He plans to sell 'when it feels right.'",
      question: "What is the primary mistake Alex made?",
      mistakes: [
        "He traded BTC instead of a stock",
        "He bought too early in the day",
        "He entered on FOMO with no stop loss and no plan — pure emotional trading",
        "He should have used more leverage",
      ],
      correctIndex: 2,
      explanation:
        "FOMO + no stop loss + no defined exit = guaranteed blow-up. Entry timing is secondary. The fatal mistake is no risk management.",
    },
    dykFacts: [
      "The global Forex market trades over $7.5 trillion per day — more than all stock markets combined.",
      "About 70–80% of retail traders lose money — primarily due to poor risk management, not bad analysis.",
    ],
  },
  "Reading Candlestick Charts": {
    mythVsReality: [
      {
        myth: "Candlestick patterns work on their own without context.",
        reality:
          "A Doji at resistance means something completely different from a Doji in the middle of a range. Context is everything.",
      },
      {
        myth: "Green candles always mean buy.",
        reality:
          "A green candle with high volume at resistance is a warning sign, not a buy signal. Pattern + location + volume = the full picture.",
      },
    ],
    traderProfile: {
      name: "Paul Tudor Jones",
      era: "1980s–Present",
      story:
        "Paul Tudor Jones famously predicted the 1987 Black Monday crash using Elliott Wave analysis and price patterns. He tripled his money while the market crashed 22% in one day. His documentary 'Trader' captures his obsessive discipline.",
      keyLesson:
        "Price action and patterns are real. When you see a 5-wave impulse exhausting itself, the reversal will be brutal. Read the chart, not the news.",
      quote:
        "The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge.",
    },
    spotTheMistake: {
      scenario:
        "Maria sees three consecutive green candles on BTC 1H chart and buys immediately, saying 'the trend is clearly up.' Price reverses within 2 hours.",
      question: "What should Maria have checked before buying?",
      mistakes: [
        "She should have used a 5-minute chart instead",
        "She should have checked RSI divergence, key resistance levels, and volume before entering",
        "She should have waited for a 4th green candle",
        "The trade setup was fine — she was just unlucky",
      ],
      correctIndex: 1,
      explanation:
        "Three candles without volume confirmation and without checking nearby resistance is emotional trading, not pattern trading. Always contextualize candle signals.",
    },
    dykFacts: [
      "Candlestick charting originated in 18th-century Japan, used by rice trader Munehisa Homma who is said to have made a fortune using price patterns.",
    ],
  },
  "Support & Resistance": {
    mythVsReality: [
      {
        myth: "A support level will always hold.",
        reality:
          "Support is a zone of interest, not a wall. When it breaks with conviction, it flips to resistance. Plan both scenarios before entering.",
      },
      {
        myth: "More touches = stronger level.",
        reality:
          "More touches can also mean a level is being weakened, as liquidity at that price is gradually consumed. Read volume at the level.",
      },
    ],
    spotTheMistake: {
      scenario:
        "John identifies a support zone and immediately buys when price touches it for the 4th time. There's no volume spike, no bullish candle pattern, just price touching the level.",
      question: "What mistake is John making?",
      mistakes: [
        "He should have waited for the 5th touch",
        "He bought without a confirmation signal — price touching support is not enough; you need a reaction candle + volume",
        "Support levels don't work in crypto",
        "He should have used a higher timeframe",
      ],
      correctIndex: 1,
      explanation:
        "Price touching support without a bullish confirmation candle or volume surge is a 'maybe.' Wait for rejection evidence before entering. Let price prove itself.",
    },
    dykFacts: [
      "Round numbers (like $50,000 or $1.2000) act as psychological support/resistance because traders and algorithms cluster orders there.",
    ],
  },
  "Risk Management 101": {
    mythVsReality: [
      {
        myth: "High risk = high reward. Go big or go home.",
        reality:
          "Professional traders risk 0.5–2% per trade. Consistency with controlled risk compounds to life-changing returns. High risk means high chance of blowup.",
      },
      {
        myth: "Stop losses just get hit and then price bounces.",
        reality:
          "Stop losses sometimes get swept. That's the market hunting liquidity. The solution is better SL placement — not removing them.",
      },
    ],
    traderProfile: {
      name: "George Soros",
      era: "1970s–2000s",
      story:
        "George Soros made $1 billion in a single day on Black Wednesday 1992 by shorting the British Pound. His Quantum Fund averaged 30%+ annual returns for decades. His edge was macro thesis combined with ruthless risk management — he would exit instantly if proven wrong.",
      keyLesson:
        "It's not whether you're right or wrong that matters, but how much money you make when you're right and how much you lose when you're wrong.",
      quote:
        "It's not whether you're right or wrong, but how much money you make when you're right and how much you lose when you're wrong.",
    },
    spotTheMistake: {
      scenario:
        "David has $10,000 and is 'very sure' about a trade. He risks $2,000 (20% of capital) on a single trade with a 50-pip SL. He's lost 3 trades in a row this week.",
      question: "What is the most dangerous mistake here?",
      mistakes: [
        "He is trading forex when he should trade crypto",
        "He risked 20% of capital on a single trade — catastrophic risk management that can wipe an account in 5 consecutive losses",
        "He shouldn't trade when on a losing streak",
        "His stop loss is too tight at 50 pips",
      ],
      correctIndex: 1,
      explanation:
        "Risking 20% per trade means 5 consecutive losses = total account wipeout. The standard for professionals is 0.5–2% per trade maximum. Period.",
    },
    dykFacts: [
      "A 50% loss requires a 100% gain to recover — which is why capital preservation always outranks profit maximization.",
      "The 1% risk rule: if you lose 10 trades in a row risking 1% each, you still have 90% of your capital. That's survivability.",
    ],
  },
  "Trading Psychology Basics": {
    mythVsReality: [
      {
        myth: "Emotions don't affect professional traders.",
        reality:
          "All traders feel fear and greed. The difference is professionals have rules that override emotions. Systematic traders don't decide in the moment — the system does.",
      },
      {
        myth: "Confidence is the key to trading success.",
        reality:
          "Overconfidence is one of the leading causes of blown accounts. Humility, respect for risk, and process-focus beat 'confidence' every time.",
      },
    ],
    traderProfile: {
      name: "Waqar Zaka",
      era: "2010s–Present",
      story:
        "Waqar Zaka is Pakistan's most prominent crypto advocate, who introduced millions of South Asians to Bitcoin and crypto trading through public advocacy, TV appearances, and social media. He took enormous personal risk betting on Bitcoin when it was deeply controversial in Pakistan, losing big multiple times before finding the conviction to hold and educate.",
      keyLesson:
        "Education is the most valuable asset in crypto. Sharing knowledge changes communities. Your psychological beliefs about money determine your financial destiny.",
      quote: "Don't be afraid of loss. Be afraid of not learning from it.",
    },
    dykFacts: [
      "Studies show traders who journal their emotional state perform significantly better over time than those who only record technical details.",
      "FOMO (Fear of Missing Out) and FUD (Fear, Uncertainty, Doubt) are the two emotions that account for the majority of retail trader losses.",
    ],
  },
  "Chart Patterns: Part 1": {
    mythVsReality: [
      {
        myth: "Chart patterns work 100% of the time.",
        reality:
          "Even the best patterns fail 30–40% of the time. The edge comes from positive risk:reward so wins pay more than losses cost.",
      },
      {
        myth: "You need to learn 50+ patterns.",
        reality:
          "Mastering 5–7 high-probability patterns is more profitable than knowing 50 patterns poorly. Depth over breadth.",
      },
    ],
    spotTheMistake: {
      scenario:
        "Sofia identifies a Head & Shoulders on BTC daily. She shorts immediately when she spots the right shoulder forming, before the neckline breaks. The pattern hasn't confirmed yet.",
      question: "What is the critical error Sofia made?",
      mistakes: [
        "She shorted Bitcoin — a bullish asset",
        "She entered before the neckline break — the pattern isn't confirmed until the neckline is broken with volume",
        "Head & Shoulders is only valid on stocks, not crypto",
        "She should have used a smaller timeframe",
      ],
      correctIndex: 1,
      explanation:
        "Pattern confirmation requires the neckline break with above-average volume. Anticipating the break without confirmation leads to premature entries and unnecessary losses.",
    },
    dykFacts: [
      "The Head & Shoulders pattern has a measured move target: the height from neckline to head, projected downward from the neckline breakout.",
    ],
  },
  "The DemonZeno Signal Method": {
    mythVsReality: [
      {
        myth: "Signal services guarantee profits.",
        reality:
          "No signal service has 100% accuracy. The edge comes from risk management and position sizing — a 60% win rate with 2:1 R:R beats 90% win rate with 0.5:1 R:R.",
      },
      {
        myth: "You should take every signal given.",
        reality:
          "Quality over quantity. Wait for high-confluence setups. One premium trade per week beats 20 mediocre trades.",
      },
    ],
    dykFacts: [
      "Professional signal systems use risk:reward ratios of at least 1:2 minimum. Below that, the system is not viable long-term.",
    ],
  },
  "Case Study: Black Thursday 2020": {
    traderProfile: {
      name: "Paul Tudor Jones",
      era: "1980s–Present",
      story:
        "During COVID's Black Thursday (March 12, 2020), Paul Tudor Jones published a famous memo saying 'The Great Monetary Inflation' was coming and loaded up on Bitcoin. Within 12 months, BTC rose from $4,000 to over $60,000. His macro conviction combined with technical timing is a masterclass.",
      keyLesson:
        "Macro events create the biggest opportunities. When fear is at maximum and fundamentals are intact — or even stronger — that's often the best entry.",
      quote: "Losers average losers.",
    },
    dykFacts: [
      "On March 12, 2020, over $1 billion in BTC positions were liquidated in a single hour — the largest single-day liquidation event in crypto history at that time.",
    ],
  },
  "Case Study: George Soros vs Bank of England": {
    traderProfile: {
      name: "George Soros",
      era: "1992 — Black Wednesday",
      story:
        "On September 16, 1992, George Soros's Quantum Fund shorted £10 billion worth of British Pounds, betting the UK couldn't maintain the ERM peg. When the UK was forced to devalue and exit the ERM, Soros made $1 billion in profit in a single day. This is known as 'the trade of the century.'",
      keyLesson:
        "Macro imbalances always correct. When a government is trying to maintain an artificial price against market forces, the market will eventually win. Find those asymmetric bets.",
      quote: "Go for the jugular. When you see an opportunity, attack it.",
    },
    dykFacts: [
      "The Bank of England spent £3.3 billion trying to defend the Pound before giving up — Soros had $1 billion in profit by the time they conceded.",
    ],
  },
  "Case Study: Jesse Livermore's Greatest Trades": {
    traderProfile: {
      name: "Jesse Livermore",
      era: "1906–1929",
      story:
        "Jesse Livermore shorted the 1906 San Francisco earthquake markets and again shorted the entire stock market in 1929, making $100 million ($1.5 billion in today's money) as the market crashed. He also predicted both market tops by reading price action alone — no indicators.",
      keyLesson:
        "Price action is a reflection of human psychology and institutional flow. If you can read it without ego, you can see the turning points most miss.",
      quote:
        "There is nothing new in Wall Street. There can't be because speculation is as old as the hills.",
    },
    spotTheMistake: {
      scenario:
        "A trader reads about Livermore's 1929 short and decides to short Bitcoin 'because history always repeats.' He enters without any current technical signal, just historical analogy.",
      question: "What is wrong with this approach?",
      mistakes: [
        "Bitcoin and stocks are different assets",
        "Historical analogies without current price action and technical confirmation are not a trading strategy — this is narrative bias, not analysis",
        "Shorting is too risky",
        "The 1929 crash won't repeat in crypto",
      ],
      correctIndex: 1,
      explanation:
        "Livermore succeeded by reading live price action signals, not by applying history mechanically. Use historical context to inform, never to replace, current technical analysis.",
    },
    dykFacts: [
      "Livermore once said the only way to make serious money is to wait for the market to confirm your position before adding size. He called this 'pyramiding into strength.'",
    ],
  },
  "Case Study: Paul Tudor Jones — Black Monday": {
    traderProfile: {
      name: "Paul Tudor Jones",
      era: "October 1987 — Black Monday",
      story:
        "Paul Tudor Jones spent months before Black Monday (October 19, 1987) identifying chart similarities to the 1929 crash. His firm tripled in value on the day the market dropped 22% — one of the single greatest trade days in hedge fund history.",
      keyLesson:
        "Pattern recognition across market history is a real edge. When multiple technical signals align with historical precedent and macro deterioration, the probability of a major move increases dramatically.",
      quote:
        "Every time I find myself in a hot streak or cold streak, it's because I'm either listening to myself or ignoring myself.",
    },
    dykFacts: [
      "Black Monday (October 19, 1987) remains the largest single-day percentage crash in the Dow Jones history at -22.6%.",
    ],
  },
  "Case Study: Waqar Zaka's Crypto Journey": {
    traderProfile: {
      name: "Waqar Zaka",
      era: "2012–Present",
      story:
        "Waqar Zaka began promoting Bitcoin in Pakistan around 2012–2014 when it was trading below $100 and deeply stigmatized in South Asia. He faced public ridicule, government opposition, and massive personal losses during bear markets — yet he held his conviction, continued educating, and emerged as one of the most influential voices in Pakistan's crypto ecosystem. His journey represents the psychological endurance required for long-term crypto investing.",
      keyLesson:
        "Early adoption combined with conviction through multiple bear markets creates the greatest wealth in crypto. Education and patience are worth more than any single trade call.",
      quote: "Don't be afraid of loss. Be afraid of not learning from it.",
    },
    dykFacts: [
      "Pakistan has one of the highest cryptocurrency adoption rates in emerging markets, partially credited to early advocates like Waqar Zaka who educated millions through media.",
    ],
  },
};

const DZ_QUOTES = [
  "The market doesn't care about your feelings. Trade the chart, not the news.",
  "Every loss is tuition. Every win is validation. Keep learning.",
  "Patience is the sharpest weapon in a trader's arsenal.",
  "Risk management isn't optional. It's the only reason traders survive.",
  "The best traders aren't the bravest. They're the most disciplined.",
  "Master the basics. Everything else is noise.",
  "In trading, the one who loses the least wins the most.",
  "Your trading plan is your shield. Never go to battle without it.",
  "The demons of trading are fear and greed. Know them. Control them.",
  "A trader without a journal is a soldier without a map.",
  "The market is always right. Your opinion is irrelevant.",
  "Small consistent gains beat lucky big wins every time.",
  "Protect your capital like it's your life. Because for a trader, it is.",
  "Every pattern tells a story. Learn to read the chart like a book.",
  "The exit matters more than the entry. Know when to leave.",
  "Trading is 80% psychology, 20% strategy. Fix your mind first.",
  "Cut losses fast, let winners run. It's simple. It's hard. Do it anyway.",
  "The trend is your only friend. Everything else is speculation.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcReadingTime(content: string[]): number {
  const words = content.join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function lessonKey(tierId: string, li: number) {
  return `${tierId}_lesson_${li}`;
}

function bookmarkKey(tierId: string, li: number) {
  return `${tierId}_${li}`;
}

const DIFF_COLORS: Record<string, string> = {
  Beginner: "oklch(0.65 0.18 145)",
  Intermediate: "oklch(0.65 0.15 190)",
  Advanced: "oklch(0.62 0.18 260)",
  Expert: "oklch(0.60 0.22 25)",
  Master: "oklch(0.75 0.15 85)",
};

// ─── Lesson Card ──────────────────────────────────────────────────────────────

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  tier: Tier;
  isOpen: boolean;
  isCompleted: boolean;
  isBookmarked: boolean;
  onToggle: () => void;
  onMarkComplete: () => void;
  onToggleBookmark: () => void;
  onDownloadPdf: () => void;
  lessonQuote: string;
}

function LessonCard({
  lesson,
  index,
  tier,
  isOpen,
  isCompleted,
  isBookmarked,
  onToggle,
  onMarkComplete,
  onToggleBookmark,
  onDownloadPdf,
  lessonQuote,
}: LessonCardProps) {
  const readTime = calcReadingTime(lesson.content);
  const diffColor = DIFF_COLORS[tier.difficulty] ?? tier.color;
  const enhancement = getEnhancement(lesson.title);
  const conceptQuestions =
    enhancement.conceptChecker ?? DEFAULT_CONCEPT_CHECKER;
  const preQuestions = enhancement.preCheckQuestions ?? DEFAULT_PRE_CHECK;

  const [conceptPassed, setConceptPassed] = useState(isCompleted);
  const [preCheckDone, setPreCheckDone] = useState(false);
  const {
    getSpacedRepetitionReminder,
    setSpacedRepetitionReminder,
    setConfidenceRating: setGlobalConfidence,
    getConfidenceRating,
    getLessonNote,
    setLessonNote,
    getLessonStarRating,
    setLessonStarRating,
    addToLessonsLearnedLog,
  } = useLessonProgress();

  const lKey = `lesson_${index}`;
  const initialNote = getLessonNote(tier.id, lKey);
  const [personalNote, setPersonalNote] = useState(initialNote);
  const initialStarRating = getLessonStarRating(tier.id, lKey);
  const [starRating, setStarRatingLocal] = useState(initialStarRating);

  function handleStarRate(star: number) {
    setStarRatingLocal(star);
    setLessonStarRating(tier.id, lKey, star);
  }

  function handleAddToLog() {
    const note = personalNote.trim() || `Completed: ${lesson.title}`;
    addToLessonsLearnedLog({
      date: new Date().toLocaleDateString(),
      lessonTitle: lesson.title,
      note,
      tierId: tier.id,
    });
  }

  // Load persisted confidence rating on mount
  const initialConfidence = getConfidenceRating(tier.id, `lesson_${index}`);
  const [confidenceRating, setConfidenceRatingLocal] = useState(
    initialConfidence > 0 ? initialConfidence : 0,
  );

  // Spaced repetition reminder
  const spacedReminder = isCompleted
    ? getSpacedRepetitionReminder(tier.id, `lesson_${index}`)
    : null;
  const needsReview = spacedReminder !== null && spacedReminder < Date.now();

  function handleConceptPass() {
    setConceptPassed(true);
    onMarkComplete();
    setSpacedRepetitionReminder(tier.id, `lesson_${index}`);
  }

  function handleConfidenceRate(rating: number) {
    setConfidenceRatingLocal(rating);
    setGlobalConfidence(tier.id, `lesson_${index}`, rating);
  }

  return (
    <div
      data-ocid={`academy.lesson.${index + 1}`}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "oklch(0.18 0.01 260)",
        border: isOpen
          ? `1px solid ${tier.color}50`
          : isCompleted
            ? `1px solid ${tier.color}30`
            : "1px solid oklch(0.26 0.01 260)",
        boxShadow: isOpen ? `0 0 24px ${tier.color}15` : "none",
      }}
    >
      {/* Spaced repetition reminder */}
      {needsReview && (
        <div
          className="flex items-center gap-2 px-5 py-2 text-xs font-semibold"
          style={{
            background: "oklch(0.65 0.15 70 / 0.12)",
            borderBottom: "1px solid oklch(0.65 0.15 70 / 0.25)",
            color: "oklch(0.75 0.15 70)",
          }}
          data-ocid={`academy.lesson.spaced_reminder.${index + 1}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Spaced repetition reminder — review this lesson to reinforce your
          memory
        </div>
      )}

      {/* Lesson Header */}
      {/* biome-ignore lint/a11y/useSemanticElements: outer div intentionally not a <button> because it contains a nested bookmark <button> — nested buttons are invalid HTML */}
      <div
        role="button"
        tabIndex={0}
        data-ocid={`academy.lesson_toggle.${index + 1}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5 transition-smooth cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: isCompleted
                ? `${tier.color}30`
                : isOpen
                  ? tier.color
                  : `${tier.color}20`,
              color: isOpen ? "oklch(0.10 0.01 260)" : tier.color,
            }}
          >
            {isCompleted ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              String(index + 1).padStart(2, "0")
            )}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground text-base truncate">
              {lesson.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: `${diffColor}18`, color: diffColor }}
              >
                {tier.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
              {confidenceRating > 0 && (
                <span className="text-xs" style={{ color: tier.color }}>
                  {"★".repeat(confidenceRating)}
                  {"☆".repeat(5 - confidenceRating)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Bookmark toggle */}
          <button
            type="button"
            data-ocid={`academy.lesson_bookmark.${index + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-smooth hover:opacity-80"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
          >
            {isBookmarked ? (
              <BookmarkCheck
                className="w-4 h-4"
                style={{ color: tier.color }}
              />
            ) : (
              <BookmarkPlus className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Lesson Content */}
      {isOpen && (
        <div
          className="px-5 pb-5 flex flex-col gap-4 border-t"
          style={{ borderTopColor: `${tier.color}20` }}
        >
          {/* Pre-Lesson Knowledge Check */}
          {!preCheckDone && (
            <LessonPreCheck
              lessonTitle={lesson.title}
              questions={preQuestions}
              tierColor={tier.color}
              onComplete={() => setPreCheckDone(true)}
            />
          )}

          {/* Why This Matters */}
          {enhancement.whyMatters && (
            <div
              className="rounded-xl px-4 py-3 mt-3"
              style={{
                background: `${tier.color}08`,
                border: `1px dashed ${tier.color}30`,
              }}
            >
              <p
                className="font-display font-bold text-xs uppercase tracking-widest mb-1"
                style={{ color: tier.color }}
              >
                🎯 Why This Matters
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancement.whyMatters}
              </p>
            </div>
          )}

          {/* Content Paragraphs */}
          <div className="flex flex-col gap-3 pt-1">
            {lesson.content.map((para) => (
              <p
                key={para.slice(0, 40)}
                className="text-muted-foreground text-sm leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chart Pattern Diagram (if applicable) */}
          {enhancement.chartPatternKey && (
            <ChartPatternDiagram patternKey={enhancement.chartPatternKey} />
          )}

          {/* Real Trade Breakdown */}
          {enhancement.realTradeBreakdown && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.15 0.02 260)",
                border: `1px solid ${tier.color}25`,
              }}
            >
              <p
                className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                style={{ color: tier.color }}
              >
                📈 Real Trade Breakdown
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancement.realTradeBreakdown}
              </p>
            </div>
          )}

          {/* Case Study Callout */}
          {enhancement.caseStudy && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.17 0.02 260)",
                border: `2px solid ${tier.color}30`,
                borderLeft: `4px solid ${tier.color}`,
              }}
            >
              <p
                className="font-display font-bold text-sm mb-2"
                style={{ color: tier.color }}
              >
                📚 Case Study: {enhancement.caseStudy.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {enhancement.caseStudy.body}
              </p>
            </div>
          )}

          {/* Myth vs Reality */}
          {enhancement.mythVsReality &&
            enhancement.mythVsReality.length > 0 && (
              <MythVsRealityCard
                items={enhancement.mythVsReality}
                tierColor={tier.color}
              />
            )}

          {/* Famous Trader Profile */}
          {enhancement.traderProfile && (
            <TraderProfileCard
              profile={enhancement.traderProfile}
              tierColor={tier.color}
            />
          )}

          {/* Did You Know cards */}
          {enhancement.dykFacts?.map((fact) => (
            <DYKCard
              key={fact.slice(0, 40)}
              fact={fact}
              tierColor={tier.color}
            />
          ))}

          {/* DemonZeno's Take */}
          <div
            className="rounded-xl p-4 flex gap-3"
            style={{
              background: `${tier.color}08`,
              border: `1px solid ${tier.color}30`,
            }}
          >
            <span className="text-xl shrink-0">😈</span>
            <div className="min-w-0">
              <p
                className="font-display font-bold text-xs uppercase tracking-widest mb-1.5"
                style={{ color: tier.color }}
              >
                DemonZeno&apos;s Take
              </p>
              <p
                className="text-sm font-semibold italic leading-relaxed"
                style={{ color: "oklch(0.80 0.05 260)" }}
              >
                &ldquo;{lessonQuote}&rdquo;
              </p>
            </div>
          </div>

          {/* Key Takeaways */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.16 0.01 260)",
              border: `1px solid ${tier.color}20`,
            }}
          >
            <p
              className="font-display font-bold text-sm mb-3"
              style={{ color: tier.color }}
            >
              ⚡ Key Takeaways
            </p>
            <ul className="flex flex-col gap-2">
              {lesson.takeaways.map((tw) => (
                <li
                  key={tw.slice(0, 30)}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span
                    className="shrink-0 mt-0.5"
                    style={{ color: tier.color }}
                  >
                    ✓
                  </span>
                  <span>{tw}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.16 0.02 20)",
                border: "1px solid oklch(0.55 0.22 25 / 0.2)",
              }}
            >
              <p
                className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                style={{ color: "oklch(0.65 0.20 25)" }}
              >
                ⚠️ Common Mistakes to Avoid
              </p>
              <ul className="flex flex-col gap-1.5">
                {lesson.commonMistakes.map((m) => (
                  <li
                    key={m.slice(0, 30)}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <span
                      className="shrink-0 mt-0.5"
                      style={{ color: "oklch(0.65 0.20 25)" }}
                    >
                      ✗
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Post-lesson Confidence Rating */}
          <LessonConfidenceRating
            tierId={tier.id}
            lessonId={`lesson_${index}`}
            currentRating={confidenceRating}
            tierColor={tier.color}
            onRate={handleConfidenceRate}
          />

          {/* Concept Checker (must pass to unlock next lesson) */}
          {!conceptPassed && (
            <LessonConceptChecker
              questions={conceptQuestions}
              tierColor={tier.color}
              lessonTitle={lesson.title}
              onPass={handleConceptPass}
            />
          )}
          {conceptPassed && !isCompleted && (
            <div
              className="rounded-xl p-3 flex items-center gap-2 text-xs font-semibold"
              style={{
                background: `${tier.color}12`,
                border: `1px solid ${tier.color}30`,
                color: tier.color,
              }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Concept check passed! Next lesson unlocked.
            </div>
          )}

          {/* Zeno AI Embedded in Lesson */}
          <ZenoAiLesson lessonTitle={lesson.title} tierColor={tier.color} />

          {/* Personal Notes Field */}
          <div
            className="rounded-xl p-4"
            style={{
              background: "oklch(0.16 0.01 260)",
              border: `1px solid ${tier.color}18`,
            }}
            data-ocid={`academy.lesson.notes.${index + 1}`}
          >
            <p
              className="font-display font-bold text-xs uppercase tracking-widest mb-2"
              style={{ color: tier.color }}
            >
              📝 My Notes
            </p>
            <textarea
              value={personalNote}
              onChange={(e) => {
                setPersonalNote(e.target.value);
                setLessonNote(tier.id, lKey, e.target.value);
              }}
              placeholder="Write your personal notes, insights, or key learnings here..."
              rows={3}
              data-ocid={`academy.lesson.notes_input.${index + 1}`}
              className="w-full px-3 py-2 rounded-lg text-xs resize-none focus:outline-none transition-smooth"
              style={{
                background: "oklch(0.20 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
                color: "oklch(0.85 0.01 260)",
              }}
            />
          </div>

          {/* Lesson Star Rating (quality rating) */}
          {isCompleted && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "oklch(0.16 0.01 260)",
                border: `1px solid ${tier.color}18`,
              }}
              data-ocid={`academy.lesson.star_rating.${index + 1}`}
            >
              <p
                className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                style={{ color: tier.color }}
              >
                Rate this lesson
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => handleStarRate(star)}
                    data-ocid={`academy.lesson.star.${index + 1}.${star}`}
                    className="transition-smooth hover:scale-110"
                  >
                    <span
                      className="text-xl"
                      style={{
                        color:
                          star <= starRating
                            ? "oklch(0.75 0.15 85)"
                            : "oklch(0.30 0.01 260)",
                      }}
                    >
                      {star <= starRating ? "★" : "☆"}
                    </span>
                  </button>
                ))}
                {starRating > 0 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {
                      ["Just ok", "Decent", "Good", "Great", "Outstanding!"][
                        starRating - 1
                      ]
                    }
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              data-ocid={`academy.lesson_complete.${index + 1}`}
              onClick={onMarkComplete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-smooth"
              style={
                isCompleted
                  ? {
                      background: `${tier.color}20`,
                      color: tier.color,
                      border: `1px solid ${tier.color}40`,
                    }
                  : {
                      background: tier.color,
                      color: "oklch(0.10 0.01 260)",
                    }
              }
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isCompleted ? "Completed ✓" : "Mark Complete"}
            </button>
            <button
              type="button"
              data-ocid={`academy.lesson_pdf.${index + 1}`}
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-smooth"
              style={{
                background: `${tier.color}12`,
                border: `1px solid ${tier.color}30`,
                color: tier.color,
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              type="button"
              data-ocid={`academy.lesson_log.${index + 1}`}
              onClick={handleAddToLog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-smooth"
              style={{
                background: `${tier.color}08`,
                border: `1px solid ${tier.color}20`,
                color: `${tier.color}`,
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Add to Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bookmarks Panel ──────────────────────────────────────────────────────────

interface BookmarksPanelProps {
  bookmarks: Record<string, boolean>;
  onClose: () => void;
  onNavigate: (tierId: string, lessonIndex: number) => void;
}

function BookmarksPanel({
  bookmarks,
  onClose,
  onNavigate,
}: BookmarksPanelProps) {
  const bookmarkedItems = Object.entries(bookmarks)
    .filter(([, v]) => v)
    .map(([key]) => {
      const [tierId, , liStr] = key.split("_");
      const tier = TIERS.find((t) => t.id === tierId);
      const li = Number.parseInt(liStr ?? "0", 10);
      if (!tier || Number.isNaN(li)) return null;
      const lesson = tier.lessons[li];
      if (!lesson) return null;
      return {
        tierId: tierId ?? "",
        tierName: tier.name,
        lessonIndex: li,
        lesson,
        tier,
      };
    })
    .filter(Boolean);

  return (
    <div
      data-ocid="academy.bookmarks.panel"
      className="fixed inset-0 z-50 flex items-start justify-end p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-w-sm max-h-[80vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{
          background: "oklch(0.14 0.02 260)",
          border: "1px solid oklch(0.30 0.01 260)",
          marginTop: "4rem",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b sticky top-0"
          style={{
            background: "oklch(0.14 0.02 260)",
            borderBottomColor: "oklch(0.26 0.01 260)",
          }}
        >
          <div className="flex items-center gap-2">
            <BookmarkCheck
              className="w-4 h-4"
              style={{ color: "oklch(0.70 0.16 145)" }}
            />
            <h3 className="font-display font-bold text-base text-foreground">
              Bookmarks
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                background: "oklch(0.70 0.16 145 / 0.15)",
                color: "oklch(0.70 0.16 145)",
              }}
            >
              {bookmarkedItems.length}
            </span>
          </div>
          <button
            type="button"
            data-ocid="academy.bookmarks.close_button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
            style={{ background: "oklch(0.22 0.01 260)" }}
            aria-label="Close bookmarks"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {bookmarkedItems.length === 0 ? (
            <div
              data-ocid="academy.bookmarks.empty_state"
              className="text-center py-8"
            >
              <BookmarkPlus
                className="w-8 h-8 mx-auto mb-2"
                style={{ color: "oklch(0.35 0.01 260)" }}
              />
              <p className="text-muted-foreground text-sm">
                No bookmarks yet. Click the bookmark icon on any lesson.
              </p>
            </div>
          ) : (
            bookmarkedItems.map((item) => {
              if (!item) return null;
              return (
                <button
                  key={`${item.tierId}_${item.lessonIndex}`}
                  type="button"
                  data-ocid={`academy.bookmark.item.${item.lessonIndex + 1}`}
                  onClick={() => {
                    onNavigate(item.tierId, item.lessonIndex);
                    onClose();
                  }}
                  className="text-left rounded-xl px-4 py-3 transition-smooth flex flex-col gap-1"
                  style={{
                    background: "oklch(0.20 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: item.tier.color }}
                  >
                    {item.tierName}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {item.lesson.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {calcReadingTime(item.lesson.content)} min read
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── War Room Entries ────────────────────────────────────────────────────────────────────

const WAR_ROOM_ENTRIES: Record<
  string,
  { title: string; insight: string; quote: string }
> = {
  beginner: {
    title: "The Foundation Is Everything",
    insight:
      "You've now covered the entire foundation of trading: candlesticks, support and resistance, risk management, moving averages, RSI, MACD, psychology, and your first trade plan. Most traders skip this foundation and go broke in weeks. You didn't. That patience already separates you from 70% of retail traders. The next tier is where things get real — patterns, confluence, and your first advanced strategies. But none of it works without what you just built.",
    quote: "Master the basics. Everything else is noise.",
  },
  intermediate: {
    title: "You Now See What Others Miss",
    insight:
      "Fibonacci, Bollinger Bands, multi-timeframe analysis, confluence — you've graduated from reaction to anticipation. Most retail traders enter because they 'feel' something. You now enter because multiple independent signals agree. That's edge. The Advanced tier will take this further into institutional thinking — where the real money moves, and why.",
    quote: "Patience is the sharpest weapon in a trader's arsenal.",
  },
  advanced: {
    title: "Thinking Like the Institutions",
    insight:
      "You've studied Elliott Wave, harmonic patterns, smart money concepts, options Greeks, and case studies from history's greatest market events. You understand that markets are moved by large capital seeking liquidity — not retail sentiment. This perspective changes everything. Expert tier will teach you to read the deepest levels of the market: tape reading, dark pools, macro policy, and the trades that made billions.",
    quote: "The market is always right. Your opinion is irrelevant.",
  },
  expert: {
    title: "The Edge Is Inside You",
    insight:
      "You've studied Jesse Livermore, George Soros, Paul Tudor Jones, and Waqar Zaka. You understand microstructure, order flow, macro policy, and the psychology of elite traders. Here's the truth: at this level, the strategy matters less than the psychology. The edge you've built is real. Now it's about executing it day after day without ego, without revenge trading, without FOMO. The Master tier finalizes your system.",
    quote: "The best traders aren't the bravest. They're the most disciplined.",
  },
  master: {
    title: "You Are Now the System",
    insight:
      "You have completed the DemonZeno Trading Academy in its entirety. From absolute zero to fund-level risk management, proprietary systems, statistical edge, and the psychology of elite performers. The certificate you're about to earn isn't just a PDF — it's proof that you did the work. Most people read about trading. You studied it. Now go apply it. The market doesn't care who you are. But your system does. And your system is now elite.",
    quote:
      "Protect your capital like it's your life. Because for a trader, it is.",
  },
};

export function TradingAcademySection() {
  const [activeTier, setActiveTier] = useState(0);
  const [openLesson, setOpenLesson] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [, forceUpdate] = useState(0);
  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    getLessonProgress,
    markLessonComplete: markComplete,
    getLessonBookmarks,
    toggleBookmark: toggleBk,
    getLastLesson,
    setLastLesson,
  } = useLessonProgress();

  const tier = TIERS[activeTier]!;
  const progress = getLessonProgress(tier.id);
  const bookmarks = getLessonBookmarks();
  const isAllComplete = progress.length >= tier.lessons.length;

  // Resume: auto-open last lesson when switching tiers
  useEffect(() => {
    const t = TIERS[activeTier]!;
    const last = getLastLesson(t.id);
    if (last) {
      const idx = t.lessons.findIndex((_, i) => lessonKey(t.id, i) === last);
      if (idx >= 0) {
        setOpenLesson(idx);
        setTimeout(() => {
          lessonRefs.current[idx]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 200);
        return;
      }
    }
    setOpenLesson(null);
  }, [activeTier, getLastLesson]);

  const handleToggleLesson = useCallback(
    (li: number) => {
      setOpenLesson((prev) => {
        const next = prev === li ? null : li;
        if (next !== null) {
          setLastLesson(tier.id, lessonKey(tier.id, li));
        }
        return next;
      });
    },
    [tier.id, setLastLesson],
  );

  const handleMarkComplete = useCallback(
    (li: number) => {
      markComplete(tier.id, lessonKey(tier.id, li));
      forceUpdate((v) => v + 1);
    },
    [tier.id, markComplete],
  );

  const handleToggleBookmark = useCallback(
    (li: number) => {
      toggleBk(tier.id, String(li));
      forceUpdate((v) => v + 1);
    },
    [tier.id, toggleBk],
  );

  const handleNavigateToBookmark = useCallback((tierId: string, li: number) => {
    const tIdx = TIERS.findIndex((t) => t.id === tierId);
    if (tIdx < 0) return;
    setActiveTier(tIdx);
    setTimeout(() => {
      setOpenLesson(li);
      lessonRefs.current[li]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }, []);

  const hasResume = !!getLastLesson(tier.id);
  const progressPct =
    tier.lessons.length > 0
      ? Math.round((progress.length / tier.lessons.length) * 100)
      : 0;
  const bookmarkCount = Object.values(bookmarks).filter(Boolean).length;

  return (
    <section
      id="academy"
      data-ocid="academy.section"
      className="py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0.02 260) 0%, oklch(0.145 0.01 260) 100%)",
      }}
    >
      {/* Decorative glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.15 190 / 0.05)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.22 25 / 0.04)" }}
      />

      {showQuiz && (
        <QuizModal
          tier={tier}
          isPractice={false}
          onClose={() => setShowQuiz(false)}
        />
      )}
      {showPractice && (
        <QuizModal
          tier={tier}
          isPractice={true}
          onClose={() => setShowPractice(false)}
        />
      )}
      {showCheckpoint && (
        <CheckpointQuizModal
          tier={tier}
          onClose={() => setShowCheckpoint(false)}
        />
      )}
      {showBookmarks && (
        <BookmarksPanel
          bookmarks={bookmarks}
          onClose={() => setShowBookmarks(false)}
          onNavigate={handleNavigateToBookmark}
        />
      )}

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Section Header */}
        <ScrollAnimation>
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
              style={{
                background: "oklch(0.65 0.15 190 / 0.1)",
                border: "1px solid oklch(0.65 0.15 190 / 0.3)",
              }}
            >
              <GraduationCap
                className="w-4 h-4"
                style={{ color: "oklch(0.72 0.14 190)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.72 0.14 190)" }}
              >
                Free Trading Academy
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              DemonZeno{" "}
              <span
                className="text-glow"
                style={{ color: "oklch(0.65 0.15 190)" }}
              >
                Trading Academy
              </span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Master the Markets — From Zero to Elite Trader. Free, open,
              step-by-step education across 5 tiers. Complete a tier quiz (30/30
              required) and earn a certificate.
            </p>
          </div>
        </ScrollAnimation>

        {/* Tier Progress + Bookmark row */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Tier {activeTier + 1} of {TIERS.length}
            </span>
            <div className="flex gap-1.5">
              {TIERS.map((t, i) => (
                <div
                  key={t.id}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeTier ? "24px" : "8px",
                    background:
                      i === activeTier ? t.color : "oklch(0.30 0.01 260)",
                  }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            data-ocid="academy.bookmarks.open_modal_button"
            onClick={() => setShowBookmarks(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth"
            style={{
              background: "oklch(0.22 0.01 260)",
              border: "1px solid oklch(0.30 0.01 260)",
              color: "oklch(0.65 0.01 260)",
            }}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Bookmarks
            {bookmarkCount > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "oklch(0.65 0.18 145 / 0.25)",
                  color: "oklch(0.70 0.16 145)",
                }}
              >
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>

        {/* Tier Tabs */}
        <ScrollAnimation>
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-8"
            data-ocid="academy.tier_tabs"
          >
            {TIERS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                data-ocid={`academy.tier_tab.${i + 1}`}
                onClick={() => {
                  setActiveTier(i);
                }}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  background:
                    i === activeTier ? t.color : "oklch(0.20 0.01 260)",
                  color:
                    i === activeTier
                      ? "oklch(0.10 0.01 260)"
                      : "oklch(0.60 0.01 260)",
                  border:
                    i === activeTier
                      ? "none"
                      : "1px solid oklch(0.28 0.01 260)",
                  boxShadow:
                    i === activeTier ? `0 0 16px ${t.glowColor}` : "none",
                }}
              >
                {t.icon}
                <span>{t.name}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background:
                      i === activeTier
                        ? "oklch(0.10 0.01 260 / 0.3)"
                        : `${t.color}20`,
                    color: i === activeTier ? "oklch(0.10 0.01 260)" : t.color,
                  }}
                >
                  {t.badgeLabel}
                </span>
              </button>
            ))}
          </div>
        </ScrollAnimation>

        {/* Tier Header Card */}
        <ScrollAnimation>
          <div
            className="rounded-2xl p-6 mb-4"
            style={{
              background: `linear-gradient(135deg, ${tier.color}12 0%, oklch(0.18 0.01 260) 100%)`,
              border: isAllComplete
                ? `2px solid ${tier.color}60`
                : `1px solid ${tier.color}30`,
              boxShadow: isAllComplete ? `0 0 32px ${tier.glowColor}` : "none",
            }}
          >
            {/* Tier complete celebration banner */}
            {isAllComplete && (
              <div
                className="mb-4 rounded-xl px-4 py-2.5 flex items-center gap-2"
                style={{
                  background: `${tier.color}18`,
                  border: `1px solid ${tier.color}40`,
                }}
              >
                <span className="text-lg">🎉</span>
                <p
                  className="text-sm font-semibold"
                  style={{ color: tier.color }}
                >
                  Tier Complete! Ready to take the quiz and earn your
                  certificate?
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tier.color}20`, color: tier.color }}
                  >
                    {tier.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      {tier.name} Tier
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${tier.color}20`,
                          color: tier.color,
                        }}
                      >
                        {tier.badgeLabel} · {tier.lessons.length} Lessons
                      </span>
                      {hasResume && (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: "oklch(0.65 0.15 190 / 0.15)",
                            color: "oklch(0.65 0.13 190)",
                          }}
                        >
                          📍 Resume
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tier.description}
                </p>

                {/* Progress bar */}
                <div className="mt-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {progress.length}/{tier.lessons.length} lessons completed
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: tier.color }}
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.26 0.01 260)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        background: tier.color,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  data-ocid="academy.export_pdf.button"
                  onClick={() => exportTierPDF(tier)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-smooth"
                  style={{
                    background: `${tier.color}15`,
                    border: `1px solid ${tier.color}40`,
                    color: tier.color,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Study Guide
                </button>
                <button
                  type="button"
                  data-ocid="academy.checkpoint_quiz.button"
                  onClick={() => setShowCheckpoint(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-smooth"
                  style={{
                    background: "oklch(0.22 0.01 260)",
                    border: "1px solid oklch(0.32 0.01 260)",
                    color: "oklch(0.60 0.01 260)",
                  }}
                >
                  <Target className="w-3.5 h-3.5" />
                  Checkpoint
                </button>
                <button
                  type="button"
                  data-ocid="academy.practice_quiz.button"
                  onClick={() => setShowPractice(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-smooth"
                  style={{
                    background: "oklch(0.22 0.01 260)",
                    border: "1px solid oklch(0.32 0.01 260)",
                    color: "oklch(0.65 0.01 260)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Practice
                </button>
                <button
                  type="button"
                  data-ocid="academy.start_quiz.button"
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-smooth"
                  style={{
                    background: tier.color,
                    color: "oklch(0.10 0.01 260)",
                    boxShadow: `0 4px 16px ${tier.glowColor}`,
                  }}
                >
                  <Trophy className="w-4 h-4" />
                  Quiz &amp; Certificate
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Lessons Accordion */}
        <div className="flex flex-col gap-3" data-ocid="academy.lessons.list">
          {tier.lessons.map((lesson, li) => {
            const lKey = lessonKey(tier.id, li);
            const bKey = bookmarkKey(tier.id, li);
            const isComplete = progress.includes(lKey);
            const isBk = !!bookmarks[bKey];
            const quote = DZ_QUOTES[li % DZ_QUOTES.length] ?? DZ_QUOTES[0]!;
            return (
              <ScrollAnimation key={`${tier.id}-${li}`} delay={li * 40}>
                <div
                  ref={(el) => {
                    lessonRefs.current[li] = el;
                  }}
                >
                  <LessonCard
                    lesson={lesson}
                    index={li}
                    tier={tier}
                    isOpen={openLesson === li}
                    isCompleted={isComplete}
                    isBookmarked={isBk}
                    onToggle={() => handleToggleLesson(li)}
                    onMarkComplete={() => handleMarkComplete(li)}
                    onToggleBookmark={() => handleToggleBookmark(li)}
                    onDownloadPdf={() => exportLessonPDF(lesson, tier, li)}
                    lessonQuote={quote}
                  />
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        {/* DemonZeno's War Room */}
        <ScrollAnimation delay={100}>
          <WarRoomSection
            tierName={tier.name}
            tierColor={tier.color}
            entry={WAR_ROOM_ENTRIES[tier.id] ?? WAR_ROOM_ENTRIES.beginner!}
          />
        </ScrollAnimation>

        {/* Trading Glossary */}
        <GlossarySection />

        {/* Bottom CTA */}
        <ScrollAnimation delay={200}>
          <div
            className="mt-10 rounded-2xl p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${tier.color}10 0%, oklch(0.16 0.02 260) 100%)`,
              border: `1px solid ${tier.color}25`,
            }}
          >
            <p className="font-display font-bold text-foreground text-lg mb-1">
              Completed all {tier.lessons.length} {tier.name} lessons?
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              Take the {tier.name} quiz — score a perfect 30/30 to earn your
              official DemonZeno certificate. Or warm up in Practice Mode first.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                data-ocid="academy.bottom_practice.button"
                onClick={() => setShowPractice(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-smooth"
                style={{
                  background: "oklch(0.22 0.01 260)",
                  border: "1px solid oklch(0.32 0.01 260)",
                  color: "oklch(0.65 0.01 260)",
                }}
              >
                <BookOpen className="w-4 h-4" />
                Practice Mode
              </button>
              <button
                type="button"
                data-ocid="academy.bottom_quiz_cta.button"
                onClick={() => setShowQuiz(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-smooth"
                style={{
                  background: tier.color,
                  color: "oklch(0.10 0.01 260)",
                  boxShadow: `0 4px 20px ${tier.glowColor}`,
                }}
              >
                <Trophy className="w-4 h-4" />
                Start {tier.name} Quiz &amp; Earn Certificate
              </button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
