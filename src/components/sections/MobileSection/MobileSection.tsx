//import Button from "../../ui/Button";
import LottieOnView from "../../ui/LottieOnView";
// import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

export default function MobileSection() {
  // const [animationData, setAnimationData] = useState<object | null>(null);
  //const navigate = useNavigate();
  // useEffect(() => {
  //   fetch(
  //     "https://cnessioassets.project-69e.workers.dev/Purple-Circle-with-phone.json"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setAnimationData(data))
  //     .catch((err) => console.error("Failed to load Lottie JSON:", err));
  // }, []);

  return (
<section className="bg-[#F1EFFF] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1336px] mx-auto overflow-x-hidden lg:h-[450px]">
        <div className="flex lg:flex-row flex-col lg:h-[400px]">
          <div className="lg:w-7/12 w-full flex items-center">
            <div className="lg:w-full w-full bg-white lg:p-8 md:p-8 p-4  rounded-[12px] flex items-start flex-col justify-center">
              <h2
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="poppins lg:leading-16 md:leading-14 leading-9 pb-1 text-[32px] font-[500] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3"
              >
                A Conscious coach in your pocket
              </h2>
              <p style={{ fontFamily: "Open Sans, sans-serif" }} 
              className="font-light text-[16px] leading-[24px] tracking-[0px] text-[#242424]">
                Meet Ariven AI — your consciousness companion. It reflects,
                prompts, and <br /> guides you to stay aligned with your values,
                choices, and evolution.
              </p>
              {/*<Button
                // variant="gradient-primary"
                className="jakarta w-fit rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF]  mt-6"
                onClick={() => navigate("/comingSoon")}>
                Coming Soon
              </Button>*/}
            </div>
          </div>

          <div className="lg:w-5/12 w-full lg:h-[100%] h-[350px] overflow-hidden flex lg:justify-end justify-center relative">
            <div className="absolute lg:right-0 lg:-top-10 md:right-45 ">
              <LottieOnView
                // animationData={animationData}
                src="https://cnessioassets.project-69e.workers.dev/Purple-Circle-with-phone.json"
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