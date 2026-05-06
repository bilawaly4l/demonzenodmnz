import { useEffect, useState } from "react";

const LAUNCH_TARGET = new Date("2027-04-02T00:00:00Z").getTime();

function useDDayCountdown() {
  const [t, setT] = useState(() => {
    const diff = LAUNCH_TARGET - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  });
  useEffect(() => {
    const id = setInterval(() => {
      const diff = LAUNCH_TARGET - Date.now();
      if (diff <= 0) {
        setT(null);
        return;
      }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function DDaySection() {
  const t = useDDayCountdown();
  return (
    <section
      id="dday"
      data-ocid="dday.section"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.62 0.16 190 / 0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        <p
          className="font-display font-black text-sm uppercase tracking-[0.3em] mb-6"
          style={{ color: "oklch(0.55 0.22 25)" }}
        >
          April 2, 2027
        </p>

        <h2
          className="font-display font-black text-7xl md:text-9xl leading-none tracking-tight mb-10"
          style={{ color: "#FFFFFF" }}
        >
          D‑DAY
        </h2>

        {t === null ? (
          <div
            className="font-display font-black text-4xl md:text-5xl mb-12"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            DMNZ IS LIVE ON BLUM
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-lg mx-auto mb-12">
            {[
              { label: "Days", value: t.days },
              { label: "Hours", value: t.hours },
              { label: "Mins", value: t.minutes },
              { label: "Secs", value: t.seconds },
            ].map(({ label, value }) => (
              <div
                key={label}
                data-ocid={`dday.countdown.${label.toLowerCase()}`}
                className="flex flex-col items-center p-4 md:p-6"
                style={{
                  background: "oklch(0.13 0.01 260)",
                  border: "1px solid oklch(0.62 0.16 190 / 0.25)",
                }}
              >
                <span
                  className="font-display font-black text-3xl md:text-5xl tabular-nums leading-none"
                  style={{ color: "oklch(0.62 0.16 190)" }}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p
          className="font-display font-black text-xl md:text-2xl uppercase tracking-widest mb-10"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          No presale. No insiders. Just the chart.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.binance.com/en/square/profile/@Demon_Zeno"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="dday.binance.primary_button"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90"
            style={{
              background: "oklch(0.62 0.16 190)",
              color: "oklch(0.10 0.01 260)",
            }}
          >
            Follow @Demon_Zeno
          </a>
          <a
            href="https://t.me/blum"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="dday.blum.secondary_button"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90"
            style={{
              background: "transparent",
              border: "1px solid oklch(0.62 0.16 190 / 0.50)",
              color: "oklch(0.62 0.16 190)",
            }}
          >
            Open Blum Mini App
          </a>
        </div>
      </div>
    </section>
  );
}
