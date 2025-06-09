"use client";

import { Badge } from "lucide-react";
import Button from "../../ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/DashboardCard";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import Modal from "../../ui/Modal";
import { GetAllPlanDetails, PaymentDetails } from "../../../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import QRCodeGenerator from "../../ui/QRCodeGenerator";
import { useToast } from "../../ui/Toast/ToastProvider";

type PersPricingPlan = {
  id: any;
  title: any;
  description: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  period: string;
  billingNote?: string;
  features: string[]; // Instead of never[]
  buttonText: string;
  buttonClass: string;
  borderClass: string;
  popular: boolean;
};

export default function DashboardSection(user: any) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [personPricing, setPersonPricing] = useState<PersPricingPlan[]>([]);
  const navigate = useNavigate();
    const { showToast } = useToast();
  
  // Data for modules
  const modules = [
    {
      id: 1,
      title: "Module 1: Basic",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273.png",
      buttonText: "Start",
      buttonColor: "bg-gradient-to-r from-[#707AFE] to-[#F07EFF]",
      locked: true,
    },
    {
      id: 2,
      title: "Module 2",
      status: "In progress",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-1.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
      locked: true,
    },
    {
      id: 3,
      title: "Module 3",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-2.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
      locked: true,
    },
  ];

  // Data for tasks
  //const tasks = [
  //{ id: 1, name: "Task Name" },
  // { id: 2, name: "Task Name" },
  // { id: 3, name: "Task Name" },
  // { id: 4, name: "Task Name" },
  // ];
  //for complete your profile
  // const percentage = 32;

  //Assessment progress
  // const Assessmentpercentage = 70;
  // const totalBlocks = 6;
  // const filledBlocks = Math.floor(
  //   user?.user?.assesment_progress / (100 / totalBlocks)
  // );

  const openPricingModal = async () => {
    try {      
      setActiveModal("PricingModal");
      const res = await GetAllPlanDetails();
      const plansByRange: Record<string, any> = {};
      res?.data?.data?.forEach((plan: any) => {
        if (!plansByRange[plan.plan_range]) {
          plansByRange[plan.plan_range] = {};
        }
        plansByRange[plan.plan_range][plan.plan_type] = plan;
      });
      // Create combined plan objects with both monthly and yearly data
      const updatedPlans = Object.values(plansByRange).map((planGroup: any) => {
        const monthlyPlan = planGroup.monthly;
        const yearlyPlan = planGroup.yearly;
  
        return {
          id: monthlyPlan?.id || yearlyPlan?.id,
          title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
          description: "Customized pricing based on your selection",
          monthlyPrice: monthlyPlan ? `$${monthlyPlan.amount}` : undefined,
          yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
          period: isAnnual ? "/year" : "/month",
          billingNote: yearlyPlan
            ? isAnnual
              ? `billed annually ($${yearlyPlan.amount})`
              : `or $${monthlyPlan?.amount}/month`
            : undefined,
          features: [], // Add any features you need here
          buttonText: "Get Started",
          buttonClass: yearlyPlan
            ? ""
            : "bg-gray-100 text-gray-800 hover:bg-gray-200",
          borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
          popular: !!yearlyPlan,
        };
      });
  
      setPersonPricing(updatedPlans);
    } catch (error:any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };
  const closeModal = () => setActiveModal(null);
  const handlePlanSelection = async (plan: any) => {
    try {
      const payload = {
        plan_id: plan.id,
        plan_type: isAnnual ? "Yearly" : "Monthly",
      };

      const res = await PaymentDetails(payload);

      if (res?.data?.data?.url) {
        const url = res.data.data.url;
        console.log("Redirecting to:", url); // Log the actual URL
        window.location.href = url; // Redirect in the same tab
      } else {
        console.error("URL not found in response");
      }
    } catch (error:any) {
showToast({
        message:error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const completedStep = localStorage.getItem("completed_step");
  const is_disqualify = localStorage.getItem("is_disqualify");
  console.log("🚀 ~ DashboardSection ~ is_disqualify:", typeof is_disqualify);

  // const urldata = `https://test.cness.ai/profile/public`;

  return (
    <>
      <div className="max-w-[1200px] mx-auto "></div>
      {completedStep !== "2" && (
        <div className="mx-5 bg-[rgba(255,204,0,0.05)] 5% text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            {is_disqualify === "true" ? (
              <span className="text-red-500">
                You Are Not Eligible For Inspire. Try After{" "}
                {user?.user?.daysRemaining} days!
              </span>
            ) : (
              <>
                <span className="text-yellow-500">💡</span>
                <span>
                  To start the certification journey into our platform, please
                  complete the payment here.{" "}
                  <a
                    href="#"
                    className="text-blue-600 underline"
                    onClick={(e) => {
                      e.preventDefault();
                      openPricingModal();
                    }}
                  >
                    Click here
                  </a>
                </span>
              </>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-700 text-lg">
            ×
          </button>
        </div>
      )}

      <section className="flex flex-col w-full items-start gap-3 p-4 md:p-5">
        {/* Header Section */}
        <header className="w-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="px-2 py-1 md:px-3 md:py-2 flex items-center gap-2.5">
                <h1 className="font-['Poppins',Helvetica] text-2xl md:text-[32px] leading-8">
                  <span className="font-semibold text-[#222224]">Hello </span>
                  <span className="font-semibold text-[#a392f2]">
                    {user?.user?.name?.charAt(0)?.toUpperCase() +
                      user?.user?.name?.slice(1) || ""}
                  </span>
                </h1>
              </div>
              <div className="inline-flex items-center pt-1 pb-2 px-2 md:pt-2 md:pb-3 md:px-3">
                <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-xs sm:text-sm md:text-base">
                  Welcome to your CNESS Dashboard, Margaret!
                </p>
              </div>
            </div>
            {/* <div>
              <Button
                variant="gradient-primary"
                className="rounded-[100px] py-2 px-8 self-stretch transition-colors duration-500 ease-in-out"
                
              >
                <span className="font-['Plus_Jakarta_Sans',Helvetica] leading-none tracking-[0px] text-white text-center">
                  Take Assessment
                </span>
              </Button>
            </div> */}
          </div>
        </header>

        {/* Profile Completion and Journey Cards */}

        <div className="flex flex-col lg:flex-row gap-3 w-full">
          {/* First Card */}
          <Card className="flex-1 border-[#eceef2]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                {/* Circular Progress */}
                <div className="flex justify-center sm:justify-start">
                  <div className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[147px] md:h-[147px]">
                    <CircularProgressbar
                      value={user?.user?.profile_progress}
                      strokeWidth={10}
                      styles={buildStyles({
                        rotation: 0.6,
                        pathColor: "url(#gradient)",
                        trailColor: "#f5f5f5",
                        textColor: "#242731",
                        pathTransitionDuration: 0.5,
                      })}
                    />
                    {/* Custom-styled text overlaid manually */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-['open sans'] font-bold text-[28px] sm:text-[31.51px] text-[#242731]">
                        {user?.user?.profile_progress}%
                      </span>
                    </div>

                    {/* Gradient definition */}
                    <svg style={{ height: 0 }}>
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="1"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="50%" stopColor="#A162F7" />
                          <stop offset="100%" stopColor="#F07EFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center sm:items-start gap-3 sm:gap-5 flex-1">
                  <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 w-full text-center sm:text-left">
                    <h2 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-lg sm:text-xl">
                      Complete Your Profile
                    </h2>
                    <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-sm sm:text-base">
                      Fill out your profile with all the necessary details.
                    </p>
                  </div>
                  <div className="w-full">
                    <Button
                      variant="gradient-primary"
                      className="rounded-[100px] cursor-pointer py-2 px-8 self-stretch transition-colors duration-500 ease-in-out"
                      onClick={() => {
                        const personOrganization = localStorage.getItem(
                          "person_organization"
                        );

                        if (personOrganization === "2") {
                          navigate("/dashboard/company-profile");
                        } else if (personOrganization === "1") {
                          navigate("/dashboard/user-profile");
                        }
                      }}
                    >
                      <span className="font-['Plus_Jakarta_Sans',Helvetica] text-white text-center">
                        Start
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Second Card */}
          <Card className="flex-1 border-none bg-gradient-to-br from-[rgba(151,71,255,0.1)] to-[rgba(240,126,255,0.1)]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 w-full">
                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 w-full text-center sm:text-left">
                  <h2 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-lg sm:text-xl">
                    Start Your Journey
                  </h2>
                  <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-sm sm:text-base">
                    Complete your profile by providing all the essential
                    information to kickstart your journey and obtain
                    certification.
                  </p>
                </div>
                <div className="w-full">
                  <Button
                    variant="gradient-primary"
                    className="rounded-[100px] py-2 px-8 self-stretch transition-colors duration-500 ease-in-out cursor-pointer"
                    onClick={() => {
                      navigate("/dashboard/assesment");
                    }}
                  >
                    <span className="font-['Plus_Jakarta_Sans',Helvetica] text-white text-center">
                      Get Certification
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 w-full">
          {/* Assessment Card */}
          <div className="w-full lg:flex-[2] relative">
            <Card className="w-full h-full border-[#eceef2]">
              <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
                <div className="flex items-center gap-2 md:gap-3.5">
                  <div className="bg-[#ff708a33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                    <img
                      className="w-5 h-5 md:w-6 md:h-6"
                      alt="Assessment icon"
                      src="https://c.animaapp.com/magahlmqpONVZN/img/frame-2.svg"
                    />
                  </div>
                  <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                    Assessment Progress
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-xl md:text-2xl text-[#222224] font-medium">
                    {user?.user?.assesment_progress || 0}%
                  </div>
                  <div className="text-sm md:text-base text-[#9747ff] font-medium">
                    In Progress
                  </div>
                </div>
                <div className="flex items-center gap-1 w-full">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-5 md:h-[24px] rounded ${
                        index <
                        Math.floor(
                          (user?.user?.assesment_progress || 0) / (100 / 6)
                        )
                          ? "bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]"
                          : "bg-[#EDEAFF]"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CIS Score & Badge Cards */}
          <div className="w-full lg:flex-1 flex flex-col sm:flex-row gap-3">
            {/* CIS Score Card */}
            <div className="w-full sm:w-1/2 relative">
              <Card className="w-full h-full border-[#eceef2] rounded-[10px] overflow-hidden">
                <CardContent className="flex justify-center items-center pt-4 pb-4 md:pt-6 md:pb-6">
                  <QRCodeGenerator profileUrl={user?.user?.qr_url} />
                </CardContent>
              </Card>
            </div>
            {/* CIS Score Card */}
            <div className="w-full sm:w-1/2 relative">
              <Card className="w-full h-full border-[#eceef2] rounded-[10px] overflow-hidden">
                <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
                  <div className="flex items-center gap-2 md:gap-3.5">
                    <div className="bg-[#e8cdfd33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                      <img
                        className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                        alt="CIS Score icon"
                        src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                      />
                    </div>
                    <CardTitle className="text-sm md:text-base font-medium text-[#222224]">
                      CIS Score
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-center items-center pt-4 pb-4 md:pt-6 md:pb-6">
                  <div className="relative w-16 h-14 md:w-[85px] md:h-[71px]">
                    <div className="relative w-full h-full bg-[url(https://c.animaapp.com/magahlmqpONVZN/img/ellipse-20.svg)] bg-[100%_100%]">
                      <img
                        className="absolute w-[calc(100%-3px)] h-full top-0 left-0"
                        alt="Ellipse"
                        src="https://c.animaapp.com/magahlmqpONVZN/img/ellipse-19.svg"
                      />
                      <div className="absolute top-[20px] left-[22px] md:top-[27px] md:left-6 text-base md:text-[18.2px] font-bold text-primarydark-1">
                        72%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {(user?.user?.assesment_progress || 0) < 100 && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/40 rounded-[10px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
                  <svg
                    className="w-8 h-8 text-gray-700 opacity-80 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#4F46E5"
                      d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z"
                    />
                    <path
                      fill="#4F46E5"
                      d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium">
                    CIS Score Locked
                  </p>
                </div>
              )}
            </div>

            {/* Badge Card */}
            <div className="w-full sm:w-1/2 relative">
              <Card className="w-full h-full border-[#eceef2] rounded-[10px] overflow-hidden">
                <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
                  <div className="flex items-center gap-2 md:gap-3.5">
                    <div className="bg-[#e8cdfd33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                      <img
                        className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                        alt="Badge icon"
                        src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                      />
                    </div>
                    <CardTitle className="text-sm md:text-base font-medium text-[#222224]">
                      Badge
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-3 md:py-[17px]">
                  <div className="flex flex-col md:flex-row items-center justify-around gap-2">
                    <div className="flex flex-col md:flex-column items-center gap-2 md:gap-[20px]">
                      <img
                        className="w-24"
                        alt="Badge vector"
                        src="https://c.animaapp.com/magahlmqpONVZN/img/vector.svg"
                      />
                      <div className="w-full md:w-[118.96px]">
                        <p className="w-full py-1 bg-[#9747ff1a] rounded-[8px] text-center text-[#9747FF] font-medium text-sm">
                          {user?.user?.level}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {!user?.user?.level && (
                <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-[10px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
                  <svg
                    className="w-8 h-8 text-gray-700 opacity-80 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#4F46E5"
                      d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z"
                    />
                    <path
                      fill="#4F46E5"
                      d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"
                    />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium">
                    Badge Locked
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Learning Lab Section */}
        <Card className="w-full border-[#eceef2]">
          <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
            <div className="flex items-center gap-2 md:gap-3.5">
              <div className="bg-[#a2d69a33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                <img
                  className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                  alt="Learning Lab icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-3.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                Learning Lab
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-[11px]">
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className="w-full border-[#eceef2] overflow-hidden relative rounded-lg"
                >
                  {/* 🔒 Lock Overlay if locked */}
                  {module.locked && (
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/40 shadow-inner z-10 flex flex-col items-center justify-center px-4 text-center">
                      <svg
                        className="w-8 h-8 text-gray-700 opacity-80 mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill="#4F46E5"
                          d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z"
                        />
                        <path
                          fill="#4F46E5"
                          d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"
                        />
                      </svg>
                      <p className="text-sm text-gray-700 font-medium">
                        Module Locked
                      </p>
                      <p className="text-xs text-gray-500 mt-1"></p>
                    </div>
                  )}
                  <CardContent className="p-0">
                    <div
                      className="relative h-24 md:h-[135px] rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${module.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Badge
                        className={`absolute top-2 right-2 md:top-2.5 md:right-2 ${
                          module.status === "Completed"
                            ? "bg-[#b4b7ff]"
                            : "bg-[#f3ccf3]"
                        } text-white flex items-center gap-1 px-1.5 py-0.5 md:gap-2 md:px-2 md:py-1 text-xs`}
                      >
                        <img
                          className="w-2 h-2 md:w-3 md:h-3"
                          alt="Status icon"
                          src={`https://c.animaapp.com/magahlmqpONVZN/img/completed${
                            module.status === "In progress" ? "-1" : ""
                          }.svg`}
                        />
                        {module.status}
                      </Badge>
                    </div>
                    <div className="p-2 md:p-3">
                      <div className="flex items-center gap-1 mb-2 md:mb-3">
                        <div className="flex-1">
                          <div className="h-2 bg-white rounded-[80px] border-[0.5px] md:border-[0.73px] border-[#eceef2] relative">
                            <div
                              className={`h-full ${
                                module.progress === 100
                                  ? "bg-[#a392f2]"
                                  : "bg-[#a392f2]"
                              } rounded-[80px]`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-['Poppins',Helvetica] font-normal text-[#222224] text-xs">
                          {module.progress}%
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
                        <h3 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-sm md:text-base">
                          {module.title}
                        </h3>
                        {!module.locked && (
                          <Button
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1 px-2 sm:py-2 sm:px-4 md:py-[8px] md:px-[20.5px] w-fit rounded-full text-xs md:text-base"
                            variant="primary"
                            withGradientOverlay
                          >
                            {module.buttonText}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/*Next Suggested Steps Section 
        <Card className="w-full bg-[#f7f2ff80] border-[#eceef2]">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3.5">
                <div className="bg-[#72dbf233] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                  <img
                    className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                    alt="Next Steps icon"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/frame-5.svg"
                  />
                </div>
                <h2 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                  Next Suggested Steps
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 py-3 md:py-[17px] bg-white rounded-lg border border-solid border-[#eceef2] gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#60c750] rounded-[3px]" />
                    <span className="font-['Rubik',Helvetica] font-normal text-slate-700 text-xs md:text-sm">
                      {task.name}
                    </span>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 py-1 px-3 md:py-[8px] md:px-[20.5px] rounded-full text-xs md:text-base w-fit sm:w-auto text-center"
                    variant="primary"
                    withGradientOverlay
                  >
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>*/}
      </section>

      <Modal isOpen={activeModal === "PricingModal"} onClose={closeModal}>
        <div className="p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Pricing Plan
          </h2>

          <div className="flex justify-center">
            {personPricing.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg p-4 hover:shadow-md transition-shadow ${plan.borderClass} relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
                    Popular
                  </div>
                )}
                <h3 className="font-semibold text-lg mb-2 mt-2">
                  {plan.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    {isAnnual
                      ? plan.yearlyPrice || plan.monthlyPrice
                      : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-500">/month</span>
                  {plan.billingNote && (
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.billingNote}
                    </p>
                  )}
                </div>
                <Button
                  variant="gradient-primary"
                  className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                  onClick={() => handlePlanSelection(plan)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-3 text-sm font-medium text-gray-700">
                Monthly billing
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isAnnual}
                  onChange={() => setIsAnnual(!isAnnual)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Annual billing
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
}
