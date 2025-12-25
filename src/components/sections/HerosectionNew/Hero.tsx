"use client";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
//import { MessageCircle, ShoppingBag, BookOpen, Compass,  } from "lucide-react";
import SignupModel from "../../OnBoarding/Signup";
import { useNavigate } from "react-router-dom";
// import OptimizeImage from "../../ui/OptimizeImage";

export default function HeroSection() {
  const [step, setStep] = useState(0);
  const [openSignup, setOpenSignup] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const t: number[] = [];
    t.push(window.setTimeout(() => setStep(1), 300));
    t.push(window.setTimeout(() => setStep(2), 500));
    t.push(window.setTimeout(() => setStep(3), 800));
    t.push(window.setTimeout(() => setStep(4), 1000));
    t.push(window.setTimeout(() => setStep(5), 1200));
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative bg-white overflow-hidden flex flex-col">
      {/* gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-[320px] sm:w-[520px] lg:w-[720px] aspect-square rounded-full bg-[#00D2FF]/18 blur-[180px] sm:blur-[360px] lg:blur-[420px] mix-blend-screen" />
        <div className="absolute top-12 -right-20 w-[560px] sm:w-[680px] lg:w-[760px] aspect-square rounded-full bg-[#FF994A]/16 blur-[380px] sm:blur-[460px] lg:blur-[350px] mix-blend-screen" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/3 w-[320px] sm:w-[520px] lg:w-[720px] aspect-square rounded-full bg-[#6340FF]/14 blur-[180px] sm:blur-[360px] lg:blur-[420px] mix-blend-screen" />
      </div>

      {/* top content */}
      <div className="z-10 pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className={`font-medium text-[clamp(28px,5vw,42px)] leading-[125%] tracking-[-0.02em] bg-linear-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out ${
            step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          Conscious Social Media Superapp.
          <br />
        </h1>

        <p
          className={`font-['Open_Sans'] font-light text-[14px] sm:text-[15px] lg:text-[16px] leading-[22px] sm:leading-6 tracking-[0px] text-[#242424] text-center max-w-[65ch] mt-4 sm:mt-6 lg:mt-6 transition-all duration-1000 ease-in-out  ${
            step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          CNESS is a place where mindful people connect, share their stories and
          learn from each other. Whether you’re new to conscious living or
          already on your journey, you’re welcome here.
        </p>

        <div
          className={`mt-5 sm:mt-6 flex justify-center transition-all duration-1000 ease-in-out ${
            step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-center">
            <Button
              variant="gradient-primary"
              className="w-full sm:w-auto rounded-[100px] hero-section-btn 
             py-2 px-4 sm:py-3 sm:px-8 text-[14px] sm:text-[16px] whitespace-nowrap
             font-['Open_Sans'] font-medium 
             leading-[100%] tracking-[0px] text-center"
              onClick={() => setOpenSignup(true)}
            >
              Start your Consciousness Journey
            </Button>

            <Button
              variant="white-outline"
              className="w-full sm:w-auto hero-section-btn py-2 px-4 text-[16px] sm:py-3 sm:px-8 sm:text-base font-['Plus Jakarta Sans'] font-medium leading-[100%] tracking-[0px] text-center border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
              size="md"
              onClick={() => navigate("/ecosystem")}
            >
              Discover CNESS
            </Button>
          </div>
        </div>
      </div>

      {/* bottom image */}
<div className="w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 pt-6 sm:pt-12">
<div className="relative mx-auto w-full max-w-[1900px] rounded-[16px] sm:rounded-[32px] overflow-hidden">
          {/* responsive height using aspect-ratio; keeps the face framed via object-position */}
          <div className="hero-img w-full rounded-4xl aspect-auto object-cover object-center overflow-hidden">
            {/* <img
              src="https://cdn.cness.io/Hero%20section1.webp"
              alt="Hero Section"
              width="1600"
              height="900"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-[58%_50%] sm:object-[60%_50%] md:object-[62%_50%] lg:object-[64%_50%] xl:object-[66%_50%] 2xl:object-[68%_50%]"
            /> */}
            {/* <OptimizeImage
              src="Hero_section1.webp"
              alt="Hero Section"
              width={'100%'}
              className="w-full object-cover h-full"
            /> */}
            <img
              srcSet="
    https://res.cloudinary.com/diudvzdkb/image/upload/w_640,h_188,c_fill,q_auto,f_auto/v1759910599/Hero_section1_s5fvxh.webp 640w,
    https://res.cloudinary.com/diudvzdkb/image/upload/w_1024,h_301,c_fill,q_auto,f_auto/v1759910599/Hero_section1_s5fvxh.webp 1024w,
    https://res.cloudinary.com/diudvzdkb/image/upload/w_1271,h_374,c_fill,q_auto,f_auto/v1759910599/Hero_section1_s5fvxh.webp 1271w
  "
              sizes="(max-width: 640px) 640px,
         (max-width: 1024px) 1024px,
         1271px"
              src="https://res.cloudinary.com/diudvzdkb/image/upload/w_1271,h_374,c_fill,q_auto,f_auto/v1759910599/Hero_section1_s5fvxh.webp"
              alt="Hero Section"
              width={1271}
              height={374}
              loading="eager"
              fetchPriority="high"
className="w-full h-auto object-cover object-center"
            />
          </div>

          {/* floating pills only on large screens to avoid crowding mobile */}
          {/* ⬇️ Paste the pills overlay block here ⬇️ */}
          {/* Pills overlay: inside the SAME relative/aspect box 
    <div className="absolute inset-0 hidden lg:block pointer-events-none z-10">
      {[
        // row 1
        { x: 0.55 * 1900, y: 0.26 * 460, title: "Mentor Hub", sub: "Learn, practice, evolve", Icon: BookOpen, bg: "bg-green-100", ic: "text-green-600" },
        { x: 0.68 * 1900, y: 0.26 * 460, title: "Social feed", sub: "Reflect. Share. Inspire", Icon: MessageCircle, bg: "bg-blue-100", ic: "text-blue-600" },
        { x: 0.82 * 1900, y: 0.26 * 460, title: "Directory", sub: "Get discovered for who you are.", Icon: Compass, bg: "bg-[#FFCC00]/20", ic: "text-[#FFCC00]" },
        { x: 0.98 * 1900, y: 0.26 * 460, title: "Market Place", sub: "Sell your conscious to…", Icon: ShoppingBag, bg: "bg-pink-50", ic: "text-pink-600" },

        // row 2
        { x: 0.68 * 1900, y: 0.42 * 460, title: "Mentor Hub", sub: "Guidance. Build your conscious tribe.", Icon: BookOpen, bg: "bg-green-100", ic: "text-green-600" },
        { x: 0.82 * 1900, y: 0.42 * 460, title: "Social feed", sub: "Reflect. Share. Inspire", Icon: MessageCircle, bg: "bg-blue-100", ic: "text-blue-600" },
        { x: 1.00 * 1900, y: 0.42 * 460, title: "Directory", sub: "Get discovered for who you are.", Icon: Compass, bg: "bg-[#FFCC00]/20", ic: "text-[#FFCC00]" },
      ].map((p, i) => {
        const leftPct = (p.x / 1900) * 100;
        const topPct = (p.y / 460) * 100;
        return (
          <div
            key={i}
            className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
            style={{
              /* clamp within frame just in case 
              left: `min(${leftPct}%, 98%)`,
              top: `${topPct}%`,
            }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white backdrop-blur-md border border-white shadow-[0_8px_28px_rgba(0,0,0,0.14)] px-6 py-2 whitespace-nowrap">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${p.bg}`}>
                <p.Icon className={`h-3.5 w-3.5 ${p.ic}`} strokeWidth={2} />
              </span>
              <div className="leading-tight">
                {/* freeze sizes so pill width doesn't shift 
                <div className="font-semibold text-gray-800 text-[12px]"> {p.title} </div>
                <div className="text-[11px] text-slate-500"> {p.sub} </div>
              </div>
            </div>
          </div>
        );
      })}*/}
        </div>
      </div>

      {/* Signup Popup Modal */}
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </section>
  );
}
