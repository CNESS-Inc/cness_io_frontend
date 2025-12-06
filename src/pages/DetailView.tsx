import  { useEffect, useState } from "react";

export type Enquiry = {
  id: number;
  name: string;
  message: string;
  serviceType: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  status:
    | "New"
    | "Pending"
    | "Contacted"
    | "In Progress"
    | "Not Interested"
    | "Closed"
    | "Cancelled";
};

export const STATUS_OPTIONS: Enquiry["status"][] = [
  "New",
  "Pending",
  "Contacted",
  "In Progress",
  "Not Interested",
  "Closed",
  "Cancelled",
];

const sampleData: Enquiry[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: "James Anderson",
  message:
    "Hello, I would like to know more about this service. Please provide pricing, availability, and any additional information required to proceed.",
  serviceType: "Dining",
  date: "2024-12-12",
  time: "12:00 AM",
  phone: "+1 98388393",
  email: "James@gmail.com",
  status: i % 3 === 0 ? "Pending" : "New",
}));

export default function DetailViewDesigned() {
  const [id, setId] = useState<number | null>(1);
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    // read id from url (if present) — fallback to 1
    function readIdFromLocation(): number | null {
      try {
        const path = window.location.pathname; // /detail/3
        const parts = path.split("/").filter(Boolean);
        const last = parts[parts.length - 1];
        const n = Number(last);
        return Number.isNaN(n) ? 1 : n;
      } catch {
        return 1;
      }
    }
    setId(readIdFromLocation());
  }, []);

  useEffect(() => {
    if (id == null) return;
    const found = sampleData.find((x) => x.id === id) ?? sampleData[0];
    setEnquiry(found);
  }, [id]);

//   function handleBack() {
//     window.history.back();
//   }
//   function handleSave() {
//     if (!enquiry) return;
//     setEnquiry({ ...enquiry, status: localStatus as Enquiry["status"] });
//     alert(`Saved status '${localStatus}' for enquiry #${enquiry.id} (demo only)`);
//   }

  if (!enquiry) return null;

  return (
    <div className="bg-white max-w-5xl mx-auto p-6">
      {/* Header */}
<h1 className="font-[poppins] text-2xl mb-3 font-semibold">Overview</h1>
      <div className="rounded-lg shadow-sm p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* <button onClick={handleBack} className="text-sm text-gray-500 hover:underline">Back</button> */}
          <img
            src="/images/build-your-dream/user.png"
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
          />
          <div>
            <h2 className="text-xl font-semibold">{enquiry.name}</h2>
            <div className="text-sm text-gray-400">Received on {enquiry.date} , {enquiry.time}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md bg-green-50 text-green-800 px-3 py-1 text-sm font-semibold">Completed</div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-6 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-[poppins] font-semibold mb-4">Basic Information</h3>

          <div className="text-sm text-gray-700 space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Service</div>
              <div className="font-medium">{enquiry.serviceType}</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Contact</div>
              <div className="font-medium">{enquiry.phone}</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Email</div>
              <div className="font-medium">{enquiry.email}</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Message</div>
              <div className="font-medium leading-relaxed">{enquiry.message}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-[poppins] font-semibold mb-4">Service Details</h3>

          <div className="text-sm text-gray-700 space-y-4">
            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Customer Type</div>
              <div className="font-medium">Individual</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Location</div>
              <div className="font-medium">New York</div>
            </div>

            <div>
              <div className="text-gray-400 font-[poppins] text-xs">Urgency</div>
              <div className="font-medium font-[poppins]">This Week</div>
            </div>

          
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    
        
      </div>
    </div>
  );
}
