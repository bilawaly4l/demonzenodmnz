import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Ban,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Code2,
  Download,
  Edit2,
  FileText,
  FileUp,
  Flame,
  Globe,
  HelpCircle,
  LogOut,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Star,
  TestTube2,
  Trash2,
  TrendingUp,
  Users,
  WrenchIcon,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { createActor } from "../backend";
import {
  AnnouncementCategory as AnnCatEnum,
  Confidence as ConfEnum,
  Direction as DirEnum,
  FaqCategory as FaqCatEnum,
  MarketType as MktEnum,
  SentimentLevel as SentEnum,
  Timeframe as TfEnum,
} from "../backend";
import type { SignalInput } from "../backend.d";
import {
  AdminSignalForm,
  type SignalFormState,
  emptySignalForm,
} from "../components/AdminSignalForm";
import { useSession } from "../contexts/SessionContext";
import {
  useAbTests,
  useActivityHeatmap,
  useAdminRole,
  useAuditSnapshots,
  useBurnSchedule,
  useCommunityMilestones,
  useCommunityQuotes,
  useCommunityTestimonials,
  useMaintenanceMode,
  useMarketMoodBanner,
  usePushNotifications,
  useScheduledSignalsEnhanced,
  useSignalOfWeekAdmin,
  useSignalPerformanceStats,
  useSignalTemplates,
  useTopTraders,
  useWhitepaper,
} from "../hooks/useAdminEnhancements";
import { useAnalytics } from "../hooks/useAnalytics";
// import { useAnnouncement } from "../hooks/useAnnouncement"; // replaced by direct actor.getAnnouncements()
import { useAuditLog } from "../hooks/useAuditLog";
import { useBinanceFeed } from "../hooks/useBinanceFeed";
import { useFaqs } from "../hooks/useFaqs";
import { useSignals } from "../hooks/useSignals";
import { useStats } from "../hooks/useStats";
import type {
  Announcement,
  AssetSentiment,
  BinancePost,
  BurnScheduleEntry,
  CommunityMilestone,
  DemonZenoQuote,
  Direction,
  FAQ,
  MarketSentiment,
  MarketType,
  NotifyMe,
  ResultStatus,
  SentimentLevel,
  Signal,
  SignalOfWeekFull,
  SignalTemplate,
  StatsConfig,
  Testimonial,
  Timeframe,
  TopTrader,
  WhitepaperContent,
  WhitepaperSection,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────
function datetimeLocalToBigInt(value: string): bigint | null {
  if (!value) return null;
  return BigInt(new Date(value).getTime()) * 1_000_000n;
}

function bigIntToDatetimeLocal(ns: bigint | undefined): string {
  if (!ns) return "";
  const ms = Number(ns / 1_000_000n);
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function signalToForm(s: Signal): SignalFormState {
  return {
    asset: s.asset,
    marketType: s.marketType,
    direction: s.direction,
    entryPrice: s.entryPrice,
    tp1: s.tp1 ?? "",
    tp2: s.tp2 ?? "",
    tp3: s.tp3 ?? "",
    targetPrice: s.targetPrice,
    stopLoss: s.stopLoss,
    notes: s.notes,
    confidence: s.confidence,
    sourceLabel: s.sourceLabel,
    providerLabel: s.providerLabel ?? "",
    timeframe: s.timeframe,
    isDraft: s.isDraft,
    publishAt: bigIntToDatetimeLocal(s.publishAt),
    expiry: bigIntToDatetimeLocal(s.expiry),
    tags: s.tags ?? [],
  };
}

const PIE_COLORS = [
  "#38bdf8",
  "#2dd4bf",
  "#f43f5e",
  "#a78bfa",
  "#fb923c",
  "#34d399",
];

const SENTIMENT_ASSETS = ["BTC", "ETH", "BNB", "SOL", "XRP", "DOGE"];

// ─── Signals Tab ──────────────────────────────────────────────────────────
function SignalsTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const { data: signals = [], isLoading } = useSignals();
  const { data: templates = [] } = useSignalTemplates(sessionToken);
  const [editing, setEditing] = useState<Signal | null>(null);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState<SignalFormState>(emptySignalForm);
  const [showImport, setShowImport] = useState(false);

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setForm(emptySignalForm);
  }

  function startEdit(s: Signal) {
    setEditing(s);
    setForm(signalToForm(s));
    setAdding(false);
  }

  function cancelForm() {
    setAdding(false);
    setEditing(null);
    setForm(emptySignalForm);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    const r = await actor.addSignal(
      sessionToken,
      form.asset,
      form.marketType,
      form.direction,
      form.entryPrice,
      form.targetPrice,
      form.stopLoss,
      form.tp1,
      form.tp2,
      form.tp3,
      form.notes,
      form.confidence,
      form.sourceLabel,
      form.providerLabel,
      datetimeLocalToBigInt(form.expiry),
      form.timeframe,
      form.isDraft,
      datetimeLocalToBigInt(form.publishAt),
      null,
      form.tags,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Signal added successfully");
      qc.invalidateQueries({ queryKey: ["signals"] });
      qc.invalidateQueries({ queryKey: ["scheduledSignals"] });
      cancelForm();
    } else {
      toast.error(r.err);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !editing) return;
    setSaving(true);
    const r = await actor.updateSignal(
      sessionToken,
      editing.id,
      form.asset,
      form.marketType,
      form.direction,
      form.entryPrice,
      form.targetPrice,
      form.stopLoss,
      form.tp1,
      form.tp2,
      form.tp3,
      form.notes,
      form.confidence,
      form.sourceLabel,
      form.providerLabel,
      datetimeLocalToBigInt(form.expiry),
      form.timeframe,
      form.isDraft,
      datetimeLocalToBigInt(form.publishAt),
      null,
      form.tags,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Signal updated");
      qc.invalidateQueries({ queryKey: ["signals"] });
      qc.invalidateQueries({ queryKey: ["scheduledSignals"] });
      setEditing(null);
    } else {
      toast.error(r.err);
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    const r = await actor.deleteSignal(sessionToken, id);
    if (r.__kind__ === "ok") {
      toast.success("Signal deleted");
      qc.invalidateQueries({ queryKey: ["signals"] });
      qc.invalidateQueries({ queryKey: ["scheduledSignals"] });
    } else {
      toast.error(r.err);
    }
    setConfirmDelete(null);
  }

  async function handleUpdateResult(id: string, result: ResultStatus) {
    if (!actor) return;
    const r = await actor.updateSignalResult(sessionToken, id, result);
    if (r.__kind__ === "ok") {
      toast.success("Result updated");
      qc.invalidateQueries({ queryKey: ["signals"] });
    } else {
      toast.error(r.err);
    }
  }

  return (
    <div className="flex flex-col gap-5" data-ocid="admin.signals.panel">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Signals
          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {signals.length}
          </span>
        </h3>
        {!adding && !editing && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowImport(true)}
              data-ocid="signals.import.button"
            >
              <FileUp className="w-4 h-4 mr-1" /> Import CSV
            </Button>
            <Button
              onClick={startAdd}
              className="btn-primary"
              size="sm"
              data-ocid="signals.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Signal
            </Button>
          </div>
        )}
      </div>

      {adding && (
        <AdminSignalForm
          form={form}
          onChange={setForm}
          onSubmit={handleAdd}
          onCancel={cancelForm}
          submitLabel="Add Signal"
          saving={saving}
          templates={templates as SignalTemplate[]}
        />
      )}

      {showImport && (
        <CsvImportPanel
          sessionToken={sessionToken}
          onClose={() => setShowImport(false)}
          onImported={() => {
            setShowImport(false);
            qc.invalidateQueries({ queryKey: ["signals"] });
            qc.invalidateQueries({ queryKey: ["scheduledSignals"] });
          }}
        />
      )}

      {isLoading ? (
        <div data-ocid="signals.loading_state" className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : signals.length === 0 && !adding ? (
        <div
          data-ocid="signals.admin.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <TrendingUp className="w-10 h-10 opacity-20" />
          <p className="font-medium">No signals posted yet.</p>
          <p className="text-sm opacity-70">Add your first signal above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {signals.map((s, i) => (
            <Card
              key={s.id}
              data-ocid={`signals.admin.item.${i + 1}`}
              className="bg-card border-border p-4 flex flex-col gap-3"
            >
              {editing?.id === s.id ? (
                <AdminSignalForm
                  form={form}
                  onChange={setForm}
                  onSubmit={handleUpdate}
                  onCancel={cancelForm}
                  submitLabel="Save Changes"
                  saving={saving}
                  templates={templates as SignalTemplate[]}
                />
              ) : confirmDelete === s.id ? (
                <div className="flex items-center justify-between gap-3 flex-wrap bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    Delete <strong>{s.asset}</strong>? This cannot be undone.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(null)}
                      data-ocid={`signals.delete.cancel_button.${i + 1}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(s.id)}
                      data-ocid={`signals.delete.confirm_button.${i + 1}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {s.isDraft && (
                      <Badge
                        variant="outline"
                        className="text-xs border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                      >
                        Draft
                      </Badge>
                    )}
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground shrink-0">
                      {s.marketType}
                    </span>
                    <span className="font-display font-bold text-foreground truncate">
                      {s.asset}
                    </span>
                    <span
                      className={
                        s.direction === "Buy" ? "badge-success" : "badge-danger"
                      }
                    >
                      {s.direction.toUpperCase()}
                    </span>
                    <span
                      className={
                        s.result === "Win"
                          ? "badge-success"
                          : s.result === "Loss"
                            ? "badge-danger"
                            : "badge-info"
                      }
                    >
                      {s.result}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                      {s.timeframe} · {s.confidence}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <Select
                      value={s.result}
                      onValueChange={(v) =>
                        handleUpdateResult(s.id, v as ResultStatus)
                      }
                    >
                      <SelectTrigger
                        className="h-8 w-28 text-xs"
                        data-ocid={`signals.result.select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Win">Win</SelectItem>
                        <SelectItem value="Loss">Loss</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(s)}
                      data-ocid={`signals.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDelete(s.id)}
                      data-ocid={`signals.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CSV Import Panel ─────────────────────────────────────────────────────
interface ParsedRow {
  asset: string;
  marketType: string;
  direction: string;
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  notes: string;
  confidence: string;
  sourceLabel: string;
  timeframe: string;
}

const CSV_COLUMNS = [
  "asset",
  "marketType",
  "direction",
  "entryPrice",
  "targetPrice",
  "stopLoss",
  "notes",
  "confidence",
  "sourceLabel",
  "timeframe",
] as const;

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let field = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQuote && line[i + 1] === '"') {
        field += '"';
        i++;
      } else inQuote = !inQuote;
    } else if (line[i] === "," && !inQuote) {
      result.push(field.trim());
      field = "";
    } else {
      field += line[i];
    }
  }
  result.push(field.trim());
  return result;
}

function CsvImportPanel({
  sessionToken,
  onClose,
  onImported,
}: {
  sessionToken: string;
  onClose: () => void;
  onImported: () => void;
}) {
  const { actor } = useActor(createActor);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setRows([]);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) {
        setError("CSV must have a header row and at least one data row.");
        return;
      }
      const headers = parseCsvRow(lines[0]).map((h) =>
        h.toLowerCase().replace(/\s+/g, ""),
      );
      const parsed: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = parseCsvRow(lines[i]);
        const row: Partial<ParsedRow> = {};
        headers.forEach((h, idx) => {
          if (CSV_COLUMNS.includes(h as (typeof CSV_COLUMNS)[number])) {
            (row as Record<string, string>)[h] = vals[idx] ?? "";
          }
        });
        if (!row.asset) {
          setError(`Row ${i + 1}: missing 'asset' column.`);
          return;
        }
        parsed.push({
          asset: row.asset ?? "",
          marketType: row.marketType ?? "Crypto",
          direction: row.direction ?? "Buy",
          entryPrice: row.entryPrice ?? "",
          targetPrice: row.targetPrice ?? "",
          stopLoss: row.stopLoss ?? "",
          notes: row.notes ?? "",
          confidence: row.confidence ?? "Medium",
          sourceLabel: row.sourceLabel ?? "",
          timeframe: row.timeframe ?? "Swing",
        });
      }
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!actor || rows.length === 0) return;
    setImporting(true);
    const inputs: SignalInput[] = rows.map((r) => ({
      asset: r.asset,
      marketType: (r.marketType as MarketType) || MktEnum.Crypto,
      direction: (r.direction as Direction) || DirEnum.Buy,
      entryPrice: r.entryPrice,
      targetPrice: r.targetPrice,
      stopLoss: r.stopLoss,
      tp1: r.targetPrice,
      tp2: "",
      tp3: "",
      notes: r.notes,
      confidence:
        (r.confidence as (typeof ConfEnum)[keyof typeof ConfEnum]) ||
        ConfEnum.Medium,
      sourceLabel: r.sourceLabel,
      providerLabel: "",
      timeframe: (r.timeframe as Timeframe) || TfEnum.Swing,
      isDraft: false,
      publishAt: undefined,
      expiry: undefined,
      tags: [],
    }));
    const result = await actor.importSignals(sessionToken, inputs);
    setImporting(false);
    if (result.__kind__ === "ok") {
      toast.success(`Imported ${result.ok.length} signal(s) successfully`);
      onImported();
    } else {
      toast.error(result.err);
    }
  }

  return (
    <div
      className="bg-muted/30 border border-border rounded-xl p-5 flex flex-col gap-4"
      data-ocid="signals.csv_import.panel"
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold text-foreground text-sm">
          Import Signals via CSV
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          data-ocid="signals.csv_import.close_button"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Required columns:{" "}
        <code className="bg-muted px-1 rounded">
          asset, marketType, direction, entryPrice, targetPrice, stopLoss
        </code>
        . Optional:{" "}
        <code className="bg-muted px-1 rounded">
          notes, confidence, sourceLabel, timeframe
        </code>
      </p>
      <Input
        ref={fileRef}
        type="file"
        accept=".csv"
        onChange={handleFile}
        data-ocid="signals.csv_import.upload_button"
        className="file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-xs cursor-pointer"
      />
      {error && (
        <p
          className="text-destructive text-sm"
          data-ocid="signals.csv_import.error_state"
        >
          {error}
        </p>
      )}
      {rows.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-lg border border-border max-h-56 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  {[
                    "#",
                    "Asset",
                    "Market",
                    "Dir",
                    "Entry",
                    "Target",
                    "SL",
                    "TF",
                    "Conf",
                    "Source",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-muted-foreground font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={`${r.asset}-${i}`}
                    data-ocid={`signals.csv_preview.item.${i + 1}`}
                    className="border-t border-border"
                  >
                    <td className="px-3 py-1.5 text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="px-3 py-1.5 font-mono font-semibold text-foreground">
                      {r.asset}
                    </td>
                    <td className="px-3 py-1.5 text-muted-foreground">
                      {r.marketType}
                    </td>
                    <td className="px-3 py-1.5">{r.direction}</td>
                    <td className="px-3 py-1.5">{r.entryPrice}</td>
                    <td className="px-3 py-1.5">{r.targetPrice}</td>
                    <td className="px-3 py-1.5">{r.stopLoss}</td>
                    <td className="px-3 py-1.5">{r.timeframe}</td>
                    <td className="px-3 py-1.5">{r.confidence}</td>
                    <td className="px-3 py-1.5">{r.sourceLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {rows.length} row(s) ready to import
            </p>
            <Button
              onClick={handleImport}
              disabled={importing}
              className="btn-primary"
              size="sm"
              data-ocid="signals.csv_import.submit_button"
            >
              {importing ? "Importing…" : `Import ${rows.length} Signal(s)`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Scheduling Tab ────────────────────────────────────────────────────────
function SchedulingTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [scheduled, setScheduled] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkPublishing, setBulkPublishing] = useState(false);
  const [localSchedules, setLocalSchedules] = useState<
    Record<string, { isDraft: boolean; publishAt: string }>
  >({});

  const load = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    const r = await actor.getScheduledSignals(sessionToken);
    setLoading(false);
    if (r.__kind__ === "ok") {
      setScheduled(r.ok);
      const init: Record<string, { isDraft: boolean; publishAt: string }> = {};
      for (const s of r.ok) {
        init[s.id] = {
          isDraft: s.isDraft,
          publishAt: bigIntToDatetimeLocal(s.publishAt),
        };
      }
      setLocalSchedules(init);
      setLoaded(true);
    } else {
      toast.error(r.err);
    }
  }, [actor, sessionToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdateSchedule(signalId: string) {
    if (!actor) return;
    const local = localSchedules[signalId];
    if (!local) return;
    setUpdatingId(signalId);
    const r = await actor.updateSignalSchedule(
      sessionToken,
      signalId,
      local.isDraft,
      datetimeLocalToBigInt(local.publishAt),
    );
    setUpdatingId(null);
    if (r.__kind__ === "ok") {
      toast.success("Schedule updated");
      qc.invalidateQueries({ queryKey: ["signals"] });
      load();
    } else {
      toast.error(r.err);
    }
  }

  async function bulkPublishNow() {
    if (!actor) return;
    const drafts = scheduled.filter((s) => s.isDraft);
    if (drafts.length === 0) {
      toast.info("No drafts to publish.");
      return;
    }
    setBulkPublishing(true);
    const results = await Promise.all(
      drafts.map((s) =>
        actor.updateSignalSchedule(sessionToken, s.id, false, null),
      ),
    );
    setBulkPublishing(false);
    const failed = results.filter((r) => r.__kind__ === "err").length;
    if (failed > 0) toast.error(`${failed} update(s) failed.`);
    else toast.success(`Published ${drafts.length} signal(s)`);
    qc.invalidateQueries({ queryKey: ["signals"] });
    load();
  }

  const drafts = scheduled.filter((s) => s.isDraft);

  return (
    <div className="flex flex-col gap-5" data-ocid="admin.scheduling.panel">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" />
          Signal Scheduling
          {loaded && (
            <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={load}
            disabled={loading}
            data-ocid="scheduling.refresh.button"
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`}
            />{" "}
            Refresh
          </Button>
          {drafts.length > 0 && (
            <Button
              size="sm"
              className="btn-primary"
              onClick={bulkPublishNow}
              disabled={bulkPublishing}
              data-ocid="scheduling.bulk_publish.primary_button"
            >
              {bulkPublishing
                ? "Publishing…"
                : `Publish All (${drafts.length})`}
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          data-ocid="scheduling.loading_state"
          className="flex flex-col gap-3"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : !loaded ? (
        <div
          data-ocid="scheduling.empty_state"
          className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2"
        >
          <CalendarClock className="w-10 h-10 opacity-20" />
          <p className="font-medium">Loading scheduled signals…</p>
        </div>
      ) : scheduled.length === 0 ? (
        <div
          data-ocid="scheduling.empty_state"
          className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2"
        >
          <CalendarClock className="w-10 h-10 opacity-20" />
          <p className="font-medium">No scheduled or draft signals.</p>
          <p className="text-sm opacity-70">
            Create a signal with "Save as Draft" to manage it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {scheduled.map((s, i) => {
            const local = localSchedules[s.id] ?? {
              isDraft: s.isDraft,
              publishAt: bigIntToDatetimeLocal(s.publishAt),
            };
            return (
              <Card
                key={s.id}
                data-ocid={`scheduling.item.${i + 1}`}
                className="bg-card border-border p-4"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-foreground">
                        {s.asset}
                      </span>
                      <span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {s.marketType}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {s.timeframe}
                      </span>
                      {local.isDraft ? (
                        <Badge
                          variant="outline"
                          className="text-xs border-yellow-500/50 text-yellow-600 dark:text-yellow-400"
                        >
                          Draft
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/50 text-primary"
                        >
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap shrink-0">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!local.isDraft}
                        onCheckedChange={(v) =>
                          setLocalSchedules((prev) => ({
                            ...prev,
                            [s.id]: { ...prev[s.id], isDraft: !v },
                          }))
                        }
                        data-ocid={`scheduling.is_live.switch.${i + 1}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {local.isDraft ? "Draft" : "Live"}
                      </span>
                    </div>
                    <Input
                      type="datetime-local"
                      value={local.publishAt}
                      onChange={(e) =>
                        setLocalSchedules((prev) => ({
                          ...prev,
                          [s.id]: { ...prev[s.id], publishAt: e.target.value },
                        }))
                      }
                      className="h-8 text-xs w-44"
                      data-ocid={`scheduling.publish_at.input.${i + 1}`}
                    />
                    <Button
                      size="sm"
                      className="btn-primary"
                      onClick={() => handleUpdateSchedule(s.id)}
                      disabled={updatingId === s.id}
                      data-ocid={`scheduling.save.button.${i + 1}`}
                    >
                      {updatingId === s.id ? "…" : <Save className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────
function StatsTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const { data: stats } = useStats();
  const [config, setConfig] = useState<StatsConfig>({ useManual: false });
  const [configLoaded, setConfigLoaded] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadConfig() {
    if (!actor || configLoaded) return;
    setLoadingConfig(true);
    const r = await actor.getStatsConfig(sessionToken);
    setLoadingConfig(false);
    if (r.__kind__ === "ok") {
      setConfig(r.ok);
      setConfigLoaded(true);
    } else {
      toast.error(r.err);
    }
  }

  async function saveConfig() {
    if (!actor) return;
    setSaving(true);
    const r = await actor.setStatsConfig(sessionToken, config);
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Stats config saved");
      qc.invalidateQueries({ queryKey: ["stats"] });
    } else {
      toast.error(r.err);
    }
  }

  const defaultStats = {
    active: BigInt(0),
    wins: BigInt(0),
    losses: BigInt(0),
    winRate: 0,
    totalSignals: BigInt(0),
    assetsCovered: BigInt(0),
  };
  const ms = config.manualStats ?? defaultStats;
  const bigIntFields: Array<[string, keyof typeof defaultStats]> = [
    ["Total Signals", "totalSignals"],
    ["Wins", "wins"],
    ["Losses", "losses"],
    ["Active", "active"],
    ["Assets Covered", "assetsCovered"],
  ];

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.stats.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> Win Rate &amp; Stats
      </h3>
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">
          Auto-Calculated Stats
        </p>
        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              [
                ["Win Rate", `${stats.winRate.toFixed(1)}%`, true],
                ["Total", stats.totalSignals.toString(), false],
                ["Wins", stats.wins.toString(), false],
                ["Losses", stats.losses.toString(), false],
                ["Active", stats.active.toString(), false],
              ] as Array<[string, string, boolean]>
            ).map(([l, v, highlight]) => (
              <div
                key={l}
                className={`rounded-lg p-3 text-center ${highlight ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"}`}
              >
                <p
                  className={`font-bold text-lg font-mono ${highlight ? "text-primary" : "text-foreground"}`}
                >
                  {v}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        ) : (
          <div data-ocid="stats.loading_state" className="flex gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex-1 h-14 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
      {!configLoaded ? (
        <Button
          variant="outline"
          size="sm"
          onClick={loadConfig}
          disabled={loadingConfig || !actor}
          className="w-fit"
          data-ocid="stats.load.button"
        >
          {loadingConfig ? "Loading…" : "Load Manual Override Settings"}
        </Button>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Switch
              checked={config.useManual}
              onCheckedChange={(v) => setConfig({ ...config, useManual: v })}
              data-ocid="stats.use_manual.switch"
            />
            <div>
              <Label className="font-semibold text-foreground">
                Use Manual Stats Override
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                When enabled, the public site shows your manual numbers instead
                of calculated.
              </p>
            </div>
          </div>
          {config.useManual && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Win Rate (%)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={ms.winRate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      manualStats: {
                        ...ms,
                        winRate: Number.parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  data-ocid="stats.manual.winRate.input"
                />
              </div>
              {bigIntFields.map(([label, key]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    {label}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={ms[key].toString()}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        manualStats: {
                          ...ms,
                          [key]: BigInt(e.target.value || "0"),
                        },
                      })
                    }
                    data-ocid={`stats.manual.${key}.input`}
                  />
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={saveConfig}
            disabled={saving}
            className="btn-primary w-fit"
            data-ocid="stats.save.primary_button"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving…" : "Save Config"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────
function AnalyticsTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const { data: analytics, isLoading } = useAnalytics(sessionToken);
  const [exporting, setExporting] = useState(false);

  const marketData = (analytics?.signalsByMarket ?? []).map((m) => ({
    name: m.market,
    value: Number(m.count),
  }));

  const signupData = (analytics?.notifyMeByDate ?? []).map((d) => ({
    date: d.date,
    signups: Number(d.count),
  }));

  const totalNotifyMe = analytics ? Number(analytics.totalNotifyMe) : 0;

  async function handleExportCsv() {
    if (!actor) return;
    setExporting(true);
    const r = await actor.getAnalyticsCsv(sessionToken);
    setExporting(false);
    if (r.__kind__ === "ok") {
      const blob = new Blob([r.ok], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `demonzeno-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Analytics exported as CSV");
    } else {
      toast.error(r.err);
    }
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.analytics.panel">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Analytics
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCsv}
          disabled={exporting || !actor}
          data-ocid="analytics.export_csv.button"
        >
          <Download className="w-4 h-4 mr-1" />
          {exporting ? "Exporting…" : "Export as CSV"}
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="analytics.loading_state"
          className="flex flex-col gap-4"
        >
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-48 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Notify Me
              </p>
              <p className="font-bold text-3xl font-mono text-primary">
                {totalNotifyMe}
              </p>
              <p className="text-xs text-muted-foreground">
                subscribers waiting for launch
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Markets Covered
              </p>
              <p className="font-bold text-3xl font-mono text-foreground">
                {marketData.length}
              </p>
              <p className="text-xs text-muted-foreground">
                unique market types with signals
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Signals by Market
              </p>
              <p className="font-bold text-3xl font-mono text-foreground">
                {marketData.reduce((s, m) => s + m.value, 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                across all markets
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">
              Notify Me Signups Over Time
            </p>
            {signupData.length === 0 ? (
              <div
                data-ocid="analytics.signups.empty_state"
                className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2"
              >
                <Users className="w-8 h-8 opacity-20" />
                <p className="text-sm">No signup data yet.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={signupData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    itemStyle={{ color: "var(--primary)" }}
                  />
                  <Bar
                    dataKey="signups"
                    fill="oklch(0.65 0.15 190)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">
              Signal Count by Market
            </p>
            {marketData.length === 0 ? (
              <div
                data-ocid="analytics.market.empty_state"
                className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2"
              >
                <TrendingUp className="w-8 h-8 opacity-20" />
                <p className="text-sm">No signal data yet.</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={marketData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {marketData.map((entry, idx) => (
                        <Cell
                          key={entry.name}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                      itemStyle={{ color: "var(--foreground)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 shrink-0">
                  {marketData.map((m, idx) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{
                          backgroundColor: PIE_COLORS[idx % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-sm text-foreground">{m.name}</span>
                      <span className="text-sm font-mono text-muted-foreground ml-auto pl-4">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── FAQ Tab ──────────────────────────────────────────────────────────────
function FaqTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const { data: faqs = [], isLoading } = useFaqs();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: FaqCatEnum.Signals,
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const sorted = [...faqs].sort((a, b) => Number(a.order - b.order));

  function cancelForm() {
    setAdding(false);
    setEditing(null);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    const r = await actor.addFaq(
      sessionToken,
      form.question,
      form.answer,
      form.category,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("FAQ added");
      qc.invalidateQueries({ queryKey: ["faqs"] });
      setAdding(false);
      setForm({ question: "", answer: "", category: FaqCatEnum.Signals });
    } else {
      toast.error(r.err);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !editing) return;
    setSaving(true);
    const r = await actor.updateFaq(
      sessionToken,
      editing.id,
      form.question,
      form.answer,
      editing.category ?? FaqCatEnum.Signals,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("FAQ updated");
      qc.invalidateQueries({ queryKey: ["faqs"] });
      setEditing(null);
    } else {
      toast.error(r.err);
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    const r = await actor.deleteFaq(sessionToken, id);
    if (r.__kind__ === "ok") {
      toast.success("FAQ deleted");
      qc.invalidateQueries({ queryKey: ["faqs"] });
    } else {
      toast.error(r.err);
    }
    setConfirmDelete(null);
  }

  async function move(index: number, dir: -1 | 1) {
    if (!actor) return;
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((f) => f.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const r = await actor.reorderFaqs(sessionToken, ids);
    if (r.__kind__ === "ok") qc.invalidateQueries({ queryKey: ["faqs"] });
    else toast.error(r.err);
  }

  const FaqForm = ({
    onSubmit,
    submitLabel,
  }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 bg-muted/30 border border-border rounded-xl p-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Question *
        </Label>
        <Input
          required
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="What is DemonZeno?"
          data-ocid="faq.question.input"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Answer *
        </Label>
        <Textarea
          required
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          rows={4}
          placeholder="Answer…"
          data-ocid="faq.answer.textarea"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={cancelForm}
          data-ocid="faq.form.cancel_button"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="btn-primary"
          data-ocid="faq.form.submit_button"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-5" data-ocid="admin.faq.panel">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" /> FAQ
          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {faqs.length}
          </span>
        </h3>
        {!adding && !editing && (
          <Button
            size="sm"
            className="btn-primary"
            onClick={() => {
              setAdding(true);
              setEditing(null);
              setForm({
                question: "",
                answer: "",
                category: FaqCatEnum.Signals,
              });
            }}
            data-ocid="faq.add.primary_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add FAQ
          </Button>
        )}
      </div>
      {adding && <FaqForm onSubmit={handleAdd} submitLabel="Add FAQ" />}
      {isLoading ? (
        <div data-ocid="faq.loading_state" className="flex flex-col gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : sorted.length === 0 && !adding ? (
        <div
          data-ocid="faq.admin.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <HelpCircle className="w-10 h-10 opacity-20" />
          <p className="font-medium">No FAQ entries yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((faq, i) => (
            <Card
              key={faq.id}
              data-ocid={`faq.item.${i + 1}`}
              className="bg-card border-border p-4"
            >
              {editing?.id === faq.id ? (
                <FaqForm onSubmit={handleUpdate} submitLabel="Save Changes" />
              ) : confirmDelete === faq.id ? (
                <div className="flex items-center justify-between gap-3 flex-wrap bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    Delete this FAQ? This cannot be undone.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(null)}
                      data-ocid={`faq.delete.cancel_button.${i + 1}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(faq.id)}
                      data-ocid={`faq.delete.confirm_button.${i + 1}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors"
                      aria-label="Move up"
                      data-ocid={`faq.move_up.${i + 1}`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === sorted.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 transition-colors"
                      aria-label="Move down"
                      data-ocid={`faq.move_down.${i + 1}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {faq.question}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(faq);
                        setForm({
                          question: faq.question,
                          answer: faq.answer,
                          category: faq.category ?? FaqCatEnum.Signals,
                        });
                        setAdding(false);
                      }}
                      data-ocid={`faq.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDelete(faq.id)}
                      data-ocid={`faq.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Notify Me Tab ────────────────────────────────────────────────────────
function NotifyMeTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [entries, setEntries] = useState<NotifyMe[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bannedEmails, setBannedEmails] = useState<string[]>([]);
  const [banListLoaded, setBanListLoaded] = useState(false);
  const [banListLoading, setBanListLoading] = useState(false);
  const [banInput, setBanInput] = useState("");
  const [banning, setBanning] = useState(false);
  const [unbanningEmail, setUnbanningEmail] = useState<string | null>(null);

  async function load() {
    if (!actor || loaded) return;
    setLoading(true);
    const r = await actor.getNotifyMeList(sessionToken);
    setLoading(false);
    if (r.__kind__ === "ok") {
      setEntries(r.ok);
      setLoaded(true);
    } else {
      toast.error(r.err);
    }
  }

  async function loadBanList() {
    if (!actor || banListLoaded) return;
    setBanListLoading(true);
    const r = await actor.getBannedEmails(sessionToken);
    setBanListLoading(false);
    if (r.__kind__ === "ok") {
      setBannedEmails(r.ok);
      setBanListLoaded(true);
    } else {
      toast.error(r.err);
    }
  }

  async function handleBan(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !banInput.trim()) return;
    setBanning(true);
    const r = await actor.banEmail(sessionToken, banInput.trim());
    setBanning(false);
    if (r.__kind__ === "ok") {
      toast.success(`${banInput.trim()} blocked`);
      setBannedEmails((prev) => [...prev, banInput.trim()]);
      setBanInput("");
      qc.invalidateQueries({ queryKey: ["bannedEmails"] });
    } else {
      toast.error(r.err);
    }
  }

  async function handleUnban(email: string) {
    if (!actor) return;
    setUnbanningEmail(email);
    const r = await actor.unbanEmail(sessionToken, email);
    setUnbanningEmail(null);
    if (r.__kind__ === "ok") {
      toast.success(`${email} unblocked`);
      setBannedEmails((prev) => prev.filter((e) => e !== email));
      qc.invalidateQueries({ queryKey: ["bannedEmails"] });
    } else {
      toast.error(r.err);
    }
  }

  function exportCsv() {
    const header = "Name,Contact,Date Submitted\n";
    const rows = entries
      .map((e) => {
        const name = e.name ? `"${e.name.replace(/"/g, '""')}"` : "";
        const contact = `"${e.contact.replace(/"/g, '""')}"`;
        return `${name},${contact},${e.dateSubmitted}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demonzeno-notify-me-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.notify_me.panel">
      {/* Submissions section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Notify Me Submissions
            {loaded && (
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {entries.length}
              </span>
            )}
          </h3>
          <div className="flex gap-2">
            {!loaded && (
              <Button
                size="sm"
                variant="outline"
                onClick={load}
                disabled={loading || !actor}
                data-ocid="notify_me.load.button"
              >
                {loading ? "Loading…" : "Load Submissions"}
              </Button>
            )}
            {loaded && entries.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={exportCsv}
                data-ocid="notify_me.export.button"
              >
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            )}
          </div>
        </div>
        {!loaded ? (
          <div
            data-ocid="notify_me.empty_state"
            className="text-center text-muted-foreground py-10 flex flex-col items-center gap-3"
          >
            <Users className="w-10 h-10 opacity-20" />
            <p className="font-medium">
              Click "Load Submissions" to view entries.
            </p>
          </div>
        ) : entries.length === 0 ? (
          <div
            data-ocid="notify_me.empty_state"
            className="text-center text-muted-foreground py-10 flex flex-col items-center gap-3"
          >
            <Users className="w-10 h-10 opacity-20" />
            <p className="font-medium">No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["#", "Name", "Contact", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr
                    key={e.id}
                    data-ocid={`notify_me.item.${i + 1}`}
                    className="border-t border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {e.name ?? (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground text-xs">
                      {e.contact}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {e.dateSubmitted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ban list section */}
      <div className="flex flex-col gap-4 pt-2 border-t border-border">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
            <Ban className="w-4 h-4 text-destructive" /> Blocked Emails
            {banListLoaded && (
              <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {bannedEmails.length}
              </span>
            )}
          </h4>
          {!banListLoaded && (
            <Button
              size="sm"
              variant="outline"
              onClick={loadBanList}
              disabled={banListLoading || !actor}
              data-ocid="notify_me.ban_list.load.button"
            >
              {banListLoading ? "Loading…" : "Load Block List"}
            </Button>
          )}
        </div>

        {banListLoaded && (
          <>
            <form
              onSubmit={handleBan}
              className="flex gap-2"
              data-ocid="notify_me.ban.form"
            >
              <Input
                type="email"
                value={banInput}
                onChange={(e) => setBanInput(e.target.value)}
                placeholder="email@example.com"
                className="flex-1"
                data-ocid="notify_me.ban.input"
              />
              <Button
                type="submit"
                size="sm"
                variant="destructive"
                disabled={banning || !banInput.trim()}
                data-ocid="notify_me.ban.submit_button"
              >
                {banning ? "Blocking…" : "Block Email"}
              </Button>
            </form>

            {bannedEmails.length === 0 ? (
              <div
                data-ocid="notify_me.ban_list.empty_state"
                className="text-center text-muted-foreground py-6 flex flex-col items-center gap-2"
              >
                <Ban className="w-8 h-8 opacity-20" />
                <p className="text-sm">No blocked emails.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {bannedEmails.map((email, i) => (
                  <div
                    key={email}
                    data-ocid={`notify_me.ban_list.item.${i + 1}`}
                    className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-2.5"
                  >
                    <span className="font-mono text-sm text-foreground">
                      {email}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnban(email)}
                      disabled={unbanningEmail === email}
                      data-ocid={`notify_me.unban.button.${i + 1}`}
                      className="text-primary border-primary/30 hover:bg-primary/10 shrink-0"
                    >
                      {unbanningEmail === email ? "…" : "Unblock"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Announcements Tab ────────────────────────────────────────────────────
function AnnouncementsTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    link: "",
    category: AnnCatEnum.General,
    isPinned: false,
    publishAt: "",
  });

  const loadAnnouncements = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const list = await actor.getAnnouncements();
      setAnnouncements(list);
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  function cancelForm() {
    setAdding(false);
    setEditing(null);
    setForm({
      title: "",
      body: "",
      link: "",
      category: AnnCatEnum.General,
      isPinned: false,
      publishAt: "",
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    const r = await actor.addAnnouncement(
      sessionToken,
      form.title,
      form.body,
      form.category,
      form.link.trim() || null,
      form.isPinned,
      form.publishAt ? datetimeLocalToBigInt(form.publishAt) : null,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Announcement added");
      qc.invalidateQueries({ queryKey: ["announcements"] });
      loadAnnouncements();
      cancelForm();
    } else {
      toast.error(r.err);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !editing) return;
    setSaving(true);
    const r = await actor.updateAnnouncement(
      sessionToken,
      editing.id,
      form.title,
      form.body,
      form.category,
      form.link.trim() || null,
      form.isPinned,
      editing.isActive,
      form.publishAt ? datetimeLocalToBigInt(form.publishAt) : null,
    );
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Announcement updated");
      loadAnnouncements();
      cancelForm();
    } else {
      toast.error(r.err);
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    const r = await actor.deleteAnnouncement(sessionToken, id);
    if (r.__kind__ === "ok") {
      toast.success("Announcement deleted");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } else {
      toast.error(r.err);
    }
    setConfirmDelete(null);
  }

  async function handlePin(id: string, pin: boolean) {
    if (!actor) return;
    const r = await actor.pinAnnouncement(sessionToken, id, pin);
    if (r.__kind__ === "ok") {
      toast.success(pin ? "Pinned" : "Unpinned");
      loadAnnouncements();
    } else {
      toast.error(r.err);
    }
  }

  const AnnForm = ({
    onSubmit,
    label,
  }: { onSubmit: (e: React.FormEvent) => void; label: string }) => (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 bg-muted/30 border border-border rounded-xl p-5"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Title *
          </Label>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="New Signal Alert — April 2026"
            data-ocid="announcements.title.input"
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Body *
          </Label>
          <Textarea
            required
            rows={3}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="DMNZ launches April 2, 2028 — join the fair launch on Blum!"
            data-ocid="announcements.body.textarea"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Category
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) =>
              setForm({ ...form, category: v as typeof AnnCatEnum.General })
            }
          >
            <SelectTrigger data-ocid="announcements.category.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Token">Token</SelectItem>
              <SelectItem value="Signal">Signal</SelectItem>
              <SelectItem value="Alert">Alert</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Link (optional)
          </Label>
          <Input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://…"
            data-ocid="announcements.link.input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Publish At
          </Label>
          <Input
            type="datetime-local"
            value={form.publishAt}
            onChange={(e) => setForm({ ...form, publishAt: e.target.value })}
            data-ocid="announcements.publish_at.input"
          />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <Switch
            checked={form.isPinned}
            onCheckedChange={(v) => setForm({ ...form, isPinned: v })}
            data-ocid="announcements.pinned.switch"
          />
          <Label className="text-sm">Pin this announcement</Label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={cancelForm}
          data-ocid="announcements.form.cancel_button"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="btn-primary"
          data-ocid="announcements.form.submit_button"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? "Saving…" : label}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col gap-5" data-ocid="admin.announcements.panel">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Announcements
          <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {announcements.length}
          </span>
        </h3>
        {!adding && !editing && (
          <Button
            size="sm"
            className="btn-primary"
            onClick={() => setAdding(true)}
            data-ocid="announcements.add.primary_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Announcement
          </Button>
        )}
      </div>

      {adding && <AnnForm onSubmit={handleAdd} label="Add Announcement" />}

      {loading ? (
        <div
          data-ocid="announcements.loading_state"
          className="flex flex-col gap-2"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : announcements.length === 0 && !adding ? (
        <div
          data-ocid="announcements.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <Bell className="w-10 h-10 opacity-20" />
          <p className="font-medium">No announcements yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.map((ann, i) => (
            <Card
              key={ann.id}
              data-ocid={`announcements.item.${i + 1}`}
              className="bg-card border-border p-4"
            >
              {editing?.id === ann.id ? (
                <AnnForm onSubmit={handleUpdate} label="Save Changes" />
              ) : confirmDelete === ann.id ? (
                <div className="flex items-center justify-between gap-3 flex-wrap bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    Delete <strong>{ann.title}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(null)}
                      data-ocid={`announcements.delete.cancel_button.${i + 1}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ann.id)}
                      data-ocid={`announcements.delete.confirm_button.${i + 1}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {ann.isPinned && (
                        <span className="text-xs text-primary font-semibold">
                          📌 Pinned
                        </span>
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        {ann.category}
                      </Badge>
                      <Badge
                        variant={ann.isActive ? "default" : "secondary"}
                        className={`text-xs ${ann.isActive ? "bg-primary/20 text-primary border-primary/30" : ""}`}
                      >
                        {ann.isActive ? "● Live" : "○ Draft"}
                      </Badge>
                    </div>
                    <p className="font-semibold text-foreground text-sm mt-1">
                      {ann.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {ann.body}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(ann);
                        setForm({
                          title: ann.title,
                          body: ann.body,
                          link: ann.link ?? "",
                          category: ann.category,
                          isPinned: ann.isPinned,
                          publishAt: ann.publishAt
                            ? bigIntToDatetimeLocal(ann.publishAt)
                            : "",
                        });
                        setAdding(false);
                      }}
                      data-ocid={`announcements.edit_button.${i + 1}`}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePin(ann.id, !ann.isPinned)}
                      data-ocid={`announcements.pin_button.${i + 1}`}
                      className="text-primary border-primary/30"
                    >
                      {ann.isPinned ? "Unpin" : "Pin"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDelete(ann.id)}
                      data-ocid={`announcements.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Audit Log Tab ────────────────────────────────────────────────────────
function AuditLogTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: entries = [],
    isLoading,
    refetch,
    isFetching,
  } = useAuditLog(sessionToken);
  const sorted = [...entries]
    .sort((a, b) => {
      const tsA =
        typeof a.timestamp === "bigint" ? a.timestamp : BigInt(a.timestamp);
      const tsB =
        typeof b.timestamp === "bigint" ? b.timestamp : BigInt(b.timestamp);
      return tsB > tsA ? 1 : tsB < tsA ? -1 : 0;
    })
    .slice(0, 100);

  return (
    <div className="flex flex-col gap-5" data-ocid="admin.audit_log.panel">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" /> Audit Log
          {entries.length > 0 && (
            <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {Math.min(entries.length, 100)} of {entries.length}
            </span>
          )}
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="audit_log.refresh.button"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="audit_log.loading_state"
          className="flex flex-col gap-2"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-12 rounded-lg bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          data-ocid="audit_log.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <ClipboardList className="w-10 h-10 opacity-20" />
          <p className="font-medium">No audit log entries yet.</p>
          <p className="text-sm opacity-70">
            Admin actions will be logged here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide w-44">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide w-40">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => {
                const ts =
                  typeof entry.timestamp === "bigint"
                    ? entry.timestamp
                    : BigInt(entry.timestamp);
                return (
                  <tr
                    key={entry.id}
                    data-ocid={`audit_log.item.${i + 1}`}
                    className="border-t border-border hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {formatTimestamp(ts)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-mono border-primary/30 text-primary"
                      >
                        {entry.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground text-xs">
                      {entry.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Signal of the Day Tab ────────────────────────────────────────────────
function SignalOfTheDayTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const { data: signals = [] } = useSignals();
  const [currentSotd, setCurrentSotd] = useState<Signal | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  const liveSignals = signals.filter((s) => !s.isDraft);

  const loadSotd = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    const r = await actor.getSignalOfTheDay();
    setLoading(false);
    setCurrentSotd(r ?? null);
    if (r) setSelectedId(r.id);
  }, [actor]);

  useEffect(() => {
    loadSotd();
  }, [loadSotd]);

  async function handleSet() {
    if (!actor || !selectedId) return;
    setSaving(true);
    const r = await actor.setSignalOfTheDay(sessionToken, selectedId);
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Signal of the Day updated");
      qc.invalidateQueries({ queryKey: ["sotd"] });
      loadSotd();
    } else {
      toast.error(r.err);
    }
  }

  async function handleClear() {
    if (!actor) return;
    setClearing(true);
    const r = await actor.setSignalOfTheDay(sessionToken, "");
    setClearing(false);
    if (r.__kind__ === "ok") {
      toast.success("Signal of the Day cleared");
      setCurrentSotd(null);
      setSelectedId("");
      qc.invalidateQueries({ queryKey: ["sotd"] });
    } else {
      toast.error(r.err);
    }
  }

  const previewSignal = liveSignals.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.sotd.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" /> Signal of the Day
      </h3>

      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
          Currently Featured
        </p>
        {loading ? (
          <div
            data-ocid="sotd.loading_state"
            className="h-20 rounded-lg bg-muted/50 animate-pulse"
          />
        ) : currentSotd ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
              {currentSotd.marketType}
            </span>
            <span className="font-display font-bold text-foreground text-lg">
              {currentSotd.asset}
            </span>
            <span
              className={
                currentSotd.direction === "Buy"
                  ? "badge-success"
                  : "badge-danger"
              }
            >
              {currentSotd.direction.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {currentSotd.timeframe} · {currentSotd.confidence}
            </span>
            <span
              className={
                currentSotd.result === "Win"
                  ? "badge-success"
                  : currentSotd.result === "Loss"
                    ? "badge-danger"
                    : "badge-info"
              }
            >
              {currentSotd.result}
            </span>
          </div>
        ) : (
          <div
            data-ocid="sotd.empty_state"
            className="flex items-center gap-3 text-muted-foreground"
          >
            <Star className="w-6 h-6 opacity-20" />
            <p className="text-sm">No Signal of the Day set.</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">
          Set Signal of the Day
        </p>
        {liveSignals.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No live signals available. Add and publish a signal first.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Select Signal
              </Label>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger data-ocid="sotd.select">
                  <SelectValue placeholder="Choose a signal…" />
                </SelectTrigger>
                <SelectContent>
                  {liveSignals.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.asset} — {s.direction} ({s.marketType}, {s.timeframe})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {previewSignal && previewSignal.id !== currentSotd?.id && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col gap-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Preview
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-display font-bold text-foreground">
                    {previewSignal.asset}
                  </span>
                  <span
                    className={
                      previewSignal.direction === "Buy"
                        ? "badge-success"
                        : "badge-danger"
                    }
                  >
                    {previewSignal.direction.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Entry: {previewSignal.entryPrice}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    TP: {previewSignal.targetPrice}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    SL: {previewSignal.stopLoss}
                  </span>
                </div>
                {previewSignal.notes && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {previewSignal.notes}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleSet}
                disabled={saving || !selectedId}
                className="btn-primary"
                data-ocid="sotd.set.primary_button"
              >
                <Star className="w-4 h-4 mr-1" />
                {saving ? "Setting…" : "Set as Signal of the Day"}
              </Button>
              {currentSotd && (
                <Button
                  onClick={handleClear}
                  disabled={clearing}
                  variant="outline"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  data-ocid="sotd.clear.button"
                >
                  {clearing ? "Clearing…" : "Clear Signal of the Day"}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Market Sentiment Tab ─────────────────────────────────────────────────
const SENTIMENT_OPTIONS: SentimentLevel[] = [
  SentEnum.Bullish,
  SentEnum.Neutral,
  SentEnum.Bearish,
];

function sentimentColor(level: SentimentLevel): string {
  if (level === "Bullish") return "text-emerald-500";
  if (level === "Bearish") return "text-destructive";
  return "text-muted-foreground";
}

function MarketSentimentTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [overall, setOverall] = useState<SentimentLevel>(SentEnum.Neutral);
  const [assets, setAssets] = useState<
    Record<string, { level: SentimentLevel; note: string }>
  >(() =>
    Object.fromEntries(
      SENTIMENT_ASSETS.map((a) => [a, { level: SentEnum.Neutral, note: "" }]),
    ),
  );
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSentiment = useCallback(async () => {
    if (!actor || loaded) return;
    setLoading(true);
    const r = await actor.getMarketSentiment();
    setLoading(false);
    setLoaded(true);
    setOverall(r.overall);
    const updated: Record<string, { level: SentimentLevel; note: string }> = {
      ...Object.fromEntries(
        SENTIMENT_ASSETS.map((a) => [a, { level: SentEnum.Neutral, note: "" }]),
      ),
    };
    for (const a of r.assets) {
      if (SENTIMENT_ASSETS.includes(a.asset)) {
        updated[a.asset] = { level: a.level, note: a.note };
      }
    }
    setAssets(updated);
  }, [actor, loaded]);

  useEffect(() => {
    loadSentiment();
  }, [loadSentiment]);

  async function handleSave() {
    if (!actor) return;
    setSaving(true);
    const assetArr: AssetSentiment[] = SENTIMENT_ASSETS.map((name) => ({
      asset: name,
      level: assets[name].level,
      note: assets[name].note,
      market: "Crypto",
      updatedAt: BigInt(Date.now()) * 1_000_000n,
      trend: "flat",
      price: 0,
      priceChange24h: 0,
      lastPriceUpdate: BigInt(Date.now()) * 1_000_000n,
    }));
    const sentiment: MarketSentiment = {
      overall,
      assets: assetArr,
      updatedAt: BigInt(Date.now()) * 1_000_000n,
    };
    const r = await actor.updateMarketSentiment(sessionToken, sentiment);
    setSaving(false);
    if (r.__kind__ === "ok") {
      toast.success("Market sentiment updated");
      qc.invalidateQueries({ queryKey: ["marketSentiment"] });
    } else {
      toast.error(r.err);
    }
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.sentiment.panel">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" /> Market Sentiment
        </h3>
        {!loaded && !loading && (
          <Button
            size="sm"
            variant="outline"
            onClick={loadSentiment}
            disabled={loading || !actor}
            data-ocid="sentiment.load.button"
          >
            Load Current Sentiment
          </Button>
        )}
      </div>

      {loading && (
        <div
          data-ocid="sentiment.loading_state"
          className="flex flex-col gap-3"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && loaded && (
        <>
          {/* Overall sentiment */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">
              Overall Market Sentiment
            </p>
            <div className="flex gap-3 flex-wrap">
              {SENTIMENT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOverall(opt)}
                  data-ocid={`sentiment.overall.${opt.toLowerCase()}.toggle`}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    overall === opt
                      ? opt === "Bullish"
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-500"
                        : opt === "Bearish"
                          ? "bg-destructive/15 border-destructive/40 text-destructive"
                          : "bg-primary/15 border-primary/30 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {opt === "Bullish"
                    ? "🐂 "
                    : opt === "Bearish"
                      ? "🐻 "
                      : "😐 "}
                  {opt}
                </button>
              ))}
            </div>
            <p
              className={`text-xs font-mono font-semibold ${sentimentColor(overall)}`}
            >
              Current: {overall}
            </p>
          </div>

          {/* Asset grid */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-foreground">
              Asset-Level Sentiment
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SENTIMENT_ASSETS.map((asset, i) => (
                <div
                  key={asset}
                  data-ocid={`sentiment.asset.item.${i + 1}`}
                  className="flex flex-col gap-2 bg-muted/20 border border-border rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-foreground">
                      {asset}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold ${sentimentColor(assets[asset].level)}`}
                    >
                      {assets[asset].level}
                    </span>
                  </div>
                  <Select
                    value={assets[asset].level}
                    onValueChange={(v) =>
                      setAssets((prev) => ({
                        ...prev,
                        [asset]: {
                          ...prev[asset],
                          level: v as SentimentLevel,
                        },
                      }))
                    }
                  >
                    <SelectTrigger
                      className="h-8 text-xs"
                      data-ocid={`sentiment.${asset.toLowerCase()}.select`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SENTIMENT_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={assets[asset].note}
                    onChange={(e) =>
                      setAssets((prev) => ({
                        ...prev,
                        [asset]: { ...prev[asset], note: e.target.value },
                      }))
                    }
                    placeholder={`Note for ${asset}…`}
                    className="h-8 text-xs"
                    data-ocid={`sentiment.${asset.toLowerCase()}.note.input`}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-fit"
            data-ocid="sentiment.save.primary_button"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? "Saving…" : "Save Sentiment"}
          </Button>
        </>
      )}

      {!loading && !loaded && (
        <div
          data-ocid="sentiment.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <Globe className="w-10 h-10 opacity-20" />
          <p className="font-medium">
            Click "Load Current Sentiment" to begin.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Content Tab (Burn Tracker, Community Counter, Binance Feed) ──────────
function ContentTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const { posts, isLoading: feedLoading } = useBinanceFeed();

  // Burn tracker
  const [burnValue, setBurnValue] = useState("");
  const [savingBurn, setSavingBurn] = useState(false);

  // Community counter
  const [binanceCount, setBinanceCount] = useState("");
  const [twitterCount, setTwitterCount] = useState("");
  const [savingCounter, setSavingCounter] = useState(false);

  // Binance feed post form
  const [postTitle, setPostTitle] = useState("");
  const [postSnippet, setPostSnippet] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postDate, setPostDate] = useState("");
  const [savingPost, setSavingPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);

  async function handleSaveBurn(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !burnValue.trim()) return;
    setSavingBurn(true);
    try {
      const burnData = {
        totalBurned: BigInt(burnValue.trim()),
        lastUpdated: BigInt(Date.now()) * 1_000_000n,
      };
      const r = await actor.setBurnTracker(sessionToken, burnData);
      if (r.__kind__ === "ok") {
        toast.success("Burn tracker updated");
        qc.invalidateQueries({ queryKey: ["burnTracker"] });
        setBurnValue("");
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to update burn tracker");
    } finally {
      setSavingBurn(false);
    }
  }

  async function handleSaveCounter(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) return;
    setSavingCounter(true);
    try {
      const counterData = {
        binanceCount: BigInt(binanceCount || "0"),
        twitterCount: BigInt(twitterCount || "0"),
        lastUpdated: BigInt(Date.now()) * 1_000_000n,
      };
      const r = await actor.setCommunityCounter(sessionToken, counterData);
      if (r.__kind__ === "ok") {
        toast.success("Community counter updated");
        qc.invalidateQueries({ queryKey: ["communityCounter"] });
        setBinanceCount("");
        setTwitterCount("");
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to update community counter");
    } finally {
      setSavingCounter(false);
    }
  }

  async function handleAddPost(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !postTitle.trim()) return;
    setSavingPost(true);
    try {
      const r = await actor.addBinancePost(
        sessionToken,
        postTitle.trim(),
        postSnippet.trim(),
        postUrl.trim() || "",
        postDate.trim() || "",
      );
      if (r.__kind__ === "ok") {
        toast.success("Post added to Binance feed");
        qc.invalidateQueries({ queryKey: ["binanceFeed"] });
        setPostTitle("");
        setPostSnippet("");
        setPostUrl("");
        setPostDate("");
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to add post");
    } finally {
      setSavingPost(false);
    }
  }

  async function handleDeletePost(id: string) {
    if (!actor) return;
    setDeletingPost(id);
    try {
      const r = await actor.deleteBinancePost(sessionToken, id);
      if (r.__kind__ === "ok") {
        toast.success("Post deleted");
        qc.invalidateQueries({ queryKey: ["binanceFeed"] });
      } else {
        toast.error(r.err);
      }
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingPost(null);
    }
  }

  return (
    <div className="flex flex-col gap-8" data-ocid="admin.content.panel">
      {/* Burn Tracker */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Flame className="w-5 h-5 text-destructive" /> Burn Tracker
        </h3>
        <p className="text-xs text-muted-foreground">
          Set the total number of DMNZ tokens burned. Displayed on the homepage
          burn counter.
        </p>
        <form onSubmit={handleSaveBurn} className="flex gap-2 items-end">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Total DMNZ Burned (Nat)
            </Label>
            <Input
              type="number"
              min="0"
              value={burnValue}
              onChange={(e) => setBurnValue(e.target.value)}
              placeholder="e.g. 50000000"
              data-ocid="admin.content.burn.input"
            />
          </div>
          <Button
            type="submit"
            disabled={savingBurn || !burnValue.trim()}
            className="btn-primary"
            data-ocid="admin.content.burn.save_button"
          >
            <Save className="w-4 h-4 mr-1" />
            {savingBurn ? "Saving…" : "Save"}
          </Button>
        </form>
      </div>

      {/* Community Counter */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Community Counter
        </h3>
        <p className="text-xs text-muted-foreground">
          Set follower counts for Binance Square (@DemonZeno) and Twitter
          (@ZenoDemon).
        </p>
        <form
          onSubmit={handleSaveCounter}
          className="grid sm:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Binance Square Followers
            </Label>
            <Input
              type="number"
              min="0"
              value={binanceCount}
              onChange={(e) => setBinanceCount(e.target.value)}
              placeholder="e.g. 125400"
              data-ocid="admin.content.community.binance.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Twitter Followers
            </Label>
            <Input
              type="number"
              min="0"
              value={twitterCount}
              onChange={(e) => setTwitterCount(e.target.value)}
              placeholder="e.g. 89200"
              data-ocid="admin.content.community.twitter.input"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              type="submit"
              disabled={savingCounter}
              className="btn-primary"
              data-ocid="admin.content.community.save_button"
            >
              <Save className="w-4 h-4 mr-1" />
              {savingCounter ? "Saving…" : "Save Counter"}
            </Button>
          </div>
        </form>
      </div>

      {/* Binance Feed */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-5">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Binance Square Feed
        </h3>
        <p className="text-xs text-muted-foreground">
          Add or remove posts shown in the Binance Square feed section on the
          homepage.
        </p>

        {/* Add post form */}
        <form
          onSubmit={handleAddPost}
          className="flex flex-col gap-3 bg-muted/20 border border-border rounded-lg p-4"
        >
          <p className="text-sm font-semibold text-foreground">Add New Post</p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Title *
            </Label>
            <Input
              required
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="BTC/USDT Breakout — High Confidence Signal"
              data-ocid="admin.content.feed.title.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Snippet
            </Label>
            <Textarea
              rows={2}
              value={postSnippet}
              onChange={(e) => setPostSnippet(e.target.value)}
              placeholder="Short excerpt from the Binance Square post…"
              data-ocid="admin.content.feed.snippet.textarea"
              className="resize-none text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                URL (optional)
              </Label>
              <Input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.binance.com/en/square/…"
                data-ocid="admin.content.feed.url.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Date (optional)
              </Label>
              <Input
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                placeholder="Jan 15, 2026"
                data-ocid="admin.content.feed.date.input"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={savingPost || !postTitle.trim()}
              className="btn-primary"
              data-ocid="admin.content.feed.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {savingPost ? "Adding…" : "Add Post"}
            </Button>
          </div>
        </form>

        {/* Posts list */}
        {feedLoading ? (
          <div
            data-ocid="admin.content.feed.loading_state"
            className="flex flex-col gap-2"
          >
            {["a", "b", "c"].map((k) => (
              <div
                key={k}
                className="h-14 bg-muted/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            data-ocid="admin.content.feed.empty_state"
            className="text-center text-muted-foreground py-8"
          >
            <p className="text-sm">No posts yet. Add your first post above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              {posts.length} post{posts.length !== 1 ? "s" : ""} in feed
            </p>
            {posts.map((post: BinancePost, i: number) => (
              <div
                key={post.id}
                data-ocid={`admin.content.feed.item.${i + 1}`}
                className="flex items-start gap-3 bg-muted/20 border border-border rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {post.title}
                  </p>
                  {post.date && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {post.date}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
                  disabled={deletingPost === post.id}
                  data-ocid={`admin.content.feed.delete_button.${i + 1}`}
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 shrink-0"
                >
                  {deletingPost === post.id ? (
                    <span className="w-3 h-3 border border-destructive border-t-transparent rounded-full animate-spin inline-block" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Push Notifications Tab ───────────────────────────────────────────────
function PushNotificationsTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: notifications = [],
    isLoading,
    create,
    dismiss,
  } = usePushNotifications(sessionToken);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    await create.mutateAsync({ title: title.trim(), body: body.trim() });
    setTitle("");
    setBody("");
  }

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid="admin.push_notifications.panel"
    >
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" /> Push Notifications
      </h3>

      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
      >
        <p className="text-sm font-semibold text-foreground">
          Send New Notification
        </p>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Title *
          </Label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Signal Alert"
            data-ocid="push_notifications.title.input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Body *
          </Label>
          <Textarea
            required
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="BTC/USDT breakout detected — check the signals section."
            data-ocid="push_notifications.body.textarea"
          />
        </div>
        <Button
          type="submit"
          className="btn-primary w-fit"
          disabled={create.isPending || !title.trim() || !body.trim()}
          data-ocid="push_notifications.send.primary_button"
        >
          <Bell className="w-4 h-4 mr-1" />
          {create.isPending ? "Sending…" : "Send to All Users"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
          Active Notifications{" "}
          {notifications.length > 0 && `(${notifications.length})`}
        </p>
        {isLoading ? (
          <div
            data-ocid="push_notifications.loading_state"
            className="flex flex-col gap-2"
          >
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-16 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div
            data-ocid="push_notifications.empty_state"
            className="text-center text-muted-foreground py-10 flex flex-col items-center gap-2"
          >
            <Bell className="w-8 h-8 opacity-20" />
            <p className="text-sm">No active notifications.</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <Card
              key={n.id}
              data-ocid={`push_notifications.item.${i + 1}`}
              className="bg-card border-border p-4"
            >
              {confirmId === n.id ? (
                <div className="flex items-center justify-between gap-3 flex-wrap bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    Dismiss <strong>{n.title}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmId(null)}
                      data-ocid={`push_notifications.cancel_button.${i + 1}`}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        dismiss.mutate(n.id);
                        setConfirmId(null);
                      }}
                      data-ocid={`push_notifications.confirm_button.${i + 1}`}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.body}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                      {formatTimestamp(n.createdAt)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmId(n.id)}
                    className="shrink-0 text-destructive border-destructive/30 hover:bg-destructive/10"
                    data-ocid={`push_notifications.delete_button.${i + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Signal Performance Tab ───────────────────────────────────────────────
function SignalPerformanceTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: stats,
    isLoading,
    refetch,
    isFetching,
  } = useSignalPerformanceStats(sessionToken);

  const winRate = stats?.winRate ?? 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (winRate / 100) * circumference;

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid="admin.signal_performance.panel"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Signal Performance
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="signal_performance.refresh.button"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div
          data-ocid="signal_performance.loading_state"
          className="flex flex-col gap-4"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-24 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : !stats ? (
        <div
          data-ocid="signal_performance.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <BarChart3 className="w-10 h-10 opacity-20" />
          <p className="font-medium">No performance data yet.</p>
        </div>
      ) : (
        <>
          {/* Win Rate Gauge */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-36 shrink-0">
              <svg
                viewBox="0 0 128 128"
                className="w-full h-full -rotate-90"
                aria-label="Win rate gauge"
              >
                <title>Win rate gauge</title>
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="oklch(0.65 0.15 190)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                <span className="font-bold text-2xl font-mono text-foreground">
                  {winRate.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">Win Rate</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
              {(
                [
                  ["Total", stats.totalSignals.toString()],
                  ["Wins", stats.wins.toString()],
                  ["Losses", stats.losses.toString()],
                  ["Pending", stats.pending.toString()],
                ] as [string, string][]
              ).map(([l, v]) => (
                <div
                  key={l}
                  className="bg-secondary/50 rounded-lg p-3 text-center"
                >
                  <p className="font-bold text-lg font-mono text-foreground">
                    {v}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Assets */}
          {stats.topAssets.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">
                Top Assets
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium text-xs uppercase">
                        Asset
                      </th>
                      <th className="text-right py-2 text-muted-foreground font-medium text-xs uppercase">
                        Wins
                      </th>
                      <th className="text-right py-2 text-muted-foreground font-medium text-xs uppercase">
                        Losses
                      </th>
                      <th className="text-right py-2 text-muted-foreground font-medium text-xs uppercase">
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topAssets.map((a, i) => {
                      const total = Number(a.wins) + Number(a.losses);
                      const rate =
                        total > 0
                          ? ((Number(a.wins) / total) * 100).toFixed(0)
                          : "—";
                      return (
                        <tr
                          key={a.asset}
                          data-ocid={`signal_performance.asset.item.${i + 1}`}
                          className="border-t border-border"
                        >
                          <td className="py-2.5 font-mono font-semibold text-foreground">
                            {a.asset}
                          </td>
                          <td className="py-2.5 text-right text-emerald-500 font-mono">
                            {a.wins.toString()}
                          </td>
                          <td className="py-2.5 text-right text-destructive font-mono">
                            {a.losses.toString()}
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground font-mono">
                            {rate}
                            {rate !== "—" ? "%" : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Weekly Trend Bars */}
          {stats.weeklyTrend.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <p className="text-sm font-semibold text-foreground">
                Weekly Trend
              </p>
              <div className="flex items-end gap-2 h-24">
                {stats.weeklyTrend.map((d, i) => {
                  const wins = Number(d.wins);
                  const losses = Number(d.losses);
                  const max = Math.max(
                    ...stats.weeklyTrend.map(
                      (x) => Number(x.wins) + Number(x.losses),
                    ),
                    1,
                  );
                  const totalH = ((wins + losses) / max) * 80;
                  const winH = (wins / (wins + losses || 1)) * totalH;
                  return (
                    <div
                      key={d.day}
                      data-ocid={`signal_performance.day.item.${i + 1}`}
                      className="flex flex-col items-center gap-1 flex-1"
                    >
                      <div
                        className="w-full flex flex-col-reverse"
                        style={{ height: 80 }}
                      >
                        <div
                          className="w-full rounded-sm bg-emerald-500/70 transition-all"
                          style={{ height: winH || 0 }}
                        />
                        <div
                          className="w-full rounded-t-sm bg-destructive/60 transition-all"
                          style={{ height: Math.max(0, totalH - winH) }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {d.day.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500/70" /> Wins
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-destructive/60" />{" "}
                  Losses
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Market Mood Banner Tab ───────────────────────────────────────────────
const MOOD_OPTIONS = [
  {
    value: "bullish",
    label: "🟢 Bullish",
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    value: "bearish",
    label: "🔴 Bearish",
    color: "text-destructive bg-destructive/10 border-destructive/30",
  },
  {
    value: "neutral",
    label: "⚪ Neutral",
    color: "text-muted-foreground bg-muted/30 border-border",
  },
  {
    value: "warning",
    label: "⚠️ Warning",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  },
] as const;

function MarketMoodBannerTab({ sessionToken }: { sessionToken: string }) {
  const { data: banner, isLoading, set } = useMarketMoodBanner(sessionToken);
  const [mood, setMood] = useState("neutral");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (banner) {
      setMood(banner.mood);
      setMessage(banner.message);
      setActive(banner.active);
    }
  }, [banner]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await set.mutateAsync({ mood, message });
  }

  const currentMood =
    MOOD_OPTIONS.find((m) => m.value === mood) ?? MOOD_OPTIONS[2];

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.market_mood.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> Market Mood Banner
      </h3>

      {/* Live Preview */}
      <div
        className={`border rounded-xl p-4 flex items-center gap-3 ${currentMood.color}`}
      >
        <span className="text-sm font-semibold">
          {message || "Preview: enter a message below"}
        </span>
        <Badge
          variant="outline"
          className={`ml-auto text-xs shrink-0 ${currentMood.color}`}
        >
          {currentMood.label}
        </Badge>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
      >
        <p className="text-sm font-semibold text-foreground">
          Configure Banner
        </p>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Mood
          </Label>
          <div className="flex gap-2 flex-wrap">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                data-ocid={`market_mood.${m.value}.toggle`}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  mood === m.value
                    ? m.color
                    : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Message *
          </Label>
          <Input
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Market conditions are currently bullish — BTC holding strong above support"
            data-ocid="market_mood.message.input"
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={active}
            onCheckedChange={setActive}
            data-ocid="market_mood.active.switch"
          />
          <Label className="text-sm text-foreground">
            {active
              ? "Banner enabled (visible to all users)"
              : "Banner disabled"}
          </Label>
        </div>
        <Button
          type="submit"
          className="btn-primary w-fit"
          disabled={set.isPending}
          data-ocid="market_mood.save.primary_button"
        >
          <Save className="w-4 h-4 mr-1" />
          {set.isPending ? "Saving…" : "Save Banner"}
        </Button>
      </form>

      {isLoading && (
        <div
          data-ocid="market_mood.loading_state"
          className="h-16 rounded-xl bg-muted/50 animate-pulse"
        />
      )}
    </div>
  );
}

// ─── Maintenance Mode Tab ─────────────────────────────────────────────────
function MaintenanceModeTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: maintenance,
    isLoading,
    set,
  } = useMaintenanceMode(sessionToken);
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState(
    "DemonZeno is currently undergoing maintenance. We'll be back shortly.",
  );

  useEffect(() => {
    if (maintenance) {
      setEnabled(maintenance.enabled);
      if (maintenance.message) setMessage(maintenance.message);
    }
  }, [maintenance]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await set.mutateAsync({ enabled, message });
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.maintenance.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <WrenchIcon className="w-5 h-5 text-primary" /> Maintenance Mode
      </h3>

      {isLoading ? (
        <div
          data-ocid="maintenance.loading_state"
          className="h-24 rounded-xl bg-muted/50 animate-pulse"
        />
      ) : (
        <>
          {enabled && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
              <WrenchIcon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive text-sm">
                  Maintenance Mode is ACTIVE
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All visitors will see the maintenance screen instead of the
                  site.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSave}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
                data-ocid="maintenance.enabled.switch"
              />
              <div>
                <Label className="font-semibold text-foreground">
                  {enabled ? "Maintenance Active" : "Maintenance Off"}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This will show the maintenance screen to all site visitors.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Custom Message
              </Label>
              <Textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We'll be back shortly…"
                data-ocid="maintenance.message.textarea"
              />
            </div>
            {enabled && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <WrenchIcon className="w-3 h-3" />
                Warning: Enabling maintenance will hide the site from all
                visitors immediately.
              </p>
            )}
            <Button
              type="submit"
              className={`w-fit ${enabled ? "bg-destructive hover:bg-destructive/80 text-destructive-foreground" : "btn-primary"}`}
              disabled={set.isPending}
              data-ocid="maintenance.save.primary_button"
            >
              <Save className="w-4 h-4 mr-1" />
              {set.isPending ? "Saving…" : "Apply Maintenance Mode"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

// ─── A/B Testing Tab ──────────────────────────────────────────────────────
function AbTestingTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: tests = [],
    isLoading,
    create,
    recordImpression,
  } = useAbTests(sessionToken);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", variantA: "", variantB: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await create.mutateAsync(form);
    setForm({ name: "", variantA: "", variantB: "" });
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.ab_testing.panel">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
          <TestTube2 className="w-5 h-5 text-primary" /> A/B Testing
        </h3>
        {!showForm && (
          <Button
            size="sm"
            className="btn-primary"
            onClick={() => setShowForm(true)}
            data-ocid="ab_testing.create.primary_button"
          >
            <Plus className="w-4 h-4 mr-1" /> New Test
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-muted/20 border border-border rounded-xl p-5 flex flex-col gap-4"
        >
          <p className="text-sm font-semibold text-foreground">
            Create A/B Test
          </p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Test Name *
            </Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Hero CTA button text"
              data-ocid="ab_testing.name.input"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Variant A *
              </Label>
              <Textarea
                required
                rows={2}
                value={form.variantA}
                onChange={(e) => setForm({ ...form, variantA: e.target.value })}
                placeholder="Trade Like a God"
                data-ocid="ab_testing.variant_a.textarea"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Variant B *
              </Label>
              <Textarea
                required
                rows={2}
                value={form.variantB}
                onChange={(e) => setForm({ ...form, variantB: e.target.value })}
                placeholder="Master the Chaos"
                data-ocid="ab_testing.variant_b.textarea"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="ab_testing.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-primary"
              disabled={create.isPending}
              data-ocid="ab_testing.submit_button"
            >
              {create.isPending ? "Creating…" : "Create Test"}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div
          data-ocid="ab_testing.loading_state"
          className="flex flex-col gap-3"
        >
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-24 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : tests.length === 0 && !showForm ? (
        <div
          data-ocid="ab_testing.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <TestTube2 className="w-10 h-10 opacity-20" />
          <p className="font-medium">No A/B tests yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tests.map((test, i) => {
            const totalA = Number(test.impressionsA);
            const totalB = Number(test.impressionsB);
            const total = totalA + totalB || 1;
            const winner = totalA > totalB ? "A" : totalB > totalA ? "B" : null;
            return (
              <Card
                key={test.id}
                data-ocid={`ab_testing.item.${i + 1}`}
                className="bg-card border-border p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {test.name}
                    </p>
                    {winner && (
                      <Badge className="mt-1 text-xs bg-primary/20 text-primary border-primary/30">
                        Variant {winner} Leading
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        recordImpression.mutate({
                          testId: test.id,
                          variant: "A",
                        })
                      }
                      data-ocid={`ab_testing.record_a.button.${i + 1}`}
                      className="text-xs"
                    >
                      +A
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        recordImpression.mutate({
                          testId: test.id,
                          variant: "B",
                        })
                      }
                      data-ocid={`ab_testing.record_b.button.${i + 1}`}
                      className="text-xs"
                    >
                      +B
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-muted-foreground mb-0.5">Variant A</p>
                    <p className="font-mono text-foreground text-sm">
                      {totalA} impressions (
                      {((totalA / total) * 100).toFixed(0)}%)
                    </p>
                    <p className="text-muted-foreground mt-1 truncate">
                      {test.variantA}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-muted-foreground mb-0.5">Variant B</p>
                    <p className="font-mono text-foreground text-sm">
                      {totalB} impressions (
                      {((totalB / total) * 100).toFixed(0)}%)
                    </p>
                    <p className="text-muted-foreground mt-1 truncate">
                      {test.variantB}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Audit Snapshots Tab ──────────────────────────────────────────────────
function AuditSnapshotsTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: snapshots = [],
    isLoading,
    create,
  } = useAuditSnapshots(sessionToken);
  const [snapshotLabel, setSnapshotLabel] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!snapshotLabel.trim()) return;
    await create.mutateAsync(snapshotLabel.trim());
    setSnapshotLabel("");
  }

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid="admin.audit_snapshots.panel"
    >
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-primary" /> Audit Snapshots
        <span className="text-xs text-muted-foreground font-normal">
          (backup points)
        </span>
      </h3>

      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
      >
        <p className="text-sm font-semibold text-foreground">
          Create Backup Point
        </p>
        <div className="flex gap-2">
          <Input
            required
            value={snapshotLabel}
            onChange={(e) => setSnapshotLabel(e.target.value)}
            placeholder="Pre-launch backup — April 2026"
            className="flex-1"
            data-ocid="audit_snapshots.label.input"
          />
          <Button
            type="submit"
            className="btn-primary shrink-0"
            disabled={create.isPending || !snapshotLabel.trim()}
            data-ocid="audit_snapshots.create.primary_button"
          >
            {create.isPending ? "…" : "Create"}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div
          data-ocid="audit_snapshots.loading_state"
          className="flex flex-col gap-2"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-14 rounded-lg bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <div
          data-ocid="audit_snapshots.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <ClipboardList className="w-10 h-10 opacity-20" />
          <p className="font-medium">
            No snapshots yet. Create your first backup point.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {snapshots.map((snap, i) => (
            <Card
              key={snap.id}
              data-ocid={`audit_snapshots.item.${i + 1}`}
              className="bg-card border-border p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">
                    {snap.snapshotLabel}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatTimestamp(snap.createdAt)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant="outline"
                    className="text-xs font-mono border-primary/30 text-primary"
                  >
                    {snap.id.slice(0, 8)}…
                  </Badge>
                  {snap.dataHash && (
                    <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                      hash: {snap.dataHash.slice(0, 12)}…
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Activity Heatmap Tab ─────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, h) => h);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ActivityHeatmapTab({ sessionToken }: { sessionToken: string }) {
  const { data: entries = [], isLoading } = useActivityHeatmap(sessionToken);

  const grid: Record<string, number> = {};
  for (const e of entries) {
    const key = `${e.dayOfWeek}-${e.hour}`;
    grid[key] = Number(e.count);
  }
  const maxCount = Math.max(...Object.values(grid), 1);

  function cellColor(count: number): string {
    if (count === 0) return "bg-muted/30";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "bg-primary/20";
    if (intensity < 0.5) return "bg-primary/40";
    if (intensity < 0.75) return "bg-primary/60";
    return "bg-primary/90";
  }

  return (
    <div
      className="flex flex-col gap-6"
      data-ocid="admin.activity_heatmap.panel"
    >
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" /> Admin Activity Heatmap
      </h3>

      {isLoading ? (
        <div
          data-ocid="activity_heatmap.loading_state"
          className="h-48 rounded-xl bg-muted/50 animate-pulse"
        />
      ) : entries.length === 0 ? (
        <div
          data-ocid="activity_heatmap.empty_state"
          className="text-center text-muted-foreground py-16 flex flex-col items-center gap-3"
        >
          <Activity className="w-10 h-10 opacity-20" />
          <p className="font-medium">
            No activity data yet. Admin actions will populate this heatmap.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex gap-0.5 mb-1 pl-10">
              {HOURS.map((h) => (
                <div
                  key={`hour-label-${h}`}
                  className="flex-1 text-center text-xs text-muted-foreground"
                >
                  {h % 6 === 0 ? h : ""}
                </div>
              ))}
            </div>
            {DAYS.map((day, di) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <span className="w-10 text-xs text-muted-foreground text-right pr-2 shrink-0">
                  {day}
                </span>
                {HOURS.map((h) => {
                  const count = grid[`${di}-${h}`] ?? 0;
                  return (
                    <div
                      key={`heatmap-${day}-${h}`}
                      title={`${day} ${h}:00 — ${count} action${count !== 1 ? "s" : ""}`}
                      data-ocid={`activity_heatmap.cell.${di}-${h}`}
                      className={`flex-1 h-5 rounded-sm ${cellColor(count)} transition-colors`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[
                "bg-muted/30",
                "bg-primary/20",
                "bg-primary/40",
                "bg-primary/60",
                "bg-primary/90",
              ].map((c) => (
                <div key={c} className={`w-4 h-4 rounded-sm ${c}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Roles Tab ──────────────────────────────────────────────────────
function AdminRolesTab({ sessionToken }: { sessionToken: string }) {
  const { data: role, isLoading } = useAdminRole(sessionToken);

  const isFullAdmin = role === "admin" || role === "full_admin";

  return (
    <div className="flex flex-col gap-6" data-ocid="admin.roles.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" /> Admin Roles
      </h3>

      {isLoading ? (
        <div
          data-ocid="roles.loading_state"
          className="h-20 rounded-xl bg-muted/50 animate-pulse"
        />
      ) : (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isFullAdmin ? "bg-primary/20" : "bg-muted"}`}
            >
              <ShieldCheck
                className={`w-5 h-5 ${isFullAdmin ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isFullAdmin
                  ? "Full Administrator"
                  : role
                    ? role
                    : "Analyst (Read-Only)"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFullAdmin
                  ? "Passcode 252525 validated — full backend access"
                  : "Limited read-only view"}
              </p>
            </div>
            <Badge
              className={`ml-auto ${isFullAdmin ? "bg-primary/20 text-primary border-primary/30" : "bg-muted text-muted-foreground border-border"}`}
              variant="outline"
            >
              {isFullAdmin ? "● Admin" : "○ Analyst"}
            </Badge>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-muted-foreground font-medium text-xs uppercase">
                Permission
              </th>
              <th className="text-center px-4 py-3 text-muted-foreground font-medium text-xs uppercase">
                Analyst
              </th>
              <th className="text-center px-4 py-3 text-muted-foreground font-medium text-xs uppercase">
                Full Admin
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["View signals & analytics", true, true],
              ["Edit / delete signals", false, true],
              ["Manage FAQs & announcements", false, true],
              ["Control market sentiment", false, true],
              ["Send push notifications", false, true],
              ["Manage admin content", false, true],
              ["Enable maintenance mode", false, true],
              ["Full audit log access", false, true],
            ].map(([perm, analyst, admin]) => (
              <tr key={String(perm)} className="border-t border-border">
                <td className="px-4 py-3 text-foreground text-xs">
                  {String(perm)}
                </td>
                <td className="px-4 py-3 text-center">
                  {analyst ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {admin ? (
                    <span className="text-primary">✓</span>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Community Content Tab ────────────────────────────────────────────────
function CommunityContentTab({ sessionToken }: { sessionToken: string }) {
  const quotes = useCommunityQuotes(sessionToken);
  const testimonials = useCommunityTestimonials(sessionToken);
  const sotw = useSignalOfWeekAdmin(sessionToken);
  const milestones = useCommunityMilestones(sessionToken);
  const topTraders = useTopTraders(sessionToken);
  const { data: signals = [] } = useSignals();

  const [quoteForm, setQuoteForm] = useState({ quote: "", author: "" });
  const [testForm, setTestForm] = useState({
    name: "",
    content: "",
    winAmount: "",
    asset: "",
  });
  const [sotwSignalId, setSotwSignalId] = useState("");
  const [sotwComment, setSotwComment] = useState("");
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    description: "",
  });
  const [traderForm, setTraderForm] = useState({
    name: "",
    bio: "",
    achievement: "",
    week: "",
  });

  async function handleAddQuote(e: React.FormEvent) {
    e.preventDefault();
    await quotes.add.mutateAsync(quoteForm);
    setQuoteForm({ quote: "", author: "" });
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    await testimonials.add.mutateAsync({
      name: testForm.name,
      content: testForm.content,
      winAmount: testForm.winAmount || null,
      asset: testForm.asset || null,
    });
    setTestForm({ name: "", content: "", winAmount: "", asset: "" });
  }

  async function handleSetSotw(e: React.FormEvent) {
    e.preventDefault();
    if (!sotwSignalId) return;
    await sotw.set.mutateAsync({
      signalId: sotwSignalId,
      comment: sotwComment,
    });
    setSotwComment("");
  }

  async function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault();
    await milestones.add.mutateAsync(milestoneForm);
    setMilestoneForm({ title: "", description: "" });
  }

  async function handleAddTrader(e: React.FormEvent) {
    e.preventDefault();
    await topTraders.add.mutateAsync(traderForm);
    setTraderForm({ name: "", bio: "", achievement: "", week: "" });
  }

  const liveSignals = signals.filter((s) => !s.isDraft);

  return (
    <div className="flex flex-col gap-8" data-ocid="admin.community.panel">
      {/* Quote Rotator */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" /> Quote Rotator
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            {quotes.data?.length ?? 0}
          </span>
        </h4>
        <form onSubmit={handleAddQuote} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Quote *
            </Label>
            <Textarea
              required
              rows={2}
              value={quoteForm.quote}
              onChange={(e) =>
                setQuoteForm({ ...quoteForm, quote: e.target.value })
              }
              placeholder="Master the chaos, slay the market…"
              data-ocid="community.quote.textarea"
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Author
              </Label>
              <Input
                value={quoteForm.author}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, author: e.target.value })
                }
                placeholder="DemonZeno"
                data-ocid="community.quote.author.input"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary shrink-0"
              disabled={quotes.add.isPending}
              data-ocid="community.quote.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {quotes.add.isPending ? "…" : "Add Quote"}
            </Button>
          </div>
        </form>
        {(quotes.data ?? []).length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {(quotes.data ?? []).map((q: DemonZenoQuote, i: number) => (
              <div
                key={q.id}
                data-ocid={`community.quote.item.${i + 1}`}
                className="flex items-start justify-between gap-3 bg-muted/20 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground italic line-clamp-2">
                    "{q.quote}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    — {q.author}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => quotes.remove.mutate(q.id)}
                  className="shrink-0 text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                  data-ocid={`community.quote.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signal of the Week */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Signal of the Week
        </h4>
        {sotw.data && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">
              Currently Featured ({sotw.data.weekOf})
            </p>
            <p className="font-semibold text-foreground">
              {sotw.data.signal.asset} — {sotw.data.signal.direction}
            </p>
            {sotw.data.comment && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {sotw.data.comment}
              </p>
            )}
          </div>
        )}
        <form onSubmit={handleSetSotw} className="flex flex-col gap-3">
          <Select value={sotwSignalId} onValueChange={setSotwSignalId}>
            <SelectTrigger data-ocid="community.sotw.select">
              <SelectValue placeholder="Choose a signal for this week…" />
            </SelectTrigger>
            <SelectContent>
              {liveSignals.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.asset} — {s.direction} ({s.timeframe})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Admin Comment
              </Label>
              <Input
                value={sotwComment}
                onChange={(e) => setSotwComment(e.target.value)}
                placeholder="This week's highest-conviction setup…"
                data-ocid="community.sotw.comment.input"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary shrink-0"
              disabled={sotw.set.isPending || !sotwSignalId}
              data-ocid="community.sotw.save.primary_button"
            >
              <Star className="w-4 h-4 mr-1" />
              {sotw.set.isPending ? "…" : "Set"}
            </Button>
          </div>
        </form>
      </div>

      {/* Testimonials */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> Testimonials
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            {testimonials.data?.length ?? 0}
          </span>
        </h4>
        <form
          onSubmit={handleAddTestimonial}
          className="flex flex-col gap-3 bg-muted/20 border border-border rounded-lg p-4"
        >
          <p className="text-sm font-semibold text-foreground">
            Add Testimonial
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Name *
              </Label>
              <Input
                required
                value={testForm.name}
                onChange={(e) =>
                  setTestForm({ ...testForm, name: e.target.value })
                }
                placeholder="Trader Joe"
                data-ocid="community.testimonial.name.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Asset (optional)
              </Label>
              <Input
                value={testForm.asset}
                onChange={(e) =>
                  setTestForm({ ...testForm, asset: e.target.value })
                }
                placeholder="BTC/USDT"
                data-ocid="community.testimonial.asset.input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Testimonial *
            </Label>
            <Textarea
              required
              rows={2}
              value={testForm.content}
              onChange={(e) =>
                setTestForm({ ...testForm, content: e.target.value })
              }
              placeholder="DemonZeno's signals helped me…"
              data-ocid="community.testimonial.content.textarea"
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Win Amount (optional)
              </Label>
              <Input
                value={testForm.winAmount}
                onChange={(e) =>
                  setTestForm({ ...testForm, winAmount: e.target.value })
                }
                placeholder="+$2,400"
                data-ocid="community.testimonial.win.input"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary shrink-0"
              disabled={testimonials.add.isPending}
              data-ocid="community.testimonial.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {testimonials.add.isPending ? "…" : "Add"}
            </Button>
          </div>
        </form>
        {(testimonials.data ?? []).length > 0 && (
          <div className="flex flex-col gap-2">
            {(testimonials.data ?? []).map((t: Testimonial, i: number) => (
              <div
                key={t.id}
                data-ocid={`community.testimonial.item.${i + 1}`}
                className="flex items-start justify-between gap-3 bg-muted/20 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    {t.asset && (
                      <span className="text-xs text-muted-foreground">
                        · {t.asset}
                      </span>
                    )}
                    {t.winAmount && (
                      <span className="text-xs text-emerald-500 font-mono">
                        {t.winAmount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {t.content}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => testimonials.remove.mutate(t.id)}
                  className="shrink-0 text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                  data-ocid={`community.testimonial.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Milestones */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Community Milestones
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            {milestones.data?.length ?? 0}
          </span>
        </h4>
        <form
          onSubmit={handleAddMilestone}
          className="flex flex-col gap-3 bg-muted/20 border border-border rounded-lg p-4"
        >
          <p className="text-sm font-semibold text-foreground">Add Milestone</p>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Title *
            </Label>
            <Input
              required
              value={milestoneForm.title}
              onChange={(e) =>
                setMilestoneForm({ ...milestoneForm, title: e.target.value })
              }
              placeholder="1,000 Binance Square Followers"
              data-ocid="community.milestone.title.input"
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Description
              </Label>
              <Input
                value={milestoneForm.description}
                onChange={(e) =>
                  setMilestoneForm({
                    ...milestoneForm,
                    description: e.target.value,
                  })
                }
                placeholder="Community growing strong!"
                data-ocid="community.milestone.description.input"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary shrink-0"
              disabled={milestones.add.isPending}
              data-ocid="community.milestone.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {milestones.add.isPending ? "…" : "Add"}
            </Button>
          </div>
        </form>
        {(milestones.data ?? []).length > 0 && (
          <div className="flex flex-col gap-2">
            {(milestones.data ?? []).map((m: CommunityMilestone, i: number) => (
              <div
                key={m.id}
                data-ocid={`community.milestone.item.${i + 1}`}
                className="flex items-center justify-between gap-3 bg-muted/20 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${m.reached ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                  />
                  <p className="text-sm text-foreground font-medium truncate">
                    {m.title}
                  </p>
                </div>
                {!m.reached && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs text-primary border-primary/30 hover:bg-primary/10"
                    onClick={() =>
                      milestones.markReached.mutate({
                        id: m.id,
                        celebrateDays: 7n,
                      })
                    }
                    data-ocid={`community.milestone.reached_button.${i + 1}`}
                  >
                    Mark Reached
                  </Button>
                )}
                {m.reached && (
                  <Badge
                    className="text-xs bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                    variant="outline"
                  >
                    Reached ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Traders Wall */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Top Traders Wall
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-mono">
            {topTraders.data?.length ?? 0}
          </span>
        </h4>
        <form
          onSubmit={handleAddTrader}
          className="grid sm:grid-cols-2 gap-3 bg-muted/20 border border-border rounded-lg p-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Name *
            </Label>
            <Input
              required
              value={traderForm.name}
              onChange={(e) =>
                setTraderForm({ ...traderForm, name: e.target.value })
              }
              placeholder="Trader name"
              data-ocid="community.trader.name.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Week *
            </Label>
            <Input
              required
              value={traderForm.week}
              onChange={(e) =>
                setTraderForm({ ...traderForm, week: e.target.value })
              }
              placeholder="Week of Jan 15, 2026"
              data-ocid="community.trader.week.input"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Achievement *
            </Label>
            <Input
              required
              value={traderForm.achievement}
              onChange={(e) =>
                setTraderForm({ ...traderForm, achievement: e.target.value })
              }
              placeholder="+340% on BTC/USDT swing trade"
              data-ocid="community.trader.achievement.input"
            />
          </div>
          <div className="sm:col-span-2 flex gap-2 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Bio
              </Label>
              <Input
                value={traderForm.bio}
                onChange={(e) =>
                  setTraderForm({ ...traderForm, bio: e.target.value })
                }
                placeholder="Short bio or quote"
                data-ocid="community.trader.bio.input"
              />
            </div>
            <Button
              type="submit"
              className="btn-primary shrink-0"
              disabled={topTraders.add.isPending}
              data-ocid="community.trader.add.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              {topTraders.add.isPending ? "…" : "Add Trader"}
            </Button>
          </div>
        </form>
        {(topTraders.data ?? []).length > 0 && (
          <div className="flex flex-col gap-2">
            {(topTraders.data ?? []).map((t: TopTrader, i: number) => (
              <div
                key={t.id}
                data-ocid={`community.trader.item.${i + 1}`}
                className="flex items-start justify-between gap-3 bg-muted/20 rounded-lg p-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {t.week}
                    </span>
                  </div>
                  {t.achievement && (
                    <p className="text-xs text-primary mt-0.5 font-mono">
                      {t.achievement}
                    </p>
                  )}
                  {t.bio && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {t.bio}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => topTraders.remove.mutate(t.id)}
                  className="shrink-0 text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                  data-ocid={`community.trader.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Token Launch Content Tab ─────────────────────────────────────────────
function TokenLaunchContentTab({ sessionToken }: { sessionToken: string }) {
  const {
    data: whitepaper,
    isLoading: wpLoading,
    update: updateWp,
  } = useWhitepaper(sessionToken);
  const {
    data: burnSchedule = [],
    isLoading: burnLoading,
    add: addBurn,
    updateStatus,
  } = useBurnSchedule(sessionToken);

  const [wpContent, setWpContent] = useState<WhitepaperContent>({
    title: "DemonZeno (DMNZ) Token — Project Overview",
    updatedAt: BigInt(Date.now()) * 1_000_000n,
    sections: [
      {
        title: "Vision",
        content:
          "DemonZeno is a community-first meme token launched fair on Blum via Telegram.",
      },
      {
        title: "Tokenomics",
        content:
          "100% fair launch. No presale, no allocation, no vesting. Community owns the supply.",
      },
      {
        title: "Roadmap",
        content:
          "2026: Community growth. 2027: DMNZ launch. 2028: Buyback & Burn to trigger bonding curve.",
      },
    ],
  });
  const [burnForm, setBurnForm] = useState({
    date: "",
    amount: "",
    reason: "",
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (whitepaper) setWpContent(whitepaper);
  }, [whitepaper]);

  function updateSection(
    idx: number,
    key: keyof WhitepaperSection,
    value: string,
  ) {
    setWpContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === idx ? { ...s, [key]: value } : s,
      ),
    }));
  }

  function addSection() {
    setWpContent((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "" }],
    }));
  }

  function removeSection(idx: number) {
    setWpContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx),
    }));
  }

  async function handleSaveWp(e: React.FormEvent) {
    e.preventDefault();
    await updateWp.mutateAsync({
      ...wpContent,
      updatedAt: BigInt(Date.now()) * 1_000_000n,
    });
  }

  async function handleAddBurn(e: React.FormEvent) {
    e.preventDefault();
    await addBurn.mutateAsync(burnForm);
    setBurnForm({ date: "", amount: "", reason: "" });
  }

  return (
    <div className="flex flex-col gap-8" data-ocid="admin.token_launch.panel">
      {/* Whitepaper Editor */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Whitepaper / One-Pager
          Editor
        </h4>
        {wpLoading ? (
          <div
            data-ocid="token_launch.whitepaper.loading_state"
            className="h-40 rounded-lg bg-muted/50 animate-pulse"
          />
        ) : (
          <form onSubmit={handleSaveWp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Title
              </Label>
              <Input
                value={wpContent.title}
                onChange={(e) =>
                  setWpContent({ ...wpContent, title: e.target.value })
                }
                data-ocid="token_launch.whitepaper.title.input"
              />
            </div>
            {wpContent.sections.map((section, i) => (
              <div
                key={`section-${section.title || i}`}
                className="flex flex-col gap-2 bg-muted/20 border border-border rounded-lg p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder="Section title"
                    value={section.title}
                    onChange={(e) => updateSection(i, "title", e.target.value)}
                    className="text-sm font-semibold"
                    data-ocid={`token_launch.whitepaper.section_title.input.${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    onClick={() => removeSection(i)}
                    data-ocid={`token_launch.whitepaper.remove_section.${i + 1}`}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <Textarea
                  rows={3}
                  placeholder="Section content…"
                  value={section.content}
                  onChange={(e) => updateSection(i, "content", e.target.value)}
                  data-ocid={`token_launch.whitepaper.section_content.textarea.${i + 1}`}
                />
              </div>
            ))}
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSection}
                data-ocid="token_launch.whitepaper.add_section.button"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Section
              </Button>
              <Button
                type="submit"
                className="btn-primary"
                disabled={updateWp.isPending}
                data-ocid="token_launch.whitepaper.save.primary_button"
              >
                <Save className="w-4 h-4 mr-1" />
                {updateWp.isPending ? "Saving…" : "Save Whitepaper"}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Burn Schedule */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
          <Flame className="w-4 h-4 text-destructive" /> Burn Schedule
        </h4>
        <form
          onSubmit={handleAddBurn}
          className="grid sm:grid-cols-3 gap-3 bg-muted/20 border border-border rounded-lg p-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Date *
            </Label>
            <Input
              required
              value={burnForm.date}
              onChange={(e) =>
                setBurnForm({ ...burnForm, date: e.target.value })
              }
              placeholder="April 2, 2028"
              data-ocid="token_launch.burn.date.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Amount *
            </Label>
            <Input
              required
              value={burnForm.amount}
              onChange={(e) =>
                setBurnForm({ ...burnForm, amount: e.target.value })
              }
              placeholder="500,000,000 DMNZ"
              data-ocid="token_launch.burn.amount.input"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Reason *
            </Label>
            <div className="flex gap-2">
              <Input
                required
                value={burnForm.reason}
                onChange={(e) =>
                  setBurnForm({ ...burnForm, reason: e.target.value })
                }
                placeholder="Q1 Buyback & Burn"
                data-ocid="token_launch.burn.reason.input"
              />
              <Button
                type="submit"
                className="btn-primary shrink-0"
                disabled={addBurn.isPending}
                data-ocid="token_launch.burn.add.primary_button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        {burnLoading ? (
          <div
            data-ocid="token_launch.burn.loading_state"
            className="flex flex-col gap-2"
          >
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-12 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : burnSchedule.length === 0 ? (
          <div
            data-ocid="token_launch.burn.empty_state"
            className="text-center text-muted-foreground py-6"
          >
            <p className="text-sm">No burn entries yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {[
                    "Date",
                    "Amount",
                    "Reason",
                    "Status",
                    "Tx Hash",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-muted-foreground font-medium text-xs uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {burnSchedule.map((entry: BurnScheduleEntry, i: number) => (
                  <tr
                    key={entry.id}
                    data-ocid={`token_launch.burn.item.${i + 1}`}
                    className="border-t border-border"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground">
                      {entry.amount}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      {entry.reason}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${entry.status === "completed" ? "border-emerald-500/30 text-emerald-500" : entry.status === "pending" ? "border-yellow-500/30 text-yellow-500" : "border-border text-muted-foreground"}`}
                      >
                        {entry.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {entry.txHash ? `${entry.txHash.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        disabled={updatingId === entry.id}
                        onClick={async () => {
                          setUpdatingId(entry.id);
                          await updateStatus.mutateAsync({
                            id: entry.id,
                            status: "completed",
                            txHash: null,
                          });
                          setUpdatingId(null);
                        }}
                        data-ocid={`token_launch.burn.complete_button.${i + 1}`}
                      >
                        {updatingId === entry.id ? "…" : "Mark Done"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Command Console Tab ────────────────────────────────────────────
interface ConsoleEntry {
  input: string;
  output: string;
  ts: Date;
  ok: boolean;
}

function AdminConsoleTab({ sessionToken }: { sessionToken: string }) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ConsoleEntry[]>([]);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const HELP = `Available commands:
  maintenance on [message]  — Enable maintenance mode
  maintenance off           — Disable maintenance mode
  push [title] | [body]     — Send push notification
  mood [bullish|bearish|neutral|warning] [message]  — Set market mood banner
  publish                   — Publish all scheduled signals
  snapshot [label]          — Create audit snapshot
  help                      — Show this message`;

  async function runCommand(
    cmd: string,
  ): Promise<{ output: string; ok: boolean }> {
    const parts = cmd.trim();
    if (!actor) return { output: "Error: actor not ready", ok: false };

    if (parts === "help") return { output: HELP, ok: true };

    if (parts === "publish") {
      const count = await actor.publishScheduledSignals();
      qc.invalidateQueries({ queryKey: ["signals"] });
      return {
        output: `Published ${String(count)} scheduled signal(s)`,
        ok: true,
      };
    }

    if (parts.startsWith("snapshot ")) {
      const label = parts.slice(9).trim();
      if (!label) return { output: "Usage: snapshot [label]", ok: false };
      const r = await actor.createAuditSnapshot(label, sessionToken);
      if (r.__kind__ === "ok")
        return { output: `Snapshot created: "${label}"`, ok: true };
      return { output: `Error: ${r.err}`, ok: false };
    }

    if (parts.startsWith("maintenance ")) {
      const rest = parts.slice(12).trim();
      if (rest === "off") {
        const r = await actor.setMaintenanceMode(false, "", sessionToken);
        if (r.__kind__ === "ok") {
          qc.invalidateQueries({ queryKey: ["maintenanceMode"] });
          return { output: "Maintenance mode disabled", ok: true };
        }
        return { output: `Error: ${r.err}`, ok: false };
      }
      if (rest.startsWith("on")) {
        const msg =
          rest.slice(2).trim() || "Site is under maintenance. Back shortly.";
        const r = await actor.setMaintenanceMode(true, msg, sessionToken);
        if (r.__kind__ === "ok") {
          qc.invalidateQueries({ queryKey: ["maintenanceMode"] });
          return { output: `Maintenance enabled: "${msg}"`, ok: true };
        }
        return { output: `Error: ${r.err}`, ok: false };
      }
      return {
        output: "Usage: maintenance on [message] OR maintenance off",
        ok: false,
      };
    }

    if (parts.startsWith("push ")) {
      const rest = parts.slice(5);
      const pipeIdx = rest.indexOf("|");
      if (pipeIdx === -1)
        return { output: "Usage: push [title] | [body]", ok: false };
      const title = rest.slice(0, pipeIdx).trim();
      const body = rest.slice(pipeIdx + 1).trim();
      if (!title || !body)
        return { output: "Both title and body are required", ok: false };
      const r = await actor.createPushNotification(title, body, sessionToken);
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["pushNotifications"] });
        return { output: `Push notification sent: "${title}"`, ok: true };
      }
      return { output: `Error: ${r.err}`, ok: false };
    }

    if (parts.startsWith("mood ")) {
      const rest = parts.slice(5).trim();
      const moodMatch = rest.match(
        /^(bullish|bearish|neutral|warning)\s*(.*)/i,
      );
      if (!moodMatch)
        return {
          output: "Usage: mood [bullish|bearish|neutral|warning] [message]",
          ok: false,
        };
      const moodVal = moodMatch[1].toLowerCase();
      const msg = moodMatch[2].trim() || `Market is ${moodVal}`;
      const r = await actor.setMarketMoodBanner(moodVal, msg, sessionToken);
      if (r.__kind__ === "ok") {
        qc.invalidateQueries({ queryKey: ["marketMoodBanner"] });
        return { output: `Market mood set to ${moodVal}: "${msg}"`, ok: true };
      }
      return { output: `Error: ${r.err}`, ok: false };
    }

    return {
      output: `Unknown command: "${cmd.split(" ")[0]}". Type "help" for available commands.`,
      ok: false,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || running) return;
    const cmd = input.trim();
    setInput("");
    setRunning(true);
    const result = await runCommand(cmd);
    setRunning(false);
    setHistory((prev) => [
      ...prev,
      { input: cmd, output: result.output, ts: new Date(), ok: result.ok },
    ]);
    setTimeout(
      () =>
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        }),
      50,
    );
  }

  return (
    <div className="flex flex-col gap-4" data-ocid="admin.console.panel">
      <h3 className="font-display font-semibold text-foreground text-lg flex items-center gap-2">
        <Code2 className="w-5 h-5 text-primary" /> Admin Command Console
      </h3>

      <div
        ref={scrollRef}
        className="bg-[hsl(var(--background))] border border-border rounded-xl p-4 font-mono text-sm min-h-[280px] max-h-[400px] overflow-y-auto flex flex-col gap-1"
        data-ocid="admin.console.panel"
      >
        <p className="text-primary mb-2 text-xs">
          DemonZeno Admin Console v1.0 — type "help" for commands
        </p>
        {history.length === 0 && (
          <p className="text-muted-foreground/50 text-xs">
            No commands yet. Try: <span className="text-primary">help</span>
          </p>
        )}
        {history.map((h) => (
          <div
            key={`${h.ts.getTime()}-${h.input}`}
            className="flex flex-col gap-0.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-primary shrink-0">$</span>
              <span className="text-foreground">{h.input}</span>
              <span className="text-muted-foreground/50 text-xs ml-auto shrink-0">
                {h.ts.toLocaleTimeString()}
              </span>
            </div>
            <pre
              className={`pl-4 text-xs whitespace-pre-wrap ${h.ok ? "text-muted-foreground" : "text-destructive"}`}
            >
              {h.output}
            </pre>
          </div>
        ))}
        {running && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-primary">$</span>
            <span className="animate-pulse">Running…</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex items-center flex-1 bg-card border border-border rounded-lg px-3">
          <span className="text-primary font-mono text-sm mr-2">$</span>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command… (help for list)"
            className="border-0 bg-transparent font-mono text-sm p-0 h-10 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={running}
            data-ocid="admin.console.input"
            autoComplete="off"
          />
        </div>
        <Button
          type="submit"
          className="btn-primary shrink-0"
          disabled={running || !input.trim()}
          data-ocid="admin.console.submit_button"
        >
          Run
        </Button>
      </form>

      <div className="bg-muted/20 border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Quick reference:</strong>{" "}
          <code className="bg-muted px-1 rounded text-primary">
            maintenance on/off
          </code>{" "}
          <code className="bg-muted px-1 rounded text-primary">
            push title | body
          </code>{" "}
          <code className="bg-muted px-1 rounded text-primary">
            mood bullish/bearish
          </code>{" "}
          <code className="bg-muted px-1 rounded text-primary">publish</code>{" "}
          <code className="bg-muted px-1 rounded text-primary">
            snapshot label
          </code>
        </p>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────
export function AdminDashboard() {
  const { sessionToken, clearSession } = useSession();
  const { actor } = useActor(createActor);
  const navigate = useNavigate();

  async function handleLogout() {
    if (actor && sessionToken) await actor.invalidateSession(sessionToken);
    clearSession();
    navigate({ to: "/" });
  }

  if (!sessionToken) return null;

  const TABS = [
    { value: "signals", icon: TrendingUp, label: "Signals" },
    { value: "scheduling", icon: CalendarClock, label: "Schedule" },
    { value: "stats", icon: BarChart3, label: "Win Rate" },
    { value: "analytics", icon: BarChart3, label: "Analytics" },
    { value: "faq", icon: HelpCircle, label: "FAQ" },
    { value: "notify", icon: Users, label: "Notify Me" },
    { value: "announcements", icon: Bell, label: "Announce" },
    { value: "audit", icon: ClipboardList, label: "Audit Log" },
    { value: "sotd", icon: Star, label: "Signal Day" },
    { value: "sentiment", icon: Globe, label: "Sentiment" },
    { value: "content", icon: FileText, label: "Content" },
    { value: "push", icon: Bell, label: "Push" },
    { value: "performance", icon: BarChart3, label: "Performance" },
    { value: "mood", icon: Sparkles, label: "Mood" },
    { value: "maintenance", icon: WrenchIcon, label: "Maintenance" },
    { value: "abtests", icon: TestTube2, label: "A/B Tests" },
    { value: "snapshots", icon: ClipboardList, label: "Snapshots" },
    { value: "heatmap", icon: Activity, label: "Heatmap" },
    { value: "roles", icon: ShieldCheck, label: "Roles" },
    { value: "community", icon: Users, label: "Community" },
    { value: "token", icon: Flame, label: "Token" },
    { value: "console", icon: Code2, label: "Console" },
  ] as const;

  return (
    <div className="min-h-screen bg-background" data-ocid="admin.page">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-subtle">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              Admin Dashboard
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono hidden sm:inline">
              DemonZeno
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs text-muted-foreground hidden sm:block">
                Session active
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.logout.button"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <h2 className="font-display font-bold text-2xl text-foreground">
            Control Panel
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage signals, scheduling, stats, analytics, FAQs, announcements,
            and market sentiment.
          </p>
        </div>

        <Tabs defaultValue="signals" data-ocid="admin.tabs">
          <TabsList className="w-full mb-6 flex flex-wrap h-auto gap-1 bg-card border border-border p-1 rounded-xl">
            {TABS.map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                data-ocid={`admin.${value}.tab`}
                className="font-medium flex items-center gap-1.5 flex-1 sm:flex-none"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden text-xs">{label.split(" ")[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="signals">
            <SignalsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="scheduling">
            <SchedulingTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="faq">
            <FaqTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="notify">
            <NotifyMeTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="announcements">
            <AnnouncementsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="audit">
            <AuditLogTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="sotd">
            <SignalOfTheDayTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="sentiment">
            <MarketSentimentTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="content">
            <ContentTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="push">
            <PushNotificationsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="performance">
            <SignalPerformanceTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="mood">
            <MarketMoodBannerTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="maintenance">
            <MaintenanceModeTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="abtests">
            <AbTestingTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="snapshots">
            <AuditSnapshotsTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="heatmap">
            <ActivityHeatmapTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="roles">
            <AdminRolesTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="community">
            <CommunityContentTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="token">
            <TokenLaunchContentTab sessionToken={sessionToken} />
          </TabsContent>
          <TabsContent value="console">
            <AdminConsoleTab sessionToken={sessionToken} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
