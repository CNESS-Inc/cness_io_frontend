import React, { useEffect, useState } from "react";
import cloud from "../assets/cloud-add.svg";
import {
  MeDetails,
  PaymentDetails,
  QuestionDetails,
  QuestionFileDetails,
  removeUploadedFile,
  submitAssesmentAnswerDetails,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { result } from "lodash";
import { Plus, Minus, Loader2, X } from "lucide-react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

interface TransformedSection {
  id: string;
  name: string;
  order_number: number;
  consciousReflection: string;
  checkboxes: Array<{
    id: string;
    option: string;
  }>;
  checkboxes_question: string;
  checkboxes_question_id: string;
  checkboxAnswers: string[];
  uploadQuestion: {
    id: string;
    question: string;
  };
}

interface UploadedFile {
  name: string;
  size: string;
  status: string;
  file: File;
  uploadProgress?: number;
  url?: string; // Add URL for preview
  id?: string; // Add ID for server files
}

interface AnswerPayload {
  data: Array<{
    question_id: string;
    answer: string[];
  }>;
}

const InspiredAssessment = () => {
  const [sections, setSections] = useState<TransformedSection[]>([]);
  const [expanded, setExpanded] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, string[]>>({});
  const [uploads, setUploads] = useState<Record<string, UploadedFile[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState<"price" | null>(null);
  const completed_step = localStorage.getItem("completed_step");
  const [personPricing, setPersonPricing] = useState<any[]>([]);
  console.log("🚀 ~ InspiredAssessment ~ personPricing:", personPricing);
  const [isAnnual, setIsAnnual] = useState(true);

  // Transform API data to match our component structure
  const transformApiData = (apiData: any): TransformedSection[] => {
    if (!apiData?.all_sections) return [];

    return apiData.all_sections
      .sort((a: any, b: any) => a.section.order_number - b.section.order_number)
      .map((sectionData: any) => {
        const section = sectionData.section;
        const subSections = sectionData.sub_sections;

        // Find different question types
        let consciousReflection = "";
        let checkboxesData: any = null;
        let uploadQuestion: any = null;
        let existingFiles: UploadedFile[] = [];

        subSections.forEach((subSection: any) => {
          subSection.questions.forEach((question: any) => {
            if (
              question.question_type === "lable" &&
              question.question.includes("Conscious Reflection")
            ) {
              consciousReflection = getConsciousReflectionText(section.name);
            } else if (question.question_type === "checkbox") {
              checkboxesData = question;
            } else if (
              question.question_type === "file" &&
              question.question.includes("Upload")
            ) {
              uploadQuestion = question;

              // Convert existing file answers to UploadedFile format
              if (question.answer && Array.isArray(question.answer)) {
                existingFiles = question.answer.map((fileAnswer: any) => {
                  const fileName =
                    fileAnswer.file.split("/").pop() || "Uploaded file";
                  return {
                    name: fileName,
                    size: "Uploaded", // You might want to get actual file size from API
                    status: "Uploaded",
                    url: fileAnswer.file,
                    id: fileAnswer.id,
                  } as UploadedFile;
                });
              }
            }
          });
        });

        // Initialize uploads with existing files
        if (existingFiles.length > 0) {
          setUploads((prev) => ({
            ...prev,
            [section.id]: [...(prev[section.id] || []), ...existingFiles],
          }));
        }

        return {
          id: section.id,
          name: section.name,
          order_number: section.order_number,
          consciousReflection,
          checkboxes: checkboxesData?.options || [],
          checkboxes_question: checkboxesData?.question || "",
          checkboxes_question_id: checkboxesData?.id || "",
          checkboxAnswers: checkboxesData?.answer || [],
          uploadQuestion: {
            id: uploadQuestion?.id || "",
            question: uploadQuestion?.question || "",
          },
        };
      });
  };

  // Helper function to get reflection text based on section name
  const getConsciousReflectionText = (sectionName: string): string => {
    const reflections: Record<string, string> = {
      "Mission & Vision":
        "Your mission and vision are how you express who you are through what you do. It reflects what gives your life meaning, what inspires you, and how your work or actions align with your higher purpose.",
      "Client / Customer / Consumer":
        "This section reflects how you serve others — with reliability, fairness, kindness, and openness. It shows how you bring values into your professional or service interactions.",
      "Communities & Charities":
        "Show how you give back or contribute to communities or causes aligned with your values.",
      "Vision & Legacy – Long-Term Contribution":
        "This section captures your commitment to creating a lasting, positive legacy through your conscious actions.",
      "Leadership Best Practices":
        "This section highlights the examples of leadership practices that demonstrate awareness, fairness, and empowerment.",
    };

    return (
      reflections[sectionName] ||
      "Reflect on your values and how they manifest in this area of your work."
    );
  };

  const toggleSection = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleCheck = async (sectionId: string, checkboxId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const currentChecked = checked[sectionId] || [];
    const newChecked = currentChecked.includes(checkboxId)
      ? currentChecked.filter((id) => id !== checkboxId)
      : [...currentChecked, checkboxId];

    // Update local state immediately for better UX
    setChecked((prev) => ({
      ...prev,
      [sectionId]: newChecked,
    }));

    // // Save to API
    // try {
    //   await saveCheckboxAnswers(section.checkboxes_question_id, newChecked);
    // } catch (error: any) {
    //   // Revert local state if API call fails
    //   setChecked((prev) => ({
    //     ...prev,
    //     [sectionId]: currentChecked,
    //   }));

    //   showToast({
    //     message: error?.message || "Failed to save answer",
    //     type: "error",
    //     duration: 5000,
    //   });
    // }
  };

  // Submit all answers
  const handleSubmitAllAnswers = async () => {
    setSubmitting(true);
    try {
      // Prepare payload with all checkbox answers
      const payload: AnswerPayload = {
        data: sections
          .filter(
            (section) =>
              section.checkboxes_question_id && checked[section.id]?.length > 0
          )
          .map((section) => ({
            question_id: section.checkboxes_question_id,
            answer: checked[section.id] || [],
          })),
      };

      // If no answers to submit
      if (payload.data.length === 0) {
        showToast({
          message: "No answers to submit",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      const res = await submitAssesmentAnswerDetails(payload);
      console.log("🚀 ~ handleSubmitAllAnswers ~ res:", res);

      showToast({
        message: "Answers submitted successfully!",
        type: "success",
        duration: 3000,
      });
      if (res) {
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
      console.log("Submission result:", result);
    } catch (error: any) {
      console.log("🚀 ~ handleSubmitAllAnswers ~ error:", error);
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to submit answers",
        type: "error",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // API call to upload file
  const uploadFileToServer = async (
    questionId: string,
    file: File,
    sectionId: string,
    fileName: string
  ) => {
    const formData = new FormData();
    formData.append("question_id", questionId);
    formData.append("file", file);

    try {
      // Update file status to uploading
      setUploads((prev) => ({
        ...prev,
        [sectionId]: prev[sectionId].map((f) =>
          f.name === fileName
            ? { ...f, status: "Uploading...", uploadProgress: 0 }
            : f
        ),
      }));

      const response = await QuestionFileDetails(formData);

      // Update file status to success with URL
      setUploads((prev) => ({
        ...prev,
        [sectionId]: prev[sectionId].map((f) =>
          f.name === fileName
            ? {
                ...f,
                status: "Uploaded",
                uploadProgress: 100,
                url: response.data?.url || f.url, // Use the URL from response
                id: response.data?.id || f.id,
              }
            : f
        ),
      }));

      showToast({
        message: "File uploaded successfully!",
        type: "success",
        duration: 3000,
      });

      return response;
    } catch (error: any) {
      // Update file status to error
      setUploads((prev) => ({
        ...prev,
        [sectionId]: prev[sectionId].map((f) =>
          f.name === fileName
            ? { ...f, status: "Upload Failed", uploadProgress: 0 }
            : f
        ),
      }));

      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to upload file",
        type: "error",
        duration: 5000,
      });

      throw error;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const section = sections.find((s) => s.id === sectionId);
    if (!section || !section.uploadQuestion.id) {
      showToast({
        message: "Unable to find upload question for this section",
        type: "error",
        duration: 5000,
      });
      return;
    }

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB of 120 KB`,
      status: "Pending Upload",
      file: file,
      uploadProgress: 0,
    }));

    // Add files to state
    setUploads((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), ...newFiles],
    }));

    // Upload each file
    for (const newFile of newFiles) {
      try {
        await uploadFileToServer(
          section.uploadQuestion.id,
          newFile.file,
          sectionId,
          newFile.name
        );
      } catch (error) {
        console.error(`Failed to upload file: ${newFile.name}`, error);
      }
    }

    // Clear the file input
    e.target.value = "";
  };

  const handleRemove = async (
    sectionId: string,
    fileName: string,
    fileId?: string
  ) => {
    // If file has an ID (from server), call the delete API
    if (fileId) {
      const payload = {
        id: fileId,
      };
      try {
        // Call the API to remove the file from server
        await removeUploadedFile(payload);

        showToast({
          message: "File removed successfully",
          type: "success",
          duration: 3000,
        });
      } catch (error: any) {
        console.error("Failed to delete file from server:", error);
        showToast({
          message: error?.message || "Failed to remove file from server",
          type: "error",
          duration: 5000,
        });
        return; // Don't remove from local state if API call fails
      }
    } else {
      // For files that haven't been uploaded yet (Pending Upload status)
      showToast({
        message: "File removed",
        type: "success",
        duration: 3000,
      });
    }

    // Remove from local state only after successful API call (for server files)
    // or immediately for local files
    setUploads((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((f) => f.name !== fileName),
    }));
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await QuestionDetails();
      console.log("🚀 ~ fetchQuestions ~ res:", res);

      if (res?.data?.data?.all_sections) {
        const transformedSections = transformApiData(res.data.data);
        setSections(transformedSections);

        // Initialize checked state from API data
        const initialChecked: Record<string, string[]> = {};
        transformedSections.forEach((section) => {
          if (section.checkboxAnswers && section.checkboxAnswers.length > 0) {
            initialChecked[section.id] = section.checkboxAnswers;
          }
        });
        setChecked(initialChecked);

        // Expand the first section by default
        if (transformedSections.length > 0) {
          setExpanded(transformedSections[0].id);
        }
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to fetch sections",
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
  }, [completed_step]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7077FE]" />
        <span className="ml-2 text-gray-600">Loading assessment...</span>
      </div>
    );
  }

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

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-6 text-center sm:text-left">
        <img
          src="https://cdn.cness.io/inspiredlogo.svg"
          alt="Inspired Certification"
          className="w-15 h-15"
        />
        <h3 className="font-[poppins] font-medium text-[24px] leading-[115%] text-gray-900">
          Inspired Certification
        </h3>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex justify-between items-center px-4 sm:px-6 py-5 sm:py-6 text-left"
            >
              <span className="font-[poppins] font-semibold text-[18px] sm:text-[18px] leading-[100%] text-gray-900">
                {section.order_number}. {section.name}
              </span>
              <div className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm">
                {expanded.includes(section.id) ? (
                  <Minus className="text-gray-500" />
                ) : (
                  <Plus className="text-gray-500" />
                )}
              </div>
            </button>

            {/* Expanded Section */}
            {expanded === section.id && (
              <div className="border-t border-[#E0E0E0] px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
                {/* Text and Checkboxes */}
                <div className="flex-1">
                  <p className="font-[poppins] font-medium text-[16px] leading-[140%] text-gray-800 mb-1">
                    Conscious Reflection:
                  </p>
                  <p className="font-['Open_Sans'] font-normal text-[14px] leading-[120%] text-[#6E6E6E] mb-4">
                    {section.consciousReflection}
                  </p>
                  <p className="font-[poppins] font-medium text-[16px] leading-[140%] text-gray-800 mb-2">
                    {section.checkboxes_question}{" "}
                    <span className="font-['Open_Sans'] font-normal text-[12px] leading-[140%] text-gray-600">
                      (choose at least one option)
                    </span>
                  </p>

                  <ul className="space-y-3 px-4 sm:px-8 mb-6 mt-5">
                    {section.checkboxes.map((checkbox) => (
                      <li
                        key={checkbox.id}
                        className="flex items-start space-x-3 relative"
                      >
                        <input
                          type="checkbox"
                          id={`checkbox-${checkbox.id}`}
                          checked={
                            checked[section.id]?.includes(checkbox.id) || false
                          }
                          onChange={() => handleCheck(section.id, checkbox.id)}
                          className="w-5 h-5 cursor-pointer appearance-none border border-gray-400 rounded-sm checked:bg-[#22C55E] relative"
                        />
                        <label
                          htmlFor={`checkbox-${checkbox.id}`}
                          className="font-['Open_Sans'] font-normal text-[16px] leading-[140%] text-gray-800 cursor-pointer"
                        >
                          {checkbox.option}
                        </label>

                        {checked[section.id]?.includes(checkbox.id) && (
                          <span className="absolute left-[1px] top-[2px] w-5 h-5 flex items-center justify-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
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
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upload Box */}
                <div className="w-full max-w-[336px] min-h-[420px] rounded-[30px] shadow-sm border border-gray-200 bg-white flex flex-col justify-between py-5 px-5 mx-auto sm:mx-0">
                  <div>
                    <h4 className="font-[poppins] font-semibold text-[16px] text-gray-900 mb-1">
                      {section.uploadQuestion.question}
                    </h4>
                    <p className="font-['Open_Sans'] text-[14px] text-gray-400 mb-5">
                      Select and upload the files of your choice
                    </p>

                    <div
                      className="text-center py-6 px-4 rounded-[26px] border-2 border-[#CBD0DC] border-dashed flex flex-col items-center justify-center cursor-pointer bg-[#FAFAFA] mb-6 gap-[10px]"
                      style={{ borderWidth: "3px" }}
                    >
                      <div className="flex flex-col items-center pb-4">
                        <img
                          src={cloud}
                          alt="Upload"
                          className="w-10 opacity-80"
                        />
                        <h4 className="pt-2 text-[14px] font-[poppins] font-medium text-[#292D32] leading-[100%]">
                          Choose a file or drag & drop it here
                        </h4>
                        <p className="pt-1 font-['Open_Sans'] text-[12px] text-[#A9ACB4]">
                          JPEG, PNG, PDF, & MP4 formats, up to 50MB
                        </p>
                      </div>

                      <input
                        type="file"
                        id={`uploadFiles-${section.id}`}
                        className="hidden"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.mp4"
                        onChange={(e) => handleFileChange(e, section.id)}
                      />
                      <label
                        htmlFor={`uploadFiles-${section.id}`}
                        className="block px-8 py-2.5 rounded-full text-[#54575C] text-[14px] font-[plus-jakarta-sans] font-medium border border-[#CBD0DC] hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        Browse File
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files */}
                  <div className="space-y-3 overflow-y-auto pr-1">
                    {uploads[section.id]?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#FFECEC] rounded-md">
                            <img
                              src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                              alt="PDF"
                              className="w-4 h-4"
                            />
                          </div>
                          <div>
                            <p className="font-['Open_Sans'] text-[14px] text-gray-800">
                              {file.name}
                            </p>
                            <p className="font-['Open_Sans'] text-[12px] text-gray-500">
                              {file.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.status === "Uploading..." && (
                            <Loader2 className="w-4 h-4 text-[#7077FE] animate-spin" />
                          )}
                          <p
                            className={`font-['Open_Sans'] text-[12px] ${
                              file.status === "Uploaded"
                                ? "text-green-600"
                                : file.status === "Upload Failed"
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          >
                            {file.status}
                          </p>
                          <X
                            className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                            onClick={() =>
                              handleRemove(section.id, file.name, file.id)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmitAllAnswers}
          disabled={submitting}
          className="px-8 py-3 bg-[#7077FE] text-white rounded-full font-[poppins] font-medium text-[16px] hover:bg-[#5b62d4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
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
};

export default InspiredAssessment;
