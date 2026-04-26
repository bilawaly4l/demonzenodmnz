import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { FAQ } from "../types";

const SEED_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What is DemonZeno?",
    answer:
      "DemonZeno is an anime-inspired free trading signals platform and meme token project providing daily signals for crypto, forex, and stocks.",
    order: BigInt(1),
  },
  {
    id: "faq-2",
    question: "What is DMNZ?",
    answer:
      "DMNZ is the DemonZeno token — a meme token launching April 2, 2028 via a Telegram Mini App on Blum as a 100% fair launch with no presale and no private allocation.",
    order: BigInt(2),
  },
  {
    id: "faq-3",
    question: "Are the signals really free?",
    answer:
      "Yes, 100% free. No subscription, no fees, no hidden charges — ever. DemonZeno is committed to free signals for the entire community.",
    order: BigInt(3),
  },
  {
    id: "faq-4",
    question: "How accurate are the signals?",
    answer:
      "DemonZeno provides high-quality signals based on technical analysis and AI-powered insights. Past performance is not a guarantee of future results.",
    order: BigInt(4),
  },
  {
    id: "faq-5",
    question: "What markets does DemonZeno cover?",
    answer:
      "Crypto tokens (BTC, ETH, SOL and more), Forex pairs (EUR/USD, GBP/JPY and more), and Stock market (AAPL, TSLA, NVDA and more).",
    order: BigInt(5),
  },
  {
    id: "faq-6",
    question: "Where does DemonZeno post daily free signals?",
    answer:
      "DemonZeno posts daily free signals on Binance Square at @DemonZeno. Follow there to get every signal the moment it drops — no subscription needed.",
    order: BigInt(6),
  },
  {
    id: "faq-7",
    question: "When does DMNZ token launch?",
    answer:
      "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform. It's a 100% fair launch with no presale, no private sale, and no allocation breakdown.",
    order: BigInt(7),
  },
];

export function useFaqs() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return SEED_FAQS;
      const result = await actor.getFaqs();
      // Fall back to seed data if backend returns empty
      return result.length > 0 ? result : SEED_FAQS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_FAQS,
  });
}
