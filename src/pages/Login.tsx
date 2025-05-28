import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import SignupAnimation from "../components/ui/SignupAnimation"; // adjust path
import { useEffect, useState, type FormEvent } from "react";
import {
  AccountDetails,
  ForgotPasswordDetails,
  GetAllFormDetails,
  GetSubDomainDetails,
  LoginDetails,
  PaymentDetails,
  submitOrganizationDetails,
  submitPersonDetails,
} from "../Common/ServerAPI";
import Button from "../components/ui/Button";

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
  sub_domain: string;
  employee_size: string;
  revenue: string;
  question: Array<{
    question_id: string;
    answer: string;
  }>;
}
type PartialOrganizationFormData = Partial<OrganizationForm>;

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

export default function Login() {
  const navigate = useNavigate();
  const [, setAuthenticated] = useState<boolean>(
    localStorage.getItem("authenticated") === "true"
  );
  const [activeModal, setActiveModal] = useState<
    | "type"
    | "organization"
    | "person"
    | "personPricing"
    | "organizationPricing"
    | "forgotpassword"
    | "success"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subDomain, setsubDomain] = useState<SubDomain[] | null>();
  const [isAnnual, setIsAnnual] = useState(false);
  const [personPricing, setPersonPricing] = useState<PersPricingPlan[]>([]);
  const [organizationpricingPlans, setorganizationpricingPlans] = useState<
    OrgPricingPlan[]
  >([]);
  const [domains, setDomains] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [OrganizationSize, setOrganizationSize] = useState([]);
  const [readlineQuestion, setReadlineQuestion] = useState([]);

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [organizationErrors, setOrganizationErrors] = useState<FormErrors>({});
  console.log("🚀 ~ organizationErrors:", organizationErrors);
  const [personErrors, setPersonErrors] = useState<FormErrors>({});
  const [resetPasswordErrors] = useState<FormErrors>({});
  const [apiMessage, setApiMessage] = useState<string | null>(null);

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

  const validateField = (
    name: string,
    value: string,
    rules: ValidationRules
  ): string | undefined => {
    if (name === "password") {
      return validatePassword(value);
    }

    if (rules.required && !value.trim()) {
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
    formType: "login" | "organization" | "person" | "forgotpassword"
  ): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    if (formType === "login") {
      // Validate email
      const emailError = validateField("email", formData.email, {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      });
      if (emailError) {
        newErrors.email = emailError;
        isValid = false;
      }

      // Validate password
      const passwordError = validateField("password", formData.password, {
        required: true,
        minLength: 6,
      });
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }

      setLoginErrors(newErrors);
    } else if (formType === "organization") {
      // Validate organization fields
      const requiredFields = [
        "organization_name",
        "domain",
        "sub_domain",
        "employee_size",
        "revenue",
      ];

      requiredFields.forEach((field) => {
        const error = validateField(
          field,
          organizationForm[field as keyof OrganizationForm] as string,
          {
            required: true,
          }
        );
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      // Validate questions
      readlineQuestion.forEach((question: any, index) => {
        const answer =
          organizationForm.question.find(
            (q: QuestionAnswer) => q.question_id === question.id
          )?.answer || "";

        const error = validateField(`question_${index + 1}`, answer, {
          required: true,
        });

        if (error) {
          newErrors[`question_${index + 1}`] = error;
          isValid = false;
        }
      });

      setOrganizationErrors(newErrors);
    } else if (formType === "person") {
      // Validate person questions
      readlineQuestion.forEach((question: any, index) => {
        const answer =
          organizationForm.question.find(
            (q: QuestionAnswer) => q.question_id === question.id
          )?.answer || "";

        const error = validateField(`question_${index + 1}`, answer, {
          required: true,
        });

        if (error) {
          newErrors[`question_${index + 1}`] = error;
          isValid = false;
        }
      });

      setPersonErrors(newErrors);
    } else if (formType === "forgotpassword") {
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

        const completionStatus =
          response.data.data.user.person_organization_complete;
        const completed_step = response.data.data.user.completed_step;
        const is_disqualify = response.data.data.user.is_disqualify;

        if (!is_disqualify) {
          if (completionStatus === 0 || completed_step === 0) {
            setActiveModal("type");
          } else if (completionStatus === 1) {
            if (completed_step === 0) {
              setActiveModal("person");
            } else if (completed_step === 1) {
              // const res = await GetAllPlanDetails();
              // const plansByRange: Record<string, any> = {};
              // res?.data?.data?.forEach((plan: any) => {
              //   if (!plansByRange[plan.plan_range]) {
              //     plansByRange[plan.plan_range] = {};
              //   }
              //   plansByRange[plan.plan_range][plan.plan_type] = plan;
              // });
              // const updatedPlans = Object.values(plansByRange).map(
              //   (planGroup: any) => {
              //     const monthlyPlan = planGroup.monthly;
              //     const yearlyPlan = planGroup.yearly;

              //     return {
              //       id: monthlyPlan?.id || yearlyPlan?.id,
              //       title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
              //       description: "Customized pricing based on your selection",
              //       monthlyPrice: monthlyPlan
              //         ? `$${monthlyPlan.amount}`
              //         : undefined,
              //       yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
              //       period: isAnnual ? "/year" : "/month",
              //       billingNote: yearlyPlan
              //         ? isAnnual
              //           ? `billed annually ($${yearlyPlan.amount})`
              //           : `or $${monthlyPlan?.amount}/month`
              //         : undefined,
              //       features: [], // Add any features you need here
              //       buttonText: "Get Started",
              //       buttonClass: yearlyPlan
              //         ? ""
              //         : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              //       borderClass: yearlyPlan
              //         ? "border-2 border-[#F07EFF]"
              //         : "border",
              //       popular: !!yearlyPlan,
              //     };
              //   }
              // );
              // setPersonPricing(updatedPlans);
              // setActiveModal("personPricing");
              navigate("/dashboard");
            } else {
              navigate("/dashboard");
            }
          } else if (completionStatus === 2) {
            if (completed_step === 0) {
              setActiveModal("organization");
            } else if (completed_step === 1) {
              // const res = await GetAllPlanDetails();
              // const plansByRange: Record<string, any> = {};
              // res?.data?.data?.forEach((plan: any) => {
              //   if (!plansByRange[plan.plan_range]) {
              //     plansByRange[plan.plan_range] = {};
              //   }
              //   plansByRange[plan.plan_range][plan.plan_type] = plan;
              // });
              // const updatedPlans = Object.values(plansByRange).map(
              //   (planGroup: any) => {
              //     const monthlyPlan = planGroup.monthly;
              //     const yearlyPlan = planGroup.yearly;

              //     return {
              //       id: monthlyPlan?.id || yearlyPlan?.id,
              //       title: monthlyPlan?.plan_range || yearlyPlan?.plan_range,
              //       description: "Customized pricing based on your selection",
              //       monthlyPrice: monthlyPlan
              //         ? `$${monthlyPlan.amount}`
              //         : undefined,
              //       yearlyPrice: yearlyPlan ? `$${yearlyPlan.amount}` : undefined,
              //       period: isAnnual ? "/year" : "/month",
              //       billingNote: yearlyPlan
              //         ? isAnnual
              //           ? `billed annually ($${yearlyPlan.amount})`
              //           : `or $${monthlyPlan?.amount}/month`
              //         : undefined,
              //       features: [], // Add any features you need here
              //       buttonText: "Get Started",
              //       buttonClass: yearlyPlan
              //         ? ""
              //         : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              //       borderClass: yearlyPlan
              //         ? "border-2 border-[#F07EFF]"
              //         : "border",
              //       popular: !!yearlyPlan,
              //     };
              //   }
              // );
              // setorganizationpricingPlans(updatedPlans);
              // setActiveModal("organizationPricing");
              navigate("/dashboard");
            } else {
              navigate("/dashboard");
            }
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
      // Handle question answers
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
      }));

      if (name === "domain" && value) {
        try {
          const response = await GetSubDomainDetails(value);
          setsubDomain(response?.data?.data);
        } catch (error) {
          console.error("Error calling API:", error);
        }
      }
    }
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(organizationForm, "organization")) {
      return;
    }

    setIsSubmitting(true);
    console.log(
      "🚀 ~ handleOrganizationSubmit ~ organizationForm:",
      organizationForm
    );
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

        // Create combined plan objects with both monthly and yearly data
        const updatedPlans = Object.values(plansByRange).map(
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

    if (!validateForm(organizationForm, "person")) {
      setIsSubmitting(false);
      return;
    }

    try {
      const question_payload: PartialOrganizationFormData = {
        question: organizationForm.question,
      };
      const res = await submitPersonDetails(question_payload as any);
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

        // Create combined plan objects with both monthly and yearly data
        const updatedPlans = Object.values(plansByRange).map(
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
        navigate("/dashboard");
        localStorage.setItem("is_disqualify", "true");
      }
    } catch (error) {
      console.error("Error submitting organization form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (personPricing.length > 0) {
      const updatedPlans = personPricing.map((plan: any) => ({
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
  };

  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAllFormDetails();
      setDomains((response as any)?.data?.data?.domain);
      setReadlineQuestion(response?.data?.data?.questions);
      setOrganizationSize(response?.data?.data?.organization_size);
      setRevenue(response?.data?.data?.revenue);
    } catch (error) {}
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
    } catch (error) {
      console.error("Error in handlePlanSelection:", error);
    }
  };

  // const onForgotPassword = () => {
  //   setActiveModal("forgotpassword");
  // };

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

  return (
    <>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
        <div className="relative w-full h-[250px]">
          {/* Diagonal Gradient Background */}
          <div className="hidden lg:block absolute top-0 left-0 w-full h-[600px] z-0">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                //background: "linear-gradient(135deg, #7F57FC, #F07EFF, #7FD9F2)",
                clipPath: "polygon(0 0, 100% 0, 100% 40%, 0% 100%)",
              }}
            />
            <SignupAnimation />
          </div>

          <div className="absolute top-40 left-10 z-10">
            <h1 className="text-white text-4xl font-bold">CNESS</h1>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="z-10 w-full flex justify-center items-center px-10 py-5">
          <div className="w-full max-w-[600px] min-h-[550px] bg-white rounded-2xl shadow-xl px-6 sm:px-10 py-10 sm:py-12 space-y-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
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
                    loginErrors.email ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your Password"
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    loginErrors.password ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">
                    Remember me on this device
                  </span>
                </label>
                <a href="#" className="text-[#7F57FC] hover:underline">
                  Trouble logging in? Reset password
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-purple-700 to-blue-600 text-white font-semibold py-2 rounded-full shadow-md transition duration-200 hover:from-blue-500 hover:to-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loging..." : "Login"}
              </button>

              <div className="text-center text-sm text-gray-500">OR</div>

              <p className="text-center text-sm text-gray-600 mt-4">
                New to Cness?{" "}
                <a
                  href="#"
                  className="text-[#7F57FC] font-medium hover:underline"
                >
                  Create account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Type Selection Modal - only shows when activeModal is "type" */}
      <Modal isOpen={activeModal === "type"} onClose={closeModal}>
        <div className=" p-6 rounded-lg z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">
            Select Account Type
          </h2>
          <p className="mb-6 openSans">
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
      <Modal isOpen={activeModal === "organization"} onClose={closeModal}>
        <div className=" p-6 rounded-lg z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">
            Organization Information
          </h2>
          <form onSubmit={handleOrganizationSubmit}>
            {/* Organization Name */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Organization Name*
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
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Domain*
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
              </select>
              {organizationErrors.domain && (
                <p className="mt-1 text-sm text-red-600">
                  {organizationErrors.domain}
                </p>
              )}
            </div>

            {/* Sub Domain */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Sub Domain
              </label>
              <select
                name="sub_domain"
                value={organizationForm.sub_domain}
                onChange={handleOrganizationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <>
                  <option value="">Select Sub domain</option>
                  {subDomain?.map((subdomain: any) => (
                    <option key={subdomain.id} value={subdomain.id}>
                      {subdomain.name}
                    </option>
                  ))}
                </>
              </select>
              {organizationErrors.sub_domain && (
                <p className="mt-1 text-sm text-red-600">
                  {organizationErrors.sub_domain}
                </p>
              )}
            </div>

            {/* Employees Size */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Employees Size*
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
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Revenue*
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

            {/* Questions with options as radio buttons */}
            <div className="space-y-4">
              {readlineQuestion?.map((question: any, index) => {
                const existingAnswer =
                  organizationForm.question.find(
                    (q: QuestionAnswer) => q.question_id === question.id
                  )?.answer || "";

                return (
                  <div key={question.id} className="mb-4">
                    <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                      {question.question}
                    </label>

                    {question.options && question.options.length > 0 ? (
                      <div className="space-y-2">
                        {question.options.map((option: any) => (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="radio"
                              id={`question_${question.id}_${option.id}`}
                              name={`question_${question.id}`}
                              value={option.option}
                              checked={existingAnswer === option.option}
                              onChange={handleOrganizationFormChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <label
                              htmlFor={`question_${question.id}_${option.id}`}
                              className="ml-3 block openSans text-sm text-gray-700"
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
                          organizationErrors[`question_${index + 1}`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md`}
                        placeholder={`Enter your answer`}
                        rows={3}
                      />
                    )}

                    {organizationErrors[`question_${index + 1}`] && (
                      <p className="mt-1 text-sm text-red-600">
                        {organizationErrors[`question_${index + 1}`]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6 gap-3">
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
                className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "person"} onClose={closeModal}>
        <div className="p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">Person Information</h2>
          <form onSubmit={handlePersonSubmit}>
            {/* Questions */}
            {readlineQuestion.map((question: any, index) => {
              const existingAnswer =
                organizationForm.question.find(
                  (q: QuestionAnswer) => q.question_id === question.id
                )?.answer || "";

              return (
                <div key={question.id} className="mb-4">
                  <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                    {question.question}
                  </label>

                  {/* Render radio buttons if options exist, otherwise render textarea */}
                  {question.options && question.options.length > 0 ? (
                    <div className="space-y-2">
                      {question.options.map((option: any) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`option_${option.id}`}
                            name={`question_${question.id}`}
                            value={option.option}
                            checked={existingAnswer === option.option}
                            onChange={handleOrganizationFormChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={`option_${option.id}`}
                            className="ml-3 block text-sm font-medium text-gray-700"
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
                        personErrors[`question_${index + 1}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      placeholder={`Enter your answer`}
                      rows={3}
                    />
                  )}

                  {personErrors[`question_${index + 1}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {personErrors[`question_${index + 1}`]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="flex justify-end mt-6 gap-3">
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
                className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "personPricing"} onClose={closeModal}>
        <div className=" p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Person Pricing Plan
          </h2>

          <div className="flex justify-center">
            {personPricing.map((plan) => (
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

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
            >
              Skip for now, go to Dashboard
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "organizationPricing"}
        onClose={closeModal}
      >
        <div className=" p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Organization Pricing Plan
          </h2>

          <div className="flex justify-center">
            {organizationpricingPlans.map((plan) => (
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

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm underline focus:outline-none"
            >
              Skip for now, go to Dashboard
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "forgotpassword"} onClose={closeModal}>
        <div className=" p-6 rounded-lg w-full mx-auto z-10 relative">
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
              >
                Forgot Password
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "success"} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF] ">
            <svg
              className="h-30 w-30 text-white animate-bounce"
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
    </>
  );
}
