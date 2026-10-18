"use client";

import { experiments, environment } from "@/lib/data";

const STATUS_STYLE: Record<string, string> = {
  Active: "border-success/30 bg-success/10 text-success",
  Prototype: "border-secondary/30 bg-secondary/10 text-secondary",
  Research: "border-accent/35 bg-accent/10 text-[#a78bfa]",
};

export function Lab() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Terminal */}
      <div className="lg:col-span-7">
        <div className="glass-strong overflow-hidden rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 font-mono text-[0.66rem] text-white/40">lenovobeast@arch — zsh</span>
          </div>

          <div className="space-y-3 px-5 py-6 font-mono text-[0.78rem] leading-relaxed sm:px-6">
            {environment.lines.map((line) => (
              <div key={line.cmd}>
                <p className="text-white/45">
                  <span className="text-secondary">➜</span>{" "}
                  <span className="text-white/70">{line.prompt}</span>{" "}
                  <span className="text-white">{line.cmd}</span>
                </p>
                <p className="mt-0.5 pl-4 text-fg-mute">{line.out}</p>
              </div>
            ))}
            <p className="text-white/45">
              <span className="text-secondary">➜</span>{" "}
              <span className="text-white/70">~</span>{" "}
              <span className="inline-block h-4 w-2 translate-y-[2px] animate-[pulseSoft_1.2s_ease-in-out_infinite] bg-white/70" />
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/[0.06] sm:grid-cols-4">
            {environment.os.map((item) => (
              <div key={item.label} className="bg-[#0a0a0a] px-4 py-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-white/35">
                  {item.label}
                </p>
                <p className="mt-1 text-[0.82rem] text-fg-soft">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="body-copy mt-4 text-[0.84rem]">
          Rolling release, version-controlled dotfiles, and a kernel tuned for the work. If a
          task repeats, it becomes a script; if it repeats weekly, it becomes a pipeline.
        </p>
      </div>

      {/* Experiments */}
      <div className="lg:col-span-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em]">Current experiments</h3>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/35">
            {experiments.length} running
          </span>
        </div>

        <ul className="mt-4 space-y-2.5">
          {experiments.map((exp) => (
            <li key={exp.name}>
              <a
                href={exp.href}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.84rem] font-medium text-white">{exp.name}</span>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                      STATUS_STYLE[exp.status]
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-fg-mute">{exp.body}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
