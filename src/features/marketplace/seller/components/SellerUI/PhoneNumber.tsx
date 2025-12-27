interface PhoneNumberFieldProps {
  label: string;
  value?: string;
  description?: string;      // <--- added
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function PhoneNumberField({
  label,
  value,
  description,
  width = "100%",
  height = "56px",
  className = ""
}: PhoneNumberFieldProps) {

  return (
    <div className={`flex flex-col gap-[6px] ${className}`} style={{ width }}>

      {/* Input Wrapper */}
      <div className="relative w-full" style={{ height }}>

        {/* Floating Label */}
        <label className="
          absolute -top-3 left-3 
          bg-white px-2 z-10 
          font-[poppins] font-normal 
          text-[15px] sm:text-[16px] 
          leading-[135%] tracking-[-0.02em]
        ">
          {label}
        </label>

        {/* Box */}
        <div className="absolute inset-0 border border-[#929ba7] rounded-[10px] flex items-center overflow-hidden">

          {/* Flag + code */}
          <div className="flex items-center gap-[6px] border-r pr-2 pl-3 h-full min-w-[65px]">
            <div
              className="w-[18px] h-[18px] bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-26/K7nTMQ6EzS.png)` }}
            />
            <div
              className="w-[16px] h-[16px] bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-26/PDxrfohX55.png)` }}
            />
          </div>

          {/* Number Display */}
          <span className="
            ml-3 text-[15px] sm:text-[17px]
            text-[#222] font-Helvetica_Neue 
            whitespace-nowrap overflow-hidden text-ellipsis
          ">
            {value || "Enter phone number"}
          </span>
        </div>
      </div>

      {/* 📌 Responsive Description */}
      {description && (
        <p className="
          text-[11px] sm:text-[13px]
          text-[#707c8b] leading-[17px] 
          mt-1 break-words max-w-full
        ">
          {description}
        </p>
      )}
    </div>
  );
}
