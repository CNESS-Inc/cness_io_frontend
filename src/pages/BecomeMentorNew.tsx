import { Eye, Network, Target } from "lucide-react";
import bulb from "../../src/assets/bulb.png";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { createMentor, isMentorOrPartner } from "../Common/ServerAPI";
import clsx from "clsx";
import mentor1 from "../assets/mentor1.svg";
import mentor2 from "../assets/mentor2.svg";
import mentor3 from "../assets/mentor3.svg";
import mentor4 from "../assets/mentor4.svg";
import mentor5 from "../assets/mentor5.svg";
import { PhoneInput } from "react-international-phone";
import TimezoneSelect from "react-timezone-select";
import { useToast } from "../components/ui/Toast/ToastProvider";

// Define types for the API response and form data
interface MentorFormData {
  name: string;
  email: string;
  phone_code: string;
  phone_no: string;
  country_timezone: string;
  year_of_experience: number | "";
  website: string;
  bio: string;
  motivation: string;
}

// Props interfaces for form components
interface FormInputProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: () => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  error?: string;
  touched?: boolean;
}

interface FormSelectProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}

interface FormTextAreaProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: () => void;
  placeholder?: string;
  charCount?: number;
  minChars?: number;
  maxChars?: number;
  error?: string;
  touched?: boolean;
}

const BecomeMentor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timezone, setTimezone] = useState<any | string>("");
  const [bioCount, setBioCount] = useState(0);
  const [motivationCount, setMotivationCount] = useState(0);
  const [hasSubmittedMentorForm, setHasSubmittedMentorForm] = useState<
    boolean | null
  >(null);
  const { showToast } = useToast();

  // Form state
  const [formData, setFormData] = useState<MentorFormData>({
    name: "",
    email: "",
    phone_code: "",
    phone_no: "",
    country_timezone: timezone?.value || "",
    year_of_experience: "",
    website: "",
    bio: "",
    motivation: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  console.log("🚀 ~ BecomeMentor ~ fieldErrors:", fieldErrors);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    phone: false,
    year_of_experience: false,
    website: false,
    bio: false,
    motivation: false,
    country_timezone: false,
  });
  const [countryCode, setCountryCode] = useState("");

  const benefits = [
    {
      icon: mentor1,
      title: "Visibility & Recognition",
      body: "Gain credibility with a featured profile that highlights your expertise and impact.",
    },
    {
      icon: mentor2,
      title: "Expand Your Network",
      body: "Build meaningful connections with conscious leaders, professionals, and organizations across the globe.",
    },
    {
      icon: mentor3,
      title: "Create Legacy ",
      body: "Leave a lasting imprint by guiding others toward values-based success.",
    },
    {
      icon: mentor4,
      title: "Continuous Learning",
      body: "Stay ahead through the fresh ideas and perspectives shared by those you mentor.",
    },
    {
      icon: mentor5,
      title: "Exclusive Access",
      body: "Unlock early access to CNESS events, programs, and collaborations.",
    },
  ];

  const role = [
    {
      id: "01",
      icon: Eye,
      title: "Guide Certification Applicants",
      description:
        "Help individuals interpret their assessments, strengthen their submissions, and navigate the certification process with confidence.",
    },
    {
      id: "02",
      icon: Network,
      title: "Deliver Transformative Learning",
      description:
        "Conduct CNESS-approved workshops, training sessions, and knowledge-sharing circles that bring conscious principles to life.",
    },
    {
      id: "03",
      icon: Target,
      title: "Strengthen the Network",
      description:
        "Actively contribute to the ecosystem by sharing best practices, referring new mentors and partners, and modeling the DoCM principles with integrity.",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Apply",
      description: "Apply online through the CNESS platform.",
      width: "w-[60%]",
    },
    {
      step: 2,
      title: "Review",
      description: "Undergo a profile review to align values and expertise.",
      width: "w-[70%]",
    },
    {
      step: 3,
      title: "Onboarding",
      description: "Complete Mentor Training and Evaluation.",
      width: "w-[75%]",
    },
    {
      step: 4,
      title: "Grow Together",
      description: "Receive your Certified Mentor Badge.",
      width: "w-[60%]",
    },
    {
      step: 5,
      title: "Grow Together",
      description: "Access the Mentor Dashboard and begin guiding others.",
      width: "w-[90%]",
    },
  ];

  // Validation functions
  const validateField = (field: string, value: string): string => {
    const trimmedValue = value.trim();

    switch (field) {
      case "email":
        if (!trimmedValue) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue))
          return "Please enter a valid email address";
        return "";

      case "name":
        if (!trimmedValue) return "Name is required";
        if (trimmedValue.length < 2)
          return "Name should be at least 2 characters long";
        if (!/^[a-zA-Z\s]+$/.test(trimmedValue))
          return "Name should contain only letters and spaces";
        return "";

      case "year_of_experience":
        if (!trimmedValue) return "Years of experience is required";
        const experience = Number(trimmedValue);
        if (isNaN(experience) || experience < 0 || experience > 60)
          return "Please enter a valid years of experience (0-60)";
        return "";

      case "website":
        if (trimmedValue && trimmedValue !== "") {
          try {
            // Add protocol if missing
            const urlWithProtocol = trimmedValue.startsWith("http")
              ? trimmedValue
              : `https://${trimmedValue}`;
            new URL(urlWithProtocol);
          } catch {
            return "Please enter a valid website URL (e.g., https://example.com)";
          }
        }
        return "";

      case "bio":
        if (!trimmedValue) return "Profile summary is required";
        if (trimmedValue.length < 50)
          return "Profile summary should be at least 50 characters long";
        if (trimmedValue.length > 1000)
          return "Profile summary should not exceed 1000 characters";
        return "";

      case "country_timezone":
        if (!trimmedValue) return "Please select your timezone";
        return "";

      case "motivation":
        if (!trimmedValue) return "Motivation is required";
        if (trimmedValue.length < 50)
          return "Please provide a more detailed motivation (at least 50 characters)";
        if (trimmedValue.length > 1000)
          return "Motivation should not exceed 1000 characters";
        return "";

      default:
        return "";
    }
  };

  const validatePhone = (
    phone: string,
    _countryCode: string,
    isTouched: boolean = false
  ): string => {
    if (!isTouched) return "";

    if (!phone.trim()) return "Phone number is required";
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) return "Please enter a valid phone number";
    return "";
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "bio") setBioCount(value.length);
    if (name === "motivation") setMotivationCount(value.length);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field in real-time
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle blur events
  const handleBlur = (fieldName: string) => {
    console.log("🚀 ~ handleBlur ~ fieldName:", fieldName);
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate the field on blur
    const value = formData[fieldName as keyof MentorFormData];
    const error = validateField(fieldName, value.toString());
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Handle phone input change
  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    setCountryCode(country.country.dialCode);

    // Mark phone as touched
    setTouchedFields((prev) => ({
      ...prev,
      phone: true,
    }));

    const error = validatePhone(
      value,
      country.country.dialCode,
      touchedFields.phone
    );
    console.log("🚀 ~ handlePhoneChange ~ error:", error)
    setFieldErrors((prev) => ({
      ...prev,
      phone: error,
    }));
  };

  const handleTimezoneChange = (tz: any) => {
    setTimezone(tz);

    // Get the timezone value (could be string or object with value property)
    const timezoneValue = typeof tz === "string" ? tz : tz?.value || "";

    // Update form data
    setFormData((prev) => ({
      ...prev,
      country_timezone: timezoneValue,
    }));

    // Mark as touched
    setTouchedFields((prev) => ({
      ...prev,
      country_timezone: true,
    }));

    // Validate
    const error = validateField("country_timezone", timezoneValue);
    setFieldErrors((prev) => ({
      ...prev,
      country_timezone: error,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allFields = {
      name: true,
      email: true,
      phone: true,
      year_of_experience: true,
      bio: true,
      motivation: true,
      website: true,
      country_timezone: true,
    };
    setTouchedFields(allFields);

    // Validate all fields
    const errors: Record<string, string> = {};

    // Validate form fields
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof MentorFormData].toString();
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    // Validate phone separately
const phoneError = validatePhone(phone, countryCode, true);
    if (phoneError) errors.phone = phoneError;

    // Validate timezone
    if (!formData.country_timezone) {
      errors.country_timezone = "Please select your timezone";
    }

    // Set all errors at once
    setFieldErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      setIsSubmitting(false);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      // Extract just the national number (without country code)
      const phoneNumber = phone.replace(`+${countryCode}`, "").trim();

      // Convert year_of_experience to number (default to 0 if empty)
      const yearOfExperience =
        formData.year_of_experience === ""
          ? 0
          : Number(formData.year_of_experience);

      const submissionData = {
        ...formData,
        phone_code: Number(countryCode),
        phone_no: Number(phoneNumber),
        year_of_experience: yearOfExperience,
      };

      // Call the API
      const response = await createMentor(submissionData);

      if (response.success) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone_code: "",
          phone_no: "",
          country_timezone: "",
          year_of_experience: "",
          website: "",
          bio: "",
          motivation: "",
        });
        setPhone("");
        setCountryCode("");
        setTimezone("");
        setBioCount(0);
        setMotivationCount(0);
        setCurrentStep(2);
        setFieldErrors({});
        setTouchedFields({});
        showToast({
          message: response.success.message,
          type: "success",
          duration: 3000,
        });
        await fetchSubmit();
      }
    } catch (error: any) {
      showToast({
        message:
          error.response?.data?.error?.message ||
          "An error occurred. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSubmit = async () => {
    try {
      const res = await isMentorOrPartner();
      setHasSubmittedMentorForm(res.data.data.mentor_form);
    } catch (error: any) {
      showToast({
        message:
          error.response?.data?.error?.message ||
          "Failed to check mentor status",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchSubmit();
  }, []);

  return (
    <div className="px-5 2xl:px-5 pt-2 md:pt-2 pb-5 md:pb-18">
      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <div
          className="py-[33px] px-10"
          style={{
            background:
              "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-stretch gap-5">
            <div
              className="w-full lg:w-1/3 
              py-[30px] px-5 
              pb-[50px]       /* space for button */
              gap-6 
              bg-white 
              rounded-[40px]"
            >
              <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[42px] lg:text-3xl xl:text-[42px] md:leading-[54px] lg:leading-10 xl:leading-[54px] text-wrap">
                <span className="text-[#1A1A1A]">
                  Lead the Next
                  <br /> Wave of{" "}
                </span>
                <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent block">
                  Conscious
                  <br /> Leaders
                </span>
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-base font-light text-[#242424] leading-6">
                Become a CNESS Mentor and turn your wisdom into a force for
                transformation. Guide professionals, empower learners, and shape
                the future of conscious leadership.
              </h5>
              <div className="pt-6">
                <button
                  className="
                  inline-flex items-center justify-center
                    px-4 py-2              /* compact for tiny screens */
                    xs:px-5 xs:py-2.5      /* slightly larger for >375px */
                    sm:px-7 sm:py-3        /* normal size for tablets */
                    md:px-8                /* larger desktops */
                    
                    rounded-full 
                    font-openSans font-medium
                    text-white
                    text-sm sm:text-base
                    whitespace-nowrap
                    leading-none
                    max-w-full
                  "
                  style={{
                    background:
                      "linear-gradient(97deg, #7077FE 8%, #F07EFF 107%)",
                  }}
                  onClick={() => {
                    const element = document.getElementById("apply_partner");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Apply to Become a Mentor
                </button>
              </div>
            </div>
            <div className="w-full lg:w-2/3 rounded-[40px]">
              <img
                src="https://cdn.cness.io/mentor_banner.jpg"
                alt="partner main poster"
                className="w-full h-[427px] lg:h-full object-cover object-top pointer-events-none select-none rounded-[40px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* What is Mentor Section */}
        <div className="py-12 flex flex-col justify-center items-center mx-auto bg-white">
          <h1 className="text-center font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px]">
            <span className="text-black">Why Become a </span>
            <span className="bg-linear-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              CNESS Mentor
            </span>
          </h1>
          <h5 className="py-3 px-5 sm:px-10 md:px-20 font-['Open_Sans',Helvetica] font-light text-base text-center text-[#242424] leading-6">
            A mentor is more than a guide — they are the torchbearers of
            conscious growth. CNESS Mentors are certified professionals who
            extend their values, insights, and expertise to help others succeed
            in their journey of certification and beyond. As a Mentor, you not
            only support individuals in achieving their goals but also
            contribute to a global movement where ethics, responsibility, and
            purpose define success.
          </h5>
        </div>

        {/* Benefits Section */}
        <div className="w-full flex mx-auto flex-col justify-center items-center bg-[#F5F7F9] pt-10 pb-[86px] px-5 sm:px-14">
          <h1 className="font-['Poppins',Helvetica] text-center font-medium text-2xl md:text-[32px] sm:leading-[54px]">
            <span className="text-black">Your Role as a </span>
            <span className="bg-linear-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              CNESS Mentor
            </span>
          </h1>
          <div className="w-full pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-10">
              {role.map((item) => (
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
                  <p className="font-['Open_Sans'] text-base font-light text-[#242424] leading-relaxed lg:pe-5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex justify-center items-center mx-auto w-full bg-white">
          <div className="mx-auto w-full px-5 md:px-[60px] pb-[60px] pt-[50px] sm:py-[86px]">
            <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px] text-center">
              <span className="text-black">Why You'll Love Being a </span>
              <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Mentor
              </span>
            </h1>
            <div className="mx-auto mt-8 w-full 2xl:w-7xl flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
              {benefits.map((c, i) => (
                <div key={i} className="w-full sm:w-[300px] flex">
                  <BenefitCard title={c.title} body={c.body} icon={c.icon} />
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
                <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Mentor?
                </span>
              </h1>

              <ul className="font-['Open_Sans'] mt-6 list-disc pl-5 text-[#242424] text-base font-light leading-8 space-y-1">
                <li>
                  Hold at least an Aspiring CNESS Certification (Inspired and
                  Luminary Mentors are highly valued).
                </li>
                <li>
                  {" "}
                  Complete Mentor Training and earn your Certified Mentor Badge.
                </li>
                <li>
                  Uphold CNESS's eight-pillar framework for conscious growth and
                  leadership.
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-2/5 rounded-[20px] overflow-hidden">
              <img
                src="https://cdn.cness.io/who_become.jpg"
                alt="Handshake"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <section className="hidden sm:flex flex-col bg-white px-6 sm:px-10 md:px-16 lg:px-22 py-[60px] mb-0">
          <div className="text-center mb-10">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-10 lg:leading-[54px] tracking-[-0.02em]">
              Your Path to Becoming a{" "}
              <span className="bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Mentor
              </span>
            </h2>
          </div>

          <div className="relative flex justify-between">
            <div
              className="absolute top-5 left-[calc(--spacing(5))] right-[calc(--spacing(5))] h-1 bg-[#6340FF]"
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
                      "mt-[21px] text-center font-['Open_Sans',Helvetica] text-sm font-light text-[#242424]",
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

        {/* Application Form Section */}
        <div
          id="apply_partner"
          className="w-full bg-[#F5F7F9] pb-10 sm:py-10 px-5 lg:px-10"
        >
          <h1 className="pb-10 font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
            <span className="bg-linear-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Application Form
            </span>
          </h1>

          <div className="grid xl:grid-cols-[275px_1fr] gap-10 items-stretch">
            <div className="hidden xl:flex rounded-[20px] overflow-hidden">
              <img
                src="https://cdn.cness.io/applicationform.jpg"
                alt="Handshake"
                className="h-full w-full object-cover"
              />
            </div>

            {hasSubmittedMentorForm ? (
              <div className="w-full bg-[#F5F7F9] py-10 px-5 lg:px-10">
                <div className="max-w-4xl mx-auto bg-white rounded-[25px] p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Application Submitted Successfully!
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Thank you for your interest in becoming a CNESS Mentor.
                      Your application has been received and is currently under
                      review.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[25px] bg-white p-5 lg:p-[30px] flex flex-col">
                <form
                  className="w-full flex flex-col flex-1"
                  onSubmit={handleSubmit}
                >
                  <div className="mx-auto w-full max-w-[760px] 2xl:max-w-none grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                    <Field
                      label={
                        <span>
                          Name <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("name")}
                        placeholder="Enter your name"
                        error={fieldErrors.name}
                        touched={touchedFields.name}
                      />
                    </Field>

                    <Field
                      label={
                        <span>
                          Email Address
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        placeholder="Enter your mail ID"
                        error={fieldErrors.email}
                        touched={touchedFields.email}
                      />
                    </Field>

                    <Field
                      label={
                        <span>
                          Phone Number<span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <PhoneInputField
                        name="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur("phone")}
                        defaultCountry="us"
                        placeholder="Enter your phone number"
                        error={fieldErrors.phone}
                        touched={touchedFields.phone}
                      />
                    </Field>

                    <Field
                      label={
                        <span>
                          Country & Time Zone
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <div className="w-full">
                        <div
                          className={`w-full h-full rounded-sm border-2 bg-white pt-[9px] pb-[9px] px-1 text-[14px] outline-none transition-colors ${
                            fieldErrors.country_timezone &&
                            touchedFields.country_timezone
                              ? "border-red-500 focus-within:border-red-600"
                              : "border-[#EEEEEE] focus-within:border-[#C9C9FF]"
                          }`}
                        >
                          <TimezoneSelect
                            value={timezone}
                            onChange={handleTimezoneChange}
                            onBlur={() => handleBlur("country_timezone")}
                            styles={customSelectStyles}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                        {fieldErrors.country_timezone &&
                          touchedFields.country_timezone && (
                            <p className="text-red-500 text-xs mt-1">
                              {fieldErrors.country_timezone}
                            </p>
                          )}
                      </div>
                    </Field>

                    <Field
                      label={
                        <span>
                          Experience<span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <Select
                        name="year_of_experience"
                        value={formData.year_of_experience.toString()}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("year_of_experience")}
                        placeholder="Select your years of experience"
                        error={fieldErrors.year_of_experience}
                        touched={touchedFields.year_of_experience}
                      >
                        {[...Array(31).keys()].map((year) => (
                          <option key={year} value={year}>
                            {year} {year === 1 ? "year" : "years"}
                          </option>
                        ))}
                        <option value="more">More than 31</option>
                      </Select>
                    </Field>

                    <Field label="Website / Social Media Link (if any)">
                      <Input
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("website")}
                        placeholder="Enter your link"
                        error={fieldErrors.website}
                        touched={touchedFields.website}
                      />
                    </Field>

                    <Field
                      label={
                        <span>
                          Profile Summary
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <TextArea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("bio")}
                        placeholder="Add Notes..."
                        charCount={bioCount}
                        error={fieldErrors.bio}
                        touched={touchedFields.bio}
                      />
                    </Field>

                    <Field
                      label={
                        <span>
                          Why do you want to become a mentor?
                          <span style={{ color: "red" }}> *</span>
                        </span>
                      }
                    >
                      <TextArea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("motivation")}
                        placeholder="Add Notes..."
                        charCount={motivationCount}
                        error={fieldErrors.motivation}
                        touched={touchedFields.motivation}
                      />
                    </Field>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full px-5 py-2.5 text-base font-normal text-white disabled:opacity-60 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: BenefitCard
function BenefitCard({
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
        <img src={icon} className="w-[34px] h-[34px]" alt={title} />
      </div>

      <h3 className="text-lg font-poppins font-medium text-[#222224] leading-6">
        {title}
      </h3>
      <p className="mt-2 font-['Open_Sans'] text-center text-base font-light leading-6 text-[#242424]">
        {body}
      </p>
    </div>
  );
}

// Component: Field
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

// Component: Input
function Input({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required = false,
  error = "",
  touched = false,
}: FormInputProps) {
  const showError = error && touched;

  return (
    <div className="w-full">
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full h-full rounded-sm border-2 bg-white pt-[15px] px-3 pb-[17px] text-[14px] outline-none transition-colors ${
          showError
            ? "border-red-500 focus:border-red-600"
            : "border-[#EEEEEE] focus:border-[#C9C9FF]"
        } placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-5`}
      />
      {showError && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Component: Select
function Select({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error = "",
  touched = false,
  children,
}: FormSelectProps) {
  const showError = error && touched;

  return (
    <div className="relative group w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full appearance-none py-[15px] px-3 rounded-sm border-2 bg-white text-[14px] outline-none transition-colors ${
          showError
            ? "border-red-500 focus:border-red-600"
            : "border-[#EEEEEE] focus:border-[#C9C9FF]"
        } ${value ? "text-black" : "text-[#6E7179]"}`}
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700 border-l border-gray-300 h-fit top-1/2 -translate-y-2/2">
        <svg
          className={`fill-current h-5 w-5 group-focus-within:text-black ${
            showError ? "text-red-500" : "text-[#ccc]"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.516 7.548L10 12.032l4.484-4.484L16 9.064l-6 6-6-6z" />
        </svg>
      </div>
      {showError && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Component: TextArea
function TextArea({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  charCount,
  minChars = 50,
  maxChars = 1000,
  error = "",
  touched = false,
}: FormTextAreaProps) {
  const showError = error && touched;
  const isValid = charCount
    ? charCount >= minChars && charCount <= maxChars
    : false;
  const isOverLimit = charCount ? charCount > maxChars : false;
  const isTooShort = charCount ? charCount < minChars && charCount > 0 : false;

  return (
    <div className="relative w-full">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        rows={4}
        placeholder={placeholder}
        className={`h-full w-full resize-none rounded-sm border-2 bg-white p-2.5 text-[14px] outline-none transition-colors ${
          showError
            ? "border-red-500 focus:border-red-600"
            : "border-[#EEEEEE] focus:border-[#C9C9FF]"
        } placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-5`}
      />

      <div className="flex justify-between items-center text-xs mt-1">
        <div>
          {showError ? (
            <span className="text-red-500">{error}</span>
          ) : charCount !== undefined ? (
            <span
              className={
                isTooShort
                  ? "text-orange-500"
                  : isOverLimit
                  ? "text-red-500"
                  : isValid
                  ? "text-green-600"
                  : "text-gray-500"
              }
            >
              {isTooShort && `Need ${minChars - charCount} more characters`}
              {isValid && "✓ Good"}
              {isOverLimit && `${charCount - maxChars} characters over limit`}
              {charCount === 0 && `Minimum ${minChars} characters required`}
            </span>
          ) : null}
        </div>
        {charCount !== undefined && (
          <span
            className={
              isOverLimit
                ? "text-red-500"
                : isTooShort
                ? "text-orange-500"
                : "text-gray-500"
            }
          >
            {charCount}/{maxChars}
          </span>
        )}
      </div>
    </div>
  );
}

// Component: PhoneInputField
function PhoneInputField({
  name,
  value,
  onChange,
  onBlur,
  defaultCountry = "us",
  placeholder = "Enter your phone number",
  error = "",
  touched = false,
}: {
  name: string;
  value: string;
  onChange: (value: string, country: any) => void;
  onBlur?: () => void;
  defaultCountry?: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
}) {
const showError = error && touched;

  return (
    <div className="relative w-full">
      <input type="hidden" value={value} />
      <PhoneInput
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        defaultCountry={defaultCountry as any}
        forceDialCode={true}
        inputProps={{
          name: "phone",
          required: true,
          placeholder: placeholder,
          onBlur: onBlur,
        }}
        className={`
          h-full rounded-sm border-2 bg-white
          pt-[7px] pb-2 text-[14px] outline-none transition-colors
          ${
            showError
              ? "border-red-500 focus-within:border-red-600"
              : "border-[#EEEEEE] focus-within:border-[#C9C9FF]"
          }
        `}
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
      {showError && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// TimezoneSelect styles
const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    padding: 0,
    minHeight: "auto",
    backgroundColor: "transparent",
    "&:hover": {
      border: "none",
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#6E7179",
    fontSize: "12px",
    fontWeight: "400",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontSize: "14px",
    color: "#000",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: "0 8px",
    color: "#6E7179",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "auto",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#6340FF"
      : state.isFocused
      ? "#F3F4F6"
      : "white",
    color: state.isSelected ? "white" : "#333",
    "&:hover": {
      backgroundColor: state.isSelected ? "#6340FF" : "#F3F4F6",
    },
  }),
};

export default BecomeMentor;
