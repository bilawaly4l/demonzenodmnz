import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useSignalOfTheDay } from "../hooks/useSignalOfTheDay";
import { AdminPasscodeModal } from "./AdminPasscodeModal";
import { CountdownTimer } from "./CountdownTimer";
import { SignalDetailModal } from "./SignalDetailModal";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const { data: signalOfTheDay } = useSignalOfTheDay();
  const [sotdModalOpen, setSotdModalOpen] = useState(false);
  const { setSessionToken } = useSession();

  const [clickCount, setClickCount] = useState(0);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parallax state
  const [parallaxY, setParallaxY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      setParallaxY(scrolled * 0.4);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleDemonZenoClick() {
    if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
    const newCount = clickCount + 1;
    if (newCount >= 6) {
      setClickCount(0);
      setShowPasscodeModal(true);
    } else {
      setClickCount(newCount);
      clickResetTimer.current = setTimeout(() => setClickCount(0), 30000);
    }
  }

  function handleAdminSuccess(token: string) {
    setSessionToken(token);
    setShowPasscodeModal(false);
    window.location.href = "/admin";
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translateY(${parallaxY}px)`,
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        <img
          src="/assets/generated/hero-highway-bg.dim_1920x600.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ minHeight: "120%" }}
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Decorative glow */}
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.15 190 / 0.06)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.22 25 / 0.05)" }}
        aria-hidden="true"
      />

      {/* Road stripes decorative */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: "oklch(0.65 0.15 190 / 0.2)" }}
        aria-hidden="true"
      />

      {sotdModalOpen && signalOfTheDay && (
        <SignalDetailModal
          signal={signalOfTheDay}
          onClose={() => setSotdModalOpen(false)}
        />
      )}

      <AdminPasscodeModal
        open={showPasscodeModal}
        onSuccess={handleAdminSuccess}
        onClose={() => {
          setShowPasscodeModal(false);
          setClickCount(0);
        }}
      />

      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: text content */}
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 w-fit backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Free Trading Signals · Binance
            </span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-6xl text-foreground leading-tight text-glow">
            DemonZeno:
            <br />
            <span className="text-primary">Master the Chaos,</span>
            <br />
            Slay the Market,
            <br />
            and Trade Like a God.
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Daily free signals for crypto, forex, and stocks — powered by
            DemonZeno AI. The DMNZ token launches April 2, 2028 on Blum.
          </p>

          {signalOfTheDay && (
            <button
              type="button"
              data-ocid="hero.signal_of_the_day.card"
              onClick={() => setSotdModalOpen(true)}
              className="text-left flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 hover:bg-primary/15 hover:border-primary/50 transition-smooth group w-fit max-w-full backdrop-blur-sm"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-primary text-xs font-bold uppercase tracking-widest">
                  ⚡ Signal of the Day
                </span>
                <span className="font-display font-bold text-foreground truncate">
                  {signalOfTheDay.asset} ·{" "}
                  <span
                    className={
                      signalOfTheDay.direction === "Buy"
                        ? "text-emerald-400"
                        : "text-destructive"
                    }
                  >
                    {signalOfTheDay.direction}
                  </span>
                </span>
                <span className="text-muted-foreground text-xs">
                  Confidence: {signalOfTheDay.confidence} · Tap to view
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-smooth" />
            </button>
          )}

          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground font-medium">
              Launch countdown:
            </p>
            <CountdownTimer />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              data-ocid="hero.get_signals.primary_button"
              onClick={() => scrollTo("signals")}
              className="btn-primary px-6 h-11 text-base"
            >
              Get Free Signals <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              data-ocid="hero.enter_ai.secondary_button"
              asChild
              className="border-primary/40 text-primary hover:bg-primary/10 h-11 text-base"
            >
              <a href="/ai">Enter DemonZeno AI</a>
            </Button>
          </div>
        </div>

        {/* Right: DemonZeno character */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-75 animate-pulse-glow pointer-events-none"
              style={{ background: "oklch(0.65 0.15 190 / 0.12)" }}
              aria-hidden="true"
            />
            {/* 6+ clicks triggers admin modal — no visible UI hint */}
            <button
              type="button"
              onClick={handleDemonZenoClick}
              className="relative z-10 p-0 bg-transparent border-0 cursor-default focus:outline-none"
              tabIndex={-1}
              aria-hidden="true"
            >
              <div className="relative overflow-hidden">
                <img
                  src="/assets/demonzeno-character.png"
                  alt="DemonZeno — anime-style character on an open highway"
                  className="w-64 md:w-80 lg:w-96 object-cover object-top drop-shadow-2xl pointer-events-none"
                  style={{ clipPath: "inset(0 0 18% 0)", marginBottom: "-18%" }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-px h-8 bg-primary/30 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      </div>
    </section>
  );
}
