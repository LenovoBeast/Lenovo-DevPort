"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/data";
import { useCoarsePointer, useMediaQuery } from "@/lib/useMedia";
import { Stats } from "./Stats";
import { Atmosphere } from "./Atmosphere";
import { LQIP } from "./WorkbenchBand";

// three.js is ~150KB gzipped; keep it out of the initial bundle entirely.
const BeastCore = dynamic(() => import("./scene/BeastCore"), {
  ssr: false,
  loading: () => null,
});

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const wide = useMediaQuery("(min-width: 768px)");
  const show3D = wide && !coarse && !reduced;
  const enablePointer = wide && !coarse && !reduced;

  const B = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer parallax — smoothed so it never snaps.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const sx = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.7 });
  const sy = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.7 });

  // The torch: a hole in the scrim that follows the pointer, so the visitor
  // lights up the workshop themselves. Clamped to the artwork side so the
  // headline is never left without its scrim.
  const torchX = useMotionValue(72);
  const torchY = useMotionValue(48);
  const torchXS = useSpring(torchX, { stiffness: 90, damping: 22, mass: 0.6 });
  const torchYS = useSpring(torchY, { stiffness: 90, damping: 22, mass: 0.6 });
  const scrimMask = useMotionTemplate`radial-gradient(circle 250px at ${torchXS}% ${torchYS}%, transparent 0%, transparent 40%, #000 74%)`;
  const torchGlow = useMotionTemplate`radial-gradient(circle 250px at ${torchXS}% ${torchYS}%, rgba(255,255,255,0.06) 0%, rgba(0,212,255,0.04) 38%, transparent 68%)`;
  const [torchUsed, setTorchUsed] = useState(false);

  // Magnetic primary action.
  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const ctaXS = useSpring(ctaX, { stiffness: 220, damping: 16, mass: 0.4 });
  const ctaYS = useSpring(ctaY, { stiffness: 220, damping: 16, mass: 0.4 });

  // Scroll parallax — the stage lags behind the content for depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 48]);
  const coreScrollScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.1]);
  const contentFade = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0]);
  // The torch hint belongs to the hero only; retire it as soon as we scroll.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Per-layer pointer offset (closer layers move more → parallax).
  const bgX = useTransform(sx, (v) => v * -14);
  const bgY = useTransform(sy, (v) => v * -10);
  const shaftX = useTransform(sx, (v) => v * 26);
  const shaftY = useTransform(sy, (v) => v * 18);
  const coreX = useTransform(sx, (v) => v * 44);
  const coreY = useTransform(sy, (v) => v * 28);
  const spotX = useTransform(sx, (v) => v * 16);
  const spotY = useTransform(sy, (v) => v * 10);

  useEffect(() => {
    if (!enablePointer) return;
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      pointerX.set(px - 0.5);
      pointerY.set(py - 0.5);
      // Clamp the torch to the artwork side; the copy keeps its scrim.
      torchX.set(Math.min(96, Math.max(52, px * 100)));
      torchY.set(Math.min(88, Math.max(12, py * 100)));
      setTorchUsed(true);
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [enablePointer, pointerX, pointerY]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden pb-12 pt-24 sm:pb-16"
    >
      {/* ============ Cinematic backdrop (depth layers) ============ */}
      {/* Camera settle: the whole stage eases in from a touch of scale + haze. */}
      <motion.div
        initial={reduced ? false : { scale: 1.06, opacity: 0.45 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease }}
        style={{ y: bgScrollY }}
        className="absolute inset-0 z-0"
      >
        {/* Artwork plane — the workshop, focal on the collaborating robots.
            Always scaled past 1 so pointer + scroll parallax never reveal an edge. */}
        <motion.div
          style={{
            x: enablePointer ? bgX : 0,
            y: enablePointer ? bgY : 0,
            scale: 1.12,
          }}
          className="absolute inset-0"
        >
          <picture>
            <source
              media="(max-width: 767px)"
              type="image/webp"
              srcSet={`${B}/media/lab-bg-mobile-500.webp 500w, ${B}/media/lab-bg-mobile-800.webp 800w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`${B}/media/lab-bg-800.webp 800w, ${B}/media/lab-bg-1200.webp 1200w, ${B}/media/lab-bg-1776.webp 1776w`}
              sizes="100vw"
            />
            <img
              src={`${B}/media/lab-bg-1200.jpg`}
              alt=""
              width={1776}
              height={896}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover object-[72%_center]"
              style={{
                backgroundImage: `url(${LQIP})`,
                backgroundSize: "cover",
                backgroundPosition: "right center",
              }}
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Volumetric light shafts — lazy horizontal sway. */}
      <motion.div
        style={enablePointer ? { x: shaftX, y: shaftY } : undefined}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 animate-shaftsway opacity-70 blur-2xl [mask-image:radial-gradient(125%_125%_at_72%_28%,#000_0%,transparent_78%)]"
          style={{
            backgroundImage:
              "linear-gradient(102deg, transparent 36%, rgba(0,212,255,0.10) 49%, transparent 62%), linear-gradient(78deg, transparent 28%, rgba(124,58,237,0.09) 45%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Drifting atmosphere (bokeh) — pauses when offscreen / hidden / reduced. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Atmosphere density={wide ? 46 : 22} className="h-full w-full" />
      </div>

      {/* Focal spotlight over the robots — slow breathing. */}
      <motion.div
        style={enablePointer ? { x: spotX, y: spotY } : undefined}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute right-[6%] top-1/2 h-[460px] w-[560px] -translate-y-1/2 animate-breathe rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.18),transparent_70%)] blur-2xl" />
      </motion.div>

      {/* Living constellation — the agent-system intelligence coordinating the work. */}
      {show3D && (
        <motion.div
          style={{ x: coreX, y: coreY, scale: coreScrollScale }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[34%] right-0 z-0 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_74%)]"
        >
          <BeastCore />
        </motion.div>
      )}

      {/* ============ Scrims: readability + cinematic vignette ============ */}
      {/* Masked by the torch: transparent under the pointer, opaque elsewhere,
          so moving the cursor reveals the ungraded artwork beneath. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={
          enablePointer
            ? { WebkitMaskImage: scrimMask, maskImage: scrimMask }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#050505_0%,rgba(5,5,5,0.62)_33%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#050505_0%,transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#050505_0%,transparent_18%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_42%,transparent_52%,rgba(5,5,5,0.72)_100%)]" />
        <div className="absolute inset-0 grid-veil opacity-30" />
      </motion.div>

      {/* Soft light at the torch edge, so the reveal reads as a lens. */}
      {enablePointer && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: torchGlow }}
        />
      )}

      {/* ============ Foreground: the arrival ============ */}
      <motion.div style={{ opacity: contentFade }} className="shell relative z-10">
        <div className="max-w-[46rem]">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="h-px w-8 bg-white/20" />
            BeastOS · Developer Portal
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease, delay: 0.24 }}
            className="display mt-6 text-[clamp(2.75rem,7.2vw,5.8rem)]"
          >
            Lenovo Beast
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease, delay: 0.34 }}
            className="mt-5 text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-[-0.02em] text-fg-soft"
          >
            I build design tooling and agent systems.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.42 }}
            className="body-copy mt-6 max-w-[36rem] text-[0.9375rem] sm:text-[1.0625rem]"
          >
            Runtimes, harnesses, and the utilities that exist because nothing else did.
            Everything public. Most of it running.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#work"
              style={enablePointer ? { x: ctaXS, y: ctaYS } : undefined}
              onPointerMove={(e) => {
                if (!enablePointer) return;
                const r = e.currentTarget.getBoundingClientRect();
                ctaX.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 12);
                ctaY.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
              }}
              onPointerLeave={() => {
                ctaX.set(0);
                ctaY.set(0);
              }}
              className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full bg-white px-6 text-[0.9375rem] font-semibold text-black transition-transform duration-200 ease-out active:scale-[0.98]"
            >
              <span className="relative z-10">Explore the work</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-6 text-[0.9375rem] font-medium text-fg-soft backdrop-blur-md transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.58 }}
            className="mt-10"
          >
            <Stats />
          </motion.div>
        </div>
      </motion.div>

      {/* Discoverability for the torch — retires after the first move or scroll. */}
      {enablePointer && !torchUsed && (
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-6 right-6 z-10 hidden lg:block"
          aria-hidden="true"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.9 }}
            className="flex items-center gap-2.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-secondary/70" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-white/35">
              Move to light the workshop
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* Scroll cue */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-white/30">Scroll</span>
        <span className="relative h-9 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-3 animate-[float_2.4s_ease-in-out_infinite] bg-secondary/70" />
        </span>
      </motion.div>
    </section>
  );
}
