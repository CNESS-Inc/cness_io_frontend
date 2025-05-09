'use client'
import Link from "next/link";
import Button from "../../ui/Button";
import { jakarta, openSans, poppins } from "@/app/layout";

export default function HeroSection() {
  return (
    <section className="relative h-[692px] rounded-[12px] overflow-hidden lg:mx-[12px]">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero_bg.png')" }}
      ></div>

      {/* Content container with flex centering */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-4">
          {/* Heading */}
          <h1 className={`${poppins.className} text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6`}>
            Build with Consciousness
          </h1>

          {/* Description */}
          <p className={`${openSans.className} text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto`}>
            The world's first conscious business platform — where individuals
            and organizations certify, connect, grow, and lead with integrity.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              className="bg-[#7077FE] hover:bg-transparent py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
              variant="primary"
              withGradientOverlay
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
