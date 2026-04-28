import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, ShoppingBag, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { ScrollAnimation } from "./ScrollAnimation";

type BlumTab = "what" | "how" | "why";

const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z");
const START_DATE = new Date("2024-01-01T00:00:00Z");

function useLaunchProgress(): number {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function calc() {
      const total = LAUNCH_DATE.getTime() - START_DATE.getTime();
      const elapsed = Date.now() - START_DATE.getTime();
      setProgress(
        Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))),
      );
    }
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);
  return progress;
}

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-48 animate-bounce"
      style={{ animationDuration: "3s" }}
    >
      <div
        className="rounded-[2.5rem] border-4 overflow-hidden flex flex-col"
        style={{
          borderColor: "oklch(0.65 0.15 190)",
          background: "oklch(0.12 0.015 260)",
          height: "420px",
          width: "192px",
          boxShadow:
            "0 0 40px oklch(0.65 0.15 190 / 0.3), 0 20px 60px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-14 h-4 rounded-full bg-card" />
        </div>
        {/* App header */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b"
          style={{ borderColor: "oklch(0.65 0.15 190 / 0.2)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
            style={{
              background: "oklch(0.65 0.15 190 / 0.2)",
              color: "oklch(0.72 0.18 195)",
            }}
          >
            DZ
          </div>
          <div>
            <p
              className="font-display font-bold text-xs"
              style={{ color: "oklch(0.72 0.18 195)" }}
            >
              DMNZ on BLUM
            </p>
            <p className="text-muted-foreground text-xs">Telegram Mini App</p>
          </div>
        </div>
        {/* Screen content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black font-display"
            style={{
              background: "oklch(0.65 0.15 190 / 0.2)",
              color: "oklch(0.72 0.18 195)",
              border: "1px solid oklch(0.65 0.15 190 / 0.4)",
            }}
          >
            DZ
          </div>
          <p
            className="font-display font-bold text-base text-center"
            style={{ color: "oklch(0.72 0.18 195)" }}
          >
            DemonZeno (DMNZ)
          </p>
          <div
            className="w-full rounded-xl p-3 text-center"
            style={{
              background: "oklch(0.65 0.22 22 / 0.12)",
              border: "1px solid oklch(0.65 0.22 22 / 0.35)",
            }}
          >
            <p className="text-xs text-muted-foreground">Fair Launch Date</p>
            <p
              className="font-display font-bold text-sm mt-0.5"
              style={{ color: "oklch(0.75 0.2 22)" }}
            >
              April 2, 2028
            </p>
          </div>
          <div
            className="w-full py-3 rounded-xl text-center text-sm font-bold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.15 190), oklch(0.55 0.18 210))",
              color: "oklch(0.1 0 0)",
            }}
          >
            Fair Launch ⚡
          </div>
          <p className="text-xs text-muted-foreground text-center">
            No presale · No insiders · 100% fair
          </p>
        </div>
        <div
          className="h-10 flex items-center justify-center gap-4 px-4 border-t"
          style={{ borderColor: "oklch(0.65 0.15 190 / 0.15)" }}
        >
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div
            className="w-6 h-1 rounded-full"
            style={{ background: "oklch(0.65 0.15 190 / 0.5)" }}
          />
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
        </div>
      </div>
      <div
        className="mx-auto mt-2 rounded-full"
        style={{
          width: "120px",
          height: "10px",
          background: "oklch(0.65 0.15 190 / 0.15)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

const BLUM_FEATURES = [
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Telegram-Native",
    desc: "Blum lives inside Telegram — no separate app download needed.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-primary" />,
    title: "Fair Launch First",
    desc: "No VCs, no presale — built for community-first token launches.",
  },
  {
    icon: <ShoppingBag className="w-5 h-5 text-primary" />,
    title: "Built-in Trading",
    desc: "Integrates DEX liquidity directly. Trade without leaving the app.",
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "Instant Access",
    desc: "Millions of Telegram users can access DMNZ from day one.",
  },
  {
    icon: <Rocket className="w-5 h-5 text-primary" />,
    title: "Bonding Curve Support",
    desc: "The 2028 burn will automatically trigger the listing protocol.",
  },
];

export function BlumSectionCombined() {
  const progress = useLaunchProgress();
  const [activeTab, setActiveTab] = useState<BlumTab>("what");

  const tabs: { id: BlumTab; label: string }[] = [
    { id: "what", label: "What is Blum?" },
    { id: "why", label: "Why DMNZ on Blum?" },
    { id: "how", label: "How to Participate" },
  ];

  return (
    <section id="blum" data-ocid="blum.section" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mx-auto w-fit">
              <Rocket className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                Token Launch
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Launching via <span className="text-primary text-glow">Blum</span>
            </h2>
            <p className="text-muted-foreground text-base">
              April 2, 2028 — Telegram Mini App · 100% Fair Launch
            </p>
          </div>
        </ScrollAnimation>

        {/* Tabs */}
        <ScrollAnimation delay={80}>
          <div
            className="flex gap-1 p-1 rounded-xl mb-10 w-full sm:w-fit mx-auto"
            style={{ background: "oklch(0.18 0.02 260)" }}
            data-ocid="blum.tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                data-ocid={`blum.tab.${tab.id}`}
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

        {/* Tab: What is Blum */}
        {activeTab === "what" && (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation direction="left">
              <div className="flex flex-col gap-6">
                <p className="text-muted-foreground text-base leading-relaxed">
                  Blum is a next-generation Telegram Mini App with built-in
                  token launch infrastructure — designed for fair, open,
                  community-first launches. It brings DeFi to Telegram's 900M+
                  users without any friction.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Launch Date", value: "April 2, 2028" },
                    { label: "Platform", value: "BLUM — Telegram Mini App" },
                    { label: "Launch Type", value: "100% Fair Launch" },
                    { label: "Presale", value: "None" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0"
                    >
                      <span className="text-muted-foreground text-sm">
                        {label}
                      </span>
                      <span
                        className="font-semibold text-sm font-mono"
                        style={{ color: "oklch(0.72 0.18 195)" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Launch progress */}
                <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2 card-elevated">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-display font-semibold text-foreground">
                      Launch Progress
                    </span>
                    <span className="font-mono text-primary font-bold text-sm">
                      {progress}%
                    </span>
                  </div>
                  <div
                    data-ocid="blum.launch_progress.bar"
                    className="h-2.5 bg-muted rounded-full overflow-hidden"
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
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation direction="right">
              <PhoneMockup />
            </ScrollAnimation>
          </div>
        )}

        {/* Tab: Why DMNZ on Blum */}
        {activeTab === "why" && (
          <div className="flex flex-col gap-5">
            {BLUM_FEATURES.map(({ icon, title, desc }, i) => (
              <ScrollAnimation key={title} delay={i * 60}>
                <div
                  data-ocid={`blum.feature.item.${i + 1}`}
                  className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5 card-elevated hover:border-primary/30 transition-smooth"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground text-sm">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                      {desc}
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
            <ScrollAnimation delay={300}>
              <Button
                data-ocid="blum.learn_more.button"
                asChild
                className="btn-primary w-fit gap-2"
              >
                <a
                  href="https://blum.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Rocket className="w-4 h-4" />
                  Learn More About Blum
                </a>
              </Button>
            </ScrollAnimation>
          </div>
        )}

        {/* Tab: How to Participate */}
        {activeTab === "how" && (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ScrollAnimation direction="left">
              <div className="flex flex-col gap-5">
                {[
                  {
                    step: 1,
                    title: "Join Telegram",
                    desc: "Make sure you have a Telegram account. Blum runs entirely inside Telegram as a Mini App.",
                  },
                  {
                    step: 2,
                    title: "Find DMNZ on Blum",
                    desc: "On April 2, 2028, search for DemonZeno (DMNZ) on the Blum platform within Telegram.",
                  },
                  {
                    step: 3,
                    title: "Participate in Fair Launch",
                    desc: "Everyone gets equal access — no whitelist, no presale. First come, fully fair.",
                  },
                  {
                    step: 4,
                    title: "Hold & Benefit",
                    desc: "Hold DMNZ for governance rights, signal perks, and participation in the 2028 burn event.",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 mt-0.5"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
                        color: "oklch(0.12 0.02 260)",
                      }}
                    >
                      {step}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground text-sm">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="right">
              <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-6 text-center card-elevated">
                <div className="flex flex-col gap-2">
                  <p className="font-display font-bold text-foreground text-xl">
                    Time Until Launch
                  </p>
                  <p className="text-muted-foreground text-sm">
                    April 2, 2028 — Blum Mini App
                  </p>
                </div>
                <CountdownTimer />
              </div>
            </ScrollAnimation>
          </div>
        )}
      </div>
    </section>
  );
}
