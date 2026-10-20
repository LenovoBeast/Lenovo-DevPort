"use client";

import { useEffect, useRef, useState } from "react";
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

  // A small live element: local time in the DMV, so the section is never a
  // static wall of text. Empty until mounted to avoid a hydration mismatch.
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

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
          <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.4rem)]">
            The path that
            <br />
            built the stack
          </h2>
          <p className="body-copy mt-5 text-[0.9375rem]">
            A trace of what kept getting built, and what each phase left behind in the
            toolchain.
          </p>

          {/* Live now panel: gives the sticky column substance instead of air. */}
          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-white/45">
                Now · DMV
              </span>
              <span className="flex items-center gap-2 font-mono text-[0.75rem] tabular-nums text-white/75">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-secondary/60 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary" />
                </span>
                {clock || "--:--"}
              </span>
            </div>

            <dl className="mt-4 space-y-3">
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/35">
                  Building
                </dt>
                <dd className="mt-1 text-[0.9375rem] font-medium text-fg-soft">
                  Agent harnesses and the design language they run on.
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/35">
                  Open to
                </dt>
                <dd className="mt-1 text-[0.9375rem] font-medium text-fg-soft">
                  Select product and design-engineering work.
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
              {[0.35, 0.62, 0.45, 0.9, 0.55, 0.74, 0.42].map((v, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-secondary/25 to-secondary/80 motion-safe:animate-pulse"
                  style={{
                    height: `${Math.round(v * 26 + 8)}px`,
                    animationDelay: `${i * 130}ms`,
                  }}
                />
              ))}
            </div>
          </div>
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
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-secondary">
                  {step.marker}
                </span>
                <h3 className="text-[1.25rem] font-bold tracking-[-0.02em]">{step.title}</h3>
              </div>
              <p className="body-copy mt-2 text-[0.9375rem]">{step.body}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {step.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-mute"
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
