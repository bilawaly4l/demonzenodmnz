import { useEffect, useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

const BURN_DATE = new Date("2028-04-02T00:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function useBurnCountdown(): TimeLeft {
  const [t, setT] = useState<TimeLeft>({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    function calc() {
      const diff = Math.max(0, BURN_DATE.getTime() - Date.now());
      setT({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        mins: Math.floor((diff % 3_600_000) / 60_000),
        secs: Math.floor((diff % 60_000) / 1_000),
      });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function FlameUnit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center font-display font-bold text-3xl md:text-4xl relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.04 25), oklch(0.15 0.06 25))",
          border: "1px solid oklch(0.55 0.22 25 / 0.4)",
          color: "oklch(0.92 0.005 260)",
          boxShadow: "0 0 24px oklch(0.55 0.22 25 / 0.2)",
        }}
      >
        {/* Flame shimmer */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, oklch(0.65 0.22 35), transparent 70%)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        <span className="relative z-10">{str}</span>
      </div>
      <span
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: "oklch(0.65 0.22 25)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function BurnCountdownSection() {
  const t = useBurnCountdown();

  return (
    <section
      id="burn-countdown"
      data-ocid="burn_countdown.section"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.02 260) 0%, oklch(0.12 0.03 25 / 0.4) 50%, oklch(0.14 0.02 260) 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.55 0.22 25 / 0.08), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10">
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.22 25)" }}
            >
              The Great Burn
            </span>
            <h2
              className="font-display font-bold text-4xl md:text-5xl"
              style={{ color: "oklch(0.97 0.005 260)" }}
            >
              🔥 Burn Event Countdown
            </h2>
            <p style={{ color: "oklch(0.7 0.01 260)" }} className="text-base">
              April 2, 2028 — The day the supply shrinks and the price ascends.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={100}>
          <div
            data-ocid="burn_countdown.timer.display"
            className="flex justify-center gap-4 md:gap-6 mb-10"
          >
            <FlameUnit value={t.days} label="Days" />
            <div
              className="flex items-center self-start mt-6 text-3xl font-bold"
              style={{ color: "oklch(0.55 0.22 25 / 0.7)" }}
            >
              :
            </div>
            <FlameUnit value={t.hours} label="Hours" />
            <div
              className="flex items-center self-start mt-6 text-3xl font-bold"
              style={{ color: "oklch(0.55 0.22 25 / 0.7)" }}
            >
              :
            </div>
            <FlameUnit value={t.mins} label="Mins" />
            <div
              className="flex items-center self-start mt-6 text-3xl font-bold"
              style={{ color: "oklch(0.55 0.22 25 / 0.7)" }}
            >
              :
            </div>
            <FlameUnit value={t.secs} label="Secs" />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <div
            className="inline-flex flex-col items-center gap-2 rounded-2xl px-8 py-5 border"
            style={{
              background: "oklch(0.55 0.22 25 / 0.08)",
              borderColor: "oklch(0.55 0.22 25 / 0.3)",
            }}
          >
            <p
              className="font-display font-bold text-lg"
              style={{ color: "oklch(0.97 0.005 260)" }}
            >
              3 Reasons for the Burn
            </p>
            <div className="flex flex-col gap-1 text-sm text-left">
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
    </section>
  );
}
