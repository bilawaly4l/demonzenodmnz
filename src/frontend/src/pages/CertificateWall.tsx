import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowDownUp,
  Award,
  Check,
  Copy,
  Globe,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CertificateModal } from "../components/CertificateModal";
import {
  useFeaturedCertificates,
  useListAllCertificates,
  useVerifyCertificate,
} from "../hooks/useAcademy";
import type { Certificate } from "../types";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIERS = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
  "Master",
] as const;
type TierFilter = (typeof TIERS)[number];

const GOLD = "oklch(0.7 0.18 70)";

const TIER_STYLE: Record<string, { color: string; bg: string }> = {
  beginner: {
    color: "oklch(0.65 0.18 145)",
    bg: "oklch(0.65 0.18 145 / 0.15)",
  },
  intermediate: {
    color: "oklch(0.65 0.15 190)",
    bg: "oklch(0.65 0.15 190 / 0.15)",
  },
  advanced: { color: "oklch(0.65 0.2 60)", bg: "oklch(0.65 0.2 60 / 0.15)" },
  expert: { color: "oklch(0.65 0.22 25)", bg: "oklch(0.65 0.22 25 / 0.15)" },
  master: { color: GOLD, bg: "oklch(0.7 0.18 70 / 0.15)" },
};

function getTierStyle(tierId: string) {
  return (
    TIER_STYLE[tierId.toLowerCase()] ?? {
      color: "oklch(0.65 0.15 190)",
      bg: "oklch(0.65 0.15 190 / 0.15)",
    }
  );
}

// ─── Date helper ────────────────────────────────────────────────────────────────────────────

function fmtDate(issuedAt: bigint): string {
  return new Date(Number(issuedAt) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Anniversary: issued ~1 year ago (365 ± 7 days)
function isAnniversary(issuedAt: bigint): boolean {
  const days = (Date.now() - Number(issuedAt) / 1_000_000) / 86_400_000;
  return days >= 358 && days <= 372;
}

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(null), timeout);
  }
  return { copied, copy };
}

// ─── URL param helper ─────────────────────────────────────────────────────────

function getUrlParam(key: string): string {
  try {
    return new URLSearchParams(window.location.search).get(key) ?? "";
  } catch {
    return "";
  }
}

// ─── Tier filter tabs ─────────────────────────────────────────────────────────

function TierFilterTabs({
  active,
  onChange,
  counts,
}: {
  active: TierFilter;
  onChange: (t: TierFilter) => void;
  counts: Record<string, number>;
}) {
  return (
    <div
      className="flex gap-1 flex-wrap"
      role="tablist"
      aria-label="Filter by tier"
    >
      {TIERS.map((tier) => {
        const isActive = active === tier;
        const count = tier === "All" ? undefined : (counts[tier] ?? 0);
        return (
          <button
            key={tier}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tier)}
            data-ocid={`cert_wall.filter.${tier.toLowerCase()}`}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            style={
              isActive
                ? {
                    background: "oklch(0.65 0.15 190 / 0.2)",
                    color: "oklch(0.65 0.15 190)",
                    border: "1px solid oklch(0.65 0.15 190 / 0.4)",
                  }
                : {
                    background: "oklch(0.22 0.01 260)",
                    color: "oklch(0.55 0.01 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                  }
            }
          >
            {tier}
            {count !== undefined && count > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none"
                style={
                  isActive
                    ? {
                        background: "oklch(0.65 0.15 190)",
                        color: "oklch(0.14 0.01 260)",
                      }
                    : {
                        background: "oklch(0.28 0.01 260)",
                        color: "oklch(0.65 0.01 260)",
                      }
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Table skeleton ───────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <tbody>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-border/50">
          <td className="py-4 px-4">
            <div className="skeleton h-4 w-28" />
          </td>
          <td className="py-4 px-4">
            <div className="skeleton h-4 w-32" />
          </td>
          <td className="py-4 px-4 hidden md:table-cell">
            <div className="skeleton h-4 w-20" />
          </td>
          <td className="py-4 px-4 hidden sm:table-cell">
            <div className="skeleton h-5 w-20 rounded-full" />
          </td>
          <td className="py-4 px-4 hidden lg:table-cell text-right">
            <div className="skeleton h-4 w-24 ml-auto" />
          </td>
          <td className="py-4 px-4">
            <div className="skeleton h-6 w-14 ml-auto rounded-md" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

// ─── Table header ─────────────────────────────────────────────────────────────

function TableHeader() {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/30">
        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cert ID
        </th>
        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Name
        </th>
        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
          Country
        </th>
        <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
          Tier
        </th>
        <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
          Date Issued
        </th>
        <th className="py-3 px-4" />
      </tr>
    </thead>
  );
}

// ─── CertRow (desktop table) ──────────────────────────────────────────────────

function CertRow({
  cert,
  index,
  onVerify,
  onCopyId,
  copiedId,
}: {
  cert: Certificate;
  index: number;
  onVerify: (cert: Certificate) => void;
  onCopyId: (id: string) => void;
  copiedId: string | null;
}) {
  const style = getTierStyle(cert.tierId);
  const isRevoked = !cert.isValid;
  const anniversary = isAnniversary(cert.issuedAt);

  return (
    <tr
      data-ocid={`cert_wall.list.item.${index + 1}`}
      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
        isRevoked ? "opacity-50" : ""
      }`}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onCopyId(cert.certId)}
            aria-label="Copy ID"
            className="transition-colors shrink-0"
            style={{
              color: copiedId === cert.certId ? GOLD : "oklch(0.45 0.01 260)",
            }}
          >
            {copiedId === cert.certId ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          <span
            className="font-mono text-sm font-bold tracking-widest"
            style={{ color: isRevoked ? "oklch(0.45 0.01 260)" : GOLD }}
          >
            {cert.certId}
          </span>
          {isRevoked && (
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold uppercase"
              style={{
                background: "oklch(0.55 0.22 25 / 0.15)",
                color: "oklch(0.65 0.22 25)",
              }}
            >
              REVOKED
            </span>
          )}
          {cert.featured && (
            <Star className="w-3 h-3 fill-current" style={{ color: GOLD }} />
          )}
          {anniversary && (
            <span title="1 Year Anniversary!" className="text-sm">
              🎂
            </span>
          )}
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div>
          <p className="font-semibold text-foreground text-sm leading-tight">
            {cert.certInfo.fullName}
          </p>
          <p className="text-xs text-muted-foreground">
            s/o {cert.certInfo.fathersName}
          </p>
        </div>
      </td>
      <td className="py-3.5 px-4 text-sm text-muted-foreground hidden md:table-cell">
        {cert.certInfo.country}
      </td>
      <td className="py-3.5 px-4 hidden sm:table-cell">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold uppercase"
          style={{ background: style.bg, color: style.color }}
        >
          {cert.tierName}
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm text-muted-foreground text-right hidden lg:table-cell">
        {fmtDate(cert.issuedAt)}
      </td>
      <td className="py-3.5 px-4 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVerify(cert)}
          data-ocid={`cert_wall.list.verify_button.${index + 1}`}
          className="h-7 px-2.5 text-xs gap-1 hover:bg-primary/10"
          style={{ color: "oklch(0.65 0.15 190)" }}
        >
          <ShieldCheck className="w-3 h-3" />
          View
        </Button>
      </td>
    </tr>
  );
}

// ─── CertCard (mobile) ────────────────────────────────────────────────────────

function CertCard({
  cert,
  index,
  onVerify,
  onCopyId,
  copiedId,
}: {
  cert: Certificate;
  index: number;
  onVerify: (cert: Certificate) => void;
  onCopyId: (id: string) => void;
  copiedId: string | null;
}) {
  const style = getTierStyle(cert.tierId);
  const isRevoked = !cert.isValid;
  const anniversary = isAnniversary(cert.issuedAt);

  return (
    <div
      data-ocid={`cert_wall.list.item.${index + 1}`}
      className={`certificate-card flex flex-col gap-3 ${isRevoked ? "opacity-55" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold uppercase"
          style={{ background: style.bg, color: style.color }}
        >
          {cert.tierName}
        </span>
        <div className="flex items-center gap-2">
          {isRevoked && (
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold uppercase"
              style={{
                background: "oklch(0.55 0.22 25 / 0.15)",
                color: "oklch(0.65 0.22 25)",
              }}
            >
              REVOKED
            </span>
          )}
          {cert.featured && (
            <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
          )}
          {anniversary && (
            <span title="1 Year Anniversary!" className="text-sm">
              🎂
            </span>
          )}
          <Award
            className="w-4 h-4"
            style={{ color: isRevoked ? "oklch(0.4 0.01 260)" : GOLD }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Shield
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: `${GOLD}b0` }}
        />
        <span
          className="font-mono text-xs font-bold tracking-widest flex-1"
          style={{ color: isRevoked ? "oklch(0.45 0.01 260)" : GOLD }}
        >
          {cert.certId}
        </span>
        <button
          type="button"
          onClick={() => onCopyId(cert.certId)}
          aria-label="Copy ID"
          className="transition-colors"
          style={{
            color: copiedId === cert.certId ? GOLD : "oklch(0.45 0.01 260)",
          }}
        >
          {copiedId === cert.certId ? (
            <Check className="w-3 h-3" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      <div>
        <p className="font-display font-bold text-foreground leading-tight truncate">
          {cert.certInfo.fullName}
        </p>
        <p className="text-muted-foreground text-xs">
          s/o {cert.certInfo.fathersName}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
        <span>{cert.certInfo.country}</span>
        <span>{fmtDate(cert.issuedAt)}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onVerify(cert)}
        data-ocid={`cert_wall.list.verify_button.${index + 1}`}
        className="w-full gap-1.5 border-border/50 h-8"
        style={{ color: "oklch(0.65 0.15 190)" }}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        View Certificate
      </Button>
    </div>
  );
}

// ─── Featured certificate card ────────────────────────────────────────────────

function FeaturedCertCard({
  cert,
  onVerify,
}: {
  cert: Certificate;
  onVerify: (cert: Certificate) => void;
}) {
  const style = getTierStyle(cert.tierId);
  const { copied, copy } = useCopy();
  const shareUrl = `${window.location.origin}/verify/${cert.certId}`;

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-5 border-2 transition-smooth relative overflow-hidden"
      style={{
        background: "oklch(0.7 0.18 70 / 0.06)",
        borderColor: "oklch(0.7 0.18 70 / 0.5)",
        boxShadow: "0 0 24px oklch(0.7 0.18 70 / 0.12)",
      }}
    >
      {/* Gold corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-10"
        style={{
          background: `radial-gradient(circle at top right, ${GOLD}, transparent 70%)`,
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: GOLD }}
          >
            Featured Graduate
          </span>
        </div>
        <span
          className="px-2.5 py-1 rounded-full text-xs font-bold uppercase"
          style={{ background: style.bg, color: style.color }}
        >
          {cert.tierName}
        </span>
      </div>

      <div>
        <p className="font-display font-bold text-lg text-foreground leading-tight">
          {cert.certInfo.fullName}
        </p>
        <p className="text-muted-foreground text-xs mt-0.5">
          s/o {cert.certInfo.fathersName} · {cert.certInfo.country}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Shield
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: `${GOLD}b0` }}
        />
        <span
          className="font-mono text-xs font-bold tracking-widest"
          style={{ color: GOLD }}
        >
          {cert.certId}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{fmtDate(cert.issuedAt)}</span>
        <span
          className="font-semibold"
          style={{ color: "oklch(0.7 0.18 145)" }}
        >
          ✓ Verified
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onVerify(cert)}
          className="flex-1 h-8 text-xs gap-1 border-border/50"
          style={{ color: "oklch(0.65 0.15 190)" }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copy(cert.certId, shareUrl)}
          aria-label="Copy share link"
          className="h-8 w-8 p-0 text-xs"
          style={{
            color: copied === cert.certId ? GOLD : "oklch(0.5 0.01 260)",
          }}
        >
          {copied === cert.certId ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Verify inline result ─────────────────────────────────────────────────────

function VerifyInlineResult({
  verifyId,
  onOpen,
  onClear,
}: {
  verifyId: string;
  onOpen: (cert: Certificate) => void;
  onClear: () => void;
}) {
  const { data: verifiedCert, isLoading: isVerifying } =
    useVerifyCertificate(verifyId);

  if (isVerifying) {
    return (
      <div
        data-ocid="cert_wall.verify.loading_state"
        className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-muted-foreground text-sm"
      >
        <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        Verifying <span className="certificate-id font-mono">{verifyId}</span>…
      </div>
    );
  }

  if (!verifiedCert) {
    return (
      <div
        data-ocid="cert_wall.verify.error_state"
        className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5"
      >
        <X className="w-5 h-5 text-destructive shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Certificate not found
          </p>
          <p className="text-xs text-muted-foreground">
            No certificate with ID <span className="font-mono">{verifyId}</span>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          data-ocid="cert_wall.verify.close_button"
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      data-ocid="cert_wall.verify.success_state"
      className="flex items-center gap-3 p-4 rounded-xl border bg-card"
      style={{ borderColor: "oklch(0.7 0.18 145 / 0.4)" }}
    >
      <ShieldCheck
        className="w-5 h-5 shrink-0"
        style={{ color: "oklch(0.7 0.18 145)" }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Certificate verified —{" "}
          <span style={{ color: GOLD }} className="font-mono">
            {verifiedCert.certId}
          </span>
        </p>
        <p className="text-xs text-muted-foreground">
          {verifiedCert.certInfo.fullName} · {verifiedCert.tierName} ·{" "}
          {fmtDate(verifiedCert.issuedAt)}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onOpen(verifiedCert)}
        data-ocid="cert_wall.verify.open_modal_button"
        className="shrink-0 h-8 text-xs gap-1"
        style={{ color: "oklch(0.65 0.15 190)" }}
      >
        <ShieldCheck className="w-3 h-3" />
        View Full
      </Button>
    </div>
  );
}

// ─── Certificate Leaderboard ────────────────────────────────────────────────────────────

function CertLeaderboard({ allCerts }: { allCerts: Certificate[] }) {
  const leaders = Object.values(
    allCerts
      .filter((c) => c.isValid)
      .reduce<
        Record<
          string,
          {
            name: string;
            country: string;
            tiers: Set<string>;
            issuedAt: bigint;
          }
        >
      >((acc, cert) => {
        const key = cert.certInfo.email || cert.certInfo.fullName;
        if (!acc[key]) {
          acc[key] = {
            name: cert.certInfo.fullName,
            country: cert.certInfo.country,
            tiers: new Set(),
            issuedAt: cert.issuedAt,
          };
        }
        acc[key]!.tiers.add(cert.tierId);
        if (cert.issuedAt > acc[key]!.issuedAt)
          acc[key]!.issuedAt = cert.issuedAt;
        return acc;
      }, {}),
  )
    .map((v) => ({ ...v, tierCount: v.tiers.size }))
    .sort(
      (a, b) =>
        b.tierCount - a.tierCount || Number(b.issuedAt) - Number(a.issuedAt),
    )
    .slice(0, 10);

  if (leaders.length === 0) return null;

  return (
    <div className="mb-10" data-ocid="cert_wall.leaderboard.section">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4" style={{ color: GOLD }} />
        <h2 className="font-display font-bold text-lg text-foreground">
          Certificate Leaderboard
        </h2>
        <span className="text-xs text-muted-foreground">
          (top earners by tiers completed)
        </span>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["#", "Name", "Country", "Tiers"].map((h, i) => (
                <th
                  key={h}
                  className={`py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground${i === 2 ? " hidden sm:table-cell" : ""}${i === 3 ? " text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaders.map((l, i) => (
              <tr
                key={`${l.name}-${i}`}
                data-ocid={`cert_wall.leaderboard.item.${i + 1}`}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <td className="py-3 px-4">
                  <span
                    className="font-mono text-sm font-bold"
                    style={{
                      color:
                        i === 0
                          ? GOLD
                          : i === 1
                            ? "oklch(0.70 0.01 260)"
                            : i === 2
                              ? "oklch(0.65 0.14 50)"
                              : "oklch(0.55 0.01 260)",
                    }}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-foreground">
                  {l.name}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                  {l.country}
                </td>
                <td className="py-3 px-4 text-right">
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: GOLD }}
                  >
                    {l.tierCount}/5
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main page

const PAGE_SIZE = 20;

export function CertificateWall() {
  const [searchId, setSearchId] = useState(() =>
    getUrlParam("id").toUpperCase(),
  );
  const [activeVerifyId, setActiveVerifyId] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("All");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  const [modalCert, setModalCert] = useState<Certificate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { copied: copiedId, copy: copyId } = useCopy();

  const { data: allCerts = [], isLoading } = useListAllCertificates();
  const { data: featuredCerts = [] } = useFeaturedCertificates();

  // Handle ?verify= URL param — auto-open modal
  const autoVerifyId = getUrlParam("verify").toUpperCase();
  const [autoModalOpened, setAutoModalOpened] = useState(false);

  useEffect(() => {
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

  // Reset to page 1 when filters change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on filter/sort/search change
  useEffect(() => {
    setPage(1);
  }, [tierFilter, sortDesc, searchId]);

  // Counts by tier
  const tierCounts: Record<string, number> = {};
  for (const c of allCerts) {
    const k = c.tierName;
    tierCounts[k] = (tierCounts[k] ?? 0) + 1;
  }

  const countryCount = new Set(allCerts.map((c) => c.certInfo.country)).size;
  const validCount = allCerts.filter((c) => c.isValid).length;

  // Filter + sort
  const filtered = allCerts
    .filter((c) =>
      tierFilter === "All"
        ? true
        : c.tierName.toLowerCase() === tierFilter.toLowerCase(),
    )
    .sort((a, b) =>
      sortDesc
        ? Number(b.issuedAt - a.issuedAt)
        : Number(a.issuedAt - b.issuedAt),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageCerts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    if (id.length === 9) setActiveVerifyId(id);
  }

  function clearVerify() {
    setActiveVerifyId("");
    setSearchId("");
  }

  function openModal(cert: Certificate) {
    setModalCert(cert);
    setModalOpen(true);
  }

  return (
    <section
      data-ocid="cert_wall.page"
      className="min-h-screen bg-background py-12 pb-20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-10 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-4">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Public Certificate Wall
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-3 text-glow leading-tight">
            DemonZeno Academy —{" "}
            <span style={{ color: GOLD }}>Certificate Wall</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            All officially issued DemonZeno Trading Academy certificates. Every
            certificate represents a perfect{" "}
            <strong className="text-foreground">30/30</strong> score — the
            hardest standard in trading education.
          </p>

          {/* DemonZeno quote */}
          <blockquote
            className="mt-5 text-sm italic max-w-xl mx-auto"
            style={{ color: `${GOLD}cc` }}
          >
            "Every certificate is a battle won. Every graduate is a warrior
            forged."
          </blockquote>

          {/* Total issued counter */}
          {!isLoading && (
            <div
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full border font-semibold text-sm"
              style={{
                border: `1.5px solid ${GOLD}50`,
                background: "oklch(0.7 0.18 70 / 0.08)",
                color: GOLD,
              }}
              data-ocid="cert_wall.header.total_count"
            >
              <Award className="w-4 h-4" />
              {allCerts.length} Certificate{allCerts.length !== 1 ? "s" : ""}{" "}
              Issued Globally
            </div>
          )}
        </div>

        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        {!isLoading && allCerts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: Award,
                label: "Total Issued",
                value: allCerts.length,
                color: GOLD,
              },
              {
                icon: Globe,
                label: "Countries",
                value: countryCount,
                color: "oklch(0.65 0.15 190)",
              },
              {
                icon: Users,
                label: "Valid Certs",
                value: validCount,
                color: "oklch(0.7 0.18 145)",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-card p-4 md:p-5 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                <p className="font-display font-bold text-xl md:text-2xl text-foreground">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Leaderboard ── */}
        {!isLoading && allCerts.length > 0 && (
          <CertLeaderboard allCerts={allCerts} />
        )}

        {/* ── Featured Graduates ────────────────────────────────────────────── */}
        {!isLoading && featuredCerts.length > 0 && (
          <div className="mb-10" data-ocid="cert_wall.featured.section">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-current" style={{ color: GOLD }} />
              <h2 className="font-display font-bold text-lg text-foreground">
                Featured Graduates
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCerts.map((cert) => (
                <FeaturedCertCard
                  key={cert.certId}
                  cert={cert}
                  onVerify={openModal}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Search + verify bar ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <form onSubmit={handleVerifySubmit} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="cert_wall.search.search_input"
                placeholder="Enter 9-character certificate ID to verify…"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                className="pl-9 pr-9 bg-card border-input h-11 font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-body"
                maxLength={9}
                aria-label="Certificate ID"
              />
              {searchId && (
                <button
                  type="button"
                  onClick={clearVerify}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              data-ocid="cert_wall.search.submit_button"
              disabled={searchId.trim().length !== 9}
              className="btn-primary btn-micro h-11 px-5 shrink-0"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Verify
            </Button>
          </form>
        </div>

        {/* ── Inline verify result ─────────────────────────────────────────── */}
        {activeVerifyId && (
          <div className="mb-6">
            <VerifyInlineResult
              verifyId={activeVerifyId}
              onOpen={openModal}
              onClear={clearVerify}
            />
          </div>
        )}

        {/* ── Tier filter tabs + sort toggle ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <TierFilterTabs
            active={tierFilter}
            onChange={setTierFilter}
            counts={tierCounts}
          />
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDesc((v) => !v)}
              data-ocid="cert_wall.sort.toggle"
              className="h-8 gap-1.5 text-xs border-input"
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
              {sortDesc ? "Newest First" : "Oldest First"}
            </Button>
          </div>
        </div>

        {/* ── Table / Cards ────────────────────────────────────────────────── */}
        {isLoading ? (
          <>
            <div
              className="hidden sm:block rounded-xl border border-border overflow-hidden bg-card"
              data-ocid="cert_wall.list.loading_state"
            >
              <table className="w-full">
                <TableHeader />
                <TableSkeleton />
              </table>
            </div>
            <div className="sm:hidden certificate-wall-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-44 rounded-xl" />
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="cert_wall.list.empty_state"
            className="flex flex-col items-center gap-5 py-20 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
            >
              <Award className="w-9 h-9" style={{ color: `${GOLD}80` }} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-xl mb-2">
                {tierFilter !== "All"
                  ? `No ${tierFilter} certificates yet`
                  : "No certificates issued yet"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                {tierFilter !== "All"
                  ? `No one has completed the ${tierFilter} tier yet. Be the first!`
                  : "Complete the DemonZeno Academy with a perfect 30/30 score to earn your place on this wall."}
              </p>
              {tierFilter !== "All" && (
                <button
                  type="button"
                  onClick={() => setTierFilter("All")}
                  data-ocid="cert_wall.filter.clear_button"
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Show all tiers
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div
              className="hidden sm:block rounded-xl border border-border overflow-hidden bg-card"
              data-ocid="cert_wall.list.table"
            >
              <table className="w-full">
                <TableHeader />
                <tbody>
                  {pageCerts.map((cert, i) => (
                    <CertRow
                      key={cert.certId}
                      cert={cert}
                      index={(page - 1) * PAGE_SIZE + i}
                      onVerify={openModal}
                      onCopyId={(id) => copyId(id, id)}
                      copiedId={copiedId}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden certificate-wall-grid">
              {pageCerts.map((cert, i) => (
                <CertCard
                  key={cert.certId}
                  cert={cert}
                  index={(page - 1) * PAGE_SIZE + i}
                  onVerify={openModal}
                  onCopyId={(id) => copyId(id, id)}
                  copiedId={copiedId}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  data-ocid="cert_wall.pagination_prev"
                  className="h-8 gap-1.5 text-xs"
                >
                  ← Prev
                </Button>
                <span className="text-xs text-muted-foreground px-3">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  data-ocid="cert_wall.pagination_next"
                  className="h-8 gap-1.5 text-xs"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>
              All certificates are permanently stored on the Internet Computer
              blockchain. Use the verify function to authenticate any
              certificate by its unique 9-character ID.
            </span>
          </div>
        </div>
      </div>

      {/* ── Certificate Modal ─────────────────────────────────────────────── */}
      <CertificateModal
        cert={modalCert}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalCert(null);
        }}
      />
    </section>
  );
}
