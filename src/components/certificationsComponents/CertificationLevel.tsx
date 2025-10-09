import design from "../../assets/design.png";
import line from "../../assets/Line.svg";
import Ellipse2 from "../../assets/Ellipse 2.png";
import { Lock } from "lucide-react";
import group1 from "../../assets/Group1.png";
import group2 from "../../assets/Group2.png";
import group3 from "../../assets/Group3.png";

export default function CertificationLevel() {
  const levels = [
    {
      title: "Aspiring",
      description:
        "Entry-level certification for those beginning their journey of conscious growth.",
      icon: group1,
      position:
        "md:translate-y-32 md:-translate-x-5 lg:translate-y-46 lg:-translate-x-20 xl:translate-y-68 xl:-translate-x-44", // bottom-left
      lockRotation: "31.39deg",
    },
    {
      title: "Inspired",
      description:
        "Intermediate level for individuals or businesses actively practicing and applying conscious principles.",
      icon: group2,
      position: "md:translate-y-10 xl:translate-y-18", // center
      lockRotation: "1.95deg",
    },
    {
      title: "Leader",
      description:
        "Advanced recognition for change makers driving initiatives, leading communities, and creating impact.",
      icon: group3,
      position:
        "md:translate-x-4 md:-translate-y-14 lg:translate-x-20 xl:-translate-y-20 xl:translate-x-44", // top-right
      lockRotation: "0deg",
    },
  ];
  return (
    <section
      className="relative w-full h-full"
      style={{
        background:
          "linear-gradient(217.58deg, #FEE2E2 -24.89%, #FFFFFF 50.64%)",
      }}
    >
      <img
        src={Ellipse2}
        alt=""
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-h-[1551px] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center text-center z-10 pt-[86px] lg:mb-10 xl:mb-32 px-4">
        <div className="w-full pb-8">
          <h3
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp"
          >
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #6340FF 39.42%, #D748EA 72.12%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Certification&nbsp;
            </span>
            Level
          </h3>
          <p className="font-['Open_Sans'] lg:text-lg md:text-[16px] text-[12px] font-light text-[#242424] lg:mb-10 md:mb-12 my-4 max-w-4xl mx-auto transition-all duration-1000 ease-in-out">
            Everyone starts somewhere. We recognise progress at every stage of
            your journey
          </p>
        </div>
        <div className="relative md:py-10 lg:py-24">
          {/* dashed connector line */}
          <img
            src={line}
            alt="connector"
            className="absolute left-1/2 top-[120px] -translate-x-1/2 pointer-events-none select-none w-full max-w-sm lg:max-w-lg xl:max-w-3xl"
            style={{ zIndex: 1 }}
          />

          {/* cards */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-16 z-10">
            {levels.map((level, i) => (
              <div
                key={i}
                className={`relative text-center flex flex-col items-center w-[200px] sm:w-[260px] md:w-[180px] lg:w-[200px] xl:w-[260px] transform ${level.position}`}
              >
                <div className="group bg-white rounded-xl shadow-2xl transition-all duration-500 ease-out w-full h-[200px] sm:h-[260px] md:h-[180px] lg:h-[200px] xl:h-[260px] flex flex-col justify-between border border-[#F3EAFB] hover:-translate-y-2 hover:border-purple-300 hover:scale-[1.03] relative overflow-hidden">
                  <div
                    className="flex items-center justify-center flex-1 rounded-xl"
                    style={{
                      backgroundImage: `url(${design})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  >
                    <img
                      src={level.icon}
                      alt={level.title}
                      className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[70px] md:h-[70px] lg:w-[90px] lg:h-[90px] xl:w-[120px] xl:h-[120px]"
                    />
                  </div>
                  <div className="flex justify-start my-3 mx-4">
                    <Lock
                      className="w-5 h-5 text-yellow-500 opacity-70"
                      style={{ transform: `rotate(${level.lockRotation})` }}
                    />
                  </div>
                </div>
                <h3
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="text-2xl xl:text-3xl font-medium text-black mt-6 mb-2"
                >
                  {level.title}
                </h3>
                <p className="font-['Open_Sans'] text-[#242424] text-sm xl:text-base font-light w-full xl:max-w-xl mx-auto">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
