import { Ban, ShieldCheck, TrendingUp } from "lucide-react";

const POINTS = [
  { Icon: Ban, label: "NO PRESALE", sub: "Zero early access" },
  {
    Icon: ShieldCheck,
    label: "NO TEAM ALLOCATION",
    sub: "Zero reserved tokens",
  },
  {
    Icon: TrendingUp,
    label: "NO HIDDEN WALLETS",
    sub: "Full on-chain transparency",
  },
];

export function TokenomicsExplainerSection() {
  return (
    <section
      data-ocid="tokenomics_explainer.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2
          className="font-display font-black text-4xl md:text-6xl tracking-tight mb-4"
          style={{ color: "#FFFFFF" }}
        >
          NO TOKENOMICS.
        </h2>
        <h2
          className="font-display font-black text-4xl md:text-6xl tracking-tight mb-12"
          style={{ color: "#DC143C" }}
        >
          FULL FAIR LAUNCH.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POINTS.map((point, i) => (
            <div
              key={point.label}
              data-ocid={`tokenomics.point.${i + 1}`}
              className="flex flex-col items-center gap-3 p-6"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(220,20,60,0.2)",
              }}
            >
              <point.Icon
                className="w-6 h-6"
                style={{ color: "#DC143C" }}
                aria-hidden="true"
              />
              <p
                className="font-display font-black text-sm uppercase tracking-widest"
                style={{ color: "#FFFFFF" }}
              >
                {point.label}
              </p>
              <p className="text-xs" style={{ color: "#606060" }}>
                {point.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
