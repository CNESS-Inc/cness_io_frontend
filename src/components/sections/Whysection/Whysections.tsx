import Button from "../../ui/Button";
import Image from "../../ui/Image";

export default function WhySection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-[59px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
        {/* Image section - full width on mobile, 5 columns on desktop */}
        <div className="md:px-6 lg:px-[47px] col-span-1 rounded-2xl sm:rounded-[24px] md:col-span-5 order-1">
          <Image
            src="/why_section.png"
            alt="Company Logo"
            height={506}
            className="w-full h-auto max-h-[400px] md:max-h-none md:h-[506px] rounded-2xl sm:rounded-[24px] object-contain"
          />
        </div>

        {/* Content section - full width on mobile, 7 columns on desktop */}
        <div className="p-4 sm:p-5 md:p-6 col-span-1 md:col-span-7 order-2">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-poppins text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-normal leading-none text-[#7077FE] mb-3 sm:mb-4 md:mb-6">
              WHY CNESS
            </h2>

            <p className="font-poppins font-medium text-xl sm:text-2xl md:text-3xl lg:text-[42px] leading-snug sm:leading-normal md:leading-[1.3] lg:leading-[59px] text-black mb-4 sm:mb-5 md:mb-6">
              Discover the beauty of life through the art of conversation.
            </p>

            <ul className="list-disc pl-5 space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-5 md:mb-6">
              <li className="font-openSans bg-white p-3 sm:p-4 md:p-[10px] rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base">
                78% of professionals seek more meaningful work
              </li>
              <li className="font-openSans bg-white p-3 sm:p-4 md:p-[10px] rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base">
                $4.5T+ global wellness and purpose economy
              </li>
              <li className="font-openSans bg-white p-3 sm:p-4 md:p-[10px] rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base">
                150+ professions and 600 industries mapped to DoCM
              </li>
              <li className="font-openSans bg-white p-3 sm:p-4 md:p-[10px] rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base">
                Built on the Declaration of Consciousness Movement (DoCM)
              </li>
            </ul>

            <Button
              className="bg-[#7077FE] hover:bg-transparent py-2 sm:py-3 md:py-[16px] px-3 sm:px-4 md:px-[24px] rounded-full text-xs sm:text-sm md:text-base"
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