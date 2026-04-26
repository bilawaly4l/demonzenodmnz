import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Lock, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAiSession } from "../contexts/AiSessionContext";
import { useValidateAiPasscode } from "../hooks/useAiChat";

export function AiPasswordEntry() {
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [successMode, setSuccessMode] = useState<string | null>(null);
  const { validate, isLoading, error, clearError } = useValidateAiPasscode();
  const { setSession } = useAiSession();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passcode.trim()) return;
    const result = await validate(passcode.trim());
    if (result) {
      setSuccessMode(result.mode);
      // Show success state briefly, then set session to trigger guard re-render
      setTimeout(() => {
        setSession(result.token, result.mode);
      }, 600);
    }
  }

  const isInsaneSuccess = successMode === "insane";
  const glowColor = isInsaneSuccess
    ? "oklch(0.55 0.22 25 / 0.25)"
    : "oklch(0.65 0.15 190 / 0.18)";

  return (
    <div
      data-ocid="ai_password.panel"
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.145 0.01 260) 0%, oklch(0.18 0.02 200) 50%, oklch(0.145 0.01 260) 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${glowColor}, transparent)`,
          transition: "background 0.5s ease",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          {/* DemonZeno character — cropped to remove bottom watermark */}
          <div
            className="relative w-32 h-32 overflow-hidden rounded-2xl shadow-elevated"
            style={{
              border: isInsaneSuccess
                ? "2px solid oklch(0.55 0.22 25 / 0.7)"
                : "2px solid oklch(0.65 0.15 190 / 0.4)",
              boxShadow: successMode ? `0 0 32px ${glowColor}` : undefined,
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <img
              src="/assets/demonzeno-character.png"
              alt="DemonZeno AI"
              className="w-full object-cover object-top"
              style={{ height: "115%", objectPosition: "top center" }}
            />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1
              className="font-display font-bold text-3xl text-glow"
              style={{ color: "oklch(0.95 0.005 260)" }}
            >
              Demon<span style={{ color: "oklch(0.65 0.15 190)" }}>Zeno</span>{" "}
              AI
            </h1>
            <p
              style={{ color: "oklch(0.55 0.01 260)" }}
              className="text-sm mt-1"
            >
              Password-protected. Authorized users only.
            </p>
          </div>

          {/* Success flash */}
          {successMode && (
            <div
              className="w-full rounded-xl px-4 py-3 text-center font-semibold text-sm animate-pulse"
              style={{
                background: isInsaneSuccess
                  ? "oklch(0.55 0.22 25 / 0.2)"
                  : "oklch(0.65 0.15 190 / 0.15)",
                border: `1px solid ${isInsaneSuccess ? "oklch(0.55 0.22 25 / 0.5)" : "oklch(0.65 0.15 190 / 0.4)"}`,
                color: isInsaneSuccess
                  ? "oklch(0.7 0.2 25)"
                  : "oklch(0.75 0.15 190)",
              }}
            >
              {isInsaneSuccess
                ? "🔥 INSANE Mode Unlocked — Entering…"
                : "✅ Normal Mode Unlocked — Entering…"}
            </div>
          )}

          {/* Card */}
          {!successMode && (
            <div
              className="w-full rounded-2xl p-8"
              style={{
                background: "oklch(0.18 0.01 260)",
                border: "1px solid oklch(0.28 0.01 260)",
                boxShadow: "0 32px 64px oklch(0 0 0 / 0.4)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "oklch(0.65 0.15 190 / 0.15)",
                    border: "1px solid oklch(0.65 0.15 190 / 0.3)",
                  }}
                >
                  <Lock
                    className="w-4 h-4"
                    style={{ color: "oklch(0.65 0.15 190)" }}
                  />
                </div>
                <span
                  className="font-display font-semibold"
                  style={{ color: "oklch(0.95 0.005 260)" }}
                >
                  Enter Access Code
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Input
                    data-ocid="ai_password.input"
                    type={showPass ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) clearError();
                    }}
                    placeholder="Enter access code…"
                    className="pr-10"
                    style={{
                      background: "oklch(0.145 0.01 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      color: "oklch(0.95 0.005 260)",
                    }}
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "oklch(0.55 0.01 260)" }}
                    aria-label={showPass ? "Hide passcode" : "Show passcode"}
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <p
                    data-ocid="ai_password.error_state"
                    className="text-sm font-medium px-3 py-2 rounded-lg"
                    style={{
                      background: "oklch(0.55 0.22 25 / 0.15)",
                      color: "oklch(0.7 0.2 25)",
                      border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                    }}
                  >
                    {error}
                  </p>
                )}

                <Button
                  data-ocid="ai_password.submit_button"
                  type="submit"
                  disabled={isLoading || !passcode.trim()}
                  className="btn-primary w-full h-11 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Access DemonZeno AI
                    </>
                  )}
                </Button>
              </form>

              <p
                className="text-xs text-center mt-4"
                style={{ color: "oklch(0.45 0.01 260)" }}
              >
                Session expires when you close this tab. No data stored.
              </p>
            </div>
          )}

          {/* Powered by */}
          <p className="text-xs" style={{ color: "oklch(0.45 0.01 260)" }}>
            Powered by 25+ AI providers · Gemini · Grok · ChatGPT · and more
          </p>
        </div>
      </div>
    </div>
  );
}
