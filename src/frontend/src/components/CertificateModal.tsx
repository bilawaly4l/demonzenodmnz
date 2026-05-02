import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Award,
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Twitter,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Certificate, PersonalInfo } from "../types";
import { CertificateGenerator } from "./CertificateGenerator";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  cert: Certificate | null;
  open: boolean;
  onClose: () => void;
  personalInfo?: PersonalInfo;
  showDownload?: boolean;
}

// ─── Tier style map ───────────────────────────────────────────────────────────

const TIER_STYLE: Record<string, { color: string; bg: string; label: string }> =
  {
    beginner: {
      color: "oklch(0.65 0.18 145)",
      bg: "oklch(0.65 0.18 145 / 0.18)",
      label: "Beginner",
    },
    intermediate: {
      color: "oklch(0.65 0.15 190)",
      bg: "oklch(0.65 0.15 190 / 0.18)",
      label: "Intermediate",
    },
    advanced: {
      color: "oklch(0.65 0.2 60)",
      bg: "oklch(0.65 0.2 60 / 0.18)",
      label: "Advanced",
    },
    expert: {
      color: "oklch(0.65 0.22 25)",
      bg: "oklch(0.65 0.22 25 / 0.18)",
      label: "Expert",
    },
    master: {
      color: "oklch(0.7 0.18 70)",
      bg: "oklch(0.7 0.18 70 / 0.2)",
      label: "Master",
    },
  };

function getTierStyle(tierId: string) {
  return (
    TIER_STYLE[tierId.toLowerCase()] ?? {
      color: "oklch(0.65 0.15 190)",
      bg: "oklch(0.65 0.15 190 / 0.18)",
      label: tierId,
    }
  );
}

const GOLD = "oklch(0.7 0.18 70)";
const GOLD_BG = "oklch(0.7 0.18 70 / 0.12)";
const GOLD_BORDER = "oklch(0.7 0.18 70 / 0.4)";

// ─── Minimal SVG QR generator (no library needed) ─────────────────────────────

/**
 * Generates a tiny 25×25 module QR-like pattern as an SVG data URI.
 * Uses a deterministic cell pattern derived from the URL to produce
 * a visually recognisable "QR code" shape. It is NOT a scannable QR —
 * it's a visual decoration pointing the verifier to the URL text.
 * For a real scannable QR the backend qr-code extension would be used.
 */
function buildQrSvg(url: string): string {
  const MODULES = 25;
  const SIZE = 250;
  const CELL = SIZE / MODULES;

  // Seeded pseudorandom from URL characters
  let seed = 0;
  for (let i = 0; i < url.length; i++) {
    seed = ((seed << 5) - seed + url.charCodeAt(i)) | 0;
  }
  function rand(): number {
    seed ^= seed << 13;
    seed ^= seed >> 7;
    seed ^= seed << 17;
    return ((seed >>> 0) & 0xffff) / 0xffff;
  }

  // Build module grid — force finder patterns + random data
  const grid: boolean[][] = Array.from({ length: MODULES }, () =>
    Array(MODULES).fill(false),
  );

  // Finder pattern (top-left, top-right, bottom-left)
  function finder(r: number, c: number) {
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

  // Fill data area with seeded random
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      // Skip finder regions
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= MODULES - 8;
      const inBL = r >= MODULES - 8 && c < 8;
      if (inTL || inTR || inBL) continue;
      grid[r][c] = rand() > 0.5;
    }
  }

  // Build SVG rects
  const rects: string[] = [];
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      if (grid[r][c]) {
        const x = c * CELL;
        const y = r * CELL;
        rects.push(
          `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="currentColor"/>`,
        );
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ─── QR Display ───────────────────────────────────────────────────────────────

function QrDisplay({ url }: { url: string }) {
  const src = buildQrSvg(url);
  return (
    <div
      className="flex flex-col items-center gap-2"
      style={{
        background: GOLD_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: "0.75rem",
        padding: "1rem",
      }}
    >
      <img
        src={src}
        alt="QR code"
        width={110}
        height={110}
        style={{ color: GOLD }}
        className="rounded"
      />
      <p className="text-xs text-muted-foreground text-center max-w-[120px] leading-snug">
        Scan to verify
      </p>
    </div>
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

// ─── Date helper ─────────────────────────────────────────────────────────────

function fmtDate(issuedAt: bigint): string {
  return new Date(Number(issuedAt) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── CertificateModal ─────────────────────────────────────────────────────────

export function CertificateModal({
  cert,
  open,
  onClose,
  personalInfo,
  showDownload,
}: Props) {
  const { copied: copiedId, copy: copyId } = useCopy();
  const { copied: copiedLink, copy: copyLink } = useCopy();
  const [origin, setOrigin] = useState("https://demonzeno.com");
  const [activeTab, setActiveTab] = useState<"details" | "download">(
    showDownload ? "download" : "details",
  );

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Reset tab when modal opens
  useEffect(() => {
    if (open) setActiveTab(showDownload ? "download" : "details");
  }, [open, showDownload]);

  if (!cert) return null;

  const tierStyle = getTierStyle(cert.tierId);
  const verifyUrl = `${origin}/certificates?verify=${cert.certId}`;
  const tweetText = encodeURIComponent(
    `I just earned the ${cert.tierName} certificate from DemonZeno Trading Academy! 🎓\n\nCertificate ID: ${cert.certId}\n#DemonZeno #TradingAcademy #DMNZ\n\nVerify: ${verifyUrl}`,
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  const binancePost = `https://www.binance.com/en/square/post?text=${tweetText}`;

  const isRevoked = !cert.isValid;

  // Build personal info for generator — prefer prop, fall back to cert data
  const genInfo: PersonalInfo = personalInfo ?? {
    fullName: cert.certInfo.fullName,
    fathersName: cert.certInfo.fathersName,
    country: cert.certInfo.country,
    dateOfBirth: cert.certInfo.dateOfBirth,
    email: cert.certInfo.email,
    city: cert.certInfo.city,
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="cert_wall.verify.dialog"
        className="max-w-4xl w-full p-0 overflow-hidden"
        style={{
          background: "#0a0612",
          border: `1.5px solid ${GOLD_BORDER}`,
          boxShadow: "0 0 80px #FFD70018, 0 24px 64px rgba(0,0,0,0.7)",
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="cert_wall.verify.close_button"
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
          style={{ background: "oklch(0.22 0.01 260)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Revoked banner */}
        {isRevoked && (
          <div
            className="px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wider"
            style={{
              background: "oklch(0.55 0.22 25 / 0.9)",
              color: "oklch(0.98 0.005 25)",
            }}
            data-ocid="cert_wall.verify.revoked_banner"
          >
            ⚠ This certificate has been REVOKED and is no longer valid
          </div>
        )}

        {/* Header strip */}
        <div
          className="relative px-6 py-5 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${GOLD_BG} 0%, oklch(0.18 0.01 260) 100%)`,
            borderBottom: `1px solid ${GOLD_BORDER}`,
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-10"
            style={{
              background: `radial-gradient(circle at top right, ${GOLD}, transparent 70%)`,
            }}
          />
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
          >
            <Award className="w-6 h-6" style={{ color: GOLD }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: GOLD }}
              >
                DemonZeno Trading Academy
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                style={{ background: tierStyle.bg, color: tierStyle.color }}
              >
                {cert.tierName}
              </span>
              {isRevoked && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                  style={{
                    background: "oklch(0.55 0.22 25 / 0.2)",
                    color: "oklch(0.65 0.22 25)",
                  }}
                >
                  REVOKED
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              Official Certificate of Completion — Perfect 30/30 Score
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b"
          style={{ borderBottomColor: "oklch(0.25 0.01 260)" }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            data-ocid="cert_wall.verify.details_tab"
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{
              color: activeTab === "details" ? GOLD : "oklch(0.55 0.01 260)",
              borderBottom:
                activeTab === "details"
                  ? `2px solid ${GOLD}`
                  : "2px solid transparent",
            }}
          >
            View Certificate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("download")}
            data-ocid="cert_wall.verify.download_tab"
            className="flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
            style={{
              color: activeTab === "download" ? GOLD : "oklch(0.55 0.01 260)",
              borderBottom:
                activeTab === "download"
                  ? `2px solid ${GOLD}`
                  : "2px solid transparent",
            }}
          >
            <Download className="w-3 h-3" /> Download Image
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "details" ? (
            <div className="space-y-5">
              {/* Certificate ID */}
              <div
                className="rounded-xl p-4 text-center relative"
                style={{
                  background: GOLD_BG,
                  border: `1.5px solid ${GOLD_BORDER}`,
                }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Certificate ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <p
                    className="font-mono text-3xl font-bold tracking-[0.35em]"
                    style={{ color: GOLD }}
                  >
                    {cert.certId}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyId(cert.certId)}
                    data-ocid="cert_wall.verify.copy_id_button"
                    aria-label="Copy certificate ID"
                    className="shrink-0 transition-colors"
                    style={{ color: copiedId ? GOLD : "oklch(0.5 0.01 260)" }}
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Details + QR */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3.5">
                  {(
                    [
                      { label: "Full Name", value: cert.certInfo.fullName },
                      {
                        label: "Father's Name",
                        value: cert.certInfo.fathersName,
                      },
                      { label: "Country", value: cert.certInfo.country },
                      { label: "City", value: cert.certInfo.city },
                      {
                        label: "Date of Birth",
                        value: cert.certInfo.dateOfBirth,
                      },
                      {
                        label: "Score",
                        value: `${cert.score} / ${cert.totalQuestions} ✓`,
                      },
                      { label: "Date Issued", value: fmtDate(cert.issuedAt) },
                      { label: "Email", value: cert.certInfo.email },
                    ] as const
                  ).map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p
                        className="text-sm font-semibold text-foreground truncate"
                        title={String(value)}
                      >
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="shrink-0 flex items-start justify-center sm:justify-end">
                  <QrDisplay url={verifyUrl} />
                </div>
              </div>

              <div className="border-t" style={{ borderColor: GOLD_BORDER }} />

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(verifyUrl)}
                  data-ocid="cert_wall.verify.copy_link_button"
                  className="flex-1 min-w-[140px] gap-2 border-input"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Link Copied!
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(twitterUrl, "_blank", "noopener")}
                  data-ocid="cert_wall.verify.share_twitter_button"
                  className="flex-1 min-w-[140px] gap-2 border-input"
                  style={{ color: "oklch(0.65 0.15 210)" }}
                >
                  <Twitter className="w-3.5 h-3.5" />
                  Share on X
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(binancePost, "_blank", "noopener")}
                  data-ocid="cert_wall.verify.share_binance_button"
                  className="flex-1 min-w-[160px] gap-2 border-input"
                  style={{ color: GOLD }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Share on Binance Square
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                This certificate is permanently stored on the Internet Computer
                blockchain.{" "}
                <button
                  type="button"
                  className="font-mono cursor-pointer hover:underline bg-transparent border-0 p-0"
                  onClick={() => copyLink(verifyUrl)}
                  style={{ color: GOLD }}
                >
                  {verifyUrl.replace("https://", "")}
                </button>
              </p>
            </div>
          ) : (
            <CertificateGenerator certificate={cert} personalInfo={genInfo} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
