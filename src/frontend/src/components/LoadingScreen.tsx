import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "fading">("loading");

  useEffect(() => {
    const start = Date.now();
    const duration = 2200;

    const frame = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          setPhase("fading");
          setTimeout(onComplete, 500);
        }, 150);
      }
    };

    const raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        background:
          "linear-gradient(135deg, oklch(0.145 0.01 260) 0%, oklch(0.12 0.02 220) 100%)",
        transition: "opacity 0.5s ease",
        opacity: phase === "fading" ? 0 : 1,
        pointerEvents: phase === "fading" ? "none" : "all",
      }}
      aria-label="Loading DemonZeno"
    >
      {/* Logo glow ring */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="loading-screen-character"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, oklch(0.65 0.15 190 / 0.3) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ filter: "drop-shadow(0 0 12px oklch(0.65 0.15 190))" }}
          >
            {/* Shuriken / star */}
            <path
              d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9L12 2Z"
              fill="oklch(0.65 0.15 190)"
              stroke="oklch(0.75 0.12 190)"
              strokeWidth="0.5"
            />
            <circle cx="12" cy="12" r="3" fill="oklch(0.90 0.10 200)" />
          </svg>
        </div>

        {/* Orbiting ring */}
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: "50%",
            border: "2px solid oklch(0.65 0.15 190 / 0.3)",
            animation: "spin 3s linear infinite",
          }}
        />
        {/* Second ring, opposite */}
        <div
          style={{
            position: "absolute",
            inset: -16,
            borderRadius: "50%",
            border: "1px solid oklch(0.65 0.15 190 / 0.15)",
            animation: "spin 5s linear infinite reverse",
          }}
        />
      </div>

      {/* Brand name */}
      <div
        className="loading-screen-text"
        style={{ textAlign: "center", lineHeight: 1.2 }}
      >
        <div
          style={{
            fontSize: "2.25rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "oklch(0.95 0.005 260)",
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          }}
        >
          DemonZeno
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "oklch(0.65 0.15 190)",
            marginTop: "0.35rem",
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          DMNZ · Initializing
        </div>
      </div>

      {/* Progress bar */}
      <div className="loading-screen-bar" style={{ width: 240 }}>
        <div
          className="loading-screen-progress"
          style={{ width: `${progress}%`, transition: "width 0.05s linear" }}
        />
      </div>

      {/* Slogan */}
      <p
        style={{
          fontSize: "0.7rem",
          color: "oklch(0.55 0.01 260)",
          textAlign: "center",
          maxWidth: 320,
          lineHeight: 1.6,
          letterSpacing: "0.05em",
          fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
          animation: "fadeInUp 1s ease-out 0.8s both",
          padding: "0 1rem",
        }}
      >
        Master the Chaos, Slay the Market, and Trade Like a God.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
