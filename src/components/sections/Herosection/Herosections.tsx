"use client";
import Button from "../../ui/Button";
 
import Lottie from 'lottie-react';
import SphereGradient from '../../../assets/lottie-files/globe/Sphere-Gradient.json';
import Flip01 from '../../../assets/lottie-files/Flip-01/Flip01.json';
import Flip02 from '../../../assets/lottie-files/Flip-02/Flip02.json';
import Flip03 from '../../../assets/lottie-files/Flip-03/Flip03.json';
import Flip04 from '../../../assets/lottie-files/Flip-04/Flip04.json';
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
 
  return (
    <>
      <section className="relative h-[100vh] rounded-[12px] overflow-hidden lg:mx-[12px] ">
 
        
        <div className="absolute inset-0 flex items-start justify-center z-10 pt-30">
          <div className="text-center px-4">
            
            <h1
              className={
                `poppins text-4xl sm:text-5xl md:text-[42px] leading-14 font-bold mb-6
                 bg-gradient-to-b from-[#4E4E4E] to-[#232323]
                 text-transparent bg-clip-text transition-all duration-1000 ease-in-out ` +
                (step >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6')
              }
            >
              The World’s First<br /> Consciousness Super-App
            </h1>
 
           
            <p className={
              `openSans text-lg sm:text-xl text-[#64748B] mb-10 max-w-2xl mx-auto transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              Build your conscious identity. Connect with purpose-led peers. Share your knowledge. Learn, grow, and thrive - all in one place.
            </p>
 
            
            <div className={
              `flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ` +
              (step >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6')
            }>
              <Button
                className="rounded-[100px] py-3 px-8 self-stretch  bg-linear-to-r from-[#7077FE] to-[#9747FF]"
              >
                Get Started
              </Button>
              <Button variant="white-outline" size="md" onClick={() => window.location.href = "https://visionary.cness.io"}>
                Explore the Movement
              </Button>
            </div>
          </div>
        </div>
       
        <Lottie
          animationData={Flip01}
          loop
          autoplay
          style={{ width: 300, height: 300 }}
          className={`absolute top-10 left-10 transition-all duration-1000 ease-in-out ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}
        />
        <Lottie
          animationData={Flip02}
          loop
          autoplay
          style={{ width: 300, height: 300 }}
          className={`transition-all top-80 right-40 absolute duration-1000 ease-in-out ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}
        />
        <Lottie
          animationData={Flip03}
          loop
          autoplay
          style={{ width: 300, height: 300 }}
          className={`absolute bottom-80 left-40 transition-all duration-1000 ease-in-out ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}
        />
        <Lottie
          animationData={Flip04}
          loop
          autoplay
          style={{ width: 300, height: 300 }}
          className={`absolute  top-0 right-0 transition-all duration-1000 ease-in-out ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}
        />
       
        <div
          className={`absolute z-0 transition-all duration-1000 ease-in-out pointer-events-none ${
            step === 0 ? 'opacity-0 scale-0' :
            step === 1 ? 'opacity-100 scale-75' :
            step === 2 ? 'opacity-100 scale-100' :
            step >= 3 ? 'opacity-100 scale-100' :
            'opacity-0 scale-0'
          }`}
          style={{
            width: step >= 3 ? '90vw' : (step >= 2 ? 320 : 240),
            maxWidth: step >= 3 ? 1400 : undefined,
            height: step >= 3 ? '45vw' : (step >= 2 ? 320 : 240),
            maxHeight: step >= 3 ? 700 : undefined,
            minWidth: step >= 3 ? 600 : undefined,
            minHeight: step >= 3 ? 300 : undefined,
            clipPath: step >= 3 ? 'inset(50% 0 0 0)' : 'none',
            left: '50%',
            ...(step >= 3
              ? { bottom: 0, top: 'auto', transform: 'translateX(-50%)' }
              : { top: '50%', bottom: 'auto', transform: 'translate(-50%, -50%)' })
          }}
        >
          <Lottie
            animationData={SphereGradient}
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </section>
    </>
  );
}
 