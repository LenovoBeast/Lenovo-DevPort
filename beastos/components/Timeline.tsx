"use client";

import { useEffect, useRef } from "react";
import { timeline } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

/**
 * Scroll-driven journey. GSAP owns this component exclusively (progress line +
 * entry reveals) so it never shares a node with Framer Motion.
 */
export function Timeline() {
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    const fill = line.current;
    if (!el || !fill) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    // Lazy: GSAP is only fetched when this section actually mounts.
    import("gsap").then(async ({ gsap }) => {
      if (cancelled) return;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.6,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.from(step, {
            y: 28,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 88%", once: true },
          });
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <div ref={root} className="relative">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">02 — Journey</p>
          <h2 className="display mt-5 text-[clamp(2.1rem,4.4vw,3.4rem)]">
            The path that
            <br />
            built the stack
          </h2>
          <p className="body-copy mt-5 text-[0.95rem]">
            Not a résumé. A trace of what kept getting built, and what each phase left behind
            in the toolchain.
          </p>
        </div>

        {/* Steps */}
        <ol className="relative pl-8 sm:pl-10">
          {/* Rail */}
          <span className="absolute left-[3px] top-2 bottom-2 w-px bg-white/10 sm:left-[5px]" aria-hidden="true" />
          <div
            ref={line}
            className="absolute left-[3px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-secondary via-primary to-accent sm:left-[5px]"
            style={{ transform: reduced ? "scaleY(1)" : "scaleY(0)" }}
            aria-hidden="true"
          />

          {timeline.map((step) => (
            <li key={step.marker} data-step className="relative pb-12 last:pb-0">
              <span
                className="absolute -left-8 top-2 h-2 w-2 rounded-full border border-white/25 bg-[#050505] sm:-left-10"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-secondary">
                  {step.marker}
                </span>
                <h3 className="text-[1.15rem] font-bold tracking-[-0.02em]">{step.title}</h3>
              </div>
              <p className="body-copy mt-2 text-[0.93rem]">{step.body}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {step.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-fg-mute"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
