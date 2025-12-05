import React from "react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl relative">

        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">✕</button>

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-[#E6F9EF] flex items-center justify-center">
            <svg width="45" height="45" viewBox="0 0 24 24" stroke="#22C55E">
              <path
                d="M5 13l4 4L19 7"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center font-semibold text-lg text-[#081021]">
          Your Request Is Submitted!
        </h2>

        {/* DESCRIPTION */}
        <p className="text-center text-[#64748B] text-sm mt-1">
          We've shared your information with the business. Expect a response soon.
        </p>

        {/* GO HOME BUTTON */}
        <div className="mt-5 flex justify-center">
          <button className="w-full py-3 bg-[#7077FE] text-white rounded-full font-semibold">
            Go Home
          </button>
        </div>

        {/* SIMILAR SERVICES */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#081021] text-base">Similar Services</h3>
            <span className="text-[#7077FE] text-sm cursor-pointer">View All</span>
          </div>

          <div className="flex gap-3 overflow-x-auto mt-3 pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[120px]">
                <div className="w-full h-[80px] bg-gray-200 rounded-md"></div>
                <h4 className="font-semibold text-sm mt-1">White House</h4>

                <div className="flex items-center gap-1 text-xs text-gray-600">
                  ⭐ 4.7
                </div>
                <p className="text-[11px] text-[#64748B]">Responds in 20 mins</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessModal;
