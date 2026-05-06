import { useEffect, useState } from "react";
import { SiBinance } from "react-icons/si";

const SLOGANS = [
  "BORN FROM DARKNESS. FORGED IN DISCIPLINE.",
  "TRADE LIKE A GOD. HOLD LIKE A DEMON.",
  "THE RIGGED GAME ENDS HERE.",
  "100% FAIR LAUNCH. ZERO EXCEPTIONS.",
  "NO PRESALE. NO INSIDERS. NO MERCY.",
  "DISCIPLINE IS THE ONLY EDGE THAT MATTERS.",
  "DMNZ: THE COUNTER-ATTACK.",
  "PROTECT YOUR CAPITAL. IT IS YOUR LIFE.",
  "IN TRADING, THE LAST ONE STANDING WINS.",
  "THE DEMONS OF TRADING ARE FEAR AND GREED. KNOW THEM. DESTROY THEM.",
];

const LAUNCH_TARGET = new Date("2027-04-02T00:00:00Z").getTime();

function useMiniCountdown() {
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

export function HeroSection() {
  const [quoteIdx, setQuoteIdx] = useState(() =>
    Math.floor(Math.random() * SLOGANS.length),
  );
  const [fadingOut, setFadingOut] = useState(false);
  const countdown = useMiniCountdown();

  useEffect(() => {
    const interval = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % SLOGANS.length);
        setFadingOut(false);
      }, 350);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 70% 50%, rgba(220,20,60,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left */}
        <div className="flex flex-col gap-6 max-w-xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 w-fit"
            style={{
              background: "var(--primary-subtle)",
              border: "1px solid var(--primary-border)",
              borderRadius: "2px",
              padding: "0.3rem 0.85rem",
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--primary)", letterSpacing: "0.12em" }}
            >
              DMNZ &mdash; Launching April 2, 2027
            </span>
          </div>

          <h1
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: "1.05",
              color: "var(--foreground)",
              paddingBottom: "0.75rem",
              position: "relative",
            }}
          >
            Demon<span style={{ color: "var(--primary)" }}>Zeno</span>
            <span
              className="block font-mono"
              style={{
                fontSize: "0.6em",
                color: "var(--muted-foreground)",
                marginTop: "0.25rem",
                letterSpacing: "0.04em",
              }}
            >
              (DMNZ)
            </span>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "3rem",
                height: "2px",
                background: "var(--primary)",
              }}
            />
          </h1>

          {/* Rotating slogan */}
          <p
            className="font-display font-black text-sm uppercase tracking-widest"
            style={{
              borderLeft: "2px solid var(--primary)",
              paddingLeft: "1rem",
              color: "var(--muted-foreground)",
              opacity: fadingOut ? 0 : 1,
              transition: "opacity 0.35s ease-in-out",
              minHeight: "1.5rem",
              letterSpacing: "0.06em",
            }}
          >
            {SLOGANS[quoteIdx]}
          </p>

          {/* Countdown */}
          {countdown !== null ? (
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--primary-border)",
                borderRadius: "2px",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.14em",
                }}
              >
                Launch Countdown &middot; April 2, 2027
              </p>
              <div className="flex items-center gap-4">
                {[
                  { label: "D", value: countdown.days },
                  { label: "H", value: countdown.hours },
                  { label: "M", value: countdown.minutes },
                  { label: "S", value: countdown.seconds },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <span
                      className="font-display font-black text-3xl tabular-nums"
                      style={{ color: "var(--primary)" }}
                    >
                      {String(value).padStart(2, "0")}
                    </span>
                    <p
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="font-display font-black text-xl px-4 py-3"
              style={{
                color: "var(--primary)",
                background: "var(--card)",
                border: "1px solid var(--primary-border)",
                borderRadius: "2px",
              }}
            >
              DMNZ IS LIVE ON BLUM!
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <a
              href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.binance.primary_button"
              className="btn-primary"
            >
              <SiBinance className="w-4 h-4" />
              FOLLOW ON BINANCE SQUARE
            </a>
            <button
              type="button"
              data-ocid="hero.buy.secondary_button"
              onClick={() =>
                document
                  .getElementById("how-to-buy")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-ghost"
            >
              BUY ON BLUM
            </button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2">
            {[
              "No Presale",
              "No Team Tokens",
              "Full Fair Launch",
              "Community First",
            ].map((f) => (
              <span key={f} className="trust-pill">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: character */}
        <div className="flex justify-center md:justify-end">
          <div className="relative select-none">
            <div className="relative z-10">
              <img
                src="/assets/demonzeno-real.png"
                alt="DemonZeno — the face behind DMNZ"
                className="w-64 md:w-80 lg:w-96 object-cover drop-shadow-2xl"
                style={{
                  objectPosition: "50% 5%",
                  clipPath: "inset(0 8% 20% 8%)",
                  marginBottom: "-20%",
                  filter: "contrast(1.05) brightness(0.95)",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/demonzeno-character.png";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
