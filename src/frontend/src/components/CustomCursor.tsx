import { useEffect, useRef, useState } from "react";

// Show only on non-touch devices
function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (isTouchDevice()) return;

    function onMouseMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    }

    function onMouseLeave() {
      setVisible(false);
    }

    function animate() {
      // Smooth trailing effect
      trail.current.x += (pos.current.x - trail.current.x) * 0.15;
      trail.current.y += (pos.current.y - trail.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 8}px, ${pos.current.y - 8}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x - 16}px, ${trail.current.y - 16}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [visible]);

  if (typeof window !== "undefined" && isTouchDevice()) return null;

  return (
    <>
      {/* Primary cursor — shuriken */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 16,
          height: 16,
          pointerEvents: "none",
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="cursor"
        >
          {/* Shuriken / 4-point star */}
          <path
            d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
            fill="oklch(0.65 0.18 190)"
            opacity="0.95"
          />
          <circle cx="8" cy="8" r="2" fill="oklch(0.90 0.10 200)" />
        </svg>
      </div>

      {/* Trail ring */}
      <div
        ref={trailRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid oklch(0.65 0.18 190 / 0.4)",
          pointerEvents: "none",
          zIndex: 99998,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
    </>
  );
}
