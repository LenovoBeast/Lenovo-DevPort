"use client";

/**
 * Opens the command palette from anywhere. Kept as its own client component so
 * server-rendered chrome (the footer) can host it without becoming interactive.
 */
export function PaletteTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("beast:cmdk"))}
      aria-label="Open command palette"
      className={`inline-flex items-center gap-1.5 transition-colors hover:text-white ${className}`}
    >
      Search
      <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[0.625rem] tracking-normal text-white/40">
        ⌘K
      </kbd>
    </button>
  );
}
