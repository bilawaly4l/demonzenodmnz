import { ShieldCheck, ShieldOff } from "lucide-react";
import { useEffect, useState } from "react";

const LS_SHIELD_KEY = "dz_streak_shield";

interface ShieldState {
  hasShield: boolean;
  earnedAt: number | null;
}

function loadShieldState(): ShieldState {
  try {
    const raw = localStorage.getItem(LS_SHIELD_KEY);
    return raw
      ? (JSON.parse(raw) as ShieldState)
      : { hasShield: false, earnedAt: null };
  } catch {
    return { hasShield: false, earnedAt: null };
  }
}

/** Call this from lesson completion logic when user finishes an extra lesson. */
export function grantStreakShield(): void {
  try {
    const state: ShieldState = { hasShield: true, earnedAt: Date.now() };
    localStorage.setItem(LS_SHIELD_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Call this when the shield is consumed (day missed, shield used). */
export function consumeStreakShield(): void {
  try {
    const state: ShieldState = { hasShield: false, earnedAt: null };
    localStorage.setItem(LS_SHIELD_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

interface StreakShieldProps {
  currentStreak: number;
  /** Extra lessons needed beyond daily goal to earn a shield (default: 2) */
  extraLessonsNeeded?: number;
  onEarnShield?: () => void;
  className?: string;
}

export function StreakShield({
  currentStreak,
  extraLessonsNeeded = 2,
  onEarnShield,
  className = "",
}: StreakShieldProps) {
  const [shield, setShield] = useState<ShieldState>({
    hasShield: false,
    earnedAt: null,
  });

  useEffect(() => {
    setShield(loadShieldState());
  }, []);

  const hasShield = shield.hasShield;

  return (
    <div
      data-ocid="streak-shield.panel"
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${
        hasShield
          ? "border-yellow-500/40 bg-yellow-500/8"
          : "border-gray-700/60 bg-gray-800/50"
      } ${className}`}
    >
      {/* Streak count */}
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-orange-400 leading-none">
          {currentStreak}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wide">
          day streak
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-700/60" aria-hidden="true" />

      {/* Shield status */}
      {hasShield ? (
        <div
          data-ocid="streak-shield.active"
          className="flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-yellow-400" />
          <div>
            <p className="text-yellow-300 text-xs font-semibold leading-none">
              Shield Active
            </p>
            <p className="text-yellow-500/60 text-[10px] mt-0.5">
              Your streak is protected today
            </p>
          </div>
        </div>
      ) : (
        <div
          data-ocid="streak-shield.inactive"
          className="flex items-center gap-1.5"
        >
          <ShieldOff className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-gray-400 text-xs font-semibold leading-none">
              No Shield
            </p>
            <p className="text-gray-500 text-[10px] mt-0.5">
              +{extraLessonsNeeded} extra lessons to earn one
            </p>
            {onEarnShield && (
              <button
                type="button"
                data-ocid="streak-shield.earn_button"
                onClick={() => {
                  grantStreakShield();
                  setShield({ hasShield: true, earnedAt: Date.now() });
                  onEarnShield();
                }}
                className="text-[10px] text-yellow-500 hover:text-yellow-400 transition-colors mt-0.5"
              >
                Mark earned
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
