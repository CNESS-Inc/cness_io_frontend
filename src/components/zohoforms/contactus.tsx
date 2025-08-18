import React, { useRef, useEffect } from "react";

interface FormPopupProps {
  formType: "contact" | "feedback";
  onClose: () => void;
}

const FormPopup: React.FC<FormPopupProps> = ({ formType, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      const iframe = document.createElement("iframe");
      iframe.src =
        formType === "contact"
          ? "https://forms.zohopublic.com/vijicn1/form/ContactUs/formperma/AIrQeiVD8-sU0ApGGPfnhgdRbE4zmRcYN0dLiam7ZQI"
          : "https://forms.zohopublic.com/vijicn1/form/Feedback1/formperma/UiuS4wyKkpqz1XsTbHsHZVtFfj3tg8MTGPPQzLT8S40"; // Replace with your feedback form URL

      iframe.width = "100%";
      iframe.height = "100%";
      iframe.frameBorder = "0";
      iframe.setAttribute("allowTransparency", "true");
      iframe.style.border = "none";
      iframe.style.borderRadius = "8px";

      containerRef.current.appendChild(iframe);
    }
  }, [formType]);

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
        <div ref={containerRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default FormPopup;
