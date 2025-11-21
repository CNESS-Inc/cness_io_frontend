import { useState, useEffect, useRef } from "react";
import Button from "../../ui/Button";
import Image from "../../ui/Image";
//import Dummyvideo from "../../ui/Dummyvideo";
import OptimizeImage from "../../ui/OptimizeImage";

export default function Highlight() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // Start with first card expanded
  const videoUrl =
    "https://cdn.cness.io/WhatsApp%20Video%202025-11-11%20at%204.48.38%20PM.mp4";
  const videoRef = useRef(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = (index: number) => {
    if (isMobile) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  const handleCardHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  const highlightCards = [
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780613/highlight-icon-1_qo6e4e.png",
      title: "Create a Profile",
      desc: "Let the world see who you are — your values, work and inner story.",
    },
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780614/highlight-icon-2_y63cpz.png",
      title: "Grow Visibility",
      desc: "Make your mission visible to a purpose-driven audience.",
    },
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780629/highlight-icon-3_biiwo3.png",
      title: "Earn Credibility",
      desc: "Stand out by sharing your expertise and impact.",
    },
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780630/highlight-icon-4_xfol6a.png",
      title: "Stream Content",
      desc: "Host live talks. Share music, thoughts, and your message.",
    },
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780632/highlight-icon-5_n8kcg8.png",
      title: "Get Featured",
      desc: "Be seen by the conscious world on our curated platform.",
    },
    {
      icon: "https://res.cloudinary.com/diudvzdkb/image/upload/v1753780633/highlight-icon-6_y5d2fk.png",
      title: "Connect & Collaborate",
      desc: "Network and grow with aligned changemakers.",
    },
  ];

  return (
    <section className="highlight-section lg:min-h-[560px] px-4 sm:px-6 lg:px-8 py-18 sm:py-12 lg:py-20 bg-[#FAFAFA] relative lg:bg-[url(https://cdn.cness.io/ellipse.svg)] bg-no-repeat lg:bg-position-[right_bottom_3rem] overflow-hidden">
      <div className="max-w-[1336px] mx-auto flex lg:flex-row flex-col">
        <div className="md:px-0 lg:px-0 lg:w-5/12 w-full">
          <div className="w-full">
            <span
              className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-medium px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
            >
              Highlights
            </span>
            <h3
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="font-medium
  text-[30px] md:text-[40px]
  leading-[38px] md:leading-[50px] lg:leading-[54px]
  tracking-[-0.01em] sm:tracking-[-0.02em]
  capitalize text-left pb-5 md:pb-[18px]
  max-w-[28ch] sm:max-w-[30ch] md:max-w-[26ch] lg:max-w-[28ch]"
            >
              Create a Profile That Reflects
              <br />
              <span
                className="bg-linear-to-r from-[#D747EA] to-[#7741FB]
    text-transparent bg-clip-text"
              >
                Who You Truly Are.
              </span>
            </h3>
            <p className="font-['Open_Sans'] font-light text-[16px] leading-6 tracking-[0px] text-[#242424] mb-6">
              Tell your story, express your values and let others see the real
              you.
            </p>
            <Button
              className="font-['Open_Sans'] font-medium  text-[16px] leading-[100%] tracking-[0px] text-center 
             w-fit h-[42px] py-1 px-6 rounded-[100px] 
             bg-linear-to-r from-[#7077FE] to-[#F07EFF] 
             self-stretch transition-colors duration-500 ease-in-out"
              onClick={() => setIsVideoOpen(true)}
            >
              See how it all works →
            </Button>
          </div>
        </div>

        <div className="lg:p-5 md:p-0 p-0 lg:block md:block hidden lg:w-7/12 w-full lg:mt-0 mt-20  overflow-x-auto scrollbar-thin scrollbar-thumb-[#9747FF]/40 scrollbar-track-transparent highlight-right-content-box">
          {/* Mobile View - Vertical Cards */}
          <div className="lg:hidden flex flex-col gap-4 w-full">
            {highlightCards.map((card, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="group relative cursor-pointer w-full"
                  onClick={() => handleClick(index)}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl border ${
                      isOpen ? "border-[#9747FF]" : "border-transparent"
                    } p-px transition-all duration-500 ease-in-out`}
                  ></div>

                  <div
                    className={`card relative z-10 bg-white ${
                      isOpen ? "h-auto min-h-[150px]" : "h-20 min-h-20"
                    } w-full px-4 py-4 border border-[#E9EDF0] rounded-2xl flex ${
                      isOpen ? "flex-col" : "flex-row items-center"
                    } transition-all duration-500 ease-in-out`}
                  >
                    <OptimizeImage
                      src={card.icon}
                      alt="Company Logo"
                      width={"100%"}
                      height={45}
                      className={`${
                        isOpen ? "w-10 h-10 mb-4" : "w-8 h-8 mr-4"
                      }`}
                    />

                    <div className={`${isOpen ? "" : "flex-1"}`}>
                      {isOpen ? (
                        // Top-left when expanded
                        <span className="text-[#4B4B4B] text-[14px] font-semibold mb-2">
                          0{index + 1}
                        </span>
                      ) : (
                        // Bottom-right when collapsed
                        <span className="absolute bottom-3 right-4 text-[#4B4B4B] text-[14px] font-semibold">
                          0{index + 1}
                        </span>
                      )}

                      {isOpen && (
                        <>
                          <h2 className="font-semibold text-start bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text text-[16px] mt-2">
                            {card.title}
                          </h2>
                          <p className="text-[#242424] font-light text-start text-[12px] mt-2">
                            {card.desc}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View - Original Horizontal Cards */}
          <div className="hidden lg:block overflow-x-auto scrollbar-thin scrollbar-thumb-[#9747FF]/40 scrollbar-track-transparent highlight-right-content-box">
            <div className="flex flex-row flex-nowrap gap-1 lg:gap-4 min-w-max lg:justify-end">
              {highlightCards.map((card, index) => {
                const isExpanded = hoveredIndex === index;
                
                return (
                  <div
                    key={index}
                    className="group relative cursor-pointer"
                    onMouseEnter={() => handleCardHover(index)}
                    onMouseLeave={() => handleCardHover(0)} // Reset to first card when not hovering
                  >
                    <div className={`absolute inset-0 rounded-2xl border ${
                      isExpanded ? "border-[#9747FF]" : "border-transparent"
                    } p-px transition-all duration-500 ease-in-out`}></div>

                    <div className={`card relative z-10 bg-white h-[350px] min-h-[350px] px-[18px] py-[26px] border border-[#E9EDF0] rounded-2xl flex flex-col justify-between items-start transition-all duration-500 ease-in-out origin-right ${
                      isExpanded ? "w-60" : "w-[78px]"
                    }`}>
                      <Image
                        src={card.icon}
                        alt="Company Logo"
                        width={"45px"}
                        height={"45px"}
                        className="w-14 h-14 hight-box-img"
                      />

                      <div>
                        <span className="text-[#64748B] text-[18px] font-normal">
                          0{index + 1}
                        </span>

                        <h2 className={`transition-all duration-500 font-semibold text-start bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text ${
                          isExpanded ? "text-[16px] mt-2" : "text-[0px]"
                        }`}>
                          {card.title}
                        </h2>

                        <p className={`text-[#242424] font-light transition-all duration-500 text-start ${
                          isExpanded ? "text-[12px] mt-2" : "text-[0px]"
                        }`}>
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center  p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          {/* Auto layout container */}
          <div
            className={`relative w-full ${
              isPortrait
                ? "max-w-[900px] aspect-video"
                : "max-w-[900px] aspect-video"
            } rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-black`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 z-10 text-white/80 hover:text-white bg-black/40 hover:bg-black/60
                   w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200"
            >
              ×
            </button>

            {/* Portrait Video: Blurred Background Layer */}
            {isPortrait && (
              <video
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40"
                src={videoUrl}
                muted
                loop
                autoPlay
              />
            )}

            {/* Main Video (auto detect portrait or landscape) */}
            <video
              ref={videoRef}
              className={`relative z-10 rounded-3xl ${
                isPortrait
                  ? "w-auto h-full mx-auto object-contain" // Portrait → center with height fit
                  : "w-full h-full object-cover" // Landscape → fill the container
              }`}
              src={videoUrl}
              controls
              autoPlay
              onLoadedMetadata={(e) => {
                const video = e.target as HTMLVideoElement;
                setIsPortrait(video.videoHeight > video.videoWidth);
              }}
            />
          </div>
        </div>
      )}{" "}
    </section>
  );
}