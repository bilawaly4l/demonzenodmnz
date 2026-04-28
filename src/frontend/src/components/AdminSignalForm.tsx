import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Save, X } from "lucide-react";
import { useState } from "react";
import {
  Confidence as ConfEnum,
  Direction as DirEnum,
  MarketType as MktEnum,
  Timeframe as TfEnum,
} from "../backend";
import type {
  Confidence,
  Direction,
  MarketType,
  SignalTemplate,
  Timeframe,
} from "../types";

export interface SignalFormState {
  asset: string;
  marketType: MarketType;
  direction: Direction;
  entryPrice: string;
  tp1: string;
  tp2: string;
  tp3: string;
  targetPrice: string;
  stopLoss: string;
  notes: string;
  confidence: Confidence;
  sourceLabel: string;
  providerLabel: string;
  timeframe: Timeframe;
  isDraft: boolean;
  publishAt: string; // datetime-local string
  expiry: string; // datetime-local string (optional)
  tags: string[];
}

export const emptySignalForm: SignalFormState = {
  asset: "",
  marketType: MktEnum.Crypto as MarketType,
  direction: DirEnum.Buy as Direction,
  entryPrice: "",
  tp1: "",
  tp2: "",
  tp3: "",
  targetPrice: "",
  stopLoss: "",
  notes: "",
  confidence: ConfEnum.Medium as Confidence,
  sourceLabel: "",
  providerLabel: "",
  timeframe: TfEnum.Swing as Timeframe,
  isDraft: false,
  publishAt: "",
  expiry: "",
  tags: [],
};

interface AdminSignalFormProps {
  form: SignalFormState;
  onChange: (form: SignalFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  saving: boolean;
  templates?: SignalTemplate[];
}

const DIFFICULTY_TAGS = ["scalp", "swing", "long-term", "high-risk", "safe"];

export function AdminSignalForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  saving,
  templates = [],
}: AdminSignalFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  function set(patch: Partial<SignalFormState>) {
    onChange({ ...form, ...patch });
  }

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t || form.tags.includes(t)) return;
    set({ tags: [...form.tags, t] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    set({ tags: form.tags.filter((t) => t !== tag) });
  }

  function loadTemplate(tmpl: SignalTemplate) {
    set({
      asset: tmpl.asset,
      marketType: tmpl.marketType,
      direction: tmpl.direction,
      notes: tmpl.notes,
      confidence: tmpl.confidence,
      timeframe: tmpl.timeframe,
    });
    setShowTemplates(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-muted/30 border border-border rounded-xl p-5"
    >
      {/* Template picker */}
      {templates.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Quick Templates
            </Label>
            <button
              type="button"
              onClick={() => setShowTemplates((v) => !v)}
              className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              data-ocid="signal_form.templates.toggle"
            >
              <FileText className="w-3 h-3" />
              {showTemplates ? "Hide" : `Load Template (${templates.length})`}
            </button>
          </div>
          {showTemplates && (
            <div
              className="flex flex-col gap-1 max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-background"
              data-ocid="signal_form.templates.panel"
            >
              {templates.map((tmpl, i) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => loadTemplate(tmpl)}
                  data-ocid={`signal_form.template.item.${i + 1}`}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/60 transition-colors text-left"
                >
                  <span className="text-sm font-medium text-foreground">
                    {tmpl.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {tmpl.asset} · {tmpl.marketType}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Asset */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Asset Name *
          </Label>
          <Input
            required
            value={form.asset}
            onChange={(e) => set({ asset: e.target.value })}
            placeholder="BTC/USDT, EUR/USD, AAPL…"
            data-ocid="signal_form.asset.input"
          />
        </div>

        {/* Market Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Market Type *
          </Label>
          <Select
            value={form.marketType}
            onValueChange={(v) => set({ marketType: v as MarketType })}
          >
            <SelectTrigger data-ocid="signal_form.market_type.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Forex">Forex</SelectItem>
              <SelectItem value="Stock">Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Direction */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Direction *
          </Label>
          <Select
            value={form.direction}
            onValueChange={(v) => set({ direction: v as Direction })}
          >
            <SelectTrigger data-ocid="signal_form.direction.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">BUY</SelectItem>
              <SelectItem value="Sell">SELL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Entry Price */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Entry Price *
          </Label>
          <Input
            required
            value={form.entryPrice}
            onChange={(e) => set({ entryPrice: e.target.value })}
            placeholder="e.g. 42000"
            data-ocid="signal_form.entry_price.input"
          />
        </div>

        {/* Stop Loss */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Stop Loss *
          </Label>
          <Input
            required
            value={form.stopLoss}
            onChange={(e) => set({ stopLoss: e.target.value })}
            placeholder="e.g. 40000"
            data-ocid="signal_form.stop_loss.input"
          />
        </div>

        {/* TP1 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Take Profit 1 *
          </Label>
          <Input
            required
            value={form.tp1}
            onChange={(e) => set({ tp1: e.target.value })}
            placeholder="TP1 e.g. 44000"
            data-ocid="signal_form.tp1.input"
          />
        </div>

        {/* TP2 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Take Profit 2
          </Label>
          <Input
            value={form.tp2}
            onChange={(e) => set({ tp2: e.target.value })}
            placeholder="TP2 e.g. 46000"
            data-ocid="signal_form.tp2.input"
          />
        </div>

        {/* TP3 */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Take Profit 3
          </Label>
          <Input
            value={form.tp3}
            onChange={(e) => set({ tp3: e.target.value })}
            placeholder="TP3 e.g. 48000"
            data-ocid="signal_form.tp3.input"
          />
        </div>

        {/* Target Price (legacy) */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Target Price *
          </Label>
          <Input
            required
            value={form.targetPrice}
            onChange={(e) => set({ targetPrice: e.target.value })}
            placeholder="Primary target e.g. 45000"
            data-ocid="signal_form.target_price.input"
          />
        </div>

        {/* Timeframe */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Timeframe *
          </Label>
          <Select
            value={form.timeframe}
            onValueChange={(v) => set({ timeframe: v as Timeframe })}
          >
            <SelectTrigger data-ocid="signal_form.timeframe.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scalp">Scalp</SelectItem>
              <SelectItem value="Swing">Swing</SelectItem>
              <SelectItem value="LongTerm">Long-Term</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Confidence *
          </Label>
          <Select
            value={form.confidence}
            onValueChange={(v) => set({ confidence: v as Confidence })}
          >
            <SelectTrigger data-ocid="signal_form.confidence.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Source Label */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Source Label
          </Label>
          <Input
            value={form.sourceLabel}
            onChange={(e) => set({ sourceLabel: e.target.value })}
            placeholder="Technical Analysis"
            data-ocid="signal_form.source_label.input"
          />
        </div>

        {/* Provider Label */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Provider Label
          </Label>
          <Input
            value={form.providerLabel}
            onChange={(e) => set({ providerLabel: e.target.value })}
            placeholder="DemonZeno AI"
            data-ocid="signal_form.provider_label.input"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Notes (optional)
          </Label>
          <Input
            value={form.notes}
            onChange={(e) => set({ notes: e.target.value })}
            placeholder="Optional reasoning or notes…"
            data-ocid="signal_form.notes.input"
          />
        </div>

        {/* Tags */}
        <div className="sm:col-span-2 flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Tags (optional)
          </Label>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  form.tags.includes(tag) ? removeTag(tag) : addTag(tag)
                }
                data-ocid={`signal_form.tag.${tag}`}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                  form.tags.includes(tag)
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {form.tags
                .filter((t) => !DIFFICULTY_TAGS.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs flex items-center gap-1 border-primary/30 text-primary"
                    data-ocid={`signal_form.tag_badge.${tag}`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-destructive transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="Custom tag + Enter"
              className="h-8 text-xs"
              data-ocid="signal_form.tag_input.input"
            />
          </div>
        </div>

        {/* Expiry */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">
            Expiry (optional)
          </Label>
          <Input
            type="datetime-local"
            value={form.expiry}
            onChange={(e) => set({ expiry: e.target.value })}
            data-ocid="signal_form.expiry.input"
          />
        </div>

        {/* Draft checkbox */}
        <div className="flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              id="isDraft"
              checked={form.isDraft}
              onCheckedChange={(v) => set({ isDraft: !!v })}
              data-ocid="signal_form.is_draft.checkbox"
            />
            <Label
              htmlFor="isDraft"
              className="text-sm font-medium cursor-pointer"
            >
              Save as Draft
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Drafts won't appear publicly until published.
          </p>
        </div>

        {/* Publish At (only if isDraft) */}
        {form.isDraft && (
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase tracking-wide">
              Scheduled Publish Date/Time
            </Label>
            <Input
              type="datetime-local"
              value={form.publishAt}
              onChange={(e) => set({ publishAt: e.target.value })}
              data-ocid="signal_form.publish_at.input"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to publish manually from the Scheduling tab.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="signal_form.cancel_button"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="btn-primary btn-micro"
          data-ocid="signal_form.submit_button"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
