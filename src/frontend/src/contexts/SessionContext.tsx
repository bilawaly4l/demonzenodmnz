import { type ReactNode, createContext, useContext, useState } from "react";
import type { AdminSessionContextValue, SessionContextValue } from "../types";

// ─── Admin session context (admin token + image click counter) ─────────────
const AdminSessionContext = createContext<AdminSessionContextValue | null>(
  null,
);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem("dz_admin_token") ?? null;
    } catch {
      return null;
    }
  });
  const [clickCount, setClickCount] = useState(0);

  function setAdminToken(token: string | null) {
    setAdminTokenState(token);
    try {
      if (token) {
        sessionStorage.setItem("dz_admin_token", token);
      } else {
        sessionStorage.removeItem("dz_admin_token");
      }
    } catch {
      /* ignore */
    }
  }

  function clearAdminSession() {
    setAdminTokenState(null);
    setClickCount(0);
    try {
      sessionStorage.removeItem("dz_admin_token");
    } catch {
      /* ignore */
    }
  }

  function incrementClickCount() {
    setClickCount((c) => c + 1);
  }

  return (
    <AdminSessionContext.Provider
      value={{
        adminToken,
        setAdminToken,
        clearAdminSession,
        clickCount,
        incrementClickCount,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession(): AdminSessionContextValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx)
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  return ctx;
}

// ─── General session context (AI session, etc.) ────────────────────────────
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
