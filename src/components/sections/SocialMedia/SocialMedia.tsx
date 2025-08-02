import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import Image from "../../ui/Image";
import LottieOnView from "../../ui/LottieOnView";

export default function SocialMedia() {
  const [notificationLottie, setNotificationLottie] = useState(null);
  const [socialIconsLottie, setSocialIconsLottie] = useState(null);

  useEffect(() => {
    fetch("https://cnessioassets.project-69e.workers.dev/not-out.json")
      .then(res => res.json())
      .then(data => setNotificationLottie(data))
      .catch(err => console.error("Failed to load Notification Lottie:", err));

    fetch("https://cnessioassets.project-69e.workers.dev/Social-icons.json")
      .then(res => res.json())
      .then(data => setSocialIconsLottie(data))
      .catch(err => console.error("Failed to load Social Icons Lottie:", err));
  }, []);

  return (
    <section className="bg-[#fff] px-4 sm:px-6 pb-8 sm:pb-12 lg:py-[72px] lg:pb-0 pt-10">
      <div className="max-w-[1336px] mx-auto">
        <div className="flex lg:flex-row md:flex-row flex-col">
          <div className="lg:w-6/12 md:w-6/12 w-full lg:mb-0 md:mb-0 mb-4">
            <h2 className="poppins lg:leading-16 md:leading-14 leading-12 text-[42px] font-[600]">
              <span className="bg-linear-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                Social Media
              </span>, Reimagined for Conscious Expression
            </h2>
          </div>
          <div className="lg:w-6/12 md:w-6/12 w-full">
            <p className="openSans text-[#64748B] text-[18px] font-[400] capitalize">
              Share reflections, life moments, and conscious thoughts.<br />
              React, repost, and respond to what moves you. CNESS is where like-<br />
              hearted creators, thinkers, and changemakers meet — not to<br />
              impress, but to express.
            </p>
            <Button className="jakarta w-fit rounded-[100px] h-[38px] text-[16px] font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF] mt-6"
             onClick={() => window.location.href = "/sign-up"}>
              Coming soon
            </Button>
          </div>
        </div>

        <div className="socail-media-image relative">
          <Image
            src={"https://res.cloudinary.com/diudvzdkb/image/upload/v1754114244/1af3e749f98b99e039b5ebf207a5212e937ddb5e_ndsl4l.jpg"}
            alt="Social Media Visual"
            width={'100%'}
            height={'511px'}
            style={{objectFit:'cover',borderRadius:24}}
            className="w-14 h-14 mt-[52px] media-img object-contain"
          />

          {notificationLottie && (
            <LottieOnView
              animationData={notificationLottie}
              loop
              className="absolute lg:top-0 md:top-0 lg:left-0 md:left-0 lg:w-120 lg:h-120 md:w-60 md:h-80 w-90 -top-20 -left-5"
            />
          )}

          {socialIconsLottie && (
            <LottieOnView
              animationData={socialIconsLottie}
              loop
              style={{ width: 200, height: 200 }}
              className="absolute lg:bottom-20 lg:right-25 bottom-10 right-0 lg:block md:block hidden"
            />
          )}
        </div>
      </div>
    </section>
  );
}
