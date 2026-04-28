import { useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

type PhilosophyTab = "philosophy" | "psychology" | "mistakes";

const CONTENT: Record<
  PhilosophyTab,
  {
    tag: string;
    title: string;
    items: { icon: string; title: string; desc: string }[];
  }
> = {
  philosophy: {
    tag: "Philosophy",
    title: "The DemonZeno Signal Philosophy",
    items: [
      {
        icon: "🎯",
        title: "Structure Over Emotion",
        desc: "Every signal from DemonZeno is built on price structure, not gut feelings. When the chart speaks, we listen — not the news.",
      },
      {
        icon: "⚡",
        title: "Entry, TP, SL — Always",
        desc: "A signal without a stop loss is a gamble. DemonZeno always gives you three Take Profit targets and a clear Stop Loss. No exceptions.",
      },
      {
        icon: "🌐",
        title: "Risk Before Reward",
        desc: "DemonZeno calculates risk first. Never trade a signal where the risk-reward ratio is below 1:2. The downside defines the upside.",
      },
    ],
  },
  psychology: {
    tag: "Psychology",
    title: "Trading Psychology",
    items: [
      {
        icon: "🧠",
        title: "Emotions Are the Enemy",
        desc: "Fear and greed destroy accounts. Execute your plan, stick to your stop loss, and detach from the outcome.",
      },
      {
        icon: "📉",
        title: "A Loss is Data",
        desc: "Every losing trade is a lesson. DemonZeno treats losses as tuition paid to the market. Log it, learn it, move on.",
      },
      {
        icon: "⏳",
        title: "Patience is an Edge",
        desc: "The best signals come to those who wait. Don't chase entries. If you missed it, the next one is coming.",
      },
    ],
  },
  mistakes: {
    tag: "Mistakes",
    title: "Mistakes to Avoid",
    items: [
      {
        icon: "🚫",
        title: "Trading Without a Stop Loss",
        desc: "Never enter a trade without defining your exit on the downside. The market will find your pain point without one.",
      },
      {
        icon: "💸",
        title: "Over-Leveraging",
        desc: "10x leverage on a 5% move wipes your account. Start with low leverage until your win rate is proven.",
      },
      {
        icon: "🔄",
        title: "Revenge Trading",
        desc: "Lost 3 in a row? Step away. Revenge trades are emotionally driven and almost always lose.",
      },
    ],
  },
};

export function PhilosophySectionCombined() {
  const [activeTab, setActiveTab] = useState<PhilosophyTab>("philosophy");

  const tabs: { id: PhilosophyTab; label: string }[] = [
    { id: "philosophy", label: "Philosophy" },
    { id: "psychology", label: "Psychology" },
    { id: "mistakes", label: "Mistakes" },
  ];

  const section = CONTENT[activeTab];

  return (
    <section
      id="philosophy"
      data-ocid="philosophy.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Mindset
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Trade Like a God
            </h2>
            <p className="text-muted-foreground text-base">
              The mental framework behind every DemonZeno signal.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={80}>
          <div
            className="flex gap-1 p-1 rounded-xl mb-10 w-full sm:w-fit mx-auto"
            style={{ background: "oklch(0.18 0.02 260)" }}
            data-ocid="philosophy.tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`philosophy.tab.${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-semibold transition-smooth"
                style={
                  activeTab === tab.id
                    ? {
                        background: "oklch(0.65 0.15 190)",
                        color: "oklch(0.12 0.02 260)",
                      }
                    : { color: "oklch(0.65 0.01 260)" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div className="flex flex-col gap-2 mb-8 text-center">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">
              {section.tag}
            </span>
            <h3 className="font-display font-bold text-2xl text-foreground">
              {section.title}
            </h3>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-3 gap-6">
          {section.items.map(({ icon, title, desc }, i) => (
            <ScrollAnimation key={title} delay={i * 80}>
              <div
                data-ocid={`philosophy.${activeTab}.item.${i + 1}`}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth"
              >
                <div className="text-3xl">{icon}</div>
                <h3 className="font-display font-bold text-foreground text-base">
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
