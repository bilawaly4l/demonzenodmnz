import { useEffect, useState } from "react";

const TIER_DOT: Record<number, string> = {
  1: "oklch(0.7 0.18 145)", // Beginner — green
  2: "oklch(0.65 0.15 190)", // Intermediate — blue
  3: "oklch(0.65 0.18 295)", // Advanced — purple
  4: "oklch(0.65 0.22 50)", // Expert — orange
  5: "oklch(0.7 0.18 70)", // Master — gold
};

interface YouAreHereIndicatorProps {
  tierName: string;
  lessonNumber: number;
  totalLessons: number;
  tierNumber: number;
}

export function YouAreHereIndicator({
  tierName,
  lessonNumber,
  totalLessons,
  tierNumber,
}: YouAreHereIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dotColor = TIER_DOT[tierNumber] ?? "oklch(0.65 0.15 190)";

  return (
    <div
      data-ocid="lesson.you_are_here.panel"
      aria-live="polite"
      aria-label={`You are here: Tier ${tierNumber} of 5, Lesson ${lessonNumber} of ${totalLessons}`}
      className="fixed bottom-6 right-4 z-40 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <div
        className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg border"
        style={{
          background: "oklch(0.18 0.01 260 / 0.95)",
          borderColor: "oklch(0.28 0.01 260)",
          backdropFilter: "blur(8px)",
          color: "oklch(0.75 0.01 260)",
        }}
      >
        {/* Tier dot */}
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: dotColor }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline" style={{ color: dotColor }}>
          {tierName}
        </span>
        <span className="opacity-50" aria-hidden="true">
          ·
        </span>
        <span>
          Tier {tierNumber}
          <span className="opacity-50">/5</span> — Lesson {lessonNumber}
          <span className="opacity-50">/{totalLessons}</span>
        </span>
      </div>
    </div>
  );
}
