import { ArrowRight, BarChart2, BookOpen, Zap } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

const STEPS = [
  {
    step: 1,
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: "Follow @DemonZeno on Binance Square",
    desc: "Go to Binance Square and search @DemonZeno. Follow the account to receive daily free trading signals directly in your feed.",
    ocid: "how_to_use.step.1",
  },
  {
    step: 2,
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Get Daily Signals",
    desc: "Each signal includes the asset name, direction (Buy/Sell), Entry price, Stop Loss, TP1, TP2, and TP3 clearly labeled.",
    ocid: "how_to_use.step.2",
  },
  {
    step: 3,
    icon: <BarChart2 className="w-6 h-6 text-primary" />,
    title: "Open Your Exchange",
    desc: "Log into your Binance account. Navigate to the futures or spot market for the signaled asset and review the current price.",
    ocid: "how_to_use.step.3",
  },
  {
    step: 4,
    icon: <ArrowRight className="w-6 h-6 text-primary" />,
    title: "Execute the Trade",
    desc: "Enter at the signaled Entry price. Set your Stop Loss at the exact SL value. Manage your exits at TP1, TP2, and TP3 in sequence.",
    ocid: "how_to_use.step.4",
  },
];

export function HowToUseSection() {
  return (
    <section
      id="how-to-use"
      data-ocid="how_to_use.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Getting Started
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              How to Use DemonZeno Signals
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Four simple steps from signal to live trade. No guesswork — just
              execute.
            </p>
          </div>
        </ScrollAnimation>

        {/* Desktop: horizontal connector */}
        <div className="hidden md:block relative mb-2">
          <div className="absolute top-[2.25rem] left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {STEPS.map(({ step, icon, title, desc, ocid }, i) => (
            <ScrollAnimation key={step} delay={i * 80}>
              <div
                data-ocid={ocid}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated relative group hover:border-primary/40 transition-smooth"
              >
                {/* Step number */}
                <div
                  className="absolute -top-3.5 left-5 w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-xs text-primary-foreground"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.15 190), oklch(0.7 0.18 145))",
                  }}
                >
                  {step}
                </div>

                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-smooth">
                  {icon}
                </div>

                <h3 className="font-display font-bold text-foreground text-sm leading-snug">
                  {title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Important reminder */}
        <ScrollAnimation delay={320}>
          <div className="mt-10 flex items-start gap-3 bg-primary/8 border border-primary/25 rounded-2xl p-5">
            <span className="text-2xl shrink-0">⚠️</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Remember:</strong> Always set
              your Stop Loss at the exact SL level given in the signal. Never
              trade without it. Risk management is the foundation of long-term
              success.
            </p>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
