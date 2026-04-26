import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bitcoin,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  ExternalLink,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SiBinance } from "react-icons/si";
import { createActor } from "../backend";
import { BinanceSquareFeedSection } from "../components/BinanceSquareFeedSection";
import { BlumDeepDiveSection } from "../components/BlumDeepDiveSection";
import { BlumExplainerSection } from "../components/BlumExplainerSection";
import { BlumPreviewSection } from "../components/BlumPreviewSection";
import { BondingCurveSection } from "../components/BondingCurveSection";
import { BurnCountdownSection } from "../components/BurnCountdownSection";
import { BurnScheduleSection } from "../components/BurnScheduleSection";
import { CommunityCounterSection } from "../components/CommunityCounterSection";
import { CountdownTimer } from "../components/CountdownTimer";
import { FilterBar } from "../components/FilterBar";
import { HolderBenefitsSection } from "../components/HolderBenefitsSection";
import { HowToUseSection } from "../components/HowToUseSection";
import { HypeBarSection } from "../components/HypeBarSection";
import { JoinMovementSection } from "../components/JoinMovementSection";
import { LaunchCountdownSection } from "../components/LaunchCountdownSection";
import { ManifestoSection } from "../components/ManifestoSection";
import { MarketSentimentSection } from "../components/MarketSentimentSection";
import { MilestonesSection } from "../components/MilestonesSection";
import { QuoteRotatorSection } from "../components/QuoteRotatorSection";
import { RoadmapSection } from "../components/RoadmapSection";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { SignalAcademySection } from "../components/SignalAcademySection";
import { SignalCard } from "../components/SignalCard";
import { SignalDetailModal } from "../components/SignalDetailModal";
import { SignalOfWeekSection } from "../components/SignalOfWeekSection";
import { SignalSearchBar } from "../components/SignalSearchBar";
import { SkeletonCard } from "../components/SkeletonCard";
import { StatsBar } from "../components/StatsBar";
import { TelegramMockupSection } from "../components/TelegramMockupSection";
import { TokenBurnTrackerSection } from "../components/TokenBurnTrackerSection";
import { TokenFaqChatbotSection } from "../components/TokenFaqChatbotSection";
import { TokenUtilitySection } from "../components/TokenUtilitySection";
import { WhitepaperSection } from "../components/WhitepaperSection";
import { WhyDemonZenoSection } from "../components/WhyDemonZenoSection";
import { useFaqs } from "../hooks/useFaqs";
import { useSignalOfTheDay } from "../hooks/useSignalOfTheDay";
import { useSignals } from "../hooks/useSignals";
import type { MarketFilter, Signal, Timeframe } from "../types";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HeroSection() {
  const { data: signalOfTheDay } = useSignalOfTheDay();
  const [sotdModalOpen, setSotdModalOpen] = useState(false);

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-2 h-16 bg-primary rounded-full" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30" />
      </div>

      {sotdModalOpen && signalOfTheDay && (
        <SignalDetailModal
          signal={signalOfTheDay}
          onClose={() => setSotdModalOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 w-fit">
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
            Daily free signals for crypto, forex, and stocks. The DMNZ token
            launches April 2, 2028 on Blum.
          </p>

          {signalOfTheDay && (
            <button
              type="button"
              data-ocid="hero.signal_of_the_day.card"
              onClick={() => setSotdModalOpen(true)}
              className="text-left flex items-center gap-4 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 hover:bg-primary/15 hover:border-primary/50 transition-smooth group w-fit max-w-full"
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
                  Confidence: {signalOfTheDay.confidence} · Tap to view full
                  signal
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
              data-ocid="hero.learn_dmnz.secondary_button"
              onClick={() => scrollTo("token")}
              className="border-primary/40 text-primary hover:bg-primary/10 h-11 text-base"
            >
              Learn About DMNZ
            </Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-75 animate-pulse-glow" />
            <img
              src="/assets/demonzeno-character.png"
              alt="DemonZeno — anime-style boy on an open highway"
              className="relative z-10 w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────
function StatsBarSection() {
  return (
    <section
      data-ocid="stats_bar.section"
      className="bg-muted/20 border-y border-border"
    >
      <div className="container mx-auto px-4 py-4">
        <StatsBar />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" data-ocid="about.section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl text-center flex flex-col gap-8">
        <ScrollAnimation>
          <div className="flex flex-col gap-3">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              About
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Who is DemonZeno?
            </h2>
          </div>
        </ScrollAnimation>
        <ScrollAnimation delay={100}>
          <p className="text-muted-foreground text-lg leading-relaxed">
            DemonZeno is an anime persona who walks the open road of the markets
            — calm, calculated, and relentless. Every day, DemonZeno delivers
            free, accurate trading signals for{" "}
            <strong className="text-foreground">crypto tokens</strong>,{" "}
            <strong className="text-foreground">forex pairs</strong>, and{" "}
            <strong className="text-foreground">stocks</strong> — giving every
            trader access to the same intelligence the pros use.
          </p>
        </ScrollAnimation>
        <ScrollAnimation delay={150}>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The mission is simple:{" "}
            <em className="text-primary not-italic font-semibold">
              democratize trading information
            </em>
            . No subscriptions. No fees. No gatekeeping. Just signals and
            results — completely free.
          </p>
        </ScrollAnimation>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {[
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              label: "Daily Signals",
              desc: "Fresh signals every single day",
              delay: 200,
            },
            {
              icon: <Shield className="w-6 h-6 text-primary" />,
              label: "100% Free",
              desc: "No subscription. No hidden fees",
              delay: 250,
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              label: "Community First",
              desc: "Built for traders, not VCs",
              delay: 300,
            },
          ].map(({ icon, label, desc, delay }) => (
            <ScrollAnimation key={label} delay={delay}>
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-3 card-elevated">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {icon}
                </div>
                <span className="font-display font-semibold text-foreground">
                  {label}
                </span>
                <span className="text-muted-foreground text-sm text-center">
                  {desc}
                </span>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function useLastUpdated(refetchedAt: number | undefined): string {
  if (!refetchedAt) return "";
  const diff = Math.floor((Date.now() - refetchedAt) / 60_000);
  if (diff < 1) return "just now";
  if (diff === 1) return "1 minute ago";
  return `${diff} minutes ago`;
}

// ─── Signal Feed ──────────────────────────────────────────────────────────
function SignalFeedSection() {
  const { data: signals = [], isLoading, dataUpdatedAt } = useSignals();
  const [filter, setFilter] = useState<MarketFilter>("All");
  const [timeframe, setTimeframe] = useState<Timeframe | "All">("All");
  const [search, setSearch] = useState("");
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
    if (
      search.trim() &&
      !s.asset.toLowerCase().includes(search.trim().toLowerCase())
    )
      return false;
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
              Trading Signals
            </h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm flex-wrap">
              <span>Real trading signals from DemonZeno</span>
              <span className="inline-flex items-center gap-1 bg-yellow-400/10 text-yellow-500 border border-yellow-400/30 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
                Binance
              </span>
            </div>
          </div>
        </ScrollAnimation>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl">
            <SignalSearchBar
              value={search}
              onChange={setSearch}
              resultCount={filtered.length}
            />
          </div>

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
              {search
                ? `No signals match "${search}"`
                : "DemonZeno is preparing the next signal. Stay sharp."}
            </p>
            <p className="text-muted-foreground text-sm max-w-sm">
              {search
                ? "Try a different asset name or clear your search."
                : "Check back soon — signals drop daily across crypto, forex, and stocks on Binance."}
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Markets ──────────────────────────────────────────────────────────────
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

// ─── Token ────────────────────────────────────────────────────────────────
function TokenSection() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const { actor } = useActor(createActor);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !contact) return;
    setNotifyLoading(true);
    try {
      await actor.submitNotifyMe(name.trim() || null, contact.trim());
      setSubmitted(true);
    } catch {
      // silent fail
    } finally {
      setNotifyLoading(false);
    }
  }

  return (
    <section id="token" data-ocid="token.section" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Token
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DMNZ Token Info
            </h2>
          </div>
        </ScrollAnimation>
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollAnimation direction="left">
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col gap-5 card-elevated">
              <h3 className="font-display font-bold text-2xl text-foreground">
                DemonZeno (DMNZ)
              </h3>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  ["Ticker", "DMNZ"],
                  ["Launch Type", "100% Fair Launch"],
                  ["Platform", "Telegram Mini App via Blum"],
                  ["Launch Date", "April 2, 2028"],
                  ["Presale", "None"],
                  ["Private Sale", "None"],
                  ["Allocation", "None"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold text-foreground font-mono">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-primary text-sm">
                    100% Fair Launch
                  </p>
                  <p className="text-muted-foreground text-xs">
                    No presale · No insiders · No allocation breakdown
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="right">
            <div className="flex flex-col gap-6">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated">
                <p className="font-display font-semibold text-foreground text-lg">
                  Launch Countdown
                </p>
                <CountdownTimer />
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated">
                <h3 className="font-display font-semibold text-foreground">
                  Get Notified at Launch
                </h3>
                {submitted ? (
                  <div
                    data-ocid="token.notify.success_state"
                    className="flex items-center gap-2 text-primary"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You're on the list!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNotify} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="notify-name"
                        className="text-muted-foreground text-xs"
                      >
                        Name (optional)
                      </Label>
                      <Input
                        id="notify-name"
                        data-ocid="token.notify.name.input"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-secondary border-input"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="notify-contact"
                        className="text-muted-foreground text-xs"
                      >
                        Telegram or Email *
                      </Label>
                      <Input
                        id="notify-contact"
                        data-ocid="token.notify.contact.input"
                        placeholder="@username or email"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="bg-secondary border-input"
                      />
                    </div>
                    <Button
                      type="submit"
                      data-ocid="token.notify.submit_button"
                      disabled={notifyLoading || !contact}
                      className="btn-primary"
                    >
                      {notifyLoading ? "Saving…" : "Notify Me at Launch"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}

// ─── Philosophy, Psychology & Mistakes ────────────────────────────────────
function TradingPhilosophySection() {
  const sections = [
    {
      id: "philosophy",
      tag: "Philosophy",
      title: "The DemonZeno Signal Philosophy",
      bg: "bg-background",
      items: [
        {
          icon: "🎯",
          title: "Structure Over Emotion",
          desc: "Every signal from DemonZeno is built on price structure, not gut feelings. When the chart speaks, we listen — not the news.",
        },
        {
          icon: "⚡",
          title: "Entry, TP, SL — Always",
          desc: "A signal without a stop loss is a gamble. DemonZeno always gives you three Take Profit targets and a clear Stop Loss. No exceptions.",
        },
        {
          icon: "🌐",
          title: "Risk Before Reward",
          desc: "DemonZeno calculates risk first. Never trade a signal where the risk-reward ratio is below 1:2. The downside defines the upside.",
        },
      ],
    },
    {
      id: "psychology",
      tag: "Psychology",
      title: "Trading Psychology",
      bg: "bg-muted/30",
      items: [
        {
          icon: "🧠",
          title: "Emotions Are the Enemy",
          desc: "Fear and greed destroy accounts. Execute your plan, stick to your stop loss, and detach from the outcome.",
        },
        {
          icon: "📉",
          title: "A Loss is Data",
          desc: "Every losing trade is a lesson. DemonZeno treats losses as tuition paid to the market. Log it, learn it, move on.",
        },
        {
          icon: "⏳",
          title: "Patience is an Edge",
          desc: "The best signals come to those who wait. Don't chase entries. If you missed it, the next one is coming.",
        },
      ],
    },
    {
      id: "mistakes",
      tag: "Mistakes",
      title: "Mistakes to Avoid",
      bg: "bg-background",
      items: [
        {
          icon: "🚫",
          title: "Trading Without a Stop Loss",
          desc: "Never enter a trade without defining your exit on the downside. The market will find your pain point without one.",
        },
        {
          icon: "💸",
          title: "Over-Leveraging",
          desc: "10x leverage on a 5% move wipes your account. Start with low leverage until your win rate is proven.",
        },
        {
          icon: "🔄",
          title: "Revenge Trading",
          desc: "Lost 3 in a row? Step away. Revenge trades are emotionally driven and almost always lose. The market doesn't owe you a win.",
        },
      ],
    },
  ];

  return (
    <>
      {sections.map(({ id, tag, title, bg, items }) => (
        <section
          key={id}
          id={id}
          data-ocid={`${id}.section`}
          className={`py-20 ${bg}`}
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <ScrollAnimation>
              <div className="flex flex-col gap-3 mb-12 text-center">
                <span className="text-primary text-sm font-semibold uppercase tracking-widest">
                  {tag}
                </span>
                <h2 className="font-display font-bold text-4xl text-foreground">
                  {title}
                </h2>
              </div>
            </ScrollAnimation>
            <div className="grid md:grid-cols-3 gap-6">
              {items.map(({ icon, title: t, desc }, i) => (
                <ScrollAnimation key={t} delay={i * 80}>
                  <div
                    data-ocid={`${id}.item.${i + 1}`}
                    className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 card-elevated hover:border-primary/30 transition-smooth"
                  >
                    <div className="text-3xl">{icon}</div>
                    <h3 className="font-display font-bold text-foreground text-base">
                      {t}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
function FAQSection() {
  const { data: faqs = [], isLoading } = useFaqs();

  return (
    <section id="faq" data-ocid="faq.section" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-12 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Questions
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              FAQ
            </h2>
          </div>
        </ScrollAnimation>

        {isLoading ? (
          <div data-ocid="faq.loading_state" className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="h-14 bg-card border border-border rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div
            data-ocid="faq.empty_state"
            className="text-center text-muted-foreground py-10"
          >
            FAQ entries coming soon.
          </div>
        ) : (
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {[...faqs]
              .sort((a, b) => Number(a.order - b.order))
              .map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  data-ocid={`faq.item.${i + 1}`}
                  className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-primary/40 transition-smooth"
                >
                  <AccordionTrigger className="font-display font-semibold text-foreground hover:no-underline py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}

// ─── Community ────────────────────────────────────────────────────────────
function CommunitySection() {
  const platforms = [
    {
      icon: <SiBinance className="w-7 h-7" />,
      name: "Binance Square",
      handle: "@DemonZeno",
      desc: "Daily free trading signals. Follow for real-time updates.",
      url: "https://www.binance.com/en/square/profile/@DemonZeno",
      cta: "Follow @DemonZeno",
    },
    {
      icon: <Twitter className="w-7 h-7" />,
      name: "Twitter / X",
      handle: "@ZenoDemon",
      desc: "Market takes, signal highlights, and token news.",
      url: "https://twitter.com/ZenoDemon",
      cta: "Follow @ZenoDemon",
    },
  ];

  return (
    <section
      id="community"
      data-ocid="community.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Community
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Join the Community
            </h2>
            <p className="text-muted-foreground">
              Follow DemonZeno for daily free signals and token updates.
            </p>
          </div>
        </ScrollAnimation>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          {platforms.map(({ icon, name, handle, desc, url, cta }, i) => (
            <ScrollAnimation key={name} delay={i * 100}>
              <div
                data-ocid={`community.${name.toLowerCase().replace(/\s+\/\s+|\s+/g, "_")}.card`}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4 card-elevated text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-lg">
                    {name}
                  </h3>
                  <p className="text-primary text-sm font-mono font-semibold mt-0.5">
                    {handle}
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">{desc}</p>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`community.${name.toLowerCase().replace(/\s+\/\s+|\s+/g, "_")}.link`}
                  className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground"
                >
                  {cta}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Notify Me ────────────────────────────────────────────────────────────
function NotifyMeSection() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { actor } = useActor(createActor);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !contact) return;
    setLoading(true);
    try {
      await actor.submitNotifyMe(name.trim() || null, contact.trim());
      setSubmitted(true);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="notify"
      data-ocid="notify.section"
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 max-w-lg">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Stay Informed
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              Get Notified
            </h2>
            <p className="text-muted-foreground text-sm">
              Be the first to know when DMNZ launches on April 2, 2028.
            </p>
          </div>
        </ScrollAnimation>
        <ScrollAnimation delay={100}>
          <div className="bg-card border border-border rounded-2xl p-8 card-elevated">
            {submitted ? (
              <div
                data-ocid="notify.success_state"
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <CheckCircle className="w-12 h-12 text-primary" />
                <p className="font-display font-semibold text-foreground text-xl">
                  You're on the list!
                </p>
                <p className="text-muted-foreground text-sm">
                  We'll notify you when DemonZeno launches.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="notify2-name"
                    className="text-muted-foreground text-xs"
                  >
                    Name (optional)
                  </Label>
                  <Input
                    id="notify2-name"
                    data-ocid="notify.name.input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="notify2-contact"
                    className="text-muted-foreground text-xs"
                  >
                    Telegram or Email *
                  </Label>
                  <Input
                    id="notify2-contact"
                    data-ocid="notify.contact.input"
                    placeholder="@username or email"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="bg-secondary border-input"
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="notify.submit_button"
                  disabled={loading || !contact}
                  className="btn-primary w-full"
                >
                  {loading ? "Saving…" : "Notify Me at Launch"}
                </Button>
              </form>
            )}
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}

// ─── Disclaimer ───────────────────────────────────────────────────────────
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
            <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth shrink-0" />
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
              Trading signals provided by DemonZeno are for informational
              purposes only and do not constitute financial advice.
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

// ─── Home ─────────────────────────────────────────────────────────────────
export function Home() {
  return (
    <>
      <HeroSection />
      <StatsBarSection />
      <AboutSection />
      <SignalFeedSection />
      <HowToUseSection />
      <MarketsSection />

      {/* Community signal info */}
      <QuoteRotatorSection />
      <SignalOfWeekSection />
      <MilestonesSection />

      {/* Token sections */}
      <TokenSection />
      <HypeBarSection />
      <TokenUtilitySection />
      <HolderBenefitsSection />
      <BondingCurveSection />

      {/* Launch platform */}
      <ScrollAnimation>
        <TelegramMockupSection />
      </ScrollAnimation>
      <BlumDeepDiveSection />
      <ScrollAnimation>
        <BlumExplainerSection />
      </ScrollAnimation>

      {/* Countdown & burn */}
      <BurnCountdownSection />
      <BurnScheduleSection />

      {/* Roadmap & launch */}
      <RoadmapSection />
      <LaunchCountdownSection />
      <TokenBurnTrackerSection />

      {/* Community & social */}
      <CommunityCounterSection />
      <BinanceSquareFeedSection />
      <BlumPreviewSection />
      <JoinMovementSection />

      {/* Content & education */}
      <TradingPhilosophySection />
      <SignalAcademySection />

      {/* Market data */}
      <ScrollAnimation>
        <MarketSentimentSection />
      </ScrollAnimation>

      {/* Site info */}
      <ScrollAnimation>
        <ManifestoSection />
      </ScrollAnimation>
      <ScrollAnimation>
        <WhyDemonZenoSection />
      </ScrollAnimation>

      {/* Token FAQ bot & whitepaper */}
      <TokenFaqChatbotSection />
      <WhitepaperSection />

      {/* FAQ & Community */}
      <FAQSection />
      <CommunitySection />
      <NotifyMeSection />
      <DisclaimerSection />
    </>
  );
}
