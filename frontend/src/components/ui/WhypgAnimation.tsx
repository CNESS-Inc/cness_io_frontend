import { useEffect, useRef } from "react";

const WhypgAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = 400);

    let offset = 0;
    const speed = 3;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const gradientWidth = width * 1.5;
offset = (offset - speed + gradientWidth) % gradientWidth;

      const drawGradient = (x: number) => {
        const gradient = ctx.createLinearGradient(x, 0, x + gradientWidth, 0);

        // Valid color stops (no duplicates)
      
      gradient.addColorStop(0.0, "#FFEFF5"); // Light pink
  gradient.addColorStop(0.15, "#F3F1FF"); // Soft lavender
  gradient.addColorStop(0.3, "#EBCDFD"); // Pastel purple
  gradient.addColorStop(0.45, "#CFC7FF"); // Light violet
  gradient.addColorStop(0.6, "#C6C4FF"); // Blue-gray lavender
  gradient.addColorStop(0.75, "#F0FBFF"); // Icy baby blue
  gradient.addColorStop(0.9, "#E6F3FF");  // Soft mint blue
  gradient.addColorStop(1.0, "#F5E5FF");  // Lavender-pink

        ctx.fillStyle = gradient;
        ctx.fillRect(x, 0, gradientWidth, height);
      };

      drawGradient(-offset);
      drawGradient(-offset + gradientWidth);

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[400px] z-0 pointer-events-none blur-[30px]"
    />
  );
};

export default WhypgAnimation;
