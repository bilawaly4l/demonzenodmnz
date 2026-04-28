import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AiLanguage, AiSessionContextValue, JournalEntry } from "../types";

export type { AiLanguage };

const LANGUAGE_KEY = "dz_ai_language";
const SESSION_KEY = "dz_ai_session_token";

const AiSessionContext = createContext<AiSessionContextValue | null>(null);

export function AiSessionProvider({ children }: { children: ReactNode }) {
  const [aiSessionToken, setAiSessionTokenState] = useState<string | null>(
    () => {
      try {
        return sessionStorage.getItem(SESSION_KEY) ?? null;
      } catch {
        return null;
      }
    },
  );

  const [aiLanguage, setAiLanguageState] = useState<AiLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === "ar" || stored === "es" || stored === "zh") return stored;
    } catch {
      /* ignore */
    }
    return "en";
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Persist session token to sessionStorage (clears on tab close)
  useEffect(() => {
    try {
      if (aiSessionToken) {
        sessionStorage.setItem(SESSION_KEY, aiSessionToken);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [aiSessionToken]);

  // Persist language preference
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, aiLanguage);
    } catch {
      /* ignore */
    }
  }, [aiLanguage]);

  function setAiSessionToken(token: string | null) {
    setAiSessionTokenState(token);
  }

  function setAiLanguage(lang: AiLanguage) {
    setAiLanguageState(lang);
  }

  function clearAiSession() {
    setAiSessionTokenState(null);
    setJournalEntries([]);
    // Language persists across sessions
  }

  return (
    <AiSessionContext.Provider
      value={{
        aiSessionToken,
        aiLanguage,
        setAiSessionToken,
        setAiLanguage,
        clearAiSession,
        journalEntries,
        setJournalEntries,
      }}
    >
      {children}
    </AiSessionContext.Provider>
  );
}

export function useAiSession(): AiSessionContextValue {
  const ctx = useContext(AiSessionContext);
  if (!ctx)
    throw new Error("useAiSession must be used within AiSessionProvider");
  return ctx;
}
