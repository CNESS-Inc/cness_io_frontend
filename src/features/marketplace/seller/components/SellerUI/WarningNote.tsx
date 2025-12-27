import {Star} from "lucide-react"

interface WarningNoteProps {
  message: string;
  className?: string;
}

export default function WarningNote({ message, className = "" }: WarningNoteProps) {
  return (
    <div
      className={`bg-[#fff8d1] border border-[#e5c100] rounded-lg p-3 text-[13px] font-['open_sans'] font-semibold text-[#000000] flex items-start gap-2 ${className}`}
    >
      <span>
        <Star size={16} strokeWidth={2} stroke="#E9B500" fill="#E9B500"/>
      </span>
      <span>{message}</span>
    </div>
  );
}
