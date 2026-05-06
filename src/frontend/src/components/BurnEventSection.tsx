import { useEffect, useRef, useState } from "react";

const BURN_DATE = "January 1, 2028";
const BURN_AMOUNT = "500,000,000";
const REMAINING = "500,000,000";

function BurnFlameAnimation() {
  return (
    <div className="relative flex items-center justify-center w-48 h-48 md:w-64 md:h-64 mx-auto">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl animate-pulse"
        style={{ background: "oklch(0.55 0.22 25 / 0.20)" }}
      />
      {/* SVG Flame */}
      <svg
        viewBox="0 0 120 160"
        className="relative z-10 w-32 h-44 md:w-48 md:h-56"
        role="img"
        aria-label="DMNZ burn flame"
      >
        <defs>
          <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="oklch(0.80 0.18 70)" />
            <stop offset="40%" stopColor="oklch(0.65 0.22 30)" />
            <stop
              offset="100%"
              stopColor="oklch(0.45 0.20 20)"
              stopOpacity="0"
            />
          </radialGradient>
          <radialGradient id="innerFlame" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.05 80)" />
            <stop offset="60%" stopColor="oklch(0.75 0.18 60)" />
            <stop
              offset="100%"
              stopColor="oklch(0.55 0.22 25)"
              stopOpacity="0"
            />
          </radialGradient>
          <radialGradient id="tealBase" cx="50%" cy="100%" r="50%">
            <stop
              offset="0%"
              stopColor="oklch(0.62 0.16 190)"
              stopOpacity="0.5"
            />
            <stop
              offset="100%"
              stopColor="oklch(0.62 0.16 190)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>
        {/* Outer flame */}
        <path
          d="M60 10 C45 30 20 50 25 90 C28 115 45 140 60 150 C75 140 92 115 95 90 C100 50 75 30 60 10Z"
          fill="url(#flameGrad)"
          opacity="0.9"
        />
        {/* Left tongue */}
        <path
          d="M60 30 C35 55 30 75 35 100 C40 120 50 138 60 150 C55 130 48 110 52 90 C56 70 62 55 60 30Z"
          fill="url(#flameGrad)"
          opacity="0.7"
        />
        {/* Right tongue */}
        <path
          d="M60 30 C85 55 90 75 85 100 C80 120 70 138 60 150 C65 130 72 110 68 90 C64 70 58 55 60 30Z"
          fill="url(#flameGrad)"
          opacity="0.6"
        />
        {/* Inner hot flame */}
        <path
          d="M60 50 C52 65 48 80 50 100 C52 118 56 135 60 150 C64 135 68 118 70 100 C72 80 68 65 60 50Z"
          fill="url(#innerFlame)"
        />
        {/* Teal base glow */}
        <ellipse cx="60" cy="150" rx="35" ry="10" fill="url(#tealBase)" />
        {/* Coin in flame */}
        <circle
          cx="60"
          cy="110"
          r="18"
          fill="oklch(0.70 0.18 70)"
          opacity="0.7"
        />
        <circle
          cx="60"
          cy="110"
          r="14"
          fill="oklch(0.14 0.01 260)"
          opacity="0.9"
        />
        <text
          x="60"
          y="115"
          textAnchor="middle"
          fill="oklch(0.70 0.18 70)"
          fontSize="10"
          fontWeight="bold"
        >
          DMNZ
        </text>
      </svg>
      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scaleX(1) scaleY(1); }
          25% { transform: scaleX(1.05) scaleY(0.97); }
          75% { transform: scaleX(0.95) scaleY(1.03); }
        }
      `}</style>
    </div>
  );
}

export function BurnEventSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-ocid="burn_event.section"
      className="py-16 md:py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.01 260) 0%, oklch(0.10 0.025 25) 50%, oklch(0.10 0.01 260) 100%)",
      }}
    >
      {/* Atmospheric glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.22 25 / 0.08)" }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: "oklch(0.55 0.22 25 / 0.12)",
              border: "1px solid oklch(0.55 0.22 25 / 0.40)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.65 0.22 25)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.70 0.18 25)" }}
            >
              The Burn Event
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-3">
            The <span style={{ color: "oklch(0.70 0.18 25)" }}>Great Burn</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            On January 1, 2028 — a massive buyback and permanent burn event will
            drastically reduce DMNZ supply and push toward the bonding curve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: animation */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <BurnFlameAnimation />
          </div>

          {/* Right: details */}
          <div
            className="flex flex-col gap-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            {/* Burn stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Tokens to Burn",
                  value: BURN_AMOUNT,
                  unit: "DMNZ",
                  accent: "oklch(0.70 0.18 25)",
                },
                {
                  label: "Remaining Supply",
                  value: REMAINING,
                  unit: "DMNZ",
                  accent: "oklch(0.62 0.16 190)",
                },
                {
                  label: "Burn Date",
                  value: "Jan 1",
                  unit: "2028",
                  accent: "oklch(0.70 0.18 70)",
                },
                {
                  label: "Supply Reduction",
                  value: "50%",
                  unit: "Burned",
                  accent: "oklch(0.65 0.18 145)",
                },
              ].map(({ label, value, unit, accent }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "oklch(0.14 0.015 260)",
                    border: "1px solid oklch(0.22 0.01 260)",
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-1">
                    {label}
                  </div>
                  <div
                    className="font-display font-black text-xl"
                    style={{ color: accent }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: accent, opacity: 0.7 }}
                  >
                    {unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.12 0.02 25 / 0.30)",
                border: "1px solid oklch(0.55 0.22 25 / 0.25)",
              }}
            >
              <h3 className="font-display font-bold text-foreground text-sm mb-4">
                Burn Event Timeline
              </h3>
              {[
                {
                  step: "1",
                  label: "Buyback Begins",
                  desc: "DMNZ bought from open market at market price",
                  color: "oklch(0.70 0.18 70)",
                },
                {
                  step: "2",
                  label: "Tokens Burned",
                  desc: "All bought DMNZ permanently removed from supply",
                  color: "oklch(0.70 0.18 25)",
                },
                {
                  step: "3",
                  label: "Supply Reduced",
                  desc: "50% circulating supply permanently gone forever",
                  color: "oklch(0.62 0.16 190)",
                },
                {
                  step: "4",
                  label: "Bonding Curve Push",
                  desc: "Reduced supply accelerates bonding curve target",
                  color: "oklch(0.65 0.18 145)",
                },
              ].map(({ step, label, desc, color }) => (
                <div key={step} className="flex gap-3 mb-3 last:mb-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-black mt-0.5"
                    style={{ background: color, color: "oklch(0.10 0.01 260)" }}
                  >
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "oklch(0.55 0.22 25 / 0.08)",
                border: "1px solid oklch(0.55 0.22 25 / 0.25)",
              }}
            >
              <p
                className="font-mono font-bold text-sm"
                style={{ color: "oklch(0.70 0.18 25)" }}
              >
                {BURN_DATE} · 00:00 UTC
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The most anticipated event in DMNZ history
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
