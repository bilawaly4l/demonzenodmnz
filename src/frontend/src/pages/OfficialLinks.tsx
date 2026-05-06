import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import { useEffect } from "react";
import { SiBinance } from "react-icons/si";
import { useScrollAnimations } from "../components/Layout";

const CHANNELS = [
  {
    icon: <SiBinance className="w-5 h-5" />,
    name: "Binance Square",
    handle: "@Demon_Zeno",
    url: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
    description:
      "The primary official channel. All announcements, updates, and community posts originate here.",
    status: "VERIFIED",
  },
  {
    icon: <span className="text-sm font-black">BLUM</span>,
    name: "Blum Mini App",
    handle: "DemonZeno DMNZ",
    url: "https://t.me/blum",
    description:
      "The exclusive launch platform for DMNZ. Only buy DMNZ through the official Blum Mini App on Telegram.",
    status: "LAUNCH PLATFORM",
  },
];

const FAKES = [
  "Any Telegram group claiming to be official DMNZ",
  "Any Twitter account other than @ZenoDemon posting about DMNZ deals",
  "Any website offering DMNZ presale, early access, or guaranteed tokens",
  "Any person DM-ing you about DMNZ investments or airdrop claims",
  "Any exchange listing DMNZ before April 2, 2027",
];

export function OfficialLinks() {
  useScrollAnimations();

  useEffect(() => {
    document.title = "Official Links — DemonZeno DMNZ";
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
      data-ocid="official_links.page"
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
            <span className="label-uppercase text-crimson">Verified Only</span>
            <h1 className="heading-xl mt-3 mb-5">OFFICIAL LINKS</h1>
            <p
              className="text-lg max-w-2xl leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              Every verified DMNZ channel. Nothing else is real. If it is not on
              this page, it is fake.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="flex flex-col gap-4 mb-14">
          {CHANNELS.map((ch, i) => (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`official_links.channel.item.${i + 1}`}
              className="scroll-anim block card-dmnz transition-smooth"
              style={{
                border: "1px solid var(--border)",
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--border)";
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--primary)" }}>{ch.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-bold text-base"
                        style={{ color: "var(--foreground)" }}
                      >
                        {ch.name}
                      </span>
                      <span className="badge-success">{ch.status}</span>
                    </div>
                    <p
                      className="text-sm font-mono"
                      style={{ color: "var(--primary)" }}
                    >
                      {ch.handle}
                    </p>
                  </div>
                </div>
                <ExternalLink
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                />
              </div>
              <p
                className="text-sm mt-4 leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                {ch.description}
              </p>
            </a>
          ))}
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
          <div className="flex items-center gap-3 mb-5">
            <ShieldAlert
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "var(--primary)" }}
            />
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--primary)", letterSpacing: "0.14em" }}
            >
              BEWARE OF FAKES
            </h2>
          </div>
          <p
            className="text-sm mb-4 leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Scammers create fake accounts and channels using the DMNZ name. The
            following do NOT exist and are all scams:
          </p>
          <ul className="flex flex-col gap-2">
            {FAKES.map((fake) => (
              <li
                key={fake}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--muted-foreground)" }}
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                {fake}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
