import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { SiBinance } from "react-icons/si";
import { useScrollAnimations } from "../components/Layout";

const TRAITS = [
  {
    label: "PUBLIC IDENTITY",
    body: "DemonZeno is not anonymous. The Binance Square handle @Demon_Zeno has a documented post history. This is rare in meme coin culture — and it creates real accountability.",
  },
  {
    label: "ANTI-RUG BY DESIGN",
    body: "No pre-allocated team tokens means there is nothing to dump. DemonZeno cannot rug DMNZ because there are no insider holdings to sell. The only DMNZ DemonZeno owns is bought at market price, same as everyone else.",
  },
  {
    label: "COMMUNITY FIRST",
    body: "DMNZ was not built for DemonZeno to get rich. It was built to prove that a meme token can launch fairly — and to give the community something to rally around that actually has principles behind it.",
  },
  {
    label: "LONG-TERM THINKING",
    body: "Most meme coin creators vanish after launch. DemonZeno planned a burn event 9 months after launch — on January 1, 2028. That kind of commitment is rare. It shows a longer-term vision than a quick exit.",
  },
  {
    label: "BUILT BEFORE THE LAUNCH",
    body: "This website, the whitepaper, the roadmap, the community — all exist before a single DMNZ token was sold. That is not what a scam looks like. That is what a real project looks like.",
  },
];

const PLEDGE = [
  "DemonZeno will NOT sell team tokens — there are none.",
  "DemonZeno will NOT create a presale or allow early insider access.",
  "DemonZeno will NOT disappear after launch.",
  "DemonZeno WILL execute the January 2028 burn publicly and on-chain.",
  "DemonZeno WILL keep the community updated on Binance Square.",
  "DemonZeno WILL be honest about what DMNZ is and what it is not.",
];

export function WhyDemonZeno() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Why DemonZeno? — DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="why_demonzeno.page"
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
            <span className="label-uppercase text-crimson">The Creator</span>
            <h1 className="heading-xl mt-3 mb-5">WHY DEMONZENO?</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Who is DemonZeno, why he created DMNZ, and why he is different
              from every other meme coin creator.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div
          className="scroll-anim mb-12"
          style={{
            padding: "2rem",
            background: "var(--card)",
            border: "1px solid var(--border-accent)",
            borderRadius: "4px",
          }}
        >
          <p
            className="text-base italic leading-relaxed mb-4"
            style={{ color: "var(--foreground)" }}
          >
            &ldquo;I created DMNZ because I was tired of watching people get
            rugged by anonymous devs who disappeared the moment they had enough
            money. DMNZ is my answer to that. My name is on it. My face is on
            it. My reputation is on it. That changes everything.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 text-sm font-bold"
              style={{ color: "var(--primary)" }}
            >
              <SiBinance className="w-4 h-4" />
              @Demon_Zeno
            </div>
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              on Binance Square
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-12">
          {TRAITS.map((trait, i) => (
            <div
              key={trait.label}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)", letterSpacing: "0.14em" }}
              >
                {trait.label}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {trait.body}
              </p>
            </div>
          ))}
        </div>

        <div
          className="scroll-anim"
          style={{
            padding: "1.5rem",
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: "4px",
          }}
        >
          <h2
            className="text-sm font-bold uppercase tracking-widest mb-5"
            style={{ color: "var(--gold)", letterSpacing: "0.14em" }}
          >
            DEMONZENO&apos;S PUBLIC COMMITMENT
          </h2>
          <ul className="flex flex-col gap-3">
            {PLEDGE.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "var(--gold)" }}
                />
                {item}
              </li>
            ))}
          </ul>
          <p
            className="mt-5 text-xs font-mono text-right"
            style={{ color: "var(--muted-foreground)" }}
          >
            — DemonZeno, @Demon_Zeno on Binance Square
          </p>
        </div>
      </div>
    </div>
  );
}
