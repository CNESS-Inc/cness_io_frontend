interface TextareaProps {
  label: string;
  required?: boolean;
  description?: string;
  placeholder?: string;
  value?: string;
  width?: string | number;
  height?: string | number;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Textarea({
  label,
  required = false,
  description,
  placeholder,
  value,
  width = "100%",
  height = "140px",
  onChange,
  className = "",
}: TextareaProps) {
  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
    >
      <div
        className="relative w-full"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        {/* Floating Label */}
        <div
          className="
                  absolute -top-3 left-3 
    bg-white px-2 z-10 
    font-[poppins] font-normal 
    text-[16px] leading-[135%] 
    tracking-[-0.02em]
          "
        >
          {label} {required && <span className="text-red-500">*</span>}
        </div>

        {/* Input Body */}
        <div className="w-full h-full border border-[#b5bbc2] rounded-[10px]">
          <textarea
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            className="
              w-full h-full px-[12px] pt-[35px] bg-transparent outline-none resize-none 
              text-[14px] sm:text-[16px] leading-[22px]
            "
          />
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="font-['open_sans'] mt-[5px] text-[12px] sm:text-[13px] text-[#707C8B] leading-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}
