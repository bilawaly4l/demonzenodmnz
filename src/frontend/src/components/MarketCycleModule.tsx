// ─── Market Cycle Education Module ───────────────────────────────────────────

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PhaseData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  bg: string;
  emoji: string;
  description: string;
  characteristics: string[];
  howToSpot: string[];
  demonzenoRule: string;
  traderQuote: { author: string; quote: string };
}

interface CaseStudy {
  year: string;
  title: string;
  phase: string;
  phaseColor: string;
  body: string;
}

// ─── Phase Data ──────────────────────────────────────────────────────────────
const PHASES: PhaseData[] = [
  {
    id: "accumulation",
    name: "Phase 1: Accumulation",
    subtitle: "Smart money buys while everyone else is in pain",
    color: "#22c55e",
    bg: "oklch(0.15 0.04 145)",
    emoji: "🏗️",
    description:
      "The Accumulation phase occurs after a prolonged bear market when prices are at their lowest. Most retail investors have panic-sold their positions — they are exhausted, fearful, and convinced things will never recover. Meanwhile, institutional investors — banks, hedge funds, and smart money — are quietly buying at bargain prices. Volume is low. News is terrible. But the smart money doesn't need good news. It needs cheap prices.",
    characteristics: [
      "Price is near multi-year lows with low volatility",
      "Most retail investors are bearish or disengaged",
      "Institutional buying quietly absorbs selling pressure",
      "Volume is low but occasionally spikes on accumulation days",
      "News cycle is negative — nobody is talking positively about the asset",
      "Asset is considered 'dead' by mainstream media",
    ],
    howToSpot: [
      "Price stops making new lows despite terrible news (divergence)",
      "Higher lows begin appearing on the weekly chart",
      "Volume spikes on up days are larger than volume on down days",
      "Smart money indicators: large block trades, options flow turning bullish",
      "RSI makes higher lows even as price flatlines",
    ],
    demonzenoRule:
      "During accumulation, your job is to identify the floor — not catch the exact bottom. Accumulate in tranches. Buy 25% at what looks like a floor, another 25% if it breaks lower, and so on. Never try to nail the exact low. DemonZeno's rule: 'I'd rather buy at the base of a mountain than the peak of a hill.'",
    traderQuote: {
      author: "George Soros",
      quote:
        "The worse a situation becomes, the less it takes to turn it around, the bigger the upside.",
    },
  },
  {
    id: "markup",
    name: "Phase 2: Bull Run (Markup)",
    subtitle: "The trend is your friend — until it ends",
    color: "#f59e0b",
    bg: "oklch(0.16 0.06 75)",
    emoji: "🚀",
    description:
      "The Markup (Bull Run) phase is when prices begin a sustained, trending rise. Smart money that accumulated in Phase 1 is now seeing its positions appreciate. As prices rise, retail investors begin to take notice. Initially only sophisticated retail traders enter — by mid-markup, the mainstream is piling in. By late markup, your taxi driver, your family member, and every influencer is 'investing.' This is when smart money begins to quietly exit.",
    characteristics: [
      "Price makes consistent higher highs and higher lows",
      "Volume increases steadily as new buyers enter",
      "Sentiment shifts from fearful to neutral to euphoric",
      "Media coverage turns positive, then breathlessly optimistic",
      "Easy money attracts new participants who have never traded before",
      "FOMO drives parabolic moves near the top",
    ],
    howToSpot: [
      "200-day moving average starts sloping upward after a long flat period",
      "Price breaks above a multi-month resistance level on high volume",
      "Mainstream news begins covering the asset positively",
      "Google Trends for the asset name starts rising steadily",
      "The asset begins appearing in everyday conversation (late-stage signal)",
    ],
    demonzenoRule:
      "During the markup, ride the trend — but position yourself to exit before the crowd. Never let greed hold you at the top. DemonZeno's rule: 'In a bull market, greed is the last danger. Sell when everyone is buying — not because the price looks wrong, but because the room is too full.'",
    traderQuote: {
      author: "Jesse Livermore",
      quote:
        "All through time, people have basically acted and reacted the same way in the market as a result of: greed, fear, ignorance, and hope.",
    },
  },
  {
    id: "distribution",
    name: "Phase 3: Distribution",
    subtitle: "The trap — when insiders sell to the crowd",
    color: "#a855f7",
    bg: "oklch(0.15 0.06 310)",
    emoji: "⚠️",
    description:
      "Distribution is the most dangerous phase for retail traders — because it looks almost identical to late-stage markup. Prices are near all-time highs. News is maximally positive. Sentiment is euphoric. But behind the scenes, institutional investors are systematically selling their positions to the retail crowd that is still buying in. Volume can be extremely high during distribution — but it is selling volume disguised as buying momentum. This phase can last weeks to months before the eventual collapse.",
    characteristics: [
      "Price makes all-time highs but advances are becoming smaller",
      "Volume is very high but price barely rises — sellers absorb all buying",
      "Sentiment is at maximum optimism — FOMO is at its peak",
      "Insiders and institutional investors are quietly reducing positions",
      "Retail investors are taking out loans to buy, telling friends to buy",
      "Price begins forming topping patterns (double top, head & shoulders)",
    ],
    howToSpot: [
      "High volume days that end near the low of the day (bearish close)",
      "Price struggles to make new highs despite high trading volume",
      "RSI divergence: price makes new highs but RSI makes lower highs",
      "Topping patterns forming on weekly charts",
      "Funding rates (for crypto) hit extreme highs — over 0.1% per 8 hours",
      "Mainstream media coverage at peak — celebrities launching tokens, NFTs etc.",
    ],
    demonzenoRule:
      "Distribution is where fortunes are lost by the unprepared and made by the prepared. During distribution, move to cash systematically — not all at once. DemonZeno's rule: 'If the taxi driver is giving you tips, you're already in the distribution phase. Exit before the stampede.'",
    traderQuote: {
      author: "Paul Tudor Jones",
      quote:
        "At the end of the day, the most important thing is how good are you at risk control. 90% of any great trader's energy should go into cutting losses.",
    },
  },
  {
    id: "markdown",
    name: "Phase 4: Bear Market (Markdown)",
    subtitle: "Capital preservation is the only goal",
    color: "#ef4444",
    bg: "oklch(0.15 0.06 22)",
    emoji: "🐻",
    description:
      "The Markdown (Bear Market) phase is when the illusion breaks. Price falls rapidly at first, then in waves — occasional rallies keep retail investors hopeful ('this is just a dip!'). Each rally fails at lower levels, and each dip goes lower. Media coverage shifts from euphoric to confused to panicked. By the end of markdown, the asset is declared worthless, dead, or a scam by the same outlets that celebrated it at the top. Smart money is watching — waiting for Accumulation to begin again.",
    characteristics: [
      "Price makes consistent lower highs and lower lows",
      "Bear market rallies (relief bounces) trap bulls before reversing",
      "Volume spikes on down days — panic selling",
      "Media narrative shifts from 'minor correction' to 'crash' to 'dead'",
      "Weak hands are shaken out through fear and margin calls",
      "Duration: typically 12–24 months for major assets",
    ],
    howToSpot: [
      "200-day moving average begins sloping downward",
      "Every rally is sold into — no bounce sustains above the previous high",
      "Increasing reports of bankruptcies, margin calls, fund liquidations",
      "Volume on down days consistently higher than volume on up days",
      "Sentiment surveys show extreme fear — CNN Fear/Greed below 20",
    ],
    demonzenoRule:
      "In a bear market, your only goal is to not lose money. Cash is a position. Sitting out is a trade. DemonZeno's rule: 'A bear market is not a tragedy for the prepared. It is a sale. The tragedy is being fully invested when it starts, and having no cash when it ends.'",
    traderQuote: {
      author: "Stanley Druckenmiller",
      quote:
        "The way to build long-term returns is through preservation of capital and home runs. You can be far more aggressive when you're making good profits than when you're in a correction.",
    },
  },
];

// ─── Historical Case Studies ──────────────────────────────────────────────────
const CASE_STUDIES: CaseStudy[] = [
  {
    year: "2008–2009",
    title: "The Great Financial Crisis — Perfect Accumulation Signal",
    phase: "Accumulation → Markup",
    phaseColor: "#22c55e",
    body: "When Lehman Brothers collapsed in September 2008, the S&P 500 fell 57% from its peak. Panic was total — every major bank seemed to be failing. But from March 2009, institutional investors began accumulating equities at decade-low prices. Warren Buffett published his famous 'Buy American. I Am.' op-ed. The S&P 500 went from 666 points in March 2009 to over 3,800 by January 2020 — an 11-year bull market born from the ashes of the worst financial crisis in 80 years. The accumulation signal: stocks stopped making new lows despite headlines getting worse in December 2008 and January 2009.",
  },
  {
    year: "2017",
    title: "Bitcoin's First Mania — Classic Distribution",
    phase: "Distribution → Markdown",
    phaseColor: "#a855f7",
    body: "Bitcoin went from $1,000 in January 2017 to $20,000 in December 2017. By November 2017, every news network was covering Bitcoin daily. Mainstream figures who had dismissed crypto for years were now calling it 'digital gold.' Google Trends hit an all-time high. Meanwhile, early Bitcoin adopters and mining companies were liquidating large positions into the retail buying frenzy. The distribution phase lasted approximately 6 weeks from mid-November to late December. When the music stopped on December 17, 2017, the collapse took Bitcoin from $20,000 to $3,200 — an 84% crash over the following 12 months.",
  },
  {
    year: "2020",
    title: "COVID Crash — Fastest Accumulation in History",
    phase: "Accumulation (32 days)",
    phaseColor: "#22c55e",
    body: "On March 12, 2020, the stock market crashed 12% in a single day as COVID-19 lockdowns began globally. The S&P 500 fell 34% in just 33 days — the fastest bear market in history. But by March 23, institutional accumulation began. The US Federal Reserve announced unlimited quantitative easing. Corporations began buying back stock. Within 5 months, the S&P 500 had recovered 100% of its losses and made new all-time highs. Bitcoin, which fell from $10,000 to $3,800, went on to reach $69,000 by November 2021 — 18x in 20 months. The COVID crash was the fastest accumulation opportunity of the decade.",
  },
  {
    year: "2021–2022",
    title: "Bitcoin $69K — The Perfect Cycle Textbook",
    phase: "Distribution → Markdown",
    phaseColor: "#ef4444",
    body: "Bitcoin's 2021 cycle was a near-perfect textbook of the four phases. Accumulation: $3,800–$10,000 (late 2020). Markup: $10,000–$60,000 (Jan–April 2021). Distribution: two-month topping pattern at $55,000–$69,000 (Oct–Nov 2021). Markdown: $69,000 → $16,000 (Nov 2021–Nov 2022, -76%). The distribution signals were all there: on-chain data showed whales (large wallets) selling. Funding rates hit record highs. Mainstream media coverage peaked with Fortune magazine's 'Bitcoin Is the Future' cover. El Salvador adopted Bitcoin as legal tender — the ultimate mainstream signal. Smart money was selling into every retail headline.",
  },
];

// ─── Market Cycle SVG Diagram ─────────────────────────────────────────────────
function MarketCycleSvg() {
  return (
    <div className="w-full max-w-2xl mx-auto" data-ocid="market_cycle.diagram">
      <svg
        viewBox="0 0 600 220"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Market cycle diagram showing four phases"
      >
        <title>Market cycle diagram showing four phases</title>
        {/* Background */}
        <rect width="600" height="220" fill="oklch(0.13 0.01 260)" rx="12" />

        {/* Grid lines */}
        {[40, 80, 120, 160].map((y) => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2="560"
            y2={y}
            stroke="oklch(0.25 0.01 260)"
            strokeWidth="0.5"
            strokeDasharray="4"
          />
        ))}

        {/* Cycle curve */}
        <path
          d="M 60 170 C 80 170, 100 160, 130 150 C 160 140, 170 130, 200 125 C 230 120, 250 115, 280 90 C 310 65, 330 50, 360 38 C 380 32, 390 38, 410 55 C 430 72, 445 100, 460 120 C 475 140, 490 160, 530 175"
          fill="none"
          stroke="url(#cycleGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gradient */}
        <defs>
          <linearGradient id="cycleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d="M 60 170 C 80 170, 100 160, 130 150 C 160 140, 170 130, 200 125 C 230 120, 250 115, 280 90 C 310 65, 330 50, 360 38 C 380 32, 390 38, 410 55 C 430 72, 445 100, 460 120 C 475 140, 490 160, 530 175 L 530 190 L 60 190 Z"
          fill="url(#areaGrad)"
        />

        {/* Phase label backgrounds */}
        {/* Accumulation zone */}
        <rect
          x="42"
          y="145"
          width="100"
          height="40"
          fill="#22c55e"
          fillOpacity="0.1"
          rx="4"
        />
        {/* Markup zone */}
        <rect
          x="155"
          y="40"
          width="140"
          height="40"
          fill="#f59e0b"
          fillOpacity="0.1"
          rx="4"
        />
        {/* Distribution zone */}
        <rect
          x="330"
          y="28"
          width="110"
          height="40"
          fill="#a855f7"
          fillOpacity="0.1"
          rx="4"
        />
        {/* Markdown zone */}
        <rect
          x="455"
          y="115"
          width="90"
          height="40"
          fill="#ef4444"
          fillOpacity="0.1"
          rx="4"
        />

        {/* Phase labels */}
        <text
          x="92"
          y="161"
          textAnchor="middle"
          fill="#22c55e"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          ACCUMULATION
        </text>
        <text
          x="92"
          y="173"
          textAnchor="middle"
          fill="#22c55e"
          fontSize="7"
          fontFamily="monospace"
        >
          Smart Money Buys
        </text>

        <text
          x="225"
          y="56"
          textAnchor="middle"
          fill="#f59e0b"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          BULL RUN
        </text>
        <text
          x="225"
          y="68"
          textAnchor="middle"
          fill="#f59e0b"
          fontSize="7"
          fontFamily="monospace"
        >
          Markup Phase
        </text>

        <text
          x="385"
          y="44"
          textAnchor="middle"
          fill="#a855f7"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          DISTRIBUTION
        </text>
        <text
          x="385"
          y="56"
          textAnchor="middle"
          fill="#a855f7"
          fontSize="7"
          fontFamily="monospace"
        >
          Insiders Sell
        </text>

        <text
          x="500"
          y="131"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          BEAR MARKET
        </text>
        <text
          x="500"
          y="143"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="7"
          fontFamily="monospace"
        >
          Markdown
        </text>

        {/* Y-axis label */}
        <text
          x="12"
          y="105"
          textAnchor="middle"
          fill="oklch(0.45 0.01 260)"
          fontSize="7"
          fontFamily="monospace"
          transform="rotate(-90, 12, 105)"
        >
          PRICE
        </text>
        {/* X-axis label */}
        <text
          x="300"
          y="210"
          textAnchor="middle"
          fill="oklch(0.45 0.01 260)"
          fontSize="7"
          fontFamily="monospace"
        >
          TIME →
        </text>

        {/* Smart money entry annotation */}
        <circle cx="130" cy="150" r="4" fill="#22c55e" fillOpacity="0.8" />
        <circle cx="360" cy="38" r="4" fill="#a855f7" fillOpacity="0.8" />
        <circle cx="410" cy="55" r="4" fill="#ef4444" fillOpacity="0.8" />
        <circle cx="530" cy="175" r="4" fill="#22c55e" fillOpacity="0.6" />

        {/* Annotations */}
        <text
          x="134"
          y="140"
          fill="#22c55e"
          fontSize="6.5"
          fontFamily="monospace"
        >
          ↑ Buy zone
        </text>
        <text
          x="340"
          y="28"
          fill="#a855f7"
          fontSize="6.5"
          fontFamily="monospace"
        >
          ATH ↑
        </text>
        <text
          x="414"
          y="50"
          fill="#ef4444"
          fontSize="6.5"
          fontFamily="monospace"
        >
          Sell
        </text>
        <text
          x="510"
          y="168"
          fill="#22c55e"
          fontSize="6.5"
          fontFamily="monospace"
        >
          Repeat
        </text>
      </svg>
      <p className="text-center text-[10px] text-muted-foreground mt-2">
        The Wyckoff Market Cycle — all markets repeat this pattern across all
        timeframes
      </p>
    </div>
  );
}

// ─── Phase Accordion Item ──────────────────────────────────────────────────────
function PhaseItem({ phase }: { phase: PhaseData }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "oklch(0.16 0.015 260)",
        border: `1px solid ${phase.color}30`,
        boxShadow: open ? `0 0 20px ${phase.color}12` : "none",
      }}
      data-ocid={`market_cycle.phase.${phase.id}`}
    >
      <button
        type="button"
        className="w-full text-left p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen((p) => !p)}
        data-ocid={`market_cycle.phase.${phase.id}.toggle`}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl"
          style={{ background: phase.bg, border: `1px solid ${phase.color}30` }}
        >
          {phase.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="font-display font-bold text-base"
            style={{ color: phase.color }}
          >
            {phase.name}
          </h3>
          <p className="text-xs text-muted-foreground">{phase.subtitle}</p>
        </div>
        <div style={{ color: phase.color }} className="shrink-0">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {open && (
        <div
          className="px-5 pb-5 space-y-4 border-t"
          style={{ borderColor: `${phase.color}20` }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">
            {phase.description}
          </p>

          {/* Characteristics */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: phase.color }}
            >
              Key Characteristics
            </p>
            <ul className="space-y-1.5">
              {phase.characteristics.map((c) => (
                <li key={c.slice(0, 40)} className="flex items-start gap-2">
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: phase.color }}
                  >
                    ▸
                  </span>
                  <span className="text-sm text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to spot */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `${phase.color}08`,
              border: `1px solid ${phase.color}25`,
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: phase.color }}
            >
              How to Identify This Phase
            </p>
            <ul className="space-y-1.5">
              {phase.howToSpot.map((s) => (
                <li key={s.slice(0, 40)} className="flex items-start gap-2">
                  <span
                    className="text-xs font-bold mt-0.5"
                    style={{ color: phase.color }}
                  >
                    ✓
                  </span>
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DemonZeno rule */}
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
                style={{ color: phase.color }}
              >
                DemonZeno's Rule for This Phase:
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {phase.demonzenoRule}
              </p>
            </div>
          </div>

          {/* Trader quote */}
          <blockquote
            className="rounded-lg p-4"
            style={{
              background: "oklch(0.13 0.01 260)",
              borderLeft: `3px solid ${phase.color}`,
            }}
          >
            <p className="text-sm italic text-muted-foreground leading-relaxed pl-2">
              &ldquo;{phase.traderQuote.quote}&rdquo;
            </p>
            <p
              className="text-xs font-bold mt-1.5 pl-2"
              style={{ color: phase.color }}
            >
              — {phase.traderQuote.author}
            </p>
          </blockquote>
        </div>
      )}
    </div>
  );
}

// ─── Case Study Card ──────────────────────────────────────────────────────────
function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.16 0.015 260)",
        border: `1px solid ${cs.phaseColor}25`,
      }}
      data-ocid={`market_cycle.case_study.${cs.year.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`}
    >
      <button
        type="button"
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen((p) => !p)}
      >
        <span
          className="text-xs font-black px-2 py-1 rounded-md shrink-0 mt-0.5"
          style={{ background: `${cs.phaseColor}20`, color: cs.phaseColor }}
        >
          {cs.year}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{cs.title}</p>
          <p className="text-xs" style={{ color: cs.phaseColor }}>
            {cs.phase}
          </p>
        </div>
        <div style={{ color: cs.phaseColor }} className="shrink-0 mt-0.5">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>
      {open && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: `${cs.phaseColor}20` }}
        >
          <p className="text-sm text-muted-foreground leading-relaxed pt-3">
            {cs.body}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Where Are We Now (static educational) ───────────────────────────────────
function WhereAreWeNow() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "oklch(0.16 0.015 260)",
        border: "1px solid oklch(0.32 0.04 75)",
      }}
      data-ocid="market_cycle.where_now.section"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎯</span>
        <h3
          className="font-display font-bold text-base"
          style={{ color: "#f59e0b" }}
        >
          "Where Are We Now?" — How to Assess the Current Phase
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        This is not a live indicator — it is a framework for your own analysis.
        Use these questions to determine which market cycle phase you are likely
        in. Review monthly.
      </p>
      <div className="space-y-3">
        {[
          {
            q: "What is the 200-day moving average doing?",
            a: "Rising + price above = Markup. Flat = Accumulation or late Distribution. Falling + price below = Markdown.",
          },
          {
            q: "What is mainstream media saying about this asset?",
            a: "Ignoring it = Accumulation. Cautiously positive = Early markup. Breathlessly bullish = Late markup / Distribution. Declaring it dead = Late Markdown / Accumulation starting.",
          },
          {
            q: "Are institutions buying or selling?",
            a: "Check: large block trades, SEC 13F filings, on-chain whale movements (for crypto), options flow, fund flows data.",
          },
          {
            q: "What does RSI look like on the monthly chart?",
            a: "Below 40 = Markdown or Accumulation. 40–65 = Markup in progress. Above 70 = Late markup. Above 80 = Distribution warning. Diverging from price = Phase transition imminent.",
          },
          {
            q: "How does 'the crowd' feel?",
            a: "Fear/Greed index below 25 = Accumulation zone. Above 75 = Distribution danger. The crowd is almost always late — position against the extreme.",
          },
        ].map((item) => (
          <div
            key={item.q.slice(0, 30)}
            className="rounded-lg p-3"
            style={{ background: "oklch(0.19 0.02 260)" }}
          >
            <p className="text-xs font-bold text-foreground mb-1">
              ❓ {item.q}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
      <div
        className="mt-4 rounded-xl p-4 flex gap-3"
        style={{
          background: "oklch(0.18 0.02 260)",
          border: "1px solid oklch(0.3 0.01 260)",
        }}
      >
        <span className="text-xl shrink-0">😈</span>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-bold" style={{ color: "#f59e0b" }}>
            DemonZeno says:{" "}
          </span>
          &ldquo;You don't need to be right about where we are in the cycle. You
          need to have a framework that keeps you from doing the most expensive
          thing: buying at the top because everyone is buying, and selling at
          the bottom because everyone is selling.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export function MarketCycleModule() {
  return (
    <section className="py-10 px-4" data-ocid="market_cycle.section">
      {/* Header */}
      <div className="text-center mb-8">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#f59e0b" }}
        >
          The Big Picture
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-black text-foreground mb-3">
          Understanding <span style={{ color: "#f59e0b" }}>Market Cycles</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Every market in history — stocks, crypto, gold, real estate — moves
          through the same four phases. Understanding where you are in the cycle
          is the highest-leverage skill in all of trading.
        </p>
        <p
          className="text-xs italic mt-3"
          style={{ color: "oklch(0.5 0.04 260)" }}
        >
          &ldquo;History doesn't repeat itself, but it often rhymes. The cycle
          always continues.&rdquo; — DemonZeno
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Cycle SVG diagram */}
        <MarketCycleSvg />

        {/* Four phases */}
        <div>
          <h3
            className="font-display font-bold text-base mb-4 text-center"
            style={{ color: "#f59e0b" }}
          >
            The Four Phases — In Depth
          </h3>
          <div className="space-y-3">
            {PHASES.map((phase) => (
              <PhaseItem key={phase.id} phase={phase} />
            ))}
          </div>
        </div>

        {/* Case Studies */}
        <div>
          <h3
            className="font-display font-bold text-base mb-4 text-center"
            style={{ color: "#a855f7" }}
          >
            Real History — Famous Cycle Examples
          </h3>
          <div className="space-y-3">
            {CASE_STUDIES.map((cs) => (
              <CaseStudyCard key={cs.year} cs={cs} />
            ))}
          </div>
        </div>

        {/* Where are we now */}
        <WhereAreWeNow />

        {/* Wyckoff credit note */}
        <p
          className="text-center text-xs"
          style={{ color: "oklch(0.4 0.01 260)" }}
        >
          Framework based on Wyckoff Method (1930s) — still the most accurate
          model for market cycle analysis in use today
        </p>
      </div>
    </section>
  );
}
