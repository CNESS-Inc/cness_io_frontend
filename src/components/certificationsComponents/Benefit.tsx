import Ellipse1 from "../../assets/Ellipse 1.png";
import shine from "../../assets/star.svg";
import growth from "../../assets/growth.svg";
import community from "../../assets/community-certificate.svg";
import benefit1 from "../../assets/benefit1.png";
import benefit2 from "../../assets/benefit2.png";
import benefit3 from "../../assets/benefit3.png";
import benefit4 from "../../assets/benefit4.png";
import benefit5 from "../../assets/benefit5.png";
import benefit6 from "../../assets/benefit6.png";

export default function Benefit() {
  const benefits = [
    { icon: shine, label: "Verified credibility" },
    { icon: growth, label: "Career Growth" },
    { icon: community, label: "Community" },
  ];

  const features = [
    {
      icon: benefit1,
      title: "Gain recognition that builds trust and credibility",
      desc: "Showcase your verified values and stand apart with global validation.",
    },
    {
      icon: benefit2,
      title: "Enhance career and business opportunities",
      desc: "Open doors to collaborations, clients, and leadership roles.",
    },
    {
      icon: benefit3,
      title: "Access exclusive CNESS community and resources",
      desc: "Connect with like-minded conscious leaders and growth tools.",
    },
    {
      icon: benefit4,
      title: "Prove Your Commitment to Ethical Progress",
      desc: "Prove that you prioritize impact, ethics, and long-term value.",
    },
    {
      icon: benefit5,
      title: "Unlock Spotlight and Growth Opportunities in CNESS",
      desc: "Connect with like-minded conscious leaders and growth tools.",
    },
    {
      icon: benefit6,
      title: "Elevate Your Brand and Build Lasting Trust",
      desc: "Be recognized as a trusted voice in conscious impact.",
    },
  ];
  return (
    <section
      className="relative w-full h-full"
      style={{
        background: "linear-gradient(250.1deg, #FEE2E2 0.41%, #FFFFFF 99.59%)",
      }}
    >
      <img
        src={Ellipse1}
        alt=""
        className="absolute top-0 left-0 w-full h-full max-h-[1551px] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center text-center z-10 pt-[60px] px-20 px-4">
        <div className="w-full">
          <span
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="badge text-[#D748EA] border border-[#F07EFF] text-xs font-medium px-4 py-1 rounded-[100px] inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-transperant"
          >
            Why it matters
          </span>
          <h3
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="pt-6 font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp"
          >
            Benefits of our{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #6340FF 59.13%, #D748EA 94.71%)",
                WebkitBackgroundClip: "text", // Required for Safari
                WebkitTextFillColor: "transparent", // Required for Safari
                display: "inline-block",
              }}
            >
              Certification
            </span>
          </h3>
        </div>
        <div className="pt-5 flex flex-wrap gap-4 justify-center">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-5 py-2 transition cursor-pointer"
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-normal text-base text-[#64748B] font-['Open Sans'] openSans">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-[26px] pb-10">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="px-5 py-10 flex flex-col sm:flex-row items-start text-left gap-4 rounded-[20px] border border-[#DFDFDF] bg-white hover:shadow-md transition"
            >
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-[#6340FF]/10">
                <img src={item.icon} alt={item.title} className="w-8 h-8" />
              </div>

              <div>
                <h3
                  className="font-medium text-[#222224] text-lg lg:text-xl leading-snug"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="openSans font-['Open Sans'] font-normal text-sm lg:text-base text-[#64748B] mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
