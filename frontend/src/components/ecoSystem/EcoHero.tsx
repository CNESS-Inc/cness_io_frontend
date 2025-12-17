import Button from "../ui/Button";
import EcoHero1 from "../../assets/EcoHero1.jpg";
import EcoHero2 from "../../assets/EcoHero2.jpg";
import EcoHero3 from "../../assets/EcoHero3.jpg";

import texture from "../../assets/eco-texture.png";
import ellipse from "../../assets/Ellipse eco.png";
import { useState } from "react";

import SignupModel from "../OnBoarding/Signup";

export default function EcoHero() {
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <section
      className="relative w-full pb-20"
      style={{
        background:
          "linear-gradient(129.63deg, #FFFFFF 27.35%, #FEDEDE 91.53%, #EE9CE5 99.09%)",
      }}
    >
      <div className="invisible lg:visible hidden lg:flex absolute top-0 left-0 w-full 2xl:h-188">
        <img
          src={ellipse}
          alt=""
          className="h-full w-full"
          aria-hidden="true"
        />
      </div>
      <div
        className="absolute w-full h-[300px] sm:h-[400px] md:h-[500px] xl:h-[612px] 
             bg-no-repeat bg-contain bg-center"
        style={{
          backgroundImage: `url(${texture})`,
        }}
      ></div>
      <div className="flex flex-col items-center text-center z-10 pt-20 pb-16 px-4">
        <h1
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-medium text-[clamp(28px,5vw,42px)] leading-[125%] tracking-[-0.02em] bg-linear-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
        >
          Everything You Need to Grow,
          <br></br>All in One Place.
        </h1>

        <p className="font-['Open_Sans'] font-light text-[16px] leading-[26px] text-[#242424] pt-4 pb-7 max-w-[62ch] mx-auto">
          Whether you want to learn, connect or build a purpose‑driven business,
          <br />
          CNESS brings it together in one simple platform.
        </p>

        <div className="flex justify-center items-center">
          <Button
            variant="gradient-primary"
            style={{
              fontFamily: "Plus Jakarta Sans",
            }}
            className="w-full sm:w-fit rounded-[100px] hero-section-btn py-2 px-4 text-[16px] sm:py-3 sm:px-8 sm:text-base font-medium leading-[100%] text-center"
            onClick={() => setOpenSignup(true)}
          >
            Explore
          </Button>
        </div>
      </div>

      <div className="relative flex mx-auto justify-center items-center w-[300px] sm:w-[500px] md:w-[700px] lg:w-[600px] xl:w-[814px] xl:h-[500px]">
        <img
          src="https://cdn.cness.io/Frame_hero.webp"
          alt="Eco Hero"
          className="w-full h-full object-contain"
        />

        <div className="invisible lg:visible hidden lg:flex absolute -top-62 -right-38 xl:-right-46 w-[235px] h-[300px] pointer-events-none select-none opacity-100 rounded-3xl">
          <div className="relative">
            <div className="relative w-[235px] h-[235px] rounded-t-3xl overflow-hidden">
              <img
                src={EcoHero1}
                alt=""
                className="w-full h-full object-cover"
                aria-hidden="true"
              />

              {/* Bottom white fade shadow */}
              <div
                className="absolute bottom-[-5%] inset-x-0 h-1/2
                bg-linear-to-t 
                from-white/95 via-white/60 to-white/0
                pointer-events-none"
              />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 p-4 text-center bg-linear-to-t 
                from-white/95 via-white/60 to-white/0 rounded-b-3xl"
          >
            <h3 className="text-[15px] font-bold text-gray-800 uppercase">
              building conscious workplaces.
            </h3>
            <p className="text-[10px] text-[#64748B] mt-1">
              Trust, Transformation & Training
            </p>
          </div>
        </div>

        <div className="invisible lg:visible hidden lg:flex absolute -top-10 xl:top-14 -left-92 xl:-left-122 w-full h-[280px] xl:h-[334px] pointer-events-none select-none">
          <div className="relative w-full h-full">
            <div className="absolute left-75 h-[195px] w-[199px]">
              <img
                src={EcoHero2}
                alt=""
                className="w-full h-full object-cover rounded-t-3xl"
                aria-hidden="true"
              />
              <div className="bg-white px-2.5 pt-[30px] pb-5 rounded-b-3xl flex justify-center flex-col items-center">
                <p className="text-[#000000] text-[12px] text-center">
                  grows your visibility
                </p>
                <p className="text-[#64748B] text-[10px] pb-4 text-center">
                  Build real influence based on purpose, not algorithms.
                </p>
                <Button
                  variant="gradient-primary"
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                  }}
                  className="w-full sm:w-fit rounded-[100px] hero-section-btn cursor-pointer py-2 px-4 text-[9px] leading-[100%] text-center"
                >
                  Know more
                </Button>
              </div>
            </div>
            <div className="absolute -top-7 xl:-top-12 -right-20 xl:-right-24 w-full h-[70px] xl:h-[100px]">
              <img
                src="https://cdn.cness.io/Frame_10.webp"
                alt=""
                className="w-full h-full object-contain"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="invisible lg:visible hidden lg:flex absolute top-32 xl:top-40 -right-[20%] h-[130px] xl:h-[170px] pointer-events-none overflow-hidden select-none">
          <div className="flex bg-white p-2.5 items-center rounded-3xl">
            <div className="w-[169px]">
              <p className="text-[15px] text-center pb-1">CNESS Marketplace</p>
              <p className="text-[10px] text-[#64748B] text-center">
                where certified providers can offer digital and physical
                products, courses, experiences
              </p>
            </div>
            <div className=" h-[150px] w-[169px] rounded-3xl">
              <img
                src={EcoHero3}
                alt=""
                className="w-full h-full object-cover rounded-3xl"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Signup Popup Modal */}
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </section>
  );
}
