import { Smile, Paperclip,MousePointer2  } from "lucide-react";
//import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useState } from "react";
import Button from "../../ui/Button";
import call from "../../../assets/call.svg";
import atsymbol from "../../../assets/atsymbol.svg";

const COUNTRIES = [
  { code: "US", dial: "+1", label: "+1" },
  { code: "IN", dial: "+91", label: "+91" },
  { code: "GB", dial: "+44", label: "+44" },
];

export default function GetInTouch()

{
    const [country, setCountry] = useState(COUNTRIES[0]); // default US

  return (  
<section
  className="relative px-6 md:px-12 lg:px-16 py-10 md:py-14 lg:py-20 overflow-hidden"
  style={{
    background: "linear-gradient(to top right, #FFFFFF, #F6E6FF, #FFFFFF)",
  }}
>
  {/* BG ellipse */}
  <div
    className="pointer-events-none absolute inset-0 bg-no-repeat bg-cover bg-left opacity-50"
    style={{ backgroundImage: "url('https://cdn.cness.io/Ellipse%203373%20(1).webp')" }}
  />

  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
    {/* LEFT: Title + Form */}
    <div className="flex flex-col items-start">
      <h2
        style={{ fontFamily: "Poppins, sans-serif" }}
        className="text-[24px] md:text-[28px] lg:text-[32px] font-medium leading-[120%] tracking-[-0.02em] mb-4 md:mb-6"
      >
        Get In Touch
      </h2>

      {/* Form card */}
      <div className="bg-white rounded-[24px] md:rounded-[30px] shadow-[2px_2px_16px_5px_rgba(0,0,0,0.05)] w-full max-w-[544px] p-5 md:p-7">
        <form className="flex flex-col gap-5 md:gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-[14px] md:text-[16px] text-black">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full h-11 md:h-12 rounded-sm border-2 border-[#EEEEEE] px-4 outline-none focus:border-[#7077FE]"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-[14px] md:text-[16px] text-black">Phone Number</label>
            <div className="flex items-center rounded-sm border-2 border-[#EEEEEE] overflow-hidden">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    className="inline-block h-5 w-5 md:h-6 md:w-6 rounded-full"
                  />
                </span>
                <select
                  value={country.code}
                  onChange={(e) => setCountry(COUNTRIES.find(c => c.code === e.target.value)!)}
                  className="pl-9 pr-7 py-2 md:py-3 bg-white border-r border-[#EEEEEE] outline-none appearance-none text-sm md:text-base"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="flex-1 px-4 py-2 md:py-3 outline-none text-sm md:text-base"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-[14px] md:text-[16px] text-black">Email Address</label>
            <input
              type="email"
              placeholder="Mail ID"
              className="w-full h-11 md:h-12 rounded-sm border-2 border-[#EEEEEE] px-4 outline-none focus:border-[#7077FE]"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="font-inter text-[14px] md:text-[16px] text-black">
              Looking for a Solution? We Can Help
            </label>
            <div className="relative">
              <textarea
                placeholder="Add Notes..."
                className="w-full min-h-[110px] md:min-h-[120px] resize-y rounded-sm border-2 border-[#EEEEEE] bg-[#F5F5F5] px-4 py-4 pr-12"
              />
              <div className="absolute bottom-2 left-2 flex gap-2">
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E0E0E0] bg-white hover:bg-gray-50">
                  <Smile size={18} className="text-gray-600" />
                </button>
                <label
                  htmlFor="file-upload"
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E0E0E0] bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Paperclip size={18} className="text-gray-600" />
                </label>
                <input id="file-upload" type="file" className="hidden" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="gradient-primary"
            type="submit"
            className="
              w-full sm:w-[140px] h-11 md:h-12
              rounded-[81px] text-white text-[14px] md:text-[15px] font-medium
              flex items-center justify-center gap-2
              hover:opacity-90 transition
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B6BFF]
            "
          >
            Submit
            <MousePointer2 className="ml-1 rotate-90 fill-white text-white" size={18} stroke="white" />
          </Button>
        </form>
      </div>
    </div>

    {/* RIGHT: Copy + Contacts */}
<div className="mt-6 md:mt-10 lg:mt-60">
      <h3
        style={{ fontFamily: "Poppins, sans-serif" }}
        className="text-[24px] md:text-[28px] lg:text-[33px] font-medium leading-[115%] tracking-[-0.03em] text-center lg:text-left"
      >
        We’d <span className="text-[#9747FF]">love</span> to hear from you
      </h3>
      <p
        style={{ fontFamily: "Inter, sans-serif" }}
        className="text-[14px] md:text-[16px] leading-[24px] md:leading-[27px] tracking-[-0.02em] text-gray-600 mt-2 text-center lg:text-left"
      >
        Whether you’re a business, a creator, or simply curious about CNESS.<br className="hidden md:block" />
        Reach out and let’s connect.
      </p>

      <div className="mt-6 flex flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:gap-10 justify-center lg:justify-start">
        {/* Call */}
        <div className="flex items-center gap-3">
          <img src={call} alt="Call Icon" className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <p className="text-gray-500">Call Us</p>
            <p
              style={{ fontFamily: "Inter, sans-serif" }}
              className="text-[18px] md:text-[20px] font-semibold leading-[100%] tracking-[-0.03em] mt-1"
            >
              <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">+1</span>{" "}
              456 334 445
            </p>
          </div>
        </div>

        {/* Mail */}
        <div className="flex items-center gap-3">
          <img src={atsymbol} alt="Mail Icon" className="w-8 h-8 md:w-10 md:h-10" />
          <div>
            <p className="text-gray-500">Mail Us</p>
            <p
              style={{ fontFamily: "Inter, sans-serif" }}
              className="text-[18px] md:text-[20px] font-semibold leading-[100%] tracking-[-0.03em] mt-1"
            >
              <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">sales@</span>
              cness.co
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}