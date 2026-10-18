"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Returns `false` on the server and on first paint,
 * then settles after mount so static export and hydration agree.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True when the visitor asked for reduced motion. */
export function useReducedMotionSafe(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True on touch-first devices, where 3D and parallax are disabled. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
