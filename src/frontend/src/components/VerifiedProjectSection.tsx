import { Gem, MapPin, Rocket, ShieldCheck } from "lucide-react";

const POINTS = [
  {
    Icon: Rocket,
    label: "FAIR LAUNCH ON BLUM",
    sub: "No presale. No allocation.",
  },
  { Icon: MapPin, label: "PUBLIC ROADMAP", sub: "Every milestone documented." },
  { Icon: Gem, label: "NO HIDDEN WALLETS", sub: "Full on-chain transparency." },
];

export function VerifiedProjectSection() {
  return (
    <section
      data-ocid="verified.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <ShieldCheck
              className="w-7 h-7"
              style={{ color: "#D4AF37" }}
              aria-hidden="true"
            />
            <h2
              className="font-display font-black text-3xl md:text-5xl tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              VERIFIED <span style={{ color: "#D4AF37" }}>PROJECT</span>
            </h2>
          </div>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#606060" }}
          >
            Transparency. Not certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {POINTS.map((point, i) => (
            <div
              key={point.label}
              data-ocid={`verified.item.${i + 1}`}
              className="flex flex-col items-center gap-4 p-6 text-center"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(212,175,55,0.2)",
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.1)" }}
              >
                <point.Icon className="w-5 h-5" style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <p
                  className="font-display font-black text-xs uppercase tracking-widest mb-1"
                  style={{ color: "#D4AF37" }}
                >
                  {point.label}
                </p>
                <p className="text-xs" style={{ color: "#606060" }}>
                  {point.sub}
                </p>
              </div>
              <div
                className="mt-auto pt-3 w-full border-t"
                style={{ borderColor: "rgba(212,175,55,0.15)" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#D4AF37" }}
                >
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
