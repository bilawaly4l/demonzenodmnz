import { X } from "lucide-react";
import { useEffect, useState } from "react";

const LS_DISMISSED_PREFIX = "dz_srs_dismissed_";

interface SpacedRepetitionBannerProps {
  lessonId: string;
  lessonTitle: string;
  tier: string;
  daysAgo: number;
  onReview: () => void;
  onDismiss?: () => void;
}

export function SpacedRepetitionBanner({
  lessonId,
  lessonTitle,
  tier,
  daysAgo,
  onReview,
  onDismiss,
}: SpacedRepetitionBannerProps) {
  const storageKey = `${LS_DISMISSED_PREFIX}${lessonId}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (!dismissed) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, [storageKey]);

  function handleDismiss() {
    try {
      localStorage.setItem(storageKey, Date.now().toString());
    } catch {
      /* ignore */
    }
    setVisible(false);
    onDismiss?.();
  }

  if (!visible) return null;

  return (
    <div
      data-ocid="spaced-rep.banner"
      className="relative flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/8 px-4 py-3 shadow-lg"
      role="alert"
    >
      {/* Icon + copy */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="text-2xl select-none" aria-hidden="true">
          🔁
        </span>
        <div className="min-w-0">
          <p className="text-yellow-300 font-semibold text-sm leading-snug">
            Time to review:{" "}
            <span className="text-yellow-200">{lessonTitle}</span>
          </p>
          <p className="text-yellow-500/80 text-xs mt-0.5">
            {tier} · completed {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago ·
            your confidence was low
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-8 sm:ml-0">
        <button
          type="button"
          data-ocid="spaced-rep.review_button"
          onClick={onReview}
          className="rounded-lg bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1.5 transition-colors"
        >
          Review Now
        </button>
        <button
          type="button"
          data-ocid="spaced-rep.skip_button"
          onClick={handleDismiss}
          className="rounded-lg border border-yellow-500/30 text-yellow-500/80 hover:text-yellow-400 text-xs px-3 py-1.5 transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Close */}
      <button
        type="button"
        aria-label="Dismiss review reminder"
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-yellow-500/50 hover:text-yellow-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
