import Button from "../../ui/Button";
import Image from "../../ui/Image";

export default function PlatformSections() {
  return (
    <section className="bg-[#F3F1FF] px-4 sm:px-6 pb-8 sm:pb-12 lg:pb-[52px]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="pt-6 sm:pt-8 text-center">
          <h2 className="font-poppins font-bold text-lg sm:text-xl lg:text-2xl leading-none tracking-wider uppercase text-[#7077FE] mb-3 sm:mb-4 lg:mb-6">
            PLATFORM MODULES OVERVIEW
          </h2>
          <p className="font-poppins font-medium text-2xl sm:text-3xl lg:text-[52px] leading-tight sm:leading-snug lg:leading-[69px] text-center text-[#222224] mb-4 sm:mb-5 lg:mb-6">
            Crafting a meaningful narrative is{" "}
            <br className="hidden sm:block" /> essential for engaging
            communication.
          </p>
        </div>
      </div>

      {/* Platform Cards - Repeating Section */}
      {[
        {
          title: "Certification Engine",
          image: "/certification_engine.jpg",
          order: "order-1 md:order-1",
          tagline: "Proof of purpose 1. Measured with precision.",
          features: [
            "Sector and size-specific assessment engine",
            "Conscious Impact Score (CIS)",
            "Public badge + year-long visibility"
          ]
        },
        {
          title: "Learning Lab",
          image: "/learning_lab.jpg",
          order: "order-2 md:order-2",
          tagline: "Grow Beyond good Intentions.",
          features: [
            "Micro-modular LMS",
            "Six pillars of conscious leadership",
            "Required for renewals & upgrades"
          ]
        },
        {
          title: "Directory",
          image: "/directory.jpg",
          order: "order-1 md:order-1",
          tagline: "A new kind of visibility.",
          features: [
            "Searchable by sector, geography, level",
            "Premium spotlight listings",
            "Conscious badges"
          ]
        },
        {
          title: "Council | Mentors | Partners",
          image: "/council.jpg",
          order: "order-2 md:order-2",
          tagline: "Co-create the movement.",
          features: [
            "Early adopters & conscious leaders",
            "Revenue-share mentorship model",
            "Revenue-share mentorship model" // Duplicate in original, kept for consistency
          ]
        }
      ].map((platform, index) => (
        <div 
          key={index}
          className="mx-4 sm:mx-8 lg:mx-[52px] bg-white p-4 sm:p-6 lg:p-8 xl:p-[52px] rounded-xl lg:rounded-[24px] mt-4 sm:mt-6 lg:mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Image section */}
            <div className={`md:py-4 lg:py-[43px] col-span-1 md:col-span-5 ${platform.order}`}>
              <Image
                src={platform.image}
                alt={platform.title}
                height={364}
                className="w-full max-w-[336px] mx-auto h-auto aspect-[336/364] rounded-xl lg:rounded-[24px] object-cover"
              />
            </div>

            {/* Content section */}
            <div className={`col-span-1 md:col-span-7 ${platform.order.replace('order-2', 'order-1').replace('order-2', 'order-1')}`}>
              <div className="max-w-2xl mx-auto">
                <h2 className="font-poppins text-base sm:text-lg lg:text-xl tracking-normal leading-none text-[#D748EA] mb-3 sm:mb-4 lg:mb-6">
                  {platform.title}
                </h2>

                <p className="font-poppins font-semibold text-xl sm:text-2xl lg:text-3xl xl:text-[36px] leading-snug sm:leading-normal lg:leading-tight tracking-normal text-[#222224] mb-3 sm:mb-4 lg:mb-6">
                  {platform.tagline}
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 lg:mb-6">
                  {platform.features.map((feature, i) => (
                    <li 
                      key={i}
                      className="font-open_sans text-sm sm:text-base lg:text-lg xl:text-xl leading-tight tracking-normal text-black w-fit bg-[#F7F7F7] p-2 sm:p-3 rounded-full sm:rounded-[90px] text-center sm:text-left"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="bg-[#7077FE] hover:bg-transparent py-2 sm:py-3 lg:py-[16px] px-3 sm:px-4 lg:px-[24px] rounded-full text-xs sm:text-sm lg:text-base w-full sm:w-auto mx-auto sm:mx-0 text-center block"
                  variant="primary"
                  withGradientOverlay
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}