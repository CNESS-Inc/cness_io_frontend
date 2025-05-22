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

    let angle = 15;
    const speed = 0.002;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      const offset = (angle % 1) * width;

      const gradient = ctx.createLinearGradient(width + offset, 0, offset, 0);
      gradient.addColorStop(0, "#E6F3FF"); // soft sky blue
      gradient.addColorStop(0.33, "#FFEFF5"); // blush pink
      gradient.addColorStop(0.66, "#F5E5FF"); // pastel lavender
      gradient.addColorStop(1, "#FFF7F0"); // warm white

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      angle += speed;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[650px] z-0 pointer-events-none  blur-[40px]"
    />
  );
};

export default AnimatedBackground;
