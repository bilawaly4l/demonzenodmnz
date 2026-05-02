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
      toast.error("Failed to copy \u2014 please copy manually.");
    }
  }

  return (
    <div
      data-ocid="study-share.dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      aria-modal="true"
      aria-label="Share your progress"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-yellow-500/30 bg-gray-900 shadow-2xl p-6 flex flex-col gap-5">
        {/* Close */}
        <button
          type="button"
          aria-label="Close share panel"
          data-ocid="study-share.close_button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-yellow-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">
              Share Your Progress
            </h2>
            <p className="text-gray-400 text-xs">
              Generate a read-only link \u2014 no personal info shared
            </p>
          </div>
        </div>

        {/* Progress preview */}
        <div className="rounded-xl border border-gray-700/60 bg-gray-800/60 p-4 flex flex-col gap-3">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold">
            What recipients will see
          </p>

          {tiersCompleted.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tiersCompleted.map((tier) => (
                <span
                  key={tier}
                  className="rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs px-2.5 py-0.5 font-semibold"
                >
                  \u2713 {tier}
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
                  <span className="text-[10px] text-gray-500 max-w-[60px] truncate text-center">
                    {lesson}
                  </span>
                </div>
              ))}
            </div>
          )}

          {certificatesEarned.length > 0 && (
            <p className="text-yellow-400/70 text-xs">
              \ud83c\udfc5 {certificatesEarned.length} certificate
              {certificatesEarned.length !== 1 ? "s" : ""} earned
            </p>
          )}
        </div>

        {shareUrl && (
          <div
            data-ocid="study-share.success_state"
            className="flex items-center gap-2"
          >
            <input
              readOnly
              value={shareUrl}
              className="flex-1 min-w-0 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 text-xs px-3 py-2 font-mono focus:outline-none focus:border-yellow-500/50"
              aria-label="Shareable progress URL"
              data-ocid="study-share.input"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              data-ocid="study-share.copy_button"
              onClick={handleCopy}
              aria-label="Copy link"
              className="shrink-0 rounded-lg bg-yellow-500/15 border border-yellow-500/30 hover:bg-yellow-500/25 text-yellow-400 p-2 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {isError && !shareUrl && (
          <p
            data-ocid="study-share.error_state"
            className="text-red-400 text-xs"
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
            className="w-full rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-gray-900 font-bold text-sm py-2.5 transition-colors flex items-center justify-center gap-2"
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
                Generating\u2026
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
            className="w-full rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-semibold text-sm py-2.5 transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
