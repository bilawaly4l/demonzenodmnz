import { Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const LS_GOAL_KEY = "dz_weekly_goal";
const LS_COMPLETED_KEY = "dz_weekly_completed";

function getMondayTimestamp(): number {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}

interface GoalData {
  goal: number;
  completed: number;
  weekStart: number;
}

function loadGoalData(): GoalData {
  try {
    const raw = localStorage.getItem(LS_GOAL_KEY);
    const completedRaw = localStorage.getItem(LS_COMPLETED_KEY);
    const thisWeek = getMondayTimestamp();
    const goal = raw ? Math.max(1, Math.min(7, Number(raw))) : 3;
    const parsed = completedRaw
      ? (JSON.parse(completedRaw) as { weekStart: number; count: number })
      : null;
    const completed = parsed?.weekStart === thisWeek ? parsed.count : 0;
    return { goal, completed, weekStart: thisWeek };
  } catch {
    return { goal: 3, completed: 0, weekStart: getMondayTimestamp() };
  }
}

function saveGoal(goal: number) {
  try {
    localStorage.setItem(LS_GOAL_KEY, String(goal));
  } catch {
    /* ignore */
  }
}

function getMotivationalMessage(
  completed: number,
  goal: number,
): { text: string; color: string } {
  if (completed === 0)
    return {
      text: "Set your goal and start learning!",
      color: "text-muted-foreground",
    };
  const pct = completed / goal;
  if (completed >= goal)
    return {
      text: "🔥 You crushed it this week!",
      color: "text-[oklch(0.7_0.18_145)]",
    };
  if (pct >= 0.75)
    return { text: "💪 Almost there — keep going!", color: "text-primary" };
  if (pct >= 0.5)
    return { text: "📈 On track! Keep the momentum.", color: "text-primary" };
  if (pct >= 0.25)
    return {
      text: "⚡ Good start — stay consistent!",
      color: "text-[oklch(0.65_0.15_70)]",
    };
  return {
    text: "🎯 You've started — every lesson counts!",
    color: "text-muted-foreground",
  };
}

interface WeeklyStudyGoalProps {
  /** Optional: externally-tracked completed count this week (overrides internal counter) */
  externalCompleted?: number;
  /** Called when goal value changes */
  onGoalChange?: (goal: number) => void;
  className?: string;
}

export function WeeklyStudyGoal({
  externalCompleted,
  onGoalChange,
  className = "",
}: WeeklyStudyGoalProps) {
  const initial = useMemo(() => loadGoalData(), []);
  const [goal, setGoal] = useState(initial.goal);
  const [completed] = useState(initial.completed);
  const [editing, setEditing] = useState(false);
  const [draftGoal, setDraftGoal] = useState(initial.goal);

  // Reset if week rolled over
  useEffect(() => {
    const id = setInterval(() => {
      const thisWeek = getMondayTimestamp();
      if (thisWeek !== initial.weekStart) {
        // Force reload
        window.location.reload();
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [initial.weekStart]);

  const effectiveCompleted = externalCompleted ?? completed;
  const pct = Math.min(1, goal > 0 ? effectiveCompleted / goal : 0);
  const { text: motivationText, color: motivationColor } =
    getMotivationalMessage(effectiveCompleted, goal);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  // Convert Sunday=0 to index 6, Mon=1 to index 0
  const todayIdx = today === 0 ? 6 : today - 1;

  function handleSaveGoal() {
    setGoal(draftGoal);
    saveGoal(draftGoal);
    onGoalChange?.(draftGoal);
    setEditing(false);
  }

  return (
    <div
      data-ocid="weekly-goal.card"
      className={`bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground">
              Weekly Study Goal
            </p>
            <p className="text-xs text-muted-foreground">Resets every Monday</p>
          </div>
        </div>
        <button
          type="button"
          data-ocid="weekly-goal.edit_button"
          onClick={() => {
            setDraftGoal(goal);
            setEditing(true);
          }}
          className="text-xs text-primary hover:underline font-semibold shrink-0"
          aria-label="Set weekly goal"
        >
          Set Goal
        </button>
      </div>

      {/* Goal editor */}
      {editing && (
        <div
          data-ocid="weekly-goal.editor"
          className="bg-muted/30 rounded-xl border border-primary/20 p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">
              Lessons per week
            </p>
            <span className="font-display font-black text-primary text-lg">
              {draftGoal}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={draftGoal}
            onChange={(e) => setDraftGoal(Number(e.target.value))}
            data-ocid="weekly-goal.slider"
            aria-label="Lessons per week"
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 lesson</span>
            <span>7 lessons</span>
          </div>
          <button
            type="button"
            data-ocid="weekly-goal.save_button"
            onClick={handleSaveGoal}
            className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-xs py-2 hover:opacity-90 transition-opacity"
          >
            Save Goal
          </button>
        </div>
      )}

      {/* Progress info */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <span className="font-display font-black text-2xl text-foreground">
            {effectiveCompleted}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            {" "}
            / {goal}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">lessons this week</span>
      </div>

      {/* Progress bar */}
      <div
        className="h-2.5 bg-muted/50 rounded-full overflow-hidden"
        role="progressbar"
        tabIndex={0}
        aria-valuenow={effectiveCompleted}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={`${effectiveCompleted} of ${goal} lessons completed this week`}
      >
        <div
          data-ocid="weekly-goal.progress_bar"
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct * 100}%`,
            background:
              pct >= 1
                ? "oklch(0.7 0.18 145)"
                : pct >= 0.5
                  ? "oklch(0.65 0.15 190)"
                  : "oklch(0.65 0.15 70)",
          }}
        />
      </div>

      {/* Day dots */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {daysOfWeek.map((day, idx) => {
          const isToday = idx === todayIdx;
          const isDone = idx < Math.min(effectiveCompleted, 7);
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  isDone
                    ? "bg-primary"
                    : isToday
                      ? "bg-primary/30"
                      : "bg-muted/50"
                }`}
              />
              <span
                className={`text-[9px] font-mono ${
                  isToday
                    ? "text-primary font-bold"
                    : "text-muted-foreground/60"
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Motivation */}
      <p className={`text-xs font-medium ${motivationColor}`}>
        {motivationText}
      </p>
    </div>
  );
}
