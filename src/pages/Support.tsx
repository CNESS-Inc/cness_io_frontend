import { useState } from "react";
import FAQSection from "../components/ui/Faq";
import tollfree from "..//assets/tollfree.png";
import ContactUsPopup from "../components/zohoforms/contactus";

const Support = () => {
  const [activeTab, setActiveTab] = useState<"tickets" | "faq">("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState<"contact" | "feedback" | null>(null);

  // Sample ticket data
  const tickets = [
    {
      id: "1",
      status: "General",
      ticketId: "350-001",
      title: "uniforms, watches as well (American)",
      date: "06/10/2021 12:39 PM",
    },
    {
      id: "2",
      status: "Feedback related",
      ticketId: "350-007",
      title: "Ballarat & Players in California (United)",
      date: "06/10/2021 22:36 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="font-['Poppins',Helvetica] text-2xl md:text-[32px] leading-8 mb-5">
            <span className="font-semibold text-[#222224]">Support Center </span>
          </h1>
          <p className="text-gray-600">
            Find answers to your questions or get help from our support team
          </p>
        </header>

        {/* Action Buttons and Toll-free Number */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
             onClick={() => setShowForm("contact")}// ✅ Open popup
            className="px-6 py-2 rounded-full bg-white text-gray-600 border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            Contact Us
          </button>

          <button
             onClick={() => setShowForm("feedback")} // ✅ Same popup for feedback
            className="px-6 py-2 rounded-full bg-[#FF5C7C] text-white font-semibold hover:bg-[#e14a67]"
          >
            Provide Feedback
          </button>

          <div className="flex items-center space-x-2 text-blue-600">
            <img src={tollfree} alt="Toll Free" className="w-6 h-6" />
            <span>Toll Free: 1-800-555-1234</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Find your answer by subject..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Have a question? Just ask here or enter search items.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "faq"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
          <button
            disabled
            className={`px-4 py-2 font-medium ${
              activeTab === "tickets"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("tickets")}
          >
            My Tickets
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "tickets" ? (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creation Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ticket.status === "General"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <FAQSection searchQuery={searchQuery} />
        )}
      </div>

      {/* Modal for Zoho Form */}
     {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full relative animate-fadeIn">
            <button
              onClick={() => setShowForm(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>

            {/* Pass form type */}
            <ContactUsPopup
              formType={showForm} // either "contact" or "feedback"
              onClose={() => setShowForm(null)}
            />
    </div>
  </div>
)}
    
    </div>
  );  
};

export default Support;
