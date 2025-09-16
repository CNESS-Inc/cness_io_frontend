import { CircleCheckBig } from "lucide-react";

export default function SellerSection() {
  return (
    <section className="w-full bg-white px-20 py-[86px]">
      {/* Container */}
      <div className="max-w-[1500px] mx-auto bg-[#F5F7F9] rounded-[24px] md:rounded-[32px] px-6 sm:px-10 md:px-16 lg:px-[120px] py-8 sm:py-12 md:py-[50px] flex flex-col lg:flex-row gap-10 lg:gap-[30px]">
        
        {/* Left content (Image) */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://cdn.cness.io/women.webp"
            alt="Seller"
            className="w-full max-w-[400px] lg:max-w-full h-auto rounded-xl"
          />
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
          <h2 className="font-poppins font-medium text-2xl sm:text-3xl md:text-[42px] leading-snug md:leading-[54px] tracking-[-0.02em] text-gray-900">
            What you Gain as a{" "}
            <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Seller
            </span>
          </h2>

          <p className="mt-4 font-['Open_Sans'] text-sm sm:text-base md:text-[16px] font-normal leading-relaxed text-[#64748B]">
            At CNESS Marketplace, we empower creators to grow their
            presence, reach conscious audiences, and turn their digital
            products into meaningful opportunities.
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-5">
            {[
              {
                title: "Global Reach",
                desc: "Showcase your digital products to a conscious, worldwide audience.",
              },
              {
                title: "Purpose-Driven Platform",
                desc: "Sell in a marketplace that values authenticity and impact.",
              },
              {
                title: "Easy Setup",
                desc: "List and manage your creations with a simple, seamless process.",
              },
              {
                title: "Grow Your Brand",
                desc: "Build credibility and visibility within the CNESS ecosystem.",
              },
              {
                title: "Earn & Empower",
                desc: "Generate income while making a meaningful difference.",
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-left">
                <CircleCheckBig className="flex-shrink-0 mt-1 text-[#6340FF] w-5 h-5" />
                <div>
                  <h3 className="font-['Open_Sans'] text-sm sm:text-base md:text-[16px] font-semibold capitalize text-black">
                    {item.title}
                  </h3>
                  <p className="font-['Open_Sans'] text-xs sm:text-sm md:text-[12px] font-normal leading-[19px] text-[#64748B] mt-1">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
