import { Brain } from "lucide-react";
import { useState } from "react";

interface PreCheckQuestion {
  question: string;
  options: string[];
  answer: number;
}

interface LessonPreCheckProps {
  lessonTitle: string;
  questions: PreCheckQuestion[];
  tierColor: string;
  onComplete: () => void;
}

export function LessonPreCheck({
  lessonTitle,
  questions,
  tierColor,
  onComplete,
}: LessonPreCheckProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q?.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
    }
  }

  if (!q) return null;

  return (
    <div
      className="rounded-xl p-4 mb-4"
      style={{
        background: "oklch(0.17 0.02 260)",
        border: `1px solid ${tierColor}20`,
      }}
      data-ocid="academy.lesson.pre_check"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4" style={{ color: tierColor }} />
        <p
          className="font-display font-bold text-xs uppercase tracking-wider"
          style={{ color: tierColor }}
        >
          Pre-Lesson Knowledge Check
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Quick gauge of what you already know about{" "}
        <strong className="text-foreground">{lessonTitle}</strong>. No pressure
        — just check your starting point.
      </p>

      {!done ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">{q.question}</p>
          <div className="grid grid-cols-1 gap-1.5">
            {q.options.map((opt, i) => {
              let style = {
                background: "oklch(0.20 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
                color: "oklch(0.75 0.01 260)",
              };
              if (selected !== null) {
                if (i === q.answer) {
                  style = {
                    background: "oklch(0.18 0.10 145)",
                    border: "1px solid oklch(0.55 0.14 145)",
                    color: "oklch(0.72 0.14 145)",
                  };
                } else if (i === selected) {
                  style = {
                    background: "oklch(0.18 0.08 20)",
                    border: "1px solid oklch(0.48 0.15 20)",
                    color: "oklch(0.68 0.15 20)",
                  };
                }
              } else if (selected === i) {
                style = {
                  background: `${tierColor}18`,
                  border: `1px solid ${tierColor}60`,
                  color: tierColor,
                };
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className="text-left px-3 py-2 rounded-lg text-xs transition-smooth"
                  style={style}
                >
                  <span className="font-bold mr-1">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <button
              type="button"
              onClick={handleNext}
              className="self-end px-4 py-1.5 rounded-lg text-xs font-bold transition-smooth"
              style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
            >
              {current + 1 >= questions.length
                ? "Continue to lesson"
                : "Next →"}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm font-semibold text-foreground">
            {score}/{questions.length} correct before reading. Let's see how you
            do after!
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-3 px-4 py-2 rounded-lg text-xs font-bold transition-smooth"
            style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
            data-ocid="academy.lesson.pre_check_continue"
          >
            Start Learning ↓
          </button>
        </div>
      )}
    </div>
  );
}
