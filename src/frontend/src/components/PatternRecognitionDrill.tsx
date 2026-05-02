// ─── Pattern Recognition Drill ────────────────────────────────────────────────

import { Eye } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  AscendingTriangleSVG,
  BullFlagSVG,
  CupHandleSVG,
  DescendingTriangleSVG,
  DojiSVG,
  DoubleBottomSVG,
  DoubleTopSVG,
  HammerSVG,
  HeadAndShouldersSVG,
  SymmetricTriangleSVG,
} from "./ChartPatternDiagrams";

interface Drill {
  patternKey: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DRILLS: Drill[] = [
  {
    patternKey: "headAndShoulders",
    options: ["Double Top", "Head and Shoulders", "Triple Top", "Rising Wedge"],
    correctIndex: 1,
    explanation:
      "The Head & Shoulders shows three peaks — center (head) is tallest. Signals bearish reversal after neckline break.",
  },
  {
    patternKey: "doubleTop",
    options: [
      "Head & Shoulders",
      "Double Bottom",
      "Double Top",
      "Cup & Handle",
    ],
    correctIndex: 2,
    explanation:
      "Double Top forms two equal peaks. Confirms bearish reversal when price breaks the valley between the peaks.",
  },
  {
    patternKey: "doubleBottom",
    options: ["Double Top", "Inverse H&S", "Triple Bottom", "Double Bottom"],
    correctIndex: 3,
    explanation:
      "Double Bottom forms two equal troughs. Bullish reversal pattern confirmed on break above the peak between the bottoms.",
  },
  {
    patternKey: "bullFlag",
    options: ["Pennant", "Bull Flag", "Ascending Triangle", "Cup & Handle"],
    correctIndex: 1,
    explanation:
      "Bull Flag: sharp move up (flag pole), then tight downward consolidation (flag). Bullish continuation on breakout.",
  },
  {
    patternKey: "ascendingTriangle",
    options: [
      "Symmetrical Triangle",
      "Bull Flag",
      "Ascending Triangle",
      "Descending Triangle",
    ],
    correctIndex: 2,
    explanation:
      "Ascending Triangle: flat resistance top with rising lows. Bullish continuation — buyers accumulating pressure below resistance.",
  },
  {
    patternKey: "cupHandle",
    options: [
      "Double Bottom",
      "Rounding Bottom",
      "Symmetrical Triangle",
      "Cup & Handle",
    ],
    correctIndex: 3,
    explanation:
      "Cup & Handle: U-shaped recovery (cup) followed by small pullback (handle). Bullish continuation on handle breakout.",
  },
  {
    patternKey: "doji",
    options: ["Hammer", "Engulfing", "Doji", "Marubozu"],
    correctIndex: 2,
    explanation:
      "Doji: open and close are virtually equal. Signals indecision — watch for the next candle to determine direction.",
  },
  {
    patternKey: "hammer",
    options: ["Doji", "Hammer", "Inverted Hammer", "Shooting Star"],
    correctIndex: 1,
    explanation:
      "Hammer: small body, long lower wick. Bullish reversal signal at the bottom of a downtrend — rejection of lower prices.",
  },
];

const DIAGRAM_MAP: Record<string, ReactNode> = {
  headAndShoulders: <HeadAndShouldersSVG />,
  doubleTop: <DoubleTopSVG />,
  doubleBottom: <DoubleBottomSVG />,
  bullFlag: <BullFlagSVG />,
  ascendingTriangle: <AscendingTriangleSVG />,
  cupHandle: <CupHandleSVG />,
  doji: <DojiSVG />,
  hammer: <HammerSVG />,
  symmetricTriangle: <SymmetricTriangleSVG />,
  descendingTriangle: <DescendingTriangleSVG />,
};

interface PatternRecognitionDrillProps {
  tierColor: string;
}

export function PatternRecognitionDrill({
  tierColor,
}: PatternRecognitionDrillProps) {
  const [drillIdx, setDrillIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const drill = DRILLS[drillIdx];
  const isAnswered = selected !== null;
  const isCorrect = selected === drill?.correctIndex;

  function handleSelect(i: number) {
    if (isAnswered) return;
    setSelected(i);
    if (i === drill?.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (drillIdx + 1 >= DRILLS.length) {
      setDone(true);
    } else {
      setDrillIdx((d) => d + 1);
      setSelected(null);
    }
  }

  function handleReset() {
    setDrillIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (!drill) return null;

  return (
    <div
      className="rounded-xl overflow-hidden my-3"
      style={{
        background: "oklch(0.16 0.01 260)",
        border: `1px solid ${tierColor}30`,
      }}
      data-ocid="academy.pattern_drill"
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{
          background: `${tierColor}10`,
          borderBottom: `1px solid ${tierColor}20`,
        }}
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4" style={{ color: tierColor }} />
          <p
            className="font-display font-bold text-xs uppercase tracking-widest"
            style={{ color: tierColor }}
          >
            Pattern Recognition Drill
          </p>
        </div>
        {!done && (
          <span className="text-xs text-muted-foreground">
            {drillIdx + 1}/{DRILLS.length}
          </span>
        )}
      </div>

      {done ? (
        <div className="p-6 text-center flex flex-col gap-3">
          <p className="text-3xl">🎯</p>
          <p
            className="font-display font-bold text-lg"
            style={{ color: tierColor }}
          >
            {score}/{DRILLS.length} Correct
          </p>
          <p className="text-sm text-muted-foreground">
            {score >= 6
              ? "Excellent pattern recognition! You're ready to trade the charts."
              : "Keep practicing — pattern recognition is a skill that improves with reps."}
          </p>
          <button
            type="button"
            onClick={handleReset}
            data-ocid="academy.pattern_drill.retry"
            className="mx-auto px-4 py-2 rounded-lg text-xs font-bold transition-smooth"
            style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid oklch(0.28 0.01 260)" }}
          >
            {DIAGRAM_MAP[drill.patternKey]}
          </div>
          <p className="text-sm font-semibold text-foreground">
            What chart pattern is shown above?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {drill.options.map((opt, i) => {
              let bg = "oklch(0.20 0.01 260)";
              let border = "1px solid oklch(0.28 0.01 260)";
              let color = "oklch(0.75 0.01 260)";
              if (isAnswered) {
                if (i === drill.correctIndex) {
                  bg = "oklch(0.18 0.10 145)";
                  border = "1px solid oklch(0.55 0.14 145)";
                  color = "oklch(0.72 0.14 145)";
                } else if (i === selected) {
                  bg = "oklch(0.18 0.08 20)";
                  border = "1px solid oklch(0.48 0.15 20)";
                  color = "oklch(0.68 0.15 20)";
                }
              }
              return (
                <button
                  key={`opt-${String(i)}-${opt}`}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelect(i)}
                  data-ocid={`academy.pattern_drill.opt.${i + 1}`}
                  className="px-3 py-2 rounded-lg text-xs font-semibold transition-smooth"
                  style={{ background: bg, border, color }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <>
              <p
                className="text-xs leading-relaxed"
                style={{
                  color: isCorrect
                    ? "oklch(0.70 0.15 145)"
                    : "oklch(0.70 0.15 20)",
                }}
              >
                {isCorrect ? "✓ Correct! " : "✗ Not quite. "}
                {drill.explanation}
              </p>
              <button
                type="button"
                onClick={handleNext}
                data-ocid="academy.pattern_drill.next"
                className="self-end px-4 py-1.5 rounded-lg text-xs font-bold transition-smooth"
                style={{
                  background: tierColor,
                  color: "oklch(0.10 0.01 260)",
                }}
              >
                {drillIdx + 1 >= DRILLS.length ? "Finish" : "Next →"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
