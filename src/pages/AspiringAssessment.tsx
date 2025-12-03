import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  MeDetails,
  GetAspiringQuestionDetails,
  submitPersonReadinessDetails,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const AspiringAssessment = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selected, setSelected] = useState<string[]>([]);
  const [readlineQuestion, setReadlineQuestion] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  // const [plansData, setPlansData] = useState<any[]>([]);
  const [isAnnual] = useState(true);

  const handleToggle = (optionId: string) => {
    setSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Select All functionality
  const handleSelectAll = () => {
    const allOptionIds = options.map((opt: any) => opt.id);
    if (selected.length === allOptionIds.length) {
      // If all are already selected, deselect all
      setSelected([]);
    } else {
      // Otherwise select all
      setSelected(allOptionIds);
    }
  };

  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAspiringQuestionDetails();
      const res = response?.data?.data || [];
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

  // Check if all options are selected (for Select All checkbox state)
  const allSelected = selected.length === options.length && options.length > 0;

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

        localStorage.setItem("is_disqualify", "fasle");

        const updatedPlans = Object.values(plansByRange)?.map(
          (planGroup: any) => {
            const monthlyPlan = planGroup.monthly;
            const yearlyPlan = planGroup.yearly;

            return {
              id: monthlyPlan?.id || yearlyPlan?.id,
              title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
              description:
                "This helps us support your experience and gives you access to all premium features.",
              monthlyPrice: monthlyPlan ? `$${monthlyPlan.amount}` : undefined,
              yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
              period: isAnnual ? "/year" : "/month",
              billingNote: yearlyPlan
                ? isAnnual
                  ? `Billed ${isAnnual ? `annually` : `monthly`} ($${
                      yearlyPlan.amount
                    })`
                  : `or $${monthlyPlan?.amount}/month`
                : undefined,
              features: [],
              buttonText: "Pay Now",
              buttonClass: yearlyPlan
                ? ""
                : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
              popular: !!yearlyPlan,
              monthlyPlanData: monthlyPlan, // Keep original data if needed
              yearlyPlanData: yearlyPlan, // Keep original data if needed
            };
          }
        );

        // setPlansData(updatedPlans);
        localStorage.setItem("is_disqualify", "false");

        showToast({
          message: "Assessment submitted successfully!",
          type: "success",
          duration: 4000,
        });

        // Redirect to Certification page with plans data
        navigate("/dashboard/Certification", {
          state: {
            plans: updatedPlans,
            isAnnual: isAnnual,
            assessmentSubmitted: true,
          },
        });
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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 mb-8 px-2 md:px-2 mt-8">
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
          <h3 className="font-poppins font-medium text-[15px] sm:text-[16px] leading-snug text-[gray-900]">
            {questionText}
          </h3>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Select All Checkbox */}
        <div className="pb-4">
          <div className="relative flex items-start gap-3 sm:gap-4 pl-1">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                id="select-all"
                disabled={isAnswered}
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer appearance-none border border-gray-400 rounded-sm 
                checked:bg-size-[100%_100%] relative custom-checkbox"
              />
              {allSelected && (
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
              htmlFor="select-all"
              className="font-['Open_Sans'] text-[14px] sm:text-[16px] leading-[160%] text-[#1E1E1E] cursor-pointer font-semibold"
            >
              Select All Options
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <ul className="space-y-4 sm:space-y-4">
          {options.map((opt: any, index: number) => (
            <li
              key={opt.id || index}
              className="relative flex items-start gap-3 sm:gap-4 pl-1"
            >
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  id={`option-${index}`}
                  disabled={isAnswered}
                  checked={selected.includes(opt.id)}
                  onChange={() => handleToggle(opt.id)}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer appearance-none border border-gray-400 rounded-sm 
                  checked:bg-size-[100%_100%] relative custom-checkbox"
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
                className="font-['Open_Sans'] text-[14px] sm:text-[16px] leading-[160%] text-[#1E1E1E] cursor-pointer"
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
            hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
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
      </div>
    </>
  );
};

export default AspiringAssessment;
