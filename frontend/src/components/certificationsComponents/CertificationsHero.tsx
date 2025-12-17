import { useEffect, useState } from "react";
import Button from "../ui/Button";
import SignupModel from "../OnBoarding/Signup";

export default function CertificationsHero() {
  const [openSignup, setOpenSignup] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStep(1), 50));
  timers.push(window.setTimeout(() => setStep(2), 150));
  timers.push(window.setTimeout(() => setStep(3), 250));
  timers.push(window.setTimeout(() => setStep(4), 350));
  timers.push(window.setTimeout(() => setStep(5), 450));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <section
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
        }}
      >
        <div className="flex flex-col items-center text-center z-10 pt-16 px-4">
          <h1
            style={{ fontFamily: "Poppins, sans-serif" }}
            className={`font-medium text-[32px] md:text-[42px] leading-[100%] tracking-[-0.02em] text-center antialiased bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text transition-all duration-1000 ease-in-out ${
              step >= 4
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-6"
            }`}
          >
            About Our Certification
          </h1>

          <p
            className={`font-['Open_Sans'] md:text-base font-light text-[#242424] lg:mb-10 md:mb-12 mb-4 mt-6 max-w-4xl mx-auto transition-all duration-1000 ease-in-out ${
              step >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            CNESS Certification celebrates your conscious 
journey, your growth, values, and purpose that inspire change. It’s 
more than a credential; it’s recognition of your commitment to 
mindful living.
          </p>

          <div
            className={`flex flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ${
              step >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Button
              variant="gradient-primary"
              className="w-full sm:w-fit rounded-[100px] hero-section-btn py-2 px-4 text-[16px] sm:py-3 sm:px-8 sm:text-base font-['Plus Jakarta Sans'] font-medium leading-[100%] text-center"
              style={{ fontFamily: "Plus Jakarta Sans" }}
              onClick={() => setOpenSignup(true)}
            >
              Get Certified
            </Button>
          </div>
        </div>

        <div className="w-full px-4 lg:px-16 pb-18 pt-20">
          <div className="mx-auto max-w-[1900px] rounded-4xl overflow-hidden">
            <img
              src="https://cdn.cness.io/Rectangle%201.png"
              alt="certificate hero Section"
              className="mx-auto w-full max-w-[1900px] rounded-4xl object-cover h-60 sm:h-[280px] md:h-80 lg:h-[405px] xl:h-[460px] 2xl:h-[460px] object-[58%_50%] sm:object-[60%_50%] md:object-[62%_50%] lg:object-[64%_50%] xl:object-[66%_50%] 2xl:object-[68%_50%]"
            />
          </div>
        </div>

        <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
      </section>
    </>
  );
}
