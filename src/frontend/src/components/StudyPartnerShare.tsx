import { Check, Copy, Share2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGenerateShareLink } from "../hooks/useLearningScience";
import { MasteryScoreBadge } from "./MasteryScoreBadge";

interface StudyPartnerShareProps {
  tiersCompleted: string[];
  certificatesEarned: string[];
  masteryLevels: [string, number][];
  onClose: () => void;
}

export function StudyPartnerShare({
  tiersCompleted,
  certificatesEarned,
  masteryLevels,
  onClose,
}: StudyPartnerShareProps) {
  const { mutateAsync: generate, isPending, isError } = useGenerateShareLink();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    try {
      const token = await generate({
        tiersCompleted,
        certificatesEarned,
        masteryLevels,
      });
      const url = `${window.location.origin}/verify?share=${token}`;
      setShareUrl(url);
    } catch {
      /* error shown via isError */
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy — please copy manually.");
    }
  }

  return (
    <div
      data-ocid="study-share.dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      aria-modal="true"
      aria-label="Share your progress"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-card shadow-2xl p-6 flex flex-col gap-5">
        {/* Close */}
        <button
          type="button"
          aria-label="Close share panel"
          data-ocid="study-share.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground font-bold text-base">
              Share Your Progress
            </h2>
            <p className="text-muted-foreground text-xs">
              Generate a read-only link — no personal info shared
            </p>
          </div>
        </div>

        {/* Progress preview */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col gap-3">
          <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">
            What recipients will see
          </p>

          {tiersCompleted.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tiersCompleted.map((tier) => (
                <span
                  key={tier}
                  className="rounded-full bg-primary/15 border border-primary/30 text-primary text-xs px-2.5 py-0.5 font-semibold"
                >
                  ✓ {tier}
                </span>
              ))}
            </div>
          )}

          {masteryLevels.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {masteryLevels.map(([lesson, pct]) => (
                <div
                  key={lesson}
                  className="flex flex-col items-center gap-0.5"
                >
                  <MasteryScoreBadge
                    masteryPct={pct * 100}
                    size="sm"
                    showLabel={false}
                  />
                  <span className="text-[10px] text-muted-foreground max-w-[60px] truncate text-center">
                    {lesson}
                  </span>
                </div>
              ))}
            </div>
          )}

          {certificatesEarned.length > 0 && (
            <p className="text-primary/70 text-xs">
              🏅 {certificatesEarned.length} certificate
              {certificatesEarned.length !== 1 ? "s" : ""} earned
            </p>
          )}

          {tiersCompleted.length === 0 &&
            masteryLevels.length === 0 &&
            certificatesEarned.length === 0 && (
              <p className="text-muted-foreground text-xs italic">
                Complete some lessons to share your progress.
              </p>
            )}
        </div>

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
          <span className="font-semibold text-foreground">Privacy:</span> Your
          name, certificate details, and personal information are never shared —
          only your tier badges, mastery scores, and lesson streak.
        </p>

        {shareUrl && (
          <div
            data-ocid="study-share.success_state"
            className="flex items-center gap-2"
          >
            <input
              readOnly
              value={shareUrl}
              className="flex-1 min-w-0 rounded-lg border border-border bg-muted/40 text-foreground text-xs px-3 py-2 font-mono focus:outline-none focus:border-primary/50"
              aria-label="Shareable progress URL"
              data-ocid="study-share.input"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              data-ocid="study-share.copy_button"
              onClick={handleCopy}
              aria-label="Copy link"
              className="shrink-0 rounded-lg bg-primary/15 border border-primary/30 hover:bg-primary/25 text-primary p-2 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[oklch(0.7_0.18_145)]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {isError && !shareUrl && (
          <p
            data-ocid="study-share.error_state"
            className="text-destructive text-xs"
          >
            Failed to generate link. Please try again.
          </p>
        )}

        {!shareUrl && (
          <button
            type="button"
            data-ocid="study-share.primary_button"
            onClick={handleGenerate}
            disabled={isPending}
            className="w-full rounded-xl bg-primary hover:opacity-90 disabled:opacity-60 text-primary-foreground font-bold text-sm py-2.5 transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Generate Share Link
              </>
            )}
          </button>
        )}

        {shareUrl && (
          <button
            type="button"
            data-ocid="study-share.secondary_button"
            onClick={onClose}
            className="w-full rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 font-semibold text-sm py-2.5 transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
