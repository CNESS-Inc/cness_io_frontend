import Image from "../../ui/Image";
import Button from "../../ui/Button";
import Lottie from 'lottie-react';
import PurpuleCircle from '../../../assets/lottie-files/Circle-Beams/purpule-circle-out.json';


export default function MobileSection() {
  return (
    <section className="px-4 sm:px-6 py-6 md:py-[32px] bg-[#F1EFFF]">
      <div className="max-w-[1336px] mx-auto">
        <div className="flex flex-row">
          <div className="w-7/12 flex items-center">
            <div className="w-10/12 lg:w-full bg-white p-8 rounded-[12px] flex items-start flex-col justify-center">
              <h2 className="poppins text-[32px] font-[600] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3">A Conscious coach in your pocket</h2>
              <p className="openSans text-[#64748B] text-[18px] font-[400]">Meet Ariven AI — your consciousness companion. It reflects, prompts,<br /> and guides you to stay aligned with your values, choices, and<br /> evolution.</p>
              <Button
                // variant="gradient-primary"
                className="jakarta rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#9747FF]  mt-6"
              >
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="w-5/12 overflow-hidden flex justify-end relative">
            <Lottie
              animationData={PurpuleCircle}
              loop
              autoplay
              style={{ width: 420, height: 420 }}
            />
            <div className="absolute right-[12%] top-5">
              <Image
                src="/mobile.png"
                alt="Company Logo"
                className="w-40 h-70 mt-[52px] ms-auto me-16 object-contain"

              />
            </div>

          </div>
        </div>
      </div>


    </section>
  );
}