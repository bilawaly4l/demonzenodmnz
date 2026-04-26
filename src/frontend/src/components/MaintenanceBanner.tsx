interface MaintenanceBannerProps {
  message: string;
}

export function MaintenanceBanner({ message }: MaintenanceBannerProps) {
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
        background:
          "linear-gradient(135deg, oklch(0.145 0.01 260) 0%, oklch(0.12 0.02 220) 100%)",
        padding: "2rem",
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Glow effect behind icon */}
      <div
        style={{
          position: "relative",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, oklch(0.65 0.2 22 / 0.3) 0%, transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="52"
            height="52"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="oklch(0.65 0.2 22)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand */}
      <div
        style={{
          fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "oklch(0.95 0.005 260)",
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em",
          textShadow: "0 0 20px oklch(0.65 0.15 190 / 0.4)",
        }}
      >
        DemonZeno
      </div>

      <div
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "oklch(0.65 0.2 22)",
          marginBottom: "2rem",
          fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
        }}
      >
        MAINTENANCE MODE
      </div>

      {/* Divider */}
      <div
        style={{
          width: 60,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, oklch(0.65 0.15 190), transparent)",
          marginBottom: "2rem",
        }}
      />

      {/* Message */}
      <p
        style={{
          fontSize: "1rem",
          color: "oklch(0.75 0.01 260)",
          textAlign: "center",
          maxWidth: 480,
          lineHeight: 1.7,
          fontFamily: "var(--font-body, 'Satoshi', sans-serif)",
          marginBottom: "1.5rem",
        }}
      >
        {message ||
          "We're upgrading DemonZeno right now. Come back soon — the market never sleeps and neither do we."}
      </p>

      {/* Social links */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <a
          href="https://twitter.com/ZenoDemon"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.8rem",
            color: "oklch(0.65 0.15 190)",
            textDecoration: "none",
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.05em",
          }}
          aria-label="Follow on Twitter"
        >
          @ZenoDemon on Twitter
        </a>
        <span style={{ color: "oklch(0.35 0.01 260)" }}>·</span>
        <a
          href="https://www.binance.com/en/square/profile/DemonZeno"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.8rem",
            color: "oklch(0.65 0.15 190)",
            textDecoration: "none",
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.05em",
          }}
          aria-label="Follow on Binance Square"
        >
          @DemonZeno on Binance
        </a>
      </div>
    </div>
  );
}
