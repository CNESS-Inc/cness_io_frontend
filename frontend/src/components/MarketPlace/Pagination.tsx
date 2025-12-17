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
    <div className="flex items-center justify-center gap-[10px] mt-8">
      {/* Prev Button */}
      <button
        className={`flex items-center justify-center gap-[3px] w-[100px] h-[48px] rounded-[4px] border text-sm font-semibold transition-all
          ${
            currentPage === 1
              ? "text-[#7077FE] border-[#7077FE] bg-white opacity-50 cursor-not-allowed"
              : "text-white bg-[#7077FE] border-[#7077FE] hover:bg-[#5A5EEB]"
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
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center font-semibold transition-all duration-200 
              ${
                isActive
                  ? "bg-[#7077FE] text-white w-[48px] h-[48px] rounded-[4px] border border-[#7077FE]"
                  : "bg-white text-[#242E3A] w-[30px] h-[30px] rounded-[4px] border border-gray-300 hover:bg-[#7077FE]/10"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        className={`flex items-center justify-center gap-[3px] w-[100px] h-[48px] rounded-[4px] border text-sm font-semibold transition-all
          ${
            currentPage === totalPages
              ? "text-[#7077FE] border-[#7077FE] bg-white opacity-50 cursor-not-allowed"
              : "text-white bg-[#7077FE] border-[#7077FE] hover:bg-[#5A5EEB]"
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
