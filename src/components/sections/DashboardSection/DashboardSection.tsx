"use client";

import { Badge } from "lucide-react";
import Button from "../../ui/Button";
import PrimaryButton from "../../ui/PrimaryButton";
import SecondaryButton from "../../ui/SecondaryButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/DashboardCard";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import {
  DashboardDetails,
  GetAllFormDetails,
  GetAllPlanDetails,
  MeDetails,
  PaymentDetails,
  submitOrganizationDetails,
  submitPersonDetails,
} from "../../../Common/ServerAPI";
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
interface OrganizationForm {
  domain_id: string;
  sub_domain_id: string;
  organization_type_id: string;
  revenue_range_id: string;
  organization_name: string;
  domain: string;
  custom_domain?: string;
  sub_domain: string;
  employee_size: string;
  revenue: string;
  question: Array<{
    question_id: string;
    answer: string;
  }>;
}


interface QuestionAnswer {
  question_id: string;
  answer: string;
}


interface FormErrors {
  email?: string;
  password?: string;
  organization_name?: string;
  domain?: string;
  sub_domain?: string;
  employee_size?: string;
  revenue?: string;
  [key: string]: string | undefined; // For dynamic question errors
}

interface PersonForm {
  first_name: string;
  last_name: string;
  interests: (string | number)[];
  professions: (string | number)[];
  question: QuestionAnswer[];
}

export default function DashboardSection() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [personPricing, setPersonPricing] = useState<PersPricingPlan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizationErrors, setOrganizationErrors] = useState<FormErrors>({});
  const [personErrors, setPersonErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [margaretName, setMargaretName] = useState(
    localStorage.getItem("margaret_name") || ""
  );
  const [readlineQuestion, setReadlineQuestion] = useState([]);

  const [personForm, setPersonForm] = useState<PersonForm>({
    first_name: "",
    last_name: "",
    interests: [],
    professions: [],
    question: [],
  });
  const [user, setUser] = useState<any | null>(null);
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm>({
    domain_id: "",
    sub_domain_id: "",
    organization_type_id: "",
    revenue_range_id: "",
    organization_name: "",
    domain: "",
    sub_domain: "",
    employee_size: "",
    revenue: "",
    question: [],
  });
  const fetchDashboard = async () => {
    try {
      const response: any = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("name", response.data.data?.name);
        // localStorage.setItem("profile_picture",response.data.data?.profile_picture);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  // Watch for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setMargaretName(localStorage.getItem("margaret_name") || "");
    };

    // Listen for storage events (changes from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Also check for changes periodically (in case changes happen in the same tab)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };
const openRetakeAssesmentModal = async () => {
  try {
    const personOrganization = localStorage.getItem('person_organization');
    if (personOrganization === '2') {
      setActiveModal("organization");
    } else {
      setActiveModal("person");
    }
    
    const response = await GetAllFormDetails();
    setReadlineQuestion(response?.data?.data?.questions);
  } catch (error: any) {
    showToast({
      message: error?.response?.data?.error?.message,
      type: "error",
      duration: 5000,
    });
  }
};
  const closeModal = async () => {
    setActiveModal(null);
    await fetchDashboard();
  };
  const handlePlanSelection = async (plan: any) => {
    try {
      const payload = {
        plan_id: plan.id,
        plan_type: isAnnual ? "Yearly" : "Monthly",
      };

      const res = await PaymentDetails(payload);

      if (res?.data?.data?.url) {
        const url = res.data.data.url;
        window.location.href = url; // Redirect in the same tab
      } else {
        console.error("URL not found in response");
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const completedStep = localStorage.getItem("completed_step");
  const is_disqualify = localStorage.getItem("is_disqualify");

  const validateForm = (
    formData: any,
    formType: "organization" | "person",
    setErrors?: boolean
  ): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (formType === "organization") {
      // Only validate questions for organization form
      readlineQuestion.forEach((question: any) => {
        const answer =
          formData.question?.find(
            (q: QuestionAnswer) => q.question_id === question.id
          )?.answer || "";

        if (!answer || answer.trim() === "") {
          newErrors[`question_${question.id}`] = "This field is required";
          isValid = false;
        }
      });

      if (setErrors) {
        setOrganizationErrors(newErrors);
      }
      return isValid;
    }

    if (formType === "person") {
      // Validate questions
      readlineQuestion.forEach((question: any) => {
        const answer =
          formData.question?.find(
            (q: QuestionAnswer) => q.question_id === question.id
          )?.answer || "";

        if (!answer || answer.trim() === "") {
          newErrors[`question_${question.id}`] = "This field is required";
          isValid = false;
        }
      });

      if (setErrors) {
        setPersonErrors(newErrors);
      }
      return isValid;
    }

    return isValid;
  };

  const handlePersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm(personForm, "person", true)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await submitPersonDetails(personForm as any);
      localStorage.setItem("person_organization", "1");
      localStorage.setItem("completed_step", "1");

      if (res.success.statusCode === 200) {
        const plansByRange: Record<string, any> = {};
        res?.data?.data?.plan.forEach((plan: any) => {
          if (!plansByRange[plan.plan_range]) {
            plansByRange[plan.plan_range] = {};
          }
          plansByRange[plan.plan_range][plan.plan_type] = plan;
        });

        const response = await MeDetails();
        localStorage.setItem(
          "profile_picture",
          response?.data?.data?.user.profile_picture
        );
        localStorage.setItem("name", response?.data?.data?.user.name);
        localStorage.setItem("main_name", response?.data?.data?.user.main_name);
        localStorage.setItem(
          "margaret_name",
          response?.data?.data?.user.margaret_name
        );

        // Create combined plan objects with both monthly and yearly data
        const updatedPlans = Object.values(plansByRange)?.map(
          (planGroup: any) => {
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
          }
        );

        setPersonPricing(updatedPlans);
        setActiveModal("PricingModal");
        localStorage.setItem("is_disqualify", "fasle");
      } else if (res.success.statusCode === 201) {
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting organization form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("question_")) {
      const questionId = name.replace("question_", "");
      setPersonForm((prev) => {
        const existingQuestionIndex = prev.question.findIndex(
          (q) => q.question_id === questionId
        );

        if (existingQuestionIndex >= 0) {
          const updatedQuestions = [...prev.question];
          updatedQuestions[existingQuestionIndex] = {
            question_id: questionId,
            answer: value,
          };
          return { ...prev, question: updatedQuestions };
        } else {
          return {
            ...prev,
            question: [
              ...prev.question,
              { question_id: questionId, answer: value },
            ],
          };
        }
      });
    } else {
      setPersonForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate only the questions
    const isValid = validateForm(organizationForm, "organization", true);

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await submitOrganizationDetails(organizationForm);
      localStorage.setItem("person_organization", "2");
      localStorage.setItem("completed_step", "1");

      if (res.success.statusCode === 200) {
        const plansByRange: Record<string, any> = {};
        res?.data?.data?.plan.forEach((plan: any) => {
          if (!plansByRange[plan.plan_range]) {
            plansByRange[plan.plan_range] = {};
          }
          plansByRange[plan.plan_range][plan.plan_type] = plan;
        });

        const response = await MeDetails();
        localStorage.setItem(
          "profile_picture",
          response?.data?.data?.user.profile_picture
        );
        localStorage.setItem("name", response?.data?.data?.user.name);
        localStorage.setItem("main_name", response?.data?.data?.user.main_name);
        localStorage.setItem(
          "margaret_name",
          response?.data?.data?.user.margaret_name
        );

        const updatedPlans = Object.values(plansByRange)?.map(
          (planGroup: any) => {
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
              features: [],
              buttonText: "Get Started",
              buttonClass: yearlyPlan
                ? ""
                : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
              popular: !!yearlyPlan,
            };
          }
        );

        setPersonPricing(updatedPlans);
        setActiveModal("PricingModal");
        localStorage.setItem("is_disqualify", "fasle");
      } else if (res.success.statusCode === 201) {
        closeModal();
      }
    } catch (error) {
      console.error("Error submitting organization form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrganizationFormChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // We only need to handle questions now
    if (name.startsWith("question_")) {
      const questionId = name.replace("question_", "");
      setOrganizationForm((prev) => {
        const existingQuestionIndex = prev.question.findIndex(
          (q) => q.question_id === questionId
        );

        if (existingQuestionIndex >= 0) {
          // Update existing answer
          const updatedQuestions = [...prev.question];
          updatedQuestions[existingQuestionIndex] = {
            question_id: questionId,
            answer: value,
          };
          return { ...prev, question: updatedQuestions };
        } else {
          // Add new question answer
          return {
            ...prev,
            question: [
              ...prev.question,
              { question_id: questionId, answer: value },
            ],
          };
        }
      });
    }
  };

  return (
    <>
      <section className="w-full px-2 sm:px-4 lg:px-0.5 pt-4 pb-10">
        {completedStep !== "2" && (
          <div className="mx-5 bg-[rgba(255,204,0,0.05)] text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              {is_disqualify === "true" ? (
                Number(user?.daysRemaining) <= 0 ? (
                  <span className="text-green-500">
                    You are eligible for the Aspiration badge. Please{" "}
                    <a
                      href="#"
                      className="text-blue-600 underline"
                      onClick={(e) => {
                        e.preventDefault();
                        openRetakeAssesmentModal();
                      }}
                    >
                      click here
                    </a>{" "}
                    to retake the assessment.
                  </span>
                ) : (
                  <span className="text-red-500">
                    You are not eligible for the Aspiration badge. Please try
                    again after {user?.daysRemaining} days!
                  </span>
                )
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
                      {user?.name?.charAt(0)?.toUpperCase() +
                        user?.name?.slice(1) || ""}
                    </span>
                  </h1>
                </div>
                <div className="inline-flex items-center pt-1 pb-2 px-2 md:pt-2 md:pb-3 md:px-3">
                  <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-xs sm:text-sm md:text-base">
                    Welcome to your CNESS Dashboard, {margaretName}!
                  </p>
                </div>
              </div>
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
                        value={user?.profile_progress}
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
                          {user?.profile_progress}%
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
                      {/* <Button
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
                          {user?.profile_progress === 100 ? "Edit" : "Start"}
                        </span>
                      </Button> */}

                    <SecondaryButton
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
                      Start
                    </SecondaryButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Card */}
           
            <Card  className="
     flex p-6 flex-col  gap-6 flex-1
    rounded-[12px] 
    bg-[linear-gradient(97deg,rgba(223,214,255,0.30)_-0.01%,rgba(184,166,248,0.30)_49.8%,rgba(196,132,205,0.30)_99.99%)]
    border-none
  ">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-6 w-full">
                  <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-3 w-full text-center sm:text-left">
                  <h2
  className="
    text-[#222224]
    font-['Poppins']
    text-[20px]
    font-semibold
    leading-normal
  "
  style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}
>
  Start Your Journey
</h2>

                    <p className="
    text-black 
    font-['Open_Sans'] 
    text-[16px] 
    font-normal 
    leading-normal
  "
  style={{ fontFeatureSettings: "'liga' off, 'clig' off" }}>
                      Complete your profile by providing all the essential
                      information to kickstart your journey and obtain
                      certification.
                    </p>
                  </div>
                  <div className="w-full">
                    {/* <Button
                      variant="primary"
                      className="rounded-[100px] py-2 px-8 self-stretch transition-colors duration-500 ease-in-out cursor-pointer"
                      onClick={() => {
                        navigate("/dashboard/assesment");
                      }}
                    >
                      <span className="text-white text-center font-['Plus Jakarta Sans'] text-[12px] font-medium leading-normal">
                        Get Certification
                      </span>
                    </Button> */}
                    <PrimaryButton onClick={() => navigate("/dashboard/assesment")}>
                    Get Certification
                  </PrimaryButton>

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
                      {user?.assesment_progress || 0}%
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
                            (user?.assesment_progress || 0) / (100 / 6)
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
                    <QRCodeGenerator profileUrl={user?.qr_url} />
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
                    <div className="flex justify-center sm:justify-start">
                      <div className="relative w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] md:w-[90px] md:h-[90px]">
                        <CircularProgressbar
                          value={user?.cis_score}
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
                          <span className="font-['open sans'] font-bold text-[12px] sm:text-[16px] text-[#242731]">
                            {user?.cis_score}%
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
                  </CardContent>
                </Card>
                {user?.cis_score == 0 && (
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
                            {user?.level}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {!user?.level && (
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
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
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

        <Modal isOpen={activeModal === "person"} onClose={closeModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
            <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
              {/* LEFT PANEL */}
              <div className="hidden lg:flex bg-gradient-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2] w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
                <div>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#CFC7FF] flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-15 h-15 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Let's Get to Know You Better
                  </h2>
                  <p className="text-gray-900 text-sm">
                    This information helps us understand your conscious impact
                    better.
                  </p>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="w-full lg:w-[60%] bg-white px-4 py-6 sm:px-6 sm:py-8 md:p-10 overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Tell Us About Yourself
                </h2>
                <form onSubmit={handlePersonSubmit} className="space-y-6">
                  {/* Questions Section */}
                  <div className="space-y-4">
                    {readlineQuestion?.map((question: any) => {
                      const existingAnswer =
                        personForm.question.find(
                          (q: QuestionAnswer) => q.question_id === question.id
                        )?.answer || "";

                      return (
                        <div key={question.id} className="mb-4">
                          <label className="block openSans text-base font-medium text-gray-800 mb-1">
                            {question.question}
                          </label>

                          {question.options && question.options.length > 0 ? (
                            <div className="space-y-2">
                              {question?.options?.map((option: any) => (
                                <div
                                  key={option.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="radio"
                                    id={`question_${question.id}_${option.id}`}
                                    name={`question_${question.id}`}
                                    value={option.option}
                                    checked={existingAnswer === option.option}
                                    onChange={handlePersonFormChange}
                                    className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-[#7077FE] peer-checked:to-[#F07EFF] hover:from-[#F07EFF] hover:to-[#F07EFF] transition-all duration-300"
                                  />
                                  <label
                                    htmlFor={`question_${question.id}_${option.id}`}
                                    className="ml-3 block openSans text-base text-gray-700"
                                  >
                                    {option.option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              name={`question_${question.id}`}
                              value={existingAnswer}
                              onChange={handlePersonFormChange}
                              className={`w-full px-3 py-2 border ${
                                personErrors[`question_${question.id}`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md`}
                              placeholder={`Enter your answer`}
                              rows={3}
                            />
                          )}

                          {personErrors[`question_${question.id}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {personErrors[`question_${question.id}`]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex justify-end mt-6 gap-3 flex-wrap">
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="white-outline"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="gradient-primary"
                      className="rounded-full py-3 px-8 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={activeModal === "organization"} onClose={closeModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
            <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
              {/* LEFT PANEL */}
              <div className="hidden lg:flex bg-gradient-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2] w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
                <div>
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#CFC7FF] flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-15 h-15 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="4.5"
                        cy="4.5"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="19.5"
                        cy="4.5"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="4.5"
                        cy="19.5"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="19.5"
                        cy="19.5"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="12"
                        y1="12"
                        x2="4.5"
                        y2="4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="12"
                        y1="12"
                        x2="19.5"
                        y2="4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="12"
                        y1="12"
                        x2="4.5"
                        y2="19.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="12"
                        y1="12"
                        x2="19.5"
                        y2="19.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Let's Get to Know Your Organization
                  </h2>
                  <p className="text-gray-900 text-sm">
                    This information helps us understand your conscious impact
                    better.
                  </p>
                </div>
              </div>

              {/* Right Form Panel */}
              <div className="w-full lg:w-[60%] bg-white px-4 py-6 sm:px-6 sm:py-8 md:p-10 overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Tell Us About Your Organization
                </h2>

                <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                  {/* Questions Section */}
                  <div className="space-y-4">
                    {readlineQuestion?.map((question: any) => {
                      const existingAnswer =
                        organizationForm.question.find(
                          (q: QuestionAnswer) => q.question_id === question.id
                        )?.answer || "";

                      return (
                        <div key={question.id} className="mb-4">
                          <label className="block openSans text-base font-medium text-gray-800 mb-1">
                            {question.question}
                          </label>

                          {question.options && question.options.length > 0 ? (
                            <div className="space-y-2">
                              {question?.options?.map((option: any) => (
                                <div
                                  key={option.id}
                                  className="flex items-center"
                                >
                                  <input
                                    type="radio"
                                    id={`question_${question.id}_${option.id}`}
                                    name={`question_${question.id}`}
                                    value={option.option}
                                    checked={existingAnswer === option.option}
                                    onChange={handleOrganizationFormChange}
                                    className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-[#7077FE] peer-checked:to-[#F07EFF] hover:from-[#F07EFF] hover:to-[#F07EFF] transition-all duration-300"
                                  />
                                  <label
                                    htmlFor={`question_${question.id}_${option.id}`}
                                    className="ml-3 block openSans text-base text-gray-700"
                                  >
                                    {option.option}
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              name={`question_${question.id}`}
                              value={existingAnswer}
                              onChange={handleOrganizationFormChange}
                              className={`w-full px-3 py-2 border ${
                                organizationErrors[`question_${question.id}`]
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md`}
                              placeholder={`Enter your answer`}
                              rows={3}
                            />
                          )}

                          {organizationErrors[`question_${question.id}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {organizationErrors[`question_${question.id}`]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex justify-end mt-6 gap-3 flex-wrap">
                    <Button
                      type="button"
                      onClick={closeModal}
                      variant="white-outline"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="gradient-primary"
                      className="rounded-full py-3 px-8 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
      </section>
    </>
  );
}
