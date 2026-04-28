import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CheckCircle,
  Download,
  Flame,
  Globe,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type { BurnTracker, HolderBenefit } from "../types";
import { CountdownTimer } from "./CountdownTimer";
import { ScrollAnimation } from "./ScrollAnimation";

// ─── Hooks ──────────────────────────────────────────────────────────────────
function useBurnTracker() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BurnTracker | null>({
    queryKey: ["burnTracker"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBurnTracker();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

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

// ─── Hype Bar ───────────────────────────────────────────────────────────────
const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z");
const START_DATE = new Date("2024-01-01T00:00:00Z");

function useProgress(): number {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    function calc() {
      const total = LAUNCH_DATE.getTime() - START_DATE.getTime();
      const elapsed = Date.now() - START_DATE.getTime();
      setPct(Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))));
    }
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);
  return pct;
}

// ─── Fallback benefits ──────────────────────────────────────────────────────
const FALLBACK_BENEFITS: HolderBenefit[] = [
  {
    id: "1",
    active: true,
    icon: "🔥",
    title: "Burn Participation Rights",
    description: "Vote on burn events — directly influencing token supply.",
  },
  {
    id: "2",
    active: true,
    icon: "📊",
    title: "Premium Signal Access",
    description:
      "Post-launch, DMNZ holders get exclusive access to premium AI signals.",
  },
  {
    id: "3",
    active: true,
    icon: "🏛️",
    title: "Community Governance",
    description:
      "Vote on roadmap decisions, exchange listings, and burn schedule.",
  },
  {
    id: "4",
    active: true,
    icon: "⚡",
    title: "Priority Notifications",
    description:
      "Holders receive early signal alerts before public Binance Square posts.",
  },
  {
    id: "5",
    active: true,
    icon: "🌐",
    title: "Exchange Listing Benefits",
    description:
      "When DMNZ hits the bonding curve, holders receive allocation priority.",
  },
  {
    id: "6",
    active: true,
    icon: "🎯",
    title: "Hall of Fame Eligibility",
    description:
      "Top DMNZ holders and winning traders get featured in the Hall of Fame.",
  },
];

const UTILITIES = [
  {
    icon: <Flame className="w-5 h-5" />,
    title: "Burn Mechanics",
    desc: "Periodic burns reduce supply and create upward price pressure.",
    color: "oklch(0.65 0.22 25)",
    bg: "oklch(0.65 0.22 25 / 0.1)",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Governance",
    desc: "DMNZ holders vote on burn schedules and exchange listing targets.",
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.1)",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Exchange Listings",
    desc: "The 2028 buyback & burn triggers the bonding curve for new listings.",
    color: "oklch(0.7 0.18 145)",
    bg: "oklch(0.7 0.18 145 / 0.1)",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Signal Perks",
    desc: "Priority access to AI signals and export branded signal cards.",
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.1)",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Community Perks",
    desc: "Hall of Fame eligibility, leaderboard rankings, exclusive badges.",
    color: "oklch(0.7 0.15 280)",
    bg: "oklch(0.7 0.15 280 / 0.1)",
  },
];

type ActiveTab = "info" | "utility" | "benefits" | "burn";

export function TokenSectionCombined() {
  const progress = useProgress();
  const { data: burnData } = useBurnTracker();
  const { data: benefitsData } = useHolderBenefits();
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");

  const benefits =
    benefitsData && benefitsData.filter((b) => b.active).length > 0
      ? benefitsData.filter((b) => b.active)
      : FALLBACK_BENEFITS;

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "info", label: "DMNZ Info" },
    { id: "utility", label: "Token Utility" },
    { id: "benefits", label: "Holder Benefits" },
    { id: "burn", label: "Burn Event" },
  ];

  return (
    <section id="token" data-ocid="token.section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Token
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ Token
            </h2>
            <p className="text-muted-foreground text-base">
              Launching April 2, 2028 · 100% Fair Launch · No Presale
            </p>
          </div>
        </ScrollAnimation>

        {/* Hype bar */}
        <ScrollAnimation delay={80}>
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 card-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold text-foreground text-sm">
                🚀 Launch Hype Bar
              </span>
              <span className="font-mono text-primary font-bold text-sm">
                {progress}%
              </span>
            </div>
            <div
              data-ocid="token.hype_bar.progress"
              className="h-3 bg-muted rounded-full overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Progress toward April 2, 2028 launch
            </p>
          </div>
        </ScrollAnimation>

        {/* Tab nav */}
        <ScrollAnimation delay={100}>
          <div
            className="flex gap-1 p-1 rounded-xl mb-8 w-full sm:w-fit mx-auto"
            style={{ background: "oklch(0.18 0.02 260)" }}
            data-ocid="token.tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`token.tab.${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold transition-smooth"
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

        {/* Tab: DMNZ Info */}
        {activeTab === "info" && (
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollAnimation direction="left">
              <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-5 card-elevated">
                <h3 className="font-display font-bold text-2xl text-foreground">
                  DemonZeno (DMNZ)
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  {[
                    ["Ticker", "DMNZ"],
                    ["Launch Type", "100% Fair Launch"],
                    ["Platform", "Telegram Mini App via Blum"],
                    ["Launch Date", "April 2, 2028"],
                    ["Presale", "None"],
                    ["Private Sale", "None"],
                    ["Allocation", "None"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center justify-between gap-2 py-2 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-semibold text-foreground font-mono">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="font-display font-bold text-primary text-sm">
                      100% Fair Launch
                    </p>
                    <p className="text-muted-foreground text-xs">
                      No presale · No insiders · No allocation breakdown
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right">
              <div className="flex flex-col gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated">
                  <p className="font-display font-semibold text-foreground text-lg">
                    Launch Countdown
                  </p>
                  <CountdownTimer />
                </div>
                <Button
                  data-ocid="token.whitepaper.download_button"
                  asChild
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/10 gap-2 h-11"
                >
                  <a
                    href="/whitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="w-4 h-4" />
                    Download DMNZ Whitepaper
                  </a>
                </Button>
              </div>
            </ScrollAnimation>
          </div>
        )}

        {/* Tab: Token Utility */}
        {activeTab === "utility" && (
          <div data-ocid="token_utility.section">
            {/* Flow diagram */}
            <ScrollAnimation delay={80}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-8">
                {[
                  "Hold DMNZ",
                  "Participate in Burns",
                  "Price Increases",
                  "Bonding Curve Triggers",
                  "Exchange Listings",
                ].map((label, i, arr) => (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className="px-3 py-1.5 rounded-full border font-display font-semibold text-xs text-center"
                      style={{
                        borderColor: "oklch(0.65 0.15 190 / 0.4)",
                        background: "oklch(0.65 0.15 190 / 0.08)",
                        color: "oklch(0.65 0.15 190)",
                      }}
                    >
                      {label}
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-primary/60 font-bold hidden md:block">
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
        )}

        {/* Tab: Holder Benefits */}
        {activeTab === "benefits" && (
          <div
            data-ocid="holder_benefits.section"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {benefits.map((benefit, i) => (
              <ScrollAnimation key={benefit.id} delay={i * 70}>
                <div
                  data-ocid={`holder_benefits.item.${i + 1}`}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth"
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

        {/* Tab: Burn Event */}
        {activeTab === "burn" && (
          <div data-ocid="burn.section" className="flex flex-col gap-8">
            {/* Burn tracker (admin counter) */}
            {burnData && (
              <ScrollAnimation>
                <div
                  className="bg-card border rounded-2xl p-6 flex flex-col items-center gap-3 text-center card-elevated"
                  style={{ borderColor: "oklch(0.55 0.22 25 / 0.3)" }}
                  data-ocid="burn_tracker.card"
                >
                  <Flame
                    className="w-8 h-8"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                  />
                  <p
                    className="font-display font-black text-4xl"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                  >
                    {Number(burnData.totalBurned).toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    DMNZ Burned (Running Total)
                  </p>
                </div>
              </ScrollAnimation>
            )}

            {/* Burn countdown */}
            <ScrollAnimation delay={80}>
              <div
                className="bg-card border rounded-2xl p-8 flex flex-col items-center gap-6 text-center card-elevated"
                style={{ borderColor: "oklch(0.55 0.22 25 / 0.3)" }}
              >
                <div className="flex flex-col gap-2">
                  <span
                    className="text-sm font-semibold uppercase tracking-widest"
                    style={{ color: "oklch(0.65 0.22 25)" }}
                  >
                    The Great Burn
                  </span>
                  <h3
                    className="font-display font-bold text-3xl"
                    style={{ color: "oklch(0.97 0.005 260)" }}
                  >
                    🔥 Burn Event Countdown
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    April 2, 2028 — Supply shrinks. Price ascends.
                  </p>
                </div>
                <CountdownTimer />
                <div
                  className="flex flex-col gap-2 rounded-xl px-6 py-4 border text-sm text-left"
                  style={{
                    background: "oklch(0.55 0.22 25 / 0.06)",
                    borderColor: "oklch(0.55 0.22 25 / 0.25)",
                  }}
                >
                  {[
                    "🔥 Reduce circulating supply permanently",
                    "📈 Create upward price pressure through scarcity",
                    "⚡ Trigger bonding curve → Exchange listings",
                  ].map((r) => (
                    <p key={r} style={{ color: "oklch(0.78 0.01 260)" }}>
                      {r}
                    </p>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        )}
      </div>
    </section>
  );
}
