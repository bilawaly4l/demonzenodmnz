import { useRoadmap } from "../hooks/useRoadmap";
import { ScrollAnimation } from "./ScrollAnimation";

const DEFAULT_MILESTONES = [
  {
    id: "2026",
    year: "2026",
    title: "Community Building on Binance",
    description:
      "Grow DemonZeno's presence on Binance Square with daily free signals. Build a strong, loyal community of traders across crypto, forex, and stocks. Establish credibility and reach through consistent, accurate signals.",
    status: "current" as const,
    icon: "🌐",
  },
  {
    id: "2027",
    year: "2027",
    title: "DMNZ Token Launch via BLUM Mini App",
    description:
      "Launch the DMNZ meme token as a Telegram Mini App on the BLUM platform — 100% fair launch, no presale, no insiders, no allocation. Everyone starts equal.",
    status: "upcoming" as const,
    icon: "🚀",
  },
  {
    id: "2028",
    year: "2028",
    title: "Massive Buyback & Burn",
    description:
      "Execute a massive DMNZ buyback and burn to reduce supply, increase token price, and trigger the bonding curve mechanism — enabling listings on additional exchanges.",
    status: "future" as const,
    icon: "🔥",
  },
];

const STATUS_STYLES = {
  current: {
    border: "border-[oklch(0.65_0.15_190)]",
    yearColor: "text-[oklch(0.65_0.22_22)]",
    glow: "shadow-[0_0_20px_oklch(0.65_0.15_190_/_0.2)]",
    badge:
      "bg-[oklch(0.65_0.15_190_/_0.15)] text-[oklch(0.75_0.15_190)] border border-[oklch(0.65_0.15_190_/_0.4)]",
    badgeText: "● CURRENT",
    dot: "bg-[oklch(0.65_0.15_190)]",
    line: "bg-[oklch(0.65_0.15_190)]",
  },
  upcoming: {
    border: "border-[oklch(0.65_0.22_22_/_0.6)]",
    yearColor: "text-[oklch(0.65_0.22_22)]",
    glow: "shadow-[0_0_15px_oklch(0.65_0.22_22_/_0.15)]",
    badge:
      "bg-[oklch(0.65_0.22_22_/_0.12)] text-[oklch(0.75_0.2_22)] border border-[oklch(0.65_0.22_22_/_0.35)]",
    badgeText: "⏳ UPCOMING",
    dot: "bg-[oklch(0.65_0.22_22)]",
    line: "bg-[oklch(0.65_0.22_22_/_0.5)]",
  },
  future: {
    border: "border-border",
    yearColor: "text-[oklch(0.65_0.22_22_/_0.7)]",
    glow: "",
    badge: "bg-muted text-muted-foreground border border-border",
    badgeText: "🔮 FUTURE",
    dot: "bg-muted-foreground",
    line: "bg-border",
  },
};

export function RoadmapSection() {
  const { milestones, isLoading } = useRoadmap();

  // Use backend data if available, otherwise use defaults
  const items =
    !isLoading && milestones.length > 0
      ? milestones.map((m, i) => ({
          id: `milestone-${i}`,
          year: m.year,
          title: m.title,
          description: m.description,
          status: (i === 0 ? "current" : i === 1 ? "upcoming" : "future") as
            | "current"
            | "upcoming"
            | "future",
          icon: ["🌐", "🚀", "🔥"][i] ?? "⭐",
        }))
      : DEFAULT_MILESTONES;

  return (
    <section
      id="roadmap"
      data-ocid="roadmap.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.65 0.15 190 / 0.04), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <ScrollAnimation>
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest block mb-3">
              Roadmap
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              2026 → 2028
            </h2>
            <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">
              The DemonZeno journey from community building to token launch and
              beyond.
            </p>
          </div>
        </ScrollAnimation>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="flex flex-col gap-10">
            {items.map((milestone, i) => {
              const style = STATUS_STYLES[milestone.status];
              const isEven = i % 2 === 0;

              return (
                <ScrollAnimation key={milestone.id} delay={i * 120}>
                  <div
                    data-ocid={`roadmap.milestone.item.${i + 1}`}
                    className={`relative md:flex ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
                  >
                    {/* Year dot (desktop center) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-card border-2 border-border items-center justify-center z-10 text-lg">
                      {milestone.icon}
                    </div>

                    {/* Card */}
                    <div
                      className={`md:w-[calc(50%-3rem)] ${isEven ? "md:mr-12" : "md:ml-12"}`}
                    >
                      <div
                        className={`bg-card border-2 ${style.border} rounded-2xl p-6 flex flex-col gap-4 ${style.glow} transition-smooth hover:scale-[1.01]`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl md:hidden">
                              {milestone.icon}
                            </span>
                            <span
                              className={`font-display font-black text-3xl ${style.yearColor}`}
                            >
                              {milestone.year}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full ${style.badge} shrink-0`}
                          >
                            {style.badgeText}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-foreground text-xl leading-tight">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for even layout */}
                    <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                  </div>
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
