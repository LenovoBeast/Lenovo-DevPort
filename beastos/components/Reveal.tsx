"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** Render as a different element without losing the motion wrapper. */
  as?: "div" | "section" | "li" | "article" | "header";
};

/**
 * Viewport reveal. Reduced motion is read straight from matchMedia rather than
 * a library hook: when animations are suppressed the element renders in its
 * end state, so content can never be stranded at opacity 0.
 */
export function Reveal({ children, delay = 0, y = 22, className, as = "div" }: RevealProps) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
