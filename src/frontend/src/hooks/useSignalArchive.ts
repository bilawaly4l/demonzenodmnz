import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useState } from "react";
import { createActor } from "../backend";
import type { Signal, SignalArchiveFilter } from "../types";

const DEFAULT_FILTER: SignalArchiveFilter = {
  result: "all",
  confidence: "all",
  market: "all",
  search: "",
  dateRange: "all",
};

function filterSignals(
  signals: Signal[],
  filter: SignalArchiveFilter,
): Signal[] {
  const now = Date.now();
  const dayMs = 86_400_000;

  return signals.filter((s) => {
    // Result filter
    if (filter.result !== "all") {
      const resultMap: Record<string, string> = {
        win: "Win",
        loss: "Loss",
        active: "Active",
        expired: "Expired",
      };
      if (s.result !== resultMap[filter.result]) return false;
    }

    // Confidence filter
    if (filter.confidence !== "all" && s.confidence !== filter.confidence)
      return false;

    // Market filter
    if (filter.market !== "all" && s.marketType !== filter.market) return false;

    // Search filter
    if (
      filter.search.trim() &&
      !s.asset.toLowerCase().includes(filter.search.trim().toLowerCase())
    )
      return false;

    // Date range filter
    if (filter.dateRange !== "all") {
      const days =
        filter.dateRange === "7d" ? 7 : filter.dateRange === "30d" ? 30 : 90;
      const cutoff = now - days * dayMs;
      // datePosted is a string — try to parse it
      const posted = new Date(s.datePosted).getTime();
      if (!Number.isNaN(posted) && posted < cutoff) return false;
    }

    return true;
  });
}

export function useSignalArchive() {
  const { actor, isFetching } = useActor(createActor);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SignalArchiveFilter>(DEFAULT_FILTER);

  const loadSignals = useCallback(async () => {
    if (!actor || isFetching) return;
    setIsLoading(true);
    setError(null);
    try {
      // getSignalArchive not in backend yet — fall back to getSignals
      const all = await actor.getSignals();
      setSignals(all);
    } catch {
      setError("Failed to load signal archive.");
    } finally {
      setIsLoading(false);
    }
  }, [actor, isFetching]);

  useEffect(() => {
    loadSignals();
  }, [loadSignals]);

  const filtered = filterSignals(signals, filter);

  return {
    signals: filtered,
    allSignals: signals,
    isLoading,
    error,
    filter,
    setFilter,
    refetch: loadSignals,
  };
}
