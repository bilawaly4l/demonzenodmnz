import {
  Award,
  Flame,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Supply Drops After Burn",
    desc: "January 2028 removes 50% of circulating supply — permanent deflationary pressure.",
    accent: "oklch(0.62 0.16 190)",
    accentBg: "oklch(0.62 0.16 190 / 0.10)",
    accentBorder: "oklch(0.62 0.16 190 / 0.25)",
    stat: "Supply↓",
    statSub: "Post-Burn",
  },
  {
    icon: Flame,
    title: "Early Position Advantage",
    desc: "Less supply. Same demand. Early holders who stay through the burn stand at the front.",
    accent: "oklch(0.70 0.18 25)",
    accentBg: "oklch(0.55 0.22 25 / 0.10)",
    accentBorder: "oklch(0.55 0.22 25 / 0.25)",
    stat: "Value↑",
    statSub: "Post-Burn",
  },
  {
    icon: Award,
    title: "OG Believer Status",
    desc: "Early holders are permanently recognized on the community wall as founding members.",
    accent: "oklch(0.70 0.18 70)",
    accentBg: "oklch(0.65 0.15 70 / 0.10)",
    accentBorder: "oklch(0.65 0.15 70 / 0.25)",
    stat: "OG",
    statSub: "Status",
  },
  {
    icon: ShieldCheck,
    title: "No Insider Advantage",
    desc: "No one got in cheaper. Every DMNZ holder entered at the same price on the same day.",
    accent: "oklch(0.70 0.16 145)",
    accentBg: "oklch(0.65 0.18 145 / 0.10)",
    accentBorder: "oklch(0.65 0.18 145 / 0.25)",
    stat: "Fair",
    statSub: "Always",
  },
  {
    icon: Users,
    title: "Community Recognition",
    desc: "Your handle is publicly listed as a founding member of the DMNZ movement.",
    accent: "oklch(0.60 0.15 295)",
    accentBg: "oklch(0.60 0.15 295 / 0.10)",
    accentBorder: "oklch(0.60 0.15 295 / 0.25)",
    stat: "Listed",
    statSub: "Community",
  },
  {
    icon: Star,
    title: "DEX Listing Eligibility",
    desc: "When DMNZ hits the bonding curve target, it becomes eligible for broader exchange listings.",
    accent: "oklch(0.65 0.15 70)",
    accentBg: "oklch(0.65 0.15 70 / 0.10)",
    accentBorder: "oklch(0.65 0.15 70 / 0.25)",
    stat: "DEX",
    statSub: "Eligible",
  },
];

export function HolderBenefitsSection() {
  return (
    <section
      data-ocid="holder_benefits.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            HOLD EARLY.
          </h2>
          <p
            className="font-display font-black text-2xl md:text-3xl"
            style={{ color: "oklch(0.70 0.18 70)" }}
          >
            WIN LONG.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(
            (
              {
                icon: Icon,
                title,
                desc,
                accent,
                accentBg,
                accentBorder,
                stat,
                statSub,
              },
              i,
            ) => (
              <div
                key={title}
                data-ocid={`holder_benefits.card.${i + 1}`}
                className="flex flex-col gap-4 p-5"
                style={{
                  background: "oklch(0.14 0.012 260)",
                  border: `1px solid ${accentBorder}`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0"
                    style={{
                      background: accentBg,
                      border: `1px solid ${accentBorder}`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <div className="text-right">
                    <div
                      className="font-display font-black text-lg"
                      style={{ color: accent }}
                    >
                      {stat}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {statSub}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        <div
          className="mt-6 p-5 text-center"
          style={{
            background: "oklch(0.65 0.15 70 / 0.06)",
            border: "1px solid oklch(0.65 0.15 70 / 0.20)",
          }}
        >
          <p
            className="font-display font-black text-base uppercase tracking-widest"
            style={{ color: "oklch(0.70 0.18 70)" }}
          >
            “The ones who hold through the darkness see the dawn clearest.”
          </p>
          <p className="text-xs text-muted-foreground mt-1">— DemonZeno</p>
        </div>
      </div>
    </section>
  );
}
