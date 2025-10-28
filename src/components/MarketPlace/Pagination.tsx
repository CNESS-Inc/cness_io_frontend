import React from "react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 4,
  onPageChange = () => {},
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {/* Prev Button */}
      <button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
          currentPage === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-[#7077FE] border-[#7077FE] hover:bg-[#7077FE]/10"
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img
          src="https://static.codia.ai/image/2025-10-25/mhYjsrHxgA.png"
          alt="Previous"
          className="w-4 h-4"
        />
        <span>Prev</span>
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1.5 rounded-lg text-sm border ${
            page === currentPage
              ? "bg-[#7077FE] text-white border-[#7077FE]"
              : "border-gray-300 text-gray-700 hover:bg-[#7077FE]/10"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed"
            : "text-[#7077FE] border-[#7077FE] hover:bg-[#7077FE]/10"
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <img
          src="https://static.codia.ai/image/2025-10-25/F7PRofrqdg.png"
          alt="Next"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default Pagination;
