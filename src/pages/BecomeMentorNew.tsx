import { Check, Eye, GraduationCap, Key, Network, Target } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import Button from "../components/ui/Button";
import mentor_banner from "../../public/mentor_banner.png";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { createMentor } from "../Common/ServerAPI";

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
        "Showcase your expertise to a professional network and build your professional credibility.",
    },
    {
      icon: Network,
      title: "Expand Your Network",
      description:
        "Connect with like-minded professionals, leaders, and organizations.",
    },
    {
      icon: Target,
      title: "Impact & Legacy",
      description:
        "Make a meaningful difference by sharing your expertise and helping others grow.",
    },
    {
      icon: GraduationCap,
      title: "Continuous Learning",
      description:
        "Gain fresh perspectives while mentoring and keep up with industry trends.",
    },
    {
      icon: Key,
      title: "Exclusive Access",
      description:
        "Early access to CNESS events, resources, and premier opportunities.",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Apply",
      description: "Fill out the mentor application form.",
    },
    {
      step: 2,
      title: "Review",
      description: "Our team evaluates your expertise and profile.",
    },
    {
      step: 3,
      title: "Onboarding",
      description: "Once approved, you'll get access to your mentor dashboard.",
    },
    {
      step: 4,
      title: "Grow Together",
      description: "Fill out the mentor application form.",
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
  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const yearOfExperience = formData.year_of_experience === "" ? 0 : Number(formData.year_of_experience);

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
                  Become a <br />
                  <span className="font-bold bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                    Mentor
                  </span>{" "}
                  <br />
                  with CNESS
                </h1>
                <p className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[24.4px] tracking-normal uppercase text-[#64748B]">
                  Share your knowledge, inspire <br /> growth, and make an
                  impact.
                </p>
              </div>
              <Button
                variant="gradient-primary"
                className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                type="submit"
              >
                Apply as Mentor
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
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-['Poppins',Helvetica] font-medium text-[32px] leading-[54px] tracking-[-0.02em] text-center">
              What is{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Mentor?
              </span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-[24.38px] tracking-normal text-center text-[#64748B]">
                Mentor by CNESS is a platform that connects mentors with
                purpose-driven learners, creating opportunities to share
                knowledge, experience, and guidance. As a mentor, you not only
                inspire growth in others but also strengthen your own learning
                journey. The program allows you to gain visibility, expand your
                network, and build lasting impact within the community. By
                mentoring, you contribute to shaping a conscious ecosystem where
                wisdom and collaboration drive progress. Together, we create
                meaningful change and a future built on purpose.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="space-y-12 bg-[#F5F7F9] px-6 sm:px-10 md:px-16 lg:px-22">
          <div className="text-center space-y-4">
            <h2 className="font-['Poppins',Helvetica] font-medium text-2xl sm:text-3xl lg:text-[32px] leading-snug sm:leading-[40px] lg:leading-[54px] tracking-[-0.02em]">
              Benefits of{" "}
              <span className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Being a Mentor
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group rounded-[20px] border border-[#DFDFDF] p-5 bg-white"
              >
                <CardHeader className="space-y-4 flex flex-col items-center">
                  <div className="w-[58px] h-[58px] rounded-[10px] p-3 flex items-center justify-center bg-[#6340FF1A] group-hover:bg-primary/20 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6340FF"
                      className="w-8.5 h-8.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
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
        </section>

        {/* Application Form Section */}
        <section className="space-y-10 bg-white py-10">
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
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="relative flex items-start mb-0">
                    {/* Step Circle + Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 mt-0",
                          {
                            "bg-[#6340FF] text-white": isActive || isCompleted,
                            "bg-gray-200 text-gray-500":
                              !isActive && !isCompleted,
                          }
                        )}
                      >
                        {isActive || isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">
                            {stepNumber}
                          </span>
                        )}
                      </div>

                      {/* vertical line */}
                      {!isLast && (
                        <div
                          className={cn("h-16 w-0.5", {
                            "bg-[#6340FF]": isActive || isCompleted,
                            "bg-gray-200": !isActive && !isCompleted,
                          })}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="ml-4 flex-1">
                      <h3
                        className={cn(
                          "font-['Poppins',Helvetica] text-lg font-semibold transition-colors duration-300 text-[#6340FF]"
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className="font-['Open_Sans',Helvetica] mt-1 text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
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