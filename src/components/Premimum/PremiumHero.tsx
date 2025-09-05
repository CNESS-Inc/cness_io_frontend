import HomeHeroBackground from "../ui/Premiumbackground";

export default function PremiumHero() {
  return (
<section className="relative w-full h-[237px] md:h-[237px] overflow-hidden">
      {/* Background animation */}
      <HomeHeroBackground />

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
