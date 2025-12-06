import React, { useState, useEffect } from "react";
import SuccessModal from "../directory/SuccessPopup";
import ExitWarningModal from "../directory/UnfinishedPopup";
import { GetServiceDetails, CreateDirectoryEnquiry } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

interface Directory {
  name: string;
  logo_url: string;
  city: string;
  country: string;
  directory_info_id?: string;
}

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
  directory: Directory | null;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ open, onClose, directory }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
    services: [] as string[],
  });

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await GetServiceDetails();
        if (response?.data?.data) {
          setServices(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        showToast({
          message: "Failed to load services",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchServices();
      // Reset form when modal opens
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        message: "",
        services: [],
      });
    }
  }, [open]);

  if (!open || !directory) return null;

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => {
      const currentServices = prev.services;
      if (currentServices.includes(serviceId)) {
        // Remove service if already selected
        return {
          ...prev,
          services: currentServices.filter(id => id !== serviceId),
        };
      } else {
        // Add service if not selected
        return {
          ...prev,
          services: [...currentServices, serviceId],
        };
      }
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      showToast({
        message: "Please enter your name",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.email.trim()) {
      showToast({
        message: "Please enter your email",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.phone_number.trim()) {
      showToast({
        message: "Please enter your phone number",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!directory.directory_info_id) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        directory_info_id: directory.directory_info_id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: parseInt(formData.phone_number),
        message: formData.message.trim(),
        services: formData.services,
      };

      await CreateDirectoryEnquiry(payload);
      setShowSuccess(true);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to submit enquiry",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowExitWarning(true); // Open exit warning modal
  };

  return (
    <>
      {/* MAIN POPUP */}
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999]">
        <div className="bg-white w-[720px] rounded-2xl shadow-xl overflow-hidden relative">

          {/* ===== HEADER ===== */}
          <div className="bg-[#F5F3FF] px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={directory.logo_url} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h2 className="text-[#081021] font-semibold text-lg">{directory.name}</h2>
                <p className="text-[#64748B] text-sm">
                  {directory.city}, {directory.country}
                </p>
              </div>
            </div>

            <button onClick={onClose}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="#081021"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* ===== CONTENT ===== */}
          <div className="p-6 space-y-6">

            {/* TITLE BLOCK */}
            <div>
              <h3 className="text-[#081021] font-semibold text-base">Get Connected Instantly</h3>
              <p className="text-[#64748B] text-sm">
                Enter your information to receive quick responses from this business.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-5">
              <div>
                <label className="text-[#081021] text-sm font-medium">Your Name</label>
                <input
                  className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 outline-none"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Services</label>
                <div className="relative">
                  <select
                    className="border border-[#CBD5E1] h-[44px] w-full rounded-lg px-3 appearance-none outline-none"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleServiceChange(e.target.value);
                        e.target.value = ""; // Reset select
                      }
                    }}
                    disabled={loading}
                  >
                    <option value="">Select a service</option>
                    {services.map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>

                  <svg width="10" height="6" viewBox="0 0 12 10" className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <path d="M2 3L6 7L10 3" stroke="#081021" strokeWidth="2" />
                  </svg>
                </div>
                
                {/* Selected Services */}
                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.services.map((serviceId) => {
                      const service = services.find((s: any) => s.id === serviceId);
                      return (
                        <span
                          key={serviceId}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F3FF] text-[#7077FE] rounded-full text-sm"
                        >
                          {service?.name || serviceId}
                          <button
                            type="button"
                            onClick={() => handleServiceChange(serviceId)}
                            className="text-[#7077FE] hover:text-[#5a5fcf] font-bold"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[#081021] text-sm font-medium">Your Message</label>
                <textarea
                  className="border border-[#CBD5E1] rounded-lg px-3 py-2 h-[120px] w-full outline-none resize-none"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* ===== FOOTER BUTTONS ===== */}
          <div className="flex justify-end gap-4 px-6 py-4 bg-white">
            <button
              className="px-5 py-2 rounded-full border border-gray-300 text-[#081021]"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="px-6 py-2 rounded-full bg-[#7077FE] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Get In Touch"}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />

      {/* EXIT WARNING MODAL */}
      <ExitWarningModal
        open={showExitWarning}
        onContinue={() => setShowExitWarning(false)}
        onDiscard={() => {
          setShowExitWarning(false);
          onClose();
        }}
      />
    </>
  );
};

export default EnquiryModal;
