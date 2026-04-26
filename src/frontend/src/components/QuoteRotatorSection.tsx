import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { createActor } from "../backend";
import type { DemonZenoQuote } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

function useQuotes() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<DemonZenoQuote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      const all = await actor.getQuotes();
      return all.filter((q) => q.active);
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

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

export function QuoteRotatorSection() {
  const { data, isLoading } = useQuotes();
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

  if (isLoading) return null;

  const q = quotes[current];
  if (!q) return null;

  return (
    <section
      id="quote-rotator"
      data-ocid="quote_rotator.section"
      className="py-20 bg-muted/30 relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.65 0.15 190 / 0.05), transparent)",
        }}
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <ScrollAnimation>
          <div className="flex flex-col items-center gap-3 mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-widest">
              Wisdom
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground">
              DemonZeno Speaks
            </h2>
          </div>
        </ScrollAnimation>

        <div className="flex flex-col items-center gap-8">
          <div className="relative w-full min-h-[180px] flex items-center justify-center">
            <Quote
              className="absolute top-0 left-4 w-12 h-12 text-primary/20"
              aria-hidden
            />
            <div
              className="text-center px-12 py-8 transition-all duration-400"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
              }}
            >
              <p
                className="font-display font-bold text-2xl md:text-3xl text-foreground leading-relaxed"
                data-ocid="quote_rotator.quote.text"
              >
                "{q.quote}"
              </p>
              <p className="mt-4 text-primary font-semibold text-sm tracking-wider uppercase">
                — {q.author}
              </p>
            </div>
            <Quote
              className="absolute bottom-0 right-4 w-12 h-12 text-primary/20 rotate-180"
              aria-hidden
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label="Previous quote"
              data-ocid="quote_rotator.prev.button"
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {quotes.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  aria-label={`Quote ${i + 1}`}
                  data-ocid={`quote_rotator.dot.${i + 1}`}
                  onClick={() => {
                    setVisible(false);
                    setTimeout(() => {
                      setCurrent(i);
                      setVisible(true);
                    }, 300);
                  }}
                  className={`w-2 h-2 rounded-full transition-smooth ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next quote"
              data-ocid="quote_rotator.next.button"
              onClick={next}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
