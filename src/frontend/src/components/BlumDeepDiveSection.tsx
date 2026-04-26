import { Button } from "@/components/ui/button";
import { CheckCircle, Rocket, ShoppingBag, Users, Zap } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

const FEATURES = [
  {
    icon: <Users className="w-5 h-5 text-primary" />,
    title: "Telegram-Native",
    desc: "Blum lives inside Telegram. No separate app download — users launch it from their existing Telegram account.",
  },
  {
    icon: <CheckCircle className="w-5 h-5 text-primary" />,
    title: "Fair Launch First",
    desc: "Blum's infrastructure is built for community-first launches. No VCs, no presale — just open participation.",
  },
  {
    icon: <ShoppingBag className="w-5 h-5 text-primary" />,
    title: "Built-in Trading",
    desc: "Blum integrates DEX liquidity directly, enabling token swaps without leaving the mini app.",
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "Instant Access",
    desc: "Millions of Telegram users can access DMNZ from day one — no wallet setup friction, no gas tutorials needed.",
  },
  {
    icon: <Rocket className="w-5 h-5 text-primary" />,
    title: "Bonding Curve Support",
    desc: "Blum supports bonding curve mechanics natively — the 2028 burn event will automatically trigger the listing protocol.",
  },
];

function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-48"
      role="img"
      aria-label="Blum mini app phone mockup"
    >
      {/* Phone shell */}
      <div
        className="rounded-[2rem] border-4 overflow-hidden flex flex-col"
        style={{
          borderColor: "oklch(0.55 0.01 260)",
          background: "oklch(0.12 0.02 260)",
          height: "320px",
          width: "180px",
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between px-4 py-2 text-xs"
          style={{ color: "oklch(0.75 0.01 260)" }}
        >
          <span>9:41</span>
          <div
            className="w-12 h-3 rounded-full"
            style={{ background: "oklch(0.22 0.02 260)" }}
          />
          <span>100%</span>
        </div>

        {/* App header */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b"
          style={{ borderColor: "oklch(0.22 0.02 260)" }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "oklch(0.65 0.15 190)",
              color: "oklch(0.12 0.02 260)",
            }}
          >
            D
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.92 0.005 260)" }}
          >
            DemonZeno (DMNZ)
          </span>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-2 p-3">
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: "oklch(0.65 0.15 190 / 0.12)" }}
          >
            <p
              className="text-xs font-bold"
              style={{ color: "oklch(0.65 0.15 190)" }}
            >
              DMNZ
            </p>
            <p
              className="text-lg font-display font-bold mt-1"
              style={{ color: "oklch(0.92 0.005 260)" }}
            >
              $0.00042
            </p>
            <p className="text-xs" style={{ color: "oklch(0.7 0.18 145)" }}>
              +12.5% today
            </p>
          </div>

          <div
            className="rounded-xl p-3 flex flex-col gap-2"
            style={{ background: "oklch(0.18 0.02 260)" }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(0.75 0.01 260)" }}
            >
              Fair Launch
            </p>
            {[40, 65, 80].map((pct) => (
              <div
                key={pct}
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "oklch(0.25 0.02 260)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Buy button */}
          <div
            className="rounded-xl py-2.5 text-center text-xs font-bold mt-auto"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
              color: "oklch(0.12 0.02 260)",
            }}
          >
            Buy DMNZ
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute -inset-4 rounded-[2.5rem] blur-2xl -z-10"
        style={{ background: "oklch(0.65 0.15 190 / 0.1)" }}
      />
    </div>
  );
}

export function BlumDeepDiveSection() {
  return (
    <section
      id="blum-deep-dive"
      data-ocid="blum_deep_dive.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Platform
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Why Blum?
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Blum is the future of token launches — and DMNZ is launching there
              on April 2, 2028.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Phone mockup */}
          <ScrollAnimation direction="left" delay={100}>
            <div className="flex justify-center">
              <PhoneMockup />
            </div>
          </ScrollAnimation>

          {/* Features list */}
          <ScrollAnimation direction="right" delay={100}>
            <div className="flex flex-col gap-5">
              {FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display font-bold text-foreground text-sm">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}

              <Button
                data-ocid="blum_deep_dive.learn_more.button"
                asChild
                className="btn-primary w-fit mt-2 gap-2"
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
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
