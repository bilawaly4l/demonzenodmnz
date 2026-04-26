import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { HolderBenefit } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function useHolderBenefits() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HolderBenefit[]>({
    queryKey: ["holderBenefits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHolderBenefits();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

const FALLBACK: HolderBenefit[] = [
  {
    id: "1",
    active: true,
    icon: "🔥",
    title: "Burn Participation Rights",
    description:
      "DMNZ holders vote on burn events — directly influencing token supply and price action.",
  },
  {
    id: "2",
    active: true,
    icon: "📊",
    title: "Premium Signal Access",
    description:
      "Post-launch, DMNZ holders get exclusive access to premium AI signals with higher confidence thresholds.",
  },
  {
    id: "3",
    active: true,
    icon: "🏛️",
    title: "Community Governance",
    description:
      "Vote on roadmap decisions, exchange listings, and burn schedule milestones.",
  },
  {
    id: "4",
    active: true,
    icon: "⚡",
    title: "Priority Notifications",
    description:
      "Holders receive early signal alerts before they're posted publicly on Binance Square.",
  },
  {
    id: "5",
    active: true,
    icon: "🌐",
    title: "Exchange Listing Benefits",
    description:
      "When DMNZ hits the bonding curve and lists on new exchanges, holders receive allocation priority.",
  },
  {
    id: "6",
    active: true,
    icon: "🎯",
    title: "Hall of Fame Eligibility",
    description:
      "Top DMNZ holders and winning traders get featured in the DemonZeno Hall of Fame.",
  },
];

export function HolderBenefitsSection() {
  const { data, isLoading } = useHolderBenefits();
  const benefits =
    data && data.filter((b) => b.active).length > 0
      ? data.filter((b) => b.active)
      : FALLBACK;

  return (
    <section
      id="holder-benefits"
      data-ocid="holder_benefits.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Benefits
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              What DMNZ Holders Get
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Holding DMNZ is more than owning a token — it's membership in the
              DemonZeno ecosystem.
            </p>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="h-36 bg-card border border-border rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => (
              <ScrollAnimation key={benefit.id} delay={i * 70}>
                <div
                  data-ocid={`holder_benefits.item.${i + 1}`}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: "oklch(0.65 0.15 190 / 0.1)" }}
                    >
                      {benefit.icon}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug">
                        {benefit.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                    style={{
                      background: "oklch(0.65 0.15 190 / 0.1)",
                      color: "oklch(0.65 0.15 190)",
                      border: "1px solid oklch(0.65 0.15 190 / 0.25)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Coming April 2, 2028
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
