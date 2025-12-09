import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { PaymentDetails } from "../Common/ServerAPI";

const Certification: React.FC = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [plansData, setPlansData] = useState<any[]>([]);
  const [processingPlan, setProcessingPlan] = useState<'yearly' | 'monthly' | null>(null); // Changed to track which plan is processing

  useEffect(() => {
    if (location.state?.plans) {
      setPlansData(location.state.plans || []);
      
      if (location.state.assessmentSubmitted) {
        showToast({
          message: "Assessment submitted successfully!",
          type: "success",
          duration: 4000,
        });
      }
    }
  }, [location]);

  // Handle plan selection for payment
  const handlePlanSelection = async (planType: 'yearly' | 'monthly') => {
    try {
      setProcessingPlan(planType); // Set which plan is being processed
      
      // Find the selected plan data
      const selectedPlanData = plansData.find(plan => 
        planType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
      );
      
      if (!selectedPlanData) {
        showToast({
          message: "Plan data not found",
          type: "error",
          duration: 3000,
        });
        setProcessingPlan(null);
        return;
      }

      // Determine which plan (monthly/yearly) to use
      let planToUse;
      if (planType === 'yearly' && selectedPlanData.yearlyPlanData) {
        planToUse = selectedPlanData.yearlyPlanData;
      } else if (planType === 'monthly' && selectedPlanData.monthlyPlanData) {
        planToUse = selectedPlanData.monthlyPlanData;
      } else {
        // Fallback to the plan data structure
        planToUse = selectedPlanData;
      }

      const payload = {
        plan_id: planToUse.id,
        plan_type: planType === 'yearly' ? "Yearly" : "Monthly",
      };

      console.log("Payment payload:", payload);

      const res = await PaymentDetails(payload);
      
      if (res?.data?.data?.url) {
        const url = res.data.data.url;
        console.log("Redirecting to payment:", url);
        window.location.href = url; // Redirect to payment page
      } else {
        console.error("Payment URL not found in response");
        showToast({
          message: "Payment URL not available. Please try again.",
          type: "error",
          duration: 4000,
        });
        setProcessingPlan(null);
      }
    } catch (error: any) {
      console.error("Error in handlePlanSelection:", error);
      showToast({
        message: error?.response?.data?.error?.message || "Payment processing failed. Please try again.",
        type: "error",
        duration: 5000,
      });
      setProcessingPlan(null);
    }
  };

  // Extract plan data
  const getYearlyPlanData = () => {
    return plansData.find(plan => plan.yearlyPrice) || {};
  };

  const getMonthlyPlanData = () => {
    return plansData.find(plan => plan.monthlyPrice) || {};
  };

  const yearlyPlan = getYearlyPlanData();
  const monthlyPlan = getMonthlyPlanData();

  const yearlyPrice = yearlyPlan?.yearlyPrice || "";
  const originalYearlyPrice = yearlyPlan?.originalYearlyPrice || "";
  const monthlyPrice = monthlyPlan?.monthlyPrice || "";

  return (
    <div className="min-h-screen bg-[#F5F6FB] flex flex-col">
      <div className="pt-10 px-6 md:px-10 lg:px-16 w-full max-w-6xl mx-auto">
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
            className="mt-6 inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#7077FE] to-[#F07EFF] px-6 py-2 text-sm font-medium text-white shadow-md hover:brightness-105 transition-colors border-0 font-[Poppins]"
            onClick={() => setSelectedPlan('yearly')}
          >
            Start Your Conscious Journey
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 mb-16">
          {/* Yearly Plan Card */}
          <div 
            className="relative w-full max-w-sm cursor-pointer"
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className={`rounded-[22px] pt-1 pr-1 pl-1 pb-1 ${
              selectedPlan === 'yearly' 
                ? 'bg-linear-to-b from-[#F07EFF] to-[#6745FF]' 
                : 'bg-transparent'
            }`}>
              {selectedPlan === 'yearly' && (
                <div className="flex justify-center">
                  <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-white tracking-[0.12em]">
                    YEARLY
                  </span>
                </div>
              )}
              
              <div className={`relative bg-white rounded-[18px] shadow-[0_18px_45px_rgba(49,45,119,0.18)] px-8 pt-6 pb-6 ${
                selectedPlan !== 'yearly' ? 'border-2 border-[#E5E7EB]' : ''
              }`}>
                {selectedPlan !== 'yearly' && (
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-[#1F2328] tracking-[0.08em]">
                      YEARLY
                    </span>
                  </div>
                )}

                <h2 className="text-[24px] font-light font-[Poppins] text-[#1A1A1A] text-center leading-7 tracking-[-0.24px]">
                  {yearlyPlan?.title || "Premium Membership"}
                </h2>
                <p className="mt-2 text-xs font-[Poppins] text-[#777A8C] text-center leading-relaxed">
                  {yearlyPlan?.description || "This helps us support your experience and gives you access to all premium features."}
                </p>
                <div className="mt-6 text-center space-y-2">
                  <button
                    type="button"
                    className="inline-flex font-[Poppins] items-center justify-center rounded-xl bg-transparent px-3 py-1 text-[12px] tracking-[0.08em] text-[#59636E] border border-[#E0D6FF]"
                  >
                    Starting at
                  </button>

                  <div className="flex items-end justify-center gap-2">
                    <span className="text-4xl font-[Poppins] text-[#59636E] line-through">
                      {originalYearlyPrice}
                    </span>
                    <span className="text-4xl font-semibold font-[Poppins] text-[#1A1A1A]">
                      {yearlyPrice}
                    </span>
                    <span className="text-sm font-[Poppins] text-[#777A8C] mb-1">
                      per user/year
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-6 w-full font-[Poppins] rounded-lg py-2.5 text-sm font-medium shadow-md hover:brightness-105 transition ${
                    selectedPlan === 'yearly'
                      ? 'bg-[#6340FF] text-white'
                      : 'bg-white border-2 border-[#CBD5E1] text-[#8157FF]'
                  }`}
                  onClick={() => handlePlanSelection('yearly')}
                  disabled={processingPlan !== null} // Disable both buttons when any is processing
                >
                  {processingPlan === 'yearly' ? "Processing..." : (yearlyPlan?.buttonText || "Buy Now")}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-4 text-xs text-[#4C4F64] font-[Poppins]">
                  {(yearlyPlan?.features && yearlyPlan.features.length > 0) ? (
                    yearlyPlan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Full access to directory</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Marketplace</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Best practice hub</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Social media</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Monthly Plan Card */}
          <div 
            className="relative w-full max-w-sm cursor-pointer"
            onClick={() => setSelectedPlan('monthly')}
          > 
            <div className={`rounded-[22px] pt-1 pr-1 pl-1 pb-1 ${
              selectedPlan === 'monthly' 
                ? 'bg-linear-to-b from-[#F07EFF] to-[#6745FF]' 
                : 'bg-transparent'
            }`}>
              {selectedPlan === 'monthly' && (
                <div className="flex justify-center">
                  <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-white tracking-[0.12em]">
                    MONTHLY
                  </span>
                </div>
              )}
              <div className={`relative bg-white rounded-[18px] shadow-[0_10px_30px_rgba(15,23,42,0.08)] px-8 pt-6 pb-6 ${
                selectedPlan !== 'monthly' ? 'border-2 border-[#E5E7EB]' : ''
              }`}>
                {selectedPlan !== 'monthly' && (
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-1 font-[Poppins] text-[16px] font-medium text-[#1F2328] tracking-[0.08em]">
                      MONTHLY
                    </span>
                  </div>
                )}
                <h2 className="text-[24px] font-light font-[Poppins] text-[#1A1A1A] text-center leading-7 tracking-[-0.24px]">
                  {monthlyPlan?.title || "Premium Membership"}
                </h2>
                <p className="mt-2 text-xs text-[#777A8C] text-center leading-relaxed font-[Poppins]">
                  {monthlyPlan?.description || "This helps us support your experience and gives you access to all premium features."}
                </p>

                {/* Price block */}
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="inline-flex font-[Poppins] items-center justify-center rounded-xl bg-transparent px-3 py-1 text-[12px] tracking-[0.08em] text-[#59636E] border border-[#E0D6FF]"
                  >
                    Starting at
                  </button>

                  <div className="flex pt-2 items-end justify-center gap-2">
                    <span className="text-4xl font-[Poppins] font-semibold text-[#1A1A1A]">
                      {monthlyPrice}
                    </span>
                    <span className="text-sm text-[#777A8C] mb-1 block">
                      per user/month
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`mt-6 w-full font-[Poppins] rounded-lg py-2.5 text-sm font-medium shadow-md hover:brightness-105 transition ${
                    selectedPlan === 'monthly'
                      ? 'bg-[#6340FF] text-white'
                      : 'bg-white border-2 border-[#CBD5E1] text-[#8157FF]'
                  }`}
                  onClick={() => handlePlanSelection('monthly')}
                  disabled={processingPlan !== null} // Disable both buttons when any is processing
                >
                  {processingPlan === 'monthly' ? "Processing..." : (monthlyPlan?.buttonText || "Buy Now")}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-4 text-xs text-[#4C4F64] font-[Poppins]">
                  {(monthlyPlan?.features && monthlyPlan.features.length > 0) ? (
                    monthlyPlan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Full access to directory</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Marketplace</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Best practice hub</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MdOutlineKeyboardArrowRight className="text-[#59636E] text-base shrink-0" />
                        <span>Social media</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto bg-white border-t border-[#E5E7EB] py-8 px-6 md:px-10 lg:px-16">
        {/* Your existing dashboard footer / quick links here */}
      </div>
    </div>
  );
};

export default Certification;