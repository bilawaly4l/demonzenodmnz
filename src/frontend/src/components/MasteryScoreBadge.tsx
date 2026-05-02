import { cn } from "@/lib/utils";

type MasteryLevel = "Developing" | "Competent" | "Proficient" | "Expert";

function getMasteryLevel(pct: number): MasteryLevel {
  if (pct >= 85) return "Expert";
  if (pct >= 70) return "Proficient";
  if (pct >= 50) return "Competent";
  return "Developing";
}

function getMasteryColor(pct: number): {
  ring: string;
  text: string;
  glow: string;
} {
  if (pct >= 85)
    return {
      ring: "#FFD700",
      text: "text-yellow-400",
      glow: "drop-shadow(0 0 6px #FFD70066)",
    };
  if (pct >= 70)
    return {
      ring: "#22c55e",
      text: "text-green-400",
      glow: "drop-shadow(0 0 6px #22c55e44)",
    };
  if (pct >= 50)
    return {
      ring: "#eab308",
      text: "text-yellow-500",
      glow: "drop-shadow(0 0 4px #eab30844)",
    };
  return {
    ring: "#ef4444",
    text: "text-red-400",
    glow: "drop-shadow(0 0 4px #ef444444)",
  };
}

interface MasteryScoreBadgeProps {
  masteryPct: number;
  /** "sm" = inline in lesson cards, "lg" = tier completion summary */
  size?: "sm" | "lg";
  className?: string;
  showLabel?: boolean;
}

export function MasteryScoreBadge({
  masteryPct,
  size = "sm",
  className,
  showLabel = true,
}: MasteryScoreBadgeProps) {
  const pct = Math.min(100, Math.max(0, masteryPct));
  const level = getMasteryLevel(pct);
  const colors = getMasteryColor(pct);

  // SVG ring maths
  const isLarge = size === "lg";
  const dim = isLarge ? 80 : 48;
  const r = isLarge ? 34 : 20;
  const strokeW = isLarge ? 5 : 3.5;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1",
        isLarge ? "gap-2" : "gap-0.5",
        className,
      )}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        role="img"
        aria-label={`Mastery: ${Math.round(pct)}% — ${level}`}
        style={{ filter: colors.glow }}
      >
        {/* Track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeW}
        />
        {/* Fill */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        {/* Score text */}
        <text
          x={dim / 2}
          y={dim / 2 + (isLarge ? 5 : 3)}
          textAnchor="middle"
          className={cn("font-bold fill-current", colors.text)}
          fontSize={isLarge ? 16 : 10}
          fontFamily="Space Grotesk, sans-serif"
          fill="currentColor"
          style={{ fill: colors.ring }}
        >
          {Math.round(pct)}%
        </text>
      </svg>

      {showLabel && (
        <span
          className={cn(
            "font-semibold tracking-wide uppercase",
            colors.text,
            isLarge ? "text-xs" : "text-[9px]",
          )}
        >
          {level}
        </span>
      )}
    </div>
  );
}
