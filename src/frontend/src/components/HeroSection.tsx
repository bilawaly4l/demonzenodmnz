import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpen, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { AdminPasscodeModal } from "./AdminPasscodeModal";

const SLOGANS = [
  "Trade the chart, not the news.",
  "The demons of trading are fear and greed. Know them. Control them.",
  "Every loss is tuition. Every win is validation.",
  "Patience is the sharpest weapon in a trader's arsenal.",
  "Risk management isn't optional. It's the only reason traders survive.",
  "The best traders aren't the bravest. They're the most disciplined.",
  "Master the basics. Everything else is noise.",
  "In trading, the one who loses the least wins the most.",
  "Your trading plan is your shield. Never go to battle without it.",
  "Small consistent gains beat lucky big wins every time.",
  "Protect your capital like it's your life.",
  "Every pattern tells a story. Learn to read the chart like a book.",
  "The exit matters more than the entry.",
  "Trading is 80% psychology, 20% strategy.",
  "Cut losses fast, let winners run.",
  "The trend is your only friend.",
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const { adminClickCount, showPasscodeModal, onHeroImageClick, dismissModal } =
    useSession();
  const [quoteIdx, setQuoteIdx] = useState(() =>
    Math.floor(Math.random() * SLOGANS.length),
  );
  const [fadingOut, setFadingOut] = useState(false);
  const [adminSuccess, setAdminSuccess] = useState(false);

  // Rotate slogans every 4.5s with fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      setFadingOut(true);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % SLOGANS.length);
        setFadingOut(false);
      }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  function handleAdminSuccess() {
    setAdminSuccess(true);
    setTimeout(() => {
      window.location.href = "/admin";
    }, 300);
  }

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Background gradient orbs */}
      <div className="hero-bg-orbs" aria-hidden="true">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: text content */}
        <div className="flex flex-col gap-6 max-w-xl fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 w-fit">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Premium Trading Academy
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight text-glow">
            Demon<span className="text-primary">Zeno</span>{" "}
            <span className="block">Trading Academy</span>
          </h1>

          {/* Rotating DemonZeno slogan */}
          <blockquote
            className="border-l-4 border-primary/60 pl-4 italic text-muted-foreground text-lg leading-relaxed min-h-[3.5rem]"
            style={{
              opacity: fadingOut ? 0 : 1,
              transition: "opacity 0.4s ease-in-out",
            }}
          >
            &ldquo;{SLOGANS[quoteIdx]}&rdquo;
          </blockquote>

          <p className="text-muted-foreground leading-relaxed">
            Master the markets from zero to expert — step by step. Earn
            prestigious certificates. Trade like a demon. Think like a god.
          </p>

          <div className="flex items-center gap-6 py-2">
            {[
              { value: "5", label: "Tiers" },
              { value: "30/30", label: "Pass Score" },
              { value: "DMNZ", label: "Token" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-display font-bold text-2xl text-primary">
                  {value}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              data-ocid="hero.start_learning.primary_button"
              onClick={() => scrollToSection("academy")}
              className="btn-primary btn-micro px-6 h-11 text-base"
            >
              <TrendingUp className="w-4 h-4 mr-1.5" />
              Start Learning (Free)
            </Button>
            <Button
              variant="outline"
              data-ocid="hero.dmnz_token.secondary_button"
              onClick={() => scrollToSection("dmnz-token")}
              className="border-primary/40 text-primary hover:bg-primary/10 h-11 text-base"
            >
              DMNZ Token
            </Button>
            <Button
              variant="outline"
              data-ocid="hero.certificates.secondary_button"
              asChild
              className="border-border text-muted-foreground hover:text-foreground hover:bg-muted h-11 text-base"
            >
              <Link to="/certificates">
                <Award className="w-4 h-4 mr-1.5" />
                Certificate Wall
              </Link>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {[
              "Free Forever",
              "No Account Needed",
              "Anti-Cheat Quizzes",
              "Prestige Certificates",
            ].map((f) => (
              <span
                key={f}
                className="text-xs text-muted-foreground bg-muted/50 border border-border px-2.5 py-1 rounded-full"
              >
                ✓ {f}
              </span>
            ))}
          </div>
        </div>

        {/* Right: DemonZeno character */}
        <div className="flex justify-center md:justify-end">
          <div className="relative select-none">
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-75 pointer-events-none anime-glow"
              style={{ background: "oklch(0.65 0.15 190 / 0.12)" }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={onHeroImageClick}
              className="relative z-10 p-0 bg-transparent border-0 focus:outline-none cursor-pointer"
              aria-label="DemonZeno character"
              data-ocid="hero.character.button"
            >
              <div className="relative overflow-hidden">
                <img
                  src="/assets/generated/demonzeno-hero.dim_800x900.png"
                  alt="DemonZeno — anime-style trading character"
                  className="w-64 md:w-80 lg:w-96 object-cover object-top drop-shadow-2xl pointer-events-none"
                  style={{ clipPath: "inset(0 0 18% 0)", marginBottom: "-18%" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/assets/demonzeno-character.png";
                  }}
                />
              </div>
            </button>

            {adminClickCount >= 3 && adminClickCount < 5 && (
              <p
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/60 whitespace-nowrap pointer-events-none"
                aria-hidden="true"
              >
                Keep clicking…
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-px h-8 bg-primary/30 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
      </div>

      <AdminPasscodeModal
        open={showPasscodeModal}
        onSuccess={handleAdminSuccess}
        onClose={dismissModal}
      />

      {adminSuccess && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-primary font-display font-bold text-2xl animate-pulse">
            Access Granted…
          </div>
        </div>
      )}
    </section>
  );
}
