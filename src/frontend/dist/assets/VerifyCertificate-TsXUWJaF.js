import { c as createLucideIcon, y as useParams, v as useVerifyCertificate, r as reactExports, j as jsxRuntimeExports, L as Link, A as Award, T as Twitter } from "./index-DhDL5MF6.js";
import { B as Button } from "./button-BgkjFKKh.js";
import { S as Skeleton } from "./skeleton-Dmyn2p53.js";
import { L as Link2, a as CertificateGenerator } from "./CertificateGenerator-bJWzY9tq.js";
import { C as CircleX, a as Clock } from "./clock-CH1st22h.js";
import { G as Globe, S as Shield, a as Star } from "./star-CfMfmKn7.js";
import "./external-link-Bg5l6Ni1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = createLucideIcon("map-pin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const GOLD = "oklch(0.7 0.18 70)";
const GOLD_BORDER = "oklch(0.7 0.18 70 / 0.4)";
const GOLD_BG = "oklch(0.7 0.18 70 / 0.08)";
const TIER_BADGES = {
  beginner: { label: "Beginner", cssClass: "tier-badge-other" },
  intermediate: { label: "Intermediate", cssClass: "tier-badge-other" },
  advanced: { label: "Advanced", cssClass: "tier-badge-other" },
  expert: { label: "Expert", cssClass: "tier-badge-expert" },
  master: { label: "Master", cssClass: "tier-badge-master" }
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function buildQrSvg(url) {
  const MODULES = 25;
  const SIZE = 200;
  const CELL = SIZE / MODULES;
  let seed = 0;
  for (let i = 0; i < url.length; i++) {
    seed = (seed << 5) - seed + url.charCodeAt(i) | 0;
  }
  function rand() {
    seed ^= seed << 13;
    seed ^= seed >> 7;
    seed ^= seed << 17;
    return (seed >>> 0 & 65535) / 65535;
  }
  const grid = Array.from(
    { length: MODULES },
    () => Array(MODULES).fill(false)
  );
  function finder(r, c) {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        grid[r + dr][c + dc] = onBorder || inCore;
      }
    }
  }
  finder(0, 0);
  finder(0, MODULES - 7);
  finder(MODULES - 7, 0);
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= MODULES - 8;
      const inBL = r >= MODULES - 8 && c < 8;
      if (inTL || inTR || inBL) continue;
      grid[r][c] = rand() > 0.5;
    }
  }
  const rects = [];
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      if (grid[r][c]) {
        rects.push(
          `<rect x="${c * CELL}" y="${r * CELL}" width="${CELL}" height="${CELL}" fill="currentColor"/>`
        );
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function useCopy(timeout = 2e3) {
  const [copied, setCopied] = reactExports.useState(false);
  const t = reactExports.useRef(null);
  function copy(text) {
    navigator.clipboard.writeText(text).catch(() => {
    });
    setCopied(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), timeout);
  }
  return { copied, copy };
}
function VerifyCertificate() {
  const { certId } = useParams({ from: "/layout/verify/$certId" });
  const { data: cert, isLoading, error } = useVerifyCertificate(certId);
  const { copied: copiedId, copy: copyId } = useCopy();
  const { copied: copiedLink, copy: copyLink } = useCopy();
  const [origin, setOrigin] = reactExports.useState("https://demonzeno.com");
  const [showGenerator, setShowGenerator] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "verify.loading_state",
        className: "min-h-screen bg-background flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-20 max-w-2xl space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48 mx-auto" })
        ] })
      }
    );
  }
  if (error || !cert) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "verify.error_state",
        className: "min-h-screen bg-background flex items-center justify-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-20 max-w-lg text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-12 h-12 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground mb-2", children: "Certificate Not Found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
              "The certificate ID",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono bg-muted px-2 py-0.5 rounded text-foreground", children: certId }),
              " ",
              "doesn't exist or may have been revoked."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "btn-primary btn-micro", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/certificates", children: "View Certificate Wall" }) })
        ] })
      }
    );
  }
  const tier = cert.tierId.toLowerCase();
  const badgeInfo = TIER_BADGES[tier] ?? {
    label: cert.tierName,
    cssClass: "tier-badge-other"
  };
  const shareUrl = `${origin}/verify/${cert.certId}`;
  const qrSrc = buildQrSvg(shareUrl);
  const tweetText = encodeURIComponent(
    `🏆 I earned my ${cert.tierName} Certificate from DemonZeno Trading Academy!

Certificate ID: ${cert.certId}
Verify: ${shareUrl}

@ZenoDemon #DemonZeno #DMNZ #Trading`
  );
  if (!cert.isValid) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        "data-ocid": "verify.revoked_state",
        className: "min-h-screen bg-background py-20",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-lg text-center space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-sm uppercase tracking-widest",
              style: {
                background: "oklch(0.55 0.22 25 / 0.15)",
                border: "2px solid oklch(0.55 0.22 25 / 0.5)",
                color: "oklch(0.65 0.22 25)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5" }),
                "Certificate Revoked"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-xl p-6 border-2 text-center",
              style: {
                borderColor: "oklch(0.55 0.22 25 / 0.4)",
                background: "oklch(0.55 0.22 25 / 0.05)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
                "Certificate",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono font-bold text-foreground", children: certId }),
                " ",
                "has been invalidated by an administrator and is no longer valid."
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/certificates", children: "View Certificate Wall" }) })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "verify.section",
      className: "min-h-screen bg-background py-16",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center justify-center gap-3 mb-8",
            "data-ocid": "verify.status.panel",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2.5 rounded-full px-6 py-3 font-bold text-base uppercase tracking-wider",
                style: {
                  background: "oklch(0.7 0.18 145 / 0.15)",
                  border: "2px solid oklch(0.7 0.18 145 / 0.5)",
                  color: "oklch(0.65 0.18 145)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }),
                  "Valid Certificate"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            "data-ocid": "verify.card",
            className: "certificate-image mx-auto",
            "aria-label": "Certificate of Achievement",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "certificate-seal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-8 h-8 text-white" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "font-display text-2xl md:text-3xl font-bold mb-1",
                    style: { color: "#2c1810" },
                    children: "Certificate of Achievement"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: "#8b7355" }, children: "DemonZeno Trading Academy" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-full h-px mb-5",
                  style: {
                    background: "linear-gradient(90deg, transparent, #b8956a, transparent)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs uppercase tracking-widest mb-1",
                    style: { color: "#8b7355" },
                    children: "This certifies that"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-display text-2xl md:text-3xl font-bold mb-1",
                    style: { color: "#1a0f08" },
                    children: cert.certInfo.fullName
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", style: { color: "#5a3e2b" }, children: [
                  "Son/Daughter of ",
                  cert.certInfo.fathersName
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm leading-relaxed", style: { color: "#3d2415" }, children: [
                "has successfully completed the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold", children: cert.tierName }),
                " tier of the DemonZeno Trading Academy with a perfect score of",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  String(cert.score),
                  "/",
                  String(cert.totalQuestions)
                ] }),
                ", demonstrating mastery of trading knowledge and discipline."
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mb-5 text-left text-xs", children: [
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
                  label: "Country",
                  value: cert.certInfo.country
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
                  label: "City",
                  value: cert.certInfo.city
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3" }),
                  label: "Email",
                  value: cert.certInfo.email
                },
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  label: "Issued",
                  value: formatDate(cert.issuedAt)
                }
              ].map(({ icon, label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-1.5",
                  style: { color: "#5a3e2b" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 shrink-0", children: icon }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "font-semibold uppercase tracking-wider",
                          style: { color: "#8b7355", fontSize: "9px" },
                          children: label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium break-all", children: value })
                    ] })
                  ]
                },
                label
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: badgeInfo.cssClass, children: badgeInfo.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3 h-3", style: { color: "#8b7355" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-xs font-bold tracking-widest",
                        style: { color: "#8b7355" },
                        children: cert.certId
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs mt-0.5 font-bold uppercase tracking-wider",
                      style: { color: "#b8956a", fontSize: "9px" },
                      children: "✓ Verified Learner"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-2 rounded-lg p-3",
                  style: {
                    background: "rgba(139,115,85,0.1)",
                    border: "1px solid #b8956a60"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: qrSrc,
                        alt: "QR code to verify this certificate",
                        width: 90,
                        height: 90,
                        className: "rounded",
                        style: { color: "#8b7355" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-center leading-snug",
                        style: { color: "#8b7355", fontSize: "9px" },
                        children: "Scan to verify certificate"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "certificate-watermark", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "certificate-watermark-zeno", children: "DemonZeno ®" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "9px" }, children: "DMNZ Academy" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-6 flex items-center justify-center gap-2 rounded-xl p-3 text-xs",
            style: { background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 shrink-0", style: { color: GOLD } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GOLD }, children: "Verified by DemonZeno Trading Academy · Permanently stored on the Internet Computer blockchain" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "verify.actions.panel",
            className: "mt-6 flex flex-wrap gap-3 justify-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  onClick: () => setShowGenerator((v) => !v),
                  "data-ocid": "verify.download.button",
                  className: "gap-1.5 font-semibold",
                  style: { background: GOLD, color: "#1a0f00" },
                  children: showGenerator ? "Hide Certificate" : "Download Certificate (PNG)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "verify.copy_id.button",
                  type: "button",
                  variant: "outline",
                  onClick: () => copyId(cert.certId),
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-4 h-4" }),
                    copiedId ? "ID Copied!" : "Copy Certificate ID"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "verify.copy_link.button",
                  type: "button",
                  variant: "outline",
                  onClick: () => copyLink(shareUrl),
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
                    copiedLink ? "Link Copied!" : "Copy Share Link"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "verify.tweet.button",
                  asChild: true,
                  className: "btn-primary btn-micro gap-1.5",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: `https://twitter.com/intent/tweet?text=${tweetText}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-4 h-4" }),
                        " Share on X"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/certificates", children: "View Certificate Wall" }) })
            ]
          }
        ),
        showGenerator && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "verify.cert_gen.panel",
            className: "mt-6 p-5 rounded-xl border",
            style: {
              borderColor: GOLD_BORDER,
              background: "oklch(0.16 0.01 260)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CertificateGenerator,
              {
                certificate: cert,
                personalInfo: {
                  fullName: cert.certInfo.fullName,
                  fathersName: cert.certInfo.fathersName,
                  country: cert.certInfo.country,
                  dateOfBirth: cert.certInfo.dateOfBirth,
                  email: cert.certInfo.email,
                  city: cert.certInfo.city
                },
                onClose: () => setShowGenerator(false)
              }
            )
          }
        )
      ] })
    }
  );
}
export {
  VerifyCertificate
};
