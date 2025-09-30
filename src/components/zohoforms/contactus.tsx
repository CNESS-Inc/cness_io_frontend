import React from "react";
import LazyZohoForm from "../ui/LazyZohoFormProps";

interface FormPopupProps {
  formType: "contact" | "feedback";
  onClose: () => void;
}

const FormPopup: React.FC<FormPopupProps> = ({ formType, onClose }) => {
  const formUrl =
    formType === "contact"
      ? "https://forms.zohopublic.com/vijicn1/form/ContactUs/formperma/AIrQeiVD8-sU0ApGGPfnhgdRbE4zmRcYN0dLiam7ZQI"
      : "https://forms.zohopublic.com/vijicn1/form/Feedback1/formperma/UiuS4wyKkpqz1XsTbHsHZVtFfj3tg8MTGPPQzLT8S40";

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl shadow-lg w-[1200px] h-[800px] p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Form Container */}
        <LazyZohoForm
          url={formUrl}
          title={formType === "contact" ? "Contact Form" : "Feedback Form"}
          minHeight={750}
          style={{ height: "100%" }}
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default FormPopup;
