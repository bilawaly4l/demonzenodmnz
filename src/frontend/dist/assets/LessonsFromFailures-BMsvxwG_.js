import { ah as useScrollAnimations, L as reactExports, Y as jsxRuntimeExports, ag as Link } from "./index-CAY1Sq3U.js";
import { A as ArrowLeft } from "./arrow-left-UQKB3RPw.js";
import { T as TrendingDown } from "./trending-down-DO7ioWxh.js";
const CASES = [
  {
    project: "SQUID GAME TOKEN (SQUID)",
    year: "2021",
    failure: "Classic rug pull. Devs sold all holdings immediately after launch, draining all liquidity. Price went from $0.01 to $2,861 to zero in minutes.",
    lesson: "No verified identity behind the project. No commitment to the community. A public creator with a real reputation cannot do this — their identity is the lock.",
    dmnzAnswer: "DemonZeno is publicly known. His Binance Square profile has a documented history. He cannot rug without destroying his own public identity."
  },
  {
    project: "SAFEMOON (SFM)",
    year: "2021–2022",
    failure: "Massive marketing, celebrity endorsements, and promises of revolutionary tokenomics. Founders secretly minted extra tokens and drained liquidity pools. Price collapsed 98%.",
    lesson: "Tokenomics complexity hides manipulation. The more complex the buy/sell tax system, the more places for devs to extract value silently.",
    dmnzAnswer: "DMNZ has no tokenomics. No taxes, no reflection rewards, no complex mechanisms. Simple token. Simple rules. Nothing to hide behind."
  },
  {
    project: "LUNA / TERRA (LUNA)",
    year: "2022",
    failure: "Algorithmic stablecoin model collapsed. $60B wiped in 72 hours. Promised yields that could not be sustained. Model was mathematically fragile under selling pressure.",
    lesson: "Unsustainable APY promises and over-engineered economics create fragile systems that collapse under real market conditions.",
    dmnzAnswer: "DMNZ promises nothing. No APY. No yield. No algorithmic stability. Just a meme token with fair launch rules and a burn event."
  },
  {
    project: "RUG PULL PATTERN (Generic)",
    year: "2020–Present",
    failure: "Developers create token, artificially inflate price through early buys, generate hype, then dump entire holdings on retail buyers who arrive during the hype. Community loses everything.",
    lesson: "Presales and team allocations are the mechanism. If developers hold large pre-allocated amounts, they always have the ability and often the incentive to sell at retail buyers' expense.",
    dmnzAnswer: "No presale. No team allocation. DemonZeno does not hold pre-allocated DMNZ. The mechanism for this pattern simply does not exist with DMNZ."
  },
  {
    project: "FOMO-PUMPED TOKENS (Generic)",
    year: "Ongoing",
    failure: "Projects launch with aggressive social media campaigns promising guaranteed returns. Retail buyers buy the hype peak. Early wallets sell. Price crashes 80–95%.",
    lesson: "Guaranteed returns are a red flag. Any project promising guaranteed gains is either lying or about to rug.",
    dmnzAnswer: "DemonZeno explicitly states: no guarantees. DMNZ may go to zero. This honesty is intentional — it filters out people looking for a get-rich-quick scheme."
  }
];
function LessonsFromFailures() {
  useScrollAnimations();
  reactExports.useEffect(() => {
    document.title = "Lessons from Failed Meme Coins — DemonZeno";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "var(--background)" },
      "data-ocid": "lessons_failures.page",
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TrendingDown,
                    {
                      className: "w-4 h-4",
                      style: { color: "var(--primary)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-uppercase text-crimson", children: "What Went Wrong" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-xl mt-2 mb-5", children: "LESSONS FROM FAILED MEME COINS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg max-w-2xl leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "What went wrong elsewhere and exactly how DMNZ avoids those same mistakes — with evidence, not promises."
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-8", children: CASES.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "scroll-anim",
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              overflow: "hidden",
              transitionDelay: `${i * 80}ms`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    padding: "1rem 1.5rem",
                    borderBottom: "1px solid var(--border)",
                    background: "rgba(220,20,60,0.04)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: "text-sm font-bold uppercase tracking-widest",
                        style: {
                          color: "var(--foreground)",
                          letterSpacing: "0.1em"
                        },
                        children: c.project
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs font-mono flex-shrink-0",
                        style: { color: "var(--muted-foreground)" },
                        children: c.year
                      }
                    )
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col gap-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-bold uppercase tracking-widest mb-2",
                      style: { color: "var(--primary)", letterSpacing: "0.12em" },
                      children: "WHAT HAPPENED"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm leading-relaxed",
                      style: { color: "var(--muted-foreground)" },
                      children: c.failure
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs font-bold uppercase tracking-widest mb-2",
                      style: { color: "var(--gold)", letterSpacing: "0.12em" },
                      children: "THE LESSON"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm leading-relaxed",
                      style: { color: "var(--muted-foreground)" },
                      children: c.lesson
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      padding: "0.875rem",
                      background: "rgba(34,197,94,0.06)",
                      border: "1px solid rgba(34,197,94,0.15)",
                      borderRadius: "2px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs font-bold uppercase tracking-widest mb-1.5",
                          style: { color: "#22c55e", letterSpacing: "0.12em" },
                          children: "HOW DMNZ IS DIFFERENT"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm leading-relaxed",
                          style: { color: "var(--muted-foreground)" },
                          children: c.dmnzAnswer
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          },
          c.project
        )) }) })
      ]
    }
  );
}
export {
  LessonsFromFailures
};
