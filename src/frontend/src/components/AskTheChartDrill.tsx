import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartScenario {
  id: string;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctIndex: number;
  outcome: string;
  insight: string;
  SVG: () => React.ReactElement;
}

interface AskTheChartDrillProps {
  tierColor: string;
}

// ─── SVG Scenarios ─────────────────────────────────────────────────────────────

const BG = "oklch(0.15 0.01 260)";
const GREEN = "oklch(0.65 0.18 145)";
const RED = "oklch(0.55 0.22 25)";
const BLUE = "oklch(0.65 0.15 190)";
const MUTED = "oklch(0.55 0.01 260)";
const YELLOW = "oklch(0.80 0.18 75)";

function BullFlagSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bull Flag chart scenario"
    >
      <title>Bull Flag chart scenario</title>
      <rect width="280" height="140" rx="6" fill={BG} />
      {/* Pole — strong upward move */}
      <polyline
        points="20,120 50,50"
        fill="none"
        stroke={GREEN}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Flag — downward consolidation */}
      <polyline
        points="50,50 70,60 90,55 110,65 130,60"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Breakout (hidden — this is the question) */}
      <line
        x1="130"
        y1="60"
        x2="240"
        y2="60"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* Volume bars */}
      {[20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={130 - (i < 3 ? 18 : 8)}
          width="6"
          height={i < 3 ? 18 : 8}
          fill={i < 3 ? GREEN : MUTED}
          opacity="0.5"
        />
      ))}
      <text x="40" y="40" fontSize="8" fill={GREEN} textAnchor="middle">
        Pole
      </text>
      <text x="90" y="50" fontSize="8" fill={BLUE} textAnchor="middle">
        Flag
      </text>
      <text x="185" y="55" fontSize="8" fill={MUTED} textAnchor="middle">
        ?
      </text>
    </svg>
  );
}

function HeadShouldersTopSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Head and Shoulders top"
    >
      <title>Head and Shoulders top</title>
      <rect width="280" height="140" rx="6" fill={BG} />
      <polyline
        points="10,120 40,90 60,100 90,50 120,100 140,88 165,110 200,130"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="30"
        y1="102"
        x2="155"
        y2="102"
        stroke={YELLOW}
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <text x="90" y="44" fontSize="8" fill={MUTED} textAnchor="middle">
        Head
      </text>
      <text x="40" y="84" fontSize="8" fill={MUTED} textAnchor="middle">
        LS
      </text>
      <text x="140" y="82" fontSize="8" fill={MUTED} textAnchor="middle">
        RS
      </text>
      <text x="92" y="115" fontSize="8" fill={YELLOW} textAnchor="middle">
        Neckline
      </text>
      <text x="220" y="128" fontSize="9" fill={MUTED}>
        ?
      </text>
    </svg>
  );
}

function SupportBounceSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Support bounce"
    >
      <title>Support bounce</title>
      <rect width="280" height="140" rx="6" fill={BG} />
      <line
        x1="10"
        y1="100"
        x2="270"
        y2="100"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      <polyline
        points="10,60 50,70 80,100 105,102 130,98 155,100 180,85"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="180"
        y1="85"
        x2="260"
        y2="85"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <text x="140" y="95" fontSize="8" fill={GREEN} textAnchor="middle">
        Support Zone
      </text>
      <text x="220" y="80" fontSize="9" fill={MUTED}>
        ?
      </text>
    </svg>
  );
}

function DescendingTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Descending triangle"
    >
      <title>Descending triangle</title>
      <rect width="280" height="140" rx="6" fill={BG} />
      <line
        x1="20"
        y1="105"
        x2="200"
        y2="105"
        stroke={YELLOW}
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      <line x1="20" y1="50" x2="200" y2="105" stroke={RED} strokeWidth="1.5" />
      <polyline
        points="20,50 50,78 80,64 110,82 140,72 170,82 200,105"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line
        x1="200"
        y1="105"
        x2="260"
        y2="105"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <text x="110" y="65" fontSize="8" fill={RED} textAnchor="middle">
        Falling highs
      </text>
      <text x="110" y="118" fontSize="8" fill={YELLOW} textAnchor="middle">
        Flat support
      </text>
      <text x="240" y="100" fontSize="9" fill={MUTED}>
        ?
      </text>
    </svg>
  );
}

function DoubleBottomSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Double bottom"
    >
      <title>Double bottom</title>
      <rect width="280" height="140" rx="6" fill={BG} />
      <line
        x1="10"
        y1="60"
        x2="270"
        y2="60"
        stroke={YELLOW}
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      <polyline
        points="10,40 50,100 80,105 110,100 140,60 170,100 200,105 230,100 255,50"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="135" y="55" fontSize="8" fill={YELLOW} textAnchor="middle">
        Neckline
      </text>
      <text x="80" y="118" fontSize="8" fill={MUTED} textAnchor="middle">
        Bottom 1
      </text>
      <text x="200" y="118" fontSize="8" fill={MUTED} textAnchor="middle">
        Bottom 2
      </text>
      <text x="255" y="44" fontSize="9" fill={MUTED}>
        ?
      </text>
    </svg>
  );
}

// ─── Scenarios Data ────────────────────────────────────────────────────────────

const SCENARIOS: ChartScenario[] = [
  {
    id: "bull-flag",
    title: "Scenario 1: Flag After Rally",
    description:
      "Price surged 35% in 2 days on strong volume, then formed a tight downward channel over 4 days on decreasing volume.",
    question: "What pattern is forming, and what should happen next?",
    options: [
      "Bearish reversal — price will continue falling in the channel",
      "Bull Flag — expect a breakout upward continuing the original trend",
      "Distribution top — smart money is selling into the rally",
      "Indecision zone — no clear direction, avoid trading",
    ],
    correctIndex: 1,
    outcome:
      "Price broke out to the upside three days later, with volume spiking on the breakout candle. The move extended to 120% of the original pole length above the breakout point.",
    insight:
      "Bull Flags form after strong moves. The decreasing volume during the flag shows sellers aren't in control — just profit-taking. Volume spikes on the breakout confirm institutional participation in the continuation.",
    SVG: BullFlagSVG,
  },
  {
    id: "head-shoulders",
    title: "Scenario 2: Three Peaks",
    description:
      "After a 6-week uptrend, price formed three peaks: a left shoulder at $52k, a head at $58k, and a right shoulder at $54k. A clear neckline connects the two troughs.",
    question:
      "The right shoulder just formed at $54k. What's the most likely next move?",
    options: [
      "Bullish continuation — the higher high structure is still intact",
      "Sideways consolidation — price will range between shoulder and head",
      "Bearish reversal — a neckline breakdown would confirm the pattern",
      "Fakeout setup — wait for a new all-time high before deciding",
    ],
    correctIndex: 2,
    outcome:
      "Price broke below the neckline on high volume. The target price was the head-to-neckline distance projected downward. Price reached the target in 8 trading days — a 22% decline.",
    insight:
      "The Head and Shoulders pattern is most reliable when: (1) the right shoulder is lower than the left, (2) volume was higher on the left shoulder peak than the head, (3) the neckline is roughly horizontal. All three conditions were met here.",
    SVG: HeadShouldersTopSVG,
  },
  {
    id: "support-bounce",
    title: "Scenario 3: Third Touch of Support",
    description:
      "Price has touched a major support level at $42,000 twice over three months, bouncing strongly each time. Price is now approaching the same level for the third time with RSI at 31.",
    question: "What is the highest-probability trade here?",
    options: [
      "Short — third touch of support usually breaks through it",
      "Long at support with a tight SL below — triple support touch with RSI oversold",
      "Wait for price to break support, then short the retest",
      "No trade — avoid third touches as they are unpredictable",
    ],
    correctIndex: 1,
    outcome:
      "Price bounced from $41,800 (within the support zone), rallying 28% over the next two weeks. The RSI oversold reading combined with the third touch of a major support zone provided high-confidence confluence.",
    insight:
      "Third touches of major support are often the best buying opportunities — the level is well-established and RSI oversold on the third touch shows final selling exhaustion. The risk is tight (SL just below support). The reward is substantial (previous bounce magnitudes).",
    SVG: SupportBounceSVG,
  },
  {
    id: "descending-triangle",
    title: "Scenario 4: Tightening Range",
    description:
      "Over 3 weeks, each rally peak is lower than the last, while the lows are consistently holding the same flat support level. Volume is declining throughout.",
    question: "What pattern is this, and what should a trader do?",
    options: [
      "Symmetrical triangle — wait for breakout in either direction",
      "Bullish accumulation — smart money is quietly buying the flat support",
      "Descending triangle — expect bearish breakdown below flat support",
      "Cup and Handle forming — position long before the breakout",
    ],
    correctIndex: 2,
    outcome:
      "Price broke below the flat support level on increased volume after 4 more days of compression. The breakout led to a 19% decline over the following week, measuring the triangle height projected from the breakdown point.",
    insight:
      "Descending triangles form when sellers are increasingly aggressive (lower highs) while buyers keep defending the same level. Eventually, buyers exhaust — the support breaks. The declining volume during formation is normal; the volume spike on breakdown confirms the move.",
    SVG: DescendingTriangleSVG,
  },
  {
    id: "double-bottom",
    title: "Scenario 5: Two Failed Breakdowns",
    description:
      "Price tested the $28,000 level twice over 6 weeks, forming nearly identical lows both times. Between the two lows, price bounced to a resistance level (neckline) at $33,000.",
    question:
      "Price just broke above the $33,000 neckline with high volume. What's the target?",
    options: [
      "Immediate resistance at $35,000 — the recent high acts as a cap",
      "No clear target — wait for price action confirmation",
      "$38,000 — the double bottom target is neckline + bottom-to-neckline distance",
      "Sell the neckline break — it's likely a fakeout",
    ],
    correctIndex: 2,
    outcome:
      "Price hit $38,200 — almost exactly the measured-move target. The double bottom confirmed a trend reversal from the 3-month downtrend. Those who entered on the neckline break with a stop below the neckline achieved a 4:1 risk/reward.",
    insight:
      "The Double Bottom target = the height of the pattern added to the breakout point. Neckline at $33k, bottom at $28k = $5k height. $33k + $5k = $38k target. Always calculate the measured move before entering.",
    SVG: DoubleBottomSVG,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AskTheChartDrill({ tierColor }: AskTheChartDrillProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[scenarioIndex]!;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === scenario.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (scenarioIndex + 1 >= SCENARIOS.length) {
      setCompleted(true);
    } else {
      setScenarioIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setScenarioIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: `${tierColor}08`,
          border: `1px solid ${tierColor}30`,
        }}
        data-ocid="chart_drill.completed_state"
      >
        <div className="text-4xl mb-3">
          {score >= 4 ? "🏆" : score >= 2 ? "🎯" : "📚"}
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-1">
          Drill Complete! {score}/{SCENARIOS.length} Correct
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {score === SCENARIOS.length
            ? "Perfect score! You're reading charts like a pro."
            : score >= 3
              ? "Strong performance. Review the ones you missed."
              : "Keep practicing — chart reading improves with repetition."}
        </p>
        <p className="text-xs italic mb-4" style={{ color: tierColor }}>
          &ldquo;Read the chart, not the news. The truth is in the price.&rdquo;
          — DemonZeno
        </p>
        <button
          type="button"
          onClick={handleRestart}
          data-ocid="chart_drill.restart_button"
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-smooth"
          style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.17 0.01 260)",
        border: `1px solid ${tierColor}30`,
      }}
      data-ocid="chart_drill.section"
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{
          background: `${tierColor}10`,
          borderBottom: `1px solid ${tierColor}25`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📊</span>
          <span
            className="font-display font-bold text-sm"
            style={{ color: tierColor }}
          >
            Ask the Chart — Scenario {scenarioIndex + 1}/{SCENARIOS.length}
          </span>
        </div>
        <span className="text-xs font-semibold" style={{ color: tierColor }}>
          Score: {score}/{SCENARIOS.length}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Scenario Title & Description */}
        <div>
          <h4 className="font-display font-bold text-base text-foreground mb-1">
            {scenario.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Chart SVG */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "oklch(0.14 0.01 260)",
            border: "1px solid oklch(0.25 0.01 260)",
          }}
        >
          <scenario.SVG />
        </div>

        {/* Question */}
        <p className="font-semibold text-sm text-foreground">
          {scenario.question}
        </p>

        {/* Options */}
        <div className="space-y-2" data-ocid="chart_drill.options_list">
          {scenario.options.map((opt, i) => {
            let borderStyle = "1px solid oklch(0.28 0.01 260)";
            let bgStyle = "oklch(0.20 0.01 260)";
            let textStyle = "oklch(0.70 0.01 260)";

            if (revealed) {
              if (i === scenario.correctIndex) {
                borderStyle = "1px solid oklch(0.65 0.18 145 / 0.7)";
                bgStyle = "oklch(0.65 0.18 145 / 0.12)";
                textStyle = "oklch(0.75 0.15 145)";
              } else if (i === selected && i !== scenario.correctIndex) {
                borderStyle = "1px solid oklch(0.55 0.22 25 / 0.7)";
                bgStyle = "oklch(0.55 0.22 25 / 0.10)";
                textStyle = "oklch(0.65 0.18 25)";
              }
            } else if (i === selected) {
              borderStyle = `1px solid ${tierColor}`;
              bgStyle = `${tierColor}15`;
              textStyle = tierColor;
            }

            return (
              <button
                key={opt}
                type="button"
                data-ocid={`chart_drill.option.${i + 1}`}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-smooth flex items-start gap-2"
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  color: textStyle,
                  cursor: revealed ? "default" : "pointer",
                }}
              >
                <span className="shrink-0 font-bold mt-0.5">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="leading-relaxed">{opt}</span>
                {revealed && i === scenario.correctIndex && (
                  <CheckCircle
                    className="w-4 h-4 shrink-0 ml-auto mt-0.5"
                    style={{ color: "oklch(0.65 0.18 145)" }}
                  />
                )}
                {revealed && i === selected && i !== scenario.correctIndex && (
                  <XCircle
                    className="w-4 h-4 shrink-0 ml-auto mt-0.5"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Reveal Button */}
        {!revealed && selected !== null && (
          <button
            type="button"
            data-ocid="chart_drill.reveal_button"
            onClick={handleReveal}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-smooth"
            style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
          >
            Reveal Outcome
          </button>
        )}

        {/* Outcome Reveal */}
        {revealed && (
          <div
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "oklch(0.16 0.02 260)",
              border: `1px solid ${tierColor}30`,
            }}
            data-ocid="chart_drill.outcome_reveal"
          >
            <p
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: tierColor }}
            >
              What Happened Next
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scenario.outcome}
            </p>
            <p
              className="text-xs font-bold uppercase tracking-wider mt-2"
              style={{ color: tierColor }}
            >
              The Insight
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {scenario.insight}
            </p>
            <button
              type="button"
              data-ocid="chart_drill.next_button"
              onClick={handleNext}
              className="mt-2 w-full py-2.5 rounded-xl text-sm font-bold transition-smooth"
              style={{
                background: `${tierColor}20`,
                color: tierColor,
                border: `1px solid ${tierColor}40`,
              }}
            >
              {scenarioIndex + 1 < SCENARIOS.length
                ? "Next Scenario →"
                : "View Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
