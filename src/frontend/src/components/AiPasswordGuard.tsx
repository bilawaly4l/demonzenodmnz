import { useActor } from "@caffeineai/core-infrastructure";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import { useAiSession } from "../contexts/AiSessionContext";
import { AiPasswordEntry } from "./AiPasswordEntry";

interface AiPasswordGuardProps {
  children: ReactNode;
}

export function AiPasswordGuard({ children }: AiPasswordGuardProps) {
  const { aiSessionToken, clearAiSession } = useAiSession();
  const { actor, isFetching } = useActor(createActor);
  const [validationState, setValidationState] = useState<
    "pending" | "valid" | "invalid"
  >("pending");
  const lastValidatedToken = useRef<string | null>(null);

  useEffect(() => {
    // No token → show password entry immediately
    if (!aiSessionToken) {
      setValidationState("invalid");
      lastValidatedToken.current = null;
      return;
    }

    // Same token already validated → skip re-validation
    if (
      lastValidatedToken.current === aiSessionToken &&
      validationState === "valid"
    ) {
      return;
    }

    // Actor not ready yet → wait
    if (!actor || isFetching) {
      return;
    }

    // Validate with backend
    setValidationState("pending");
    actor
      .validateAiSession(aiSessionToken)
      .then((valid) => {
        if (valid) {
          lastValidatedToken.current = aiSessionToken;
          setValidationState("valid");
        } else {
          clearAiSession();
          lastValidatedToken.current = null;
          setValidationState("invalid");
        }
      })
      .catch(() => {
        // On error, trust the token (backend may be slow) and allow through
        lastValidatedToken.current = aiSessionToken;
        setValidationState("valid");
      });
  }, [aiSessionToken, actor, isFetching, clearAiSession, validationState]);

  // If no token, show password entry
  if (!aiSessionToken) {
    return <AiPasswordEntry />;
  }

  // Waiting for actor to be ready — show subtle loader
  if (validationState === "pending") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.145 0.01 260) 0%, oklch(0.18 0.02 200) 50%, oklch(0.145 0.01 260) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "oklch(0.65 0.15 190 / 0.6)",
              borderTopColor: "transparent",
            }}
          />
          <span
            className="text-sm font-mono"
            style={{ color: "oklch(0.55 0.01 260)" }}
          >
            Verifying session…
          </span>
        </div>
      </div>
    );
  }

  // Token validated invalid
  if (validationState === "invalid") {
    return <AiPasswordEntry />;
  }

  // Valid session — render children
  return <>{children}</>;
}
