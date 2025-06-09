import React, { useEffect, useState } from "react";
import DashboardLayout from "../layout/Dashboard/dashboardlayout";
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
  console.log("🚀 ~ currentSection:", currentSection);
  const [toggles, setToggles] = useState<boolean[]>([]);
  const [formData, setFormData] = useState<FormValues | null>(null);
  console.log("🚀 ~ formData:", formData);
  const [loading, setLoading] = useState(true);
  const [sectionHistory, setSectionHistory] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<"assesment" | null>(null);
  const { showToast } = useToast();

  const closeModal = () => {
    setActiveModal(null);
  };
  const handleFinalSubmit = async () => {
    try {
      await QuestionFinalSubmission();
    } catch (error) {}
  };

  const transformApiData = (apiData: any): Section => {
    console.log("🚀 ~ transformApiData ~ apiData:", apiData);

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

      // Update navigation history
      if (sectionId) {
        setSectionHistory((prev) => [...prev, sectionId]);
      } else {
        setSectionHistory([transformedSection.id]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
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
      } catch (error) {
        console.error("Error uploading file:", error);
        // Handle error (e.g., show error message to user)
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

  const handleNext = async () => {
    // try {
    //   const res = await submitAnswerDetails(formData);
    //   console.log("🚀 ~ handleNext ~ res:", res);
    // } catch (error) {}
    if (currentSection?.next_section_id) {
      fetchQuestions(currentSection.next_section_id);
    }
  };

  const handleSave = async () => {
    try {
      const res = await submitAnswerDetails(formData);
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
    } catch (error: any) {
      showToast({
        message: error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentSection?.previous_section_id) {
      // If no history but API provides previous_section_id
      fetchQuestions(currentSection.previous_section_id);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (!currentSection || !formData) {
    return <DashboardLayout>No section data available</DashboardLayout>;
  }

  const completed_step = localStorage.getItem("completed_step");
  console.log("🚀 ~ completed_step:", typeof completed_step);

  const handleconfirm = () => {
    setActiveModal("assesment");
  };

  return (
    <>
      <DashboardLayout>
        {completed_step === "2" ? (
          <div className="p-6 mx-auto space-y-10">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h2 className="text-2xl font-bold mb-4">{currentSection.name}</h2>
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold">
                  {currentSection.checkboxes_question}
                </h3>
                {currentSection.checkboxes.map((option: any) => (
                  <label key={option.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={formData.selectedCheckboxIds.includes(option.id)}
                      onChange={(e) =>
                        handleCheckboxChange(option.id, e.target.checked)
                      }
                    />
                    <span>{option.option}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold">Purpose Pause</h3>
                {currentSection.purposePauseQuestions.map((questionObj, i) => (
                  <div key={i}>
                    <label className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1">
                      {questionObj.question}
                    </label>
                    <textarea
                      className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                      rows={3}
                      value={formData.purposePauseAnswers[i]?.answer || ""}
                      onChange={(e) =>
                        handlePurposePauseChange(i, e.target.value)
                      }
                    ></textarea>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-lg font-semibold">Best Practice</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Show on public profile
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={toggles[0]}
                        onChange={(e) => handleToggleChange(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
                    </label>
                  </div>
                </div>
                <textarea
                  className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  rows={3}
                  placeholder={currentSection.bestPracticePrompt}
                  value={formData.bestPractice.answer || ""}
                  onChange={(e) => handleBestPracticeChange(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold">Suggested Uploads</h3>
                {currentSection.suggestedUploads.map((upload, i) => (
                  <div key={i} className="grid grid-cols-2 items-center">
                    <div>
                      <label className="block font-medium mb-1">
                        {upload.label}
                      </label>
                      <input
                        type="file"
                        accept={upload.acceptedTypes}
                        className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                        onChange={(e) =>
                          handleFileUpload(i, e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    <div className="ms-3">
                      {formData.uploads[i]?.fileUrl && (
                        <div className="mb-2">
                          <a
                            href={formData.uploads[i].fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#9747FF] hover:underline"
                          >
                            <EyeIcon />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block font-medium mb-1">
                    Link for Reference
                  </label>
                  <input
                    type="url"
                    className={`w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                    placeholder="https://example.com"
                    value={formData.referenceLink || ""}
                    onChange={(e) => handleReferenceLinkChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="gradient-primary"
                  onClick={handlePrevious}
                  disabled={!currentSection.previous_section_id}
                  className={`rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out ${
                    !currentSection.previous_section_id &&
                    sectionHistory.length <= 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Previous
                </Button>
                <Button
                  variant="gradient-primary"
                  onClick={handleSave}
                  className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                >
                  Save
                </Button>
                <Button
                  variant="gradient-primary"
                  onClick={handleNext}
                  disabled={!currentSection.next_section_id}
                  className={`rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out ${
                    !currentSection.next_section_id
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </Button>
              </div>
              {!currentSection.next_section_id && (
                <>
                  <p className="mt-6">Notes:</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Please ensure all required fields are completed before
                    submission. Once submitted, your assessment will be reviewed
                    and you'll receive feedback within 5-7 business days. You
                    won't be able to make changes after submission.
                  </p>
                  <div className="flex items-center justify-center">
                    <Button
                      variant="gradient-primary"
                      className={`rounded-[100px] py-2 px-5 self-stretch transition-colors duration-500 ease-in-out`}
                      onClick={handleconfirm}
                    >
                      Submit For Assessment
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-0 shadow overflow-hidden p-8 text-center">
            <div className="py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Assement Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                You can access your assesment after completing your payment.
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
      </DashboardLayout>
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
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AssessmentQuestion;
