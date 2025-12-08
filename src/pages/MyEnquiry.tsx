import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH } from "react-icons/fa";
import { PiClockCounterClockwise, PiFilesLight, PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { GetAllMyEnquiries, GetEnquiryCount } from "../Common/ServerAPI";

export type Enquiry = {
  id: string;
  name: string;
  message: string;
  serviceType?: string;
  service_type?: string;
  date?: string;
  time?: string;
  phone?: string;
  phone_number?: number | string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  enquiry_services?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  [key: string]: any; // Allow additional fields from API
};

export default function MyEnquiry() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });
  const [pagination, setPagination] = useState({
    page_no: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const fetchEnquiryCounts = async () => {
    try {
      const response = await GetEnquiryCount();
      // Handle response structure: response.data.data.data
      const countData = response?.data?.data?.data || response?.data?.data || response?.data;
      setCounts({
        total: countData?.total || 0,
        pending: countData?.pending || 0,
        completed: countData?.completed || 0,
      });
    } catch (err: any) {
      console.error("Failed to fetch enquiry counts:", err);
      // Don't show error toast for counts, just log it
    }
  };

  const fetchEnquiries = async (page: number = pagination.page_no, limit: number = pagination.limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetAllMyEnquiries({ page_no: page, limit });
      
      // Handle response structure: response.data.data.data.rows
      const enquiryData = response?.data?.data?.data || response?.data?.data || response?.data;
      const enquiriesList = enquiryData?.rows || [];
      const totalCount = enquiryData?.count || 0;

      setEnquiries(enquiriesList);
      setPagination({
        page_no: page,
        limit: limit,
        total: totalCount,
        total_pages: Math.ceil(totalCount / limit) || 1,
      });
      
      // Refresh counts after fetching enquiries
      await fetchEnquiryCounts();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error?.message || 
                          err?.response?.data?.success?.message || 
                          err?.message || 
                          "Failed to fetch enquiries";
      setError(errorMessage);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(1, 10);
    // fetchEnquiryCounts is called inside fetchEnquiries, but we also call it separately
    // to ensure counts are loaded even if enquiries fetch fails
    fetchEnquiryCounts();
  }, []);

  // Listen for focus events and custom events to refresh counts
  useEffect(() => {
    const handleFocus = () => {
      fetchEnquiryCounts();
    };
    const handleStatusUpdate = () => {
      fetchEnquiryCounts();
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('enquiryStatusUpdated', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('enquiryStatusUpdated', handleStatusUpdate);
    };
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchEnquiries(newPage, pagination.limit);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    fetchEnquiries(1, newLimit);
  };

  // Refresh counts when component becomes visible (e.g., after status update in DetailView)
  const refreshCounts = () => {
    fetchEnquiryCounts();
  };

  // Expose refresh function to window for external calls (e.g., from DetailView)
  useEffect(() => {
    (window as any).refreshEnquiryCounts = refreshCounts;
    return () => {
      delete (window as any).refreshEnquiryCounts;
    };
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    try {
      // If it's a full date string, extract time
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  if (loading && enquiries.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-3">
        <div className="text-center py-8">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-3">
      {/* Header cards */}
      <div className="grid grid-cols-1 font-[poppins] sm:grid-cols-3 gap-4 mb-6">
        <Card title="Total Inquiry" value={counts.total} icon={<PiFilesLight size={20} />} />
        <Card title="Pending" value={counts.pending} icon={<PiClockCounterClockwise size={20} />} variant="warning" />
        <Card title="Completed" value={counts.completed} icon={<IoIosCheckmarkCircleOutline size={20} />} variant="success" />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Enquiries section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold font-[poppins]">Enquiries</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Items per page:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table for md+ screens */}
        <div className="hidden md:block">
          <div className="overflow-x-auto px-4 mb-3 rounded-lg">
            <table className="min-w-full border rounded-lg border-[#DADADA] font-[poppins] text-sm">
              <thead className="bg-[#F3F2FF]">
                <tr className="text-left font-[poppins] border border-[#DADADA] text-gray-600">
                  <th className="px-4 py-3 font-normal">Sl No</th>
                  <th className="px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Message</th>
                  <th className="px-4 py-3 font-normal">Service Type</th>
                  <th className="px-4 py-3 font-normal">Date</th>
                  <th className="px-4 py-3 font-normal">Time</th>
                  <th className="px-4 py-3 font-normal">Phone</th>
                  <th className="px-4 py-3 font-normal">Email</th>
                  <th className="px-4 py-3 w-12 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  enquiries.map((e, index) => {
                    const serviceNames = e.enquiry_services?.map(s => s.name).join(", ") || e.serviceType || e.service_type || "N/A";
                    return (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{(pagination.page_no - 1) * pagination.limit + index + 1}</td>
                        <td className="px-4 py-3 font-medium">{e.name || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{e.message || "N/A"}</td>
                        <td className="px-4 py-3">{serviceNames}</td>
                        <td className="px-4 py-3">{formatDate(e.date || e.createdAt || e.created_at)}</td>
                        <td className="px-4 py-3">{formatTime(e.time || e.createdAt || e.created_at)}</td>
                        <td className="px-4 py-3">{e.phone || e.phone_number || "N/A"}</td>
                        <td className="px-4 py-3">{e.email || "N/A"}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            aria-label="actions"
                            className="p-1 rounded hover:bg-gray-100"
                            onClick={() => navigate(`/dashboard/detail-view/${e.id}`)}
                          >
                            <FaEllipsisH size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile list for small screens */}
        <div className="md:hidden divide-y">
          {enquiries.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No enquiries found</div>
          ) : (
            enquiries.map((e) => {
              const serviceNames = e.enquiry_services?.map(s => s.name).join(", ") || e.serviceType || e.service_type || "N/A";
              return (
                <div key={e.id} className="px-4 py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{e.name || "N/A"}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {serviceNames}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{e.message || "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{formatDate(e.date || e.createdAt || e.created_at)}</div>
                      {(e.time || e.createdAt || e.created_at) && (
                        <div className="text-xs text-gray-500">{formatTime(e.time || e.createdAt || e.created_at)}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{e.phone || e.phone_number || "N/A"}</span>
                      <span>|</span>
                      <span>{e.email || "N/A"}</span>
                    </div>
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      onClick={() => navigate(`/dashboard/detail-view/${e.id}`)}
                    >
                      <FaEllipsisH size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-4 py-6 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results info */}
              <div className="text-sm text-gray-600 font-[poppins]">
                Showing <span className="font-semibold text-gray-800">{(pagination.page_no - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-semibold text-gray-800">{Math.min(pagination.page_no * pagination.limit, pagination.total)}</span> of{" "}
                <span className="font-semibold text-gray-800">{pagination.total}</span> enquiries
              </div>
              
              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(pagination.page_no - 1)}
                  disabled={pagination.page_no === 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                >
                  <PiCaretLeft size={18} />
                  <span>Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const totalPages = pagination.total_pages;
                    const currentPage = pagination.page_no;
                    const maxVisible = 5;
                    const pages: (number | string)[] = [];

                    if (totalPages <= maxVisible) {
                      // Show all pages if total is 5 or less
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // Always show first page
                      pages.push(1);

                      if (currentPage <= 3) {
                        // Near the start
                        for (let i = 2; i <= 4; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        // Near the end
                        pages.push('...');
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // In the middle
                        pages.push('...');
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      }
                    }

                    return pages.map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }

                      const pageNum = page as number;
                      const isActive = pageNum === currentPage;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 font-semibold"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(pagination.page_no + 1)}
                  disabled={pagination.page_no >= pagination.total_pages}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                >
                  <span>Next</span>
                  <PiCaretRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  variant = "default",
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  variant?: "default" | "warning" | "success";
}) {
  const styles: Record<string, { ring: string; bg: string; icon: string }> = {
    default: { ring: "ring-1 ring-indigo-100", bg: "bg-indigo-50", icon: "text-indigo-600" },
    warning: { ring: "ring-1 ring-red-100", bg: "bg-red-50", icon: "text-red-600" },
    success: { ring: "ring-1 ring-green-100", bg: "bg-green-50", icon: "text-green-600" },
  };
  const s = styles[variant] || styles.default;

  return (
    <div className={`bg-white rounded-xl p-6 flex items-center justify-between ${s.ring} border border-transparent`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.icon}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-400">{title}</div>
          <div className="text-2xl text-center font-semibold text-gray-800">{value}</div>
        </div>
      </div>
      <div />
    </div>
  );
}
