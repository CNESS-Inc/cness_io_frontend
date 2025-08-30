"use client";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  MessageCircle,
  ShoppingBag,
  BookOpen,
  Compass,
  type LucideIcon,
} from "lucide-react";
export default function HeroSection() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStep(1), 300));
    timers.push(setTimeout(() => setStep(2), 500));
    timers.push(setTimeout(() => setStep(3), 800));
    timers.push(setTimeout(() => setStep(4), 1000));
    timers.push(setTimeout(() => setStep(5), 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  type PillProps = {
  title: string;
  subtitle: string;
  Icon: LucideIcon;          // <— pass the Lucide component
  iconBg?: string;           // tailwind class for bg tint
  iconClass?: string;        // tailwind class for icon color
};

const Pill = ({
  title,
  subtitle,
  Icon,
  iconBg = "bg-indigo-50",
  iconClass = "text-indigo-600",
}: PillProps) => (
  <div
    className="flex items-center gap-2 rounded-full bg-white/100 backdrop-blur-md
               border border-white/100 shadow-[0_8px_28px_rgba(0,0,0,0.14)]
               px-6 py-2 text-[11px] sm:text-xs pointer-events-auto"
  >
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full ${iconBg}`}
    >
      <Icon className={`h-3.5 w-3.5 ${iconClass}`} strokeWidth={2} />
    </span>
    <div className="leading-tight">
      <div className="font-semibold text-gray-800">{title}</div>
      <div className="text-[10px] sm:text-[11px] text-slate-500">{subtitle}</div>
    </div>
  </div>
);

  return (
    <section
      className="relative rounded-[12px] lg:mx-[12px] bg-[#FFFFFF] hero-section overflow-hidden
                 min-[1024px]:h-[100vh] min-[1536px]:h-[100vh]
                 flex flex-col justify-between"
    >
 <div className="pointer-events-none absolute inset-0 z-0">
    {/* Cyan */}
    <div className="absolute -top-24 -left-24
                    w-[720px] h-[720px] rounded-full
                    bg-[#00D2FF]/18 blur-[420px] sm:blur-[480px] lg:blur-[350px]
                    mix-blend-screen" />
    {/* Purple */}
    <div className="absolute top-12 -right-20
                    w-[760px] h-[760px] rounded-full
                    bg-[#FF994A]/16 blur-[460px] sm:blur-[520px] lg:blur-[350px]
                    mix-blend-screen" />
    {/* Orange */}
    <div className="absolute -bottom-24 left-1/2 -translate-x-1/3
                    w-[720px] h-[720px] rounded-full
                    bg-[#6340FF]/14 blur-[420px] sm:blur-[480px] lg:blur-[350px]
                    mix-blend-screen" />
  </div>
      {/* Top content */}
      <div className="flex flex-col items-center text-center z-10 pt-16 px-4">
        <h1
          className={
            `poppins text-[32px] md:text-[42px] lg:leading-14 font-bold mb-6
             bg-gradient-to-b from-[#4E4E4E] to-[#232323]
             text-transparent bg-clip-text transition-all duration-1000 ease-in-out ` +
            (step >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6")
          }
        >
          The World’s First
          <br /> Consciousness Super-App
        </h1>

        <p
          className={
            `openSans lg:text-lg md:text-[16px] text-[12px] text-[#64748B] lg:mb-10 md:mb-12 mb-4 
             max-w-2xl mx-auto transition-all duration-1000 ease-in-out ` +
            (step >= 5
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6")
          }
        >
          Build your conscious identity. Connect with purpose-led peers. Share
          your knowledge. Learn, grow, and thrive – all in one place.
        </p>

        <div
          className={
            `flex flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ` +
            (step >= 5
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6")
          }
        >
         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center items-center">
  <Button
    className="
      w-full sm:w-fit
      rounded-[100px] hero-section-btn
      py-2 px-4 text-[14px]
      sm:py-3 sm:px-8 sm:text-base
      font-['Open Sans'] font-normal leading-[100%] text-center
      bg-gradient-to-r from-[#7077FE] to-[#9747FF]
    "
    onClick={() => (window.location.href = '/sign-up')}
  >
    Start your Conscious Journey
  </Button>

  <Button
    variant="white-outline"
    className="
      w-full sm:w-fit
      hero-section-btn
      py-2 px-4 text-[14px]
      sm:py-3 sm:px-8 sm:text-base
      shadow-md font-['Plus Jakarta Sans'] font-medium leading-[100%]
      tracking-[0px] text-center
    "
    size="md"
    onClick={() => (window.location.href = '/sign-up')}
  >
    Discover CNESS
  </Button>
</div>
        </div>
      </div>

      {/* Bottom Image */}
   <div className="w-full px-4 lg:px-8 pb-6">
      <div className="relative mx-auto max-w-[1900px] rounded-[32px] overflow-hidden">
  <img
    src="https://cdn.cness.io/herosection.webp"
    alt="Hero Section"
    className="
      mx-auto w-full max-w-[1900px] rounded-[32px]
      object-cover
      /* heights per breakpoint */
      h-[240px] sm:h-[280px] md:h-[320px] lg:h-[405px] xl:h-[460px] 2xl:h-[460px]
      /* keep the man’s face in frame as width grows */
      object-[58%_50%]       /* base: a bit right of center */
      sm:object-[60%_50%]
      md:object-[62%_50%]
      lg:object-[64%_50%]
      xl:object-[66%_50%]
      2xl:object-[68%_50%]
    "
  />
{/* Put this inside the same RELATIVE container as the image */}
<div className="absolute inset-0 hidden md:block pointer-events-none">
  {/* ---- Row 1 (4 pills) ---- */}
  <div className="absolute top-[25%] left-[56%]">
    <Pill title="Mentor Hub" subtitle="Learn, practice, evolve" Icon={BookOpen} iconBg="bg-green-100" iconClass="text-green-600" />
  </div>
  <div className="absolute top-[25%] left-[67%]">
    <Pill title="Social feed" subtitle="Reflect. Share. Inspire" Icon={MessageCircle} iconBg="bg-blue-100" iconClass="text-blue-600" />
  </div>
  <div className="absolute top-[25%] left-[78%]">
    <Pill title="Directory" subtitle="Get discovered for who you are." Icon={Compass} iconBg="bg-[#FFCC00]/20" iconClass="text-[#FFCC00]"  />
  </div>
  <div className="absolute top-[25%] right-[-2%]">
    <Pill title="Market Place" subtitle="Sell your conscious to…"   Icon={ShoppingBag} iconBg="bg-pink-50" iconClass="text-pink-600"/>
  </div>

  {/* ---- Row 2 (3 pills) ---- */}
  <div className="absolute top-[40%] left-[60%]">
    <Pill title="Mentor Hub" subtitle="Guidance. Build your conscious tribe." Icon={BookOpen} iconBg="bg-green-100" iconClass="text-green-600" />
  </div>
  <div className="absolute top-[40%] left-[75%]">
    <Pill title="Social feed" subtitle="Reflect. Share. Inspire"Icon={MessageCircle} iconBg="bg-blue-100" iconClass="text-blue-600"  />
  </div>
  <div className="absolute top-[40%] right-[2%]">
    <Pill title="Directory" subtitle="Get discovered for who you are."Icon={Compass} iconBg="bg-[#FFCC00]/20" iconClass="text-[#FFCC00]"/>
  </div>
</div>
</div>
</div>
    </section>
  );
}
