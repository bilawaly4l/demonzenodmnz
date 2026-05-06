const QUOTES = [
  { quote: "Trade the chart, not the news." },
  {
    quote: "The demons of trading are fear and greed. Know them. Control them.",
  },
  { quote: "Every loss is tuition. Every win is validation." },
  { quote: "Patience is the sharpest weapon in a trader's arsenal." },
  {
    quote:
      "Risk management isn't optional. It's the only reason traders survive.",
  },
  {
    quote: "The best traders aren't the bravest. They're the most disciplined.",
  },
  { quote: "Master the basics. Everything else is noise." },
  { quote: "In trading, the one who loses the least wins the most." },
  { quote: "Your trading plan is your shield. Never go to battle without it." },
  { quote: "Protect your capital like it's your life." },
  {
    quote: "Every pattern tells a story. Learn to read the chart like a book.",
  },
  { quote: "The exit matters more than the entry." },
  { quote: "Trading is 80% psychology, 20% strategy." },
  { quote: "Cut losses fast, let winners run." },
  { quote: "The trend is your only friend." },
  { quote: "DMNZ: Born from darkness, forged in discipline." },
  { quote: "Trade Like a God. Hold Like a Demon." },
  { quote: "Small consistent gains beat lucky big wins every time." },
  { quote: "The market is a mirror. It shows you your fear and your greed." },
  {
    quote:
      "In a space built on asymmetry, the most radical thing is to be genuinely fair.",
  },
];

export function QuotesWallSection() {
  return (
    <section
      data-ocid="quotes_wall.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.115 0.015 265)" }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10">
          <h2
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
            }}
          >
            WORDS OF{" "}
            <span style={{ color: "oklch(0.62 0.16 190)" }}>DEMONZENO</span>
          </h2>
        </div>

        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3"
          data-ocid="quotes_wall.grid"
        >
          {QUOTES.map(({ quote }, i) => (
            <div
              key={quote}
              data-ocid={`quotes_wall.item.${i + 1}`}
              className="break-inside-avoid p-5 flex flex-col gap-2"
              style={{
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.22 0.01 260)",
                borderLeft: "2px solid oklch(0.62 0.16 190 / 0.40)",
              }}
            >
              <p
                className="font-display font-bold text-sm leading-snug"
                style={{ color: "var(--foreground)" }}
              >
                &ldquo;{quote}&rdquo;
              </p>
              <span
                className="text-xs font-bold self-end"
                style={{ color: "oklch(0.62 0.16 190)" }}
              >
                — DZ
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
