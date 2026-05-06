import { ah as useScrollAnimations, L as reactExports, Y as jsxRuntimeExports, ag as Link } from "./index-CAY1Sq3U.js";
import { A as ArrowLeft } from "./arrow-left-UQKB3RPw.js";
const ENTRIES = [
  {
    version: "v1.5",
    date: "May 5, 2026",
    label: "MAJOR UPDATE",
    changes: [
      "Added full credibility suite: Transparency, Official Links, Community Guidelines, Legal Disclaimer, Risk Disclosure, Lessons from Failures, Not A Scam pages",
      "Added Why DemonZeno page with public commitment",
      "Added Launch Announcement and Post-Launch Plan pages",
      "Added brand identity and whitepaper sections",
      "Added sticky countdown bar to every page",
      "Upgraded footer with 4-column professional layout",
      "Added official links page and Beware of Fakes section"
    ]
  },
  {
    version: "v1.4",
    date: "April 2026",
    label: "CONTENT UPDATE",
    changes: [
      "Added interactive roadmap with milestone expansion",
      "Added First 100 pledge wall and OG Believer badge system",
      "Added Hype Wall with community messages",
      "Added D-Day countdown page",
      "Added readiness checklist",
      "Removed all Academy, quiz, certificate, admin, and AI features",
      "Removed all dead backend files (120+ files cleaned)"
    ]
  },
  {
    version: "v1.3",
    date: "March 2026",
    label: "DESIGN OVERHAUL",
    changes: [
      "Full dark-theme-only redesign: deep black #0a0a0a + crimson #DC143C",
      "Sharp corners enforced across all components (2-4px max)",
      "Removed all light mode code and theme toggle",
      "New typography: Space Grotesk display + Inter body",
      "Added scroll animations (cinematic fade-ins)",
      "Added scroll progress indicator"
    ]
  },
  {
    version: "v1.2",
    date: "February 2026",
    label: "CONTENT UPDATE",
    changes: [
      "Updated Binance Square handle to @Demon_Zeno",
      "Added DMNZ vs Other Meme Coins comparison section",
      "Added DemonZeno origin story and lore sections",
      "Added Bonding Curve explainer",
      "Added Early Believer wall"
    ]
  },
  {
    version: "v1.0",
    date: "January 2026",
    label: "LAUNCH",
    changes: [
      "Initial DMNZ website launched",
      "Token info, roadmap, FAQ, and How to Buy sections live",
      "Countdown timer to April 2, 2027 launch date"
    ]
  }
];
const LABEL_COLORS = {
  "MAJOR UPDATE": "var(--primary)",
  "CONTENT UPDATE": "var(--gold)",
  "DESIGN OVERHAUL": "#a855f7",
  LAUNCH: "#22c55e"
};
function Changelog() {
  useScrollAnimations();
  reactExports.useEffect(() => {
    document.title = "Changelog — DemonZeno DMNZ";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "var(--background)" },
      "data-ocid": "changelog.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              background: "var(--card)",
              borderBottom: "1px solid var(--border)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/",
                  className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 transition-smooth",
                  style: {
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.14em"
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.color = "var(--primary)";
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
                    "Back to Home"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scroll-anim", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-uppercase text-crimson", children: "Site History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-xl mt-3 mb-5", children: "WHAT'S CHANGED" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg max-w-2xl leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Every update to this site, documented. An active and maintained project doesn't hide its history."
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-8", children: ENTRIES.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "scroll-anim flex gap-6",
            style: { transitionDelay: `${i * 80}ms` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full mt-1.5",
                    style: {
                      background: LABEL_COLORS[entry.label] ?? "var(--muted-foreground)"
                    }
                  }
                ),
                i < ENTRIES.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-px flex-1 mt-2",
                    style: { background: "var(--border)", minHeight: "2rem" }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono font-bold text-sm",
                      style: { color: "var(--foreground)" },
                      children: entry.version
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "badge-info text-xs",
                      style: {
                        color: LABEL_COLORS[entry.label] ?? "var(--muted-foreground)",
                        borderColor: LABEL_COLORS[entry.label] ?? "var(--border)"
                      },
                      children: entry.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-mono",
                      style: { color: "var(--muted-foreground)" },
                      children: entry.date
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: entry.changes.map((change) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2 text-sm leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "mt-1.5 flex-shrink-0 w-1 h-1 rounded-full",
                          style: { background: "var(--border)" }
                        }
                      ),
                      change
                    ]
                  },
                  change
                )) })
              ] })
            ]
          },
          entry.version
        )) }) })
      ]
    }
  );
}
export {
  Changelog
};
