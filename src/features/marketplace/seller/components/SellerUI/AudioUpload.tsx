import WarningNote from "./WarningNote";

interface AudioUploadProps {
  icon: React.ReactNode;        
  title: string;
  description: string;
  required?: boolean;
  showWarning?: boolean;
  warningMessage?: string; 
}

export default function AudioUpload({
  icon,
  title,
  description,
  required,
  showWarning,
  warningMessage,
}: AudioUploadProps) {
  return (
    <div className="flex flex-col gap-5 border border-[#f3f3f3] rounded-2xl p-6">

      {/* TOP SECTION */}
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div className="w-[30px] h-[30px] flex items-center justify-center rounded-md bg-[#7076fe] text-white">
          {icon}
        </div>

        <div className="flex flex-col">
          <span className="font-poppins text-[16px] font-medium text-[#7076fe] flex items-center gap-1">
            {title}
            {required && <span className="text-red-500">*</span>}
          </span>

          <p className="text-[13px] text-[#6d7280] font-open_sans">
            {description}
          </p>
        </div>
      </div>

      {/* Upload Area + Warning */}
      <div className="space-y-3">

        {/* your upload input UI here */}

        {showWarning && warningMessage && (
          <WarningNote message={warningMessage} />
        )}
      </div>
    </div>
  );
}
