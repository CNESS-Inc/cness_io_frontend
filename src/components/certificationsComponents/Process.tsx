import { useState } from "react";
import frame from "../../assets/frame.png";
import step1 from "../../assets/step1.svg";
import step2 from "../../assets/step2.svg";
import step3 from "../../assets/step3.svg";
import step4 from "../../assets/step4.svg";
import Button from "../ui/Button";
import SignupModel from "../OnBoarding/Signup";

export default function Process() {
  const [openSignup, setOpenSignup] = useState(false);

  const steps = [
    {
      step: "STEP–01",
      title: "Create Your Account",
      desc: "Sign up on CNESS and set up your profile to begin your journey.",
      icon: step1,
    },
    {
      step: "STEP–02",
      title: "Complete True Profile",
      desc: "Access guided modules, complete the learning steps, and take the assessment at your own pace.",
      icon: step2,
    },
    {
      step: "STEP–03",
      title: "Complete Assessment",
      desc: "Access guided modules, complete the learning steps, and take the assessment at your own pace.",
      icon: step3,
    },
    {
      step: "STEP–04",
      title: "Get Certified",
      desc: "Earn your verified digital badge and showcase your achievement with pride.",
      icon: step4,
    },
  ];

  return (
    <div className="flex items-start w-full max-w-7xl mx-auto pt-24 md:pt-42 pb-10 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-10 md:gap-8 items-stretch w-full">
        {/* Left Content */}
        <div className="w-full flex flex-col items-center justify-center md:justify-start md:items-start text-center md:text-left">
          <span
            style={{ fontFamily: "Poppins, sans-serif" }}
            className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block 
            rounded-tl-[100px] rounded-br-[100px] rounded-tr-[10px] rounded-bl-[10px] bg-white"
          >
            How It Works
          </span>
          <h1
            className="text-[32px] md:text-[42px] font-medium text-[#222224] leading-tight pt-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our Certification Process
          </h1>
          <p
            style={{ fontFamily: "Open Sans, sans-serif" }}
            className="font-['Open Sans'] text-base text-[#64748B] font-light mt-2"
          >
            We’ve made the path to certification clear and straightforward — so
            you can focus on learning, growing, and getting recognized without
            complications.
          </p>
          <div className="mt-4 mb-6">
            <Button
              variant="gradient-primary"
              className="font-['Plus Jakarta Sans'] text-[16px] rounded-full py-2 px-4 sm:py-3 sm:px-8  font-medium"
              onClick={() => setOpenSignup(true)}
              style={{
                fontFamily: "Plus Jakarta Sans",
              }}
            >
              Get Started
            </Button>
          </div>
          <div className="md:mt-4">
            <img
              src={frame}
              alt="Certification Process"
              className="rounded-[20px] w-full"
            />
          </div>
          <div className="flex w-full">
            <span className="ml-auto text-right text-[#64748B] text-xs font-normal">
              condition apply*
            </span>
          </div>
        </div>

        {/* middle */}
        <div className="grid grid-cols-[40px_1fr] gap-6 md:contents">
          <div className="flex justify-center self-center md:col-start-2 md:row-start-1">
            <div className="relative flex flex-col justify-between items-center w-[60px] h-[35rem]">
              <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-[#E9E9E9] z-0"></div>

              {steps.map((step, i) => (
                <div key={i} className="relative z-10 bg-white">
                  <img
                    src={step.icon}
                    alt={`Step ${i + 1}`}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Steps */}
          <div className="flex flex-col space-y-6 md:col-start-3 md:row-start-1">
            {steps.map((step, i) => (
              <div
                key={i}
                className="pl-6 pr-4 py-6 bg-white border border-[#DFDFDF] shadow-sm rounded-4xl"
              >
                <span
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-xl font-semibold"
                >
                  {step.step}
                </span>
                <h2
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  className="text-xl lg:text-2xl font-medium text-[#222224] mt-1"
                >
                  {step.title}
                </h2>
                <p
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  className="font-['Open Sans'] text-sm lg:text-base font-light text-[#64748B] mt-1"
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </div>
  );
}
