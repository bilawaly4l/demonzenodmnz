import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

type Risk = { title: string; severity: string; body: string };

const RISKS: Risk[] = [
  {
    title: "TOTAL LOSS OF CAPITAL",
    severity: "CRITICAL",
    body: "The value of DMNZ can go to zero. This is not a theoretical risk — it is a common outcome for meme tokens. Do not invest money you cannot afford to lose entirely. DMNZ is not a savings vehicle.",
  },
  {
    title: "HIGH PRICE VOLATILITY",
    severity: "HIGH",
    body: "Meme token prices can move 50–90% in either direction within hours. The DMNZ price is determined by the Blum bonding curve and community sentiment — both of which are highly unpredictable.",
  },
  {
    title: "LIQUIDITY RISK",
    severity: "HIGH",
    body: "At launch, DMNZ may have limited liquidity. This means you may not be able to sell your DMNZ at the price you want, or at all, if demand drops significantly.",
  },
  {
    title: "BONDING CURVE MECHANICS",
    severity: "MEDIUM",
    body: "Blum's bonding curve means price increases as more tokens are bought and decreases as they are sold. Early buyers benefit if demand grows, but suffer the largest losses if demand collapses quickly.",
  },
  {
    title: "REGULATORY RISK",
    severity: "MEDIUM",
    body: "Cryptocurrency regulation varies by country and is evolving rapidly. Participation in DMNZ may become restricted or illegal in your jurisdiction without warning. Check your local laws.",
  },
  {
    title: "PLATFORM DEPENDENCY RISK",
    severity: "MEDIUM",
    body: "DMNZ exists on the Blum platform. If Blum changes its terms of service, shuts down, or removes DMNZ, the token's accessibility and value could be severely impacted. DemonZeno has no control over Blum's decisions.",
  },
  {
    title: "COMMUNITY SENTIMENT RISK",
    severity: "MEDIUM",
    body: "Meme token value depends heavily on community sentiment. Negative news, FUD, or loss of interest can cause rapid and severe price decline regardless of the project's fundamentals.",
  },
  {
    title: "BURN EVENT RISK",
    severity: "LOW",
    body: "The January 2028 burn event is planned and committed to publicly. However, external factors (platform availability, technical issues) could delay or alter the mechanics. DemonZeno will communicate transparently if this happens.",
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "var(--primary)",
  HIGH: "#f97316",
  MEDIUM: "var(--gold)",
  LOW: "#22c55e",
};

export function RiskDisclosure() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Risk Disclosure — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="risk_disclosure.page"
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
              <span className="label-uppercase text-crimson">
                Read Before Buying
              </span>
            </div>
            <h1 className="heading-xl mt-2 mb-5">RISK DISCLOSURE</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Meme coins are volatile. Here is everything you need to know
              before buying DMNZ — including the worst case scenarios.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div
          className="scroll-anim mb-10"
          style={{
            padding: "1.5rem",
            background: "rgba(220,20,60,0.06)",
            border: "1px solid rgba(220,20,60,0.25)",
            borderRadius: "4px",
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            <strong style={{ color: "var(--primary)" }}>THE ONLY RULE:</strong>{" "}
            Never invest more than you are completely comfortable losing. DMNZ
            is entertainment with financial components. Treat it as such.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {RISKS.map((risk, i) => (
            <div
              key={risk.title}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <h3
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--foreground)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {risk.title}
                </h3>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 flex-shrink-0"
                  style={{
                    color: SEVERITY_COLORS[risk.severity],
                    background: `${SEVERITY_COLORS[risk.severity]}18`,
                    border: `1px solid ${SEVERITY_COLORS[risk.severity]}30`,
                    borderRadius: "2px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {risk.severity}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {risk.body}
              </p>
            </div>
          ))}
        </div>

        <div className="scroll-anim mt-10" style={{ transitionDelay: "400ms" }}>
          <p
            className="text-xs font-mono text-center"
            style={{ color: "#555555" }}
          >
            This disclosure is provided for informational purposes only and does
            not constitute financial or legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
