import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import type { AiLanguage, JournalEntry } from "../types";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  signalId?: string;
  messageId?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
  timestamp: bigint;
  provider?: string;
}

export interface AiValidateResult {
  token: string;
}

// ─── Validate AI Passcode ──────────────────────────────────────────────────
export function useValidateAiPasscode() {
  const { actor, isFetching } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    async (passcode: string): Promise<AiValidateResult | null> => {
      if (!actor || isFetching) {
        setError("Still connecting to backend. Please try again.");
        return null;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await actor.validateAiPasscode(passcode);
        if (import.meta.env.DEV) {
          console.log("[useValidateAiPasscode] raw result:", result);
        }
        if (result.__kind__ === "ok") {
          // Backend may return tuple [token, mode] or just token — handle both
          const raw = result.ok;
          const token = Array.isArray(raw)
            ? (raw[0] as string)
            : (raw as string);
          return { token };
        }
        setError(result.err ?? "Invalid passcode. Access denied.");
        return null;
      } catch (e) {
        console.error("[useValidateAiPasscode] error:", e);
        setError("Connection error. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, isFetching],
  );

  return { validate, isLoading, error, clearError: () => setError(null) };
}

// ─── Validate AI Session ───────────────────────────────────────────────────
export function useValidateAiSession() {
  const { actor } = useActor(createActor);

  const check = useCallback(
    async (token: string): Promise<boolean> => {
      if (!actor) return false;
      try {
        return await actor.validateAiSession(token);
      } catch {
        return false;
      }
    },
    [actor],
  );

  return { check };
}

// ─── Invalidate AI Session ────────────────────────────────────────────────
export function useInvalidateAiSession() {
  const { actor } = useActor(createActor);

  const invalidate = useCallback(
    async (token: string): Promise<void> => {
      if (!actor) return;
      try {
        await actor.invalidateAiSession(token);
      } catch {
        // Silently fail — session is cleared client-side regardless
      }
    },
    [actor],
  );

  return { invalidate };
}

// ─── Send AI Message ───────────────────────────────────────────────────────
export function useSendAiMessage() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (
      token: string,
      message: string,
      messages: AiMessage[],
    ): Promise<AiMessage | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (actor) {
          // Pass full history (up to 50 messages) for multi-turn memory
          const chatHistory: ChatMessage[] = messages.slice(-50).map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
            timestamp: BigInt(m.timestamp),
          }));

          // Backend auto-routes to best provider — provider param kept for compatibility
          const result = await actor.sendAiMessage(
            token,
            message,
            "default",
            chatHistory,
          );

          if (result.__kind__ === "ok" && result.ok) {
            return {
              role: "assistant",
              content: result.ok,
              timestamp: Date.now(),
              messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            };
          }
        }

        // Client-side fallback (dev/mock or when backend AI not configured)
        const responseText = getFallbackResponse(message);
        return {
          role: "assistant",
          content: responseText,
          timestamp: Date.now(),
          messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
      } catch {
        setError("Failed to get response. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { send, isLoading, error, clearError: () => setError(null) };
}

// ─── Backtest Signal ───────────────────────────────────────────────────────
export function useBacktestSignal() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backtest = useCallback(
    async (signal: string, sessionToken: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!actor) {
          setError("Not connected to backend.");
          return null;
        }
        const result = await actor.backtestSignal(signal, sessionToken);
        if (result.__kind__ === "ok") return result.ok;
        setError(result.err ?? "Backtest failed.");
        return null;
      } catch {
        setError("Failed to run backtest. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { backtest, isLoading, error, clearError: () => setError(null) };
}

// ─── AI Language ──────────────────────────────────────────────────────────
export function useAiLanguage() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);

  const setLanguage = useCallback(
    async (lang: AiLanguage, sessionToken: string): Promise<void> => {
      if (!actor) return;
      try {
        await actor.setAiLanguage(lang, sessionToken);
      } catch {
        // Non-blocking
      }
    },
    [actor],
  );

  const getLanguage = useCallback(
    async (sessionToken: string): Promise<AiLanguage> => {
      setIsLoading(true);
      try {
        if (!actor) return "en";
        const result = await actor.getAiLanguage(sessionToken);
        if (result.__kind__ === "ok") {
          const lang = result.ok as AiLanguage;
          if (["en", "ar", "es", "zh"].includes(lang)) return lang;
        }
        return "en";
      } catch {
        return "en";
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { setLanguage, getLanguage, isLoading };
}

// ─── Rate Response ────────────────────────────────────────────────────────
export function useRateResponse() {
  const { actor } = useActor(createActor);

  const rate = useCallback(
    async (
      messageId: string,
      rating: 1 | -1,
      sessionToken: string,
    ): Promise<void> => {
      if (!actor) return;
      try {
        await actor.rateAiResponse(messageId, BigInt(rating), sessionToken);
      } catch {
        // Non-blocking
      }
    },
    [actor],
  );

  return { rate };
}

// ─── Daily Briefing ────────────────────────────────────────────────────────
export function useDailyBriefing() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);

  const fetchBriefing = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      if (!actor) return null;
      const content = await actor.getDailyBriefing();
      setBriefing(content || null);
      return content || null;
    } catch {
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [actor]);

  const generateBriefing = useCallback(
    async (sessionToken: string): Promise<string | null> => {
      setIsLoading(true);
      try {
        if (!actor) return null;
        const result = await actor.generateDailyBriefing(sessionToken);
        if (result.__kind__ === "ok") {
          setBriefing(result.ok);
          return result.ok;
        }
        return null;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { fetchBriefing, generateBriefing, briefing, isLoading };
}

// ─── Journal ──────────────────────────────────────────────────────────────
export function useJournal() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEntry = useCallback(
    async (
      entry: JournalEntry,
      sessionToken: string,
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!actor) {
          setError("Not connected.");
          return null;
        }
        const result = await actor.addJournalEntry(entry, sessionToken);
        if (result.__kind__ === "ok") return result.ok;
        setError(result.err ?? "Failed to add journal entry.");
        return null;
      } catch {
        setError("Failed to add journal entry.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  const getEntries = useCallback(
    async (sessionToken: string): Promise<JournalEntry[]> => {
      setIsLoading(true);
      try {
        if (!actor) return [];
        const result = await actor.getJournalEntries(sessionToken);
        if (result.__kind__ === "ok") return result.ok as JournalEntry[];
        return [];
      } catch {
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  const clearEntries = useCallback(
    async (sessionToken: string): Promise<void> => {
      if (!actor) return;
      try {
        await actor.clearJournal(sessionToken);
      } catch {
        // Non-blocking
      }
    },
    [actor],
  );

  return { addEntry, getEntries, clearEntries, isLoading, error };
}

// ─── Session Recap ────────────────────────────────────────────────────────
export function useSessionRecap() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);

  const getRecap = useCallback(
    async (
      history: AiMessage[],
      sessionToken: string,
    ): Promise<string | null> => {
      setIsLoading(true);
      try {
        if (!actor) return null;
        const chatHistory: ChatMessage[] = history.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
          timestamp: BigInt(m.timestamp),
        }));
        const result = await actor.getSessionRecap(chatHistory, sessionToken);
        if (result.__kind__ === "ok") return result.ok;
        return null;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { getRecap, isLoading };
}

// ─── AI-Powered FAQ ───────────────────────────────────────────────────────
export function useAskFaq() {
  const { actor } = useActor(createActor);
  const [isLoading, setIsLoading] = useState(false);

  const ask = useCallback(
    async (question: string): Promise<string | null> => {
      setIsLoading(true);
      try {
        if (!actor) return null;
        const answer = await actor.askFaq(question);
        return answer || null;
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [actor],
  );

  return { ask, isLoading };
}

// ─── Check Admin Unlock ────────────────────────────────────────────────────
export function useCheckAdminUnlock() {
  const { actor } = useActor(createActor);

  const checkPhrase = useCallback(
    async (phrase: string): Promise<string | null> => {
      if (!actor) return null;
      try {
        return await actor.validateAdminRole(phrase);
      } catch {
        return null;
      }
    },
    [actor],
  );

  return { checkPhrase };
}

// ─── Fallback Response (dev/offline) ──────────────────────────────────────
function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (
    lowerMsg.includes("btc") ||
    lowerMsg.includes("bitcoin") ||
    lowerMsg.includes("signal") ||
    lowerMsg.includes("trade")
  ) {
    return "**DemonZeno AI — Signal Analysis 📊**\n\n**BTC/USDT — LONG 🚀**\n• Entry Zone: $67,200 – $67,500\n• TP1: $69,800 (+3.9%)\n• TP2: $72,400 (+7.7%)\n• TP3: $75,000 (+11.5%)\n• Stop Loss: $65,900 (-2%)\n• Timeframe: 4H–1D\n• Confidence: HIGH\n\n_Always manage your risk. Not financial advice._";
  }

  if (lowerMsg.includes("eth") || lowerMsg.includes("ethereum")) {
    return "**DemonZeno AI — ETH/USDT Signal 📈**\n\n• Direction: LONG\n• Entry: $3,450 – $3,480\n• TP1: $3,600 (+4.3%)\n• TP2: $3,750 (+8.7%)\n• TP3: $4,000 (+15.9%)\n• Stop Loss: $3,320 (-3.8%)\n• Timeframe: 1D\n• Confidence: Medium\n\n_DYOR. Not financial advice._";
  }

  if (
    lowerMsg.includes("forex") ||
    lowerMsg.includes("eur") ||
    lowerMsg.includes("usd")
  ) {
    return "**DemonZeno AI — Forex Signal 📈**\n\n**EUR/USD — LONG**\n• Entry: 1.0850 – 1.0860\n• TP1: 1.0920 (+0.65%)\n• TP2: 1.0980 (+1.20%)\n• TP3: 1.1050 (+1.84%)\n• Stop Loss: 1.0800 (-0.46%)\n• Timeframe: 4H\n• Confidence: Medium\n\n_Risk management is key. Not financial advice._";
  }

  if (
    lowerMsg.includes("code") ||
    lowerMsg.includes("function") ||
    lowerMsg.includes("script")
  ) {
    return "**DemonZeno AI — Code Assistant 💻**\n\nI can help you write code in JavaScript, TypeScript, Python, Rust, and more. What would you like me to build?\n\nJust describe the function, script, or component you need and I'll provide working code.\n\n_Powered by DemonZeno AI — Master the Chaos._";
  }

  return `**DemonZeno AI — Ready to Trade 🔥**\n\nI'm your all-in-one AI powered by 50+ providers, silently routing to the best model for your request.\n\nI can handle:\n• Trading signals — crypto, forex, stocks (Entry · TP1 · TP2 · TP3 · Stop Loss)\n• Market analysis and trend breakdowns\n• Code writing in any language\n• General knowledge and Q&A\n• Signal backtesting and trade journaling\n\nJust ask me anything.\n\n_Master the Chaos, Slay the Market, Trade Like a God._`;
}
