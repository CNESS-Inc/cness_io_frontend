import type { ReactNode } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface ProductLabelProps {
  title: string;
  icon?: ReactNode;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function ProductLabel({
  title,
  icon,
  currentPage,
  totalItems,
  itemsPerPage,
  onPrev,
  onNext,
}: ProductLabelProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 ">
      
      {/* LEFT: Icon + Title */}
      <div className="flex items-center -space-x-1">
        {icon && (
          <div className="w-12 h-12 flex items-center justify-center  text-[#F07EFF]">
            {icon}
          </div>
        )}

        <h2 className="font-[Poppins] text-[20px] font-medium text-[#080f20]">
          {title}
        </h2>
      </div>

      {/* RIGHT: Pagination */}
      {totalPages > 1 && (
     <div
    className="
      flex items-center gap-[10px]
      px-[12px] py-[5px]
      rounded-full
      border border-[#CBD5E1]
      bg-white
    "
  >
    {/* Prev */}
    <button
      onClick={onPrev}
      disabled={currentPage === 1}
      className="
        flex items-center justify-center
        w-[24px] h-[24px]
        rounded-full
        text-[#6366F1]
        hover:bg-[#F1F3FF]
        disabled:opacity-40
        disabled:hover:bg-transparent
      "
    >
      <ArrowLeft size={16} />
    </button>

    {/* Page text */}
    <span className="text-[14px] font-medium text-[#080F20]">
      {currentPage}/{totalPages}
    </span>

    {/* Next */}
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="
        flex items-center justify-center
        w-[24px] h-[24px]
        rounded-full
        text-[#6366F1]
        hover:bg-[#F1F3FF]
        disabled:opacity-40
        disabled:hover:bg-transparent
      "
    >
      <ArrowRight size={16} />
    </button>
  </div>
      )}
    </div>
  );
}
