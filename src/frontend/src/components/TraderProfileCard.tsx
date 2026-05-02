// ─── Famous Trader Profile Card ───────────────────────────────────────────────
// Compatible with TradingAcademySection's TraderProfile interface
// Also exports AllTraderProfiles with all 5 world-class traders

import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { useState } from "react";

// ─── Shared interface (matches TradingAcademySection.tsx TraderProfile) ──────
export interface TraderProfile {
  name: string;
  era: string;
  story: string;
  keyLesson: string;
  quote: string;
}

// ─── Extended interface for AllTraderProfiles ────────────────────────────────
interface FullTraderProfile extends TraderProfile {
  title: string;
  tier: "beginner" | "advanced" | "expert" | "master";
  famousTrade: string;
  keyLessons: string[];
  demonzenoConnection: string;
  initial: string;
  nationality: string;
  netWorth: string;
}

// ─── Inline Card Props (for use inside lesson content) ───────────────────────
interface TraderProfileCardProps {
  profile: TraderProfile;
  tierColor: string;
}

export function TraderProfileCard({
  profile,
  tierColor,
}: TraderProfileCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      className="w-full rounded-xl p-4 my-3 transition-all duration-200 text-left"
      style={{
        background: "oklch(0.17 0.02 260)",
        border: `1px solid ${tierColor}30`,
        cursor: "pointer",
      }}
      onClick={() => setExpanded((p) => !p)}
      data-ocid="academy.lesson.trader_profile"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm"
          style={{ background: `${tierColor}20`, color: tierColor }}
        >
          {profile.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="font-display font-bold text-sm"
            style={{ color: tierColor }}
          >
            🏆 Famous Trader: {profile.name}
          </p>
          <p className="text-xs text-muted-foreground">{profile.era}</p>
        </div>
        <div className="shrink-0" style={{ color: tierColor }}>
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {profile.story}
          </p>
          <div
            className="rounded-lg px-3 py-2"
            style={{
              background: `${tierColor}10`,
              border: `1px solid ${tierColor}25`,
            }}
          >
            <p
              className="text-xs font-bold mb-0.5 uppercase tracking-wider"
              style={{ color: tierColor }}
            >
              Key Lesson
            </p>
            <p className="text-xs text-muted-foreground">{profile.keyLesson}</p>
          </div>
          {profile.quote && (
            <p
              className="text-xs italic border-l-2 pl-3"
              style={{ color: "oklch(0.65 0.05 260)", borderColor: tierColor }}
            >
              &ldquo;{profile.quote}&rdquo;
            </p>
          )}
        </div>
      )}
    </button>
  );
}

// ─── All 5 Top Global Traders Data ───────────────────────────────────────────
const TRADER_PROFILES: FullTraderProfile[] = [
  {
    name: "Waqar Zaka",
    initial: "WZ",
    title: "Pakistan's Crypto Visionary",
    era: "2012–Present",
    nationality: "Pakistan",
    netWorth: "Estimated $50M+",
    tier: "beginner",
    story:
      "Waqar Zaka is Pakistan's most famous crypto educator and investor. In 2012–2014, when Bitcoin was trading below $200, he publicly invested and taught thousands of Pakistanis how to buy, store, and profit from Bitcoin. His TV appearances, social media campaigns, and free education on crypto made him a household name and created a generation of Pakistani crypto millionaires. He petitioned the Pakistani government to legalize crypto — and won. Long before 'DeFi' was a term, he was teaching people to be their own bank.",
    famousTrade:
      "Waqar bought Bitcoin at around $200 in 2013 and publicly documented every step of his strategy, teaching his audience to do the same. When Bitcoin reached $20,000 in 2017 — a 100x return — those who followed his early guidance became millionaires. He had predicted the bull run months in advance on national television. His greatest trade was not just buying Bitcoin; it was buying it publicly and educating a nation to join him.",
    keyLesson:
      "Early adoption beats analysis. You don't need to understand blockchain deeply to act on conviction. Education is the real alpha — when you teach others, you multiply your own impact a thousandfold.",
    keyLessons: [
      "Early adoption beats perfect analysis — act on conviction, not certainty",
      "Educate your community and your network compounds exponentially",
      "Crypto is for everyone — geography and privilege are no longer barriers",
      "The biggest returns come from assets most people are afraid to touch",
    ],
    quote:
      "I didn't just invest in Bitcoin. I invested in people's belief in Bitcoin.",
    demonzenoConnection:
      "Waqar Zaka's mission — making trading accessible to everyone, regardless of background — is the DNA of DMNZ. DemonZeno was built on the same belief: that world-class trading education should be free, open, and powerful enough to change lives.",
  },
  {
    name: "Jesse Livermore",
    initial: "JL",
    title: "The Greatest Stock Speculator of All Time",
    era: "1877–1940",
    nationality: "USA",
    netWorth: "$100M at peak (~$1.5B today)",
    tier: "advanced",
    story:
      "Jesse Livermore started trading at age 15 with just $5 in illegal 'bucket shops' — and was banned from all of them by 16 for being too good. He made and lost multiple fortunes over his career. His crowning achievement: anticipating and shorting the 1929 stock market crash while the entire world was bullish, earning $100 million in a single market collapse — the equivalent of over $1.5 billion today. He traded purely from price action and tape reading, with zero fundamental analysis.",
    famousTrade:
      "In September 1929, when every banker and economist was calling for more gains, Livermore quietly began building a massive short position across the US stock market. On Black Tuesday, October 29, 1929, the market lost 12% in a single day — the worst crash in history. Livermore made $100 million. The day after the crash, Herbert Hoover personally blamed Livermore for causing it. He was both celebrated and condemned as 'The Boy Plunger.'",
    keyLesson:
      "Never average down a losing position. Let your winners run ruthlessly and cut your losers instantly. The market is never wrong — your opinion is.",
    keyLessons: [
      "Never average down a loser — it turns a small mistake into a catastrophic one",
      "Cut losers fast, let winners run — most traders do the exact opposite",
      "The market will always give back what it gives — lock in gains before they evaporate",
      "Read price, not news — the tape tells you everything if you know how to listen",
    ],
    quote:
      "The stock market is never obvious. It is designed to fool most of the people, most of the time.",
    demonzenoConnection:
      "Livermore's iron discipline — cutting losses without emotion, riding winners without greed — is the foundation of the DemonZeno risk management system. His life is proof that genius without discipline ends in ruin. Discipline without genius can still make you rich.",
  },
  {
    name: "Paul Tudor Jones",
    initial: "PT",
    title: "Legendary Macro Trader & Hedge Fund Icon",
    era: "1980s–Present",
    nationality: "USA",
    netWorth: "~$8 Billion",
    tier: "expert",
    story:
      "Paul Tudor Jones is one of the greatest macro traders in history. As founder of Tudor Investment Corp, he has delivered extraordinary returns for decades without a single losing year. His obsessive discipline around capital preservation — famously saying 'the most important rule is to play great defense, not great offense' — made him the benchmark for risk management. He sees macro economics as the ultimate market driver and has called every major macro turn of the past 40 years.",
    famousTrade:
      "On October 19, 1987 — Black Monday — the US stock market crashed 22.6% in a single day, the largest one-day percentage drop in history. Paul Tudor Jones had been studying the 1929 crash using Elliott Wave analysis and identified the same pattern forming. He loaded up on short positions in stock futures. When the crash came, he tripled his money and posted a 62% return for the year while everyone else was wiped out. He had filmed a documentary — 'Trader' — predicting it months in advance.",
    keyLesson:
      "Protecting capital is more important than making money. A 50% loss requires a 100% gain just to break even. Asymmetric risk/reward — risking $1 to make $5 — is the only game worth playing.",
    keyLessons: [
      "Protect capital above all else — a 50% loss needs a 100% gain to recover",
      "Macro factors drive all markets — understand interest rates, USD, and credit cycles",
      "Risk/reward must be asymmetric — never risk more than you could gain 5x",
      "Defense wins in trading — great offense without defense leads to ruin",
    ],
    quote:
      "The secret to being successful from a trading perspective is to have an indefatigable and an undying and unquenchable thirst for information and knowledge.",
    demonzenoConnection:
      "PTJ's framework of asymmetric risk/reward is the cornerstone of every DemonZeno trade setup. If the risk/reward isn't at least 2:1, DemonZeno doesn't take the trade. Period. This rule alone separates survivors from legends.",
  },
  {
    name: "George Soros",
    initial: "GS",
    title: "The Man Who Broke the Bank of England",
    era: "1960s–Present",
    nationality: "Hungary/USA",
    netWorth: "~$6.7 Billion",
    tier: "master",
    story:
      "George Soros, born in Budapest in 1930, survived Nazi occupation as a child and built one of the most influential investment firms in history — the Quantum Fund. He is best known for his theory of 'reflexivity' — the idea that markets are not efficient but are shaped by participants' beliefs, which in turn shape reality. This theory allowed him to identify when markets were systematically wrong and bet against them with enormous conviction and size.",
    famousTrade:
      "In 1992, Soros identified that the British Pound was overvalued within the European Exchange Rate Mechanism (ERM) and that the Bank of England could not afford to defend it. He secretly built a $10 billion short position against the pound. On September 16, 1992 — now called 'Black Wednesday' — the Bank of England was forced to devalue and withdraw from the ERM. In a single 24-hour period, Soros made $1 billion profit. The British government lost £3.3 billion. He broke a central bank with analysis and conviction.",
    keyLesson:
      "Size your conviction, not just your analysis. When you know a central bank is wrong and you know they cannot defend their position, the asymmetry is so extreme that standard risk rules do not apply.",
    keyLessons: [
      "Markets are reflexive — participants' beliefs actively shape price, not just react to it",
      "Size your conviction: when asymmetry is extreme, standard position limits don't apply",
      "Know when central banks are wrong — institutional mistakes are the biggest opportunities",
      "It's not whether you're right or wrong, it's how much you make when right",
    ],
    quote:
      "It's not whether you're right or wrong, but how much money you make when you're right and how much you lose when you're wrong.",
    demonzenoConnection:
      "Soros teaches the highest-level lesson in trading: conviction-based sizing. The DemonZeno framework teaches this at the Master tier — once you understand reflexivity and identify when the crowd is systematically wrong, the trade size is limited only by your analysis.",
  },
  {
    name: "Stanley Druckenmiller",
    initial: "SD",
    title: "The Greatest Macro Trader of All Time",
    era: "1980s–Present",
    nationality: "USA",
    netWorth: "~$6.9 Billion",
    tier: "master",
    story:
      "Stanley Druckenmiller is considered by many professionals to be the greatest trader in history. Over 30+ years managing the Duquesne Capital fund, he never had a single losing year — a feat no other major fund manager has matched — with average annual returns exceeding 30%. He was Soros's chief strategist during the Bank of England trade and executed it. His philosophy: concentrate in your absolute best ideas, know the macro narrative, and time entries using price trends rather than valuation.",
    famousTrade:
      "In 1989–1990, Druckenmiller recognized that German reunification — the merging of East and West Germany — would create massive currency flows. East Germans would convert their currency to Deutschmarks, weakening the Mark short-term but strengthening Germany's economy long-term. He simultaneously went long German stocks and short German bonds, then built massive positions in European currencies. The multi-asset, multi-country macro trade generated hundreds of millions in profit. It was chess while others played checkers.",
    keyLesson:
      "Put all your eggs in one basket and watch the basket carefully. Diversification is for people who don't know what they're doing. When you find the highest-conviction trade, maximize size — then manage it perfectly.",
    keyLessons: [
      "Concentrate in your best ideas — true diversification is cowardice disguised as prudence",
      "Value tells you what to buy; the trend tells you when — never confuse the two",
      "Multi-market thinking: currencies, bonds, and equities are all connected macro threads",
      "The size of the position should match the size of the conviction, not the size of the account",
    ],
    quote:
      "I never use value as a timing tool. Never. Value tells you what to buy, the trend tells you when.",
    demonzenoConnection:
      "Druckenmiller's 30-year unbeaten record is what DemonZeno Academy builds toward at the Master tier. Consistent, compounding, no-losing-years trading is the goal. Not moonshots. Not gambling. Methodical macro mastery — the ultimate form of the craft.",
  },
];

// ─── Tier styling ─────────────────────────────────────────────────────────────
const TIER_STYLES: Record<
  string,
  { color: string; bg: string; label: string; badge: string }
> = {
  beginner: {
    color: "#22c55e",
    bg: "oklch(0.25 0.08 145)",
    label: "Beginner Tier",
    badge: "bg-green-900/40 text-green-400 border-green-700/50",
  },
  advanced: {
    color: "#3b82f6",
    bg: "oklch(0.25 0.08 240)",
    label: "Advanced Tier",
    badge: "bg-blue-900/40 text-blue-400 border-blue-700/50",
  },
  expert: {
    color: "#a855f7",
    bg: "oklch(0.25 0.1 310)",
    label: "Expert Tier",
    badge: "bg-purple-900/40 text-purple-400 border-purple-700/50",
  },
  master: {
    color: "#f59e0b",
    bg: "oklch(0.28 0.08 75)",
    label: "Master Tier",
    badge: "bg-yellow-900/40 text-yellow-400 border-yellow-700/50",
  },
};

// ─── Full Trader Card (standalone) ───────────────────────────────────────────
function FullTraderCard({ trader }: { trader: FullTraderProfile }) {
  const [expanded, setExpanded] = useState(false);
  const style = TIER_STYLES[trader.tier];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "oklch(0.16 0.015 260)",
        border: `1px solid ${style.color}30`,
        boxShadow: expanded ? `0 0 24px ${style.color}15` : "none",
      }}
      data-ocid={`traders.${trader.name.toLowerCase().replace(/\s+/g, "_")}.card`}
    >
      {/* Header */}
      <button
        type="button"
        className="w-full text-left p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((p) => !p)}
        data-ocid={`traders.${trader.name.toLowerCase().replace(/\s+/g, "_")}.toggle`}
      >
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-display font-black text-lg"
          style={{
            background: `${style.color}20`,
            color: style.color,
            border: `2px solid ${style.color}40`,
          }}
        >
          {trader.initial}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-display font-bold text-base text-foreground">
              {trader.name}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${style.badge}`}
            >
              {style.label}
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: style.color }}>
            {trader.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {trader.nationality} · {trader.era} · {trader.netWorth}
          </p>
        </div>

        {/* Expand toggle */}
        <div className="shrink-0 ml-2" style={{ color: style.color }}>
          {expanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-5 pb-5 space-y-4 border-t"
          style={{ borderColor: `${style.color}20` }}
        >
          {/* Bio */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trader.story}
            </p>
          </div>

          {/* Famous Trade */}
          <div
            className="rounded-xl p-4"
            style={{
              background: `${style.color}08`,
              border: `1px solid ${style.color}25`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" style={{ color: style.color }} />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: style.color }}
              >
                The Famous Trade
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trader.famousTrade}
            </p>
          </div>

          {/* Key Lessons */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: style.color }}
            >
              Key Lessons
            </p>
            <ul className="space-y-1.5">
              {trader.keyLessons.map((lesson) => (
                <li
                  key={lesson.slice(0, 40)}
                  className="flex items-start gap-2"
                >
                  <span
                    className="text-xs mt-0.5"
                    style={{ color: style.color }}
                  >
                    ▸
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {lesson}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <blockquote
            className="rounded-lg p-4 relative"
            style={{
              background: "oklch(0.13 0.01 260)",
              border: `1px solid ${style.color}20`,
              borderLeft: `3px solid ${style.color}`,
            }}
          >
            <span
              className="text-3xl font-serif leading-none absolute -top-1 left-3 opacity-30"
              style={{ color: style.color }}
            >
              &ldquo;
            </span>
            <p
              className="text-sm italic leading-relaxed pl-3"
              style={{ color: "oklch(0.75 0.03 260)" }}
            >
              {trader.quote}
            </p>
            <p
              className="text-xs font-bold mt-2 pl-3"
              style={{ color: style.color }}
            >
              — {trader.name}
            </p>
          </blockquote>

          {/* DemonZeno Connection */}
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
                style={{ color: style.color }}
              >
                DemonZeno says:
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {trader.demonzenoConnection}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── All Trader Profiles Grid ─────────────────────────────────────────────────
export function AllTraderProfiles() {
  return (
    <section className="py-12 px-4" data-ocid="traders.all_profiles.section">
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#f59e0b" }}
        >
          The Legends of the Market
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-black text-foreground mb-3">
          Top 5 Traders <span style={{ color: "#f59e0b" }}>in the World</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          These five traders represent the pinnacle of market mastery across
          different eras, strategies, and asset classes. Study their methods.
          Learn their mindset. Apply their discipline.
        </p>
        <p
          className="text-xs italic mt-3"
          style={{ color: "oklch(0.55 0.04 260)" }}
        >
          &ldquo;In DemonZeno we study the greats — not to copy them, but to
          understand what separates legends from losers.&rdquo;
        </p>
      </div>

      {/* Tier Legend */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Object.entries(TIER_STYLES).map(([key, s]) => (
          <span
            key={key}
            className={`text-xs px-3 py-1 rounded-full border font-medium ${s.badge}`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Cards */}
      <div className="max-w-3xl mx-auto space-y-4">
        {TRADER_PROFILES.map((trader) => (
          <FullTraderCard key={trader.name} trader={trader} />
        ))}
      </div>

      {/* Footer DemonZeno quote */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-sm italic" style={{ color: "oklch(0.5 0.04 260)" }}>
          &ldquo;Every master was once a beginner. Every legend was once
          unknown. Your chapter starts now.&rdquo; — DemonZeno
        </p>
      </div>
    </section>
  );
}

// Re-export data for use in other modules
export { TRADER_PROFILES };
export type { FullTraderProfile };
