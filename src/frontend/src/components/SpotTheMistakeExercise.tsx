// ─── Spot the Mistake Exercise ────────────────────────────────────────────────

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface SpotTheMistakeExerciseProps {
  scenario: string;
  question: string;
  mistakes: string[];
  correctIndex: number;
  explanation: string;
  tierColor: string;
}

export function SpotTheMistakeExercise({
  scenario,
  question,
  mistakes,
  correctIndex,
  explanation,
  tierColor,
}: SpotTheMistakeExerciseProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isAnswered = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div
      className="rounded-xl overflow-hidden my-3"
      style={{
        background: "oklch(0.16 0.02 260)",
        border: "1px solid oklch(0.55 0.15 70 / 0.30)",
      }}
      data-ocid="academy.lesson.spot_mistake"
    >
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{
          background: "oklch(0.18 0.06 70 / 0.35)",
          borderBottom: "1px solid oklch(0.45 0.12 70 / 0.30)",
        }}
      >
        <AlertTriangle
          className="w-4 h-4"
          style={{ color: "oklch(0.75 0.18 70)" }}
        />
        <p
          className="font-display font-bold text-xs uppercase tracking-widest"
          style={{ color: "oklch(0.75 0.18 70)" }}
        >
          Spot the Mistake
        </p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div
          className="rounded-lg p-3"
          style={{
            background: "oklch(0.20 0.02 260)",
            border: "1px solid oklch(0.28 0.02 260)",
          }}
        >
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Trade Setup
          </p>
          <p className="text-sm text-foreground leading-relaxed">{scenario}</p>
        </div>
        <p className="text-sm font-semibold" style={{ color: tierColor }}>
          {question}
        </p>
        <div className="flex flex-col gap-1.5">
          {mistakes.map((opt, i) => {
            let bg = "oklch(0.20 0.01 260)";
            let border = "1px solid oklch(0.28 0.01 260)";
            let color = "oklch(0.75 0.01 260)";
            if (isAnswered) {
              if (i === correctIndex) {
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
                key={`mistake-opt-${String(i)}-${opt}`}
                type="button"
                disabled={isAnswered}
                onClick={() => setSelected(i)}
                data-ocid={`academy.lesson.spot_mistake_opt.${i + 1}`}
                className="text-left px-3 py-2 rounded-lg text-xs transition-smooth"
                style={{ background: bg, border, color }}
              >
                <span className="font-bold mr-1">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {isAnswered && (
          <div
            className="rounded-lg px-3 py-2.5 flex items-start gap-2 text-xs"
            style={{
              background: isCorrect
                ? "oklch(0.18 0.10 145)"
                : "oklch(0.18 0.10 20)",
              color: isCorrect ? "oklch(0.75 0.14 145)" : "oklch(0.75 0.15 20)",
            }}
          >
            {isCorrect ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            )}
            <span>{explanation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
