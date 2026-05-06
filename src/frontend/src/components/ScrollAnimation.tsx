import type { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

export function ScrollAnimation({ children, className }: ScrollAnimationProps) {
  return <div className={className}>{children}</div>;
}
