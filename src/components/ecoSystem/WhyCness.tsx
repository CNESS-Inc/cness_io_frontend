import line1 from "../../assets/Line 1.png";
import line2 from "../../assets/line 2.png";
import logo from "../../assets/logo.png";
import shine from "../../assets/shine.svg";
import why1 from "../../assets/why1.png";
import why2 from "../../assets/why2.png";
import why3 from "../../assets/why3.png";
import ellipse from "../../assets/Ellipse why.png";
import bg from "../../assets/why bg.png";

const whyItems = [
  {
    id: 1,
    icon: why1,
    title: "One Ecosystem, Four Products, Six Pillars",
    desc: "A Completed connected experience designed",
  },
  {
    id: 2,
    icon: why2,
    title: "Growth that's connected, visible, and measurable.",
    desc: "A Completed connected experience designed",
  },
  {
    id: 3,
    icon: why3,
    title: "Designed for both individuals and organizations.",
    desc: "Scalable solutions for personal and enterprise needs.",
  },
];

export default function WhyCness() {
  return (
    <div
      className="w-full flex mx-auto flex-col justify-center items-center py-16 px-4"
      style={{
        background:
          "linear-gradient(101.22deg, #ACA0F8 -6.56%, #CE8FFC 61.3%, #FFF2C0 129.16%)",
      }}
    >
      <div className="invisible lg:visible hidden lg:flex absolute top-0 left-0 w-[15rem]">
        <img
          src={ellipse}
          alt=""
          className="h-full w-full"
          aria-hidden="true"
        />
      </div>
      <div
        className="absolute w-full bg-no-repeat bg-contain bg-center"
        style={{
          backgroundImage: `url(${bg})`,
          height: "515px",
        }}
      ></div>
      <div className="flex flex-col items-center text-center pt-5">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-medium text-[42px] md:text-[42px] leading-[115%] tracking-[0.03rem] text-white"
        >
          Why CNESS?
        </h1>

        <p style={{ fontFamily: "Open Sans, sans-serif" }} className="lg:text-lg md:text-[16px] text-white font-light pt-4 max-w-4xl mx-auto transition-all duration-1000 ease-in-out">
          Discover our comprehensive range of applications designed to meet the{" "}
          <br /> diverse needs of individuals and organizations.
        </p>
      </div>
      <div className="relative w-full flex flex-col items-center">
        <img src={line1} alt="top-line" className="max-h-[64px]" />
        <div className="bg-white px-7 py-2 rounded-lg relative">
          <img src={logo} alt="logo" className="w-[80px] h-auto" />
          <div className="absolute -top-8 -right-8 z-20">
            <img
              src={shine}
              alt="shine"
              className="w-full max-h-[80px] object-contain pointer-events-none select-none"
            />
          </div>
        </div>
        <img
          src={line2}
          alt="bottom-line"
          className="max-h-[30px] sm:max-h-[50px] md:max-h-[80px] xl:max-h-[117px]"
        />
      </div>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-18 pb-5">
        {whyItems.map((item) => (
          <div key={item.id} className="relative group w-full h-full">
            <div className="absolute inset-0 rounded-3xl pointer-events-none z-0"></div>

            <div className="relative z-10 w-full h-full rounded-tr-[30px] rounded-bl-4xl overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 rounded-[28px]"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />

              <div
                className="relative z-20 rounded-[28px] px-5 lg:px-7 py-10 flex flex-col items-center justify-center text-center w-full h-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  WebkitBackdropFilter: "blur(36px)",
                  boxShadow:
                    "inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 3px rgba(255,255,255,0.25)",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 mb-6"
                />

                <h3
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="text-white font-medium text-base lg:text-lg lg:w-[90%]"
                >
                  {item.title}
                </h3>

                <p className="font-['Open Sans'] pt-3 text-white text-sm font-light" style={{ fontFamily: "Open Sans, sans-serif" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
