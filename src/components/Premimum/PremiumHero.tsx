//import HomeHeroBackground from "../ui/Premiumbackground";

export default function PremiumHero() {
  return (
<section className="relative w-full h-[237px] md:h-[237px] overflow-hidden border-b border-[#ECEEF2] shadow-none">
      {/* Background animation */}
      <div
    className="absolute inset-0 -z-10"
style={{
    background: `
      linear-gradient(90deg,
        rgba(255, 153, 74, 0.15) 0%,
        rgba(255, 153, 74, 0.05) 20%,
        #ffffff 100%
      )
    `
  }}
  />

      {/* Text container */}
      <div className="relative z-10 mx-auto max-w-[1100px] h-full px-6 text-center mt-6">
        <h2 className="font-['Poppins'] font-medium text-[32px] leading-[100%] tracking-[-0.02em] text-[#4E4E4E]">
          Choose Your Plan
        </h2>
        <p className="mt-3 font-['Open Sans'] font-normal text-[16px] leading-[22px] text-gray-700">
          Select the perfect plan for your needs. Upgrade anytime to unlock premium
          features <br /> and accelerate your growth.
        </p>
        
      </div>
    </section>
  );
}
