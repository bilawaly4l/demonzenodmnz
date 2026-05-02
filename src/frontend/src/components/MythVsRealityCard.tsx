// ─── Myth vs Reality Card ─────────────────────────────────────────────────────

interface MythEntry {
  myth: string;
  reality: string;
}

interface MythVsRealityCardProps {
  items: MythEntry[];
  tierColor: string;
}

export function MythVsRealityCard({
  items,
  tierColor,
}: MythVsRealityCardProps) {
  if (!items || items.length === 0) return null;
  return (
    <div
      className="rounded-xl overflow-hidden my-3"
      style={{
        background: "oklch(0.16 0.02 260)",
        border: "1px solid oklch(0.30 0.05 30 / 0.40)",
      }}
      data-ocid="academy.lesson.myth_vs_reality"
    >
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{
          background: "oklch(0.20 0.04 30 / 0.35)",
          borderBottom: "1px solid oklch(0.35 0.08 30 / 0.30)",
        }}
      >
        <span className="text-sm">⚔️</span>
        <p
          className="font-display font-bold text-xs uppercase tracking-widest"
          style={{ color: "oklch(0.75 0.14 45)" }}
        >
          Myth vs Reality
        </p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {items.map((item, _i) => (
          <div key={item.myth} className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <span
                className="shrink-0 text-xs font-bold px-1.5 py-0.5 rounded mt-0.5"
                style={{
                  background: "oklch(0.20 0.10 20)",
                  color: "oklch(0.70 0.18 20)",
                }}
              >
                MYTH
              </span>
              <p className="text-sm text-muted-foreground italic">
                {item.myth}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="shrink-0 text-xs font-bold px-1.5 py-0.5 rounded mt-0.5"
                style={{
                  background: `${tierColor}18`,
                  color: tierColor,
                }}
              >
                FACT
              </span>
              <p className="text-sm" style={{ color: "oklch(0.80 0.01 260)" }}>
                {item.reality}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
