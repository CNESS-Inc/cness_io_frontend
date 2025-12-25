import { Check } from "lucide-react";
import libicon from "../../../../assets/libicon.svg";
import Testimonialsection from "../components/Testimonial";
import Footer from "../components/Footer";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* SUCCESS SECTION */}
      <div className="flex justify-center px-4 pt-16 sm:pt-20 lg:pt-34 mb-16 sm:mb-20 lg:mb-24">
        <div className="bg-white w-full max-w-[720px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 text-center">

          {/* Icon */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#5CB85C] flex items-center justify-center">
                <Check className="text-white" size={22} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-[poppins] font-semibold text-black mb-1 sm:mb-2">
            Payment successful!
          </h1>

          {/* Subtitle */}
          <p className="text-2xl sm:text-3xl lg:text-[40px] font-[poppins] font-semibold text-black mb-2">
            You’re all set. Enjoy
          </p>

          {/* Description */}
          <p className="text-sm sm:text-[14px] font-['open_sans'] text-[#665B5B] mb-8 sm:mb-10 max-w-[560px] mx-auto">
            Thank you for your purchase. Your digital product is now available in
            your library ready to watch anytime.
          </p>

          {/* CTA Button */}
          <button
            className="
              inline-flex items-center gap-2
              bg-[#7077FE] hover:bg-[#4F46E5]
              text-white text-sm sm:text-base font-medium
              px-5 sm:px-6 py-2.5 sm:py-3
              rounded-lg
              transition
            "
          >
            <img src={libicon} alt="Library Icon" className="w-4 h-4" />
            View in library
          </button>

        </div>
      </div>

      {/* TESTIMONIAL */}
      <Testimonialsection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
