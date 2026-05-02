import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as Twitter } from "./index-LpNaIZiB.js";
import { B as Button } from "./button-CM5rLxPe.js";
import { D as Download } from "./star-BrTRvvX0.js";
import { E as ExternalLink } from "./external-link-j1Jn2SNC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode);
const CW = 1200;
const CH = 850;
const FRAMES = [
  {
    id: "classic",
    label: "Classic",
    preview: "bg-gradient-to-br from-stone-100 to-amber-50"
  },
  {
    id: "dark",
    label: "Dark",
    preview: "bg-gradient-to-br from-gray-900 to-slate-900"
  },
  {
    id: "gold",
    label: "Gold",
    preview: "bg-gradient-to-br from-amber-100 to-yellow-200"
  }
];
const TIER_BADGE_COLOR = {
  master: { fill: "#b8860b", stroke: "#ffd700", text: "#1a0f00" },
  expert: { fill: "#a8a8a8", stroke: "#d0d0d0", text: "#1a1a1a" },
  default: { fill: "#cd7f32", stroke: "#e8a040", text: "#ffffff" }
};
function getBadgeColors(tierId) {
  const k = tierId.toLowerCase();
  if (k === "master") return TIER_BADGE_COLOR.master;
  if (k === "expert") return TIER_BADGE_COLOR.expert;
  return TIER_BADGE_COLOR.default;
}
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
function drawDiamondDivider(ctx, cx, y, halfW, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 24, y);
  ctx.lineTo(cx - halfW, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 24, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, y - 6);
  ctx.lineTo(cx + 10, y);
  ctx.lineTo(cx, y + 6);
  ctx.lineTo(cx - 10, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawCornerOrnament(ctx, x, y, size, flipX, flipY, color) {
  ctx.save();
  ctx.translate(x, y);
  if (flipX) ctx.scale(-1, 1);
  if (flipY) ctx.scale(1, -1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.35, 0, Math.PI / 2);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(4, 0);
  ctx.lineTo(0, 4);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawShieldBadge(ctx, cx, cy, size, tierId) {
  const colors = getBadgeColors(tierId);
  const s = size;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.75, -s * 0.6);
  ctx.lineTo(s * 0.75, s * 0.2);
  ctx.bezierCurveTo(s * 0.75, s * 0.8, 0, s, 0, s);
  ctx.bezierCurveTo(0, s, -s * 0.75, s * 0.8, -s * 0.75, s * 0.2);
  ctx.lineTo(-s * 0.75, -s * 0.6);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, colors.fill);
  grad.addColorStop(1, colors.stroke);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = colors.text;
  ctx.lineWidth = s * 0.15;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-s * 0.3, 0);
  ctx.lineTo(-s * 0.05, s * 0.3);
  ctx.lineTo(s * 0.4, -s * 0.35);
  ctx.stroke();
  ctx.restore();
}
function drawVerifiedStamp(ctx, cx, cy, r, textColor, borderColor) {
  ctx.save();
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.45, cy - r * 0.35);
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.round(r * 0.28)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);
  ctx.fillText("VERIFIED LEARNER", 0, r * 0.72);
  ctx.restore();
}
function drawCertificate(ctx, frame, cert, info, demonZenoImg) {
  ctx.clearRect(0, 0, CW, CH);
  let bgColor;
  let textPrimary;
  let textSecondary;
  let accentColor;
  let borderColor;
  let stampColor;
  if (frame === "classic") {
    bgColor = "#f8f4ec";
    textPrimary = "#1a0f08";
    textSecondary = "#5a3e2b";
    accentColor = "#8b6914";
    borderColor = "#8b7355";
    stampColor = "#9b2020";
  } else if (frame === "dark") {
    bgColor = "#0a0a1a";
    textPrimary = "#f0e8d0";
    textSecondary = "#c8b898";
    accentColor = "#d4a832";
    borderColor = "#d4a832";
    stampColor = "#d4a832";
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, CW, CH);
    bgGrad.addColorStop(0, "#fdf3d8");
    bgGrad.addColorStop(1, "#f5d980");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CW, CH);
    bgColor = "transparent";
    textPrimary = "#1a0e00";
    textSecondary = "#4a3000";
    accentColor = "#7a5c00";
    borderColor = "#b8860b";
    stampColor = "#7a0000";
  }
  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CW, CH);
  }
  if (frame !== "dark") {
    const texGrad = ctx.createRadialGradient(
      CW / 2,
      CH / 2,
      0,
      CW / 2,
      CH / 2,
      CW * 0.7
    );
    texGrad.addColorStop(0, "rgba(255,255,255,0.3)");
    texGrad.addColorStop(1, "rgba(139,115,85,0.08)");
    ctx.fillStyle = texGrad;
    ctx.fillRect(0, 0, CW, CH);
  }
  const margin = 20;
  const innerMargin = 34;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = frame === "dark" ? 3 : 2.5;
  if (frame === "dark") {
    ctx.shadowBlur = 12;
    ctx.shadowColor = `${borderColor}88`;
  }
  drawRoundRect(ctx, margin, margin, CW - margin * 2, CH - margin * 2, 8);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = borderColor + (frame === "dark" ? "66" : "60");
  ctx.lineWidth = 1;
  drawRoundRect(
    ctx,
    innerMargin,
    innerMargin,
    CW - innerMargin * 2,
    CH - innerMargin * 2,
    4
  );
  ctx.stroke();
  const ornSize = 40;
  const ornPad = margin + 8;
  drawCornerOrnament(ctx, ornPad, ornPad, ornSize, false, false, borderColor);
  drawCornerOrnament(
    ctx,
    CW - ornPad,
    ornPad,
    ornSize,
    true,
    false,
    borderColor
  );
  drawCornerOrnament(
    ctx,
    ornPad,
    CH - ornPad,
    ornSize,
    false,
    true,
    borderColor
  );
  drawCornerOrnament(
    ctx,
    CW - ornPad,
    CH - ornPad,
    ornSize,
    true,
    true,
    borderColor
  );
  if (demonZenoImg) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    const wmSize = 140;
    const wmX = CW - wmSize - 50;
    const wmY = CH - wmSize - 50;
    ctx.drawImage(demonZenoImg, wmX, wmY, wmSize, wmSize);
    ctx.restore();
  }
  ctx.textAlign = "center";
  ctx.fillStyle = accentColor;
  ctx.font = `bold 18px 'Space Grotesk', serif`;
  ctx.letterSpacing = "4px";
  ctx.fillText("DEMONZENO TRADING ACADEMY", CW / 2, 90);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = textPrimary;
  ctx.font = "italic bold 42px Georgia, serif";
  ctx.fillText("Certificate of Achievement", CW / 2, 148);
  drawDiamondDivider(ctx, CW / 2, 172, 420, borderColor);
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("This is to certify that", CW / 2, 206);
  ctx.fillStyle = textPrimary;
  ctx.font = `bold 56px 'Space Grotesk', Georgia, serif`;
  const nameText = info.fullName || cert.certInfo.fullName;
  ctx.fillText(nameText, CW / 2, 272);
  ctx.fillStyle = textSecondary;
  ctx.font = "italic 18px Georgia, serif";
  ctx.fillText(
    `Son/Daughter of ${info.fathersName || cert.certInfo.fathersName}`,
    CW / 2,
    302
  );
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("has successfully completed the", CW / 2, 338);
  ctx.fillStyle = accentColor;
  ctx.font = `bold 32px 'Space Grotesk', Georgia, serif`;
  ctx.letterSpacing = "3px";
  ctx.fillText(`${cert.tierName.toUpperCase()} TIER`, CW / 2, 378);
  ctx.letterSpacing = "0px";
  drawShieldBadge(ctx, CW / 2, 440, 28, cert.tierId);
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("of the DemonZeno Trading Academy", CW / 2, 490);
  ctx.fillStyle = frame === "dark" ? "#6edcc0" : accentColor;
  ctx.font = "bold 16px Georgia, serif";
  ctx.fillText(
    `with a perfect score of ${String(cert.score)}/${String(cert.totalQuestions)}`,
    CW / 2,
    514
  );
  drawDiamondDivider(ctx, CW / 2, 536, 360, borderColor);
  const infoY = 562;
  const leftX = 300;
  const rightX = 700;
  const labelFont = `bold 10px 'Space Grotesk', sans-serif`;
  const valueFont = "14px Georgia, serif";
  const lineH = 36;
  const leftInfo = [
    { label: "COUNTRY", value: info.country || cert.certInfo.country },
    {
      label: "DATE OF BIRTH",
      value: info.dateOfBirth || cert.certInfo.dateOfBirth
    },
    { label: "CITY", value: info.city || cert.certInfo.city }
  ];
  const rightInfo = [
    { label: "EMAIL", value: info.email || cert.certInfo.email },
    {
      label: "DATE OF ISSUE",
      value: new Date(Number(cert.issuedAt) / 1e6).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }
      )
    },
    { label: "CERTIFICATE ID", value: cert.certId }
  ];
  for (let i = 0; i < leftInfo.length; i++) {
    const yOff = infoY + i * lineH;
    ctx.textAlign = "right";
    ctx.fillStyle = `${accentColor}bb`;
    ctx.font = labelFont;
    ctx.letterSpacing = "1.5px";
    ctx.fillText(leftInfo[i].label, leftX, yOff);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = textSecondary;
    ctx.font = valueFont;
    ctx.fillText(leftInfo[i].value, leftX, yOff + 16);
  }
  for (let i = 0; i < rightInfo.length; i++) {
    const yOff = infoY + i * lineH;
    ctx.textAlign = "left";
    ctx.fillStyle = `${accentColor}bb`;
    ctx.font = labelFont;
    ctx.letterSpacing = "1.5px";
    ctx.fillText(rightInfo[i].label, rightX, yOff);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = textSecondary;
    ctx.font = valueFont;
    ctx.fillText(rightInfo[i].value, rightX, yOff + 16);
  }
  ctx.textAlign = "left";
  ctx.fillStyle = accentColor;
  ctx.font = `bold 13px 'JetBrains Mono', monospace`;
  ctx.letterSpacing = "3px";
  ctx.fillText(`ID: ${cert.certId}`, 60, CH - 50);
  ctx.letterSpacing = "0px";
  drawVerifiedStamp(ctx, CW - 168, CH / 2 + 40, 52, stampColor, stampColor);
  ctx.textAlign = "center";
  ctx.fillStyle = `${accentColor}80`;
  ctx.font = "italic 12px Georgia, serif";
  ctx.fillText(
    "No expiry — Issued forever · DemonZeno Trading Academy",
    CW / 2,
    CH - 50
  );
  ctx.textAlign = "right";
  ctx.fillStyle = `${accentColor}66`;
  ctx.font = `bold 10px 'Space Grotesk', sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText("DemonZeno ® DMNZ Academy", CW - 55, CH - 32);
  ctx.letterSpacing = "0px";
}
function FramePreview({
  frame,
  label,
  active,
  onClick
}) {
  const previewStyle = {
    classic: "linear-gradient(135deg, #f8f4ec 0%, #e8dcc8 100%) border-box",
    dark: "linear-gradient(135deg, #0a0a1a 0%, #1a1a30 100%) border-box",
    gold: "linear-gradient(135deg, #fdf3d8 0%, #f5d980 100%) border-box"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `cert_gen.frame_${frame}`,
      className: "flex flex-col items-center gap-1.5 group",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-16 h-12 rounded-lg border-2 transition-all",
            style: {
              background: previewStyle[frame],
              borderColor: active ? "oklch(0.65 0.15 190)" : "oklch(0.28 0.01 260)",
              boxShadow: active ? "0 0 12px oklch(0.65 0.15 190 / 0.4)" : "none",
              transform: active ? "scale(1.08)" : "scale(1)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-semibold transition-colors",
            style: {
              color: active ? "oklch(0.65 0.15 190)" : "oklch(0.55 0.01 260)"
            },
            children: label
          }
        )
      ]
    }
  );
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
function CertificateGenerator({
  certificate,
  personalInfo,
  onClose
}) {
  const canvasRef = reactExports.useRef(null);
  const [frame, setFrame] = reactExports.useState("classic");
  const [imgLoaded, setImgLoaded] = reactExports.useState(false);
  const demonZenoImgRef = reactExports.useRef(null);
  const { copied, copy } = useCopy();
  const [origin, setOrigin] = reactExports.useState("https://demonzeno.com");
  reactExports.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  reactExports.useEffect(() => {
    const img = new Image();
    img.src = "/assets/demonzeno-character.png";
    img.onload = () => {
      demonZenoImgRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(true);
    };
  }, []);
  const render = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCertificate(
      ctx,
      frame,
      certificate,
      personalInfo,
      demonZenoImgRef.current
    );
  }, [frame, certificate, personalInfo]);
  reactExports.useEffect(() => {
    if (imgLoaded) render();
  }, [imgLoaded, render]);
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `DemonZeno-Certificate-${certificate.certId}.png`;
    link.href = canvas.toDataURL("image/png", 1);
    link.click();
  }
  const verifyUrl = `${origin}/verify/${certificate.certId}`;
  const shareUrl = `${origin}/certificates?verify=${certificate.certId}`;
  const tweetText = encodeURIComponent(
    `I just earned the ${certificate.tierName} certificate from DemonZeno Trading Academy with a PERFECT 30/30! 📈
Verify it here: ${verifyUrl} #DemonZeno #DMNZ #Trading`
  );
  const binancePost = `https://www.binance.com/en/square/post?text=${tweetText}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", "data-ocid": "cert_gen.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-3", children: "Certificate Frame Style" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-6 justify-center", children: FRAMES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        FramePreview,
        {
          frame: f.id,
          label: f.label,
          active: frame === f.id,
          onClick: () => setFrame(f.id)
        },
        f.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative rounded-xl overflow-hidden border",
        style: { borderColor: "oklch(0.28 0.01 260)", maxHeight: "420px" },
        children: [
          !imgLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center",
              style: { background: "oklch(0.14 0.01 260)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              width: CW,
              height: CH,
              className: "w-full h-auto block",
              style: { display: imgLoaded ? "block" : "none" },
              "aria-label": "Certificate preview",
              "data-ocid": "cert_gen.canvas_target"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: handleDownload,
          "data-ocid": "cert_gen.download_button",
          className: "gap-2 font-semibold",
          style: {
            background: "oklch(0.7 0.18 70)",
            color: "#1a0f00"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
            "Download Certificate (PNG)"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => copy(shareUrl),
          "data-ocid": "cert_gen.copy_link_button",
          className: "gap-2",
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }),
            " Link Copied!"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
            " Copy Share Link"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => window.open(
            `https://twitter.com/intent/tweet?text=${tweetText}`,
            "_blank",
            "noopener"
          ),
          "data-ocid": "cert_gen.share_twitter_button",
          className: "gap-2",
          style: { color: "oklch(0.65 0.15 210)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { className: "w-4 h-4" }),
            "Share on X"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => window.open(binancePost, "_blank", "noopener"),
          "data-ocid": "cert_gen.share_binance_button",
          className: "gap-2",
          style: { color: "oklch(0.7 0.18 70)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
            "Share on Binance Square"
          ]
        }
      ),
      onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          onClick: onClose,
          "data-ocid": "cert_gen.close_button",
          className: "gap-2 text-muted-foreground",
          children: "Close"
        }
      )
    ] })
  ] });
}
export {
  Check as C,
  Link2 as L,
  CertificateGenerator as a
};
