import Image from "next/image";
import Button from "../../ui/Button";
import { openSans, poppins } from "@/app/layout";

export default function Platformsections() {
  return (
    <section className="bg-[#F3F1FF] px-4 sm:px-6 pb-[52px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pt-8 text-center">
          <h2 className={`${poppins.className} font-bold text-xl sm:text-2xl leading-none tracking-normal uppercase text-[#7077FE] mb-4 sm:mb-6`}>
            PLATFORM MODULES OVERVIEW
          </h2>
          <p className={`${poppins.className} font-medium text-3xl sm:text-[52px] leading-[1.2] sm:leading-[69px] tracking-normal text-center text-[#222224] mb-6`}>
            Crafting a meaningful narrative is{" "}
            <br className="hidden sm:block" /> essential for engaging
            communication.
          </p>
        </div>
      </div>
      <div className="mx-4 sm:mx-[52px] bg-white p-6 sm:p-[52px] rounded-[24px] mt-6 sm:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Image section */}
          <div className="md:px-[47px] md:py-[43px] col-span-1 md:col-span-5 order-1 md:order-1">
            <Image
              src="/certification_engine.jpg"
              alt="Company Logo"
              width={336}
              height={364}
              className="w-[336px] h-[364px] rounded-[24px] object-cover"
              priority
            />
          </div>

          {/* Content section */}
          <div className="col-span-1 md:col-span-7 order-2 md:order-2">
            <div className="max-w-2xl mx-auto">
              <h2 className={`${poppins.className} text-lg sm:text-xl tracking-normal leading-none text-[#D748EA] mb-4 sm:mb-6`}>
                Certification Engine
              </h2>

              <p className={`${poppins.className} font-semibold text-2xl sm:text-[36px] leading-[1.2] sm:leading-none tracking-normal text-[#222224] mb-4 sm:mb-6`}>
                Proof of purpose 1. <br />
                Measured with precision.
              </p>

              <ul className={`${openSans.className} space-y-3 mb-6 sm:mb-[24px]`}>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Sector and size-specific assessment engine
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Conscious Impact Score (CIS)
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Public badge + year-long visibility
                </li>
              </ul>

              <Button
                className="bg-[#7077FE] hover:bg-transparent py-3 sm:py-[16px] px-4 sm:px-[24px] rounded-full transition-colors duration-500 ease-in-out text-sm sm:text-base w-full sm:w-auto text-center"
                variant="primary"
                withGradientOverlay
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-[52px] bg-white p-6 sm:p-[52px] rounded-[24px] mt-6 sm:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Image section */}
          <div className="md:px-[47px] md:py-[43px] col-span-1 md:col-span-5 order-1 md:order-2">
            <Image
              src="/learning_lab.jpg"
              alt="Company Logo"
              width={336}
              height={364}
              className="w-[336px] h-[364px] rounded-[24px] object-cover"
              priority
            />
          </div>

          {/* Content section */}
          <div className="col-span-1 md:col-span-7 order-2 md:order-1">
            <div className="max-w-2xl mx-auto">
              <h2 className={`${poppins.className} font-medium text-lg sm:text-xl tracking-normal leading-none text-[#D748EA] mb-4 sm:mb-6`}>
                Learning Lab
              </h2>

              <p className={`${poppins.className} font-semibold text-2xl sm:text-[36px] leading-[1.2] sm:leading-none tracking-normal text-[#222224] mb-4 sm:mb-6`}>
                Grow Beyond good Intentions.
              </p>

              <ul className={`${openSans.className} space-y-3 mb-6 sm:mb-[24px]`}>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Micro-modular LMS
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Six pillars of conscious leadership
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Required for renewals & upgrades
                </li>
              </ul>

              <Button
                className="bg-[#7077FE] hover:bg-transparent py-3 sm:py-[16px] px-4 sm:px-[24px] rounded-full transition-colors duration-500 ease-in-out text-sm sm:text-base w-full sm:w-auto text-center"
                variant="primary"
                withGradientOverlay
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-[52px] bg-white p-6 sm:p-[52px] rounded-[24px] mt-6 sm:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Image section */}
          <div className="md:px-[47px] md:py-[43px] col-span-1 md:col-span-5 order-1 md:order-1">
            <Image
              src="/directory.jpg"
              alt="Company Logo"
              width={336}
              height={364}
              className="w-[336px] h-[364px] rounded-[24px] object-cover"
              priority
            />
          </div>

          {/* Content section */}
          <div className="col-span-1 md:col-span-7 order-2 md:order-2">
            <div className="max-w-2xl mx-auto">
              <h2 className={`${poppins.className} font-medium text-lg sm:text-xl tracking-normal leading-none text-[#D748EA] mb-4 sm:mb-6`}>
                Directory
              </h2>

              <p className={`${poppins.className} font-semibold text-2xl sm:text-[36px] leading-[1.2] sm:leading-none tracking-normal text-[#222224] mb-4 sm:mb-6`}>
                A new kind of visibility.
              </p>

              <ul className={`${openSans.className} space-y-3 mb-6 sm:mb-[24px]`}>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Searchable by sector, geography, level
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Premium spotlight listings
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Conscious badges
                </li>
              </ul>

              <Button
                className="bg-[#7077FE] hover:bg-transparent py-3 sm:py-[16px] px-4 sm:px-[24px] rounded-full transition-colors duration-500 ease-in-out text-sm sm:text-base w-full sm:w-auto text-center"
                variant="primary"
                withGradientOverlay
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 sm:mx-[52px] bg-white p-6 sm:p-[52px] rounded-[24px] mt-6 sm:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Image section */}
          <div className="md:px-[47px] md:py-[43px] col-span-1 md:col-span-5 order-1 md:order-2">
            <Image
              src="/council.jpg"
              alt="Company Logo"
              width={336}
              height={364}
              className="w-[336px] h-[364px] rounded-[24px] object-cover"
              priority
            />
          </div>

          {/* Content section */}
          <div className="col-span-1 md:col-span-7 order-2 md:order-1">
            <div className="max-w-2xl mx-auto">
              <h2 className={`${poppins.className} font-medium text-lg sm:text-xl tracking-normal leading-none text-[#D748EA] mb-4 sm:mb-6`}>
                Council | Mentors | Partners
              </h2>

              <p className={`${poppins.className} font-semibold text-2xl sm:text-[36px] leading-[1.2] sm:leading-none tracking-normal text-[#222224] mb-4 sm:mb-6`}>
                Co-create the movement.
              </p>

              <ul className={`${openSans.className} space-y-3 mb-6 sm:mb-[24px]`}>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Early adopters & conscious leaders
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Revenue-share mentorship model
                </li>
                <li className="font-open_sans text-base sm:text-xl leading-none tracking-normal text-black block w-full sm:w-fit bg-[#F7F7F7] p-3 sm:px-4.5 sm:py-3 rounded-[90px]">
                  Revenue-share mentorship model
                </li>
              </ul>

              <Button
                className="bg-[#7077FE] hover:bg-transparent py-3 sm:py-[16px] px-4 sm:px-[24px] rounded-full transition-colors duration-500 ease-in-out text-sm sm:text-base w-full sm:w-auto text-center"
                variant="primary"
                withGradientOverlay
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
