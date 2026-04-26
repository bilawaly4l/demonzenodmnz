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
import { Save, X } from "lucide-react";
import {
  Confidence as ConfEnum,
  Direction as DirEnum,
  MarketType as MktEnum,
  Timeframe as TfEnum,
} from "../backend";
import type { Confidence, Direction, MarketType, Timeframe } from "../types";

export interface SignalFormState {
  asset: string;
  marketType: MarketType;
  direction: Direction;
  entryPrice: string;
  targetPrice: string;
  stopLoss: string;
  notes: string;
  confidence: Confidence;
  sourceLabel: string;
  timeframe: Timeframe;
  isDraft: boolean;
  publishAt: string; // datetime-local string
  expiry: string; // datetime-local string (optional)
}

export const emptySignalForm: SignalFormState = {
  asset: "",
  marketType: MktEnum.Crypto as MarketType,
  direction: DirEnum.Buy as Direction,
  entryPrice: "",
  targetPrice: "",
  stopLoss: "",
  notes: "",
  confidence: ConfEnum.Medium as Confidence,
  sourceLabel: "",
  timeframe: TfEnum.Swing as Timeframe,
  isDraft: false,
  publishAt: "",
  expiry: "",
};

interface AdminSignalFormProps {
  form: SignalFormState;
  onChange: (form: SignalFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  saving: boolean;
}

export function AdminSignalForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  saving,
}: AdminSignalFormProps) {
  function set(patch: Partial<SignalFormState>) {
    onChange({ ...form, ...patch });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 border border-border rounded-xl p-5"
    >
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

      {/* Target Price */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Target Price *
        </Label>
        <Input
          required
          value={form.targetPrice}
          onChange={(e) => set({ targetPrice: e.target.value })}
          placeholder="e.g. 45000"
          data-ocid="signal_form.target_price.input"
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
      <div className="sm:col-span-2 flex flex-col gap-1.5">
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

      {/* Notes */}
      <div className="sm:col-span-2 flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Notes (optional)
        </Label>
        <Input
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
          placeholder="Optional notes…"
          data-ocid="signal_form.notes.input"
        />
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
          Drafts won't appear on the public site until published.
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

      {/* Actions */}
      <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
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
          className="btn-primary"
          data-ocid="signal_form.submit_button"
        >
          <Save className="w-4 h-4 mr-1" />
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
