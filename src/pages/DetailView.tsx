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
  const handleStatusUpdate = async () => {
    if (!enquiry || !localStatus || localStatus === enquiry.status) return;

    setUpdating(true);

    try {
      await UpdateEnquiryStatus({
        id: enquiry.id,
        status: localStatus,
      });

      setEnquiry({ ...enquiry, status: localStatus });

      showToast({
        message: `Status updated to '${localStatus}' successfully`,
        type: "success",
        duration: 5000,
      });

      if (typeof (window as any).refreshEnquiryCounts === "function") {
        (window as any).refreshEnquiryCounts();
      }

      window.dispatchEvent(new CustomEvent("enquiryStatusUpdated"));
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.message || "Failed to update status",
        type: "error",
        duration: 5000,
      });
    } finally {
      setUpdating(false);
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
      <div className="bg-white max-w-5xl mx-auto p-6">
        <div className="text-center py-8">Loading enquiry details...</div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="bg-white max-w-5xl mx-auto p-6">
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
    <div className="bg-white max-w-5xl mx-auto p-6">
      {/* Header */}
      <h1 className="font-[poppins] text-2xl mb-3 font-semibold">Overview</h1>

      <div className="rounded-lg shadow-sm p-6 flex items-center justify-between gap-4">
        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <img
            src="/images/build-your-dream/user.png"
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div>
            <h2 className="text-xl font-semibold">{enquiry.name || "N/A"}</h2>

            <div className="text-sm text-gray-400">
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
        <StatusBadge status={enquiry.status} />
      </div>

      {/* Body */}
      <div className="mt-6 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left box */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-[poppins] font-semibold mb-4">
            Basic Information
          </h3>

          <div className="text-sm text-gray-700 space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Service
              </div>
              <div className="font-medium">
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
              <div className="font-medium">
                {enquiry.phone || enquiry.phone_number || "N/A"}
              </div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Email
              </div>
              <div className="font-medium">{enquiry.email}</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Message
              </div>
              <div className="font-medium leading-relaxed">
                {enquiry.message}
              </div>
            </div>
          </div>
        </div>

        {/* Right box */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-[poppins] font-semibold mb-4">
            Service Details
          </h3>

          <div className="text-sm text-gray-700 space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Customer Type
              </div>
              <div className="font-medium">Individual</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Location
              </div>
              <div className="font-medium">New York</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">
                Urgency
              </div>
              <div className="font-medium font-[poppins]">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Update Status:
          </label>

          <select
            value={localStatus}
            onChange={(e) => setLocalStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
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
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
