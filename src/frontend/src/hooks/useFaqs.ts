import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaqCategory } from "../backend";
import { createActor } from "../backend";
import type { FAQ } from "../types";

const SEED_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What is DemonZeno?",
    answer:
      "DemonZeno is an anime-inspired free trading signals platform and meme token project providing daily signals for crypto, forex, and stocks.",
    order: BigInt(1),
    helpfulCount: BigInt(0),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(0),
    category: FaqCategory.Platform,
  },
  {
    id: "faq-2",
    question: "What is DMNZ?",
    answer:
      "DMNZ is the DemonZeno token — a meme token launching April 2, 2028 via a Telegram Mini App on Blum as a 100% fair launch with no presale and no private allocation.",
    order: BigInt(2),
    helpfulCount: BigInt(0),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(0),
    category: FaqCategory.DmnzToken,
  },
  {
    id: "faq-3",
    question: "Are the signals really free?",
    answer:
      "Yes, 100% free. No subscription, no fees, no hidden charges — ever. DemonZeno is committed to free signals for the entire community.",
    order: BigInt(3),
    helpfulCount: BigInt(0),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(0),
    category: FaqCategory.Signals,
  },
  {
    id: "faq-4",
    question: "Where does DemonZeno post daily free signals?",
    answer:
      "DemonZeno posts daily free signals on Binance Square at @DemonZeno. Follow there to get every signal the moment it drops — no subscription needed.",
    order: BigInt(4),
    helpfulCount: BigInt(0),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(0),
    category: FaqCategory.Signals,
  },
  {
    id: "faq-5",
    question: "When does DMNZ token launch?",
    answer:
      "DMNZ launches on April 2, 2028 via a Telegram Mini App on the Blum platform. It's a 100% fair launch with no presale, no private sale, and no allocation breakdown.",
    order: BigInt(5),
    helpfulCount: BigInt(0),
    notHelpfulCount: BigInt(0),
    timestamp: BigInt(0),
    category: FaqCategory.DmnzToken,
  },
];

export function useFaqs() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return SEED_FAQS;
      const result = await actor.getFaqs();
      return result.length > 0 ? result : SEED_FAQS;
    },
    enabled: !!actor && !isFetching,
    placeholderData: SEED_FAQS,
  });
}

export function useRateFaq() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, helpful }: { id: string; helpful: boolean }) => {
      if (!actor) throw new Error("No actor");
      return actor.rateFaq(id, helpful);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}
