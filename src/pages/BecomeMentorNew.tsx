import {
  Check,
  Eye,
  GraduationCap,
  Key,
  Lightbulb,
  Network,
  Target,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import Button from "../components/ui/Button";
import mentor_banner from "../../public/mentor_banner.jpg";
import who_become from "../../public/who_become.jpg";
import bulb from "../../src/assets/bulb.png";
import applicationform from "../../public/applicationform.jpg";
import { Input } from "../components/ui/input";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createMentor } from "../Common/ServerAPI";
import clsx from "clsx";

// Define types for the API response and form data
//interface ApiResponse {
// success: boolean;
//message?: string;
//data?: any;
//}

interface MentorFormData {
  first_name: string;
  last_name: string;
  phone_code: string;
  phone_no: string;
  email: string;
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
    first_name: "",
    last_name: "",
    phone_code: "",
    phone_no: "",
    email: "",
    year_of_experience: "",
    website: "",
    bio: "",
    motivation: "",
    availability: "",
  });

  const benefits = [
    {
      icon: Eye,
      title: "Visibility & Recognition",
      description:
        "Gain credibility with a featured profile that highlights your expertise and impact.",
    },
    {
      icon: Network,
      title: "Expand Your Network",
      description:
        "Build meaningful connections with conscious leaders, professionals, and organizations across the globe.",
    },
    {
      icon: Target,
      title: "Create Legacy ",
      description:
        "Leave a lasting imprint by guiding others toward values-based success.",
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description:
        "Stay ahead through the fresh ideas and perspectives shared by those you mentor.",
    },
    {
      icon: Key,
      title: "Exclusive Access",
      description:
        "Unlock early access to CNESS events, programs, and collaborations.",
    },
  ];
  const role = [
    {
      icon: Eye,
      title: "Guide Certification Applicants",
      description:
        "Help individuals interpret their assessments, strengthen their submissions, and navigate the certification process with confidence.",
    },
    {
      icon: Network,
      title: "Deliver Transformative Learning",
      description:
        "Conduct CNESS-approved workshops, training sessions, and knowledge-sharing circles that bring conscious principles to life.",
    },
    {
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
    },
    {
      step: 2,
      title: "Review",
      description: "Undergo a profile review to align values and expertise.",
    },
    {
      step: 3,
      title: "Onboarding",
      description: "Complete Mentor Training and Evaluation.",
    },
    {
      step: 4,
      title: "Grow Together",
      description: "Receive your Certified Mentor Badge.",
    },
    {
      step: 5,
      title: "Grow Together",
      description: "Access the Mentor Dashboard and begin guiding others.",
    },
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle number input changes specifically
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Only allow numbers, empty string, or 0
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [id]: value === "" ? "" : Number(value),
      }));
    }
  };

  const [countryCode, setCountryCode] = useState("");

  // Handle phone input change
  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    setCountryCode(country.dialCode);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Extract just the national number (without country code)
      const phoneNumber = phone.replace(countryCode, "").trim();

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
          first_name: "",
          last_name: "",
          phone_code: "",
          phone_no: "",
          email: "",
          year_of_experience: "",
          website: "",
          bio: "",
          motivation: "",
          availability: "",
        });
        setPhone("");
        setCountryCode("");
        setCurrentStep(2);
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
      <div className="space-y-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden  bg-[linear-gradient(128.73deg,_#FFFFFF_27.75%,_#FEDFDF_100.43%,_#F1A5E5_101.52%)]">
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
        </section>

        {/* What is Mentor Section */}
        <section className="space-y-8 py-[60px] bg-[#fff]">
          <div className="text-center space-y-2">
            <h2 className="font-['Poppins',Helvetica] font-medium text-[32px] leading-[54px] tracking-[-0.02em] text-center">
              Why Become a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                CNESS Mentor
              </span>
            </h2>

            <div className="max-w-4xl mx-auto">
              <p className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[24.38px] tracking-normal text-center text-[#64748B]">
                A mentor is more than a guide — they are the torchbearers of
                conscious growth. CNESS Mentors are certified professionals who
                extend their values, insights, and expertise to help others
                succeed in their journey of certification and beyond. As a
                Mentor, you not only support individuals in achieving their
                goals but also contribute to a global movement where ethics,
                responsibility, and purpose define success.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12 bg-[#F5F7F9] px-6 sm:px-10 md:px-16 lg:px-22">
          <div className="text-center space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-[40px] lg:leading-[54px] tracking-[-0.02em]">
              Your Role as a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                CNESS Mentor
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {role.map((role, index) => (
              <Card
                key={index}
                className="bg-white rounded-[32px] p-[30px] shadow-none"
              >
                <CardHeader className="p-0 flex flex-row items-center justify-between mb-[25px]">
                  <div className="font-['Poppins',Helvetica] font-medium text-[18px] leading-[24px] tracking-[-0.03em] align-middle text-[#B6B6B6]">
                    {String(index + 1).padStart(3, "0")}
                  </div>

                  <img
                src={bulb}
                alt="Professional mentor in modern office environment"
                className="w-[34px] h-[34px]"
              />
                </CardHeader>

                <CardContent>
                  <CardTitle className="font-['Poppins',Helvetica] mb-[9px] font-medium text-[20px] leading-[24px] tracking-[-0.02em] align-middle text-[#222224]">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[24.4px] tracking-normal align-middle text-[#64748B]">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12 bg-[#fff] px-6 sm:px-10 md:px-16 lg:px-22 py-[86px]">
          <div className="text-center space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-[40px] lg:leading-[54px] tracking-[-0.02em]">
              Why You'll Love Being a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Mentor
              </span>
            </h2>
          </div>

          {/* Grid container */}
          <div className="flex flex-col items-center">
            {/* First row with 3 benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full max-w-5xl">
              {benefits.slice(0, 3).map((benefit, index) => (
                <Card
                  key={index}
                  className="group rounded-[20px] border border-[#DFDFDF] p-5 bg-white"
                >
                  <CardHeader className="space-y-4 flex flex-col items-center">
                    <div className="w-[58px] h-[58px] rounded-[10px] p-3 flex items-center justify-center bg-[#6340FF1A] group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-8 h-8 text-[#6340FF]" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardTitle className="font-['Poppins',Helvetica] mb-[9px] font-medium text-[18px] leading-[24px] tracking-[-0.02em] align-middle text-[#222224] text-center">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="font-['Open_Sans',Helvetica] font-normal text-[14px] leading-[24.4px] tracking-normal text-center align-middle text-[#64748B]">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second row with 2 centered benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {benefits.slice(3, 5).map((benefit, index) => (
                <Card
                  key={index + 3}
                  className="group rounded-[20px] border border-[#DFDFDF] p-5 bg-white"
                >
                  <CardHeader className="space-y-4 flex flex-col items-center">
                    <div className="w-[58px] h-[58px] rounded-[10px] p-3 flex items-center justify-center bg-[#6340FF1A] group-hover:bg-primary/20 transition-colors">
                      <benefit.icon className="w-8 h-8 text-[#6340FF]" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardTitle className="font-['Poppins',Helvetica] mb-[9px] font-medium text-[18px] leading-[24px] tracking-[-0.02em] align-middle text-[#222224] text-center">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="font-['Open_Sans',Helvetica] font-normal text-[14px] leading-[24.4px] tracking-normal text-center align-middle text-[#64748B]">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden  bg-[#F5F7F9]">
          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-4">
                <h1 className="font-['Poppins',Helvetica] text-[42px] font-medium tracking-[-0.02em] leading-[54px] align-middle">
                  Who can become a{" "}
                  <span className="font-bold bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                    Mentor?
                  </span>
                </h1>
                <ul className="list-disc pl-5">
                  <li className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[30.4px] tracking-[0px] text-[#64748B]">
                    Hold at least an Aspiring CNESS Certification (Inspired and
                    Luminary Mentors are highly valued).
                  </li>
                  <li className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[30.4px] tracking-[0px] text-[#64748B]">
                    Complete Mentor Training and earn your Certified Mentor
                    Badge.
                  </li>
                  <li className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[30.4px] tracking-[0px] text-[#64748B]">
                    Uphold CNESS’s eight-pillar framework for conscious growth
                    and leadership.
                  </li>
                </ul>
              </div>
              <Button
                variant="gradient-primary"
                className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                type="submit"
              >
                Apply to Become a Mentor
              </Button>
            </div>

            <div className="lg:col-span-4 relative">
              <img
                src={who_become}
                alt="Professional mentor in modern office environment"
                className="rounded-[30px] shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-white px-6 sm:px-10 md:px-16 lg:px-22 py-[60px] mb-0">
          <div className="text-center mb-10">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-[40px] lg:leading-[54px] tracking-[-0.02em]">
              Your Path to Becoming a{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Mentor
              </span>
            </h2>
          </div>

          <div className="relative flex justify-between">
            {/* grey background line */}
            {/* grey background line */}
            <div
              className="absolute top-5 left-[calc(theme(spacing.5))] right-[calc(theme(spacing.5))] h-1 bg-[#6340FF]"
              style={{
                // start at center of first circle, end at center of last circle:
                left: "calc(5.25rem)", // 1.25rem = h-10/2 = center of circle
                right: "calc(5.25rem)",
              }}
            />

            {/* active progress line */}
            <div
              className="absolute top-5 h-1 bg-[#6340FF]"
              style={{
                left: "calc(1.25rem)", // start at center of first circle
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

                  {/* Title */}
                  {/* <h3 className="mt-4 text-center font-['Poppins',Helvetica] text-sm font-semibold text-gray-800">
                    {step.title}
                  </h3> */}
                  {/* Description */}
                  <p className="mt-[21px] text-center font-['Open_Sans',Helvetica] text-xs text-gray-500 max-w-[150px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Application Form Section */}
        <section className="space-y-10 bg-[#F5F7F9] py-10">
          <div className="text-center space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-medium text-[32px] leading-[54px] tracking-[-0.02em] align-middle">
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Application Form
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4">
            {/* Steps - col-3 */}
            <div className="lg:col-span-3 space-y-6">
              <img
                src={applicationform}
                alt="Professional mentor in modern office environment"
                className="rounded-[30px] shadow-2xl w-full h-full object-cover"
              />
            </div>

            {/* Form - col-9 */}
            <div className="lg:col-span-9">
              <Card className="flex opacity-100 shadow-none">
                <CardContent className="w-full pt-[30px] pr-[26px] pb-[30px] pl-[26px] gap-[30px] rounded-[25px] bg-[#F7F7F7]">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="first_name"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          First Name
                        </label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last_name"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Last Name
                        </label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Phone Number
                        </label>
                        <PhoneInput
                          country={"us"}
                          value={phone}
                          onChange={handlePhoneChange}
                          containerClass="!w-full"
                          inputClass="
        !w-full 
        !h-[53px] 
        !bg-white 
        !border-2 
        !border-[#EEEEEE] 
        !rounded-[4px] 
        pl-[60px]
      "
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="year_of_experience"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Years of Experience
                        </label>
                        <Input
                          id="year_of_experience"
                          type="number"
                          min="0"
                          value={formData.year_of_experience}
                          onChange={handleNumberInputChange}
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter your years of experience"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="website"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Website / Social Media Link (if any)
                        </label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="Enter your link"
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="bio"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Short Bio
                        </label>
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px] block w-full rounded-md px-3 py-2 bg-white border-2 border-[#EEEEEE] focus:outline-none focus:ring-0"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="motivation"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Why do you want to become a mentor?
                        </label>
                        <textarea
                          id="motivation"
                          value={formData.motivation}
                          onChange={handleInputChange}
                          placeholder="Share your motivation..."
                          className="min-h-[100px] block w-full px-3 py-2 rounded-[4px] bg-white border-2 border-[#EEEEEE] focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="availability"
                        className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                      >
                        Availability (Hours per month you can commit)
                      </label>
                      <Input
                        id="availability"
                        type="text"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                        placeholder="Select your Availability"
                        required
                      />
                    </div>

                    {/* Submission status message */}
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

                    <div className="flex justify-center">
                      <Button
                        variant="gradient-primary"
                        className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-none tracking-normal text-center w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BecomeMentor;
