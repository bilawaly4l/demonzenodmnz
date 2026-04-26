import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { BrainCircuit, Menu, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Signals", href: "#signals", section: "signals" },
  { label: "Markets", href: "#markets", section: "markets" },
  { label: "DMNZ Token", href: "#token", section: "token" },
  { label: "Roadmap", href: "#roadmap", section: "roadmap" },
  { label: "FAQ", href: "#faq", section: "faq" },
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
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-60px 0px -40% 0px" },
    );

    for (const s of sections) {
      observerRef.current?.observe(s);
    }
    return () => observerRef.current?.disconnect();
  }, []);

  return (
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActive
                      ? "nav-link-active"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}

          {/* AI Link */}
          <li>
            <Link
              to="/ai"
              data-ocid="navbar.ai.link"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-smooth text-primary hover:bg-primary/10"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              AI
            </Link>
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

      {/* Mobile Nav */}
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
                    className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-smooth ${
                      isActive
                        ? "nav-link-active"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}

            {/* AI link (mobile) */}
            <li>
              <Link
                to="/ai"
                data-ocid="navbar.mobile.ai.link"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium transition-smooth text-primary hover:bg-primary/10"
              >
                <BrainCircuit className="w-4 h-4" />
                DemonZeno AI
              </Link>
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
  );
}
