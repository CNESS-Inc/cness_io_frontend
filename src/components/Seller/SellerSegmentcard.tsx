import React, { useEffect, useState, type ReactNode  } from "react";
import {
  //ChevronRight,

  //Search as 
  //SearchIcon,
  // X,
  Bell,
  Plus,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LinkIcon,
  Bookmark,
  MoreHorizontal,
  CircleCheckBig,
  Trash2,
} from "lucide-react";
import profileicon from "../../assets/profileicon.svg";
import aspired from "../../assets/asplocked1.svg";

let cachedNotifications: any[] | null = null;
let notificationsPromise: Promise<any[] | null> | null = null;
import inspired from "../../assets/insplocked1.svg";
import bpicon from "../../assets/bpicon.svg";
import certicon from "../../assets/certificationicon.svg";
import directoryicon from "../../assets/directoryicon.svg";
import suggesticon from "../../assets/suggesticon.svg";
import friendsicon from "../../assets/friendsicon.svg";
import marketplaceicon from "../../assets/marketplace-icon.svg";
import socialicon from "../../assets/socialprofileicon.svg";
// import postinsight from "../../assets/post-insights-badge.svg";
import learninglabicon from "../../assets/learninglabicon.svg";
import lock from "../../assets/lock.svg";
import fire from "../../assets/fire.svg";
import completed from "../../assets/completed.svg";
import resume from "../../assets/resume.svg";
import carticon from "../../assets/carticon.svg";
import clock from "../../assets/clock.svg";
import { useNavigate } from "react-router-dom";
import alterProfile from "../../assets/altprofile.png";

import Select from "react-select";
import {
  AcceptFriendRequest,
  DashboardDetails,
  GetAllFormDetails,
  // GetAllPlanDetails,
  GetSubDomainDetails,
  GetUserNotification,
  MeDetails,
  PaymentDetails,
  RejectFriendRequest,
  SendBpFollowRequest,
  SendFriendRequest,
  submitOrganizationDetails,
  submitPersonDetails,
  UnFriend,
} from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { iconMap } from "../../assets/icons";
import { HiOutlineLockClosed } from "react-icons/hi2";
import DOMPurify from "dompurify";
//import like from "../../assets/likes.svg";
//import heart from "../../assets/heart.svg";

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

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

interface QuestionAnswer {
  question_id: string;
  answer: string;
}

type OrgPricingPlan = {
  id: any;
  title: any;
  description: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  period: string;
  billingNote?: string;
  features: string[];
  buttonText: string;
  buttonClass: string;
  borderClass: string;
  popular: boolean;
};

interface PersonForm {
  first_name: string;
  last_name: string;
  interests: (string | number)[];
  professions: (string | number)[];
  custom_profession?: string;
  question: QuestionAnswer[];
}

interface SubDomain {
  id: string;
  name: string;
}

interface Interest {
  id: string | number;
  name: string;
}

interface Profession {
  id: string | number;
  title: string; // Changed from 'name' to 'title' to match your usage
}

/* ---------- Theme ---------- */
const GRADIENT = "bg-[linear-gradient(90deg,#7077FE_0%,#F07EFF_100%)]";
const BORDER = "border border-[#ECEEF2]";
const SOFT = "shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

/* ---------- Primitives ---------- */
export function Card({
  className = "",
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl ${BORDER} bg-white ${SOFT} ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-white ${GRADIENT} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function OutlinePill({
  className = "",
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium ${BORDER} text-[#3A3F4B] bg-white hover:bg-[#F7F8FA] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Progress({ value, gradient }: { value: number; gradient?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEF0F5]">
      <div
        className={`h-full rounded-full ${gradient ? gradient : GRADIENT}`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function MobileBreakTitle({
  text,
  afterWords = 3,
}: {
  text: string;
  afterWords?: number;
}) {
  const words = (text ?? "").trim().split(/\s+/);
  return (
    <>
      {words.slice(0, afterWords).join(" ")}
      <br /> {/* always visible */} {words.slice(afterWords).join(" ")}
    </>
  );
}

/* Small round nav arrow at top-right of each card */
//function NavArrow({
// onClick,
//label = "Open",
//}: {
//  onClick?: () => void;
//label?: string;
//}) {
// return (
//   <button
// aria-label={label}
// onClick={onClick}
// className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] text-[#7A7F8C] hover:bg-[#F7F8FA]"
// >
//  <ChevronRight className="h-4 w-4" />
//</button>
// );
//}

/* A thin divider under the card header */
function HeaderDivider() {
  return <div className="mt-3 border-t border-[#ECEEF2]" />;
}

/* ===========================================================
   PAGE GREETING + SUGGESTION BANNER
   =========================================================== */
export function GreetingBar({
  name,
}: // onCloseSuggestion,
{
  name: string;
  onCloseSuggestion?: () => void;
}) {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<
    | "PricingModal"
    | "organization"
    | "person"
    | "personPricing"
    | "organizationPricing"
    | "disqualify"
    | null
  >(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [personPricing, setPersonPricing] = useState<any[]>([]);
  // const [user, setUser] = useState<any | null>(null);
  const [readlineQuestion, setReadlineQuestion] = useState([]);
  const { showToast } = useToast();
  const [domains, setDomains] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgFormStep, setOrgFormStep] = useState(1);
  const [personFormStep, setPersonFormStep] = useState(1);
  const [subDomain, setsubDomain] = useState<SubDomain[] | null>();
  const [profession, setProfession] = useState<Profession[]>([]);
  const [interest, setInterest] = useState<Interest[]>([]);
  const [revenue, setRevenue] = useState([]);
  const [OrganizationSize, setOrganizationSize] = useState([]);
  const [organizationpricingPlans, setorganizationpricingPlans] = useState<
    OrgPricingPlan[]
  >([]);
  const [isOrgFormSubmitted, setIsOrgFormSubmitted] = useState(false);
  const [organizationErrors, setOrganizationErrors] = useState<FormErrors>({});
  const [personErrors, setPersonErrors] = useState<FormErrors>({});
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
    question: [], // Changed from 'question' to 'questions' to match interface
  });

  const [personForm, setPersonForm] = useState<PersonForm>({
    first_name: "",
    last_name: "",
    interests: [],
    professions: [],
    question: [],
  });


  //greeting

const [hasLoggedBefore, setHasLoggedBefore] = useState(false);
useEffect(() => {
const stored = JSON.parse(localStorage.getItem("hasLoggedBefore") || "false");
  if (stored === true) {
    setHasLoggedBefore(true);
  } else {
    setHasLoggedBefore(false);
    localStorage.setItem("hasLoggedBefore", JSON.stringify(true));
  }
}, []);

  const handleOrganizationFormChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("question_")) {
      // Handle question answers (unchanged)
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
    } else {
      // Handle other fields normally
      setOrganizationForm((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "domain" && value !== "other" && { sub_domain: "" }),
        ...(name === "domain" && value !== "other" && { custom_domain: "" }),
      }));
      if (name === "domain" && value && value !== "other") {
        try {
          const response = await GetSubDomainDetails(value);
          setsubDomain(response?.data?.data);
        } catch (error: any) {
          console.error("Error calling API:", error);
          showToast({
            message: error?.response?.data?.error?.message,
            type: "error",
            duration: 5000,
          });
        }
      }
    }
  };

  const handlePersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      personForm.professions?.includes("other") &&
      !personForm.custom_profession?.trim()
    ) {
      setPersonErrors({
        ...personErrors,
        custom_profession: "Please specify your profession",
      });
      setIsSubmitting(false);
      return;
    }

    if (!validateForm(personForm, "person", 2, true)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...personForm,
        // Include custom_profession in the payload if "other" is selected
        professions: personForm.professions.includes("other")
          ? [
              ...personForm.professions.filter((p) => p !== "other"),
              personForm.custom_profession,
            ]
          : personForm.professions,
      };

      const res = await submitPersonDetails(payload as any);
      localStorage.setItem("person_organization", "1");
      localStorage.setItem("completed_step", "1");
      // Group plans by their range (Basic Plan, Pro Plan, etc.)
      if (res.success.statusCode === 200) {
        const plansByRange: Record<string, any> = {};
        res?.data?.data?.plan.forEach((plan: any) => {
          if (!plansByRange[plan.plan_range]) {
            plansByRange[plan.plan_range] = {};
          }
          plansByRange[plan.plan_range][plan.plan_type] = plan;
        });

        const response = await MeDetails();
        console.log("responsedffdatadata", response.data.data);
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
        setActiveModal("personPricing");
      } else if (res.success.statusCode === 201) {
        setActiveModal("disqualify");
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
        localStorage.setItem("is_disqualify", "true");
        setTimeout(() => {
          setActiveModal(null);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting organization form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateField = (
    name: string,
    value: string,
    rules: ValidationRules
  ): string | undefined => {
    if (name === "interests" || name === "professions") {
      if (rules.required && (!value || value.length === 0)) {
        return `${name.replace("_", " ")} is required`;
      }
      return undefined;
    }

    if (rules.required && !value?.trim()) {
      return `${name.replace("_", " ")} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name.replace("_", " ")} must be at least ${
        rules.minLength
      } characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.replace("_", " ")} must be less than ${
        rules.maxLength
      } characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `Invalid ${name.replace("_", " ")} format`;
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return undefined;
  };

  const validateForm = (
    formData: any,
    formType: "organization" | "person",
    step?: number,
    setErrors?: boolean
  ): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (formType === "organization") {
      // Always validate step 1 fields if we're on step 1 or validating all steps
      if (step === 1) {
        const requiredFields = [
          "organization_name",
          "domain",
          "employee_size",
          "revenue",
        ];

        // Only require sub_domain if domain is not "other"
        if (formData.domain !== "other") {
          requiredFields.push("sub_domain");
        }

        requiredFields.forEach((field) => {
          // Special handling for domain="other" case
          if (field === "domain" && formData.domain === "other") {
            if (!formData.custom_domain?.trim()) {
              newErrors.custom_domain = "Custom domain is required";
              isValid = false;
            }
          } else {
            const error = validateField(field, formData[field], {
              required: true,
            });
            if (error) {
              newErrors[field] = error;
              isValid = false;
            }
          }
        });
      }

      // Only validate questions when submitting (validateAllSteps = true)
      if (step === 2) {
        readlineQuestion.forEach((question: any) => {
          const answer =
            formData.question?.find(
              (q: QuestionAnswer) => q.question_id === question.id
            )?.answer || "";

          if (!answer || answer.trim() === "") {
            newErrors[`question_${question.id}`] = "This Field is required";
            isValid = false;
          }
        });
      }

      if (setErrors) {
        setOrganizationErrors(newErrors);
      }
      return isValid;
    }

    if (formType === "person") {
      // Always validate step 1 fields if we're on step 1 or validating all steps
      if (step === 1) {
        const requiredFields: Array<
          "first_name" | "last_name" | "interests" | "professions"
        > = ["first_name", "last_name", "interests", "professions"];

        requiredFields.forEach((field) => {
          const error = validateField(field, formData[field], {
            required: true,
          });
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
          if (field === "interests" || field === "professions") {
            if (!formData[field] || formData[field].length === 0) {
              newErrors[field] = `${field} is required`;
              isValid = false;
            }
          }
        });
      }

      // Only validate questions when submitting (step 2) or validating all steps
      if (step === 2) {
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
      }

      if (setErrors) {
        setPersonErrors(newErrors);
      }
      return isValid;
    }

    return isValid;
  };

  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAllFormDetails();
      setDomains((response as any)?.data?.data?.domain);
      setProfession((response as any)?.data?.data?.profession);
      setInterest((response as any)?.data?.data?.interest);
      setReadlineQuestion(response?.data?.data?.questions);
      setOrganizationSize(response?.data?.data?.organization_size);
      setRevenue(response?.data?.data?.revenue);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleNextClick = () => {
    // Only validate step 1 fields when clicking next
    const isValid = validateForm(organizationForm, "organization", 1, true);

    if (isValid) {
      setOrgFormStep(2);
      setOrganizationErrors({});
    }
  };

  const handleNextPersonClick = () => {
    // Only validate step 1 fields when clicking next
    const isValid = validateForm(personForm, "person", 1, true);

    if (isValid) {
      setPersonFormStep(2);
      setOrganizationErrors({});
    }
  };

  // const openPricingModal = async () => {
  //   try {
  //     setActiveModal("PricingModal");
  //     const res = await GetAllPlanDetails();
  //     const plansByRange: Record<string, any> = {};
  //     res?.data?.data?.forEach((plan: any) => {
  //       if (!plansByRange[plan.plan_range]) {
  //         plansByRange[plan.plan_range] = {};
  //       }
  //       plansByRange[plan.plan_range][plan.plan_type] = plan;
  //     });
  //     // Create combined plan objects with both monthly and yearly data
  //     const updatedPlans = Object.values(plansByRange).map((planGroup: any) => {
  //       const monthlyPlan = planGroup.monthly;
  //       const yearlyPlan = planGroup.yearly;

  //       return {
  //         id: monthlyPlan?.id || yearlyPlan?.id,
  //         title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
  //         description: "Customized pricing based on your selection",
  //         monthlyPrice: monthlyPlan ? `$${monthlyPlan.amount}` : undefined,
  //         yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
  //         period: isAnnual ? "/year" : "/month",
  //         billingNote: yearlyPlan
  //           ? isAnnual
  //             ? `billed annually ($${yearlyPlan.amount})`
  //             : `or $${monthlyPlan?.amount}/month`
  //           : undefined,
  //         features: [], // Add any features you need here
  //         buttonText: "Get Started",
  //         buttonClass: yearlyPlan
  //           ? ""
  //           : "bg-gray-100 text-gray-800 hover:bg-gray-200",
  //         borderClass: yearlyPlan ? "border-2 border-[#F07EFF]" : "border",
  //         popular: !!yearlyPlan,
  //       };
  //     });

  //     setPersonPricing(updatedPlans);
  //   } catch (error: any) {
  //     showToast({
  //       message: error?.response?.data?.error?.message,
  //       type: "error",
  //       duration: 5000,
  //     });
  //   }
  // };
  const closeModal = async () => {
    setActiveModal(null);
    await fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      const response: any = await DashboardDetails();
      if (response?.data?.data) {
        // setUser(response.data.data);
        localStorage.setItem("name", response.data.data?.name);
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

  useEffect(() => {
    if (activeModal === "organization" || activeModal === "person") {
      fetchAllDataDetails();
    }
  }, [activeModal]);

  const handlePlanSelection = async (plan: any) => {
    try {
      const payload = {
        plan_id: plan.id,
        plan_type: isAnnual ? "Yearly" : "Monthly",
      };

      const res = await PaymentDetails(payload);

      if (res?.data?.data?.url) {
        const url = res.data.data.url;
        window.location.href = url;
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

  // const completedStep = localStorage.getItem("completed_step");
  // console.log("🚀 ~ GreetingBar ~ completedStep:", completedStep);
  // const is_disqualify = localStorage.getItem("is_disqualify");

  // const openRetakeAssesmentModal = async () => {
  //   console.log("1");
  //   try {
  //     console.log("2");
  //     const personOrganization = localStorage.getItem("person_organization");
  //     console.log("personOrganization", personOrganization);
  //     if (personOrganization === "2") {
  //       setActiveModal("organization");
  //     } else {
  //       setActiveModal("person");
  //     }

  //     const response = await GetAllFormDetails();
  //     setReadlineQuestion(response?.data?.data?.questions);
  //   } catch (error: any) {
  //     showToast({
  //       message: error?.response?.data?.error?.message,
  //       type: "error",
  //       duration: 5000,
  //     });
  //   }
  // };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrgFormSubmitted(true);
    // Validate all fields (both steps) when submitting
    const isValid = validateForm(organizationForm, "organization", 2, true);

    if (!isValid) return;
    setIsSubmitting(true);

    if (
      organizationForm.domain === "other" &&
      !organizationForm.custom_domain
    ) {
      setOrganizationErrors({
        ...organizationErrors,
        custom_domain: "Custom domain name is required",
      });
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

        setorganizationpricingPlans(updatedPlans);
        setActiveModal("organizationPricing");
      } else if (res.success.statusCode === 201) {
        navigate("/dashboard");
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
        localStorage.setItem("is_disqualify", "true");
      }
      // onSuccess();
      // navigate("/dashboard");
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

  const getBillingNote = (plan: any) => {
    if (!plan.yearlyPrice || !plan.monthlyPrice) return undefined;

    if (isAnnual) {
      // For annual billing: show "billed annually (yearly price)"
      return `billed annually ($${plan.yearlyPrice.replace("$", "") * 12})`;
    } else {
      return `or ${plan.monthlyPrice}/month`;
    }
  };

  // const getBadgeStatusInfo = (badgePaymentStatus: any[]) => {
  //   // If badgePaymentStatus is not provided or empty, return null
  //   if (!badgePaymentStatus || badgePaymentStatus.length === 0) {
  //     return null;
  //   }

  //   const aspiring = badgePaymentStatus.find(
  //     (badge) => badge.slug === "aspiring"
  //   );
  //   const inspired = badgePaymentStatus.find(
  //     (badge) => badge.slug === "inspired"
  //   );

  //   // Check in order: aspiring -> inspired
  //   if (aspiring && !aspiring.payment_status) {
  //     return {
  //       message:
  //         "To start the certification journey into our platform, please complete the payment for Aspiring badge.",
  //       route: "/dashboard/aspiring-assessment",
  //       level: "aspiring",
  //     };
  //   } else if (
  //     aspiring?.payment_status &&
  //     inspired &&
  //     !inspired.payment_status
  //   ) {
  //     return {
  //       message:
  //         "To continue your certification journey, please complete the payment for Inspired badge.",
  //       route: "/dashboard/inspired-assessment",
  //       level: "inspired",
  //     };
  //   }

  //   // If none of the above conditions are met, return null
  //   return null;
  // };

  // const badgeStatusInfo = user?.badge_payment_status
  //   ? getBadgeStatusInfo(user.badge_payment_status)
  //   : {
  //       message:
  //         "To start the certification journey into our platform, please complete the payment here.",
  //       route: "/dashboard/aspiring-assessment",
  //       level: "aspiring",
  //     };

  return (
    <>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
         {!hasLoggedBefore ? (
  <>
    <h1 className="text-[26px] lg:text-[30px] font-semibold">
      Hello, <span className="text-[#7077FE]">{name}</span>
    </h1>
    <p className="mt-1 text-xs md:text-sm text-[#242424]">
      Welcome to your CNESS Dashboard
    </p>
  </>
) : (
  <>
    <h1 className="text-[26px] lg:text-[30px] font-semibold">
      Welcome Back, <span className="text-[#7077FE]">{name}</span>
    </h1>
  </>
)}

        </div>

        <div className="col-span-12 lg:col-span-4 flex items-start lg:justify-end justify-start">
          {/* {completedStep !== "2" && ( */}
          {/* <div className="mx-5 bg-[rgba(255,204,0,0.05)] text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2"> */}
          {/* {is_disqualify === "true" ? (
                  Number(user?.daysRemaining) <= 0 ? (
                    <span className="text-green-500">
                      You are eligible for the Aspiration badge. Please{" "}
                      <button
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          openRetakeAssesmentModal();
                        }}
                      >
                        click here
                      </button>{" "}
                      to retake the assessment.
                    </span>
                  ) : (
                    <span className="text-red-500">
                      You are not eligible for the Aspiration badge. Please try
                      again after {user?.daysRemaining} days!
                    </span>
                  )
                ) : ( */}
          {/* {badgeStatusInfo?.message ? (
                <>
                  <span className="text-yellow-500">💡</span>
                  <span>
                    {badgeStatusInfo?.message}{" "}
                    {badgeStatusInfo?.route && (
                      <a
                        href="#"
                        className="text-blue-600 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          // Use the dynamic route based on badge status
                          if (badgeStatusInfo.route) {
                            navigate(badgeStatusInfo.route);
                          } else {
                            openPricingModal();
                          }
                        }}
                      >
                        Click here
                      </a>
                    )}
                  </span>
                  <button
                    aria-label="Dismiss"
                    onClick={onCloseSuggestion}
                    className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-[#7A5A00]/70 hover:bg-white/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                ""
              )} */}
          {/* // )} */}
          {/* </div>
          </div> */}
          {/* // )} */}
          {/* <div className="w-full lg:min-w-[363px] lg:max-w-[400px] flex items-center gap-[10px] rounded-lg bg-[#FFCC00]/10 px-3 py-[10px] text-[#7A5A00]"></div> */}
        </div>
      </div>
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
                  <div className="absolute top-0 right-0 bg-linear-to-r from-[#7077FE] to-[#9747FF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
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
                  {getBillingNote(plan) && (
                    <p className="text-sm text-gray-500 mt-1">
                      {getBillingNote(plan)}
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r from-[#7077FE] to-[#9747FF]"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Annual billing
              </span>
            </label>
          </div>
        </div>
      </Modal>
      <Modal isOpen={activeModal === "organization"} onClose={closeModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
          {" "}
          {/* Ensures center + padding on small screens */}
          <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex bg-linear-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2] w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
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
                  Let’s Get to Know Your Organization
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
                Let’s Set Up Your Organization
              </h2>

              <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                {orgFormStep === 1 && (
                  <>
                    {/* Organization Name */}
                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-700 mb-1">
                        Organization Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={organizationForm.organization_name}
                        onChange={handleOrganizationFormChange}
                        className={`w-full px-3 py-2 border ${
                          organizationErrors.organization_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder="Enter organization name"
                      />
                      {organizationErrors.organization_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {organizationErrors.organization_name}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-700 mb-1">
                        Domain
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="domain"
                        value={organizationForm.domain}
                        onChange={handleOrganizationFormChange}
                        className={`w-full px-3 py-2 border ${
                          organizationErrors.domain
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                      >
                        <option value="">Select domain</option>
                        {domains?.map((domain: any) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.name}
                          </option>
                        ))}
                        <option value="other">Other (please specify)</option>
                      </select>
                      {organizationErrors.domain && (
                        <p className="mt-1 text-sm text-red-600">
                          {organizationErrors.domain}
                        </p>
                      )}
                    </div>

                    {organizationForm.domain === "other" ? (
                      <div className="mb-4">
                        <label className="block openSans text-base font-medium text-gray-700 mb-1">
                          Custom Domain Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="custom_domain"
                          value={organizationForm.custom_domain || ""}
                          onChange={handleOrganizationFormChange}
                          className={`w-full px-3 py-2 border ${
                            organizationErrors.custom_domain
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md`}
                          placeholder="Enter your domain name"
                        />
                        {organizationErrors.custom_domain && (
                          <p className="mt-1 text-sm text-red-600">
                            {organizationErrors.custom_domain}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label className="block openSans text-base font-medium text-gray-700 mb-1">
                          Sub Domain
                        </label>
                        <select
                          name="sub_domain"
                          value={organizationForm.sub_domain}
                          onChange={handleOrganizationFormChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Sub domain</option>
                          {subDomain?.map((subdomain: any) => (
                            <option key={subdomain.id} value={subdomain.id}>
                              {subdomain.name}
                            </option>
                          ))}
                        </select>
                        {organizationErrors.sub_domain && (
                          <p className="mt-1 text-sm text-red-600">
                            {organizationErrors.sub_domain}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Employees Size */}
                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-700 mb-1">
                        Employees Size
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employee_size"
                        value={organizationForm.employee_size}
                        onChange={handleOrganizationFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <>
                          <option value="">Select Employee Size</option>
                          {OrganizationSize?.map((orgsize: any) => (
                            <option key={orgsize.id} value={orgsize.id}>
                              {orgsize.name}
                            </option>
                          ))}
                        </>
                      </select>
                      {organizationErrors.employee_size && (
                        <p className="mt-1 text-sm text-red-600">
                          {organizationErrors.employee_size}
                        </p>
                      )}
                    </div>

                    {/* Revenue */}
                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-700 mb-1">
                        Revenue
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="revenue"
                        value={organizationForm.revenue}
                        onChange={handleOrganizationFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <>
                          <option value="">Select Revenue Range</option>
                          {revenue?.map((revenue: any) => (
                            <option key={revenue.id} value={revenue.id}>
                              {revenue.revenue_range}
                            </option>
                          ))}
                        </>
                      </select>
                      {organizationErrors.revenue && (
                        <p className="mt-1 text-sm text-red-600">
                          {organizationErrors.revenue}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {orgFormStep === 2 && (
                  <>
                    {/* Questions with options as radio buttons */}
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
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 shrink-0 peer-checked:border-transparent peer-checked:bg-linear-to-r peer-checked:from-[#7077FE] peer-checked:to-[#F07EFF] hover:from-[#F07EFF] hover:to-[#F07EFF] transition-all duration-300"
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

                            {isOrgFormSubmitted &&
                              organizationErrors[`question_${question.id}`] && (
                                <p className="mt-1 text-sm text-red-600">
                                  {
                                    organizationErrors[
                                      `question_${question.id}`
                                    ]
                                  }
                                </p>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {/* Form Footer Actions */}

                {/* Form Footer Actions */}
                <div className="flex justify-end mt-6 gap-3 flex-wrap">
                  {orgFormStep === 2 && (
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setOrgFormStep(1);
                          setOrganizationErrors({});
                        }}
                        variant="white-outline"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
          font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
          flex items-center justify-center"
                      >
                        Back
                      </Button>

                      <Button
                        type="button"
                        onClick={closeModal}
                        variant="white-outline"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
          font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
          flex items-center justify-center"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        variant="gradient-primary"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
          font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
          flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>

                      {/* <Button
                              type="button"
                              onClick={() => setOrgFormStep(3)}
                              variant="white-outline"
                              className="border border-[#7077FE] text-[#7077FE] hover:bg-[#f0f4ff]"
                            >
                              Pricing
                            </Button> */}
                    </>
                  )}

                  {orgFormStep === 1 && (
                    <>
                      <Button
                        type="button"
                        onClick={closeModal}
                        variant="white-outline"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNextClick}
                        variant="gradient-primary"
                        className="rounded-full py-3 px-8 transition-all"
                      >
                        Next
                      </Button>
                    </>
                  )}
                </div>

                {/* Dummy Pricing */}
                {orgFormStep === 3 && (
                  <>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                      🌟 Choose Your Plan
                    </h2>

                    <div className="flex justify-center">
                      <div className="relative w-full max-w-sm p-8 rounded-3xl border border-violet-300 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                        {/* Ribbon */}
                        <div className="absolute top-0 right-0 bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-3xl font-semibold shadow-md">
                          Popular
                        </div>

                        {/* Plan Info */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Starter Plan
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Perfect for small conscious teams
                        </p>

                        <div className="text-center mb-6">
                          <span className="text-4xl font-extrabold text-gray-900">
                            $36
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            /month
                          </span>
                        </div>

                        {/* CTA */}
                        <div className="flex justify-center">
                          <Button
                            variant="gradient-primary"
                            className="rounded-full py-3 px-8 text-white shadow-lg hover:opacity-90 transition"
                            onClick={() => closeModal()} // or navigate("/dashboard")
                          >
                            Get Started
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={activeModal === "organizationPricing"}
        onClose={closeModal}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
          <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex bg-linear-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2] w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
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
                  Let’s Get to Know Your Organization
                </h2>
                <p className="text-gray-900 text-sm">
                  This information helps us understand your conscious impact
                  better.
                </p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className=" p-6 rounded-lg w-full mx-auto my-auto z-10 relative">
              <h2 className="text-xl poppins font-bold mb-4 text-center">
                Organization Pricing Plan
              </h2>

              <div className="flex justify-center">
                {organizationpricingPlans?.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-lg p-4 hover:shadow-md transition-shadow ${plan.borderClass} relative`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
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
                      {getBillingNote(plan) && (
                        <p className="text-sm text-gray-500 mt-1">
                          {getBillingNote(plan)}
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
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r from-[#7077FE] to-[#9747FF]"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Annual billing
                  </span>
                </label>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
                >
                  Skip for now, go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={activeModal === "person"} onClose={closeModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
          <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex bg-linear-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2]  w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
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
                  Let's Get to <br></br>
                  Know You Better
                </h2>
                <p className="text-[#f3f1ff] text-sm">
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
                {/* Step 1 - Basic Information */}
                {personFormStep === 1 && (
                  <>
                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-800 mb-1">
                        First Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={personForm.first_name}
                        onChange={handlePersonFormChange}
                        className={`w-[440px] h-[41px]
                rounded-xl
                border-[0.82px]
                p-3 mt-2 ${
                  personErrors.first_name ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                      />
                      {personErrors.first_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {personErrors.first_name}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-800 mb-1">
                        Last Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={personForm.last_name}
                        onChange={handlePersonFormChange}
                        className={`w-[440px] h-[41px]
                rounded-xl
                border-[0.82px]
                p-3 mt-2 ${
                  personErrors.last_name ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                        placeholder="Enter your last name"
                      />
                      {personErrors.last_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {personErrors.last_name}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-800 mb-1 ">
                        Interests
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-4">
                        <Select
                          isMulti
                          options={interest?.map((interestItem: Interest) => ({
                            value: interestItem.id,
                            label: interestItem.name,
                          }))}
                          value={
                            personForm.interests?.map((interestId: any) => ({
                              value: interestId,
                              label: interest?.find(
                                (i: any) => i.id === interestId
                              )?.name,
                            })) || []
                          }
                          onChange={(selectedOptions) => {
                            // Update your form state with the selected values
                            const selectedValues = selectedOptions?.map(
                              (option) => option.value
                            );
                            setPersonForm({
                              ...personForm,
                              interests: selectedValues,
                            });
                          }}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select interests..."
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </div>
                      {personErrors.interests && (
                        <p className="mt-1 text-sm text-red-600">
                          {personErrors.interests}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block openSans text-base font-medium text-gray-800 mb-1">
                        Professions
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-4">
                        <Select
                          isMulti
                          options={[
                            ...profession?.map(
                              (professionItem: Profession) => ({
                                value: professionItem.id,
                                label: professionItem.title,
                              })
                            ),
                            { value: "other", label: "Other (please specify)" },
                          ]}
                          value={
                            personForm.professions?.map(
                              (professionId: any) => ({
                                value: professionId,
                                label:
                                  profession?.find(
                                    (p: any) => p.id === professionId
                                  )?.title ||
                                  (professionId === "other" ? "Other" : ""),
                              })
                            ) || []
                          }
                          onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions?.map(
                              (option) => option.value
                            );
                            setPersonForm({
                              ...personForm,
                              professions: selectedValues,
                            });
                          }}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select professions..."
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </div>
                      {personErrors.professions && (
                        <p className="mt-1 text-sm text-red-600">
                          {personErrors.professions}
                        </p>
                      )}
                    </div>
                    {/* Add this after the Select component */}
                    {personForm.professions?.includes("other") && (
                      <div className="mb-4 mt-2">
                        <label className="block openSans text-base font-medium text-gray-800 mb-1">
                          Specify Your Profession
                        </label>
                        <input
                          type="text"
                          name="custom_profession"
                          value={personForm.custom_profession || ""}
                          onChange={(e) =>
                            setPersonForm({
                              ...personForm,
                              custom_profession: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter your profession"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Step 2 - Questions */}
                {personFormStep === 2 && (
                  <>
                    <div className="space-y-4">
                      {readlineQuestion?.map((question: any) => {
                        const existingAnswer =
                          personForm.question.find(
                            (q: QuestionAnswer) => q.question_id === question.id
                          )?.answer || "";

                        return (
                          <div key={question.id} className="mb-4">
                            <label
                              style={{ lineHeight: "1.8" }}
                              className="block openSans text-base font-medium text-gray-800 mb-3 mt-4"
                            >
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
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 shrink-0 peer-checked:border-transparent peer-checked:bg-linear-to-r peer-checked:from-[#7077FE] peer-checked:to-[#F07EFF] hover:from-[#F07EFF] hover:to-[#F07EFF] transition-all duration-300"
                                    />
                                    <label
                                      htmlFor={`question_${question.id}_${option.id}`}
                                      className="ml-3 block openSans text-base text-gray-700 "
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
                  </>
                )}

                {/* Form Footer Actions */}
                <div className="flex justify-end mt-6 gap-3 flex-wrap">
                  {personFormStep === 2 && (
                    <>
                      <Button
                        type="button"
                        onClick={() => {
                          setPersonFormStep(1);
                          setPersonErrors({});
                        }}
                        variant="white-outline"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
                font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
                flex items-center justify-center"
                      >
                        Back
                      </Button>

                      <Button
                        type="button"
                        onClick={closeModal}
                        variant="white-outline"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
                font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
                flex items-center justify-center"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        variant="gradient-primary"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
                font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
                flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </>
                  )}

                  {personFormStep === 1 && (
                    <>
                      <Button
                        type="button"
                        onClick={closeModal}
                        variant="white-outline"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
                font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
                flex items-center justify-center"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={handleNextPersonClick}
                        variant="gradient-primary"
                        className="w-[104px] h-[39px] rounded-[100px] p-0
                font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
                flex items-center justify-center"
                      >
                        Next
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={activeModal === "personPricing"} onClose={closeModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
          <div className="w-full max-w-[1100px] max-h-[90vh] bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex bg-linear-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2] w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
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
                  Let's Get to <br></br>
                  Know You Better
                </h2>
                <p className="text-gray-700 text-sm">
                  This information helps us understand your conscious impact
                  better.
                </p>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className=" p-6 rounded-lg w-full mx-auto my-auto z-10 relative">
              <h2 className="text-xl poppins font-bold mb-4 text-center">
                Person Pricing Plan
              </h2>

              <div className="flex justify-center">
                {personPricing?.map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-lg p-4 hover:shadow-md transition-shadow ${plan.borderClass} relative`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
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
                      {getBillingNote(plan) && (
                        <p className="text-sm text-gray-500 mt-1">
                          {getBillingNote(plan)}
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
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r from-[#7077FE] to-[#9747FF]"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Annual billing
                  </span>
                </label>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
                >
                  Skip for now, go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={activeModal === "disqualify"} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-r from-[#7077FE] to-[#9747FF] mb-4">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="openSans text-center p-4 text-red-500">
            You are not eligible for the Aspiring Badge, Please try again after
            1 day.
          </div>
          <div className="mt-6">
            <Button
              onClick={() => {
                closeModal();
                navigate("/dashboard");
              }}
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
            >
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ===========================================================
   1) TRUE PROFILE
   =========================================================== */
export function TrueProfileCard({

  
  //title = "True Profile Created",
  //description = "Your profile is now complete with all the essential details added. This allows us to customize your experience!",
 
  completion = 100,
  avatar,
  onUpdateProfile,
}: // onOpen,
{
  title?: string;
  avatar?: string;
  description?: string;
  completion?: number;
  onUpdateProfile?: () => void;
  onOpen?: () => void;
}) {
  const id = localStorage.getItem("Id");
  const navigate = useNavigate();

  const computedTitle =
    completion === 100 ? "True Profile Created" : "Complete Your True Profile";

  const computedDescription =
    completion === 100
      ? "Your profile is now complete with all the essential details added. This allows us to customize your experience!"
      : "Your profile is still in progress. Please add the remaining details so we can customize your experience.";

  return (
    <Card className="p-4 md:p-5">
      {" "}
      {/* removed fixed height */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full">
            <img
              src={profileicon}
              alt="Profile Icon"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </span>
          <span className="font-poppins font-medium text-[15px] sm:text-[16px] leading-[100%] text-[#0F1728]">
            True Profile
          </span>
        </div>

        <button
          onClick={() => navigate(`/dashboard/userprofile/${id}`)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
          aria-label="Open True Profile"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <HeaderDivider />
      {/* Body */}
      <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Circular completion ring */}
        <div className="relative shrink-0">
          <div className="relative w-[92px] h-[92px] sm:w-[108px] sm:h-[108px] rounded-full p-[3px] bg-linear-to-r from-[#9747FF] to-[#F07EFF]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <img
                src={
                  !avatar ||
                  avatar === "null" ||
                  avatar === "undefined" ||
                  !avatar.startsWith("http")
                    ? "/profile.png"
                    : avatar
                }
                alt="Avatar"
                className="w-[74px] h-[74px] sm:w-[87px] sm:h-[87px] rounded-full object-cover"
              />
            </div>
          </div>

          {/* Percentage badge */}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-2 py-0.5 text-[10px] sm:text-[12px] font-semibold text-[#7077FE] shadow">
            {completion}%
          </span>
        </div>

        {/* Texts + Button */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h3 className="font-opensans font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-6 sm:leading-7 md:leading-8 text-[#222224]">
           {computedTitle}
          </h3>

          <p className="mt-2 font-opensans font-light text-[13px] sm:text-[14px] md:text-[16px] leading-[150%] text-[#242424]">
             {computedDescription}
          </p>

          <button
            onClick={onUpdateProfile}
            className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-10 items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </Card>
  );
}
/* ===========================================================
   2) CERTIFICATION
   =========================================================== */
export function CertificationCard({
  progress = 0,
  score = 0,
  onContinue,
  underProgressDescription = `You've successfully achieved Inspired certification and are currently working towards Inspired level. Complete the remaining requirements to unlock your next milestone.`,
  completeProgressDescription = `Congratulations on completing your Inspired certification! You're now awaiting your score results to see if you've reached the Inspired level. Stay tuned for your next milestone!`,
  inspiredDescription = `Congratulations on earning your Inspired certification! You're on your way to achieving the Inspired level. Just complete the remaining requirements to reach your next milestone.`,
  activeLevel = null,
  auto = true,
  intervalMs = 6000,
  upgradeText = "To achieve the next level certification, you need to create a basic profile that includes selling your reactions, accessing the community, and utilizing the resources library.",
}: // onUpgrade,
{
  progress?: number;
  score?: number;
  onContinue?: () => void;
  underProgressDescription?: string;
  completeProgressDescription?: string;
  inspiredDescription?: string;
  activeLevel?: string | null;
  onOpen?: () => void;
  auto?: boolean;
  intervalMs?: number;
  upgradeTitle?: string;
  upgradeText?: string;
  upgradeCtaLabel?: string;
  onUpgrade?: () => void;
}) {
  const [slide, setSlide] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [showiInterestModal, setShowInterestModal] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auto || paused) return;
    const id = setInterval(() => setSlide((s) => (s + 1) % 2), intervalMs);
    return () => clearInterval(id);
  }, [auto, paused, intervalMs]);

  const getUpgradeTitle = () => {
    switch (activeLevel) {
      case "Aspiring":
        return "Why you should upgrade to Inspired";
      case "Inspired":
        return "Why you should upgrade to Leader";
      case "Leader":
        return "You've reached the highest level!";
      default:
        return "Why you should upgrade to Aspiring";
    }
  };

  const getNextLevel = () => {
    switch (activeLevel) {
      case "Aspiring":
        return "Inspired";
      case "Inspired":
        return "Leader";
      case "Leader":
        return "Leader";
      default:
        return "Aspiring";
    }
  };

  const handleUpgradeClick = (activeLevel?: string | null) => {
    if (!activeLevel) {
      navigate("/dashboard/assesmentcertification");
    } else if (activeLevel === "Aspiring") {
      navigate("/dashboard/assesmentcertification");
    } else if (activeLevel === "Inspired") {
      navigate("/dashboard/assesmentcertification");
    } else {
      navigate("/dashboard/assesmentcertification");
    }
  };

  const dotCls = (on: boolean) =>
    `h-1.5 w-1.5 rounded-full ${
      on ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
    } transition-colors`;


    
  return (
    <>
      <Card className="rounded-xl border border-[#E5E7EB] px-4 md:px-[18px] py-5 space-y-3">
        {activeLevel === null ||
        (activeLevel === "Aspiring" && progress === 0) ? (
          <div
            className="w-full relative rounded-xl bg-white flex flex-col gap-[18px]"
            style={{ borderColor: "var(--Stroke, rgba(236, 238, 242, 1))" }}
          >
            <h6 className="font-['Poppins',Helvetica] font-medium text-[22px] sm:text-[28px] text-[#222224]">
              Consciousness is your Official stamp of credibility
            </h6>
            <h5 className="font-['Open_Sans',Helvetica] font-normal text-base sm:text-lg text-[#999999] leading-8">
              Get your conscious identity verified and unlock everything CNESS
              has to offer.
            </h5>
            <div className="w-fit">
              <button
                className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full w-fit"
                onClick={() => navigate("/dashboard/assesmentcertification")}
                style={{
                  border: "1px solid rgba(236, 238, 242, 1)",
                  boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <span className="font-['Open_Sans',Helvetica]">
                  Start Certification Profile
                </span>
                <div className="w-7 h-7 bg-[#F07EFF] text-white rounded-full flex items-center justify-center">
                  <HiOutlineLockClosed />
                </div>
              </button>
            </div>
          </div>
        ) : activeLevel === "Aspiring" && progress > 0 && progress < 100 ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EAFE]">
                <img
                  src={certicon}
                  alt="Certification Icon"
                  className="h-5 w-5"
                />
              </span>
              <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
                Certification
              </span>
            </div>
            <HeaderDivider />

            {/* Progress */}
            {progress > 0 && (
              <div className="flex flex-col gap-[18px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="mt-2 flex items-center justify-start gap-2">
                    <span className="text-2xl font-semibold font-['Open_Sans'] leading-8 text-[#222224]">
                      {progress}%
                    </span>
                    <span className="text-base font-normal font-['Open_Sans'] leading-8 text-[#64748B]">
                      of Certification Process
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => navigate("/dashboard/inspired-assessment")}
                      className="relative w-full sm:w-[194px] h-10 rounded-full px-5 py-2.5 flex items-center justify-center text-center font-semibold text-[14px] text-[#222224] font-['Open_Sans'] leading-[100%] bg-white"
                    >
                      <span className="relative z-10">Continue Assessment</span>
                      <span className="absolute inset-0 rounded-full p-px bg-linear-to-r from-[#9747FF] to-[#F07EFF]"></span>
                      <span className="absolute inset-px rounded-full bg-white"></span>
                    </button>
                  </div>
                </div>

                <div>
                  <Progress
                    value={progress}
                    gradient="bg-[linear-gradient(90deg,#F7E074_0%,#F28705_112.38%)]"
                  />
                </div>
              </div>
            )}
            <p className="text-sm font-normal font-['Open_Sans'] leading-[140%] text-[#242424]">
              {underProgressDescription}
            </p>
          </>
        ) : activeLevel === "Aspiring" && progress === 100 && score === 0 ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EAFE]">
                <img
                  src={certicon}
                  alt="Certification Icon"
                  className="h-5 w-5"
                />
              </span>
              <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
                Certification
              </span>
            </div>
            <HeaderDivider />

            {/* Progress */}
            {progress > 0 && (
              <div className="flex flex-col gap-[18px]">
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold font-['Open_Sans'] leading-8 text-[#222224]">
                    Assessment Completed
                  </span>
                  <button
                    disabled
                    className="inline-flex items-center gap-2 p-3 bg-[rgba(112,119,254,0.1)] text-[#9747FF] text-sm font-semibold rounded-full"
                  >
                    {/* Optional Icon */}
                    <img
                      src={clock}
                      alt="clock icon"
                      className="w-4 h-4"
                    />
                    Awaiting for Approval
                  </button>
                </div>

                <div>
                  <Progress
                    value={progress}
                    gradient="bg-[linear-gradient(90deg,#F7E074_0%,#FFC65E_48.72%,#00C950_97.44%)]"
                  />
                </div>
              </div>
            )}
            <p className="text-sm font-normal font-['Open_Sans'] leading-[140%] text-[#242424]">
              {completeProgressDescription}
            </p>
          </>
        ) : activeLevel === "Aspiring" && progress === 100 && score < 60 ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2EAFE]">
                <img
                  src={certicon}
                  alt="Certification Icon"
                  className="h-5 w-5"
                />
              </span>
              <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
                Certification
              </span>
            </div>
            <HeaderDivider />

            <div className="flex items-center justify-between gap-3">
              <div className="mt-2 flex items-end gap-2">
                <span className="text-[32px] font-semibold font-['Open_Sans'] leading-8 text-[#222224]">
                  CIS Score:
                </span>
                <span className="text-[32px] font-semibold font-['Open_Sans'] leading-8 text-[#7077FE]">
                  {score}
                  <sub className="text-base font-normal font-['Open_Sans'] text-[#64748B]">
                    /100
                  </sub>
                </span>
              </div>
              {score < 60 ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onContinue}
                    className="relative w-full sm:w-[194px] h-10 rounded-full px-5 py-2.5 flex items-center justify-center text-center font-semibold text-[14px] text-[#222224] font-['Open_Sans'] leading-[100%] bg-white"
                  >
                    <span className="relative z-10">Retake Assessment</span>
                    <span className="absolute inset-0 rounded-full p-px bg-linear-to-r from-[#9747FF] to-[#F07EFF]"></span>
                    <span className="absolute inset-px rounded-full bg-white"></span>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <p className="text-sm font-normal font-['Open_Sans'] leading-[140%] text-[#242424]">
              {inspiredDescription}
            </p>
          </>
        ) : (
          ""
        )}

        {/* Slides container */}
        <div className="mt-8">
          <div
            className="relative min-h-[450px] sm:min-h-[300px] md:min-h-[270px] rounded-[22px] border border-[#EFE8FF] bg-linear-to-r from-[#F6F2FF] via-[#FAF0FF] to-[#FFF1F8] p-4 sm:p-6 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slide 1: Levels */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                slide === 0
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="text-[16px] sm:text-[18px] font-['Open_Sans'] leading-[100%] text-[#222224] mt-1 sm:mt-2 mb-3 sm:mb-4 px-2 pt-2 sm:pt-5">
                Certification Levels
              </div>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-1 sm:px-2">
                {/* Aspiring */}
                <div
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-0.5 cursor-pointer ${
                    activeLevel === "Aspiring" && progress === 0
                      ? "bg-linear-to-r from-[#7077FE] to-[#F07EFF]"
                      : "border border-[#E5E7EB] bg-white"
                  }`}
                  onClick={() => {
                    if (
                      activeLevel === "Aspiring" ||
                      activeLevel === "Inspired"
                    ) {
                      navigate("/dashboard/assesmentcertification");
                    } else {
                      navigate("/dashboard/upgrade-badge");
                    }
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-white flex flex-col items-center justify-center gap-2.5 sm:gap-3 px-4 py-4">
                    <img
                      src={
                        activeLevel === null
                          ? aspired
                          : "https://cdn.cness.io/aspiringlogo.svg"
                      }
                      alt="Aspiring"
                      className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                    />
                    <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                      Aspired
                    </span>
                  </div>
                </div>

                {/* Inspired */}
                <div
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-0.5 cursor-pointer ${
                    activeLevel === "Inspired" ||
                    (activeLevel === "Aspiring" && progress > 0)
                      ? "bg-linear-to-r from-[#7077FE] to-[#F07EFF]"
                      : "border border-[#E5E7EB] bg-white"
                  }`}
                  onClick={() => {
                    if (
                      activeLevel === "Inspired" ||
                      activeLevel === "Leader"
                    ) {
                      navigate("/dashboard/assesmentcertification", {
                        state: { scrollTo: "inspired" },
                      });
                    } else {
                      navigate("/dashboard/upgrade-badge");
                    }
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-white flex flex-col items-center justify-center gap-2.5 sm:gap-3 px-4 py-4">
                    <img
                      src={
                        activeLevel === null ||
                        (activeLevel === "Aspiring" && progress === 0)
                          ? inspired
                          : "https://cdn.cness.io/inspired1.svg"
                      }
                      alt="Inspired"
                      className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                    />
                    <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                      Inspired
                    </span>
                  </div>
                </div>

                {/* Leader */}
                <div
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-0.5 cursor-pointer ${
                    activeLevel === "Leader"
                      ? "border-2 border-transparent bg-clip-padding bg-white relative before:absolute before:inset-0 before:rounded-[18px] before:p-0.5 before:bg-linear-to-r before:from-[#7077FE] before:to-[#F07EFF] before:-z-10"
                      : "border border-[#E5E7EB] bg-white"
                  }`}
                  onClick={() => {
                    if (activeLevel === "Leader") {
                      navigate("/dashboard/assesmentcertification");
                    } else {
                      navigate("/dashboard/upgrade-badge");
                    }
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-white flex flex-col items-center justify-center gap-2.5 sm:gap-3 px-4 py-4">
                    <img
                      src="https://cdn.cness.io/leader.webp"
                      alt="Leader"
                      className="h-[34px] w-[34px] sm:h-[39px] sm:w-[39px]"
                    />
                    <span className="font-poppins font-semibold text-[15px] sm:text-[18px] leading-[100%] text-[#0F1728]">
                      Leader
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Upgrade callout */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                slide === 1
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="h-full w-full flex items-start">
                <div className="w-full grid grid-cols-[56px,1fr] sm:grid-cols-[64px,1fr] gap-4 sm:gap-6 p-4 sm:p-6">
                  {/* Badge */}
                  <div className="flex items-start">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center">
                      <img
                        src={
                          activeLevel === "Aspiring"
                            ? "https://cdn.cness.io/inspired1.svg"
                            : activeLevel === "Inspired"
                            ? "https://cdn.cness.io/leader.webp"
                            : "https://cdn.cness.io/leader1.webp"
                        }
                        alt={`${getNextLevel()} badge`}
                        className="h-8 w-8 sm:h-9 sm:w-9"
                      />
                    </div>
                  </div>

                  {/* Copy + CTA */}
                  <div className="min-w-0">
                    <h4 className="mr-5 -mt-1 sm:-mt-4 font-poppins font-semibold text-[18px] sm:text-[20px] leading-[32.3px] tracking-[0.15px] text-[#0F1728]">
                      {getUpgradeTitle()}
                    </h4>

                    <p className="mt-1 font-['Open_Sans'] text-[13px] sm:text-[16px] leading-[150%] text-[#242424] font-light max-w-[95ch]">
                      {upgradeText}
                    </p>

                    {/* Updated button logic */}
                    {activeLevel !== "Leader" && (
                      <button
                        onClick={() => handleUpgradeClick(activeLevel)}
                        className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-10 items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
                      >
                        Upgrade to {getNextLevel()}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots BELOW the gradient card */}
          <div className="pt-3 flex justify-center">
            <div className="flex gap-1.5">
              <button
                aria-label="Slide 1"
                className={dotCls(slide === 0)}
                onClick={() => setSlide(0)}
              />
              <button
                aria-label="Slide 2"
                className={dotCls(slide === 1)}
                onClick={() => setSlide(1)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showiInterestModal}
        onClose={() => setShowInterestModal(false)}
      >
        <div className="p-6 lg:min-w-[450px] md:min-w-[450px] min-w-[300px] text-center">
          {/* Success Icon with purple theme */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-[#F2EAFE] flex items-center justify-center">
              <svg
                className="h-6 w-6 text-[#7E5FFF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Thank You!
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Thanks for showing the interest! We will get back to you on this
            process.
          </p>

          {/* Single OK Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowInterestModal(false)}
              className="px-6 py-2 text-sm font-medium text-white bg-[#7077FE] rounded-md hover:bg-[#5A61E8] transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ===========================================================
   4) BEST PRACTICES (left column, below Certification)
   =========================================================== */
interface BestPracticeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  if_following: boolean;
  followers_count: number;
  likes_count: number;
  comments_count: number;
  is_saved: boolean;
}

function CircleIconBtn({
  onClick,
  children,
  ariaLabel,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] text-[#7A7F8C] hover:bg-[#F7F8FA]"
    >
      {children}
    </button>
  );
}

export function BestPracticesSection({
  items,
  onAdd,
  setBestPractices,
  title = "Best Practices",
}: {
  items: BestPracticeItem[];
  onAdd?: () => void;
  setBestPractices: React.Dispatch<React.SetStateAction<BestPracticeItem[]>>;
  title?: string;
}) {
  // Desktop: simple 2-up pager
  const navigate = useNavigate();
  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const [page, setPage] = React.useState(0);
  const start = page * pageSize;
  const visible = items.slice(start, start + pageSize);
  const next = () => setPage((p) => (p + 1) % totalPages);
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  // Mobile: horizontal scrolling with snap
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [mobileIndex, setMobileIndex] = React.useState(0);

  // Track loading states for each best practice item
  const [loadingStates, setLoadingStates] = React.useState<{[key: string]: boolean}>({});

  // Scroll one card at a time on mobile
  const CARD_W = 332; // keep your fixed card width
  const GAP = 16; // gap-4 -> 16px
  const scrollByCard = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
  };

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / (CARD_W + GAP));
      setMobileIndex(Math.max(0, Math.min(items.length - 1, i)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const toggleFollowPost = async (bpId: any) => {
    // Set loading state for this specific item
    setLoadingStates(prev => ({ ...prev, [bpId]: true }));

    try {
      const res = await SendBpFollowRequest({ bp_id: bpId });

      if (res?.success?.statusCode === 200) {
        const isNowFollowing = res?.data?.data !== null;

        setBestPractices((prev) =>
          prev.map((item) =>
            item.id === bpId ? { ...item, if_following: isNowFollowing } : item
          )
        );
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    } finally {
      // Clear loading state regardless of success/error
      setLoadingStates(prev => ({ ...prev, [bpId]: false }));
    }
  };

  const slugify = (str: string) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  return (
    <Card className="p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4FF]">
            <img src={bpicon} alt="Best Practices Icon" className="h-10 w-10" />
          </span>
          <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <OutlinePill onClick={onAdd}>
            <Plus className="h-4 w-4" />
            <span className="hidden md:block">Add Best Practices</span>
            <span className="block md:hidden">Add</span>
          </OutlinePill>
        </div>
      </div>
      <HeaderDivider />

      {/* Subheader + arrows (desktop arrows only) */}
      <div className="mt-3 flex items-center justify-between">
        <div className="font-opensans text-[14px] leading-[100%] text-[#222224]">
          Recommended
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <CircleIconBtn ariaLabel="Previous" onClick={prev}>
            <ArrowLeft className="h-4 w-4" />
          </CircleIconBtn>
          <CircleIconBtn ariaLabel="Next" onClick={next}>
            <ArrowRight className="h-4 w-4" />
          </CircleIconBtn>
        </div>
      </div>

      {/* --- MOBILE list (horizontal scroll, snap) --- */}
      <div className="relative sm:hidden mt-3 w-full overflow-hidden">
        {/* Fade edges to hint scroll */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-white to-transparent" />

        {/* Scrollable row */}
        <div
          ref={listRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2
                     [-ms-overflow-style:none] [scrollbar-width:none]
                     [&::-webkit-scrollbar]:hidden"
        >
          {items.map((bp) => (
            <div
              key={bp.id}
              onClick={() =>
                navigate(
                  `/dashboard/bestpractices/${bp.id}/${slugify(bp.title)}`
                )
              }
              className="snap-start shrink-0 w-[332px] h-[317px] rounded-xl border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3 cursor-pointer"
            >
              {/* Image */}
              <div className="h-[135px] rounded-lg overflow-hidden">
                <img
                  src={
                    !bp.image ||
                    bp.image === "null" ||
                    bp.image === "undefined" ||
                    !bp.image.startsWith("http") ||
                    bp.image === "http://localhost:5026/file/"
                      ? iconMap["companycard1"]
                      : bp.image
                  }
                  alt={bp.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback in case the image fails to load
                    (e.target as HTMLImageElement).src =
                      iconMap["companycard1"];
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1">
                <div className="font-poppins font-medium text-[16px] leading-[120%] text-[#0F1728]">
                  {bp.title}
                </div>
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(bp.description),
                  }}
                />
                {bp.if_following ? (
                  <button
                    className="mt-auto w-full h-[37px] rounded-full bg-[#F396FF] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow transition flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowPost(bp.id);
                    }}
                    disabled={loadingStates[bp.id]}
                  >
                    {loadingStates[bp.id] ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Following'
                    )}
                  </button>
                ) : (
                  <button
                    className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow hover:bg-[#5A61E8] transition flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowPost(bp.id);
                    }}
                    disabled={loadingStates[bp.id]}
                  >
                    {loadingStates[bp.id] ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tiny overlay arrows for mobile (optional) */}
        <button
          onClick={() => scrollByCard(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#E4E7EC] shadow-sm flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ArrowLeft className="h-4 w-4 text-[#7A7F8C]" />
        </button>
        <button
          onClick={() => scrollByCard(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 border border-[#E4E7EC] shadow-sm flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ArrowRight className="h-4 w-4 text-[#7A7F8C]" />
        </button>
      </div>

      {/* --- DESKTOP list (keep your 2-up pager) --- */}
      <div className="mt-3 hidden sm:flex gap-4 overflow-hidden">
        {visible.map((bp) => (
          <div
            key={bp.id}
            onClick={() =>
              navigate(`/dashboard/bestpractices/${bp.id}/${slugify(bp.title)}`)
            }
            className="shrink-0 w-[332px] h-[317px] rounded-xl border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3 cursor-pointer"
          >
            <div className="h-[135px] rounded-lg overflow-hidden">
              <img
                src={
                  !bp.image ||
                  bp.image === "null" ||
                  bp.image === "undefined" ||
                  !bp.image.startsWith("http") ||
                  bp.image === "http://localhost:5026/file/"
                    ? iconMap["companycard1"]
                    : bp.image
                }
                alt={bp.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback in case the image fails to load
                  (e.target as HTMLImageElement).src = iconMap["companycard1"];
                }}
              />
            </div>

            <div className="flex flex-col flex-1">
              <div className="font-poppins font-medium text-[16px] leading-[120%] text-[#0F1728]">
                {bp.title}
              </div>
              <span className="mt-3 font-opensans text-[16px] leading-[150%] text-[#667085] line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(bp.description),
                }}
              />
              {bp.if_following ? (
                <button
                  className="mt-auto w-full h-[37px] rounded-full bg-[#F396FF] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow transition flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowPost(bp.id);
                  }}
                  disabled={loadingStates[bp.id]}
                >
                  {loadingStates[bp.id] ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Following'
                  )}
                </button>
              ) : (
                <button
                  className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow hover:bg-[#5A61E8] transition flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowPost(bp.id);
                  }}
                  disabled={loadingStates[bp.id]}
                >
                  {loadingStates[bp.id] ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Follow'
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dots: mobile shows one dot per card; desktop shows one per page */}
      {/* Mobile dots */}
      <div className="mt-4 flex justify-center gap-1 sm:hidden">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === mobileIndex ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
            }`}
          />
        ))}
      </div>
      {/* Desktop dots */}
      <div className="mt-4 hidden sm:flex justify-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              i === page ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
            }`}
          />
        ))}
      </div>
    </Card>
  );
}

export function SocialStackCard({
  // profile
  coverUrl,
  avatar,
  name,
  handle,
  resonating = 100,
  resonators = 1000,
  //onViewProfile,
  // onSearch,
  onOpen,

  // adventure
  adventureTitle = "Your Next Social Life Adventure",
  adventureText = "What would your younger self admire about your life now?\nAny standout achievements or experiences?",
  onStartPosting,
  onViewFeed,

  // friends
  suggested,
  requested,
  fetchFriendRequests,
  fetchFriendSuggestions
}: // onConnect,
{
  coverUrl: string;
  avatar: string;
  name: string;
  handle: string;
  resonating?: any;
  resonators?: any;
  onViewProfile?: () => void;
  onSearch?: (q: string) => void;
  onOpen?: () => void;

  adventureTitle?: string;
  adventureText?: string;
  onStartPosting?: () => void;
  onViewFeed?: () => void;
  fetchFriendRequests?: any;
  fetchFriendSuggestions?: any;

  suggested: {
    user_id(user_id: any): void;
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }[];
  requested: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }[];
  onConnect?: (f: {
    id: string | number;
    name: string;
    handle: string;
    avatar: string;
  }) => void;
}) {
  const [tab, setTab] = React.useState<"Suggested" | "Requested">("Suggested");
  const list = tab === "Suggested" ? suggested : requested;
  const navigate = useNavigate();
  const { showToast } = useToast();

  type AdventureSlide = {
    title: string;
    text: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  };

  function MarqueeColumn({
    images,
    side, // "left" | "right"
    reverse = false,
    asStatic = false, // ← when true, rail is not absolute (used on mobile)
  }: {
    images: string[];
    side: "left" | "right";
    reverse?: boolean;
    asStatic?: boolean;
  }) {
    const list = [...images, ...images];

    const Rail = (
      <div
        className={`flex flex-col gap-[3px] ${
          reverse ? "marquee-ping-reverse" : "marquee-ping"
        }`}
      >
        {list.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="w-9 h-[46px] md:w-[43px] md:h-14 p-0.5 rounded-sm bg-white/95 shadow"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full rounded-xs object-cover"
            />
          </div>
        ))}
      </div>
    );

    if (asStatic) {
      // Used inside the mobile grid (not absolutely positioned)
      return (
        <div className="h-full w-10 md:w-[54px] overflow-hidden pointer-events-none">
          {Rail}
        </div>
      );
    }

    // Overlay rails for sm+
    const sideCls = side === "left" ? "left-2 md:left-3" : "right-2 md:right-3";
    return (
      <div
        aria-hidden
        className={`hidden sm:block absolute ${sideCls} top-2 md:top-4 bottom-2 md:bottom-4
                  w-10 md:w-[50px] overflow-hidden pointer-events-none z-0`}
      >
        {Rail}
      </div>
    );
  }
  /* ===== 3-slide carousel for the Adventure section ===== */
  function AdventureSlides({
    slides,
    leftImages,
    rightImages,
    onPrimary,
    onSecondary,
    auto = true,
    intervalMs = 6000,
    reactions,
  }: {
    slides: AdventureSlide[];
    leftImages: string[];
    rightImages: string[];
    onPrimary?: () => void;
    onSecondary?: () => void;
    auto?: boolean;
    intervalMs?: number;
    reactions?: { topRight?: string; bottomLeft?: string }; // NEW
  }) {
    const [idx, setIdx] = React.useState(0);
    const [paused, setPaused] = React.useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    React.useEffect(() => {
      if (!auto || paused) return;
      const id = setInterval(
        () => setIdx((i) => (i + 1) % slides.length),
        intervalMs
      );
      return () => clearInterval(id);
    }, [auto, paused, intervalMs, slides.length]);

    const s = slides[idx];

    const ReactionBubble = ({
      src,
      className = "",
    }: {
      src?: string;
      className?: string;
    }) =>
      src ? (
        <img
          src={src}
          className={`absolute z-0 pointer-events-none h-8 w-8 object-contain drop-shadow-md ${className}`}
        />
      ) : null;

    const loadNotifications = async (): Promise<any[] | null> => {
      if (cachedNotifications) return cachedNotifications;
      if (notificationsPromise) return notificationsPromise;

      notificationsPromise = (async () => {
        try {
          const res = await GetUserNotification();
          if (res?.data?.data) {
            const firstTen = res.data.data.slice(0, 3);
            cachedNotifications = firstTen;
            return firstTen;
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
        return null;
      })();

      const result = await notificationsPromise;
      notificationsPromise = null;
      return result;
    };

    useEffect(() => {
      let mounted = true;
      setNotificationsLoading(true);
      loadNotifications()
        .then((data) => {
          if (!mounted) return;
          if (data) {
            setNotifications(data);
          }
        })
        .finally(() => {
          if (mounted) setNotificationsLoading(false);
        });
      return () => {
        mounted = false;
      };
    }, []);

    /* ---------- helpers ---------- */

    // const InsightsCard = () => (
    //   <div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
    //     {/* badge */}
    //     <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#A996FF]">
    //       <img src={postinsight} alt="post" className="w-10 h-10" />
    //     </div>

    //     <h3 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
    //       Post Insights
    //     </h3>
    //     <p className=" mt-2 max-w-[32rem] mx-auto text-[12px] leading-[100%] text-[#667085] font-[400] text-center font-['Open_Sans']">
    //       {s.text /* e.g. "Posted on May 10,2024" */}
    //     </p>

    //     {/* white stat card */}
    //     <div className="mt-2 rounded-2xl border border-[#EEF0F5] bg-white p-5 shadow-sm">
    //       {/* Account Reached */}
    //       <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
    //         <div>
    //           <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
    //             Account Reached
    //           </div>
    //           <div className="mt-2 text-[18px] font-semibold text-[#F07EFF]">
    //             {Intl.NumberFormat().format(resonating)}
    //           </div>
    //         </div>

    //         {/* dot chart (pink) */}
    //         <div className="flex flex-row items-end gap-1 mt-2 sm:mt-0">
    //           {/* Column 1 (4 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 4 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
    //             ))}
    //           </div>

    //           {/* Column 2 (5 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 5 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
    //             ))}
    //           </div>

    //           {/* Column 3 (3 dots - peak) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 3 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
    //             ))}
    //           </div>

    //           {/* Column 4 (4 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 4 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="my-4 border-t border-[#E9EDF3]" />

    //       {/* Followers */}
    //       <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
    //         <div>
    //           <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
    //             Followers
    //           </div>
    //           <div className="mt-2 text-[18px] font-semibold text-[#8B7CFF]">
    //             +{Intl.NumberFormat().format(resonators)}
    //           </div>
    //         </div>

    //         {/* dot chart (purple) */}
    //         <div className="flex flex-row items-end gap-1 mt-2 sm:mt-0">
    //           {/* Column 1 (4 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 4 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
    //             ))}
    //           </div>

    //           {/* Column 2 (5 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 5 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
    //             ))}
    //           </div>

    //           {/* Column 3 (3 dots - peak) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 3 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
    //             ))}
    //           </div>

    //           {/* Column 4 (4 dots) */}
    //           <div className="flex flex-col gap-1 justify-end">
    //             {Array.from({ length: 4 }).map((_, i) => (
    //               <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
    const NotificationsCard = ({ notifications }: { notifications: any[] }) => {
      //const userProfile = localStorage.getItem("profile_picture");
      return (
<div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
    <div className="flex flex-col h-[350px]">

          {/* header */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7E9FF]">
              <Bell className="h-4 w-4 text-[#B255FF]" />
            </div>
            <h3 className="font-poppins font-semibold text-[20px] leading-8 tracking-[0.15px] text-center text-[#0F1728]">
              Notification
            </h3>
          </div>

          {/* rows */}
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mt-3">

            {notificationsLoading && (
              <div className="text-sm text-[#667085]">Loading notifications...</div>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-[#EEF0F5] bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                 <img
                src={
                  item?.sender_profile?.profile_picture
                    ? item.sender_profile.profile_picture
                    : alterProfile // 👈 Default fallback if null or undefined
                }
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.currentTarget;
                  target.onerror = null; // Prevent infinite loop
                  target.src = alterProfile as string; // 👈 Fallback if image fails to load
                }}
                className="h-11 w-11 rounded-full object-cover"
                alt={`${item?.sender_profile?.first_name || "User"}'s profile`}
              />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold text-[#0F1728]">
                      {item?.sender_profile?.first_name}{" "}
                      {item?.sender_profile?.last_name}
                    </div>
                    <div className="truncate text-[14px] text-[#98A2B3]">
                      {item.description}
                    </div>
                  </div>
                </div>
                {/* <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EEF0F5] bg-white shadow-sm">
                  <MoreHorizontal className="h-4 w-4 text-[#8F9AA6]" />
                </div> */}
              </div>
            ))}
          </div>

          {/* CTA */}
  {/* your notification items here */}

  <button
    className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex h-10 w-[90%] items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[linear-gradient(90deg,#7077FE_0%,#9747FF_60%,#F07EFF_100%)] shadow"
    onClick={() => navigate("/dashboard/notification")}
  >
    View all Notification
  </button>

        </div>
        </div>
      );
    };

    /* ---------- render ---------- */
    const edgePad = idx === 0 ? "px-3 sm:px-14 md:px-16" : "";
    return (
      <>
        <div
          className="relative
             h-auto min-h-80 sm:h-[360px]
             rounded-xl border border-[#ECEEF2]
             px-3 py-[18px]
             overflow-hidden flex flex-col justify-center shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* side marquees & static reaction bubbles only on slide 1, hide on mobile */}
          {idx === 0 && (
            <>
              <div className="hidden sm:block">
                <MarqueeColumn side="left" images={leftImages} />
                <MarqueeColumn side="right" images={rightImages} reverse />
                <ReactionBubble
                  src={reactions?.topRight}
                  className="right-12 top-6 md:right-12 md:top-6"
                />
                <ReactionBubble
                  src={reactions?.bottomLeft}
                  className="left-12 bottom-6 md:left-12 md:bottom-6"
                />
              </div>
            </>
          )}

          {/* content */}
          <div
            className={`relative z-10 h-full flex flex-col justify-center ${edgePad}`}
          >
            {idx === 0 ? (
              <div className="flex flex-col items-center justify-center h-full w-full px-2 sm:px-0">
                <h4 className="font-poppins font-semibold text-[#0F1728] text-center text-[20px] leading-7 wrap-break-word">
                  <MobileBreakTitle text={s.title} afterWords={3} />
                </h4>
                <p
                  className="mt-2 text-[#667085] text-[12px] sm:text-[12px] md:text-[13px]
                  leading-[150%] font-normal font-['Open_Sans']
                  text-center whitespace-normal wrap-break-word
                  max-w-[28ch] sm:max-w-[34ch] mx-auto"
                >
                  {s.text}
                </p>
                <div
                  className="mt-4 grid grid-cols-2 gap-2
                    w-full max-w-[320px] sm:max-w-[360px] mx-auto
                    place-items-center"
                >
                  <PrimaryButton
                    className="
                      w-[100px] min-w-[100px] h-[33px]
                      rounded-[100px]
                      px-3 pr-2
                      whitespace-nowrap shrink-0
                      justify-center!     
                      text-[12px] mr-2   
                    "
                    onClick={onPrimary}
                  >
                    {s.primaryLabel ?? "Start Posting"}
                  </PrimaryButton>
                  <OutlinePill
                    className="
                      w-[100px] min-w-[100px] h-[33px]
                      rounded-[100px]
                      px-3 pr-2
                      whitespace-nowrap shrink-0
                      justify-center!
                      text-[12px]
                    "
                    onClick={onSecondary}
                  >
                    {s.secondaryLabel ?? "View Feed"}
                  </OutlinePill>
                </div>
              </div>
            ) : (
              // : idx === 1 ? (
              //   // <InsightsCard />
              // )
              <NotificationsCard notifications={notifications} />
            )}
          </div>

          {/* marquee animations */}
          <style>{`
            @keyframes marqueePing { 0%,12% { transform: translateY(0) } 88%,100% { transform: translateY(-50%) } }
            .marquee-ping { animation: marqueePing 2s linear infinite; animation-direction: alternate; }
            .marquee-ping-reverse { animation: marqueePing 2s linear infinite; animation-direction: alternate-reverse; }
          `}</style>
        </div>

        {/* Dots OUTSIDE the card so they’re always visible */}
        <div className="flex justify-center gap-1.5 pt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full ${
                i === idx ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
              }`}
            />
          ))}
        </div>
      </>
    );
  }

  const [friendRequests, setFriendRequests] = useState<{
    [key: string]: string;
  }>({});
  const [connectingUsers, setConnectingUsers] = useState<{
    [key: string]: boolean;
  }>({});

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUsers((prev) => ({ ...prev, [userId]: true }));

      // Check if already connected
      if (friendRequests[userId] === "connected") {
        // If connected, delete friend
        const formattedData = {
          friend_id: userId,
        };

        const response = await UnFriend(formattedData);

        if (response.success) {
          setFriendRequests((prev) => ({
            ...prev,
            [userId]: "connect",
          }));
          showToast({
            message: "Friend removed successfully",
            type: "success",
            duration: 3000,
          });
        }
      } else {
        // If not connected, send friend request
        const formattedData = {
          friend_id: userId,
        };

        const response = await SendFriendRequest(formattedData);

        if (response.success) {
          // Immediately update the button state to "requested"
          setFriendRequests((prev) => ({
            ...prev,
            [userId]: "requested",
          }));
          showToast({
            message:
              response.success.message || "Friend request sent successfully",
            type: "success",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error handling connect:", error);
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConnectingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getFriendStatus = (userId: string) => {
    return friendRequests[userId] || "connect";
  };

  const handleAcceptRequest = async (userId: string) => {
    try {
      setConnectingUsers((prev) => ({ ...prev, [userId]: true }));

      const formattedData = {
        friend_id: userId,
      };

      const response = await AcceptFriendRequest(formattedData);

      if (response.success) {
        setFriendRequests((prev) => ({
          ...prev,
          [userId]: "connected",
        }));
        showToast({
          message: "Friend request accepted successfully",
          type: "success",
          duration: 3000,
        });
        await fetchFriendRequests()
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      showToast({
        message: "Failed to accept friend request",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConnectingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // NEW: Function to handle declining friend requests
  const handleDeclineRequest = async (userId: string) => {
    try {
      setConnectingUsers((prev) => ({ ...prev, [userId]: true }));

      const formattedData = {
        friend_id: userId,
      };

      const response = await RejectFriendRequest(formattedData);

      if (response.success) {
        setFriendRequests((prev) => ({
          ...prev,
          [userId]: "declined",
        }));
        showToast({
          message: "Friend request declined",
          type: "success",
          duration: 3000,
        });
        await fetchFriendRequests()
        // Optional: Remove the declined request from the list
        // You might want to refresh the requested list instead
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
      showToast({
        message: "Failed to decline friend request",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConnectingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };


  const handleTabChange = (newTab: "Suggested" | "Requested") => {
    setTab(newTab);
    
    // Call the appropriate fetch function based on the selected tab
    if (newTab === "Suggested" && fetchFriendSuggestions) {
      fetchFriendSuggestions();
    } else if (newTab === "Requested" && fetchFriendRequests) {
      fetchFriendRequests();
    }
  };

  // Also call the fetch function on initial mount for the default tab
  React.useEffect(() => {
    if (tab === "Suggested" && fetchFriendSuggestions) {
      fetchFriendSuggestions();
    } else if (tab === "Requested" && fetchFriendRequests) {
      fetchFriendRequests();
    }
  }, []);
  return (
    <Card className="p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4FF]">
            <img
              src={socialicon}
              alt="Best Practices Icon"
              className="h-10 w-10"
            />
          </span>
          <span className="font-poppins font-medium text-[16px] leading-[100%] text-[#0F1728]">
            Social Profile
          </span>
        </div>

        <button
          onClick={onOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      <HeaderDivider />

      {/* Search 
      <div
        className="mt-2 flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-3"
        onClick={() => navigate("/dashboard/feed")}
      >
        <input
          className="h-10 w-full outline-none text-sm"
          placeholder="Search…"
          // onChange={(e) => onSearch?.(e.target.value)}
          // onClick={(e) => e.stopPropagation()}
        />
        <SearchIcon className="h-4 w-4 text-[#667085]" />
      </div>*/}

      {/* ===== Section 1: Profile preview ===== */}
      <div className=" mt-4 h-[290px] rounded-xl border border-[#ECEEF2] p-3 flex flex-col gap-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]">
        {/* Cover */}
        <img
          src={coverUrl}
          alt=""
          className="h-[149px] w-full rounded-xl object-cover"
        />

        {/* Profile */}
        <div className="flex items-center gap-3 w-full overflow-hidden">
          {/* Avatar */}
          <img
            src={
              !avatar ||
              avatar === "null" ||
              avatar === "undefined" ||
              !avatar.startsWith("http")
                ? "/profile.png"
                : avatar
            }
            alt={name}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-poppins font-medium text-[16px] md:text-[18px] leading-6 text-[#222224] truncate">
                  {name}
                </div>
                <div className="font-opensans text-[14px] text-[#222224]/50 truncate">
                  @{handle}
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-start sm:gap-4 xl:gap-0 2xl:gap-4 text-[14px] text-right">
                <span className="whitespace-nowrap">
                  <span className="font-poppins font-medium text-[16px] text-[#7077FE]">
                    {resonating}
                  </span>
                  <span className="ml-1 font-['Plus_Jakarta_Sans'] text-[11px] text-[#7077FE]">
                    Resonating
                  </span>
                </span>
                <span className="whitespace-nowrap">
                  <span className="font-poppins font-medium text-[16px] text-[#A855F7]">
                    {Intl.NumberFormat().format(resonators)}
                  </span>
                  <span className="ml-1 font-['Plus_Jakarta_Sans'] text-[11px] text-[#A855F7]">
                    Resonators
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          className="mt-auto w-full flex items-center justify-center gap-[7.09px] 
             h-[34px] rounded-[100px] bg-[#7077FE] 
             px-6 py-3 
             font-opensans font-normal text-[14px] leading-[100%] text-white 
             shadow hover:bg-[#5A61E8] transition"
          onClick={() => navigate("/dashboard/Profile")}
        >
          View Profile
        </button>
      </div>

      {/* section divider */}
      <div className="my-4 border-t border-[#ECEEF2]" />

      {/* ===== Section 2: Your Next Social Life Adventure ===== */}
      <AdventureSlides
        slides={[
          {
            title: adventureTitle,
            text: adventureText,
            primaryLabel: "Start Posting",
            secondaryLabel: "View Feed",
          },
          // {
          //   title: "Post Insights",
          //   text: "Posted on May 10,2024",
          //   primaryLabel: "Create Post",
          //   secondaryLabel: "Open Feed",
          // },
          {
            title: "Ask the community",
            text: "Start a discussion and get feedback from experienced sellers in minutes.",
            primaryLabel: "Start Thread",
            secondaryLabel: "Browse Topics",
          },
        ]}
        leftImages={[
          "https://i.pravatar.cc/60?img=21",
          "https://i.pravatar.cc/60?img=22",
          "https://i.pravatar.cc/60?img=23",
          "https://i.pravatar.cc/60?img=24",
          "https://i.pravatar.cc/60?img=25",
        ]}
        rightImages={[
          "https://i.pravatar.cc/60?img=31",
          "https://i.pravatar.cc/60?img=32",
          "https://i.pravatar.cc/60?img=33",
          "https://i.pravatar.cc/60?img=34",
          "https://i.pravatar.cc/60?img=35",
        ]}
        onPrimary={onStartPosting}
        onSecondary={onViewFeed}
        reactions={{
          topRight: "../likes.svg", // your “like” image
          bottomLeft: "../heart.svg", // your “heart” image
        }}
        auto
        intervalMs={6000}
      />

      {/* section divider */}
      <div className="my-4 border-t border-[#ECEEF2]" />
      {/* ===== Section 3: Friends ===== */}
      <div
        className="h-[393px] rounded-xl border border-[#ECEEF2] 
             px-3 py-[18px] flex flex-col gap-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.04)] "
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img src={friendsicon} alt="directory Icon" className="h-10 w-10" />
          </span>
          <span className="text-[16px] font-medium font-Poppins text-[#222224]">
            Friends
          </span>
        </div>

        {/* pill tabs */}
        <div
          role="tablist"
          className="relative inline-grid w-full max-w-[320px] grid-cols-2 rounded-full border border-[#ECEEF2] bg-white p-1 select-none"
        >
          {/* sliding thumb */}
          <div
            className="absolute top-1 bottom-1 rounded-full bg-[#7077FE] shadow-sm transition-all duration-200"
            style={{
              width: "calc(50% - 8px)",
              left: tab === "Suggested" ? 4 : "calc(50% + 4px)",
            }}
          />

          {/* buttons */}
          <button
            role="tab"
            aria-selected={tab === "Suggested"}
            onClick={() => handleTabChange("Suggested")} // Use handleTabChange instead of setTab
            className={`relative z-10 h-8 text-center text-sm font-semibold rounded-full transition-colors ${
              tab === "Suggested" ? "text-white" : "text-[#222224]"
            }`}
          >
            Suggested
          </button>

          <button
            role="tab"
            aria-selected={tab === "Requested"}
            onClick={() => handleTabChange("Requested")} // Use handleTabChange instead of setTab
            className={`relative z-10 h-8 text-center text-sm font-semibold rounded-full transition-colors ${
              tab === "Requested" ? "text-white" : "text-[#222224]"
            }`}
          >
            Requested
          </button>
        </div>

        {/* list */}
        <div className="space-y-3 flex-1">
          {list && list.length > 0 ? (
            list.slice(0, 4).map((f: any) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      !f.avatar ||
                      f.avatar === "null" ||
                      f.avatar === "undefined" ||
                      !f.avatar.startsWith("http")
                        ? "/profile.png"
                        : f.avatar
                    }
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#0F1728]">
                      {f.name}
                    </div>
                    <div className="truncate text-xs text-[#667085]">
                      {f.handle}
                    </div>
                  </div>
                </div>
                {/* <OutlinePill
                  className="h-9 px-3"
                  onClick={() => onConnect?.(f)}
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </OutlinePill> */}
                {tab === "Suggested" ? (
                  <button
                    onClick={() => handleConnect(f.id)}
                    disabled={connectingUsers[f.id] || false}
                    className={`hidden lg:flex justify-center items-center gap-1 text-xs lg:text-sm px-3 py-1.5 rounded-full transition-colors font-family-open-sans h-[35px]
                    ${
                      getFriendStatus(f.id) === "connected"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : getFriendStatus(f.id) === "requested"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-white text-black shadow-md"
                    }`}
                  >
                    <span className="flex items-center gap-1 text-[#0B3449]">
                      <img
                        src={iconMap["userplus"]}
                        alt="userplus"
                        className="w-4 h-4"
                      />
                      {connectingUsers[f.id]
                        ? "Loading..."
                        : getFriendStatus(f.id) === "connected"
                        ? "Connected"
                        : getFriendStatus(f.id) === "requested"
                        ? "Requested"
                        : "Connect"}
                    </span>
                  </button>
                ) : (
                  // Requested tab - Show Accept/Decline buttons
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(f.id)}
                      className="p-2 rounded-lg bg-[#31C48D] text-white hover:opacity-90"
                      aria-label="Accept"
                    >
                      <CircleCheckBig size={16} />
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(f.id)}
                      className="p-2 rounded-lg bg-[#F87171] text-white hover:opacity-90"
                      aria-label="Reject"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-[#667085] py-4">
              No data available
            </div>
          )}
        </div>

<PrimaryButton
  className="w-full rounded-3xl"
  onClick={() => {
    if (tab === "Requested") {
      navigate("/dashboard/MyConnection", {
            state: { to: "request" },
          });
    } else {
      navigate("/dashboard/MyConnection", {
            state: { to: "suggestion" },
          });
    }
  }}
>
  See More
</PrimaryButton>
      </div>
    </Card>
  );
}

export function MarketplaceCard({
  suggested,
  topRated,
  carted,
}: {
  suggested: {
    id: string | number;
    name: string;
    avatar: string;
  }[];
  topRated: {
    id: string | number;
    name: string;
    avatar: string;
  }[];
  carted: {
    id: string | number;
    name: string;
    image: string;
    price: string;
  }[];
}) {
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlideIndex((s) => (s + 1) % 3), 6000);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(".menu-container")) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const renderProductSection = (products: typeof suggested, title: string) => (
    <div className="flex flex-col py-[18px] px-3 gap-[18px] border border-[#ECEEF2] rounded-xl">
      <div className="flex justify-start items-center gap-3">
        <img
          src={suggesticon}
          alt="directory Icon"
          className="h-5 w-5"
        />
        <span className="text-lg font-medium text-[#222224] font-poppins">
          {title}
        </span>
      </div>
      <div className="flex flex-col px-1 gap-2 overflow-visible">
        {products && products.length > 0 ? (
          products.slice(0, 3).map((f) => (
            <div
              className="flex items-center justify-between py-2 ps-2 pr-3 border border-[#ECEEF2] rounded-xl gap-3"
              style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={f?.avatar}
                  alt="directory Icon"
                  className="h-[30px] w-[30px]"
                />
                <span className="text-sm font-medium text-[#0D0D12] font-poppins">
                  {f?.name}
                </span>
              </div>
              <div className="relative">
                <button
                  // onClick={() =>
                  //   setOpenMenuId(openMenuId === f.id ? null : f.id)
                  // }
                  onClick={() => navigate("/dashboard/marketplace")}
                  className="flex items-center justify-center w-8 h-8 rounded-[5px] hover:bg-gray-100 transition-colors"
                  title="More options"
                  style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.1)" }}
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>

                {openMenuId === f.id && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]">
                    <ul className="space-y-1">
                      <li>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <LinkIcon className="w-4 h-4" />
                          Copy
                        </button>
                      </li>
                      <li>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50">
                          <Bookmark className="w-4 h-4" />
                          Save
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-[#667085] py-4">
            No data available
          </div>
        )}
      </div>
      <PrimaryButton
        className="w-full rounded-3xl"
        onClick={() => navigate("/dashboard/marketplace")}
      >
        Visit seller Dashboard
      </PrimaryButton>
    </div>
  );

  const renderTopRatedProductSection = (
    products: typeof topRated,
    title: string
  ) => (
    <div className="flex flex-col py-[18px] px-3 gap-[18px] border border-[#ECEEF2] rounded-xl bg-[linear-gradient(180deg,rgba(112,119,254,0.1)_0%,rgba(240,126,255,0.1)_100%)]">
      <div className="flex justify-start items-center gap-3">
        <img src={fire} alt="directory Icon" className="h-5 w-5" />
        <span className="text-lg font-medium text-[#222224] font-poppins">
          {title}
        </span>
      </div>
      <div className="flex flex-col px-1 gap-2 overflow-visible">
        {products && products.length > 0 ? (
          products.slice(0, 3).map((f) => (
            <div
              className="flex items-center justify-between py-2 ps-2 pr-3 border border-[#ECEEF2] rounded-xl gap-3 bg-white"
              style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center gap-2">
                <img
                  src={f?.avatar}
                  alt="directory Icon"
                  className="h-[30px] w-[30px]"
                />
                <span className="text-sm font-medium text-[#0D0D12] font-poppins">
                  {f?.name}
                </span>
              </div>
              <div className="relative">
                <button
                  // onClick={() =>
                  //   setOpenMenuId(openMenuId === f.id ? null : f.id)
                  // }
                  onClick={() => navigate("/dashboard/marketplace")}
                  className="flex items-center justify-center w-8 h-8 rounded-[5px] hover:bg-gray-100 transition-colors"
                  title="More options"
                  style={{ boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.1)" }}
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>

                {openMenuId === f.id && (
                  <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]">
                    <ul className="space-y-1">
                      <li>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <LinkIcon className="w-4 h-4" />
                          Copy
                        </button>
                      </li>
                      <li>
                        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50">
                          <Bookmark className="w-4 h-4" />
                          Save
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-[#667085] py-4">
            No data available
          </div>
        )}
      </div>
      <PrimaryButton
        className="w-full rounded-3xl"
        onClick={() => navigate("/dashboard/marketplace")}
      >
        View All
      </PrimaryButton>
    </div>
  );

  const renderCartProductSection = (products: typeof carted, title: string) => (
    <div
      className="flex flex-col min-h-[300px] py-[18px] px-3 gap-[18px] border border-[#ECEEF2] rounded-xl"
      style={{ background: "rgba(240, 126, 255, 0.1)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img
              src={carticon}
              alt="directory Icon"
              className="h-5 w-5"
            />
          </span>
          <span className="text-lg font-medium text-[#222224] font-poppins">
            {title}
          </span>
        </div>

        <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]">
          <ArrowUpRight
            className="h-4 w-4"
            onClick={() => navigate("/dashboard/marketplace")}
          />
        </button>
      </div>
      <div className="grid grid-cols-2 w-full px-1 gap-2 overflow-visible">
        {products && products.length > 0 ? (
          products.slice(0, 2).map((f) => (
            <div
              className="w-full flex flex-col items-center p-2 border border-[#ECEEF2] rounded-xl gap-2 bg-white"
              style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="w-full h-[83px]">
                <img
                  src={f?.image}
                  alt="directory Icon"
                  className="h-full w-full"
                />
              </div>
              <div className="w-full flex justify-between items-center gap-2">
                <span className="text-[10px] font-medium text-[#0D0D12] font-poppins">
                  {f?.name}
                </span>
                <span className="text-[10px] font-medium text-[#F07EFF]">
                  {f?.price}
                </span>
              </div>
              <button
                className="w-full rounded-full bg-[#7077FE] py-2 px-[3px] text-[8px] font-semibold text-white"
                onClick={() => navigate("/dashboard/marketplace")}
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-[#667085] py-4">
            No data available
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card
      className="p-4 md:p-5 h-full hover:shadow-lg transition-shadow duration-300"
      onClick={() => navigate("/dashboard/marketplace")}
    >
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
              <img
                src={marketplaceicon}
                alt="directory Icon"
                className="h-10 w-10"
              />
            </span>
            <span className="text-base font-semibold text-[#0F1728] font-poppins">
              MarketPlace
            </span>
          </div>

          <button
            //onClick={onOpen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
          >
            <ArrowUpRight
              className="h-4 w-4"
              onClick={() => navigate("/dashboard/marketplace")}
            />
          </button>
        </div>
        <HeaderDivider />
      </div>

      <div
        className="mt-6 relative flex-1 overflow-hidden min-h-80"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide 1: Suggested Products */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            slideIndex === 0
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {renderTopRatedProductSection(topRated, "Top Rated Products")}
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            slideIndex === 1
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {renderCartProductSection(carted, "Your Cart")}
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            slideIndex === 2
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {renderProductSection(suggested, "Featured Products")}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 pb-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setSlideIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              i === slideIndex ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
            }`}
          />
        ))}
      </div>
    </Card>
  );
}

/* ===========================================================
   7) DIRECTORY (left column, under Best Practices)
   =========================================================== */
type DirectoryItem = {
  name: string | undefined;
  handle: ReactNode;
  avatar: string | undefined;
  id: string | number;
  image: string;
  title: string;
  subtitle: string;
};

export function DirectorySection({
  items,
  title = "Directory",
  onView,
}: {
  items: DirectoryItem[];
  title?: string;
  onView?: (item: DirectoryItem) => void;
}) {
  const navigate = useNavigate();
  return (
    <Card className="p-4 md:p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img
              src={directoryicon}
              alt="directory Icon"
              className="h-10 w-10"
            />
          </span>
          <span className="text-base font-semibold text-[#0F1728]">
            {title}
          </span>
        </div>

        <button
          //onClick={onOpen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] text-[#5E6573] hover:bg-[#EEF0F5]"
        >
          <ArrowUpRight
            className="h-4 w-4"
            onClick={() => navigate("/dashboard/DashboardDirectory")}
          />
        </button>
      </div>
      <HeaderDivider />

      {/* List */}
      <div className="mt-3 space-y-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#ECEEF2] bg-white p-3 shadow-sm"
          >
            {/* Left: image + text */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={
                  !it.avatar ||
                  it.avatar === "null" ||
                  it.avatar === "undefined" ||
                  !it.avatar.startsWith("http") ||
                  it.avatar === "http://localhost:5026/file/"
                    ? "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop"
                    : it.avatar
                }
                alt={it.name}
                className="h-12 w-12 rounded-xl object-cover"
              />

              <div className="min-w-0">
                <div className="font-poppins font-semibold text-[16px] sm:text-[18px] leading-[120%] text-[#0F1728] truncate">
                  {it.name}
                </div>
                <div className="font-opensans text-[14px] sm:text-[16px] leading-[140%] text-[#667085] truncate">
                  {it.handle}
                </div>
              </div>
            </div>

            {/* Right: button */}
            <button
              onClick={() => onView?.(it)}
              className={`w-full sm:w-[127px] h-[35px] rounded-full px-4 pt-1 text-center font-opensans text-[14px] text-white flex items-center justify-center ${GRADIENT}`}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

type LearningLabItem = {
  name: string | undefined;
  id: string | number;
  image: string;
  title: string;
  progress: number;
  status: "completed" | "resume" | "locked";
  gradient?: string;
};

export function LearningLabSection({
  items,
  title = "Learning Lab",
}: {
  items: LearningLabItem[];
  title?: string;
  onView?: (item: LearningLabItem) => void;
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="absolute top-2 right-1 flex items-center gap-2 px-2 py-1 rounded-full bg-[#B4B7FF] backdrop-blur-sm">
            <img
              src={completed}
              alt={completed}
              className="h-3 w-3"
            />
            <span className="text-xs font-medium text-white">Completed</span>
          </div>
        );
      case "resume":
        return (
          <div className="absolute top-2 right-1 flex items-center gap-2 px-2 py-1 rounded-full bg-[#F3CCF3] backdrop-blur-sm">
            <img src={resume} alt={resume} className="h-3 w-3" />
            <span className="text-xs font-medium text-white">In progress</span>
          </div>
        );
      case "locked":
        return null;
      default:
        return null;
    }
  };

  const getActionButton = (item: LearningLabItem) => {
    if (item.status === "resume") {
      return (
        <button className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#897AFF] text-white font-normal font-opensans text-[14px] cursor-not-allowed flex items-center justify-center">
          Resume
        </button>
      );
    }

    if (item.status === "locked") {
      return (
        <button className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#FF708A] text-white font-opensans text-[14px] cursor-not-allowed flex items-center justify-center gap-2">
          <img src={lock} alt={lock} className="h-3 w-3" />
          Locked
        </button>
      );
    }

    return null;
  };

  return (
    <Card className="flex flex-col p-4 md:p-5 h-full gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-start gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
            <img
              src={learninglabicon}
              alt="directory Icon"
              className="h-10 w-10"
            />
          </span>
          <span className="text-base font-semibold text-[#0F1728]">
            {title}
          </span>
        </div>
        <HeaderDivider />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[11px]">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col px-3 pt-3 pb-6 rounded-2xl border border-[#ECEEF2] ${
              item?.status === "locked" ? "bg-[#F7F7F7]" : "bg-white "
            } overflow-hidden transition-all hover:shadow-md`}
          >
            {/* Image with status badge */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover rounded-lg"
              />
              {getStatusBadge(item.status)}
            </div>

            {/* Content */}
            <div className="pt-3 flex flex-col gap-3 flex-1">
              <div className="flex items-center space-x-1">
                <Progress value={item.progress} gradient={item?.gradient} />
                <div className="flex justify-end">
                  <span
                    className={`text-[12px] font-medium ${
                      item.status === "completed"
                        ? "text-[#F07EFF]"
                        : "text-[#667085]"
                    } `}
                  >
                    {item.progress}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="pt-2 font-poppins font-medium text-base leading-[120%] text-[#0F1728] mb-2">
                  {item.name}
                </div>
                <div>{getActionButton(item)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
