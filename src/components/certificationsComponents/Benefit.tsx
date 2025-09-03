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
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center text-center z-10 pt-16 px-4">
        <div className="w-full">
          <span
            className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
          >
            Why it matters
          </span>
          <h3 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp">
            Benefits of our{" "}
            <span className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent bg-clip-text">
              Certification
            </span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 justify-center my-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-5 py-2 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="font-medium text-[#64748B]">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start text-left gap-4 rounded-2xl border border-[#DFDFDF] bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-[#6340FF]/10">
                <img src={item.icon} alt={item.title} className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-medium text-[#222224] text-lg lg:text-xl leading-snug">
                  {item.title}
                </h3>
                <p className="font-normal text-sm lg:text-base text-[#64748B] mt-1">
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
