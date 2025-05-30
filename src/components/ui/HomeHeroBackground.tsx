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
    let height = (canvas.height = 650);

    const points: Point[] = [
      { x: 200, y: 150 },
      { x: width / 2, y: 500 },
      { x: width - 200, y: 150 },
    ];

    let progress = 0;

    // Optional trace effect
    let traceAlpha = 0;
    let traceX = 0;
    let traceY = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = "blur(140px)";

      const current = Math.floor(progress) % 3;
      const next = (current + 1) % 3;
      const t = progress % 1;

      const centerX = lerp(points[current].x, points[next].x, t);
      const centerY = lerp(points[current].y, points[next].y, t);

      // Optional: Show trace permanently
      if (traceAlpha > 0) {
        ctx.globalAlpha = traceAlpha;
        ctx.beginPath();
        ctx.arc(traceX, traceY, 300, 0, 2 * Math.PI);
        ctx.fillStyle = "#00d1ff";
        ctx.fill();
      }

      // Active moving blobs
      const blobs = [
        { color: "#00d1ff", x: -220 },
        { color: "#623fff", x: 0 },
        { color: "#ff994a", x: 220 },
      ];

      blobs.forEach((blob) => {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX + blob.x, centerY, 280, 0, 2 * Math.PI);
        ctx.fillStyle = blob.color;
        ctx.fill();
      });

      // Show the trace once (optional)
      if (traceAlpha === 0 && current === 2 && next === 0 && t < 0.02) {
        const topRight = points[2];
        traceX = topRight.x - 220;
        traceY = topRight.y;
        traceAlpha = 0.6;
      }

      progress += 0.003;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[650px] z-0 pointer-events-none"
    />
  );
};

export default HomeHeroBackground;
