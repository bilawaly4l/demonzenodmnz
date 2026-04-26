import { useActor } from "@caffeineai/core-infrastructure";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createActor } from "../backend";
import type { PushNotification } from "../types";

const AUTO_DISMISS_MS = 8000;

export function PushNotificationDisplay() {
  const { actor, isFetching } = useActor(createActor);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const fetchNotifications = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const result = await actor.getActivePushNotifications();
      setNotifications(result as PushNotification[]);
    } catch {
      // Non-blocking
    }
  }, [actor, isFetching]);

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Auto-dismiss timers
  useEffect(() => {
    const existing = new Set(timers.current.keys());

    for (const notif of notifications) {
      if (!dismissed.has(notif.id) && !existing.has(notif.id)) {
        const t = setTimeout(() => {
          handleDismiss(notif.id);
        }, AUTO_DISMISS_MS);
        timers.current.set(notif.id, t);
      }
    }

    return () => {
      // Cleanup handled per dismiss
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, dismissed]);

  const handleDismiss = useCallback(
    (id: string) => {
      setDismissed((prev) => new Set([...prev, id]));
      const t = timers.current.get(id);
      if (t) {
        clearTimeout(t);
        timers.current.delete(id);
      }
      // Best-effort dismiss on backend
      if (actor) {
        actor.dismissPushNotification(id).catch(() => {});
      }
    },
    [actor],
  );

  const visible = notifications.filter((n) => n.active && !dismissed.has(n.id));

  if (visible.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 9990,
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem",
        maxWidth: 360,
        width: "calc(100vw - 2rem)",
        pointerEvents: "none",
      }}
    >
      {visible.map((notif) => (
        <NotificationCard
          key={notif.id}
          notification={notif}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}

interface NotificationCardProps {
  notification: PushNotification;
  onDismiss: (id: string) => void;
}

function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  return (
    <div
      role="alert"
      data-ocid="push_notification.toast"
      style={{
        pointerEvents: "all",
        borderRadius: "0.75rem",
        border: "1px solid oklch(0.65 0.15 190 / 0.3)",
        background:
          "linear-gradient(135deg, oklch(0.18 0.01 260 / 0.98) 0%, oklch(0.22 0.01 260 / 0.98) 100%)",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 8px 32px oklch(0 0 0 / 0.4), 0 0 0 1px oklch(0.65 0.15 190 / 0.1)",
        padding: "0.875rem 1rem",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
        animation: "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {/* Teal accent dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "oklch(0.65 0.15 190)",
          flexShrink: 0,
          marginTop: "0.3rem",
          boxShadow: "0 0 8px oklch(0.65 0.15 190 / 0.6)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "oklch(0.95 0.005 260)",
            margin: 0,
            fontFamily: "var(--font-display, 'Space Grotesk', sans-serif)",
            lineHeight: 1.3,
          }}
        >
          {notification.title}
        </p>
        {notification.body && (
          <p
            style={{
              fontSize: "0.8rem",
              color: "oklch(0.7 0.01 260)",
              margin: "0.25rem 0 0",
              lineHeight: 1.5,
              fontFamily: "var(--font-body, 'Satoshi', sans-serif)",
            }}
          >
            {notification.body}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        data-ocid="push_notification.close_button"
        aria-label="Dismiss notification"
        style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "1px solid oklch(0.35 0.01 260)",
          background: "oklch(0.25 0.02 260)",
          color: "oklch(0.55 0.01 260)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "oklch(0.35 0.02 260)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "oklch(0.85 0.005 260)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "oklch(0.25 0.02 260)";
          (e.currentTarget as HTMLButtonElement).style.color =
            "oklch(0.55 0.01 260)";
        }}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}
