import Button from "../../ui/Button";
import Image from "../../ui/Image";
import LottieOnView from "../../ui/LottieOnView";
import NotificationPop from '../../../assets/lottie-files/Notification-Pop/not-out.json'
import Socialicons from '../../../assets/lottie-files/Icons/Social-icons.json';

export default function SocialMedia() {
  return (
    <section className="bg-[#fff] px-4 sm:px-6 pb-8 sm:pb-12 lg:py-[72px] pt-10">
      <div className="max-w-[1336px] mx-auto">
        <div className="flex lg:flex-row md:flex-row flex-col">
          <div className="lg:w-6/12 md:w-6/12 w-full lg:mb-0 md:mb-0 mb-4">
            <h2 className="poppins lg:leading-16 md:leading-14  leading-12 text-[42px] font-[600]"><span className="bg-linear-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">Social Media</span>, Reimagined for Conscious Expression</h2>
          </div>
          <div className="lg:w-6/12 md:w-6/12 w-full">
            <p className="openSans text-[#64748B] text-[18px] font-[400] capitalize">Share reflections, life moments, and conscious thoughts.<br />React, repost, and respond to what moves you. CNESS is where like-<br />hearted creators, thinkers, and changemakers meet — not to<br /> impress, but to express.</p>
            <Button
              className="jakarta w-fit rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF]  mt-6"
            >
              Join the Conscious Conversation
            </Button>
          </div>
        </div>
        <div className="socail-media-image relative">
          <Image
            src="/social-media.png"
            alt="Company Logo"
            width={'100%'}
            height={'511px'}
            className="w-14 h-14 mt-[52px] media-img object-cover"
            
          />
          <LottieOnView
            animationData={NotificationPop}
            loop
            // autoplay
            className="absolute lg:top-0 md:top-0 lg:left-0 md:left-0 lg:w-120 lg:h-120 md:w-60 md:h-80 w-90 -top-20 -left-5"
          />
          <LottieOnView
            animationData={Socialicons}
            loop
            // autoplay
            style={{ width: 200, height: 200 }}
            className="absolute lg:bottom-20 lg:right-25 bottom-10 right-0 lg:block md:block hidden "
          />
        </div>
      </div>
    </section>
  );
}