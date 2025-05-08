import Image from "next/image";
import Button from "../../../../components/ui/Button";

export default function WhySection() {
  return (
    <section className="px-[32px] py-[59px]">
      <div className="grid grid-cols-12 gap-8">
        {/* Stat 1 - spans 5 columns */}
        <div className="px-[47px] col-span-5">
          <Image
            src="/why_section.png"
            alt="Company Logo"
            width={462}
            height={506}
            className="w-full h-[506px] rounded-[24px] object-contain"
            priority
          />
        </div>

        <div className=" p-6 col-span-7">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold uppercase tracking-normal leading-none text-[#7077FE] mb-[24px]">
              WHY CNESS
            </h2>

            <p className="font-poppins font-medium text-[42px] leading-[59px] tracking-normal align-middle lining-nums proportional-nums text-black mb-[24px]">
              Discover the beauty of life <br /> through the art of
              conversation.
            </p>

            <ul className="list-disc pl-5 space-y-4 mb-[24px]">
              <li className="bg-white p-[10px] rounded-lg mb-2">
                78% of professionals seek more meaningful work
              </li>
              <li className="bg-white p-[10px] rounded-lg mb-2">
                $4.5T+ global wellness and purpose economy
              </li>
              <li className="bg-white p-[10px] rounded-lg mb-2">
                150+ professions and 600 industries mapped to DoCM
              </li>
              <li className="bg-white p-[10px] rounded-lg mb-2">
                Built on the Declaration of Consciousness Movement (DoCM)
              </li>
            </ul>

            <Button
        className="bg-[#7077FE] hover:bg-transparent py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
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
