import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GetEnquiryById,
  // UpdateEnquiryStatus,
  EnquiryStatus,
} from "../Common/ServerAPI";
// import { useToast } from "../components/ui/Toast/ToastProvider";

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
function StatusBadge({ status }: { status: Enquiry["status"] }) {
  const map: Record<string, string> = {
    [EnquiryStatus.NEW]: "bg-blue-100 text-blue-700",
    [EnquiryStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [EnquiryStatus.CONTACTED]: "bg-indigo-100 text-indigo-700",
    [EnquiryStatus.IN_PROGRESS]: "bg-purple-100 text-purple-700",
    [EnquiryStatus.NOT_INTERESTED]: "bg-gray-100 text-gray-700",
    [EnquiryStatus.CLOSED]: "bg-green-100 text-green-700",
    [EnquiryStatus.CANCELLED]: "bg-red-100 text-red-700",
  };

  const normalized = String(status || "").trim();
  const classes = map[normalized] ?? "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-3 py-1 rounded-md text-sm font-semibold ${classes}`}
    >
      {normalized || "N/A"}
    </span>
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
  // const [localStatus, setLocalStatus] = useState<string>("");
  // const [updating, setUpdating] = useState(false);
  // const { showToast } = useToast();

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
        // setLocalStatus(data?.status || "");
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
  // const handleStatusUpdate = async () => {
  //   if (!enquiry || !localStatus || localStatus === enquiry.status) return;

  //   setUpdating(true);

  //   try {
  //     await UpdateEnquiryStatus({
  //       id: enquiry.id,
  //       status: localStatus,
  //     });

  //     setEnquiry({ ...enquiry, status: localStatus });

  //     showToast({
  //       message: `Status updated to '${localStatus}' successfully`,
  //       type: "success",
  //       duration: 5000,
  //     });

  //     if (typeof (window as any).refreshEnquiryCounts === "function") {
  //       (window as any).refreshEnquiryCounts();
  //     }

  //     window.dispatchEvent(new CustomEvent("enquiryStatusUpdated"));
  //   } catch (err: any) {
  //     showToast({
  //       message: err?.response?.data?.message || "Failed to update status",
  //       type: "error",
  //       duration: 5000,
  //     });
  //   } finally {
  //     setUpdating(false);
  //   }
  // };

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
            <h2 className="text-lg md:text-xl font-semibold truncate">{enquiry.name || "N/A"}</h2>
            <div className="text-xs md:text-sm text-gray-400 truncate">
              Received on{" "}
              {formatDate(
                enquiry.date ||
                enquiry.created_at ||
                enquiry.createdAt
              )}{" "}
              {formatTime(
                enquiry.time ||
                enquiry.created_at ||
                enquiry.createdAt
              ) && (
                  <>at {formatTime(enquiry.time || enquiry.created_at || enquiry.createdAt)}</>
                )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <StatusBadge status={enquiry.status} />
        </div>
      </div>

      {/* Body - Mobile Responsive Grid */}
      <div className="mt-5 bg-gray-50 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left box */}
        <div className="bg-gray-50 p-5 rounded-lg">
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
              <div className="text-gray-400 font-[poppins] text-xs">
                Email
              </div>
              <div className="text-[15px] font-medium break-all">{enquiry.email}</div>
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
        <div className="bg-gray-50 p-5 rounded-lg">
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
              <div className="text-[15px] font-medium font-[poppins]">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions - Mobile Responsive */}
      {/* <div className="mt-4 md:mt-6 flex flex-col items-start gap-4">
        <div className="w-full">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Update Status:
          </label>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full sm:w-auto flex-1"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={handleStatusUpdate}
              disabled={updating || localStatus === enquiry.status}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}