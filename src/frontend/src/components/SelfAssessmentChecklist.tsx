// ─── Tier Self-Assessment Checklist ──────────────────────────────────────────

import { ChevronDown, ChevronUp, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const CHECKLISTS: Record<string, string[]> = {
  beginner: [
    "I understand what a candlestick represents and can identify common patterns",
    "I can identify support and resistance on a chart without help",
    "I know what RSI, MACD, and Moving Averages measure",
    "I understand risk management and always set a stop loss",
    "I can calculate my position size before entering a trade",
    "I understand the difference between scalping, swing trading, and position trading",
    "I know what a Doji, Hammer, and Engulfing candle mean",
    "I can draw a trend line correctly on a chart",
    "I understand volume and why it matters for confirmation",
    "I have built my first basic trade plan with entry, SL, and TP rules",
  ],
  intermediate: [
    "I can identify Fibonacci retracement levels and know which ones matter most",
    "I understand Bollinger Bands and what a squeeze means",
    "I use multiple timeframes to confirm my trades",
    "I know how to trade breakouts with proper confirmation",
    "I understand the basics of options — calls, puts, and strike prices",
    "I can identify on-chain metrics for crypto (exchange flows, whale wallets)",
    "I have a documented trade journal with at least 20 entries",
    "I understand news trading risks and know how to handle FOMC/CPI",
    "I have a defined risk:reward rule I never break",
    "I understand the DemonZeno signal method and can apply its principles",
  ],
  advanced: [
    "I understand Elliott Wave theory and can identify wave counts",
    "I can identify harmonic patterns (Gartley, Bat, Crab) on a chart",
    "I understand institutional order flow and liquidity sweeps",
    "I can analyze funding rates to gauge market sentiment",
    "I understand options Greeks and how delta, gamma, theta affect my position",
    "I have backtested at least one strategy with 100+ samples",
    "I can analyze the March 2020 crash and Bitcoin 2017 bull run structurally",
    "I manage portfolio-level risk, not just per-trade risk",
    "I understand quantitative analysis basics and can build a simple edge",
    "I have a complete, written trading system I follow consistently",
  ],
  expert: [
    "I understand market microstructure and how price discovery works",
    "I can read Level 2 order book data for tape reading",
    "I understand dark pools and their impact on price action",
    "I can trade cross-asset correlations (DXY vs Gold, BTC vs ETH)",
    "I understand how central bank policy drives macro market cycles",
    "I have studied the Soros Bank of England trade and extracted lessons",
    "I have developed my own trading edge with data to support it",
    "I practice psychological mastery — I don't revenge trade or FOMO",
    "I have expert-level risk protocols that protect capital in all conditions",
    "I understand what separates good traders from elite traders",
  ],
  master: [
    "I can design and backtest a proprietary trading system from scratch",
    "I understand fund-level risk management and portfolio optimization",
    "I apply statistical edge and probability thinking to every trade decision",
    "I understand basic machine learning concepts relevant to trading",
    "I use advanced position sizing based on Kelly Criterion or equivalent",
    "I can manage drawdowns without emotional decision-making",
    "I have analyzed the greatest trades in history and extracted principles",
    "I understand the DemonZeno Method as a complete trading philosophy",
    "I am psychologically prepared for sustained high-performance trading",
    "I am ready to trade at an elite level or mentor others",
  ],
};

interface SelfAssessmentChecklistProps {
  tierId: string;
  tierColor: string;
  tierName: string;
}

export function SelfAssessmentChecklist({
  tierId,
  tierColor,
  tierName,
}: SelfAssessmentChecklistProps) {
  const [open, setOpen] = useState(false);
  const items = CHECKLISTS[tierId] ?? CHECKLISTS.beginner!;
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(items.length).fill(false),
  );

  const score = checked.filter(Boolean).length;
  const ready = score === items.length;

  return (
    <div
      className="rounded-xl overflow-hidden my-4"
      style={{
        background: "oklch(0.17 0.01 260)",
        border: `1px solid ${tierColor}25`,
      }}
      data-ocid="academy.self_assessment"
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/5 transition-smooth"
        onClick={() => setOpen((p) => !p)}
        data-ocid="academy.self_assessment_toggle"
      >
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4" style={{ color: tierColor }} />
          <p
            className="font-display font-bold text-xs uppercase tracking-widest"
            style={{ color: tierColor }}
          >
            Am I Ready for the Next Tier?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: `${tierColor}18`,
              color: tierColor,
            }}
          >
            {score}/{items.length}
          </span>
          {open ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground mb-2">
            Honestly check off every skill you've truly mastered in {tierName}.
            No rushing.
          </p>
          {items.map((item, i) => (
            <label
              key={item}
              htmlFor={`self-check-${i}`}
              className="flex items-start gap-3 cursor-pointer group"
              data-ocid={`academy.self_check.${i + 1}`}
            >
              <button
                id={`self-check-${i}`}
                type="button"
                className="w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center border transition-smooth bg-transparent p-0"
                style={{
                  background: checked[i] ? tierColor : "transparent",
                  borderColor: checked[i] ? tierColor : "oklch(0.35 0.01 260)",
                }}
                onClick={() =>
                  setChecked((prev) =>
                    prev.map((v, idx) => (idx === i ? !v : v)),
                  )
                }
                aria-label={item}
                aria-pressed={checked[i]}
              >
                {checked[i] && (
                  <svg
                    viewBox="0 0 12 12"
                    className="w-3 h-3"
                    fill="oklch(0.10 0.01 260)"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>Checked</title>
                    <polyline
                      points="1.5,6 4.5,9 10.5,3"
                      fill="none"
                      stroke="oklch(0.10 0.01 260)"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
              <p
                className="text-xs leading-relaxed transition-smooth"
                style={{
                  color: checked[i] ? tierColor : "oklch(0.65 0.01 260)",
                }}
              >
                {item}
              </p>
            </label>
          ))}
          {ready && (
            <div
              className="mt-3 rounded-xl px-4 py-3 text-center"
              style={{
                background: `${tierColor}12`,
                border: `1px solid ${tierColor}30`,
              }}
            >
              <p
                className="font-display font-bold text-sm"
                style={{ color: tierColor }}
              >
                🏆 You're ready. Take the quiz and earn your certificate.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
