import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

type Entry = {
  version: string;
  date: string;
  label: string;
  changes: string[];
};

const ENTRIES: Entry[] = [
  {
    version: "v1.5",
    date: "May 5, 2026",
    label: "MAJOR UPDATE",
    changes: [
      "Added full credibility suite: Transparency, Official Links, Community Guidelines, Legal Disclaimer, Risk Disclosure, Lessons from Failures, Not A Scam pages",
      "Added Why DemonZeno page with public commitment",
      "Added Launch Announcement and Post-Launch Plan pages",
      "Added brand identity and whitepaper sections",
      "Added sticky countdown bar to every page",
      "Upgraded footer with 4-column professional layout",
      "Added official links page and Beware of Fakes section",
    ],
  },
  {
    version: "v1.4",
    date: "April 2026",
    label: "CONTENT UPDATE",
    changes: [
      "Added interactive roadmap with milestone expansion",
      "Added First 100 pledge wall and OG Believer badge system",
      "Added Hype Wall with community messages",
      "Added D-Day countdown page",
      "Added readiness checklist",
      "Removed all Academy, quiz, certificate, admin, and AI features",
      "Removed all dead backend files (120+ files cleaned)",
    ],
  },
  {
    version: "v1.3",
    date: "March 2026",
    label: "DESIGN OVERHAUL",
    changes: [
      "Full dark-theme-only redesign: deep black #0a0a0a + crimson #DC143C",
      "Sharp corners enforced across all components (2-4px max)",
      "Removed all light mode code and theme toggle",
      "New typography: Space Grotesk display + Inter body",
      "Added scroll animations (cinematic fade-ins)",
      "Added scroll progress indicator",
    ],
  },
  {
    version: "v1.2",
    date: "February 2026",
    label: "CONTENT UPDATE",
    changes: [
      "Updated Binance Square handle to @Demon_Zeno",
      "Added DMNZ vs Other Meme Coins comparison section",
      "Added DemonZeno origin story and lore sections",
      "Added Bonding Curve explainer",
      "Added Early Believer wall",
    ],
  },
  {
    version: "v1.0",
    date: "January 2026",
    label: "LAUNCH",
    changes: [
      "Initial DMNZ website launched",
      "Token info, roadmap, FAQ, and How to Buy sections live",
      "Countdown timer to April 2, 2027 launch date",
    ],
  },
];

const LABEL_COLORS: Record<string, string> = {
  "MAJOR UPDATE": "var(--primary)",
  "CONTENT UPDATE": "var(--gold)",
  "DESIGN OVERHAUL": "#a855f7",
  LAUNCH: "#22c55e",
};

export function Changelog() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Changelog — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="changelog.page"
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
            <span className="label-uppercase text-crimson">Site History</span>
            <h1 className="heading-xl mt-3 mb-5">WHAT&apos;S CHANGED</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Every update to this site, documented. An active and maintained
              project doesn&apos;t hide its history.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex flex-col gap-8">
          {ENTRIES.map((entry, i) => (
            <div
              key={entry.version}
              className="scroll-anim flex gap-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full mt-1.5"
                  style={{
                    background:
                      LABEL_COLORS[entry.label] ?? "var(--muted-foreground)",
                  }}
                />
                {i < ENTRIES.length - 1 && (
                  <div
                    className="w-px flex-1 mt-2"
                    style={{ background: "var(--border)", minHeight: "2rem" }}
                  />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: "var(--foreground)" }}
                  >
                    {entry.version}
                  </span>
                  <span
                    className="badge-info text-xs"
                    style={{
                      color:
                        LABEL_COLORS[entry.label] ?? "var(--muted-foreground)",
                      borderColor: LABEL_COLORS[entry.label] ?? "var(--border)",
                    }}
                  >
                    {entry.label}
                  </span>
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {entry.date}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {entry.changes.map((change) => (
                    <li
                      key={change}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      <span
                        className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                        style={{ background: "var(--border)" }}
                      />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
