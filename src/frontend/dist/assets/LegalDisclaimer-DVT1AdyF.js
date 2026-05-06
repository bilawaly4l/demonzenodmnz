import { ah as useScrollAnimations, L as reactExports, Y as jsxRuntimeExports, ag as Link } from "./index-CAY1Sq3U.js";
import { A as ArrowLeft } from "./arrow-left-UQKB3RPw.js";
import { T as TriangleAlert } from "./triangle-alert-BcdbMM-q.js";
const SECTIONS = [
  {
    title: "NOT FINANCIAL ADVICE",
    body: "Nothing on this website, on DemonZeno's Binance Square profile (@Demon_Zeno), on Twitter (@ZenoDemon), or in any DMNZ-affiliated community constitutes financial advice, investment advice, trading advice, or any other type of advice. All content is for informational and entertainment purposes only."
  },
  {
    title: "NO GUARANTEES",
    body: "DemonZeno and the DMNZ project make no guarantees regarding the value, performance, or continued existence of the DMNZ token. Meme tokens are highly speculative. You may lose all of the money you invest."
  },
  {
    title: "MEME COIN NATURE",
    body: "DMNZ is explicitly a meme coin. It has no intrinsic utility, no backing assets, and no guaranteed value. Its value — if any — is derived entirely from community participation and sentiment. It should be treated as entertainment, not investment."
  },
  {
    title: "NO REGULATORY APPROVAL",
    body: "DMNZ has not been registered with, approved by, or reviewed by any financial regulatory authority. Participation in DMNZ may be restricted in your jurisdiction. It is your responsibility to ensure that buying, holding, or trading DMNZ is legal in your country."
  },
  {
    title: "RISK OF LOSS",
    body: "Cryptocurrency markets are highly volatile. The value of DMNZ can drop to zero at any time. DemonZeno, the project creator, bears no liability for any financial losses incurred by individuals who purchase, hold, or trade DMNZ."
  },
  {
    title: "BLUM PLATFORM RISKS",
    body: "DMNZ launches on the Blum Mini App on Telegram. Any risks associated with the Blum platform, Telegram, or their respective policies are outside of DemonZeno's control. DemonZeno is not affiliated with Blum or Telegram."
  },
  {
    title: "INDEPENDENT RESEARCH",
    body: "Before participating in any cryptocurrency project, including DMNZ, you should conduct independent research and consult a qualified financial advisor. DemonZeno strongly encourages all potential participants to understand what they are buying before they buy it."
  }
];
function LegalDisclaimer() {
  useScrollAnimations();
  reactExports.useEffect(() => {
    document.title = "Legal Disclaimer — DemonZeno DMNZ";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "var(--background)" },
      "data-ocid": "legal_disclaimer.page",
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
                    TriangleAlert,
                    {
                      className: "w-4 h-4",
                      style: { color: "var(--primary)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-uppercase text-crimson", children: "Important" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-xl mt-2 mb-5", children: "LEGAL DISCLAIMER" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg max-w-2xl leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Read this. We mean it. DMNZ is a meme coin — not financial advice, not an investment, not a regulated product."
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "scroll-anim mb-10",
              style: {
                padding: "1.5rem",
                background: "rgba(220,20,60,0.08)",
                border: "1px solid rgba(220,20,60,0.3)",
                borderRadius: "4px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-base font-bold uppercase tracking-wide text-center",
                    style: { color: "var(--primary)", letterSpacing: "0.1em" },
                    children: "DMNZ IS A MEME COIN — NOT FINANCIAL ADVICE"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm mt-3 text-center leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Participation in DMNZ is at your own risk. Do not invest more than you can afford to lose entirely."
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-5", children: SECTIONS.map((sec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "scroll-anim card-dmnz",
              style: { transitionDelay: `${i * 80}ms` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-xs font-bold uppercase tracking-widest mb-3",
                    style: { color: "var(--foreground)", letterSpacing: "0.14em" },
                    children: sec.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: sec.body
                  }
                )
              ]
            },
            sec.title
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "scroll-anim mt-10 text-center",
              style: { transitionDelay: "400ms" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono", style: { color: "#555555" }, children: "Last reviewed: May 2026 · Version 1.0" })
            }
          )
        ] })
      ]
    }
  );
}
export {
  LegalDisclaimer
};
