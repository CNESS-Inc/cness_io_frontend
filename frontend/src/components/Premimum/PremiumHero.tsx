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
    `,
        }}
      />

      {/* Text container */}
      <div className="relative z-10 mx-auto max-w-[1100px] h-full px-6 text-center mt-14">
        <h2
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="font-medium text-[clamp(28px,5vw,42px)] leading-[115%] tracking-[-0.02em] bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text transition-all duration-1000 ease-in-out"
        >
          {" "}
          Choose Your Plan
        </h2>
        <p className="mt-3 font-['Open_Sans'] font-[300] text-[16px] leading-[24px] tracking-[0px] text-[#242424]">
          Select the perfect plan for your needs. Upgrade anytime to unlock
          premium features <br /> and accelerate your growth.
        </p>
      </div>
    </section>
  );
}
