// import Parterform from "../components/zohoforms/Patnerform";
//import image from "../assets/partner.jpg";
import partner1 from "../assets/partner1.svg";
import partner2 from "../assets/partner2.svg";
import partner3 from "../assets/partner3.svg";
import partner4 from "../assets/partner4.svg";
import partner5 from "../assets/partner5.svg";
//import partner from "../assets/partner.png";
//import become_partner from "../assets/bcome-partner.png";
import bulb from "../assets/bulb.png";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useState } from "react";
import { createPartnerInquiry } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import clsx from "clsx";

const features = [
  {
    id: "01",
    title: "Guide Organizational Transformation",
    description:
      "Help companies implement the CNESS framework and measure their conscious impact.",
  },
  {
    id: "02",
    title: "Deliver Programs & Training",
    description:
      "Conduct certified workshops, leadership initiatives, and culture-shaping programs within organizations.",
  },
  {
    id: "03",
    title: "Co-Create the Future",
    description:
      "Collaborate with Mentors, share best practices, and contribute to scaling conscious business worldwide.",
  },
];

const cards = [
  {
    icon: partner1,
    title: "Brand Visibility",
    body: "Position your brand as an official CNESS Partner in a global ecosystem.",
  },
  {
    icon: partner2,
    title: "Access to Community",
    body: "Connect with certified professionals, leaders, and conscious organizations.",
  },
  {
    icon: partner3,
    title: "Thought Leadership",
    body: "Build your reputation as a trusted driver of conscious business.",
  },
  {
    icon: partner4,
    title: "Collaboration Opportunities",
    body: "Co-create events, programs, and initiatives with CNESS.",
  },
  {
    icon: partner5,
    title: "Credibility  & Recognition",
    body: "Display your Partner Badge as a signal of purpose-driven excellence.",
  },
];

const steps = [
  {
    step: 1,
    title: "Apply",
    description: "Submit your application online.",
    width: "w-[50%]",
  },
  {
    step: 2,
    title: "Review",
    description: "Undergo a profile and credentials review.",
    width: "w-[70%]",
  },
  {
    step: 3,
    title: "Onboarding",
    description: "Complete Partner Training and evaluation.",
    width: "w-[75%]",
  },
  {
    step: 4,
    title: "Grow Together",
    description: "Receive your Certified Partner Badge.",
    width: "w-[60%]",
  },
  {
    step: 5,
    title: "Grow Together",
    description:
      "Gain dashboard access to manage collaborations, programs, and clients.",
    width: "w-[90%]",
  },
];

type PartnerPayload = {
  organization_name: string;
  contact_person_name: string;
  phone_number: string;
  email: string;
  industry_sector: string;
  website_link: string;
  about: string;
  reason_to_partner: string;
  organization_size: string;
  areas_of_collabration: string;
  status?: "pending" | "approved" | "rejected";
};

const BecomePartner = () => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<PartnerPayload>({
    organization_name: "",
    contact_person_name: "",
    phone_number: "",
    email: "",
    industry_sector: "",
    website_link: "",
    about: "",
    reason_to_partner: "",
    organization_size: "",
    areas_of_collabration: "",
    status: "pending",
  });

  // Add these states
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

const getFieldError = (fieldName: string, value: string): string | null => {
  const validations: { [key: string]: (val: string) => string | null } = {
    organization_name: (val) => {
      if (!val.trim()) return "Organization name is required.";
      if (val.trim().length < 2)
        return "Organization name must be at least 2 characters.";
      if (!/^[A-Za-z0-9&.,'()\- ]+$/.test(val.trim()))
        return "Only letters, numbers, and basic punctuation are allowed.";
      return null;
    },

    contact_person_name: (val) => {
      if (!val.trim()) return "Contact person name is required.";
      if (val.trim().length < 2)
        return "Contact person name must be at least 2 characters.";
      if (!/^[A-Za-z\s.'-]+$/.test(val.trim()))
        return "Only letters, spaces, and basic punctuation are allowed.";
      return null;
    },

    email: (val) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        ? "Invalid email format"
        : null,

    phone_number: (val) =>
      val.replace(/\D/g, "").length < 7
        ? "At least 7 digits required"
        : null,

    industry_sector: (val) =>
      val.trim().length < 2 ? "Must be at least 2 characters" : null,

    website_link: (val) => {
      if (val.trim() === "") return null; // Optional
      return !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(
        val.trim()
      )
        ? "Please enter a valid website URL"
        : null;
    },

    about: (val) => {
      if (val.trim().length < 50) return "At least 50 characters required.";
      if (val.trim().length > 2000)
        return "Maximum 2000 characters allowed.";
      return null;
    },

    reason_to_partner: (val) =>
      val.trim().length < 20 ? "At least 20 characters required." : null,
organization_size: (val) => {
  const trimmed = val.trim();
  if (!trimmed) return "Please specify your organization size.";

  // ✅ Allow pure numbers (e.g., 25)
  if (/^\d+$/.test(trimmed)) return null;

  // ✅ Allow valid ranges (e.g., 51-200 or 5–10)
  if (/^\d+\s*[-–]\s*\d+$/.test(trimmed)) return null;

  // ❌ Anything else is invalid (like "ten", "5 employees", "approx 100")
  return "Enter a number (e.g., 25) or a range (e.g., 51-200).";
},

    areas_of_collabration: (val) =>
      val.trim().length < 2
        ? "Please specify areas of collaboration."
        : null,
  };

  return validations[fieldName]?.(value) || null;
};


  

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));

    // Clear error for this field when user starts typing (only if we've attempted submit)
    if (hasAttemptedSubmit && fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handlePhoneChange = (val: string) => {
    setData((d) => ({ ...d, phone_number: val }));

    // Clear phone error when user starts typing (only if we've attempted submit)
    if (hasAttemptedSubmit && fieldErrors.phone_number) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone_number;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const fieldsToValidate: (keyof PartnerPayload)[] = [
      "organization_name",
      "contact_person_name",
      "email",
      "phone_number",
      "industry_sector",
      "about",
      "reason_to_partner",
      "organization_size",
      "areas_of_collabration",
    ];

    fieldsToValidate.forEach((field) => {
      const error = getFieldError(field, data[field] as string);
      if (error) {
        errors[field] = error;
      }
    });

    // Validate website link if provided
    if (data.website_link.trim() !== "") {
      const websiteError = getFieldError("website_link", data.website_link);
      if (websiteError) {
        errors.website_link = websiteError;
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);

    // Clear previous messages
    setSubmitMessage(null);

    // Validate form
    if (!validateForm()) {
      showToast({
        message: "Please fix the errors in the form before submitting.",
        type: "error",
        duration: 2000,
      });

      // Scroll to the first error
      setTimeout(() => {
        const firstErrorField = Object.keys(fieldErrors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            (element as HTMLElement).focus();
          }
        }
      }, 100);

      return;
    }

    try {
      setIsSubmitting(true);

      // Trim all string values before submission
      const trimmedData = {
        ...data,
        organization_name: data.organization_name.trim(),
        contact_person_name: data.contact_person_name.trim(),
        email: data.email.trim(),
        industry_sector: data.industry_sector.trim(),
        website_link: data.website_link.trim(),
        about: data.about.trim(),
        reason_to_partner: data.reason_to_partner.trim(),
        organization_size: data.organization_size.trim(),
        areas_of_collabration: data.areas_of_collabration.trim(),
      };

      const res = await createPartnerInquiry(trimmedData);

      if (res?.success?.statusCode === 200) {
        showToast({
          message: "Your partnership request has been submitted successfully!",
          type: "success",
          duration: 3000,
        });

        // Reset form and errors
        setData({
          organization_name: "",
          contact_person_name: "",
          phone_number: "",
          email: "",
          industry_sector: "",
          website_link: "",
          about: "",
          reason_to_partner: "",
          organization_size: "",
          areas_of_collabration: "",
          status: "pending",
        });
        setFieldErrors({});
        setCurrentStep(2);
      } else {
        const errorMessage =
          res?.message ||
          "There was an error submitting your application. Please try again.";
        setSubmitMessage({
          type: "error",
          text: errorMessage,
        });
        showToast({
          message: errorMessage,
          type: "error",
          duration: 2500,
        });
      }
    } catch (err: any) {
      console.error("Submit failed", err);
      const errorMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "We encountered an unexpected error. Please try again.";

      showToast({
        message: `Submission failed: ${errorMsg}`,
        type: "error",
        duration: 3000,
      });

      setSubmitMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const shouldShowError = (fieldName: string) => {
    return hasAttemptedSubmit && fieldErrors[fieldName];
  };

  return (
    <>
      <div className="m-0 p-0">
        <div
          className="py-[33px] px-10"
          style={{
            background:
              "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-stretch gap-5">
            <div className="w-full lg:w-1/3 py-[30px] px-[26px] gap-6 bg-white rounded-[40px]">
              <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[42px] lg:text-3xl xl:text-[42px] md:leading-[54px] lg:leading-[40px] xl:leading-[54px] text-wrap">
                <span className="text-[#1A1A1A]">Grow With Purpose. </span>
                <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent block">
                  Partner With CNESS.
                </span>
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-base font-light text-[#64748B] leading-[24px]">
                Join hands with us to embed conscious practices in organizations
                and communities. As a CNESS Partner, you gain visibility,
                credibility, and the chance to co-create global impact.
              </h5>
              <div className="pt-6">
                <button
                  className="py-4 px-5 font-['Open_Sans',Helvetica] text-black font-medium text-sm text-white rounded-full"
                  onClick={() => {
                    const element = document.getElementById("apply_partner");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{
                    background:
                      "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                  }}
                >
                  Apply to Become a Partner
                </button>
              </div>
            </div>
            <div className="w-full lg:w-2/3 rounded-[40px]">
              <img
                src="https://cdn.cness.io/partner_banner.jpg"
                alt="partner main poster"
                className="w-full h-[427px] lg:h-full object-cover object-top pointer-events-none select-none rounded-[40px]"
                aria-hidden="true"
              />
              
            </div>
          </div>
        </div>

        <div className="py-12 flex flex-col justify-center items-center mx-auto bg-white">
           <h1 className="text-center font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px]">
            <span className="text-black">Why Become a </span>
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              CNESS Partner
            </span>
          </h1>
           <h5 className="py-3 px-5 sm:px-10 md:px-20 font-['Open_Sans',Helvetica] font-light text-base text-center text-[#64748B] leading-[24px]">
            CNESS Partners are consultancies, agencies, and specialists who
            extend the power of the CNESS framework into organizations. From HR
            and DEI firms to ESG consultants and leadership coaches, Partners
            help businesses adopt conscious practices that drive real
            transformation. To qualify as a Partner, you must employ at least
            one CNESS-certified professional, complete partner training, and
            sign a license agreement. In return, you receive recognition as an
            official CNESS Partner — a mark of trust and credibility.
          </h5>
        </div>

        <div className="w-full flex mx-auto flex-col justify-center items-center bg-[#F5F7F9] pt-10 pb-[86px] px-5 sm:px-14">
           <h1 className="font-['Poppins',Helvetica] text-center font-medium text-2xl md:text-[32px] sm:leading-[54px]">
            <span className="text-black">What does a </span>
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Partner do?
            </span>
          </h1>
          <div className="w-full pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[40px]">
              {features.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col rounded-4xl bg-white hover:shadow-md transition p-[30px] gap-3"
                >
                  {/* Top right icon */}
                  <div className="absolute top-4 right-4 w-[34px] h-[34px]">
                    <img src={bulb} alt="bulb" />
                  </div>

                  {/* Number */}
                  <span className="font-['Poppins',Helvetica] block text-lg text-[#B6B6B6] font-medium">
                    {item.id}
                  </span>

                  {/* Title */}
                  <h3
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    className="pt-5 text-xl font-medium text-black"
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="openSans font-['Open Sans'] text-base font-light text-[#64748B] leading-relaxed lg:pe-5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mx-auto w-full bg-white">
          <div className="mx-auto w-full px-[20px] md:px-[60px] pb-[60px] pt-[50px] sm:py-[86px]">
            <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px] text-center">
              <span className="text-black">Why It Pays to </span>
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Partner
              </span>
            </h1>
            <div className="mx-auto mt-8 w-full 2xl:w-7xl flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
              {cards.map((c, i) => (
                <div key={i} className="w-full sm:w-[300px] flex">
                  <Card title={c.title} body={c.body} icon={c.icon} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full bg-[#F5F7F9] py-[50px] sm:py-[86px] px-10 sm:px-20">
          <div className="mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="w-full lg:w-3/5 flex flex-col justify-start items-start text-start">
              <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px] text-center">
                <span className="text-black">Who can become a </span>
                <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Partner?
                </span>
              </h1>

              <ul className="mt-6 list-disc pl-5 text-[#64748B] text-base font-light leading-[32px] space-y-1">
                <li>
                  Organizations with strong consulting or training backgrounds
                  (HR, DEI, ESG, leadership, or culture development).
                </li>
                <li>At least one certified CNESS professional on your team.</li>
                <li>
                  Completion of Partner Training and the official License
                  Agreement.
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-2/5 rounded-[20px] overflow-hidden">
              <img
                src="https://cdn.cness.io/partner2.jpg"
                alt="Handshake"
                className="w-full h-auto object-cover"
              />

              
            </div>
          </div>
        </div>

        <section className="hidden sm:flex flex-col bg-white px-6 sm:px-10 md:px-16 lg:px-22 py-[60px] mb-0">
          <div className="text-center mb-10">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-[40px] lg:leading-[54px] tracking-[-0.02em]">
              Your Path to Becoming a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Partner
              </span>
            </h2>
          </div>

          <div className="relative flex justify-between">
            <div
              className="absolute top-5 left-[calc(theme(spacing.5))] right-[calc(theme(spacing.5))] h-1 bg-[#6340FF]"
              style={{
                left: "calc(5.25rem)",
                right: "calc(5.25rem)",
              }}
            />

            <div
              className="absolute top-5 h-1 bg-[#6340FF]"
              style={{
                left: "calc(1.25rem)",
                width:
                  steps.length > 1
                    ? `calc((( ${
                        ((currentStep - 1) / (steps.length - 1)) * 100
                      }% ) - 1.25rem))`
                    : "0%",
              }}
            />

            {steps.map((step, index) => {
              const stepNumber = index + 1;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  {/* Circle */}
                  <div
                    className={clsx(
                      "z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#6340FF] text-white transition-colors"
                    )}
                  >
                    {stepNumber}
                  </div>
                  <p
                    className={clsx(
                      "mt-[21px] text-center font-['Open_Sans',Helvetica] text-sm font-normal text-gray-500",
                      step.width
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div
          id="apply_partner"
          className="w-full bg-[#F5F7F9] pb-10 sm:py-10 px-5 lg:px-10"
        >
          <h1 className="pb-10 font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Application Form
            </span>
          </h1>

          <div className="grid xl:grid-cols-[275px_1fr] gap-10 items-stretch">
            <div className="hidden xl:flex rounded-[20px] overflow-hidden">
              <img
                src="https://cdn.cness.io/partnerapp_3.jpg"
                alt="Handshake"
                className="h-full w-full object-cover"
              />

              
            </div>

            <div className="rounded-[25px] bg-white p-[20px] lg:p-[30px] flex flex-col">
              <form
                className="w-full flex flex-col flex-1"
                onSubmit={handleSubmit}
              >
                <div className="mx-auto w-full max-w-[760px] 2xl:max-w-none grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                  <Field label={<span>Organization Name<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="organization_name"
                      placeholder="Enter organization name"
                      value={data.organization_name}
                      onChange={handleChange}
                      error={
                        shouldShowError("organization_name")
                          ? fieldErrors.organization_name
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Contact Person Name<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="contact_person_name"
                      placeholder="Enter your name"
                      value={data.contact_person_name}
                      onChange={handleChange}
                      error={
                        shouldShowError("contact_person_name")
                          ? fieldErrors.contact_person_name
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Phone Number<span style={{ color: "red" }}> *</span></span>}>
                    <PhoneInputField
                      name="phone_number"
                      value={data.phone_number}
                      onChange={handlePhoneChange}
                      defaultCountry="us"
                      placeholder="Enter your phone number"
                      error={
                        shouldShowError("phone_number")
                          ? fieldErrors.phone_number
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Email Address<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder="Mail ID"
                      type="email"
                      error={
                        shouldShowError("email") ? fieldErrors.email : null
                      }
                    />
                  </Field>
                  <Field label={<span>Industry / Sector<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="industry_sector"
                      placeholder="Enter your years of experience"
                      value={data.industry_sector}
                      onChange={handleChange}
                      error={
                        shouldShowError("industry_sector")
                          ? fieldErrors.industry_sector
                          : null
                      }
                    />
                  </Field>
                  <Field label="Website / Social Media Link (if any)">
                    <Input
                      name="website_link"
                      placeholder="Enter your link"
                      value={data.website_link}
                      onChange={handleChange}
                      error={
                        shouldShowError("website_link")
                          ? fieldErrors.website_link
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Brief About Your Organization (150–200 words)<span style={{ color: "red" }}> *</span></span>}>
                    <TextArea
                      name="about"
                      placeholder="Add Notes..."
                      value={data.about}
                      onChange={handleChange}
                      error={
                        shouldShowError("about") ? fieldErrors.about : null
                      }
                    />
                  </Field>
                  <Field label={<span>Why do you want to partner with CNESS?<span style={{ color: "red" }}> *</span></span>}>
                    <TextArea
                      name="reason_to_partner"
                      placeholder="Add Notes..."
                      value={data.reason_to_partner}
                      onChange={handleChange}
                      error={
                        shouldShowError("reason_to_partner")
                          ? fieldErrors.reason_to_partner
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Organization Size (No. of employees / scale)<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="organization_size"
                      placeholder="Number of employees"
                      value={data.organization_size}
                      onChange={handleChange}
                      error={
                        shouldShowError("organization_size")
                          ? fieldErrors.organization_size
                          : null
                      }
                    />
                  </Field>
                  <Field label={<span>Areas of Collaboration (e.g., Events, Tech, etc.)<span style={{ color: "red" }}> *</span></span>}>
                    <Input
                      name="areas_of_collabration"
                      placeholder="Select your Availability"
                      value={data.areas_of_collabration}
                      onChange={handleChange}
                      error={
                        shouldShowError("areas_of_collabration")
                          ? fieldErrors.areas_of_collabration
                          : null
                      }
                    />
                  </Field>
                </div>

                {submitMessage && (
                  <div
                    className={`p-3 rounded-md ${
                      submitMessage.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submitMessage.text}
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-[20px] py-[10px] text-base font-normal text-white disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                    }}
                  >
                    {isSubmitting ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="rounded-xl border border-gray-200 bg-white p-0">
          <Parterform
            // Use your actual Marketplace form’s public URL (formperma link)
            src="https://forms.zohopublic.com/vijicn1/form/BecameaPartner/formperma/P95-zn1fVjDdH3Gfzw89mzvoDjgtPhOOdEKmZRE7crI"
            title="Became a partner Submission"
            minHeight={900}
          />
        </div> */}
      </div>
    </>
  );
};

function Card({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: string;
}) {
  return (
    <div className="w-full h-full rounded-[20px] border border-[#DFDFDF] bg-[#FAFAFA] p-5 flex flex-col justify-center items-center">
      <div className="mb-4 grid h-[58px] w-[58px] place-items-center rounded-[10px] bg-[#6340FF]/10 p-3">
        <img src={icon} className="w-[34px] h-[34px]" />
      </div>

      <h3 className="text-lg font-medium text-[#222224] leading-[24px]">
        {title}
      </h3>
      <p className="mt-2 text-center text-base font-light leading-[24px] text-[#64748B]">
        {body}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-[5px] ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[15px] text-black font-normal">{label}</span>
      {children}
    </label>
  );
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  error?: string | null;
}) {
  return (
    <div className="w-full">
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full h-full rounded-sm border-2 bg-white pt-[15px] px-[12px] pb-[17px] text-[14px] outline-none placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-[20px] ${
          error ? "border-red-500" : "border-[#EEEEEE] focus:border-[#C9C9FF]"
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
}

function TextArea({
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  error?: string | null;
}) {
  return (
    <div className="w-full">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className={`h-full w-full resize-none rounded-sm border-2 bg-white p-[10px] text-[14px] outline-none placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-[20px] ${
          error ? "border-red-500" : "border-[#EEEEEE] focus:border-[#C9C9FF]"
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
}

function PhoneInputField({
  name = "phone",
  value,
  onChange,
  defaultCountry = "us",
  placeholder = "Enter your phone number",
  error,
}: {
  name?: string;
  value: string;
  onChange: (val: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  error?: string | null;
}) {
  return (
    <div className="relative w-full">
      <input type="hidden" name={name} value={value} />

      <div
        className={`${
          error ? "border-red-500" : "border-[#EEEEEE]"
        } border-2 rounded-sm`}
      >
        <PhoneInput
          value={value}
          onChange={onChange}
          defaultCountry={defaultCountry as any}
          forceDialCode
          placeholder={placeholder}
          required
          className="
            h-full bg-white pt-[7px] pb-[8px] text-[14px] outline-none
          "
          inputClassName="
            flex-1 !border-0 outline-none !p-0 !m-0
            placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs"
          countrySelectorStyleProps={{
            buttonClassName: `
                !bg-transparent !border-0 !shadow-none !rounded-none
                !px-2 flex items-center
                border-r border-[#EEEEEE]
              `,
            dropdownStyleProps: {
              className: "!z-[9999]",
            },
            dropdownArrowClassName: "hidden",
          }}
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
}

export default BecomePartner;
