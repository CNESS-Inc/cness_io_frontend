import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH } from "react-icons/fa";
import { PiClockCounterClockwise, PiFilesLight } from "react-icons/pi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export type Enquiry = {
  id: number;
  name: string;
  message: string;
  serviceType: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status: "pending" | "completed";
};

const sampleData: Enquiry[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: "James Anderson",
  message:
    "Custom message from customer — would like a table near window, party of 4. Please confirm availability and menu options.",
  serviceType: "Dining",
  date: "2023-12-12",
  time: "12:00 AM",
  phone: "+1 98388393",
  email: "James@gmail.com",
  status: i % 3 === 0 ? "pending" : "completed",
}));

export default function MyEnquiry() {
  const navigate = useNavigate();
  const enquiries = sampleData;
  const total = enquiries.length;
  const pending = enquiries.filter((e) => e.status === "pending").length;
  const completed = enquiries.filter((e) => e.status === "completed").length;

  return (
    <div className="p-4 sm:p-6 lg:p-3">
      {/* Header cards */}
      <div className="grid grid-cols-1 font-[poppins] sm:grid-cols-3 gap-4 mb-6">
        <Card title="Total Inquiry" value={total} icon={<PiFilesLight size={20} />} />
        <Card title="Pending" value={pending} icon={<PiClockCounterClockwise size={20} />} variant="warning" />
        <Card title="Completed" value={completed} icon={<IoIosCheckmarkCircleOutline size={20} />} variant="success" />
      </div>

      {/* Enquiries section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-3">
          <h3 className="text-lg font-semibold font-[poppins]">Enquiries</h3>
        </div>

        {/* Table for md+ screens */}
        <div className="hidden md:block">
          <div className="overflow-x-auto px-4 rounded-lg">
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
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{e.id}</td>
                    <td className="px-4 py-3 font-medium">{e.name}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{e.message}</td>
                    <td className="px-4 py-3">{e.serviceType}</td>
                    <td className="px-4 py-3">{e.date}</td>
                    <td className="px-4 py-3">{e.time}</td>
                    <td className="px-4 py-3">{e.phone}</td>
                    <td className="px-4 py-3">{e.email}</td>
                    <td className="px-4 py-3 text-right">
                      {/* navigate using react-router */}
                      <button
                        aria-label="actions"
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => navigate(`/dashboard/detail-view/${e.id}`)}
                      >
                        <FaEllipsisH size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile list for small screens */}
        <div className="md:hidden divide-y">
          {enquiries.map((e) => (
            <div key={e.id} className="px-4 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{e.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{e.serviceType}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{e.message}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{e.date}</div>
                  <div className="text-xs text-gray-500">{e.time}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{e.phone}</span>
                  <span>|</span>
                  <span>{e.email}</span>
                </div>
                <button
                  className="p-1 rounded hover:bg-gray-100"
                  onClick={() => navigate(`/detail-view/${e.id}`)}
                >
                  <FaEllipsisH size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
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
