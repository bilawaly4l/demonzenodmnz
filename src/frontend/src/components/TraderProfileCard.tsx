// ─── Famous Trader Profile Card ───────────────────────────────────────────────

import { TrendingUp } from "lucide-react";

interface TraderProfile {
  name: string;
  era: string;
  story: string;
  keyLesson: string;
  quote: string;
}

interface TraderProfileCardProps {
  profile: TraderProfile;
  tierColor: string;
}

export function TraderProfileCard({
  profile,
  tierColor,
}: TraderProfileCardProps) {
  return (
    <div
      className="rounded-xl p-4 my-3"
      style={{
        background: "oklch(0.17 0.02 260)",
        border: `1px solid ${tierColor}25`,
      }}
      data-ocid="academy.lesson.trader_profile"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${tierColor}20`, color: tierColor }}
        >
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p
            className="font-display font-bold text-sm"
            style={{ color: tierColor }}
          >
            🏆 Famous Trader: {profile.name}
          </p>
          <p className="text-xs text-muted-foreground">{profile.era}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {profile.story}
      </p>
      <div
        className="rounded-lg px-3 py-2 mb-2"
        style={{
          background: `${tierColor}10`,
          border: `1px solid ${tierColor}25`,
        }}
      >
        <p
          className="text-xs font-bold mb-0.5 uppercase tracking-wider"
          style={{ color: tierColor }}
        >
          Key Lesson
        </p>
        <p className="text-xs text-muted-foreground">{profile.keyLesson}</p>
      </div>
      {profile.quote && (
        <p
          className="text-xs italic mt-2"
          style={{ color: "oklch(0.65 0.05 260)" }}
        >
          &ldquo;{profile.quote}&rdquo;
        </p>
      )}
    </div>
  );
}
