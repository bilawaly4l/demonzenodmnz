import { Outlet, useNavigate } from "@tanstack/react-router";
import { Twitter, Zap } from "lucide-react";
import { SiBinance } from "react-icons/si";
import { useSession } from "../contexts/SessionContext";
import { AdminPasscodeModal } from "./AdminPasscodeModal";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { BackToTop } from "./BackToTop";
import { Navbar } from "./Navbar";
import { ScrollProgress } from "./ScrollProgress";

const NAV_LINKS = [
  ["Signals", "#signals"],
  ["Markets", "#markets"],
  ["DMNZ Token", "#token"],
  ["Roadmap", "#roadmap"],
  ["FAQ", "#faq"],
];

const SOCIAL_LINKS = [
  {
    icon: <SiBinance className="w-4 h-4" />,
    label: "Binance Square",
    handle: "@DemonZeno",
    url: "https://www.binance.com/en/square/profile/@DemonZeno",
  },
  {
    icon: <Twitter className="w-4 h-4" />,
    label: "Twitter / X",
    handle: "@ZenoDemon",
    url: "https://twitter.com/ZenoDemon",
  },
];

function Footer() {
  const { setSessionToken } = useSession();
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer data-ocid="footer.panel" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap
                  className="w-4 h-4 text-primary-foreground"
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-display font-bold text-foreground text-lg">
                Demon<span className="text-primary">Zeno</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                DMNZ
              </span>
            </div>
            <p className="text-muted-foreground text-sm italic font-medium leading-relaxed max-w-sm">
              "DemonZeno: Master the Chaos, Slay the Market, and Trade Like a
              God."
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              Signals are for informational purposes only. This is not financial
              advice. Cryptocurrency and trading involve significant risk.
            </p>
          </div>

          {/* Navigate */}
          <div className="flex flex-col gap-3">
            <p className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Navigate
            </p>
            {NAV_LINKS.map(([label, href]) => (
              <button
                key={href}
                type="button"
                data-ocid={`footer.nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                onClick={() =>
                  document
                    .querySelector(href)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-muted-foreground text-sm hover:text-primary transition-smooth text-left w-fit"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Social — only Binance Square & Twitter */}
          <div className="flex flex-col gap-3">
            <p className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Follow
            </p>
            {SOCIAL_LINKS.map(({ icon, label, handle, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`footer.social.${label.toLowerCase().replace(/\s+\/\s+|\s+/g, "_")}.link`}
                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-smooth w-fit"
              >
                <span className="text-primary/70">{icon}</span>
                <span>{handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth"
            >
              Built with love using caffeine.ai
            </a>
          </p>
          {/* Hidden admin trigger */}
          <label
            htmlFor="admin-phrase-trigger"
            className="text-muted-foreground/20 text-xs cursor-default select-none hover:text-muted-foreground/40 transition-smooth"
            aria-hidden="true"
          >
            ·
          </label>
        </div>
      </div>

      <AdminPasscodeModal
        onSuccess={(token) => {
          setSessionToken(token);
          navigate({ to: "/admin" });
        }}
      />
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollProgress />
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
