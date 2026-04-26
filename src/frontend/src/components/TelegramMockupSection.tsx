import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, MessageCircle, Signal, Zap } from "lucide-react";
import { ScrollAnimation } from "./ScrollAnimation";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center py-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 pointer-events-none" />

      {/* Phone frame */}
      <div
        className="phone-float relative z-10 w-52 bg-[#0d1117] rounded-[2.5rem] border-2 border-primary/30 shadow-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 48px oklch(0.65 0.15 190 / 0.25), 0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-20 h-5 bg-[#1a2030] rounded-full" />
        </div>

        {/* Telegram header */}
        <div className="bg-[#1a2332] px-3 py-2 flex items-center gap-2 border-b border-primary/20">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-primary truncate">
              DemonZeno Official
            </p>
            <p className="text-[8px] text-primary/50">Mini App · Blum</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>

        {/* App screen */}
        <div className="bg-[#0d1117] px-2 py-2 flex flex-col gap-1.5 min-h-[220px]">
          {/* DMNZ App card */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-3 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-primary">DMNZ</span>
              <span className="ml-auto text-[8px] text-primary/50 font-mono">
                Token
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-display font-bold text-foreground">
                $0.000
              </span>
              <span className="text-[8px] text-primary">LAUNCH: APR 2028</span>
            </div>
            <div className="mt-1.5 h-1 bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-primary rounded-full animate-pulse" />
            </div>
          </div>

          {/* Signal message */}
          <div className="bg-[#1a2332] rounded-xl p-2.5 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Signal className="w-2.5 h-2.5 text-primary" />
              <span className="text-[8px] font-bold text-primary uppercase tracking-wider">
                New Signal
              </span>
            </div>
            <p className="text-[8px] text-muted-foreground">
              BTC/USDT · Long · 1H
            </p>
            <div className="flex gap-1 mt-1">
              <span className="text-[7px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                TP1 ✓
              </span>
              <span className="text-[7px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                TP2 ✓
              </span>
              <span className="text-[7px] bg-muted/30 text-muted-foreground px-1.5 py-0.5 rounded">
                TP3
              </span>
            </div>
          </div>

          {/* CTA button mock */}
          <div className="bg-primary/20 rounded-xl p-2 flex items-center justify-center border border-primary/30">
            <span className="text-[9px] font-bold text-primary">
              🚀 Launch on Blum
            </span>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-16 h-1 bg-primary/20 rounded-full" />
        </div>
      </div>

      {/* Floating notification badge */}
      <div className="absolute top-6 right-4 z-20 bg-card border border-primary/40 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 animate-[phoneBadge_2s_ease-in-out_infinite]">
        <Bell className="w-3 h-3 text-primary shrink-0" />
        <span className="text-[10px] font-bold text-primary whitespace-nowrap">
          DMNZ Launch Alert
        </span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <Signal className="w-4 h-4 text-primary" />,
    text: "Access DemonZeno signals directly from Telegram",
  },
  {
    icon: <Zap className="w-4 h-4 text-primary" />,
    text: "Token launch on April 2, 2028 — inside the Mini App",
  },
  {
    icon: <CheckCircle className="w-4 h-4 text-primary" />,
    text: "Powered by the Blum ecosystem — fair and open",
  },
  {
    icon: <Bell className="w-4 h-4 text-primary" />,
    text: "Instant launch alerts and signal notifications",
  },
];

export function TelegramMockupSection() {
  return (
    <section
      id="telegram-miniapp"
      data-ocid="telegram_mockup.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — phone mockup */}
          <ScrollAnimation direction="left">
            <PhoneMockup />
          </ScrollAnimation>

          {/* Right — copy */}
          <ScrollAnimation direction="right">
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 w-fit">
                <MessageCircle className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Telegram Mini App
                </span>
              </div>

              <h2 className="font-display font-bold text-4xl text-foreground leading-tight">
                Coming to{" "}
                <span className="text-primary text-glow">Telegram</span>
              </h2>

              <p className="text-muted-foreground text-base leading-relaxed">
                DMNZ launches as a Telegram Mini App — trade signals and token
                access, right inside your Telegram. No extra apps. No extra
                steps.
              </p>

              <div className="flex flex-col gap-3">
                {features.map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 bg-card border border-border/60 rounded-xl px-4 py-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                data-ocid="telegram_mockup.notify_me.button"
                onClick={() => scrollTo("notify")}
                className="btn-primary w-fit px-6 h-11 text-base"
              >
                <Bell className="w-4 h-4 mr-2" />
                Get Notified at Launch
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
