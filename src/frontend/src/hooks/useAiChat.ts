import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";
import { createActor } from "../backend";
import type { AiLanguage, JournalEntry } from "../types";

export type AiMode = "normal" | "insane";

export type AiProvider =
  | "default"
  | "gemini"
  | "grok"
  | "chatgpt"
  | "claude"
  | "perplexity"
  | "mistral"
  | "cohere"
  | "deepseek"
  | "groq"
  | "together"
  | "fireworks"
  | "openrouter"
  | "replicate"
  | "huggingface"
  | "ai21"
  | "nlpcloud"
  | "anyscale"
  | "cerebras"
  | "sambanova"
  | "cloudflare"
  | "novita"
  | "moonshot"
  | "zhipu"
  | "upstage";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  provider?: AiProvider;
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

export interface AiProviderStatus {
  provider: AiProvider;
  label: string;
  available: boolean;
}

export interface AiValidateResult {
  token: string;
  mode: AiMode;
}

// 25 supported providers with display labels
export const AI_PROVIDERS: AiProviderStatus[] = [
  { provider: "default", label: "Default", available: true },
  { provider: "gemini", label: "Gemini", available: true },
  { provider: "grok", label: "Grok (xAI)", available: true },
  { provider: "chatgpt", label: "ChatGPT", available: true },
  { provider: "claude", label: "Claude", available: true },
  { provider: "perplexity", label: "Perplexity", available: true },
  { provider: "mistral", label: "Mistral", available: true },
  { provider: "cohere", label: "Cohere", available: true },
  { provider: "deepseek", label: "DeepSeek", available: true },
  { provider: "groq", label: "Groq", available: true },
  { provider: "together", label: "Together AI", available: true },
  { provider: "fireworks", label: "Fireworks AI", available: true },
  { provider: "openrouter", label: "OpenRouter", available: true },
  { provider: "replicate", label: "Replicate", available: true },
  { provider: "huggingface", label: "HuggingFace", available: true },
  { provider: "ai21", label: "AI21 Labs", available: true },
  { provider: "nlpcloud", label: "NLP Cloud", available: true },
  { provider: "anyscale", label: "Anyscale", available: true },
  { provider: "cerebras", label: "Cerebras", available: true },
  { provider: "sambanova", label: "SambaNova", available: true },
  { provider: "cloudflare", label: "Cloudflare AI", available: true },
  { provider: "novita", label: "Novita AI", available: true },
  { provider: "moonshot", label: "Moonshot", available: true },
  { provider: "zhipu", label: "Zhipu AI", available: true },
  { provider: "upstage", label: "Upstage", available: true },
];

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
          // ok is [token, mode] tuple
          const [token, rawMode] = result.ok;
          const mode: AiMode = rawMode === "insane" ? "insane" : "normal";
          return { token, mode };
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
      provider: AiProvider,
      mode: AiMode,
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
            provider: m.provider,
          }));

          const result = await actor.sendAiMessage(
            token,
            message,
            provider,
            mode,
            chatHistory,
          );

          if (result.__kind__ === "ok" && result.ok) {
            return {
              role: "assistant",
              content: result.ok,
              provider,
              timestamp: Date.now(),
              messageId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            };
          }
        }

        // Client-side fallback (dev/mock or when backend AI not configured)
        const responseText = getFallbackResponse(message, mode, provider);
        return {
          role: "assistant",
          content: responseText,
          provider,
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
          provider: m.provider,
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
        return await actor.checkAdminUnlockPhrase(phrase);
      } catch {
        return null;
      }
    },
    [actor],
  );

  return { checkPhrase };
}

// ─── Fallback Response (dev/offline) ──────────────────────────────────────
function getFallbackResponse(
  message: string,
  mode: AiMode,
  provider: AiProvider,
): string {
  const lowerMsg = message.toLowerCase();
  const providerLabel =
    AI_PROVIDERS.find((p) => p.provider === provider)?.label ?? "DemonZeno";

  if (
    lowerMsg.includes("btc") ||
    lowerMsg.includes("bitcoin") ||
    lowerMsg.includes("signal") ||
    lowerMsg.includes("trade")
  ) {
    if (mode === "insane") {
      return `**${providerLabel} — INSANE MODE SIGNAL 🔥**\n\n**BTC/USDT — LONG 🚀**\n• Entry: $67,200 – $67,500\n• TP1: $69,800 (+3.9%)\n• TP2: $72,400 (+7.7%)\n• TP3: $75,000 (+11.5%)\n• Stop Loss: $65,900 (-2%)\n• Timeframe: 4H–1D\n• Confidence: HIGH\n• Leverage: 5–10x (manage risk)\n\n_This is aggressive analysis. Manage your position size. No financial advice._`;
    }
    return `**${providerLabel} — Trading Signal 📊**\n\n**BTC/USDT — LONG (Binance)**\n• Entry Zone: $67,200 – $67,500\n• TP1: $69,000 (+2.7%)\n• TP2: $71,500 (+6.4%)\n• TP3: $74,200 (+10.4%)\n• Stop Loss: $65,900 (-2%)\n• Timeframe: 4H\n• Confidence: Medium\n• Source: Technical Analysis\n\n_Always use proper risk management. This is not financial advice._`;
  }

  if (lowerMsg.includes("eth") || lowerMsg.includes("ethereum")) {
    return `**${providerLabel} — ETH/USDT Signal 📈**\n\n• Direction: LONG\n• Entry: $3,450 – $3,480\n• TP1: $3,600 (+4.3%)\n• TP2: $3,750 (+8.7%)\n• TP3: $4,000 (+15.9%)\n• Stop Loss: $3,320 (-3.8%)\n• Timeframe: 1D\n• Confidence: Medium\n\n_Binance spot & futures. DYOR._`;
  }

  return `**DemonZeno AI — ${mode === "insane" ? "INSANE MODE 🔥" : "Normal Mode"}**\n\nI'm analyzing your request: "${message}"\n\nFor best results, ask me about:\n• Specific trading pairs (BTC/USDT, ETH/USDT, etc.)\n• Entry/exit signals with 3 targets and stop-loss\n• Market analysis and trends\n• Risk management strategies${mode === "insane" ? "\n• Any asset on any exchange — no restrictions" : "\n• Binance-listed assets"}\n\n_Powered by ${providerLabel}. Master the chaos, trade like a god._`;
}
