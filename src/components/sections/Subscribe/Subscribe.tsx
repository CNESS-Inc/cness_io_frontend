import Button from "../../ui/Button";

export default function Subscribe() {
  return (
    <div className="w-full bg-gradient-to-r from-[#FAFAFA] to-[#F6F5FA] py-8 md:py-10 shadow-sm rounded-lg">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-65">
        {/* Left + Right */}
        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-6">
          
          {/* LEFT: Heading */}
          <div className="flex-1 min-w-0 text-left">
            <h2
              style={{ fontFamily: "Poppins, sans-serif" }}
              className="text-[33px] font-medium lg:text-left md:text-left text-center leading-tight tracking-[-0.02em] text-gray-900"
            >
              Join{" "}
              <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                2,000+ Subscribers
              </span>
            </h2>
            <p className="mt-2 text-[#64748B] lg:text-left md:text-left text-center text-[20px] font-openSans font-light">
              Stay updated with our newsletter
            </p>
          </div>

          {/* RIGHT: Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full lg:w-auto lg:ml-auto flex flex-col items-stretch"
          >
            {/* Input + button */}
            <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="Mail ID"
                className="
                  w-full sm:w-[450px] h-[44px] rounded-md
                  border border-slate-200 bg-white px-3
                  text-[14px] text-slate-800
                  outline-none
                  focus:ring-2 focus:ring-[#9AA2FF]/40 focus:border-[#7077FE]
                "
              />
              <Button
                type="submit"
                variant="gradient-primary"
                className="
                  w-full sm:w-[140px] h-[44px] rounded-[81px]
                  flex items-center justify-center
                  text-white text-[16px] font-openSans font-medium
                  hover:opacity-90 transition
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B6BFF]
                "
              >
                Subscribe
              </Button>
            </div>

            {/* Privacy note */}
            <p className="mt-2 text-[#64748B] text-sm font-openSans lg:text-left md:text-left text-center sm:w-[600px] sm:ml-auto">
              We care about your data in our{" "}
              <a
                href="/privacy"
                className="font-semibold text-sm text-slate-800 underline decoration-[#9747FF]/30 underline-offset-2 hover:text-[#9747FF]"
              >
                Privacy Policy
              </a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
