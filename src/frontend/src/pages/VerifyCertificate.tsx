import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Clock,
  Globe,
  Hash,
  Link2,
  MapPin,
  Shield,
  Star,
  Twitter,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CertificateGenerator } from "../components/CertificateGenerator";
import { useVerifyCertificate } from "../hooks/useAcademy";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = "oklch(0.7 0.18 70)";
const GOLD_BORDER = "oklch(0.7 0.18 70 / 0.4)";
const GOLD_BG = "oklch(0.7 0.18 70 / 0.08)";

const TIER_BADGES: Record<string, { label: string; cssClass: string }> = {
  beginner: { label: "Beginner", cssClass: "tier-badge-other" },
  intermediate: { label: "Intermediate", cssClass: "tier-badge-other" },
  advanced: { label: "Advanced", cssClass: "tier-badge-other" },
  expert: { label: "Expert", cssClass: "tier-badge-expert" },
  master: { label: "Master", cssClass: "tier-badge-master" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ─── Minimal deterministic QR SVG ─────────────────────────────────────────────

function buildQrSvg(url: string): string {
  const MODULES = 25;
  const SIZE = 200;
  const CELL = SIZE / MODULES;
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
  const grid: boolean[][] = Array.from({ length: MODULES }, () =>
    Array(MODULES).fill(false),
  );
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
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= MODULES - 8;
      const inBL = r >= MODULES - 8 && c < 8;
      if (inTL || inTR || inBL) continue;
      grid[r][c] = rand() > 0.5;
    }
  }
  const rects: string[] = [];
  for (let r = 0; r < MODULES; r++) {
    for (let c = 0; c < MODULES; c++) {
      if (grid[r][c]) {
        rects.push(
          `<rect x="${c * CELL}" y="${r * CELL}" width="${CELL}" height="${CELL}" fill="currentColor"/>`,
        );
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">${rects.join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
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

// ─── VerifyCertificate page ───────────────────────────────────────────────────

export function VerifyCertificate() {
  const { certId } = useParams({ from: "/layout/verify/$certId" });
  const { data: cert, isLoading, error } = useVerifyCertificate(certId);
  const { copied: copiedId, copy: copyId } = useCopy();
  const { copied: copiedLink, copy: copyLink } = useCopy();
  const [origin, setOrigin] = useState("https://demonzeno.com");
  const [showGenerator, setShowGenerator] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (isLoading) {
    return (
      <section
        data-ocid="verify.loading_state"
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="container mx-auto px-4 py-20 max-w-2xl space-y-6">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-10 w-48 mx-auto" />
        </div>
      </section>
    );
  }

  if (error || !cert) {
    return (
      <section
        data-ocid="verify.error_state"
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mx-auto">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
              Certificate Not Found
            </h1>
            <p className="text-muted-foreground">
              The certificate ID{" "}
              <code className="font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                {certId}
              </code>{" "}
              doesn't exist or may have been revoked.
            </p>
          </div>
          <Button asChild className="btn-primary btn-micro">
            <Link to="/certificates">View Certificate Wall</Link>
          </Button>
        </div>
      </section>
    );
  }

  const tier = cert.tierId.toLowerCase();
  const badgeInfo = TIER_BADGES[tier] ?? {
    label: cert.tierName,
    cssClass: "tier-badge-other",
  };
  const shareUrl = `${origin}/verify/${cert.certId}`;
  const qrSrc = buildQrSvg(shareUrl);

  const tweetText = encodeURIComponent(
    `🏆 I earned my ${cert.tierName} Certificate from DemonZeno Trading Academy!\n\nCertificate ID: ${cert.certId}\nVerify: ${shareUrl}\n\n@ZenoDemon #DemonZeno #DMNZ #Trading`,
  );

  if (!cert.isValid) {
    return (
      <section
        data-ocid="verify.revoked_state"
        className="min-h-screen bg-background py-20"
      >
        <div className="container mx-auto px-4 max-w-lg text-center space-y-6">
          {/* Revoked status badge */}
          <div className="flex items-center justify-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-sm uppercase tracking-widest"
              style={{
                background: "oklch(0.55 0.22 25 / 0.15)",
                border: "2px solid oklch(0.55 0.22 25 / 0.5)",
                color: "oklch(0.65 0.22 25)",
              }}
            >
              <XCircle className="w-5 h-5" />
              Certificate Revoked
            </div>
          </div>

          <div
            className="rounded-xl p-6 border-2 text-center"
            style={{
              borderColor: "oklch(0.55 0.22 25 / 0.4)",
              background: "oklch(0.55 0.22 25 / 0.05)",
            }}
          >
            <p className="text-muted-foreground">
              Certificate{" "}
              <code className="font-mono font-bold text-foreground">
                {certId}
              </code>{" "}
              has been invalidated by an administrator and is no longer valid.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link to="/certificates">View Certificate Wall</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      data-ocid="verify.section"
      className="min-h-screen bg-background py-16"
    >
      <div className="container mx-auto px-4 max-w-2xl">
        {/* ── Valid status badge ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-3 mb-8"
          data-ocid="verify.status.panel"
        >
          <div
            className="flex items-center gap-2.5 rounded-full px-6 py-3 font-bold text-base uppercase tracking-wider"
            style={{
              background: "oklch(0.7 0.18 145 / 0.15)",
              border: "2px solid oklch(0.7 0.18 145 / 0.5)",
              color: "oklch(0.65 0.18 145)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            Valid Certificate
          </div>
        </div>

        {/* ── Certificate parchment card ─────────────────────────────────── */}
        <section
          data-ocid="verify.card"
          className="certificate-image mx-auto"
          aria-label="Certificate of Achievement"
        >
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-center mb-3">
              <div className="certificate-seal">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2
              className="font-display text-2xl md:text-3xl font-bold mb-1"
              style={{ color: "#2c1810" }}
            >
              Certificate of Achievement
            </h2>
            <p className="text-sm" style={{ color: "#8b7355" }}>
              DemonZeno Trading Academy
            </p>
          </div>

          {/* Gold divider */}
          <div
            className="w-full h-px mb-5"
            style={{
              background:
                "linear-gradient(90deg, transparent, #b8956a, transparent)",
            }}
          />

          {/* Recipient */}
          <div className="mb-5">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: "#8b7355" }}
            >
              This certifies that
            </p>
            <p
              className="font-display text-2xl md:text-3xl font-bold mb-1"
              style={{ color: "#1a0f08" }}
            >
              {cert.certInfo.fullName}
            </p>
            <p className="text-sm" style={{ color: "#5a3e2b" }}>
              Son/Daughter of {cert.certInfo.fathersName}
            </p>
          </div>

          {/* Completion statement */}
          <div className="mb-5">
            <p className="text-sm leading-relaxed" style={{ color: "#3d2415" }}>
              has successfully completed the{" "}
              <strong className="font-bold">{cert.tierName}</strong> tier of the
              DemonZeno Trading Academy with a perfect score of{" "}
              <strong>
                {String(cert.score)}/{String(cert.totalQuestions)}
              </strong>
              , demonstrating mastery of trading knowledge and discipline.
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-left text-xs">
            {[
              {
                icon: <Globe className="w-3 h-3" />,
                label: "Country",
                value: cert.certInfo.country,
              },
              {
                icon: <MapPin className="w-3 h-3" />,
                label: "City",
                value: cert.certInfo.city,
              },
              {
                icon: <User className="w-3 h-3" />,
                label: "Email",
                value: cert.certInfo.email,
              },
              {
                icon: <Clock className="w-3 h-3" />,
                label: "Issued",
                value: formatDate(cert.issuedAt),
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-1.5"
                style={{ color: "#5a3e2b" }}
              >
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div>
                  <p
                    className="font-semibold uppercase tracking-wider"
                    style={{ color: "#8b7355", fontSize: "9px" }}
                  >
                    {label}
                  </p>
                  <p className="font-medium break-all">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tier badge + cert ID + verified stamp */}
          <div className="flex items-center justify-between mb-4">
            <span className={badgeInfo.cssClass}>{badgeInfo.label}</span>
            <div className="text-center">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" style={{ color: "#8b7355" }} />
                <span
                  className="font-mono text-xs font-bold tracking-widest"
                  style={{ color: "#8b7355" }}
                >
                  {cert.certId}
                </span>
              </div>
              <p
                className="text-xs mt-0.5 font-bold uppercase tracking-wider"
                style={{ color: "#b8956a", fontSize: "9px" }}
              >
                ✓ Verified Learner
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div
            className="flex flex-col items-center gap-2 rounded-lg p-3"
            style={{
              background: "rgba(139,115,85,0.1)",
              border: "1px solid #b8956a60",
            }}
          >
            <img
              src={qrSrc}
              alt="QR code to verify this certificate"
              width={90}
              height={90}
              className="rounded"
              style={{ color: "#8b7355" }}
            />
            <p
              className="text-center leading-snug"
              style={{ color: "#8b7355", fontSize: "9px" }}
            >
              Scan to verify certificate
            </p>
          </div>

          {/* DemonZeno watermark */}
          <div className="certificate-watermark">
            <div className="certificate-watermark-zeno">DemonZeno ®</div>
            <div style={{ fontSize: "9px" }}>DMNZ Academy</div>
          </div>
        </section>

        {/* ── Blockchain verification note ──────────────────────────────── */}
        <div
          className="mt-6 flex items-center justify-center gap-2 rounded-xl p-3 text-xs"
          style={{ background: GOLD_BG, border: `1px solid ${GOLD_BORDER}` }}
        >
          <Star className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
          <span style={{ color: GOLD }}>
            Verified by DemonZeno Trading Academy · Permanently stored on the
            Internet Computer blockchain
          </span>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div
          data-ocid="verify.actions.panel"
          className="mt-6 flex flex-wrap gap-3 justify-center"
        >
          <Button
            type="button"
            onClick={() => setShowGenerator((v) => !v)}
            data-ocid="verify.download.button"
            className="gap-1.5 font-semibold"
            style={{ background: GOLD, color: "#1a0f00" }}
          >
            {showGenerator ? "Hide Certificate" : "Download Certificate (PNG)"}
          </Button>
          <Button
            data-ocid="verify.copy_id.button"
            type="button"
            variant="outline"
            onClick={() => copyId(cert.certId)}
            className="gap-1.5"
          >
            <Hash className="w-4 h-4" />
            {copiedId ? "ID Copied!" : "Copy Certificate ID"}
          </Button>
          <Button
            data-ocid="verify.copy_link.button"
            type="button"
            variant="outline"
            onClick={() => copyLink(shareUrl)}
            className="gap-1.5"
          >
            <Link2 className="w-4 h-4" />
            {copiedLink ? "Link Copied!" : "Copy Share Link"}
          </Button>
          <Button
            data-ocid="verify.tweet.button"
            asChild
            className="btn-primary btn-micro gap-1.5"
          >
            <a
              href={`https://twitter.com/intent/tweet?text=${tweetText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4" /> Share on X
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/certificates">View Certificate Wall</Link>
          </Button>
        </div>

        {/* Certificate Image Generator */}
        {showGenerator && (
          <div
            data-ocid="verify.cert_gen.panel"
            className="mt-6 p-5 rounded-xl border"
            style={{
              borderColor: GOLD_BORDER,
              background: "oklch(0.16 0.01 260)",
            }}
          >
            <CertificateGenerator
              certificate={cert}
              personalInfo={{
                fullName: cert.certInfo.fullName,
                fathersName: cert.certInfo.fathersName,
                country: cert.certInfo.country,
                dateOfBirth: cert.certInfo.dateOfBirth,
                email: cert.certInfo.email,
                city: cert.certInfo.city,
              }}
              onClose={() => setShowGenerator(false)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
