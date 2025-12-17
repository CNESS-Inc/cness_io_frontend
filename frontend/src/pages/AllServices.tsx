import React, { useEffect, useState } from "react";
import { GetDirectoryByServices } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useLocation } from "react-router-dom";

interface Service {
  id: number;
  bussiness_name: string;
  logo_url: string;
  rating_average: number;
  responseTime?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Reusable Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push('ellipsis-start');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || isLoading) {
      return;
    }
    onPageChange(page);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base shadow-sm"
        aria-label="Previous page"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span
                key={`${page}-${index}`}
                className="px-2 sm:px-3 py-2 text-gray-400 text-sm sm:text-base"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              className={`px-3 sm:px-4 py-2 rounded-lg border transition-all font-medium text-sm sm:text-base shadow-sm ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } disabled:cursor-not-allowed`}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base shadow-sm"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>
    </div>
  );
};

const AllServices: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();

  const passedServices = location.state?.services || [];
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const getBasicInfoServices = async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await GetDirectoryByServices(passedServices, page, limit);
      console.log(response);

      if (response?.success?.status) {
        const data = response?.data?.data;
        setServices(data?.rows || []);
        
        // Update pagination info
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(data?.count / limit),
          totalItems: data?.count || 0,
          itemsPerPage: limit,
        });
      } else {
        showToast({
          message: response?.error?.message || "Something wrong!",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.log(error);
      showToast({
        message: error?.response?.data?.error?.message || "Something went wrong!",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBasicInfoServices();
  }, []);

  const handlePageChange = (page: number) => {
    getBasicInfoServices(page, pagination.itemsPerPage);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold font-[poppins] text-[#1A1A1A]">
            All Services
          </h1>
          {pagination.totalItems > 0 && (
            <p className="text-sm text-gray-600 font-[poppins]">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} services
            </p>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-32 sm:h-40 bg-gray-200"></div>
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {services.map((service: Service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* Service Image */}
                  <div className="relative h-32 sm:h-40 overflow-hidden">
                    <img
                      src={service.logo_url}
                      alt={service.bussiness_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Service Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-[Poppins] font-medium text-sm sm:text-base text-[#1A1A1A] mb-2 line-clamp-1">
                      {service.bussiness_name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            star <= Math.floor(service.rating_average)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 fill-current"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-xs sm:text-sm font-[Poppins] text-[#4C4F64] ml-1">
                        {service.rating_average}
                      </span>
                    </div>

                    {/* Response Time */}
                    <p className="text-[10px] sm:text-xs font-[Poppins] text-[#777A8C]">
                      Responds in {service.responseTime || '20 min'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-600 text-center max-w-md">
              We couldn't find any services matching your criteria. Please try again later.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#F8F9FC] border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#7077FE] to-[#F07EFF] rounded-lg"></div>
                <span className="font-[Poppins] font-semibold text-base sm:text-lg">
                  cness
                </span>
              </div>
              <p className="text-xs sm:text-sm font-[Poppins] text-[#777A8C] leading-relaxed">
                CNESS is a consciousness-based certification and growth platform
                designed to empower purpose-driven individuals and organizations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-[Poppins] font-semibold text-sm sm:text-base mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/dashboard"
                    className="text-xs sm:text-sm font-[Poppins] text-[#777A8C] hover:text-[#7077FE] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/directory"
                    className="text-xs sm:text-sm font-[Poppins] text-[#777A8C] hover:text-[#7077FE] transition-colors"
                  >
                    Directory
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/certification"
                    className="text-xs sm:text-sm font-[Poppins] text-[#777A8C] hover:text-[#7077FE] transition-colors"
                  >
                    Certification
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-xs sm:text-sm font-[Poppins] text-[#777A8C] hover:text-[#7077FE] transition-colors"
                  >
                    Career
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-[Poppins] font-semibold text-sm sm:text-base mb-4">
                Follow Us
              </h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7077FE]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7077FE]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7077FE]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#7077FE]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm font-[Poppins] text-[#777A8C]">
              Copyright © 2025 | Terms & Conditions | Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllServices;