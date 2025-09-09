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
import { Label, Select, Textarea } from "@headlessui/react";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { useState } from "react";

const BecomeMentor = () => {
  const [currentStep, _setCurrentStep] = useState(1);
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
      title: "Apply",
      description: "Fill out the mentor application form.",
    },
    {
      title: "Review",
      description: "Our team evaluates your expertise and profile.",
    },
    {
      title: "Onboarding",
      description: "Once approved, you'll get access to your mentor dashboard.",
    },
    {
      title: "Grow Together",
      description: "Start mentoring and help others grow in their careers.",
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
              {[
                {
                  step: 1,
                  title: "Apply",
                  description: "Fill out the mentor application form.",
                  icon: Users,
                  completed: true,
                },
                {
                  step: 2,
                  title: "Review",
                  description: "Our team evaluates your expertise and profile.",
                  icon: Eye,
                  completed: false,
                },
                {
                  step: 3,
                  title: "Onboarding",
                  description:
                    "Once approved, you'll get access to your mentor dashboard.",
                  icon: BookOpen,
                  completed: false,
                },
                {
                  step: 4,
                  title: "Grow Together",
                  description: "Fill out the mentor application form.",
                  icon: Award,
                  completed: false,
                },
              ].map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                const isCompleted = currentStep > stepNumber;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="relative flex items-start">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                          {
                            "border-step-active bg-step-active text-white":
                              isActive,
                            "border-step-completed bg-step-completed text-white":
                              isCompleted,
                            "border-step-inactive bg-background text-muted-foreground":
                              !isActive && !isCompleted,
                          }
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">
                            {stepNumber}
                          </span>
                        )}
                      </div>

                      {/* Connecting Line */}
                      {!isLast && (
                        <div
                          className={cn(
                            "mt-2 h-16 w-0.5 transition-all duration-300",
                            {
                              "bg-step-completed": isCompleted,
                              "bg-step-line": !isCompleted,
                            }
                          )}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="ml-4 flex-1 pb-8">
                      <h3
                        className={cn(
                          "text-lg font-semibold transition-colors duration-300",
                          {
                            "text-step-active": isActive,
                            "text-foreground": isCompleted,
                            "text-muted-foreground": !isActive && !isCompleted,
                          }
                        )}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Form - col-9 */}
            <div className="lg:col-span-9">
              <Card className="max-w-4xl mx-auto shadow-lg border-border/50">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter first name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter last name" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Select>
                          {/* <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="4-7">4-7 years</SelectItem>
                            <SelectItem value="8-15">8-15 years</SelectItem>
                            <SelectItem value="15+">15+ years</SelectItem>
                          </SelectContent> */}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">
                          Website / Social Media Link (if any)
                        </Label>
                        <Input id="website" placeholder="Enter website URL" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Short Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">
                        Why do you want to become a mentor?
                      </Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">
                        Availability (Hours per month you can commit)
                      </Label>
                      <Select>
                        {/* <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-10">5-10 hours</SelectItem>
                          <SelectItem value="10-20">10-20 hours</SelectItem>
                          <SelectItem value="20-30">20-30 hours</SelectItem>
                          <SelectItem value="30+">30+ hours</SelectItem>
                        </SelectContent> */}
                      </Select>
                    </div>
                    <Button
                      variant="gradient-primary"
                      className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                      type="submit"
                    >
                      Submit Application
                    </Button>
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
