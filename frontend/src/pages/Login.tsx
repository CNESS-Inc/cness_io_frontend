import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import SignupAnimation from "../components/ui/SignupAnimation"; // adjust path
import { useEffect, useState, type FormEvent } from "react";
import {
  AccountDetails,
  ForgotPasswordDetails,
  GetAllFormDetails,
  LoginDetails,
  MeDetails,
  submitPersonDetails,
  GoogleLoginDetails,
} from "../Common/ServerAPI";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useGoogleLogin } from "@react-oauth/google";

import { FiMail, FiEye, FiEyeOff } from "react-icons/fi"; // add if not already

import Select from "react-select";
import Fcopyright from "../layout/Header/Fcopyright";

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
  question: QuestionAnswer[];
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
  const [personFormStep, setPersonFormStep] = useState(1);

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
  const [personForm, setPersonForm] = useState<PersonForm>({
    first_name: "",
    last_name: "",
    interests: [],
    professions: [],
    question: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interest, setInterest] = useState<Interest[]>([]);
  const [profession, setProfession] = useState<Profession[]>([]);
  const [readlineQuestion, setReadlineQuestion] = useState([]);

  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [personErrors, setPersonErrors] = useState<FormErrors>({});
  const [resetPasswordErrors] = useState<FormErrors>({});
  const [apiMessage, setApiMessage] = useState<string | null>(null);
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
  const handleNextPersonClick = () => {
    // Only validate step 1 fields when clicking next
    const isValid = validateForm(personForm, "person", 1, true);

    if (isValid) {
      setPersonFormStep(2);
    }
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
        localStorage.setItem("isAdult", response?.data?.data?.user?.is_adult);
        localStorage.setItem(
          "karma_credits",
          response?.data?.data?.user.karma_credits
        );
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
        const myReferralCode = response?.data?.data?.user.my_referral_code;
        if (myReferralCode) {
          localStorage.setItem(
            "referral_code",
            response?.data?.data?.user.my_referral_code
          );
        }

        const completionStatus =
          response.data.data.user.person_organization_complete;
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

          if (completionStatus === 0 || completed_step === 0) {
            // This will now directly open the person form
            setActiveModal("person");
          } else if (completionStatus === 1) {
            if (completed_step === 0) {
              setActiveModal("person");
            } else if (completed_step === 1) {
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

      await AccountDetails(payload);

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

  const closeModal = () => {
    setActiveModal(null);
    setApiMessage(null);
  };

  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAllFormDetails();
      setProfession((response as any)?.data?.data?.profession);
      setInterest((response as any)?.data?.data?.interest);
      setReadlineQuestion(response?.data?.data?.questions);
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
            } else if (completed_step === 1) {
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

          <div className="relative w-full h-[250px]">
            <div className="absolute top-1 left-5 z-30 p-0">
              <Link to="/">
                <img
                  src={`https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd`}
                  alt="logo"
                  className="w-48 h-48 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="min-h-[700px] ">
          <div className="absolute top-20 sm:top-[120px] md:top-40 left-0 right-0 z-10 flex justify-center px-4 sm:px-6">
            <div className="w-xl h-[750px] sm:h-[650px] bg-white rounded-3xl shadow-xl border border-gray-200 px-[42px] py-[52px] flex flex-col gap-8">
              <h2 className="font-poppins font-semibold text-[28px] leading-8 tracking-[-0.02em] text-gray-900">
                Sign in to your account
                <br />
                <span className="font-publicSans font-normal text-[15px] leading-5 tracking-[-0.005em] text-[#281D1B]">
                  Please enter your login details to access your account
                </span>
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
                <div className="mb-4 relative">
                  {/* Google Sign-In Button */}
                  <div className="flex justify-center gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => login()}
                      className="flex items-center gap-2 border border-gray-300 rounded-3xl px-12 py-3 bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                    >
                      <img
                        src="/google-icon-logo.svg"
                        alt="Google"
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Sign in with Google
                      </span>
                    </button>
                  </div>

                  {/* Divider with "Or sign in with" */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-3 font-publicSans font-normal text-[15px] leading-5 text-[#281D1B]">
                        Or sign in with
                      </span>
                    </div>
                  </div>

                  <label
                    htmlFor="email"
                    className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
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
                      className={`w-full px-3 py-2 rounded-xl border ${
                        loginErrors.email
                          ? "border-red-500"
                          : "border-[#CBD5E1]"
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

                <div className="mb-4 relative">
                  <label
                    htmlFor="password"
                    className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
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
                      className={`w-full px-3 py-2 rounded-xl border ${
                        loginErrors.password
                          ? "border-red-500"
                          : "border-[#CBD5E1]"
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
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-600">
                      Remember me on this device
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-[#7F57FC] hover:underline"
                    onClick={onForgotPassword}
                  >
                    Trouble logging in? Reset password
                  </a>
                </div>

                <Button
                  type="submit"
                  variant="gradient-primary"
                  className="w-full rounded-[100px] flex justify-center py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loging..." : "Login"}
                </Button>

                {/* Google & Facebook Icons 
              <div className="flex justify-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => login()}
                  className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md w-12 h-12 bg-white hover:shadow-md hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#F07EFF]"
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
                <p className="flex flex-col sm:flex-row justify-center items-center text-sm gap-2 sm:gap-2 mt-4">
                  New to Cness?{" "}
                  <Link
                    to={"/sign-up"}
                    className="text-[#7F57FC] font-medium hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

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
                className={`w-full px-3 py-2 rounded-xl border ${
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
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-linear-to-r from-[#7077FE] to-[#9747FF] ">
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
      <Fcopyright />
    </>
  );
}
