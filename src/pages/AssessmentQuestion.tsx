import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import {
  GetAllPlanDetails,
  PaymentDetails,
  QuestionDetails,
  QuestionFileDetails,
  QuestionFinalSubmission,
  submitAnswerDetails,
} from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { EyeIcon } from "lucide-react";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast/ToastProvider";
import missionicon from "../assets/missionicon.svg";
import { Check } from "lucide-react";

interface Section {
  id: string;
  name: string;
  order_number: number;
  checkboxes: Array<{
    id: string;
    option: string;
  }>;
  checkboxes_question: string;
  checkboxes_question_id: string;
  checkboxAnswers: string[];
  purposePauseQuestions: Array<{
    question: string;
    id: string;
    answer?: string;
  }>;
  bestPracticePrompt: string;
  bestPracticeQuestionId: string;
  bestPracticeAnswer?: string;
  showBestPracticeInPublic: boolean; // Add this
  suggestedUploads: Array<{
    label: string;
    acceptedTypes: string;
    id: string;
    fileUrl?: string | null;
  }>;
  referenceLinkQuestionId: string;
  referenceLinkAnswer: string;
  next_section_id: string | null;
  previous_section_id: string | null;
}

interface FormValues {
  selectedCheckboxIds: string[];
  checkboxes_question_id: string;
  purposePauseAnswers: Array<{
    id: string;
    answer: string;
  }>;
  bestPractice: {
    answer: string;
    question_id: string;
    showInPublic: boolean; // Add this
  };
  uploads: Array<{
    file: File | null;
    id: string;
    fileUrl?: string | null;
  }>;
  referenceLink: {
    url: string;
    question_id: string;
  };
}


const AssessmentQuestion: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [_toggles, setToggles] = useState<boolean[]>([]);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [_progress, setprogress] = useState(0);
  const [totalstep, settotalstep] = useState(0);
  const [_sectionHistory, setSectionHistory] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<
    "assesment" | "PricingModal" | null
  >(null);
  console.log("🚀 ~ activeModal:", activeModal);
  const [personPricing, setPersonPricing] = useState<any[]>([]);
  console.log("🚀 ~ AssessmentQuestion ~ personPricing:", personPricing)
  const [isAnnual, setIsAnnual] = useState(true);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();
  const completed_step = localStorage.getItem("completed_step");
  const [urlError, setUrlError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<Record<string, { loading: boolean, error: boolean }>>({});

  // const [errors, setErrors] = useState<FormErrors>({});

  // interface FormErrors {
  //   referenceLink?: string;
  // }

  const openPricingModal = async () => {
    try {
      setActiveModal("PricingModal");
      const res = await GetAllPlanDetails();
      const plansByRange: Record<string, any> = {};
      res?.data?.data?.forEach((plan: any) => {
        if (!plansByRange[plan.plan_range]) {
          plansByRange[plan.plan_range] = {};
        }
        plansByRange[plan.plan_range][plan.plan_type] = plan;
      });
      // Create combined plan objects with both monthly and yearly data
      const updatedPlans = Object.values(plansByRange).map((planGroup: any) => {
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
              ? `billed annually ($${yearlyPlan.amount})`
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
      });

      setPersonPricing(updatedPlans);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };
  const handleFinalSubmit = async () => {
    setIsFinalSubmitting(true);
    try {
      const res = await QuestionFinalSubmission();
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
      setIsFinalSubmitting(false);
      setActiveModal(null);
      await fetchQuestions()
    } catch (error: any) {
      console.log("🚀 ~ handleFinalSubmit ~ error:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
      setIsFinalSubmitting(false);
    }
  };

  const transformApiData = (apiData: any): Section => {
    let checkboxesData: any = null;
    let purposePauseData: any = null;
    let bestPracticeData: any = null;
    let suggestedUploadsData: any = null;
    let referenceLinkData: any = null;

    apiData.question_data.forEach((section: any) => {
      if (section.sub_section.name === "Select all that apply") {
        checkboxesData = section;
      } else if (section.sub_section.name === "Purpose Pause") {
        purposePauseData = section;
      } else if (section.sub_section.name === "Best Practice") {
        bestPracticeData = section;
      } else if (section.sub_section.name === "Suggested Uploads") {
        suggestedUploadsData = section;
      } else if (section.sub_section.name === "Link for Reference") {
        referenceLinkData = section;
      }
    });

    return {
      id: apiData.section.id,
      name: apiData.section.name,
      order_number: apiData.section.order_number,
      checkboxes: checkboxesData?.questions[0]?.options || [],
      checkboxes_question: checkboxesData?.questions[0]?.question || "",
      checkboxes_question_id: checkboxesData?.questions[0]?.id || "",
      checkboxAnswers: checkboxesData?.questions[0]?.answer || [],
      purposePauseQuestions:
        purposePauseData?.questions?.map((q: any) => ({
          question: q.question,
          id: q.id,
          answer: q.answer || "",
          showInPublic: q.show_question_in_public || false,
        })) || [],
      bestPracticePrompt: bestPracticeData?.questions[0]?.question || "",
      bestPracticeQuestionId: bestPracticeData?.questions[0]?.id || "",
      bestPracticeAnswer: bestPracticeData?.questions[0]?.answer || "",
      showBestPracticeInPublic:
        bestPracticeData?.questions[0]?.show_question_in_public || false,
      suggestedUploads:
        suggestedUploadsData?.questions?.map((q: any) => ({
          label: q.question,
          id: q.id,
          acceptedTypes: q.question.includes("screenshot")
            ? ".jpg,.png,.jpeg"
            : ".pdf,.doc,.docx,.jpg,.png,.jpeg",
          fileUrl: q.answer || null,
          showInPublic: q.show_question_in_public || false,
        })) || [],
      referenceLinkQuestionId: referenceLinkData?.questions[0]?.id || "",
      referenceLinkAnswer: referenceLinkData?.questions[0]?.answer || "",
      next_section_id: apiData.next_section_id,
      previous_section_id: apiData.previous_section_id,
    };
  };

  const initializeFormData = (section: Section): FormValues => {
    return {
      selectedCheckboxIds: section.checkboxAnswers || [],
      checkboxes_question_id: section.checkboxes_question_id,
      purposePauseAnswers: section.purposePauseQuestions.map((question) => ({
        id: question.id,
        answer: question.answer || "",
      })),
      bestPractice: {
        answer: section.bestPracticeAnswer || "",
        question_id: section.bestPracticeQuestionId,
        showInPublic: section.showBestPracticeInPublic,
      },
      uploads: section.suggestedUploads.map((upload) => ({
        file: null,
        id: upload.id,
        fileUrl: upload.fileUrl || null,
      })),
      referenceLink: {
        url: section.referenceLinkAnswer || "",
        question_id: section.referenceLinkQuestionId,
      },
    };
  };

  const fetchQuestions = async (sectionId?: string) => {
    try {
      setLoading(true);
      const res = await QuestionDetails(sectionId);
      const transformedSection = transformApiData(res.data.data);
      const initialFormData = initializeFormData(transformedSection);

      setCurrentSection(transformedSection);
      setFormData(initialFormData);
      setToggles([false]); // Initialize toggle for this section
      setprogress(res.data.data.assesment_progress);
      settotalstep(res.data.data.total_sections);
      setIsSubmitted(res.data.data.find_answer_submited);
      // Update navigation history
      if (sectionId) {
        setSectionHistory((prev) => [...prev, sectionId]);
      } else {
        setSectionHistory([transformedSection.id]);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (completed_step === "2") {
      fetchQuestions();
    }
  }, []);
  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        bestPractice: {
          ...prev.bestPractice,
          showInPublic: checked,
        },
      };
    });
  };

  const handleCheckboxChange = (optionId: string, isChecked: boolean) => {
    setFormData((prev) => {
      if (!prev) return null;

      const newData = { ...prev };

      if (isChecked) {
        // Add the ID if it's not already present
        if (!newData.selectedCheckboxIds.includes(optionId)) {
          newData.selectedCheckboxIds = [
            ...newData.selectedCheckboxIds,
            optionId,
          ];
        }
      } else {
        // Remove the ID if it's present
        newData.selectedCheckboxIds = newData.selectedCheckboxIds.filter(
          (id) => id !== optionId
        );
      }

      return newData;
    });
  };

  const handlePurposePauseChange = (questionIndex: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newData = { ...prev };
      // Keep the existing ID and update just the answer
      newData.purposePauseAnswers[questionIndex] = {
        ...newData.purposePauseAnswers[questionIndex],
        answer: value,
      };
      return newData;
    });
  };

  const handleBestPracticeChange = (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        bestPractice: {
          ...prev.bestPractice,
          answer: value,
        },
      };
    });
  };

  const handleFileUpload = async (uploadIndex: number, file: File | null) => {
    if (!currentSection) return;

    // Get the upload details before updating the state
    const upload = currentSection.suggestedUploads[uploadIndex];

    const uploadId = `file-${uploadIndex}`;
    setUploadProgress((prev) => ({
      ...prev,
      [uploadId]: { loading: true, error: false }
    }));

    try {
      setFormData((prev) => {
        if (!prev) return null;
        const newData = { ...prev };
        // Create an object to store both the file and the upload id
        newData.uploads[uploadIndex] = {
          file: file,
          id: upload.id,
          fileUrl: null
        };
        return newData;
      });

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("question_id", upload.id);

        const response = await QuestionFileDetails(formData);

        if (response?.success) {
          setFormData((prev) => {
            if (!prev) return null;
            const newData = { ...prev };
            newData.uploads[uploadIndex] = {
              file: file,
              id: upload.id,
              fileUrl: response.data?.file_url || URL.createObjectURL(file)
            };
            return newData;
          });

          showToast({
            message: response?.success?.message || "File uploaded successfully",
            type: "success",
            duration: 5000,
          });
        }
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);

      setFormData((prev) => {
        if (!prev) return null;
        const newData = { ...prev };
        newData.uploads[uploadIndex] = {
          file: null,
          id: upload.id,
          fileUrl: null
        };
        return newData;
      });

      showToast({
        message: error?.response?.data?.error?.message || "Failed to upload file. Please try again.",
        type: "error",
        duration: 5000,
      });
    } finally {
      // Always clear upload status
      setUploadProgress((prev) => ({
        ...prev,
        [uploadId]: { loading: false, error: false }
      }));
    }
  }

  const handleReferenceLinkChange = (value: string) => {
    const urlPattern =
      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

    if (value && !urlPattern.test(value)) {
      setUrlError("Enter a valid URL");
    } else {
      setUrlError("");
    }

    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        referenceLink: {
          ...prev.referenceLink,
          url: value,
        },
      };
    });
  };

  const validateForm = (): boolean => {
    if (!formData) return false;
    if (formData.selectedCheckboxIds.length === 0) {
      showToast({
        message: "Please select at least one option",
        type: "error",
        duration: 5000,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(formData, 'ud - form data')
      const res = await submitAnswerDetails(formData);
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
      setIsSubmitting(false);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    // Only call handleSave if the form is not submitted
    if (!isSubmitted) {
      await handleSave();
    }

    if (currentSection?.next_section_id) {
      fetchQuestions(currentSection.next_section_id);
    }
  };

  const handlePrevious = () => {
    if (currentSection?.previous_section_id) {
      fetchQuestions(currentSection.previous_section_id);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentSection || !formData) {
    const handlePlanSelection = async (plan: any) => {
      try {
        const payload = {
          plan_id: plan.id,
          plan_type: isAnnual ? "Yearly" : "Monthly",
        };

        const res = await PaymentDetails(payload);

        if (res?.data?.data?.url) {
          const url = res.data.data.url;
          window.location.href = url; // Redirect in the same tab
        } else {
          console.error("URL not found in response");
        }
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message,
          type: "error",
          duration: 5000,
        });
      }
    };
    return (
      <>
        <div className="mx-5 bg-[rgba(255,204,0,0.05)] text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">💡</span>
            <span>
              To start the certification journey into our platform, please
              complete the payment here.{" "}
              <a
                href="#"
                className="text-blue-600 underline"
                onClick={(e) => {
                  e.preventDefault();
                  openPricingModal();
                }}
              >
                Click here
              </a>
            </span>
          </div>
        </div>
        <Modal isOpen={activeModal == "PricingModal"} onClose={closeModal}>
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
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {isAnnual
                        ? plan.yearlyPrice || plan.monthlyPrice
                        : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500">/month</span>
                    {plan.billingNote && (
                      <p className="text-sm text-gray-500 mt-1">
                        {plan.billingNote}
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
  }

  const handleconfirm = async () => {
    await handleSave()
    setActiveModal("assesment");
  };
  const currentStepIndex = currentSection?.order_number - 1;
  let prevVariant = "white-disabled";

  // if (currentStepIndex === 1) {
  //   prevVariant = "blue"; // First page
  // } else if (currentStepIndex > 1 && currentStepIndex < totalSteps) {
  //   prevVariant = "light-blue"; // Middle pages
  // } else if (currentStepIndex === totalSteps) {
  //   prevVariant = "white-disabled"; // Last page (or if no prev)
  // }

  return (
    <>
      <div className="w-full px-2 sm:px-6 lg:px-2 mt-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 ">
              <img src={missionicon} alt="Mission Icon" className="w-6 h-6" />{" "}
            </div>
            <h1 className="text-[16px] font-bold font-poppins text-gray-800">
              {currentSection.name}
            </h1>
          </div>
        </div>
      </div>

      {completed_step === "2" ? (
        <div className="w-full px-4 sm:px-6 lg:px-2 pt-4 pb-10 space-y-6">
          <div className="bg-white rounded-3xl shadow-base p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Section 1: Describe Your Approach */}
            <div className="space-y-4">
              <h3 className="text-[14px] sm:text-base font-semibold text-gray-600 pb-2 border-b border-dashed border-gray-200">
                {currentSection.checkboxes_question}
              </h3>
              <div className="space-y-3">
                {currentSection.checkboxes.map((option) => (
                  <label
                    key={option.id}
                    className="text-[14px] flex items-center gap-3 text-[#222224]"
                  >
                    <label className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.selectedCheckboxIds.includes(
                          option.id
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(option.id, e.target.checked)
                        }
                        disabled={isSubmitted}
                        className={`
      appearance-none
      w-[16px] h-[16px] sm:w-[17px] sm:h-[17px]
      rounded-[4px]
      border
      transition-all duration-300 ease-in-out
      bg-white 
   
      ${formData.selectedCheckboxIds.includes(option.id)
                            ? "border-[#7077ef] shadow-[2px_2px_4px_rgba(59,130,246,0.3)]"
                            : "border-[#D0D5DD] shadow-inner"
                          }
      ${isSubmitted ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    `}
                      />
                      {formData.selectedCheckboxIds.includes(option.id) && (
                        <Check
                          className="absolute left-[3px] top-[2px] text-[#6269FF] w-[12px] h-[12px] pointer-events-none transition-transform duration-200 scale-100"
                          strokeWidth={5}
                        />
                      )}
                    </label>
                    <span>{option.option}</span>
                  </label>
                ))}
              </div>
              {formData.selectedCheckboxIds.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one option
                </p>
              )}
            </div>

            {/* Section 2: Purpose Pause */}
            <div className="space-y-6">
              <h3 className="text-[14px] sm:text-base font-semibold text-gray-600 pb-2 border-b border-dashed border-gray-200">
                Purpose Pause
              </h3>
              {currentSection.purposePauseQuestions.map((q, i) => (
                <div key={i}>
                  <p
                    className="text-[14px] flex items-start gap-3 text-[#222224]
"
                  >
                    {q.question}
                  </p>
                  <textarea
                    placeholder="Enter Text here"
                    className="w-full p-2 sm:p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-3"
                    rows={3}
                    value={formData.purposePauseAnswers[i]?.answer || ""}
                    onChange={(e) =>
                      handlePurposePauseChange(i, e.target.value)
                    }
                    disabled={isSubmitted}
                  />
                </div>
              ))}
            </div>

            {/* Section 3: Best Practice */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData?.bestPractice.showInPublic || false}
                  onChange={(e) => handleToggleChange(e.target.checked)}
                  disabled={isSubmitted}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
              </label>
              <span className="text-[14px] flex items-start gap-3 text-[#222224]">
                Do you have best practices to highlight?
              </span>
            </div>

            <textarea
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder={currentSection.bestPracticePrompt}
              value={formData.bestPractice.answer || ""}
              onChange={(e) => handleBestPracticeChange(e.target.value)}
              disabled={isSubmitted}
            />

            {/* Section 4: Suggested Uploads */}
            <div className="space-y-6">
              <h3 className="text-[14px] sm:text-base font-semibold text-gray-600 pb-2 border-b border-dashed border-gray-200">
                Purpose Pause
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {currentSection.suggestedUploads.map((upload, i) => (
                  <div key={i}>
                    <label className="text-[14px] flex items-start gap-3 text-[#222224] mb-2">
                      {upload.label} <br />(File format: JPEG, jpg, png, pdf , Docx and doc. Max file size: 2 MB.)
                    </label>
                    <div className="flex items-center gap-4 mt-4">
                      <input
                        type="file"
                        accept={upload.acceptedTypes}
                        className={`w-full h-16 px-2 py-3 cursor-pointer rounded-xl border ${uploadProgress?.[`file-${i}`]?.error ? 'border-red-500' : 'border-gray-300'}   file:mr-4 file:rounded-full file:border-0 file:bg-[#7077FE] file:px-[20px] file:py-[8px] file:text-white  file:font-['Plus Jakarta Sans'] file:font-medium  file:text-[14px] file:cursor-pointer ${uploadProgress?.[`file-${i}`]?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onChange={(e) =>
                          handleFileUpload(i, e.target.files?.[0] || null)
                        }
                        disabled={isSubmitted || uploadProgress?.[`file-${i}`]?.loading}
                      />
                      {formData.uploads[i]?.fileUrl && (
                        <a
                          href={formData.uploads[i].fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#7077FE] hover:underline flex items-center gap-1"
                        >
                          <EyeIcon className="w-5 h-5" />
                          View
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[14px] flex items-start gap-3 text-[#222224] mb-1">
                  Link for Reference
                </label>
                <input
                  type="url"
                  className={`w-full p-2 rounded-lg border ${urlError ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="https://example.com"
                  value={formData.referenceLink.url || ""}
                  onChange={(e) => handleReferenceLinkChange(e.target.value)}
                  disabled={isSubmitted}
                />
                {urlError && (
                  <p className="text-red-500 text-sm mt-1">{urlError}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {/* {!isSubmitted && ( */}
            <div className="flex flex-row items-center gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 w-full">
              {/* Save Button - Gradient */}
              <Button
                variant="gradient-primary"
                onClick={handleSave}
                // disabled={isSubmitting}
                disabled={isSubmitted}
                className="w-[85px] h-[35px] rounded-[70.94px] px-[24px] py-[8px] flex items-center justify-center gap-[7.09px] text-white font-['Plus Jakarta Sans'] font-medium text-[14px] leading-[100%] text-center disabled:opacity-60 transition-colors duration-200"
                style={{
                  opacity: 1,
                  transform: "rotate(0deg)",
                }}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>

              {/* Prev & Next Buttons */}
              <div className="flex flex-row gap-4 sm:flex-row sm:gap-6">
                <button
                  onClick={handlePrevious}
                  disabled={!currentSection.previous_section_id}
                  className={` w-[117px] h-[35px]
    px-[24px] py-[8px]
   rounded-[70.94px]
    border border-gray-200
    bg-white text-[#64748B]
    font-['Plus Jakarta Sans'] text-[12px] font-medium
    transition-all duration-200
    hover:bg-[#F4F4F5]
    disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed
                              ${prevVariant === "white-disabled"
                      ? "bg-white font-['Plus Jakarta Sans'] font-medium text-[14px] leading-[100%] text-center text-gray-400 border border-gray-200 shadow-md cursor-pointer"
                      : prevVariant === "blue"
                        ? "bg-[#EEF0FF] text-[#7077FE] cursor-pointer"
                        : "bg-[#EEF0FF] text-[#7077FE] hover:bg-[#DDE1FF] shadow-md cursor-pointer"
                    }`}
                >
                  Previous
                </button>

                {
                  currentSection.next_section_id &&
                  <Button
                    onClick={handleNext}
                    disabled={!currentSection.next_section_id}
                    className="w-[117px] h-[35px] rounded-[70.94px] px-[24px] py-[8px] flex items-center justify-center gap-[7.09px] text-white bg-[#897AFF] font-['Plus Jakarta Sans'] font-medium text-[12px] leading-[100%] text-center whitespace-nowrap transition-colors duration-200 disabled:opacity-50"
                    style={{
                      opacity: 1,
                      transform: "rotate(0deg)",
                    }}
                  >
                    <span className="font-['Plus Jakarta Sans'] font-medium text-[14px] leading-[100%] text-center whitespace-nowrap ">
                      Save & Next
                    </span>
                  </Button>
                }

              </div>
            </div>
            {/* )} */}

            {/* Pagination Dots (Optional center item) */}
            <div className="mt-4 sm:mt-0 flex justify-center flex-1">
              <div className="flex gap-1">
                {[...Array(totalstep)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${i === currentStepIndex ? "bg-purple-500" : "bg-purple-300"
                      } transition`}
                  />
                ))}
              </div>
            </div>

            {!isSubmitted && !currentSection.next_section_id && (
              <>
                <div className="mt-10 border-t pt-6">
                  <p className="text-gray-600 text-sm mb-3">
                    Please ensure all required fields are completed before
                    submission. Once submitted, your assessment will be reviewed
                    within 5–7 business days. You won’t be able to make changes
                    after submission.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleconfirm}
                      className="
      w-[250px] h-[45px]
      rounded-[100px]
      px-[24px] py-[16px]
      flex items-center justify-center
      gap-[10px]
      text-white
      whitespace-nowrap
    "
                    >
                      Submit For Assessment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mx-5 bg-[rgba(255,204,0,0.05)] text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">💡</span>
              <span>
                To start the certification journey into our platform, please
                complete the payment here.{" "}
                <a
                  href="#"
                  className="text-blue-600 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    openPricingModal();
                  }}
                >
                  Click here
                </a>
              </span>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={activeModal === "assesment"} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF] mb-4">
            <svg
              className="h-30 w-30 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Assessment Submission
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to submit your assessment?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={closeModal}
              variant="outline"
              className="rounded-[100px] py-3 px-8 transition-colors duration-500 ease-in-out border border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleFinalSubmit();
              }}
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 transition-colors duration-500 ease-in-out"
              disabled={isFinalSubmitting}
            >
              {isFinalSubmitting ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssessmentQuestion;
