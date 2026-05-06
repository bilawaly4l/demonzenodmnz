import { Link } from "@tanstack/react-router";
import { ArrowLeft, Ban, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

const RULES = [
  {
    number: "01",
    title: "RESPECT THE MISSION",
    body: "DMNZ exists to prove that a fair launch is possible. Anyone undermining that mission — spreading FUD, pushing fake pump signals, or creating confusion — does not belong here.",
  },
  {
    number: "02",
    title: "NO FINANCIAL ADVICE",
    body: "Do not tell others to buy or sell DMNZ. Do not post price predictions as if they are certainties. We are a community, not a financial advisory. Everyone makes their own decisions.",
  },
  {
    number: "03",
    title: "NO FAKE CHANNELS OR IMPERSONATION",
    body: "Creating accounts or channels impersonating @Demon_Zeno, DMNZ, or any community member is grounds for immediate removal from any affiliated space and public callout.",
  },
  {
    number: "04",
    title: "NO PRESALE OR PROMO SCHEMES",
    body: "Anyone promoting presale offers, referral pyramid schemes, or paid shilling inside DMNZ spaces will be banned and reported. DMNZ is built on fairness — protect it.",
  },
  {
    number: "05",
    title: "SPEAK WITH EVIDENCE",
    body: "If you have concerns or criticism, state them clearly and with evidence. Blind accusations and baseless attacks are noise. DemonZeno responds to substance, not drama.",
  },
  {
    number: "06",
    title: "CREDIT ORIGINAL CREATORS",
    body: "If you share DMNZ content, credit the original creator. Do not repurpose official DMNZ materials for personal gain without acknowledgment.",
  },
];

const VIOLATIONS = [
  "Immediate removal from community spaces",
  "Public callout on Binance Square if the violation is severe enough to warn others",
  "Reporting to Binance Square moderation if impersonation is involved",
];

export function CommunityGuidelines() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Community Guidelines — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="community_guidelines.page"
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
            <span className="label-uppercase text-crimson">By DemonZeno</span>
            <h1 className="heading-xl mt-3 mb-5">COMMUNITY GUIDELINES</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              How we conduct ourselves in the DMNZ community. These are not
              suggestions.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex flex-col gap-5 mb-14">
          {RULES.map((rule, i) => (
            <div
              key={rule.number}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-mono font-bold text-xl flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                >
                  {rule.number}
                </span>
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-widest mb-2"
                    style={{
                      color: "var(--foreground)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {rule.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {rule.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="scroll-anim card-dmnz mb-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4" style={{ color: "#22c55e" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--foreground)", letterSpacing: "0.14em" }}
            >
              WHAT WE WELCOME
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Honest discussion about the project",
              "Sharing your journey to buying DMNZ",
              "Questions about how Blum works",
              "Spreading awareness on Binance Square",
              "Constructive feedback to DemonZeno",
              "Welcoming new community members",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: "#22c55e" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="scroll-anim"
          style={{
            padding: "1.5rem",
            background: "rgba(220,20,60,0.06)",
            border: "1px solid rgba(220,20,60,0.25)",
            borderRadius: "4px",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Ban className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--primary)", letterSpacing: "0.14em" }}
            >
              CONSEQUENCES OF VIOLATIONS
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {VIOLATIONS.map((v) => (
              <li
                key={v}
                className="flex items-start gap-3 text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
