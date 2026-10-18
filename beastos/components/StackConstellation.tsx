"use client";

import { useEffect, useRef, useState } from "react";
import { stackClusters } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

type Hub = { x: number; y: number; phase: number; sats: { x: number; y: number; r: number; phase: number }[] };

/**
 * 2D canvas constellation. Deliberately not a second WebGL context: the page
 * already runs one 3D scene, and a canvas keeps this interactive on low-end
 * hardware. Hub selection is mirrored by real buttons for keyboard users.
 */
export function StackConstellation() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const reduced = useReducedMotionSafe();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const host = wrap.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let hubs: Hub[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(340, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = stackClusters.length;
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w * 0.33, 290);
      const ry = Math.min(h * 0.30, 205);
      const satRadius = Math.min(76, w * 0.075);

      hubs = stackClusters.map((cluster, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const hx = cx + Math.cos(angle) * rx;
        const hy = cy + Math.sin(angle) * ry;
        const sats = cluster.nodes.map((_, k) => {
          const sa = (k / cluster.nodes.length) * Math.PI * 2 + i;
          const sr = satRadius * (0.72 + ((k * 37) % 40) / 100);
          return {
            x: hx + Math.cos(sa) * sr,
            y: hy + Math.sin(sa) * sr * 0.86,
            r: 1.8 + ((k * 13) % 10) / 8,
            phase: sa,
          };
        });
        return { x: hx, y: hy, phase: i * 1.7, sats };
      });
    };

    const draw = (t: number) => {
      if (!running) return;
      const time = reduced ? 0 : t / 1000;
      ctx.clearRect(0, 0, w, h);
      const act = activeRef.current;

      // Hub-to-hub links
      ctx.lineWidth = 1;
      for (let i = 0; i < hubs.length; i++) {
        const a = hubs[i];
        const b = hubs[(i + 1) % hubs.length];
        const on = i === act || (i + 1) % hubs.length === act;
        ctx.strokeStyle = on ? "rgba(0,212,255,0.20)" : "rgba(255,255,255,0.055)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      hubs.forEach((hub, i) => {
        const cluster = stackClusters[i];
        const isActive = i === act;
        const bob = reduced ? 0 : Math.sin(time * 0.7 + hub.phase) * 3;
        const hx = hub.x;
        const hy = hub.y + bob;

        // Spokes to satellites
        hub.sats.forEach((sat) => {
          const sx = sat.x;
          const sy = sat.y + bob;
          ctx.strokeStyle = isActive ? `${cluster.color}55` : "rgba(255,255,255,0.07)";
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        });

        // Satellites
        hub.sats.forEach((sat, k) => {
          const pulse = reduced ? 0.8 : 0.65 + Math.sin(time * 1.5 + sat.phase) * 0.35;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y + bob, sat.r, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? cluster.color : "rgba(255,255,255,0.28)";
          ctx.globalAlpha = isActive ? 0.9 : 0.5 * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;

          if (isActive) {
            ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
            ctx.fillStyle = "rgba(229,229,229,0.72)";
            ctx.textAlign = sat.x > hx ? "left" : "right";
            ctx.fillText(
              cluster.nodes[k],
              sat.x + (sat.x > hx ? 6 : -6),
              sat.y + bob + 3,
            );
          }
        });

        // Hub glow
        const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, isActive ? 62 : 38);
        glow.addColorStop(0, `${cluster.color}${isActive ? "66" : "22"}`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(hx, hy, isActive ? 62 : 38, 0, Math.PI * 2);
        ctx.fill();

        // Hub ring
        ctx.beginPath();
        ctx.arc(hx, hy, isActive ? 13 : 9, 0, Math.PI * 2);
        ctx.fillStyle = "#050505";
        ctx.fill();
        ctx.lineWidth = isActive ? 2 : 1.4;
        ctx.strokeStyle = isActive ? cluster.color : "rgba(255,255,255,0.3)";
        ctx.stroke();

        // Hub dot
        ctx.beginPath();
        ctx.arc(hx, hy, isActive ? 4 : 2.6, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? cluster.color : "rgba(255,255,255,0.55)";
        ctx.fill();

        // Label
        ctx.font = `${isActive ? "600" : "500"} 10px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255,255,255,0.42)";
        ctx.textAlign = "center";
        ctx.fillText(cluster.label.toUpperCase(), hx, hy - (isActive ? 24 : 19));
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    layout();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) draw(0);
    });
    ro.observe(host);

    // Pause the loop when the section is off-screen.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(host);

    // Pointer hit-testing on hubs.
    const onMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      let best = -1;
      let bestDist = 44;
      hubs.forEach((hub, i) => {
        const d = Math.hypot(mx - hub.x, my - hub.y);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best >= 0) setActive(best);
    };
    canvas.addEventListener("pointermove", onMove);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  const current = stackClusters[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center lg:gap-12">
      <div
        ref={wrap}
        className="glass relative h-[420px] overflow-hidden rounded-3xl sm:h-[520px]"
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          role="img"
          aria-label="Technology constellation: seven clusters connected by shared practice"
        />
      </div>

      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Technology clusters">
          {stackClusters.map((cluster, i) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`rounded-full border px-3 py-1.5 text-[0.74rem] font-medium transition-colors duration-200 ${
                i === active
                  ? "border-white/30 bg-white text-black"
                  : "border-white/10 bg-white/[0.03] text-fg-mute hover:border-white/20 hover:text-white"
              }`}
            >
              {cluster.label}
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em]" style={{ color: current.color }}>
            {current.label}
          </p>
          <p className="body-copy mt-2 text-[0.9rem]">{current.note}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {current.nodes.map((n) => (
              <li
                key={n}
                className="rounded border border-white/10 px-2 py-0.5 font-mono text-[0.62rem] text-fg-mute"
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
