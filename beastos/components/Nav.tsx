"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GITHUB_URL } from "@/lib/data";

const links = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#work", label: "Work" },
  { href: "#ecosystem", label: "Repos" },
  { href: "#lab", label: "Lab" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const { scrollYProgress } = useScroll();
  // Springs smooth the raw scroll value; scaleX stays on the compositor.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="fixed inset-x-0 top-0 z-40"
    >
      {/* Reading progress — one line, no chrome. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-secondary via-primary to-accent"
      />
      <div
        className={`mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-[var(--gutter)] transition-colors duration-500 ${
          lifted
            ? "border-b border-white/[0.07] bg-[#050505]/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Lenovo Beast — top">
          <span className="relative grid h-7 w-7 place-items-center">
            <span className="absolute inset-0 rounded-[9px] border border-white/15 bg-white/[0.06]" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_12px_2px_rgba(0,212,255,0.65)]" />
          </span>
          <span className="text-[0.9375rem] font-bold tracking-[-0.02em]">
            Lenovo<span className="text-white/40"> Beast</span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-[0.8125rem] text-fg-mute transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-secondary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[0.8125rem] font-medium text-fg-soft transition-colors hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_10px_1px_rgba(16,185,129,0.6)]" />
          GitHub
        </a>
      </div>
    </motion.header>
  );
}
