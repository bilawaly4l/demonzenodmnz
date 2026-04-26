import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Zap } from "lucide-react";

export function NotFound() {
  return (
    <section
      data-ocid="not_found.page"
      className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-background py-20"
    >
      <div className="container mx-auto px-4 flex flex-col items-center gap-8 text-center max-w-xl">
        {/* Character / illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 animate-pulse-glow pointer-events-none" />
          <img
            src="/assets/demonzeno-character.png"
            alt="DemonZeno character"
            className="relative z-10 w-48 md:w-64 object-contain drop-shadow-2xl"
          />
        </div>

        {/* 404 badge */}
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-full px-4 py-1.5">
          <Zap className="w-3.5 h-3.5 text-destructive" />
          <span className="text-destructive text-xs font-semibold tracking-wide uppercase">
            404 — Not Found
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-3">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground text-glow leading-tight">
            Lost on the <span className="text-primary">Open Road</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            This page doesn't exist. DemonZeno has already moved on — you should
            too.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            asChild
            data-ocid="not_found.home.primary_button"
            className="btn-primary px-6 h-11"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            variant="outline"
            data-ocid="not_found.signals.secondary_button"
            asChild
            className="border-primary/40 text-primary hover:bg-primary/10 h-11"
          >
            <Link to="/">View Signals</Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-muted-foreground text-xs max-w-sm">
          If you think this is a mistake, check the URL or head back to the
          homepage and navigate from there.
        </p>
      </div>
    </section>
  );
}
