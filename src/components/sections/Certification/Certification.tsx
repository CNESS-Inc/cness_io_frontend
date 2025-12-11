// import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import LottieOnView from "../../ui/LottieOnView";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

const Certification = () => {
  // const [animationData, setAnimationData] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch("https://cnessioassets.project-69e.workers.dev/badgecard.json")
  //     .then((res) => res.json())
  //     .then((data) => setAnimationData(data))
  //     .catch((err) => console.error("Failed to load Lottie JSON:", err));
  // }, []);

  return (
    <div className="bg-[#FAFAFA] w-full px-4 sm:px-6 lg:px-8 pt-5 md:pt-0 pb-12 lg:py-20">
      <div className="max-w-[1336px] w-full mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-20">
        <div className="w-full lg:w-[60%] flex flex-col justify-center items-start text-left">
          <h3
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="leading-10 text-[42px] font-medium text-black lg:-mt-[70px] md:-mt-[40px] -mt-0"
          >
            Certification Makes It Official.
          </h3>
          <p
            style={{ fontFamily: "Open Sans, sans-serif" }}
            className="text-[18px] text-[#242424] font-light pt-[15px] mb-2"
          >
            Get your conscious identity verified and unlock everything CNESS has
            to offer.
          </p>
          <span
            className="badge text-[#F07EFF] border-[#F07EFF] mt-4 border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-2 inline-block 
            rounded-tl-[10px] rounded-br-[10px] rounded-tr-[100px] rounded-bl-[100px] "
          >
            Benefits
          </span>

          <div className="lg:leading-9 md:leading-9 leading-[24px] pt-[20px] flex flex-col gap-4 w-full">
            {[
              "Elevate your identity, unlock your Verified Profile.",
              "Sell your digital products in the conscious marketplace",
              "Publish reflections, stories, and offerings on your social feed",
              "Get featured in the CNESS Directory with certification tags",

            ].map((text, index) => (
              <div className="flex items-center gap-2" key={index}>
                <div className="h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center">
                  <FaCheck className="text-white" />
                </div>
                <p
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  className="text-[18px] text-[#242424] font-light w-[90%]"
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="gradient-primary"
            className="lg:w-fit md:w-fit w-full text-center h-[42px] rounded-[100px] 
             px-6 py-1 mt-8 cursor-pointer
             text-[16px] font-['Open_Sans'] font-semibold 
             leading-[100%] tracking-[0px] text-center text-white"
            onClick={() => {
              navigate("/certifications");
              // Reset scroll
              window.scrollTo({ top: 0, behavior: "instant" }); // or "smooth"
            }}
          >
            Know More
          </Button>
        </div>

        <div className="certificate-animation w-full flex justify-center items-center">
          {/* {animationData && ( */}
          <LottieOnView
            // animationData={animationData}
            src="https://cnessioassets.project-69e.workers.dev/badgecard.json"
            loop
            className="w-[300px] md:w-[600px] lg:w-[700px] xl:w-[800px] h-auto mx-auto transition-all duration-500"
          />
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default Certification;
