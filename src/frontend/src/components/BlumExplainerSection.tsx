import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Rocket, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { ScrollAnimation } from "./ScrollAnimation";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z");
const START_DATE = new Date("2024-01-01T00:00:00Z");

function useLaunchProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function calc() {
      const total = LAUNCH_DATE.getTime() - START_DATE.getTime();
      const elapsed = Date.now() - START_DATE.getTime();
      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
      setProgress(Math.round(pct));
    }
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);

  return progress;
}

const cards = [
  {
    icon: <Rocket className="w-6 h-6 text-primary" />,
    title: "Blum Platform",
    body: "Blum is a next-gen Telegram Mini App with built-in token launch tools — designed for fair, open, community-first launches.",
    ocid: "blum.platform.card",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: "100% Fair Launch",
    body: "No presale. No VC allocation. No whitelists. Everyone gets in equal — the way a token launch should be.",
    ocid: "blum.fair_launch.card",
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "April 2, 2028",
    body: "The exact launch date on Blum Mini App. DMNZ goes live, and the open road begins. Be there when it happens.",
    ocid: "blum.launch_date.card",
  },
];

export function BlumExplainerSection() {
  const progress = useLaunchProgress();

  return (
    <section id="blum" data-ocid="blum.section" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-5xl flex flex-col gap-14">
        {/* Header */}
        <ScrollAnimation>
          <div className="flex flex-col gap-3 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mx-auto w-fit">
              <Rocket className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                Token Launch
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Launching via <span className="text-primary text-glow">Blum</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              What is Blum, and why does it matter for DMNZ?
            </p>
          </div>
        </ScrollAnimation>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map(({ icon, title, body, ocid }, i) => (
            <ScrollAnimation key={title} delay={i * 100}>
              <div
                data-ocid={ocid}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/40 transition-smooth relative overflow-hidden"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none rounded-2xl" />
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center relative z-10">
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-foreground text-lg relative z-10">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                  {body}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Launch Progress */}
        <ScrollAnimation delay={150}>
          <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated">
            <div className="flex items-center justify-between gap-2">
              <span className="font-display font-semibold text-foreground text-sm">
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
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on days elapsed since build start toward April 2, 2028.
            </p>
          </div>
        </ScrollAnimation>

        {/* Countdown + CTA */}
        <ScrollAnimation delay={200}>
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
            <Button
              data-ocid="blum.get_notified.button"
              onClick={() => scrollTo("notify")}
              className="btn-primary px-8 h-11 text-base"
            >
              <Bell className="w-4 h-4 mr-2" />
              Get Notified
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
