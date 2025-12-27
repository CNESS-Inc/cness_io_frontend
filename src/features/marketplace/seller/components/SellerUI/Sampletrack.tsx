import { Plus } from "lucide-react";

interface SampleTrackUploadProps {
  title: string;
  description: string;
  onUpload?: (file: File) => void;
}

export default function SampleTrackUpload({
  title,
  description,
  onUpload,
}: SampleTrackUploadProps) {
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
  };

  return (
    <label 
      className="
        flex items-start gap-4 p-4 rounded-[16px] border border-[#F3F3F3] 
        cursor-pointer hover:border-[#7076fe] transition-all duration-200
        w-full bg-white 
      "
    >
      {/* Icon Box */}
      <div className="w-[32px] h-[32px] rounded-lg bg-[#7076fe] flex items-center justify-center text-white">
        <Plus size={20} strokeWidth={2} />
      </div>

      {/* Text section */}
      <div className="flex flex-col">
        <span className="text-[15px] font-semibold text-[#7076fe]">{title}</span>
        <span className="text-[13px] text-[#6d7280] mt-[2px] leading-[18px]">{description}</span>
      </div>

      <input type="file" className="hidden" accept="audio/*" onChange={handleFileSelect}/>
    </label>
  );
}
