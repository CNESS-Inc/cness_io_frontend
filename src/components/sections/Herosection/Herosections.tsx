"use client";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import Lottie from "lottie-react";
import MobileHeroSection from "./MobileHeroSection";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);
  const [flip1, setFlip1] = useState<any>(null);
  const [flip2, setFlip2] = useState<any>(null);
  const [flip3, setFlip3] = useState<any>(null);
  const [flip4, setFlip4] = useState<any>(null);
  const [sphere, setSphere] = useState<any>(null);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  useEffect(() => {
    const loadLotties = async () => {
      try {
        const [f1, f2, f3, f4, sph] = await Promise.all([
          fetch("https://cnessioassets.project-69e.workers.dev/New-Flip01.json").then(res => res.json()),
          fetch("https://cnessioassets.project-69e.workers.dev/New-Flip02.json").then(res => res.json()),
          fetch("https://cnessioassets.project-69e.workers.dev/New-Flip03.json").then(res => res.json()),
          fetch("https://cnessioassets.project-69e.workers.dev/New-Flip04.json").then(res => res.json()),
          fetch("https://cnessioassets.project-69e.workers.dev/Second-globe.json").then(res => res.json())
        ]);
        setFlip1(f1);
        setFlip2(f2);
        setFlip3(f3);
        setFlip4(f4);
        setSphere(sph);
      } catch (err) {
        console.error("Failed to load Lottie animations", err);
      }
    };

    loadLotties();
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    timers.push(setTimeout(() => setStep(2), 500));
    timers.push(setTimeout(() => setStep(3), 800));
    timers.push(setTimeout(() => setStep(4), 1000));
    timers.push(setTimeout(() => setStep(5), 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const [lottieSize, setLottieSize] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setLottieSize({ width: 200, height: 200 });
      } else if (width < 1024) {
        setLottieSize({ width: 240, height: 240 });
      } else if (width < 1537) {
        setLottieSize({ width: 280, height: 280 });
      } else {
        setLottieSize({ width: 320, height: 320 });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (isMobile) return <MobileHeroSection />;

  return (
    <>
      <section className="relative  rounded-[12px]  lg:mx-[12px] bg-[#f4f3f9] hero-section overflow-hidden
            min-[1024px]:h-[100vh] 
            min-[1536px]:h-[100vh]
            
            ">
        <div className="absolute inset-0 flex items-start justify-center z-10 lg:pt-22 md:pt-18 pt-8">
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
          animationData={flip1}
          loop
          style={lottieSize}
          className={`
            absolute 
            top-85 
            left-[-15px]
            min-[320px]:top-100
            min-[320px]:-left-14  
            min-[1024px]:top-30 
            min-[1024px]:left-15 
            min-[1536px]:top-30 
            max-[1536px]:left-8
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}
        />
        <Lottie
          animationData={flip2}
          loop
          style={lottieSize}
          className={`  absolute 
            top-85 
            right-[-15px]
            min-[320px]:top-150
            min-[320px]:right-0 
            min-[1024px]:top-90 
            min-[1024px]:right-15 
            min-[1536px]:top-90 
            min-[1536px]:right-15 
            max-[1536px]:right-8
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}

        />
        <Lottie
          animationData={flip3}
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
          animationData={flip4}
          loop
          style={lottieSize}
          className={`  absolute 
            top-10 
            right-[-15px]
            min-[320px]:top-90 
            min-[320px]:-right-14 
            min-[1024px]:top-15 
            min-[1024px]:right-5 
            min-[1536px]:top-10 
            max-[1536px]:right-5
            transition-all duration-1000 
            hidden md:block 
            z-10 ease-in-out 
            ${step >= 4 ? 'opacity-100' : 'opacity-0'}
          `}
        />

        <div
          className={`absolute z-0 transition-all duration-1000 ease-in-out pointer-events-none hero-round-circle ${step === 0
              ? 'opacity-0 scale-0'
              : step >= 1
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-0'
            }`}
          style={{
            position: 'absolute',
            top: step === 3 ? 'auto' : '62%',
            bottom: step === 3 ? 0 : 'auto',
            left: '50%',
            transform: step === 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            width: step === 0 ? 0 :
              step === 1 ? (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 180 : 200) :
                step === 2 ? (window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 320 : 400) :
                  step === 3 ? (window.innerWidth < 640 ? '20vw' : window.innerWidth < 1024 ? '75vw' : '95vw') :
                    step === 4 ? (window.innerWidth < 640 ? '85vw' : window.innerWidth < 1024 ? '75vw' : '100vw') : '100vw',

            height: step === 0 ? 0 :
              step === 1 ? (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 180 : 200) :
                step === 2 ? (window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 320 : 400) :
                  step === 3 ? (window.innerWidth < 640 ? '20vh' : window.innerWidth < 1024 ? '75vw' : '95vw') :
                    step === 4 ? (window.innerWidth < 640 ? '32vh' : window.innerWidth < 1024 ? '75vw' : '100vh') : '100vh',

            maxWidth: step === 3 ? (window.innerWidth < 640 ? 350 : window.innerWidth < 1024 ? 600 : 350) :
              step === 4 ? (window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 500 : 1500) : 'none',

            maxHeight: step === 3 ? (window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 400 : 350) :
              step === 4 ? (window.innerWidth < 640 ? 220 : window.innerWidth < 1024 ? 350 : 1500) : 'none',

            minWidth: step === 3 ? (window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 400 : 500) :
              step === 4 ? (window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 350 : 450) : 'none',

            minHeight: step === 3 ? (window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 200 : 250) :
              step === 4 ? (window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 180 : 230) : 'none',

            WebkitTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',
            msTransform: step >= 3 ? 'translateX(-50%)' : 'translate(-50%, -50%)',

            opacity: step >= 1 ? 1 : 0,
          }}
        >
          {step >= 4 && (
            <Lottie
              animationData={sphere}
              loop
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: 1
              }}
              className="lg:mt-80 mt-50"
            />
          )}
        </div>
      </section>
    </>
  );
}
