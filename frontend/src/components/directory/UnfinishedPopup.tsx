import React from "react";

interface ExitWarningModalProps {
  open: boolean;
  onContinue: () => void;
  onDiscard: () => void;
}

const ExitWarningModal: React.FC<ExitWarningModalProps> = ({
  open,
  onContinue,
  onDiscard
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-999 p-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-6 shadow-xl relative mx-4">

        {/* CLOSE BUTTON */}
        <button 
          onClick={onDiscard} 
          className="absolute top-4 right-4 text-lg w-6 h-6 flex items-center justify-center"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-center font-semibold text-lg text-[#081021] md:text-2xl">
          You're Almost Done
        </h2>

        <p className="text-center text-[#64748B] text-sm mt-2 md:text-base">
          Are you sure you want to leave now and lose your progress?
        </p>

        {/* BUTTONS CONTAINER */}
        <div className="mt-6 space-y-3">
          {/* CONTINUE BUTTON */}
          <button
            onClick={onContinue}
            className="w-full py-3 bg-[#7077FE] text-white rounded-full font-semibold hover:bg-[#5f66e0] active:scale-[0.98] transition-all duration-200 text-base md:py-3.5"
          >
            Continue Request
          </button>

          {/* DISCARD BUTTON */}
          <button
            onClick={onDiscard}
            className="w-full py-3 border border-[#CBD5E1] text-[#081021] rounded-full font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 text-base md:py-3.5"
          >
            Discard
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExitWarningModal;