import Image from "../../ui/Image";
import Button from "../../ui/Button";
import LottieOnView from "../../ui/LottieOnView";
import PurpuleCircle from '../../../assets/lottie-files/Circle-Beams/purpule-circle-out.json';


export default function MobileSection() {
  return (
    <section className="px-4 sm:px-6 lg:py-6 md:py-[60px] py-[60px] bg-[#F1EFFF] mobile-section  ">
      <div className="max-w-[1336px] mx-auto">
        <div className="flex lg:flex-row flex-col">
          <div className="lg:w-7/12 w-full flex items-center">
            <div className="w-10/12 lg:w-full w-full bg-white lg:p-8 md:p-8 p-4  rounded-[12px] flex items-start flex-col justify-center">
              <h2 className="poppins text-[32px] font-[600] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3">A Conscious coach in your pocket</h2>
              <p className="openSans text-[#64748B] text-[18px] font-[400]">Meet Ariven AI — your consciousness companion. It reflects, prompts,<br /> and guides you to stay aligned with your values, choices, and<br /> evolution.</p>
              <Button
                // variant="gradient-primary"
                className="jakarta rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF]  mt-6"
              >
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="lg:w-5/12 w-full overflow-hidden flex lg:justify-end justify-center relative">
            <LottieOnView
              animationData={PurpuleCircle}
              loop
              // autoplay
              style={{ width: 420, height: 420 }}
            />
            <div className="absolute lg:right-[12%] lg:top-5 md:right-54 right-5 md:top-5 top-10">
              <Image
                src="/mobile.png"
                alt="Company Logo"
                className="lg:w-40 lg:h-70 md:w-40 md:h-70 w-35 h-60 lg:mt-[52px] md:mt-[52px] mt-[12px] ms-auto lg:me-16 md:me-21 me-20 object-contain"

              />
            </div>

          </div>
        </div>
      </div>


    </section>
  );
}