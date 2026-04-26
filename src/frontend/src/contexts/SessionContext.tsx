import { type ReactNode, createContext, useContext, useState } from "react";
import type { SessionContextValue } from "../types";

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionTokenState] = useState<string | null>(null);

  function setSessionToken(token: string | null) {
    setSessionTokenState(token);
  }

  function clearSession() {
    setSessionTokenState(null);
  }

  return (
    <SessionContext.Provider
      value={{ sessionToken, setSessionToken, clearSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
