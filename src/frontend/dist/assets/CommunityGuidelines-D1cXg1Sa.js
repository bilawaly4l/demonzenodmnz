import { ah as useScrollAnimations, L as reactExports, Y as jsxRuntimeExports, ag as Link } from "./index-CAY1Sq3U.js";
import { A as ArrowLeft } from "./arrow-left-UQKB3RPw.js";
import { C as CircleCheckBig } from "./circle-check-big-DwIltcMs.js";
import { B as Ban } from "./ban-LT8flrl5.js";
const RULES = [
  {
    number: "01",
    title: "RESPECT THE MISSION",
    body: "DMNZ exists to prove that a fair launch is possible. Anyone undermining that mission — spreading FUD, pushing fake pump signals, or creating confusion — does not belong here."
  },
  {
    number: "02",
    title: "NO FINANCIAL ADVICE",
    body: "Do not tell others to buy or sell DMNZ. Do not post price predictions as if they are certainties. We are a community, not a financial advisory. Everyone makes their own decisions."
  },
  {
    number: "03",
    title: "NO FAKE CHANNELS OR IMPERSONATION",
    body: "Creating accounts or channels impersonating @Demon_Zeno, DMNZ, or any community member is grounds for immediate removal from any affiliated space and public callout."
  },
  {
    number: "04",
    title: "NO PRESALE OR PROMO SCHEMES",
    body: "Anyone promoting presale offers, referral pyramid schemes, or paid shilling inside DMNZ spaces will be banned and reported. DMNZ is built on fairness — protect it."
  },
  {
    number: "05",
    title: "SPEAK WITH EVIDENCE",
    body: "If you have concerns or criticism, state them clearly and with evidence. Blind accusations and baseless attacks are noise. DemonZeno responds to substance, not drama."
  },
  {
    number: "06",
    title: "CREDIT ORIGINAL CREATORS",
    body: "If you share DMNZ content, credit the original creator. Do not repurpose official DMNZ materials for personal gain without acknowledgment."
  }
];
const VIOLATIONS = [
  "Immediate removal from community spaces",
  "Public callout on Binance Square if the violation is severe enough to warn others",
  "Reporting to Binance Square moderation if impersonation is involved"
];
function CommunityGuidelines() {
  useScrollAnimations();
  reactExports.useEffect(() => {
    document.title = "Community Guidelines — DemonZeno DMNZ";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "var(--background)" },
      "data-ocid": "community_guidelines.page",
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-uppercase text-crimson", children: "By DemonZeno" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-xl mt-3 mb-5", children: "COMMUNITY GUIDELINES" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg max-w-2xl leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "How we conduct ourselves in the DMNZ community. These are not suggestions."
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-5 mb-14", children: RULES.map((rule, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "scroll-anim card-dmnz",
              style: { transitionDelay: `${i * 80}ms` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono font-bold text-xl flex-shrink-0",
                    style: { color: "var(--primary)" },
                    children: rule.number
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "text-sm font-bold uppercase tracking-widest mb-2",
                      style: {
                        color: "var(--foreground)",
                        letterSpacing: "0.12em"
                      },
                      children: rule.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-sm leading-relaxed",
                      style: { color: "var(--muted-foreground)" },
                      children: rule.body
                    }
                  )
                ] })
              ] })
            },
            rule.number
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scroll-anim card-dmnz mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4", style: { color: "#22c55e" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: "text-sm font-bold uppercase tracking-widest",
                  style: { color: "var(--foreground)", letterSpacing: "0.14em" },
                  children: "WHAT WE WELCOME"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
              "Honest discussion about the project",
              "Sharing your journey to buying DMNZ",
              "Questions about how Blum works",
              "Spreading awareness on Binance Square",
              "Constructive feedback to DemonZeno",
              "Welcoming new community members"
            ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-2 text-sm",
                style: { color: "var(--muted-foreground)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-1 h-1 rounded-full flex-shrink-0",
                      style: { background: "#22c55e" }
                    }
                  ),
                  item
                ]
              },
              item
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "scroll-anim",
              style: {
                padding: "1.5rem",
                background: "rgba(220,20,60,0.06)",
                border: "1px solid rgba(220,20,60,0.25)",
                borderRadius: "4px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "w-4 h-4", style: { color: "var(--primary)" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "text-sm font-bold uppercase tracking-widest",
                      style: { color: "var(--primary)", letterSpacing: "0.14em" },
                      children: "CONSEQUENCES OF VIOLATIONS"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: VIOLATIONS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-3 text-sm",
                    style: { color: "var(--muted-foreground)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "mt-1.5 flex-shrink-0 w-1 h-1 rounded-full",
                          style: { background: "var(--primary)" }
                        }
                      ),
                      v
                    ]
                  },
                  v
                )) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  CommunityGuidelines
};
