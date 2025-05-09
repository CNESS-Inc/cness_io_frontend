import { openSans, poppins } from "@/app/layout";
import Image from "next/image";

export default function Testimonialsection() {
  return (
    <section className="px-4 sm:px-8 py-8 sm:py-[59px]">
      <div className="text-center mb-18">
        <p
          className={`${poppins.className} text-[#6F74DD] font-bold text-lg leading-[100%] tracking-[0.175em] text-center uppercase mb-6`}
        >
          Testimonials
        </p>
        <p
          className={`${poppins.className} font-bold text-[52px] leading-[100%] tracking-normal text-center capitalize text-[#1E1E1E]"`}
        >
          Our Client Reviews
        </p>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3">
          <div className=" h-[506px] bg-[url('/testimonial_1.png')] rounded-[18.12px] bg-cover bg-center relative overflow-hidden">
            <div className="absolute bottom-74 w-[55px] h-[55px] right-0 bg-white z-10 left-35 rounded-full flex justify-center items-center">
              <Image
                src="/testimonial_user_1.png"
                alt=""
                width={50}
                height={45}
                className="h-auto w-[50px]"
                priority
              />
            </div>
            <div className="absolute m-4.5 bottom-20 left-0 right-0 p-[42px] bg-white to-transparent rounded-[18.12px]">
              <div className="mb-[21px]">
                <p
                  className={`${poppins.className} text-[#1E1E1E] font-semibold text-lg leading-[100%] tracking-normal text-center capitalize`}
                >
                  Anika Sharma
                </p>
                <p className="text-[#1E1E1E] mt-1 font-open-sans font-normal text-xs leading-[100%] tracking-normal text-center">
                  Founder, Soulful Yoga Retreat
                </p>
              </div>
              <p
                className={`${openSans.className} font-normal text-sm leading-[21px] tracking-normal text-center text-[#1E1E1E]`}
              >
                CNESS gave us a structure to grow with integrity. It's not just
                a badge — it's our internal compass.
              </p>
            </div>
          </div>
          <div className=" h-[506px] bg-[url('/testimonial_1.png')] rounded-[18.12px] bg-cover bg-center relative overflow-hidden">
            <div className="absolute bottom-74 w-[55px] h-[55px] right-0 bg-white z-10 left-35 rounded-full flex justify-center items-center">
              <Image
                src="/testimonial_user_1.png"
                alt=""
                width={50}
                height={45}
                className="h-auto w-[50px]"
                priority
              />
            </div>
            <div className="absolute m-4.5 bottom-20 left-0 right-0 p-[42px] bg-white to-transparent rounded-[18.12px]">
              <div className="mb-[21px]">
                <p
                  className={`${poppins.className} text-[#1E1E1E] font-semibold text-lg leading-[100%] tracking-normal text-center capitalize`}
                >
                  Anika Sharma
                </p>
                <p className="text-[#1E1E1E] mt-1 font-open-sans font-normal text-xs leading-[100%] tracking-normal text-center">
                  Founder, Soulful Yoga Retreat
                </p>
              </div>
              <p
                className={`${openSans.className} font-normal text-sm leading-[21px] tracking-normal text-center text-[#1E1E1E]`}
              >
                CNESS gave us a structure to grow with integrity. It's not just
                a badge — it's our internal compass.
              </p>
            </div>
          </div>
          <div className=" h-[506px] bg-[url('/testimonial_1.png')] rounded-[18.12px] bg-cover bg-center relative overflow-hidden">
            <div className="absolute bottom-74 w-[55px] h-[55px] right-0 bg-white z-10 left-35 rounded-full flex justify-center items-center">
              <Image
                src="/testimonial_user_1.png"
                alt=""
                width={50}
                height={45}
                className="h-auto w-[50px]"
                priority
              />
            </div>
            <div className="absolute m-4.5 bottom-20 left-0 right-0 p-[42px] bg-white to-transparent rounded-[18.12px]">
              <div className="mb-[21px]">
                <p
                  className={`${poppins.className} text-[#1E1E1E] font-semibold text-lg leading-[100%] tracking-normal text-center capitalize`}
                >
                  Anika Sharma
                </p>
                <p className="text-[#1E1E1E] mt-1 font-open-sans font-normal text-xs leading-[100%] tracking-normal text-center">
                  Founder, Soulful Yoga Retreat
                </p>
              </div>
              <p
                className={`${openSans.className} font-normal text-sm leading-[21px] tracking-normal text-center text-[#1E1E1E]`}
              >
                CNESS gave us a structure to grow with integrity. It's not just
                a badge — it's our internal compass.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
