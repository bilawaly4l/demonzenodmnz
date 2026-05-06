import { X as createLucideIcon, ah as useScrollAnimations, L as reactExports, Y as jsxRuntimeExports, ag as Link, ac as ExternalLink, a8 as SiBinance } from "./index-CAY1Sq3U.js";
import { A as ArrowLeft } from "./arrow-left-UQKB3RPw.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
const CHANNELS = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SiBinance, { className: "w-5 h-5" }),
    name: "Binance Square",
    handle: "@Demon_Zeno",
    url: "https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink",
    description: "The primary official channel. All announcements, updates, and community posts originate here.",
    status: "VERIFIED"
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black", children: "BLUM" }),
    name: "Blum Mini App",
    handle: "DemonZeno DMNZ",
    url: "https://t.me/blum",
    description: "The exclusive launch platform for DMNZ. Only buy DMNZ through the official Blum Mini App on Telegram.",
    status: "LAUNCH PLATFORM"
  }
];
const FAKES = [
  "Any Telegram group claiming to be official DMNZ",
  "Any Twitter account other than @ZenoDemon posting about DMNZ deals",
  "Any website offering DMNZ presale, early access, or guaranteed tokens",
  "Any person DM-ing you about DMNZ investments or airdrop claims",
  "Any exchange listing DMNZ before April 2, 2027"
];
function OfficialLinks() {
  useScrollAnimations();
  reactExports.useEffect(() => {
    document.title = "Official Links — DemonZeno DMNZ";
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: { background: "var(--background)" },
      "data-ocid": "official_links.page",
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-uppercase text-crimson", children: "Verified Only" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-xl mt-3 mb-5", children: "OFFICIAL LINKS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-lg max-w-2xl leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Every verified DMNZ channel. Nothing else is real. If it is not on this page, it is fake."
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-16 max-w-3xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4 mb-14", children: CHANNELS.map((ch, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: ch.url,
              target: "_blank",
              rel: "noopener noreferrer",
              "data-ocid": `official_links.channel.item.${i + 1}`,
              className: "scroll-anim block card-dmnz transition-smooth",
              style: {
                border: "1px solid var(--border)",
                transitionDelay: `${i * 100}ms`
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--primary)" }, children: ch.icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-bold text-base",
                            style: { color: "var(--foreground)" },
                            children: ch.name
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success", children: ch.status })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm font-mono",
                          style: { color: "var(--primary)" },
                          children: ch.handle
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ExternalLink,
                    {
                      className: "w-4 h-4 flex-shrink-0 mt-0.5",
                      style: { color: "var(--muted-foreground)" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm mt-4 leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: ch.description
                  }
                )
              ]
            },
            ch.name
          )) }),
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ShieldAlert,
                    {
                      className: "w-5 h-5 flex-shrink-0",
                      style: { color: "var(--primary)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      className: "text-sm font-bold uppercase tracking-widest",
                      style: { color: "var(--primary)", letterSpacing: "0.14em" },
                      children: "BEWARE OF FAKES"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-sm mb-4 leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: "Scammers create fake accounts and channels using the DMNZ name. The following do NOT exist and are all scams:"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: FAKES.map((fake) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-3 text-sm leading-relaxed",
                    style: { color: "var(--muted-foreground)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "mt-1.5 flex-shrink-0 w-1 h-1 rounded-full",
                          style: { background: "var(--primary)" }
                        }
                      ),
                      fake
                    ]
                  },
                  fake
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
  OfficialLinks
};
