const ROWS = [
  { feature: "PRESALE", rug: "Insiders buy cheap", dmnz: "None — ever" },
  { feature: "TEAM ALLOCATION", rug: "10–30% reserved", dmnz: "0%" },
  { feature: "HIDDEN WALLET", rug: "Devs hold millions", dmnz: "None" },
  { feature: "CREATOR IDENTITY", rug: "Anonymous", dmnz: "@Demon_Zeno" },
  { feature: "PUBLIC ROADMAP", rug: "No", dmnz: "Yes — dated" },
  { feature: "LAUNCH MODEL", rug: "Whale advantage", dmnz: "Equal entry" },
  { feature: "BURN EVENT", rug: "Never", dmnz: "Jan 2028" },
];

export function RugPullComparisonSection() {
  return (
    <section
      data-ocid="rug_comparison.section"
      className="py-16 md:py-20"
      style={{ background: "#111111" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            WHAT MAKES A TOKEN{" "}
            <span style={{ color: "#DC143C" }}>LEGITIMATE</span>
          </h2>
        </div>

        <div
          className="overflow-x-auto"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <table className="w-full" data-ocid="rug_comparison.table">
            <thead>
              <tr style={{ background: "#141414" }}>
                <th
                  className="text-left px-5 py-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#606060" }}
                >
                  CRITERION
                </th>
                <th className="px-5 py-4 text-center">
                  <span
                    className="font-display font-black text-xs uppercase tracking-widest"
                    style={{ color: "rgba(220,20,60,0.7)" }}
                  >
                    TYPICAL RUG
                  </span>
                </th>
                <th
                  className="px-5 py-4 text-center"
                  style={{ background: "rgba(212,175,55,0.05)" }}
                >
                  <span
                    className="font-display font-black text-xs uppercase tracking-widest"
                    style={{ color: "#D4AF37" }}
                  >
                    DMNZ
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  data-ocid={`rug_comparison.row.${i + 1}`}
                  style={{
                    background: i % 2 === 0 ? "#0f0f0f" : "#111111",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <td
                    className="px-5 py-3.5 text-xs font-bold uppercase tracking-widest"
                    style={{ color: "#FFFFFF" }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="px-5 py-3.5 text-center text-xs"
                    style={{ color: "rgba(220,20,60,0.7)" }}
                  >
                    {row.rug}
                  </td>
                  <td
                    className="px-5 py-3.5 text-center text-xs font-bold"
                    style={{
                      background: "rgba(212,175,55,0.04)",
                      color: "#D4AF37",
                    }}
                  >
                    {row.dmnz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
