import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
import type { ZenoAiMessage } from "../types";

export function useZenoAi() {
  const { actor, isFetching } = useActor(createActor);
  const [messages, setMessages] = useState<ZenoAiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!actor || isFetching || !question.trim()) return;

      const userMsg: ZenoAiMessage = {
        role: "user",
        content: question.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await actor.askZenoAi(question.trim());
        const assistantMsg: ZenoAiMessage = {
          role: "assistant",
          content: response.success
            ? response.answer
            : "Zeno AI is temporarily unavailable. Please try again shortly.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: ZenoAiMessage = {
          role: "assistant",
          content:
            "Something went wrong reaching Zeno AI. Please try again shortly.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [actor, isFetching],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, sendMessage, isLoading, clearMessages };
}
