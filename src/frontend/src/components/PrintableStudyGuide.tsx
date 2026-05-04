import { Download, Printer } from "lucide-react";
import { useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudyGuideLesson {
  title: string;
  duration: string;
  takeaways: string[];
  dzQuote?: string;
}

interface StudyGuideTier {
  id: string;
  name: string;
  badgeLabel: string;
  color: string;
  description: string;
  lessons: StudyGuideLesson[];
}

interface PrintableStudyGuideProps {
  tier: StudyGuideTier;
  onClose?: () => void;
}

// ─── Key Concepts per Tier ────────────────────────────────────────────────────

const TIER_CONCEPTS: Record<string, string[]> = {
  beginner: [
    "Supply & demand drives price — buyers vs sellers",
    "Every trade needs Entry, SL, and TP before execution",
    "Never risk more than 1–2% of account per trade",
    "Stop Loss is non-negotiable — always set it at entry",
    "Paper trade for 2+ weeks before risking real money",
    "Trade with the trend — not against it",
  ],
  intermediate: [
    "RSI > 70 = overbought; RSI < 30 = oversold",
    "MACD crossover confirms trend direction",
    "Bollinger Band squeeze = big move incoming",
    "Confluence of 4+ factors = highest probability trade",
    "At TP1: close 30-50% and move SL to breakeven",
    "Position Size = (Account × Risk%) ÷ (Entry − SL)",
  ],
  advanced: [
    "Head & Shoulders: most reliable major reversal pattern",
    "Volume confirms breakouts — always check volume",
    "Multi-TF: Daily = trend, 4H = setup, 1H = entry",
    "Golden ratio (0.618 Fibonacci) = strongest buy zone",
    "Divergence at S&R = extremely high probability entry",
    "4 market phases: Accumulation → Markup → Distribution → Markdown",
  ],
  expert: [
    "Supply & Demand zones override traditional S&R",
    "Order flow reveals institutional positioning",
    "Smart Money Concepts: liquidity hunts before real moves",
    "Funding rates signal extreme positioning in crypto",
    "Multi-asset correlation reveals macro risk appetite",
    "Options market shows where large players expect price to go",
  ],
  master: [
    "Reflexivity: markets shape beliefs and beliefs shape markets",
    "Concentrate in your absolute highest conviction ideas",
    "Macro regime determines all asset class behavior",
    "Risk-adjusted returns > raw returns — always",
    "The best trade is sometimes no trade at all",
    "Consistent compounding beats sporadic genius every time",
  ],
};

const DZ_SLOGANS = [
  "The market rewards discipline, not brilliance.",
  "Every master was once a beginner. Your chapter starts now.",
  "Control is the edge. Patience is the strategy.",
  "Trade what you see, not what you feel.",
  "Knowledge is your greatest asset. Guard it like capital.",
  "In DemonZeno we don't chase — we position and wait.",
];

// ─── Component ────────────────────────────────────────────────────────────────

export function PrintableStudyGuide({
  tier,
  onClose,
}: PrintableStudyGuideProps) {
  const keyConcepts = TIER_CONCEPTS[tier.id] ?? TIER_CONCEPTS.beginner!;

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      {/* Print-only styles injected into head */}
      <style>{`
        @media print {
          body > *:not(#study-guide-print) { display: none !important; }
          #study-guide-print { display: block !important; position: fixed; inset: 0; z-index: 99999; background: #fff; padding: 32px; color: #111; }
          #study-guide-print .no-print { display: none !important; }
          #study-guide-print .print-watermark { opacity: 0.07 !important; }
          @page { margin: 16mm; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        style={{ background: "rgba(0,0,0,0.85)" }}
        role="presentation"
      >
        <div
          id="study-guide-print"
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.13 0.01 260)",
            border: `2px solid ${tier.color}40`,
          }}
        >
          {/* Watermark */}
          <div
            className="print-watermark absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none"
            aria-hidden
          >
            <span
              className="font-display font-black text-7xl tracking-wider"
              style={{ color: tier.color }}
            >
              DMNZ
            </span>
          </div>

          <div className="relative z-10 p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2 text-xs font-bold uppercase tracking-widest"
                  style={{ background: `${tier.color}18`, color: tier.color }}
                >
                  {tier.badgeLabel} · Study Guide
                </div>
                <h2 className="font-display font-black text-2xl text-foreground">
                  {tier.name} Tier — Complete Summary
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {tier.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="no-print flex gap-2 shrink-0 ml-4">
                <button
                  type="button"
                  onClick={handlePrint}
                  data-ocid="study_guide.print_button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-smooth"
                  style={{
                    background: `${tier.color}18`,
                    color: tier.color,
                    border: `1px solid ${tier.color}40`,
                  }}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    data-ocid="study_guide.close_button"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-smooth"
                    style={{
                      background: "oklch(0.22 0.01 260)",
                      color: "oklch(0.55 0.01 260)",
                      border: "1px solid oklch(0.30 0.01 260)",
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Key Concepts */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{
                background: `${tier.color}08`,
                border: `1px solid ${tier.color}25`,
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: tier.color }}
              >
                Core Concepts to Master
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {keyConcepts.map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <span
                      className="text-xs mt-0.5 shrink-0"
                      style={{ color: tier.color }}
                    >
                      ▸
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: tier.color }}
              >
                All {tier.lessons.length} Lessons · Key Takeaways
              </p>
              {tier.lessons.map((lesson, i) => (
                <div
                  key={lesson.title}
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.18 0.01 260)",
                    border: "1px solid oklch(0.26 0.01 260)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: `${tier.color}20`,
                        color: tier.color,
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm font-display font-bold text-foreground">
                      {lesson.title}
                    </p>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">
                      {lesson.duration}
                    </span>
                  </div>
                  {lesson.takeaways.slice(0, 3).map((t) => (
                    <div key={t} className="flex items-start gap-2 mb-1">
                      <span
                        className="text-[10px] mt-0.5 shrink-0"
                        style={{ color: tier.color }}
                      >
                        •
                      </span>
                      <span className="text-xs text-muted-foreground">{t}</span>
                    </div>
                  ))}
                  {lesson.dzQuote && (
                    <p
                      className="text-xs italic mt-2 pl-2 border-l-2"
                      style={{
                        color: "oklch(0.60 0.05 260)",
                        borderColor: `${tier.color}50`,
                      }}
                    >
                      &ldquo;{lesson.dzQuote}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* DemonZeno Slogans */}
            <div
              className="mt-6 rounded-xl p-4"
              style={{
                background: `${tier.color}08`,
                border: `1px solid ${tier.color}20`,
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: tier.color }}
              >
                DemonZeno Wisdom
              </p>
              <div className="space-y-2">
                {DZ_SLOGANS.slice(0, 4).map((s) => (
                  <p key={s} className="text-xs italic text-muted-foreground">
                    ⚡ {s}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="mt-6 flex items-center justify-between pt-4"
              style={{ borderTop: "1px solid oklch(0.25 0.01 260)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-display font-black text-sm"
                  style={{ color: tier.color }}
                >
                  DMNZ
                </span>
                <span className="text-xs text-muted-foreground">
                  DemonZeno Trading Academy
                </span>
              </div>
              <div className="no-print flex items-center gap-2">
                <Download
                  className="w-3.5 h-3.5"
                  style={{ color: tier.color }}
                />
                <span className="text-xs" style={{ color: tier.color }}>
                  Use Print → Save as PDF
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
