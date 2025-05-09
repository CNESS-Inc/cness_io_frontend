import Image from "next/image";
import Button from "../../ui/Button";
import { jakarta, openSans, poppins } from "@/app/layout";

export default function WhySection() {
  return (
    <section className="px-4 sm:px-8 py-8 sm:py-[59px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Image section - full width on mobile, 5 columns on desktop */}
        <div className="md:px-[47px] col-span-1 md:col-span-5 order-1 md:order-1">
          <Image
            src="/why_section.png"
            alt="Company Logo"
            width={462}
            height={506}
            className="w-full h-auto md:h-[506px] rounded-[24px] object-contain"
            priority
          />
        </div>

        {/* Content section - full width on mobile, 7 columns on desktop */}
        <div className="p-4 md:p-6 col-span-1 md:col-span-7 order-2 md:order-2">
          <div className="max-w-2xl mx-auto">
            <h2 className={`${poppins.className} text-lg md:text-2xl font-bold uppercase tracking-normal leading-none text-[#7077FE] mb-4 md:mb-[24px]`}>
              WHY CNESS
            </h2>

            <p className={`${poppins.className} font-poppins font-medium text-2xl sm:text-3xl md:text-[42px] leading-[1.2] md:leading-[59px] tracking-normal align-middle lining-nums proportional-nums text-black mb-4 md:mb-[24px]`}>
              Discover the beauty of life through the art of conversation.
            </p>

            <ul className="list-disc pl-5 space-y-3 md:space-y-4 mb-6 md:mb-[24px]">
              <li className={`${openSans.className} bg-white p-3 md:p-[10px] rounded-lg mb-1 md:mb-2 text-sm md:text-base`}>
                78% of professionals seek more meaningful work
              </li>
              <li className={`${openSans.className} bg-white p-3 md:p-[10px] rounded-lg mb-1 md:mb-2 text-sm md:text-base`}>
                $4.5T+ global wellness and purpose economy
              </li>
              <li className={`${openSans.className} bg-white p-3 md:p-[10px] rounded-lg mb-1 md:mb-2 text-sm md:text-base`}>
                150+ professions and 600 industries mapped to DoCM
              </li>
              <li className={`${openSans.className} bg-white p-3 md:p-[10px] rounded-lg mb-1 md:mb-2 text-sm md:text-base`}>
                Built on the Declaration of Consciousness Movement (DoCM)
              </li>
            </ul>

            <Button
              className="bg-[#7077FE] hover:bg-transparent py-3 md:py-[16px] px-4 md:px-[24px] rounded-full transition-colors duration-500 ease-in-out text-sm md:text-base"
              variant="primary"
              withGradientOverlay
            >
              Why Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}