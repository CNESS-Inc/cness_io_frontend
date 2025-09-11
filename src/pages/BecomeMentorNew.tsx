import {
  Award,
  BookOpen,
  Check,
  Eye,
  GraduationCap,
  Key,
  Network,
  Target,
  Users,
} from "lucide-react";
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

const BecomeMentor = () => {
  const [currentStep, _setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
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

  return (
    <>
      {/* <div className="p-0">
        <div className="rounded-xl border border-gray-200 bg-white p-0">
          <Mentorform
            // Use your actual Marketplace form’s public URL (formperma link)
            src="https://forms.zohopublic.com/vijicn1/form/BecameanMentor/formperma/mwyGIJHdCeSv97Vv2SwTmygPofaQEi7OwYEyE3hLqSg"
            title="Marketplace Submission"
            minHeight={900}
          />
        </div>
      </div> */}
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
                    {/* <benefit.icon className="w-6 h-6 text-primary" /> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#6340FF"
                      className="w-8.5 h-8.5" // 34px = 8.5 * 4px (Tailwind uses 4px units)
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
                            // purple background for active + completed
                            "bg-[#6340FF] text-white": isActive || isCompleted,
                            // gray for future steps
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
              <Card className="flex opacity-100   shadow-none ">
                <CardContent className="w-full pt-[30px] pr-[26px] pb-[30px] pl-[26px] gap-[30px] rounded-[25px] bg-[#F7F7F7]">
                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter last name"
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
  onChange={(value) => setPhone(value)}
  containerClass="!w-full" // make wrapper full width
  inputClass="
    !w-full 
    !h-[53px] 
    !bg-white 
    !border-2 
    !border-[#EEEEEE] 
    !rounded-[4px] 
    pl-[60px]   // 👈 increase this to whatever you want (e.g. 60px, 64px)
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
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="experience"
                          className="font-['Inter',Helvetica] font-normal text-[15px] leading-none tracking-normal text-black"
                        >
                          Years of Experience
                        </label>
                        <Input
                          id="experience"
                          type="text"
                          className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                          placeholder="Enter your years of experience"
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
                          placeholder="Tell us about yourself..."
                          className="min-h-[100px] block w-full rounded-md px-3 py-2 bg-white border-2 border-[#EEEEEE] focus:outline-none focus:ring-0"
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
                          placeholder="Share your motivation..."
                          className="min-h-[100px] block w-full px-3 py-2 rounded-[4px] bg-white border-2 border-[#EEEEEE] focus:outline-none focus:ring-0"
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
                        className="h-[53px] opacity-100 pr-[10px] pl-[10px] gap-[10px] rounded-[4px] bg-white border-2 border-[#EEEEEE] focus-visible:ring-transparent"
                        placeholder="Select your Availability"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="gradient-primary"
                        className="font-['Open_Sans',Helvetica] font-normal text-[16px] leading-none tracking-normal text-center w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                      >
                        Submit
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
