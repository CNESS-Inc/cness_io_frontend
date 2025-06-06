import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Image from "../../ui/Image";

export default function WhySection() {
  const navigate = useNavigate()
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-[59px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto items-center">
        {/* Image Section */}
        <div className="md:col-span-5">
          <Image
            src="/why_section.png"
            alt="Why CNESS"
            height={506}
            className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-none md:h-[506px] rounded-2xl object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="md:col-span-7 mt-6 md:mt-0 px-2 sm:px-4 md:px-6">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h2 className="poppins text-base sm:text-lg md:text-xl lg:text-2xl font-bold uppercase text-[#7077FE] mb-3 sm:mb-4">
              WHY CNESS
            </h2>

            <p className="poppins font-medium text-xl sm:text-2xl md:text-3xl lg:text-[42px] leading-snug md:leading-[1.3] lg:leading-[59px] text-black mb-4">
              Discover the beauty of life through the art of conversation.
            </p>

            <ul className="list-disc pl-5 space-y-3 mb-6">
              {[
                "78% of professionals seek more meaningful work",
                "$4.5T+ global wellness and purpose economy",
                "150+ professions and 600 industries mapped to DoCM",
                "Built on the Declaration of Consciousness Movement (DoCM)",
              ].map((point, i) => (
                <li
                  key={i}
                  className="openSans bg-white p-3 sm:p-4 rounded-xl text-xs sm:text-sm md:text-base"
                >
                  {point}
                </li>
              ))}
            </ul>

            <Button
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 transition-colors duration-500 ease-in-out"
              onClick={() => navigate("/why")}
            >
              Why Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
