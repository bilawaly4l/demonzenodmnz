import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Twitter,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Certificate, CertificateFrame, PersonalInfo } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CertificateGeneratorProps {
  certificate: Certificate;
  personalInfo: PersonalInfo;
  onClose?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CW = 1200;
const CH = 850;

const FRAMES: { id: CertificateFrame; label: string; preview: string }[] = [
  {
    id: "classic",
    label: "Classic",
    preview: "bg-gradient-to-br from-stone-100 to-amber-50",
  },
  {
    id: "dark",
    label: "Dark",
    preview: "bg-gradient-to-br from-gray-900 to-slate-900",
  },
  {
    id: "gold",
    label: "Gold",
    preview: "bg-gradient-to-br from-amber-100 to-yellow-200",
  },
];

const TIER_BADGE_COLOR = {
  master: { fill: "#b8860b", stroke: "#ffd700", text: "#1a0f00" },
  expert: { fill: "#a8a8a8", stroke: "#d0d0d0", text: "#1a1a1a" },
  default: { fill: "#cd7f32", stroke: "#e8a040", text: "#ffffff" },
};

// ─── Canvas drawing helpers ────────────────────────────────────────────────────

function getBadgeColors(tierId: string) {
  const k = tierId.toLowerCase();
  if (k === "master") return TIER_BADGE_COLOR.master;
  if (k === "expert") return TIER_BADGE_COLOR.expert;
  return TIER_BADGE_COLOR.default;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
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

function drawDiamondDivider(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  halfW: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // left line
  ctx.beginPath();
  ctx.moveTo(cx - 24, y);
  ctx.lineTo(cx - halfW, y);
  ctx.stroke();

  // right line
  ctx.beginPath();
  ctx.moveTo(cx + 24, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();

  // diamond
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

function drawCornerOrnament(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  flipX: boolean,
  flipY: boolean,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  if (flipX) ctx.scale(-1, 1);
  if (flipY) ctx.scale(1, -1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;

  // Corner L-shape
  ctx.beginPath();
  ctx.moveTo(0, size);
  ctx.lineTo(0, 0);
  ctx.lineTo(size, 0);
  ctx.stroke();

  // Small arc flourish
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.35, 0, Math.PI / 2);
  ctx.stroke();

  // Small diamond at corner
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

function drawShieldBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  tierId: string,
) {
  const colors = getBadgeColors(tierId);
  const s = size;

  ctx.save();
  ctx.translate(cx, cy);

  // Shield shape
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(s * 0.75, -s * 0.6);
  ctx.lineTo(s * 0.75, s * 0.2);
  ctx.bezierCurveTo(s * 0.75, s * 0.8, 0, s, 0, s);
  ctx.bezierCurveTo(0, s, -s * 0.75, s * 0.8, -s * 0.75, s * 0.2);
  ctx.lineTo(-s * 0.75, -s * 0.6);
  ctx.closePath();

  // Fill with gradient
  const grad = ctx.createLinearGradient(0, -s, 0, s);
  grad.addColorStop(0, colors.fill);
  grad.addColorStop(1, colors.stroke);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Checkmark
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

function drawVerifiedStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  textColor: string,
  borderColor: string,
) {
  ctx.save();
  ctx.globalAlpha = 0.75;

  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Checkmark
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.4, cy);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.35);
  ctx.lineTo(cx + r * 0.45, cy - r * 0.35);
  ctx.stroke();

  // Text (rotated)
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.round(r * 0.28)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.translate(cx, cy);
  ctx.rotate(-Math.PI / 6);
  ctx.fillText("VERIFIED LEARNER", 0, r * 0.72);

  ctx.restore();
}

// ─── Main draw function ───────────────────────────────────────────────────────

function drawCertificate(
  ctx: CanvasRenderingContext2D,
  frame: CertificateFrame,
  cert: Certificate,
  info: PersonalInfo,
  demonZenoImg: HTMLImageElement | null,
) {
  ctx.clearRect(0, 0, CW, CH);

  // ── 1. Background ──────────────────────────────────────────────────────────
  let bgColor: string;
  let textPrimary: string;
  let textSecondary: string;
  let accentColor: string;
  let borderColor: string;
  let stampColor: string;

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
    // gold
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

  // Subtle texture overlay
  if (frame !== "dark") {
    const texGrad = ctx.createRadialGradient(
      CW / 2,
      CH / 2,
      0,
      CW / 2,
      CH / 2,
      CW * 0.7,
    );
    texGrad.addColorStop(0, "rgba(255,255,255,0.3)");
    texGrad.addColorStop(1, "rgba(139,115,85,0.08)");
    ctx.fillStyle = texGrad;
    ctx.fillRect(0, 0, CW, CH);
  }

  // ── 2. Outer double border ─────────────────────────────────────────────────
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
    4,
  );
  ctx.stroke();

  // Corner ornaments
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
    borderColor,
  );
  drawCornerOrnament(
    ctx,
    ornPad,
    CH - ornPad,
    ornSize,
    false,
    true,
    borderColor,
  );
  drawCornerOrnament(
    ctx,
    CW - ornPad,
    CH - ornPad,
    ornSize,
    true,
    true,
    borderColor,
  );

  // ── 3. DemonZeno watermark ─────────────────────────────────────────────────
  if (demonZenoImg) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    const wmSize = 140;
    const wmX = CW - wmSize - 50;
    const wmY = CH - wmSize - 50;
    ctx.drawImage(demonZenoImg, wmX, wmY, wmSize, wmSize);
    ctx.restore();
  }

  // ── 4. Header text ─────────────────────────────────────────────────────────
  ctx.textAlign = "center";

  ctx.fillStyle = accentColor;
  ctx.font = `bold 18px 'Space Grotesk', serif`;
  ctx.letterSpacing = "4px";
  ctx.fillText("DEMONZENO TRADING ACADEMY", CW / 2, 90);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = textPrimary;
  ctx.font = "italic bold 42px Georgia, serif";
  ctx.fillText("Certificate of Achievement", CW / 2, 148);

  // ── 5. Diamond divider ─────────────────────────────────────────────────────
  drawDiamondDivider(ctx, CW / 2, 172, 420, borderColor);

  // ── 6. "This is to certify that" ──────────────────────────────────────────
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("This is to certify that", CW / 2, 206);

  // ── 7. Recipient name ─────────────────────────────────────────────────────
  ctx.fillStyle = textPrimary;
  ctx.font = `bold 56px 'Space Grotesk', Georgia, serif`;
  const nameText = info.fullName || cert.certInfo.fullName;
  ctx.fillText(nameText, CW / 2, 272);

  // ── 8. Father's name ──────────────────────────────────────────────────────
  ctx.fillStyle = textSecondary;
  ctx.font = "italic 18px Georgia, serif";
  ctx.fillText(
    `Son/Daughter of ${info.fathersName || cert.certInfo.fathersName}`,
    CW / 2,
    302,
  );

  // ── 9. Completion text ────────────────────────────────────────────────────
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("has successfully completed the", CW / 2, 338);

  // ── 10. Tier name ─────────────────────────────────────────────────────────
  ctx.fillStyle = accentColor;
  ctx.font = `bold 32px 'Space Grotesk', Georgia, serif`;
  ctx.letterSpacing = "3px";
  ctx.fillText(`${cert.tierName.toUpperCase()} TIER`, CW / 2, 378);
  ctx.letterSpacing = "0px";

  // ── 11. Tier badge (shield) ────────────────────────────────────────────────
  drawShieldBadge(ctx, CW / 2, 440, 28, cert.tierId);

  // ── 12. Academy + score ────────────────────────────────────────────────────
  ctx.fillStyle = textSecondary;
  ctx.font = "16px Georgia, serif";
  ctx.fillText("of the DemonZeno Trading Academy", CW / 2, 490);

  ctx.fillStyle = frame === "dark" ? "#6edcc0" : accentColor;
  ctx.font = "bold 16px Georgia, serif";
  ctx.fillText(
    `with a perfect score of ${String(cert.score)}/${String(cert.totalQuestions)}`,
    CW / 2,
    514,
  );

  // ── 13. Divider 2 ─────────────────────────────────────────────────────────
  drawDiamondDivider(ctx, CW / 2, 536, 360, borderColor);

  // ── 14. Personal info (two columns) ───────────────────────────────────────
  const infoY = 562;
  const leftX = 300;
  const rightX = 700;
  const labelFont = `bold 10px 'Space Grotesk', sans-serif`;
  const valueFont = "14px Georgia, serif";
  const lineH = 36;

  const leftInfo: Array<{ label: string; value: string }> = [
    { label: "COUNTRY", value: info.country || cert.certInfo.country },
    {
      label: "DATE OF BIRTH",
      value: info.dateOfBirth || cert.certInfo.dateOfBirth,
    },
    { label: "CITY", value: info.city || cert.certInfo.city },
  ];
  const rightInfo: Array<{ label: string; value: string }> = [
    { label: "EMAIL", value: info.email || cert.certInfo.email },
    {
      label: "DATE OF ISSUE",
      value: new Date(Number(cert.issuedAt) / 1_000_000).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        },
      ),
    },
    { label: "CERTIFICATE ID", value: cert.certId },
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

  // ── 15. Cert ID bottom-left ────────────────────────────────────────────────
  ctx.textAlign = "left";
  ctx.fillStyle = accentColor;
  ctx.font = `bold 13px 'JetBrains Mono', monospace`;
  ctx.letterSpacing = "3px";
  ctx.fillText(`ID: ${cert.certId}`, 60, CH - 50);
  ctx.letterSpacing = "0px";

  // ── 16. "Verified Learner" stamp ──────────────────────────────────────────
  drawVerifiedStamp(ctx, CW - 168, CH / 2 + 40, 52, stampColor, stampColor);

  // ── 17. No expiry note ────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.fillStyle = `${accentColor}80`;
  ctx.font = "italic 12px Georgia, serif";
  ctx.fillText(
    "No expiry — Issued forever · DemonZeno Trading Academy",
    CW / 2,
    CH - 50,
  );

  // ── 18. DemonZeno watermark text ─────────────────────────────────────────
  ctx.textAlign = "right";
  ctx.fillStyle = `${accentColor}66`;
  ctx.font = `bold 10px 'Space Grotesk', sans-serif`;
  ctx.letterSpacing = "2px";
  ctx.fillText("DemonZeno ® DMNZ Academy", CW - 55, CH - 32);
  ctx.letterSpacing = "0px";
}

// ─── Frame preview thumbnail ──────────────────────────────────────────────────

function FramePreview({
  frame,
  label,
  active,
  onClick,
}: {
  frame: CertificateFrame;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const previewStyle: Record<CertificateFrame, string> = {
    classic: "linear-gradient(135deg, #f8f4ec 0%, #e8dcc8 100%) border-box",
    dark: "linear-gradient(135deg, #0a0a1a 0%, #1a1a30 100%) border-box",
    gold: "linear-gradient(135deg, #fdf3d8 0%, #f5d980 100%) border-box",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`cert_gen.frame_${frame}`}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div
        className="w-16 h-12 rounded-lg border-2 transition-all"
        style={{
          background: previewStyle[frame],
          borderColor: active ? "oklch(0.65 0.15 190)" : "oklch(0.28 0.01 260)",
          boxShadow: active ? "0 0 12px oklch(0.65 0.15 190 / 0.4)" : "none",
          transform: active ? "scale(1.08)" : "scale(1)",
        }}
      />
      <span
        className="text-xs font-semibold transition-colors"
        style={{
          color: active ? "oklch(0.65 0.15 190)" : "oklch(0.55 0.01 260)",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), timeout);
  }
  return { copied, copy };
}

// ─── CertificateGenerator ─────────────────────────────────────────────────────

export function CertificateGenerator({
  certificate,
  personalInfo,
  onClose,
}: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState<CertificateFrame>("classic");
  const [imgLoaded, setImgLoaded] = useState(false);
  const demonZenoImgRef = useRef<HTMLImageElement | null>(null);
  const { copied, copy } = useCopy();
  const [origin, setOrigin] = useState("https://demonzeno.com");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Load DemonZeno character image for watermark
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/demonzeno-character.png";
    img.onload = () => {
      demonZenoImgRef.current = img;
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(true); // proceed without watermark image
    };
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawCertificate(
      ctx,
      frame,
      certificate,
      personalInfo,
      demonZenoImgRef.current,
    );
  }, [frame, certificate, personalInfo]);

  useEffect(() => {
    if (imgLoaded) render();
  }, [imgLoaded, render]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `DemonZeno-Certificate-${certificate.certId}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  }

  const verifyUrl = `${origin}/verify/${certificate.certId}`;
  const shareUrl = `${origin}/certificates?verify=${certificate.certId}`;
  const tweetText = encodeURIComponent(
    `I just earned the ${certificate.tierName} certificate from DemonZeno Trading Academy with a PERFECT 30/30! 📈\nVerify it here: ${verifyUrl} #DemonZeno #DMNZ #Trading`,
  );
  const binancePost = `https://www.binance.com/en/square/post?text=${tweetText}`;

  return (
    <div className="flex flex-col gap-5" data-ocid="cert_gen.panel">
      {/* Frame selector */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Certificate Frame Style
        </p>
        <div className="flex gap-6 justify-center">
          {FRAMES.map((f) => (
            <FramePreview
              key={f.id}
              frame={f.id}
              label={f.label}
              active={frame === f.id}
              onClick={() => setFrame(f.id)}
            />
          ))}
        </div>
      </div>

      {/* Canvas preview */}
      <div
        className="relative rounded-xl overflow-hidden border"
        style={{ borderColor: "oklch(0.28 0.01 260)", maxHeight: "420px" }}
      >
        {!imgLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "oklch(0.14 0.01 260)" }}
          >
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={CW}
          height={CH}
          className="w-full h-auto block"
          style={{ display: imgLoaded ? "block" : "none" }}
          aria-label="Certificate preview"
          data-ocid="cert_gen.canvas_target"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          type="button"
          onClick={handleDownload}
          data-ocid="cert_gen.download_button"
          className="gap-2 font-semibold"
          style={{
            background: "oklch(0.7 0.18 70)",
            color: "#1a0f00",
          }}
        >
          <Download className="w-4 h-4" />
          Download Certificate (PNG)
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => copy(shareUrl)}
          data-ocid="cert_gen.copy_link_button"
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Link Copied!
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" /> Copy Share Link
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${tweetText}`,
              "_blank",
              "noopener",
            )
          }
          data-ocid="cert_gen.share_twitter_button"
          className="gap-2"
          style={{ color: "oklch(0.65 0.15 210)" }}
        >
          <Twitter className="w-4 h-4" />
          Share on X
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => window.open(binancePost, "_blank", "noopener")}
          data-ocid="cert_gen.share_binance_button"
          className="gap-2"
          style={{ color: "oklch(0.7 0.18 70)" }}
        >
          <ExternalLink className="w-4 h-4" />
          Share on Binance Square
        </Button>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            data-ocid="cert_gen.close_button"
            className="gap-2 text-muted-foreground"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
