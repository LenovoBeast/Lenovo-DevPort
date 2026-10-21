"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTACT_EMAIL, GITHUB_URL, projects } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

type Group = "Go to" | "Projects" | "Links" | "Actions";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: Group;
  target?: string;
  href?: string;
  action?: "copy-email";
  accent?: string;
  keywords?: string;
};

const GO: Command[] = [
  { id: "go-about", label: "About", hint: "The journey", group: "Go to", target: "#about" },
  { id: "go-stack", label: "Stack", hint: "Seven clusters", group: "Go to", target: "#stack" },
  { id: "go-work", label: "Work", hint: "Six projects", group: "Go to", target: "#work" },
  {
    id: "go-repos",
    label: "Repositories",
    hint: "GitHub orbit",
    group: "Go to",
    target: "#ecosystem",
    keywords: "repos github code",
  },
  { id: "go-lab", label: "Lab", hint: "Experiments", group: "Go to", target: "#lab" },
  { id: "go-contact", label: "Contact", hint: "Email and links", group: "Go to", target: "#contact" },
];

const PROJECTS: Command[] = projects.map((p) => ({
  id: `project-${p.slug}`,
  label: p.name,
  hint: p.tagline,
  group: "Projects",
  target: `#project-${p.slug}`,
  accent: p.accent,
  keywords: `${p.platform} ${p.stack.join(" ")} ${p.year}`,
}));

const LINKS: Command[] = [
  {
    id: "link-github",
    label: "GitHub",
    hint: "github.com/lenovobeast",
    group: "Links",
    href: GITHUB_URL,
    keywords: "code source profile",
  },
  {
    id: "link-email",
    label: "Email",
    hint: CONTACT_EMAIL,
    group: "Links",
    href: `mailto:${CONTACT_EMAIL}`,
    keywords: "contact mail write",
  },
  ...projects
    .filter((p) => p.live)
    .map<Command>((p) => ({
      id: `live-${p.slug}`,
      label: `${p.name} — live site`,
      hint: (p.live as string).replace(/^https?:\/\//, "").replace(/\/$/, ""),
      group: "Links",
      href: p.live,
      keywords: "live site demo open",
    })),
];

const ACTIONS: Command[] = [
  {
    id: "action-copy-email",
    label: "Copy email address",
    hint: CONTACT_EMAIL,
    group: "Actions",
    action: "copy-email",
    keywords: "clipboard contact",
  },
];

const ALL: Command[] = [...GO, ...PROJECTS, ...LINKS, ...ACTIONS];
const GROUPS: Group[] = ["Go to", "Projects", "Links", "Actions"];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotionSafe();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setCopied(false);
  }, []);

  // Global open shortcuts + the nav trigger event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("beast:cmdk", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beast:cmdk", onOpen as EventListener);
    };
  }, [open]);

  // Focus, scroll lock, and focus restoration.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL;
    return ALL.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(
    () =>
      GROUPS.map((group) => ({ group, items: results.filter((c) => c.group === group) })).filter(
        (g) => g.items.length > 0,
      ),
    [results],
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = useCallback(
    (cmd: Command) => {
      if (cmd.action === "copy-email") {
        navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {});
        setCopied(true);
        window.setTimeout(close, 750);
        return;
      }
      if (cmd.href) {
        close();
        if (cmd.href.startsWith("mailto:")) window.location.href = cmd.href;
        else window.open(cmd.href, "_blank", "noopener,noreferrer");
        return;
      }
      if (cmd.target) {
        const target = cmd.target;
        close();
        window.setTimeout(() => {
          const el = document.querySelector(target);
          el?.scrollIntoView({
            behavior: reduced ? "auto" : "smooth",
            block: target.startsWith("#project-") ? "center" : "start",
          });
          history.replaceState(null, "", target);
          if (target.startsWith("#project-")) {
            el?.classList.add("cmdk-flash");
            window.setTimeout(() => el?.classList.remove("cmdk-flash"), 1400);
          }
        }, 70);
      }
    },
    [close, reduced],
  );

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) run(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Keep focus on the field: the list is driven by the arrow keys.
      e.preventDefault();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="glass-strong w-full max-w-xl overflow-hidden rounded-2xl"
            initial={reduced ? false : { opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-white/40">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Jump to a section, project or link…"
                className="h-8 flex-1 bg-transparent text-[0.9375rem] text-white placeholder:text-white/35 focus:outline-none"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 font-mono text-[0.625rem] text-white/45 sm:block">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              id="cmdk-list"
              role="listbox"
              aria-label="Commands"
              className="max-h-[52vh] overflow-y-auto p-2"
            >
              {grouped.length === 0 && (
                <p className="px-3 py-9 text-center text-[0.875rem] text-white/45">
                  No matches for “{query}”.
                </p>
              )}

              {grouped.map(({ group, items }) => (
                <div key={group} className="mb-1">
                  <p className="px-3 pb-1 pt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/35">
                    {group}
                  </p>
                  {items.map((cmd) => {
                    const index = results.indexOf(cmd);
                    const isActive = index === active;
                    return (
                      <button
                        key={cmd.id}
                        id={`cmdk-${cmd.id}`}
                        data-index={index}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(cmd)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              cmd.accent ?? (isActive ? "#00d4ff" : "rgba(255,255,255,0.25)"),
                          }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.875rem] font-medium text-white/90">
                            {cmd.label}
                          </span>
                          {cmd.hint && (
                            <span className="mt-0.5 block truncate text-[0.75rem] text-white/45">
                              {cmd.hint}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <span className="shrink-0 font-mono text-[0.625rem] text-white/35">↵</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-white/35">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span className="hidden sm:inline">esc close</span>
              </div>
              {copied ? (
                <span className="text-[0.75rem] text-success">Email copied</span>
              ) : (
                <span className="font-mono text-[0.625rem] text-white/25">BeastOS</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
