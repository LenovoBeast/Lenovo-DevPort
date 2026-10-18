"use client";

import { useEffect, useRef, useState } from "react";
import { GITHUB_USER } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

type Numbers = { repos: number; live: number; langs: number };

// Honest defaults, measured from the live API. Refined on mount.
const FALLBACK: Numbers = { repos: 23, live: 16, langs: 6 };

/**
 * Counts toward `target`, re-animating from the last value whenever the target
 * changes. A one-shot guard here would strand the number on the static default
 * when the API response arrives a tick later.
 */
function useCountUp(target: number, enabled: boolean, duration = 900) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const from = useRef(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      from.current = target;
      setValue(target);
      return;
    }
    const begin = from.current;
    if (begin === target) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(begin + (target - begin) * eased));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        from.current = target;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled, duration]);

  return value;
}

function Metric({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const reduced = useReducedMotionSafe();
  const shown = useCountUp(value, !reduced);

  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[1.35rem] font-medium leading-none tracking-tight text-white tabular-nums">
        {shown}
        {suffix}
      </span>
      <span className="text-[0.68rem] uppercase tracking-[0.18em] text-fg-mute">{label}</span>
    </div>
  );
}

export function Stats() {
  const [data, setData] = useState<Numbers>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
      .then((repos: Array<{ language: string | null; homepage: string | null }>) => {
        if (cancelled || !Array.isArray(repos) || repos.length === 0) return;
        const langs = new Set<string>();
        let live = 0;
        for (const repo of repos) {
          if (repo.language) langs.add(repo.language);
          if (repo.homepage) live += 1;
        }
        setData({ repos: repos.length, live, langs: langs.size });
      })
      .catch(() => {
        /* keep the static defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <dl className="glass flex flex-wrap items-end gap-x-10 gap-y-5 rounded-2xl px-6 py-5 sm:gap-x-14">
      <Metric label="Repositories" value={data.repos} />
      <Metric label="Live products" value={data.live} />
      <Metric label="Languages" value={data.langs} />
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 font-mono text-[0.8rem] font-medium leading-none text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_10px_1px_rgba(16,185,129,0.7)]" />
          Open
        </span>
        <span className="text-[0.68rem] uppercase tracking-[0.18em] text-fg-mute">To collaborate</span>
      </div>
    </dl>
  );
}
