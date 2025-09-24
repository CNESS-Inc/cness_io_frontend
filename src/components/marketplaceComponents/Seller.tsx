import { CircleCheckBig } from "lucide-react";
import woman from "../../assets/woman.png";

export default function SellerSection() {
  return (
    <section className="w-full mx-auto bg-white py-12 md:py-20 px-10 md:px-[86px] xl:px-[60px] 2xl:px-[86px]">
      <div className="w-full 2xl:w-[1300px] mx-auto bg-[#F5F7F9] rounded-[24px] md:rounded-[32px] px-6 sm:px-10 md:px-12 2xl:px-[120px]">
       <div className="mx-auto flex xl:flex-nowrap flex-wrap justify-center items-stretch gap-[30px] w-full">

          {/* Left copy */}
          <div className="flex justify-center xl:justify-end">
            <img
              src={woman}
              alt="woman icon"
              className="w-full max-w-[400px] md:max-w-[480px] xl:max-w-[500px] h-auto object-contain"
            />
            {/* <img
            src="https://cdn.cness.io/women.webp"
            alt="Seller"
            className="w-full max-w-[800px] lg:max-w-[1000px] object-contain scale-130"
          /> */}
          </div>

          {/* right copy  */}
          <div className="text-center xl:text-left py-8 sm:py-12 md:py-[50px]">
            <h2 className="font-poppins font-medium text-[32px] md:text-[42px] leading-[1.3] tracking-[-0.02em] text-[#000]">
              What you Gain as a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Seller
              </span>
            </h2>
            <p className="mt-4 font-['Open_Sans'] text-[15px] md:text-[16px] font-light leading-relaxed text-[#64748B] max-w-[500px] mx-auto xl:mx-0">
              At CNESS Marketplace, we empower creators to grow their presence,
              reach conscious audiences, and turn their digital products into
              meaningful opportunities.
            </p>

            <ul className="mt-8 space-y-5 text-left max-w-[500px] mx-auto xl:mx-0">
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
                <li key={i} className="flex items-start gap-3">
                  <CircleCheckBig className="mt-1 text-[#6340FF] w-5 h-5 shrink-0" />
                  <div>
                    <h3 className="font-['Open_Sans'] font-semibold text-[16px] text-black">
                      {item.title}
                    </h3>
                    <p className="font-['Open_Sans'] text-[14px] leading-[20px] text-[#64748B] font-light mt-1">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
