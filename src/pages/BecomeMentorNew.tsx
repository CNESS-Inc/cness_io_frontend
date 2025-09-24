import { Eye, Network, Target } from "lucide-react";
import mentor_banner from "../../public/mentor_banner.jpg";
import who_become from "../../public/who_become.jpg";
import bulb from "../../src/assets/bulb.png";
import applicationform from "../../public/applicationform.jpg";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";
import { createMentor } from "../Common/ServerAPI";
import clsx from "clsx";
import mentor1 from "../assets/mentor1.svg";
import mentor2 from "../assets/mentor2.svg";
import mentor3 from "../assets/mentor3.svg";
import mentor4 from "../assets/mentor4.svg";
import mentor5 from "../assets/mentor5.svg";
import { PhoneInput } from "react-international-phone";

// Define types for the API response and form data
//interface ApiResponse {
// success: boolean;
//message?: string;
//data?: any;
//}

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
  availability: string;
}

const BecomeMentor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<MentorFormData>({
    name: "",
    email: "",
    phone_code: "",
    phone_no: "",
    country_timezone: "",
    year_of_experience: "",
    website: "",
    bio: "",
    motivation: "",
    availability: "",
  });
  const [_fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        break;

      case "name":
        if (value.trim().length < 2)
          return "Name should be at least 2 characters long";
        break;

      case "year_of_experience":
        const experience = Number(value);
        if (isNaN(experience) || experience < 0 || experience > 60)
          return "Please enter a valid years of experience (0-60)";
        break;

      case "website":
        if (value && value.trim() !== "") {
          try {
            new URL(value.startsWith("http") ? value : `https://${value}`);
          } catch {
            return "Please enter a valid website URL";
          }
        }
        break;

      case "bio":
        if (value.trim().length < 50)
          return "Profile summary should be at least 50 characters long";
        if (value.trim().length > 1000)
          return "Profile summary should not exceed 1000 characters";
        break;

      case "motivation":
        if (value.trim().length < 50)
          return "Please provide a more detailed motivation (at least 50 characters)";
        if (value.trim().length > 1000)
          return "Motivation should not exceed 1000 characters";
        break;
    }
    return "";
  };

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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field in real-time
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Handle number input changes specifically
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers, empty string, or 0
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    }
  };

  const [countryCode, setCountryCode] = useState("");

  // Handle phone input change
  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    setCountryCode(country.country.dialCode);
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validation function
    const validateForm = (): string | null => {
      // Required field validation
      const requiredFields: Array<keyof MentorFormData> = [
        "name",
        "email",
        "year_of_experience",
        "bio",
        "motivation",
        "availability",
        "country_timezone", // Add this
      ];

      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === "") {
          return `Please fill in the ${field.replace("_", " ")} field`;
        }
      }

      // Phone validation
      if (!phone || phone.trim() === "") {
        return "Please enter your phone number";
      }

      if (phone.replace(/\D/g, "").length < 5) {
        return "Please enter a valid phone number";
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return "Please enter a valid email address";
      }

      // Name validation
      if (formData.name.trim().length < 2) {
        return "Name should be at least 2 characters long";
      }

      // Experience validation
      if (formData.year_of_experience !== "") {
        const experience = Number(formData.year_of_experience);
        if (isNaN(experience) || experience < 0 || experience > 100) {
          return "Please enter a valid years of experience (0-100)";
        }
      }

      // Website validation (if provided)
      if (formData.website && formData.website.trim() !== "") {
        try {
          new URL(
            formData.website.startsWith("http")
              ? formData.website
              : `https://${formData.website}`
          );
        } catch {
          return "Please enter a valid website URL";
        }
      }

      // Bio and motivation length validation
      if (formData.bio.trim().length < 50) {
        return "Profile summary should be at least 50 characters long";
      }

      if (formData.motivation.trim().length < 50) {
        return "Please provide a more detailed motivation (at least 50 characters)";
      }

      if (formData.bio.trim().length > 1000) {
        return "Profile summary should not exceed 1000 characters";
      }

      if (formData.motivation.trim().length > 1000) {
        return "Motivation should not exceed 1000 characters";
      }

      return null;
    };

    // Perform validation
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage({
        type: "error",
        text: validationError,
      });
      setIsSubmitting(false);
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
          availability: "",
        });
        setPhone("");
        setCountryCode("");
        setCurrentStep(2);
        setSubmitMessage({
          type: "success",
          text: "Application submitted successfully! We will get back to you soon.",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text:
            response.message ||
            "There was an error submitting your application. Please try again.",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="">
        {/* Hero Section */}
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
                <span className="text-[#1A1A1A]">
                  Lead the Next
                  <br /> Wave of{" "}
                </span>
                <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent block">
                  Conscious
                  <br /> Leaders
                </span>
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-base font-light text-[#64748B] leading-[24px]">
                Become a CNESS Mentor and turn your wisdom into a force for
                transformation.Guide professionals, empower learners, and shape
                the future of conscious leadership.
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
                  Apply to Become a Mentor
                </button>
              </div>
            </div>
            <div className="w-full lg:w-2/3 rounded-[40px]">
              <img
                src={mentor_banner}
                alt="partner main poster"
                className="w-full h-[427px] lg:h-full object-cover object-top pointer-events-none select-none rounded-[40px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* <section className="relative overflow-hidden  bg-[linear-gradient(128.73deg,_#FFFFFF_27.75%,_#FEDFDF_100.43%,_#F1A5E5_101.52%)]">
          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <h1 className="font-['Poppins',Helvetica] text-[42px] font-medium tracking-[-0.02em] leading-[54px] align-middle">
                  Lead the Next <br />
                  Wave of <br />
                  <span className="font-bold bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                    Conscious Leaders
                  </span>{" "}
                </h1>
                <p className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[24.4px] tracking-normal uppercase text-[#64748B]">
                  Become a CNESS Mentor and turn your wisdom into a force for
                  transformation.Guide professionals, empower learners, and
                  shape the future of conscious leadership.
                </p>
              </div>
              <Button
                variant="gradient-primary"
                className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                type="submit"
              >
                Apply to Become a Mentor
              </Button>
            </div>

            <div className="lg:col-span-8 relative">
              <img
                src={mentor_banner}
                alt="Professional mentor in modern office environment"
                className="rounded-[30px] shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section> */}

        {/* What is Mentor Section */}
        <div className="py-12 flex flex-col justify-center items-center mx-auto bg-white">
          <h1 className="text-center font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px]">
            <span className="text-black">Why Become a </span>
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              CNESS Mentor
            </span>
          </h1>
          <h5 className="py-3 px-5 sm:px-10 md:px-20 font-['Open_Sans',Helvetica] font-light text-base text-center text-[#64748B] leading-[24px]">
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
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              CNESS Mentor
            </span>
          </h1>
          <div className="w-full pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[40px]">
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
                  <p className="openSans font-['Open Sans'] text-base font-light text-[#64748B] leading-relaxed lg:pe-5">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex justify-center items-center mx-auto w-full bg-white">
          <div className="mx-auto w-full px-[20px] md:px-[60px] pb-[60px] pt-[50px] sm:py-[86px]">
            <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] sm:leading-[54px] text-center">
              <span className="text-black">Why You’ll Love Being a </span>
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
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
                <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Mentor?
                </span>
              </h1>

              <ul className="mt-6 list-disc pl-5 text-[#64748B] text-base font-light leading-[32px] space-y-1">
                <li>
                  Hold at least an Aspiring CNESS Certification (Inspired and
                  Luminary Mentors are highly valued).
                </li>
                <li>
                  {" "}
                  Complete Mentor Training and earn your Certified Mentor Badge.
                </li>
                <li>
                  Uphold CNESS’s eight-pillar framework for conscious growth and
                  leadership.
                </li>
              </ul>
            </div>

            <div className="w-full lg:w-2/5 rounded-[20px] overflow-hidden">
              <img
                src={who_become}
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
                Mentor
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

        {/* Application Form Section */}
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
                src={applicationform}
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
                  <Field label="Name">
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your mail ID"
                      required
                    />
                  </Field>

                  <Field label="Phone Number">
                    <PhoneInputField
                      name="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      defaultCountry="us"
                      placeholder="Enter your phone number"
                    />
                  </Field>
                  <Field label="Country & Time Zone">
                    <Input
                      name="country_timezone"
                      value={formData.country_timezone}
                      onChange={handleInputChange}
                      placeholder="Select your country & Time zone"
                      required
                    />
                  </Field>

                  <Field label="Experience">
                    <Input
                      name="year_of_experience"
                      value={formData.year_of_experience.toString()}
                      onChange={handleNumberInputChange}
                      placeholder="Enter your years of experience"
                      required
                    />
                  </Field>
                  <Field label="Website / Social Media Link (if any)">
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Enter your link"
                    />
                  </Field>

                  <Field label="Profile summary">
                    <TextArea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Add Notes..."
                    />
                  </Field>
                  <Field label="Why do you want to become a mentor?">
                    <TextArea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      placeholder="Add Notes..."
                    />
                  </Field>

                  <Field label="Areas & availability">
                    <Input
                      name="availability"
                      type="text"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="Select your Availability"
                      required
                    />
                  </Field>
                </div>

                {submitMessage && (
                  <div
                    className={`p-3 rounded-md mt-5 ${
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
      </div>
    </>
  );
};

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
  label: string;
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
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full h-full rounded-sm border-2 border-[#EEEEEE] bg-white pt-[15px] px-[12px] pb-[17px] text-[14px] outline-none focus:border-[#C9C9FF] placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-[20px]"
    />
  );
}

// Similarly update TextArea component:
function TextArea({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={placeholder}
      className="h-full w-full resize-none rounded-sm border-2 border-[#EEEEEE] bg-white p-[10px] text-[14px] outline-none focus:border-[#C9C9FF] placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-[20px]"
    />
  );
}

function PhoneInputField({
  name,
  value,
  onChange,
  defaultCountry = "us",
  placeholder = "Enter your phone number",
}: {
  name: string;
  value: string;
  onChange: (value: string, country: any) => void;
  defaultCountry?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input type="hidden" value={value} />

      <PhoneInput
        name={name}
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry as any}
        forceDialCode={true}
        required
        inputProps={{
          name: "phone",
          required: true,
          placeholder: placeholder,
        }}
        className="
          h-full rounded-sm border-2 border-[#EEEEEE] bg-white
          pt-[7px] pb-[8px] text-[14px] outline-none
          focus-within:border-[#C9C9FF]
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
  );
}

export default BecomeMentor;
