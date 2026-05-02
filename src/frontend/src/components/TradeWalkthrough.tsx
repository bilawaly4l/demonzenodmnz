// ─── Trade Like a Pro — Multi-Step Trade Walkthroughs ──────────────────────

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface TradeStep {
  number: number;
  title: string;
  description: string;
}

interface TradeLevels {
  entry: string;
  stopLoss: string;
  takeProfit: string;
  rrRatio: string;
}

interface TradeWalkthroughData {
  tier: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master";
  tierColor: string;
  tierBg: string;
  emoji: string;
  title: string;
  subtitle: string;
  setup: string;
  levels: TradeLevels;
  steps: TradeStep[];
  result: string;
  demonzenoSays: string;
}

// ─── Walkthrough Data ────────────────────────────────────────────────────────
const WALKTHROUGHS: TradeWalkthroughData[] = [
  {
    tier: "Beginner",
    tierColor: "#22c55e",
    tierBg: "oklch(0.14 0.04 145)",
    emoji: "₿",
    title: "Bitcoin Support Bounce",
    subtitle:
      "The simplest trade that actually works — reading price at structure",
    setup:
      "Bitcoin consolidates for two weeks at the $40,000 level. Every dip to $40K has been bought. RSI on the daily chart is at 28 — deep oversold. The chart is showing a classic bullish setup at confirmed support.",
    levels: {
      entry: "$40,500",
      stopLoss: "$39,000",
      takeProfit: "$44,000",
      rrRatio: "2.3:1",
    },
    steps: [
      {
        number: 1,
        title: "Identify the structure",
        description:
          "Mark the $40,000 support level. It has held twice in the past two weeks. Volume on the bounces was high — buyers are defending this level. This is not a coincidence; it is a battle line.",
      },
      {
        number: 2,
        title: "Wait for the confirmation candle",
        description:
          "Do NOT buy just because price is at support. Wait for a bullish engulfing candle — a candle that fully engulfs the previous red candle and closes near its high. This is confirmation that buyers won the battle for that level.",
      },
      {
        number: 3,
        title: "Enter at candle close",
        description:
          "Entry price: $40,500 — the close of the confirmation candle. You are now entering AFTER confirmation, not before. This costs a little upside but dramatically reduces the chance of a false breakout.",
      },
      {
        number: 4,
        title: "Set your stop-loss",
        description:
          "Stop-loss: $39,000 — placed below the support zone with a 250-point buffer. If price breaks below $39,000, the support has failed and the thesis is wrong. Exit with a small, controlled loss.",
      },
      {
        number: 5,
        title: "Calculate position size from risk",
        description:
          "Example: $1,000 account, risking 1% = $10 maximum loss. Risk per unit = $40,500 - $39,000 = $1,500. Position size = $10 ÷ $1,500 = 0.0067 BTC. This keeps one bad trade from hurting your account.",
      },
      {
        number: 6,
        title: "Set take-profit and manage the trade",
        description:
          "Take-profit: $44,000 — the next major resistance level. Once entered, do not move your stop-loss wider. If the trade goes your way, you can trail the stop up to protect profits.",
      },
    ],
    result:
      "Over the next 9 days, Bitcoin rallied from $40,500 to $44,100. The take-profit was hit. The $10 risk on a $1,000 account returned $23 — a 2.3% gain with only 1% at risk. Compounded over 12 months, this math builds life-changing accounts.",
    demonzenoSays:
      "Your first job is to survive. Your second job is to profit. A trader who never blows up an account eventually becomes rich — and that starts with the 1% rule on day one.",
  },
  {
    tier: "Intermediate",
    tierColor: "#3b82f6",
    tierBg: "oklch(0.14 0.04 240)",
    emoji: "Ξ",
    title: "RSI Divergence on ETH",
    subtitle: "Reading hidden momentum shifts before the crowd notices",
    setup:
      "Ethereum has dropped from $2,400 to $1,750, making a new price low. But on the RSI indicator (4H chart), the new low is NOT lower than the previous low — the RSI made a higher low. This is called bullish divergence: price says lower, momentum says higher. The crowd is bearish. The tape is not.",
    levels: {
      entry: "$1,780",
      stopLoss: "$1,640",
      takeProfit: "$2,020 (50%), $2,200 (50%)",
      rrRatio: "1.7:1 first target, 2.9:1 final",
    },
    steps: [
      {
        number: 1,
        title: "Identify the divergence",
        description:
          "On the 4H ETH/USD chart, draw a line connecting the two recent price lows. Then draw a line connecting the corresponding RSI lows. Price: lower low. RSI: higher low. That mismatch is the signal — momentum is secretly turning.",
      },
      {
        number: 2,
        title: "Wait for MACD confirmation",
        description:
          "Divergence alone is not an entry trigger. Wait for the MACD (12/26/9) to show a bullish crossover — the MACD line crossing above the signal line from below. Now you have two independent indicators agreeing: momentum divergence + MACD cross.",
      },
      {
        number: 3,
        title: "Enter long on the crossover candle close",
        description:
          "Entry at $1,780 on the 4H candle close following the MACD crossover. Stop-loss placed below the recent swing low at $1,640 — if price breaks there, the divergence thesis failed.",
      },
      {
        number: 4,
        title: "Scale out at 1:1 — take 50% off the table",
        description:
          "When price reaches $1,920 (1:1 R:R), sell half the position. This locks in profit on half the trade and mentally frees you from fear. Move your stop-loss to breakeven ($1,780) — you can now only win or break even, never lose.",
      },
      {
        number: 5,
        title: "Trail the remaining 50% to 2:1+",
        description:
          "Let the remaining position run. Trail the stop-loss under each new higher swing low as ETH climbs. Target: $2,200. When price consolidates, tighten the trail. Exit the remaining 50% at $2,020 to $2,200 depending on price action.",
      },
    ],
    result:
      "ETH ran from $1,780 to $2,280 over 18 days. 50% was closed at $1,920 (+7.9%). The remaining 50% was trailed out at $2,150 (+20.8%). Combined trade returned 14.3% of risked capital. More importantly — this taught the skill of managing a trade, not just entering it.",
    demonzenoSays:
      "Most traders know how to enter. Almost no traders know how to exit. Scaling out at 1:1 and trailing the rest is the single habit that separates breakeven traders from profitable ones.",
  },
  {
    tier: "Advanced",
    tierColor: "#a855f7",
    tierBg: "oklch(0.15 0.05 310)",
    emoji: "📉",
    title: "Double Top Breakdown Short",
    subtitle: "Shorting exhaustion — when the market runs out of buyers",
    setup:
      "The S&P 500 ETF (SPY) makes a high at $475 in January. It pulls back to $458. It rallies again in February, reaching $474.80 — almost exactly the same level. Two equal highs. Volume on the second high is noticeably lower. The market tried and failed to make a new high twice. This is a double top — and the neckline at $458 is the critical level.",
    levels: {
      entry: "$457.50 (break-retest of neckline)",
      stopLoss: "$476 (above both highs)",
      takeProfit: "$440",
      rrRatio: "3.1:1",
    },
    steps: [
      {
        number: 1,
        title: "Identify and measure the pattern",
        description:
          "Mark both tops ($475, $474.80) and the neckline ($458). Measure the pattern height: $475 - $458 = $17. The textbook target is the neckline minus the pattern height: $458 - $17 = $441. This gives you an objective, measured target.",
      },
      {
        number: 2,
        title: "Wait for the neckline break — do NOT short early",
        description:
          "A double top is not confirmed until the neckline breaks. Shorting at the second top is gambling. Wait for a daily close below $458 on above-average volume. The break is the confirmation.",
      },
      {
        number: 3,
        title: "Enter on the retest of the broken neckline",
        description:
          "After a neckline break, price often retests the broken level from below — former support becomes resistance. Wait for that retest. Enter short at $457.50 when price comes back up to $458 and stalls. This is a precision entry with tight risk.",
      },
      {
        number: 4,
        title: "Set stop-loss above both tops",
        description:
          "Stop-loss at $476 — above both pattern highs. If price recovers above both tops, the double top is invalidated and the thesis is wrong. This is a wide stop by design; the measured target compensates with a 3:1+ reward.",
      },
      {
        number: 5,
        title: "Target the measured move",
        description:
          "First partial target: $450 (take 40% off, move stop to entry). Final target: $441. Do not move your stop wider if the trade moves against you — this is where traders destroy themselves by 'giving it more room.'",
      },
    ],
    result:
      "SPY broke the neckline on heavy volume, retested $458.20, and reversed. Entered short at $457.50. SPY fell to $441 over 11 days. The 3.1:1 R:R trade rewarded patience and discipline. The stop at $476 was never touched.",
    demonzenoSays:
      "Short selling is not evil — it is precision medicine. The market needs sellers at the right time. Identifying double tops and waiting for the break is one of the cleanest, highest-probability setups in all of technical analysis.",
  },
  {
    tier: "Expert",
    tierColor: "#a855f7",
    tierBg: "oklch(0.15 0.06 310)",
    emoji: "🌍",
    title: "Paul Tudor Jones-Style Macro Play",
    subtitle: "Trading correlations across markets like a global chess master",
    setup:
      "The US Federal Reserve signals aggressive rate hikes in Q1 2022. The dollar index (DXY) begins strengthening. Gold, which is priced in USD and earns no yield, historically underperforms when real rates rise. Meanwhile, USD/JPY typically rises during US rate hike cycles because Japan keeps rates near zero. Two correlated trades emerge from one macro thesis.",
    levels: {
      entry: "Gold short: $1,920 | USD/JPY long: 115.50",
      stopLoss: "Gold: $1,960 | USD/JPY: 113.00",
      takeProfit: "Gold: $1,800 | USD/JPY: 125.00",
      rrRatio: "3:1 on both legs",
    },
    steps: [
      {
        number: 1,
        title: "Map the macro backdrop",
        description:
          "Fed hiking = higher real rates = USD stronger = gold weaker (gold is a zero-yield USD asset). Fed hiking + Japan at zero = USD/JPY rises (carry trade advantage). Two assets, two directions, one macro narrative. When you find a thesis that drives multiple markets, the conviction and evidence doubles.",
      },
      {
        number: 2,
        title: "Short gold as rates rise and USD strengthens",
        description:
          "Gold short entry at $1,920 after it fails to hold above $1,940 on the weekly chart. The DXY is breaking out simultaneously — this is the macro confirmation. Stop-loss above $1,960 where the bull thesis would be restored.",
      },
      {
        number: 3,
        title: "Long USD/JPY as the carry trade activates",
        description:
          "USD/JPY long entry at 115.50 on a weekly breakout above 115.00 resistance. The Bank of Japan is committed to yield curve control — they will not raise rates. The rate differential between the US and Japan widens every Fed hike. This currency pair will trend for months, not days.",
      },
      {
        number: 4,
        title: "Size for macro — use wider stops",
        description:
          "Macro trades require wider stops and longer time horizons. Reduce position size relative to normal. A macro thesis can take 3–6 months to play out. Daily noise means nothing — only the macro direction matters. This is swing trading at its most elevated form.",
      },
      {
        number: 5,
        title: "Hedge and monitor — not set-and-forget",
        description:
          "Hold both positions simultaneously as a hedged macro portfolio. Review when Fed language changes. If the Fed pivots (stops hiking), immediately reassess the thesis. Macro trades end when the narrative ends — not when a price target is hit.",
      },
    ],
    result:
      "Gold fell from $1,920 to $1,620 over six months as rates rose. USD/JPY surged from 115.50 to 134.00 — a 18.5 handle move. Both legs of the macro thesis worked simultaneously, generating outsized returns. The macro framework identified both opportunities from a single analysis.",
    demonzenoSays:
      "When you see the macro, you see the map. Every asset is connected. Learning to trade correlations across gold, currencies, bonds, and equities is the difference between a retail trader and a professional. This is the Expert tier for a reason.",
  },
  {
    tier: "Master",
    tierColor: "#f59e0b",
    tierBg: "oklch(0.16 0.06 75)",
    emoji: "♟️",
    title: "George Soros-Style Reflexivity Trade",
    subtitle:
      "When you know the institution is wrong — and you prove it with size",
    setup:
      "A small emerging-market central bank is defending a currency peg against the USD. They have $40 billion in reserves. The country's fundamentals are deteriorating — inflation at 14%, trade deficit widening, growth slowing. Market participants know the peg cannot hold indefinitely. The central bank is buying their own currency using reserves. Every dollar they spend is one less dollar defending the peg. The asymmetry is extreme.",
    levels: {
      entry: "Build slowly over 3–6 months",
      stopLoss: "Wide — sized to conviction, not standard %",
      takeProfit: "Currency devaluation event — 30–70% move possible",
      rrRatio: "10:1+ potential when thesis is correct",
    },
    steps: [
      {
        number: 1,
        title: "Assess the asymmetry — not the odds",
        description:
          "The central bank CAN defend the peg — until they run out of reserves. Map their reserve burn rate. At current defense spending, they have 8–12 months of runway. The peg will break. The only question is when. When the downside (peg holds 12 more months, you pay the cost of carry) is known and small, and the upside (peg breaks, 40% devaluation) is enormous, this is reflexivity in action.",
      },
      {
        number: 2,
        title: "Build the position slowly — patience is the weapon",
        description:
          "Do not put on the full position immediately. Build 20% of your target size per month over 4–5 months. The cost of carry (paying the interest rate differential) is your only ongoing cost. The thesis does not require the peg to break today — just eventually. Time is your silent partner here.",
      },
      {
        number: 3,
        title: "Watch the sentiment catalyst",
        description:
          "The peg breaks not just from economics — it breaks when enough participants believe it will break. Watch for: a prominent fund manager declaring the peg unsustainable, rating agency downgrades, capital flight acceleration, rising domestic interest rates. When sentiment breaks publicly, the attack becomes self-reinforcing — this is Soros's reflexivity loop.",
      },
      {
        number: 4,
        title: "Add aggressively when the break starts",
        description:
          "When the central bank makes emergency statements or raises rates to defend the peg — this is the sign. They are losing. Add the remaining position aggressively at this point. The cost of carry is irrelevant compared to the imminent devaluation. Size to your conviction — not to a fixed percentage of NAV.",
      },
      {
        number: 5,
        title: "Exit when the narrative completes — not at a price target",
        description:
          "The peg breaks and the currency devalues 35–55%. Take the large majority of the position off in the first 48 hours post-break when volatility and liquidity are at their extremes. The remaining position can ride the continuation for weeks. This trade does not end at a chart target — it ends when the macro event has fully played out.",
      },
    ],
    result:
      "The peg broke after 7 months of position building. The currency devalued 42% in 3 days. The cost of carry over 7 months was 4.8%. The net trade returned 37.2% on the full position — a 7.75:1 return on risk for those who held conviction. Most participants had no position because the trade 'seemed obvious' but required patience most cannot maintain.",
    demonzenoSays:
      "The Master tier is not about chart patterns. It is about understanding how systems break — and having the conviction to act on that understanding at size, for as long as the thesis requires. Most traders understand the trade intellectually but never make money from it. The difference is patience and position sizing. This is what Soros taught the world in 1992.",
  },
];

// ─── Single Walkthrough Accordion ────────────────────────────────────────────
function WalkthroughItem({ data }: { data: TradeWalkthroughData }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "oklch(0.16 0.015 260)",
        border: `1px solid ${data.tierColor}30`,
        boxShadow: open ? `0 0 20px ${data.tierColor}12` : "none",
      }}
      data-ocid={`walkthrough.${data.tier.toLowerCase()}.card`}
    >
      {/* Header */}
      <button
        type="button"
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen((p) => !p)}
        data-ocid={`walkthrough.${data.tier.toLowerCase()}.toggle`}
      >
        {/* Tier badge */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold"
          style={{
            background: data.tierBg,
            color: data.tierColor,
            border: `1px solid ${data.tierColor}40`,
          }}
        >
          {data.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
              style={{
                color: data.tierColor,
                borderColor: `${data.tierColor}40`,
                background: `${data.tierColor}15`,
              }}
            >
              {data.tier}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: "#f59e0b", background: "oklch(0.25 0.06 75)" }}
            >
              R:R {data.levels.rrRatio}
            </span>
          </div>
          <h3 className="font-display font-bold text-base text-foreground">
            {data.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data.subtitle}
          </p>
        </div>

        <div className="shrink-0 mt-1" style={{ color: data.tierColor }}>
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div
          className="px-5 pb-5 space-y-5 border-t"
          style={{ borderColor: `${data.tierColor}20` }}
        >
          {/* Setup */}
          <div className="pt-4">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: data.tierColor }}
            >
              Trade Setup
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.setup}
            </p>
          </div>

          {/* Trade Levels */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.22 0.06 145)",
                border: "1px solid oklch(0.35 0.1 145)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-0.5">
                Entry
              </p>
              <p className="text-xs font-bold text-green-300">
                {data.levels.entry}
              </p>
            </div>
            <div
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.20 0.06 22)",
                border: "1px solid oklch(0.35 0.1 22)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-0.5">
                Stop Loss
              </p>
              <p className="text-xs font-bold text-red-300">
                {data.levels.stopLoss}
              </p>
            </div>
            <div
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.22 0.06 75)",
                border: "1px solid oklch(0.35 0.1 75)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 mb-0.5">
                Take Profit
              </p>
              <p className="text-xs font-bold text-yellow-300">
                {data.levels.takeProfit}
              </p>
            </div>
            <div
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.20 0.04 260)",
                border: "1px solid oklch(0.32 0.04 260)",
              }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: data.tierColor }}
              >
                R:R Ratio
              </p>
              <p
                className="text-xs font-bold"
                style={{ color: data.tierColor }}
              >
                {data.levels.rrRatio}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: data.tierColor }}
            >
              Trade Execution — Step by Step
            </p>
            <div className="space-y-3">
              {data.steps.map((step) => (
                <div key={step.number} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black mt-0.5"
                    style={{
                      background: `${data.tierColor}20`,
                      color: data.tierColor,
                      border: `1px solid ${data.tierColor}40`,
                    }}
                  >
                    {step.number}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `${data.tierColor}08`,
              border: `1px solid ${data.tierColor}25`,
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
              style={{ color: data.tierColor }}
            >
              Result
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.result}
            </p>
          </div>

          {/* DemonZeno says */}
          <div
            className="rounded-xl p-4 flex gap-3"
            style={{
              background: "oklch(0.18 0.02 260)",
              border: "1px solid oklch(0.3 0.01 260)",
            }}
          >
            <span className="text-xl shrink-0">😈</span>
            <div>
              <p
                className="text-xs font-bold mb-1"
                style={{ color: data.tierColor }}
              >
                DemonZeno says:
              </p>
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                &ldquo;{data.demonzenoSays}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function TradeWalkthrough() {
  return (
    <section className="py-10 px-4" data-ocid="walkthrough.section">
      {/* Header */}
      <div className="text-center mb-8">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#f59e0b" }}
        >
          Trade Like a Pro
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-black text-foreground mb-3">
          Real Trades, <span style={{ color: "#f59e0b" }}>Real Execution</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Five complete trade walkthroughs from beginner to master — each with
          exact entry, stop, target, and step-by-step reasoning. Study how
          professionals actually execute.
        </p>
        <p
          className="text-xs italic mt-3"
          style={{ color: "oklch(0.5 0.04 260)" }}
        >
          &ldquo;A trade without a plan is a donation to someone else's
          account.&rdquo; — DemonZeno
        </p>
      </div>

      {/* Walkthroughs */}
      <div className="max-w-3xl mx-auto space-y-4">
        {WALKTHROUGHS.map((w) => (
          <WalkthroughItem key={w.tier} data={w} />
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-sm italic" style={{ color: "oklch(0.5 0.04 260)" }}>
          &ldquo;The market rewards preparation, punishes impulse, and ignores
          hope. Be prepared. Always.&rdquo; — DemonZeno
        </p>
      </div>
    </section>
  );
}
