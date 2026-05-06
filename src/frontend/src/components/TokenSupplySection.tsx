import { useEffect, useRef, useState } from "react";

export function TokenSupplySection() {
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
      data-ocid="token_supply.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: "oklch(0.62 0.16 190 / 0.10)",
              border: "1px solid oklch(0.62 0.16 190 / 0.30)",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.62 0.16 190)" }}
            >
              Token Supply Visual
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            Before & After the{" "}
            <span style={{ color: "oklch(0.70 0.18 25)" }}>Burn</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            See exactly what happens to DMNZ supply after the January 2028 burn
            event.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before Burn */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.55 0.22 25 / 0.30)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transition: "all 0.6s ease-out",
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "oklch(0.70 0.18 25)" }}
              />
              <h3 className="font-display font-bold text-foreground">
                Before the Burn
              </h3>
              <span
                className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.55 0.22 25 / 0.12)",
                  color: "oklch(0.70 0.18 25)",
                  border: "1px solid oklch(0.55 0.22 25 / 0.30)",
                }}
              >
                April 2027
              </span>
            </div>

            {/* Supply bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Total Supply</span>
                <span
                  className="font-mono font-bold"
                  style={{ color: "oklch(0.70 0.18 25)" }}
                >
                  1,000,000,000 DMNZ
                </span>
              </div>
              <div
                className="h-4 rounded-full overflow-hidden"
                style={{ background: "oklch(0.20 0.01 260)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: visible ? "100%" : "0%",
                    background:
                      "linear-gradient(90deg, oklch(0.55 0.22 25), oklch(0.70 0.18 70))",
                    transition: "width 1.2s ease-out 0.3s",
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Circulating Supply",
                  pct: "100%",
                  color: "oklch(0.70 0.18 25)",
                },
                {
                  label: "Fair Launch (all public)",
                  pct: "100%",
                  color: "oklch(0.65 0.15 70)",
                },
                {
                  label: "Team Allocation",
                  pct: "0%",
                  color: "oklch(0.50 0.01 260)",
                },
                {
                  label: "Presale Tokens",
                  pct: "0%",
                  color: "oklch(0.50 0.01 260)",
                },
              ].map(({ label, pct, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-bold" style={{ color }}>
                    {pct}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* After Burn */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.62 0.16 190 / 0.30)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "all 0.6s ease-out 0.1s",
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "oklch(0.62 0.16 190)" }}
              />
              <h3 className="font-display font-bold text-foreground">
                After the Burn
              </h3>
              <span
                className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.62 0.16 190 / 0.12)",
                  color: "oklch(0.62 0.16 190)",
                  border: "1px solid oklch(0.62 0.16 190 / 0.30)",
                }}
              >
                Jan 2028
              </span>
            </div>

            {/* Supply bar after burn */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Remaining Supply</span>
                <span
                  className="font-mono font-bold"
                  style={{ color: "oklch(0.62 0.16 190)" }}
                >
                  500,000,000 DMNZ
                </span>
              </div>
              <div
                className="h-4 rounded-full overflow-hidden"
                style={{ background: "oklch(0.20 0.01 260)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: visible ? "50%" : "0%",
                    background:
                      "linear-gradient(90deg, oklch(0.62 0.16 190), oklch(0.65 0.18 145))",
                    transition: "width 1.2s ease-out 0.6s",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span style={{ color: "oklch(0.62 0.16 190)" }}>
                  Remaining: 50%
                </span>
                <span style={{ color: "oklch(0.55 0.22 25)" }}>
                  <span style={{ color: "oklch(0.55 0.22 25)" }}>
                    Burned: 50%
                  </span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "Remaining Circulating",
                  pct: "500M",
                  color: "oklch(0.62 0.16 190)",
                },
                {
                  label: "Permanently Burned",
                  pct: "500M",
                  color: "oklch(0.55 0.22 25)",
                },
                {
                  label: "Supply Reduction",
                  pct: "-50%",
                  color: "oklch(0.65 0.18 145)",
                },
                {
                  label: "Scarcity Created",
                  pct: "2×",
                  color: "oklch(0.70 0.18 70)",
                },
              ].map(({ label, pct, color }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-bold" style={{ color }}>
                    {pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-6 rounded-2xl p-5 text-center"
          style={{
            background: "oklch(0.62 0.16 190 / 0.06)",
            border: "1px solid oklch(0.62 0.16 190 / 0.20)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease-out 0.8s",
          }}
        >
          <p className="text-sm text-muted-foreground">
            <span
              style={{ color: "oklch(0.62 0.16 190)" }}
              className="font-bold"
            >
              The math is simple:
            </span>{" "}
            Less supply + same or growing demand = price appreciation potential.
            The burn is not a gimmick — it&apos;s a commitment.
          </p>
        </div>
      </div>
    </section>
  );
}
