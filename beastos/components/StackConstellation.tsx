"use client";

import { useEffect, useRef, useState } from "react";
import { stackClusters } from "@/lib/data";
import { useReducedMotionSafe } from "@/lib/useMedia";

type Hub = { x: number; y: number; phase: number; sats: { x: number; y: number; r: number; phase: number }[] };

/**
 * 2D canvas constellation. Deliberately not a second WebGL context: the page
 * already runs one 3D scene, and a canvas keeps this interactive on low-end
 * hardware. Hub selection is mirrored by real buttons for keyboard users.
 *
 * Sizing is derived from the panel, not fixed, so the composition still reads
 * on a 1440 desktop panel and a 350px phone alike.
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
    let unit = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(340, rect.height);
      unit = Math.min(w, h);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = stackClusters.length;
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w * 0.34, 320);
      const ry = Math.min(h * 0.31, 215);
      const satRadius = Math.min(92, unit * (w < 430 ? 0.13 : 0.16));

      hubs = stackClusters.map((cluster, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const hx = cx + Math.cos(angle) * rx;
        const hy = cy + Math.sin(angle) * ry;
        const sats = cluster.nodes.map((_, k) => {
          const sa = (k / cluster.nodes.length) * Math.PI * 2 + i;
          const sr = satRadius * (0.72 + ((k * 37) % 40) / 100);
          return {
            x: hx + Math.cos(sa) * sr,
            y: hy + Math.sin(sa) * sr * 0.84,
            r: 1.8 + ((k * 13) % 10) / 9,
            phase: sa,
          };
        });
        return { x: hx, y: hy, phase: i * 1.7, sats };
      });
    };

    const render = (t: number) => {
      const time = reduced ? 0 : t / 1000;
      const act = activeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w * 0.34, 320);
      const ry = Math.min(h * 0.31, 215);
      const labelSize = w < 430 ? 9 : 10.5;

      ctx.clearRect(0, 0, w, h);

      // Frame ring: gives the composition an edge instead of floating dots.
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 9]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.17, ry * 1.17, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shared practice -> each cluster.
      hubs.forEach((hub, i) => {
        const on = i === act;
        ctx.strokeStyle = on ? `${stackClusters[i].color}55` : "rgba(255,255,255,0.09)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(hub.x, hub.y);
        ctx.stroke();
      });

      // Cluster-to-cluster links.
      for (let i = 0; i < hubs.length; i++) {
        const a = hubs[i];
        const b = hubs[(i + 1) % hubs.length];
        const on = i === act || (i + 1) % hubs.length === act;
        ctx.strokeStyle = on ? "rgba(0,212,255,0.45)" : "rgba(255,255,255,0.16)";
        ctx.lineWidth = on ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Core: the one practice the clusters share.
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, unit * 0.17);
      coreGlow.addColorStop(0, "rgba(0,212,255,0.30)");
      coreGlow.addColorStop(0.55, "rgba(124,58,237,0.12)");
      coreGlow.addColorStop(1, "transparent");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, unit * 0.17, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#050505";
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(0,212,255,0.6)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "#00d4ff";
      ctx.fill();

      ctx.font = "8.5px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.textAlign = "center";
      ctx.fillText("SHARED PRACTICE", cx, cy + 25);

      hubs.forEach((hub, i) => {
        const cluster = stackClusters[i];
        const isActive = i === act;
        const bob = reduced ? 0 : Math.sin(time * 0.7 + hub.phase) * 3;
        const hx = hub.x;
        const hy = hub.y + bob;

        // Spokes to satellites.
        hub.sats.forEach((sat) => {
          ctx.strokeStyle = isActive ? `${cluster.color}70` : "rgba(255,255,255,0.16)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(sat.x, sat.y + bob);
          ctx.stroke();
        });

        // Satellites.
        hub.sats.forEach((sat, k) => {
          const pulse = reduced ? 0.85 : 0.74 + Math.sin(time * 1.5 + sat.phase) * 0.26;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y + bob, sat.r, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? cluster.color : "rgba(255,255,255,0.66)";
          ctx.globalAlpha = isActive ? 1 : 0.9 * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Satellite text only where there is room; the chip list below
          // already names every node, so narrow panels stay uncluttered.
          if (isActive && w >= 430) {
            ctx.font = `${labelSize - 0.5}px ui-monospace, SFMono-Regular, Menlo, monospace`;
            ctx.fillStyle = "rgba(238,241,248,0.9)";
            ctx.textAlign = sat.x > hx ? "left" : "right";
            ctx.fillText(cluster.nodes[k], sat.x + (sat.x > hx ? 7 : -7), sat.y + bob + 3);
          }
        });

        // Hub glow.
        const glowR = isActive ? unit * 0.13 : unit * 0.085;
        const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, glowR);
        glow.addColorStop(0, `${cluster.color}${isActive ? "80" : "33"}`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(hx, hy, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Hub ring.
        const hubR = isActive ? 15 : 11;
        ctx.beginPath();
        ctx.arc(hx, hy, hubR, 0, Math.PI * 2);
        ctx.fillStyle = "#070707";
        ctx.fill();
        ctx.lineWidth = isActive ? 2.2 : 1.8;
        ctx.strokeStyle = isActive ? cluster.color : "rgba(255,255,255,0.62)";
        ctx.stroke();

        // Hub dot.
        ctx.beginPath();
        ctx.arc(hx, hy, isActive ? 5 : 3.4, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? cluster.color : "rgba(255,255,255,0.88)";
        ctx.fill();

        // Cluster label.
        ctx.font = `${isActive ? "700" : "600"} ${isActive ? labelSize + 0.5 : labelSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        ctx.fillStyle = isActive ? "#ffffff" : "rgba(255,255,255,0.68)";
        ctx.textAlign = "center";
        ctx.fillText(cluster.label.toUpperCase(), hx, hy - (isActive ? 29 : 25));
      });
    };

    const loop = (t: number) => {
      if (!running) return;
      render(t);
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    layout();
    render(0); // paint immediately, before the section is scrolled to
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      layout();
      render(0);
    });
    ro.observe(host);

    // Pause the loop when the section is off-screen.
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (!running) return;
      cancelAnimationFrame(raf);
      if (reduced) render(0);
      else raf = requestAnimationFrame(loop);
    });
    io.observe(host);

    // Pointer hit-testing on hubs.
    const onMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      let best = -1;
      let bestDist = 46;
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
        {/* Backdrop: keeps the panel from ever reading as an empty box, and
            gives the nodes a field to sit in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.14),transparent_62%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, #000 8%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 8%, transparent 72%)",
          }}
        />
        <canvas
          ref={canvasRef}
          className="relative block h-full w-full"
          role="img"
          aria-label="Technology constellation: seven clusters connected by a shared practice"
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
              className={`rounded-full border px-3 py-1.5 text-[0.75rem] font-medium transition-colors duration-200 ${
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
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em]" style={{ color: current.color }}>
            {current.label}
          </p>
          <p className="body-copy mt-2 text-[0.9375rem]">{current.note}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {current.nodes.map((n) => (
              <li
                key={n}
                className="rounded border border-white/10 px-2 py-0.5 font-mono text-[0.6875rem] text-fg-mute"
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
