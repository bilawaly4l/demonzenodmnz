import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
}

// ─── Glossary Data ────────────────────────────────────────────────────────────

const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Bull Market",
    definition:
      "A market condition where prices are rising or expected to rise over time. Characterized by optimism and investor confidence.",
    category: "Market Basics",
  },
  {
    term: "Bear Market",
    definition:
      "A market condition where prices are falling or expected to fall, typically 20%+ from recent highs. Characterized by pessimism and fear.",
    category: "Market Basics",
  },
  {
    term: "Candlestick",
    definition:
      "A chart element showing Open, High, Low, and Close prices for a time period. Green = close > open (bullish). Red = close < open (bearish).",
    category: "Chart Reading",
  },
  {
    term: "Support",
    definition:
      "A price level where buying pressure has historically stopped price from falling further. Acts as a floor. When broken, often becomes resistance.",
    category: "Technical Analysis",
  },
  {
    term: "Resistance",
    definition:
      "A price level where selling pressure has historically stopped price from rising further. Acts as a ceiling. When broken, often becomes support.",
    category: "Technical Analysis",
  },
  {
    term: "Trend Line",
    definition:
      "A straight line connecting a series of higher lows (uptrend) or lower highs (downtrend). Valid with 2+ touch points; more touches = more significant.",
    category: "Technical Analysis",
  },
  {
    term: "RSI",
    definition:
      "Relative Strength Index. Momentum indicator on a 0–100 scale. Above 70 = overbought. Below 30 = oversold. RSI divergence = powerful reversal signal.",
    category: "Indicators",
  },
  {
    term: "MACD",
    definition:
      "Moving Average Convergence Divergence. Two lines + histogram. Bullish crossover = MACD line crosses above signal line. Used to confirm trend direction.",
    category: "Indicators",
  },
  {
    term: "Bollinger Bands",
    definition:
      "Three lines: 20-period MA in the middle, upper and lower bands 2 standard deviations away. Band squeeze = big move coming. Price at bands = dynamic S&R.",
    category: "Indicators",
  },
  {
    term: "EMA",
    definition:
      "Exponential Moving Average. Gives more weight to recent prices than SMA. Common periods: 20 EMA (short-term), 50 EMA (medium-term), 200 EMA (long-term).",
    category: "Indicators",
  },
  {
    term: "SMA",
    definition:
      "Simple Moving Average. Average of closing prices over N periods. All periods weighted equally. Smoother than EMA but slower to react to price changes.",
    category: "Indicators",
  },
  {
    term: "Volume",
    definition:
      "The number of units traded during a specific period. High volume confirms a price move. Low volume = weak move. Always check volume on breakouts.",
    category: "Market Analysis",
  },
  {
    term: "Fibonacci",
    definition:
      "Retracement levels based on the Fibonacci sequence. Key levels: 0.236, 0.382, 0.5, 0.618 (golden ratio), 0.786. Price often retraces to these before continuing.",
    category: "Technical Analysis",
  },
  {
    term: "Risk/Reward",
    definition:
      "The ratio of potential profit to potential loss. A 1:2 R:R means you risk $1 to make $2. Always aim for minimum 1:2. A 50% win rate with 1:2 R:R is profitable.",
    category: "Risk Management",
  },
  {
    term: "Stop Loss",
    definition:
      "A preset price level where your trade automatically closes to limit losses. The level that disproves your trade thesis. NEVER skip it. Only move it to reduce risk.",
    category: "Risk Management",
  },
  {
    term: "Take Profit",
    definition:
      "A preset price level at which your trade closes to lock in gains. DemonZeno signals include TP1, TP2, and TP3 for progressive profit-taking.",
    category: "Risk Management",
  },
  {
    term: "Position Sizing",
    definition:
      "Calculating how large your trade should be based on account size and risk%. Formula: Position Size = (Account × Risk%) ÷ (Entry − SL). The most important skill.",
    category: "Risk Management",
  },
  {
    term: "Leverage",
    definition:
      "Borrowing capital to amplify position size. 10x leverage means a 1% move = 10% gain or loss. Beginners should use zero leverage for the first 3 months.",
    category: "Risk Management",
  },
  {
    term: "Liquidation",
    definition:
      "When a leveraged position is forcibly closed by the exchange because losses have consumed your margin. Avoided through lower leverage and proper stop losses.",
    category: "Risk Management",
  },
  {
    term: "Scalping",
    definition:
      "An extremely short-term trading style. Positions held for seconds to minutes. High frequency, small profit per trade. Uses 1–15 min charts. High stress.",
    category: "Trading Styles",
  },
  {
    term: "Swing Trading",
    definition:
      "Holding positions for days to weeks to capture larger price swings. Uses 1D–1W charts. Requires checking charts 1–2 times per day. Best for full-time workers.",
    category: "Trading Styles",
  },
  {
    term: "DCA",
    definition:
      "Dollar Cost Averaging. Buying a fixed dollar amount of an asset at regular intervals regardless of price. Reduces the impact of volatility over time.",
    category: "Trading Styles",
  },
  {
    term: "Long Position",
    definition:
      "Buying an asset with the expectation that its price will rise. Profit is made when price goes up from your entry. The most common trade direction.",
    category: "Trade Types",
  },
  {
    term: "Short Position",
    definition:
      "Selling an asset you don't own with the expectation the price will fall, then buying it back cheaper. Profit is made when price goes down from your entry.",
    category: "Trade Types",
  },
  {
    term: "Margin",
    definition:
      "Collateral deposited with the exchange to open a leveraged position. If losses approach your margin, the exchange will liquidate your position.",
    category: "Trade Types",
  },
  {
    term: "Spread",
    definition:
      "The difference between the buy (ask) price and the sell (bid) price. Wide spread = low liquidity. Use limit orders to avoid paying the spread on entry.",
    category: "Market Basics",
  },
  {
    term: "Pip",
    definition:
      "The smallest price movement in forex. For most currency pairs, a pip is 0.0001 (the 4th decimal place). Represents the minimum price change.",
    category: "Forex",
  },
  {
    term: "Lot",
    definition:
      "Standard unit of measurement for forex trading. Standard lot = 100,000 units. Mini lot = 10,000. Micro lot = 1,000. Determines position size in forex.",
    category: "Forex",
  },
  {
    term: "Market Order",
    definition:
      "An order to buy or sell immediately at the best available current price. Fills instantly but may suffer slippage. Pays the taker fee on exchanges.",
    category: "Order Types",
  },
  {
    term: "Limit Order",
    definition:
      "An order to buy or sell at a specific price or better. Doesn't fill immediately. Pays the maker fee (cheaper). Ideal for precise entry execution.",
    category: "Order Types",
  },
  {
    term: "Stop Order",
    definition:
      "An order that becomes a market order when price reaches a specified level. Used for stop losses. Beware slippage during high volatility periods.",
    category: "Order Types",
  },
  {
    term: "Volatility",
    definition:
      "How much an asset's price fluctuates over time. High volatility = bigger potential profits AND losses. Crypto has the highest volatility of major markets.",
    category: "Market Basics",
  },
  {
    term: "Liquidity",
    definition:
      "How easily an asset can be bought or sold without significantly affecting its price. High liquidity = tight spreads, easy execution. Low liquidity = wild swings.",
    category: "Market Basics",
  },
  {
    term: "Order Book",
    definition:
      "A real-time list of all pending buy (bid) and sell (ask) orders at various price levels. Large 'walls' of orders = significant support or resistance.",
    category: "Market Analysis",
  },
  {
    term: "Head & Shoulders",
    definition:
      "A bearish reversal pattern. Three peaks: left shoulder, higher head, right shoulder. Break below the neckline = confirmed bearish reversal. Very reliable.",
    category: "Chart Patterns",
  },
  {
    term: "Double Top",
    definition:
      "Price hits the same resistance level twice, fails both times, then breaks below support. A strong bearish reversal signal. Confirmed on support break.",
    category: "Chart Patterns",
  },
  {
    term: "Double Bottom",
    definition:
      "Price hits the same support level twice, bounces both times, then breaks above resistance. A strong bullish reversal signal. Confirmed on resistance break.",
    category: "Chart Patterns",
  },
  {
    term: "Divergence",
    definition:
      "When price and an indicator (RSI, MACD) move in opposite directions. Bullish divergence: price lower low + RSI higher low. Powerful reversal signal.",
    category: "Technical Analysis",
  },
  {
    term: "Overbought",
    definition:
      "When an asset's price has risen rapidly to a level that may be unsustainable. RSI > 70 indicates overbought conditions — potential reversal downward.",
    category: "Technical Analysis",
  },
  {
    term: "Oversold",
    definition:
      "When an asset's price has fallen rapidly to a potentially unsustainable level. RSI < 30 indicates oversold conditions — potential reversal upward.",
    category: "Technical Analysis",
  },
  {
    term: "Moving Average",
    definition:
      "A continuously calculated average of price over N periods. Smooths price data to identify trend direction. SMA = simple. EMA = weighted towards recent price.",
    category: "Indicators",
  },
  {
    term: "ATR",
    definition:
      "Average True Range. Measures market volatility by calculating the average range between high and low over N periods. Used to size stop losses appropriately.",
    category: "Indicators",
  },
  {
    term: "Ichimoku",
    definition:
      "A comprehensive indicator showing trend, momentum, and support/resistance in one view. Uses five lines: Tenkan-sen, Kijun-sen, Chikou Span, Senkou Span A & B.",
    category: "Indicators",
  },
  {
    term: "Price Action",
    definition:
      "Trading methodology based purely on reading raw candlestick data without indicators. Studies buyer/seller battles through candle shapes, wicks, and patterns.",
    category: "Technical Analysis",
  },
  {
    term: "Breakout",
    definition:
      "When price moves decisively above a resistance level or below a support level. High-volume breakouts are more reliable. Low-volume breakouts often fail.",
    category: "Technical Analysis",
  },
  {
    term: "Retest",
    definition:
      "When price returns to a previously broken level to 'test' whether it holds as new support/resistance. A successful retest confirms the breakout was genuine.",
    category: "Technical Analysis",
  },
  {
    term: "False Breakout",
    definition:
      "A breakout that appears genuine but quickly reverses back inside the range. Often caused by liquidity hunts. Wait for a candle close outside the level to confirm.",
    category: "Technical Analysis",
  },
  {
    term: "Consolidation",
    definition:
      "Price moving sideways within a narrow range after a significant move. Shows market indecision before the next directional move. Often precedes breakouts.",
    category: "Market Phases",
  },
  {
    term: "Accumulation",
    definition:
      "A phase where smart money quietly buys an asset at low prices while retail sentiment is still bearish. Price appears flat but a markup phase is building.",
    category: "Market Phases",
  },
  {
    term: "Distribution",
    definition:
      "A phase where smart money sells into retail buying near the top. Price may still appear strong but volume tells a different story. Precedes the markdown phase.",
    category: "Market Phases",
  },
  {
    term: "Pump",
    definition:
      "A rapid, significant price increase, often driven by buying pressure, news, or coordinated activity. Common in low-cap crypto. Pumps are often followed by dumps.",
    category: "Crypto",
  },
  {
    term: "Dump",
    definition:
      "A rapid, significant price decrease following a pump or negative news. Often triggered by large holders selling. Be cautious entering during a pump.",
    category: "Crypto",
  },
  {
    term: "FOMO",
    definition:
      "Fear Of Missing Out. The emotional state of entering a trade because price has already moved significantly. One of the most costly psychological traps in trading.",
    category: "Psychology",
  },
  {
    term: "FUD",
    definition:
      "Fear, Uncertainty, and Doubt. Negative sentiment (often spread intentionally) about an asset. Can cause price drops despite no fundamental change. Creates buying opportunities.",
    category: "Psychology",
  },
  {
    term: "Whale",
    definition:
      "A large holder of an asset capable of moving market prices through their trading activity. Whale movements can cause significant price swings, especially in crypto.",
    category: "Market Participants",
  },
  {
    term: "Altcoin",
    definition:
      "Any cryptocurrency other than Bitcoin. Alt = alternative. Most altcoins are highly correlated with Bitcoin's price. During 'altcoin season,' they outperform BTC.",
    category: "Crypto",
  },
  {
    term: "DeFi",
    definition:
      "Decentralized Finance. Financial services (lending, borrowing, trading) built on blockchain without traditional intermediaries. Enables permissionless access to finance.",
    category: "Crypto",
  },
  {
    term: "Tokenomics",
    definition:
      "The economic model of a cryptocurrency. Covers supply, distribution, vesting schedules, utility, and value accrual mechanisms. Critical for fundamental analysis.",
    category: "Crypto",
  },
  {
    term: "Market Cap",
    definition:
      "Market Capitalization = Price × Circulating Supply. Represents total market value of an asset. Large-cap = stable. Small-cap = high risk/reward. Price alone means nothing.",
    category: "Market Basics",
  },
];

const CATEGORIES = Array.from(new Set(GLOSSARY.map((g) => g.category))).sort();

// ─── Component ────────────────────────────────────────────────────────────────

export function GlossarySection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GLOSSARY.filter((g) => {
      const matchesSearch =
        !q ||
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || g.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <section
      id="glossary"
      data-ocid="glossary.section"
      className="py-16 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.145 0.01 260) 0%, oklch(0.12 0.02 260) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.18 145 / 0.03)" }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: "oklch(0.65 0.18 145 / 0.1)",
              border: "1px solid oklch(0.65 0.18 145 / 0.3)",
            }}
          >
            <BookOpen
              className="w-4 h-4"
              style={{ color: "oklch(0.70 0.16 145)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.70 0.16 145)" }}
            >
              Trading Glossary
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Trading{" "}
            <span style={{ color: "oklch(0.70 0.16 145)" }}>Dictionary</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
            Every term you need to master the markets. Search any concept,
            filter by category. Referenced throughout the Academy.
          </p>
        </div>

        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              data-ocid="glossary.search_input"
              placeholder="Search terms or definitions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 transition-smooth"
              style={{
                background: "oklch(0.20 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
              }}
            />
          </div>
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 shrink-0">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                data-ocid={`glossary.category.${cat.toLowerCase().replace(/\s+/g, "_")}`}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth"
                style={
                  activeCategory === cat
                    ? {
                        background: "oklch(0.70 0.16 145)",
                        color: "oklch(0.10 0.01 260)",
                      }
                    : {
                        background: "oklch(0.22 0.01 260)",
                        border: "1px solid oklch(0.30 0.01 260)",
                        color: "oklch(0.60 0.01 260)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground mb-4">
          Showing{" "}
          <span
            className="font-semibold"
            style={{ color: "oklch(0.70 0.16 145)" }}
          >
            {filtered.length}
          </span>{" "}
          of {GLOSSARY.length} terms
        </p>

        {/* Terms Grid */}
        {filtered.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            data-ocid="glossary.terms_list"
          >
            {filtered.map((g, i) => (
              <div
                key={g.term}
                data-ocid={`glossary.term.${i + 1}`}
                className="rounded-xl p-4 flex flex-col gap-2 transition-smooth"
                style={{
                  background: "oklch(0.18 0.01 260)",
                  border: "1px solid oklch(0.26 0.01 260)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="font-display font-bold text-sm"
                    style={{ color: "oklch(0.70 0.16 145)" }}
                  >
                    {g.term}
                  </p>
                  <span
                    className="shrink-0 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.24 0.01 260)",
                      color: "oklch(0.55 0.01 260)",
                    }}
                  >
                    {g.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {g.definition}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 rounded-xl"
            data-ocid="glossary.empty_state"
            style={{
              background: "oklch(0.18 0.01 260)",
              border: "1px solid oklch(0.26 0.01 260)",
            }}
          >
            <BookOpen
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "oklch(0.40 0.01 260)" }}
            />
            <p className="text-muted-foreground text-sm">
              No terms found for &quot;{search}&quot;
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-3 text-xs font-semibold transition-smooth"
              style={{ color: "oklch(0.70 0.16 145)" }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* DZ Quote */}
        <div
          className="mt-8 rounded-xl p-5 text-center"
          style={{
            background: "oklch(0.65 0.18 145 / 0.06)",
            border: "1px solid oklch(0.65 0.18 145 / 0.20)",
          }}
        >
          <p
            className="font-display font-bold text-base italic"
            style={{ color: "oklch(0.70 0.16 145)" }}
          >
            &ldquo;Master the basics before the advanced moves master
            you.&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-1">— DemonZeno</p>
        </div>
      </div>
    </section>
  );
}
