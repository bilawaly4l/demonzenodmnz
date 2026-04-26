import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useActor } from "@caffeineai/core-infrastructure";
import { Lock, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { createActor } from "../backend";

const TRIGGER_PHRASE = "DemonZeno: Master the Chaos";

interface AdminPasscodeModalProps {
  onSuccess: (token: string) => void;
}

export function AdminPasscodeModal({ onSuccess }: AdminPasscodeModalProps) {
  const [phraseInput, setPhraseInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { actor } = useActor(createActor);
  const phraseRef = useRef<HTMLInputElement>(null);

  function handlePhraseKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && phraseInput.trim() === TRIGGER_PHRASE) {
      setShowModal(true);
      setPhraseInput("");
    }
  }

  async function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !passcode) return;
    setError("");
    setLoading(true);
    try {
      const result = await actor.validatePasscode(passcode);
      if (result.__kind__ === "ok") {
        setShowModal(false);
        setPasscode("");
        onSuccess(result.ok);
      } else {
        setError("Invalid passcode. Access denied.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hidden phrase trigger in footer — visually invisible but accessible */}
      <input
        ref={phraseRef}
        type="text"
        value={phraseInput}
        onChange={(e) => setPhraseInput(e.target.value)}
        onKeyDown={handlePhraseKey}
        aria-label="Admin access"
        autoComplete="off"
        className="opacity-0 absolute w-1 h-1 pointer-events-none"
        tabIndex={-1}
        data-ocid="admin.phrase.input"
        id="admin-phrase-trigger"
      />

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowModal(false);
            setPasscode("");
            setError("");
          }
        }}
      >
        <DialogContent
          data-ocid="admin.dialog"
          className="bg-card border-border max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-foreground">
              <Lock className="w-5 h-5 text-primary" />
              Admin Access
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handlePasscodeSubmit}
            className="flex flex-col gap-4 pt-2"
          >
            <p className="text-sm text-muted-foreground">
              Enter your passcode to continue.
            </p>
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                placeholder="Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                data-ocid="admin.passcode.input"
                autoFocus
                className="bg-secondary border-input font-mono"
              />
              {error && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="admin.passcode.error_state"
                >
                  {error}
                </p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                data-ocid="admin.passcode.cancel_button"
                onClick={() => {
                  setShowModal(false);
                  setPasscode("");
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="admin.passcode.submit_button"
                disabled={loading || !passcode}
                className="btn-primary"
              >
                {loading ? (
                  "Verifying…"
                ) : (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Enter
                  </span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
