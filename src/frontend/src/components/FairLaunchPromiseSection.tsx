export function FairLaunchPromiseSection() {
  const declarations = [
    "NO TOKEN RESERVED FOR ANY TEAM, INSIDER, OR WALLET.",
    "NO PRESALE. NO PRIVATE ROUND. NO EARLY ACCESS — EVER.",
    "EVERY BUYER ENTERS THROUGH THE SAME PUBLIC CURVE.",
  ];

  return (
    <section
      data-ocid="fair_launch_promise.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a", borderTop: "3px solid #DC143C" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            THE FAIR LAUNCH <span style={{ color: "#DC143C" }}>PROMISE</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 mb-12">
          {declarations.map((decl, i) => (
            <div
              key={decl}
              data-ocid={`fair_launch.declaration.${i + 1}`}
              className="flex items-start gap-5 p-5"
              style={{
                background: "#111111",
                borderLeft: "3px solid #DC143C",
              }}
            >
              <span
                className="font-mono font-black text-xs mt-0.5 shrink-0"
                style={{ color: "rgba(220,20,60,0.6)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p
                className="font-display font-black text-sm md:text-base uppercase tracking-wide leading-relaxed"
                style={{ color: "#FFFFFF" }}
              >
                {decl}
              </p>
            </div>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-4 py-6"
          style={{
            border: "1px solid rgba(212,175,55,0.2)",
            background: "rgba(212,175,55,0.04)",
          }}
        >
          <div className="text-center">
            <div
              className="font-display font-black text-2xl tracking-widest mb-1"
              style={{ color: "#D4AF37" }}
            >
              — DEMONZENO
            </div>
            <div
              className="text-xs uppercase tracking-widest"
              style={{ color: "#606060" }}
            >
              @Demon_Zeno · Binance Square
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
