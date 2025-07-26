"use client";
import Button from "../../ui/Button";
import LottieOnView from "../../ui/LottieOnView";
import { useEffect, useState } from "react";

export default function MobileHeroSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    
    // Step 1: Small circle appears (0.3s)
    timers.push(window.setTimeout(() => {
      setStep(1);
      console.log('🎯 Mobile Step 1: Small circle appears');
    }, 300));
    
    // Step 2: Circle scales up (1.2s)
    timers.push(window.setTimeout(() => {
      setStep(2);
      console.log('📈 Mobile Step 2: Circle scales up');
    }, 1200));
    
    // Step 3: Circle scales to full screen (2.2s)
    timers.push(window.setTimeout(() => {
      setStep(3);
      console.log('📈 Mobile Step 3: Circle scales to full screen');
    }, 2200));
    
    // Step 4: NewSphereGradient Lottie appears (3.2s)
    timers.push(window.setTimeout(() => {
      setStep(4);
      console.log('🎬 Mobile Step 4: NewSphereGradient Lottie appears');
    }, 3200));
    
    // Step 5: Content appears (4.0s)
    timers.push(window.setTimeout(() => {
      setStep(5);
      console.log('✨ Mobile Step 5: Content appears');
    }, 4000));
    
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
              className={
                `poppins text-[28px] font-bold mb-4
                 bg-gradient-to-b from-[#4E4E4E] to-[#232323]
                 text-transparent bg-clip-text transition-all duration-1000 ease-in-out ` +
                (step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6')
              }
            >
              The World's First<br /> Consciousness Super-App
            </h1>

            <p className={
              `openSans text-[14px] text-[#64748B] mb-6 max-w-sm mx-auto transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              Build your conscious identity. Connect with purpose-led peers. Share your knowledge. Learn, grow, and thrive - all in one place.
            </p>

            <div className={
              `flex flex-col gap-3 transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              <Button
                className="rounded-[100px] hero-section-btn py-3 px-6 text-[14px] bg-linear-to-r from-[#7077FE] to-[#9747FF]"
              >
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

        {/* Mobile: No Flip Lotties needed */}

        {/* Mobile Circle Animation - Centered to Rainbow Half-Circle */}
        <div
          className={`absolute z-0 transition-all duration-1000 ease-in-out pointer-events-none mobile-circle ${
            step === 0
              ? 'opacity-0 scale-0'
              : step >= 1
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-0'
          }`}
          style={{
            position: 'absolute',
            // Always perfectly centered for steps 1-2, only move to bottom at step 3
            left: '50%',
            right: 'auto',
            
            // Stay centered for steps 1-2, move to bottom only at step 3
            top: step >= 3 ? 'auto' : '50%',
            bottom: step >= 3 ? 0 : 'auto',
            
            // Circle sizing - scales up gradually, covers half height for mobile
            width: step === 0 ? 0 : 
                  step === 1 ? 120 :
                  step === 2 ? 240 :
                  step >= 3 ? '200vw' : 0,
            height: step === 0 ? 0 :
                   step === 1 ? 120 :
                   step === 2 ? 240 :
                   step >= 3 ? '106vh' : 0, 
            
            // Size constraints for mobile
            maxWidth: step >= 3 ? '200vw' : 'none',  
            maxHeight: step >= 3 ? '200vh' : 'none',
            minWidth: step >= 3 ? '90vw' : 'none',
            minHeight: step >= 3 ? '45vh' : 'none',
            
            // Rainbow half-circle effect only for step 3+
            clipPath: step >= 3 ? 'circle(50% at 50% 100%)' : 'none',
            
            // Perfect centering transforms - stay centered for steps 1-2
            transform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            WebkitTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            msTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            MozTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            
            // Circle stays visible throughout the animation
            opacity: step >= 1 ? 1 : 0,
            
            // Remove margin auto to prevent positioning conflicts
            display: 'block',
            
            // Transform origin for proper scaling from center
            transformOrigin: 'center center',
            WebkitTransformOrigin: 'center center',
            msTransformOrigin: 'center center',
            MozTransformOrigin: 'center center',
            
            // iOS Safari specific fixes
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitPerspective: '1000px',
            perspective: '1000px',
            WebkitTransformStyle: 'preserve-3d',
            transformStyle: 'preserve-3d',
          }}
        >
          {step >= 4 ? (
            <LottieOnView
              animationData={animationData}
              loop
              style={{ 
                width: '100%', 
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                objectFit: 'cover',
                // Align Lottie to match the rainbow half-circle curve
                borderRadius: '50% 50% 0 0',
                transform: 'translateY(50%) scale(1.2)',
                WebkitTransform: 'translateY(50%) scale(1.2)',
                msTransform: 'translateY(50%) scale(1.2)',
                MozTransform: 'translateY(50%) scale(1.2)'
              }}
              className=""
            />
          ) : step >= 1 ? (
            <img
              src="/hero-circle.png"
              alt="Static Sphere"
              className="w-full h-full object-cover"
              style={{
                borderRadius: step >= 3 ? '50% 50% 0 0' : '50%',
                transform: step >= 3 ? 'translateY(50%)' : 'none',
                WebkitTransform: step >= 3 ? 'translateY(50%)' : 'none',
                msTransform: step >= 3 ? 'translateY(50%)' : 'none',
                MozTransform: step >= 3 ? 'translateY(50%)' : 'none'
              }}
            />
          ) : null}
        </div>

      </section>
    </>
  );
} 