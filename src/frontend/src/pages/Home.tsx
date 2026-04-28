import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Bitcoin,
  Bot,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  LineChart,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { createActor } from "../backend";
import { BlumSectionCombined } from "../components/BlumSectionCombined";
import { BondingCurveSection } from "../components/BondingCurveSection";
import { BurnSection } from "../components/BurnSection";
import { CommunitySectionCombined } from "../components/CommunitySectionCombined";
import { FaqAiSection } from "../components/FaqAiSection";
import { FilterBar } from "../components/FilterBar";
import { HeroSection } from "../components/HeroSection";
import { HowToUseSection } from "../components/HowToUseSection";
import { JoinMovementSection } from "../components/JoinMovementSection";
import { PhilosophySectionCombined } from "../components/PhilosophySectionCombined";
import { RoadmapSection } from "../components/RoadmapSection";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { SignalCard } from "../components/SignalCard";
import { SignalDetailModal } from "../components/SignalDetailModal";
import { SkeletonCard } from "../components/SkeletonCard";
import { TokenFaqChatbotSection } from "../components/TokenFaqChatbotSection";
import { TokenSectionCombined } from "../components/TokenSectionCombined";
import { WhyDemonZenoSection } from "../components/WhyDemonZenoSection";
import { useSignals } from "../hooks/useSignals";
import type { MarketFilter, Signal, Timeframe } from "../types";

// ─── Announcement banner ──────────────────────────────────────────────────────
function useMarketMoodBanner() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["marketMoodBanner"],
    queryFn: async () => {
      if (!actor) return null;
      const res = await actor.getMarketMoodBanner();
      return res ?? null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

function MarketMoodBannerBar() {
  const { data: banner } = useMarketMoodBanner();
  if (!banner) return null;
  return (
    <div
      data-ocid="market_mood.banner"
      className="w-full py-2 px-4 text-center text-sm font-semibold"
      style={{
        background:
          banner.mood === "Bullish"
            ? "oklch(0.45 0.18 145 / 0.9)"
            : banner.mood === "Bearish"
              ? "oklch(0.45 0.22 25 / 0.9)"
              : "oklch(0.45 0.15 60 / 0.9)",
        color: "oklch(0.97 0.005 260)",
      }}
    >
      {banner.mood && (
        <span className="mr-2">
          {banner.mood === "Bullish"
            ? "📈"
            : banner.mood === "Bearish"
              ? "📉"
              : "➡️"}
        </span>
      )}
      {banner.message}
    </div>
  );
}

// ─── Signal Feed ──────────────────────────────────────────────────────────────
function useLastUpdated(refetchedAt: number | undefined): string {
  if (!refetchedAt) return "";
  const diff = Math.floor((Date.now() - refetchedAt) / 60_000);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 minute ago";
  return `${diff} minutes ago`;
}

function SignalFeedSection() {
  const { data: signals = [], isLoading, dataUpdatedAt } = useSignals();
  const [filter, setFilter] = useState<MarketFilter>("All");
  const [timeframe, setTimeframe] = useState<Timeframe | "All">("All");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [resultFilter, setResultFilter] = useState<string>("All");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("All");
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const lastUpdated = useLastUpdated(dataUpdatedAt);

  const filtered = signals.filter((s) => {
    if (filter !== "All") {
      if (filter === "Crypto" && s.marketType !== "Crypto") return false;
      if (filter === "Forex" && s.marketType !== "Forex") return false;
      if (filter === "Stocks" && s.marketType !== "Stock") return false;
    }
    if (timeframe !== "All" && s.timeframe !== timeframe) return false;
    if (resultFilter !== "All" && s.result !== resultFilter) return false;
    if (confidenceFilter !== "All" && s.confidence !== confidenceFilter)
      return false;
    return true;
  });

  return (
    <section
      id="signals"
      data-ocid="signals.section"
      className="py-20 bg-background"
    >
      {selectedSignal && (
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      )}

      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Signals
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Daily Trading Signals
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm flex-wrap">
              <span>Real trading signals by DemonZeno</span>
              <span className="inline-flex items-center gap-1 bg-yellow-400/10 text-yellow-500 border border-yellow-400/30 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
                Binance Square @DemonZeno
              </span>
            </div>
          </div>
        </ScrollAnimation>

        <div className="flex flex-col items-center gap-4 mb-8">
          <FilterBar
            active={filter}
            onChange={setFilter}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />

          <button
            type="button"
            data-ocid="signals.advanced_filter.toggle"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth"
          >
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {showAdvanced ? "Hide" : "Show"} advanced filters
          </button>

          {showAdvanced && (
            <div
              data-ocid="signals.advanced_filter.panel"
              className="flex flex-wrap items-center gap-4 bg-card border border-border rounded-xl p-4 w-full max-w-2xl"
            >
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="result-filter"
                  className="text-xs text-muted-foreground font-medium uppercase tracking-wider"
                >
                  Result
                </label>
                <select
                  id="result-filter"
                  data-ocid="signals.result_filter.select"
                  value={resultFilter}
                  onChange={(e) => setResultFilter(e.target.value)}
                  className="bg-secondary border border-input rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {["All", "Active", "Win", "Loss", "Expired"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confidence-filter"
                  className="text-xs text-muted-foreground font-medium uppercase tracking-wider"
                >
                  Confidence
                </label>
                <select
                  id="confidence-filter"
                  data-ocid="signals.confidence_filter.select"
                  value={confidenceFilter}
                  onChange={(e) => setConfidenceFilter(e.target.value)}
                  className="bg-secondary border border-input rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {["All", "Low", "Medium", "High"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {(resultFilter !== "All" || confidenceFilter !== "All") && (
                <button
                  type="button"
                  data-ocid="signals.clear_filters.button"
                  onClick={() => {
                    setResultFilter("All");
                    setConfidenceFilter("All");
                  }}
                  className="text-xs text-primary hover:underline mt-4 self-end"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {lastUpdated && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {isLoading ? (
          <div
            data-ocid="signals.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="signals.empty_state"
            className="flex flex-col items-center gap-4 py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <p className="font-display font-semibold text-foreground text-xl">
              DemonZeno is preparing the next signal. Stay sharp.
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
              Check back soon — signals drop daily on Binance Square @DemonZeno.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((signal, i) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                index={i + 1}
                onClick={setSelectedSignal}
                showExport
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── AI Chat CTA ──────────────────────────────────────────────────────────────
function AiChatCTASection() {
  return (
    <section
      id="ai-cta"
      data-ocid="ai_cta.section"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.02 260) 0%, oklch(0.14 0.04 200) 50%, oklch(0.12 0.02 260) 100%)",
      }}
    >
      <div
        className="absolute -top-20 -left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.15 190 / 0.08)" }}
      />
      <div
        className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.55 0.22 25 / 0.06)" }}
      />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 text-center">
        <ScrollAnimation>
          <div className="flex flex-col items-center gap-2 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
              style={{
                background: "oklch(0.65 0.15 190 / 0.15)",
                border: "1px solid oklch(0.65 0.15 190 / 0.3)",
                boxShadow: "0 0 40px oklch(0.65 0.15 190 / 0.2)",
              }}
            >
              <Bot
                className="w-8 h-8"
                style={{ color: "oklch(0.65 0.15 190)" }}
              />
            </div>
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "oklch(0.65 0.15 190 / 0.1)",
                color: "oklch(0.72 0.14 190)",
                border: "1px solid oklch(0.65 0.15 190 / 0.25)",
              }}
            >
              AI-Powered · 50+ Providers
            </span>
          </div>

          <h2
            className="font-display font-bold text-4xl md:text-5xl leading-tight mb-4"
            style={{ color: "oklch(0.97 0.005 260)" }}
          >
            Access{" "}
            <span
              className="text-glow"
              style={{ color: "oklch(0.72 0.18 195)" }}
            >
              DemonZeno AI
            </span>
          </h2>

          <p
            className="text-base mb-4 max-w-xl mx-auto"
            style={{ color: "oklch(0.72 0.01 260)" }}
          >
            One unified AI powered silently by{" "}
            <strong style={{ color: "oklch(0.65 0.15 190)" }}>
              50+ AI providers
            </strong>
            . Trading signals, market analysis, code writing, signal chaining —
            all in one place. No provider selection. No limits.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "Trading Signals",
              "Forex & Stocks",
              "Market Analysis",
              "Code Writing",
              "Signal Chaining",
              "Multi-Language",
              "Session Recap",
              "Daily Briefing",
            ].map((cap) => (
              <span
                key={cap}
                className="text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: "oklch(0.65 0.15 190 / 0.08)",
                  border: "1px solid oklch(0.65 0.15 190 / 0.2)",
                  color: "oklch(0.65 0.15 190 / 0.9)",
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={150}>
          <Button
            data-ocid="ai_cta.open_ai.primary_button"
            asChild
            className="h-14 px-10 text-lg font-bold gap-3 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.15 190) 0%, oklch(0.48 0.18 200) 100%)",
              color: "oklch(0.98 0.005 260)",
              border: "none",
              boxShadow: "0 4px 40px oklch(0.55 0.15 190 / 0.4)",
            }}
          >
            <a href="/ai">
              <Zap className="w-5 h-5" />
              Unlock DemonZeno AI
            </a>
          </Button>
          <p className="mt-4 text-xs" style={{ color: "oklch(0.50 0.01 260)" }}>
            Password required · Session-based · No data stored
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}

// ─── Markets ──────────────────────────────────────────────────────────────────
function MarketsSection() {
  const markets = [
    {
      icon: <Bitcoin className="w-8 h-8 text-primary" />,
      title: "Crypto Tokens",
      desc: "Signals on top Binance-listed crypto assets",
      assets: ["BTC", "ETH", "SOL", "BNB", "AVAX"],
    },
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "Forex Pairs",
      desc: "Major and minor currency pairs via Binance",
      assets: ["EUR/USD", "GBP/JPY", "USD/JPY", "AUD/USD", "USD/CHF"],
    },
    {
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: "Stock Market",
      desc: "High-momentum equities on Binance",
      assets: ["AAPL", "TSLA", "NVDA", "META", "AMZN"],
    },
  ];

  return (
    <section
      id="markets"
      data-ocid="markets.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Coverage
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Markets Covered
            </h2>
            <p className="text-muted-foreground text-sm">
              All signals are for assets traded on{" "}
              <span className="text-yellow-500 font-semibold">Binance</span>
            </p>
          </div>
        </ScrollAnimation>
        <div className="grid md:grid-cols-3 gap-6">
          {markets.map(({ icon, title, desc, assets }, i) => (
            <ScrollAnimation key={title} delay={i * 100}>
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-xl">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{desc}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assets.map((a) => (
                    <span
                      key={a}
                      className="font-mono text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded border border-border"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────
function DisclaimerSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      id="disclaimer"
      data-ocid="disclaimer.section"
      className="py-10 bg-muted/20 border-t border-border"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          type="button"
          data-ocid="disclaimer.toggle"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-3 text-left group"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
            <span>Risk Disclaimer & Legal Notice</span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
        </button>
        {expanded && (
          <div
            data-ocid="disclaimer.panel"
            className="mt-4 p-5 bg-card border border-border rounded-xl text-xs text-muted-foreground leading-relaxed space-y-2"
          >
            <p>
              <strong className="text-foreground">
                Informational Purposes Only:
              </strong>{" "}
              Trading signals are for informational purposes only and do not
              constitute financial advice.
            </p>
            <p>
              <strong className="text-foreground">Risk Warning:</strong> All
              trading involves significant risk. Never trade with money you
              cannot afford to lose.
            </p>
            <p>
              <strong className="text-foreground">No Guarantee:</strong> Past
              performance does not guarantee future results.
            </p>
            <p>
              <strong className="text-foreground">Your Responsibility:</strong>{" "}
              Always conduct your own research before making trading decisions.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Home (master page) ───────────────────────────────────────────────────────
export function Home() {
  return (
    <>
      {/* Market mood banner (if admin set one) */}
      <MarketMoodBannerBar />

      {/* 1. Hero — parallax, DemonZeno image, admin unlock */}
      <HeroSection />

      {/* 2. How to Use Signals walkthrough */}
      <HowToUseSection />

      {/* 3. Signal Philosophy + Psychology + Mistakes */}
      <PhilosophySectionCombined />

      {/* 4. Daily Signals feed */}
      <SignalFeedSection />

      {/* 5. AI Chat CTA */}
      <AiChatCTASection />

      {/* 6. DMNZ Token — supply, countdown, hype bar, utility, benefits */}
      <TokenSectionCombined />

      {/* 7. Why DMNZ — comparison */}
      <WhyDemonZenoSection />

      {/* 8. Burn Schedule */}
      <BurnSection />

      {/* 9. BLUM platform deep dive */}
      <BlumSectionCombined />

      {/* 10. Bonding Curve explainer */}
      <BondingCurveSection />

      {/* 11. Roadmap */}
      <RoadmapSection />

      {/* 12. Markets covered */}
      <MarketsSection />

      {/* 13. Community — quotes, testimonials, signal of week, top traders */}
      <CommunitySectionCombined />

      {/* 14. Join the Movement CTA */}
      <JoinMovementSection />

      {/* 15. FAQ AI section */}
      <FaqAiSection />

      {/* 16. Token FAQ Chatbot */}
      <section
        id="token-faq"
        data-ocid="token_faq.section"
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollAnimation>
            <div className="flex flex-col gap-3 mb-10 text-center">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                DMNZ AI Assistant
              </span>
              <h2 className="font-display font-bold text-3xl text-foreground">
                Token FAQ Chatbot
              </h2>
              <p className="text-muted-foreground text-sm">
                Ask anything about the DMNZ token, launch mechanics, and Blum.
              </p>
            </div>
          </ScrollAnimation>
          <TokenFaqChatbotSection />
        </div>
      </section>

      {/* 17. Disclaimer */}
      <DisclaimerSection />
    </>
  );
}
