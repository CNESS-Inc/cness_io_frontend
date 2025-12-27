import { useState } from 'react';
import { Info } from "lucide-react";     // optional icon

interface ToggleSwitchProps {
  title: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;

  showAction?: boolean;         // <--- new
  actionLabel?: string;         // <--- new
  onActionClick?: () => void;   // <--- new
}

export default function ToggleSwitch({
  title,
  description,
  defaultChecked = true,
  onChange,
  className = "",
  showAction = false,
  actionLabel = "Know more",
  onActionClick,
}: ToggleSwitchProps) {

  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const value = !isChecked;
    setIsChecked(value);
    onChange?.(value);
  };

  return (
    <div className={`flex items-center justify-between w-full border border-[#F3F3F3]  bg-[#f6f6f6] rounded-xl p-4 ${className}`}>
      
      {/* Left Section */}
      <div className="flex items-start gap-3 w-full">

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className={`w-[44px] h-[24px] rounded-full transition duration-200 flex items-center ${
            isChecked ? "bg-[#2563eb]" : "bg-[#d1d5db]"
          }`}
        >
          <div
            className={`w-[20px] h-[20px] bg-white rounded-full shadow transition-all duration-200 ${
              isChecked ? "translate-x-[22px]" : "translate-x-[2px]"
            }`}
          />
        </button>

        <div className="flex flex-col">
          <span className="font-poppins text-[16px] font-medium">{title}</span>
          <p className="text-[#6D7280] text-[13px] leading-[19px] max-w-[500px]">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side Action Button */}
      {showAction && (
    <button 
    onClick={onActionClick} 
    className="text-[#7076fe] text-[12px] border border-[#7076fe] 
               px-6 py-[6px] rounded-lg hover:bg-[#f4f2ff] flex items-center gap-1 
               transition whitespace-nowrap shrink-0"
  >
    {actionLabel}
    <Info size={15}/>
  </button>
      )}
    </div>
  );
}
