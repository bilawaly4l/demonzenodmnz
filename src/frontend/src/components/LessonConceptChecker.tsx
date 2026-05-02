import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface LessonConceptCheckerProps {
  questions: Question[];
  tierColor: string;
  lessonTitle: string;
  onPass: () => void;
}

export function LessonConceptChecker({
  questions,
  tierColor,
  lessonTitle,
  onPass,
}: LessonConceptCheckerProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [passed, setPassed] = useState(false);

  const q = questions[current];
  const isAnswered = selected !== null;
  const isCorrect = selected === q?.answer;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
  }

  function handleNext() {
    const newAnswers = [...answers, selected === q?.answer];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      const allCorrect = newAnswers.every(Boolean);
      setPassed(allCorrect);
      setShowResult(true);
      if (allCorrect) onPass();
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setPassed(false);
  }

  if (!q) return null;

  return (
    <div
      className="rounded-xl p-4 mt-4"
      style={{
        background: "oklch(0.15 0.02 260)",
        border: `1px solid ${tierColor}25`,
      }}
      data-ocid="academy.lesson.concept_checker"
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle
          className="w-4 h-4 shrink-0"
          style={{ color: tierColor }}
        />
        <p
          className="font-display font-bold text-sm"
          style={{ color: tierColor }}
        >
          Concept Check — Before You Continue
        </p>
        <span className="text-xs text-muted-foreground ml-auto">
          {current + 1}/{questions.length}
        </span>
      </div>

      {!showResult ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground leading-relaxed">
            {q.question}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt, i) => {
              let bg = "oklch(0.20 0.01 260)";
              let border = "1px solid oklch(0.28 0.01 260)";
              let color = "oklch(0.75 0.01 260)";
              if (isAnswered) {
                if (i === q.answer) {
                  bg = "oklch(0.20 0.12 145)";
                  border = "1px solid oklch(0.55 0.14 145)";
                  color = "oklch(0.75 0.14 145)";
                } else if (i === selected) {
                  bg = "oklch(0.20 0.10 20)";
                  border = "1px solid oklch(0.50 0.15 20)";
                  color = "oklch(0.70 0.15 20)";
                }
              } else if (selected === i) {
                bg = `${tierColor}20`;
                border = `1px solid ${tierColor}70`;
                color = tierColor;
              }
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={isAnswered}
                  className="text-left px-3 py-2.5 rounded-lg text-sm transition-smooth"
                  style={{ background: bg, border, color }}
                >
                  <span className="font-bold mr-1.5">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                style={{
                  background: isCorrect
                    ? "oklch(0.18 0.10 145)"
                    : "oklch(0.18 0.10 20)",
                  color: isCorrect
                    ? "oklch(0.70 0.15 145)"
                    : "oklch(0.70 0.15 20)",
                }}
              >
                {isCorrect ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {isCorrect ? "Correct!" : "Incorrect — review this concept"}
              </div>
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-smooth"
                style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
                data-ocid="academy.lesson.concept_checker_next"
              >
                {current + 1 >= questions.length ? "Finish" : "Next →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-3 flex flex-col gap-3">
          {passed ? (
            <>
              <div className="text-3xl">🎉</div>
              <p className="font-display font-bold text-foreground">
                All correct! Next lesson unlocked.
              </p>
              <p className="text-xs text-muted-foreground">
                You've demonstrated understanding of{" "}
                <strong>{lessonTitle}</strong>
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl">📚</div>
              <p className="font-display font-bold text-foreground">
                Not quite — review the lesson above
              </p>
              <p className="text-xs text-muted-foreground">
                You need all 3 correct to unlock the next lesson. Re-read the
                content and try again.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mx-auto px-4 py-2 rounded-lg text-sm font-semibold transition-smooth"
                style={{ background: tierColor, color: "oklch(0.10 0.01 260)" }}
                data-ocid="academy.lesson.concept_checker_retry"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
