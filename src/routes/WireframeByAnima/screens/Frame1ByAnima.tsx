import { Button } from "../../NavBarByAnima/components/ui/button";

export const Frame1ByAnima = (): JSX.Element => {
  return (
    <section className="flex flex-col items-start relative w-full">
      <div className="relative w-full h-[363px] overflow-hidden">
        <div className="relative w-[1488px] h-[373px] -left-12">
          {/* Background image - empty alt since it's decorative */}
          <img
            className="absolute w-[595px] h-[363px] top-0 left-[893px]"
            alt=""
            role="presentation"
          />

          {/* Gradient orbs background */}
          <div className="gap-[53.5px] top-2 left-0 inline-flex items-center absolute opacity-50">
            <div className="bg-[#00d1ff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
            <div className="bg-[#623fff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
            <div className="bg-[#ff994a] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          </div>

          {/* Hero content */}
          <div className="inline-flex flex-col items-start gap-8 absolute top-[93px] left-[119px]">
            <div className="flex flex-col items-start gap-3 relative w-full">
              <h1 className="relative w-[774px] mt-[-1.00px] font-['Poppins',Helvetica] font-semibold text-[#2a2a2a] text-[32px] tracking-[0] leading-[50px]">
                We&apos;re not building another platform. <br />
                We&apos;re redesigning trust for the conscious era.
              </h1>
            </div>

            <div className="flex items-center gap-[15px]">
              <Button className="px-6 py-4 rounded-[100px] font-['Poppins',Helvetica] font-medium text-lg bg-gradient-to-b from-[rgba(76,116,230,1)] to-[rgba(140,85,233,1)] hover:opacity-90">
                Get Started
              </Button>

              <Button
                variant="outline"
                className="bg-white border-[#2222241a] px-6 py-4 rounded-[100px] font-['Poppins',Helvetica] text-[#222224] font-medium text-lg"
              >
                Join the Visionary Council
              </Button>
            </div>
          </div>
        </div>
      </div>

      <img className="relative w-[1440px] h-[462px]" alt="Navigation" />
    </section>
  );
};
