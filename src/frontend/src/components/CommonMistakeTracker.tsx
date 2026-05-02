import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

const LS_ERRORS_KEY = "dz_concept_errors";

export interface ConceptError {
  lessonId: string;
  questionText: string;
  wrongAnswerText: string;
  count: number;
}

function loadErrors(): ConceptError[] {
  try {
    const raw = localStorage.getItem(LS_ERRORS_KEY);
    return raw ? (JSON.parse(raw) as ConceptError[]) : [];
  } catch {
    return [];
  }
}

/** Utility exported for use by concept-checker logic elsewhere. */
export function recordConceptError(
  lessonId: string,
  questionText: string,
  wrongAnswerText: string,
): void {
  try {
    const errors = loadErrors();
    const idx = errors.findIndex(
      (e) => e.lessonId === lessonId && e.questionText === questionText,
    );
    if (idx >= 0) {
      errors[idx].count += 1;
      errors[idx].wrongAnswerText = wrongAnswerText;
    } else {
      errors.push({ lessonId, questionText, wrongAnswerText, count: 1 });
    }
    localStorage.setItem(LS_ERRORS_KEY, JSON.stringify(errors));
  } catch {
    /* ignore */
  }
}

interface CommonMistakeTrackerProps {
  onReviewLesson?: (lessonId: string) => void;
  className?: string;
}

export function CommonMistakeTracker({
  onReviewLesson,
  className = "",
}: CommonMistakeTrackerProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<ConceptError[]>([]);

  useEffect(() => {
    const loaded = loadErrors();
    const sorted = [...loaded].sort((a, b) => b.count - a.count).slice(0, 3);
    setErrors(sorted);
  }, []);

  function handleReset() {
    try {
      localStorage.removeItem(LS_ERRORS_KEY);
    } catch {
      /* ignore */
    }
    setErrors([]);
  }

  if (errors.length === 0) return null;

  return (
    <div
      data-ocid="mistake-tracker.panel"
      className={`rounded-xl border border-red-500/30 bg-red-500/8 overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        type="button"
        data-ocid="mistake-tracker.toggle"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-red-500/10 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            ⚠️
          </span>
          <span className="text-red-400 font-semibold text-sm">
            Common Mistakes ({errors.length})
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-red-400/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-red-400/60" />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {errors.map((err, i) => (
            <div
              key={`${err.lessonId}-${i}`}
              data-ocid={`mistake-tracker.item.${i + 1}`}
              className="rounded-lg bg-gray-900/60 border border-red-500/20 p-3 flex flex-col gap-1"
            >
              <p className="text-gray-200 text-xs font-medium leading-snug line-clamp-2">
                {err.questionText}
              </p>
              <p className="text-red-400/80 text-xs">
                Your answer:{" "}
                <span className="text-red-300">{err.wrongAnswerText}</span>
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-red-500/60 text-xs">
                  Repeated{" "}
                  <strong className="text-red-400">{err.count}×</strong>
                </span>
                {onReviewLesson && (
                  <button
                    type="button"
                    data-ocid={`mistake-tracker.review_button.${i + 1}`}
                    onClick={() => onReviewLesson(err.lessonId)}
                    className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold transition-colors"
                  >
                    Review lesson →
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            data-ocid="mistake-tracker.reset_button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors self-start"
          >
            <RotateCcw className="w-3 h-3" />
            Reset mistake tracker
          </button>
        </div>
      )}
    </div>
  );
}
