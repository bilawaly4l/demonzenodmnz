import { useEffect, useState } from "react";

const LAUNCH_TARGET = new Date("2027-04-02T00:00:00Z").getTime();

function useCountdown() {
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

export function PriceTrackerSection() {
  const countdown = useCountdown();

  return (
    <section
      data-ocid="price_tracker.section"
      className="py-20 md:py-24 scroll-anim"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="heading-xl mb-4">DMNZ PRICE TRACKER</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Live price data will activate the moment DMNZ goes live on Blum.
            Until then, the clock is running.
          </p>
        </div>

        <div
          className="card-dmnz max-w-2xl mx-auto text-center"
          style={{
            borderColor: "rgba(220,20,60,0.3)",
            padding: "2.5rem",
          }}
        >
          {/* DMNZ Logo placeholder */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-sm mb-6 mx-auto"
            style={{
              background: "rgba(220,20,60,0.1)",
              border: "2px solid rgba(220,20,60,0.4)",
            }}
          >
            <span
              className="font-display font-black text-2xl"
              style={{ color: "#dc143c" }}
            >
              DMNZ
            </span>
          </div>

          <div
            className="inline-block px-4 py-1.5 mb-6 font-bold text-xs uppercase tracking-widest"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.35)",
              color: "#d4af37",
            }}
          >
            LAUNCH PENDING
          </div>

          <div
            className="text-5xl font-display font-black mb-2"
            style={{ color: "#a0a0a0" }}
          >
            --.--
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            Price determined at launch via Blum bonding curve — April 2, 2027
          </p>

          {countdown ? (
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Mins", value: countdown.minutes },
                { label: "Secs", value: countdown.seconds },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  data-ocid={`price_tracker.countdown.${label.toLowerCase()}`}
                  className="text-center p-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="font-display font-black text-2xl tabular-nums"
                    style={{ color: "#dc143c" }}
                  >
                    {String(value).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="font-display font-black text-2xl"
              style={{ color: "#dc143c" }}
            >
              DMNZ IS LIVE ON BLUM
            </div>
          )}

          <div
            className="mt-8 pt-6 text-xs text-muted-foreground"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            PLATFORM: BLUM MINI APP (TELEGRAM) &nbsp;|&nbsp; CHAIN: TON
          </div>
        </div>
      </div>
    </section>
  );
}
