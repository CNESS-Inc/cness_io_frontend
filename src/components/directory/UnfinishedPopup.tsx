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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl relative">

        {/* CLOSE BUTTON */}
        <button onClick={onDiscard} className="absolute top-4 right-4 text-xl">✕</button>

        <h2 className="text-center font-semibold text-xl text-[#081021]">
          You're Almost Done
        </h2>

        <p className="text-center text-[#64748B] text-sm mt-2">
          Are you sure you want to leave now and lose your progress?
        </p>

        {/* CONTINUE BUTTON */}
        <button
          onClick={onContinue}
          className="w-full py-3 bg-[#7077FE] text-white rounded-full font-semibold mt-6"
        >
          Continue Request
        </button>

        {/* DISCARD BUTTON */}
        <button
          onClick={onDiscard}
          className="w-full py-3 border border-[#CBD5E1] text-[#081021] rounded-full font-semibold mt-3"
        >
          Discard
        </button>

      </div>
    </div>
  );
};

export default ExitWarningModal;
