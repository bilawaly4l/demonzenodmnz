import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

const FACTS = [
  {
    icon: <Shield className="w-5 h-5" />,
    label: "WHAT DMNZ IS",
    items: [
      "A fair-launch meme token on Blum Mini App on Telegram",
      "Launching April 2, 2027 — no presale, no team allocation",
      "Created and led by DemonZeno (@Demon_Zeno on Binance Square)",
      "Supply is fixed at launch — no minting, no inflation",
      "Burn event scheduled January 1, 2028 to reduce circulating supply",
    ],
  },
  {
    icon: <Eye className="w-5 h-5" />,
    label: "WHAT DMNZ IS NOT",
    items: [
      "Not a financial product. Not an investment vehicle.",
      "Not affiliated with Binance or any regulated institution",
      "Not audited by a third-party security firm (see Audit Readiness)",
      "Not a rug — DemonZeno's identity is publicly tied to this project",
      "Not a private venture — there are no team tokens or locked allocations",
    ],
  },
  {
    icon: <User className="w-5 h-5" />,
    label: "WHO IS BEHIND IT",
    items: [
      "DemonZeno — publicly known on Binance Square as @Demon_Zeno",
      "Not anonymous. The handle, profile, and post history are all public.",
      "No venture capital. No seed investors. No whale wallets pre-loaded.",
      "The creator holds no special allocation. Same rules for everyone.",
    ],
  },
];

const CONCERNS: { concern: string; answer: string }[] = [
  {
    concern: "It's anonymous, so I can't trust it.",
    answer:
      "DemonZeno is not anonymous. The project is publicly linked to the Binance Square account @Demon_Zeno with a full post history. The face and identity behind DMNZ is verifiable — unlike most meme coin creators who launch completely anonymously.",
  },
  {
    concern: "They'll just dump on holders after launch.",
    answer:
      "There are no team tokens to dump. DemonZeno holds zero pre-allocated tokens. If DemonZeno buys DMNZ, it is at the same market price as every other buyer. There is no hidden reserve to liquidate.",
  },
  {
    concern: "The presale is just for insiders.",
    answer:
      "There is no presale. Not for insiders, not for anyone. DMNZ goes live on April 2, 2027 and the first available price is the bonding curve start price on Blum — same for every buyer.",
  },
  {
    concern: "Meme coins always go to zero.",
    answer:
      "Some do. DemonZeno does not claim otherwise. What DMNZ offers that most meme coins do not: a public identity behind it, a planned burn event on January 1, 2028, and a community that was built before launch — not manufactured after.",
  },
  {
    concern: "There's no audit, so the contract is unsafe.",
    answer:
      "DMNZ launches through Blum's platform, which means the token uses Blum's own contract infrastructure — not a custom contract written by DemonZeno. The risk surface is the same as any other Blum launch.",
  },
  {
    concern: "I'll miss the pump and lose money.",
    answer:
      "Possibly. Bonding curves mean early buyers get better prices. But there are no guaranteed pumps. Buy only what you are comfortable losing entirely. DMNZ does not promise returns.",
  },
  {
    concern: "The January 2028 burn is fake.",
    answer:
      "The burn will be executed on-chain and announced publicly in advance on Binance Square. The burn wallet address will be published before the event. Anyone can verify it.",
  },
];

const PROOFS = [
  "Public Binance Square profile with full post history — @Demon_Zeno",
  "No presale, no team allocation — verifiable at launch on Blum",
  "Burn wallet published before January 2028 burn",
  "Launched through Blum's platform — no custom unsafe contracts",
  "All announcements made publicly before events, not after",
];

const RISKS = [
  "Meme tokens are highly speculative with no guaranteed value",
  "Price is driven by community sentiment and bonding curve mechanics on Blum",
  "Early buyers may see rapid gains or losses — this is the nature of meme tokens",
  "Liquidity may be limited, especially at launch",
  "Regulatory changes could affect the availability of DMNZ in your region",
];

export function Transparency() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Transparency — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="transparency.page"
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
            <span className="label-uppercase text-crimson">
              Official Statement
            </span>
            <h1 className="heading-xl mt-3 mb-5">TRANSPARENCY</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              What DMNZ is. What it is not. Who is behind it. All of it — in
              plain language, with nothing hidden.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          {FACTS.map((section, i) => (
            <div
              key={section.label}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span style={{ color: "var(--primary)" }}>{section.icon}</span>
                <h2
                  className="text-sm font-bold uppercase tracking-widest"
                  style={{
                    color: "var(--foreground)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {section.label}
                </h2>
              </div>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span
                      className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Risks */}
          <div
            className="scroll-anim"
            style={{
              padding: "1.5rem",
              background: "rgba(220,20,60,0.05)",
              border: "1px solid rgba(220,20,60,0.2)",
              borderRadius: "4px",
              transitionDelay: "300ms",
            }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-5"
              style={{ color: "var(--primary)", letterSpacing: "0.14em" }}
            >
              KNOWN RISKS
            </h2>
            <ul className="flex flex-col gap-3">
              {RISKS.map((risk) => (
                <li
                  key={risk}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <span
                    className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  {risk}
                </li>
              ))}
            </ul>
          </div>

          {/* Audit Readiness */}
          <div
            className="scroll-anim card-dmnz"
            style={{ transitionDelay: "400ms" }}
          >
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--foreground)", letterSpacing: "0.14em" }}
            >
              AUDIT READINESS STATEMENT
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              DMNZ has not undergone a formal third-party security audit. This
              is common for community-launched meme tokens on Blum. However,
              DemonZeno is fully committed to transparency: the project creator
              is publicly known, no code is obfuscated, and the token is
              deployed through Blum's own platform mechanics — meaning no custom
              contract vulnerabilities exist outside of Blum's own system.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              If and when a formal audit becomes available for Blum-launched
              tokens, DemonZeno will pursue it and publish the results here.
            </p>
          </div>
        </div>
      </div>

      {/* ─── COMMON CONCERNS: DMNZ IS NOT A SCAM ─────────────────── */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="scroll-anim mb-4">
          <span className="label-uppercase text-crimson">Straight Talk</span>
          <h2 className="heading-lg mt-3 mb-5">COMMON CONCERNS ANSWERED</h2>
          <p
            className="text-base max-w-2xl leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Every concern addressed directly. No spin. No marketing fluff. Just
            honest answers.
          </p>
        </div>

        {/* Proof points */}
        <div
          className="scroll-anim mb-10"
          style={{
            padding: "1.5rem",
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "4px",
          }}
        >
          <h3
            className="text-sm font-bold uppercase tracking-widest mb-5"
            style={{ color: "#22c55e", letterSpacing: "0.14em" }}
          >
            WHY YOU CAN VERIFY THIS
          </h3>
          <ul className="flex flex-col gap-3">
            {PROOFS.map((proof) => (
              <li
                key={proof}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                <CheckCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#22c55e" }}
                />
                {proof}
              </li>
            ))}
          </ul>
        </div>

        {/* Q&A */}
        <div className="flex flex-col gap-5">
          {CONCERNS.map((item, i) => (
            <div
              key={item.concern}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <XCircle
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "var(--primary)" }}
                />
                <h3
                  className="text-sm font-bold italic leading-snug"
                  style={{ color: "var(--foreground)" }}
                >
                  &ldquo;{item.concern}&rdquo;
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed pl-7"
                style={{ color: "var(--muted-foreground)" }}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
