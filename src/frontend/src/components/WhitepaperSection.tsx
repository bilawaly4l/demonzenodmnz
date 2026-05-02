import { jsPDF } from "jspdf";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  FileText,
  Flame,
  Globe,
  Shield,
  Sword,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

// ─── Whitepaper content data ────────────────────────────────────────────────

const WP_SECTIONS = [
  {
    id: "executive-summary",
    num: "01",
    title: "Executive Summary",
    icon: FileText,
    content: [
      "DemonZeno is a world-class, free trading education platform and the official hub for the DemonZeno (DMNZ) meme token. Founded on the belief that elite trading knowledge should be accessible to everyone — not gatekept behind expensive courses or paywalls — DemonZeno provides a structured, five-tier Trading Academy from absolute beginner to master level.",
      "The DMNZ token is a 100% fair-launch meme coin launching via the Blum Telegram Mini App on April 2, 2027. There is no presale, no private sale, no team allocation, and no VC reserve. Every participant buys at the same price. The DemonZeno Trading Academy is your edge — not a presale slot.",
      "Key highlights: Free, world-class trading education across 5 tiers and 75+ lessons · Anti-cheat quiz system requiring a perfect 30/30 score for certification · Globally stored, verifiable certificates with unique 9-character IDs · DMNZ meme token with full fair launch on Blum, April 2, 2027 · Massive buyback & burn on January 1, 2028 to reduce supply and increase value.",
    ],
  },
  {
    id: "vision-mission",
    num: "02",
    title: "Vision & Mission",
    icon: Zap,
    content: [
      "VISION: To democratize world-class trading education and build a global community of disciplined, knowledgeable traders who achieve financial independence through skill — not luck.",
      "MISSION: DemonZeno exists to bridge the gap between expensive, gatekept trading education and the millions of retail traders who lose money simply because they lack access to proper knowledge. We believe that the best edge in trading is education — and that edge should be free for everyone.",
      "We build the most comprehensive, challenging, and rewarding free trading education system in the world. We reward genuine learners with certificates of real prestige. We launch a community-first meme token that lives and dies by the strength of its community — not the promises of insiders.",
      "DemonZeno's guiding philosophy: 'The demons of trading are fear and greed. Know them. Control them.' Every feature, every lesson, every quiz question is designed to produce traders who trade with discipline, not emotion.",
    ],
  },
  {
    id: "problem-statement",
    num: "03",
    title: "Problem Statement",
    icon: Shield,
    content: [
      "THE EDUCATION PROBLEM: Most trading education is expensive, fragmented, and gatekept. Premium trading courses cost thousands of dollars. Free resources are shallow, scattered, or driven by affiliate incentives that prioritize broker commissions over genuine learning.",
      "THE KNOWLEDGE GAP: Studies consistently show that 70-90% of retail traders lose money — not because the market is rigged, but because they lack foundational knowledge. The gap between information and genuine understanding is where fortunes are lost.",
      "THE CERTIFICATION PROBLEM: Existing trading certifications are either academically rigid (CFA, CMT) and inaccessible to most retail traders, or they are worthless participation trophies that anyone can earn by clicking through slides. There is no middle ground — no free, rigorous, genuinely hard certification that proves a trader has real knowledge.",
      "THE TOKEN PROBLEM: The crypto space is saturated with meme tokens that enrich insiders at the expense of the community — presales, team allocations, and VC deals that dump on retail buyers. Community-first tokens are rare; fully fair launches are rarer still.",
    ],
  },
  {
    id: "solution",
    num: "04",
    title: "Solution: DemonZeno Trading Academy",
    icon: BookOpen,
    content: [
      "THE ACADEMY: A comprehensive, five-tier trading education system that takes learners from absolute zero to master level. Each tier covers a progressively deeper curriculum, with 15-20 deep, scenario-based lessons per tier. The full curriculum covers candlestick analysis, chart patterns (30+), technical indicators (RSI, MACD, Bollinger Bands, EMA, SMA, Fibonacci, Volume), risk management, position sizing, trading psychology, forex, crypto, stocks, futures, scalping, swing trading, long-term investing, and the DemonZeno signal methodology.",
      "TIER PROGRESSION: Beginner Tier — foundations of trading, candlestick basics, risk fundamentals, crypto/forex/stock market structure. Intermediate Tier — chart patterns, indicators, trend analysis, support/resistance, basic trading plans. Advanced Tier — advanced patterns, multi-timeframe analysis, position sizing, advanced risk management, trading psychology deep dive. Expert Tier — options basics, on-chain metrics, news trading, macro analysis, system building. Master Tier — full trading system integration, mentor-level pattern recognition, the DemonZeno methodology, advanced case studies.",
      "THE QUIZ & CERTIFICATE SYSTEM: Each tier ends with a 30-question randomized MCQ quiz drawn from a pool of 100+ questions per tier. Questions are scenario-based with deliberately close answer options to prevent AI assistance. A perfect 30/30 score is required to earn a certificate. No partial credit. No second chances on the same attempt. This deliberate difficulty ensures DemonZeno certificates carry real prestige.",
      "ZENO AI: An embedded AI learning assistant powered by Google Gemini, integrated directly into every lesson. Zeno AI answers trading education questions, explains lesson concepts on demand, and generates practice questions. It strictly focuses on trading education — off-topic queries are politely declined.",
      "CERTIFICATES: Every certificate is a premium image rendered like a physical award, featuring the recipient's full name, father's name, country, date of birth, city, a unique 9-character alphanumeric ID (e.g. A7K2X9P1Q), the tier name with a tier badge (gold for Master, silver for Expert, bronze for others), a 'Verified Learner' stamp, an issue timestamp, a DemonZeno watermark, and a QR code linking to the public verification page. All certificates are globally stored on the Internet Computer blockchain canister and are permanently verifiable by anyone.",
    ],
  },
  {
    id: "dmnz-token",
    num: "05",
    title: "DMNZ Token",
    icon: Flame,
    content: [
      "WHAT IS DMNZ: DemonZeno (DMNZ) is a meme token born from discipline, sacrifice, and the relentless pursuit of trading mastery. It is not a utility token. It is not a governance token. It is a community-first meme token that belongs to every trader who puts in the work — not to presale participants, not to VCs, not to insiders.",
      "FULL FAIR LAUNCH: DMNZ launches with a 100% fair launch model. There is no presale. No private sale. No team allocation. No VC reserve. No whitelist. Every participant buys at exactly the same price on April 2, 2027 through the Blum Mini App on Telegram. Your advantage is the DemonZeno Trading Academy — not a wallet that got in early.",
      "LAUNCH PLATFORM: DMNZ is created and launched via the Blum Telegram Mini App — a decentralized token launchpad and exchange built into the Telegram ecosystem. Blum enables fair token launches that are accessible to anyone with a Telegram account.",
      "ROADMAP — 2026: Community Building Year. Growing the DemonZeno presence on Binance Square with free daily trading education. Building a global community of disciplined traders who understand that knowledge is the edge. Establishing credibility and brand recognition as the go-to source for free trading education.",
      "ROADMAP — April 2, 2027: DMNZ is created and launched on Blum. 100% fair launch. No presale advantage. Everyone enters at the same price. The Trading Academy community provides the foundation — thousands of verified learners who understand the mission.",
      "ROADMAP — January 1, 2028: Massive DMNZ buyback and burn. A large-scale buyback of DMNZ from the open market followed by permanent token burn. This reduces circulating supply, creates deflationary pressure, increases scarcity, and drives the bonding curve toward activation — potentially qualifying DMNZ for broader exchange listings and increased liquidity.",
    ],
  },
  {
    id: "how-to-buy",
    num: "06",
    title: "How to Buy DMNZ",
    icon: Zap,
    content: [
      "STEP 1 — Follow @DemonZeno on Binance Square: Visit binance.com/square and follow @DemonZeno for all launch updates, daily trading insights, and DMNZ news. This is the official primary channel for all DMNZ announcements.",
      "STEP 2 — Open Blum Mini App on Telegram: Open Telegram, search for 'Blum', and launch the Blum Mini App. Blum is a Telegram-native decentralized launchpad and exchange. You need a Telegram account — that is the only requirement.",
      "STEP 3 — Find DemonZeno DMNZ: Inside the Blum Mini App, search for 'DemonZeno' or 'DMNZ' to locate the official token. Verify the token details match the official DMNZ before purchasing — always DYOR.",
      "STEP 4 — Buy and Hold: Purchase DMNZ at the fair launch price. Every buyer enters at the same price. There is no early-bird advantage. The only competitive edge is the knowledge earned through the DemonZeno Trading Academy.",
      "IMPORTANT: DemonZeno has no Telegram group or community channel. All official communication happens on Binance Square @DemonZeno and Twitter @ZenoDemon. Any Telegram group claiming to be the official DemonZeno community is not affiliated with the project.",
    ],
  },
  {
    id: "community",
    num: "07",
    title: "Community & Socials",
    icon: Globe,
    content: [
      "BINANCE SQUARE — @DemonZeno: The primary community hub for DemonZeno. Daily free trading education content, DMNZ updates, market analysis, and community engagement. Follow @DemonZeno on Binance Square to stay connected with the official channel. binance.com/en/square/profile/@DemonZeno",
      "TWITTER / X — @ZenoDemon: Official Twitter presence for DemonZeno. Token news, trading insights, community highlights, and milestone announcements. Follow @ZenoDemon for real-time updates. twitter.com/ZenoDemon",
      "COMMUNITY BUILDING PHASE (2026): The year 2026 is dedicated to building the strongest possible community before the DMNZ launch. Every follower, every Academy graduate, every verified learner is part of the DemonZeno community. Community strength is the only value that matters in a fair launch.",
      "DEMONZENO PRINCIPLES: 'Protect your capital like it's your life.' · 'The trend is your only friend.' · 'Patience is the sharpest weapon in a trader's arsenal.' · 'Every loss is tuition. Every win is validation.' · 'DMNZ: Born from darkness, forged in discipline.'",
    ],
  },
  {
    id: "legal",
    num: "08",
    title: "Legal Disclaimer",
    icon: Shield,
    content: [
      "MEME TOKEN DISCLAIMER: DMNZ (DemonZeno) is a meme token created for educational and entertainment purposes within the crypto community. It has no guaranteed utility, no promise of returns, and no institutional backing. Purchasing DMNZ is speculative and carries substantial risk of total loss.",
      "NOT FINANCIAL ADVICE: Nothing on the DemonZeno website, in the Trading Academy, in this whitepaper, or in any DemonZeno social media content constitutes financial advice, investment advice, or a solicitation to buy any financial instrument. All content is for educational and informational purposes only.",
      "DYOR — DO YOUR OWN RESEARCH: You are solely responsible for your own financial decisions. Before purchasing any cryptocurrency, including DMNZ, you should conduct your own thorough research, understand the risks involved, and consult with a qualified financial advisor if necessary.",
      "REGULATORY COMPLIANCE: Cryptocurrency regulations vary by jurisdiction. It is your responsibility to ensure that your participation in DMNZ complies with the laws and regulations of your jurisdiction. DemonZeno makes no representations or warranties regarding the legality of DMNZ in your country.",
      "RISK WARNING: Cryptocurrency markets are highly volatile. The value of DMNZ can decrease to zero. Past performance of any meme token is not indicative of future results. Never invest more than you can afford to lose entirely.",
    ],
  },
];

// ─── PDF Generator ───────────────────────────────────────────────────────────

function generateWhitepaperPDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const contentW = pageW - marginX * 2;
  let y = 0;

  const gold = [180, 148, 68] as const;
  const darkBg = [16, 18, 27] as const;
  const cardBg = [22, 24, 35] as const;
  const textMain = [230, 235, 245] as const;
  const textMuted = [140, 148, 165] as const;
  const primary = [46, 196, 182] as const;

  function ensureSpace(needed: number) {
    if (y + needed > pageH - 20) {
      doc.addPage();
      // page bg
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageW, pageH, "F");
      // subtle top bar
      doc.setFillColor(...gold);
      doc.rect(0, 0, pageW, 1.5, "F");
      // watermark
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      doc.text(
        "DemonZeno · DMNZ Official Whitepaper · Confidential",
        pageW / 2,
        pageH - 8,
        { align: "center" },
      );
      doc.setFont("helvetica", "normal");
      y = 20;
    }
  }

  // ── Cover page ──
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageW, pageH, "F");

  // Gold top bar
  doc.setFillColor(...gold);
  doc.rect(0, 0, pageW, 3, "F");

  // Gold accent rectangle
  doc.setFillColor(gold[0], gold[1], gold[2], 0.08);
  doc.setDrawColor(...gold);
  doc.roundedRect(marginX, 40, contentW, 140, 3, 3, "FD");

  // DMNZ Token label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text("DMNZ · OFFICIAL WHITEPAPER", pageW / 2, 58, { align: "center" });

  // Main title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(...textMain);
  doc.text("DemonZeno", pageW / 2, 80, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(...primary);
  doc.text("Trading Academy & DMNZ Token", pageW / 2, 92, { align: "center" });

  // Separator line
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(marginX + 20, 100, pageW - marginX - 20, 100);

  // Slogan
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(...textMuted);
  doc.text('"Trade Like a God. Hold Like a Demon."', pageW / 2, 112, {
    align: "center",
  });

  // Version / date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textMuted);
  doc.text(
    `Version 1.0  ·  ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    pageW / 2,
    125,
    { align: "center" },
  );
  doc.text("Not Financial Advice · DYOR", pageW / 2, 133, { align: "center" });

  // Bottom info box
  doc.setFillColor(...cardBg);
  doc.roundedRect(marginX, 190, contentW, 60, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...gold);
  doc.text("KEY FACTS", marginX + 10, 203);

  const facts = [
    ["Token", "DMNZ (DemonZeno)"],
    ["Launch Platform", "Blum Telegram Mini App"],
    ["Launch Date", "April 2, 2027"],
    ["Launch Type", "100% Full Fair Launch — No Presale"],
    ["Buyback & Burn", "January 1, 2028"],
    ["Socials", "Binance Square @DemonZeno · Twitter @ZenoDemon"],
  ] as const;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  let factY = 212;
  for (const [label, value] of facts) {
    doc.setTextColor(...textMuted);
    doc.text(`${label}:`, marginX + 10, factY);
    doc.setTextColor(...textMain);
    doc.text(value, marginX + 40, factY);
    factY += 7;
  }

  // Watermark
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text(
    "DemonZeno · DMNZ Official Whitepaper · Confidential",
    pageW / 2,
    pageH - 8,
    { align: "center" },
  );

  // ── Content pages ──
  for (const section of WP_SECTIONS) {
    doc.addPage();
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageW, pageH, "F");
    doc.setFillColor(...gold);
    doc.rect(0, 0, pageW, 1.5, "F");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(
      "DemonZeno · DMNZ Official Whitepaper · Confidential",
      pageW / 2,
      pageH - 8,
      { align: "center" },
    );

    y = 24;

    // Section number badge
    doc.setFillColor(gold[0], gold[1], gold[2], 0.12);
    doc.setDrawColor(...gold);
    doc.roundedRect(marginX, y - 5, 14, 8, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...gold);
    doc.text(section.num, marginX + 7, y + 0.5, { align: "center" });

    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...textMain);
    doc.text(section.title, marginX + 20, y + 1);
    y += 14;

    // Gold underline
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.4);
    doc.line(marginX, y, pageW - marginX, y);
    y += 8;

    // Content paragraphs
    for (const paragraph of section.content) {
      ensureSpace(30);

      // Check if it's a labelled paragraph (STEP X, LABEL:)
      const colonIdx = paragraph.indexOf(":");
      const label =
        colonIdx > 0 && colonIdx < 30 ? paragraph.slice(0, colonIdx) : null;
      const body = label ? paragraph.slice(colonIdx + 1).trim() : paragraph;

      if (label) {
        // Label in gold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...gold);
        doc.text(`${label}:`, marginX, y);
        y += 5;
      }

      // Body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...textMuted);

      const lines = doc.splitTextToSize(body, contentW);
      for (const line of lines as string[]) {
        ensureSpace(6);
        doc.text(line, marginX, y);
        y += 5;
      }
      y += 4;
    }
  }

  doc.save("DemonZeno-DMNZ-Whitepaper.pdf");
}

// ─── In-page section component ───────────────────────────────────────────────

function WPSectionCard({ section }: { section: (typeof WP_SECTIONS)[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div
      className={`bg-card rounded-2xl border transition-all duration-300 overflow-hidden ${
        open ? "border-primary/50" : "border-border hover:border-border/80"
      }`}
    >
      <button
        type="button"
        data-ocid={`whitepaper.section.${section.id}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 hover:bg-muted/20 transition-smooth"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-200 ${
              open
                ? "bg-primary/15 border-primary/40"
                : "bg-muted/40 border-border"
            }`}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                open ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-0.5">
              <span className="font-mono text-xs font-bold text-primary/60">
                {section.num}
              </span>
              <h3
                className={`font-display font-bold text-base md:text-lg transition-colors duration-200 truncate ${
                  open ? "text-primary" : "text-foreground"
                }`}
              >
                {section.title}
              </h3>
            </div>
            {!open && (
              <p className="text-xs text-muted-foreground truncate">
                {section.content[0].slice(0, 80)}…
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0">
          {open ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-400"
        style={{ maxHeight: open ? "2000px" : "0px" }}
      >
        <div className="px-6 pb-6 border-t border-border/50 pt-5 space-y-4">
          {section.content.map((paragraph, i) => {
            const colonIdx = paragraph.indexOf(":");
            const label =
              colonIdx > 0 && colonIdx < 35
                ? paragraph.slice(0, colonIdx)
                : null;
            const body = label
              ? paragraph.slice(colonIdx + 1).trim()
              : paragraph;

            return (
              <div key={`${section.id}-p-${i}`}>
                {label && (
                  <p className="font-display font-bold text-sm text-primary mb-1">
                    {label}
                  </p>
                )}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Whitepaper Preview Modal ────────────────────────────────────────────────

function WhitepaperModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-ocid="whitepaper.modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-base">
                DMNZ Official Whitepaper
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                v1.0 · Not Financial Advice · DYOR
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="whitepaper.modal.download_button"
              onClick={generateWhitepaperPDF}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-smooth"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              data-ocid="whitepaper.modal.close_button"
              onClick={onClose}
              aria-label="Close whitepaper"
              className="w-9 h-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center hover:bg-muted/70 transition-smooth"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Modal body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-3">
          {/* Cover card */}
          <div
            className="rounded-2xl border-2 border-primary/30 p-8 mb-6 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.01 260) 0%, oklch(0.22 0.02 190) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, oklch(0.7 0.18 70) 0%, transparent 60%), radial-gradient(circle at 80% 50%, oklch(0.65 0.15 190) 0%, transparent 60%)",
              }}
            />
            <div className="relative">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30 bg-primary/10 text-primary mb-4">
                DMNZ · Official Whitepaper
              </span>
              <h2 className="font-display font-black text-4xl text-foreground mb-2">
                DemonZeno
              </h2>
              <p className="text-lg text-primary font-semibold mb-4">
                Trading Academy & DMNZ Token
              </p>
              <p className="text-muted-foreground text-sm italic mb-6">
                &ldquo;Trade Like a God. Hold Like a Demon.&rdquo;
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span>
                  Version 1.0 ·{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
                <span>Not Financial Advice</span>
                <span>DYOR</span>
              </div>
            </div>
          </div>

          {/* Sections */}
          {WP_SECTIONS.map((section) => (
            <WPSectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main WhitepaperSection export ──────────────────────────────────────────

export function WhitepaperSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        id="whitepaper"
        data-ocid="whitepaper.section"
        className="py-12 bg-muted/20 border-y border-border"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          {/* ── Header ── */}
          <ScrollAnimation>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wide uppercase">
                  Official Document
                </span>
              </div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-4">
                DMNZ <span className="text-primary">Whitepaper</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                The complete official document covering the DemonZeno Trading
                Academy system, the DMNZ token, fair launch model, roadmap, and
                legal framework.
              </p>
            </div>
          </ScrollAnimation>

          {/* ── Preview card ── */}
          <ScrollAnimation delay={60}>
            <div
              data-ocid="whitepaper.preview_card"
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Cover strip */}
              <div
                className="relative px-8 py-10 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.18 0.01 260) 0%, oklch(0.20 0.02 190) 100%)",
                  borderBottom: "1px solid oklch(0.28 0.01 260)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-3xl text-foreground mb-1">
                      DemonZeno
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-2">
                      Official Whitepaper v1.0
                    </p>
                    <p className="text-muted-foreground text-sm italic">
                      &ldquo;Trade Like a God. Hold Like a Demon.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Section index */}
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-0 border-b border-border">
                {WP_SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.id}
                      className={`flex items-center gap-3 px-5 py-4 border-border ${
                        i < 4 ? "border-b sm:border-b-0" : ""
                      } ${
                        i % 4 !== 3 ? "sm:border-r" : ""
                      } bg-muted/20 hover:bg-muted/40 transition-smooth`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-primary/60 font-bold">
                          {section.num}
                        </p>
                        <p className="text-xs font-semibold text-foreground truncate">
                          {section.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA row */}
              <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-foreground text-sm">
                    8 Sections · Full Vision, Tokenomics & Legal
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Not Financial Advice · For Educational Purposes Only
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    data-ocid="whitepaper.read_button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm font-semibold hover:bg-muted/80 transition-smooth"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Online
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <button
                    type="button"
                    data-ocid="whitepaper.download_button"
                    onClick={generateWhitepaperPDF}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/20 hover:scale-[1.02] transition-smooth"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </ScrollAnimation>

          {/* ── Key highlights strip ── */}
          <ScrollAnimation delay={120}>
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Sword,
                  label: "Free Trading Education",
                  desc: "5 tiers, 75+ deep lessons, certificate system",
                },
                {
                  icon: Flame,
                  label: "100% Fair Launch",
                  desc: "No presale · No insiders · April 2, 2027 on Blum",
                },
                {
                  icon: Shield,
                  label: "Transparent & Honest",
                  desc: "Meme token · DYOR · Not financial advice",
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="bg-card rounded-xl p-5 border border-border flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-foreground text-sm mb-1">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && <WhitepaperModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
