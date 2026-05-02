import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AdminSessionContextValue,
  LessonProgressContextValue,
  LessonsLearnedEntry,
  SoundContextValue,
  ThemeContextValue,
  WeeklyGoal,
} from "../types";

const ADMIN_PASSCODE = "2420075112009BILAWALPRAKRITI";
const CLICK_THRESHOLD = 5;
const THEME_KEY = "dz_theme";
const STREAK_KEY = "dz_streak_date";
const STREAK_DAYS_KEY = "dz_streak_days";
const CONFIDENCE_KEY = "dz_confidence";
const SPACED_REP_KEY = "dz_spaced_rep";
const NOTES_KEY = "dz_lesson_notes";
const STAR_RATINGS_KEY = "dz_star_ratings";
const LESSONS_LOG_KEY = "dz_lessons_log";
const WEEKLY_GOAL_KEY = "dz_weekly_goal";
const COMEBACK_KEY = "dz_last_study";
const SOUND_KEY = "dz_sound";

const AdminSessionContext = createContext<AdminSessionContextValue | null>(
  null,
);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const LessonProgressContext = createContext<LessonProgressContextValue | null>(
  null,
);
const SoundContext = createContext<SoundContextValue | null>(null);

function getISOWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function isSameWeek(weekStart: string): boolean {
  return weekStart === getISOWeekStart();
}

function getStoredTheme(): boolean {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored !== "light";
  } catch {
    return true;
  }
}

function progressKey(tierId: string) {
  return `dz_progress_${tierId}`;
}
function lastKey(tierId: string) {
  return `dz_last_${tierId}`;
}
const BOOKMARKS_KEY = "dz_bookmarks";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  // ── Admin state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("dz_admin_unlocked") === "1";
    } catch {
      return false;
    }
  });
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHeroImageClick = useCallback(() => {
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    setAdminClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= CLICK_THRESHOLD) {
        setShowPasscodeModal(true);
        return 0;
      }
      clickResetTimer.current = setTimeout(() => setAdminClickCount(0), 30000);
      return newCount;
    });
  }, []);

  const submitPasscode = useCallback((passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAdminUnlocked(true);
      setShowPasscodeModal(false);
      try {
        sessionStorage.setItem("dz_admin_unlocked", "1");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const dismissModal = useCallback(() => {
    setShowPasscodeModal(false);
    setAdminClickCount(0);
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem("dz_admin_unlocked");
    } catch {
      /* ignore */
    }
  }, []);

  // ── Theme state
  const [isDark, setIsDark] = useState<boolean>(getStoredTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((v) => !v), []);

  // ── Lesson progress state
  const getLessonProgress = useCallback((tierId: string): string[] => {
    return readJson<string[]>(progressKey(tierId), []);
  }, []);

  // ── Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_KEY) === "on";
    } catch {
      return false;
    }
  });

  const toggleSound = useCallback(() => {
    setSoundEnabled((v) => {
      const next = !v;
      try {
        localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const playTone = useCallback(
    (freq: number, dur: number, gain = 0.15) => {
      if (!soundEnabled) return;
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.value = freq;
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + dur,
        );
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch {
        /* ignore */
      }
    },
    [soundEnabled],
  );

  const playComplete = useCallback(() => playTone(880, 0.3, 0.1), [playTone]);
  const playCorrect = useCallback(() => playTone(660, 0.2, 0.1), [playTone]);
  const playWrong = useCallback(() => playTone(220, 0.3, 0.1), [playTone]);

  // ── Lesson progress state
  const markLessonComplete = useCallback((tierId: string, lessonId: string) => {
    const current = readJson<string[]>(progressKey(tierId), []);
    if (!current.includes(lessonId)) {
      writeJson(progressKey(tierId), [...current, lessonId]);
    }
    try {
      localStorage.setItem(COMEBACK_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
  }, []);

  const getLessonBookmarks = useCallback(
    (): Record<string, boolean> =>
      readJson<Record<string, boolean>>(BOOKMARKS_KEY, {}),
    [],
  );

  const toggleBookmark = useCallback((tierId: string, lessonId: string) => {
    const key = `${tierId}_${lessonId}`;
    const current = readJson<Record<string, boolean>>(BOOKMARKS_KEY, {});
    writeJson(BOOKMARKS_KEY, { ...current, [key]: !current[key] });
  }, []);

  const getLastLesson = useCallback((tierId: string): string | null => {
    try {
      return localStorage.getItem(lastKey(tierId));
    } catch {
      return null;
    }
  }, []);

  const setLastLesson = useCallback((tierId: string, lessonId: string) => {
    try {
      localStorage.setItem(lastKey(tierId), lessonId);
    } catch {
      /* ignore */
    }
  }, []);

  const getConfidenceRating = useCallback(
    (tierId: string, lessonId: string): number => {
      const all = readJson<Record<string, number>>(CONFIDENCE_KEY, {});
      return all[`${tierId}_${lessonId}`] ?? 0;
    },
    [],
  );

  const setConfidenceRating = useCallback(
    (tierId: string, lessonId: string, rating: number) => {
      const all = readJson<Record<string, number>>(CONFIDENCE_KEY, {});
      writeJson(CONFIDENCE_KEY, { ...all, [`${tierId}_${lessonId}`]: rating });
    },
    [],
  );

  const getStreakDays = useCallback((): number => {
    return readJson<number>(STREAK_DAYS_KEY, 0);
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STREAK_KEY);
    if (lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const current = readJson<number>(STREAK_DAYS_KEY, 0);
    const newStreak = lastDate === yesterday ? current + 1 : 1;
    writeJson(STREAK_DAYS_KEY, newStreak);
    try {
      localStorage.setItem(STREAK_KEY, today);
    } catch {
      /* ignore */
    }
  }, []);

  const getSpacedRepetitionReminder = useCallback(
    (tierId: string, lessonId: string): number | null => {
      const all = readJson<Record<string, number>>(SPACED_REP_KEY, {});
      return all[`${tierId}_${lessonId}`] ?? null;
    },
    [],
  );

  const setSpacedRepetitionReminder = useCallback(
    (tierId: string, lessonId: string) => {
      const all = readJson<Record<string, number>>(SPACED_REP_KEY, {});
      const nextReview = Date.now() + 3 * 24 * 60 * 60 * 1000;
      writeJson(SPACED_REP_KEY, {
        ...all,
        [`${tierId}_${lessonId}`]: nextReview,
      });
    },
    [],
  );

  // ── Personal notes
  const getLessonNote = useCallback(
    (tierId: string, lessonId: string): string => {
      const all = readJson<Record<string, string>>(NOTES_KEY, {});
      return all[`${tierId}_${lessonId}`] ?? "";
    },
    [],
  );

  const setLessonNote = useCallback(
    (tierId: string, lessonId: string, note: string) => {
      const all = readJson<Record<string, string>>(NOTES_KEY, {});
      writeJson(NOTES_KEY, { ...all, [`${tierId}_${lessonId}`]: note });
    },
    [],
  );

  // ── Star ratings (lesson quality by user)
  const getLessonStarRating = useCallback(
    (tierId: string, lessonId: string): number => {
      const all = readJson<Record<string, number>>(STAR_RATINGS_KEY, {});
      return all[`${tierId}_${lessonId}`] ?? 0;
    },
    [],
  );

  const setLessonStarRating = useCallback(
    (tierId: string, lessonId: string, rating: number) => {
      const all = readJson<Record<string, number>>(STAR_RATINGS_KEY, {});
      writeJson(STAR_RATINGS_KEY, {
        ...all,
        [`${tierId}_${lessonId}`]: rating,
      });
    },
    [],
  );

  // ── Lessons learned log
  const getLessonsLearnedLog = useCallback(
    (): LessonsLearnedEntry[] =>
      readJson<LessonsLearnedEntry[]>(LESSONS_LOG_KEY, []),
    [],
  );

  const addToLessonsLearnedLog = useCallback(
    (entry: Omit<LessonsLearnedEntry, "id">) => {
      const current = readJson<LessonsLearnedEntry[]>(LESSONS_LOG_KEY, []);
      const newEntry: LessonsLearnedEntry = {
        ...entry,
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      };
      writeJson(LESSONS_LOG_KEY, [newEntry, ...current].slice(0, 200));
    },
    [],
  );

  // ── Weekly goal
  const getWeeklyGoal = useCallback((): WeeklyGoal => {
    const stored = readJson<WeeklyGoal | null>(WEEKLY_GOAL_KEY, null);
    const weekStart = getISOWeekStart();
    if (!stored || !isSameWeek(stored.weekStart)) {
      return { target: 3, weekStart, completed: 0 };
    }
    return stored;
  }, []);

  const setWeeklyGoalTarget = useCallback((target: number) => {
    const current = readJson<WeeklyGoal | null>(WEEKLY_GOAL_KEY, null);
    const weekStart = getISOWeekStart();
    const completed =
      current && isSameWeek(current.weekStart) ? current.completed : 0;
    writeJson(WEEKLY_GOAL_KEY, { target, weekStart, completed });
  }, []);

  const incrementWeeklyProgress = useCallback(() => {
    const current = getWeeklyGoal();
    writeJson(WEEKLY_GOAL_KEY, {
      ...current,
      completed: current.completed + 1,
    });
  }, [getWeeklyGoal]);

  // ── Comeback reminder
  const getComebackReminder = useCallback((): boolean => {
    try {
      const last = localStorage.getItem(COMEBACK_KEY);
      if (!last) return false;
      const diff = Date.now() - Number(last);
      return diff > 3 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  const dismissComebackReminder = useCallback(() => {
    try {
      localStorage.setItem(COMEBACK_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
  }, []);

  const adminValue = useMemo<AdminSessionContextValue>(
    () => ({
      isAdminUnlocked,
      adminClickCount,
      showPasscodeModal,
      onHeroImageClick,
      submitPasscode,
      dismissModal,
      lockAdmin,
    }),
    [
      isAdminUnlocked,
      adminClickCount,
      showPasscodeModal,
      onHeroImageClick,
      submitPasscode,
      dismissModal,
      lockAdmin,
    ],
  );

  const themeValue = useMemo<ThemeContextValue>(
    () => ({ isDark, toggleTheme }),
    [isDark, toggleTheme],
  );

  const soundValue = useMemo<SoundContextValue>(
    () => ({
      soundEnabled,
      toggleSound,
      playComplete,
      playCorrect,
      playWrong,
    }),
    [soundEnabled, toggleSound, playComplete, playCorrect, playWrong],
  );

  const lessonValue = useMemo<LessonProgressContextValue>(
    () => ({
      getLessonProgress,
      markLessonComplete,
      getLessonBookmarks,
      toggleBookmark,
      getLastLesson,
      setLastLesson,
      getConfidenceRating,
      setConfidenceRating,
      getStreakDays,
      updateStreak,
      getSpacedRepetitionReminder,
      setSpacedRepetitionReminder,
      getLessonNote,
      setLessonNote,
      getLessonStarRating,
      setLessonStarRating,
      getLessonsLearnedLog,
      addToLessonsLearnedLog,
      getWeeklyGoal,
      setWeeklyGoalTarget,
      incrementWeeklyProgress,
      getComebackReminder,
      dismissComebackReminder,
    }),
    [
      getLessonProgress,
      markLessonComplete,
      getLessonBookmarks,
      toggleBookmark,
      getLastLesson,
      setLastLesson,
      getConfidenceRating,
      setConfidenceRating,
      getStreakDays,
      updateStreak,
      getSpacedRepetitionReminder,
      setSpacedRepetitionReminder,
      getLessonNote,
      setLessonNote,
      getLessonStarRating,
      setLessonStarRating,
      getLessonsLearnedLog,
      addToLessonsLearnedLog,
      getWeeklyGoal,
      setWeeklyGoalTarget,
      incrementWeeklyProgress,
      getComebackReminder,
      dismissComebackReminder,
    ],
  );

  return (
    <AdminSessionContext.Provider value={adminValue}>
      <ThemeContext.Provider value={themeValue}>
        <SoundContext.Provider value={soundValue}>
          <LessonProgressContext.Provider value={lessonValue}>
            {children}
          </LessonProgressContext.Provider>
        </SoundContext.Provider>
      </ThemeContext.Provider>
    </AdminSessionContext.Provider>
  );
}

export function useSession(): AdminSessionContextValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within SessionProvider");
  return ctx;
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SessionProvider");
  return ctx;
}

export function useLessonProgress(): LessonProgressContextValue {
  const ctx = useContext(LessonProgressContext);
  if (!ctx)
    throw new Error("useLessonProgress must be used within SessionProvider");
  return ctx;
}
