// ─── Did You Know Card ────────────────────────────────────────────────────────
// Inline callout fact cards shown within lesson content

interface DYKCardProps {
  fact: string;
  tierColor: string;
}

export function DYKCard({ fact, tierColor }: DYKCardProps) {
  return (
    <div
      className="rounded-xl px-4 py-3 my-2 flex items-start gap-3"
      style={{
        background: `${tierColor}08`,
        border: `1px solid ${tierColor}22`,
        borderLeft: `3px solid ${tierColor}`,
      }}
      data-ocid="academy.lesson.dyk_card"
    >
      <span className="text-base shrink-0 mt-0.5">💡</span>
      <div className="min-w-0">
        <p
          className="text-xs font-bold uppercase tracking-wider mb-0.5"
          style={{ color: tierColor }}
        >
          Did You Know?
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{fact}</p>
      </div>
    </div>
  );
}
