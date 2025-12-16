import React, { useRef } from "react";

const Communitynew: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
<section ref={sectionRef} className="community-section bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <div className="community-header text-center mb-12 px-4">
        <h2
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="poppins lg:leading-16 md:leading-14 leading-9 text-[32px] font-medium bg-linear-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 w-fit mx-auto"
        >
          Find Friends Who Share Your
          <span className="bg-linear-to-r from-[#a545f4] to-[#B646F1] text-transparent bg-clip-text">
            {" "}
             Values.
          </span>
        </h2>
        <p className="font-['Open_Sans'] font-light text-[16px] leading-6 tracking-[0px] text-[#242424] text-center w-fit mx-auto">
          Whether you're here to grow your career, share your passion, or
          simply <br className="lg:block md:block hidden" />
          connect with others who care — CNESS gives you a space to belong,
          be <br className="lg:block md:block hidden" />
          seen, and evolve together.
        </p>
      </div>

      {/* Static Collage Image (slightly raised) */}
      <div className="relative w-full flex justify-center -mt-8 md:-mt-10 lg:-mt-12">
        <img
          src="https://cdn.cness.io/collage_image.svg"
          alt="Community Collage"
          className="w-full max-w-[900px] h-auto"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Communitynew;
