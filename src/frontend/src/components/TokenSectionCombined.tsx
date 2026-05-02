import {
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Rocket,
  Send,
  Sword,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiBinance } from "react-icons/si";
import { useGetTokenInfo, useRoadmap } from "../hooks/useRoadmap";
import type { RoadmapMilestone, TokenInfo } from "../types";
import { ScrollAnimation } from "./ScrollAnimation";

// ─── Token fallback ───────────────────────────────────────────────────────────

const FALLBACK_TOKEN: TokenInfo = {
  name: "DemonZeno",
  ticker: "DMNZ",
  description:
    "DemonZeno (DMNZ) is a meme token born from discipline, sacrifice, and the relentless pursuit of trading mastery. Launched fairly on Blum — no presale, no insiders, no team allocation.",
  launchPlatform: "Blum / Telegram Mini App",
  slogan: "Trade Like a God. Hold Like a Demon.",
  totalSupply: "1,000,000,000 DMNZ",
  distribution: "100% fair launch — no presale, no allocation",
  socialLinks: [
    {
      name: "Binance Square",
      url: "https://www.binance.com/en/square/profile/@DemonZeno",
    },
    { name: "Twitter", url: "https://twitter.com/ZenoDemon" },
  ],
};

// ─── Roadmap data ─────────────────────────────────────────────────────────────

const DEFAULT_MILESTONES = [
  {
    id: "2026",
    year: "2026",
    date: undefined as string | undefined,
    title: "Community Building Year",
    description:
      "Growing the DemonZeno presence on Binance Square with free daily trading education, building a global community of disciplined traders.",
    icon: "🌐",
    completed: false,
  },
  {
    id: "2027",
    year: "2027",
    date: "April 2, 2027",
    title: "DMNZ Created on Blum",
    description:
      "DMNZ token fair launch via Telegram Mini App on Blum — 100% fair, no presale, no insiders, no allocation. Everyone enters at the same price.",
    icon: "🚀",
    completed: false,
  },
  {
    id: "2028",
    year: "2028",
    date: "January 1, 2028",
    title: "Huge Buyback & Burn",
    description:
      "Massive token buyback and permanent burn to reduce circulating supply, create deflationary pressure, increase token value, and push toward the bonding curve.",
    icon: "🔥",
    completed: false,
  },
];

const MILESTONE_DELIVERABLES: Record<string, string[]> = {
  "2026": [
    "Daily free trading education on Binance Square @DemonZeno",
    "Build a loyal global community of crypto, forex, and stock traders",
    "Grow following across Binance Square and Twitter @ZenoDemon",
    "Establish credibility and foundation for the DMNZ token launch",
  ],
  "2027": [
    "DMNZ token created and launched via Telegram Mini App on Blum",
    "100% fair launch — no presale, no insiders, no team allocation",
    "Every participant buys at the same price — community-first model",
    "BLUM platform integration and full launch campaign",
  ],
  "2028": [
    "Massive buyback of DMNZ from the open market",
    "Permanent burn to drastically reduce circulating supply",
    "Bonding curve activation — drives potential exchange listings",
    "Price appreciation driven by supply reduction and community demand",
  ],
};

const MILESTONE_STATUS_STYLES = {
  0: {
    border: "border-primary/50",
    yearColor: "text-primary",
    glow: "shadow-[0_0_16px_oklch(0.65_0.15_190_/_0.18)]",
    badge: "bg-primary/10 text-primary border border-primary/30",
    label: "● CURRENT",
    checkColor: "text-primary",
  },
  1: {
    border: "border-[oklch(0.65_0.15_70_/_0.5)]",
    yearColor: "text-[oklch(0.7_0.18_70)]",
    glow: "shadow-[0_0_12px_oklch(0.65_0.15_70_/_0.12)]",
    badge:
      "bg-[oklch(0.65_0.15_70_/_0.12)] text-[oklch(0.7_0.18_70)] border border-[oklch(0.65_0.15_70_/_0.3)]",
    label: "⏳ UPCOMING",
    checkColor: "text-[oklch(0.7_0.18_70)]",
  },
  2: {
    border: "border-border",
    yearColor: "text-muted-foreground",
    glow: "",
    badge: "bg-muted text-muted-foreground border border-border",
    label: "🔮 FUTURE",
    checkColor: "text-muted-foreground",
  },
};

// ─── How to buy steps ─────────────────────────────────────────────────────────

const HOW_TO_BUY_STEPS = [
  {
    step: 1,
    icon: Send,
    title: "Follow on Binance Square",
    desc: "Follow @DemonZeno on Binance Square for launch updates and daily trading content.",
  },
  {
    step: 2,
    icon: Rocket,
    title: "Open Blum Mini App",
    desc: "Open the Blum mini app inside Telegram — it's free and takes less than a minute.",
  },
  {
    step: 3,
    icon: Zap,
    title: "Find DemonZeno DMNZ",
    desc: 'Search for "DemonZeno DMNZ" inside the Blum Mini App to find the official token.',
  },
  {
    step: 4,
    icon: Flame,
    title: "Buy DMNZ",
    desc: "Purchase DMNZ at fair launch price — no presale advantage, everyone enters equally.",
  },
];

// ─── FAQ items ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    id: "what-is-dmnz",
    q: "What is DMNZ?",
    a: "DMNZ (DemonZeno) is a meme token born from trading discipline and sacrifice. It launched via Blum Mini App on Telegram — 100% fair, community-driven, with no presale and no team allocation. The DemonZeno Trading Academy accompanies every holder.",
  },
  {
    id: "what-is-blum",
    q: "What is Blum?",
    a: "Blum is a Telegram-based crypto launchpad and decentralized exchange Mini App. It allows users to discover, trade, and participate in fair token launches directly through Telegram's ecosystem. DMNZ launches on Blum on April 2, 2027.",
  },
  {
    id: "bonding-curve",
    q: "What is a bonding curve?",
    a: "A bonding curve is a mathematical price mechanism where token price automatically increases as more tokens are purchased. When the bonding curve target is hit — driven by demand and supply reduction from the January 2028 burn — the token becomes eligible for broader exchange listings and increased liquidity.",
  },
  {
    id: "how-to-buy",
    q: "How do I buy DMNZ?",
    a: "Follow @DemonZeno on Binance Square → Open the Blum mini app on Telegram → Find DemonZeno DMNZ → Buy. All you need is a Telegram account. The launch is April 2, 2027.",
  },
  {
    id: "presale",
    q: "Is there a presale?",
    a: "No — DMNZ is a 100% full fair launch. There is no presale, no private sale, no team allocation, and no VC advantage. Every participant buys at the same price on launch day.",
  },
  {
    id: "buyback-burn",
    q: "What is the buyback and burn?",
    a: "On January 1, 2028, a massive DMNZ buyback from the open market will be executed, followed by permanent token burn. This reduces the circulating supply, creates deflationary pressure, increases scarcity, and pushes toward the bonding curve activation.",
  },
  {
    id: "when-launch",
    q: "When does DMNZ launch?",
    a: "DMNZ officially launches on April 2, 2027 on the Blum Mini App via Telegram. Follow @DemonZeno on Binance Square and @ZenoDemon on Twitter to stay updated.",
  },
];

// ─── Countdown Timer ──────────────────────────────────────────────────────────

const LAUNCH_TARGET = new Date("2027-04-02T00:00:00Z").getTime();

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = LAUNCH_TARGET - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const diff = LAUNCH_TARGET - Date.now();
      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-ocid="token.countdown.section"
      className="bg-card rounded-xl p-6 border border-border text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Rocket className="w-5 h-5 text-primary shrink-0" />
        <h3 className="font-display font-bold text-foreground text-lg">
          DMNZ Launch Countdown
        </h3>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        April 2, 2027 · 00:00 UTC · Blum Telegram Mini App
      </p>
      {timeLeft === null ? (
        <div className="text-3xl font-display font-black text-primary">
          🚀 DMNZ IS LIVE!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div
              key={label}
              data-ocid={`token.countdown.${label.toLowerCase()}`}
              className="bg-muted/40 rounded-xl p-3 border border-primary/20"
            >
              <div className="font-display font-black text-2xl md:text-3xl text-primary font-mono tabular-nums leading-none mb-1">
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Full Fair Launch Section ─────────────────────────────────────────────────

function FullFairLaunchSection() {
  const pillars = [
    {
      icon: "🚫",
      title: "No Presale",
      desc: "Zero presale rounds. Zero early-bird advantage. Every participant enters at the same price.",
    },
    {
      icon: "🚫",
      title: "No Team Tokens",
      desc: "No team allocation, no VC reserve, no insider wallets. The entire supply is public.",
    },
    {
      icon: "🤝",
      title: "Community First",
      desc: "DMNZ belongs to its community. The Trading Academy is your edge — not a presale slot.",
    },
  ];

  return (
    <div
      data-ocid="token.fair_launch.section"
      className="bg-card rounded-2xl p-8 border border-primary/20"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-foreground">
            Full Fair Launch
          </h3>
          <p className="text-xs text-primary font-mono">
            100% community · no presale · no insiders
          </p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        DMNZ is a 100% fair launch token. There is no presale, no private sale,
        no VC allocation, and no team reserve. On April 2, 2027 — every single
        participant buys at the same price through the Blum Mini App. No
        exceptions.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {pillars.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-muted/30 rounded-xl p-5 border border-border flex flex-col gap-2"
          >
            <span className="text-2xl">{icon}</span>
            <p className="font-display font-bold text-foreground text-sm">
              {title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── How to Buy Section ───────────────────────────────────────────────────────

function HowToBuySection() {
  return (
    <div
      data-ocid="token.how_to_buy.section"
      className="bg-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-5">
        <Rocket className="w-5 h-5 text-primary shrink-0" />
        <h3 className="font-display font-bold text-foreground text-lg">
          How to Buy DMNZ
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {HOW_TO_BUY_STEPS.map(({ step, icon: Icon, title, desc }) => (
          <div
            key={step}
            data-ocid={`token.how_to_buy.step.${step}`}
            className="flex items-start gap-3 bg-muted/30 rounded-xl p-4 border border-border"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-bold text-primary font-mono">
                  {String(step).padStart(2, "0")}
                </span>
                <p className="font-semibold text-foreground text-sm">{title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://www.binance.com/en/square/profile/@DemonZeno"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.how_to_buy.binance_button"
          className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-smooth border-2 bg-[oklch(0.65_0.15_70_/_0.12)] text-[oklch(0.7_0.18_70)] border-[oklch(0.65_0.15_70_/_0.4)] hover:bg-[oklch(0.65_0.15_70_/_0.22)] hover:scale-[1.02]"
        >
          <SiBinance className="w-4 h-4 shrink-0" />
          Follow @DemonZeno on Binance Square
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
        </a>
        <a
          href="https://t.me/blum"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.how_to_buy.blum_button"
          className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-smooth border-2 bg-primary/10 text-primary border-primary/40 hover:bg-primary/20 hover:scale-[1.02]"
        >
          <Rocket className="w-4 h-4 shrink-0" />
          Open Blum Mini App
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
        </a>
      </div>
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  index,
  expanded,
  onToggle,
}: {
  milestone: (typeof DEFAULT_MILESTONES)[0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const style =
    MILESTONE_STATUS_STYLES[index as keyof typeof MILESTONE_STATUS_STYLES] ??
    MILESTONE_STATUS_STYLES[2];
  const deliverables = MILESTONE_DELIVERABLES[milestone.year] ?? [];

  return (
    <button
      type="button"
      data-ocid={`token.roadmap.item.${index + 1}`}
      onClick={onToggle}
      aria-expanded={expanded}
      className={`w-full text-left bg-card border-2 ${style.border} rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01] ${style.glow} cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{milestone.icon}</span>
          <div>
            <span
              className={`font-display font-black text-2xl ${style.yearColor}`}
            >
              {milestone.year}
            </span>
            {milestone.date && (
              <p className="text-xs text-muted-foreground">{milestone.date}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full ${style.badge}`}
          >
            {style.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 text-muted-foreground ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <h4 className="font-display font-bold text-foreground text-base leading-snug mb-2">
        {milestone.title}
      </h4>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {milestone.description}
      </p>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? "320px" : "0px" }}
      >
        {deliverables.length > 0 && (
          <div className="pt-4 border-t border-border/50 mt-4 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Key Deliverables
            </p>
            {deliverables.map((d) => (
              <div key={d} className="flex items-start gap-2">
                <CheckCircle
                  className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${style.checkColor}`}
                />
                <span className="text-sm text-muted-foreground leading-snug">
                  {d}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function RoadmapSubSection({
  backendMilestones,
  isLoading,
}: {
  backendMilestones: RoadmapMilestone[];
  isLoading: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>("2026");
  const items =
    !isLoading && backendMilestones.length > 0
      ? backendMilestones.map((m, i) => ({
          id: m.year,
          year: m.year,
          date: m.date ?? undefined,
          title: m.title,
          description: m.description,
          icon: (["🌐", "🚀", "🔥"] as const)[i] ?? "⭐",
          completed: m.completed,
        }))
      : DEFAULT_MILESTONES;

  return (
    <div data-ocid="token.roadmap.section" className="flex flex-col gap-4">
      {items.map((m, i) => (
        <MilestoneCard
          key={m.id}
          milestone={m}
          index={i}
          expanded={expandedId === m.id}
          onToggle={() =>
            setExpandedId((prev) => (prev === m.id ? null : m.id))
          }
        />
      ))}
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div data-ocid="token.faq.section" className="flex flex-col gap-2">
      {FAQ_ITEMS.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={`bg-card rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen ? "border-primary/40" : "border-border"
            }`}
          >
            <button
              type="button"
              data-ocid={`token.faq.item.${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="w-full text-left flex items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-smooth"
            >
              <div className="flex items-center gap-3 min-w-0">
                <HelpCircle
                  className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                    isOpen ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`font-semibold text-sm md:text-base transition-colors duration-200 ${
                    isOpen ? "text-primary" : "text-foreground"
                  }`}
                >
                  {item.q}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: isOpen ? "240px" : "0px" }}
            >
              <p className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Community CTA ────────────────────────────────────────────────────────────

function CommunityCTA({ info }: { info: TokenInfo }) {
  const binanceUrl =
    info.socialLinks.find((l) => l.name.toLowerCase().includes("binance"))
      ?.url ?? "https://www.binance.com/en/square/profile/@DemonZeno";
  const twitterUrl =
    info.socialLinks.find(
      (l) =>
        l.name.toLowerCase().includes("twitter") ||
        l.name.toLowerCase().includes("x"),
    )?.url ?? "https://twitter.com/ZenoDemon";

  return (
    <div
      data-ocid="token.community.section"
      className="bg-card rounded-xl p-6 border border-primary/30 text-center"
    >
      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
        <Users className="w-3.5 h-3.5 text-primary" />
        <span className="text-primary text-xs font-semibold tracking-wide uppercase">
          Join the DemonZeno Community
        </span>
      </div>
      <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto leading-relaxed">
        Follow DemonZeno for daily trading insights, DMNZ launch updates, and
        the strongest community in trading.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={binanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.community.binance_button"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-smooth border-2 bg-[oklch(0.65_0.15_70_/_0.12)] text-[oklch(0.7_0.18_70)] border-[oklch(0.65_0.15_70_/_0.4)] hover:bg-[oklch(0.65_0.15_70_/_0.22)] hover:scale-[1.02]"
        >
          <SiBinance className="w-4 h-4 shrink-0" />
          Follow @DemonZeno on Binance Square
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.community.twitter_button"
          className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-smooth border-2 bg-primary/10 text-primary border-primary/40 hover:bg-primary/20 hover:scale-[1.02]"
        >
          <span className="font-bold text-base leading-none">𝕏</span>
          Follow @ZenoDemon on Twitter
          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
        </a>
      </div>
    </div>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────

function SocialLinks({ info }: { info: TokenInfo }) {
  const binanceLink =
    info.socialLinks.find((l) => l.name.toLowerCase().includes("binance"))
      ?.url ?? "https://www.binance.com/en/square/profile/@DemonZeno";
  const twitterLink =
    info.socialLinks.find(
      (l) =>
        l.name.toLowerCase().includes("twitter") ||
        l.name.toLowerCase().includes("x"),
    )?.url ?? "https://twitter.com/ZenoDemon";

  return (
    <div
      data-ocid="token.social.section"
      className="bg-card rounded-xl p-6 border border-border"
    >
      <div className="flex items-center gap-2 mb-5">
        <Globe className="w-5 h-5 text-primary shrink-0" />
        <h3 className="font-display font-bold text-foreground text-lg">
          Follow DemonZeno
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href={binanceLink}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.binance.link"
          className="group flex items-center gap-3 bg-muted/30 hover:bg-muted/60 rounded-xl p-4 border border-border hover:border-primary/40 transition-smooth"
        >
          <div className="w-10 h-10 rounded-lg bg-[oklch(0.65_0.15_70_/_0.15)] border border-[oklch(0.65_0.15_70_/_0.3)] flex items-center justify-center shrink-0">
            <SiBinance className="w-5 h-5 text-[oklch(0.7_0.18_70)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm">
              Binance Square
            </p>
            <p className="text-xs text-muted-foreground">@DemonZeno</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth shrink-0" />
        </a>
        <a
          href={twitterLink}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="token.twitter.link"
          className="group flex items-center gap-3 bg-muted/30 hover:bg-muted/60 rounded-xl p-4 border border-border hover:border-primary/40 transition-smooth"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-base leading-none">
              𝕏
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm">Twitter / X</p>
            <p className="text-xs text-muted-foreground">@ZenoDemon</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth shrink-0" />
        </a>
      </div>
    </div>
  );
}

// ─── Brand Lore Section ───────────────────────────────────────────────────────

const DEMONZENO_QUOTES = [
  {
    quote: "Trade the chart, not the news.",
    context: "On technical analysis over noise",
  },
  {
    quote: "The demons of trading are fear and greed. Know them. Control them.",
    context: "On trading psychology",
  },
  {
    quote: "Every loss is tuition. Every win is validation.",
    context: "On growth through adversity",
  },
  {
    quote: "Patience is the sharpest weapon in a trader's arsenal.",
    context: "On discipline over impulsion",
  },
  {
    quote:
      "Risk management isn't optional. It's the only reason traders survive.",
    context: "On the foundation of survival",
  },
  {
    quote: "The best traders aren't the bravest. They're the most disciplined.",
    context: "On what mastery really looks like",
  },
  {
    quote: "Master the basics. Everything else is noise.",
    context: "On focus over complexity",
  },
  {
    quote: "In trading, the one who loses the least wins the most.",
    context: "On capital preservation",
  },
  {
    quote: "Your trading plan is your shield. Never go to battle without it.",
    context: "On preparation and discipline",
  },
  {
    quote: "Protect your capital like it's your life.",
    context: "On the sacred rule of risk management",
  },
  {
    quote: "Every pattern tells a story. Learn to read the chart like a book.",
    context: "On chart pattern mastery",
  },
  {
    quote: "The exit matters more than the entry.",
    context: "On trade management",
  },
  {
    quote: "Trading is 80% psychology, 20% strategy.",
    context: "On the mental edge",
  },
  {
    quote: "Cut losses fast, let winners run.",
    context: "On asymmetric risk-reward",
  },
  {
    quote: "The trend is your only friend.",
    context: "On following momentum",
  },
  {
    quote: "DMNZ: Born from darkness, forged in discipline.",
    context: "On the DMNZ token origin",
  },
];

function BrandLoreSection() {
  return (
    <div
      data-ocid="token.brand_lore.section"
      className="bg-card rounded-2xl p-8 border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
          <Sword className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-foreground">
            Who is DemonZeno?
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            The myth. The discipline. The token.
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          DemonZeno is not just a character — it's a philosophy. Forged in the
          fires of market chaos and born from countless hours of chart analysis,
          DemonZeno embodies the trader who refuses to quit. The disciplined
          demon who studies while others sleep. The patient ghost who waits for
          the perfect setup while others trade on emotion.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          DMNZ is the token of that philosophy. It belongs to those who earn it
          — not through a presale, not through insider connections, but through
          the same discipline that defines every lesson in the DemonZeno Trading
          Academy. You study. You learn. You earn. That's the DemonZeno way.
        </p>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        DemonZeno Wisdom
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {DEMONZENO_QUOTES.slice(0, 4).map(({ quote, context }) => (
          <div
            key={quote}
            className="bg-muted/30 rounded-xl p-4 border border-border relative"
          >
            <div className="text-primary/30 font-display font-black text-3xl leading-none mb-2 select-none">
              &ldquo;
            </div>
            <p className="font-display font-semibold text-foreground text-xs leading-snug mb-2">
              {quote}
            </p>
            <p className="text-xs text-muted-foreground italic">{context}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {DEMONZENO_QUOTES.slice(4, 8).map(({ quote, context }) => (
          <div
            key={quote}
            className="bg-muted/30 rounded-xl p-4 border border-border relative"
          >
            <div className="text-primary/30 font-display font-black text-3xl leading-none mb-2 select-none">
              &ldquo;
            </div>
            <p className="font-display font-semibold text-foreground text-xs leading-snug mb-2">
              {quote}
            </p>
            <p className="text-xs text-muted-foreground italic">{context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function TokenSectionCombined() {
  const { data: tokenInfo } = useGetTokenInfo();
  const { milestones, isLoading: roadmapLoading } = useRoadmap();

  const info = tokenInfo ?? FALLBACK_TOKEN;

  return (
    <section
      id="dmnz-token"
      data-ocid="token.section"
      className="py-12 bg-background border-y border-border"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Section header ── */}
        <ScrollAnimation>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                DMNZ Meme Token
              </span>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
              <span className="text-primary">DemonZeno</span>{" "}
              <span className="font-mono text-2xl md:text-3xl text-muted-foreground">
                (DMNZ)
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              {info.slogan}
            </p>
          </div>
        </ScrollAnimation>

        {/* ── What is DMNZ hero ── */}
        <ScrollAnimation>
          <div
            data-ocid="token.hero.section"
            className="mb-5 bg-card rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  What is DMNZ?
                </h3>
                <span className="font-mono text-xs text-primary">
                  {info.ticker} · {info.launchPlatform}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              DemonZeno (DMNZ) is a meme token born from discipline, sacrifice,
              and the relentless pursuit of trading mastery. Built for the
              trading community — not for insiders, not for VCs, not for anyone
              who didn't put in the work.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              DMNZ launches on Blum via the Telegram Mini App on April 2, 2027.
              100% fair. Everyone buys at the same price. The edge isn't a
              presale slot — it's the DemonZeno Trading Academy.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Community-Driven",
                "Full Fair Launch",
                "No Presale",
                "No Team Tokens",
                "Trading Academy",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </ScrollAnimation>

        {/* ── Full Fair Launch ── */}
        <ScrollAnimation delay={40}>
          <div className="mb-5">
            <FullFairLaunchSection />
          </div>
        </ScrollAnimation>

        {/* ── Countdown ── */}
        <ScrollAnimation delay={60}>
          <div className="mb-5">
            <CountdownTimer />
          </div>
        </ScrollAnimation>

        {/* ── How to Buy ── */}
        <ScrollAnimation delay={80}>
          <div className="mb-5">
            <HowToBuySection />
          </div>
        </ScrollAnimation>

        {/* ── Roadmap ── */}
        <ScrollAnimation delay={100}>
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary shrink-0" />
              <h3 className="font-display font-bold text-xl text-foreground">
                DMNZ Roadmap
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                2026 → 2028
              </span>
            </div>
            <RoadmapSubSection
              backendMilestones={milestones}
              isLoading={roadmapLoading}
            />
          </div>
        </ScrollAnimation>

        {/* ── Brand Lore ── */}
        <ScrollAnimation delay={120}>
          <div className="mb-5">
            <BrandLoreSection />
          </div>
        </ScrollAnimation>

        {/* ── Community CTA ── */}
        <ScrollAnimation delay={140}>
          <div className="mb-5">
            <CommunityCTA info={info} />
          </div>
        </ScrollAnimation>

        {/* ── FAQ ── */}
        <ScrollAnimation delay={160}>
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-primary shrink-0" />
              <h3 className="font-display font-bold text-xl text-foreground">
                Frequently Asked Questions
              </h3>
            </div>
            <FaqAccordion />
          </div>
        </ScrollAnimation>

        {/* ── Social links ── */}
        <ScrollAnimation delay={180}>
          <SocialLinks info={info} />
        </ScrollAnimation>
      </div>
    </section>
  );
}
