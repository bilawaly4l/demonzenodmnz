import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

const SECTIONS = [
  {
    title: "NOT FINANCIAL ADVICE",
    body: "Nothing on this website, on DemonZeno's Binance Square profile (@Demon_Zeno), on Twitter (@ZenoDemon), or in any DMNZ-affiliated community constitutes financial advice, investment advice, trading advice, or any other type of advice. All content is for informational and entertainment purposes only.",
  },
  {
    title: "NO GUARANTEES",
    body: "DemonZeno and the DMNZ project make no guarantees regarding the value, performance, or continued existence of the DMNZ token. Meme tokens are highly speculative. You may lose all of the money you invest.",
  },
  {
    title: "MEME COIN NATURE",
    body: "DMNZ is explicitly a meme coin. It has no intrinsic utility, no backing assets, and no guaranteed value. Its value — if any — is derived entirely from community participation and sentiment. It should be treated as entertainment, not investment.",
  },
  {
    title: "NO REGULATORY APPROVAL",
    body: "DMNZ has not been registered with, approved by, or reviewed by any financial regulatory authority. Participation in DMNZ may be restricted in your jurisdiction. It is your responsibility to ensure that buying, holding, or trading DMNZ is legal in your country.",
  },
  {
    title: "RISK OF LOSS",
    body: "Cryptocurrency markets are highly volatile. The value of DMNZ can drop to zero at any time. DemonZeno, the project creator, bears no liability for any financial losses incurred by individuals who purchase, hold, or trade DMNZ.",
  },
  {
    title: "BLUM PLATFORM RISKS",
    body: "DMNZ launches on the Blum Mini App on Telegram. Any risks associated with the Blum platform, Telegram, or their respective policies are outside of DemonZeno's control. DemonZeno is not affiliated with Blum or Telegram.",
  },
  {
    title: "INDEPENDENT RESEARCH",
    body: "Before participating in any cryptocurrency project, including DMNZ, you should conduct independent research and consult a qualified financial advisor. DemonZeno strongly encourages all potential participants to understand what they are buying before they buy it.",
  },
];

export function LegalDisclaimer() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Legal Disclaimer — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="legal_disclaimer.page"
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
              <AlertTriangle
                className="w-4 h-4"
                style={{ color: "var(--primary)" }}
              />
              <span className="label-uppercase text-crimson">Important</span>
            </div>
            <h1 className="heading-xl mt-2 mb-5">LEGAL DISCLAIMER</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Read this. We mean it. DMNZ is a meme coin — not financial advice,
              not an investment, not a regulated product.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div
          className="scroll-anim mb-10"
          style={{
            padding: "1.5rem",
            background: "rgba(220,20,60,0.08)",
            border: "1px solid rgba(220,20,60,0.3)",
            borderRadius: "4px",
          }}
        >
          <p
            className="text-base font-bold uppercase tracking-wide text-center"
            style={{ color: "var(--primary)", letterSpacing: "0.1em" }}
          >
            DMNZ IS A MEME COIN — NOT FINANCIAL ADVICE
          </p>
          <p
            className="text-sm mt-3 text-center leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Participation in DMNZ is at your own risk. Do not invest more than
            you can afford to lose entirely.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {SECTIONS.map((sec, i) => (
            <div
              key={sec.title}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--foreground)", letterSpacing: "0.14em" }}
              >
                {sec.title}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {sec.body}
              </p>
            </div>
          ))}
        </div>

        <div
          className="scroll-anim mt-10 text-center"
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-xs font-mono" style={{ color: "#555555" }}>
            Last reviewed: May 2026 · Version 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
