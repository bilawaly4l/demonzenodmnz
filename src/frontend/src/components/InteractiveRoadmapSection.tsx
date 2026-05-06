import { ChevronDown, Flame, Globe, Rocket } from "lucide-react";
import { useState } from "react";

const MILESTONES = [
  {
    id: "2026",
    year: "2026",
    date: "Full Year",
    title: "Community Building Year",
    Icon: Globe,
    status: "current" as const,
    statusLabel: "IN PROGRESS",
    desc: "Building the DemonZeno community on Binance Square. Daily trading education. Establishing the credibility that makes the DMNZ launch unstoppable.",
    deliverables: [
      "Daily free trading education on @Demon_Zeno Binance Square",
      "Build a loyal global community of disciplined traders",
      "Establish credibility for the DMNZ token launch",
      "Launch this website and Early Believers wall",
    ],
  },
  {
    id: "2027",
    year: "2027",
    date: "April 2, 2027",
    title: "DMNZ Launches on Blum",
    Icon: Rocket,
    status: "upcoming" as const,
    statusLabel: "UPCOMING",
    desc: "DMNZ token launches on Blum Mini App. 100% fair launch — no presale, no insiders, no team allocation. Same price for everyone.",
    deliverables: [
      "DMNZ token created and launched via Blum Mini App",
      "100% fair launch — zero presale, zero insider advantage",
      "Blum platform integration and full launch campaign",
    ],
  },
  {
    id: "2028",
    year: "2028",
    date: "January 1, 2028",
    title: "The Great Burn",
    Icon: Flame,
    status: "future" as const,
    statusLabel: "FUTURE",
    desc: "Massive buyback and permanent burn of 50% of all DMNZ supply. Deflationary pressure. DEX listing eligibility. DemonZeno keeps his word.",
    deliverables: [
      "Massive buyback of DMNZ from the open market",
      "Permanent burn — 50% of circulating supply destroyed",
      "Bonding curve acceleration toward exchange listings",
    ],
  },
];

const STATUS_STYLES = {
  current: {
    border: "oklch(0.62 0.16 190 / 0.50)",
    yearColor: "oklch(0.62 0.16 190)",
    glow: "0 0 20px oklch(0.62 0.16 190 / 0.12)",
    badge: {
      bg: "oklch(0.62 0.16 190 / 0.12)",
      color: "oklch(0.62 0.16 190)",
      border: "oklch(0.62 0.16 190 / 0.35)",
    },
  },
  upcoming: {
    border: "oklch(0.65 0.15 70 / 0.50)",
    yearColor: "oklch(0.70 0.18 70)",
    glow: "0 0 16px oklch(0.65 0.15 70 / 0.08)",
    badge: {
      bg: "oklch(0.65 0.15 70 / 0.12)",
      color: "oklch(0.70 0.18 70)",
      border: "oklch(0.65 0.15 70 / 0.35)",
    },
  },
  future: {
    border: "oklch(0.30 0.01 260)",
    yearColor: "oklch(0.50 0.01 260)",
    glow: "none",
    badge: {
      bg: "oklch(0.22 0.01 260)",
      color: "oklch(0.50 0.01 260)",
      border: "oklch(0.30 0.01 260)",
    },
  },
};

export function InteractiveRoadmapSection() {
  const [expandedId, setExpandedId] = useState<string | null>("2026");

  return (
    <section
      id="roadmap"
      data-ocid="roadmap.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <h2
            className="font-display font-black text-4xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            THE ROADMAP
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Three milestones. One commitment.
          </p>
        </div>

        <div className="flex flex-col gap-3" data-ocid="roadmap.list">
          {MILESTONES.map((m, i) => {
            const style = STATUS_STYLES[m.status];
            const isOpen = expandedId === m.id;
            const MilestoneIcon = m.Icon;

            return (
              <button
                key={m.id}
                type="button"
                data-ocid={`roadmap.item.${i + 1}`}
                onClick={() => setExpandedId(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="w-full text-left p-6 transition-all duration-200"
                style={{
                  background: "oklch(0.14 0.015 260)",
                  border: `1px solid ${style.border}`,
                  boxShadow: style.glow,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex items-center justify-center shrink-0"
                      style={{ background: style.badge.bg }}
                    >
                      <MilestoneIcon
                        className="w-5 h-5"
                        style={{ color: style.yearColor }}
                      />
                    </div>
                    <div>
                      <span
                        className="font-display font-black text-2xl"
                        style={{ color: style.yearColor }}
                      >
                        {m.year}
                      </span>
                      {m.date && (
                        <p className="text-xs text-muted-foreground">
                          {m.date}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs font-black uppercase tracking-widest px-2.5 py-1"
                      style={{
                        background: style.badge.bg,
                        color: style.badge.color,
                        border: `1px solid ${style.badge.border}`,
                      }}
                    >
                      {m.statusLabel}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                <h3 className="font-display font-bold text-foreground text-base mb-1">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug">
                  {m.desc}
                </p>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "400px" : "0" }}
                >
                  <div
                    className="mt-4 pt-4"
                    style={{ borderTop: "1px solid oklch(0.22 0.01 260)" }}
                  >
                    <ul className="flex flex-col gap-1.5">
                      {m.deliverables.map((d) => (
                        <li
                          key={d}
                          className="flex gap-2 text-sm text-muted-foreground"
                        >
                          <span
                            style={{ color: style.yearColor }}
                            className="shrink-0 font-black text-xs"
                          >
                            —
                          </span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className="mt-5 p-5 text-center"
          style={{
            background: "oklch(0.62 0.16 190 / 0.05)",
            border: "1px solid oklch(0.62 0.16 190 / 0.15)",
          }}
          data-ocid="roadmap.whats_next"
        >
          <p className="font-display font-bold text-foreground text-sm">
            After the burn — DEX listings, broader exposure, and the next phase
            of the movement.
          </p>
        </div>
      </div>
    </section>
  );
}
