"use client";
import Button from "../../ui/Button";
import AnimatedBackground from "../../ui/HomeHeroBackground";


export default function HeroSection() {
  return (

    <section className="relative h-[692px] rounded-[12px] overflow-hidden lg:mx-[12px]">
  {/* 🌈 Animated Canvas Background */}
  <AnimatedBackground />

  {/* Optional overlay image */}
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{ backgroundImage: "url('/hero_bg.png')" }}
  ></div>

  {/* Content */}
  <div className="absolute inset-0 flex items-center justify-center z-10">
    <div className="text-center px-4">
      {/* Heading */}
      <h1 className="jakarta text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
        Build with Consciousness
      </h1>

      {/* Description */}
      <p className="openSans text-lg sm:text-xl text-[#7A7A7A] mb-10 max-w-2xl mx-auto">
        The world's first conscious business platform — where individuals
        and organizations certify, connect, grow, and lead with integrity.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="gradient-primary"
          className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
        >
          Get Started
        </Button>
        <Button variant="white-outline" size="md">
          Join the Visionary Council
        </Button>
      </div>
    </div>
  </div>
</section>
  );
}
