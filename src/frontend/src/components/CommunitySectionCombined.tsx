import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  ExternalLink,
  Quote,
  Send,
  Trophy,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiBinance } from "react-icons/si";
import { createActor } from "../backend";
import type {
  CommunityMilestone,
  CommunityQuestion,
  DemonZenoQuote,
  Testimonial,
  TopTrader,
} from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

// ─── Hooks ──────────────────────────────────────────────────────────────────
function useQuotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DemonZenoQuote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getQuotes()).filter((q) => q.active);
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function useTestimonials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.getTestimonials()).filter((t) => t.active);
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function useMilestones() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityMilestone[]>({
    queryKey: ["milestones"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMilestones();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function useTopTraders() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TopTrader[]>({
    queryKey: ["topTraders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopTraders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

function useCommunityQuestions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CommunityQuestion[]>({
    queryKey: ["communityQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommunityQuestions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}

function useSubmitQuestion() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (question: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitCommunityQuestion(question);
    },
  });
}

// ─── Fallbacks ─────────────────────────────────────────────────────────────
const FALLBACK_QUOTES: DemonZenoQuote[] = [
  {
    id: "1",
    active: true,
    quote: "Master the Chaos, Slay the Market, and Trade Like a God.",
    author: "DemonZeno",
  },
  {
    id: "2",
    active: true,
    quote:
      "The road is long, but every candle tells a story. Learn to read them.",
    author: "DemonZeno",
  },
  {
    id: "3",
    active: true,
    quote:
      "Risk is not the enemy. Ignorance is. Know your stop loss before you enter.",
    author: "DemonZeno",
  },
  {
    id: "4",
    active: true,
    quote: "The market rewards patience. The impatient feed the patient.",
    author: "DemonZeno",
  },
  {
    id: "5",
    active: true,
    quote: "A signal without discipline is just noise. Execute or learn.",
    author: "DemonZeno",
  },
];

const FALLBACK_MILESTONES: CommunityMilestone[] = [
  {
    id: "1",
    reached: false,
    title: "1,000 Followers on Binance Square",
    description: "First major milestone on our journey to launch.",
  },
  {
    id: "2",
    reached: false,
    title: "5,000 Twitter Followers",
    description: "Growing the community across all platforms.",
  },
  {
    id: "3",
    reached: false,
    title: "DMNZ Token Launch on Blum",
    description: "April 2, 2028 — the day everything begins.",
  },
];

function isCelebrating(m: CommunityMilestone): boolean {
  if (!m.reached || !m.celebrateUntil) return false;
  return Date.now() < Number(m.celebrateUntil) / 1_000_000;
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function QuoteRotator() {
  const { data } = useQuotes();
  const quotes = data && data.length > 0 ? data : FALLBACK_QUOTES;
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const total = quotes.length;

  useEffect(() => {
    if (total === 0) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % total);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  function prev() {
    setVisible(false);
    setTimeout(() => {
      setCurrent((c) => (c - 1 + total) % total);
      setVisible(true);
    }, 300);
  }
  function next() {
    setVisible(false);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % total);
      setVisible(true);
    }, 300);
  }

  const q = quotes[current];
  if (!q) return null;

  return (
    <div
      data-ocid="community.quotes.panel"
      className="bg-card border border-border rounded-2xl p-8 card-elevated relative overflow-hidden"
    >
      <Quote
        className="absolute top-4 left-4 w-10 h-10 text-primary/15"
        aria-hidden
      />
      <div
        className="text-center px-8 py-4 min-h-[120px] flex flex-col items-center justify-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.4s ease",
        }}
      >
        <p
          className="font-display font-bold text-xl md:text-2xl text-foreground leading-relaxed"
          data-ocid="community.quote.text"
        >
          "{q.quote}"
        </p>
        <p className="mt-4 text-primary font-semibold text-sm tracking-wider uppercase">
          — {q.author}
        </p>
      </div>
      <Quote
        className="absolute bottom-4 right-4 w-10 h-10 text-primary/15 rotate-180"
        aria-hidden
      />
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          aria-label="Previous quote"
          data-ocid="community.quote.prev.button"
          onClick={prev}
          className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {quotes.map((qd, i) => (
            <button
              key={qd.id}
              type="button"
              aria-label={`Quote ${i + 1}`}
              data-ocid={`community.quote.dot.${i + 1}`}
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  setCurrent(i);
                  setVisible(true);
                }, 300);
              }}
              className={`rounded-full transition-smooth ${i === current ? "bg-primary w-5 h-2" : "bg-muted-foreground/30 hover:bg-muted-foreground/60 w-2 h-2"}`}
              aria-pressed={i === current}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next quote"
          data-ocid="community.quote.next.button"
          onClick={next}
          className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TestimonialsWall() {
  const { data } = useTestimonials();
  if (!data || data.length === 0) return null;
  return (
    <div data-ocid="community.testimonials.panel">
      <h3 className="font-display font-bold text-xl text-foreground mb-5">
        Community Wins
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((t, i) => (
          <div
            key={t.id}
            data-ocid={`community.testimonial.item.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 card-elevated"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-display font-bold text-foreground text-sm">
                {t.name}
              </p>
              {t.asset && (
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {t.asset}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.content}
            </p>
            {t.winAmount && (
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> {t.winAmount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopTradersWall() {
  const { data } = useTopTraders();
  if (!data || data.length === 0) return null;
  return (
    <div data-ocid="community.top_traders.panel">
      <h3 className="font-display font-bold text-xl text-foreground mb-5">
        Top Traders
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {data.map((t, i) => (
          <div
            key={t.id}
            data-ocid={`community.trader.item.${i + 1}`}
            className="bg-card border border-border rounded-2xl p-5 card-elevated flex flex-col items-center gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
              {t.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                {t.name}
              </p>
              {t.bio && (
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                  {t.bio}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestonesPanel() {
  const { data } = useMilestones();
  const milestones = data && data.length > 0 ? data : FALLBACK_MILESTONES;
  const celebrating = milestones.filter(isCelebrating);

  return (
    <div data-ocid="community.milestones.panel">
      <h3 className="font-display font-bold text-xl text-foreground mb-5">
        Community Milestones
      </h3>
      {celebrating.map((m) => (
        <div
          key={m.id}
          data-ocid="community.milestone.celebrate.banner"
          className="mb-4 flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-xl px-5 py-3 animate-pulse-glow"
        >
          <Trophy className="w-5 h-5 text-primary shrink-0" />
          <p className="font-display font-bold text-primary text-sm">
            🎉 Milestone Reached: {m.title}
          </p>
        </div>
      ))}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/60" />
        <div className="flex flex-col gap-4 pl-12">
          {milestones.map((m, i) => (
            <ScrollAnimation key={m.id} delay={i * 80}>
              <div
                data-ocid={`community.milestone.item.${i + 1}`}
                className={`relative bg-card border rounded-xl p-4 card-elevated ${isCelebrating(m) ? "border-primary/50" : m.reached ? "border-primary/30" : "border-border"}`}
              >
                <div
                  className="absolute -left-[2.15rem] top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 z-10"
                  style={{
                    background: m.reached
                      ? "oklch(0.65 0.15 190)"
                      : "var(--card)",
                    borderColor: m.reached
                      ? "oklch(0.65 0.15 190)"
                      : "var(--border)",
                  }}
                >
                  {m.reached ? (
                    <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
                <h4
                  className={`font-display font-bold text-sm ${m.reached ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {m.title}
                </h4>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
}

function AskCommunity() {
  const { data: questions = [] } = useCommunityQuestions();
  const submitQuestion = useSubmitQuestion();
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    submitQuestion.mutate(input.trim(), {
      onSuccess: () => {
        setSubmitted(true);
        setInput("");
      },
    });
  }

  const pinned = questions.filter((q) => q.isPinned);

  return (
    <div data-ocid="community.ask.panel">
      <h3 className="font-display font-bold text-xl text-foreground mb-5">
        Ask the Community
      </h3>
      {pinned.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          {pinned.map((q, i) => (
            <div
              key={q.id}
              data-ocid={`community.question.item.${i + 1}`}
              className="bg-card border border-primary/20 rounded-xl p-4 flex flex-col gap-1"
            >
              <p className="text-foreground text-sm font-semibold">
                {q.question}
              </p>
              {q.answer && (
                <p className="text-primary text-xs mt-1 pl-3 border-l-2 border-primary/40">
                  {q.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {submitted ? (
        <div
          data-ocid="community.ask.success_state"
          className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-primary text-sm font-semibold"
        >
          <CheckCircle className="w-4 h-4" />
          Question submitted! DemonZeno will respond soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            data-ocid="community.ask.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask DemonZeno anything..."
            className="flex-1 bg-card border-border"
            maxLength={280}
          />
          <Button
            type="submit"
            data-ocid="community.ask.submit_button"
            className="btn-primary gap-1.5"
            disabled={!input.trim() || submitQuestion.isPending}
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </Button>
        </form>
      )}
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export function CommunitySectionCombined() {
  return (
    <section
      id="community"
      data-ocid="community.section"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 max-w-5xl flex flex-col gap-14">
        <ScrollAnimation>
          <div className="flex flex-col gap-3 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Community
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              The DemonZeno Community
            </h2>
            <p className="text-muted-foreground">
              Follow DemonZeno for daily free signals and DMNZ token updates.
            </p>
          </div>
        </ScrollAnimation>

        {/* Social cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: <SiBinance className="w-7 h-7" />,
              name: "Binance Square",
              handle: "@DemonZeno",
              desc: "Daily free trading signals. Follow for real-time updates.",
              url: "https://www.binance.com/en/square/profile/@DemonZeno",
              cta: "Follow @DemonZeno",
              ocid: "community.binance",
            },
            {
              icon: <Twitter className="w-7 h-7" />,
              name: "Twitter / X",
              handle: "@ZenoDemon",
              desc: "Market takes, signal highlights, and token news.",
              url: "https://twitter.com/ZenoDemon",
              cta: "Follow @ZenoDemon",
              ocid: "community.twitter",
            },
          ].map(({ icon, name, handle, desc, url, cta, ocid }, i) => (
            <ScrollAnimation key={name} delay={i * 100}>
              <div
                data-ocid={`${ocid}.card`}
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
                  data-ocid={`${ocid}.link`}
                  className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground"
                >
                  {cta} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        {/* Quote rotator */}
        <ScrollAnimation>
          <div className="flex flex-col gap-3">
            <h3 className="font-display font-bold text-xl text-foreground text-center">
              DemonZeno Speaks
            </h3>
            <QuoteRotator />
          </div>
        </ScrollAnimation>

        {/* Testimonials */}
        <ScrollAnimation delay={100}>
          <TestimonialsWall />
        </ScrollAnimation>

        {/* Top Traders */}
        <ScrollAnimation delay={120}>
          <TopTradersWall />
        </ScrollAnimation>

        {/* Ask Community */}
        <ScrollAnimation delay={140}>
          <AskCommunity />
        </ScrollAnimation>

        {/* Milestones */}
        <ScrollAnimation delay={160}>
          <MilestonesPanel />
        </ScrollAnimation>
      </div>
    </section>
  );
}
