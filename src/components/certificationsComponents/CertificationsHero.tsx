import { useEffect, useState } from "react";
import Button from "../ui/Button";
import SignupModel from "../OnBoarding/Signup";

export default function CertificationsHero() {
  const [openSignup, setOpenSignup] = useState(false);
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
            className={
              `font-medium text-[32px] md:text-[42px] leading-[115%] tracking-[-0.02em] text-center antialiased bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text transition-all duration-1000 ease-in-out` +
              (step >= 4
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-6")
            }
          >
            About Our Certification
          </h1>

          <p
            className={
              `openSans md:text-base font-light text-[#64748B] lg:mb-10 md:mb-12 mb-4 mt-6 max-w-4xl mx-auto transition-all duration-1000 ease-in-out font-['Open Sans']` +
              (step >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6")
            }
          >
            CNESS Certification is more than a credential - it’s a recognition
            of conscious growth. It validates knowledge, ethical practices, and
            positive impact in both professional and personal spaces. Our goal
            is to help individuals and organizations stand out as trusted,
            purpose-driven contributors in today’s world.
          </p>

          <div
            className={
              `flex flex-row justify-center gap-4 transition-all duration-1000 ease-in-out ` +
              (step >= 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6")
            }
          >
            <div className="flex justify-center items-center">
              <Button
                variant="gradient-primary"
                className="
                w-full sm:w-fit
                rounded-[100px] hero-section-btn
                py-2 px-4 text-[16px]
                sm:py-3 sm:px-8 sm:text-base
                font-['Plus Jakarta Sans'] font-medium leading-[100%] text-center
               
              "
                style={{
                  fontFamily: "Plus Jakarta Sans",
                }}
                onClick={() => setOpenSignup(true)}
              >
                Get Certified
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Image */}
        <div className="w-full px-4 lg:px-16 pb-18 pt-20">
          <div className="mx-auto max-w-[1900px] rounded-[32px] overflow-hidden">
            <img
              src="https://cdn.cness.io/Rectangle%201.png"
              alt="certificate hero Section"
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
          </div>
        </div>
      </section>
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </>
  );
}
