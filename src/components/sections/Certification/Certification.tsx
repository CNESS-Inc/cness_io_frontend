import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import LottieOnView from "../../ui/LottieOnView";

const Certification = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("https://cnessioassets.project-69e.workers.dev/Card-bg.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie JSON:", err));
  }, []);

  return (
    <div className='py-20 w-full bg-[#FAFAFA] px-6'>
      <div className='max-w-[1336px] w-full mx-auto flex lg:flex-row flex-col justify-between'>
        <div className='lg:w-[60%] w-full flex flex-col justify-center items-start'>
          <h3 className='poppins leading-10 text-[32px] font-medium text-black'>
            Certification Makes It Official.
          </h3>
          <p className='openSans text-[18px] font-Regular pt-[10px] mb-2'>
            Get your conscious identity verified and unlock everything CNESS has to offer.
          </p>
          <span className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block mt-2 openSans">
            Benefits
          </span>

          <div className='leading-9 pt-[20px] flex flex-col gap-4'>
            {[
              "Unlock your True Profile with verified status",
              "Sell your services or digital tools in the Conscious Marketplace",
              "Publish reflections, stories, and offerings on your social feed",
              "Get featured in the CNESS Directory with certification tags",
              "Become eligible to mentor others and earn through guidance",
              "Priority access to broadcasting and live events"
            ].map((text, index) => (
              <div className='flex items-center gap-2' key={index}>
                <div className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'>
                  <FaCheck className='text-white' />
                </div>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans w-[90%]'>{text}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className='jakarta px-3 py-1 h-[42px] w-[127px] text-white bg-gradient-to-r from-[#7077FE] to-[#F07EFF] rounded-[50px] mt-8'
          >
            Get Certified
          </button>
        </div>

        <div className='certificate-animation md:h-[100%] rounded-2xl lg:w-[40%] w-full lg:mt-0 mt-15'>
          {animationData && (
            <LottieOnView
              animationData={animationData}
              loop
              className="w-full lg:h-full lg:scale-120"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Certification;
