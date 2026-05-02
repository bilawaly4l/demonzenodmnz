import { X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useLessonOfWeek } from "../hooks/useLearningScience";

const GOLD = "oklch(0.7 0.18 70)";

function getDismissKey(lessonId: string): string {
  return `dz_lotw_dismissed_${lessonId}`;
}

function isDismissed(lessonId: string): boolean {
  try {
    return sessionStorage.getItem(getDismissKey(lessonId)) === "1";
  } catch {
    return false;
  }
}

function dismiss(lessonId: string): void {
  try {
    sessionStorage.setItem(getDismissKey(lessonId), "1");
  } catch {
    /* ignore */
  }
}

interface LessonOfWeekBannerProps {
  onLessonClick: (lessonId: string) => void;
}

export function LessonOfWeekBanner({ onLessonClick }: LessonOfWeekBannerProps) {
  const { data: lessonOfWeek, isLoading } = useLessonOfWeek();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lessonOfWeek) return;
    // Check expiry
    if (
      lessonOfWeek.expiresAt &&
      Number(lessonOfWeek.expiresAt) < Date.now() * 1_000_000
    ) {
      return;
    }
    if (isDismissed(lessonOfWeek.lessonId)) return;
    setVisible(true);
  }, [lessonOfWeek]);

  function handleDismiss() {
    if (lessonOfWeek) dismiss(lessonOfWeek.lessonId);
    setVisible(false);
  }

  function handleClick() {
    if (lessonOfWeek) {
      onLessonClick(lessonOfWeek.lessonId);
      handleDismiss();
    }
  }

  if (isLoading || !visible || !lessonOfWeek) return null;

  return (
    <div
      data-ocid="academy.lesson_of_week.panel"
      role="banner"
      className="rounded-xl border p-3.5 flex items-center gap-3 relative overflow-hidden"
      style={{
        background: "oklch(0.7 0.18 70 / 0.06)",
        borderColor: "oklch(0.7 0.18 70 / 0.35)",
        boxShadow: "0 0 24px oklch(0.7 0.18 70 / 0.08)",
      }}
    >
      {/* Gradient accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{
          background: `linear-gradient(180deg, ${GOLD}, oklch(0.65 0.15 70))`,
        }}
        aria-hidden="true"
      />

      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "oklch(0.7 0.18 70 / 0.15)" }}
        aria-hidden="true"
      >
        <Zap className="w-4 h-4" style={{ color: GOLD }} />
      </div>

      <div className="flex-1 min-w-0 pl-1">
        <p
          className="text-xs font-bold uppercase tracking-wider mb-0.5"
          style={{ color: GOLD }}
        >
          DemonZeno recommends this week
        </p>
        <p className="text-sm font-semibold text-foreground truncate">
          {lessonOfWeek.lessonTitle}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.01 260)" }}>
          Tier: {lessonOfWeek.tier}
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        data-ocid="academy.lesson_of_week.primary_button"
        className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all btn-micro"
        style={{
          background: GOLD,
          color: "oklch(0.14 0.01 260)",
        }}
      >
        Start Lesson
      </button>

      <button
        type="button"
        onClick={handleDismiss}
        data-ocid="academy.lesson_of_week.close_button"
        aria-label="Dismiss banner"
        className="shrink-0 ml-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
