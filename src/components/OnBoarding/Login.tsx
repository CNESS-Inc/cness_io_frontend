import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal";
//import SignupAnimation from "../components/ui/SignupAnimation"; // adjust path
import { useEffect, useState, type FormEvent } from "react";
import {
  AccountDetails,
  ForgotPasswordDetails,
  GetAllFormDetails,
  GetSubDomainDetails,
  LoginDetails,
  MeDetails,
  PaymentDetails,
  submitOrganizationDetails,
  submitPersonDetails,
  GoogleLoginDetails,
} from "../../Common/ServerAPI";
import Button from "../../components/ui/Button";
//import { Link } from "react-router-dom";
import { useToast } from "../../components/ui/Toast/ToastProvider";
import { useGoogleLogin } from "@react-oauth/google";
import PopupOnboardingModal from "../ui/OnBoardingModel";
import { Check } from "lucide-react";
import SignupModel from "../OnBoarding/Signup";

import { FiMail, FiEye, FiEyeOff } from "react-icons/fi"; // add if not already

import Select from "react-select";
//import Fcopyright from "../../layout/Header/Fcopyright";

interface SubDomain {
  id: string;
  name: string;
}
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

interface Interest {
  id: string | number;
  name: string;
}

interface Profession {
  id: string | number;
  title: string; // Changed from 'name' to 'title' to match your usage
}

interface PersonForm {
  first_name: string;
  last_name: string;
  interests: (string | number)[];
  professions: (string | number)[];
  custom_profession?: string;
  // question: QuestionAnswer[];
}
// type PartialOrganizationFormData = Partial<OrganizationForm>;

interface AuthResponse {
  success: any;
  data: {
    data: {
      jwt: string;
      user: {
        id: number;
        person_organization_complete: any;
        completed_step: any;
        [key: string]: any;
      };
    };
  };
}
interface QuestionAnswer {
  question_id: string;
  answer: string;
}

interface AccountFormData {
  person_organization_complete: 1 | 2;
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

type Props = { open: boolean; onClose: () => void };

export default function Login({ open = true, onClose = () => {} }: Props) {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  const [, setAuthenticated] = useState<boolean>(
    localStorage.getItem("authenticated") === "true"
  );
  const [openSignup, setOpenSignup] = useState(false);
  const [orgFormStep, setOrgFormStep] = useState(1); // 1 = Basic Info, 2 = Questions
  const closeByKey = (key: typeof activeModal) =>
    setActiveModal((curr) => (curr === key ? null : curr));

  const [activeModal, setActiveModal] = useState<
    | "type"
    | "organization"
    | "person"
    | "personPricing"
    | "organizationPricing"
    | "forgotpassword"
    | "success"
    | "disqualify"
    | null
  >(null);
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
    // question: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subDomain, setsubDomain] = useState<SubDomain[] | null>();
  const [isAnnual, setIsAnnual] = useState(true);
  const [personPricing, setPersonPricing] = useState<PersPricingPlan[]>([]);
  const [organizationpricingPlans, setorganizationpricingPlans] = useState<
    OrgPricingPlan[]
  >([]);
  const [domains, setDomains] = useState([]);
  const [interest, setInterest] = useState<Interest[]>([]);
  const [profession, setProfession] = useState<Profession[]>([]);
  const [revenue, setRevenue] = useState([]);
  const [OrganizationSize, setOrganizationSize] = useState([]);
  const [readlineQuestion, setReadlineQuestion] = useState([]);

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [organizationErrors, setOrganizationErrors] = useState<FormErrors>({});
  const [personErrors, setPersonErrors] = useState<FormErrors>({});
  const [resetPasswordErrors] = useState<FormErrors>({});
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isOrgFormSubmitted, setIsOrgFormSubmitted] = useState(false);
  const { showToast } = useToast();

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";
    return undefined;
  };
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (activeModal) {
      setShowLogin(false); // Hide Login when any modal is open
    } else {
      setShowLogin(true); // Show Login when all modals are closed
    }
  }, [activeModal]);

  useEffect(() => {
    if (location.state?.autoGoogleLogin) {
      login(); // Trigger Google login automatically
      // Clear the state to prevent retriggering on refresh
      // window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

    if (name === "password") {
      return validatePassword(value);
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
    formType: "login" | "organization" | "person" | "forgotpassword",
    step?: number,
    setErrors?: boolean
  ): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (formType === "login") {
      const emailError = validateField("email", formData.email, {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }

      const passwordError = validateField("password", formData.password, {
        required: true,
        minLength: 6,
      });
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }

      setLoginErrors(newErrors);
    }

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

    // In the validateForm function, update the "person" section:
    if (formType === "person") {
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

      if (setErrors) {
        setPersonErrors(newErrors);
      }
      return isValid;
    }

    if (formType === "forgotpassword") {
      const emailError = validateField("email", formData.email, {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }
    }

    return isValid;
  };

  const handleNextClick = () => {
    // Only validate step 1 fields when clicking next
    const isValid = validateForm(organizationForm, "organization", 1, true);

    if (isValid) {
      setOrgFormStep(2);
      setOrganizationErrors({});
    }
  };
  // const handleNextPersonClick = () => {
  //   // Only validate step 1 fields when clicking next
  //   const isValid = validateForm(personForm, "person", 1, true);

  //   if (isValid) {
  //     setPersonFormStep(2);
  //     setOrganizationErrors({});
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const formData = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    if (!validateForm(formData, "login")) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { email, password };
      const response = (await LoginDetails(payload)) as AuthResponse;

      if (response) {
        setAuthenticated(true);
        setApiMessage(response?.success?.message || "Login successful");
        setIsSubmitting(false);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("jwt", response?.data?.data?.jwt);
        localStorage.setItem("isAdult", response?.data?.data?.user?.is_adult);
        localStorage.setItem(
          "is_disqualify",
          response?.data?.data?.user?.is_disqualify
        );
        localStorage.setItem(
          "person_organization",
          response?.data?.data?.user.person_organization_complete
        );
        localStorage.setItem("Id", response?.data?.data?.user.id.toString());
        localStorage.setItem(
          "completed_step",
          response?.data?.data?.user.completed_step
        );
        localStorage.setItem(
          "profile_picture",
          response?.data?.data?.user.profile_picture
        );
        localStorage.setItem("name", response?.data?.data?.user.name);
        localStorage.setItem("karma_credits", response?.data?.data?.user?.karma_credits || 0);
        localStorage.setItem("main_name", response?.data?.data?.user.main_name);
        localStorage.setItem(
          "margaret_name",
          response?.data?.data?.user.margaret_name
        );
        const myReferralCode = response?.data?.data?.user.my_referral_code;
        if (myReferralCode) {
          localStorage.setItem(
            "referral_code",
            response?.data?.data?.user.my_referral_code
          );
        }
        const completed_step = response.data.data.user.completed_step;
        const is_disqualify = response.data.data.user.is_disqualify;

        const res = await MeDetails();
        localStorage.setItem(
          "profile_picture",
          res?.data?.data?.user.profile_picture
        );
        localStorage.setItem("name", res?.data?.data?.user.name);
        localStorage.setItem("main_name", res?.data?.data?.user.main_name);
        localStorage.setItem(
          "margaret_name",
          res?.data?.data?.user.margaret_name
        );

        //   if (!is_disqualify) {
        //     if (completionStatus === 0 || completed_step === 0) {
        //       setActiveModal("type");
        //     } else if (completionStatus === 1) {
        //       if (completed_step === 0) {
        //         setActiveModal("person");
        //       } else if (completed_step === 1) {
        //         // const res = await GetAllPlanDetails();
        //         // const plansByRange: Record<string, any> = {};
        //         // res?.data?.data?.forEach((plan: any) => {
        //         //   if (!plansByRange[plan.plan_range]) {
        //         //     plansByRange[plan.plan_range] = {};
        //         //   }
        //         //   plansByRange[plan.plan_range][plan.plan_type] = plan;
        //         // });
        //         // const updatedPlans = Object.values(plansByRange)?.map(
        //         //   (planGroup: any) => {
        //         //     const monthlyPlan = planGroup.monthly;
        //         //     const yearlyPlan = planGroup.yearly;

        //         //     return {
        //         //       id: monthlyPlan?.id || yearlyPlan?.id,
        //         //       title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
        //         //       description: "Customized pricing based on your selection",
        //         //       monthlyPrice: monthlyPlan
        //         //         ? `$${monthlyPlan.amount}`
        //         //         : undefined,
        //         //       yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
        //         //       period: isAnnual ? "/year" : "/month",
        //         //       billingNote: yearlyPlan
        //         //         ? isAnnual
        //         //           ? `billed annually ($${yearlyPlan.amount})`
        //         //           : `or $${monthlyPlan?.amount}/month`
        //         //         : undefined,
        //         //       features: [], // Add any features you need here
        //         //       buttonText: "Get Started",
        //         //       buttonClass: yearlyPlan
        //         //         ? ""
        //         //         : "bg-gray-100 text-gray-800 hover:bg-gray-200",
        //         //       borderClass: yearlyPlan
        //         //         ? "border-2 border-[#F07EFF]"
        //         //         : "border",
        //         //       popular: !!yearlyPlan,
        //         //     };
        //         //   }
        //         // );
        //         // setPersonPricing(updatedPlans);
        //         // setActiveModal("personPricing");
        //         navigate("/dashboard");
        //       } else {
        //         navigate("/dashboard");
        //       }
        //     } else if (completionStatus === 2) {
        //       if (completed_step === 0) {
        //         setActiveModal("organization");
        //       } else if (completed_step === 1) {
        //         // const res = await GetAllPlanDetails();
        //         // const plansByRange: Record<string, any> = {};
        //         // res?.data?.data?.forEach((plan: any) => {
        //         //   if (!plansByRange[plan.plan_range]) {
        //         //     plansByRange[plan.plan_range] = {};
        //         //   }
        //         //   plansByRange[plan.plan_range][plan.plan_type] = plan;
        //         // });
        //         // const updatedPlans = Object.values(plansByRange)?.map(
        //         //   (planGroup: any) => {
        //         //     const monthlyPlan = planGroup.monthly;
        //         //     const yearlyPlan = planGroup.yearly;

        //         //     return {
        //         //       id: monthlyPlan?.id || yearlyPlan?.id,
        //         //       title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
        //         //       description: "Customized pricing based on your selection",
        //         //       monthlyPrice: monthlyPlan
        //         //         ? `$${monthlyPlan.amount}`
        //         //         : undefined,
        //         //       yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
        //         //       period: isAnnual ? "/year" : "/month",
        //         //       billingNote: yearlyPlan
        //         //         ? isAnnual
        //         //           ? `billed annually ($${yearlyPlan.amount})`
        //         //           : `or $${monthlyPlan?.amount}/month`
        //         //         : undefined,
        //         //       features: [], // Add any features you need here
        //         //       buttonText: "Get Started",
        //         //       buttonClass: yearlyPlan
        //         //         ? ""
        //         //         : "bg-gray-100 text-gray-800 hover:bg-gray-200",
        //         //       borderClass: yearlyPlan
        //         //         ? "border-2 border-[#F07EFF]"
        //         //         : "border",
        //         //       popular: !!yearlyPlan,
        //         //     };
        //         //   }
        //         // );
        //         // setorganizationpricingPlans(updatedPlans);
        //         // setActiveModal("organizationPricing");
        //         navigate("/dashboard");
        //       } else {
        //         navigate("/dashboard");
        //       }
        //     }
        //   } else {
        //     navigate("/dashboard");
        //   }
        // } else {
        //   setIsSubmitting(false);
        //   setApiMessage("Login failed");
        // }
        if (!is_disqualify) {
          // Skip type selection and directly set to Person (1)
          await handleTypeSelection(1);

          if (completed_step === 0) {
            // This will now directly open the person form
            setActiveModal("person");
          } else if (completed_step === 1) {
            navigate("/dashboard");
          } else if (completed_step === 2) {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        setIsSubmitting(false);
        setApiMessage("Login failed");
      }
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setIsSubmitting(false);
        const serverErrors = error.response.data.error;
        const formattedErrors: FormErrors = {};

        if (serverErrors.username) {
          formattedErrors.username = serverErrors.username.join(", ");
        }
        if (serverErrors.email) {
          formattedErrors.email = serverErrors.email.join(", ");
        }
        if (serverErrors.password) {
          formattedErrors.password = serverErrors.password.join(", ");
        }
        setApiMessage(serverErrors.message);
      } else {
        setApiMessage(error.message || "An error occurred during login");
      }
    }
  };

  const handleTypeSelection = async (type: 1 | 2) => {
    try {
      const payload: AccountFormData = {
        person_organization_complete: type,
      };

      const response = await AccountDetails(payload);
      console.log("🚀 ~ handleTypeSelection ~ response:", response);

      // Handle successful response
      if (type === 2) {
        setActiveModal("organization");
      } else if (type === 1) {
        setActiveModal("person");
      } else {
        setActiveModal(null);
        // navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error setting account type:", error);
    }
  };

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

    // Remove step parameter from validation
    if (!validateForm(personForm, "person", 1, true)) {
      setIsSubmitting(false);
      return;
    }

    // Rest of your handlePersonSubmit function remains the same...
    try {
      const payload = {
        ...personForm,
        professions: personForm.professions.includes("other")
          ? [
              ...personForm.professions.filter((p) => p !== "other"),
              personForm.custom_profession,
            ]
          : personForm.professions,
      };

      const res = await submitPersonDetails(payload);
      

      if (res?.success) {
      localStorage.setItem("completed_step", "1");
        // showToast({
        //   message: "Assessment submitted successfully!",
        //   type: "success",
        //   duration: 4000,
        // });
        navigate("/dashboard");
      } else {
        showToast({
          message: res?.data?.message || "Failed to submit assessment.",
          type: "error",
          duration: 4000,
        });
      }
      // ... rest of your code
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
      // const questionId = name.replace("question_", "");
      // setPersonForm((prev) => {
      //   const existingQuestionIndex = prev.question.findIndex(
      //     (q) => q.question_id === questionId
      //   );
      //   if (existingQuestionIndex >= 0) {
      //     const updatedQuestions = [...prev.question];
      //     updatedQuestions[existingQuestionIndex] = {
      //       question_id: questionId,
      //       answer: value,
      //     };
      //     return { ...prev, question: updatedQuestions };
      //   } else {
      //     return {
      //       ...prev,
      //       question: [
      //         ...prev.question,
      //         { question_id: questionId, answer: value },
      //       ],
      //     };
      //   }
      // });
    } else {
      setPersonForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (personPricing.length > 0) {
      const updatedPlans = personPricing?.map((plan: any) => ({
        ...plan,
        price: isAnnual
          ? plan.yearlyPrice || plan.monthlyPrice
          : plan.monthlyPrice,
        period: isAnnual ? "/year" : "/month",
        billingNote: plan.yearlyPrice
          ? isAnnual
            ? `billed annually (${plan.yearlyPrice})`
            : `or ${plan.monthlyPrice}/month`
          : undefined,
      }));
      setPersonPricing(updatedPlans);
    }
  }, [isAnnual]);

  const closeModal = () => {
    setActiveModal(null);
    setApiMessage(null);
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
        console.log("Redirecting to:", url); // Log the actual URL
        window.location.href = url; // Redirect in the same tab
      } else {
        console.error("URL not found in response");
      }
    } catch (error: any) {
      console.error("Error in handlePlanSelection:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const onForgotPassword = () => {
    setApiMessage("");
    setActiveModal("forgotpassword");
  };

  const handleforgot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

    const form = e.currentTarget;
    const email = form.email.value.trim();
    const formData = {
      email: form.email.value.trim(),
    };

    if (!validateForm(formData, "forgotpassword")) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { email };
      const response = (await ForgotPasswordDetails(payload)) as AuthResponse;

      if (response) {
        setApiMessage(response?.success?.message);
        setIsSubmitting(false);
        setActiveModal("success");
      } else {
        setIsSubmitting(false);
        setApiMessage("Forgot Password failed");
      }
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setIsSubmitting(false);
        const serverErrors = error.response.data.error;
        const formattedErrors: FormErrors = {};

        if (serverErrors.username) {
          formattedErrors.username = serverErrors.username.join(", ");
        }
        if (serverErrors.email) {
          formattedErrors.email = serverErrors.email.join(", ");
        }
        if (serverErrors.password) {
          formattedErrors.password = serverErrors.password.join(", ");
        }
        setApiMessage(serverErrors.message);
      } else {
        setApiMessage(error.message || "An error occurred during login");
      }
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    const token = tokenResponse.access_token;

    try {
      const response = await GoogleLoginDetails(token); // ✅ use your centralized API call
      if (response) {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("jwt", response?.data?.data?.jwt);
        localStorage.setItem(
          "is_disqualify",
          response?.data?.data?.user?.is_disqualify
        );
        localStorage.setItem(
          "person_organization",
          response?.data?.data?.user.person_organization_complete
        );
        localStorage.setItem("Id", response?.data?.data?.user.id.toString());
        localStorage.setItem(
          "completed_step",
          response?.data?.data?.user.completed_step
        );
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
        const completionStatus =
          response.data.data.user.person_organization_complete;
        const completed_step = response.data.data.user.completed_step;
        const is_disqualify = response.data.data.user.is_disqualify;

        // Skip type selection and directly set to Person (1)
        await handleTypeSelection(1);

        if (!is_disqualify) {
          if (completionStatus === 0 || completed_step === 0) {
            setActiveModal("person");
          } else if (completionStatus === 1) {
            if (completed_step === 0) {
              setActiveModal("person");
            } else if (completed_step === 2) {
              navigate("/dashboard");
            } else {
              navigate("/dashboard");
            }
          } else if (completionStatus === 2) {
            if (completed_step === 0) {
              setActiveModal("organization");
            } else if (completed_step === 1) {
              navigate("/dashboard");
            } else {
              navigate("/dashboard");
            }
          }
        } else {
          navigate("/dashboard");
        }
      } else {
        showToast({
          message: "Google login succeeded, but no JWT received.",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      showToast({
        message: "Google login failed.",
        type: "error",
        duration: 5000,
      });
    },
  });

  const getBillingNote = (plan: any) => {
    if (!plan.yearlyPrice || !plan.monthlyPrice) return undefined;

    if (isAnnual) {
      // For annual billing: show "billed annually (yearly price)"
      return `billed annually ($${plan.yearlyPrice.replace("$", "") * 12})`;
    } else {
      return `or ${plan.monthlyPrice}/month`;
    }
  };

  if (!open) return null;

  return (
    <>
      {showLogin && (
        <PopupOnboardingModal open={open} onClose={onClose}>
          {/* Sign In Form */}

          <div className="mx-auto w-full max-w-[460px] lg:mt-15 md:mt-15 mt-6 z-50">
            <h1 className="text-center font-[Poppins] font-medium lg:text-[32px] md:text-[32px] text-[28px] leading-[100%] tracking-[-0.03em] text-gray-900">
              Sign in to your account
            </h1>

            <ul className="mt-4 flex justify-center items-center gap-6 text-sm text-gray-600">
              <li className="flex items-center gap-2 font-['Open_Sans'] text-[14px] leading-[100%] text-gray-700">
                <Check className="h-6 w-6 stroke-[3px] text-green-500" />
                <span className="text-center">
                  {" "}
                  Securely access your dashboard anytime, anywhere.
                </span>
              </li>
            </ul>

            {apiMessage && (
              <div
                className={`text-center mb-4 ${
                  apiMessage.includes("Successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {apiMessage}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() => login()}
                  className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-3 font-inter font-medium text-[14px] leading-[20px] text-gray-900">
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Sign in with Google
                  </span>
                </button>

                {/* Divider with "Or sign in with" */}
                {/* Divider */}
                <div className="my-6 flex items-center gap-5 text-[14px] font-['Open_Sans'] text-gray-500">
                  <div className="h-px w-full bg-gray-200" />
                  <span className="whitespace-nowrap">Or sign in with</span>
                  <div className="h-px w-full bg-gray-200" />
                </div>

                <label
                  htmlFor="password"
                  className="block font-poppins font-medium text-[12px] text-[#000000] mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className={`w-full h-[53px] px-[10px] rounded-[2px] border-2 ${
                      loginErrors.email ? "border-red-500" : "border-[#CBD5E1]"
                    } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />

                  <FiMail
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-opacity duration-300 ${
                      emailFocused ? "opacity-100" : "opacity-0"
                    }`}
                    size={18}
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <label
                htmlFor="password"
                className="block font-poppins font-medium text-[12px] text-[#000000] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your Password"
                  className={`w-full h-[53px] px-[10px] rounded-[4px] border-2 ${
                    loginErrors.password ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />

                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </div>
              </div>
              {loginErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {loginErrors.password}
                </p>
              )}

              <div className="flex items-center justify-between text-[13px]">
                <label className="inline-flex items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    className="accent-[#6750A4] w-4 h-4"
                    defaultChecked
                  />
                  <span className="font-poppins font-normal text-[12px] leading-[100%] tracking-[0px] text-[#64748B]">
                    Remember me on this device
                  </span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onForgotPassword();
                  }}
                  className="font-openSans font-semibold
    text-[12px] leading-[24.4px] tracking-[0px]
    text-right align-middle
    bg-gradient-to-r from-[#7077FE] to-[#F07EFF]
    bg-clip-text text-transparent
    hover:underline"
                >
                  Reset password
                </a>
              </div>

              <Button
                type="submit"
                variant="gradient-primary"
                className="mt-1 lg:w-[415px] md:w-[415px] w-full h-[42px] 
    rounded-[81.26px]
    bg-gradient-to-r from-indigo-500 to-fuchsia-500
    px-[19.5px] py-[16px]
    gap-[8.13px]
    text-white
    font-['Plus_Jakarta_Sans'] font-medium
    text-[14px] leading-[100%] tracking-[0px]
    flex items-center justify-center
    shadow-md hover:opacity-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sign In..." : "Sign In"}
              </Button>

              {/* Google & Facebook Icons 
              <div className="flex justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => login()}
                  className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md w-12 h-12 bg-white hover:shadow-md hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#F07EFF]"
                >
                  <img
                    src="/google-icon-logo.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </button>

                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md w-12 h-12 opacity-50 cursor-not-allowed bg-white"
                >
                  <img
                    src="/Facebook_Logo.png"
                    alt="Facebook"
                    className="w-7 h-7"
                  />
                </button>
              </div>
*/}
              <p className="mt-4 text-center font-poppins font-normal text-[13px] leading-[100%] tracking-[0px] text-[#64748B]">
                New to Cness?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setOpenSignup(true);
                  }}
                  className="font-poppins font-semibold text-[13px] leading-[100%] tracking-[0px] text-[#D748EA] underline underline-offset-[2px] decoration-solid hover:opacity-80"
                >
                  Create account
                </button>
              </p>
            </form>
          </div>
        </PopupOnboardingModal>
      )}

      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />

      {/* Type Selection Modal - only shows when activeModal is "type" */}
      <Modal
        isOpen={activeModal === "type"}
        onClose={closeModal}
        modalKey="type"
      >
        <div className=" p-6 rounded-lg relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Select Account Type
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Please choose whether you're signing up as an individual or an
            organization.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              type="submit"
              onClick={() => handleTypeSelection(1)}
              className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
              variant="primary"
              withGradientOverlay
            >
              Person
            </Button>
            <Button
              onClick={() => handleTypeSelection(2)}
              className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
              variant="primary"
              withGradientOverlay
            >
              Organization
            </Button>
          </div>
        </div>
      </Modal>

      {/* Organization Form Modal - only shows when activeModal is "organization" */}
      <Modal
        isOpen={activeModal === "organization"}
        onClose={() => closeByKey("organization")}
        modalKey="organization"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
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
        isOpen={activeModal === "person"}
        onClose={() => closeByKey("person")}
        modalKey="person"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
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
                {/* Single form without steps */}
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
                          label: interest?.find((i: any) => i.id === interestId)
                            ?.name,
                        })) || []
                      }
                      onChange={(selectedOptions) => {
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
                        ...profession?.map((professionItem: Profession) => ({
                          value: professionItem.id,
                          label: professionItem.title,
                        })),
                        { value: "other", label: "Other (please specify)" },
                      ]}
                      value={
                        personForm.professions?.map((professionId: any) => ({
                          value: professionId,
                          label:
                            profession?.find((p: any) => p.id === professionId)
                              ?.title ||
                            (professionId === "other" ? "Other" : ""),
                        })) || []
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

                {/* Form Footer Actions - simplified for single form */}
                <div className="flex justify-end mt-6 gap-3 flex-wrap">
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "personPricing"}
        onClose={() => closeByKey("personPricing")}
        modalKey="personPricing"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
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
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-[#7077FE] to-[#9747FF]"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Annual billing
                  </span>
                </label>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
                >
                  Skip for now, go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "organizationPricing"}
        onClose={() => closeByKey("organizationPricing")}
        modalKey="organizationPricing"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-transparent px-2 sm:px-4 py-4 overflow-y-auto">
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
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
                >
                  Skip for now, go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "forgotpassword"}
        onClose={closeModal}
        modalKey="forgotpassword"
      >
        <div className=" p-6 rounded-lg w-full mx-auto relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Forgot Password
          </h2>
          {apiMessage && (
            <div
              className={`text-center mb-4 ${
                apiMessage.includes("A Forgot Password Email Has Been Sent")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {apiMessage}
            </div>
          )}
          <form onSubmit={handleforgot}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
                className={`w-full px-3 py-2 rounded-[12px] border ${
                  resetPasswordErrors.email
                    ? "border-red-500"
                    : "border-[#CBD5E1]"
                } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
              />
              {resetPasswordErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {resetPasswordErrors.email}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="white-outline"
                size="md"
                onClick={closeModal}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="rounded-[100px] py-3 px-8 self-stretch font-['Plus Jakarta Sans'] font-medium text-sm leading-none flex items-center justify-center text-[#FFFFFF]"
              >
                Forgot Password
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "success"}
        onClose={closeModal}
        modalKey="success"
      >
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF] ">
            <svg
              className="h-30 w-30 text-white "
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
          {apiMessage && (
            <div
              className={`openSans text-center p-4 ${
                apiMessage.includes("A Forgot Password Email Has Been Sent")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {apiMessage}
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={closeModal}
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
            >
              Got it!
            </Button>
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
