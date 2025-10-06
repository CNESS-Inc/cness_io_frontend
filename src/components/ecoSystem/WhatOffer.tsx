"use client";


const features = [
  {
    id: "01",
    icon: "/ecosystem_social.png",
    title: "Social Media",
    description:
      "Share stories, inspire others, and build your personal brand.",
  },
  {
    id: "02",
    icon: "/award.png",
    title: "Certification",
    description: "Gain knowledge, upskill, and get certified with ease.",
  },
  {
    id: "03",
    icon: "/market-place.png",
    title: "Marketplace",
    description:
      "A digital space to buy, sell, and showcase meaningful products.",
  },
  {
    id: "04",
    icon: "/lms.png",
    title: "LMS",
    description:
      "Access courses and structured learning paths to upskill at your own pace.",
  },
  {
    id: "05",
    icon: "/directory.png",
    title: "Directory",
    description:
      "A hub to discover verified businesses, professionals, communities, and creators.",
  },
  {
    id: "06",
    icon: "/best-practice.png",
    title: "Best Practices",
    description:
      "Ensure ethical learning, responsible selling, & conscious growth.",
  },
  {
    id: "07",
    icon: "/ecosystem-location.png",
    title: "AriOme",
    description:
      "Explore curated content that informs, entertains, and inspires.",
  },
  {
    id: "08",
    icon: "/communities.png",
    title: "Communities",
    description: "Connect, collaborate, and grow with like-minded individuals.",
  },
];

export default function WhatOffer() {
  return (
    <div className="w-full max-w-7xl flex mx-auto flex-col justify-center items-center py-16 px-4">
      <div className="w-full text-center">
        <h3
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-poppins font-medium text-[32px] md:text-[42px] leading-[54px] tracking-[-0.02em] capitalize text-centerp"
        >
          What{" "}
          <span className="bg-gradient-to-r from-[#D747EA] to-[#7741FB] text-transparent bg-clip-text">
            We Offer
          </span>
        </h3>
        <p className="font-['Open Sans'] openSans pt-2 text-center w-full font-['Open Sans'] text-[#64748B] font-light text-[16px] leading-[24.38px] tracking-[0px]">
          CNESS is a super app that brings together tools for professional
          growth and <br />
          personal connection in one ecosystem.
        </p>
      </div>
      <div className="w-full pt-16 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => (
            <div
              key={item.id}
              className="relative rounded-4xl bg-[#FAFAFA] hover:shadow-md transition p-6"
            >
              {/* Top right icon */}
              <div className="absolute top-4 right-4 w-8 h-8">
                <img src={item.icon} alt="bulb" className="ecosystem-card-icon w-full h-full object-cover " />
              </div>

              {/* Number */}
              <span className="openSans font-['Open Sans'] block text-lg text-[#4B4B4B] font-normal mb-2">
                {item.id}
              </span>

              {/* Title */}
              <h3
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="text-2xl font-medium text-black"
              >
                {item.title}
              </h3>

              {/* Description */}
              <p className="openSans font-['Open Sans'] mt-2 text-base font-light text-[#64748B] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
