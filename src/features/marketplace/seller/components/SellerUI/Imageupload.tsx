import { useState } from "react";

interface ProfileImageUploadProps {
  defaultImage?: string;
  width?: number;       // desktop width
  height?: number;      // desktop height
  rounded?: boolean;
  onUpload?: (file: File) => void;
  className?: string;
}

export default function ProfileImageUpload({
  defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  width = 249,
  height = 247,
  rounded = false,
  onUpload,
  className = ""
}: ProfileImageUploadProps) {

  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload?.(file);
  };

  return (
    <div
      className={`
        relative overflow-hidden bg-[#E6E7EB]
        ${rounded ? "rounded-full" : "rounded-[22px]"}
        mx-auto sm:mx-0
        ${className}
      `}
      style={{
        width: "100%",                 // full width on mobile
        maxWidth: `${width}px`,        // limit size on larger screens
        aspectRatio: `${width}/${height}` // keeps same shape responsively
      }}
    >
      <img 
        src={preview || defaultImage}
        className={`w-full h-full object-cover 
          ${rounded ? "rounded-full" : "rounded-[22px]"}`}
      />

      {/* Upload Button */}
      <label className="
        absolute bottom-2 right-2 w-[36px] h-[36px]
        bg-[#008282] flex items-center justify-center
        rounded-full cursor-pointer shadow
      ">
        <input type="file" className="hidden" onChange={handleUpload}/>

        <svg width="18" height="18" viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none">
          <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
        </svg>
      </label>
    </div>
  );
}
