import { useState } from "react";
import Button from "../../ui/Button";
// import Image from "../../ui/Image";
import OptimizeImage from "../../ui/OptimizeImage";
import LottieOnView from "../../ui/LottieOnView";
import SignupModel from "../../OnBoarding/Signup";

export default function SocialMedia() {
  // const [notificationLottie, setNotificationLottie] = useState(null);
  // const [socialIconsLottie, setSocialIconsLottie] = useState(null);
  const [openSignup, setOpenSignup] = useState(false);

  // useEffect(() => {
  //   fetch("https://cnessioassets.project-69e.workers.dev/not-out.json")
  //     .then((res) => res.json())
  //     .then((data) => setNotificationLottie(data))
  //     .catch((err) =>
  //       console.error("Failed to load Notification Lottie:", err)
  //     );

  //   fetch("https://cnessioassets.project-69e.workers.dev/Social-icons.json")
  //     .then((res) => res.json())
  //     .then((data) => setSocialIconsLottie(data))
  //     .catch((err) =>
  //       console.error("Failed to load Social Icons Lottie:", err)
  //     );
  // }, []);

  return (
<section className="bg-white px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-[72px]">
      <div className="max-w-[1336px] mx-auto">
<div className="flex flex-col md:flex-row lg:flex-row items-start lg:items-center gap-8 lg:gap-16">
          <div className="lg:w-6/12 md:w-6/12 w-full lg:mb-0 md:mb-0 mb-4">
            <h2
              style={{ fontFamily: "Poppins, sans-serif" }}
  className="text-[28px] sm:text-[36px] lg:text-[42px] leading-tight font-medium mt-3 text-[#242424]"
            >
  <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                Social Media
              </span>
              , Reimagined for Conscious Expression
            </h2>
          </div>
          <div className="lg:w-6/12 md:w-6/12 w-full">
            <p style={{ fontFamily: "Open Sans, sans-serif" }} 
              className="font-light text-[15px] sm:text-[16px] leading-[26px] text-[#242424] mt-4">
              Share reflections, life moments, and conscious thoughts.
              <br />
              React, repost, and respond to what moves you. CNESS is where
              like-hearted
              <br />
              creators, thinkers, and changemakers meet — not to impress, but to
              express. Connect with people who understand where you’re coming from.
            </p>
            <Button
              className="w-fit h-[38px] rounded-[100px] 
             py-1 px-6 mt-6 
             text-[16px] font-['Open_Sans'] font-medium font-[500] leading-[100%] tracking-[0px] text-center text-white
             bg-gradient-to-r from-[#7077FE] to-[#F07EFF]"
              onClick={() => setOpenSignup(true)}
            >
              Join the Conscious Conversation
            </Button>
          </div>
        </div>

        <div className="socail-media-image relative">
          <OptimizeImage
            src="social-media.webp"
            alt="Social Media Visual"
            width={"100%"}
            height={"511px"}
className="w-full h-auto mt-8 lg:mt-[52px] object-cover rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] transition-all duration-300"
          />

          {/* {notificationLottie && ( */}
            <LottieOnView
              // animationData={notificationLottie}
              src="https://cnessioassets.project-69e.workers.dev/not-out.json"
              loop
              className="absolute lg:top-0 md:top-0 lg:left-0 md:left-0 lg:w-120 lg:h-120 md:w-60 md:h-80 w-90 -top-20 -left-5"
            />
          {/* )} */}

          {/* {socialIconsLottie && ( */}
            <LottieOnView
              // animationData={socialIconsLottie}
              src="https://cnessioassets.project-69e.workers.dev/Social-icons.json"
              loop
              style={{ width: 200, height: 200 }}
              className="absolute lg:bottom-20 lg:right-25 bottom-10 right-0 lg:block md:block hidden"
            />
          {/* )} */}
        </div>
      </div>
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </section>
  );
}