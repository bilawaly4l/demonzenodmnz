import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X, A as Award, T as Twitter, t as useListAllCertificates, q as useFeaturedCertificates, v as useVerifyCertificate } from "./index-LpNaIZiB.js";
import { S as ShieldCheck, B as Badge } from "./badge-BsFgkTBp.js";
import { B as Button } from "./button-CM5rLxPe.js";
import { S as Search, I as Input, T as Trophy } from "./input-BtQJcYzA.js";
import { D as Dialog, a as DialogContent, U as Users } from "./dialog-CZlrs0oE.js";
import { C as Check, L as Link2, a as CertificateGenerator } from "./CertificateGenerator-D-9YPRdj.js";
import { D as Download, G as Globe, a as Star, S as Shield } from "./star-BrTRvvX0.js";
import { E as ExternalLink } from "./external-link-j1Jn2SNC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "m21 8-4-4-4 4", key: "1c9v7m" }],
  ["path", { d: "M17 4v16", key: "7dpous" }]
];
const ArrowDownUp = createLucideIcon("arrow-down-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode);
const TIER_STYLE$1 = {
  beginner: {
    color: "oklch(0.65 0.18 145)",
    bg: "oklch(0.65 0.18 145 / 0.18)",
    label: "Beginner"
  },
  intermediate: {
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.18)",
    label: "Intermediate"
  },
  advanced: {
    color: "oklch(0.65 0.2 60)",
    bg: "oklch(0.65 0.2 60 / 0.18)",
    label: "Advanced"
  },
  expert: {
    color: "oklch(0.65 0.22 25)",
    bg: "oklch(0.65 0.22 25 / 0.18)",
    label: "Expert"
  },
  master: {
    color: "oklch(0.7 0.18 70)",
    bg: "oklch(0.7 0.18 70 / 0.2)",
    label: "Master"
  }
};
function getTierStyle$1(tierId) {
  return TIER_STYLE$1[tierId.toLowerCase()] ?? {
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.18)",
    label: tierId
  };
}
const GOLD$1 = "oklch(0.7 0.18 70)";
const GOLD_BG = "oklch(0.7 0.18 70 / 0.12)";
const GOLD_BORDER = "oklch(0.7 0.18 70 / 0.4)";
function buildQrSvg(url) {
  const MODULES = 25;
  const SIZE = 250;
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
        const x = c * CELL;
        const y = r * CELL;
        rects.push(
          `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="currentColor"/>`
        );
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function QrDisplay({ url }) {
  const src = buildQrSvg(url);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center gap-2",
      style: {
        background: GOLD_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: "0.75rem",
        padding: "1rem"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt: "QR code",
            width: 110,
            height: 110,
            style: { color: GOLD$1 },
            className: "rounded"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center max-w-[120px] leading-snug", children: "Scan to verify" })
      ]
    }
  );
}
function useCopy$1(timeout = 2e3) {
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
function fmtDate$1(issuedAt) {
  return new Date(Number(issuedAt) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function CertificateModal({
  cert,
  open,
  onClose,
  personalInfo,
  showDownload
}) {
  const { copied: copiedId, copy: copyId } = useCopy$1();
  const { copied: copiedLink, copy: copyLink } = useCopy$1();
  const [origin, setOrigin] = reactExports.useState("https://demonzeno.com");
  const [activeTab, setActiveTab] = reactExports.useState(
    showDownload ? "download" : "details"
  );
  reactExports.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  reactExports.useEffect(() => {
    if (open) setActiveTab(showDownload ? "download" : "details");
  }, [open, showDownload]);
  if (!cert) return null;
  const tierStyle = getTierStyle$1(cert.tierId);
  const verifyUrl = `${origin}/certificates?verify=${cert.certId}`;
  const tweetText = encodeURIComponent(
    `I just earned the ${cert.tierName} certificate from DemonZeno Trading Academy! 🎓

Certificate ID: ${cert.certId}
#DemonZeno #TradingAcademy #DMNZ

Verify: ${verifyUrl}`
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  const binancePost = `https://www.binance.com/en/square/post?text=${tweetText}`;
  const isRevoked = !cert.isValid;
  const genInfo = personalInfo ?? {
    fullName: cert.certInfo.fullName,
    fathersName: cert.certInfo.fathersName,
    country: cert.certInfo.country,
    dateOfBirth: cert.certInfo.dateOfBirth,
    email: cert.certInfo.email,
    city: cert.certInfo.city
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "cert_wall.verify.dialog",
      className: "max-w-2xl w-full p-0 overflow-hidden",
      style: {
        background: "oklch(0.16 0.01 260)",
        border: `1.5px solid ${GOLD_BORDER}`,
        boxShadow: `0 0 60px ${GOLD_BG}, 0 24px 64px rgba(0,0,0,0.5)`,
        maxHeight: "92vh",
        overflowY: "auto"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "data-ocid": "cert_wall.verify.close_button",
            "aria-label": "Close",
            className: "absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors",
            style: { background: "oklch(0.22 0.01 260)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        ),
        isRevoked && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wider",
            style: {
              background: "oklch(0.55 0.22 25 / 0.9)",
              color: "oklch(0.98 0.005 25)"
            },
            "data-ocid": "cert_wall.verify.revoked_banner",
            children: "⚠ This certificate has been REVOKED and is no longer valid"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative px-6 py-5 flex items-center gap-4",
            style: {
              background: `linear-gradient(135deg, ${GOLD_BG} 0%, oklch(0.18 0.01 260) 100%)`,
              borderBottom: `1px solid ${GOLD_BORDER}`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10",
                  style: {
                    background: `radial-gradient(circle at top right, ${GOLD$1}, transparent 70%)`
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  style: { background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6", style: { color: GOLD$1 } })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold uppercase tracking-widest",
                      style: { color: GOLD$1 },
                      children: "DemonZeno Trading Academy"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                      style: { background: tierStyle.bg, color: tierStyle.color },
                      children: cert.tierName
                    }
                  ),
                  isRevoked && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-2 py-0.5 rounded-full text-xs font-bold uppercase",
                      style: {
                        background: "oklch(0.55 0.22 25 / 0.2)",
                        color: "oklch(0.65 0.22 25)"
                      },
                      children: "REVOKED"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-0.5", children: "Official Certificate of Completion — Perfect 30/30 Score" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex border-b",
            style: { borderBottomColor: "oklch(0.25 0.01 260)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab("details"),
                  "data-ocid": "cert_wall.verify.details_tab",
                  className: "flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
                  style: {
                    color: activeTab === "details" ? GOLD$1 : "oklch(0.55 0.01 260)",
                    borderBottom: activeTab === "details" ? `2px solid ${GOLD$1}` : "2px solid transparent"
                  },
                  children: "View Certificate"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveTab("download"),
                  "data-ocid": "cert_wall.verify.download_tab",
                  className: "flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5",
                  style: {
                    color: activeTab === "download" ? GOLD$1 : "oklch(0.55 0.01 260)",
                    borderBottom: activeTab === "download" ? `2px solid ${GOLD$1}` : "2px solid transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
                    " Download Image"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: activeTab === "details" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4 text-center relative",
              style: {
                background: GOLD_BG,
                border: `1.5px solid ${GOLD_BORDER}`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-1", children: "Certificate ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "font-mono text-3xl font-bold tracking-[0.35em]",
                      style: { color: GOLD$1 },
                      children: cert.certId
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => copyId(cert.certId),
                      "data-ocid": "cert_wall.verify.copy_id_button",
                      "aria-label": "Copy certificate ID",
                      className: "shrink-0 transition-colors",
                      style: { color: copiedId ? GOLD$1 : "oklch(0.5 0.01 260)" },
                      children: copiedId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid grid-cols-2 gap-x-6 gap-y-3.5", children: [
              { label: "Full Name", value: cert.certInfo.fullName },
              {
                label: "Father's Name",
                value: cert.certInfo.fathersName
              },
              { label: "Country", value: cert.certInfo.country },
              { label: "City", value: cert.certInfo.city },
              {
                label: "Date of Birth",
                value: cert.certInfo.dateOfBirth
              },
              {
                label: "Score",
                value: `${cert.score} / ${cert.totalQuestions} ✓`
              },
              { label: "Date Issued", value: fmtDate$1(cert.issuedAt) },
              { label: "Email", value: cert.certInfo.email }
            ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mb-0.5", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm font-semibold text-foreground truncate",
                  title: String(value),
                  children: String(value)
                }
              )
            ] }, label)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex items-start justify-center sm:justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrDisplay, { url: verifyUrl }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t", style: { borderColor: GOLD_BORDER } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => copyLink(verifyUrl),
                "data-ocid": "cert_wall.verify.copy_link_button",
                className: "flex-1 min-w-[140px] gap-2 border-input",
                children: copiedLink ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                  " Link Copied!"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3.5 h-3.5" }),
                  " Copy Link"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => window.open(twitterUrl, "_blank", "noopener"),
                "data-ocid": "cert_wall.verify.share_twitter_button",
                className: "flex-1 min-w-[140px] gap-2 border-input",
                style: { color: "oklch(0.65 0.15 210)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-3.5 h-3.5" }),
                  "Share on X"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => window.open(binancePost, "_blank", "noopener"),
                "data-ocid": "cert_wall.verify.share_binance_button",
                className: "flex-1 min-w-[160px] gap-2 border-input",
                style: { color: GOLD$1 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                  "Share on Binance Square"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center leading-relaxed", children: [
            "This certificate is permanently stored on the Internet Computer blockchain.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "font-mono cursor-pointer hover:underline bg-transparent border-0 p-0",
                onClick: () => copyLink(verifyUrl),
                style: { color: GOLD$1 },
                children: verifyUrl.replace("https://", "")
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CertificateGenerator, { certificate: cert, personalInfo: genInfo }) })
      ]
    }
  ) });
}
const TIERS = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master"
];
const GOLD = "oklch(0.7 0.18 70)";
const TIER_STYLE = {
  beginner: {
    color: "oklch(0.65 0.18 145)",
    bg: "oklch(0.65 0.18 145 / 0.15)"
  },
  intermediate: {
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.15)"
  },
  advanced: { color: "oklch(0.65 0.2 60)", bg: "oklch(0.65 0.2 60 / 0.15)" },
  expert: { color: "oklch(0.65 0.22 25)", bg: "oklch(0.65 0.22 25 / 0.15)" },
  master: { color: GOLD, bg: "oklch(0.7 0.18 70 / 0.15)" }
};
function getTierStyle(tierId) {
  return TIER_STYLE[tierId.toLowerCase()] ?? {
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.15)"
  };
}
function fmtDate(issuedAt) {
  return new Date(Number(issuedAt) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function isAnniversary(issuedAt) {
  const days = (Date.now() - Number(issuedAt) / 1e6) / 864e5;
  return days >= 358 && days <= 372;
}
function useCopy(timeout = 2e3) {
  const [copied, setCopied] = reactExports.useState(null);
  const t = reactExports.useRef(null);
  function copy(key, text) {
    navigator.clipboard.writeText(text).catch(() => {
    });
    setCopied(key);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(null), timeout);
  }
  return { copied, copy };
}
function getUrlParam(key) {
  try {
    return new URLSearchParams(window.location.search).get(key) ?? "";
  } catch {
    return "";
  }
}
function TierFilterTabs({
  active,
  onChange,
  counts
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-1 flex-wrap",
      role: "tablist",
      "aria-label": "Filter by tier",
      children: TIERS.map((tier) => {
        const isActive = active === tier;
        const count = tier === "All" ? void 0 : counts[tier] ?? 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            onClick: () => onChange(tier),
            "data-ocid": `cert_wall.filter.${tier.toLowerCase()}`,
            className: "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5",
            style: isActive ? {
              background: "oklch(0.65 0.15 190 / 0.2)",
              color: "oklch(0.65 0.15 190)",
              border: "1px solid oklch(0.65 0.15 190 / 0.4)"
            } : {
              background: "oklch(0.22 0.01 260)",
              color: "oklch(0.55 0.01 260)",
              border: "1px solid oklch(0.28 0.01 260)"
            },
            children: [
              tier,
              count !== void 0 && count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  style: isActive ? {
                    background: "oklch(0.65 0.15 190)",
                    color: "oklch(0.14 0.01 260)"
                  } : {
                    background: "oklch(0.28 0.01 260)",
                    color: "oklch(0.65 0.01 260)"
                  },
                  children: count
                }
              )
            ]
          },
          tier
        );
      })
    }
  );
}
function TableSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-28" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-32" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-20" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-5 w-20 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4 hidden lg:table-cell text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-4 w-24 ml-auto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-6 w-14 ml-auto rounded-md" }) })
  ] }, i)) });
}
function TableHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Cert ID" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Name" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell", children: "Country" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell", children: "Tier" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell", children: "Date Issued" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4" })
  ] }) });
}
function CertRow({
  cert,
  index,
  onVerify,
  onCopyId,
  copiedId
}) {
  const style = getTierStyle(cert.tierId);
  const isRevoked = !cert.isValid;
  const anniversary = isAnniversary(cert.issuedAt);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      "data-ocid": `cert_wall.list.item.${index + 1}`,
      className: `border-b border-border/50 hover:bg-muted/20 transition-colors ${isRevoked ? "opacity-50" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onCopyId(cert.certId),
              "aria-label": "Copy ID",
              className: "transition-colors shrink-0",
              style: {
                color: copiedId === cert.certId ? GOLD : "oklch(0.45 0.01 260)"
              },
              children: copiedId === cert.certId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-sm font-bold tracking-widest",
              style: { color: isRevoked ? "oklch(0.45 0.01 260)" : GOLD },
              children: cert.certId
            }
          ),
          isRevoked && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-1.5 py-0.5 rounded text-xs font-bold uppercase",
              style: {
                background: "oklch(0.55 0.22 25 / 0.15)",
                color: "oklch(0.65 0.22 25)"
              },
              children: "REVOKED"
            }
          ),
          cert.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-current", style: { color: GOLD } }),
          anniversary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "1 Year Anniversary!", className: "text-sm", children: "🎂" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm leading-tight", children: cert.certInfo.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "s/o ",
            cert.certInfo.fathersName
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-sm text-muted-foreground hidden md:table-cell", children: cert.certInfo.country }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
            style: { background: style.bg, color: style.color },
            children: cert.tierName
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-sm text-muted-foreground text-right hidden lg:table-cell", children: fmtDate(cert.issuedAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3.5 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => onVerify(cert),
            "data-ocid": `cert_wall.list.verify_button.${index + 1}`,
            className: "h-7 px-2.5 text-xs gap-1 hover:bg-primary/10",
            style: { color: "oklch(0.65 0.15 190)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3 h-3" }),
              "View"
            ]
          }
        ) })
      ]
    }
  );
}
function CertCard({
  cert,
  index,
  onVerify,
  onCopyId,
  copiedId
}) {
  const style = getTierStyle(cert.tierId);
  const isRevoked = !cert.isValid;
  const anniversary = isAnniversary(cert.issuedAt);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `cert_wall.list.item.${index + 1}`,
      className: `certificate-card flex flex-col gap-3 ${isRevoked ? "opacity-55" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
              style: { background: style.bg, color: style.color },
              children: cert.tierName
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            isRevoked && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "px-1.5 py-0.5 rounded text-xs font-bold uppercase",
                style: {
                  background: "oklch(0.55 0.22 25 / 0.15)",
                  color: "oklch(0.65 0.22 25)"
                },
                children: "REVOKED"
              }
            ),
            cert.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-current", style: { color: GOLD } }),
            anniversary && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "1 Year Anniversary!", className: "text-sm", children: "🎂" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Award,
              {
                className: "w-4 h-4",
                style: { color: isRevoked ? "oklch(0.4 0.01 260)" : GOLD }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Shield,
            {
              className: "w-3.5 h-3.5 shrink-0",
              style: { color: `${GOLD}b0` }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-xs font-bold tracking-widest flex-1",
              style: { color: isRevoked ? "oklch(0.45 0.01 260)" : GOLD },
              children: cert.certId
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onCopyId(cert.certId),
              "aria-label": "Copy ID",
              className: "transition-colors",
              style: {
                color: copiedId === cert.certId ? GOLD : "oklch(0.45 0.01 260)"
              },
              children: copiedId === cert.certId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground leading-tight truncate", children: cert.certInfo.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs", children: [
            "s/o ",
            cert.certInfo.fathersName
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cert.certInfo.country }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmtDate(cert.issuedAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onVerify(cert),
            "data-ocid": `cert_wall.list.verify_button.${index + 1}`,
            className: "w-full gap-1.5 border-border/50 h-8",
            style: { color: "oklch(0.65 0.15 190)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
              "View Certificate"
            ]
          }
        )
      ]
    }
  );
}
function FeaturedCertCard({
  cert,
  onVerify
}) {
  const style = getTierStyle(cert.tierId);
  const { copied, copy } = useCopy();
  const shareUrl = `${window.location.origin}/verify/${cert.certId}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-3 rounded-xl p-5 border-2 transition-smooth relative overflow-hidden",
      style: {
        background: "oklch(0.7 0.18 70 / 0.06)",
        borderColor: "oklch(0.7 0.18 70 / 0.5)",
        boxShadow: "0 0 24px oklch(0.7 0.18 70 / 0.12)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-10",
            style: {
              background: `radial-gradient(circle at top right, ${GOLD}, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-current", style: { color: GOLD } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-bold uppercase tracking-wider",
                style: { color: GOLD },
                children: "Featured Graduate"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "px-2.5 py-1 rounded-full text-xs font-bold uppercase",
              style: { background: style.bg, color: style.color },
              children: cert.tierName
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground leading-tight", children: cert.certInfo.fullName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs mt-0.5", children: [
            "s/o ",
            cert.certInfo.fathersName,
            " · ",
            cert.certInfo.country
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Shield,
            {
              className: "w-3.5 h-3.5 shrink-0",
              style: { color: `${GOLD}b0` }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-xs font-bold tracking-widest",
              style: { color: GOLD },
              children: cert.certId
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmtDate(cert.issuedAt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-semibold",
              style: { color: "oklch(0.7 0.18 145)" },
              children: "✓ Verified"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onVerify(cert),
              className: "flex-1 h-8 text-xs gap-1 border-border/50",
              style: { color: "oklch(0.65 0.15 190)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                "View"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => copy(cert.certId, shareUrl),
              "aria-label": "Copy share link",
              className: "h-8 w-8 p-0 text-xs",
              style: {
                color: copied === cert.certId ? GOLD : "oklch(0.5 0.01 260)"
              },
              children: copied === cert.certId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function VerifyInlineResult({
  verifyId,
  onOpen,
  onClear
}) {
  const { data: verifiedCert, isLoading: isVerifying } = useVerifyCertificate(verifyId);
  if (isVerifying) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "cert_wall.verify.loading_state",
        className: "flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-muted-foreground text-sm",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" }),
          "Verifying ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "certificate-id font-mono", children: verifyId }),
          "…"
        ]
      }
    );
  }
  if (!verifiedCert) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "cert_wall.verify.error_state",
        className: "flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-destructive shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Certificate not found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "No certificate with ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: verifyId }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClear,
              "data-ocid": "cert_wall.verify.close_button",
              className: "ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0",
              "aria-label": "Dismiss",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "cert_wall.verify.success_state",
      className: "flex items-center gap-3 p-4 rounded-xl border bg-card",
      style: { borderColor: "oklch(0.7 0.18 145 / 0.4)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ShieldCheck,
          {
            className: "w-5 h-5 shrink-0",
            style: { color: "oklch(0.7 0.18 145)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "Certificate verified —",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GOLD }, className: "font-mono", children: verifiedCert.certId })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            verifiedCert.certInfo.fullName,
            " · ",
            verifiedCert.tierName,
            " ·",
            " ",
            fmtDate(verifiedCert.issuedAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onOpen(verifiedCert),
            "data-ocid": "cert_wall.verify.open_modal_button",
            className: "shrink-0 h-8 text-xs gap-1",
            style: { color: "oklch(0.65 0.15 190)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3 h-3" }),
              "View Full"
            ]
          }
        )
      ]
    }
  );
}
function CertLeaderboard({ allCerts }) {
  const leaders = Object.values(
    allCerts.filter((c) => c.isValid).reduce((acc, cert) => {
      const key = cert.certInfo.email || cert.certInfo.fullName;
      if (!acc[key]) {
        acc[key] = {
          name: cert.certInfo.fullName,
          country: cert.certInfo.country,
          tiers: /* @__PURE__ */ new Set(),
          issuedAt: cert.issuedAt
        };
      }
      acc[key].tiers.add(cert.tierId);
      if (cert.issuedAt > acc[key].issuedAt)
        acc[key].issuedAt = cert.issuedAt;
      return acc;
    }, {})
  ).map((v) => ({ ...v, tierCount: v.tiers.size })).sort(
    (a, b) => b.tierCount - a.tierCount || Number(b.issuedAt) - Number(a.issuedAt)
  ).slice(0, 10);
  if (leaders.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", "data-ocid": "cert_wall.leaderboard.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-4 h-4", style: { color: GOLD } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Certificate Leaderboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "(top earners by tiers completed)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: ["#", "Name", "Country", "Tiers"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: `py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground${i === 2 ? " hidden sm:table-cell" : ""}${i === 3 ? " text-right" : ""}`,
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: leaders.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `cert_wall.leaderboard.item.${i + 1}`,
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-sm font-bold",
                style: {
                  color: i === 0 ? GOLD : i === 1 ? "oklch(0.70 0.01 260)" : i === 2 ? "oklch(0.65 0.14 50)" : "oklch(0.55 0.01 260)"
                },
                children: i + 1
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm font-semibold text-foreground", children: l.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell", children: l.country }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono font-bold text-sm",
                style: { color: GOLD },
                children: [
                  l.tierCount,
                  "/5"
                ]
              }
            ) })
          ]
        },
        `${l.name}-${i}`
      )) })
    ] }) })
  ] });
}
const PAGE_SIZE = 20;
function CertificateWall() {
  const [searchId, setSearchId] = reactExports.useState(
    () => getUrlParam("id").toUpperCase()
  );
  const [activeVerifyId, setActiveVerifyId] = reactExports.useState("");
  const [tierFilter, setTierFilter] = reactExports.useState("All");
  const [sortDesc, setSortDesc] = reactExports.useState(true);
  const [page, setPage] = reactExports.useState(1);
  const [modalCert, setModalCert] = reactExports.useState(null);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const { copied: copiedId, copy: copyId } = useCopy();
  const { data: allCerts = [], isLoading } = useListAllCertificates();
  const { data: featuredCerts = [] } = useFeaturedCertificates();
  const autoVerifyId = getUrlParam("verify").toUpperCase();
  const [autoModalOpened, setAutoModalOpened] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!autoVerifyId || autoModalOpened || isLoading) return;
    const found = allCerts.find((c) => c.certId === autoVerifyId);
    if (found) {
      setModalCert(found);
      setModalOpen(true);
      setAutoModalOpened(true);
    } else if (!isLoading) {
      setActiveVerifyId(autoVerifyId);
      setAutoModalOpened(true);
    }
  }, [allCerts, isLoading, autoVerifyId, autoModalOpened]);
  reactExports.useEffect(() => {
    setPage(1);
  }, [tierFilter, sortDesc, searchId]);
  const tierCounts = {};
  for (const c of allCerts) {
    const k = c.tierName;
    tierCounts[k] = (tierCounts[k] ?? 0) + 1;
  }
  const countryCount = new Set(allCerts.map((c) => c.certInfo.country)).size;
  const validCount = allCerts.filter((c) => c.isValid).length;
  const filtered = allCerts.filter(
    (c) => tierFilter === "All" ? true : c.tierName.toLowerCase() === tierFilter.toLowerCase()
  ).sort(
    (a, b) => sortDesc ? Number(b.issuedAt - a.issuedAt) : Number(a.issuedAt - b.issuedAt)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageCerts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function handleVerifySubmit(e) {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    if (id.length === 9) setActiveVerifyId(id);
  }
  function clearVerify() {
    setActiveVerifyId("");
    setSearchId("");
  }
  function openModal(cert) {
    setModalCert(cert);
    setModalOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "cert_wall.page",
      className: "min-h-screen bg-background py-12 pb-20",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-6xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10 fade-in-up", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-3.5 h-3.5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-xs font-semibold tracking-wide uppercase", children: "Public Certificate Wall" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-3xl md:text-5xl text-foreground mb-3 text-glow leading-tight", children: [
              "DemonZeno Academy —",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: GOLD }, children: "Certificate Wall" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed", children: [
              "All officially issued DemonZeno Trading Academy certificates. Every certificate represents a perfect",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "30/30" }),
              " score — the hardest standard in trading education."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "blockquote",
              {
                className: "mt-5 text-sm italic max-w-xl mx-auto",
                style: { color: `${GOLD}cc` },
                children: '"Every certificate is a battle won. Every graduate is a warrior forged."'
              }
            ),
            !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full border font-semibold text-sm",
                style: {
                  border: `1.5px solid ${GOLD}50`,
                  background: "oklch(0.7 0.18 70 / 0.08)",
                  color: GOLD
                },
                "data-ocid": "cert_wall.header.total_count",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-4 h-4" }),
                  allCerts.length,
                  " Certificate",
                  allCerts.length !== 1 ? "s" : "",
                  " ",
                  "Issued Globally"
                ]
              }
            )
          ] }),
          !isLoading && allCerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [
            {
              icon: Award,
              label: "Total Issued",
              value: allCerts.length,
              color: GOLD
            },
            {
              icon: Globe,
              label: "Countries",
              value: countryCount,
              color: "oklch(0.65 0.15 190)"
            },
            {
              icon: Users,
              label: "Valid Certs",
              value: validCount,
              color: "oklch(0.7 0.18 145)"
            }
          ].map(({ icon: Icon, label, value, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-4 md:p-5 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 mx-auto mb-2", style: { color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl md:text-2xl text-foreground", children: value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider mt-0.5", children: label })
          ] }, label)) }),
          !isLoading && allCerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CertLeaderboard, { allCerts }),
          !isLoading && featuredCerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", "data-ocid": "cert_wall.featured.section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 fill-current", style: { color: GOLD } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Featured Graduates" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: featuredCerts.map((cert) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FeaturedCertCard,
              {
                cert,
                onVerify: openModal
              },
              cert.certId
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-3 mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleVerifySubmit, className: "flex flex-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  "data-ocid": "cert_wall.search.search_input",
                  placeholder: "Enter 9-character certificate ID to verify…",
                  value: searchId,
                  onChange: (e) => setSearchId(e.target.value.toUpperCase()),
                  className: "pl-9 pr-9 bg-card border-input h-11 font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-body",
                  maxLength: 9,
                  "aria-label": "Certificate ID"
                }
              ),
              searchId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearVerify,
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                  "aria-label": "Clear",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "submit",
                "data-ocid": "cert_wall.search.submit_button",
                disabled: searchId.trim().length !== 9,
                className: "btn-primary btn-micro h-11 px-5 shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 mr-1.5" }),
                  "Verify"
                ]
              }
            )
          ] }) }),
          activeVerifyId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            VerifyInlineResult,
            {
              verifyId: activeVerifyId,
              onOpen: openModal,
              onClear: clearVerify
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TierFilterTabs,
              {
                active: tierFilter,
                onChange: setTierFilter,
                counts: tierCounts
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                filtered.length,
                " result",
                filtered.length !== 1 ? "s" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setSortDesc((v) => !v),
                  "data-ocid": "cert_wall.sort.toggle",
                  className: "h-8 gap-1.5 text-xs border-input",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { className: "w-3.5 h-3.5" }),
                    sortDesc ? "Newest First" : "Oldest First"
                  ]
                }
              )
            ] })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "hidden sm:block rounded-xl border border-border overflow-hidden bg-card",
                "data-ocid": "cert_wall.list.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden certificate-wall-grid", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skeleton h-44 rounded-xl" }, i)) })
          ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "cert_wall.list.empty_state",
              className: "flex flex-col items-center gap-5 py-20 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-20 h-20 rounded-full flex items-center justify-center",
                    style: { background: `${GOLD}15`, border: `1px solid ${GOLD}30` },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-9 h-9", style: { color: `${GOLD}80` } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground text-xl mb-2", children: tierFilter !== "All" ? `No ${tierFilter} certificates yet` : "No certificates issued yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed", children: tierFilter !== "All" ? `No one has completed the ${tierFilter} tier yet. Be the first!` : "Complete the DemonZeno Academy with a perfect 30/30 score to earn your place on this wall." }),
                  tierFilter !== "All" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setTierFilter("All"),
                      "data-ocid": "cert_wall.filter.clear_button",
                      className: "mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors underline",
                      children: "Show all tiers"
                    }
                  )
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "hidden sm:block rounded-xl border border-border overflow-hidden bg-card",
                "data-ocid": "cert_wall.list.table",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: pageCerts.map((cert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CertRow,
                    {
                      cert,
                      index: (page - 1) * PAGE_SIZE + i,
                      onVerify: openModal,
                      onCopyId: (id) => copyId(id, id),
                      copiedId
                    },
                    cert.certId
                  )) })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:hidden certificate-wall-grid", children: pageCerts.map((cert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              CertCard,
              {
                cert,
                index: (page - 1) * PAGE_SIZE + i,
                onVerify: openModal,
                onCopyId: (id) => copyId(id, id),
                copiedId
              },
              cert.certId
            )) }),
            totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setPage((p) => Math.max(1, p - 1)),
                  disabled: page === 1,
                  "data-ocid": "cert_wall.pagination_prev",
                  className: "h-8 gap-1.5 text-xs",
                  children: "← Prev"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground px-3", children: [
                "Page ",
                page,
                " of ",
                totalPages
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
                  disabled: page === totalPages,
                  "data-ocid": "cert_wall.pagination_next",
                  className: "h-8 gap-1.5 text-xs",
                  children: "Next →"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All certificates are permanently stored on the Internet Computer blockchain. Use the verify function to authenticate any certificate by its unique 9-character ID." })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CertificateModal,
          {
            cert: modalCert,
            open: modalOpen,
            onClose: () => {
              setModalOpen(false);
              setModalCert(null);
            }
          }
        )
      ]
    }
  );
}
export {
  CertificateWall
};
