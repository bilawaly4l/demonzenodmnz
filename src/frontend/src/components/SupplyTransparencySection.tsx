const SUPPLY_STATS = [
  {
    label: "TOTAL SUPPLY",
    value: "1,000,000,000",
    unit: "DMNZ",
    color: "#FFFFFF",
    highlight: false,
  },
  {
    label: "TEAM ALLOCATION",
    value: "0",
    unit: "DMNZ",
    color: "#22c55e",
    highlight: false,
  },
  {
    label: "PRESALE ALLOCATION",
    value: "0",
    unit: "DMNZ",
    color: "#22c55e",
    highlight: false,
  },
  {
    label: "COMMUNITY",
    value: "100%",
    unit: "",
    color: "#D4AF37",
    highlight: true,
  },
  {
    label: "BURN TARGET",
    value: "TBD",
    unit: "JAN 2028",
    color: "#DC143C",
    highlight: false,
  },
];

export function SupplyTransparencySection() {
  return (
    <section
      data-ocid="supply.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h2
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            SUPPLY <span style={{ color: "#DC143C" }}>TRANSPARENCY</span>
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "#606060" }}
          >
            Plain numbers. No hidden wallets.
          </p>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-5 gap-px mb-6"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {SUPPLY_STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-ocid={`supply.stat.${i + 1}`}
              className="flex flex-col gap-1 p-5"
              style={{
                background: "#0a0a0a",
                borderTop: stat.highlight
                  ? `3px solid ${stat.color}`
                  : "3px solid transparent",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#606060" }}
              >
                {stat.label}
              </p>
              <span
                className="font-display font-black leading-none"
                style={{
                  color: stat.color,
                  fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </span>
              {stat.unit && (
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#404040" }}
                >
                  {stat.unit}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Distribution bar */}
        <div
          className="p-5"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#606060" }}
            >
              Token Distribution
            </p>
            <span className="text-xs font-bold" style={{ color: "#D4AF37" }}>
              100% Community
            </span>
          </div>
          <div
            className="w-full h-5 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
            role="progressbar"
            tabIndex={0}
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="100% community allocation"
          >
            <div
              className="h-full flex items-center justify-center font-black"
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #DC143C 0%, #D4AF37 100%)",
                color: "#0a0a0a",
                fontSize: "9px",
                letterSpacing: "3px",
              }}
            >
              COMMUNITY — 100%
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: "#404040" }}>
            Final supply confirmed April 2, 2027.
          </p>
        </div>
      </div>
    </section>
  );
}
