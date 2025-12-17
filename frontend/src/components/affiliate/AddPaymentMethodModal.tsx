import React, { useState, useEffect } from "react";
//import Button from '../ui/Button';
import Select from "react-select";
import { CiBank } from "react-icons/ci";
import { PiPaypalLogo } from "react-icons/pi";
import { IoCloseOutline } from "react-icons/io5";
import { addPaymentMethod, updatePaymentMethod } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  methodId?: string | number;
  initialData?: any;
}

type PaymentType = "bank_transfer" | "paypal";

interface Country {
  value: string;
  label: string;
  code_type: "ifsc" | "routing" | "iban" | "swift";
  code_label: string;
  code_placeholder: string;
}

const countries: Country[] = [
  {
    value: "India",
    label: "India",
    code_type: "ifsc",
    code_label: "IFSC Code",
    code_placeholder: "SBIN0001234",
  },
  {
    value: "United States",
    label: "United States",
    code_type: "routing",
    code_label: "Routing Number",
    code_placeholder: "123456789",
  },
  {
    value: "Canada",
    label: "Canada",
    code_type: "routing",
    code_label: "Routing Number",
    code_placeholder: "123456789",
  },
  {
    value: "United Kingdom",
    label: "United Kingdom",
    code_type: "iban",
    code_label: "IBAN",
    code_placeholder: "GB82WEST12345698765432",
  },
  {
    value: "Germany",
    label: "Germany",
    code_type: "iban",
    code_label: "IBAN",
    code_placeholder: "DE89370400440532013000",
  },
  {
    value: "France",
    label: "France",
    code_type: "iban",
    code_label: "IBAN",
    code_placeholder: "FR1420041010050500013M02606",
  },
  {
    value: "International",
    label: "International (Others)",
    code_type: "swift",
    code_label: "SWIFT Code",
    code_placeholder: "DEUTDEFF",
  },
];

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editMode = false,
  methodId,
  initialData,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<PaymentType>("bank_transfer");
  const [formData, setFormData] = useState({
    // Bank Transfer
    account_holder_name: "",
    account_number: "",
    country: "",
    ifsc_code: "",
    routing_number: "",
    iban: "",
    swift_code: "",
    // PayPal
    paypal_email: "",
    // Common
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentTabs = [
    {
      id: "bank_transfer" as PaymentType,
      label: "Bank Transfer",
      subText: "3-5 Business Days",
      icon: <CiBank size={34} />,
    },
    {
      id: "paypal" as PaymentType,
      label: "PayPal",
      subText: "Instant Transfer",
      icon: <PiPaypalLogo size={34} />,
    },
  ];

  const selectedCountry = countries.find((c) => c.value === formData.country);

  useEffect(() => {
    if (isOpen && editMode && initialData) {
      if (initialData.payment_type === "paypal") {
        setActiveTab("paypal");
        setFormData((prev) => ({
          ...prev,
          paypal_email: initialData.paypal_email || "",
          is_default: !!initialData.is_default,
        }));
      } else {
        setActiveTab("bank_transfer");
        setFormData((prev) => ({
          ...prev,
          account_holder_name: initialData.account_holder_name || "",
          // do not prefill masked account numbers if backend returns masked
          account_number:
            initialData.account_number &&
            !String(initialData.account_number).includes("*")
              ? initialData.account_number
              : "",
          country: initialData.country || "",
          ifsc_code: initialData.ifsc_code || "",
          routing_number: initialData.routing_number || "",
          iban: initialData.iban || "",
          swift_code: initialData.swift_code || "",
          is_default: !!initialData.is_default,
        }));
      }
    }
  }, [isOpen, editMode, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateAccountHolderName = (name: string): string | null => {
    if (!name.trim()) return "Account holder name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s.'-]+$/.test(name))
      return "Only letters, spaces, dots, hyphens allowed";
    return null;
  };

  const validateAccountNumber = (num: string): string | null => {
    if (!num.trim()) return "Account number is required";
    const clean = num.replace(/[\s-]/g, "");
    if (!/^\d{6,20}$/.test(clean)) return "Must be 6-20 digits";
    return null;
  };

  const validateIFSC = (code: string): string | null => {
    if (!code.trim()) return "IFSC code is required";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(code))
      return "Invalid IFSC (e.g., SBIN0001234)";
    return null;
  };

  const validateRouting = (num: string): string | null => {
    if (!num.trim()) return "Routing number is required";
    if (!/^\d{9}$/.test(num.replace(/[\s-]/g, ""))) return "Must be 9 digits";
    return null;
  };

  const validateIBAN = (iban: string): string | null => {
    if (!iban.trim()) return "IBAN is required";
    const clean = iban.toUpperCase().replace(/[\s-]/g, "");
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(clean))
      return "Invalid IBAN format";
    return null;
  };

  const validateSWIFT = (code: string): string | null => {
    if (!code.trim()) return "SWIFT code is required";
    if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(code))
      return "Invalid SWIFT (8 or 11 chars)";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format";
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (activeTab === "bank_transfer") {
      const nameErr = validateAccountHolderName(formData.account_holder_name);
      if (nameErr) newErrors.account_holder_name = nameErr;

      const accErr = validateAccountNumber(formData.account_number);
      if (accErr) newErrors.account_number = accErr;

      if (!formData.country) newErrors.country = "Please select a country";

      if (selectedCountry) {
        const codeType = selectedCountry.code_type;
        const codeValue =
          formData[
            codeType === "ifsc"
              ? "ifsc_code"
              : codeType === "routing"
              ? "routing_number"
              : codeType === "iban"
              ? "iban"
              : "swift_code"
          ];

        let codeErr: string | null = null;
        if (codeType === "ifsc") codeErr = validateIFSC(codeValue);
        else if (codeType === "routing") codeErr = validateRouting(codeValue);
        else if (codeType === "iban") codeErr = validateIBAN(codeValue);
        else if (codeType === "swift") codeErr = validateSWIFT(codeValue);

        if (codeErr) {
          newErrors[
            codeType === "ifsc"
              ? "ifsc_code"
              : codeType === "routing"
              ? "routing_number"
              : codeType === "iban"
              ? "iban"
              : "swift_code"
          ] = codeErr;
        }
      }
    }

    if (activeTab === "paypal") {
      const emailErr = validateEmail(formData.paypal_email);
      if (emailErr) newErrors.paypal_email = emailErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload: any = {
        payment_type: activeTab,
        is_default: formData.is_default,
      };

      if (activeTab === "bank_transfer") {
        payload.account_holder_name = formData.account_holder_name.trim();
        payload.account_number = formData.account_number.replace(/[\s-]/g, "");
        payload.country = formData.country;

        if (selectedCountry?.code_type === "ifsc") {
          payload.ifsc_code = formData.ifsc_code.toUpperCase().trim();
        } else if (selectedCountry?.code_type === "routing") {
          payload.routing_number = formData.routing_number.replace(
            /[\s-]/g,
            ""
          );
        } else if (selectedCountry?.code_type === "iban") {
          payload.iban = formData.iban.toUpperCase().replace(/[\s-]/g, "");
        } else if (selectedCountry?.code_type === "swift") {
          payload.swift_code = formData.swift_code.toUpperCase().trim();
        }
      }

      if (activeTab === "paypal") {
        payload.paypal_email = formData.paypal_email.toLowerCase().trim();
      }

      const response =
        editMode && methodId
          ? await updatePaymentMethod(String(methodId), payload)
          : await addPaymentMethod(payload);

      if (response.success) {
        showToast({
          message: editMode
            ? "Payment method updated successfully!"
            : "Payment method added successfully!",
          type: "success",
          duration: 3000,
        });
        onSuccess();
        handleClose();
      } else {
        showToast({
          message:
            response.error?.message ||
            (editMode
              ? "Failed to update payment method"
              : "Failed to add payment method"),
          type: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error adding payment method:", error);
      showToast({
        message: error.message || "Something went wrong. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActiveTab("bank_transfer");
    setFormData({
      account_holder_name: "",
      account_number: "",
      country: "",
      ifsc_code: "",
      routing_number: "",
      iban: "",
      swift_code: "",
      paypal_email: "",
      is_default: false,
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-black/60"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white py-[18px] px-3 rounded-xl border border-[#ECEEF2] overflow-hidden animate-fadeIn"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="w-full h-[600px] ps-3 pe-3.5 py-[18px]">
          {/* Close Button */}
          <div
            onClick={handleClose}
            className="absolute top-4 right-3 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-[#ECEEF2] shadow-[0px_0.56px_5.63px_0px_rgba(0,0,0,0.1)]"
          >
            <IoCloseOutline className="text-[#E1056D]" />
          </div>

          <div className="w-full h-full flex flex-col lg:flex-row gap-[18px]">
            {/* Left Sidebar */}
            <div className="w-full lg:w-[35%] h-fit lg:h-full border-r border-[#ECEEF2] pr-3 flex flex-col gap-[18px]">
              {paymentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-3 gap-3 rounded-xl transition-all duration-200 whitespace-nowrap
                   ${
                     activeTab === tab.id
                       ? "bg-[#FAFAFA]"
                       : "bg-white hover:bg-[#FAFAFA]"
                   }`}
                >
                  <div className="text-[#9747FF]">{tab.icon}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#222224] font-['Poppins',Helvetica]">
                      {tab.label}
                    </p>
                    <p className="text-xs text-[#7A7A7A] font-['Open_Sans',Helvetica]">
                      {tab.subText}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold font-['Poppins',Helvetica] bg-[linear-gradient(90deg,#6340FF_0%,#D748EA_100%)] bg-clip-text text-transparent">
                  {editMode ? "Update" : "Add"}{" "}
                  {paymentTabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-[#7A7A7A] font-['Open_Sans',Helvetica]">
                  Fill in the details to add your payment method
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 h-full"
              >
                <div className="space-y-4 flex-1 overflow-y-auto ps-1 pr-2">
                  {/* Bank Transfer Form */}
                  {activeTab === "bank_transfer" && (
                    <>
                      <div>
                        <label className="block mb-2 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
                          Account Holder Name{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.account_holder_name}
                          onChange={(e) =>
                            handleInputChange(
                              "account_holder_name",
                              e.target.value
                            )
                          }
                          className={`w-full border ${
                            errors.account_holder_name
                              ? "border-red-500"
                              : "border-[#ECEEF2]"
                          } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none font-['Open_Sans',Helvetica]`}
                          placeholder="Enter account holder name"
                        />
                        {errors.account_holder_name && (
                          <p className="text-red-500 text-xs mt-1 font-['Open_Sans',Helvetica]">
                            {errors.account_holder_name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
                          Country <span className="text-red-600">*</span>
                        </label>
                        <Select
                          options={countries}
                          value={countries.find(
                            (c) => c.value === formData.country
                          )}
                          onChange={(option) => {
                            handleInputChange("country", option?.value || "");
                            handleInputChange("ifsc_code", "");
                            handleInputChange("routing_number", "");
                            handleInputChange("iban", "");
                            handleInputChange("swift_code", "");
                          }}
                          placeholder="Select your country"
                          className={errors.country ? "border-red-500" : ""}
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: errors.country
                                ? "#ef4444"
                                : "#ECEEF2",
                              "&:hover": {
                                borderColor: "#7077FE",
                              },
                            }),
                          }}
                        />
                        {errors.country && (
                          <p className="text-red-500 text-xs mt-1 font-['Open_Sans',Helvetica]">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
                          Account Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.account_number}
                          onChange={(e) =>
                            handleInputChange("account_number", e.target.value)
                          }
                          className={`w-full border ${
                            errors.account_number
                              ? "border-red-500"
                              : "border-[#ECEEF2]"
                          } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none font-['Open_Sans',Helvetica]`}
                          placeholder="Enter account number"
                        />
                        {errors.account_number && (
                          <p className="text-red-500 text-xs mt-1 font-['Open_Sans',Helvetica]">
                            {errors.account_number}
                          </p>
                        )}
                      </div>

                      {selectedCountry && (
                        <div>
                          <label className="block mb-2 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
                            {selectedCountry.code_label}{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={
                              selectedCountry.code_type === "ifsc"
                                ? formData.ifsc_code
                                : selectedCountry.code_type === "routing"
                                ? formData.routing_number
                                : selectedCountry.code_type === "iban"
                                ? formData.iban
                                : formData.swift_code
                            }
                            onChange={(e) => {
                              const field =
                                selectedCountry.code_type === "ifsc"
                                  ? "ifsc_code"
                                  : selectedCountry.code_type === "routing"
                                  ? "routing_number"
                                  : selectedCountry.code_type === "iban"
                                  ? "iban"
                                  : "swift_code";
                              handleInputChange(field, e.target.value);
                            }}
                            className={`w-full border ${
                              errors[
                                selectedCountry.code_type === "ifsc"
                                  ? "ifsc_code"
                                  : selectedCountry.code_type === "routing"
                                  ? "routing_number"
                                  : selectedCountry.code_type === "iban"
                                  ? "iban"
                                  : "swift_code"
                              ]
                                ? "border-red-500"
                                : "border-[#ECEEF2]"
                            } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none font-['Open_Sans',Helvetica]`}
                            placeholder={selectedCountry.code_placeholder}
                          />
                          {errors[
                            selectedCountry.code_type === "ifsc"
                              ? "ifsc_code"
                              : selectedCountry.code_type === "routing"
                              ? "routing_number"
                              : selectedCountry.code_type === "iban"
                              ? "iban"
                              : "swift_code"
                          ] && (
                            <p className="text-red-500 text-xs mt-1 font-['Open_Sans',Helvetica]">
                              {
                                errors[
                                  selectedCountry.code_type === "ifsc"
                                    ? "ifsc_code"
                                    : selectedCountry.code_type === "routing"
                                    ? "routing_number"
                                    : selectedCountry.code_type === "iban"
                                    ? "iban"
                                    : "swift_code"
                                ]
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* PayPal Form */}
                  {activeTab === "paypal" && (
                    <div>
                      <label className="block mb-2 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
                        PayPal Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.paypal_email}
                        onChange={(e) =>
                          handleInputChange("paypal_email", e.target.value)
                        }
                        className={`w-full border ${
                          errors.paypal_email
                            ? "border-red-500"
                            : "border-[#ECEEF2]"
                        } rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none font-['Open_Sans',Helvetica]`}
                        placeholder="your@email.com"
                      />
                      {errors.paypal_email && (
                        <p className="text-red-500 text-xs mt-1 font-['Open_Sans',Helvetica]">
                          {errors.paypal_email}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={formData.is_default}
                      onChange={(e) =>
                        handleInputChange("is_default", e.target.checked)
                      }
                      className="w-4 h-4 text-[#7077FE] border-gray-300 rounded focus:ring-[#7077FE]"
                    />
                    <label
                      htmlFor="is_default"
                      className="text-sm text-[#222224] font-['Open_Sans',Helvetica]"
                    >
                      Set as default payment method
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#ECEEF2]">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full
    px-5 py-2.5
    text-[16px]
    leading-[100%]
    tracking-[0px]
    text-center
    text-[#242424]
    font-['Open_Sans']
    font-normal
    disabled:opacity-60
    border border-[#DADADA]
    bg-white
    hover:bg-[#F9F9F9]
    transition-all
  "
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full px-5 py-2.5 text-base font-normal text-white disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? editMode
                        ? "Updating..."
                        : "Adding..."
                      : editMode
                      ? "Update Payment Method"
                      : "Add Payment Method"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;
