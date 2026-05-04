import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MindsetLesson {
  id: string;
  title: string;
  icon: string;
  whyItMatters: string;
  content: string[];
  realExample: string;
  dzQuote: string;
  takeaways: string[];
}

interface TraderMindsetModuleProps {
  tierColor: string;
}

// ─── Mindset Lessons Data ─────────────────────────────────────────────────────

const MINDSET_LESSONS: MindsetLesson[] = [
  {
    id: "why-traders-lose",
    title: "Why Most Traders Lose",
    icon: "💸",
    whyItMatters:
      "Studies show 80–90% of retail traders lose money. Understanding the real reasons behind this statistic is the first step to being in the 10% that doesn't.",
    content: [
      "Most traders don't lose because of bad strategy — they lose because of bad psychology. A tested, profitable strategy can be completely destroyed by the emotional layer on top of it.",
      "The three core psychological killers: (1) Undisciplined exits — traders can't hold winners long enough and can't cut losers fast enough. They're emotionally inverse to what works. (2) Overtrading — boredom, excitement, or the need to 'recover' losses drives traders to take subpar setups that destroy their edge. (3) Inconsistency — they follow their system when it's winning and abandon it after a few losses, always right when the losing streak was about to end.",
      "The key insight: Most retail traders have a good enough strategy. What they lack is the psychological infrastructure to execute it consistently. The strategy is the easy part — the mental game is where the battle is won or lost.",
      "Professional traders treat trading like a business. They have written rules, they track every trade, they review performance systematically. Emotion is managed like risk — with rules, not willpower.",
    ],
    realExample:
      "In 2022, a study of 10,000 retail crypto traders found that the top 5% most profitable traders all shared one trait: they had a defined system and deviated from it less than 10% of the time. The bottom 50% had no written plan and made trading decisions in real-time based on emotion and social media influence.",
    dzQuote:
      "The market doesn't care about your feelings. It doesn't reward your hopes or punish your fears. It only responds to positions and price. Trade like a machine — think like a human only when you're not touching the chart.",
    takeaways: [
      "Most traders lose due to psychology, not bad strategy",
      "The three killers: bad exits, overtrading, inconsistency",
      "Emotional trading always loses to systematic trading long-term",
      "Track every trade — you can't fix what you can't see",
      "Treat trading as a business, not a casino",
    ],
  },
  {
    id: "conquering-fomo",
    title: "Conquering FOMO",
    icon: "🚀",
    whyItMatters:
      "FOMO — Fear Of Missing Out — is the most expensive emotion in trading. It drives traders to enter late, overpay, and hold losing positions hoping for recovery. Understanding it makes you immune to it.",
    content: [
      "FOMO is a biological response. When you watch an asset pump 30% and your human brain says 'I'm missing out on money,' the same neural circuits that fire for social exclusion activate. The pain of missing a trade feels like real social rejection — which is why it's so hard to ignore.",
      "How FOMO manifests in trading: Chasing price — entering after a significant move when the easy money has already been made. Removing stop losses — 'it'll come back' after the trade moves against you. Entering without a plan — the setup doesn't meet your criteria, but you enter anyway because it looks like it's going to 'moon.'",
      "The FOMO antidote: There is ALWAYS another trade. Markets never stop giving opportunities. The trader who missed the perfect setup last week will find another perfect setup this week. The one who chased a missed setup entered a losing position. FOMO costs you money. Patience makes you money.",
      "The professional mindset: 'I don't trade what I missed. I trade what's next.' Write this down. Every trade that you 'missed' would have been entered late, with a tight stop, and wrong psychology. A missed trade is always better than a bad trade. The market rewards patience, not speed.",
    ],
    realExample:
      "Bitcoin pumped from $25,000 to $38,000 in 3 days in October 2023. Millions of FOMO buyers entered between $35,000–$38,000. Price then consolidated back to $32,000. Those who entered out of FOMO were underwater immediately. Those who waited for the retest of $32,000 entered at a 15% discount with a high-probability setup.",
    dzQuote:
      "Every missed trade is a lesson you paid nothing for. Every FOMO trade is a lesson that charges you money. The market is always open. Your edge is in patience. I don't chase. I position and wait.",
    takeaways: [
      "FOMO is biological — understand it to neutralize it",
      "There is ALWAYS another trade — you never miss the last one",
      "Late entries have worse risk/reward than waiting for the next setup",
      "'I don't trade what I missed — I trade what's next'",
      "Patience is a tradeable edge, not just a virtue",
    ],
  },
  {
    id: "revenge-trading",
    title: "Breaking the Revenge Trade Cycle",
    icon: "⚡",
    whyItMatters:
      "Revenge trading is the single fastest way to blow a trading account. A 2% loss becomes a 20% loss when anger hijacks your decision-making. Understanding the cycle is the only way to stop it.",
    content: [
      "Revenge trading is the impulse to immediately re-enter the market after a loss to 'win it back.' It is driven by ego — the refusal to accept that the market was right and you were wrong. Ego in trading is your most expensive liability.",
      "The revenge cycle: Loss → Anger/shame → Compulsive re-entry → Bigger position to 'recover faster' → Less analysis (emotional brain overrides analytical brain) → Usually a bigger loss → More anger → Bigger revenge attempt → Account blown.",
      "The neurological reality: After a loss, cortisol and adrenaline flood your system. Your prefrontal cortex (rational thinking) partially shuts down. The emotional parts of your brain take over. A trader in this state is making decisions from a brain that's physiologically compromised — identical to making decisions while mildly intoxicated.",
      "The circuit breaker: After any loss, especially an unexpected or large one, you must stop trading for the day. Mandatory. Not optional. Walk away. This is not weakness — it's professional risk management of your most important asset: your decision-making quality. The market will be there tomorrow. Your capital is finite.",
    ],
    realExample:
      "Waqar Zaka has spoken about watching his students take their worst trades immediately after losses. In one documented case, a student lost $300 on a bad trade, then immediately placed three more trades without analysis, losing $1,200 in total. The initial $300 loss had a defined stop — the additional $1,200 was pure revenge and had no plan. Zaka's rule: 'If you can't accept the first loss calmly, you will pay for it triple.'",
    dzQuote:
      "The market doesn't owe you a recovery. When you lose, the account is wrong, not the market. Close the platform. Walk away. Tomorrow you're a professional again. Today you're a gambler if you stay.",
    takeaways: [
      "After any significant loss: stop for the day — mandatory, not optional",
      "Revenge trading escalates: small losses become account disasters",
      "Losses impair rational thinking neurologically — you need recovery time",
      "The market doesn't owe you a recovery — it owes you nothing",
      "Pre-define your maximum daily loss before every session",
    ],
  },
  {
    id: "iron-discipline",
    title: "Building Iron Discipline",
    icon: "🔱",
    whyItMatters:
      "Discipline is not a personality trait — it's a system. The right systems create automatic discipline without relying on willpower. You build a discipline system exactly the way you build a trading system.",
    content: [
      "Willpower is a finite resource. Relying on willpower to follow your trading rules is like relying on willpower to avoid eating cake when it's sitting in front of you. The solution isn't more willpower — it's designing your environment and systems so you never need to rely on it.",
      "The discipline architecture: Written rules (if you haven't written it, it doesn't exist). Pre-session ritual (puts you in the correct mental state before touching the market). Maximum loss rule (if you hit it, the trading day is over — no exceptions — this should be automated if your platform supports it). Post-session review (closes the feedback loop that builds discipline over time).",
      "The 'trade ticket' practice: Before entering any trade, write the thesis on a physical notepad: Asset, Direction, Entry, SL, TP1/2/3, and one sentence explaining WHY. If you can't complete the notepad entry clearly, don't execute. This 60-second practice eliminates 90% of impulsive entries because impulse cannot withstand the simple act of writing.",
      "Progress not perfection: Nobody trades perfectly. The goal is incremental improvement. If you deviated from your plan today, identify the exact moment of deviation and write one sentence about what you'll do differently tomorrow. This specific, small-action approach builds genuine discipline without the unrealistic expectation of instant perfection.",
    ],
    realExample:
      "Jesse Livermore, the greatest speculator in history, made and lost multiple fortunes over his career. His losses always came from violating his own rules — specifically averaging down on losing positions. He knew his rules. He knew violating them cost him fortunes. Yet he violated them repeatedly when under emotional pressure. The lesson: even genius doesn't overcome poor systems. Systems beat willpower every time.",
    dzQuote:
      "I don't trade on gut. I trade on rules. Gut is what loses money. Rules are what compounds it. Build your trading rules when your mind is calm — then follow them when your emotions are screaming.",
    takeaways: [
      "Discipline is a system, not a personality trait — build the right systems",
      "Write your rules — if it's not written, it doesn't count as a rule",
      "The 'trade ticket' practice eliminates 90% of impulsive entries",
      "Pre-define maximum daily loss before every session",
      "Progress over perfection — review deviations and improve incrementally",
    ],
  },
  {
    id: "demonzeno-mindset",
    title: "The DemonZeno Mindset",
    icon: "😈",
    whyItMatters:
      "The DemonZeno mindset is the synthesis of everything in this module: the psychological operating system of a trader who survives, compounds, and eventually masters the market. Control is the edge.",
    content: [
      "Control is the edge. Not prediction. Not luck. Not speed. The traders who win long-term are not those who are right the most — they're those who control their losses the most. You can have a 45% win rate and be consistently profitable if your winners are 3× your losers. You cannot be consistently profitable with a 70% win rate if your losers are 4× your winners. Control of loss is everything.",
      "The DemonZeno operating principles: (1) Process over outcome — judge every trade on whether you followed your plan, not whether it was profitable. A bad trade that made money is worse feedback than a good trade that lost money. Rewarding process builds consistency. Rewarding outcomes builds luck-dependence. (2) Zero attachment to positions — once in a trade, you're an executor, not an investor. Your opinion of whether the trade 'should' work is irrelevant. The market's opinion is the only one that pays.",
      "The mindset before every session: 'I am not in the market to prove anything. I am not here to win back what I lost. I am not here to get rich today. I am here to execute my plan with precision, protect my capital, and extract available edge from the market when it appears.' Read this before every session for 30 days. It will reprogram how you trade.",
      "Long-term identity: You are building a skill, not chasing a result. The best traders are students for life — permanently curious, permanently humble about the market's ability to surprise. DemonZeno Academy is not a shortcut to wealth. It is the foundation of a craft. Respect the craft, and the craft will respect your capital.",
    ],
    realExample:
      "Stanley Druckenmiller, who ran $30+ years without a losing year, was asked what his secret was. His answer: 'I never think about what I'm going to make — only about what I could lose and how to prevent losing more than that.' This is the DemonZeno mindset distilled to one sentence. The edge is always on the defensive side of the trade.",
    dzQuote:
      "Control is the edge. Not brilliance, not speed, not luck. The trader who controls their losses controls their future. Everything else — the patterns, the indicators, the signals — these are tools. Control is the foundation they stand on.",
    takeaways: [
      "Control of loss is more important than maximizing wins",
      "Judge trades on process quality, not profit/loss outcome",
      "Zero attachment to positions — you are an executor, not an investor",
      "'I am here to execute my plan — not to prove, recover, or get rich today'",
      "The DemonZeno edge: control, process, patience, and permanent student mindset",
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function TraderMindsetModule({ tierColor }: TraderMindsetModuleProps) {
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.15 0.01 260)",
        border: `1px solid ${tierColor}30`,
      }}
      data-ocid="mindset_module.section"
    >
      {/* Module Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: `${tierColor}10`,
          borderBottom: `1px solid ${tierColor}25`,
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${tierColor}20`, color: tierColor }}
        >
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-base text-foreground">
            Trader Mindset Module
          </h3>
          <p className="text-xs text-muted-foreground">
            5 psychology lessons · The mental edge that separates winners from
            losers
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Intro Banner */}
        <div
          className="rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed"
          style={{
            background: "oklch(0.18 0.01 260)",
            border: "1px solid oklch(0.26 0.01 260)",
          }}
        >
          <span className="font-bold" style={{ color: tierColor }}>
            Why this module matters:{" "}
          </span>
          Trading is 30% technical skill and 70% psychological discipline. You
          can have the best strategy in the world and still blow your account if
          you don't master your mind. These 5 lessons cover the psychological
          edge that the top 10% of traders have — and the bottom 90% don't.
        </div>

        {/* Lesson Cards */}
        {MINDSET_LESSONS.map((lesson, i) => (
          <div
            key={lesson.id}
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: "oklch(0.18 0.01 260)",
              border:
                openLesson === lesson.id
                  ? `1px solid ${tierColor}50`
                  : "1px solid oklch(0.26 0.01 260)",
            }}
            data-ocid={`mindset_module.lesson.${i + 1}`}
          >
            {/* Lesson Header */}
            <button
              type="button"
              className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
              onClick={() =>
                setOpenLesson(openLesson === lesson.id ? null : lesson.id)
              }
              data-ocid={`mindset_module.lesson_toggle.${i + 1}`}
            >
              <span className="text-xl shrink-0">{lesson.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${tierColor}15`, color: tierColor }}
                  >
                    Lesson {i + 1}
                  </span>
                  <p className="font-display font-bold text-sm text-foreground truncate">
                    {lesson.title}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {lesson.whyItMatters}
                </p>
              </div>
              <div className="shrink-0 ml-2" style={{ color: tierColor }}>
                {openLesson === lesson.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Lesson Content */}
            {openLesson === lesson.id && (
              <div
                className="px-4 pb-5 space-y-4"
                style={{ borderTop: `1px solid ${tierColor}20` }}
              >
                {/* Why It Matters */}
                <div
                  className="mt-4 rounded-lg px-3 py-2.5"
                  style={{
                    background: `${tierColor}08`,
                    border: `1px solid ${tierColor}20`,
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: tierColor }}
                  >
                    Why This Matters
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lesson.whyItMatters}
                  </p>
                </div>

                {/* Content paragraphs */}
                <div className="space-y-3">
                  {lesson.content.map((para, _pi) => (
                    <p
                      key={para.slice(0, 30)}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                {/* Real Example */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: "oklch(0.16 0.02 260)",
                    border: `1px solid ${tierColor}25`,
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: tierColor }}
                  >
                    📖 Real Example
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {lesson.realExample}
                  </p>
                </div>

                {/* DemonZeno Quote */}
                <blockquote
                  className="rounded-xl p-4 relative"
                  style={{
                    background: "oklch(0.13 0.01 260)",
                    borderLeft: `3px solid ${tierColor}`,
                  }}
                >
                  <span
                    className="text-3xl font-serif leading-none absolute -top-1 left-3 opacity-20"
                    style={{ color: tierColor }}
                  >
                    &ldquo;
                  </span>
                  <p
                    className="text-sm italic leading-relaxed pl-4"
                    style={{ color: "oklch(0.75 0.03 260)" }}
                  >
                    {lesson.dzQuote}
                  </p>
                  <p
                    className="text-xs font-bold mt-2 pl-4"
                    style={{ color: tierColor }}
                  >
                    — DemonZeno
                  </p>
                </blockquote>

                {/* Key Takeaways */}
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: tierColor }}
                  >
                    Key Takeaways
                  </p>
                  <ul className="space-y-1.5">
                    {lesson.takeaways.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span
                          className="text-xs mt-0.5 shrink-0"
                          style={{ color: tierColor }}
                        >
                          ▸
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Module Footer */}
        <div
          className="rounded-xl px-4 py-3 text-center"
          style={{
            background: `${tierColor}08`,
            border: `1px solid ${tierColor}20`,
          }}
        >
          <p className="text-xs italic" style={{ color: tierColor }}>
            &ldquo;Control is the edge. Build it deliberately — one session at a
            time.&rdquo; — DemonZeno
          </p>
        </div>
      </div>
    </div>
  );
}
