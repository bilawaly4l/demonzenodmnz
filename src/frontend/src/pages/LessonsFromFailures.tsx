import { Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

type Case = {
  project: string;
  year: string;
  failure: string;
  lesson: string;
  dmnzAnswer: string;
};

const CASES: Case[] = [
  {
    project: "SQUID GAME TOKEN (SQUID)",
    year: "2021",
    failure:
      "Classic rug pull. Devs sold all holdings immediately after launch, draining all liquidity. Price went from $0.01 to $2,861 to zero in minutes.",
    lesson:
      "No verified identity behind the project. No commitment to the community. A public creator with a real reputation cannot do this — their identity is the lock.",
    dmnzAnswer:
      "DemonZeno is publicly known. His Binance Square profile has a documented history. He cannot rug without destroying his own public identity.",
  },
  {
    project: "SAFEMOON (SFM)",
    year: "2021–2022",
    failure:
      "Massive marketing, celebrity endorsements, and promises of revolutionary tokenomics. Founders secretly minted extra tokens and drained liquidity pools. Price collapsed 98%.",
    lesson:
      "Tokenomics complexity hides manipulation. The more complex the buy/sell tax system, the more places for devs to extract value silently.",
    dmnzAnswer:
      "DMNZ has no tokenomics. No taxes, no reflection rewards, no complex mechanisms. Simple token. Simple rules. Nothing to hide behind.",
  },
  {
    project: "LUNA / TERRA (LUNA)",
    year: "2022",
    failure:
      "Algorithmic stablecoin model collapsed. $60B wiped in 72 hours. Promised yields that could not be sustained. Model was mathematically fragile under selling pressure.",
    lesson:
      "Unsustainable APY promises and over-engineered economics create fragile systems that collapse under real market conditions.",
    dmnzAnswer:
      "DMNZ promises nothing. No APY. No yield. No algorithmic stability. Just a meme token with fair launch rules and a burn event.",
  },
  {
    project: "RUG PULL PATTERN (Generic)",
    year: "2020–Present",
    failure:
      "Developers create token, artificially inflate price through early buys, generate hype, then dump entire holdings on retail buyers who arrive during the hype. Community loses everything.",
    lesson:
      "Presales and team allocations are the mechanism. If developers hold large pre-allocated amounts, they always have the ability and often the incentive to sell at retail buyers' expense.",
    dmnzAnswer:
      "No presale. No team allocation. DemonZeno does not hold pre-allocated DMNZ. The mechanism for this pattern simply does not exist with DMNZ.",
  },
  {
    project: "FOMO-PUMPED TOKENS (Generic)",
    year: "Ongoing",
    failure:
      "Projects launch with aggressive social media campaigns promising guaranteed returns. Retail buyers buy the hype peak. Early wallets sell. Price crashes 80–95%.",
    lesson:
      "Guaranteed returns are a red flag. Any project promising guaranteed gains is either lying or about to rug.",
    dmnzAnswer:
      "DemonZeno explicitly states: no guarantees. DMNZ may go to zero. This honesty is intentional — it filters out people looking for a get-rich-quick scheme.",
  },
];

export function LessonsFromFailures() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Lessons from Failed Meme Coins — DemonZeno";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="lessons_failures.page"
    >
      <div
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container mx-auto px-4 py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 transition-smooth"
            style={{
              color: "var(--muted-foreground)",
              letterSpacing: "0.14em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--muted-foreground)";
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <div className="scroll-anim">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown
                className="w-4 h-4"
                style={{ color: "var(--primary)" }}
              />
              <span className="label-uppercase text-crimson">
                What Went Wrong
              </span>
            </div>
            <h1 className="heading-xl mt-2 mb-5">
              LESSONS FROM FAILED MEME COINS
            </h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              What went wrong elsewhere and exactly how DMNZ avoids those same
              mistakes — with evidence, not promises.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex flex-col gap-8">
          {CASES.map((c, i) => (
            <div
              key={c.project}
              className="scroll-anim"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--border)",
                  background: "rgba(220,20,60,0.04)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3
                    className="text-sm font-bold uppercase tracking-widest"
                    style={{
                      color: "var(--foreground)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {c.project}
                  </h3>
                  <span
                    className="text-xs font-mono flex-shrink-0"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {c.year}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "var(--primary)", letterSpacing: "0.12em" }}
                  >
                    WHAT HAPPENED
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {c.failure}
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: "var(--gold)", letterSpacing: "0.12em" }}
                  >
                    THE LESSON
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {c.lesson}
                  </p>
                </div>
                <div
                  style={{
                    padding: "0.875rem",
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.15)",
                    borderRadius: "2px",
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "#22c55e", letterSpacing: "0.12em" }}
                  >
                    HOW DMNZ IS DIFFERENT
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {c.dmnzAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
