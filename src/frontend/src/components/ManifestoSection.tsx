import { ScrollAnimation } from "./ScrollAnimation";

const values = [
  {
    icon: "📡",
    title: "Signal over Noise",
    desc: "Every market move is wrapped in noise. DemonZeno cuts through it — delivering only the signals that matter, backed by data not hype.",
  },
  {
    icon: "🎯",
    title: "Precision over Emotion",
    desc: "Emotion is the enemy of profit. Entries, targets, and stop-losses are calculated with cold precision — no FOMO, no panic, no guessing.",
  },
  {
    icon: "⚔️",
    title: "Edge over Guesswork",
    desc: "Winning traders don't predict — they trade with an edge. DemonZeno gives you that edge every single day, completely free.",
  },
];

export function ManifestoSection() {
  return (
    <section
      id="manifesto"
      data-ocid="manifesto.section"
      className="relative py-28 overflow-hidden bg-background"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.145 0.01 260) 0%, oklch(0.16 0.02 220) 50%, oklch(0.145 0.01 260) 100%)",
      }}
    >
      {/* Highway road illustration via CSS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Road surface */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(0deg, oklch(0.12 0.005 260) 0%, transparent 100%)",
          }}
        />
        {/* Center lane dashes */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center pb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-8 rounded-full"
              style={{
                background: "oklch(0.65 0.15 190 / 0.3)",
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </div>
        {/* Left road edge */}
        <div
          className="absolute bottom-0 left-[15%] w-px h-24"
          style={{
            background:
              "linear-gradient(0deg, oklch(0.65 0.15 190 / 0.15), transparent)",
          }}
        />
        {/* Right road edge */}
        <div
          className="absolute bottom-0 right-[15%] w-px h-24"
          style={{
            background:
              "linear-gradient(0deg, oklch(0.65 0.15 190 / 0.15), transparent)",
          }}
        />
        {/* Ambient sky glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 rounded-full blur-3xl"
          style={{ background: "oklch(0.65 0.15 190 / 0.04)" }}
        />
      </div>

      {/* Crimson accent line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: "oklch(0.65 0.2 22 / 0.6)" }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Headline */}
        <div className="text-center mb-16">
          <ScrollAnimation>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">
              Manifesto
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={80}>
            <h2
              className="font-display font-bold text-6xl md:text-8xl text-foreground leading-none mb-6"
              style={{ textShadow: "0 0 40px oklch(0.65 0.15 190 / 0.25)" }}
            >
              Master the <span className="text-primary">Chaos.</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={160}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a
              God."
            </p>
          </ScrollAnimation>
        </div>

        {/* Values row */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon, title, desc }, i) => (
            <ScrollAnimation key={title} delay={200 + i * 120}>
              <div
                data-ocid={`manifesto.value.${i + 1}`}
                className="relative flex flex-col gap-4 p-7 rounded-2xl border border-border/60 card-elevated group hover:border-primary/40 transition-smooth"
                style={{ background: "oklch(0.18 0.01 260 / 0.85)" }}
              >
                {/* Top border accent on hover */}
                <div className="absolute top-0 left-6 right-6 h-px rounded-full bg-primary/0 group-hover:bg-primary/50 transition-smooth" />
                <div className="text-4xl">{icon}</div>
                <h3 className="font-display font-bold text-foreground text-xl">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}
