"use client";
import { useEffect, useRef } from "react";

type KeyPt = { t: number; x: number; y: number; hold: number };
type Blob = {
  color: string;
  r: number;
  blur: number;
  lane: number;     // +/- px offset perpendicular to motion
  opacity: number;
  z: number;        // draw order (higher drawn last)
};

export default function Premiumbackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const SECTION_H = 237;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR-aware sizing
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const parent = canvas.parentElement;
      const cssW = parent ? parent.clientWidth : window.innerWidth;
      const cssH = SECTION_H;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Path: LT → Bottom → Bottom-nearby → RT → LT (loop)
    const buildPath = (w: number, h: number): KeyPt[] => [
      { x: 0.08 * w, y: 0.18 * h, hold: 1.0, t: 0 },  // LT
      { x: 0.14 * w, y: 0.88 * h, hold: 1.0, t: 0 },  // Bottom
      { x: 0.32 * w, y: 0.80 * h, hold: 1.0, t: 0 },  // Bottom-nearby
      { x: 0.92 * w, y: 0.20 * h, hold: 1.0, t: 0 },  // RT
      { x: 0.08 * w, y: 0.18 * h, hold: 1.0, t: 0 },  // back to LT
    ];

    // Easing
    const ease = (u: number) =>
      u < 0.5 ? 2 * u * u : 1 - Math.pow(1 - (2 * u - 1), 2); // easeInOutQuad

    // Interpolate with holds
    function sample(keys: KeyPt[], tSecs: number) {
      const moveTime = 2.6;
      let total = 0;
      const segs: { a: KeyPt; b: KeyPt; start: number; moveDur: number; holdDur: number }[] = [];
      for (let i = 0; i < keys.length - 1; i++) {
        const a = keys[i], b = keys[i + 1];
        segs.push({ a, b, start: total, moveDur: moveTime, holdDur: b.hold });
        total += moveTime + b.hold;
      }
      const t = ((tSecs % total) + total) % total;

      for (const seg of segs) {
        if (t >= seg.start && t < seg.start + seg.moveDur) {
          const u = (t - seg.start) / seg.moveDur;
          const v = ease(u);
          return {
            x: seg.a.x + (seg.b.x - seg.a.x) * v,
            y: seg.a.y + (seg.b.y - seg.a.y) * v,
            dirX: seg.b.x - seg.a.x,
            dirY: seg.b.y - seg.a.y, // direction of the active segment
          };
        }
        const holdStart = seg.start + seg.moveDur;
        if (t >= holdStart && t < holdStart + seg.holdDur) {
          // During holds we still return the segment direction so lanes don't collapse
          return { x: seg.b.x, y: seg.b.y, dirX: seg.b.x - seg.a.x, dirY: seg.b.y - seg.a.y };
        }
      }
      const a = keys[0], b = keys[1];
      return { x: a.x, y: a.y, dirX: b.x - a.x, dirY: b.y - a.y };
    }

    const hexToRgb = (hex: string) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!m) return [255, 255, 255] as const;
      return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] as const;
    };

    const drawBlob = (x: number, y: number, r: number, color: string, blurPx: number, op: number) => {
      const [rr, gg, bb] = hexToRgb(color);
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
      g.addColorStop(0.00, `rgba(${rr},${gg},${bb},${0.90 * op})`);
      g.addColorStop(0.40, `rgba(${rr},${gg},${bb},${0.50 * op})`);
      g.addColorStop(0.75, `rgba(${rr},${gg},${bb},${0.22 * op})`);
      g.addColorStop(1.00, `rgba(${rr},${gg},${bb},${0.06 * op})`);

      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Three blobs, separated by lanes (± means left/right of path)
    const blobs: Blob[] = [
      { color: "#00D2FF", r: 205, blur: 350, lane: -110, opacity: 0.95, z: 0 }, // cyan
      { color: "#6340FF", r: 205, blur: 350, lane:    0,  opacity: 0.95, z: 1 }, // purple
      { color: "#FF994A", r: 205, blur: 350, lane: +110, opacity: 1.00, z: 2 }, // orange
    ].sort((a, b) => a.z - b.z);

    // Additive blending so overlaps bloom; more reliable than 'screen' here
    const prevOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";

    let raf = 0;
    let t0 = performance.now();

    // persistent perpendicular so lanes remain during holds
    let lastNx = 1, lastNy = 0;

    const animate = (now: number) => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = SECTION_H;
      ctx.clearRect(0, 0, w, h);

      const keys = buildPath(w, h);
      const t = (now - t0) / 1000;
      const s = sample(keys, t);

      // compute normalized tangent and its perpendicular
      let dx = s.dirX, dy = s.dirY;
      const len = Math.hypot(dx, dy);
      if (len > 1e-4) {
        dx /= len; dy /= len;
        lastNx = -dy; lastNy = dx; // update only when we have motion direction
      }
      const nx = lastNx, ny = lastNy;

      for (const b of blobs) {
        drawBlob(s.x + nx * b.lane, s.y + ny * b.lane, b.r, b.color, b.blur, b.opacity);
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.globalCompositeOperation = prevOp;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-[237px] pointer-events-none"
      aria-hidden="true"
    />
  );
}
