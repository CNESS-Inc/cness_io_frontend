export default function MarketplaceHero() {
  return (
   <section
  className="relative w-full py-16 md:py-20"
style={{
  background: "linear-gradient(135deg, #FFFFFF 10%, #FDEDED 70%, #F9D3F2 100%)",
}}
>
  {/* Text container */}
  <div className="mx-auto max-w-[1100px] px-6 text-center">
    <h2 className="font-['Poppins'] font-medium text-[32px] leading-[100%] tracking-[-0.02em] text-gray-900">
      CNESS Marketplace
    </h2>
    <p className="mt-3 font-['Open Sans'] font-normal text-[16px] leading-[22px] text-gray-700">
      CNESS Marketplace is a digital hub for conscious creators to share music,
      podcasts, courses, eBooks, art,
      <br /> and videos. Every offering is rooted in
      authenticity and purpose—helping you discover and support 
      <br />creations that inspire growth and positive impact.
    </p>
  </div>

  {/* Image container (centered with spacing on sides) */}
  <div className="mt-10 px-6">
    <div className="mx-auto max-w-[1600px] rounded-[32px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <img
        src="https://cdn.cness.io/marketplace.webp"
        alt="CNESS Marketplace preview"
        className="
          w-full 
          h-[421px] sm:h-[300px] md:h-[421px] lg:h-[421px] xl:h-[421px] 2xl:h-[520px]
          object-cover
        "
      />
    </div>
  </div>
</section>
  );
}
