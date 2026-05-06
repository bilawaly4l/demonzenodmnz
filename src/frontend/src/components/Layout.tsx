import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Coins,
  Crown,
  ExternalLink,
  Flame,
  Menu,
  Rocket,
  Shield,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiBinance } from "react-icons/si";
import { BackToTop } from "./BackToTop";
import { CountdownBar } from "./CountdownBar";
import { ScrollProgress } from "./ScrollProgress";

const NAV_LINKS = [
  {
    label: "Token",
    href: "#token",
    isRoute: false,
    icon: <Coins className="w-3.5 h-3.5" />,
  },
  {
    label: "Story",
    href: "#story",
    isRoute: false,
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  {
    label: "Community",
    href: "#community",
    isRoute: false,
    icon: <Users className="w-3.5 h-3.5" />,
  },
  {
    label: "D-Day",
    href: "#dday",
    isRoute: false,
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  {
    label: "Roadmap",
    href: "#roadmap",
    isRoute: false,
    icon: <Rocket className="w-3.5 h-3.5" />,
  },
];

const MORE_LINKS = [
  {
    label: "Transparency",
    href: "/transparency",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  {
    label: "Why DemonZeno",
    href: "/why-demonzeno",
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  {
    label: "Official Links",
    href: "/official-links",
    icon: <ExternalLink className="w-3.5 h-3.5" />,
  },
  {
    label: "Launch April 2, 2027",
    href: "/launch",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  {
    label: "Post-Launch & Burn",
    href: "/post-launch",
    icon: <Rocket className="w-3.5 h-3.5" />,
  },
  {
    label: "Community Guidelines",
    href: "/community-guidelines",
    icon: <Users className="w-3.5 h-3.5" />,
  },
  {
    label: "Risk Disclosure",
    href: "/risk-disclosure",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  {
    label: "Legal Disclaimer",
    href: "/legal",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  {
    label: "Lessons from Failures",
    href: "/lessons-from-failures",
    icon: <Coins className="w-3.5 h-3.5" />,
  },
  {
    label: "Changelog",
    href: "/changelog",
    icon: <Coins className="w-3.5 h-3.5" />,
  },
];

const FOOTER_OFFICIAL = [
  { label: "Official Links", href: "/official-links", external: false },
  { label: "Launch Announcement", href: "/launch", external: false },
  { label: "Post-Launch & Burn Plan", href: "/post-launch", external: false },
  {
    label: "Binance Square @Demon_Zeno",
    href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
    external: true,
  },
];

const FOOTER_LEGAL = [
  { label: "Legal Disclaimer", href: "/legal" },
  { label: "Risk Disclosure", href: "/risk-disclosure" },
  { label: "Community Guidelines", href: "/community-guidelines" },
  { label: "Changelog", href: "/changelog" },
];

const FOOTER_ABOUT = [
  { label: "Transparency", href: "/transparency" },
  { label: "Why DemonZeno?", href: "/why-demonzeno" },
  { label: "Lessons from Failures", href: "/lessons-from-failures" },
];

const SOCIAL_LINKS = [
  {
    icon: <SiBinance className="w-4 h-4" />,
    label: "@Demon_Zeno on Binance Square",
    href: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
  },
  {
    icon: <Twitter className="w-4 h-4" />,
    label: "@ZenoDemon on Twitter",
    href: "https://twitter.com/ZenoDemon",
  },
];

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

/** Global IntersectionObserver that adds `is-visible` to .scroll-anim elements */
export function useScrollAnimations() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
    );

    const targets = document.querySelectorAll(
      ".scroll-anim, .scroll-anim-left, .scroll-anim-right",
    );
    for (const el of targets) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);
  const routerState = useRouterState();
  const isHome = routerState.location.pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [moreOpen]);

  function handleNavClick(link: { href: string; isRoute: boolean }) {
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
      className={`sticky top-0 z-40 w-full transition-smooth ${
        scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-card/80 backdrop-blur-sm border-b border-[rgba(255,255,255,0.04)]"
      }`}
      style={
        scrolled ? { boxShadow: "0 1px 0 rgba(220,20,60,0.12)" } : undefined
      }
    >
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="navbar.home.link"
          className="flex items-center gap-2 group"
          aria-label="DemonZeno home"
        >
          <div
            className="w-7 h-7 flex items-center justify-center"
            style={{ background: "var(--primary)", borderRadius: "2px" }}
          >
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
          <span
            className="font-display font-black text-base tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            DEMON<span style={{ color: "var(--primary)" }}>ZENO</span>
          </span>
          <span
            className="text-xs font-mono hidden sm:inline px-1.5 py-0.5"
            style={{
              color: "var(--muted-foreground)",
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: "2px",
              letterSpacing: "0.08em",
            }}
          >
            DMNZ
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                data-ocid={`navbar.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                onClick={() => handleNavClick(link)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-smooth"
                style={{
                  color: "var(--muted-foreground)",
                  letterSpacing: "0.1em",
                  borderRadius: "2px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--foreground)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--muted)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--muted-foreground)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                {link.icon}
                {link.label}
              </button>
            </li>
          ))}

          {/* More dropdown */}
          <li ref={moreRef} className="relative">
            <button
              type="button"
              data-ocid="navbar.more.toggle"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-smooth"
              style={{
                color: moreOpen ? "var(--primary)" : "var(--muted-foreground)",
                letterSpacing: "0.1em",
                borderRadius: "2px",
              }}
            >
              More
              <ChevronDown
                className="w-3 h-3 transition-smooth"
                style={{
                  transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {moreOpen && (
              <div
                data-ocid="navbar.more.dropdown"
                className="absolute top-full right-0 mt-1 min-w-[220px] py-1 z-50"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  boxShadow: "var(--shadow-elevated)",
                }}
              >
                {MORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href as "/"}
                    onClick={() => setMoreOpen(false)}
                    data-ocid={`navbar.more.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-smooth w-full"
                    style={{
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.08em",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--foreground)";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--muted)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--muted-foreground)";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                    }}
                  >
                    <span style={{ color: "var(--primary)" }}>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="navbar.follow.link"
            className="hidden md:flex items-center gap-1.5 btn-primary text-xs py-1.5 px-3"
          >
            <SiBinance className="w-3.5 h-3.5" />
            Follow
          </a>
          <button
            type="button"
            data-ocid="navbar.mobile_menu.toggle"
            className="md:hidden p-2 transition-smooth"
            style={{ borderRadius: "2px" }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--muted)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-slideDown"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          <ul className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  type="button"
                  data-ocid={`navbar.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  onClick={() => handleNavClick(link)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-smooth"
                  style={{
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.1em",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--foreground)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "var(--muted)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--muted-foreground)";
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                  }}
                >
                  {link.icon}
                  {link.label}
                </button>
              </li>
            ))}
            <li
              className="pt-1"
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: "0.25rem",
              }}
            >
              <p
                className="px-3 py-1.5 text-xs uppercase tracking-widest"
                style={{ color: "#444444", letterSpacing: "0.14em" }}
              >
                More Pages
              </p>
            </li>
            {MORE_LINKS.slice(0, 6).map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href as "/"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-smooth"
                  style={{
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.08em",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--foreground)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "var(--muted)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--muted-foreground)";
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                  }}
                >
                  <span style={{ color: "var(--primary)" }}>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
            <li
              className="mt-2 pt-2"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <a
                href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center py-2.5"
              >
                Follow @Demon_Zeno
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function FooterNavLink({
  href,
  label,
  external,
}: { href: string; label: string; external?: boolean }) {
  const base = {
    color: "var(--muted-foreground)" as const,
    fontSize: "0.8125rem",
    fontWeight: 500,
    display: "block" as const,
    width: "fit-content",
    transition: "color 0.25s ease-out",
  };
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={base}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color =
            "var(--muted-foreground)";
        }}
      >
        {label}
      </a>
    );
  }
  return (
    <Link
      to={href as "/"}
      style={base}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color =
          "var(--muted-foreground)";
      }}
    >
      {label}
    </Link>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer
      data-ocid="footer.panel"
      style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, var(--primary) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ background: "var(--primary)", borderRadius: "2px" }}
              >
                <Zap className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="font-display font-black text-sm tracking-tight">
                DEMON<span style={{ color: "var(--primary)" }}>ZENO</span>
              </span>
              <span
                className="text-xs font-mono px-1.5 py-0.5"
                style={{
                  color: "var(--muted-foreground)",
                  background: "var(--muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                }}
              >
                DMNZ
              </span>
            </div>
            <p
              className="text-xs leading-relaxed max-w-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              A fair-launch meme token on Blum Mini App. No presale. No team
              allocation. Launching April 2, 2027.
            </p>
            <div
              className="text-xs px-2.5 py-1.5"
              style={{
                background: "rgba(220,20,60,0.06)",
                border: "1px solid rgba(220,20,60,0.2)",
                borderRadius: "2px",
                color: "var(--muted-foreground)",
              }}
            >
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                WARNING — FAKES EXIST:
              </span>{" "}
              Only @Demon_Zeno on Binance Square is real.
            </div>
          </div>

          {/* Official Links */}
          <div className="flex flex-col gap-3">
            <p
              className="label-uppercase mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Official Links
            </p>
            {FOOTER_OFFICIAL.map((item) => (
              <FooterNavLink
                key={item.label}
                href={item.href}
                label={item.label}
                external={item.external}
              />
            ))}
          </div>

          {/* Legal & Trust */}
          <div className="flex flex-col gap-3">
            <p
              className="label-uppercase mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Legal &amp; Trust
            </p>
            {FOOTER_LEGAL.map((item) => (
              <FooterNavLink
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
            {FOOTER_ABOUT.map((item) => (
              <FooterNavLink
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <p
              className="label-uppercase mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Connect
            </p>
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`footer.social.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                className="flex items-center gap-2 text-sm font-medium transition-smooth w-fit"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--muted-foreground)";
                }}
              >
                <span style={{ color: "var(--primary)" }}>{icon}</span>
                {label}
              </a>
            ))}
            <p
              className="text-xs mt-2 leading-relaxed"
              style={{ color: "#555555" }}
            >
              DMNZ is a meme coin — not financial advice.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "#555555" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <p>
              &copy; {year} DemonZeno. DMNZ is a meme coin — not financial
              advice.
            </p>
            <span
              className="hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              |
            </span>
            <p>@Demon_Zeno on Binance Square</p>
            <span
              className="hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              |
            </span>
            <p>Launching April 2, 2027</p>
            <span
              className="hidden sm:inline"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              |
            </span>
            <p style={{ color: "var(--gold)", fontWeight: 600, opacity: 0.7 }}>
              Site last audited: May 2026
            </p>
          </div>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-smooth"
            style={{ color: "#555555" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#555555";
            }}
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout() {
  useScrollAnimations();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      <CountdownBar />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
