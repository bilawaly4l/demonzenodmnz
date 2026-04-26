import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "../contexts/SessionContext";

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
