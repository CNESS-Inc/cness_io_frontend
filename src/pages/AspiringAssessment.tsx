import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  MeDetails,
  PaymentDetails,
  GetAspiringQuestionDetails,
  submitPersonReadinessDetails,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Modal from "../components/ui/Modal";

const AspiringAssessment = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selected, setSelected] = useState<string[]>([]);
  const [readlineQuestion, setReadlineQuestion] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const [activeModal, setActiveModal] = useState<"price" | null>(null);
  const [personPricing, setPersonPricing] = useState<any[]>([]);
  const [isAnnual, setIsAnnual] = useState(true);

  const handleToggle = (optionId: string) => {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAspiringQuestionDetails();
      const res = response?.data?.data || []
      setReadlineQuestion(res?.questions || []);
      if (res?.questions?.length == 1) {
        if (res?.aspiring_ans_completed == true) {
          setIsAnswered(false);
          setSelected(res?.selectedId || []);
        }
      }

    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to fetch questions",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchAllDataDetails();
  }, []);

  // Extract first question and options
  const currentQuestion = readlineQuestion?.[0];
  const questionText = currentQuestion?.question || "Loading question...";
  const options = currentQuestion?.options || [];

  const handleSubmit = async () => {
    // ✅ Condition 1: No option selected
    if (selected.length === 0) {
      showToast({
        message: "Please select at least one option before submitting.",
        type: "warning",
        duration: 4000,
      });
      return;
    }

    // ✅ Condition 2: Must select at least 5 options
    if (selected.length < 5) {
      showToast({
        message:
          "You must select at least 5 options to unlock your Conscious Aspired Badge.",
        type: "warning",
        duration: 5000,
      });
      return;
    }

    // ✅ Construct payload
    const payload = {
      question: [
        {
          question_id: currentQuestion?.id,
          answer: selected, // selected already contains option IDs
        },
      ],
    };

    console.log("Submitting payload:", payload);

    try {
      setIsSubmitting(true);
      const res = await submitPersonReadinessDetails(payload);

      if (res?.success) {
        setActiveModal("price");

        const plansByRange: Record<string, any> = {};
        res?.data?.data?.plan.forEach((plan: any) => {
          if (!plansByRange[plan.plan_range]) {
            plansByRange[plan.plan_range] = {};
          }
          plansByRange[plan.plan_range][plan.plan_type] = plan;
        });

        const response = await MeDetails();
        localStorage.setItem(
          "profile_picture",
          response?.data?.data?.user.profile_picture
        );
        localStorage.setItem("name", response?.data?.data?.user.name);
        localStorage.setItem("main_name", response?.data?.data?.user.main_name);
        localStorage.setItem(
          "margaret_name",
          response?.data?.data?.user.margaret_name
        );

        // Create combined plan objects with both monthly and yearly data
        const updatedPlans = Object.values(plansByRange)?.map(
          (planGroup: any) => {
            const monthlyPlan = planGroup.monthly;
            const yearlyPlan = planGroup.yearly;

            return {
              id: monthlyPlan?.id || yearlyPlan?.id,
              title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
              description: "Customized pricing based on your selection",
              monthlyPrice: monthlyPlan ? `$${monthlyPlan.amount}` : undefined,
              yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
              period: isAnnual ? "/year" : "/month",
              billingNote: yearlyPlan
                ? isAnnual
                  ? `Billed ${isAnnual?`annually`:`monthly`} ($${yearlyPlan.amount})`
                  : `or $${monthlyPlan?.amount}/month`
                : undefined,
              features: [], // Add any features you need here
              buttonText: "Get Started",
              buttonClass: yearlyPlan
                ? ""
                : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
              popular: !!yearlyPlan,
            };
          }
        );

        setPersonPricing(updatedPlans);
        localStorage.setItem("is_disqualify", "fasle");
        // showToast({
        //   message: "Assessment submitted successfully!",
        //   type: "success",
        //   duration: 4000,
        // });
        // navigate("/dashboard/assesmentcertification");
      } else {
        showToast({
          message: res?.data?.message || "Failed to submit assessment.",
          type: "error",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Error submitting assessment:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Something went wrong while submitting.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelection = async (plan: any) => {
    try {
      const payload = {
        plan_id: plan.id,
        plan_type: isAnnual ? "Yearly" : "Monthly",
      };

      const res = await PaymentDetails(payload);
      if (res?.data?.data?.url) {
        const url = res.data.data.url;
        console.log("Redirecting to:", url); // Log the actual URL
        window.location.href = url; // Redirect in the same tab
      } else {
        console.error("URL not found in response");
      }
    } catch (error: any) {
      console.error("Error in handlePlanSelection:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const closeModal = async () => {
    setActiveModal(null);
  };

  const getBillingNote = (plan: any) => {
    if (!plan.yearlyPrice || !plan.monthlyPrice) return undefined;

    if (isAnnual) {
      // For annual billing: show "billed annually (yearly price)"
      return `billed annually ($${plan.yearlyPrice.replace("$", "") * 12})`;
    } else {
      return `or ${plan.monthlyPrice}/month`;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 mb-8 px-6 md:px-16 mt-8">
        <img
          src="https://cdn.cness.io/aspiringlogo.svg"
          alt="Aspiring Certification"
          className="w-12 h-12 sm:w-14 sm:h-14"
        />
        <h3 className="font-poppins font-medium text-[22px] sm:text-[24px] leading-[115%] text-gray-900">
          Aspiring Certification
        </h3>
      </div>

      {/* Assessment Section */}
      <section className="bg-white rounded-2xl py-10 sm:py-16 px-4 sm:px-8 md:px-16 border border-gray-100 shadow-sm">
        {/* Heading */}
        <div className="flex items-center mb-6">
          <h3 className="font-poppins font-medium text-[15px] sm:text-[16px] leading-snug text-gray-900">
            {questionText}
          </h3>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Checkboxes */}
        <ul className="space-y-4 sm:space-y-3">
          {options.map((opt: any, index: number) => (
            <li
              key={opt.id || index}
              className="relative flex items-start gap-3 sm:gap-4 pl-1"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  id={`option-${index}`}
                  disabled={isAnswered}
                  checked={selected.includes(opt.id)}
                  onChange={() => handleToggle(opt.id)}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer appearance-none border border-gray-400 rounded-sm checked:bg-[#22C55E] relative"
                />
                {selected.includes(opt.id) && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      viewBox="0 0 25 25"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <label
                htmlFor={`option-${index}`}
                className="font-openSans text-[14px] sm:text-[16px] leading-[160%] text-gray-800 cursor-pointer"
              >
                {opt.option}
              </label>
            </li>
          ))}
        </ul>

        {/* Selected count */}
        <p className="mt-6 text-xs sm:text-sm text-gray-500">
          Selected: {selected.length} / {options.length}
        </p>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 px-4 sm:px-8 md:px-16">
        <Button
          onClick={() => navigate("/dashboard/assesmentcertification")}
          variant="white-outline"
          className="font-plusJakarta text-[14px] sm:text-[15px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
            hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
            shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
          type="button"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant="gradient-primary"
          className="font-openSans text-[14px] sm:text-[15px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
          type="button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
        {/* <Button
          onClick={handleSubmit}
          variant="gradient-primary"
          className="font-openSans text-[14px] sm:text-[15px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
          type="button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button> */}
      </div>

      <Modal isOpen={activeModal === "price"} onClose={closeModal}>
        <div className="p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Pricing Plan
          </h2>

          <div className="flex justify-center">
            {personPricing.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg p-4 hover:shadow-md transition-shadow ${plan.borderClass} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
                    Popular
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 mt-2">
                  {plan.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    {isAnnual
                      ? plan.yearlyPrice || plan.monthlyPrice
                      : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {getBillingNote(plan) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getBillingNote(plan)}
                    </p>
                  )}
                </div>
                <Button
                  variant="gradient-primary"
                  className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                  onClick={() => handlePlanSelection(plan)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-3 text-sm font-medium text-gray-700">
                Monthly billing
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnnual}
                  onChange={() => setIsAnnual(!isAnnual)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Annual billing
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AspiringAssessment;
