import { Outlet } from "@tanstack/react-router";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Coins,
  Home,
  Menu,
  Twitter,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SiBinance } from "react-icons/si";
import { useAnnouncementBanner } from "../hooks/useAcademy";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Academy", href: "#academy", isRoute: false, section: "academy" },
  { label: "Certificate Wall", href: "/certificates", isRoute: true },
  {
    label: "DMNZ Token",
    href: "#dmnz-token",
    isRoute: false,
    section: "dmnz-token",
  },
];

const FOOTER_NAV = [
  { label: "Academy", href: "#academy" },
  { label: "Certificate Wall", href: "/certificates" },
  { label: "DMNZ Token", href: "#dmnz-token" },
  { label: "Roadmap", href: "#roadmap" },
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

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: "smooth" });
}

function AnnouncementBar() {
  const { data: banner } = useAnnouncementBanner();
  const [dismissed, setDismissed] = useState(false);

  if (!banner?.isPinned || dismissed) return null;

  return (
    <div
      data-ocid="announcement.panel"
      className="bg-primary/10 border-b border-primary/20 text-foreground"
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <p className="text-sm text-center flex-1 font-medium text-primary">
          {banner.text}
        </p>
        <button
          type="button"
          data-ocid="announcement.close_button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 p-1 rounded hover:bg-primary/20 transition-smooth text-primary/70 hover:text-primary"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Navbar({ themeToggle }: { themeToggle?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === "/";

  // scroll listener
  useState(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  function handleNavClick(link: (typeof NAV_LINKS)[0]) {
    setMobileOpen(false);
    if (!link.isRoute && link.href.startsWith("#")) {
      if (!isHome) {
        window.location.href = `/${link.href}`;
      } else {
        scrollToSection(link.href);
      }
    }
  }

  return (
    <header
      data-ocid="navbar.panel"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-card/80 backdrop-blur-sm border-b border-border/50"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          data-ocid="navbar.home.link"
          className="flex items-center gap-2 group"
          aria-label="DemonZeno home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-smooth">
            <Zap
              className="w-4 h-4 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Demon<span className="text-primary">Zeno</span>
          </span>
          <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border hidden sm:inline">
            DMNZ
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isCurrent = link.isRoute
              ? routerState.location.pathname === link.href
              : false;

            if (link.isRoute) {
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    data-ocid={`navbar.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                      isCurrent
                        ? "nav-link-active"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label === "Certificate Wall" && (
                      <Award className="w-3.5 h-3.5" />
                    )}
                    {link.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={link.href}>
                <button
                  type="button"
                  data-ocid={`navbar.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  onClick={() => handleNavClick(link)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.label === "Academy" && (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                  {link.label === "DMNZ Token" && (
                    <Coins className="w-3.5 h-3.5" />
                  )}
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          {themeToggle}
          <button
            type="button"
            data-ocid="navbar.mobile_menu.toggle"
            className="md:hidden p-2 rounded-md hover:bg-muted transition-smooth"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              if (link.isRoute) {
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      data-ocid={`navbar.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      {link.label === "Home" && <Home className="w-4 h-4" />}
                      {link.label === "Certificate Wall" && (
                        <Award className="w-4 h-4" />
                      )}
                      {link.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={`navbar.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    {link.label === "Academy" && (
                      <BookOpen className="w-4 h-4" />
                    )}
                    {link.label === "DMNZ Token" && (
                      <Coins className="w-4 h-4" />
                    )}
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer data-ocid="footer.panel" className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col gap-4 md:col-span-1">
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
              "Master the chart, master yourself. Born from darkness, forged in
              discipline."
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
              Trading education for informational purposes only. Not financial
              advice.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Navigate
            </p>
            {FOOTER_NAV.map(({ label, href }) => (
              <button
                key={href}
                type="button"
                data-ocid={`footer.nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                onClick={() => {
                  if (href.startsWith("#")) {
                    document
                      .querySelector(href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = href;
                  }
                }}
                className="text-muted-foreground text-sm hover:text-primary transition-smooth text-left w-fit"
              >
                {label}
              </button>
            ))}
          </div>

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
          <p className="text-muted-foreground text-xs">
            DemonZeno Trading Academy — DMNZ Token
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar themeToggle={<ThemeToggle />} />
      <AnnouncementBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
