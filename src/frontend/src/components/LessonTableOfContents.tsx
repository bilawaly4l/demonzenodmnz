import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface TocSection {
  id: string;
  title: string;
  icon?: string;
}

interface LessonTableOfContentsProps {
  sections: TocSection[];
  currentSection: string;
  onNavigate: (sectionId: string) => void;
}

const GOLD = "oklch(0.7 0.18 70)";

export function LessonTableOfContents({
  sections,
  currentSection,
  onNavigate,
}: LessonTableOfContentsProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const initDone = useRef(false);

  // Detect mobile on mount and set initial collapsed state
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onResize = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);
      if (!initDone.current) {
        setCollapsed(mobile);
        initDone.current = true;
      }
    };
    onResize(mq);
    mq.addEventListener("change", onResize);
    return () => mq.removeEventListener("change", onResize);
  }, []);

  return (
    <nav
      aria-label="Lesson table of contents"
      data-ocid="lesson.toc.panel"
      className="sticky top-4 rounded-xl border text-sm"
      style={{
        background: "oklch(0.18 0.01 260 / 0.92)",
        borderColor: "oklch(0.7 0.18 70 / 0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header / toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        data-ocid="lesson.toc.toggle"
        className="w-full flex items-center justify-between px-4 py-3 font-semibold tracking-wide uppercase text-xs transition-colors hover:opacity-80"
        style={{ color: GOLD }}
      >
        <span className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="0"
              y="1"
              width="6"
              height="1.5"
              rx="0.75"
              fill="currentColor"
            />
            <rect
              x="0"
              y="5"
              width="9"
              height="1.5"
              rx="0.75"
              fill="currentColor"
            />
            <rect
              x="0"
              y="9"
              width="7"
              height="1.5"
              rx="0.75"
              fill="currentColor"
            />
          </svg>
          Contents
        </span>
        {isMobile &&
          (collapsed ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          ))}
      </button>

      {/* Section list */}
      {!collapsed && (
        <ol className="px-3 pb-3 space-y-0.5">
          {sections.map((sec, idx) => {
            const isActive = currentSection === sec.id;
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(sec.id)}
                  data-ocid={`lesson.toc.item.${idx + 1}`}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-xs leading-snug"
                  style={{
                    background: isActive
                      ? "oklch(0.7 0.18 70 / 0.12)"
                      : "transparent",
                    color: isActive ? GOLD : "oklch(0.6 0.01 260)",
                    fontWeight: isActive ? 700 : 400,
                    borderLeft: isActive
                      ? `2px solid ${GOLD}`
                      : "2px solid transparent",
                  }}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px]"
                    style={{
                      background: isActive
                        ? "oklch(0.7 0.18 70 / 0.25)"
                        : "oklch(0.25 0.01 260)",
                      color: isActive ? GOLD : "oklch(0.5 0.01 260)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">
                    {sec.icon && (
                      <span className="mr-1" aria-hidden="true">
                        {sec.icon}
                      </span>
                    )}
                    {sec.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
