"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/data";

/** Generated cover — no screenshots to fake, so the visual is the system itself. */
function Cover({ project, ratio = "aspect-[16/9]" }: { project: Project; ratio?: string }) {
  return (
    <div
      className={`relative ${ratio} overflow-hidden rounded-2xl border border-white/[0.07]`}
      style={{
        background: `radial-gradient(120% 105% at 16% 0%, ${project.accent}70 0%, ${project.accent}2e 42%, rgba(8,8,8,0.93) 76%, #060606 100%)`,
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at 30% 20%, #000, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 30% 20%, #000, transparent 78%)",
        }}
        aria-hidden="true"
      />
      {/* Project name as a watermark. A single letter read as an artefact; the
          full word reads as a decision. */}
      <span
        className="display pointer-events-none absolute -bottom-[0.12em] left-5 right-5 select-none truncate text-[clamp(1.75rem,4.4vw,3.25rem)] leading-none opacity-[0.15]"
        style={{ color: project.accent }}
        aria-hidden="true"
      >
        {project.name}
      </span>
      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: project.accent, boxShadow: `0 0 12px 2px ${project.accent}88` }}
        />
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/55">
          {project.platform}
        </span>
      </div>
      <span className="absolute right-5 top-5 font-mono text-[0.6875rem] text-white/35">
        {project.year}
      </span>
    </div>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const rows = [
    { label: "Problem", value: project.caseStudy.problem },
    { label: "Approach", value: project.caseStudy.approach },
    { label: "Result", value: project.caseStudy.result },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
    >
      <motion.div
        className="glass-strong relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.985 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0b0b0b]/85 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-white/45">
              Case study · {project.year}
            </p>
            <h2 id="case-title" className="display mt-2 text-[clamp(1.5rem,3vw,2rem)]">
              {project.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-white/12 bg-white/[0.05] p-2 text-white/70 transition-colors hover:border-white/25 hover:text-white"
            aria-label="Close case study"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-7 sm:px-8">
          <p className="text-[1.0625rem] text-fg-soft">{project.summary}</p>

          <dl className="mt-8 space-y-6">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:gap-6">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
                  {row.label}
                </dt>
                <dd className="body-copy text-[0.9375rem]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 space-y-2.5 border-t border-white/10 pt-6">
            {project.caseStudy.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[0.9375rem] text-fg-soft">
                <span
                  className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: project.accent }}
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.8125rem] font-semibold text-black transition-transform active:scale-[0.98]"
              >
                Open live site
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-[0.8125rem] font-medium text-fg-soft transition-colors hover:border-white/30 hover:text-white"
              >
                Source
              </a>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-fg-mute"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Work() {
  const [open, setOpen] = useState<Project | null>(null);
  const reduced = useReducedMotion();
  const close = useCallback(() => setOpen(null), []);

  const [lead, second, ...rest] = projects;

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Lead project — asymmetric, spans more columns */}
        <button
          type="button"
          onClick={() => setOpen(lead)}
          className="group col-span-full flex flex-col text-left lg:col-span-7"
        >
          <Cover project={lead} ratio="aspect-[5/2]" />
          <div className="mt-5 flex items-start justify-between gap-6">
            <div>
              <h3 className="text-[1.5rem] font-bold tracking-[-0.03em] transition-colors group-hover:text-white">
                {lead.name}
              </h3>
              <p className="mt-1.5 max-w-[42ch] text-[0.9375rem] text-fg-mute">{lead.tagline}</p>
            </div>
            <span className="mt-1 shrink-0 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-white/35 transition-colors group-hover:text-secondary">
              Case study
            </span>
          </div>
        </button>

        <div className="col-span-full grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {[second, rest[0]].filter(Boolean).map((p) => (
            <button key={p.slug} type="button" onClick={() => setOpen(p)} className="group flex flex-col text-left">
              <Cover project={p} />
              <div className="mt-4">
                <h3 className="text-[1.0625rem] font-bold tracking-[-0.02em]">{p.name}</h3>
                <p className="mt-1 text-[0.8125rem] text-fg-mute">{p.tagline}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Remaining projects as a dense index */}
      <ul className="mt-14 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {rest.slice(1).map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => setOpen(p)}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[2.5rem_1fr_auto_auto] sm:gap-6"
            >
              <span className="hidden font-mono text-[0.75rem] text-white/30 sm:block">
                {String(projects.indexOf(p) + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block text-[1.0625rem] font-semibold tracking-[-0.01em]">{p.name}</span>
                <span className="mt-0.5 block truncate text-[0.8125rem] text-fg-mute">{p.tagline}</span>
              </span>
              <span className="hidden gap-1.5 sm:flex">
                {p.stack.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="rounded border border-white/10 px-2 py-0.5 font-mono text-[0.6875rem] text-fg-mute"
                  >
                    {s}
                  </span>
                ))}
              </span>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-white/30 transition-colors group-hover:text-secondary">
                Open
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && !reduced && <CaseStudy project={open} onClose={close} />}
        {open && reduced && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <button
                type="button"
                onClick={close}
                className="mb-4 rounded-full border border-white/15 px-4 py-2 text-sm"
              >
                Close
              </button>
              <div className="glass-strong rounded-3xl p-8">
                <h2 className="display text-3xl">{open.name}</h2>
                <p className="body-copy mt-4">{open.summary}</p>
                <p className="body-copy mt-4">{open.caseStudy.problem}</p>
                <p className="body-copy mt-4">{open.caseStudy.approach}</p>
                <p className="body-copy mt-4">{open.caseStudy.result}</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
