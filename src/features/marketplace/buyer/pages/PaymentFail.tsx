import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";
import Testimonialsection from "../components/Testimonial";
import Footer from "../components/Footer";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* MAIN CONTENT */}
      <div className="flex flex-1 items-start justify-center px-4 pt-16 sm:pt-20 lg:pt-34 mb-16 sm:mb-20 lg:mb-24">
        <div className="w-full max-w-[720px] text-center">

          {/* Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-[#FFEFD5] flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFB84D] flex items-center justify-center">
                <AlertTriangle className="text-white" size={22} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-[poppins] font-semibold text-black mb-2">
            Try Again Please
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-[14px] font-['open_sans'] text-[#6B7280] mb-6 sm:mb-8">
            Something went wrong, give it another try.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            
            {/* Go Back */}
            <button
              className="
                inline-flex items-center justify-center gap-2
                w-full sm:w-auto
                px-5 py-2.5
                text-sm font-medium
                text-[#7077FE]
                border border-[#7077FE]
                rounded-lg
                hover:bg-[#F1F3FF]
                transition
              "
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            {/* Retry */}
            <button
              className="
                inline-flex items-center justify-center gap-2
                w-full sm:w-auto
                px-5 py-2.5
                text-sm font-medium
                text-white
                bg-[#7077FE]
                hover:bg-[#4F46E5]
                rounded-lg
                transition
              "
            >
              <RotateCcw size={16} />
              Retry
            </button>

          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      <Testimonialsection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
