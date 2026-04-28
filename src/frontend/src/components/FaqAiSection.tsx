import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
  Search,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import type { FAQ, FaqCategory } from "../backend.d";
import { ScrollAnimation } from "./ScrollAnimation";

const CATEGORY_LABELS: Record<string, string> = {
  Signals: "Daily Signals",
  DmnzToken: "DMNZ Token",
  GeneralTrading: "General Trading",
  Platform: "Platform",
};

const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS);

function FaqItem({ faq }: { faq: FAQ }) {
  const { actor } = useActor(createActor);
  const [open, setOpen] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(Number(faq.helpfulCount));
  const [notHelpfulCount, setNotHelpfulCount] = useState(
    Number(faq.notHelpfulCount),
  );
  const [voted, setVoted] = useState(false);

  async function handleRate(helpful: boolean) {
    if (voted || !actor) return;
    setVoted(true);
    if (helpful) setHelpfulCount((v) => v + 1);
    else setNotHelpfulCount((v) => v + 1);
    try {
      await actor.rateFaq(faq.id, helpful);
    } catch {
      // non-blocking
    }
    toast.success(helpful ? "Thanks for your feedback! 👍" : "Feedback noted.");
  }

  return (
    <div
      className="border border-border rounded-xl overflow-hidden transition-smooth"
      style={{
        background: open ? "oklch(0.20 0.01 260)" : "oklch(0.18 0.01 260)",
      }}
    >
      <button
        type="button"
        className="flex items-center gap-3 w-full text-left px-5 py-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <HelpCircle
          className="w-4 h-4 shrink-0"
          style={{ color: "oklch(0.65 0.15 190)" }}
        />
        <span className="flex-1 text-sm font-medium text-foreground">
          {faq.question}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border/40">
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            {faq.answer}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-muted-foreground">Helpful?</span>
            <button
              type="button"
              onClick={() => handleRate(true)}
              disabled={voted}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-400 disabled:opacity-50 transition-colors"
              aria-label="Mark as helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              {helpfulCount}
            </button>
            <button
              type="button"
              onClick={() => handleRate(false)}
              disabled={voted}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
              aria-label="Mark as not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              {notHelpfulCount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FaqAiSection() {
  const { actor } = useActor(createActor);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [relatedSuggestions] = useState([
    "What are the daily trading signals?",
    "How do I read a signal card?",
    "What is the DMNZ token?",
    "When does DMNZ launch?",
    "How does the Blum platform work?",
    "What is a Stop Loss?",
  ]);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getFaqs()
      .then((data) => setFaqs(data))
      .catch(() => {});
  }, [actor]);

  async function handleAskAi() {
    const q = aiQuestion.trim();
    if (!q || !actor) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const answer = await actor.askFaq(q);
      setAiAnswer(answer || "No answer available right now. Try again.");
      setTimeout(
        () =>
          answerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        100,
      );
    } catch {
      setAiAnswer("Sorry, I couldn't answer that right now.");
    } finally {
      setAiLoading(false);
    }
  }

  const filteredFaqs = faqs.filter((f) => {
    const matchCat =
      activeCategory === "All" ||
      (f.category as unknown as string) === activeCategory;
    const matchSearch =
      !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section
      id="faq"
      data-ocid="faq.section"
      className="py-20"
      style={{ background: "oklch(0.145 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollAnimation>
          <div className="text-center mb-10">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.65 0.15 190)" }}
            >
              Knowledge Base
            </span>
            <h2 className="font-display font-bold text-4xl text-foreground mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
              Everything about DemonZeno signals, the DMNZ token, and trading on
              the platform. Or ask the AI directly.
            </p>
          </div>
        </ScrollAnimation>

        {/* AI Ask Box */}
        <ScrollAnimation delay={100}>
          <div
            className="rounded-2xl p-5 mb-8 border"
            style={{
              background: "oklch(0.18 0.015 260)",
              borderColor: "oklch(0.65 0.15 190 / 0.25)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare
                className="w-5 h-5"
                style={{ color: "oklch(0.65 0.15 190)" }}
              />
              <h3
                className="font-display font-semibold text-sm"
                style={{ color: "oklch(0.85 0.01 260)" }}
              >
                Ask DemonZeno AI — Powered by 50+ Providers
              </h3>
            </div>
            <div className="flex gap-2">
              <Input
                data-ocid="faq.ai_question.input"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAskAi();
                }}
                placeholder="Ask anything about DemonZeno, signals, DMNZ token…"
                className="bg-background border-input text-sm flex-1"
                disabled={aiLoading}
              />
              <Button
                data-ocid="faq.ai_question.submit_button"
                onClick={handleAskAi}
                disabled={aiLoading || !aiQuestion.trim()}
                className="btn-primary shrink-0 px-4"
              >
                {aiLoading ? "…" : "Ask AI"}
              </Button>
            </div>

            {/* Suggested questions */}
            {!aiAnswer && (
              <div className="flex flex-wrap gap-2 mt-3">
                {relatedSuggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    data-ocid="faq.suggestion.button"
                    onClick={() => setAiQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* AI Loading */}
            {aiLoading && (
              <div
                data-ocid="faq.ai_answer.loading_state"
                className="mt-4 flex items-center gap-3"
              >
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  DemonZeno AI is answering…
                </span>
              </div>
            )}

            {/* AI Answer */}
            {aiAnswer && (
              <div ref={answerRef} className="mt-4">
                <div
                  data-ocid="faq.ai_answer.panel"
                  className="rounded-xl p-4 border text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: "oklch(0.16 0.01 260)",
                    borderColor: "oklch(0.65 0.15 190 / 0.2)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.65 0.15 190 / 0.15)",
                        color: "oklch(0.75 0.15 190)",
                      }}
                    >
                      DemonZeno AI
                    </span>
                  </div>
                  {aiAnswer}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <p className="text-xs text-muted-foreground w-full mb-1">
                    Related questions:
                  </p>
                  {relatedSuggestions.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      type="button"
                      data-ocid="faq.related_question.button"
                      onClick={() => {
                        setAiQuestion(q);
                        setAiAnswer(null);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollAnimation>

        {/* Category Tabs + Search */}
        <ScrollAnimation delay={150}>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {["All", ...CATEGORY_KEYS].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-ocid="faq.category.tab"
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 text-xs px-4 py-1.5 rounded-full font-medium transition-smooth"
                  style={
                    activeCategory === cat
                      ? {
                          background: "oklch(0.65 0.15 190)",
                          color: "oklch(0.145 0.01 260)",
                        }
                      : {
                          background: "oklch(0.22 0.01 260)",
                          color: "oklch(0.65 0.01 260)",
                          border: "1px solid oklch(0.30 0.01 260)",
                        }
                  }
                >
                  {cat === "All" ? "All" : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-ocid="faq.search.input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs…"
                className="pl-9 bg-card border-border text-sm"
              />
            </div>
          </div>
        </ScrollAnimation>

        {/* FAQ List */}
        <div className="flex flex-col gap-3">
          {filteredFaqs.length === 0 ? (
            <div
              data-ocid="faq.empty_state"
              className="text-center py-10 text-muted-foreground text-sm"
            >
              {searchQuery
                ? `No results for "${searchQuery}". Try the AI above.`
                : "No FAQs in this category yet."}
            </div>
          ) : (
            filteredFaqs.map((faq, i) => (
              <ScrollAnimation key={faq.id} delay={i * 40}>
                <FaqItem faq={faq} />
              </ScrollAnimation>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
