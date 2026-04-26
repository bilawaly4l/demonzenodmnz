import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import { SiBinance } from "react-icons/si";
import { ScrollAnimation } from "./ScrollAnimation";

// Target: April 2, 2028 00:00:00 UTC
const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-display font-black text-3xl sm:text-4xl border-2 overflow-hidden"
        style={{
          background: "oklch(0.12 0.015 260)",
          borderColor: "oklch(0.65 0.15 190 / 0.4)",
          color: "oklch(0.72 0.18 195)",
          boxShadow: "0 0 20px oklch(0.65 0.15 190 / 0.15)",
        }}
      >
        {display}
        <div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{ background: "oklch(0.65 0.15 190 / 0.1)" }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export function LaunchCountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const launched = timeLeft.total === 0;

  return (
    <section
      id="launch-countdown"
      data-ocid="launch_countdown.section"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.02 195) 0%, oklch(0.145 0.01 260) 100%)",
      }}
    >
      {/* Sky glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.65 0.15 190 / 0.12), transparent)",
        }}
      />
      {/* Road bottom hint */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, oklch(0.65 0.22 22 / 0.06), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <ScrollAnimation>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "oklch(0.65 0.22 22 / 0.15)",
              color: "oklch(0.75 0.2 22)",
              border: "1px solid oklch(0.65 0.22 22 / 0.35)",
            }}
          >
            🔥 DMNZ Token Launch
          </span>
        </ScrollAnimation>

        <ScrollAnimation delay={80}>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground leading-tight mb-4">
            {launched ? "DMNZ Has Launched!" : "The Countdown Begins"}
          </h2>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-12">
            {launched
              ? "DemonZeno (DMNZ) is now live on BLUM — 100% fair launch."
              : "Join the movement on Binance Square and be ready for launch day. The DMNZ meme token goes live on BLUM — April 2, 2028."}
          </p>
        </ScrollAnimation>

        {!launched && (
          <ScrollAnimation delay={200}>
            <div
              className="flex items-center justify-center gap-3 sm:gap-6 mb-12 flex-wrap"
              data-ocid="launch_countdown.timer"
            >
              <CountdownBox value={timeLeft.days} label="Days" />
              <span
                className="text-3xl font-bold pb-6"
                style={{ color: "oklch(0.65 0.15 190)" }}
              >
                :
              </span>
              <CountdownBox value={timeLeft.hours} label="Hours" />
              <span
                className="text-3xl font-bold pb-6"
                style={{ color: "oklch(0.65 0.15 190)" }}
              >
                :
              </span>
              <CountdownBox value={timeLeft.minutes} label="Mins" />
              <span
                className="text-3xl font-bold pb-6"
                style={{ color: "oklch(0.65 0.15 190)" }}
              >
                :
              </span>
              <CountdownBox value={timeLeft.seconds} label="Secs" />
            </div>
          </ScrollAnimation>
        )}

        <ScrollAnimation delay={280}>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              className="h-12 px-6 gap-2 font-semibold text-base"
              data-ocid="launch_countdown.binance_square.link"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.15 190), oklch(0.55 0.18 210))",
                color: "oklch(0.1 0 0)",
              }}
            >
              <a
                href="https://www.binance.com/en/square/profile/@DemonZeno"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiBinance className="w-5 h-5" />
                Follow @DemonZeno
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-6 gap-2 font-semibold text-base border-border"
              data-ocid="launch_countdown.twitter.link"
            >
              <a
                href="https://twitter.com/ZenoDemon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-4 h-4" />
                Follow @ZenoDemon
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={350}>
          <p className="text-muted-foreground/50 text-xs mt-10">
            April 2, 2028 · BLUM Telegram Mini App · 100% Fair Launch · No
            Presale
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}
