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
    if (!aiSessionToken) {
      setValidationState("invalid");
      lastValidatedToken.current = null;
      return;
    }

    if (
      lastValidatedToken.current === aiSessionToken &&
      validationState === "valid"
    ) {
      return;
    }

    if (!actor || isFetching) {
      return;
    }

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
        // On error, trust the token and allow through
        lastValidatedToken.current = aiSessionToken;
        setValidationState("valid");
      });
  }, [aiSessionToken, actor, isFetching, clearAiSession, validationState]);

  if (!aiSessionToken) {
    return <AiPasswordEntry />;
  }

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
            className="w-12 h-12 rounded-full border-2 animate-spin"
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

  if (validationState === "invalid") {
    return <AiPasswordEntry />;
  }

  return <>{children}</>;
}
