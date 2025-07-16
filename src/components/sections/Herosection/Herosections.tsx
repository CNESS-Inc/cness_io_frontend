"use client";
import Button from "../../ui/Button";

import Lottie from 'lottie-react';
import Flip01 from '../../../assets/lottie-files/Flip-01/Flip01.json';
import Flip02 from '../../../assets/lottie-files/Flip-02/Flip02.json';
import Flip03 from '../../../assets/lottie-files/Flip-03/Flip03.json';
import Flip04 from '../../../assets/lottie-files/Flip-04/Flip04.json';
import NewSphereGradient from '../../../assets/lottie-files/New-globe/Sphere-Gradient.json';
import { useEffect, useState } from "react";

export default function HeroSection() {

  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 300));
    timers.push(window.setTimeout(() => setStep(2), 1200));
    timers.push(window.setTimeout(() => setStep(3), 2200));
    timers.push(window.setTimeout(() => setStep(4), 3200));
    timers.push(window.setTimeout(() => setStep(5), 4000));
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
  

  return (
    <>
      <section className="relative  rounded-[12px] overflow-hidden lg:mx-[12px] bg-[#f4f3f9] hero-section overflow-hidden
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
                className="rounded-[100px] lg:py-3 py-2 lg:px-8 px-4 lg:text-base text-[14px] self-stretch  bg-linear-to-r from-[#7077FE] to-[#9747FF]"
              >
                Get Started
              </Button>
              <Button variant="white-outline" className="lg:text-base text-[14px] lg:py-3 py-2 lg:px-8 px-4" size="md" onClick={() => window.location.href = "https://visionary.cness.io"}>
                Explore the Movement
              </Button>
            </div>
          </div>
        </div>

        <Lottie
          animationData={Flip01}
          loop
          autoplay
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
          autoplay
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
          autoplay
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
          autoplay
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
      : step === 1
      ? 'opacity-100 scale-75'
      : step === 2
      ? 'opacity-100 scale-100'
      : step >= 3
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-0'
  }`}
  style={{
    ...(step === 1 || step === 2
      ? {
          width:
            typeof window !== 'undefined' && window.innerWidth < 1024
              ? 90
              : 200,
          height:
            typeof window !== 'undefined' && window.innerWidth < 1024
              ? 90
              : 200,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      : {}),
    ...(step >= 3
      ? {
          width: '100vw',
          height: '50vw',
          maxWidth: 1400,
          maxHeight: 850,
          minWidth: 600,
          minHeight: 300,
          clipPath: 'inset(50% 0 0 0)',
          bottom: 0,
          top: 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
        }
      : {}),
  }}
>
  {step >= 3 ? (
    <Lottie
      animationData={NewSphereGradient}
      loop
      autoplay
      style={{ width: '100%', height: '100%' }}
      className="lg:pt-40 pt-40"
    />
  ) : (
    <img
      src="/hero-circle.png"
      alt="Static Sphere"
      className="w-full h-full"
    />
  )}
</div>

      </section>
    </>
  );
}
