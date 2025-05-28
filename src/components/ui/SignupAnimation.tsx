import { useEffect, useRef } from "react";

const SignupAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 500;

    const paletteColors = [
      "#7077FE", // Primary 500
      "#F07EFF", // Secondary 500
      "#72D8F2", // Blush 500
      "#AA92F2", // Blush 500
      "#F2B597", // Blush 500
      "#6269FF", // Primary 700
      "#575FFF", // Primary 600
      "#D252E1", // Secondary 600
    ];

    let gradientIndex = 0;
    let shift = 0;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height * 0.4);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.clip();

      // Animate gradient offset
      const offset = Math.sin(shift * 0.01) * width * 0.25;

      const current = paletteColors[gradientIndex % paletteColors.length];
      const next = paletteColors[(gradientIndex + 2) % paletteColors.length];
      const mid = paletteColors[(gradientIndex + 3) % paletteColors.length];

      const gradient = ctx.createLinearGradient(offset, 0, width + offset, height);
      gradient.addColorStop(0, current);
      gradient.addColorStop(0.5, mid);
      gradient.addColorStop(1, next);

      ctx.fillStyle = gradient;
      ctx.shadowColor = current;
      ctx.shadowBlur = 80;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      shift += 1;
      if (shift % 300 === 0) {
        gradientIndex = (gradientIndex + 1) % paletteColors.length;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animate as any);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[600px] z-0"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 40%, 0% 100%)",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
};

export default SignupAnimation;
