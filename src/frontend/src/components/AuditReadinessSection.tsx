import { Eye } from "lucide-react";

export function AuditReadinessSection() {
  return (
    <section
      data-ocid="audit.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <Eye
            className="w-6 h-6"
            style={{ color: "#D4AF37" }}
            aria-hidden="true"
          />
          <h2
            className="font-display font-black text-2xl md:text-4xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            TOTAL <span style={{ color: "#D4AF37" }}>TRANSPARENCY</span>
          </h2>
        </div>

        <p
          className="font-display font-black text-base md:text-lg uppercase tracking-wide leading-relaxed mb-8"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          No formal audit. No hidden wallets. No anonymous team.
          <br />
          <span style={{ color: "#D4AF37" }}>
            Everything verifiable on-chain and on Binance Square.
          </span>
        </p>

        <div
          className="inline-flex items-center gap-3 px-5 py-3"
          style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#D4AF37" }}
          >
            Commitment: Total Transparency.
          </span>
        </div>
      </div>
    </section>
  );
}
