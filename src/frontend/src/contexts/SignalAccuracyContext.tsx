import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { AiSignal, SignalAccuracyStats } from "../types";

export interface SignalAccuracyContextValue {
  signals: AiSignal[];
  stats: SignalAccuracyStats;
  addAiSignal: (
    signal: Omit<AiSignal, "id" | "timestamp" | "result">,
  ) => string;
  markWin: (id: string) => void;
  markLoss: (id: string) => void;
  clearAccuracy: () => void;
}

const SignalAccuracyContext = createContext<SignalAccuracyContextValue | null>(
  null,
);

function computeStats(signals: AiSignal[]): SignalAccuracyStats {
  const total = signals.length;
  const wins = signals.filter((s) => s.result === "win").length;
  const losses = signals.filter((s) => s.result === "loss").length;
  const pending = signals.filter((s) => s.result === "pending").length;
  const rated = wins + losses;
  return {
    total,
    wins,
    losses,
    pending,
    winRate: rated > 0 ? Math.round((wins / rated) * 100) : 0,
  };
}

export function SignalAccuracyProvider({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<AiSignal[]>([]);

  const addAiSignal = useCallback(
    (sig: Omit<AiSignal, "id" | "timestamp" | "result">): string => {
      const id = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setSignals((prev) => [
        { ...sig, id, timestamp: Date.now(), result: "pending" },
        ...prev,
      ]);
      return id;
    },
    [],
  );

  const markWin = useCallback((id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, result: "win" as const } : s)),
    );
  }, []);

  const markLoss = useCallback((id: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, result: "loss" as const } : s)),
    );
  }, []);

  const clearAccuracy = useCallback(() => {
    setSignals([]);
  }, []);

  const stats = useMemo(() => computeStats(signals), [signals]);

  return (
    <SignalAccuracyContext.Provider
      value={{ signals, stats, addAiSignal, markWin, markLoss, clearAccuracy }}
    >
      {children}
    </SignalAccuracyContext.Provider>
  );
}

export function useSignalAccuracy(): SignalAccuracyContextValue {
  const ctx = useContext(SignalAccuracyContext);
  if (!ctx)
    throw new Error(
      "useSignalAccuracy must be used within SignalAccuracyProvider",
    );
  return ctx;
}
