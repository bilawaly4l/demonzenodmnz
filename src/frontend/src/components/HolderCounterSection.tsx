import { useCommunityStats } from "../hooks/useCommunity";

export function HolderCounterSection() {
  const { data: stats } = useCommunityStats();
  const count = stats != null ? Number(stats.earlyBelieverCount) : null;

  return (
    <section
      data-ocid="holder_counter.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: "oklch(0.62 0.16 190 / 0.10)",
            border: "1px solid oklch(0.62 0.16 190 / 0.30)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "oklch(0.62 0.16 190)" }}
          />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Community Growing
          </span>
        </div>

        <div className="mb-6">
          <div
            className="font-display font-black text-7xl md:text-8xl tabular-nums mb-2"
            style={{
              color: "oklch(0.62 0.16 190)",
              textShadow: "0 0 40px oklch(0.62 0.16 190 / 0.4)",
            }}
            data-ocid="holder_counter.count"
          >
            {count !== null ? count.toLocaleString() : "0"}
          </div>
          <p className="font-display font-bold text-xl text-foreground mb-2">
            Early Believers
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "oklch(0.65 0.18 145 / 0.10)",
              border: "1px solid oklch(0.65 0.18 145 / 0.30)",
            }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "oklch(0.70 0.16 145)" }}
            >
              Growing ↑
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
          Every believer added before launch is a founding member of the DMNZ
          community. The community is the token.
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[
            {
              label: "Hype Posts",
              value: stats != null ? Number(stats.hypeCount) : 0,
            },
            {
              label: "OG Believers",
              value: stats != null ? Number(stats.first100Count) : 0,
            },
            {
              label: "Interested",
              value: stats != null ? Number(stats.interestCount) : 0,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.22 0.01 260)",
              }}
            >
              <div
                className="font-display font-black text-xl"
                style={{ color: "oklch(0.62 0.16 190)" }}
              >
                {typeof value === "number" ? value.toLocaleString() : value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
