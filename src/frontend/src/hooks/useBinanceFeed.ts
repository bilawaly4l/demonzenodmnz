import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { BinancePost } from "../types";

const SEED_POSTS: BinancePost[] = [
  {
    id: "bp-seed-1",
    title: "BTC/USDT Breakout Confirmed — Entry Zone $67,200–$67,500",
    snippet:
      "Market structure looks strong after the consolidation phase. Watching for clean break above resistance with volume confirmation. TP1: $69,500 | TP2: $72,000 | TP3: $76,000 | SL: $65,800",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25",
  },
  {
    id: "bp-seed-2",
    title: "ETH/USDT Bullish Divergence on the 4H — Signal Incoming",
    snippet:
      "RSI divergence forming on the 4-hour chart. On-chain data shows accumulation. Three TP targets marked — manage SL tight below $3,320. Full signal posted.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-25",
  },
  {
    id: "bp-seed-3",
    title: "SOL/USDT Ecosystem Momentum Building — Watch $155 Level",
    snippet:
      "Solana volume spiking with DEX activity. Could front-run broader altcoin rotation. Aggressive entry setup forming — check Binance Square for full signal.",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
    date: "2026-04-24",
  },
];

export function useBinanceFeed() {
  const { actor, isFetching } = useActor(createActor);

  const query = useQuery<BinancePost[]>({
    queryKey: ["binanceFeed"],
    queryFn: async () => {
      if (!actor) return SEED_POSTS;
      const result = await actor.getBinanceFeed();
      // Fall back to seed data if backend returns empty
      return result.length > 0 ? result : SEED_POSTS;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 300_000, // 5 minutes
    placeholderData: SEED_POSTS,
  });

  return {
    posts: query.data ?? SEED_POSTS,
    isLoading: query.isLoading,
    error: query.error ? "Failed to load Binance feed" : null,
    refetch: query.refetch,
  };
}
