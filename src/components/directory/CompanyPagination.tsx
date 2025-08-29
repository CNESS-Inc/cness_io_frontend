'use client';

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

interface PaginationProps {
  pagination: PaginationData;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  align?: "center" | "end";
}

export default function Pagination({
  pagination,
  isLoading = false,
  onPageChange,
  align = "end",
}: PaginationProps) {
  if (pagination.totalPages <= 0) return null;

  const go = (p: number) => {
    if (p < 1 || p > pagination.totalPages || isLoading) return;
    onPageChange(p);
  };

  return (
    <div className="mt-8">
      <div
        className={
          "flex " + (align === "center" ? "justify-center" : "justify-end")
        }
      >
        <nav
          className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
          aria-label="Pagination"
        >
          <button
            onClick={() => go(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1 || isLoading}
            className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          >
            «
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => go(page)}
                disabled={isLoading}
                className={`px-3 py-1 border border-gray-300 ${
                  page === pagination.currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => go(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || isLoading}
            className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
          >
            »
          </button>
        </nav>
      </div>
    </div>
  );
}
