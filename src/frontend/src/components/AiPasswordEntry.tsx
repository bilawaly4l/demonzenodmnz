import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAiSession } from "../contexts/AiSessionContext";
import { useValidateAiPasscode } from "../hooks/useAiChat";

export function AiPasswordEntry() {
  const [passcode, setPasscode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const { validate, isLoading, error, clearError } = useValidateAiPasscode();
  const { setAiSessionToken } = useAiSession();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passcode.trim()) return;
    const result = await validate(passcode.trim());
    if (result) {
      setUnlocked(true);
      setTimeout(() => {
        setAiSessionToken(result.token);
      }, 700);
    }
  }

  return (
    <div
      data-ocid="ai_password.panel"
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.015 260) 0%, oklch(0.16 0.025 200) 50%, oklch(0.12 0.015 260) 100%)",
      }}
    >
      {/* Ambient teal glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: unlocked
            ? "radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.65 0.15 190 / 0.22), transparent)"
            : "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.65 0.15 190 / 0.10), transparent)",
          transition: "background 0.6s ease",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.65 0.15 190) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.15 190) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Highway road lines */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none overflow-hidden opacity-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.65 0.15 190 / 0.4), transparent)",
          }}
        />
        {["15%", "33%", "51%", "69%", "87%"].map((left) => (
          <div
            key={left}
            className="absolute bottom-0 h-full"
            style={{
              left,
              width: "2px",
              background:
                "linear-gradient(to top, oklch(0.65 0.15 190), transparent)",
              transform: "perspective(400px) rotateX(60deg)",
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="flex flex-col items-center gap-6">
          {/* Character image with cropped watermark */}
          <div
            className="relative w-28 rounded-2xl overflow-hidden"
            style={{
              border: unlocked
                ? "2px solid oklch(0.65 0.15 190 / 0.8)"
                : "2px solid oklch(0.65 0.15 190 / 0.35)",
              boxShadow: unlocked
                ? "0 0 40px oklch(0.65 0.15 190 / 0.4), 0 0 80px oklch(0.65 0.15 190 / 0.15)"
                : "0 0 20px oklch(0.65 0.15 190 / 0.1)",
              transition: "all 0.5s ease",
              height: "112px",
            }}
          >
            <img
              src="/assets/demonzeno-character.png"
              alt="DemonZeno AI"
              className="w-full object-cover object-top"
              style={{
                height: "136%",
                clipPath: "inset(0 0 18% 0)",
                marginBottom: "-18%",
              }}
            />
          </div>

          {/* Title block */}
          <div className="text-center">
            <h1
              className="font-display font-bold text-4xl tracking-tight"
              style={{
                color: "oklch(0.97 0.005 260)",
                textShadow: "0 0 32px oklch(0.65 0.15 190 / 0.5)",
              }}
            >
              Demon<span style={{ color: "oklch(0.65 0.15 190)" }}>Zeno</span>{" "}
              AI
            </h1>
            <p
              className="text-sm mt-2 font-medium"
              style={{ color: "oklch(0.55 0.08 190)" }}
            >
              Master the Market with 50+ AI Providers
            </p>
          </div>

          {/* Capability pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Crypto Signals",
              "Forex & Stocks",
              "Code Writing",
              "Market Analysis",
              "Signal Chaining",
              "Trade Journal",
            ].map((cap) => (
              <span
                key={cap}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.65 0.15 190 / 0.08)",
                  border: "1px solid oklch(0.65 0.15 190 / 0.2)",
                  color: "oklch(0.65 0.15 190 / 0.85)",
                }}
              >
                {cap}
              </span>
            ))}
          </div>

          {/* Success flash */}
          {unlocked && (
            <div
              className="w-full rounded-xl px-4 py-3 text-center font-semibold text-sm animate-pulse"
              style={{
                background: "oklch(0.65 0.15 190 / 0.15)",
                border: "1px solid oklch(0.65 0.15 190 / 0.5)",
                color: "oklch(0.75 0.15 190)",
              }}
            >
              ⚡ DemonZeno AI Unlocked — Entering…
            </div>
          )}

          {/* Card */}
          {!unlocked && (
            <div
              className="w-full rounded-2xl p-7"
              style={{
                background: "oklch(0.16 0.015 260)",
                border: "1px solid oklch(0.26 0.015 260)",
                boxShadow:
                  "0 32px 80px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.03)",
              }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="text-center mb-1">
                  <p
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "oklch(0.50 0.08 190)" }}
                  >
                    Enter Passcode to Unlock
                  </p>
                </div>

                <div className="relative">
                  <Input
                    data-ocid="ai_password.input"
                    type={showPass ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) clearError();
                    }}
                    placeholder="DemonZeno passcode…"
                    className="pr-10 h-12 text-base"
                    style={{
                      background: "oklch(0.12 0.01 260)",
                      border: "1px solid oklch(0.28 0.015 260)",
                      color: "oklch(0.95 0.005 260)",
                    }}
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "oklch(0.50 0.01 260)" }}
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
                      background: "oklch(0.55 0.22 25 / 0.12)",
                      color: "oklch(0.72 0.18 25)",
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
                  className="h-12 font-semibold text-base rounded-xl w-full"
                  style={{
                    background: isLoading
                      ? "oklch(0.45 0.12 190)"
                      : "linear-gradient(135deg, oklch(0.55 0.15 190) 0%, oklch(0.48 0.18 200) 100%)",
                    color: "oklch(0.98 0.005 260)",
                    border: "none",
                    boxShadow: "0 4px 24px oklch(0.55 0.15 190 / 0.35)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Unlock DemonZeno AI
                    </>
                  )}
                </Button>
              </form>

              <p
                className="text-xs text-center mt-4"
                style={{ color: "oklch(0.42 0.01 260)" }}
              >
                Session expires when you close this tab · No data stored
              </p>
            </div>
          )}

          {/* Footer note */}
          <p
            className="text-xs text-center"
            style={{ color: "oklch(0.40 0.01 260)" }}
          >
            Powered by 50+ AI providers · Gemini · Grok · ChatGPT · Claude ·
            DeepSeek · Groq · Mistral · and more
          </p>
        </div>
      </div>
    </div>
  );
}
