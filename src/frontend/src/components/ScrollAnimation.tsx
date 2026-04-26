import { type ReactNode, useEffect, useRef } from "react";

type Direction = "up" | "left" | "right";

interface ScrollAnimationProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const directionClass: Record<Direction, string> = {
  up: "scroll-anim",
  left: "scroll-anim-left",
  right: "scroll-anim-right",
};

export function ScrollAnimation({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`${directionClass[direction]} ${className}`}>
      {children}
    </div>
  );
}
