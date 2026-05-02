import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as Twitter } from "./index-DhDL5MF6.js";
import { B as Button } from "./button-BgkjFKKh.js";
import { D as Download } from "./star-CfMfmKn7.js";
import { E as ExternalLink } from "./external-link-Bg5l6Ni1.js";
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
const CW = 1400;
const CH = 1e3;
const FRAMES = [
  { id: "classic", label: "Classic" },
  { id: "dark", label: "Dark" },
  { id: "gold", label: "Gold" }
];
function getTierColors(tierId) {
  const k = tierId.toLowerCase();
  if (k === "master")
    return {
      primary: "#FFD700",
      glow: "#FFD70066",
      text: "#1a0800",
      label: "MASTER"
    };
  if (k === "expert")
    return {
      primary: "#C0C0C0",
      glow: "#C0C0C066",
      text: "#111",
      label: "EXPERT"
    };
  if (k === "advanced")
    return {
      primary: "#CD7F32",
      glow: "#CD7F3266",
      text: "#fff",
      label: "ADVANCED"
    };
  if (k === "intermediate")
    return {
      primary: "#4a9eff",
      glow: "#4a9eff66",
      text: "#fff",
      label: "INTERMEDIATE"
    };
  return {
    primary: "#22c55e",
    glow: "#22c55e66",
    text: "#fff",
    label: "BEGINNER"
  };
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
function drawCorner(ctx, x, y, sx, sy, len, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + sx * len, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + sy * len);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    x,
    y,
    len * 0.38,
    sx < 0 ? 0 : Math.PI,
    sy < 0 ? sx < 0 ? 3 * Math.PI / 2 : 3 * Math.PI / 2 : sx < 0 ? Math.PI / 2 : Math.PI / 2,
    true
  );
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - sy * 5);
  ctx.lineTo(x + sx * 5, y);
  ctx.lineTo(x, y + sy * 5);
  ctx.lineTo(x - sx * 5, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawDivider(ctx, cx, y, halfW, color, double_ = false) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  const gap = double_ ? 3 : 0;
  for (const dy of double_ ? [-gap, gap] : [0]) {
    ctx.beginPath();
    ctx.moveTo(cx - halfW, y + dy);
    ctx.lineTo(cx - 14, y + dy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 14, y + dy);
    ctx.lineTo(cx + halfW, y + dy);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, y - 8);
  ctx.lineTo(cx + 8, y);
  ctx.lineTo(cx, y + 8);
  ctx.lineTo(cx - 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawSeal(ctx, cx, cy, r, goldColor) {
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = goldColor;
  ctx.font = `bold ${Math.round(r * 0.52)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⚔", cx, cy);
  const textR = r - 16;
  const letters = "VERIFIED LEARNER";
  const totalAngle = Math.PI * 0.88;
  const startAngle = -Math.PI / 2 - totalAngle / 2;
  ctx.font = `bold ${Math.round(r * 0.17)}px 'Space Grotesk', sans-serif`;
  ctx.fillStyle = goldColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < letters.length; i++) {
    const a = startAngle + i / (letters.length - 1) * totalAngle;
    const lx = cx + textR * Math.cos(a);
    const ly = cy + textR * Math.sin(a);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(letters[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}
function drawQrGrid(ctx, x, y, size, url, color) {
  const MODS = 11;
  const cell = size / MODS;
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
  ctx.save();
  ctx.fillStyle = color;
  for (let r = 0; r < MODS; r++) {
    for (let c = 0; c < MODS; c++) {
      const finder = r < 3 && c < 3 || r < 3 && c >= MODS - 3 || r >= MODS - 3 && c < 3;
      const on = finder ? true : rand() > 0.48;
      if (on)
        ctx.fillRect(
          x + c * cell + 0.5,
          y + r * cell + 0.5,
          cell - 1,
          cell - 1
        );
    }
  }
  ctx.restore();
}
function drawTierBadge(ctx, cx, cy, r, tierId) {
  const tc = getTierColors(tierId);
  ctx.save();
  ctx.shadowBlur = 24;
  ctx.shadowColor = tc.glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  const gr = ctx.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r);
  gr.addColorStop(0, `${tc.primary}ff`);
  gr.addColorStop(0.6, `${tc.primary}cc`);
  gr.addColorStop(1, `${tc.primary}44`);
  ctx.fillStyle = gr;
  ctx.fill();
  ctx.strokeStyle = tc.primary;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 7, 0, Math.PI * 2);
  ctx.strokeStyle = tc.text === "#fff" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = tc.text;
  ctx.font = `bold ${Math.round(r * 0.3)}px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(tc.label, cx, cy);
  ctx.restore();
}
function drawCertificate(ctx, frame, cert, info, demonZenoImg) {
  ctx.clearRect(0, 0, CW, CH);
  let bgC1;
  let bgC2;
  let gold;
  let textLight;
  let textMid;
  let borderCol;
  if (frame === "dark") {
    bgC1 = "#0a0612";
    bgC2 = "#0f0a1e";
    gold = "#FFD700";
    textLight = "#f5ecd0";
    textMid = "#c8b880";
    borderCol = "#FFD700";
  } else if (frame === "classic") {
    bgC1 = "#1a1230";
    bgC2 = "#110d22";
    gold = "#d4a832";
    textLight = "#f0e8d8";
    textMid = "#b89860";
    borderCol = "#d4a832";
  } else {
    bgC1 = "#0c0a08";
    bgC2 = "#1a1408";
    gold = "#FFD700";
    textLight = "#fff8e0";
    textMid = "#d4b860";
    borderCol = "#FFD700";
  }
  const bgGrad = ctx.createLinearGradient(0, 0, CW, CH);
  bgGrad.addColorStop(0, bgC1);
  bgGrad.addColorStop(1, bgC2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CW, CH);
  const vignette = ctx.createRadialGradient(
    CW / 2,
    CH / 2,
    CH * 0.1,
    CW / 2,
    CH / 2,
    CW * 0.75
  );
  vignette.addColorStop(0, "rgba(255,215,0,0.04)");
  vignette.addColorStop(0.5, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, CW, CH);
  ctx.save();
  ctx.globalAlpha = 0.042;
  ctx.translate(CW / 2, CH / 2);
  ctx.rotate(-Math.PI / 5.5);
  ctx.fillStyle = gold;
  ctx.font = `bold 130px 'Space Grotesk', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DEMONZENO", 0, 0);
  ctx.restore();
  if (demonZenoImg) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    const wmSize = 200;
    ctx.drawImage(
      demonZenoImg,
      CW - wmSize - 30,
      CH - wmSize - 30,
      wmSize,
      wmSize
    );
    ctx.restore();
  }
  const M = 22;
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = `${gold}55`;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 7;
  drawRoundRect(ctx, M, M, CW - M * 2, CH - M * 2, 6);
  ctx.stroke();
  ctx.restore();
  const M2 = 36;
  ctx.strokeStyle = `${gold}88`;
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, M2, M2, CW - M2 * 2, CH - M2 * 2, 4);
  ctx.stroke();
  const ornPad = M + 14;
  const ornLen = 52;
  drawCorner(ctx, ornPad, ornPad, 1, 1, ornLen, borderCol);
  drawCorner(ctx, CW - ornPad, ornPad, -1, 1, ornLen, borderCol);
  drawCorner(ctx, ornPad, CH - ornPad, 1, -1, ornLen, borderCol);
  drawCorner(ctx, CW - ornPad, CH - ornPad, -1, -1, ornLen, borderCol);
  ctx.textAlign = "center";
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `bold 22px 'Space Grotesk', sans-serif`;
  ctx.letterSpacing = "8px";
  ctx.shadowBlur = 8;
  ctx.shadowColor = gold;
  ctx.fillText("⚔  DEMONZENO  ⚔", CW / 2, 88);
  ctx.letterSpacing = "0px";
  ctx.restore();
  ctx.save();
  ctx.fillStyle = textLight;
  ctx.font = `800 42px 'Space Grotesk', serif`;
  ctx.letterSpacing = "6px";
  ctx.fillText("CERTIFICATE OF ACHIEVEMENT", CW / 2, 140);
  ctx.letterSpacing = "0px";
  ctx.restore();
  drawDivider(ctx, CW / 2, 162, 480, borderCol, true);
  drawTierBadge(ctx, CW / 2, 240, 56, cert.tierId);
  ctx.fillStyle = `${gold}99`;
  ctx.font = `600 13px 'Space Grotesk', sans-serif`;
  ctx.letterSpacing = "4px";
  ctx.textAlign = "center";
  ctx.fillText("TRADING ACADEMY", CW / 2, 314);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = textMid;
  ctx.font = "italic 17px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("This is to certify that", CW / 2, 358);
  const nameText = info.fullName || cert.certInfo.fullName;
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `bold 64px 'Space Grotesk', Georgia, serif`;
  ctx.shadowBlur = 14;
  ctx.shadowColor = `${gold}55`;
  ctx.textAlign = "center";
  ctx.fillText(nameText, CW / 2, 430);
  ctx.restore();
  ctx.fillStyle = textMid;
  ctx.font = "italic 17px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `Son / Daughter of ${info.fathersName || cert.certInfo.fathersName}`,
    CW / 2,
    466
  );
  ctx.fillStyle = textMid;
  ctx.font = "16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("has successfully completed the", CW / 2, 506);
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `bold 26px 'Space Grotesk', serif`;
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.fillText(`${cert.tierName.toUpperCase()} TIER`, CW / 2, 540);
  ctx.letterSpacing = "0px";
  ctx.restore();
  ctx.fillStyle = textMid;
  ctx.font = "16px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("of the DemonZeno Trading Academy", CW / 2, 568);
  ctx.save();
  ctx.fillStyle = "#4ade80";
  ctx.font = "bold 15px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(
    `achieving a perfect score of ${String(cert.score)} / ${String(cert.totalQuestions)}`,
    CW / 2,
    594
  );
  ctx.restore();
  drawDivider(ctx, CW / 2, 616, 400, borderCol, false);
  const COL_L = 340;
  const COL_R = 760;
  const INFO_Y = 640;
  const LINE_H = 38;
  const leftFields = [
    { label: "COUNTRY", value: info.country || cert.certInfo.country },
    {
      label: "DATE OF BIRTH",
      value: info.dateOfBirth || cert.certInfo.dateOfBirth
    },
    { label: "CITY", value: info.city || cert.certInfo.city }
  ];
  const issuedDateStr = new Date(
    Number(cert.issuedAt) / 1e6
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const rightFields = [
    { label: "EMAIL", value: info.email || cert.certInfo.email },
    { label: "DATE OF ISSUE", value: issuedDateStr },
    { label: "CERTIFICATE ID", value: cert.certId }
  ];
  for (let i = 0; i < leftFields.length; i++) {
    const fy = INFO_Y + i * LINE_H;
    ctx.textAlign = "right";
    ctx.fillStyle = `${gold}99`;
    ctx.font = `bold 10px 'Space Grotesk', sans-serif`;
    ctx.letterSpacing = "1.5px";
    ctx.fillText(leftFields[i].label, COL_L, fy);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = textLight;
    ctx.font = "14px Georgia, serif";
    ctx.fillText(leftFields[i].value, COL_L, fy + 17);
  }
  for (let i = 0; i < rightFields.length; i++) {
    const fy = INFO_Y + i * LINE_H;
    ctx.textAlign = "left";
    ctx.fillStyle = `${gold}99`;
    ctx.font = `bold 10px 'Space Grotesk', sans-serif`;
    ctx.letterSpacing = "1.5px";
    ctx.fillText(rightFields[i].label, COL_R, fy);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = textLight;
    ctx.font = "14px Georgia, serif";
    ctx.fillText(rightFields[i].value, COL_R, fy + 17);
  }
  drawSeal(ctx, 148, CH - 150, 84, gold);
  const qrSize = 76;
  const qrX = CW - qrSize - 80;
  const qrY = CH - qrSize - 80;
  const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : "https://demonzeno.com"}/certificates?verify=${cert.certId}`;
  ctx.save();
  ctx.fillStyle = `${gold}18`;
  ctx.beginPath();
  ctx.roundRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16 + 24, 4);
  ctx.fill();
  ctx.restore();
  drawQrGrid(ctx, qrX, qrY, qrSize, verifyUrl, gold);
  ctx.fillStyle = `${gold}80`;
  ctx.font = `9px 'Space Grotesk', monospace`;
  ctx.textAlign = "center";
  ctx.fillText("Verify at:", qrX + qrSize / 2, qrY + qrSize + 12);
  ctx.fillText("demonzeno.com", qrX + qrSize / 2, qrY + qrSize + 24);
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `bold 13px 'JetBrains Mono', monospace`;
  ctx.letterSpacing = "3px";
  ctx.textAlign = "left";
  ctx.fillText(`ID: ${cert.certId}`, 68, CH - 50);
  ctx.letterSpacing = "0px";
  ctx.restore();
  drawDivider(ctx, CW / 2, CH - 76, 560, `${borderCol}44`, false);
  ctx.fillStyle = `${gold}55`;
  ctx.font = "italic 12px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "DemonZeno Trading Academy — Free World-Class Trading Education · No Expiry",
    CW / 2,
    CH - 52
  );
  ctx.fillText(
    `Issued: ${new Date(Number(cert.issuedAt) / 1e6).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
    CW / 2,
    CH - 34
  );
}
function FramePreview({
  frame,
  label,
  active,
  onClick
}) {
  const previewBg = {
    classic: "linear-gradient(135deg, #1a1230 0%, #110d22 100%)",
    dark: "linear-gradient(135deg, #0a0612 0%, #0f0a1e 100%)",
    gold: "linear-gradient(135deg, #0c0a08 0%, #1a1408 100%)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `cert_gen.frame_${frame}`,
      className: "flex flex-col items-center gap-1.5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-16 h-11 rounded-lg border-2 transition-all",
            style: {
              background: previewBg[frame],
              borderColor: active ? "#FFD700" : "oklch(0.28 0.01 260)",
              boxShadow: active ? "0 0 12px #FFD70066" : "none",
              transform: active ? "scale(1.08)" : "scale(1)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs font-semibold transition-colors",
            style: { color: active ? "#FFD700" : "oklch(0.55 0.01 260)" },
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
  const [frame, setFrame] = reactExports.useState("dark");
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
  function handleDownloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `DemonZeno-Certificate-${certificate.certId}.png`;
    link.href = canvas.toDataURL("image/png", 1);
    link.click();
  }
  function handleDownloadPdf() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png", 1);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DemonZeno Certificate ${certificate.certId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
            img { max-width: 100%; height: auto; }
            @page { size: landscape; margin: 0; }
            @media print { body { background: #000; } img { width: 100%; } }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="DemonZeno Certificate" />
          <script>window.onload=function(){window.print();}<\/script>
        </body>
      </html>
    `);
    win.document.close();
  }
  const shareUrl = `${origin}/certificates?verify=${certificate.certId}`;
  const tweetText = encodeURIComponent(
    `I just earned the ${certificate.tierName} certificate from @DemonZeno Trading Academy with a PERFECT 30/30! 📈
Certificate ID: ${certificate.certId}
Verify: ${shareUrl} #DemonZeno #DMNZ #Trading`
  );
  const binancePost = `https://www.binance.com/en/square/post?text=${tweetText}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", "data-ocid": "cert_gen.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-3", children: "Certificate Style" }),
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
        style: {
          borderColor: "#FFD70044",
          boxShadow: "0 0 32px #FFD70022",
          background: "#0a0612"
        },
        children: [
          !imgLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 flex items-center justify-center",
              style: { background: "#0a0612" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" })
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
          onClick: handleDownloadPng,
          "data-ocid": "cert_gen.download_button",
          className: "gap-2 font-semibold",
          style: { background: "#FFD700", color: "#1a0800" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
            "Download PNG"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleDownloadPdf,
          "data-ocid": "cert_gen.download_pdf_button",
          className: "gap-2 font-semibold",
          style: { borderColor: "#FFD70044", color: "#FFD700" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
            "Save as PDF"
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
            " Copied!"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
            " Copy Link"
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
          style: { color: "#FFD700" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
            "Binance Square"
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
