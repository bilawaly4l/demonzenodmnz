import { ExternalLink, Megaphone, X } from "lucide-react";
import { useState } from "react";
import { useAnnouncement } from "../hooks/useAnnouncement";

export function AnnouncementBanner() {
  const { data: announcement } = useAnnouncement();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !announcement || !announcement.isActive) return null;

  return (
    <div
      data-ocid="announcement.panel"
      className="w-full bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between gap-3 animate-slide-down"
      role="banner"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Megaphone className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium truncate">
          {announcement.text}
        </span>
        {announcement.link && (
          <a
            href={announcement.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-xs underline hover:no-underline opacity-90 hover:opacity-100"
          >
            Learn more <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <button
        type="button"
        data-ocid="announcement.close_button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="shrink-0 p-1 rounded hover:bg-primary-foreground/10 transition-smooth"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
