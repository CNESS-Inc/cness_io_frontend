import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import {
  QuestionDetails,
  QuestionFileDetails,
  QuestionFinalSubmission,
  submitAnswerDetails,
} from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { EyeIcon } from "lucide-react";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast/ToastProvider";

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
  checkboxAnswers: string[]; // Add this field to store checkbox answers
  purposePauseQuestions: Array<{
    question: string;
    id: string;
    answer?: string;
  }>;
  bestPracticePrompt: string;
  bestPracticeQuestionId: string;
  bestPracticeAnswer?: string;
  suggestedUploads: Array<{
    label: string;
    acceptedTypes: string;
    id: string;
    fileUrl?: string | null;
  }>;
  next_section_id: string | null;
  previous_section_id: string | null;
}

interface FormValues {
  selectedCheckboxIds: string[];
  checkboxes_question_id: string;
  purposePauseAnswers: PurposePauseAnswer[];
  bestPractice: {
    answer: string;
    question_id: string;
  };
  uploads: Array<{
    file: File | null;
    id: string;
    fileUrl?: string | null; // Added this field
  }>;
  referenceLink: string;
}

interface PurposePauseAnswer {
  id: string;
  answer: string;
}

const AssessmentQuestion: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [toggles, setToggles] = useState<boolean[]>([]);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [_progress, setprogress] = useState(0);
  const [totalstep, settotalstep] = useState(0);
  const [_sectionHistory, setSectionHistory] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"assesment" | null>(null);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

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
    // Initialize variables for each section type
    let checkboxesData: any = null;
    let purposePauseData: any = null;
    let bestPracticeData: any = null;
    let suggestedUploadsData: any = null;

    // Iterate through each question_data item and categorize them by sub_section name
    apiData.question_data.forEach((section: any) => {
      if (section.sub_section.name === "Select all that apply") {
        checkboxesData = section;
      } else if (section.sub_section.name === "Purpose Pause") {
        purposePauseData = section;
      } else if (section.sub_section.name === "Best Practice") {
        bestPracticeData = section;
      } else if (section.sub_section.name === "Suggested Uploads") {
        suggestedUploadsData = section;
      }
    });

    return {
      id: apiData.section.id,
      name: apiData.section.name,
      order_number: apiData.section.order_number,
      checkboxes: checkboxesData?.questions[0]?.options || [],
      checkboxes_question: checkboxesData?.questions[0]?.question || "",
      checkboxes_question_id: checkboxesData?.questions[0]?.id || "",
      checkboxAnswers: checkboxesData?.questions[0]?.answer || [], // Store the checkbox answers
      purposePauseQuestions:
        purposePauseData?.questions?.map((q: any) => ({
          question: q.question,
          id: q.id,
          answer: q.answer || "",
        })) || [],
      bestPracticePrompt: bestPracticeData?.questions[0]?.question || "",
      bestPracticeQuestionId: bestPracticeData?.questions[0]?.id || "",
      bestPracticeAnswer: bestPracticeData?.questions[0]?.answer || "",
      suggestedUploads:
        suggestedUploadsData?.questions?.map((q: any) => ({
          label: q.question,
          id: q.id,
          acceptedTypes: q.question.includes("screenshot")
            ? ".jpg,.png,.jpeg"
            : ".pdf,.doc,.docx,.jpg,.png,.jpeg",
          fileUrl: q.answer || null,
        })) || [],
      next_section_id: apiData.next_section_id,
      previous_section_id: apiData.previous_section_id,
    };
  };

  const initializeFormData = (section: Section): FormValues => {
    return {
      selectedCheckboxIds: section.checkboxAnswers || [], // Initialize with saved checkbox answers
      checkboxes_question_id: section.checkboxes_question_id,
      purposePauseAnswers: section.purposePauseQuestions.map((question) => ({
        id: question.id,
        answer: question.answer || "",
      })),
      bestPractice: {
        answer: section.bestPracticeAnswer || "",
        question_id: section.bestPracticeQuestionId,
      },
      uploads: section.suggestedUploads.map((upload) => ({
        file: null,
        id: upload.id,
        fileUrl: upload.fileUrl || null,
      })),
      referenceLink: "",
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
      setToggles([true]); // Initialize toggle for this section
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
    fetchQuestions(); // Initial load
  }, []);

  const handleToggleChange = (checked: boolean) => {
    setToggles([checked]);
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

    setFormData((prev) => {
      if (!prev) return null;
      const newData = { ...prev };
      // Create an object to store both the file and the upload id
      newData.uploads[uploadIndex] = {
        file: file,
        id: upload.id,
      };
      return newData;
    });

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("question_id", upload.id);
        const response = await QuestionFileDetails(formData);
        console.log("🚀 ~ handleFileUpload ~ response:", response);
      } catch (error: any) {
        console.error("Error uploading file:", error);
        showToast({
          message: error?.response?.data?.error?.message,
          type: "error",
          duration: 5000,
        });
      }
    }
  };

  const handleReferenceLinkChange = (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const newData = { ...prev };
      newData.referenceLink = value;
      return newData;
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
    return <div className="p-6 text-center">No section data available</div>;
  }

  const completed_step = localStorage.getItem("completed_step");
  console.log("🚀 ~ completed_step:", typeof completed_step);

  const handleconfirm = () => {
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
      {/* <div className="w-full px-2 sm:px-6 lg:px-2 mt-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10  ">
              <img
                src={missionIcon} 
                alt="Mission Icon"
                className="w-10 h-10"
              />{" "}
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              {currentSection.name}
            </h1>
          </div>

          <StatusPill status="in_progress" percentage={progress} />
        </div>
      </div> */}

      {completed_step === "2" ? (
        <div className="w-full px-4 sm:px-6 lg:px-2 pt-4 pb-10 space-y-6">
          <div className="bg-white rounded-3xl shadow-base p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Section 1: Describe Your Approach */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">
                {currentSection.checkboxes_question}
              </h3>
              <div className="space-y-3">
                {currentSection.checkboxes.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedCheckboxIds.includes(option.id)}
                      onChange={(e) =>
                        handleCheckboxChange(option.id, e.target.checked)
                      }
                      disabled={isSubmitted}
                      className={
                        isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                      }
                    />
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
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">
                Purpose Pause
              </h3>
              {currentSection.purposePauseQuestions.map((q, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {q.question}
                  </p>
                  <textarea
                    placeholder="Enter Text here"
                    className="w-full p-2 sm:p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  checked={toggles[0]}
                  onChange={(e) => handleToggleChange(e.target.checked)}
                  disabled={isSubmitted}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
              </label>
              {/* Text next to toggle */}
              <span className="text-sm font-medium text-gray-700 mb-1">
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
              <h3 className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">
                Suggested Uploads
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {currentSection.suggestedUploads.map((upload, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {upload.label}
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept={upload.acceptedTypes}
                        className="w-full h-16 px-2 py-3 cursor-pointer rounded-xl border border-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-[#7077FE] file:px-4 file:py-2 file:text-white file:font-medium file:cursor-pointer"
                        onChange={(e) =>
                          handleFileUpload(i, e.target.files?.[0] || null)
                        }
                        disabled={isSubmitted}
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
                <label className="block font-medium text-sm text-gray-700 mb-1">
                  Link for Reference
                </label>
                <input
                  type="url"
                  className="w-full p-2 rounded-lg border border-gray-300"
                  placeholder="https://example.com"
                  value={formData.referenceLink || ""}
                  onChange={(e) => handleReferenceLinkChange(e.target.value)}
                  disabled={isSubmitted}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {/* {!isSubmitted && ( */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-10 px-4 py-6 bg-white rounded-xl shadow-sm gap-4">
              {/* Save Button - Gradient */}
              <Button
                variant="gradient-primary"
                onClick={handleSave}
                // disabled={isSubmitting}
                disabled={isSubmitted}
                className="w-full sm:w-auto px-6 py-2 rounded-full text-white font-medium disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>

              {/* Prev & Next Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={handlePrevious}
                  disabled={!currentSection.previous_section_id}
                  className={`w-full sm:w-auto px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
                              ${
                                prevVariant === "white-disabled"
                                  ? "bg-white text-gray-400 border border-gray-200 shadow-md cursor-pointer"
                                  : prevVariant === "blue"
                                  ? "bg-[#EEF0FF] text-[#7077FE] cursor-pointer"
                                  : "bg-[#EEF0FF] text-[#7077FE] hover:bg-[#DDE1FF] shadow-md cursor-pointer"
                              }`}
                >
                  Previous
                </button>

                <Button
                  variant="gradient-primary"
                  onClick={handleNext}
                  disabled={!currentSection.next_section_id}
                  className="w-full sm:w-auto px-6 py-2 rounded-full text-white font-medium cursor-pointer transition-colors duration-200"
                >
                  Save & Next
                </Button>
              </div>
            </div>
            {/* )} */}

            {/* Pagination Dots (Optional center item) */}
            <div className="mt-4 sm:mt-0 flex justify-center flex-1">
              <div className="flex gap-1">
                {[...Array(totalstep)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === currentStepIndex ? "bg-purple-500" : "bg-purple-300"
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
                    <Button onClick={handleconfirm}>
                      Submit For Assessment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-0 shadow overflow-hidden p-8 text-center">
          <div className="py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Assessment Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              You can access your assessment after completing your payment.
            </p>
            <div className="flex justify-center">
              <svg
                className="w-24 h-24 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>
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
