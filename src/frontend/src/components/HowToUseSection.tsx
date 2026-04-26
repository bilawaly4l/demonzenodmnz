import { ArrowRight, Bot, Download, Eye, Zap } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

const STEPS = [
  {
    step: 1,
    icon: <Eye className="w-6 h-6 text-primary" />,
    title: "Visit the AI",
    desc: "Head to the /ai page on this site. DemonZeno's AI is ready — no signup, no KYC, just raw intelligence waiting for your command.",
    ocid: "how_to_use.step.1",
  },
  {
    step: 2,
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Enter Your Code",
    desc: "Enter your AI unlock code to activate Normal or Insane mode. Normal mode gives precise Binance signals. Insane mode — no limits.",
    ocid: "how_to_use.step.2",
  },
  {
    step: 3,
    icon: <Bot className="w-6 h-6 text-primary" />,
    title: "Ask DemonZeno",
    desc: 'Type your market question: "Give me a BTC signal for today" or "Analyze BNB trend." DemonZeno will respond with Entry, TP1, TP2, TP3, and Stop Loss.',
    ocid: "how_to_use.step.3",
  },
  {
    step: 4,
    icon: <ArrowRight className="w-6 h-6 text-primary" />,
    title: "Read the Signal",
    desc: "Every AI signal comes with structured data: Entry price, 3 Take Profit levels, Stop Loss, and a confidence gauge. No guesswork.",
    ocid: "how_to_use.step.4",
  },
  {
    step: 5,
    icon: <Download className="w-6 h-6 text-primary" />,
    title: "Execute & Export",
    desc: "Place your trade on Binance with the exact parameters. Download your signal as a branded DemonZeno card to share or archive.",
    ocid: "how_to_use.step.5",
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
              Guide
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              How to Use DemonZeno AI
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Five steps from zero to a live trade. No fluff, no tutorial videos
              — just the signal.
            </p>
          </div>
        </ScrollAnimation>

        {/* Desktop: horizontal connector */}
        <div className="hidden md:flex items-start gap-4 relative mb-2">
          <div className="absolute top-[2.25rem] left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
      </div>
    </section>
  );
}
