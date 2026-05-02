import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, RefreshCw, Trophy } from "lucide-react";
import { MasteryScoreBadge } from "./MasteryScoreBadge";

const GOLD = "oklch(0.7 0.18 70)";

const DZ_QUOTES: string[] = [
  "You don't need luck. You need discipline, patience, and the DemonZeno edge.",
  "Losses are tuition fees. What matters is whether you graduate.",
  "The market rewards the prepared. Are you prepared?",
  "Every master was once a beginner who refused to quit.",
  "Trade the setup, not the emotion.",
];

function getMasteryLabel(
  pct: number,
  tierName: string,
): { title: string; description: string } {
  if (pct >= 95)
    return {
      title: "Expert",
      description: `You've mastered ${tierName}. DemonZeno is proud of you.`,
    };
  if (pct >= 85)
    return {
      title: "Proficient",
      description: `Excellent grasp of ${tierName} concepts. Impressive!`,
    };
  if (pct >= 70)
    return {
      title: "Competent",
      description: "You understand this tier well. Ready to advance.",
    };
  if (pct >= 50)
    return {
      title: "Developing+",
      description: "Good progress! Some areas need reinforcement.",
    };
  return {
    title: "Developing",
    description:
      "Strong foundation forming. Review weak lessons before advancing.",
  };
}

interface WeakLesson {
  id: string;
  title: string;
  masteryPct: number;
}

interface TierMasteryCompletionProps {
  tierName: string;
  averageMastery: number;
  lessonsCompleted: number;
  totalLessons: number;
  onContinue: () => void;
  onReviewWeakLessons: (lessonId: string) => void;
  weakLessons: WeakLesson[];
}

export function TierMasteryCompletion({
  tierName,
  averageMastery,
  lessonsCompleted,
  totalLessons,
  onContinue,
  onReviewWeakLessons,
  weakLessons,
}: TierMasteryCompletionProps) {
  const mastery = getMasteryLabel(averageMastery, tierName);
  const isReady = averageMastery >= 70;
  const randomQuote =
    DZ_QUOTES[Math.floor(Date.now() / 60_000) % DZ_QUOTES.length];
  const topWeak = weakLessons.slice(0, 3);

  return (
    <div
      data-ocid="academy.tier_completion.panel"
      className="rounded-2xl border p-6 md:p-8 relative overflow-hidden"
      style={{
        background: "oklch(0.18 0.01 260)",
        borderColor: isReady
          ? "oklch(0.7 0.18 70 / 0.5)"
          : "oklch(0.65 0.15 190 / 0.4)",
        boxShadow: isReady
          ? "0 0 40px oklch(0.7 0.18 70 / 0.12)"
          : "0 0 24px oklch(0.65 0.15 190 / 0.1)",
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute top-0 right-0 w-60 h-60 pointer-events-none opacity-10 rounded-full"
        style={{
          background: `radial-gradient(circle at top right, ${GOLD}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5" style={{ color: GOLD }} />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: GOLD }}
            >
              Tier Complete
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
            {tierName} Mastered
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {lessonsCompleted} of {totalLessons} lessons completed
          </p>
        </div>

        {/* Mastery badge — large */}
        <MasteryScoreBadge
          masteryPct={averageMastery}
          size="lg"
          showLabel={true}
          className="self-center sm:self-auto"
        />
      </div>

      {/* Mastery level */}
      <div
        className="rounded-xl p-4 mb-6 border"
        style={{
          background: isReady
            ? "oklch(0.7 0.18 70 / 0.07)"
            : "oklch(0.65 0.15 190 / 0.07)",
          borderColor: isReady
            ? "oklch(0.7 0.18 70 / 0.25)"
            : "oklch(0.65 0.15 190 / 0.25)",
        }}
      >
        <p
          className="font-display font-bold text-lg mb-1"
          style={{ color: isReady ? GOLD : "oklch(0.65 0.15 190)" }}
        >
          {mastery.title}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {mastery.description}
        </p>
      </div>

      {/* Weak lessons (only shown when mastery < 70%) */}
      {!isReady && topWeak.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">
            Review these lessons to boost your mastery:
          </p>
          <ul className="space-y-2">
            {topWeak.map((lesson, i) => (
              <li key={lesson.id} className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    background: "oklch(0.55 0.22 25 / 0.15)",
                    color: "oklch(0.65 0.22 25)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-foreground truncate">
                  {lesson.title}
                </span>
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: "oklch(0.65 0.22 25)" }}
                >
                  {Math.round(lesson.masteryPct)}%
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onReviewWeakLessons(lesson.id)}
                  data-ocid={`academy.tier_completion.review_button.${i + 1}`}
                  className="h-7 px-2.5 text-xs gap-1 shrink-0"
                  style={{ color: "oklch(0.65 0.15 190)" }}
                >
                  <BookOpen className="w-3 h-3" />
                  Review
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3 flex-col sm:flex-row">
        {isReady ? (
          <Button
            type="button"
            onClick={onContinue}
            data-ocid="academy.tier_completion.continue_button"
            className="flex-1 gap-2 h-11 font-bold btn-micro"
            style={{
              background: GOLD,
              color: "oklch(0.14 0.01 260)",
            }}
          >
            Advance to Next Tier
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => topWeak[0] && onReviewWeakLessons(topWeak[0].id)}
              data-ocid="academy.tier_completion.review_weak_button"
              className="flex-1 gap-2 h-11 border-border"
              style={{ color: "oklch(0.65 0.15 190)" }}
            >
              <RefreshCw className="w-4 h-4" />
              Review Weak Lessons
            </Button>
            <Button
              type="button"
              onClick={onContinue}
              data-ocid="academy.tier_completion.continue_anyway_button"
              className="flex-1 gap-2 h-11 font-semibold btn-micro"
              style={{
                background: GOLD,
                color: "oklch(0.14 0.01 260)",
              }}
            >
              Continue Anyway
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* DemonZeno quote */}
      <blockquote
        className="mt-6 pt-5 border-t text-sm italic text-center leading-relaxed"
        style={{
          borderColor: "oklch(0.7 0.18 70 / 0.2)",
          color: "oklch(0.7 0.18 70 / 0.8)",
        }}
      >
        "{randomQuote}"
        <footer
          className="mt-1 text-xs not-italic"
          style={{ color: "oklch(0.5 0.01 260)" }}
        >
          — DemonZeno
        </footer>
      </blockquote>
    </div>
  );
}
