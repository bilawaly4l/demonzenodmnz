import { Banknote, Diamond, Eye, Lock, Shield, Swords } from "lucide-react";

const ENEMIES = [
  {
    Icon: Swords,
    title: "RUG PULLS",
    desc: "No team allocation. No one can dump what no one controls.",
  },
  {
    Icon: Banknote,
    title: "WHALE MANIPULATION",
    desc: "Fair launch. No dominant position from day one.",
  },
  {
    Icon: Lock,
    title: "PRESALE ADVANTAGE",
    desc: "Zero presale. Period. Everyone enters at the same price.",
  },
  {
    Icon: Shield,
    title: "FAKE HYPE",
    desc: "Public roadmap. Committed burn. Real community.",
  },
  {
    Icon: Eye,
    title: "ANONYMOUS TEAMS",
    desc: "DemonZeno is publicly known — @Demon_Zeno on Binance Square.",
  },
  {
    Icon: Diamond,
    title: "VC INSIDER CONTROL",
    desc: "No VC involvement. No institutional advantage. Just community.",
  },
];

export function VillainArcSection() {
  return (
    <section
      data-ocid="villain_arc.section"
      className="py-16 md:py-20 relative overflow-hidden"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.22 25 / 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="mb-10">
          <h2
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--foreground)",
            }}
          >
            ENEMIES OF{" "}
            <span style={{ color: "oklch(0.70 0.18 25)" }}>THE PEOPLE</span>
          </h2>
          <p
            className="text-xs font-bold uppercase tracking-widest mt-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            What DemonZeno fights against &mdash; and why DMNZ is the answer.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {ENEMIES.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              data-ocid={`villain_arc.enemy.${i + 1}`}
              className="flex gap-4 p-5"
              style={{
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.55 0.22 25 / 0.15)",
                borderLeft: "2px solid oklch(0.70 0.18 25)",
              }}
            >
              <Icon
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: "oklch(0.70 0.18 25)" }}
              />
              <div>
                <p
                  className="font-display font-black text-xs uppercase tracking-widest mb-1"
                  style={{ color: "oklch(0.70 0.18 25)" }}
                >
                  {title}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 p-6 text-center"
          style={{
            background: "oklch(0.55 0.22 25 / 0.07)",
            border: "1px solid oklch(0.55 0.22 25 / 0.22)",
          }}
        >
          <p
            className="font-display font-black uppercase tracking-tight text-xl"
            style={{ color: "var(--foreground)" }}
          >
            DMNZ IS THE COUNTER-ATTACK.
          </p>
        </div>
      </div>
    </section>
  );
}
