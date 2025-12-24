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
    <div
      className="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
        
      "
    >
      {/* LEFT: Icon + Title */}
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className="
              w-9 h-9 sm:w-12 sm:h-12
              flex items-center justify-center
             
            "
          >
            {icon}
          </div>
        )}

        <h2
          className="
            font-[Poppins]
            text-[18px] sm:text-[20px]
            font-medium
            text-[#080f20]
          "
        >
          {title}
        </h2>
      </div>

      {/* RIGHT: Pagination */}
      {totalPages > 1 && (
        <div
          className="
            self-start sm:self-auto
            flex items-center gap-2
            px-3 py-1.5
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
              w-8 h-8 sm:w-7 sm:h-7
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
          <span className="text-[13px] sm:text-[14px] font-medium text-[#080F20]">
            {currentPage}/{totalPages}
          </span>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className="
              flex items-center justify-center
              w-8 h-8 sm:w-7 sm:h-7
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
