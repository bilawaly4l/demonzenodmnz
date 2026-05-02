import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { MasteryScoreBadge } from "./MasteryScoreBadge";

const LS_DISMISSED_PREFIX = "dz_lpr_dismissed_";

interface WeakLesson {
  lessonId: string;
  title: string;
  masteryPct: number;
}

interface LearningPathRecommendationProps {
  tierName: string;
  averageMastery: number;
  weakLessons: WeakLesson[];
  onReview: (lessonId: string) => void;
}

export function LearningPathRecommendation({
  tierName,
  averageMastery,
  weakLessons,
  onReview,
}: LearningPathRecommendationProps) {
  const storageKey = `${LS_DISMISSED_PREFIX}${tierName}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (averageMastery < 70) {
      try {
        const dismissed = localStorage.getItem(storageKey);
        if (!dismissed) setVisible(true);
      } catch {
        setVisible(true);
      }
    }
  }, [averageMastery, storageKey]);

  function handleDismiss() {
    try {
      localStorage.setItem(storageKey, Date.now().toString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  const top3 = weakLessons
    .slice()
    .sort((a, b) => a.masteryPct - b.masteryPct)
    .slice(0, 3);

  const label =
    averageMastery >= 50
      ? "Competent — room to improve"
      : "Developing — needs more practice";

  return (
    <div
      data-ocid="learning-path.panel"
      className="relative rounded-xl border border-yellow-500/30 bg-yellow-500/6 p-4"
    >
      <button
        type="button"
        aria-label="Dismiss learning path recommendation"
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-yellow-500/40 hover:text-yellow-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-4">
        <MasteryScoreBadge
          masteryPct={averageMastery}
          size="lg"
          className="shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-yellow-300 font-bold text-sm">
            {tierName} Tier — {Math.round(averageMastery)}% Mastery
          </h3>
          <p className="text-yellow-500/70 text-xs mt-0.5">{label}</p>
          <p className="text-gray-400 text-xs mt-1">
            These lessons need more attention before you move on:
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {top3.map((lesson, i) => (
          <div
            key={lesson.lessonId}
            data-ocid={`learning-path.item.${i + 1}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-gray-900/60 border border-yellow-500/15 px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MasteryScoreBadge
                masteryPct={lesson.masteryPct}
                size="sm"
                showLabel={false}
              />
              <span className="text-gray-200 text-xs truncate">
                {lesson.title}
              </span>
            </div>
            <button
              type="button"
              data-ocid={`learning-path.review_button.${i + 1}`}
              onClick={() => onReview(lesson.lessonId)}
              className="shrink-0 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Review →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
