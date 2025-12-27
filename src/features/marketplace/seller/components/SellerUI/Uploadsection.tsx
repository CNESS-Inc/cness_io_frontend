interface UploadBoxProps {
  label: string;
  description?: string;
  onUpload?: (file: File) => void;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function UploadBox({
  label,
  description,
  onUpload,
  className = "",
  width = "100%",
  height = "56px"
}: UploadBoxProps) {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
  };

  return (
    <div 
      className={`flex flex-col ${className} w-full`}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
    >

      {/* WRAPPER */}
      <div
        className="relative w-full"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >

        {/* RESPONSIVE FLOATING LABEL */}
        <label 
          className="
            absolute -top-2 sm:-top-3 left-2 sm:left-3 
            bg-white px-[6px] sm:px-[8px] z-10 
            font-[poppins] font-normal
            text-[13px] sm:text-[15px] md:text-[16px]
            leading-[120%] tracking-[-0.02em]
          "
        >
          {label}
        </label>

        {/* INPUT BOX */}
        <label
          className="
            w-full h-full border border-[#b5bbc2] rounded-[10px]
            flex items-center px-3 sm:px-4 cursor-pointer
            hover:border-[#7076fe] transition-all duration-200
            text-[13px] sm:text-[15px] text-gray-600 font-['open_sans']
          "
        >
          Click to Upload / Record
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {/* DESCRIPTION - responsive */}
      {description && (
        <p className="mt-1 text-[11px] sm:text-[13px] text-[#707C8B] font-['open_sans'] leading-[16px]">
          {description}
        </p>
      )}
    </div>
  );
}
