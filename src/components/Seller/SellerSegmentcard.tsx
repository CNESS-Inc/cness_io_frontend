import React, { useEffect, useState, type ReactNode } from "react";
import {
  //ChevronRight,

  Search as SearchIcon,
  Lightbulb,
  X,
  Bell,
  Plus,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import profileicon from "../../assets/profileicon.svg";
import bpicon from "../../assets/bpicon.svg";
import certicon from "../../assets/certificationicon.svg";
import directoryicon from "../../assets/directoryicon.svg";
import friendsicon from "../../assets/friendsicon.svg";
import socialicon from "../../assets/socialprofileicon.svg";
import postinsight from "../../assets/post-insights-badge.svg";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  DashboardDetails,
  GetAllFormDetails,
  GetAllPlanDetails,
  GetSubDomainDetails,
  GetUserNotification,
  MeDetails,
  PaymentDetails,
  SendBpFollowRequest,
  submitOrganizationDetails,
  submitPersonDetails,
} from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { iconMap } from "../../assets/icons";
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
}: {
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

function Progress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F5]">
        <div className={`h-full ${GRADIENT}`} style={{ width: `${v}%` }} />
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
  onCloseSuggestion,
}: {
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
  const [user, setUser] = useState<any | null>(null);
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
        console.log("🚀 ~ Login ~ setErrors:", setErrors);
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
  const closeModal = async () => {
    setActiveModal(null);
    await fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      const response: any = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
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

  const completedStep = localStorage.getItem("completed_step");
  const is_disqualify = localStorage.getItem("is_disqualify");

  const openRetakeAssesmentModal = async () => {
    console.log("1");
    try {
      console.log("2");
      const personOrganization = localStorage.getItem("person_organization");
      console.log("personOrganization", personOrganization);
      if (personOrganization === "2") {
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

  return (
    <>
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <h1 className="text-[26px] md:text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em]">
            Hello, <span className="text-[#7077FE]">{name}</span>
          </h1>
          <p className="mt-1 text-xs md:text-sm text-[#242424]">
            Welcome to your CNESS Dashboard
          </p>
        </div>

        <div className="col-span-12 lg:col-span-4 flex items-start lg:justify-end justify-start">
          {completedStep !== "2" && (
            <div className="mx-5 bg-[rgba(255,204,0,0.05)] text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                {is_disqualify === "true" ? (
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
                ) : (
                  <>
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full">
                      <Lightbulb
                        className="h-4 w-4"
                        stroke="#FFCC00"
                        fill="#FFCC00"
                      />
                    </span>
                    <div>
                      <span className="text-[12px] font-medium text-black leading-[0%] tracking-[0%] font-poppins">
                        To start the certification journey into our platform,
                        please complete the payment here.{" "}
                      </span>
                      <a
                        href="#"
                        className="text-blue-600 text-[12px] underline"
                        onClick={(e) => {
                          e.preventDefault();
                          openPricingModal();
                        }}
                      >
                        Click here
                      </a>
                    </div>
                    <button
                      aria-label="Dismiss"
                      onClick={onCloseSuggestion}
                      className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-[#7A5A00]/70 hover:bg-white/50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
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
      <Modal isOpen={activeModal === "organization"} onClose={closeModal}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
          {" "}
          {/* Ensures center + padding on small screens */}
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
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-3xl font-semibold shadow-md">
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
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
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
            <div className="hidden lg:flex bg-gradient-to-br from-[#EDCDFD] via-[#9785FF] to-[#72DBF2]  w-full lg:w-[40%] flex-col items-center justify-center text-center p-10">
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
                rounded-[12px]
                border-[0.82px]
                p-[12px] mt-2 ${
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
                rounded-[12px]
                border-[0.82px]
                p-[12px] mt-2 ${
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
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3 flex-shrink-0 peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-[#7077FE] peer-checked:to-[#F07EFF] hover:from-[#F07EFF] hover:to-[#F07EFF] transition-all duration-300"
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
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white text-xs px-2 py-1 rounded-bl rounded-tr z-10">
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
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF] mb-4">
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
  title = "True Profile Created",
  description = "Your profile is now complete with all the essential details added. This allows us to customize your experience!",
  completion = 100,
  avatar,
  onUpdateProfile,
  onOpen,
}: {
  title?: string;
  avatar?: string;
  description?: string;
  completion?: number;
  onUpdateProfile?: () => void;
  onOpen?: () => void;
}) {
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
          onClick={onOpen}
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
          <div className="relative w-[92px] h-[92px] sm:w-[108px] sm:h-[108px] rounded-full p-[3px] bg-gradient-to-r from-[#9747FF] to-[#F07EFF]">
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
          <h3 className="font-opensans font-semibold text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] sm:leading-[28px] md:leading-[32px] text-[#222224]">
            {title}
          </h3>

          <p className="mt-2 font-opensans font-light text-[13px] sm:text-[14px] md:text-[16px] leading-[150%] text-[#242424]">
            {description}
          </p>

          <button
            onClick={onUpdateProfile}
            className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-[40px] items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
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
  progress = 82,
  onContinue,
  description = `You've successfully achieved Inspired certification and are currently working towards Inspired level. Complete the remaining requirements to unlock your next milestone.`,
  activeLevel,
  auto = true,
  intervalMs = 6000,
  upgradeText = "To achieve the next level certification, you need to create a basic profile that includes selling your reactions, accessing the community, and utilizing the resources library.",
  onUpgrade,
}: {
  progress?: number;
  onContinue?: () => void;
  description?: string;
  activeLevel?: string;
  onOpen?: () => void;
  auto?: boolean;
  intervalMs?: number;
  upgradeTitle?: string;
  upgradeText?: string;
  upgradeCtaLabel?: string;
  onUpgrade?: () => void;
}) {
  console.log("🚀 ~ CertificationCard ~ activeLevel:", activeLevel);
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

  const handleUpgradeClick = (activeLevel?: string) => {
    if (!activeLevel) {
      setShowInterestModal(true);
    } else if (activeLevel === "Aspiring") {
      navigate("/dashboard/assesment");
    } else if (activeLevel === "Inspired") {
      navigate("/dashboard/upgrade-badge");
    } else {
      onUpgrade?.();
    }
  };

  const dotCls = (on: boolean) =>
    `h-1.5 w-1.5 rounded-full ${
      on ? "bg-[#7E5FFF]" : "bg-[#D8D6FF]"
    } transition-colors`;

  return (
    <>
      <Card className="rounded-[12px] border border-[#E5E7EB] px-4 md:px-[18px] py-5 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onContinue}
              className="relative w-full sm:w-[194px] h-[40px] rounded-full px-5 py-[10px] flex items-center justify-center text-center font-[600] text-[14px] text-[#222224] font-['Open_Sans'] leading-[100%] bg-white"
            >
              <span className="relative z-10">Continue Assessment</span>
              <span className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-[#9747FF] to-[#F07EFF]"></span>
              <span className="absolute inset-[1px] rounded-full bg-white"></span>
            </button>
          </div>
        </div>
        <HeaderDivider />

        {/* Progress */}
        {progress < 100 && (
          <div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[22px] sm:text-[24px] font-semibold font-['Open_Sans'] leading-[32px] text-[#222224]">
                {progress}%
              </span>
            </div>
            
            <div>
              <Progress value={progress} />
            </div>
          </div>
        )}
        <p className="mt-4 text-[14px] sm:text-[16px] font-normal font-['Open_Sans'] leading-[140%] text-[#999999]">
          {description}
        </p>

        {/* Slides container */}
        <div className="mt-4">
          <div
            className="relative min-h-[450px] sm:min-h-[300px] md:min-h-[270px] rounded-[22px] border border-[#EFE8FF] bg-gradient-to-r from-[#F6F2FF] via-[#FAF0FF] to-[#FFF1F8] p-4 sm:p-6 overflow-hidden"
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
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-[2px] ${
                    activeLevel === "Aspiring"
                      ? "bg-gradient-to-r from-[#7077FE] to-[#F07EFF]"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="w-full h-full rounded-[16px] bg-white flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4">
                    <img
                      src="https://cdn.cness.io/aspiring.webp"
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
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-[2px] ${
                    activeLevel === "Inspired"
                      ? "bg-gradient-to-r from-[#7077FE] to-[#F07EFF]"
                      : "bg-[#E5E7EB]"
                  }`}
                >
                  <div className="w-full h-full rounded-[16px] bg-white flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4">
                    <img
                      src="https://cdn.cness.io/inspired.webp"
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
                  className={`w-full h-[120px] sm:h-[150px] rounded-[18px] p-[2px] ${
                    activeLevel === "Leader"
                      ? "border-2 border-transparent bg-clip-padding bg-white relative before:absolute before:inset-0 before:rounded-[18px] before:p-[2px] before:bg-gradient-to-r before:from-[#7077FE] before:to-[#F07EFF] before:-z-10"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <div className="w-full h-full rounded-[16px] bg-white flex flex-col items-center justify-center gap-[10px] sm:gap-[12px] px-4 py-4">
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
                            ? "https://cdn.cness.io/inspired.webp"
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
                        className="mt-4 sm:mt-5 inline-flex w-full sm:w-auto min-w-[140px] h-10 sm:h-[40px] items-center justify-center gap-[7px] rounded-full bg-[#7077FE] px-5 sm:px-6 font-opensans text-[13px] sm:text-[14px] leading-[100%] text-white shadow hover:bg-[#5A61E8] transition"
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
        <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white to-transparent" />

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
              className="snap-start flex-shrink-0 w-[332px] h-[317px] rounded-[12px] border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3 cursor-pointer"
            >
              {/* Image */}
              <div className="h-[135px] rounded-[8px] overflow-hidden">
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
                <p className="mt-3 font-opensans text-[14px] leading-[150%] text-[#667085] line-clamp-2">
                  {bp.description}
                </p>
                {bp.if_following ? (
                  <button
                    className="mt-auto w-full h-[37px] rounded-full bg-[#F396FF] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowPost(bp.id);
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow hover:bg-[#5A61E8] transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollowPost(bp.id);
                    }}
                  >
                    Follow
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
            className="flex-shrink-0 w-[332px] h-[317px] rounded-[12px] border border-[#ECEEF2] bg-white p-3 flex flex-col gap-3 cursor-pointer"
          >
            <div className="h-[135px] rounded-[8px] overflow-hidden">
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
              <p className="mt-3 font-opensans text-[16px] leading-[150%] text-[#667085] line-clamp-2">
                {bp.description}
              </p>
              {bp.if_following ? (
                <button
                  className="mt-auto w-full h-[37px] rounded-full bg-[#F396FF] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowPost(bp.id);
                  }}
                >
                  Following
                </button>
              ) : (
                <button
                  className="mt-auto w-full h-[37px] rounded-full bg-[#7077FE] px-3 py-2
                             font-opensans text-[14px] font-semibold text-white
                             shadow hover:bg-[#5A61E8] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowPost(bp.id);
                  }}
                >
                  Follow
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
  onConnect,
}: {
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

  suggested: {
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
            className="w-9 h-[46px] md:w-[43px] md:h-[56px] p-[2px] rounded-[4px] bg-white/95 shadow"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full rounded-[2px] object-cover"
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

    const getNotification = async () => {
      try {
        const res = await GetUserNotification();

        if (res?.data?.data) {
          // Get first 10 notifications from the API response
          const firstTenNotifications = res.data.data.slice(0, 3);
          setNotifications(firstTenNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    useEffect(() => {
      getNotification();
    }, []);

    /* ---------- helpers ---------- */

    const InsightsCard = () => (
      <div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
        {/* badge */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#A996FF]">
          <img src={postinsight} alt="post" className="w-10 h-10" />
        </div>

        <h3 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
          Post Insights
        </h3>
        <p className=" mt-2 max-w-[32rem] mx-auto text-[12px] leading-[100%] text-[#667085] font-[400] text-center font-['Open_Sans']">
          {s.text /* e.g. "Posted on May 10,2024" */}
        </p>

        {/* white stat card */}
        <div className="mt-2 rounded-2xl border border-[#EEF0F5] bg-white p-5 shadow-sm">
          {/* Account Reached */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
                Account Reached
              </div>
              <div className="mt-2 text-[18px] font-semibold text-[#F07EFF]">
                {Intl.NumberFormat().format(resonating)}
              </div>
            </div>

            {/* dot chart (pink) */}
            <div className="flex flex-row items-end gap-1 mt-2 sm:mt-0">
              {/* Column 1 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 2 (5 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 3 (3 dots - peak) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>

              {/* Column 4 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#F07EFF]" />
                ))}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-[#E9EDF3]" />

          {/* Followers */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <div className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
                Followers
              </div>
              <div className="mt-2 text-[18px] font-semibold text-[#8B7CFF]">
                +{Intl.NumberFormat().format(resonators)}
              </div>
            </div>

            {/* dot chart (purple) */}
            <div className="flex flex-row items-end gap-1 mt-2 sm:mt-0">
              {/* Column 1 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 2 (5 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 3 (3 dots - peak) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>

              {/* Column 4 (4 dots) */}
              <div className="flex flex-col gap-1 justify-end">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-[#8B7CFF]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    const NotificationsCard = ({ notifications }: { notifications: any[] }) => {
      return (
        <div className="row-start-1 relative z-10 place-self-center w-full max-w-[620px]">
          {/* header */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7E9FF]">
              <Bell className="h-4 w-4 text-[#B255FF]" />
            </div>
            <h3 className="font-poppins font-semibold text-[20px] leading-[32.3px] tracking-[0.15px] text-center text-[#0F1728]">
              Notification
            </h3>
          </div>

          {/* rows */}
          <div className="mt-2 space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-[#EEF0F5] bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      item?.sender_profile?.profile_picture
                        ? item?.sender_profile?.profile_picture
                        : `https://i.pravatar.cc/56?u=${item.sender_id}`
                    }
                    className="h-11 w-11 rounded-full object-cover"
                    alt=""
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
          <button
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full text-white text-[14px] font-semibold bg-[linear-gradient(90deg,#7077FE_0%,#9747FF_60%,#F07EFF_100%)] shadow"
            onClick={() => navigate("/dashboard/notification")}
          >
            View all Notification
          </button>
        </div>
      );
    };

    /* ---------- render ---------- */
    const edgePad = idx === 0 ? "px-3 sm:px-14 md:px-16" : "";
    return (
      <>
        <div
          className="relative
             h-auto min-h-[320px] sm:h-[360px]
             rounded-[12px] border border-[#ECEEF2]
             px-[12px] py-[18px]
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
                <h4 className="font-poppins font-semibold text-[#0F1728] text-center text-[20px] leading-[28px] break-words">
                  <MobileBreakTitle text={s.title} afterWords={3} />
                </h4>
                <p
                  className="mt-2 text-[#667085] text-[12px] sm:text-[12px] md:text-[13px]
                  leading-[150%] font-[400] font-['Open_Sans']
                  text-center whitespace-normal break-words
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
    px-[12px] pr-[8px]
    whitespace-nowrap shrink-0
    !justify-center     /* use !justify-between if you add an icon */
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
    px-[12px] pr-[8px]
    whitespace-nowrap shrink-0
    !justify-center
    text-[12px]
  "
                    onClick={onSecondary}
                  >
                    {s.secondaryLabel ?? "View Feed"}
                  </OutlinePill>
                </div>
              </div>
            ) : idx === 1 ? (
              <InsightsCard />
            ) : (
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

      {/* Search */}
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
      </div>

      {/* ===== Section 1: Profile preview ===== */}
      <div className=" mt-4 h-[290px] rounded-xl border border-[#ECEEF2] p-3 flex flex-col gap-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]">
        {/* Cover */}
        <img
          src={coverUrl}
          alt=""
          className="h-[149px] w-full rounded-[12px] object-cover"
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
            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-poppins font-medium text-[16px] md:text-[18px] leading-[24px] text-[#222224] truncate">
                  {name}
                </div>
                <div className="font-opensans text-[14px] text-[#222224]/50 truncate">
                  @{handle}
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col sm:flex-row xl:flex-col 2xl:flex-row items-start sm:gap-4 xl:gap-0 2xl:gap-4 text-[14px] text-right">
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
             px-[24px] py-[12px] 
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
          {
            title: "Post Insights",
            text: "Posted on May 10,2024",
            primaryLabel: "Create Post",
            secondaryLabel: "Open Feed",
          },
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
        className="h-[393px] rounded-[12px] border border-[#ECEEF2] 
             px-[12px] py-[18px] flex flex-col gap-[18px] shadow-[0_4px_10px_0_rgba(0,0,0,0.04)] "
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
              width: "calc(50% - 8px)", // 8px = p-1*2
              left: tab === "Suggested" ? 4 : "calc(50% + 4px)", // slide left/right
            }}
          />

          {/* buttons */}
          <button
            role="tab"
            aria-selected={tab === "Suggested"}
            onClick={() => setTab("Suggested")}
            className={`relative z-10 h-8 text-center text-sm font-semibold rounded-full transition-colors ${
              tab === "Suggested" ? "text-white" : "text-[#222224]"
            }`}
          >
            Suggested
          </button>

          <button
            role="tab"
            aria-selected={tab === "Requested"}
            onClick={() => setTab("Requested")}
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
            list.slice(0, 4).map((f) => (
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
                <OutlinePill
                  className="h-9 px-3"
                  onClick={() => onConnect?.(f)}
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </OutlinePill>
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
          onClick={() => navigate("/dashboard/MyConnection")}
        >
          See More{" "}
        </PrimaryButton>
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
    <Card className="p-4 md:p-5">
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
          <span className="text-sm font-semibold text-[#0F1728]">{title}</span>
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
