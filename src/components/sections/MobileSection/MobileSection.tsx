import Button from "../../ui/Button";
import LottieOnView from "../../ui/LottieOnView";
import MobileCircle from '../../../assets/lottie-files/Purple-Circle-with-phone/Purple-Circle-with-phone.json'


export default function MobileSection() {
  return (
    <section className="px-4 sm:px-6 lg:py-13 md:py-[60px] py-[60px] bg-[#F1EFFF] mobile-section lg:h-[500px] ">
      <div className="max-w-[1336px] mx-auto overflow-x-hidden lg:h-[450px]">
        <div className="flex lg:flex-row flex-col lg:h-[400px]">
          <div className="lg:w-7/12 w-full flex items-center">
            <div className="lg:w-full w-full bg-white lg:p-8 md:p-8 p-4  rounded-[12px] flex items-start flex-col justify-center">
              <h2 className="poppins lg:leading-16 md:leading-14 leading-9 pb-1 text-[32px] font-[600] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3">A Conscious coach in your pocket</h2>
              <p className="openSans text-[#64748B] text-[18px] font-[400]">Meet Ariven AI — your consciousness companion. It reflects, prompts,<br /> and guides you to stay aligned with your values, choices, and<br /> evolution.</p>
              <Button
                // variant="gradient-primary"
                className="jakarta w-fit rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF]  mt-6"
              >
                Coming Soon
              </Button>
            </div>
          </div>

          <div className="lg:w-5/12 w-full lg:h-[100%] h-[350px] overflow-hidden flex lg:justify-end justify-center relative">
          <div className="absolute lg:right-0 lg:-top-10 md:right-45 ">
            <LottieOnView
              animationData={MobileCircle}
              loop
              className="lg:w-[480px] lg:h-[480px] md:w-[380px] md:h-[380px] w-[380px] h-[380px]"
            />
          </div>

          </div>
        </div>
      </div>


    </section>
  );
}