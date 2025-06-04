import Button from "../../ui/Button";
import joinImage from "../../../assets/join.png";

export default function JoiningSection() {
  return (
    <section className="flex flex-col items-center relative w-full ">
      <div className="relative w-full max-w-full h-auto sm:h-[363px] overflow-hidden rounded-xl">
        {/* Gradient orbs background - positioned differently for mobile */}
        <div className="sm:flex gap-[53.5px] top-2 left-0 inline-flex items-center absolute opacity-50">
          <div className="bg-[#00d1ff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          <div className="bg-[#623fff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          <div className="bg-[#ff994a] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
        </div>

        {/* Background image - now using next/image for optimization */}
        <div className="absolute inset-0">
          <img
            className="absolute h-full right-0"
            src={joinImage}
            alt=""
            role="presentation"
          />
        </div>

        {/* Hero content - now responsive */}
        <div className="relative flex flex-col items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-0 sm:absolute sm:top-[93px] sm:left-[119px] w-full max-w-2xl mx-auto sm:mx-0">
<div className="flex flex-col gap-3 w-full text-center sm:text-left justify-center sm:items-start items-center">
<h1 className="poppins font-semibold text-[#2a2a2a] text-2xl sm:text-3xl md:text-[32px] tracking-normal sm:tracking-[0] leading-[1.3] sm:leading-[50px]">              We&apos;re not building another platform.{" "}
              <br />
              <span className="block">We&apos;re redesigning trust for the conscious era.</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[15px] w-full sm:w-auto">
            <Button
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              className="bg-white border-[#2222241a] px-4 sm:px-6 py-3 sm:py-4 rounded-[100px] text-[#222224] font-medium text-base sm:text-lg w-full sm:w-auto"
            >
              Join the Visionary Council
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
