import React, { useState, useEffect } from "react";
import SuccessModal from "../directory/SuccessPopup";
import ExitWarningModal from "../directory/UnfinishedPopup";
import { CreateDirectoryEnquiry, GetBasicInfoServiceDetails } from "../../Common/ServerAPI";
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
  infoId: string | null;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ open, onClose, directory, infoId = null }) => {
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
        if (infoId) {
          const response = await GetBasicInfoServiceDetails(infoId);
          if (response?.data?.data) {
            setServices(response.data.data);
          }
        } else {
          setServices([]);
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
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-999 p-4 md:p-6">
        <div className="bg-white w-full max-w-[720px] rounded-2xl shadow-xl overflow-hidden relative max-h-[90vh] flex flex-col">
          {/* ===== HEADER ===== */}
          <div className="bg-[#F5F3FF] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <img 
                src={directory.logo_url || "https://static.codia.ai/image/2025-12-04/DUvvvgriSA.png"} 
                className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover shrink-0" 
                alt={directory.name}
              />
              <div className="min-w-0">
                <h2 className="text-[#081021] font-semibold text-sm md:text-lg truncate">
                  {directory.name}
                </h2>
                <p className="text-[#64748B] text-xs md:text-sm truncate">
                  {directory.city}, {directory.country}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="shrink-0 ml-2"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" className="md:w-6 md:h-6">
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
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {/* TITLE BLOCK */}
            <div>
              <h3 className="text-[#081021] font-semibold text-sm md:text-base">Get Connected Instantly</h3>
              <p className="text-[#64748B] text-xs md:text-sm mt-1">
                Enter your information to receive quick responses from this business.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="text-[#081021] text-xs md:text-sm font-medium block mb-1 md:mb-2">
                  Your Name
                </label>
                <input
                  className="border border-[#CBD5E1] h-10 md:h-11 w-full rounded-lg px-3 outline-none text-sm md:text-base"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-xs md:text-sm font-medium block mb-1 md:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-[#CBD5E1] h-10 md:h-11 w-full rounded-lg px-3 outline-none text-sm md:text-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-xs md:text-sm font-medium block mb-1 md:mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="border border-[#CBD5E1] h-10 md:h-11 w-full rounded-lg px-3 outline-none text-sm md:text-base"
                  placeholder="Enter phone number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[#081021] text-xs md:text-sm font-medium block mb-1 md:mb-2">
                  Services
                </label>
                <div className="relative">
                  <select
                    className="border border-[#CBD5E1] h-10 md:h-11 w-full rounded-lg px-3 appearance-none outline-none text-sm md:text-base pr-10"
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

                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 12 10" 
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <path d="M2 3L6 7L10 3" stroke="#081021" strokeWidth="2" />
                  </svg>
                </div>

                {/* Selected Services */}
                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2 md:mt-2">
                    {formData.services.map((serviceId) => {
                      const service = services.find((s: any) => s.id === serviceId);
                      return (
                        <span
                          key={serviceId}
                          className="inline-flex items-center gap-1 px-2.5 md:px-3 py-0.5 md:py-1 bg-[#F5F3FF] text-[#7077FE] rounded-full text-xs md:text-sm"
                        >
                          <span className="truncate max-w-[120px] md:max-w-none">
                            {service?.name || serviceId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleServiceChange(serviceId)}
                            className="text-[#7077FE] hover:text-[#5a5fcf] font-bold shrink-0 ml-0.5"
                            aria-label={`Remove ${service?.name}`}
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
                <label className="text-[#081021] text-xs md:text-sm font-medium block mb-1 md:mb-2">
                  Your Message
                </label>
                <textarea
                  className="border border-[#CBD5E1] rounded-lg px-3 py-2 h-24 md:h-[120px] w-full outline-none resize-none text-sm md:text-base"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* ===== FOOTER BUTTONS ===== */}
          <div className="flex justify-end gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 bg-white border-t border-[#E2E8F0] shrink-0">
            <button
              className="px-4 md:px-5 py-2 rounded-full border border-gray-300 text-[#081021] text-sm md:text-base whitespace-nowrap"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="px-4 md:px-6 py-2 rounded-full bg-[#7077FE] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
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