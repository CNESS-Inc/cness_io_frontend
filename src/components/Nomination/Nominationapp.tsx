import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";import { X } from "lucide-react";
import Button from "../ui/Button";
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

const NominationFormModal: React.FC<NominationFormModalProps> = ({ onClose }) => {
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

  // ✅ Proper typing for input change events
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  // ✅ Proper typing for form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    alert("Nomination submitted successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-10 font-openSans text-gray-800"
        >
          <h2 className="text-2xl font-semibold font-poppins text-center mb-8 text-gray-900">
            Nomination Application Form
          </h2>

          {/* Grid Layout for Inputs */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Applicant/Nominee’s full name"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter mail ID for official communication"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none font-[poppins]"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Certification Level
              </label>
              <select
                name="certificationLevel"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-white focus:outline-none font-[poppins]"
                onChange={handleChange}
                required
              >
                <option value="">Choose your certification level</option>
                <option value="Aspiring">Aspiring</option>
                <option value="Inspired">Inspired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominator’s Name (if applicable)
              </label>
              <input
                type="text"
                name="nominatorName"
                placeholder="For peer nominations"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none font-[poppins]"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Textareas */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Why do you believe you/they should be recognized as a Conscious Leader?
            </label>
            <textarea
              name="reason"
              rows={3} // ✅ FIXED: must be number, not string
              placeholder="Reflective answer (min. 100 words)"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none font-[poppins] resize-none"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe one initiative or project that reflects conscious leadership.
            </label>
            <textarea
              name="project"
              rows={3} // ✅ FIXED: must be number, not string
              placeholder="Showcase measurable impact"
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none font-[poppins] resize-none"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-6 flex flex-col items-center justify-center text-center">
            <p className="font-medium text-gray-800 mb-2">Upload Supporting Evidence</p>
            <p className="text-sm text-gray-500 mb-4">File size up to 2MB</p>
            <label className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-full text-sm cursor-pointer">
              Browse File
              <input
                type="file"
                name="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleChange}
              />
            </label>
          </div>

          {/* Checkbox */}
          <div className="flex items-start mb-8">
            <input
              type="checkbox"
              name="confirm"
              className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-400"
              onChange={handleChange}
              required
            />
            <label className="ml-2 text-sm text-gray-700">
              I confirm the information provided is accurate and aligns with CNESS values.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
             variant="white-outline"
              type="button"
              onClick={onClose}
              className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
          hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
          shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
            >
              Close
            </Button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-['open_sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NominationFormModal;
