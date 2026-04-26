import { Button } from "@/components/ui/button";
import { ExternalLink, Twitter } from "lucide-react";
import { SiBinance } from "react-icons/si";
import { ScrollAnimation } from "./ScrollAnimation";

export function JoinMovementSection() {
  return (
    <section
      id="join-movement"
      data-ocid="join_movement.section"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0.02 260) 0%, oklch(0.12 0.04 200) 50%, oklch(0.14 0.02 260) 100%)",
      }}
    >
      {/* Animated glow blobs */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ background: "oklch(0.65 0.15 190 / 0.08)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{
          background: "oklch(0.55 0.22 25 / 0.06)",
          animationDelay: "1s",
        }}
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        <ScrollAnimation>
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            Movement
          </p>
          <h2
            className="font-display font-bold text-4xl md:text-5xl leading-tight mb-4"
            style={{ color: "oklch(0.97 0.005 260)" }}
          >
            Join Thousands Who Trade with{" "}
            <span
              className="text-glow"
              style={{ color: "oklch(0.72 0.18 195)" }}
            >
              DemonZeno
            </span>
          </h2>
          <p
            className="text-lg mb-10 max-w-xl mx-auto"
            style={{ color: "oklch(0.75 0.01 260)" }}
          >
            "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a
            God."
          </p>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="join_movement.binance.button"
              asChild
              className="h-13 px-8 text-base font-semibold gap-2 border border-yellow-400/30"
              style={{
                background: "oklch(0.55 0.15 80)",
                color: "oklch(0.1 0.01 260)",
              }}
            >
              <a
                href="https://www.binance.com/en/square/profile/@DemonZeno"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiBinance className="w-5 h-5" />
                Follow on Binance Square
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </Button>
            <Button
              data-ocid="join_movement.twitter.button"
              asChild
              variant="outline"
              className="h-13 px-8 text-base font-semibold gap-2"
              style={{
                borderColor: "oklch(0.65 0.15 190 / 0.4)",
                color: "oklch(0.85 0.02 260)",
              }}
            >
              <a
                href="https://twitter.com/ZenoDemon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
                Follow on Twitter
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </Button>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={250}>
          <p className="mt-8 text-sm" style={{ color: "oklch(0.55 0.01 260)" }}>
            Free signals daily · No subscription · Binance-only
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}
