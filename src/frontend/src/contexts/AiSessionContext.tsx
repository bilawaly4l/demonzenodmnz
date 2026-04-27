import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AiMode } from "../types";

export type AiLanguage = "en" | "ar" | "es" | "zh";

export interface AiSessionContextValue {
  aiSessionToken: string | null;
  aiMode: AiMode | null;
  isAdminSession: boolean;
  aiLanguage: AiLanguage;
  setSession: (token: string, mode: AiMode) => void;
  setAdminSession: (isAdmin: boolean) => void;
  setAiSessionToken: (token: string | null) => void;
  setAiMode: (mode: AiMode) => void;
  setAiLanguage: (lang: AiLanguage) => void;
  clearAiSession: () => void;
}

const LANGUAGE_KEY = "dz_ai_language";

const AiSessionContext = createContext<AiSessionContextValue | null>(null);

export function AiSessionProvider({ children }: { children: ReactNode }) {
  const [aiSessionToken, setAiSessionTokenState] = useState<string | null>(
    null,
  );
  const [aiMode, setAiModeState] = useState<AiMode | null>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [aiLanguage, setAiLanguageState] = useState<AiLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === "ar" || stored === "es" || stored === "zh") return stored;
    } catch {
      /* ignore */
    }
    return "en";
  });

  // Persist language preference
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, aiLanguage);
    } catch {
      /* ignore */
    }
  }, [aiLanguage]);

  function setSession(token: string, mode: AiMode) {
    setAiSessionTokenState(token);
    setAiModeState(mode);
  }

  function setAdminSession(isAdmin: boolean) {
    setIsAdminSession(isAdmin);
  }

  function setAiSessionToken(token: string | null) {
    setAiSessionTokenState(token);
  }

  function setAiMode(mode: AiMode) {
    setAiModeState(mode);
  }

  function setAiLanguage(lang: AiLanguage) {
    setAiLanguageState(lang);
  }

  function clearAiSession() {
    setAiSessionTokenState(null);
    setAiModeState(null);
    setIsAdminSession(false);
    // Language persists across sessions
  }

  return (
    <AiSessionContext.Provider
      value={{
        aiSessionToken,
        aiMode,
        isAdminSession,
        aiLanguage,
        setSession,
        setAdminSession,
        setAiSessionToken,
        setAiMode,
        setAiLanguage,
        clearAiSession,
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
