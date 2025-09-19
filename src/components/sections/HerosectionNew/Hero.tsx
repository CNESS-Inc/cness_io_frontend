"use client";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
//import { MessageCircle, ShoppingBag, BookOpen, Compass,  } from "lucide-react";
import SignupModel from "../../OnBoarding/Signup";
import { useNavigate } from "react-router-dom";

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
        <div className="absolute -top-24 -left-24 w-[520px] sm:w-[640px] lg:w-[720px] aspect-square rounded-full bg-[#00D2FF]/18 blur-[360px] sm:blur-[420px] lg:blur-[350px] mix-blend-screen" />
        <div className="absolute top-12 -right-20 w-[560px] sm:w-[680px] lg:w-[760px] aspect-square rounded-full bg-[#FF994A]/16 blur-[380px] sm:blur-[460px] lg:blur-[350px] mix-blend-screen" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/3 w-[520px] sm:w-[640px] lg:w-[720px] aspect-square rounded-full bg-[#6340FF]/14 blur-[360px] sm:blur-[420px] lg:blur-[350px] mix-blend-screen" />
      </div>

      {/* top content */}
      <div className="z-10 pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className={`font-medium text-[clamp(28px,5vw,42px)] leading-[115%] tracking-[-0.02em] bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out ${
            step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
          }`}
        >
          The World’s First
          <br /> Consciousness Super-App
        </h1>

        <p
          className={`openSans font-[300] text-[16px] leading-[24px] tracking-[0px] text-[#64748B] text-center max-w-[62ch] mt-4 sm:mt-6 lg:mt-6 transition-all duration-1000 ease-in-out  ${
    step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Build your conscious identity. Connect with purpose-led peers. Share
          your knowledge. Learn, grow, and thrive – all in one place.
        </p>

        <div
          className={`mt-5 sm:mt-6 flex justify-center transition-all duration-1000 ease-in-out ${
            step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="gradient-primary"
              className="w-full sm:w-auto rounded-[100px] hero-section-btn py-2 px-4 text-[14px] sm:py-3 sm:px-8 sm:text-base font-['Open Sans'] font-normal leading-[100%] text-center"
              onClick={() => setOpenSignup(true)}
            >
              Start your Conscious Journey
            </Button>

            <Button
              variant="white-outline"
              className="w-full sm:w-auto hero-section-btn py-2 px-4 text-[14px] sm:py-3 sm:px-8 sm:text-base font-['Plus Jakarta Sans'] font-medium leading-[100%] tracking-[0px] text-center border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
              size="md"
              onClick={() => navigate("/ecosystem")}
            >
              Discover CNESS
            </Button>
          </div>
        </div>
      </div>

      {/* bottom image */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 pt-12 sm:pt-16">
        <div className="relative mx-auto w-full max-w-[1900px] rounded-[32px] overflow-hidden">
          {/* responsive height using aspect-ratio; keeps the face framed via object-position */}
          <div className="w-full rounded-[32px] overflow-hidden aspect-[1900/460]">
            <img
              src="https://cdn.cness.io/Hero%20section1.webp"
              alt="Hero Section"
              className="w-full h-full object-cover object-[58%_50%] sm:object-[60%_50%] md:object-[62%_50%] lg:object-[64%_50%] xl:object-[66%_50%] 2xl:object-[68%_50%]"
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
