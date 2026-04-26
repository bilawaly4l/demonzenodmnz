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
import { useState } from "react";
import { createActor } from "../backend";

interface AdminPasscodeModalProps {
  open: boolean;
  onSuccess: (token: string) => void;
  onClose: () => void;
}

export function AdminPasscodeModal({
  open,
  onSuccess,
  onClose,
}: AdminPasscodeModalProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { actor } = useActor(createActor);

  function handleClose() {
    setPasscode("");
    setError("");
    onClose();
  }

  async function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !passcode) return;
    setError("");
    setLoading(true);
    try {
      const result = await actor.validatePasscode(passcode);
      if (result.__kind__ === "ok") {
        setPasscode("");
        onSuccess(result.ok);
      } else {
        setError("Invalid code");
        setPasscode("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
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
              onChange={(e) => {
                setPasscode(e.target.value);
                setError("");
              }}
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
              onClick={handleClose}
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
  );
}
