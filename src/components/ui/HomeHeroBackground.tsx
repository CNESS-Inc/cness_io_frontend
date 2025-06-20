import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const HomeHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 692);

    const points: Point[] = [
      { x: 200, y: 150 }, // Point A (Top-Left)
      { x: width / 2, y: 500 }, // Point B (Bottom-Center)
      { x: width - 200, y: 150 }, // Point C (Top-Right)
    ];

    let progress = 0;

    // Trace & pause state
    let traceVisible = false;
    let traceAlpha = 0.6;
    let traceX = 0;
    let traceY = 0;

    let isFadingTrace = false;
    let traceFadeStartTime = 0;

    let isPaused = false;
    let pauseStartTime = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = "blur(100px)";

      const current = Math.floor(progress) % 3;
      const next = (current + 1) % 3;
      const t = progress % 1;

      const centerX = lerp(points[current].x, points[next].x, t);
      const centerY = lerp(points[current].y, points[next].y, t);

      // Draw trace if visible
      if (traceVisible) {
        ctx.globalAlpha = traceAlpha;
        ctx.beginPath();
        ctx.arc(traceX, traceY, 200, 0, 2 * Math.PI);
        ctx.fillStyle = "#00d1ff";
        ctx.fill();
      }

      // Draw moving blobs (no bounce, fixed Y)
      const blobs = [
        { color: "#66e4ff", x: -400 },
        { color: "#a18bff", x: 0 },
        { color: "#ffc38f", x: 400 },
      ];

      blobs.forEach((blob) => {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX + blob.x, centerY, 250, 0, 2 * Math.PI); // Bigger, fixed position
        ctx.fillStyle = blob.color;
        ctx.fill();
      });

      // Show trace at top-right corner (Point C → Point A)
      if (!traceVisible && current === 2 && next === 0 && t < 0.02) {
        traceX = points[2].x - 220;
        traceY = points[2].y;
        traceVisible = true;
        traceAlpha = 0.6;
      }

      // Start trace fade + pause at top-left (Point A → Point B)
      if (!isPaused && !isFadingTrace && current === 0 && next === 1 && t < 0.02) {
        isPaused = true;
        isFadingTrace = true;
        traceFadeStartTime = performance.now();
        pauseStartTime = performance.now();
      }

      // Trace fading logic
      if (isFadingTrace) {
        const fadeElapsed = performance.now() - traceFadeStartTime;
        traceAlpha = Math.max(0, 0.6 - (fadeElapsed / 5000) * 0.6); // Fade out over 1s

        if (traceAlpha <= 0) {
          traceVisible = false;
          isFadingTrace = false;
          traceAlpha = 0;
        }
      }

      // Pause logic: wait 3s after fade before resuming
      if (isPaused) {
        const pauseElapsed = performance.now() - pauseStartTime;
        if (pauseElapsed >= 500 && !isFadingTrace) {
          isPaused = false;
        } else {
          requestAnimationFrame(draw);
          return;
        }
      }

      progress += 0.03;
      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[692px] z-0 pointer-events-none"
    />
  );
};

export default HomeHeroBackground;
