"use client";
import Button from "../../ui/Button";

import Lottie from 'lottie-react';
import Flip01 from '../../../assets/lottie-files/Flip-01/Flip01.json';
import Flip02 from '../../../assets/lottie-files/Flip-02/Flip02.json';
import Flip03 from '../../../assets/lottie-files/Flip-03/Flip03.json';
import Flip04 from '../../../assets/lottie-files/Flip-04/Flip04.json';
import NewSphereGradient from '../../../assets/lottie-files/New-globe/Sphere-Gradient.json';
import { useEffect, useState } from "react";
import MobileHeroSection from "./MobileHeroSection";

export default function HeroSection() {
 const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timers: number[] = [];
    
    // Step 1: Small circle appears (0.3s)
    timers.push(window.setTimeout(() => {
      setStep(1);
      console.log('🎯 Step 1: Small circle appears');
    ////  alert('Step 1: Small circle appears');
    }, 300));
    
    // Step 2: Circle scales up (1.2s)
    timers.push(window.setTimeout(() => {
      setStep(2);
      console.log('📈 Step 2: Circle scales up');
      //alert('Step 2: Circle scales up');
    }, 1200));
    
    // Step 3: Circle slides down and becomes smaller half-circle (2.2s)
    timers.push(window.setTimeout(() => {
      setStep(3);
      console.log('⬇️ Step 3: Circle slides down and becomes half-circle');
     // alert('Step 3: Circle slides down and becomes half-circle');
    }, 2200));
    
    // Step 4: Lottie appears on top of half-circle (3.2s)
    timers.push(window.setTimeout(() => {
      setStep(4);
      console.log('🎬 Step 4: Lottie appears on top of half-circle');
      //alert('Step 4: Lottie appears on top of half-circle');
    }, 3200));
    
    // Step 5: Content and corner Lotties appear (4.0s)
    timers.push(window.setTimeout(() => {
      setStep(5);
      console.log('✨ Step 5: Content and corner Lotties appear');
     // alert('Step 5: Content and corner Lotties appear');
    }, 4000));
    
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const [lottieSize, setLottieSize] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setLottieSize({ width: 200, height: 200 }); // mobile
      } else if (width < 1024) {
        setLottieSize({ width: 300, height: 300 }); // tablets
      } else if (width < 1536) {
        setLottieSize({ width: 300, height: 300 }); // laptops + MacBooks
      } else {
        setLottieSize({ width: 600, height: 600 }); // large desktops / 4K
      }
    };

    updateSize(); // set initial size
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Return mobile version for screens < 768px
  if (isMobile) {
    return <MobileHeroSection />;
  }

  return (
    <>
      <section className="relative  rounded-[12px]  lg:mx-[12px] bg-[#f4f3f9] hero-section overflow-hidden
            min-[1024px]:h-[100vh] 
            min-[1536px]:h-[100vh]
            
            ">


        <div className="absolute inset-0 flex items-start justify-center z-10 lg:pt-30 md:pt-18 pt-8">
          <div className="text-center px-4">

            <h1
              className={
                `poppins text-[32px] md:text-[42px] lg:leading-14 font-bold mb-6
                 bg-gradient-to-b from-[#4E4E4E] to-[#232323]
                 text-transparent bg-clip-text transition-all duration-1000 ease-in-out ` +
                (step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6')
              }
            >
              The World’s First<br /> Consciousness Super-App
            </h1>


            <p className={
              `openSans lg:text-lg md:text-[16px] text-[12px] text-[#64748B] lg:mb-10 md:mb-12 mb-4 max-w-2xl mx-auto transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              Build your conscious identity. Connect with purpose-led peers. Share<br /> your knowledge. Learn, grow, and thrive - all in one place.
            </p>


            <div className={
              `flex flex-row sm:flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              <Button
                className="rounded-[100px] hero-section-btn w-fit lg:py-3 py-2 lg:px-8 px-4 lg:text-base text-[14px] self-stretch  bg-linear-to-r from-[#7077FE] to-[#9747FF]"
              >
                Get Started
              </Button>
              <Button variant="white-outline" className="lg:text-base hero-section-btn text-[14px] lg:py-3 py-2 lg:px-8 px-4" size="md" onClick={() => window.location.href = "https://visionary.cness.io"}>
                Explore the Movement
              </Button>
            </div>
          </div>
        </div>

        <Lottie
          animationData={Flip01}
          loop
          style={lottieSize}
          className={`
            absolute 
            top-85 
            left-[-15px]
            min-[320px]:top-100
            min-[320px]:-left-14  
            min-[1024px]:top-30 
            min-[1024px]:left-5 
            min-[1536px]:top-0 
            max-[1536px]:left-8
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}
        />
        <Lottie
          animationData={Flip02}
          loop
          style={lottieSize}
          className={`  absolute 
            top-85 
            right-[-15px]
            min-[320px]:top-150
            min-[320px]:right-0 
            min-[1024px]:top-80 
            min-[1024px]:right-5 
            min-[1536px]:top-70 
            max-[1536px]:right-8
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}

        />
        <Lottie
          animationData={Flip03}
          loop
          style={lottieSize}
          className={`  absolute 
            bottom-85 
            left-[-15px]
            min-[320px]:bottom-10
            min-[320px]:left-10
            min-[1024px]:bottom-30 
            min-[1024px]:left-0 
            min-[1536px]:bottom-20 
            max-[1536px]:left-8
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}
        />
        <Lottie
          animationData={Flip04}
          loop
          style={lottieSize}
          className={`  absolute 
            top-10 
            right-[-15px]
            min-[320px]:top-90 
            min-[320px]:-right-14 
            min-[1024px]:top-10 
            min-[1024px]:right-5 
            min-[1536px]:top-0 
            max-[1536px]:right-5
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}
        />

      <div
  className={`absolute z-0 transition-all duration-1000 ease-in-out pointer-events-none hero-round-circle ${
    step === 0
      ? 'opacity-0 scale-0'
      : step >= 1
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-0'
  }`}
  style={{
    position: 'absolute',
    // Circle positioning: centered for steps 1-2, bottom for step 3+
    top: step === 3 ? 'auto' : '60%',
    bottom: step === 3 ? 0 : 'auto',
    left: '50%',
    // clipPath: "none",
    // Transform: centered for steps 1-2, bottom-aligned for step 3+
    transform: step === 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
    
    // Circle sizing - responsive for all screen sizes
    // Step 1: Small circle
    // Step 2: Medium circle  
    // Step 3+: Smaller half-circle that slides down
width: step === 0 ? 0 : 
       step === 1 ? (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 180 : 200) :
       step === 2 ? (window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 320 : 400) :
       step === 3 ? (window.innerWidth < 640 ? '20vw' : window.innerWidth < 1024 ? '70vw' : '90vw') :
       step === 4 ? (window.innerWidth < 640 ? '85vw' : window.innerWidth < 1024 ? '75vw' : '95vw') :'80vw',

height: step === 0 ? 0 :
        step === 1 ? (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 180 : 200) :
        step === 2 ? (window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 320 : 400) :
        step === 3 ? (window.innerWidth < 640 ? '20vh' : window.innerWidth < 1024 ? '70vw' : '90vw') :
        step === 4 ? (window.innerWidth < 640 ? '32vh' : window.innerWidth < 1024 ? '75vw' : '95vw') : '80vh',

maxWidth: step === 3 ? (window.innerWidth < 640 ? 350 : window.innerWidth < 1024 ? 600 : 350) :
          step === 4 ? (window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 500 : 1500) : 'none',

maxHeight: step === 3 ? (window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 400 : 350) :
           step === 4 ? (window.innerWidth < 640 ? 220 : window.innerWidth < 1024 ? 350 : 1500) : 'none',

minWidth: step === 3 ? (window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 400 : 500) :
          step === 4 ? (window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 350 : 450) : 'none',

minHeight: step === 3 ? (window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 200 : 250) :
           step === 4 ? (window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 180 : 230) : 'none',

    
    // Half-circle effect: only applied when at bottom (step 3+)
    // inset(0 0 50% 0) = shows top half, hides bottom half (rainbow effect)
    clipPath: step === 3 ? 'inset(0 0 50% 0)' : 'none',
    
    // Browser compatibility for transforms
    WebkitTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
    msTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
    
    // Circle stays visible throughout the animation
    opacity: step >= 1 ? 1 : 0,
  }}
>
  {step >= 4 ? (
    <Lottie
      animationData={NewSphereGradient}
      loop
      // Lottie width matches the half-circle width exactly
      // Height is 100% to fill the half-circle area
      style={{ 
        width: '100%', 
        height: '100%',
        // position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
      }}
      // No padding needed as Lottie should fill the entire half-circle
      className=""
    />
  ) : (
    <img
      src="/hero-circle.png"
      alt="Static Sphere"
      className="w-full h-full "
    />
  )}
</div>


      </section>
    </>
  );
}
