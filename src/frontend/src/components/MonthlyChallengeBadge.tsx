import { cn } from "@/lib/utils";

const GOLD = "oklch(0.7 0.18 70)";
const SILVER = "oklch(0.70 0.01 260)";

interface MonthlyChallengeBadgeProps {
  month: string;
  lessonsCompleted: number;
  targetLessons?: number;
  badgeEarned: boolean;
  className?: string;
}

function ProgressRing({
  pct,
  earned,
  completed,
  target,
}: {
  pct: number;
  earned: boolean;
  completed: number;
  target: number;
}) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const ringColor = earned ? GOLD : SILVER;

  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Track */}
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="oklch(0.25 0.01 260)"
        strokeWidth="6"
      />
      {/* Fill */}
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={ringColor}
        strokeWidth="6"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      {/* Center text */}
      <text
        x="48"
        y="44"
        textAnchor="middle"
        fontSize="15"
        fontWeight="bold"
        fontFamily="Space Grotesk, sans-serif"
        fill={ringColor}
      >
        {completed}
      </text>
      <text
        x="48"
        y="60"
        textAnchor="middle"
        fontSize="10"
        fontFamily="DM Sans, sans-serif"
        fill="oklch(0.55 0.01 260)"
      >
        /{target}
      </text>
    </svg>
  );
}

export function MonthlyChallengeBadge({
  month,
  lessonsCompleted,
  targetLessons = 10,
  badgeEarned,
  className,
}: MonthlyChallengeBadgeProps) {
  const pct = Math.min(100, (lessonsCompleted / targetLessons) * 100);
  const remaining = Math.max(0, targetLessons - lessonsCompleted);

  return (
    <div
      data-ocid="academy.monthly_challenge.card"
      className={cn("rounded-xl border p-4 flex items-center gap-4", className)}
      style={{
        background: badgeEarned
          ? "oklch(0.7 0.18 70 / 0.06)"
          : "oklch(0.18 0.01 260)",
        borderColor: badgeEarned
          ? "oklch(0.7 0.18 70 / 0.4)"
          : "oklch(0.28 0.01 260)",
        boxShadow: badgeEarned ? "0 0 20px oklch(0.7 0.18 70 / 0.1)" : "none",
      }}
    >
      <ProgressRing
        pct={pct}
        earned={badgeEarned}
        completed={lessonsCompleted}
        target={targetLessons}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {badgeEarned && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
              style={{ color: GOLD }}
              aria-hidden="true"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          )}
          <p
            className="font-display font-bold text-sm"
            style={{ color: badgeEarned ? GOLD : "oklch(0.85 0.01 260)" }}
          >
            {badgeEarned ? "Challenge Complete!" : "Monthly Challenge"}
          </p>
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ color: "oklch(0.55 0.01 260)" }}
        >
          {month}
        </p>

        {badgeEarned ? (
          <p className="text-xs font-semibold mt-1" style={{ color: GOLD }}>
            {targetLessons}/{targetLessons} lessons — Badge earned!
          </p>
        ) : (
          <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.01 260)" }}>
            {remaining > 0
              ? `${remaining} more lesson${remaining !== 1 ? "s" : ""} to earn this month's badge`
              : "All lessons done — keep going!"}
          </p>
        )}
      </div>
    </div>
  );
}
