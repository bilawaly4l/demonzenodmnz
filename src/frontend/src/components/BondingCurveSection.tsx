export function BondingCurveSection() {
  return (
    <section
      data-ocid="bonding_curve.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            THE BONDING CURVE
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Buy early. Pay less. Everyone plays fair.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div
            className="p-6"
            style={{
              background: "oklch(0.14 0.015 260)",
              border: "1px solid oklch(0.62 0.16 190 / 0.25)",
            }}
          >
            <svg
              viewBox="0 0 320 220"
              className="w-full"
              role="img"
              aria-label="Bonding curve price chart"
            >
              <defs>
                <linearGradient
                  id="curveGrad"
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="oklch(0.62 0.16 190 / 0.3)" />
                  <stop offset="100%" stopColor="oklch(0.70 0.18 70 / 0.8)" />
                </linearGradient>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.62 0.16 190 / 0.20)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.16 190 / 0.02)" />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="300"
                  y2={y}
                  stroke="oklch(0.25 0.01 260)"
                  strokeWidth="1"
                />
              ))}
              {[90, 140, 190, 240, 290].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="10"
                  x2={x}
                  y2="180"
                  stroke="oklch(0.25 0.01 260)"
                  strokeWidth="1"
                />
              ))}
              <path
                d="M 40 180 Q 90 175 130 160 Q 160 145 190 120 Q 220 90 250 55 Q 270 30 290 15 L 290 180 Z"
                fill="url(#areaGrad)"
              />
              <path
                d="M 40 180 Q 90 175 130 160 Q 160 145 190 120 Q 220 90 250 55 Q 270 30 290 15"
                fill="none"
                stroke="url(#curveGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="180"
                x2="300"
                y2="180"
                stroke="oklch(0.40 0.01 260)"
                strokeWidth="1.5"
              />
              <line
                x1="40"
                y1="10"
                x2="40"
                y2="180"
                stroke="oklch(0.40 0.01 260)"
                strokeWidth="1.5"
              />
              <text
                x="168"
                y="210"
                textAnchor="middle"
                fill="oklch(0.55 0.01 260)"
                fontSize="10"
              >
                Tokens Purchased →
              </text>
              <text
                x="18"
                y="100"
                textAnchor="middle"
                fill="oklch(0.55 0.01 260)"
                fontSize="10"
                transform="rotate(-90 18 100)"
              >
                Price ↑
              </text>
              <circle cx="40" cy="180" r="4" fill="oklch(0.62 0.16 190)" />
              <circle cx="290" cy="15" r="5" fill="oklch(0.70 0.18 70)" />
              <line
                x1="250"
                y1="55"
                x2="250"
                y2="180"
                stroke="oklch(0.70 0.18 70 / 0.50)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
              />
              <text x="255" y="175" fill="oklch(0.70 0.18 70)" fontSize="8">
                Target
              </text>
              <text x="45" y="175" fill="oklch(0.62 0.16 190)" fontSize="8">
                Launch Price
              </text>
              <text x="255" y="12" fill="oklch(0.70 0.18 70)" fontSize="8">
                DEX
              </text>
              <text x="80" y="145" fill="oklch(0.62 0.16 190)" fontSize="8">
                Price rises as
              </text>
              <text x="80" y="155" fill="oklch(0.62 0.16 190)" fontSize="8">
                more DMNZ bought
              </text>
            </svg>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                step: "01",
                title: "Launch Price",
                desc: "Starts at the fair launch price. Every participant pays the same.",
                color: "oklch(0.62 0.16 190)",
              },
              {
                step: "02",
                title: "Price Rises Automatically",
                desc: "Each buy pushes the price higher — no manual intervention.",
                color: "oklch(0.65 0.18 145)",
              },
              {
                step: "03",
                title: "January 2028 Burn",
                desc: "50% supply burn creates additional upward pressure on the curve.",
                color: "oklch(0.70 0.18 25)",
              },
              {
                step: "04",
                title: "Curve Target Hit → DEX",
                desc: "At the bonding curve target, DMNZ becomes eligible for DEX listings.",
                color: "oklch(0.70 0.18 70)",
              },
            ].map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="flex gap-4 p-4"
                style={{
                  background: "oklch(0.14 0.012 260)",
                  border: "1px solid oklch(0.22 0.01 260)",
                }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0 font-mono font-black text-xs"
                  style={{ background: color, color: "oklch(0.10 0.01 260)" }}
                >
                  {step}
                </div>
                <div>
                  <p className="font-display font-bold text-foreground text-sm mb-0.5">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
