export default function SellerForm() {
  return (
    <section
      className="relative w-full py-12 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, #FFFFFF 10%, #FDEDED 70%, #F9D3F2 100%)",
      }}
    >
      <div className="max-w-[1500px] mx-auto px-4 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
        
        {/* Form (Zoho Embed) */}
        <div className="w-full lg:w-[60%] bg-white shadow-lg rounded-[28px] p-4 sm:p-6 md:p-10 flex flex-col">
          <iframe
            src="https://forms.zohopublic.com/vijicn1/form/SellerForm/formperma/cg_YdZsqMd1myB1bzzytsXvBByc4kI4DzhufAv4Cu2s"
            className="w-full flex-1 border-0 rounded-lg"
            style={{ minHeight: "600px", height: "100%", overflow: "hidden" }}
            scrolling="yes"
            title="CNESS Seller Form"
          />
        </div>

        {/* Side Image */}
        <div className="w-full lg:w-[40%] flex">
          <img
            src="https://cdn.cness.io/neon.webp"
            alt="Sell on CNESS"
            className="w-full h-full rounded-[28px] shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
