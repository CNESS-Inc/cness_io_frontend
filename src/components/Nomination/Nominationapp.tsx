import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Button from "../ui/Button";
import { AddNomination, GetBadgeListDetails } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

// ✅ Define props for the modal
interface NominationFormModalProps {
  onClose: () => void;
}

// ✅ Define a type for the form data
interface FormData {
  fullName: string;
  email: string;
  certificationLevel: string;
  nominatorName: string;
  reason: string;
  project: string;
  file: File | null;
  confirm: boolean;
}

const NominationFormModal: React.FC<NominationFormModalProps> = ({
  onClose,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    certificationLevel: "",
    nominatorName: "",
    reason: "",
    project: "",
    file: null,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badge, setBadge] = useState<any>([]);
const [showFileError, setShowFileError] = useState(false);

  const fetchBadge = async () => {
    try {
      const res = await GetBadgeListDetails();
      setBadge(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchBadge();
  }, []);

  // ✅ Proper typing for input change events
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  // ✅ Handle file change separately for better control
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;

  if (file) {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    if (file.size > maxSize) {
      showToast({
        message: "File size exceeds 2MB. Please upload a smaller file.",
        type: "error",
        duration: 4000,
      });
      setShowFileError(true);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
    }));

    setShowFileError(false); // clear error if valid file
  }
};

  // ✅ Handle file removal
  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  // ✅ Proper typing for form submit
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
   if (!formData.file) {
    setShowFileError(true);
    showToast({
      message: "Please upload supporting evidence before submitting.",
      type: "error",
      duration: 4000,
    });
    return;
  }
  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('full_name', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('badge_id', formData.certificationLevel);
    formDataToSend.append('nominator_name', formData.nominatorName);
    formDataToSend.append('recognition_reason', formData.reason);
    formDataToSend.append('initiative_description', formData.project);
    formDataToSend.append("file", formData.file);

    // Using fetch
    const response = await AddNomination(formDataToSend)
    console.log("🚀 ~ handleSubmit ~ response:", response)
    showToast({
      message: 'Nomination submitted successfully!',
      type: 'success',
      duration: 5000,
    });
    onClose();
  } catch (error: any) {
    showToast({
      message: error?.response?.data?.error?.message || 'An error occurred while submitting the nomination.',
      type: 'error',
      duration: 5000,
    });
  } finally {
    setIsSubmitting(false);
  }
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-[25px] shadow-lg px-[45px] py-[30px] max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-2xl text-[#9EA8B6] hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-2xl font-medium text-[32px] text-center mb-6">
            Nomination Application Form
          </h2>
        </div>

        {/* Upload Section */}
        {!formData.file ? (
          <div 
className={`mt-2 text-center py-6 px-4 rounded-[26px] border-2 ${
      showFileError ? "border-red-500" : "border-[#CBD0DC]"
    } border-dashed flex flex-col items-center justify-center cursor-pointer mb-2 transition-all`}
  >            <div className="pb-4 flex flex-col items-center">
              <svg
                className="w-12 h-12 text-[#CBD0DC]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h4 className="pt-2 text-base font-medium text-[#292D32]">
                Upload Supporting Evidence
              </h4>
              <h4 className="pt-2 font-normal text-sm text-[#A9ACB4]">
                PDF, JPEG, PNG formats, up to 2MB
              </h4>
            </div>

            <div className="">
              <input
                type="file"
                id="nominationFile"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
          handleFileChange(e);
          setShowFileError(false); 
        }}
              />
              <label
                htmlFor="nominationFile"
                className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded-[26px] border-2 border-[#CBD0DC] border-dashed mb-6 relative overflow-hidden">
            <div className="relative w-full h-32 bg-gray-50 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {formData.file.name}
                </span>
              </div>

              {/* Cross button to remove file */}
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-xl text-gray-700 hover:text-red-600 transition-all duration-200 shadow-md"
              >
                ✕
              </button>

              {/* Hidden file input for change functionality */}
              <input
                type="file"
                id="nominationFile"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {/* Show inline error message */}
{showFileError && (
  <p className="text-red-500 text-sm text-center mb-4">
    * Uploading supporting evidence is required.
  </p>
)}

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            const target = e.target as HTMLElement;
            if (e.key === "Enter" && target.tagName !== "TEXTAREA")
              e.preventDefault();
          }}
          className="space-y-6"
        >
          {/* Grid Layout for Inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="fullName"
                className="block text-[15px] font-normal text-black"
              >
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Applicant/Nominee's full name"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="email"
                className="block text-[15px] font-normal text-black"
              >
                Email ID <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter mail ID for official communication"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="certificationLevel"
                className="block text-[15px] font-normal text-black"
              >
                Current Certification Level{" "}
                <span className="text-red-600">*</span>
              </label>
              <select
                id="certificationLevel"
                name="certificationLevel"
                value={formData.certificationLevel}
                onChange={handleChange}
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Choose your certification level</option>
                {badge.map((level: any) => (
                  <option key={level.id} value={level.id}>
                    {level.level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="nominatorName"
                className="block text-[15px] font-normal text-black"
              >
                Nominator's Name (if applicable)
              </label>
              <input
                type="text"
                id="nominatorName"
                name="nominatorName"
                value={formData.nominatorName}
                onChange={handleChange}
                placeholder="For peer nominations"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Textareas */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="reason"
              className="block text-[15px] font-normal text-black"
            >
              Why do you believe you/they should be recognized as a Conscious
              Leader? <span className="text-red-600">*</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reflective answer (min. 100 words)"
              className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="project"
              className="block text-[15px] font-normal text-black"
            >
              Describe one initiative or project that reflects conscious
              leadership. <span className="text-red-600">*</span>
            </label>
            <textarea
              id="project"
              name="project"
              rows={3}
              value={formData.project}
              onChange={handleChange}
              placeholder="Showcase measurable impact"
              className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              required
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="confirm"
              name="confirm"
              checked={formData.confirm}
              onChange={handleChange}
              className="w-4 h-4 mt-1 text-indigo-600 border-[#CBD0DC] rounded focus:ring-indigo-500"
              required
            />
            <label htmlFor="confirm" className="ml-2 text-sm text-gray-700">
              I confirm the information provided is accurate and aligns with
              CNESS values.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="white-outline"
              className="w-[104px] h-[39px] rounded-[100px] text-[12px] font-medium flex items-center justify-center border border-[#CBD0DC] text-[#54575C] hover:bg-gray-50"
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] text-[12px] font-medium flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NominationFormModal;
