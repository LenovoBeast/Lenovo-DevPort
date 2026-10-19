"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { GITHUB_URL } from "@/lib/data";
import { useCoarsePointer, useMediaQuery } from "@/lib/useMedia";
import { Stats } from "./Stats";

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

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pb-12 pt-24 sm:pb-16"
    >
      {/* Layered atmosphere: grid, two light sources, grain. */}
      <div className="pointer-events-none absolute inset-0 grid-veil" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.16),transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-12%] right-[-8%] h-[460px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.14),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      {/* Spatial centrepiece */}
      {show3D && (
        <div
          className="pointer-events-none absolute inset-y-0 left-[34%] right-0 opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_74%)]"
          aria-hidden="true"
        >
          <BeastCore />
        </div>
      )}

      {/* Static stand-in when 3D is off (mobile, touch, reduced motion). */}
      {!show3D && (
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 opacity-70"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.22),transparent_70%)] blur-xl" />
        </div>
      )}

      <div className="shell relative z-10">
        <div className="max-w-[46rem]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="h-px w-8 bg-white/20" />
            BeastOS · Developer Portal
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.18 }}
            className="display mt-6 text-[clamp(2.75rem,7.2vw,5.8rem)]"
          >
            Lenovo Beast
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.28 }}
            className="mt-5 text-[clamp(1.1rem,2.4vw,1.6rem)] font-medium tracking-[-0.02em] text-fg-soft"
          >
            Developer<span className="text-white/50">.</span> Builder
            <span className="text-white/50">.</span> Open Source
            <span className="text-white/50">.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.36 }}
            className="body-copy mt-6 text-[0.9375rem] sm:text-[1.0625rem]"
          >
            A personal technology ecosystem: design tooling, agent systems and open source
            software. Built in the open, shipped as artefacts rather than screenshots.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.44 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
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
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-6 text-[0.9375rem] font-medium text-fg-soft backdrop-blur-md transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              GitHub
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.54 }}
            className="mt-10"
          >
            <Stats />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
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
