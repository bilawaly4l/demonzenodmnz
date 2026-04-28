import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "../contexts/SessionContext";

/**
 * AdminGuard — protects the /admin route.
 * Admin token is stored in SessionContext after successful passcode validation.
 * The DemonZeno image on the homepage must be clicked 5+ times to trigger the
 * passcode modal. On success, the session token is set in SessionContext.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { sessionToken } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionToken) {
      navigate({ to: "/" });
    }
  }, [sessionToken, navigate]);

  if (!sessionToken) return null;
  return <>{children}</>;
}
