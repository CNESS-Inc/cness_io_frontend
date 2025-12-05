import React, { useState } from "react";
import SuccessModal from "../directory/SuccessPopup";
import ExitWarningModal from "../directory/UnfinishedPopup";

interface Directory {
  name: string;
  logo_url: string;
  city: string;
  country: string;
}

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  directory: Directory | null;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ open, onClose, directory }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  if (!open || !directory) return null;

  const handleSubmit = () => {
    setShowSuccess(true); // Open success modal
  };

  const handleBack = () => {
    setShowExitWarning(true); // Open exit warning modal
  };

  return (
    <>
      {/* MAIN POPUP */}
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
        <div className="bg-white w-[720px] rounded-2xl shadow-xl overflow-hidden relative">

          {/* ===== HEADER ===== */}
          <div className="bg-[#F5F3FF] px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={directory.logo_url} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h2 className="text-[#081021] font-semibold text-lg">{directory.name}</h2>
                <p className="text-[#64748B] text-sm">
                  {directory.city}, {directory.country}
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="#081021"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="p-6 space-y-6">

            {/* TITLE BLOCK */}
            <div>
              <h3 className="text-[#081021] font-semibold text-base">Get Connected Instantly</h3>
              <p className="text-[#64748B] text-sm">
                Enter your information to receive quick responses from this business.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              <div>
                <label className="text-[#081021] text-sm font-medium">Your Name</label>
                <input className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none" placeholder="Enter your name" />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Email</label>
                <input className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none" placeholder="Enter your email" />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Phone Number</label>
                <input className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none" placeholder="Enter phone number" />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Service</label>
                <div className="relative">
                  <select className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 appearance-none outline-none">
                    <option>Select a service</option>
                    <option>Dining</option>
                    <option>Birthday Party</option>
                    <option>Marriage Function</option>
                  </select>

                  <svg width="10" height="6" viewBox="0 0 12 10" className="absolute right-4 top-1/2 -translate-y-1/2">
                    <path d="M2 3L6 7L10 3" stroke="#081021" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Your Message</label>
                <textarea className="border border-[#CBD5E1] rounded-lg px-3 py-2 h-[120px] w-full outline-none resize-none" placeholder="Enter your message" />
              </div>
            </div>
          </div>

          {/* ===== FOOTER BUTTONS ===== */}
          <div className="flex justify-end gap-4 px-6 py-4 bg-white">
            <button
              className="px-5 py-2 rounded-full border border-gray-300 text-[#081021]"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="px-6 py-2 rounded-full bg-[#7077FE] text-white shadow-md"
              onClick={handleSubmit}
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />

      {/* EXIT WARNING MODAL */}
      <ExitWarningModal
        open={showExitWarning}
        onContinue={() => setShowExitWarning(false)}
        onDiscard={() => {
          setShowExitWarning(false);
          onClose();
        }}
      />
    </>
  );
};

export default EnquiryModal;
