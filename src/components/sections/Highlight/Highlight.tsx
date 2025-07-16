import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import Image from "../../ui/Image";

export default function Highlight() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = (index) => {
    if (isMobile) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  const highlightCards = [
    {
      icon: "/highlight-icon-1.png",
      title: "Create a Profile",
      desc: "Let the world see who you are — your values, work and inner story.",
    },
    {
      icon: "/highlight-icon-2.png",
      title: "Grow Visibility",
      desc: "Make your mission visible to a purpose-driven audience.",
    },
    {
      icon: "/highlight-icon-3.png",
      title: "Earn Credibility",
      desc: "Stand out by sharing your expertise and impact.",
    },
    {
      icon: "/highlight-icon-4.png",
      title: "Stream Content",
      desc: "Host live talks. Share music, thoughts, and your message.",
    },
    {
      icon: "/highlight-icon-5.png",
      title: "Get Featured",
      desc: "Be seen by the conscious world on our curated platform.",
    },
    {
      icon: "/highlight-icon-6.png",
      title: "Connect & Collaborate",
      desc: "Network and grow with aligned changemakers.",
    },
  ];

  return (
    <section className="highlight-section px-4 sm:px-6 lg:px-8 py-15 sm:py-12 lg:py-[80px] bg-[#FAFAFA] relative bg-[url(/highlight-ellipse.png)] bg-no-repeat bg-right overflow-hidden">
      <div className="max-w-[1336px] mx-auto flex lg:flex-row flex-col">
        <div className="md:px-0 lg:px-0 lg:w-5/12 w-full">
          <div className="w-full">
            <span className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block">
              Highlights
            </span>
            <h3 className="poppins text-[32px] font-[600] mb-2 lg:text-nowrap">
              Your conscious identity, activated.
            </h3>
            <p className="openSans text-[#64748B] text-[18px] font-[400] mb-6">
              CNESS helps you build visibility, earn credibility, and express your
              <br /> purpose — socially, creatively, and professionally. Everything you
              <br /> need to grow is here.
            </p>
            <Button className="jakarta rounded-[100px] h-[42px] py-1 px-6 bg-linear-to-r from-[#7077FE] to-[#F07EFF] self-stretch transition-colors duration-500 ease-in-out">
              See how it all works →
            </Button>
          </div>
        </div>

        <div className="lg:p-5 md:p-0 p-0 lg:w-7/12 w-full lg:mt-0 mt-15  overflow-x-auto scrollbar-thin scrollbar-thumb-[#9747FF]/40 scrollbar-track-transparent highlight-right-content-box">
          <div className="flex flex-row flex-nowrap gap-1 lg:gap-4 min-w-max lg:justify-end">
            {highlightCards.map((card, index) => {
              const isOpen = isMobile ? openIndex === index : false;

              return (
                <div
                  key={index}
                  className={`group relative cursor-pointer ${!isMobile ? "hover:[&>.card]:w-[240px]" : ""}`}
                  onClick={() => handleClick(index)}
                >
                  <div className="absolute inset-0 rounded-[16px] border border-transparent group-hover:border-[#9747FF] p-[1px] transition-all duration-500 ease-in-out"></div>

                  <div
                    className={`card relative z-10 bg-white h-[250px] min-h-[250px] lg:h-[350px] lg:min-h-[350px] px-[10px] py-[20px] md:px-[18px] md:py-[26px] border border-[#E9EDF0] rounded-[16px] flex flex-col justify-between items-start transition-all duration-500 ease-in-out origin-right
                      ${isOpen ? 'w-[240px]' : 'w-[50px] lg:w-[85px] md:w-[85px]'}
                      group-hover:w-[240px]'`}
                  >
                    <Image
                      src={card.icon}
                      alt="Company Logo"
                      width={45}
                      height={45}
                      className="w-10 h-10 md:w-14 md:h-14 lg:w-14 lg:h-14 hight-box-img"
                    />

                    <div>
                      <span className="text-[#4B4B4B] text-[12px] md:text-[14px] lg:text-[18px] font-[600]">
                        /0{index + 1}
                      </span>

                      <h2
                        className={`transition-all duration-500 font-semibold text-start bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text
                          ${isOpen ? 'text-[16px] mt-2' : 'text-[0px]'}
                          group-hover:text-[16px] group-hover:mt-2`}
                      >
                        {card.title}
                      </h2>

                      <p
                        className={`text-[#64748B] font-regular transition-all duration-500 text-start
                          ${isOpen ? 'text-[12px] mt-2' : 'text-[0px]'}
                          group-hover:text-[12px] group-hover:mt-2`}
                      >
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
    </section>
  );
}