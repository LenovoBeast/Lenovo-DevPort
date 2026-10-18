"use client";

import { useEffect, useMemo, useState } from "react";
import { GITHUB_URL, GITHUB_USER } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

type Repo = {
  name: string;
  language: string | null;
  homepage: string | null;
  html_url: string;
  description: string | null;
  pushed_at: string;
};

const FALLBACK: Repo[] = [
  { name: "impeccable", language: "JavaScript", homepage: "https://impeccable.style", html_url: `${GITHUB_URL}/impeccable`, description: "A design language for AI harnesses.", pushed_at: "" },
  { name: "open-design", language: null, homepage: "https://open-design.ai", html_url: `${GITHUB_URL}/open-design`, description: "Local-first design app.", pushed_at: "" },
  { name: "orca", language: "TypeScript", homepage: "https://onOrca.dev", html_url: `${GITHUB_URL}/orca`, description: "ADE for parallel agents.", pushed_at: "" },
  { name: "GeoLibre", language: "TypeScript", homepage: "https://geolibre.app", html_url: `${GITHUB_URL}/GeoLibre`, description: "Cloud-native GIS.", pushed_at: "" },
  { name: "Free-LLM", language: null, homepage: "https://free-llm.com", html_url: `${GITHUB_URL}/Free-LLM`, description: "Free LLM API directory.", pushed_at: "" },
  { name: "runs-on.dev", language: "JavaScript", homepage: "https://runs-on.dev", html_url: `${GITHUB_URL}/runs-on.dev`, description: "Free subdomains.", pushed_at: "" },
  { name: "archify", language: "JavaScript", homepage: null, html_url: `${GITHUB_URL}/archify`, description: "Diagram agent skill.", pushed_at: "" },
  { name: "taste-skill", language: "JavaScript", homepage: "https://tasteskill.dev", html_url: `${GITHUB_URL}/taste-skill`, description: "Gives AI taste.", pushed_at: "" },
  { name: "ui-ux-pro-max-skill", language: "Python", homepage: "https://www.uupm.cc/", html_url: `${GITHUB_URL}/ui-ux-pro-max-skill`, description: "Design intelligence skill.", pushed_at: "" },
  { name: "Playground", language: "JavaScript", homepage: null, html_url: `${GITHUB_URL}/Playground`, description: "Experiments.", pushed_at: "" },
  { name: "claude-hud", language: "JavaScript", homepage: null, html_url: `${GITHUB_URL}/claude-hud`, description: "Agent HUD.", pushed_at: "" },
  { name: "OpenCreator", language: "TypeScript", homepage: null, html_url: `${GITHUB_URL}/OpenCreator`, description: "Creator tooling.", pushed_at: "" },
];

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  HTML: "#e34c26",
  Shell: "#89e051",
  Rust: "#dea584",
};

function colorFor(lang: string | null) {
  if (!lang) return "#9ca3af";
  return LANG_COLOR[lang] ?? "#9ca3af";
}

export function Ecosystem() {
  const [repos, setRepos] = useState<Repo[]>(FALLBACK);
  const [live, setLive] = useState(false);
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=18`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
      .then((data: Repo[]) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setRepos(data.slice(0, 18));
        setLive(true);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Three orbits, filled proportionally.
  const orbits = useMemo(() => {
    const per = Math.ceil(repos.length / 3);
    return [repos.slice(0, per), repos.slice(per, per * 2), repos.slice(per * 2)];
  }, [repos]);

  const current = repos[selected] ?? repos[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-14">
      {/* Orbital map */}
      <div className="glass relative aspect-square w-full overflow-hidden rounded-3xl">
        <svg viewBox="0 0 800 800" className="h-full w-full" role="img" aria-label="Repositories orbiting the Lenovo Beast account">
          <defs>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit rings */}
          {[150, 250, 350].map((r, i) => (
            <circle
              key={r}
              cx="400"
              cy="400"
              r={r}
              fill="none"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              strokeDasharray={i === 1 ? "2 6" : undefined}
            />
          ))}

          <circle cx="400" cy="400" r="120" fill="url(#coreGlow)" />

          {/* Core */}
          <circle cx="400" cy="400" r="34" fill="#050505" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="6" fill="#00d4ff" />
          <text x="400" y="452" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.45)" fontFamily="ui-monospace, monospace" letterSpacing="2">
            LENOVO BEAST
          </text>

          {/* Orbits of repo nodes */}
          {orbits.map((group, oi) => {
            const radius = 150 + oi * 100;
            const duration = 70 + oi * 34;
            return (
              <g
                key={oi}
                style={{
                  transformOrigin: "400px 400px",
                  animation: reduced ? undefined : `spin ${duration}s linear infinite`,
                }}
              >
                {group.map((repo, i) => {
                  const angle = (i / Math.max(1, group.length)) * Math.PI * 2 + oi * 0.8;
                  const x = 400 + Math.cos(angle) * radius;
                  const y = 400 + Math.sin(angle) * radius;
                  const globalIndex = repos.indexOf(repo);
                  const isActive = globalIndex === selected;
                  return (
                    <g key={repo.name} style={{ cursor: "pointer" }} onClick={() => setSelected(globalIndex)}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 16 : 11}
                        fill="transparent"
                      />
                      {isActive && (
                        <circle cx={x} cy={y} r="14" fill={colorFor(repo.language)} opacity="0.18" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 6 : 4}
                        fill={colorFor(repo.language)}
                        opacity={isActive ? 1 : 0.75}
                      />
                      {repo.homepage && (
                        <circle cx={x} cy={y} r={isActive ? 9 : 7} fill="none" stroke={colorFor(repo.language)} strokeWidth="1" opacity="0.45" />
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-success" : "bg-white/30"}`} />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
            {live ? "Live from GitHub" : "Cached view"}
          </span>
        </div>
      </div>

      {/* Inspector */}
      <div>
        <p className="eyebrow">Repository {String(selected + 1).padStart(2, "0")}</p>
        <h3 className="display mt-3 text-[clamp(1.6rem,3vw,2.1rem)] break-words">{current.name}</h3>
        <p className="body-copy mt-3 text-[0.92rem]">
          {current.description || "A public repository from the Lenovo Beast workbench."}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
          <div>
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">Language</dt>
            <dd className="mt-1 flex items-center gap-2 text-[0.88rem]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colorFor(current.language) }} />
              {current.language ?? "Mixed"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">Deployment</dt>
            <dd className="mt-1 text-[0.88rem]">{current.homepage ? "Live" : "Repository only"}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={current.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 text-[0.82rem] font-medium text-fg-soft transition-colors hover:border-white/30 hover:text-white"
          >
            View repository
          </a>
          {current.homepage && (
            <a
              href={current.homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[0.82rem] font-semibold text-black"
            >
              Live site
            </a>
          )}
        </div>

        {/* Compact selector, also the keyboard path into the map */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">Jump to</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repos.slice(0, 12).map((r, i) => (
              <button
                key={r.name}
                type="button"
                onClick={() => setSelected(i)}
                className={`rounded border px-2 py-0.5 font-mono text-[0.6rem] transition-colors ${
                  i === selected
                    ? "border-white/30 bg-white/10 text-white"
                    : "border-white/10 text-fg-mute hover:border-white/25 hover:text-white"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
