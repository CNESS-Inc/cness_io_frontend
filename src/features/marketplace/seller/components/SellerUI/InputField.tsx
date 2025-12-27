interface InputFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function InputField({ 
  label,
  description,
  required = false,
  placeholder,
  value,
  onChange,
  width,
  height = "56px",
  className = ""
}: InputFieldProps) {

  return (
    <div 
      className={`flex flex-col gap-1 ${className} w-full`}
      style={width ? { width } : undefined}
    >

      {/* Input Wrapper */}
      <div className="relative" style={{ height }}>

        {/* Floating Label */}
        <label
          className="
            absolute -top-3 left-3 bg-white px-2 z-10 
            font-[poppins] font-normal 
            text-[15px] sm:text-[16px] 
            leading-[135%] tracking-[-0.02em]
          "
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Input */}
        <div className="border border-[#b5bbc2] rounded-[10px] w-full h-full">
          <input
            value={value}
            placeholder={placeholder}
            onChange={(e)=>onChange?.(e.target.value)}
            className="
              w-full h-full px-[12px] pt-[16px] pb-[12px] 
              outline-none bg-transparent 
              text-[15px] sm:text-[17px]
            "
          />
        </div>
      </div>

      {/* Description - responsive */}
      {description && (
        <p className="
          text-[11px] sm:text-[13px] 
          leading-[17px] 
          text-[#707c8b] mt-1
          max-w-full break-words
        ">
          {description}
        </p>
      )}

    </div>
  );
}
