"use client";
import Button from "../../ui/Button";
import LottieOnView from "../../ui/LottieOnView";
import { useEffect, useState } from "react";

export default function MobileHeroSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];

    // Only jump to step 3 directly after a delay
    timers.push(
      window.setTimeout(() => {
        setStep(3);
        console.log("📈 Mobile Step 3: Circle scales to full screen");
      }, 2200)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const [animationData, setAnimationData] = useState<object | null>(null);
  useEffect(() => {
    fetch("https://cnessioassets.project-69e.workers.dev/Second-globe.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie JSON:", err));
  }, []);

  return (
    <>
      <section className="relative rounded-[12px] overflow-hidden mx-2 bg-[#f4f3f9] mobile-hero-section min-h-[100vh] flex items-center justify-center">
        {/* Content Section */}
        <div className="absolute inset-0 flex items-start justify-center z-10 pt-8">
          <div className="text-center px-4 w-full">
            <h1
              className={`poppins text-[28px] font-bold mb-4 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text transition-all duration-1000 ease-in-out ${step === 3 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
                }`}
            >
              The World's First<br /> Consciousness Super-App
            </h1>

            <p
              className={`openSans text-[14px] text-[#64748B] mb-6 max-w-sm mx-auto transition-all duration-1000 ease-in-out ${step === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              Build your conscious identity. Connect with purpose-led peers. Share your knowledge. Learn, grow, and thrive - all in one place.
            </p>

            <div
              className={`flex flex-col gap-3 transition-all duration-1000 ease-in-out ${step === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
            >
              <Button className="rounded-[100px] hero-section-btn py-3 px-6 text-[14px] bg-linear-to-r from-[#7077FE] to-[#9747FF]">
                Get Started
              </Button>
              <Button
                variant="white-outline"
                className="text-[14px] py-3 px-6 hero-section-btn"
                size="md"
                onClick={() => window.location.href = "https://visionary.cness.io"}
              >
                Explore the Movement
              </Button>
            </div>
          </div>
        </div>

        {/* Lottie Circle Animation (only at step 3) */}
        <div
          className="absolute z-0 pointer-events-none mobile-circle"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: "170vw",
            height: "106vh",
            maxWidth: "200vw",
            maxHeight: "200vh",
            minWidth: "90vw",
            minHeight: "45vh",
            clipPath: "circle(50% at 50% 100%)",

            transformOrigin: "center bottom",
            WebkitTransformOrigin: "center bottom",
            transform: step === 3 ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.2)",
            WebkitTransform: step === 3 ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(0.2)",
            transition: "transform 1s ease-in-out, opacity 1s ease-in-out",

            opacity: step === 3 ? 1 : 0,
            display: "block",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            WebkitPerspective: "1000px",
            perspective: "1000px",
            WebkitTransformStyle: "preserve-3d",
            transformStyle: "preserve-3d",
          }}
        >
          {step === 3 && animationData && (
            <LottieOnView
              animationData={animationData}
              loop
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                objectFit: "cover",
                borderRadius: "50% 50% 0 0",
                transform: "translateY(50%) scale(1.2)",
                WebkitTransform: "translateY(50%) scale(1.2)",
              }}
            />
          )}
        </div>

      </section>
    </>
  );
}
