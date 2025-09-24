import { useEffect, useState } from "react";
import ellipse1 from "../../assets/Ellipse 1.svg";
import ellipse2 from "../../assets/Ellipse 2.svg";
import ellipse3 from "../../assets/Ellipse 3.svg";

const cards = [
  {
    id: 1,
    title: "CNESS Web",
    subtitle: "(Individual)",
    content: "Your Personal Hub To Learn, Certified, And Grow Visibility.",
  },
  {
    id: 2,
    title: "CNESS Web",
    subtitle: "(Business)",
    content: "For Training, Certification, And Conscious Growth.",
  },
  {
    id: 3,
    title: "CNESS Application",
    content: "The Entire CNESS Ecosystem In Your Pocket.",
  },
  {
    id: 4,
    title: "AriOme Application",
    content: "Day-To-Day Growth, Mental Alignment.",
  },
];

const rightCards = [
  {
    title: "CNESS Web (Individual)",
    subtitle: "Empowering Conscious Creators",
    list: [
      "Validate Their Conscious Identity",
      "Set Up A Storefront With Digital Goods And Services",
      "Be Listed In A Professional Directory That Increases Visibility",
      "Access Structured Learning And Mentorship Pxathways",
      "Track Earnings And User Engagement Via Dashboards",
    ],
    button: "Join now",
    caption: {
      before: "It Is A Purpose-Built Professional Layer For",
      highlight: "The Conscious Creator Economy",
      after: "",
    },
  },
  {
    title: "CNESS Web (Organizations)",
    subtitle: "Trust, Transformation & Training",
    list: [
      "3-Level Certification: With Transparent Criteria And Public Visibility",
      "Conscious Impact Score: A Proprietary Metric To Quantify Values Alignment",
      "Internal LMS: For Teams To Learn And Grow Together",
      "Mentor Marketplace: For Facilitated Transformation Via Certified Mentors",
      "Custom Consulting: For Deep Enterprise Alignment Programs",
    ],
    button: "Join now",
    caption: {
      before: "",
      highlight: "Built For The Next Decade Of Business.",
      after: "",
    },
  },
  {
    title: "CNESS (Mobile App)",
    subtitle: "Ecosystem — in your pocket.",
    list: [
      "Conscious Profile: A Digital Reflection Of One’s Values And Intent",
      "Moments: Thoughtful, Bite-Sized Posts For Sharing Experiences",
      "Echo: A Deeper Way To React, Beyond Likes",
      "Circles: Values-Aligned Communities For Dialogue And Growth",
      "Marketplace: Seamless Exploration And Purchase Of Conscious Content And Services",
    ],
    button: "Download",
    caption: {
      before: "",
      highlight: "It’s The Antidote To Noisy Social Media",
      after: "A Space That Inspires Meaningful Digital Interaction.",
    },
  },
  {
    title: "Ariome",
    subtitle: "Conscious Betterment App",
    list: [
      "Guided Growth Journeys: Multi-Day Themed Programs",
      "Masterclasses: From World-Class Thought Leaders And Coaches",
      "Curated Conscious Content: From CNESS Creators And Media Partners",
      "Daily Drops & Reflections: Bite-Sized Insights And Journaling Prompts",
      "Mood Tracking & Personalized Suggestions",
    ],
    button: "Download",
    caption: {
      before: "An App That Supports Individuals In Their Day-To-Day",
      highlight: "Growth, Reflection, And Mental Alignment.",
      after: "",
    },
  },
];

export default function EcoSystemApp() {
  const [activeCard, setActiveCard] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const isSmallScreen = window.innerWidth < 640; 

  // autoplay through cards until user interacts
  useEffect(() => {
    if (!autoPlay) return;
   const order = isSmallScreen ? [0, 1, 2, 3] : [0, 2, 3, 1]; // 1,3,4,2 visual order
    // start from current index inside order
    let step = Math.max(0, order.indexOf(activeCard));
    const id = setInterval(() => {
      step = (step + 1) % order.length;
      setActiveCard(order[step]);
    }, 2000);
    return () => clearInterval(id);
  }, [autoPlay, activeCard, isSmallScreen]);

  const makeActive = (i: number) => {
    setActiveCard(i);
    setAutoPlay(true); // pause autoplay after any user selection
  };

  const onKeyActivate = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      makeActive(i);
    }
  };

  return (
    <div
      className="flex items-start w-full pt-20 md:pt-42 pb-20 xl:py-32 px-5"
      style={{
        background: "linear-gradient(180deg, #FAFAFA 0%, #F6F5FA 100%)",
      }}
    >
      <div className="w-full max-w-7xl flex mx-auto grid grid-cols-1 xl:grid-cols-2 gap-[60px] justify-center items-center">
        {/* left card  */}
        <div className="flex flex-col sm:flex-row justify-center items-center mx-auto gap-[30px] relative max-w-2xl lg:w-full">
          <div
            className="invisible md:visible hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
             pointer-events-none select-none w-full h-full"
            aria-hidden="true"
          >
            <img
              src={ellipse1}
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[645px]"
            />
            <img
              src={ellipse2}
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px]"
            />
            <img
              src={ellipse3}
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[341px]"
            />
          </div>

          <div className="flex flex-col gap-[30px] w-full">
            {[0, 1].map((i) => (
              <div
                key={cards[i].id}
                role="button"
                tabIndex={0}
                aria-selected={activeCard === i}
                onClick={() => makeActive(i)}
                onKeyDown={(e) => onKeyActivate(e, i)}
                className={`relative overflow-hidden rounded-4xl p-[30px] w-full shadow-sm transition-all duration-700 
                            cursor-pointer outline-none flex-1 h-full ${
                              activeCard === i
                                ? "ring-2 ring-[#7b5bff]/50"
                                : "ring-0"
                            }`}
                style={{
                  backgroundColor: "white",
                  boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out rounded-4xl"
                  style={{
                    background:
                      "linear-gradient(226.31deg, #674EFF 13.47%, #AE5DF1 56.9%, #F38EEC 86.53%)",
                    opacity: activeCard === i ? 1 : 0,
                  }}
                />
                <div className="relative z-10">
                  <h3
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className={`font-medium text-2xl ${
                      activeCard === i ? "text-white" : "text-black"
                    }`}
                  >
                    {cards[i].title}
                  </h3>
                  <span
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className={`text-sm font-semibold ${
                      activeCard === i ? "text-white" : "text-[#6F41FD]"
                    }`}
                  >
                    {cards[i].subtitle}
                  </span>
                  <p
                    className={`mt-2 text-base font-light font-['Open Sans'] openSans ${
                      activeCard === i ? "text-white" : "text-[#64748B]"
                    }`}
                  >
                    {cards[i].content}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="invisible sm:visible hidden sm:flex rounded-4xl p-8 w-full"
              style={{
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, rgba(246, 245, 250, 0.5) 100%)",
              }}
            />
          </div>

          <div className="flex flex-col gap-[30px] w-full">
            <div
              className="invisible sm:visible hidden sm:flex rounded-4xl p-8 w-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(250, 250, 250, 0.5) 0%, #FFFFFF 100%)",
              }}
            />
            {[2, 3].map((i) => (
              <div
                key={cards[i].id}
                role="button"
                tabIndex={0}
                aria-selected={activeCard === i}
                onClick={() => makeActive(i)}
                onKeyDown={(e) => onKeyActivate(e, i)}
                className={`relative overflow-hidden rounded-4xl p-[30px] w-full shadow-sm transition-all duration-700 
                            cursor-pointer outline-none flex-1 h-full ${
                              activeCard === i
                                ? "ring-2 ring-[#7b5bff]/50"
                                : "ring-0"
                            }`}
                style={{
                  backgroundColor: "white",
                  boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="absolute inset-0 z-0 transition-opacity duration-700 ease-in-out rounded-4xl"
                  style={{
                    background:
                      "linear-gradient(226.31deg, #674EFF 13.47%, #AE5DF1 56.9%, #F38EEC 86.53%)",
                    opacity: activeCard === i ? 1 : 0,
                  }}
                />
                <div className="relative z-10">
                  <h3
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className={`font-medium text-2xl ${
                      activeCard === i ? "text-white" : "text-black"
                    }`}
                  >
                    {cards[i].title}
                  </h3>
                  <p
                    className={`mt-2 text-base font-light openSans font-['Open Sans'] openSans ${
                      activeCard === i ? "text-white" : "text-[#64748B]"
                    }`}
                  >
                    {cards[i].content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right card  */}
        <div className="w-full md:pt-24 xl:pt-0 flex flex-col justify-center mx-auto gap-4">
          <div className="flex flex-col mx-auto xl:mx-0">
            <div className="w-full">
              <h3 className="font-poppins text-2xl font-light leading-[54px] tracking-[-0.02em] capitalize">
                <span
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent text-[42px] font-medium bg-clip-text"
                >
                  {rightCards[activeCard].title}
                </span>
              </h3>
              <h3
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize"
              >
                {rightCards[activeCard].subtitle}
              </h3>
            </div>

            <ul className="flex flex-col gap-3 py-8">
              {rightCards[activeCard].list.map((item, idx) => (
                <li
                  key={idx}
                  className="text-[#64748B] font-light text-base leading-6 font-['Open Sans'] openSans"
                >
                  • {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              {/*<button
                className="text-white text-base px-6 py-2 rounded-full font-semibold"
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  background: "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                }}
              >
                {rightCards[activeCard].button}
              </button>*/}
              <p className="flex flex-col text-[#64748B] text-base font-light font-['Open Sans'] openSans">
                {rightCards[activeCard].caption.before}
                <span className="text-black font-normal">
                  {rightCards[activeCard].caption.highlight}
                </span>
                {rightCards[activeCard].caption.after}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
