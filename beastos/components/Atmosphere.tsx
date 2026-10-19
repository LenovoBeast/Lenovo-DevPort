"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/useMedia";

/**
 * Drifting dust / bokeh atmosphere — the cheapest thing that reads as "air".
 *
 * Design rules that keep it safe:
 *  - Canvas 2D only, no WebGL, so it never competes with the three.js core.
 *  - Particle count is capped and halved on touch devices.
 *  - The loop is fully suspended when the element scrolls offscreen, when the
 *    tab is hidden, when the visitor prefers reduced motion, or on coarse
 *    pointers — so it costs nothing most of the time.
 *  - DPR is clamped to 1.5; only transform/opacity-equivalent draws happen.
 *  - Reduced motion still paints one static frame (no blank, no flicker).
 */
export function Atmosphere({
  density = 44,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;

    // One soft sprite, drawn many times — avoids per-particle gradient cost.
    const sprite = document.createElement("canvas");
    const ss = 64;
    sprite.width = ss;
    sprite.height = ss;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(ss / 2, ss / 2, 0, ss / 2, ss / 2, ss / 2);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.35, "rgba(150,215,255,0.4)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, ss, ss);

    type P = { x: number; y: number; z: number; r: number; vx: number; vy: number; a: number };
    let parts: P[] = [];
    const count = coarse ? Math.max(10, Math.round(density * 0.45)) : density;

    const seed = () => {
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.4 + Math.random() * 0.6, // depth → size + speed + opacity
        r: 1 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.16, // slow upward drift
        a: 0.12 + Math.random() * 0.38,
      }));
    };

    const resize = () => {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.max(1, Math.floor(w * dpr));
      canvas!.height = Math.max(1, Math.floor(h * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx!.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        if (p.x < -12) p.x = w + 12;
        else if (p.x > w + 12) p.x = -12;
        const size = p.r * (2 + p.z * 2.2);
        ctx!.globalAlpha = p.a * p.z;
        ctx!.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx!.globalAlpha = 1;
    };

    const frame = () => {
      draw();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };
    const start = () => {
      if (!running && !reduced) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    if (reduced) draw(); // single static frame, no loop
    else start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density, reduced, coarse]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
