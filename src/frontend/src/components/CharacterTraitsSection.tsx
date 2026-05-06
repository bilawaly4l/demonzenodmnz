const TRAITS = [
  {
    number: "01",
    trait: "FEARLESS",
    color: "oklch(0.62 0.16 190)",
    colorBg: "oklch(0.62 0.16 190 / 0.08)",
    colorBorder: "oklch(0.62 0.16 190 / 0.25)",
    line: "He doesn't fear volatility. He fears only one thing — letting emotion override strategy.",
    quote:
      "The market is a mirror. Master your reflection before you master the chart.",
  },
  {
    number: "02",
    trait: "FAIR",
    color: "oklch(0.70 0.18 70)",
    colorBg: "oklch(0.65 0.15 70 / 0.08)",
    colorBorder: "oklch(0.65 0.15 70 / 0.25)",
    line: "No presale. No team tokens. No early access. Fair is not a feature — it's the foundation.",
    quote:
      "In a space built on asymmetry, the most radical thing is to be genuinely fair.",
  },
  {
    number: "03",
    trait: "COMMUNITY-FIRST",
    color: "oklch(0.65 0.18 145)",
    colorBg: "oklch(0.65 0.18 145 / 0.08)",
    colorBorder: "oklch(0.65 0.18 145 / 0.25)",
    line: "DMNZ belongs to every person who believed in it before it was real.",
    quote:
      "You don't build a movement alone. You build it by making every person feel like the reason it exists.",
  },
];

export function CharacterTraitsSection() {
  return (
    <section
      data-ocid="character_traits.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <h2
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
            }}
          >
            THREE CORE{" "}
            <span style={{ color: "oklch(0.62 0.16 190)" }}>TRAITS</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TRAITS.map(
            ({ number, trait, color, colorBg, colorBorder, line, quote }) => (
              <div
                key={trait}
                data-ocid={`character_traits.card.${number}`}
                className="flex flex-col"
                style={{
                  background: "oklch(0.14 0.015 260)",
                  border: `1px solid ${colorBorder}`,
                  borderTop: `3px solid ${color}`,
                }}
              >
                <div className="px-6 py-5" style={{ background: colorBg }}>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {number}
                  </span>
                  <h3
                    className="font-display font-black text-2xl uppercase mt-1"
                    style={{ color, letterSpacing: "-0.02em" }}
                  >
                    {trait}
                  </h3>
                </div>
                <div className="px-6 py-5 flex flex-col gap-4 flex-1">
                  <p
                    className="text-sm leading-snug"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {line}
                  </p>
                  <blockquote
                    className="border-l-2 pl-3 text-xs italic mt-auto"
                    style={{
                      borderColor: color,
                      color: "oklch(0.60 0.005 260)",
                    }}
                  >
                    &ldquo;{quote}&rdquo;
                    <footer className="mt-1 not-italic text-muted-foreground">
                      — DemonZeno
                    </footer>
                  </blockquote>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
