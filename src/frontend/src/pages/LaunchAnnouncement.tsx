import { Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Rocket } from "lucide-react";
import { useEffect } from "react";
import { SiBinance } from "react-icons/si";
import { useScrollAnimations } from "../components/Layout";

const STEPS = [
  {
    step: "01",
    title: "FOLLOW @Demon_Zeno",
    body: "On Binance Square. This is where the official launch post drops on April 2, 2027. Don't miss it.",
    link: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
    linkLabel: "Follow Now",
  },
  {
    step: "02",
    title: "OPEN BLUM MINI APP",
    body: "Blum is a Telegram Mini App. Open Telegram, find the Blum bot, and have it ready before launch day.",
    link: "https://t.me/blum",
    linkLabel: "Get Blum",
  },
  {
    step: "03",
    title: "FIND DEMONZENO DMNZ",
    body: "Search for DemonZeno or DMNZ inside Blum on launch day. The token goes live at midnight UTC April 2, 2027.",
  },
  {
    step: "04",
    title: "BUY AT THE BONDING CURVE",
    body: "Price starts at the bottom of the bonding curve. Early buyers get the lowest price. There is no presale — everyone starts equal on launch day.",
  },
];

const EXPECTATIONS = [
  {
    label: "PRICE AT LAUNCH",
    body: "Price is NOT set by DemonZeno. Blum's bonding curve determines it. Early buyers get lower prices. Price rises as more people buy.",
  },
  {
    label: "VOLUME AT LAUNCH",
    body: "Volume depends entirely on how many people buy. No guarantees, no artificial pumps. What the community builds is what it is.",
  },
  {
    label: "NO PRESALE",
    body: "Nobody got in early. No team tokens. No whale wallets pre-loaded. Every buyer on April 2, 2027 is starting from the same position.",
  },
  {
    label: "THE BURN EVENT",
    body: "January 1, 2028 — DemonZeno conducts a major buyback and burn, reducing circulating supply and pushing toward the bonding curve milestone.",
  },
];

export function LaunchAnnouncement() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "April 2, 2027 — DMNZ Launch — DemonZeno";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="launch_announcement.page"
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
              <Calendar
                className="w-4 h-4"
                style={{ color: "var(--primary)" }}
              />
              <span className="label-uppercase text-crimson">
                Official Launch Announcement
              </span>
            </div>
            <h1 className="heading-xl mt-2 mb-3">APRIL 2, 2027</h1>
            <p
              className="text-2xl font-bold mb-5"
              style={{ color: "var(--primary)" }}
            >
              DMNZ launches on Blum.
            </p>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              No presale. No team allocation. No insider advantage. The first
              fair-launch meme token created by DemonZeno goes live for everyone
              at the same moment.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="scroll-anim mb-8">
          <div className="flex items-center gap-2 mb-8">
            <Rocket className="w-4 h-4" style={{ color: "var(--primary)" }} />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--foreground)", letterSpacing: "0.14em" }}
            >
              HOW TO BUY ON LAUNCH DAY
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-16">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-mono font-black text-2xl flex-shrink-0 leading-none mt-0.5"
                  style={{ color: "var(--primary)" }}
                >
                  {s.step}
                </span>
                <div>
                  <h3
                    className="text-sm font-bold uppercase tracking-widest mb-2"
                    style={{
                      color: "var(--foreground)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {s.body}
                  </p>
                  {s.link && (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                    >
                      <SiBinance className="w-3.5 h-3.5" />
                      {s.linkLabel}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-8">
          <h2
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--foreground)", letterSpacing: "0.14em" }}
          >
            WHAT TO EXPECT ON LAUNCH DAY
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXPECTATIONS.map((exp, i) => (
            <div
              key={exp.label}
              className="scroll-anim card-dmnz"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--primary)", letterSpacing: "0.14em" }}
              >
                {exp.label}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {exp.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
