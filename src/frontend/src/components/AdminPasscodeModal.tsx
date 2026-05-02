import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Shield, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../contexts/SessionContext";

interface AdminPasscodeModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminPasscodeModal({
  open,
  onSuccess,
  onClose,
}: AdminPasscodeModalProps) {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { submitPasscode } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleClose() {
    setPasscode("");
    setError("");
    setShowPasscode(false);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode) return;
    setError("");

    const success = submitPasscode(passcode);
    if (success) {
      setPasscode("");
      setShowPasscode(false);
      onSuccess();
    } else {
      setError("Access Denied — Invalid passcode");
      setPasscode("");
      setShake(true);
      setTimeout(() => setShake(false), 600);
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
        className={`bg-card border-border max-w-sm ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-foreground">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            Admin Access
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground font-display">
              DemonZeno Command Center
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter the master passcode to proceed
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Input
                ref={inputRef}
                type={showPasscode ? "text" : "password"}
                placeholder="Enter passcode…"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                data-ocid="admin.passcode.input"
                className="bg-secondary border-input font-mono pr-10"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowPasscode((v) => !v)}
                data-ocid="admin.passcode.show_toggle"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              >
                {showPasscode ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <div
                className="flex items-center gap-1.5 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2"
                data-ocid="admin.passcode.error_state"
              >
                <Shield className="w-3.5 h-3.5 text-destructive shrink-0" />
                <p className="text-destructive text-xs font-medium">{error}</p>
              </div>
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
              disabled={!passcode}
              className="btn-primary btn-micro"
            >
              <Zap className="w-3.5 h-3.5 mr-1" /> Unlock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
