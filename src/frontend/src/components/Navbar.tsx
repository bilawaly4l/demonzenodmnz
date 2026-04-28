import { Button } from "@/components/ui/button";
import { BrainCircuit, Home, Menu, Signal, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Signals", href: "#signals", section: "signals" },
  { label: "DMNZ Token", href: "#token", section: "token" },
  { label: "Roadmap", href: "#roadmap", section: "roadmap" },
  { label: "Community", href: "#community", section: "community" },
  { label: "FAQ", href: "#faq", section: "faq" },
];

const MOBILE_NAV = [
  {
    label: "Home",
    href: "#hero",
    section: "hero",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Signals",
    href: "#signals",
    section: "signals",
    icon: <Signal className="w-5 h-5" />,
  },
  {
    label: "AI",
    href: "/ai",
    section: "",
    icon: <BrainCircuit className="w-5 h-5" />,
    isExternal: true,
  },
  {
    label: "Token",
    href: "#token",
    section: "token",
    icon: <Zap className="w-5 h-5" />,
  },
];

function scrollTo(href: string) {
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.section),
    ).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-60px 0px -40% 0px" },
    );

    for (const s of sections) observerRef.current?.observe(s);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      {/* Desktop header */}
      <header
        data-ocid="navbar.panel"
        className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-subtle"
      >
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            data-ocid="navbar.home.link"
            onClick={() => scrollTo("#hero")}
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
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    data-ocid={`navbar.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                    onClick={() => scrollTo(link.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${isActive ? "nav-link-active" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
            <li>
              <a
                href="/ai"
                data-ocid="navbar.ai.link"
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-smooth text-primary hover:bg-primary/10"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                AI
              </a>
            </li>
          </ul>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button
              size="sm"
              data-ocid="navbar.get_signals.primary_button"
              onClick={() => scrollTo("#signals")}
              className="btn-primary"
            >
              Get Free Signals
            </Button>
          </div>

          {/* Mobile: Theme + Menu Toggle */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              data-ocid="navbar.mobile_menu.toggle"
              className="p-2 rounded-md hover:bg-muted transition-smooth"
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

        {/* Mobile dropdown Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <ul className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <li key={link.href}>
                    <button
                      type="button"
                      data-ocid={`navbar.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                      onClick={() => {
                        scrollTo(link.href);
                        setMobileOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-smooth ${isActive ? "nav-link-active" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
              <li>
                <a
                  href="/ai"
                  data-ocid="navbar.mobile.ai.link"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-smooth text-primary hover:bg-primary/10"
                >
                  <BrainCircuit className="w-4 h-4" />
                  DemonZeno AI
                </a>
              </li>
              <li className="pt-2">
                <Button
                  data-ocid="navbar.mobile.get_signals.primary_button"
                  onClick={() => {
                    scrollTo("#signals");
                    setMobileOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Get Free Signals
                </Button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Mobile bottom navigation bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border"
        aria-label="Mobile bottom navigation"
        data-ocid="navbar.mobile_bottom.panel"
      >
        <div className="flex items-center justify-around py-2 px-2">
          {MOBILE_NAV.map((item) => (
            <div key={item.label}>
              {item.isExternal ? (
                <a
                  href={item.href}
                  data-ocid={`navbar.mobile_bottom.${item.label.toLowerCase()}.link`}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-primary hover:bg-primary/10 transition-smooth min-w-[44px]"
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className="text-[10px] font-semibold text-primary">
                    {item.label}
                  </span>
                </a>
              ) : (
                <button
                  type="button"
                  data-ocid={`navbar.mobile_bottom.${item.label.toLowerCase()}.link`}
                  onClick={() => scrollTo(item.href)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-smooth min-w-[44px] ${activeSection === item.section ? "text-primary" : "text-muted-foreground"}`}
                  aria-label={item.label}
                >
                  {item.icon}
                  <span className="text-[10px] font-semibold">
                    {item.label}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
