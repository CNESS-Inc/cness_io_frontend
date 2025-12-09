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
  [key: string]: any;
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchEnquiryCounts = async () => {
    try {
      const response = await GetEnquiryCount();
      const countData = response?.data?.data?.data || response?.data?.data || response?.data;
      setCounts({
        total: countData?.total || 0,
        pending: countData?.pending || 0,
        completed: countData?.completed || 0,
      });
    } catch (err: any) {
      console.error("Failed to fetch enquiry counts:", err);
    }
  };

  const fetchEnquiries = async (page: number = pagination.page_no, limit: number = pagination.limit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await GetAllMyEnquiries({ page_no: page, limit });
      
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
    fetchEnquiryCounts();
  }, []);

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

  const refreshCounts = () => {
    fetchEnquiryCounts();
  };

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
      // Use shorter format for mobile
      if (isMobile) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    try {
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
      <div className="p-4">
        <div className="text-center py-8">Loading enquiries...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-3">
      {/* Header cards - Stack on mobile, grid on tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card title="Total Inquiry" value={counts.total} icon={<PiFilesLight size={20} />} />
        <Card title="Pending" value={counts.pending} icon={<PiClockCounterClockwise size={20} />} variant="warning" />
        <Card title="Completed" value={counts.completed} icon={<IoIosCheckmarkCircleOutline size={20} />} variant="success" />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Enquiries section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-3 py-3 md:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold font-[poppins]">Enquiries</h3>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Items per page:</label>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-xs sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Table for medium+ screens */}
        <div className="hidden md:block">
          <div className="overflow-x-auto px-4 rounded-lg">
            <table className="min-w-full border rounded-lg border-[#DADADA] font-[poppins] text-sm">
              <thead className="bg-[#F3F2FF]">
                <tr className="text-left border border-[#DADADA] text-gray-600">
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
                        <td className="px-4 py-3 font-medium whitespace-nowrap">{e.name || "N/A"}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{e.message || "N/A"}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{serviceNames}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatDate(e.date || e.createdAt || e.created_at)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{formatTime(e.time || e.createdAt || e.created_at)}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{e.phone || e.phone_number || "N/A"}</td>
                        <td className="px-4 py-3 truncate max-w-[150px]">{e.email || "N/A"}</td>
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

        {/* Tablet view (smaller table) */}
        <div className="hidden sm:block md:hidden">
          <div className="overflow-x-auto px-3">
            <table className="min-w-full border rounded-lg border-[#DADADA] font-[poppins] text-sm">
              <thead className="bg-[#F3F2FF]">
                <tr className="text-left border border-[#DADADA] text-gray-600">
                  <th className="px-3 py-2 font-normal">#</th>
                  <th className="px-3 py-2 font-normal">Name</th>
                  <th className="px-3 py-2 font-normal">Service</th>
                  <th className="px-3 py-2 font-normal">Date/Time</th>
                  <th className="px-3 py-2 font-normal w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  enquiries.map((e, index) => {
                    const serviceNames = e.enquiry_services?.map(s => s.name).join(", ") || e.serviceType || e.service_type || "N/A";
                    const truncatedService = serviceNames.length > 20 ? serviceNames.substring(0, 20) + '...' : serviceNames;
                    return (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-center">{(pagination.page_no - 1) * pagination.limit + index + 1}</td>
                        <td className="px-3 py-2 font-medium">{e.name || "N/A"}</td>
                        <td className="px-3 py-2 truncate max-w-[120px]" title={serviceNames}>
                          {truncatedService}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <div>{formatDate(e.date || e.createdAt || e.created_at)}</div>
                          <div className="text-gray-500">{formatTime(e.time || e.createdAt || e.created_at)}</div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            aria-label="actions"
                            className="p-1 rounded hover:bg-gray-100 mx-auto"
                            onClick={() => navigate(`/dashboard/detail-view/${e.id}`)}
                          >
                            <FaEllipsisH size={16} />
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
        <div className="sm:hidden divide-y">
          {enquiries.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No enquiries found</div>
          ) : (
            enquiries.map((e, index) => {
              const serviceNames = e.enquiry_services?.map(s => s.name).join(", ") || e.serviceType || e.service_type || "N/A";
              return (
                <div key={e.id} className="px-3 py-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{e.name || "N/A"}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{formatDate(e.date || e.createdAt || e.created_at)}</span>
                        <span>•</span>
                        <span>{formatTime(e.time || e.createdAt || e.created_at)}</span>
                      </div>
                    </div>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 ml-2"
                      onClick={() => navigate(`/dashboard/detail-view/${e.id}`)}
                    >
                      <FaEllipsisH size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Service type */}
                  <div className="mb-3">
                    <span className="inline-block text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                      {serviceNames}
                    </span>
                  </div>

                  {/* Message preview */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {e.message || "No message provided"}
                    </p>
                  </div>

                  {/* Contact info */}
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    {e.phone || e.phone_number ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        <span className="truncate">{e.phone || e.phone_number}</span>
                      </div>
                    ) : null}
                    
                    {e.email ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span className="truncate">{e.email}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination - Responsive */}
        {pagination.total_pages > 1 && (
          <div className="px-3 md:px-4 py-4 md:py-6 border-t bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results info */}
              <div className="text-xs sm:text-sm text-gray-600 font-[poppins] whitespace-nowrap">
                Showing <span className="font-semibold text-gray-800">{(pagination.page_no - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-semibold text-gray-800">{Math.min(pagination.page_no * pagination.limit, pagination.total)}</span> of{" "}
                <span className="font-semibold text-gray-800">{pagination.total}</span>
              </div>
              
              {/* Pagination controls */}
              <div className="flex flex-col xs:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Page numbers - Simplified for mobile */}
                <div className="flex items-center gap-1 order-2 xs:order-1">
                  {(() => {
                    const totalPages = pagination.total_pages;
                    const currentPage = pagination.page_no;
                    
                    // Show simplified pagination on mobile
                    if (isMobile) {
                      return (
                        <>
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="min-w-9 h-9 px-2 text-xs font-medium rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PiCaretLeft size={14} />
                          </button>
                          
                          <div className="px-2 text-sm font-medium">
                            {currentPage} / {totalPages}
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="min-w-9 h-9 px-2 text-xs font-medium rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <PiCaretRight size={14} />
                          </button>
                        </>
                      );
                    }

                    // Original pagination for larger screens
                    const maxVisible = 5;
                    const pages: (number | string)[] = [];

                    if (totalPages <= maxVisible) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      pages.push(1);
                      if (currentPage <= 3) {
                        for (let i = 2; i <= 4; i++) {
                          pages.push(i);
                        }
                        pages.push('...');
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 2) {
                        pages.push('...');
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
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
                          <span key={`ellipsis-${index}`} className="px-1 text-gray-500">
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
                          className={`min-w-9 h-9 px-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
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

                {/* Navigation buttons - For larger screens */}
                {!isMobile && (
                  <div className="flex items-center gap-2 order-1 xs:order-2">
                    <button
                      onClick={() => handlePageChange(pagination.page_no - 1)}
                      disabled={pagination.page_no === 1}
                      className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <PiCaretLeft size={16} />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <button
                      onClick={() => handlePageChange(pagination.page_no + 1)}
                      disabled={pagination.page_no >= pagination.total_pages}
                      className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <PiCaretRight size={16} />
                    </button>
                  </div>
                )}
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
    <div className={`bg-white rounded-xl p-4 sm:p-5 lg:p-6 flex items-center justify-between ${s.ring} border border-transparent`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${s.bg} ${s.icon}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs sm:text-sm text-gray-400">{title}</div>
          <div className="text-xl sm:text-2xl font-semibold text-gray-800">{value}</div>
        </div>
      </div>
    </div>
  );
}