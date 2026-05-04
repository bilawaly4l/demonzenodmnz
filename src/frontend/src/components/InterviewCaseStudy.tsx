import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InterviewQA {
  question: string;
  answer: string;
}

interface TraderInterview {
  name: string;
  initial: string;
  title: string;
  tradeName: string;
  color: string;
  interview: InterviewQA[];
  finalLesson: string;
  dzTakeaway: string;
}

interface InterviewCaseStudyProps {
  traderName?: string; // show only one trader if specified
  tierColor: string;
  compact?: boolean; // embed mode vs full modal mode
}

// ─── Interview Data ────────────────────────────────────────────────────────────

const INTERVIEWS: TraderInterview[] = [
  {
    name: "Waqar Zaka",
    initial: "WZ",
    title: "Pakistan's Crypto Visionary",
    tradeName: "Bitcoin at $200 — Teaching a Nation to Go Long",
    color: "#22c55e",
    interview: [
      {
        question:
          "What were you seeing in Bitcoin in 2013 that made you so confident?",
        answer:
          "The fundamentals were undeniable — a currency that couldn't be printed, couldn't be controlled, couldn't be stopped by any government. I wasn't a technical trader at the time. I was a believer. I saw what it represented and I knew it was early. I went on national television and said 'buy Bitcoin.' People thought I was crazy.",
      },
      {
        question:
          "How did you manage the emotional pressure of watching Bitcoin crash from $1,200 back to $150 in 2014?",
        answer:
          "That was the hardest part. I had publicly recommended it to thousands of people. The crash wasn't just about my money — it was about the trust of everyone who followed my advice. But I re-read my original thesis. Nothing had changed about the technology. The crash was fear, not fundamental failure. I held, and I publicly stayed committed because I believed in what I said.",
      },
      {
        question:
          "What was your risk management approach? Did you have a stop loss?",
        answer:
          "At that stage, there was no liquid derivatives market for Bitcoin. You couldn't easily short it or buy puts. My 'stop loss' was my conviction threshold — I asked myself: has the fundamental reason I bought changed? The answer was no. In long-term conviction investing, your stop isn't a price level, it's a thesis invalidation.",
      },
      {
        question:
          "What's the single most important lesson for a Pakistani or Asian retail trader?",
        answer:
          "Stop waiting for permission from governments, banks, or family. The financial system was built by the West for the West. Crypto removes that barrier. Your geography is no longer your destiny. But you have to educate yourself first — before you put a single rupee in. Knowledge first, capital second. Always.",
      },
      {
        question:
          "What would you tell someone who missed the early Bitcoin move and now feels it's too late?",
        answer:
          "They said it was too late at $100. They said it at $1,000. They said it at $10,000. If blockchain technology transforms finance over the next 20 years — and I believe it will — we are still early. The question is never 'did I miss it?' The question is: 'Do I understand it enough to be convicted?' If yes, act. If no, study until you do.",
      },
    ],
    finalLesson:
      "The biggest trades aren't always the most complex. Sometimes the edge is simply being willing to act on a conviction that 99% of the world isn't ready to accept yet. Waqar Zaka's greatest insight: education multiplies your impact. When you teach others to understand what you understand, you create wealth for an entire community — not just yourself.",
    dzTakeaway:
      "DemonZeno was built on this principle. Free trading education for everyone. No barriers. If one person learns to trade well and passes that knowledge to five others, the compound effect is unstoppable.",
  },
  {
    name: "Jesse Livermore",
    initial: "JL",
    title: "The Greatest Speculator of All Time",
    tradeName: "Shorting the 1929 Crash — Making $100M in One Day",
    color: "#3b82f6",
    interview: [
      {
        question: "When everyone was buying in 1929, what made you go short?",
        answer:
          "The tape was lying. Everyone was celebrating record prices — but the tape told me the big money was distributing, not accumulating. Volume was declining on new highs. The small orders were buying while the large operators were selling. You cannot fake volume. I followed the money, not the narrative.",
      },
      {
        question:
          "How did you build such a large short position without moving the market?",
        answer:
          "Patience and size management. I began building weeks before the crash — small blocks, quietly, spread across different instruments. By the time the public knew something was wrong, my position was fully established. The key is to act when you have conviction but before it becomes consensus. Consensus means you're too late.",
      },
      {
        question:
          "You made a fortune and then lost it multiple times. What was the pattern behind the losses?",
        answer:
          "Every time I violated my own rules. I averaged down on losing positions — the cardinal sin. I let hope replace analysis. I listened to tips instead of reading the tape. I knew better every time. The market punished my rule violations with mathematical precision. The rules exist because the market is unforgiving of exceptions.",
      },
      {
        question:
          "What is the most important thing a beginner must learn before touching the market?",
        answer:
          "Cut losers immediately. Not when they get 'a little worse.' Not when 'the situation clarifies.' Immediately. The moment a trade moves against you past your defined loss level, you exit. No exceptions. No hope. No averaging. Cut it. This one rule, followed consistently, will save more money than any analysis system.",
      },
    ],
    finalLesson:
      "Livermore's genius was in reading the market — but his ruin came from ignoring his own rules under emotional pressure. The lesson: a rule you follow 95% of the time is not a rule. It's a preference. A rule must be absolute. The 5% of times you violate it are exactly the times the market will charge you maximum interest.",
    dzTakeaway:
      "The DemonZeno stop loss rule is absolute. It doesn't bend. The lesson Livermore paid his fortune to learn, DemonZeno teaches for free.",
  },
  {
    name: "Paul Tudor Jones",
    initial: "PT",
    title: "Macro Trader & Hedge Fund Legend",
    tradeName: "Black Monday 1987 — 62% Return While the World Collapsed",
    color: "#a855f7",
    interview: [
      {
        question: "How did you predict the 1987 crash months in advance?",
        answer:
          "I was studying Elliott Wave analysis and saw a fractal similarity to 1929. The market had gone parabolic. Valuations were stretched. More importantly, the portfolio insurance products that had been sold to institutions contained a mathematical flaw — if markets dropped, they would automatically sell, creating a feedback loop. I mapped it out on paper and realized the system was engineered to crash itself.",
      },
      {
        question: "What was your mental state during Black Monday?",
        answer:
          "I had rehearsed it mentally a hundred times. When it happened, I was calm. Every scenario I had modeled was playing out. I was watching price action, adjusting, taking profits at planned levels. The traders who panicked that day were the ones without a plan. I had a plan for every contingency. Preparation is the only antidote to panic.",
      },
      {
        question:
          "Your famous quote: 'Play great defense.' What does that mean in practice?",
        answer:
          "It means before you ask 'how much can I make' you ask 'how much can I lose and survive?' If losing this trade would meaningfully impair my ability to trade the next opportunity, the position is too large. I protect capital above all else because capital is optionality — it gives you the right to act on the next opportunity. Without capital, you're just a spectator.",
      },
      {
        question:
          "What separates the traders who survive from those who blow up?",
        answer:
          "The survivors know what they don't know. They're humble about uncertainty. The traders who blow up are certain — and the market specializes in humiliating certainty. I've been trading for 40 years and I still approach every trade with the assumption that I could be wrong. That assumption keeps my risk management tight even when my conviction is high.",
      },
    ],
    finalLesson:
      "PTJ prepared obsessively for scenarios most traders had never considered. His 62% return during the worst market crash in history wasn't luck — it was the result of months of analysis, scenario planning, and the discipline to execute when the plan triggered. Preparation + conviction + execution.",
    dzTakeaway:
      "Every DemonZeno signal is built on the PTJ framework: asymmetric risk/reward. If the risk isn't significantly less than the potential reward, the trade doesn't exist.",
  },
  {
    name: "George Soros",
    initial: "GS",
    title: "The Man Who Broke the Bank of England",
    tradeName: "Short Pound Sterling 1992 — $1 Billion in 24 Hours",
    color: "#f59e0b",
    interview: [
      {
        question:
          "How did you identify that the Bank of England couldn't defend the pound?",
        answer:
          "It was a structural analysis. The pound had been forced into the European Exchange Rate Mechanism at an overvalued rate during a period when Germany was raising interest rates aggressively. The UK was in recession and needed lower rates. The two objectives were fundamentally incompatible. The Bank of England couldn't serve both masters simultaneously — and one had to break.",
      },
      {
        question:
          "You bet $10 billion. Most traders think in terms of thousands. How do you psychologically hold a position that large?",
        answer:
          "Size is irrelevant to decision quality. The analysis either supports the trade or it doesn't. If the analysis is right and the risk is defined, it doesn't matter if the position is $1,000 or $10 billion. What changes with size is operational risk — execution risk, market impact. But the emotional component? Irrelevant. The position size should reflect the conviction, nothing more.",
      },
      {
        question:
          "What is reflexivity, and why does it matter to a retail trader?",
        answer:
          "Markets are not efficient mirrors of reality — they are participants in creating reality. When investors believe a company will grow, capital flows to it, allowing it to grow, confirming the belief. When they believe a currency is weak, they sell it, making it weaker, confirming the belief. Understanding this feedback loop is how you identify when a consensus is about to become self-reinforcing in a particular direction.",
      },
      {
        question: "What's the most common mistake you see in other traders?",
        answer:
          "They don't know when they're wrong. They fall in love with a position. The market is telling them they're wrong through price, and they argue with it. The market is always right. You are never right when the market disagrees with you — you're just temporarily ahead of the market, and the patience required to stay ahead is very expensive in terms of capital at risk.",
      },
    ],
    finalLesson:
      "Soros operates in a realm most traders never access: understanding the macro narrative so deeply that you can identify when the crowd is systematically wrong at scale. This kind of conviction-based macro analysis requires years of study. But the retail takeaway is simpler: identify when the system has a flaw, and position accordingly — even if the consensus disagrees.",
    dzTakeaway:
      "At the DemonZeno Master tier, we study reflexivity — how market beliefs create the reality they're predicting. This is the highest level of trading intelligence.",
  },
  {
    name: "Stanley Druckenmiller",
    initial: "SD",
    title: "30+ Years, Never a Losing Year",
    tradeName: "German Reunification 1989–90 — Multi-Asset Macro Masterclass",
    color: "#ec4899",
    interview: [
      {
        question:
          "You managed 30+ years without a single losing year. What's the real secret?",
        answer:
          "I never think about what I'm going to make. I only think about what I could lose and how to prevent it from being more than I can absorb. When you obsess about preservation, the gains take care of themselves. The traders who focus on making money consistently take too much risk. The traders who focus on not losing money consistently find the risk/reward tilts toward them.",
      },
      {
        question: "You concentrated your positions heavily. Why not diversify?",
        answer:
          "Diversification is how you protect against not knowing what you're doing. If I'm going to put money somewhere, I need to know exactly why it's going there and what would make me wrong. If I can't answer those questions, I shouldn't own it. If I can answer them with high conviction, why would I dilute my position with ideas I'm less convicted about? Diversification trades away return for false comfort.",
      },
      {
        question:
          "How do you time entries with such precision across multiple asset classes?",
        answer:
          "Value tells me WHAT to buy. Price tells me WHEN. I never use fundamental value as a timing tool — never. I wait for the trend to confirm my thesis. If I think German stocks are undervalued but the trend is down, I wait. When the trend turns, I act. The confluence of fundamental conviction AND a positive price trend is the highest-quality entry condition that exists.",
      },
      {
        question:
          "What advice would you give to someone just starting to trade seriously?",
        answer:
          "Learn macro first. Understand how currencies, interest rates, commodities, and equities interact as a system. Read history — every market condition you'll ever face has precedent. Then find your best two or three setups and master them before expanding. Be a specialist before you try to be a generalist. The best traders I know are extraordinary specialists who understand the macro context their specialty operates in.",
      },
    ],
    finalLesson:
      "Druckenmiller's record is built on three pillars: obsessive risk management, deep macro conviction, and trend-confirmation timing. He never acts purely on value. He never acts purely on technical timing. He acts when fundamental conviction and price trend align — and then he acts big. This synthesis is the master-level trading framework.",
    dzTakeaway:
      "DemonZeno Academy builds toward the Druckenmiller framework at the Master tier: macro understanding + technical precision + conviction-based sizing. No losing years is the goal. Systematic, patient, compound growth.",
  },
];

// ─── Single Interview Card ────────────────────────────────────────────────────

function InterviewCard({
  trader,
  tierColor,
}: { trader: TraderInterview; tierColor: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQ, setActiveQ] = useState<number | null>(0);

  return (
    <>
      <button
        type="button"
        data-ocid={`interview.${trader.name.toLowerCase().replace(/\s+/g, "_")}.open_modal_button`}
        onClick={() => setIsOpen(true)}
        className="w-full text-left rounded-2xl p-4 transition-smooth hover:shadow-lg"
        style={{
          background: "oklch(0.17 0.01 260)",
          border: `1px solid ${trader.color}30`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-sm shrink-0"
            style={{
              background: `${trader.color}20`,
              color: trader.color,
              border: `2px solid ${trader.color}40`,
            }}
          >
            {trader.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-bold text-sm text-foreground">
                {trader.name}
              </p>
              <MessageSquare
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: trader.color }}
              />
            </div>
            <p className="text-xs font-medium" style={{ color: trader.color }}>
              {trader.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {trader.tradeName}
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: `${trader.color}15`, color: trader.color }}
          >
            Read Interview
          </span>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          role="presentation"
        >
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.14 0.01 260)",
              border: `1px solid ${trader.color}40`,
            }}
            data-ocid={`interview.${trader.name.toLowerCase().replace(/\s+/g, "_")}.dialog`}
          >
            {/* Modal Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{
                background: `${trader.color}10`,
                borderBottom: `1px solid ${trader.color}25`,
              }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black shrink-0"
                style={{ background: `${trader.color}20`, color: trader.color }}
              >
                {trader.initial}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base text-foreground">
                  {trader.name}
                </h3>
                <p className="text-xs" style={{ color: trader.color }}>
                  {trader.tradeName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                data-ocid={`interview.${trader.name.toLowerCase().replace(/\s+/g, "_")}.close_button`}
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: "oklch(0.55 0.01 260)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Q&A Navigator */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {trader.interview.map((_, i) => (
                  <button
                    key={`q-tab-${trader.name}-${i}`}
                    type="button"
                    onClick={() => setActiveQ(i)}
                    data-ocid={`interview.question_tab.${i + 1}`}
                    className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-smooth"
                    style={
                      activeQ === i
                        ? {
                            background: trader.color,
                            color: "oklch(0.10 0.01 260)",
                          }
                        : {
                            background: "oklch(0.22 0.01 260)",
                            color: "oklch(0.55 0.01 260)",
                            border: "1px solid oklch(0.30 0.01 260)",
                          }
                    }
                  >
                    Q{i + 1}
                  </button>
                ))}
              </div>

              {/* Active Q&A */}
              {activeQ !== null && trader.interview[activeQ] && (
                <div className="space-y-3">
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: `${trader.color}08`,
                      border: `1px solid ${trader.color}20`,
                    }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: trader.color }}
                    >
                      Question
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-relaxed">
                      {trader.interview[activeQ]!.question}
                    </p>
                  </div>
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "oklch(0.18 0.01 260)",
                      border: "1px solid oklch(0.26 0.01 260)",
                    }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: trader.color }}
                    >
                      {trader.name} Answers
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{trader.interview[activeQ]!.answer}&rdquo;
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end">
                    {activeQ > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveQ((p) => (p ?? 1) - 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth"
                        style={{
                          background: "oklch(0.22 0.01 260)",
                          color: "oklch(0.60 0.01 260)",
                          border: "1px solid oklch(0.30 0.01 260)",
                        }}
                      >
                        ← Previous
                      </button>
                    )}
                    {activeQ < trader.interview.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setActiveQ((p) => (p ?? 0) + 1)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth"
                        style={{
                          background: `${trader.color}20`,
                          color: trader.color,
                          border: `1px solid ${trader.color}40`,
                        }}
                      >
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Final Lesson */}
              <div
                className="rounded-xl p-4"
                style={{
                  background: "oklch(0.16 0.02 260)",
                  border: `1px solid ${trader.color}25`,
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: trader.color }}
                >
                  The Final Lesson
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {trader.finalLesson}
                </p>
              </div>

              {/* DZ Takeaway */}
              <div
                className="rounded-xl p-4 flex gap-3"
                style={{
                  background: `${tierColor}08`,
                  border: `1px solid ${tierColor}25`,
                }}
              >
                <span className="text-lg shrink-0">😈</span>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: tierColor }}
                  >
                    DemonZeno Takeaway
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {trader.dzTakeaway}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function InterviewCaseStudy({
  traderName,
  tierColor,
  compact = false,
}: InterviewCaseStudyProps) {
  const traders = traderName
    ? INTERVIEWS.filter(
        (t) => t.name.toLowerCase() === traderName.toLowerCase(),
      )
    : INTERVIEWS;

  if (traders.length === 0) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.15 0.01 260)",
        border: `1px solid ${tierColor}25`,
      }}
      data-ocid="interview_case_study.section"
    >
      {/* Section Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: `${tierColor}08`,
          borderBottom: `1px solid ${tierColor}20`,
        }}
      >
        <MessageSquare
          className="w-5 h-5 shrink-0"
          style={{ color: tierColor }}
        />
        <div>
          <h3 className="font-display font-bold text-sm text-foreground">
            {traderName
              ? `${traderName} — Interview`
              : "Legend Interviews — Inside the Mind of the Masters"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {compact
              ? "Simulated interview"
              : `${traders.length} in-depth interviews · Click any card to read`}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {traders.map((trader) => (
          <InterviewCard
            key={trader.name}
            trader={trader}
            tierColor={tierColor}
          />
        ))}
      </div>
    </div>
  );
}

export { INTERVIEWS };
export type { TraderInterview };
