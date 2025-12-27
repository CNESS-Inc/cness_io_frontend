interface ActionButtonsProps {
  onGoBack?: () => void;
  onSubmit?: () => void;
  className?: string;
}

export default function ActionButtons({ onGoBack, onSubmit, className = "" }: ActionButtonsProps) {
  return (
    <div className={`w-full flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 ${className}`}>

      {/* Go Back */}
      <button
        onClick={onGoBack}
        className="
          w-full sm:w-auto
          px-6 py-2.5  
          border border-[#7076fe]
          rounded-[10px]
          font-poppins font-medium
          text-[15px] sm:text-[16px]
          text-[#7076fe]
          hover:bg-[#f4f1ff]
          transition
        "
      >
        Go Back
      </button>

      {/* Submit */}
      <button
        onClick={onSubmit}
        className="
          w-full sm:w-auto
          px-6 py-2.5  
          rounded-[10px]
          font-poppins font-medium
          text-[15px] sm:text-[16px]
          text-white
          bg-[#7076fe]
          hover:bg-[#5a63d4]
          transition
        "
      >
        Submit
      </button>

    </div>
  );
}
