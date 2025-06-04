  "use client";
  import Button from "../../ui/Button";
  import HomeHeroBackground from "../../ui/HomeHeroBackground";

  export default function HeroSection() {
    return (
      <section className="relative h-[692px] rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px]">
        <div className="absolute inset-0 z-[-2] bg-gradient-to-br from-[#FDFDFD] via-[#FAFAFA] to-[#F7F7F7]" />
        {/* 🌈 Animated Canvas Background */}
        <HomeHeroBackground />

        {/* Optional overlay image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/hero_bg.png')" }}
        ></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
          <div className="text-center w-full max-w-screen-lg">
            {/* Heading */}
            <h1 className="poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
              Build with Consciousness
            </h1>

            {/* Description */}
            <p className="openSans text-base sm:text-lg md:text-xl text-[#494949] mb-10 max-w-2xl mx-auto">
              The world's first conscious business platform — where individuals
              and organizations certify, connect, grow, and lead with integrity.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="gradient-primary"
                className="font-[Plus Jakarta Sans] text-[18px] rounded-[100px] py-3 px-10 w-full sm:w-auto transition-colors duration-500 ease-in-out"
              >
                Get Started
              </Button>
              <Button
                variant="white-outline"
              
 className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-[100px] bg-white text-black border border-[#ddd] hover:bg-[#F07EFF] hover:text-white transition-colors duration-300"              >
                Join the Visionary Council
              </Button>
            </div>
          </div>
        </div>
<div className="absolute bottom-0 left-0 w-full h-80 z-80 bg-gradient-to-b from-transparent to-white pointer-events-none" />

      </section>
    );
  }
