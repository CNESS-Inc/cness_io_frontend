import Button from "../../ui/Button";


export default function Subscribe() {
  return (
    <div className="w-full h-auto bg-gradient-to-r from-[#f9f9fb] to-[#fdfdfd] py-12 px-6 rounded-xl shadow-sm">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left text */}
<div className="text-center lg:text-left relative lg:right-30">
  <h2
    style={{ fontFamily: "Poppins, sans-serif" }}
    className="
      text-[33px] font-medium
      leading-[54px] tracking-[-0.02em]
      text-gray-900
    "
  >
    Join{" "}
    <span className="text-[#7B3AED]">2,000+</span>{" "}
    <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
      Subscribers
    </span>
  </h2>
  <p className="text-gray-600 mt-1">
    Stay updated with our newsletter
  </p>
</div>

        {/* Right form */}
        <form className="w-full max-w-md">
          {/* Input + Button in one row */}
          <div className="flex flex-row items-center gap-2">
            <input
              id="email"
              type="email"
              required
              placeholder="Mail ID"
              className="
                flex-1
                h-[44px] rounded-lg
                border border-slate-200
                bg-white px-3
                text-[14px] text-slate-800
                outline-none
                focus:ring-2 focus:ring-[#9AA2FF]/40 focus:border-[#7077FE]
              "
            />
            <Button
              variant="gradient-primary"
              type="submit"
              className="
                w-[118px] h-[44px]   /* match input height */
                rounded-[81px]
                flex items-center justify-center
                text-white text-[14px] font-medium
                whitespace-nowrap
                hover:opacity-90 transition
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B6BFF]
              "
            >
              Subscribe
            </Button>
          </div>

          {/* Privacy note below */}
          <p
            style={{ fontFamily: "Inter, sans-serif" }}
            className="text-gray-500 text-xs md:text-sm mt-2 text-left"
          >
            We care about your data in our{" "}
            <a
              href="/privacy"
              className="font-semibold text-slate-800 underline decoration-[#9747FF]/30 underline-offset-2 hover:text-[#9747FF]"
            >
              Privacy Policy
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}
