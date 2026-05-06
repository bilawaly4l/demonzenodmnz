import { CheckCircle, XCircle } from "lucide-react";

const ROWS = [
  { feature: "FAIR LAUNCH", dmnz: true, others: false },
  { feature: "NO PRESALE", dmnz: true, others: false },
  { feature: "NO TEAM ALLOCATION", dmnz: true, others: false },
  { feature: "NO HIDDEN WALLETS", dmnz: true, others: false },
  { feature: "PUBLIC ROADMAP", dmnz: true, others: false },
  { feature: "BONDING CURVE MODEL", dmnz: true, others: false },
  { feature: "BURN EVENT COMMITTED", dmnz: true, others: false },
];

export function TokenComparisonSection() {
  return (
    <section
      id="token"
      data-ocid="comparison.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight mb-3"
            style={{ color: "#FFFFFF" }}
          >
            DMNZ <span style={{ color: "#DC143C" }}>VS</span> THE REST
          </h2>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#606060" }}
          >
            The only meme coin that checks every box.
          </p>
        </div>

        <div
          className="overflow-x-auto"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <table className="w-full" data-ocid="comparison.table">
            <thead>
              <tr style={{ background: "#141414" }}>
                <th
                  className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#606060" }}
                >
                  CRITERION
                </th>
                <th
                  className="px-6 py-4 text-center"
                  style={{ background: "rgba(220,20,60,0.06)" }}
                >
                  <span
                    className="font-display font-black text-sm uppercase tracking-widest"
                    style={{ color: "#DC143C" }}
                  >
                    DMNZ
                  </span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span
                    className="font-display font-black text-sm uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    OTHERS
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  data-ocid={`comparison.row.${i + 1}`}
                  style={{
                    background: i % 2 === 0 ? "#0f0f0f" : "#111111",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <td
                    className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#FFFFFF" }}
                  >
                    {row.feature}
                  </td>
                  <td
                    className="px-6 py-3.5 text-center"
                    style={{ background: "rgba(220,20,60,0.04)" }}
                  >
                    <CheckCircle
                      className="w-5 h-5 mx-auto"
                      style={{ color: "#DC143C" }}
                    />
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <XCircle
                      className="w-5 h-5 mx-auto"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    />
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
