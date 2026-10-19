"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/data";

/**
 * Contact channels. `email` is the direct line; GitHub stays the route for
 * anything about a specific repository.
 */
const CONTACT = {
  email: CONTACT_EMAIL,
  linkedin: "https://www.linkedin.com/in/lenovobeast",
};

const channels = [
  {
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    note: "Direct line",
  },
  {
    label: "GitHub",
    value: "github.com/lenovobeast",
    href: GITHUB_URL,
    note: "Issues, discussions and source",
  },
  {
    label: "LinkedIn",
    value: "in/lenovobeast",
    href: CONTACT.linkedin,
    note: "Professional history",
  },
];

/** Cursor-attracted button. Uses motion values so it never re-renders. */
function Magnetic({
  children,
  href,
  primary,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 14);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={
        primary
          ? "inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-[0.9375rem] font-semibold text-black transition-transform active:scale-[0.98]"
          : "inline-flex h-12 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-6 text-[0.9375rem] font-medium text-fg-soft backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
      }
    >
      {children}
    </motion.a>
  );
}

export function Contact() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
      <div>
        <p className="eyebrow">07 — Contact</p>
        <h2 className="display mt-5 text-[clamp(2rem,4.4vw,3.4rem)]">
          Have a good
          <br />
          problem?
        </h2>
        <p className="body-copy mt-6 text-[1.0625rem]">
          Tell me what you are building, where it is stuck, or what you want to make clearer.
          Email is the fastest route for a first message; open an issue when it is about a
          specific repository.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Magnetic href={`mailto:${CONTACT.email}`} primary>
            Email me
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </Magnetic>
          <Magnetic href={GITHUB_URL}>Open an issue</Magnetic>
        </div>
      </div>

      <div>
        <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                {...(c.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-white/[0.02]"
              >
                <span>
                  <span className="block text-[0.9375rem] font-semibold">{c.label}</span>
                  <span className="mt-0.5 block font-mono text-[0.75rem] text-fg-mute">{c.value}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden text-[0.75rem] text-white/30 sm:block">{c.note}</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className="text-white/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-secondary"
                  >
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-5 font-mono text-[0.75rem] leading-relaxed text-white/25">
          Availability: open to collaboration on design tooling and agent infrastructure.
        </p>
      </div>
    </div>
  );
}
