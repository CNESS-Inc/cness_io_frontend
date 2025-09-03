import Button from "../ui/Button";
import frame1 from "../../assets/eco-hero.png";
import frame2 from "../../assets/eco-frame-1.png";
import frame3 from "../../assets/eco-frame-2.png";
import frame4 from "../../assets/eco-frame-3.png";
import frame5 from "../../assets/eco-frame-4.png";
import texture from "../../assets/eco-texture.png";
import ellipse from "../../assets/Ellipse eco.png";

export default function EcoHero() {
  return (
    <section
      className="relative w-full pb-20"
      style={{
        background:
          "linear-gradient(129.63deg, #FFFFFF 27.35%, #FEDEDE 91.53%, #EE9CE5 99.09%)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-[47rem]">
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
          backgroundImage: `url(${texture})`,
          height: "612px",
        }}
      ></div>
      <div className="flex flex-col items-center text-center z-10 py-16 px-4">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-medium text-[42px] md:text-[42px] leading-[115%] tracking-[0.03rem] text-center antialiased bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
        >
          Our Ecosystem
        </h1>

        <p className="openSans lg:text-lg md:text-[16px] text-[12px] text-[#64748B] pt-4 pb-7 max-w-4xl mx-auto transition-all duration-1000 ease-in-out">
          Revolutionizing digital experiences with integrated solutions for
          individuals,
          <br /> organizations, and enterprises across all platforms.
        </p>

        <div className="flex justify-center items-center">
          <Button
            variant="gradient-primary"
            className="w-full sm:w-fit rounded-[100px] hero-section-btn py-2 px-4 text-[14px] sm:py-3 sm:px-8 sm:text-base font-['Open Sans'] font-normal leading-[100%] text-center"
            onClick={() => (window.location.href = "/sign-up")}
          >
            Explore
          </Button>
        </div>
      </div>

      <div className="relative flex mx-auto justify-center items-center w-[814px] h-[500px]">
        <img
          src={frame1}
          alt="Eco Hero"
          className="w-full h-full object-contain"
        />

        <div className="absolute -top-32 -right-46 w-[235px] h-[235px] pointer-events-none select-none">
          <img
            src={frame3}
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>

        <div className="absolute top-14 -left-[30.5rem] w-full h-[334px] pointer-events-none select-none">
          <div className="relative w-full h-full">
            <img
              src={frame4}
              alt=""
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
            <div className="absolute -top-12 -right-24 w-full h-[100px]">
              <img
                src={frame2}
                alt=""
                className="w-full h-full object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="absolute top-58 -right-[26rem] w-full h-[170px] pointer-events-none select-none">
          <img
            src={frame5}
            alt=""
            className="w-full h-full object-contain"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
