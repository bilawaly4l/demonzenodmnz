import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Flame,
  MessageSquare,
  Radio,
  Shield,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useScrollAnimations } from "../components/Layout";

const WHAT_WILL_BE_SHARED = [
  "Holder milestones (1,000 holders, 5,000 holders, etc.)",
  "Bonding curve progress on Blum — where DMNZ stands at key intervals",
  "Buyback progress leading up to the January 2028 burn",
  "Burn countdown updates and burn wallet address when published",
  "DemonZeno's perspective on market conditions as they relate to DMNZ",
  "Any platform changes or important developments on Blum",
  "Post-burn supply data and on-chain verification links",
  "Community milestone acknowledgments from early believers",
];

const WHAT_WILL_NOT_BE_SHARED = [
  "Price predictions or specific targets",
  "Financial advice of any kind",
  "Coordinated buy calls or pump signals",
  "Speculative future roadmap items that are not confirmed",
  "Information shared through private groups, DMs, or unofficial channels",
  "Hype content with no factual basis",
];

const UPDATE_SCHEDULE = [
  {
    frequency: "WEEKLY",
    type: "REGULAR UPDATES",
    color: "var(--gold)",
    body: "Every week, DemonZeno posts a status update on Binance Square @Demon_Zeno covering DMNZ activity, holder growth, and any platform news. These are factual, not promotional.",
  },
  {
    frequency: "AS NEEDED",
    type: "MILESTONE ANNOUNCEMENTS",
    color: "var(--primary)",
    body: "When a significant milestone is reached — a holder count target, a bonding curve threshold, the burn wallet going live — a dedicated announcement is posted immediately on Binance Square.",
  },
  {
    frequency: "JANUARY 1, 2028",
    type: "BURN EVENT BROADCAST",
    color: "var(--primary)",
    body: "A dedicated live-update thread on Binance Square will cover the burn event start to finish: buyback confirmed, tokens transferred, burn transaction ID published, final supply numbers posted.",
  },
  {
    frequency: "POST-BURN ONWARD",
    type: "ONGOING COMMUNICATIONS",
    color: "var(--gold)",
    body: "After January 2028, the communication policy does not change. Weekly updates continue. Any new developments are announced publicly, not leaked through private channels.",
  },
];

const TRANSPARENCY_COMMITMENTS = [
  {
    label: "NO DISAPPEARING ACT",
    body: "DemonZeno will not go silent after launch. Regular weekly posts on Binance Square will continue regardless of whether the market is up or down.",
  },
  {
    label: "NO PRIVATE CHANNELS",
    body: "There are no paid groups, VIP channels, or private Telegram chats for DMNZ. Anyone claiming otherwise is running a scam. All information is public.",
  },
  {
    label: "NO INSIDER INFORMATION",
    body: "DemonZeno will not share information privately before it is posted publicly on Binance Square. Early access to updates does not exist in this project.",
  },
  {
    label: "BAD NEWS INCLUDED",
    body: "If DMNZ faces challenges — slow growth, platform issues, delays — DemonZeno will post about it honestly. Silence is not an option. Holders deserve the truth.",
  },
];

export function PostLaunchPlan() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Post-Launch Communication Plan — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="post_launch_plan.page"
    >
      <div
        style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container mx-auto px-4 py-16 max-w-4xl">
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
            data-ocid="post_launch_plan.back_link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <div className="scroll-anim">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4" style={{ color: "var(--primary)" }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--primary)" }}
              >
                Official Policy
              </span>
            </div>
            <h1 className="heading-xl mt-2 mb-5">
              POST-LAUNCH COMMUNICATION PLAN
            </h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              This document defines exactly how DemonZeno will communicate after
              April 2, 2027 — what channels are official, what will be shared,
              what will never be shared, and what holders can expect.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl flex flex-col gap-16">
        <section
          className="scroll-anim"
          data-ocid="post_launch_plan.channels_section"
        >
          <h2 className="heading-lg mb-3">OFFICIAL CHANNELS ONLY</h2>
          <p
            className="text-base mb-8 max-w-2xl"
            style={{ color: "var(--muted-foreground)" }}
          >
            All communications about DMNZ come exclusively through two verified
            sources. Any other account, group, or channel claiming to represent
            DemonZeno or DMNZ is unofficial and should not be trusted.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="card-dmnz-accent flex flex-col gap-4"
              data-ocid="post_launch_plan.binance_channel_card"
            >
              <div className="flex items-center gap-3">
                <MessageSquare
                  className="w-5 h-5"
                  style={{ color: "var(--gold)" }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--gold)" }}
                >
                  Primary Channel
                </span>
              </div>
              <h3
                className="text-base font-bold uppercase tracking-wide"
                style={{ color: "var(--foreground)" }}
              >
                Binance Square
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                All official updates, milestones, burn announcements, and market
                commentary will be posted here first. This is the primary and
                most important communication channel for DMNZ.
              </p>
              <a
                href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold uppercase tracking-wide transition-smooth"
                style={{ color: "var(--primary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--gold)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--primary)";
                }}
                data-ocid="post_launch_plan.binance_link"
              >
                @Demon_Zeno on Binance Square
              </a>
            </div>
            <div
              className="card-dmnz flex flex-col gap-4"
              data-ocid="post_launch_plan.twitter_channel_card"
            >
              <div className="flex items-center gap-3">
                <Bell
                  className="w-5 h-5"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Secondary Channel
                </span>
              </div>
              <h3
                className="text-base font-bold uppercase tracking-wide"
                style={{ color: "var(--foreground)" }}
              >
                Twitter / X
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                Major announcements may also be mirrored to Twitter. Binance
                Square remains the primary source of truth. In case of
                conflicting information, Binance Square takes precedence.
              </p>
              <a
                href="https://twitter.com/ZenoDemon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold uppercase tracking-wide transition-smooth"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--foreground)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--muted-foreground)";
                }}
                data-ocid="post_launch_plan.twitter_link"
              >
                @ZenoDemon on Twitter
              </a>
            </div>
          </div>
        </section>

        <section
          className="scroll-anim"
          data-ocid="post_launch_plan.schedule_section"
        >
          <h2 className="heading-lg mb-8">UPDATE SCHEDULE</h2>
          <div className="flex flex-col gap-0">
            {UPDATE_SCHEDULE.map((item, i) => (
              <div
                key={item.type}
                className="flex gap-5"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  {i < UPDATE_SCHEDULE.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{
                        background: "var(--border)",
                        minHeight: "2.5rem",
                      }}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <p
                    className="text-xs font-mono font-bold uppercase tracking-widest mb-1"
                    style={{ color: item.color }}
                  >
                    {item.frequency}
                  </p>
                  <h3
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {item.type}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="scroll-anim"
          data-ocid="post_launch_plan.content_section"
        >
          <h2 className="heading-lg mb-8">WHAT WILL AND WILL NOT BE SHARED</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-dmnz flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle
                  className="w-4 h-4"
                  style={{ color: "var(--gold)" }}
                />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--gold)" }}
                >
                  Will Be Shared
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {WHAT_WILL_BE_SHARED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "var(--gold)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dmnz flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle
                  className="w-4 h-4"
                  style={{ color: "var(--muted-foreground)" }}
                />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Will Never Be Shared
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {WHAT_WILL_NOT_BE_SHARED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "var(--border)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="scroll-anim"
          data-ocid="post_launch_plan.commitment_section"
        >
          <h2 className="heading-lg mb-2">COMMITMENT TO TRANSPARENCY</h2>
          <p
            className="text-base mb-6 max-w-2xl"
            style={{ color: "var(--muted-foreground)" }}
          >
            This is a written commitment from DemonZeno. It is public,
            permanent, and will be held to account.
          </p>
          <div className="card-dmnz-accent">
            <div className="flex flex-col gap-5">
              {TRANSPARENCY_COMMITMENTS.map(({ label, body }) => (
                <div key={label} className="flex gap-4">
                  <Shield
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "var(--primary)" }}
                  />
                  <div>
                    <h3
                      className="text-sm font-bold uppercase tracking-wide mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {label}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="scroll-anim"
          data-ocid="post_launch_plan.fakes_section"
        >
          <div className="card-dmnz">
            <h3
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "var(--foreground)" }}
            >
              REPORT UNOFFICIAL CHANNELS
            </h3>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              If you encounter any account, group, or individual claiming to be
              DemonZeno or an official DMNZ representative through any channel
              other than Binance Square @Demon_Zeno or Twitter @ZenoDemon,
              report it and do not engage. These are scams.
            </p>
            <a
              href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
              data-ocid="post_launch_plan.verify_cta"
            >
              Verify the Real @Demon_Zeno on Binance Square
            </a>
          </div>
        </section>

        <div
          className="text-xs text-center pb-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          DMNZ is a meme coin. This communication policy is a good-faith
          commitment, not a legal contract. Do your own research.
        </div>

        {/* BURN EVENT PREVIEW — merged from BurnEventPreview.tsx */}
        <section
          className="scroll-anim"
          id="burn-event"
          data-ocid="post_launch_plan.burn_event_section"
        >
          <div
            className="flex items-center gap-2 mb-3 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <Flame className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--primary)" }}
            >
              January 1, 2028
            </span>
          </div>
          <h2 className="heading-lg mb-5">BURN EVENT PREVIEW</h2>
          <p
            className="text-base mb-10 max-w-2xl"
            style={{ color: "var(--muted-foreground)" }}
          >
            The January 2028 DMNZ burn is not hype — it is a pre-committed,
            publicly accountable event. Here is exactly what will happen, how it
            will happen, and why it matters.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: (
                  <Flame
                    className="w-5 h-5"
                    style={{ color: "var(--primary)" }}
                  />
                ),
                title: "PERMANENT DESTRUCTION",
                body: "Tokens sent to a burn wallet are gone forever. No private key exists — they cannot be spent, recovered, or reused under any circumstance.",
              },
              {
                icon: (
                  <TrendingDown
                    className="w-5 h-5"
                    style={{ color: "var(--gold)" }}
                  />
                ),
                title: "SUPPLY REDUCTION",
                body: "When tokens are burned, circulating supply decreases. Each remaining DMNZ token represents a larger share of the total supply.",
              },
              {
                icon: (
                  <Shield
                    className="w-5 h-5"
                    style={{ color: "var(--gold)" }}
                  />
                ),
                title: "FULLY VERIFIABLE",
                body: "Every burn transaction is publicly recorded on-chain. The community can verify the exact number burned, the wallet address, and transaction ID.",
              },
            ].map((card) => (
              <div key={card.title} className="card-dmnz flex flex-col gap-3">
                {card.icon}
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: "var(--foreground)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* Burn Timeline */}
          <h3 className="heading-md mb-6">STEP-BY-STEP BURN TIMELINE</h3>
          <div className="flex flex-col gap-0">
            {[
              {
                time: "SEPTEMBER – DECEMBER 2027",
                title: "BUYBACK PHASE",
                color: "var(--gold)",
                detail:
                  "DemonZeno begins purchasing DMNZ tokens from the open market on Blum. Every buyback transaction is posted publicly on Binance Square @Demon_Zeno.",
              },
              {
                time: "DECEMBER 2027",
                title: "BURN WALLET PUBLISHED",
                color: "var(--gold)",
                detail:
                  "The official DMNZ burn wallet address is published publicly before the burn begins. Anyone can verify it is a provably dead address — no private key, no recovery.",
              },
              {
                time: "JANUARY 1, 2028 — MIDNIGHT UTC",
                title: "THE BURN EXECUTES",
                color: "var(--primary)",
                detail:
                  "All accumulated DMNZ tokens are sent to the burn wallet. The transaction is broadcast on-chain and posted live to Binance Square. No reversal. No recovery. Irreversible.",
              },
              {
                time: "JANUARY 1, 2028 — AFTER BURN",
                title: "VERIFICATION WINDOW",
                color: "var(--primary)",
                detail:
                  "A 24-hour community verification window opens. Anyone can examine the burn transaction: total tokens burned, remaining supply, burn wallet address, and transaction ID.",
              },
              {
                time: "JANUARY 2028 ONWARD",
                title: "POST-BURN ERA",
                color: "var(--gold)",
                detail:
                  "With reduced supply, each remaining DMNZ token represents a larger fraction of the total. DemonZeno continues posting. The community continues.",
              },
            ].map((phase, i, arr) => (
              <div key={phase.time} className="flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                    style={{ background: phase.color }}
                  />
                  {i < arr.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{
                        background: "var(--border)",
                        minHeight: "2.5rem",
                      }}
                    />
                  )}
                </div>
                <div className="pb-8">
                  <p
                    className="text-xs font-mono font-bold uppercase tracking-widest mb-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {phase.time}
                  </p>
                  <h4
                    className="text-sm font-bold uppercase tracking-wide mb-2"
                    style={{ color: phase.color }}
                  >
                    {phase.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {phase.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="card-dmnz-accent text-center py-10 px-6 mt-8"
            style={{ borderColor: "var(--primary-border)" }}
          >
            <Flame
              className="w-8 h-8 mx-auto mb-4"
              style={{ color: "var(--primary)" }}
            />
            <h3
              className="font-display font-black text-xl uppercase tracking-tight mb-3"
              style={{ color: "var(--foreground)" }}
            >
              STAY INFORMED. STAY READY.
            </h3>
            <p
              className="text-sm mb-6 max-w-lg mx-auto"
              style={{ color: "var(--muted-foreground)" }}
            >
              All burn updates will be posted exclusively on the official
              Binance Square account. Follow now.
            </p>
            <a
              href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              data-ocid="post_launch_plan.burn_binance_cta"
            >
              Follow @Demon_Zeno on Binance Square
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
