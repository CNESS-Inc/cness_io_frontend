  "use client";
  import Button from "../../ui/Button";
  import AnimatedBackground from "../../ui/HomeHeroBackground";

  export default function HeroSection() {
    return (
      <section className="relative h-[692px] rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px]">
        <div className="absolute inset-0 z-[-2] bg-gradient-to-br from-[#a6d8ff] via-[#fbd4ba] to-[#f8fbff]" />
        {/* 🌈 Animated Canvas Background */}
        <AnimatedBackground />

        {/* Optional overlay image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/hero_bg.png')" }}
        ></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="text-center w-full max-w-screen-lg">
            {/* Heading */}
            <h1 className="jakarta text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
              Build with Consciousness
            </h1>

            {/* Description */}
            <p className="openSans text-base sm:text-lg md:text-xl text-[#7A7A7A] mb-10 max-w-2xl mx-auto">
              The world's first conscious business platform — where individuals
              and organizations certify, connect, grow, and lead with integrity.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="gradient-primary"
                className="rounded-[100px] py-3 px-8 w-full sm:w-auto transition-colors duration-500 ease-in-out"
              >
                Get Started
              </Button>
              <Button
                variant="white-outline"
                size="md"
                className="w-full sm:w-auto"
              >
                Join the Visionary Council
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }
