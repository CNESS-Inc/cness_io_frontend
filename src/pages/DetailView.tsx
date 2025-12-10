import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GetEnquiryById,
  UpdateEnquiryStatus,
  EnquiryStatus,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

export type Enquiry = {
  id: string;
  name: string;
  message: string;
  serviceType?: string;
  service_type?: string;
  date?: string;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
  time?: string;
  phone?: string;
  phone_number?: number | string;
  email: string;
  status: string;
  enquiry_services?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  [key: string]: any;
};

// Available statuses
export const STATUS_OPTIONS = [
  EnquiryStatus.NEW,
  EnquiryStatus.PENDING,
  EnquiryStatus.CONTACTED,
  EnquiryStatus.IN_PROGRESS,
  EnquiryStatus.NOT_INTERESTED,
  EnquiryStatus.CLOSED,
  EnquiryStatus.CANCELLED,
];

// ===============================
//  STATUS BADGE COMPONENT
// ===============================
function StatusBadgeDropdown({
  status,
  onStatusChange,
  updating = false,
}: {
  status: Enquiry["status"];
  onStatusChange: (newStatus: string) => void;
  updating?: boolean;
}) {
  const map: Record<string, string> = {
    [EnquiryStatus.NEW]: "bg-blue-100 text-blue-700 border-blue-300",
    [EnquiryStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-300",
    [EnquiryStatus.CONTACTED]:
      "bg-indigo-100 text-indigo-700 border-indigo-300",
    [EnquiryStatus.IN_PROGRESS]:
      "bg-purple-100 text-purple-700 border-purple-300",
    [EnquiryStatus.NOT_INTERESTED]: "bg-gray-100 text-gray-700 border-gray-300",
    [EnquiryStatus.CLOSED]: "bg-green-100 text-green-700 border-green-300",
    [EnquiryStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-300",
  };

  const normalized = String(status || "").trim();
  const classes =
    map[normalized] ?? "bg-gray-100 text-gray-700 border-gray-300";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!updating) {
      onStatusChange(e.target.value);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={normalized}
        onChange={handleChange}
        disabled={updating}
        className={`
          appearance-none px-3 py-1.5 rounded-md text-sm font-semibold 
          border pr-8 cursor-pointer transition-all duration-200
          hover:opacity-90 focus:outline-none focus:ring-0
          ${classes}
          ${updating ? "opacity-70 cursor-not-allowed" : "hover:shadow-sm"}
        `}
      >
        {STATUS_OPTIONS.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-white text-gray-900"
          >
            {option}
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        {updating ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

// ===============================
//  MAIN COMPONENT
// ===============================
export default function DetailViewDesigned() {
  const { id } = useParams<{ id: string }>();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  // Fetch enquiry info
  useEffect(() => {
    if (!id) {
      setError("Enquiry ID is required");
      setLoading(false);
      return;
    }

    const fetchEnquiry = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await GetEnquiryById(id);
        const data = response?.data?.data || response?.data || response;

        setEnquiry(data);
        setLocalStatus(data?.status || "");
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.error?.message ||
          err?.response?.data?.success?.message ||
          err?.message ||
          "Failed to fetch enquiry";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, [id]);

  // Update Status
  const handleStatusUpdate = async (newStatus: string) => {
    if (!enquiry || !newStatus || newStatus === enquiry.status) return;

    setUpdating(true);

    try {
      await UpdateEnquiryStatus({
        id: enquiry.id,
        status: newStatus,
      });

      // Update local state
      setEnquiry({ ...enquiry, status: newStatus });
      setLocalStatus(newStatus);

      showToast({
        message: `Status updated to '${newStatus}' successfully`,
        type: "success",
        duration: 5000,
      });

      // Refresh counts if function exists
      if (typeof (window as any).refreshEnquiryCounts === "function") {
        (window as any).refreshEnquiryCounts();
      }

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent("enquiryStatusUpdated"));
    } catch (err: any) {
      // Revert to previous status on error
      setLocalStatus(enquiry.status);

      showToast({
        message: err?.response?.data?.message || "Failed to update status",
        type: "error",
        duration: 5000,
      });
    } finally {
      setUpdating(false);
    }
  };

  // Handle status change from dropdown
  const handleStatusChange = (newStatus: string) => {
    if (newStatus !== enquiry?.status) {
      handleStatusUpdate(newStatus);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleTimeString();
    } catch {
      return "";
    }
  };

  // ===============================
  //  UI STATES
  // ===============================
  if (loading) {
    return (
      <div className="bg-white mx-auto p-4 md:p-6">
        <div className="text-center py-8">Loading enquiry details...</div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="bg-white mx-auto p-4 md:p-6">
        <div className="text-center py-8 text-red-600">
          {error || "Enquiry not found"}
        </div>
      </div>
    );
  }

  // ===============================
  //  MAIN UI
  // ===============================
  return (
    <div className="bg-white max-w-7xl mx-auto px-4 py-5">
      {/* Header */}
      <h1 className="font-[poppins] text-xl mb-3 font-semibold">Overview</h1>

      {/* Header Card - Mobile Responsive Layout */}
      <div className="border-b border-b-[#E5E5E5] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
          <img
            src="/images/build-your-dream/user.png"
            alt="avatar"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold truncate">
              {enquiry.name || "N/A"}
            </h2>
            <div className="text-xs md:text-sm text-gray-400 truncate">
              Received on{" "}
              {formatDate(
                enquiry.date || enquiry.created_at || enquiry.createdAt
              )}{" "}
              {formatTime(
                enquiry.time || enquiry.created_at || enquiry.createdAt
              ) && (
                <>
                  at{" "}
                  {formatTime(
                    enquiry.time || enquiry.created_at || enquiry.createdAt
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge Dropdown */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center gap-2">
          {/* <span className="text-sm text-gray-600 font-medium hidden sm:inline">Status:</span> */}
          <StatusBadgeDropdown
            status={localStatus}
            onStatusChange={handleStatusChange}
            updating={updating}
          />
        </div>
      </div>

      {/* Body - Mobile Responsive Grid */}
      <div className="mt-5 bg-[#F9F9F9] rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left box */}
        <div className="bg-[#F9F9F9] p-5 rounded-lg">
          <h3 className="text-sm font-[poppins] font-semibold mb-3 md:mb-4">
            Basic Information
          </h3>

          <div className="text-sm text-gray-700 space-y-3 md:space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Service
              </div>
              <div className="text-[15px] font-medium wrap-break-word">
                {enquiry.enquiry_services?.map((s) => s.name).join(", ") ||
                  enquiry.serviceType ||
                  enquiry.service_type ||
                  "N/A"}
              </div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Contact
              </div>
              <div className="text-[15px] font-medium">
                {enquiry.phone || enquiry.phone_number || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Email</div>
              <div className="text-[15px] font-medium break-all">
                {enquiry.email}
              </div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Message
              </div>
              <div className="text-[15px] font-medium leading-relaxed wrap-break-word whitespace-pre-wrap">
                {enquiry.message}
              </div>
            </div>
          </div>
        </div>

        {/* Right box */}
        <div className="bg-[#F9F9F9] p-5 rounded-lg">
          <h3 className="text-[16px] font-[poppins] font-semibold mb-3">
            Service Details
          </h3>

          <div className="text-sm text-gray-700 space-y-3 md:space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Customer Type
              </div>
              <div className="text-[15px] font-medium">Individual</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Location
              </div>
              <div className=" text-[15px]font-medium">New York</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Urgency
              </div>
              <div className="text-[15px] font-medium font-[poppins]">
                This Week
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
