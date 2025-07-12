import Button from "../../ui/Button";
import Image from "../../ui/Image";
import Lottie from 'lottie-react';
import Cardverticalscrollanimation from '../../../assets/lottie-files/Vertical-Card-Scroll/Cardverticalscrollanimation.json'
import Socialicons from '../../../assets/lottie-files/Icons/Social-icons.json';


export default function SocialMedia() {
  return (
    <section className="bg-[#fff] px-4 sm:px-6 pb-8 sm:pb-12 lg:py-[72px]">
      <div className="max-w-[1336px] mx-auto">
        <div className="flex flex-row">
          <div className="w-6/12">
            <h2 className="poppins text-[42px] font-[600]"><span className="bg-linear-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">Social Media</span>, Reimagined for Conscious Expression</h2>
          </div>
          <div className="w-6/12">
            <p className="openSans text-[#64748B] text-[18px] font-[400] capitalize">Share reflections, life moments, and conscious thoughts.<br />React, repost, and respond to what moves you. CNESS is where like-<br />hearted creators, thinkers, and changemakers meet — not to<br /> impress, but to express.</p>
            <Button
              className="jakarta rounded-[100px] h-[38px] text-[16px]  font-[400] text-[#fff] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#9747FF]  mt-6"
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
            className="w-14 h-14 mt-[52px]"
          />
          <Lottie
            animationData={Cardverticalscrollanimation}
            loop
            autoplay
            style={{ width: 400, height: 400 }}
            className="absolute top-0 left-0"
          />
          <Lottie
            animationData={Socialicons}
            loop
            autoplay
            style={{ width: 200, height: 200 }}
            className="absolute bottom-20 right-25"
          />
        </div>
      </div>
    </section>
  );
}