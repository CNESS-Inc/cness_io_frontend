export default function MarketplaceHero() {
  return (
    <section
      className="relative w-full py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 10%, #FDEDED 70%, #F9D3F2 100%)",
      }}
    >
      {/* Text container */}
      <div className="mx-auto max-w-[1100px] px-6 text-center">
        <h2 className="font-['Poppins'] font-medium text-[42px] leading-[100%] tracking-[-0.02em] bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
          CNESS Marketplace
        </h2>
        <p className="mt-3 font-['Open Sans'] font-normal text-[16px] leading-[22px] text-[#64748B]">
          CNESS Marketplace is a digital hub for conscious creators to share
          music, podcasts, courses, eBooks, art,
          <br /> and videos. Every offering is rooted in authenticity and
          purpose—helping you discover and support
          <br />
          creations that inspire growth and positive impact.
        </p>
      </div>

      {/* Image container (centered with spacing on sides) */}
      <div className="w-full px-4 lg:px-16 pb-8 md:pb-12 pt-14 md:pt-20">
        <div className="mx-auto max-w-[1900px] rounded-[32px] overflow-hidden">
          <img
            src="https://cdn.cness.io/marketplace.webp"
            alt="CNESS Marketplace preview"
            className="mx-auto w-full max-w-[1900px] rounded-[32px] object-cover h-[421px] object-[58%_50%] sm:object-[60%_50%] md:object-[62%_50%] lg:object-[64%_50%] xl:object-[66%_50%] 2xl:object-[68%_50%]"
            //     className="
            //   mx-auto w-full max-w-[1900px] rounded-[32px]
            //       object-cover
            //       /* heights per breakpoint */
            //       h-[240px] sm:h-[280px] md:h-[320px] lg:h-[405px] xl:h-[460px] 2xl:h-[460px]
            //       /* keep the man’s face in frame as width grows */
            //       object-[58%_50%]       /* base: a bit right of center */
            //       sm:object-[60%_50%]
            //       md:object-[62%_50%]
            //       lg:object-[64%_50%]
            //       xl:object-[66%_50%]
            //       2xl:object-[68%_50%]
            // "
          />
        </div>
      </div>
    </section>
  );
}
