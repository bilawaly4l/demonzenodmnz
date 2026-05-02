import { Star } from "lucide-react";

interface LessonConfidenceRatingProps {
  tierId: string;
  lessonId: string;
  currentRating: number;
  tierColor: string;
  onRate: (rating: number) => void;
}

export function LessonConfidenceRating({
  tierId: _tierId,
  lessonId: _lessonId,
  currentRating,
  tierColor,
  onRate,
}: LessonConfidenceRatingProps) {
  const LABELS = [
    "",
    "Just Starting",
    "Getting It",
    "Understand",
    "Confident",
    "Mastered!",
  ];

  return (
    <div
      className="rounded-xl p-4 mt-4"
      style={{
        background: "oklch(0.16 0.01 260)",
        border: `1px solid ${tierColor}18`,
      }}
      data-ocid="academy.lesson.confidence_rating"
    >
      <p
        className="font-display font-bold text-xs uppercase tracking-wider mb-2"
        style={{ color: tierColor }}
      >
        How confident are you in this material?
      </p>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} stars: ${LABELS[star]}`}
            onClick={() => onRate(star)}
            data-ocid={`academy.lesson.confidence_star.${star}`}
            className="transition-smooth hover:scale-110"
          >
            <Star
              className="w-5 h-5"
              style={{
                color:
                  star <= currentRating ? tierColor : "oklch(0.30 0.01 260)",
                fill: star <= currentRating ? tierColor : "none",
              }}
            />
          </button>
        ))}
        {currentRating > 0 && (
          <span className="text-xs ml-1" style={{ color: tierColor }}>
            {LABELS[currentRating]}
          </span>
        )}
      </div>
    </div>
  );
}
