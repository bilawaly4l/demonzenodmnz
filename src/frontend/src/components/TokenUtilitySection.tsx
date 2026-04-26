import { BarChart3, Flame, Globe, Users, Zap } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

const UTILITIES = [
  {
    icon: <Flame className="w-6 h-6" />,
    title: "Burn Mechanics",
    desc: "A portion of every DMNZ transaction goes toward periodic burns. Each burn reduces circulating supply, creating natural upward price pressure.",
    color: "oklch(0.65 0.22 25)",
    bg: "oklch(0.65 0.22 25 / 0.1)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Governance",
    desc: "DMNZ holders vote on major protocol decisions — burn schedules, exchange listing targets, and community initiatives.",
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.1)",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Exchange Listings",
    desc: "When the 2028 buyback & burn triggers the bonding curve on Blum, DMNZ automatically qualifies for listing on centralized and decentralized exchanges.",
    color: "oklch(0.7 0.18 145)",
    bg: "oklch(0.7 0.18 145 / 0.1)",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Signal Perks",
    desc: "Holders gain priority access to AI signals, early alert notifications, and the ability to export branded signal cards with DMNZ watermarking.",
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.1)",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Community Perks",
    desc: "Hall of Fame eligibility, signal leaderboard rankings, exclusive community badges, and early access to new AI features.",
    color: "oklch(0.7 0.15 280)",
    bg: "oklch(0.7 0.15 280 / 0.1)",
  },
];

export function TokenUtilitySection() {
  return (
    <section
      id="token-utility"
      data-ocid="token_utility.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Token
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ Token Utility
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Post-launch, DMNZ is more than a meme. It powers the entire
              DemonZeno ecosystem.
            </p>
          </div>
        </ScrollAnimation>

        {/* Flow diagram */}
        <ScrollAnimation delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-12">
            {[
              "Hold DMNZ",
              "Participate in Burns",
              "Price Increases",
              "Bonding Curve Triggers",
              "Exchange Listings",
            ].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="px-4 py-2 rounded-full border font-display font-semibold text-xs text-center"
                  style={{
                    borderColor: "oklch(0.65 0.15 190 / 0.4)",
                    background: "oklch(0.65 0.15 190 / 0.08)",
                    color: "oklch(0.65 0.15 190)",
                  }}
                >
                  {label}
                </div>
                {i < arr.length - 1 && (
                  <span className="text-primary/60 font-bold hidden md:block text-lg">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {UTILITIES.map(({ icon, title, desc, color, bg }, i) => (
            <ScrollAnimation key={title} delay={i * 70}>
              <div
                data-ocid={`token_utility.item.${i + 1}`}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: bg, color }}
                >
                  {icon}
                </div>
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
