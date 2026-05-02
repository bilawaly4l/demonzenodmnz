// ─── DemonZeno's War Room ─────────────────────────────────────────────────────
// End-of-tier summary with DemonZeno's personal take

interface WarRoomEntry {
  title: string;
  insight: string;
  quote: string;
}

interface WarRoomSectionProps {
  tierName: string;
  tierColor: string;
  entry: WarRoomEntry;
}

export function WarRoomSection({
  tierName,
  tierColor,
  entry,
}: WarRoomSectionProps) {
  return (
    <div
      className="rounded-2xl p-6 my-6"
      style={{
        background: `linear-gradient(135deg, ${tierColor}08 0%, oklch(0.14 0.02 260) 100%)`,
        border: `1px solid ${tierColor}35`,
        boxShadow: `0 0 40px ${tierColor}08`,
      }}
      data-ocid="academy.war_room"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{
            background: `${tierColor}18`,
            border: `1px solid ${tierColor}35`,
          }}
        >
          😈
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-display font-bold text-xs uppercase tracking-widest mb-1"
            style={{ color: tierColor }}
          >
            DemonZeno's War Room — {tierName} Debrief
          </p>
          <h3
            className="font-display font-bold text-lg mb-3"
            style={{ color: "oklch(0.90 0.01 260)" }}
          >
            {entry.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {entry.insight}
          </p>
          <div
            className="rounded-xl px-4 py-3"
            style={{
              background: `${tierColor}10`,
              border: `1px solid ${tierColor}25`,
              borderLeft: `3px solid ${tierColor}`,
            }}
          >
            <p
              className="text-sm font-semibold italic leading-relaxed"
              style={{ color: "oklch(0.80 0.05 260)" }}
            >
              &ldquo;{entry.quote}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground mt-1">— DemonZeno</p>
          </div>
        </div>
      </div>
    </div>
  );
}
