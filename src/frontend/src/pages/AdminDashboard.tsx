import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BellRing,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Flag,
  Flame,
  FlaskConical,
  Globe,
  Home,
  LayoutDashboard,
  Lock,
  PlusCircle,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Star,
  StarOff,
  Trash2,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { createActor } from "../backend";
import type {
  ABTestRecord,
  LessonEngagement,
  LessonOfWeek,
  QuestionFailStat,
  QuizAttemptLog,
} from "../backend";
import { useSession } from "../contexts/SessionContext";
import {
  useAnnouncementBanner,
  useFeaturedCertificates,
  useQuizAttemptStats,
  useTierDisabledStates,
} from "../hooks/useAcademy";
import type { Certificate, CertificateInfo, QuizAttemptStats } from "../types";

// ─── Tier colors ──────────────────────────────────────────────────────────────

const TIER_COLORS: Record<string, string> = {
  beginner: "bg-primary/20 text-primary border-primary/30",
  intermediate:
    "bg-[oklch(0.65_0.14_70/0.2)] text-[oklch(0.65_0.14_70)] border-[oklch(0.65_0.14_70/0.3)]",
  advanced:
    "bg-[oklch(0.65_0.15_130/0.2)] text-[oklch(0.65_0.15_130)] border-[oklch(0.65_0.15_130/0.3)]",
  expert:
    "bg-[oklch(0.65_0.18_260/0.2)] text-[oklch(0.65_0.18_260)] border-[oklch(0.65_0.18_260/0.3)]",
  master:
    "bg-[oklch(0.7_0.18_70/0.2)] text-[oklch(0.7_0.18_70)] border-[oklch(0.7_0.18_70/0.3)]",
};

const TIERS = ["beginner", "intermediate", "advanced", "expert", "master"];

function getTierClass(tierName: string) {
  const key = tierName.toLowerCase();
  return TIER_COLORS[key] ?? "bg-muted text-muted-foreground border-border";
}

// ─── Local hooks ──────────────────────────────────────────────────────────────

function useAdminCertificates() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Certificate[]>({
    queryKey: ["admin", "certificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllCertificates();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

function useAdminStatsLocal() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.adminGetStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

function useQuestionFailStats(tierId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QuestionFailStat[]>({
    queryKey: ["admin", "questionFailStats", tierId],
    queryFn: async () => {
      if (!actor || !tierId) return [];
      return actor.adminGetQuestionFailStats(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 60_000,
  });
}

function useAttemptLogs(tierId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<QuizAttemptLog[]>({
    queryKey: ["admin", "attemptLogs", tierId],
    queryFn: async () => {
      if (!actor || !tierId) return [];
      return actor.adminGetAttemptLogs(tierId);
    },
    enabled: !!actor && !isFetching && !!tierId,
    staleTime: 30_000,
  });
}

function useFlaggedQuestions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<string[]>({
    queryKey: ["admin", "flaggedQuestions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetFlaggedQuestions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ─── PDF generation (client-side) ─────────────────────────────────────────────

function downloadCertificatePDF(cert: Certificate) {
  const win = window.open("", "_blank");
  if (!win) return;
  const date = new Date(Number(cert.issuedAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Certificate — ${cert.certId}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=DM+Sans:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0d0d14;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;padding:2rem}
  .cert{width:860px;background:linear-gradient(135deg,#0f1120 0%,#1a1a2e 50%,#0f1120 100%);border:2px solid oklch(0.65 0.15 190 / 0.6);border-radius:20px;padding:60px;position:relative;overflow:hidden;box-shadow:0 0 60px oklch(0.65 0.15 190 / 0.25)}
  .cert::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top left, oklch(0.65 0.15 190 / 0.08) 0%,transparent 60%),radial-gradient(ellipse at bottom right,oklch(0.7 0.18 70 / 0.06) 0%,transparent 60%);pointer-events:none}
  .watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0}
  .watermark span{font-family:'Space Grotesk',sans-serif;font-size:5rem;font-weight:700;color:oklch(0.65 0.15 190 / 0.04);transform:rotate(-30deg);letter-spacing:0.2em;text-transform:uppercase}
  .content{position:relative;z-index:1}
  .header{text-align:center;margin-bottom:40px}
  .brand{font-family:'Space Grotesk',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:oklch(0.65 0.15 190);margin-bottom:8px}
  .title{font-family:'Space Grotesk',sans-serif;font-size:2.5rem;font-weight:700;color:#e8eaf6;margin-bottom:4px}
  .subtitle{color:oklch(0.65 0.15 190 / 0.8);font-size:0.95rem}
  .divider{height:1px;background:linear-gradient(90deg,transparent,oklch(0.65 0.15 190 / 0.5),oklch(0.7 0.18 70 / 0.5),transparent);margin:28px 0}
  .awarded{text-align:center;color:#9ca3af;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px}
  .name{text-align:center;font-family:'Space Grotesk',sans-serif;font-size:2.1rem;font-weight:700;color:#e8eaf6;margin-bottom:24px}
  .tier-badge{display:block;width:fit-content;margin:0 auto 28px;padding:8px 24px;border-radius:50px;border:1.5px solid oklch(0.65 0.15 190 / 0.5);background:oklch(0.65 0.15 190 / 0.12);color:oklch(0.65 0.15 190);font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:0.85rem;letter-spacing:0.12em;text-transform:uppercase}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
  .field{background:oklch(1 0 0 / 0.04);border:1px solid oklch(0.65 0.15 190 / 0.12);border-radius:10px;padding:12px 16px}
  .field-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:4px}
  .field-value{font-size:0.95rem;color:#e8eaf6;font-weight:500}
  .footer-row{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
  .cert-id-box{font-family:'Space Grotesk',monospace;font-size:0.75rem;letter-spacing:0.18em;color:oklch(0.7 0.18 70);background:oklch(0.7 0.18 70 / 0.08);border:1px solid oklch(0.7 0.18 70 / 0.3);border-radius:8px;padding:6px 12px}
  .score-box{color:#9ca3af;font-size:0.8rem}
  .score-val{color:oklch(0.65 0.15 190);font-weight:700}
  .seal{width:60px;height:60px;border-radius:50%;border:2px solid oklch(0.7 0.18 70 / 0.6);background:oklch(0.7 0.18 70 / 0.08);display:flex;align-items:center;justify-content:center;font-size:1.8rem}
  @media print{body{background:#fff}}
</style>
</head>
<body>
<div class="cert">
  <div class="watermark"><span>DemonZeno</span></div>
  <div class="content">
    <div class="header">
      <div class="brand">DemonZeno Trading Academy</div>
      <div class="title">Certificate of Achievement</div>
      <div class="subtitle">This is to certify that the following individual has successfully completed</div>
    </div>
    <div class="divider"></div>
    <div class="awarded">Awarded to</div>
    <div class="name">${cert.certInfo.fullName}</div>
    <div class="tier-badge">${cert.tierName} Tier — Trading Academy</div>
    <div class="grid">
      <div class="field"><div class="field-label">Father's Name</div><div class="field-value">${cert.certInfo.fathersName}</div></div>
      <div class="field"><div class="field-label">Country</div><div class="field-value">${cert.certInfo.country}</div></div>
      <div class="field"><div class="field-label">City</div><div class="field-value">${cert.certInfo.city}</div></div>
      <div class="field"><div class="field-label">Date of Birth</div><div class="field-value">${cert.certInfo.dateOfBirth}</div></div>
      <div class="field"><div class="field-label">Email</div><div class="field-value">${cert.certInfo.email}</div></div>
      <div class="field"><div class="field-label">Date Issued</div><div class="field-value">${date}</div></div>
    </div>
    <div class="divider"></div>
    <div class="footer-row">
      <div class="cert-id-box">ID: ${cert.certId}</div>
      <div class="seal">🏆</div>
      <div class="score-box">Score: <span class="score-val">${Number(cert.score)}/${Number(cert.totalQuestions)}</span></div>
    </div>
  </div>
</div>
<script>setTimeout(()=>{window.print()},400)</script>
</body>
</html>`);
  win.document.close();
}

// ─── Certificate Detail Modal ─────────────────────────────────────────────────

function CertDetailModal({
  cert,
  onClose,
}: {
  cert: Certificate;
  onClose: () => void;
}) {
  const date = new Date(Number(cert.issuedAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
  return (
    <dialog
      className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 m-0 max-w-none max-h-none w-full h-full border-0"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      open
    >
      <Card
        data-ocid="admin.cert_detail.dialog"
        className="bg-card border-border max-w-lg w-full p-0 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground text-sm">
              Certificate Details
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            data-ocid="admin.cert_detail.close_button"
            className="h-7 w-7 p-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="px-6 py-3 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
          <span className="certificate-id text-sm">{cert.certId}</span>
          <div className="flex items-center gap-2">
            {!cert.isValid && (
              <Badge
                variant="outline"
                className="text-xs border-destructive/40 text-destructive bg-destructive/10"
              >
                REVOKED
              </Badge>
            )}
            {cert.featured && (
              <Badge
                variant="outline"
                className="text-xs border-[oklch(0.7_0.18_70/0.4)] text-[oklch(0.7_0.18_70)] bg-[oklch(0.7_0.18_70/0.1)]"
              >
                ⭐ FEATURED
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-xs border ${getTierClass(cert.tierName)}`}
            >
              {cert.tierName}
            </Badge>
          </div>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-3">
          {[
            { label: "Full Name", value: cert.certInfo.fullName },
            { label: "Father's Name", value: cert.certInfo.fathersName },
            { label: "Country", value: cert.certInfo.country },
            { label: "City", value: cert.certInfo.city },
            { label: "Date of Birth", value: cert.certInfo.dateOfBirth },
            { label: "Email", value: cert.certInfo.email },
            {
              label: "Score",
              value: `${Number(cert.score)} / ${Number(cert.totalQuestions)} (${Math.round((Number(cert.score) / Number(cert.totalQuestions)) * 100)}%)`,
            },
            { label: "Issued On", value: date },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-muted/20 rounded-lg px-3 py-2 border border-border/60"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p
                className="text-sm font-medium text-foreground truncate"
                title={value}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="admin.cert_detail.cancel_button"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            size="sm"
            data-ocid="admin.cert_detail.download_button"
            className="btn-primary gap-1.5"
            onClick={() => downloadCertificatePDF(cert)}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </Button>
        </div>
      </Card>
    </dialog>
  );
}

// ─── Tier Breakdown Bar ───────────────────────────────────────────────────────

function TierBreakdownBar({
  certsByTier,
  total,
}: {
  certsByTier: Array<[string, bigint]>;
  total: number;
}) {
  if (certsByTier.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 mt-3">
      {certsByTier.map(([tier, count]) => {
        const pct = total > 0 ? (Number(count) / total) * 100 : 0;
        return (
          <div key={tier} className="flex items-center gap-2 text-xs">
            <span className="w-24 text-muted-foreground capitalize truncate">
              {tier}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-muted/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-6 text-right font-mono text-muted-foreground">
              {Number(count)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Sort helper ──────────────────────────────────────────────────────────────

type SortKey = "date" | "tier" | "name";
type ValidityFilter = "all" | "valid" | "revoked";

function sortCerts(certs: Certificate[], key: SortKey): Certificate[] {
  return [...certs].sort((a, b) => {
    if (key === "date") return Number(b.issuedAt) - Number(a.issuedAt);
    if (key === "tier") return a.tierName.localeCompare(b.tierName);
    return a.certInfo.fullName.localeCompare(b.certInfo.fullName);
  });
}

// ─── Table row ───────────────────────────────────────────────────────────────

function CertRow({
  cert,
  index,
  onView,
  onDelete,
  onRevoke,
  onFeature,
  expanded,
  onToggle,
}: {
  cert: Certificate;
  index: number;
  onView: (cert: Certificate) => void;
  onDelete: (id: string) => void;
  onRevoke: (id: string, makeValid: boolean) => void;
  onFeature: (id: string, featured: boolean) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  const date = new Date(Number(cert.issuedAt) / 1_000_000).toLocaleDateString();
  return (
    <>
      <tr
        data-ocid={`admin.cert.item.${index}`}
        className="border-b border-border hover:bg-muted/10 transition-colors cursor-pointer"
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        tabIndex={0}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="certificate-id text-xs">{cert.certId}</span>
            {!cert.isValid && (
              <Badge
                variant="outline"
                className="text-[10px] border-destructive/40 text-destructive bg-destructive/10 px-1 py-0"
              >
                REVOKED
              </Badge>
            )}
            {cert.featured && (
              <Badge
                variant="outline"
                className="text-[10px] border-[oklch(0.7_0.18_70/0.4)] text-[oklch(0.7_0.18_70)] bg-[oklch(0.7_0.18_70/0.1)] px-1 py-0"
              >
                ⭐
              </Badge>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[160px] truncate">
          {cert.certInfo.fullName}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-[140px] truncate">
          {cert.certInfo.fathersName}
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
          {cert.certInfo.country}
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <Badge
            variant="outline"
            className={`text-xs border ${getTierClass(cert.tierName)}`}
          >
            {cert.tierName}
          </Badge>
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell tabular-nums">
          {date}
        </td>
        <td className="px-4 py-3 text-sm text-right font-mono tabular-nums text-foreground hidden lg:table-cell">
          {Number(cert.score)}/{Number(cert.totalQuestions)}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              data-ocid={`admin.cert.edit_button.${index}`}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onView(cert);
              }}
              aria-label="View details"
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              data-ocid={`admin.cert.feature_button.${index}`}
              className={`h-7 w-7 p-0 ${
                cert.featured
                  ? "text-[oklch(0.7_0.18_70)] hover:bg-[oklch(0.7_0.18_70/0.1)]"
                  : "text-muted-foreground hover:text-[oklch(0.7_0.18_70)]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onFeature(cert.certId, !cert.featured);
              }}
              aria-label={cert.featured ? "Unfeature" : "Feature"}
            >
              {cert.featured ? (
                <Star className="w-3.5 h-3.5 fill-current" />
              ) : (
                <StarOff className="w-3.5 h-3.5" />
              )}
            </Button>
            {cert.isValid ? (
              <Button
                size="sm"
                variant="ghost"
                data-ocid={`admin.cert.revoke_button.${index}`}
                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevoke(cert.certId, false);
                }}
                aria-label={`Revoke ${cert.certId}`}
              >
                <ShieldX className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                data-ocid={`admin.cert.reinstate_button.${index}`}
                className="h-7 w-7 p-0 text-[oklch(0.65_0.15_130)] hover:bg-[oklch(0.65_0.15_130/0.1)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevoke(cert.certId, true);
                }}
                aria-label={`Reinstate ${cert.certId}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              data-ocid={`admin.cert.delete_button.${index}`}
              className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cert.certId);
              }}
              aria-label={`Delete ${cert.certId}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-border bg-muted/5">
          <td colSpan={8} className="px-4 py-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: "Email", value: cert.certInfo.email },
                { label: "City", value: cert.certInfo.city },
                { label: "Date of Birth", value: cert.certInfo.dateOfBirth },
                { label: "Father's Name", value: cert.certInfo.fathersName },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                    {label}
                  </span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                data-ocid={`admin.cert.view_detail.${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(cert);
                }}
              >
                <Award className="w-3 h-3" /> Full Details
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs gap-1 text-primary"
                data-ocid={`admin.cert.download.${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadCertificatePDF(cert);
                }}
              >
                <Download className="w-3 h-3" /> Download PDF
              </Button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Access Denied screen ─────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.15 190), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
          <ShieldAlert className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Access Required
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Admin access is session-local. To unlock, click the{" "}
            <span className="text-primary font-medium">DemonZeno image</span> on
            the home page <span className="font-semibold">5 or more times</span>{" "}
            to trigger the passcode prompt.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            asChild
            data-ocid="admin.access_denied.home_button"
            className="btn-primary w-full gap-2"
          >
            <Link to="/">
              <Home className="w-4 h-4" />
              Go to Home Page
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Admin access does not persist across tabs or sessions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border/40 rounded-lg px-4 py-3 bg-muted/10">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>DemonZeno Trading Academy — Admin Panel</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  ocid: string;
}) {
  return (
    <Card data-ocid={ocid} className="p-4 md:p-5 bg-card border-border">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="font-display font-bold text-2xl md:text-3xl text-foreground">
        {value}
      </p>
      {sub}
    </Card>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────

type AdminTab =
  | "certificates"
  | "quiz-stats"
  | "lesson-analytics"
  | "academy-settings"
  | "stats-overview"
  | "cert-wall"
  | "engagement-heatmap"
  | "lesson-of-week"
  | "ab-testing";

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award className="w-3.5 h-3.5" />,
  },
  {
    id: "quiz-stats",
    label: "Quiz Stats",
    icon: <BarChart3 className="w-3.5 h-3.5" />,
  },
  {
    id: "lesson-analytics",
    label: "Lesson Analytics",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  {
    id: "engagement-heatmap",
    label: "Engagement Heatmap",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  {
    id: "lesson-of-week",
    label: "Lesson of Week",
    icon: <CalendarDays className="w-3.5 h-3.5" />,
  },
  {
    id: "ab-testing",
    label: "A/B Quiz Testing",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  },
  {
    id: "academy-settings",
    label: "Academy Settings",
    icon: <Globe className="w-3.5 h-3.5" />,
  },
  {
    id: "stats-overview",
    label: "Stats Overview",
    icon: <LayoutDashboard className="w-3.5 h-3.5" />,
  },
  {
    id: "cert-wall",
    label: "Certificate Wall",
    icon: <Trophy className="w-3.5 h-3.5" />,
  },
];

// ─── Admin passcode constant (for new backend APIs) ──────────────────────────────
const ADMIN_PC = "2420075112009BILAWALPRAKRITI";

// ─── Quiz Stats Tab ───────────────────────────────────────────────────────────

function QuizStatsTab() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  const { data: stats = [], isLoading: statsLoading } = useQuizAttemptStats();
  const { data: flaggedIds = [] } = useFlaggedQuestions();
  const [selectedTier, setSelectedTier] = useState("beginner");
  const { data: failStats = [], isLoading: failLoading } =
    useQuestionFailStats(selectedTier);
  const { data: attemptLogs = [], isLoading: logsLoading } =
    useAttemptLogs(selectedTier);

  const flagMutation = useMutation({
    mutationFn: async ({
      questionId,
      flagged,
    }: { questionId: string; flagged: boolean }) => {
      if (!actor) throw new Error("No actor");
      await actor.adminFlagQuestion(questionId, flagged);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "flaggedQuestions"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "questionFailStats", selectedTier],
      });
    },
  });

  function getPassRateColor(rate: number): string {
    if (rate > 50) return "text-[oklch(0.65_0.15_130)]";
    if (rate > 20) return "text-[oklch(0.65_0.14_70)]";
    return "text-destructive";
  }

  return (
    <div className="space-y-6">
      {/* Per-tier stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Quiz Attempt Statistics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Per-tier attempt and pass rate breakdown
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          data-ocid="admin.quiz_stats.refresh_button"
          className="h-8 gap-1.5 text-xs"
          onClick={() =>
            void queryClient.invalidateQueries({
              queryKey: ["quizAttemptStats"],
            })
          }
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {statsLoading ? (
          <div
            data-ocid="admin.quiz_stats.loading_state"
            className="p-8 flex flex-col gap-3"
          >
            {["q1", "q2", "q3", "q4", "q5"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : stats.length === 0 ? (
          <div
            data-ocid="admin.quiz_stats.empty_state"
            className="p-12 text-center"
          >
            <BarChart3 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No quiz attempts recorded yet.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Tier", "Total Attempts", "Total Passes", "Pass Rate"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {stats.map((s: QuizAttemptStats, idx: number) => {
                const attempts = Number(s.totalAttempts);
                const passes = Number(s.passCount);
                const rate =
                  attempts > 0 ? Math.round((passes / attempts) * 100) : 0;
                return (
                  <tr
                    key={s.tierId}
                    data-ocid={`admin.quiz_stats.item.${idx + 1}`}
                    className="border-b border-border hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${getTierClass(s.tierId)}`}
                      >
                        {s.tierId}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-foreground font-medium">
                      {attempts.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm tabular-nums text-foreground font-medium">
                      {passes.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-bold tabular-nums ${getPassRateColor(rate)}`}
                      >
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Per-question fail rates + attempt logs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/10 flex items-center justify-between gap-3">
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm">
              Per-Question Fail Rates
            </h4>
            <p className="text-xs text-muted-foreground">
              Questions with highest fail rates for the selected tier
            </p>
          </div>
          <select
            data-ocid="admin.quiz_stats.tier_select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {failLoading ? (
          <div
            data-ocid="admin.quiz_stats.fail_loading_state"
            className="p-6 flex flex-col gap-3"
          >
            {["f1", "f2", "f3"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : failStats.length === 0 ? (
          <div
            data-ocid="admin.quiz_stats.fail_empty_state"
            className="p-8 text-center"
          >
            <BarChart3 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              No fail data recorded for this tier yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Question ID", "Seen", "Failed", "Fail Rate", "Flag"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {[...failStats]
                  .sort(
                    (a, b) =>
                      Number(b.failCount) / Math.max(Number(b.totalSeen), 1) -
                      Number(a.failCount) / Math.max(Number(a.totalSeen), 1),
                  )
                  .map((stat, idx) => {
                    const rate =
                      Number(stat.totalSeen) > 0
                        ? Math.round(
                            (Number(stat.failCount) / Number(stat.totalSeen)) *
                              100,
                          )
                        : 0;
                    const isFlagged = flaggedIds.includes(stat.questionId);
                    return (
                      <tr
                        key={stat.questionId}
                        data-ocid={`admin.quiz_stats.fail_item.${idx + 1}`}
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-foreground">
                          {stat.questionId.slice(0, 12)}…
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums text-foreground">
                          {Number(stat.totalSeen)}
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums text-foreground">
                          {Number(stat.failCount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-bold tabular-nums ${getPassRateColor(100 - rate)}`}
                          >
                            {rate}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant={isFlagged ? "destructive" : "outline"}
                            data-ocid={`admin.quiz_stats.flag_button.${idx + 1}`}
                            className="h-7 text-xs gap-1"
                            disabled={flagMutation.isPending}
                            onClick={() =>
                              flagMutation.mutate({
                                questionId: stat.questionId,
                                flagged: !isFlagged,
                              })
                            }
                          >
                            <Flag className="w-3 h-3" />
                            {isFlagged ? "Unflag" : "Flag"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attempt Logs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/10">
          <h4 className="font-display font-semibold text-foreground text-sm">
            Attempt Logs — <span className="capitalize">{selectedTier}</span>
          </h4>
          <p className="text-xs text-muted-foreground">
            Recent quiz attempt records including fingerprint and pass/fail
          </p>
        </div>
        {logsLoading ? (
          <div
            data-ocid="admin.quiz_stats.logs_loading_state"
            className="p-6 flex flex-col gap-3"
          >
            {["l1", "l2", "l3"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : attemptLogs.length === 0 ? (
          <div
            data-ocid="admin.quiz_stats.logs_empty_state"
            className="p-8 text-center"
          >
            <p className="text-muted-foreground text-sm">
              No attempt logs for this tier yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Timestamp", "Score", "Passed", "Fingerprint"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...attemptLogs]
                  .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                  .slice(0, 50)
                  .map((log, idx) => {
                    const ts = new Date(
                      Number(log.timestamp) / 1_000_000,
                    ).toLocaleString();
                    return (
                      <tr
                        key={`${log.fingerprint}-${idx}`}
                        data-ocid={`admin.quiz_stats.log_item.${idx + 1}`}
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                          {ts}
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums font-medium text-foreground">
                          {Number(log.score)}/30
                        </td>
                        <td className="px-4 py-3">
                          {log.passed ? (
                            <Badge
                              variant="outline"
                              className="text-xs border-[oklch(0.65_0.15_130/0.4)] text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.08)]"
                            >
                              PASSED
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs border-destructive/40 text-destructive bg-destructive/10"
                            >
                              FAILED
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[160px]">
                          {log.fingerprint.slice(0, 16)}…
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lesson Analytics Tab ─────────────────────────────────────────────────────

// ─── Engagement Heatmap Tab ───────────────────────────────────────────────────

function EngagementHeatmapTab() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [tierFilter, setTierFilter] = useState("all");

  const { data: engagementData = [], isLoading } = useQuery<LessonEngagement[]>(
    {
      queryKey: ["admin", "engagement"],
      queryFn: async () => {
        if (!actor) return [];
        return actor.adminGetEngagementData(ADMIN_PC);
      },
      enabled: !!actor && !isFetching,
      staleTime: 60_000,
    },
  );

  function formatTime(secs: number): string {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${secs}s`;
  }

  function heatBadgeClass(secs: number, maxSecs: number): string {
    if (maxSecs === 0) return "bg-primary/10 text-primary border-primary/20";
    const pct = secs / maxSecs;
    if (pct > 0.66)
      return "bg-[oklch(0.7_0.18_70/0.2)] text-[oklch(0.7_0.18_70)] border-[oklch(0.7_0.18_70/0.4)]";
    if (pct > 0.33)
      return "bg-[oklch(0.65_0.14_70/0.15)] text-[oklch(0.65_0.14_70)] border-[oklch(0.65_0.14_70/0.3)]";
    return "bg-primary/10 text-primary border-primary/20";
  }

  const filtered = useMemo(() => {
    const base =
      tierFilter === "all"
        ? engagementData
        : engagementData.filter((e) => e.tier.toLowerCase() === tierFilter);
    return [...base].sort(
      (a, b) => Number(b.totalTimeSeconds) - Number(a.totalTimeSeconds),
    );
  }, [engagementData, tierFilter]);

  const maxSecs = filtered.reduce(
    (m, e) => Math.max(m, Number(e.totalTimeSeconds)),
    1,
  );
  const topLesson = filtered[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Lesson Engagement Heatmap
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total time learners spent per lesson — sorted by most engaged.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            data-ocid="admin.heatmap.tier_filter"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Tiers</option>
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            data-ocid="admin.heatmap.refresh_button"
            className="h-8 gap-1.5 text-xs"
            onClick={() =>
              void queryClient.invalidateQueries({
                queryKey: ["admin", "engagement"],
              })
            }
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {topLesson && (
        <div className="bg-[oklch(0.7_0.18_70/0.08)] border border-[oklch(0.7_0.18_70/0.3)] rounded-xl px-5 py-4 flex items-center gap-3">
          <Zap className="w-4 h-4 text-[oklch(0.7_0.18_70)] shrink-0" />
          <p className="text-sm text-foreground">
            Learners are spending the most time on{" "}
            <span className="font-semibold text-[oklch(0.7_0.18_70)]">
              {topLesson.lessonId}
            </span>{" "}
            ({topLesson.tier}) —{" "}
            <span className="font-semibold">
              {formatTime(Number(topLesson.totalTimeSeconds))}
            </span>{" "}
            total.
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div
            data-ocid="admin.heatmap.loading_state"
            className="p-6 flex flex-col gap-3"
          >
            {["h1", "h2", "h3", "h4", "h5"].map((k) => (
              <Skeleton key={k} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="admin.heatmap.empty_state"
            className="p-12 text-center"
          >
            <Flame className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No engagement data yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Lesson ID", "Tier", "Time Spent", "Visits", "Heat"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, idx) => {
                  const secs = Number(entry.totalTimeSeconds);
                  const badgeClass = heatBadgeClass(secs, maxSecs);
                  const barPct = maxSecs > 0 ? (secs / maxSecs) * 100 : 0;
                  return (
                    <tr
                      key={`${entry.tier}-${entry.lessonId}`}
                      data-ocid={`admin.heatmap.item.${idx + 1}`}
                      className="border-b border-border hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-foreground max-w-[160px] truncate">
                        {entry.lessonId}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border capitalize ${getTierClass(entry.tier)}`}
                        >
                          {entry.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted/40 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground tabular-nums">
                            {formatTime(secs)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums text-foreground font-medium">
                        {Number(entry.visitCount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${badgeClass}`}
                        >
                          {barPct > 66
                            ? "🔴 High"
                            : barPct > 33
                              ? "🟠 Mid"
                              : "🔵 Low"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lesson of the Week Tab ───────────────────────────────────────────────────

function LessonOfWeekTab() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [formLessonId, setFormLessonId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formTier, setFormTier] = useState("beginner");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: current, isLoading } = useQuery<LessonOfWeek | null>({
    queryKey: ["admin", "lessonOfWeek"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLessonOfWeek();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const setMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.adminSetLessonOfWeek(
        ADMIN_PC,
        formLessonId.trim(),
        formTitle.trim(),
        formTier,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "lessonOfWeek"],
      });
      setSuccessMsg("Lesson of the Week updated!");
      setFormLessonId("");
      setFormTitle("");
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.adminSetLessonOfWeek(ADMIN_PC, "", "", "beginner");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin", "lessonOfWeek"],
      });
      setSuccessMsg("Lesson of the Week cleared.");
      setTimeout(() => setSuccessMsg(null), 4000);
    },
  });

  function timeRemaining(expiresAt: bigint): string {
    const diffMs = Number(expiresAt) / 1_000_000 - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h remaining`;
  }

  const isActive = current && current.lessonId !== "";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-foreground">
          Lesson of the Week
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Set a featured lesson that appears as a highlighted banner on the
          Academy for all visitors.
        </p>
      </div>

      {successMsg && (
        <div
          data-ocid="admin.lotw.success_state"
          className="bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-xl px-5 py-3"
        >
          <p className="text-sm text-[oklch(0.65_0.15_130)]">{successMsg}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          Current Status
        </p>
        {isLoading ? (
          <div data-ocid="admin.lotw.loading_state">
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : isActive ? (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[oklch(0.7_0.18_70)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  {current.lessonTitle}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={`text-xs border capitalize ${getTierClass(current.tier)}`}
                  >
                    {current.tier}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">
                    {current.lessonId}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeRemaining(current.expiresAt)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              data-ocid="admin.lotw.clear_button"
              className="h-8 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
              disabled={clearMutation.isPending}
              onClick={() => clearMutation.mutate()}
            >
              <X className="w-3.5 h-3.5" /> Clear
            </Button>
          </div>
        ) : (
          <div
            data-ocid="admin.lotw.empty_state"
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span>No lesson of the week is currently set.</span>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Set New Lesson of the Week
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="lotw-title"
              className="text-xs text-muted-foreground"
            >
              Lesson Title
            </Label>
            <Input
              id="lotw-title"
              data-ocid="admin.lotw.title_input"
              placeholder="e.g. Understanding Support & Resistance"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="bg-secondary border-input text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lotw-id" className="text-xs text-muted-foreground">
              Lesson ID
            </Label>
            <Input
              id="lotw-id"
              data-ocid="admin.lotw.lesson_id_input"
              placeholder="e.g. support-resistance"
              value={formLessonId}
              onChange={(e) => setFormLessonId(e.target.value)}
              className="bg-secondary border-input text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tier</Label>
            <select
              data-ocid="admin.lotw.tier_select"
              value={formTier}
              onChange={(e) => setFormTier(e.target.value)}
              className="w-full h-9 text-sm rounded-md border border-input bg-secondary text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {setMutation.error && (
          <p
            className="text-xs text-destructive bg-destructive/10 rounded p-2"
            data-ocid="admin.lotw.error_state"
          >
            {String(setMutation.error)}
          </p>
        )}
        <Button
          size="sm"
          data-ocid="admin.lotw.submit_button"
          className="btn-primary gap-1.5 text-xs h-8"
          disabled={
            !formLessonId.trim() || !formTitle.trim() || setMutation.isPending
          }
          onClick={() => setMutation.mutate()}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          {setMutation.isPending ? "Saving…" : "Set Lesson of the Week"}
        </Button>
      </div>
    </div>
  );
}

// ─── A/B Quiz Testing Tab ─────────────────────────────────────────────────────

function ABTestingTab() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [newQuestionId, setNewQuestionId] = useState("");
  const [newVersionA, setNewVersionA] = useState("");
  const [newVersionB, setNewVersionB] = useState("");
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  const { data: abTests = [], isLoading } = useQuery<ABTestRecord[]>({
    queryKey: ["admin", "abTests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetABTests(ADMIN_PC);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });

  const toggleMutation = useMutation({
    mutationFn: async (questionId: string) => {
      if (!actor) throw new Error("No actor");
      await actor.adminToggleABVersion(ADMIN_PC, questionId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "abTests"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      await actor.adminCreateABTest(
        ADMIN_PC,
        newQuestionId.trim(),
        newVersionA.trim(),
        newVersionB.trim(),
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "abTests"] });
      setCreateSuccess(`A/B test created for: ${newQuestionId.trim()}`);
      setNewQuestionId("");
      setNewVersionA("");
      setNewVersionB("");
      setTimeout(() => setCreateSuccess(null), 4000);
    },
  });

  function passRate(passes: bigint, attempts: bigint): string {
    const a = Number(attempts);
    if (a === 0) return "0%";
    return `${Math.round((Number(passes) / a) * 100)}%`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-foreground">
          A/B Quiz Question Testing
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Test two variants of a quiz question and switch to the
          better-performing version.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/10 flex items-center justify-between">
          <h4 className="font-display font-semibold text-foreground text-sm">
            Active A/B Tests
          </h4>
          <Button
            size="sm"
            variant="outline"
            data-ocid="admin.ab.refresh_button"
            className="h-8 gap-1.5 text-xs"
            onClick={() =>
              void queryClient.invalidateQueries({
                queryKey: ["admin", "abTests"],
              })
            }
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
        {isLoading ? (
          <div
            data-ocid="admin.ab.loading_state"
            className="p-6 flex flex-col gap-3"
          >
            {["a1", "a2", "a3"].map((k) => (
              <Skeleton key={k} className="h-24 w-full rounded-md" />
            ))}
          </div>
        ) : abTests.length === 0 ? (
          <div data-ocid="admin.ab.empty_state" className="p-10 text-center">
            <FlaskConical className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No A/B tests yet — create one below.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {abTests.map((test, idx) => {
              const isA = test.activeVersion === "A";
              return (
                <div
                  key={test.questionId}
                  data-ocid={`admin.ab.item.${idx + 1}`}
                  className="px-5 py-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Question ID
                      </p>
                      <p className="font-mono text-sm text-foreground font-semibold">
                        {test.questionId}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.ab.toggle_button.${idx + 1}`}
                      className="h-8 text-xs gap-1.5"
                      disabled={toggleMutation.isPending}
                      onClick={() => toggleMutation.mutate(test.questionId)}
                    >
                      Switch to Version {isA ? "B" : "A"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      className={`rounded-lg border p-3 space-y-2 ${
                        isA
                          ? "border-[oklch(0.65_0.15_130/0.5)] bg-[oklch(0.65_0.15_130/0.06)]"
                          : "border-border bg-muted/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Version A
                        </span>
                        {isA && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[oklch(0.65_0.15_130/0.4)] text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.08)] px-1.5 py-0"
                          >
                            ● Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        {test.versionAText}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Attempts:{" "}
                          <strong className="text-foreground">
                            {Number(test.versionAAttempts)}
                          </strong>
                        </span>
                        <span>
                          Pass Rate:{" "}
                          <strong className="text-foreground">
                            {passRate(
                              test.versionAPassCount,
                              test.versionAAttempts,
                            )}
                          </strong>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`rounded-lg border p-3 space-y-2 ${
                        !isA
                          ? "border-[oklch(0.65_0.15_130/0.5)] bg-[oklch(0.65_0.15_130/0.06)]"
                          : "border-border bg-muted/10"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Version B
                        </span>
                        {!isA && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[oklch(0.65_0.15_130/0.4)] text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.08)] px-1.5 py-0"
                          >
                            ● Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">
                        {test.versionBText}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Attempts:{" "}
                          <strong className="text-foreground">
                            {Number(test.versionBAttempts)}
                          </strong>
                        </span>
                        <span>
                          Pass Rate:{" "}
                          <strong className="text-foreground">
                            {passRate(
                              test.versionBPassCount,
                              test.versionBAttempts,
                            )}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h4 className="font-display font-semibold text-foreground text-sm">
          Create New A/B Test
        </h4>
        {createSuccess && (
          <div
            data-ocid="admin.ab.success_state"
            className="bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-lg px-4 py-2"
          >
            <p className="text-xs text-[oklch(0.65_0.15_130)]">
              {createSuccess}
            </p>
          </div>
        )}
        <div className="space-y-1.5">
          <Label
            htmlFor="ab-question-id"
            className="text-xs text-muted-foreground"
          >
            Question ID
          </Label>
          <Input
            id="ab-question-id"
            data-ocid="admin.ab.question_id_input"
            placeholder="e.g. beginner_q_42"
            value={newQuestionId}
            onChange={(e) => setNewQuestionId(e.target.value)}
            className="bg-secondary border-input text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="ab-version-a"
              className="text-xs text-muted-foreground"
            >
              Version A Text
            </Label>
            <textarea
              id="ab-version-a"
              data-ocid="admin.ab.version_a_textarea"
              placeholder="Enter Version A question text…"
              value={newVersionA}
              onChange={(e) => setNewVersionA(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-secondary text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="ab-version-b"
              className="text-xs text-muted-foreground"
            >
              Version B Text
            </Label>
            <textarea
              id="ab-version-b"
              data-ocid="admin.ab.version_b_textarea"
              placeholder="Enter Version B question text…"
              value={newVersionB}
              onChange={(e) => setNewVersionB(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-secondary text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>
        {createMutation.error && (
          <p
            className="text-xs text-destructive bg-destructive/10 rounded p-2"
            data-ocid="admin.ab.create_error_state"
          >
            {String(createMutation.error)}
          </p>
        )}
        <Button
          size="sm"
          data-ocid="admin.ab.create_button"
          className="btn-primary gap-1.5 text-xs h-8"
          disabled={
            !newQuestionId.trim() ||
            !newVersionA.trim() ||
            !newVersionB.trim() ||
            createMutation.isPending
          }
          onClick={() => createMutation.mutate()}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          {createMutation.isPending ? "Creating…" : "Create A/B Test"}
        </Button>
      </div>
    </div>
  );
}

function LessonAnalyticsTab() {
  const { actor, isFetching } = useActor(createActor);

  const { data: lessonRatings = [], isLoading: ratingsLoading } = useQuery<
    Array<[string, string, number]>
  >({
    queryKey: ["admin", "lessonRatings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLessonRatings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const { data: dailyActive = [], isLoading: dailyLoading } = useQuery<
    Array<{ date: string; count: bigint }>
  >({
    queryKey: ["admin", "dailyActive"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyActiveCounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const { data: completionTrends = [], isLoading: trendsLoading } = useQuery<
    Array<{ tierId: string; lessonId: string; completedAt: bigint }>
  >({
    queryKey: ["admin", "completionTrends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLessonCompletionTrends();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  // Sort ratings ascending (lowest confidence first)
  const sortedRatings = [...lessonRatings].sort((a, b) => a[2] - b[2]);

  // Build daily active bar chart data (last 30 days)
  const chartData = [...dailyActive]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
  const maxCount = chartData.reduce((m, d) => Math.max(m, Number(d.count)), 1);

  // Lesson completion counts
  const completionCounts: Record<string, number> = {};
  for (const entry of completionTrends) {
    const key = `${entry.tierId}/${entry.lessonId}`;
    completionCounts[key] = (completionCounts[key] ?? 0) + 1;
  }
  const topLessons = Object.entries(completionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  return (
    <div className="space-y-8">
      {/* Lesson Confidence Ratings */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Lesson Confidence Ratings
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Sorted by lowest avg confidence — shows where users struggle most.
        </p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {ratingsLoading ? (
            <div
              data-ocid="admin.lesson_analytics.ratings_loading_state"
              className="p-6 flex flex-col gap-3"
            >
              {["r1", "r2", "r3"].map((k) => (
                <Skeleton key={k} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : sortedRatings.length === 0 ? (
            <div
              data-ocid="admin.lesson_analytics.ratings_empty_state"
              className="p-10 text-center"
            >
              <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No lesson confidence data yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {["Tier", "Lesson", "Avg Confidence", "Rating"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRatings.map(([tierId, lessonId, avg], idx) => {
                    const pct = (avg / 5) * 100;
                    const color =
                      avg < 2.5
                        ? "text-destructive"
                        : avg < 3.5
                          ? "text-[oklch(0.65_0.14_70)]"
                          : "text-[oklch(0.65_0.15_130)]";
                    return (
                      <tr
                        key={`${tierId}-${lessonId}`}
                        data-ocid={`admin.lesson_analytics.rating_item.${idx + 1}`}
                        className="border-b border-border hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-xs border capitalize ${getTierClass(tierId)}`}
                          >
                            {tierId}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-mono">
                          {lessonId}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full bg-muted/40 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span
                              className={`text-sm font-bold tabular-nums ${color}`}
                            >
                              {avg.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= Math.round(avg)
                                    ? "text-[oklch(0.7_0.18_70)] fill-[oklch(0.7_0.18_70)]"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Daily Active Learners Chart */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Daily Active Learners
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Learners active per day (last 30 days).
        </p>
        <div className="bg-card border border-border rounded-xl p-5">
          {dailyLoading ? (
            <div data-ocid="admin.lesson_analytics.daily_loading_state">
              <Skeleton className="h-48 w-full rounded-md" />
            </div>
          ) : chartData.length === 0 ? (
            <div
              data-ocid="admin.lesson_analytics.daily_empty_state"
              className="h-48 flex items-center justify-center"
            >
              <p className="text-muted-foreground text-sm">
                No activity data yet.
              </p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${chartData.length * 18} 80`}
              className="w-full h-48"
              role="img"
              aria-label="Daily active learners bar chart"
            >
              <title>Daily active learners bar chart</title>
              {chartData.map((d, i) => {
                const barH = (Number(d.count) / maxCount) * 60;
                const x = i * 18;
                const y = 60 - barH;
                return (
                  <g key={d.date}>
                    <rect
                      x={x + 2}
                      y={y}
                      width={14}
                      height={barH}
                      rx={2}
                      fill="oklch(0.65 0.15 190 / 0.7)"
                    />
                    {i % 5 === 0 && (
                      <text
                        x={x + 9}
                        y={78}
                        textAnchor="middle"
                        fontSize={7}
                        fill="oklch(0.55 0.01 260)"
                      >
                        {d.date.slice(5)}
                      </text>
                    )}
                    {Number(d.count) > 0 && (
                      <text
                        x={x + 9}
                        y={y - 2}
                        textAnchor="middle"
                        fontSize={7}
                        fill="oklch(0.65 0.15 190)"
                      >
                        {Number(d.count)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Lesson Completion Trends */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Lesson Completion Trends
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Most completed lessons across all users.
        </p>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {trendsLoading ? (
            <div
              data-ocid="admin.lesson_analytics.trends_loading_state"
              className="p-6 flex flex-col gap-3"
            >
              {["t1", "t2", "t3"].map((k) => (
                <Skeleton key={k} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : topLessons.length === 0 ? (
            <div
              data-ocid="admin.lesson_analytics.trends_empty_state"
              className="p-10 text-center"
            >
              <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No completion data yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {topLessons.map(([key, count], idx) => {
                const [tierId, lessonId] = key.split("/");
                const maxComp = topLessons[0][1];
                const pct = (count / maxComp) * 100;
                return (
                  <div
                    key={key}
                    data-ocid={`admin.lesson_analytics.trend_item.${idx + 1}`}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs border capitalize ${getTierClass(tierId ?? "")}`}
                        >
                          {tierId}
                        </Badge>
                        <span className="text-xs text-foreground font-mono truncate">
                          {lessonId}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground tabular-nums shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Overview Tab ───────────────────────────────────────────────────────

function StatsOverviewTab() {
  const { actor, isFetching } = useActor(createActor);

  const { data: stats, isLoading: statsLoading } = useAdminStatsLocal();
  const { data: attemptStats = [], isLoading: attemptsLoading } =
    useQuizAttemptStats();

  const { data: monthlyStats = [], isLoading: monthlyLoading } = useQuery<
    Array<[string, bigint]>
  >({
    queryKey: ["admin", "monthlyStats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetMonthlyStats(ADMIN_PC);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const { data: dailyActive = [], isLoading: dailyLoading } = useQuery<
    Array<{ date: string; count: bigint }>
  >({
    queryKey: ["admin", "dailyActive"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyActiveCounts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const totalCerts = stats ? Number(stats.totalCertificates) : 0;
  const totalAttempts = attemptStats.reduce(
    (s, a) => s + Number(a.totalAttempts),
    0,
  );
  const totalPasses = attemptStats.reduce((s, a) => s + Number(a.passCount), 0);
  const passRate =
    totalAttempts > 0 ? Math.round((totalPasses / totalAttempts) * 100) : 0;
  const recentActive = dailyActive.reduce((s, d) => s + Number(d.count), 0);

  // Bar chart data for certs by tier
  const tierData = stats?.certsByTier ?? [];
  const maxTierCount = tierData.reduce((m, [, c]) => Math.max(m, Number(c)), 1);

  // Line chart for daily active (last 14 days)
  const lineData = [...dailyActive]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
  const maxLine = lineData.reduce((m, d) => Math.max(m, Number(d.count)), 1);
  const W = 280;
  const H = 80;
  const linePoints = lineData.map((d, i) => {
    const x = lineData.length > 1 ? (i / (lineData.length - 1)) * W : W / 2;
    const y = H - (Number(d.count) / maxLine) * (H - 10) - 5;
    return `${x},${y}`;
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-4">
          Platform Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Certificates",
              value: statsLoading ? "…" : totalCerts.toLocaleString(),
              icon: <Award className="w-4 h-4 text-primary" />,
              ocid: "admin.stats.total_certs_card",
            },
            {
              label: "Quiz Attempts",
              value: attemptsLoading ? "…" : totalAttempts.toLocaleString(),
              icon: <BarChart3 className="w-4 h-4 text-primary" />,
              ocid: "admin.stats.attempts_card",
            },
            {
              label: "Global Pass Rate",
              value: attemptsLoading ? "…" : `${passRate}%`,
              icon: <Shield className="w-4 h-4 text-primary" />,
              ocid: "admin.stats.pass_rate_card",
            },
            {
              label: "Total Activity",
              value: dailyLoading ? "…" : recentActive.toLocaleString(),
              icon: <Globe className="w-4 h-4 text-primary" />,
              ocid: "admin.stats.activity_card",
            },
          ].map(({ label, value, icon, ocid }) => (
            <Card
              key={label}
              data-ocid={ocid}
              className="p-4 md:p-5 bg-card border-border"
            >
              <div className="flex items-center gap-2 mb-3">
                {icon}
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <p className="font-display font-bold text-2xl md:text-3xl text-foreground">
                {value}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificates by Tier — bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Certificates by Tier
          </p>
          {statsLoading ? (
            <Skeleton className="h-40 w-full rounded-md" />
          ) : tierData.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No data yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {tierData.map(([tier, count]) => {
                const pct =
                  maxTierCount > 0 ? (Number(count) / maxTierCount) * 100 : 0;
                return (
                  <div key={tier} className="flex items-center gap-3 text-sm">
                    <span className="w-24 text-muted-foreground capitalize text-xs truncate">
                      {tier}
                    </span>
                    <div className="flex-1 h-4 rounded bg-muted/30 overflow-hidden relative">
                      <div
                        className="h-full rounded bg-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-xs font-bold text-foreground">
                        {Number(count)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quiz Attempts vs Passes */}
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Quiz: Attempts vs Passes per Tier
          </p>
          {attemptsLoading ? (
            <Skeleton className="h-40 w-full rounded-md" />
          ) : attemptStats.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No quiz data yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {attemptStats.map((s, idx) => {
                const attempts = Number(s.totalAttempts);
                const passes = Number(s.passCount);
                const rate =
                  attempts > 0 ? Math.round((passes / attempts) * 100) : 0;
                return (
                  <div
                    key={s.tierId}
                    data-ocid={`admin.stats.tier_item.${idx + 1}`}
                    className="flex items-center gap-3"
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs border capitalize w-24 justify-center ${getTierClass(s.tierId)}`}
                    >
                      {s.tierId}
                    </Badge>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>
                          Attempts:{" "}
                          <strong className="text-foreground">
                            {attempts}
                          </strong>
                        </span>
                        <span className="mx-1">•</span>
                        <span>
                          Passes:{" "}
                          <strong className="text-foreground">{passes}</strong>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden relative">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-foreground w-10 text-right">
                      {rate}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Challenge Stats */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Monthly Challenge Stats
          </p>
        </div>
        {monthlyLoading ? (
          <Skeleton className="h-40 w-full rounded-md" />
        ) : monthlyStats.length === 0 ? (
          <div
            data-ocid="admin.stats.monthly_empty_state"
            className="h-20 flex items-center justify-center"
          >
            <p className="text-muted-foreground text-sm">
              No monthly challenge data yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...monthlyStats]
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 12)
              .map(([month, count], idx) => {
                const maxVal = monthlyStats.reduce(
                  (m, [, c]) => Math.max(m, Number(c)),
                  1,
                );
                const pct = (Number(count) / maxVal) * 100;
                return (
                  <div
                    key={month}
                    data-ocid={`admin.stats.monthly_item.${idx + 1}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-20 text-xs text-muted-foreground shrink-0">
                      {month}
                    </span>
                    <div className="flex-1 h-4 rounded bg-muted/30 overflow-hidden relative">
                      <div
                        className="h-full rounded bg-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-xs font-bold text-foreground">
                        {Number(count)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Daily Active Users line chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          Daily Active Users (last 14 days)
        </p>
        {dailyLoading ? (
          <Skeleton className="h-28 w-full rounded-md" />
        ) : lineData.length < 2 ? (
          <div className="h-28 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Not enough data to draw chart.
            </p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H + 15}`}
            className="w-full h-28"
            role="img"
            aria-label="Daily active users line chart"
          >
            <title>Daily active users line chart</title>
            <polyline
              points={linePoints.join(" ")}
              fill="none"
              stroke="oklch(0.65 0.15 190)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {lineData.map((d, i) => {
              const x = (i / (lineData.length - 1)) * W;
              const y = H - (Number(d.count) / maxLine) * (H - 10) - 5;
              return (
                <g key={d.date}>
                  <circle cx={x} cy={y} r={3} fill="oklch(0.65 0.15 190)" />
                  {i % 3 === 0 && (
                    <text
                      x={x}
                      y={H + 12}
                      textAnchor="middle"
                      fontSize={8}
                      fill="oklch(0.55 0.01 260)"
                    >
                      {d.date.slice(5)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

// ─── Academy Settings Tab ─────────────────────────────────────────────────────

function AcademySettingsTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: banner, isLoading: bannerLoading } = useAnnouncementBanner();
  const { data: tierStates = [], isLoading: tiersLoading } =
    useTierDisabledStates();
  const [bannerText, setBannerText] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState<string | null>(null);

  const bannerMutation = useMutation({
    mutationFn: async ({ msg, pin }: { msg: string; pin: boolean }) => {
      if (!actor) throw new Error("No actor");
      await actor.adminSetAnnouncementBanner(msg, pin);
    },
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({
        queryKey: ["announcementBanner"],
      });
      setBannerSuccess(
        vars.pin ? "Banner pinned successfully!" : "Banner cleared.",
      );
      setTimeout(() => setBannerSuccess(null), 3000);
    },
  });

  const tierMutation = useMutation({
    mutationFn: async ({
      tierId,
      disabled,
    }: { tierId: string; disabled: boolean }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminSetTierDisabled(tierId, disabled);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tierDisabledStates"] });
    },
  });

  function isTierDisabled(tierId: string) {
    return tierStates.find((t) => t.tierId === tierId)?.disabled ?? false;
  }

  return (
    <div className="space-y-6">
      {/* Announcement Banner */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Announcement Banner
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Pinned banners appear at the top of the site for all visitors.
        </p>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Current Status
          </p>
          {bannerLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : banner?.isPinned ? (
            <div className="flex items-start gap-3">
              <BellRing className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Currently pinned:
                </p>
                <p className="text-sm text-primary mt-0.5">
                  &ldquo;{banner.text}&rdquo;
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No banner currently pinned.
            </p>
          )}

          <div className="border-t border-border/50 pt-4 space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Set New Banner
            </p>
            <div className="space-y-1.5">
              <Label
                htmlFor="banner-text"
                className="text-xs text-muted-foreground"
              >
                Announcement message
              </Label>
              <Input
                id="banner-text"
                data-ocid="admin.announcement.input"
                placeholder="Enter announcement message for all visitors…"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="bg-secondary border-input text-sm"
              />
            </div>
            {bannerMutation.error && (
              <p
                className="text-xs text-destructive bg-destructive/10 rounded p-2"
                data-ocid="admin.announcement.error_state"
              >
                {String(bannerMutation.error)}
              </p>
            )}
            {bannerSuccess && (
              <p
                className="text-xs text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.1)] rounded p-2"
                data-ocid="admin.announcement.success_state"
              >
                {bannerSuccess}
              </p>
            )}
            <div className="flex gap-2">
              <Button
                size="sm"
                data-ocid="admin.announcement.pin_button"
                className="btn-primary gap-1.5 text-xs h-8"
                disabled={!bannerText.trim() || bannerMutation.isPending}
                onClick={() =>
                  bannerMutation.mutate({ msg: bannerText.trim(), pin: true })
                }
              >
                <BellRing className="w-3.5 h-3.5" />
                {bannerMutation.isPending ? "Saving…" : "Pin Banner"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                data-ocid="admin.announcement.unpin_button"
                className="gap-1.5 text-xs h-8 text-muted-foreground"
                disabled={bannerMutation.isPending}
                onClick={() =>
                  bannerMutation.mutate({
                    msg: banner?.text ?? "",
                    pin: false,
                  })
                }
              >
                Unpin Banner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Fail Message */}
      <QuizFailMessageManager />

      {/* Tier Maintenance Mode */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Tier Maintenance Mode
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Disable individual tiers to prevent new quiz attempts while content is
          being updated.
        </p>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {tiersLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {["t1", "t2", "t3", "t4", "t5"].map((k) => (
                <Skeleton key={k} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {TIERS.map((tierId) => {
                const disabled = isTierDisabled(tierId);
                return (
                  <div
                    key={tierId}
                    data-ocid={`admin.tier.item.${tierId}`}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border capitalize ${
                          disabled
                            ? "border-destructive/40 text-destructive bg-destructive/10"
                            : getTierClass(tierId)
                        }`}
                      >
                        {tierId}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {disabled
                          ? "🔒 Maintenance mode — quiz locked"
                          : "✅ Active — quiz accessible"}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={disabled ? "outline" : "destructive"}
                      data-ocid={`admin.tier.toggle_button.${tierId}`}
                      className="h-8 text-xs gap-1.5"
                      disabled={tierMutation.isPending}
                      onClick={() =>
                        tierMutation.mutate({ tierId, disabled: !disabled })
                      }
                    >
                      {disabled ? "Enable Tier" : "Disable Tier"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {tierMutation.error && (
          <p
            className="text-xs text-destructive bg-destructive/10 rounded p-2 mt-2"
            data-ocid="admin.tier.error_state"
          >
            {String(tierMutation.error)}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Quiz Fail Message Section ─────────────────────────────────────────────────

function QuizFailMessageManager() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] = useState("beginner");
  const [msgText, setMsgText] = useState("");
  const [passcode, setPasscode] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const { data: currentMsg, isLoading: msgLoading } = useQuery<string | null>({
    queryKey: ["quizFailMessage", selectedTier],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuizFailMessage(selectedTier);
    },
    enabled: !!actor && !!selectedTier,
    staleTime: 30_000,
  });

  async function handleSave() {
    if (!actor || !msgText.trim()) return;
    setSaveStatus("saving");
    try {
      const ok = await actor.setQuizFailMessage(
        selectedTier,
        msgText.trim(),
        passcode,
      );
      if (ok) {
        setSaveStatus("saved");
        void queryClient.invalidateQueries({
          queryKey: ["quizFailMessage", selectedTier],
        });
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  return (
    <div>
      <h3 className="font-display font-semibold text-foreground mb-1">
        Custom Quiz Fail Message
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Set a custom encouragement message shown to users who fail the quiz.
        Shown below the score on the fail screen.
      </p>
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Label className="text-xs text-muted-foreground shrink-0">Tier</Label>
          <select
            data-ocid="admin.fail_message.tier_select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {!msgLoading && currentMsg && (
          <p className="text-xs text-muted-foreground italic bg-muted/20 px-3 py-2 rounded">
            Current: &ldquo;{currentMsg}&rdquo;
          </p>
        )}
        <div className="space-y-1.5">
          <Label
            htmlFor="fail-passcode"
            className="text-xs text-muted-foreground"
          >
            Admin Passcode
          </Label>
          <Input
            id="fail-passcode"
            type="password"
            data-ocid="admin.fail_message.passcode_input"
            placeholder="Enter admin passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="bg-secondary border-input text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fail-msg" className="text-xs text-muted-foreground">
            New message
          </Label>
          <Input
            id="fail-msg"
            data-ocid="admin.fail_message.input"
            placeholder="e.g. Don't give up! Review the lessons and try again."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            className="bg-secondary border-input text-sm"
          />
        </div>
        {saveStatus === "saved" && (
          <p
            className="text-xs text-[oklch(0.65_0.15_130)] bg-[oklch(0.65_0.15_130/0.1)] rounded p-2"
            data-ocid="admin.fail_message.success_state"
          >
            Message saved successfully!
          </p>
        )}
        {saveStatus === "error" && (
          <p
            className="text-xs text-destructive bg-destructive/10 rounded p-2"
            data-ocid="admin.fail_message.error_state"
          >
            Failed to save. Check your passcode and try again.
          </p>
        )}
        <Button
          size="sm"
          data-ocid="admin.fail_message.save_button"
          className="btn-primary gap-1.5 text-xs h-8"
          disabled={
            !msgText.trim() || !passcode.trim() || saveStatus === "saving"
          }
          onClick={handleSave}
        >
          {saveStatus === "saving" ? "Saving…" : "Save Message"}
        </Button>
      </div>
    </div>
  );
}

// ─── Certificate Wall Admin Tab ───────────────────────────────────────────────

function CertWallAdminTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { data: featured = [], isLoading: featuredLoading } =
    useFeaturedCertificates();
  const { data: allCerts = [] } = useAdminCertificates();
  const { data: stats } = useAdminStatsLocal();

  const featureMutation = useMutation({
    mutationFn: async ({
      certId,
      featured: isFeatured,
    }: { certId: string; featured: boolean }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminFeatureCertificate(certId, isFeatured);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["featuredCertificates"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "certificates"],
      });
    },
  });

  const totalCerts = stats ? Number(stats.totalCertificates) : allCerts.length;
  const tierCounts = stats?.certsByTier ?? [];

  return (
    <div className="space-y-6">
      {/* Overall stats */}
      <div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          Certificate Wall Overview
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Manage featured certificates on the public Certificate Wall.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <Card
            data-ocid="admin.cert_wall.total_card"
            className="p-4 bg-card border-border"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Total Issued
            </div>
            <div className="font-display font-bold text-2xl text-foreground">
              {totalCerts}
            </div>
          </Card>
          <Card
            data-ocid="admin.cert_wall.featured_card"
            className="p-4 bg-card border-border"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Featured
            </div>
            <div className="font-display font-bold text-2xl text-foreground">
              {featured.length}
            </div>
          </Card>
          <Card
            data-ocid="admin.cert_wall.tiers_card"
            className="p-4 bg-card border-border"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Tiers Active
            </div>
            <div className="font-display font-bold text-2xl text-foreground">
              {tierCounts.length}
            </div>
          </Card>
        </div>

        {/* Tier breakdown */}
        {tierCounts.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Certificates by Tier
            </p>
            <TierBreakdownBar certsByTier={tierCounts} total={totalCerts} />
          </div>
        )}
      </div>

      {/* Featured certificates */}
      <div>
        <h4 className="font-display font-semibold text-foreground text-sm mb-3">
          Featured Graduates
        </h4>
        {featuredLoading ? (
          <div
            data-ocid="admin.cert_wall.loading_state"
            className="flex flex-col gap-3"
          >
            {["f1", "f2", "f3"].map((k) => (
              <Skeleton key={k} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            data-ocid="admin.cert_wall.empty_state"
            className="bg-card border border-border rounded-xl p-8 text-center"
          >
            <Star className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              No featured certificates. Use the Certificates tab to star any
              certificate and feature it on the wall.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {featured.map((cert, idx) => {
              const date = new Date(
                Number(cert.issuedAt) / 1_000_000,
              ).toLocaleDateString();
              return (
                <div
                  key={cert.certId}
                  data-ocid={`admin.cert_wall.item.${idx + 1}`}
                  className="bg-card border border-[oklch(0.7_0.18_70/0.3)] rounded-xl px-5 py-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Star className="w-4 h-4 text-[oklch(0.7_0.18_70)] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {cert.certInfo.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="certificate-id text-xs">
                          {cert.certId}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${getTierClass(cert.tierName)}`}
                        >
                          {cert.tierName}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`admin.cert_wall.unfeature_button.${idx + 1}`}
                    className="h-8 text-xs gap-1.5 text-muted-foreground shrink-0"
                    disabled={featureMutation.isPending}
                    onClick={() =>
                      featureMutation.mutate({
                        certId: cert.certId,
                        featured: false,
                      })
                    }
                  >
                    <StarOff className="w-3.5 h-3.5" /> Unfeature
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature new certificate */}
      <div>
        <h4 className="font-display font-semibold text-foreground text-sm mb-3">
          Feature a Certificate
        </h4>
        <p className="text-xs text-muted-foreground mb-3">
          You can also feature certificates directly from the Certificates tab
          by clicking the ⭐ icon on any row.
        </p>
        <div className="bg-muted/20 border border-border rounded-xl p-4 flex items-center gap-3">
          <Star className="w-4 h-4 text-[oklch(0.7_0.18_70)] shrink-0" />
          <p className="text-sm text-muted-foreground">
            To feature a certificate, go to the{" "}
            <span className="text-foreground font-medium">
              Certificates tab
            </span>
            , find the certificate, and click the ⭐ star icon. It will appear
            on the public Certificate Wall and in this list.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Manual Issue Certificate Form ───────────────────────────────────────────

function ManualIssueCertForm({
  onSuccess,
}: { onSuccess: (certId: string) => void }) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState("beginner");
  const [form, setForm] = useState<CertificateInfo>({
    fullName: "",
    fathersName: "",
    country: "",
    dateOfBirth: "",
    email: "",
    city: "",
  });
  const [successCertId, setSuccessCertId] = useState<string | null>(null);

  const issueMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminManualIssueCertificate(tier, form);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (cert) => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      setSuccessCertId(cert.certId);
      onSuccess(cert.certId);
      setForm({
        fullName: "",
        fathersName: "",
        country: "",
        dateOfBirth: "",
        email: "",
        city: "",
      });
    },
  });

  function update(field: keyof CertificateInfo, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const allFilled = Object.values(form).every((v) => v.trim());

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      <button
        type="button"
        data-ocid="admin.manual_issue.toggle_button"
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors"
        onClick={() => {
          setOpen((o) => !o);
          setSuccessCertId(null);
        }}
      >
        <div className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-primary" />
          <span className="font-display font-semibold text-foreground text-sm">
            Manually Issue Certificate
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border space-y-4 pt-4">
          {successCertId && (
            <div
              className="bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-lg p-3"
              data-ocid="admin.manual_issue.success_state"
            >
              <p className="text-sm text-[oklch(0.65_0.15_130)] font-medium">
                Certificate issued! ID:{" "}
                <span className="certificate-id">{successCertId}</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tier</Label>
              <select
                data-ocid="admin.manual_issue.tier_select"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full h-9 text-sm rounded-md border border-input bg-secondary text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            {(
              [
                { field: "fullName", label: "Full Name" },
                { field: "fathersName", label: "Father's Name" },
                { field: "country", label: "Country" },
                { field: "city", label: "City" },
                { field: "dateOfBirth", label: "Date of Birth" },
                { field: "email", label: "Email" },
              ] as { field: keyof CertificateInfo; label: string }[]
            ).map(({ field, label }) => (
              <div key={field} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <Input
                  data-ocid={`admin.manual_issue.${field}_input`}
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={label}
                  className="bg-secondary border-input text-sm h-9"
                />
              </div>
            ))}
          </div>

          {issueMutation.error && (
            <p
              className="text-xs text-destructive bg-destructive/10 rounded p-2"
              data-ocid="admin.manual_issue.error_state"
            >
              {String(issueMutation.error)}
            </p>
          )}

          <Button
            data-ocid="admin.manual_issue.submit_button"
            className="btn-primary gap-1.5 text-sm h-9"
            disabled={!allFilled || issueMutation.isPending}
            onClick={() => issueMutation.mutate()}
          >
            <Award className="w-4 h-4" />
            {issueMutation.isPending ? "Issuing…" : "Issue Certificate"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Certificates Tab ─────────────────────────────────────────────────────────

function CertificatesTab() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [validityFilter, setValidityFilter] = useState<ValidityFilter>("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [lastIssuedId, setLastIssuedId] = useState<string | null>(null);

  const { data: certificates = [], isLoading } = useAdminCertificates();

  const deleteMutation = useMutation({
    mutationFn: async (certId: string) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminRevokeOrReinstateCertificate(certId, false);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setDeleteConfirm(null);
      setExpandedRow(null);
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async ({
      certId,
      makeValid,
    }: { certId: string; makeValid: boolean }) => {
      if (!actor) throw new Error("No actor");
      const result = await actor.adminRevokeOrReinstateCertificate(
        certId,
        makeValid,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({ queryKey: ["certificates"] });
    },
  });

  const featureMutation = useMutation({
    mutationFn: async ({
      certId,
      featured,
    }: { certId: string; featured: boolean }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.adminFeatureCertificate(certId, featured);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
      void queryClient.invalidateQueries({
        queryKey: ["featuredCertificates"],
      });
    },
  });

  function exportCSV() {
    if (certificates.length === 0) return;
    const headers = [
      "Cert ID",
      "Full Name",
      "Fathers Name",
      "Country",
      "City",
      "DOB",
      "Email",
      "Tier",
      "Score",
      "Total Questions",
      "Date Issued",
      "Valid",
      "Featured",
    ];
    const rows = certificates.map((c) => {
      const date = new Date(Number(c.issuedAt) / 1_000_000).toLocaleDateString(
        "en-US",
      );
      return [
        c.certId,
        c.certInfo.fullName,
        c.certInfo.fathersName,
        c.certInfo.country,
        c.certInfo.city,
        c.certInfo.dateOfBirth,
        c.certInfo.email,
        c.tierName,
        String(Number(c.score)),
        String(Number(c.totalQuestions)),
        date,
        c.isValid ? "Yes" : "No",
        c.featured ? "Yes" : "No",
      ]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demonzeno-certificates-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let base = certificates;
    if (validityFilter === "valid") base = base.filter((c) => c.isValid);
    if (validityFilter === "revoked") base = base.filter((c) => !c.isValid);
    if (tierFilter !== "all")
      base = base.filter((c) => c.tierName.toLowerCase() === tierFilter);
    if (q) {
      base = base.filter(
        (c) =>
          c.certId.toLowerCase().includes(q) ||
          c.certInfo.fullName.toLowerCase().includes(q) ||
          c.certInfo.country.toLowerCase().includes(q) ||
          c.tierName.toLowerCase().includes(q),
      );
    }
    return sortCerts(base, sortKey);
  }, [certificates, search, sortKey, validityFilter, tierFilter]);

  return (
    <>
      {/* Manual Issue form */}
      <ManualIssueCertForm onSuccess={setLastIssuedId} />

      {lastIssuedId && (
        <div className="mb-4 bg-[oklch(0.65_0.15_130/0.1)] border border-[oklch(0.65_0.15_130/0.3)] rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-[oklch(0.65_0.15_130)]">
            Last issued:{" "}
            <span className="certificate-id font-semibold">{lastIssuedId}</span>
          </p>
          <button
            type="button"
            onClick={() => setLastIssuedId(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table panel */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 md:px-6 py-4 border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary shrink-0" />
              <h2 className="font-display font-semibold text-foreground text-sm">
                All Issued Certificates
                <span className="text-xs text-muted-foreground font-normal ml-1.5">
                  ({certificates.length} total
                  {filtered.length !== certificates.length
                    ? `, ${filtered.length} shown`
                    : ""}
                  )
                </span>
              </h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              data-ocid="admin.cert.export_button"
              className="h-8 gap-1.5 text-xs shrink-0"
              onClick={exportCSV}
              disabled={certificates.length === 0}
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Validity filter */}
            <div className="flex rounded-md border border-input overflow-hidden h-8">
              {(["all", "valid", "revoked"] as ValidityFilter[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  data-ocid={`admin.cert.validity_filter.${v}`}
                  className={`px-2.5 text-xs font-medium transition-colors ${
                    validityFilter === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setValidityFilter(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Tier filter */}
            <select
              data-ocid="admin.cert.tier_filter"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Tiers</option>
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              data-ocid="admin.cert.sort_select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="h-8 text-xs rounded-md border border-input bg-secondary text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="date">Sort: Newest</option>
              <option value="tier">Sort: Tier</option>
              <option value="name">Sort: Name</option>
            </select>

            {/* Search */}
            <div className="relative flex-1 min-w-[160px] sm:min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                data-ocid="admin.cert.search_input"
                placeholder="Search ID, name, country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-secondary border-input"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div
              data-ocid="admin.cert.loading_state"
              className="p-8 flex flex-col gap-3"
            >
              {["t1", "t2", "t3", "t4"].map((sk) => (
                <Skeleton key={sk} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="admin.cert.empty_state"
              className="p-12 text-center"
            >
              <Award className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                {search || validityFilter !== "all" || tierFilter !== "all"
                  ? "No certificates match your filters."
                  : "No certificates have been issued yet."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {[
                    "Cert ID",
                    "Full Name",
                    "Father's Name",
                    "Country",
                    "Tier",
                    "Date Issued",
                    "Score",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap${
                        i === 2 ? " hidden md:table-cell" : ""
                      }${i === 3 ? " hidden lg:table-cell" : ""}${
                        i === 4 ? " hidden sm:table-cell" : ""
                      }${i === 5 ? " hidden md:table-cell" : ""}${
                        i === 6 ? " hidden lg:table-cell text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert, idx) => (
                  <CertRow
                    key={cert.certId}
                    cert={cert}
                    index={idx + 1}
                    onView={setViewingCert}
                    onDelete={setDeleteConfirm}
                    onRevoke={(id, makeValid) =>
                      revokeMutation.mutate({ certId: id, makeValid })
                    }
                    onFeature={(id, featured) =>
                      featureMutation.mutate({ certId: id, featured })
                    }
                    expanded={expandedRow === cert.certId}
                    onToggle={() =>
                      setExpandedRow(
                        expandedRow === cert.certId ? null : cert.certId,
                      )
                    }
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {viewingCert && (
        <CertDetailModal
          cert={viewingCert}
          onClose={() => setViewingCert(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card
            data-ocid="admin.delete_confirm.dialog"
            className="bg-card border-destructive/30 max-w-sm w-full p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              <h3 className="font-display font-bold">Delete Certificate?</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This will permanently delete certificate{" "}
              <span className="certificate-id">{deleteConfirm}</span>. This
              action cannot be undone and will remove the record globally.
            </p>
            {deleteMutation.error && (
              <p
                className="text-xs text-destructive bg-destructive/10 rounded p-2"
                data-ocid="admin.delete_confirm.error_state"
              >
                {String(deleteMutation.error)}
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                data-ocid="admin.delete_confirm.cancel_button"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                data-ocid="admin.delete_confirm.confirm_button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteConfirm)}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

export function AdminDashboard() {
  const { isAdminUnlocked, lockAdmin } = useSession();
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useAdminStatsLocal();
  const { data: certificates = [] } = useAdminCertificates();
  const [activeTab, setActiveTab] = useState<AdminTab>("certificates");

  const uniqueCountries = useMemo(
    () => new Set(certificates.map((c) => c.certInfo.country)).size,
    [certificates],
  );

  if (!isAdminUnlocked) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Header ── */}
      <div className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="font-display font-bold text-foreground text-sm">
                Admin Dashboard
              </span>
              <span className="hidden md:inline text-muted-foreground text-xs ml-2">
                — DemonZeno Trading Academy
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs border-primary/30 text-primary bg-primary/5 shrink-0"
            >
              Session-Local
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              data-ocid="admin.refresh.button"
              className="h-8 w-8 p-0"
              aria-label="Refresh data"
              onClick={() =>
                void queryClient.invalidateQueries({ queryKey: ["admin"] })
              }
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              asChild
              data-ocid="admin.home.link"
              className="h-8 px-2 gap-1 text-muted-foreground"
            >
              <Link to="/">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">Home</span>
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              data-ocid="admin.lock.button"
              className="h-8 gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 text-xs"
              onClick={lockAdmin}
            >
              <Lock className="w-3.5 h-3.5" /> Lock Admin
            </Button>
          </div>
        </div>

        {/* Session notice */}
        <div className="border-t border-border/50 bg-muted/20 px-4 py-1.5 text-center">
          <p className="text-xs text-muted-foreground">
            Session-local: Admin access is active only in this browser session.
            Certificate data is global — showing certificates from all devices.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsLoading ? (
            ["s1", "s2", "s3", "s4"].map((sk) => (
              <Card key={sk} className="p-4 md:p-5 bg-card border-border">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))
          ) : (
            <>
              <StatCard
                ocid="admin.total_certs.card"
                icon={<Award className="w-4 h-4 text-primary" />}
                label="Total Certificates"
                value={stats ? Number(stats.totalCertificates).toString() : "—"}
                sub={
                  stats && stats.certsByTier.length > 0 ? (
                    <TierBreakdownBar
                      certsByTier={stats.certsByTier}
                      total={Number(stats.totalCertificates)}
                    />
                  ) : undefined
                }
              />
              <StatCard
                ocid="admin.countries.card"
                icon={<Globe className="w-4 h-4 text-primary" />}
                label="Countries"
                value={String(uniqueCountries)}
                sub={
                  <p className="text-xs text-muted-foreground mt-1">
                    Unique countries represented
                  </p>
                }
              />
              <StatCard
                ocid="admin.tiers.card"
                icon={<BarChart3 className="w-4 h-4 text-primary" />}
                label="Tiers Active"
                value={stats ? String(stats.certsByTier.length) : "—"}
                sub={
                  <p className="text-xs text-muted-foreground mt-1">
                    Tiers with issued certificates
                  </p>
                }
              />
              <StatCard
                ocid="admin.access.card"
                icon={<Shield className="w-4 h-4 text-primary" />}
                label="Access Level"
                value="Admin"
                sub={
                  <p className="text-xs text-muted-foreground mt-1">
                    Full certificate management
                  </p>
                }
              />
            </>
          )}
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex overflow-x-auto border-b border-border mb-6 gap-0.5 scrollbar-hide">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`admin.tab.${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "certificates" && <CertificatesTab />}
        {activeTab === "quiz-stats" && <QuizStatsTab />}
        {activeTab === "lesson-analytics" && <LessonAnalyticsTab />}
        {activeTab === "engagement-heatmap" && <EngagementHeatmapTab />}
        {activeTab === "lesson-of-week" && <LessonOfWeekTab />}
        {activeTab === "ab-testing" && <ABTestingTab />}
        {activeTab === "academy-settings" && <AcademySettingsTab />}
        {activeTab === "stats-overview" && <StatsOverviewTab />}
        {activeTab === "cert-wall" && <CertWallAdminTab />}
      </div>
    </div>
  );
}
