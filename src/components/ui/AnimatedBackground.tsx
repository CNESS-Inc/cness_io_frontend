import { useEffect, useRef } from "react";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 650);

    let angle = 0; // Reset to 0 for smoother middle animation
    const speed = 0.002;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      const offset = (angle % 1) * width;

      // Shift the gradient center
      const gradient = ctx.createLinearGradient(
        width / 2 + offset, // start closer to center
        0,
        -width / 2 + offset, // end goes toward left
        0
      );
gradient.addColorStop(0, 'rgba(255, 153, 74, 0.05)');     // orange - softer
gradient.addColorStop(0.35, 'rgba(99, 64, 255, 0.15)');   // purple - stronger
gradient.addColorStop(0.7, 'rgba(0, 210, 255, 0.15)');    // blue - stronger

      ctx.filter = 'blur(120px)';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.filter = 'none';

      angle += speed;
      requestAnimationFrame(draw);
    };

    draw();

    // Recalculate canvas size on resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 650;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[650px] z-0 pointer-events-none blur-[80px]"
    />
  );
};

export default AnimatedBackground;
