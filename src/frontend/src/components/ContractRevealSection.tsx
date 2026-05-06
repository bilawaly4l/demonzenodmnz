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
      });
    }, 60000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function ContractRevealSection() {
  const countdown = useCountdown();

  return (
    <section
      data-ocid="contract_reveal.section"
      className="py-20 md:py-24 scroll-anim"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="max-w-2xl mx-auto text-center"
          style={{
            border: "2px solid rgba(220,20,60,0.5)",
            padding: "3rem",
            background: "rgba(220,20,60,0.03)",
          }}
        >
          <div
            className="inline-block px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(220,20,60,0.15)",
              border: "1px solid rgba(220,20,60,0.35)",
              color: "#dc143c",
            }}
          >
            Official Notice
          </div>

          <h2 className="heading-xl mb-6">CONTRACT ADDRESS</h2>

          <div
            className="font-mono text-sm px-4 py-4 mb-6 text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed rgba(255,255,255,0.15)",
              color: "#a0a0a0",
              letterSpacing: "0.15em",
            }}
          >
            ████████████████████████████████████████
          </div>

          <p className="text-lg font-bold mb-2" style={{ color: "#ffffff" }}>
            Official DMNZ token contract address will be published on April 2,
            2027
          </p>

          {countdown ? (
            <p className="text-muted-foreground text-sm mb-8">
              {countdown.days} days, {countdown.hours} hours,{" "}
              {countdown.minutes} minutes remaining
            </p>
          ) : (
            <p className="text-sm font-bold mb-8" style={{ color: "#dc143c" }}>
              LAUNCH HAS OCCURRED — CONTRACT NOW LIVE
            </p>
          )}

          <div
            className="text-sm font-bold uppercase tracking-wide p-4"
            style={{
              background: "rgba(220,20,60,0.08)",
              border: "1px solid rgba(220,20,60,0.25)",
              color: "#dc143c",
            }}
          >
            Do not trust any contract address posted on social media, Telegram,
            or any channel before this date. The only official source is this
            website.
          </div>

          <div
            className="mt-6 pt-6 text-xs text-muted-foreground"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            Published by @Demon_Zeno &nbsp;|&nbsp; Verified on Blum Mini App
          </div>
        </div>
      </div>
    </section>
  );
}
