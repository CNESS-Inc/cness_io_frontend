//import { Smile, Paperclip,MousePointer2  } from "lucide-react";
//import React from "react";
//import ReactCountryFlag from "react-country-flag";
//import { useState } from "react";
//import Button from "../../ui/Button";
import call from "../../../assets/call.svg";
import atsymbol from "../../../assets/atsymbol.svg";

//const COUNTRIES = [
  //{ code: "US", dial: "+1", label: "+1" },
  //{ code: "IN", dial: "+91", label: "+91" },
  //{ code: "GB", dial: "+44", label: "+44" },
//];

export default function GetInTouch()

{
    //const [country, setCountry] = useState(COUNTRIES[0]); // default US

  return (  
 <section
      className="relative px-4 sm:px-6 md:px-10 lg:px-16 py-10 md:py-14 lg:py-20 overflow-hidden"
      style={{ background: "linear-gradient(to top right, #FFFFFF, #F6E6FF, #FFFFFF)" }}
    >
      {/* BG ellipse */}
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat bg-contain md:bg-cover opacity-50"
        style={{ backgroundImage: "url('https://cdn.cness.io/Ellipse%203373%20(1).webp')" }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-start gap-8 md:gap-12 xl:gap-16">
        {/* LEFT: Zoho form (stacks first on mobile) */}
        <div className="w-full max-w-[640px] mx-auto bg-white shadow-lg rounded-[28px] p-5 sm:p-6 md:p-8">
          {/* Height is responsive per breakpoint; iframe fills wrapper */}
          <div className="w-full h-[560px] sm:h-[620px] md:h-[680px] lg:h-[712px]">
            <iframe
              src="https://forms.zohopublic.com/vijicn1/form/GetInTouch/formperma/x_WVVrlIZduQfJsgakmb-blY_rSPpNEQCpUVPe5E7nk"
              className="w-full h-full border-0 rounded-lg"
              scrolling="no"
              title="CNESS Seller Form"
            />
          </div>
        </div>

        {/* RIGHT: Copy + Contacts */}
        <div className="place-self-center flex flex-col items-center lg:items-start text-center lg:text-left gap-3 md:gap-4">
          <h3
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="text-[22px] sm:text-[24px] md:text-[28px] lg:text-[33px] font-medium leading-[1.15] tracking-[-0.03em]"
          >
            We’d <span className="text-[#9747FF]">love</span> to hear from you
          </h3>

          <p
            style={{ fontFamily: "Inter, sans-serif" }}
            className="text-[14px] md:text-[16px] leading-[22px] md:leading-[27px] tracking-[-0.02em] text-gray-600"
          >
            Whether you’re a business, a creator, or simply curious about CNESS.
            <br className="hidden md:block" />
            Reach out and let’s connect.
          </p>

          {/* Contacts: stack on mobile, side-by-side from sm+ */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
            {/* Call */}
            <a
              href="tel:+1456334445"
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <img src={call} alt="Call" className="w-8 h-8 md:w-10 md:h-10" />
              <div>
                <p className="text-gray-500">Call Us</p>
                <p
                  style={{ fontFamily: "Inter, sans-serif" }}
                  className="text-[18px] md:text-[20px] font-semibold leading-[1]"
                >
                  <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                    +1
                  </span>{" "}
                  456 334 445
                </p>
              </div>
            </a>

            {/* Mail */}
            <a
              href="mailto:sales@cness.co"
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <img src={atsymbol} alt="Email" className="w-8 h-8 md:w-10 md:h-10" />
              <div>
                <p className="text-gray-500">Mail Us</p>
                <p
                  style={{ fontFamily: "Inter, sans-serif" }}
                  className="text-[18px] md:text-[20px] font-semibold leading-[1]"
                >
                  <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                    sales@
                  </span>
                  cness.co
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}