import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AdminSessionContextValue } from "../types";

const ADMIN_PASSCODE = "2420075112009BILAWALPRAKRITI";
const CLICK_THRESHOLD = 5;

const AdminSessionContext = createContext<AdminSessionContextValue | null>(
  null,
);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("dz_admin_unlocked") === "1";
    } catch {
      return false;
    }
  });
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onHeroImageClick = useCallback(() => {
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    setAdminClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= CLICK_THRESHOLD) {
        setShowPasscodeModal(true);
        return 0;
      }
      clickResetTimer.current = setTimeout(() => setAdminClickCount(0), 30000);
      return newCount;
    });
  }, []);

  const submitPasscode = useCallback((passcode: string): boolean => {
    if (passcode === ADMIN_PASSCODE) {
      setIsAdminUnlocked(true);
      setShowPasscodeModal(false);
      try {
        sessionStorage.setItem("dz_admin_unlocked", "1");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  }, []);

  const dismissModal = useCallback(() => {
    setShowPasscodeModal(false);
    setAdminClickCount(0);
  }, []);

  const lockAdmin = useCallback(() => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem("dz_admin_unlocked");
    } catch {
      /* ignore */
    }
  }, []);

  const adminValue = useMemo<AdminSessionContextValue>(
    () => ({
      isAdminUnlocked,
      adminClickCount,
      showPasscodeModal,
      onHeroImageClick,
      submitPasscode,
      dismissModal,
      lockAdmin,
    }),
    [
      isAdminUnlocked,
      adminClickCount,
      showPasscodeModal,
      onHeroImageClick,
      submitPasscode,
      dismissModal,
      lockAdmin,
    ],
  );

  // Always apply dark theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }, []);

  return (
    <AdminSessionContext.Provider value={adminValue}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useSession(): AdminSessionContextValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
