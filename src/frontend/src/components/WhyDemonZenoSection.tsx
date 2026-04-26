import { useEffect, useRef, useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

const stats = [
  { label: "AI Providers", value: 50, suffix: "+" },
  { label: "Take Profit Levels", value: 3, suffix: "" },
  { label: "Free Signals", value: 100, suffix: "%" },
  { label: "Binance-Verified", value: 100, suffix: "%" },
];

const features = [
  { label: "Free Forever", demonzeno: true },
  { label: "3 TP Targets per Signal", demonzeno: true },
  { label: "Stop-Loss Always Included", demonzeno: true },
  { label: "Entry Price Specified", demonzeno: true },
  { label: "Multi-AI Powered Analysis", demonzeno: true },
  { label: "No Registration Required", demonzeno: true },
  { label: "Admin-Updated Sentiment", demonzeno: true },
  { label: "Signal Accuracy Tracking", demonzeno: true },
];

function AnimatedCounter({
  target,
  suffix,
  running,
}: {
  target: number;
  suffix: string;
  running: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!running) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [running, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function WhyDemonZenoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [countersRunning, setCountersRunning] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Fallback: if IntersectionObserver never fires (e.g. already in view), start after 400ms
    const fallbackTimer = setTimeout(() => setCountersRunning(true), 400);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallbackTimer);
          setCountersRunning(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-demonzeno"
      data-ocid="why_demonzeno.section"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.15 190 / 0.05)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.2 22 / 0.04)" }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollAnimation>
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 block">
              Competitive Edge
            </span>
          </ScrollAnimation>
          <ScrollAnimation delay={80}>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground">
              Why DemonZeno <span className="text-primary">Beats the Rest</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={140}>
            <p className="text-muted-foreground mt-4 text-base max-w-xl mx-auto">
              Most signal platforms charge fees, hide stop-losses, or give vague
              "buy now" calls. We give you everything — free, precise, and
              AI-verified.
            </p>
          </ScrollAnimation>
        </div>

        {/* Animated counter stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map(({ label, value, suffix }, i) => (
            <ScrollAnimation key={label} delay={i * 80}>
              <div
                data-ocid={`why_demonzeno.stat.${i + 1}`}
                className="bg-card border border-primary/20 rounded-2xl p-6 flex flex-col items-center gap-2 card-elevated text-center group hover:border-primary/50 transition-smooth"
              >
                <span className="font-display font-bold text-4xl text-primary text-glow">
                  <AnimatedCounter
                    target={value}
                    suffix={suffix}
                    running={countersRunning}
                  />
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {label}
                </span>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Comparison table */}
        <ScrollAnimation delay={100}>
          <div className="rounded-2xl border border-border overflow-hidden card-elevated">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-card border-b border-border">
              <div className="px-6 py-4 text-muted-foreground text-sm font-semibold uppercase tracking-wider">
                Feature
              </div>
              <div className="px-6 py-4 text-center border-l border-border">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: "oklch(0.65 0.2 22 / 0.15)",
                    color: "oklch(0.65 0.2 22)",
                  }}
                >
                  Other Platforms
                </span>
              </div>
              <div className="px-6 py-4 text-center border-l border-primary/20">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: "oklch(0.65 0.15 190 / 0.15)",
                    color: "oklch(0.65 0.15 190)",
                  }}
                >
                  DemonZeno ⚡
                </span>
              </div>
            </div>

            {/* Feature rows */}
            {features.map(({ label, demonzeno }, i) => (
              <div
                key={label}
                data-ocid={`why_demonzeno.feature.${i + 1}`}
                className={`grid grid-cols-3 border-b border-border/60 last:border-0 ${
                  i % 2 === 0 ? "bg-background" : "bg-card"
                }`}
              >
                <div className="px-6 py-3.5 text-foreground text-sm font-medium">
                  {label}
                </div>
                <div className="px-6 py-3.5 text-center border-l border-border/40">
                  <span
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                    style={{
                      background: "oklch(0.65 0.2 22 / 0.12)",
                      color: "oklch(0.65 0.2 22)",
                    }}
                  >
                    ✕
                  </span>
                </div>
                <div className="px-6 py-3.5 text-center border-l border-primary/20">
                  {demonzeno ? (
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background: "oklch(0.65 0.15 190 / 0.15)",
                        color: "oklch(0.65 0.15 190)",
                      }}
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{
                        background: "oklch(0.65 0.2 22 / 0.12)",
                        color: "oklch(0.65 0.2 22)",
                      }}
                    >
                      ✕
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
