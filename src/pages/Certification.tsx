import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Certification: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <div className="min-h-screen bg-[#F5F6FB] flex flex-col">
      {/* Top spacing to match dashboard header height */}
      <div className="pt-10 px-6 md:px-10 lg:px-16 w-full max-w-6xl mx-auto">
        {/* Heading + CTA */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-[28px] md:text-[32px] font-semibold text-[#1A1A1A] mb-3 font-[Poppins]">
            Get Your Aspiring Certification Today
          </h1>
          <p className="text-sm md:text-[13px] text-[#777A8C] leading-relaxed font-[Poppins]">
            Begin your conscious growth journey with a certification that acknowledges your intentions,
            strengthens your practices, and guides you toward deeper personal development.
          </p>

            <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] px-6 py-2 text-sm font-medium text-white hover:brightness-105 transition-colors border-0 font-[Poppins]"
            >
            Start Your Conscious Journey
            </button>

        </div>

        {/* Pricing cards container */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 mb-16">
          {/* Yearly / Premium Membership (highlighted) */}
          <div 
            className="relative w-full max-w-sm cursor-pointer"
            onClick={() => setSelectedPlan('yearly')}
          >
        {/* Outer gradient border like Figma */}
        <div className={`rounded-[22px]   pt-1 pr-1 pl-1 pb-1 ${
          selectedPlan === 'yearly' 
            ? 'bg-gradient-to-b from-[#F07EFF] to-[#6745FF]' 
            : 'bg-transparent'
        }`}>
            {selectedPlan === 'yearly' && (
            <div className="flex justify-center">
              <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-white tracking-[0.12em]">
                YEARLY
              </span>
            </div>
          )}
    
    {/* Inner white card */}
    <div className={`relative bg-white rounded-[18px] shadow-[0_18px_45px_rgba(49,45,119,0.18)] px-8 pt-6 pb-0 ${
      selectedPlan !== 'yearly' ? 'border-2 border-[#E5E7EB]' : ''
    }`}>
      {/* Badge */}
        {selectedPlan !== 'yearly' && (
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-[#1F2328] tracking-[0.08em]">
            YEARLY
          </span>
        </div>
      )}

      <h2 className="text-[24px] font-light font-[Poppins] text-[#1A1A1A] text-center leading-[28px] tracking-[-0.24px]">
        Membership
      </h2>
      <p className="mt-2 text-xs font-[Poppins] text-[#777A8C] text-center leading-relaxed">
        This helps us support your experience and gives you access to all premium features.
      </p>

      {/* Price block */}
      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          className="inline-flex  font-[Poppins] items-center justify-center rounded-[12px] bg-transparent px-3 py-1 text-[12px] tracking-[0.08em] text-[#59636E] border border-[#E0D6FF]"
        >
          Starting at
        </button>

        <div className="flex items-end justify-center gap-2">
          <span className="text-4xl font-[Poppins] text-[#59636E] line-through">
            $108
          </span>
          <span className="text-4xl font-semibold font-[Poppins] text-[#1A1A1A]">
            $99
          </span>
          <span className="text-sm font-[Poppins] text-[#777A8C] mb-1">
            per user
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`mt-6 w-full font-[Poppins] rounded-[8px] py-2.5 text-sm font-medium shadow-md hover:brightness-105 transition ${
          selectedPlan === 'yearly'
            ? 'bg-[#6340FF] text-white'
            : 'bg-white border-2 border-[#CBD5E1] text-[#8157FF]'
        }`}
      >
        Buy Now
      </button>

      {/* Yearly Features */}
      <div className="mt-6 -mx-8 bg-[#F6F8FA] rounded-b-[18px] px-8 py-6">
        <ul className="space-y-4 text-xs text-[#4C4F64] font-[Poppins]">
          <li className="flex items-start gap-2">
            <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
            <span>Full access to directory</span>
          </li>
          <li className="flex items-start gap-2">
            <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
            <span>Marketplace</span>
          </li>
          <li className="flex items-start gap-2">
            <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
            <span>Best practice hub</span>
          </li>
          <li className="flex items-start gap-2">
            <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
            <span>Social media</span>
          </li>
        </ul>
      </div>


    </div>
  </div>
</div>


          {/* Monthly / Premium Membership */}
          <div 
            className="relative w-full max-w-sm cursor-pointer"
            onClick={() => setSelectedPlan('monthly')}
          >
          {/* Outer gradient border like Figma */} 
          <div className={`rounded-[22px]  pt-1 pr-1 pl-1 pb-1 ${
            selectedPlan === 'monthly' 
              ? 'bg-gradient-to-b from-[#F07EFF] to-[#6745FF]' 
              : 'bg-transparent'
          }`}>
          
              {selectedPlan === 'monthly' && (
      <div className="flex justify-center">
        <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-white tracking-[0.12em]">
          MONTHLY
        </span>
      </div>
    )}


          {/* Inner white card */}

          <div className={`relative bg-white rounded-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 pt-6 pb-0 ${
            selectedPlan !== 'monthly' ? 'border-2 border-[#E5E7EB]' : ''
          }`}>
            {/* Badge */}
            {selectedPlan !== 'monthly' && (
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-[#1F2328] tracking-[0.08em]">
            MONTHLY
          </span>
        </div>
      )}
            <h2 className="text-[24px] font-light font-[Poppins] text-[#1A1A1A] text-center leading-[28px] tracking-[-0.24px]">
              Membership
            </h2>
            <p className="mt-2 text-xs text-[#777A8C] text-center leading-relaxed font-[Poppins]">
              This helps us support your experience and gives you access to all premium features.
            </p>

            {/* Price block */}
            <div className="mt-6 text-center">
              <button
                    type="button"
                    className="inline-flex  font-[Poppins] items-center justify-center rounded-[12px] bg-transparent px-3 py-1 text-[12px] tracking-[0.08em] text-[#59636E] border border-[#E0D6FF]"
                    >
                    Starting at
                    </button>

              <div className="flex pt-2 items-end justify-center gap-2">
                <span className="text-4xl font-[Poppins] font-semibold text-[#1A1A1A]">
                  $9
                </span>
                <span className="text-sm text-[#777A8C] mb-1 block">
                  per user
                </span>
              </div>
            </div>

            <button
              type="button"
              className={`mt-6 w-full font-[Poppins] rounded-[8px] py-2.5 text-sm font-medium hover:brightness-105 transition ${
                selectedPlan === 'monthly'
                  ? 'bg-[#6340FF] text-white'
                  : 'bg-white border-2 border-[#CBD5E1] text-[#8157FF]'
              }`}
            >
              Buy Now
            </button>

            {/* Monthly Features */}
          <div className="mt-6 -mx-8 bg-[#F6F8FA] rounded-b-[18px] px-8 py-6">
            <ul className="space-y-4 text-xs text-[#4C4F64] font-[Poppins]">
              <li className="flex items-start gap-2">
                <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
                <span>Full access to directory</span>
              </li>
              <li className="flex items-start gap-2">
                <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
                <span>Marketplace</span>
              </li>
              <li className="flex items-start gap-2">
                <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
                <span>Best practice hub</span>
              </li>
              <li className="flex items-start gap-2">
                <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base flex-shrink-0" />
                <span>Social media</span>
              </li>
            </ul>
          </div>

          </div>
          </div>
          </div>
        </div>
      </div>

      {/* Footer placeholder (matches white strip at bottom in design) */}
      <div className="mt-auto bg-white border-t border-[#E5E7EB] py-8 px-6 md:px-10 lg:px-16">
        {/* Put your existing dashboard footer / quick links here */}
      </div>
    </div>
  );
};

export default Certification;
