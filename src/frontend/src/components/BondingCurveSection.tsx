import { useEffect, useRef } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

function BondingCurveChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const path = svg.querySelector("path.curve-line");
    if (!path) return;
    const len = (path as SVGPathElement).getTotalLength?.() ?? 300;
    (path as SVGPathElement).style.strokeDasharray = `${len}`;
    (path as SVGPathElement).style.strokeDashoffset = `${len}`;

    let frame: number;
    let start: number | null = null;
    const dur = 2000;
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(1, elapsed / dur);
      const eased = 1 - (1 - progress) ** 3;
      (path as SVGPathElement).style.strokeDashoffset = `${len * (1 - eased)}`;
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(svg);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // SVG curve: x=0 (high supply, low price) curves to x=300 (low supply, high price)
  // Exponential bonding curve path
  const W = 320;
  const H = 180;
  const pad = 30;
  // Points along an exponential: y = H - exp((x/W)^1.5 * 5.5) * (H-2*pad)/(exp(5.5)-1) + pad
  const points: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const x = pad + t * (W - 2 * pad);
    const y =
      H - pad - ((Math.exp(t * 3.5) - 1) / (Math.exp(3.5) - 1)) * (H - 2 * pad);
    points.push([x, y]);
  }
  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-sm mx-auto"
      role="img"
      aria-label="Bonding curve chart"
    >
      {/* Grid lines */}
      <line
        x1={pad}
        y1={pad}
        x2={pad}
        y2={H - pad}
        stroke="oklch(0.88 0.01 260)"
        strokeWidth="1"
      />
      <line
        x1={pad}
        y1={H - pad}
        x2={W - pad}
        y2={H - pad}
        stroke="oklch(0.88 0.01 260)"
        strokeWidth="1"
      />

      {/* Axis labels */}
      <text
        x={pad / 2}
        y={H / 2}
        fill="oklch(0.55 0.01 260)"
        fontSize="9"
        textAnchor="middle"
        transform={`rotate(-90, ${pad / 2}, ${H / 2})`}
      >
        Price
      </text>
      <text
        x={W / 2}
        y={H - 4}
        fill="oklch(0.55 0.01 260)"
        fontSize="9"
        textAnchor="middle"
      >
        Tokens Burned / Supply Reduced
      </text>

      {/* Fill under curve */}
      <path
        d={`${d} L${(W - pad).toFixed(1)},${(H - pad).toFixed(1)} L${pad},${(H - pad).toFixed(1)} Z`}
        fill="oklch(0.65 0.15 190 / 0.07)"
      />

      {/* Animated curve line */}
      <path
        className="curve-line"
        d={d}
        fill="none"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Launch point marker */}
      <circle cx={W - pad} cy={pad + 8} r="5" fill="oklch(0.65 0.22 25)" />
      <text
        x={W - pad - 2}
        y={pad - 2}
        fill="oklch(0.65 0.22 25)"
        fontSize="8"
        textAnchor="end"
      >
        Listing ↑
      </text>
    </svg>
  );
}

const STEPS = [
  {
    emoji: "🔥",
    label: "Burn DMNZ",
    desc: "2028 buyback burns large supply",
  },
  {
    emoji: "📉",
    label: "Supply Drops",
    desc: "Circulating tokens decrease sharply",
  },
  {
    emoji: "📈",
    label: "Price Rises",
    desc: "Scarcity drives market value up",
  },
  {
    emoji: "⚡",
    label: "Bonding Curve Hit",
    desc: "Protocol threshold triggered",
  },
  {
    emoji: "🌐",
    label: "Exchange Listed",
    desc: "DMNZ qualifies for new exchanges",
  },
];

export function BondingCurveSection() {
  return (
    <section
      id="bonding-curve"
      data-ocid="bonding_curve.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Mechanics
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              The Bonding Curve Explained
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              How the 2028 Buyback & Burn triggers exchange listings through
              protocol mechanics.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Chart */}
          <ScrollAnimation direction="left" delay={100}>
            <div className="bg-card border border-border rounded-2xl p-6 card-elevated">
              <p className="text-sm font-display font-semibold text-foreground mb-4 text-center">
                Price vs. Supply Reduction (Bonding Curve)
              </p>
              <BondingCurveChart />
            </div>
          </ScrollAnimation>

          {/* Steps */}
          <ScrollAnimation direction="right" delay={100}>
            <div className="flex flex-col gap-4">
              {STEPS.map(({ emoji, label, desc }, i) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5"
                    style={{ background: "oklch(0.65 0.15 190 / 0.1)" }}
                  >
                    {emoji}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-display font-bold text-foreground text-sm">
                        {label}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs pl-7">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
