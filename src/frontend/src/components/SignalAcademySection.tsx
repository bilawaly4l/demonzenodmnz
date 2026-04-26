import { ScrollAnimation } from "./ScrollAnimation";

const lessons = [
  {
    icon: "📈",
    title: "Reading Signals",
    desc: "Every signal has three keys: Entry (where you get in), Target (where you take profit), and Stop-Loss (where you cut losses). Miss any one and the edge disappears.",
  },
  {
    icon: "🛡️",
    title: "Risk Management",
    desc: "Never risk more than 1–2% of your account on a single trade. Size your position based on your stop-loss distance — not your feelings about the trade.",
  },
  {
    icon: "🕯️",
    title: "Candlestick Patterns",
    desc: "Bullish engulfing, doji, hammer — these are the market's fingerprints. DemonZeno reads them so you understand what's driving each signal's timing.",
  },
  {
    icon: "⏱️",
    title: "Timeframes",
    desc: "Scalp signals target minutes to hours. Swing trades run days to weeks. Long-term holds span months. Each requires different sizing and patience. Know which you're in.",
  },
  {
    icon: "🔥",
    title: "Confidence Levels",
    desc: "High confidence = strong technical alignment across multiple indicators. Medium = solid but with caveats. Low = speculative with higher risk. Adjust your size accordingly.",
  },
  {
    icon: "🌐",
    title: "Market Types",
    desc: "Crypto moves 24/7 with high volatility. Forex has fixed sessions and tighter spreads. Stocks react to news and earnings. Each has a rhythm — DemonZeno trades them all.",
  },
];

export function SignalAcademySection() {
  return (
    <section
      id="signal-academy"
      data-ocid="signal_academy.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.65 0.15 190 / 0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <ScrollAnimation>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">
              Education
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={80}>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Signal Academy
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={140}>
            <p className="text-muted-foreground mt-3 text-base max-w-lg mx-auto">
              Master the fundamentals. Trade like a god. No fluff — just what
              actually moves the needle.
            </p>
          </ScrollAnimation>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map(({ icon, title, desc }, i) => (
            <ScrollAnimation
              key={title}
              delay={180 + i * 90}
              direction={i % 3 === 0 ? "left" : i % 3 === 2 ? "right" : "up"}
            >
              <div
                data-ocid={`signal_academy.card.${i + 1}`}
                className="group relative bg-card border-l-4 border-t border-r border-b border-border rounded-2xl p-6 flex flex-col gap-3 card-elevated transition-smooth hover:-translate-y-1"
                style={{
                  borderLeftColor: "oklch(0.65 0.15 190 / 0.7)",
                }}
              >
                {/* Teal glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px oklch(0.65 0.15 190 / 0.25), 0 8px 32px oklch(0.65 0.15 190 / 0.1)",
                  }}
                />

                {/* Icon */}
                <div className="text-3xl">{icon}</div>

                {/* Title */}
                <h3 className="font-display font-bold text-foreground text-lg group-hover:text-primary transition-smooth">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>

                {/* Lesson number */}
                <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground/40 font-bold">
                  0{i + 1}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* CTA */}
        <ScrollAnimation delay={300}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              Ready to apply the knowledge?{" "}
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("signals")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-primary font-semibold hover:underline transition-smooth"
                data-ocid="signal_academy.view_signals.link"
              >
                View today's live signals →
              </button>
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
