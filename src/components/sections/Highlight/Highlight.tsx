import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import Image from "../../ui/Image";

export default function Highlight() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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
<section className="highlight-section lg:min-h-[560px] px-4 sm:px-6 lg:px-8 py-15 sm:py-12 lg:py-[80px] bg-[#FAFAFA] relative lg:bg-[url(https://res.cloudinary.com/diudvzdkb/image/upload/v1753780724/highlight-ellipse_hahibm.png)] bg-no-repeat lg:bg-[position:right_bottom_3rem] overflow-hidden">
      <div className="max-w-[1336px] mx-auto flex lg:flex-row flex-col">
        <div className="md:px-0 lg:px-0 lg:w-5/12 w-full">
          <div className="w-full">
            <span className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white">
              Highlights
            </span>
            <h3 className="poppins leading-9 text-[32px] font-[600] mb-2 lg:text-nowrap">
              Your conscious identity, activated.
            </h3>
            <p className="openSans text-[#64748B] text-[18px] font-[400] mb-6">
              CNESS helps you build visibility, earn credibility, and express your
              <br /> purpose — socially, creatively, and professionally. Everything you
              <br /> need to grow is here.
            </p>
            <Button className="jakarta w-fit rounded-[100px] h-[42px] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF] self-stretch transition-colors duration-500 ease-in-out"
            onClick={() => window.location.href = "/sign-up"}>
              See how it all works →
            </Button>
          </div>
        </div>

        <div className="lg:p-5 md:p-0 p-0 lg:w-7/12 w-full lg:mt-0 mt-20  overflow-x-auto scrollbar-thin scrollbar-thumb-[#9747FF]/40 scrollbar-track-transparent highlight-right-content-box">
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
                  <div className={`absolute inset-0 rounded-[16px] border ${isOpen ? 'border-[#9747FF]' : 'border-transparent'} p-[1px] transition-all duration-500 ease-in-out`}></div>

                  <div
                    className={`card relative z-10 bg-white ${isOpen ? 'h-auto min-h-[150px]' : 'h-[80px] min-h-[80px]'} w-full px-4 py-4 border border-[#E9EDF0] rounded-[16px] flex ${isOpen ? 'flex-col' : 'flex-row items-center'} transition-all duration-500 ease-in-out`}
                  >
                    <Image
                      src={card.icon}
                      alt="Company Logo"
                      width={45}
                      height={45}
                      className={`${isOpen ? 'w-10 h-10 mb-4' : 'w-8 h-8 mr-4'}`}
                    />

                    <div className={`${isOpen ? '' : 'flex-1'}`}>
                    {isOpen ? (
  // Top-left when expanded
  <span className="text-[#4B4B4B] text-[14px] font-[600] mb-2">
    /0{index + 1}
  </span>
) : (
  // Bottom-right when collapsed
  <span className="absolute bottom-3 right-4 text-[#4B4B4B] text-[14px] font-[600]">
    /0{index + 1}
  </span>
)}

                      {isOpen && (
                        <>
                          <h2 className="font-semibold text-start bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text text-[16px] mt-2">
                            {card.title}
                          </h2>
                          <p className="text-[#64748B] font-regular text-start text-[12px] mt-2">
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
              {highlightCards.map((card, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer hover:[&>.card]:w-[240px]"
                >
                  <div className="absolute inset-0 rounded-[16px] border border-transparent group-hover:border-[#9747FF] p-[1px] transition-all duration-500 ease-in-out"></div>

                  <div
                    className="card relative z-10 bg-white h-[350px] min-h-[350px] px-[18px] py-[26px] border border-[#E9EDF0] rounded-[16px] flex flex-col justify-between items-start transition-all duration-500 ease-in-out origin-right w-[78px] group-hover:w-[240px]"
                  >
                    <Image
                      src={card.icon}
                      alt="Company Logo"
                      width={45}
                      height={45}
                      className="w-14 h-14 hight-box-img"
                    />

                    <div>
                      <span className="text-[#4B4B4B] text-[18px] font-[600]">
                        /0{index + 1}
                      </span>

                      <h2 className="transition-all duration-500 font-semibold text-start bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text text-[0px] group-hover:text-[16px] group-hover:mt-2">
                        {card.title}
                      </h2>

                      <p className="text-[#64748B] font-regular transition-all duration-500 text-start text-[0px] group-hover:text-[12px] group-hover:mt-2">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}