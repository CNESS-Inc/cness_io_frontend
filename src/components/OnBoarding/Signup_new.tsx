// SignupModal.tsx
import React, { useRef, useState, type FormEvent } from "react";
import PopupOnboardingModal from "../ui/OnBoardingModel";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/Toast/ToastProvider";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import Loginmodule from "../OnBoarding/Login";
import { registerUser } from "../../pages/Signingup";
import {
  AccountDetails,
  ForgotPasswordDetails,
  GoogleLoginDetails,
  MeDetails,
  PaymentDetails,
  ResendVerificationMail,
  submitPersonDetails,
} from "../../Common/ServerAPI";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Select from "react-select";

//import { Button } from "@headlessui/react";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;
  recaptcha?: string;
}
interface FormErrorsl {
  email?: string;
  password?: string;
  organization_name?: string;
  domain?: string;
  sub_domain?: string;
  employee_size?: string;
  revenue?: string;
  [key: string]: string | undefined; // For dynamic question errors
}
type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  onSignup?: (data: {
    email: string;
    password: string;
    referral?: string;
  }) => void;
  onGoogle?: () => void;
};
interface AccountFormData {
  person_organization_complete: 1 | 2;
}
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
interface QuestionAnswer {
  question_id: string;
  answer: string;
}
interface PersonForm {
  first_name: string;
  last_name: string;
  interests: (string | number)[];
  professions: (string | number)[];
  custom_profession?: string;
  question: QuestionAnswer[];
}

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
interface Interest {
  id: string | number;
  name: string;
}

interface Profession {
  id: string | number;
  title: string; // Changed from 'name' to 'title' to match your usage
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}




export default function SignupModalNew({
  open = true,
  onClose = () => {},
}: SignupModalProps) {
  // const [email, setEmail] = useState("");
  // const [pwd, setPwd] = useState("");
  // const [pwd2, setPwd2] = useState("");
  // const [ref, setRef] = useState("");

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formssubmitted, setFormSubmitted] = useState(false);
  const [useremail, setUseremail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [recaptchaTouched, setRecaptchaTouched] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [readlineQuestion] = useState([]);

  const [interest] = useState<Interest[]>([]);
  const [profession] = useState<Profession[]>([]);

  const RECAPTCHA_SITE_KEY = "6LcmM3YrAAAAAIoMONSmkAGazWwUXdCE6fzI473L";


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
    const newErrors: FormErrorsl = {};

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

      // setLoginErrors(newErrors);
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

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [personErrors, setPersonErrors] = useState<FormErrorsl>({});
  const [resetPasswordErrors] = useState<FormErrors>({});
  const [personForm, setPersonForm] = useState<PersonForm>({
    first_name: "",
    last_name: "",
    interests: [],
    professions: [],
    question: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  const [personPricing, setPersonPricing] = useState<PersPricingPlan[]>([]);
  const [personFormStep, setPersonFormStep] = useState(1);
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

  const handleCaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.recaptcha;
      return newErrors;
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateForms({ ...registerForm, [name]: value });
    setErrors((prevErrors) => {
      if (prevErrors[name as keyof FormErrors]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      }
      return prevErrors;
    });
  };

  const validateForms = (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username must be less than 20 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!recaptchaValue) {
      newErrors.recaptcha = "Please verify you're not a robot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (!recaptchaValue) {
    //   setRecaptchaTouched(true);
    //   setErrors((prev) => ({
    //     ...prev,
    //     recaptcha: "Please verify you're not a robot",
    //   }));
    //   return;
    // }

    // setRegisterLoading(true);
    // setRegisterError(null);

    // recaptchaRef.current?.reset();
    // setRecaptchaValue(null);

    const form = e.currentTarget;
    const formData = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      confirmPassword: form.confirmPassword.value.trim(),
      referralCode: form.referralCode.value.trim(),
    };

    const isValid = validateForms(formData);

    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      referralCode: true,
    });

    if (!isValid) {
      setRegisterLoading(false);
      return;
    }

    try {
      const payload: any = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        referral_code: registerForm.referralCode,
      };
      const result = await registerUser(payload);

      if (result?.success) {
        setUseremail(registerForm.email);
        setFormSubmitted(true);
        showToast({
          type: "success",
          message:
            "A verification email has been sent. Please verify to login.!",
          duration: 2000,
        });

        recaptchaRef.current?.reset();
        setRecaptchaValue(null);
      } else {
        setRegisterError(result.message || "Registration failed.");
      }
    } catch (error: any) {
      if (error?.response?.data?.error) {
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

        setErrors(formattedErrors);
        setRegisterError(serverErrors.message);
        setRegisterLoading(false);
      } else {
        setRegisterError(
          error.message || "An error occurred during registration"
        );
      }
    } finally {
      setRegisterLoading(false);
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
  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    const token = tokenResponse.access_token;

    try {
      const response = await GoogleLoginDetails(token);
      console.log("Backend response:", response);

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
        // localStorage.setItem("token", response.jwt);
        // navigate("/log-in");
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
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const handleResendMail = async () => {
    try {
      if (!registerForm.email) {
        alert("Please enter your email first.");
        return;
      }

      const response = await ResendVerificationMail(registerForm?.email);
      console.log("resend response:", response);
      if (response?.success?.statusCode === 200) {
        alert("Verification email resent. Please check your inbox.");
        navigate("/log-in");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to resend verification email. Please try again.");
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: handleGoogleLoginSuccess,
  //   onError: () => {
  //     console.error("Google login failed");
  //     alert("Google login failed.");
  //   },
  // });

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

  /*const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== pwd2) {
      alert("Passwords do not match.");
      return;
    }
    onSignup?.({ email, password: pwd, referral: ref });
  };*/
  //const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // or process.env...

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
  const handleNextPersonClick = () => {
    // Only validate step 1 fields when clicking next
    const isValid = validateForm(personForm, "person", 1, true);
    console.log("🚀 ~ handleNextPersonClick ~ isValid:", isValid);

    if (isValid) {
      setPersonFormStep(2);
    }
  };


  return (
    <>
      <PopupOnboardingModal open={open} onClose={onClose}>
        {/* Right-side content only */}
        <div className={formssubmitted ? "hidden" : ""}>
          <h1 className="text-center font-[Poppins] font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-gray-900">
            Create a Free Account
          </h1>

          <ul className="mt-4 flex justify-center items-center gap-6 text-sm text-gray-600">
            <li className="flex items-center gap-2 font-[Open_Sans] font-normal text-[14px] leading-[100%] tracking-[0px] text-gray-700">
              <Check className="h-6 w-6 stroke-[3px] text-green-500" />
              Forever Free plan
            </li>
            <li className="flex items-center gap-2 font-[Open_Sans] font-normal text-[14px] leading-[100%] tracking-[0px] text-gray-700">
              <Check className="h-6 w-6 stroke-[3px] text-green-500" />
              Setup in minutes
            </li>
          </ul>

          <button
            type="button"
            onClick={() => login()}
            className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 shadow-sm hover:bg-gray-50"
          >
            <span
              className="
              inline-flex items-center gap-3
              font-inter font-medium
              text-[14px] leading-[20px] tracking-[0]
              text-gray-900
            "
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Register with Google
            </span>
          </button>
        </div>
        {/* Divider */}
        <div
          className={`
          my-6 flex items-center
          lg:w-[415px] w-full h-[19px]
          gap-[20px]
          text-[14px] leading-[100%] tracking-[0]
          font-['Open_Sans'] font-normal
          text-gray-500 ${formssubmitted ? " hidden" : ""}`}
        >
          <div className="h-px w-full bg-gray-200" />

          <span
            className={`whitespace-nowrap ${formssubmitted ? " hidden" : ""}`}
          >
            Or sign up with
          </span>
          <div className="h-px w-full bg-gray-200" />
        </div>
        <form
          className={`grid grid-cols-1 gap-4 ${formssubmitted ? "hidden" : ""}`}
          onSubmit={handleRegisterSubmit}
        >
          {/* Username */}
          <label className="block">
            <span className="block mb-2 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
              Username
            </span>
            <input
              type="text"
              name="username"
              value={registerForm.username}
              onChange={handleRegisterChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, username: true }));
                validateForms(registerForm);
              }}
              placeholder="Enter your Username"
              className="w-full h-[45px]
                  rounded-[4px] border-2 border-gray-200
                  px-[10px]  /* pr + pl = 10px */
                  outline-none
                  text-[14px] leading-[20px]
                  placeholder:text-gray-400"
              required
            />
            {(touched.username || formssubmitted) && errors.username && (
              <p className="text-sm text-red-600">{errors.username}</p>
            )}
          </label>
          {/* Email */}
          <label className="block">
            <span className="block mb-2 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              value={registerForm.email}
              onChange={handleRegisterChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                validateForms(registerForm);
              }}
              className="
                  lg:w-[415px] w-full h-[45px]
                  rounded-[4px] border-2 border-gray-200
                  px-[10px]  /* pr + pl = 10px */
                  outline-none
                  text-[14px] leading-[20px]
                  placeholder:text-gray-400
                
                "
            />
            {(touched.email || formssubmitted) && errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </label>

          {/* Passwords */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block w-full">
              <span className="block mb-2 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                placeholder="Type your password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  validateForms(registerForm);
                }}
                className="
                    lg:w-[195.5px] w-full h-[45px]
                    rounded-[4px] border-2 border-gray-200
                    px-[10px]
                    outline-none
                    text-[14px] leading-[20px]
                    placeholder:text-gray-400
                  
                  "
              />
              {(touched.password || formssubmitted) && errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </label>

            <label className="block w-full">
              <span className="block mb-2 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
                Re-type Password
              </span>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Re-type your password"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, confirmPassword: true }));
                  validateForms(registerForm);
                }}
                className="
                    lg:w-[195.5px] w-full h-[45px]
                    rounded-[4px] border-2 border-gray-200
                    px-[10px]
                    outline-none
                    text-[14px] leading-[20px]
                    placeholder:text-gray-400
                    
                  "
              />
              {(touched.confirmPassword || formssubmitted) &&
                errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
            </label>
          </div>

          <p
            className="
                font-['Poppins'] font-normal
                text-[9px] leading-[100%] tracking-[0]
                text-gray-500
              "
          >
            Password must be at least 8 characters with uppercase, number, and
            special character
          </p>

          {/* Referral + CAPTCHA placeholder */}
          <div className="grid grid-cols-1 gap-4">
            {/* Referral Code */}
            <div className="mb-0 w-[100%]">
              <label className="block">
                <span className="block mb-2 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
                  Referral code (optional)
                </span>
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Enter your referral code"
                  value={registerForm.referralCode}
                  onChange={handleRegisterChange}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, referralCode: true }));
                    validateForms(registerForm);
                  }}
                  className="
                      w-full h-[45px]
                      rounded-[4px] border-2 border-gray-200
                      px-[10px]
                      outline-none
                      text-[14px] leading-[20px]
                      placeholder:text-gray-400
                    
                    "
                />
              </label>
              {(touched.referralCode || formssubmitted) &&
                errors.referralCode && (
                  <p className="text-sm text-red-600">{errors.referralCode}</p>
                )}
            </div>

            {/* CAPTCHA */}
            <div className="mt-4 md:mt-0 grid place-items-center w-full overflow-hidden">
              <div className="w-full h-full flex flex-col items-center justify-start">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(value) => {
                    handleCaptchaChange(value);
                    setRecaptchaTouched(false);
                  }}
                  style={{ width: "100%" }}
                />
                {(errors.recaptcha ||
                  (recaptchaTouched && !recaptchaValue)) && (
                  <p className="mt-1 text-sm text-red-600">
                    Please complete reCAPTCHA
                  </p>
                )}
              </div>
            </div>
          </div>

          {registerError && (
            <p className="text-sm text-red-600 mb-0">{registerError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-0 w-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-0 h-[42px] text-white text-[14px] shadow-md hover:opacity-95"
            disabled={registerLoading || !recaptchaValue}
          >
            {registerLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p
          className={`mt-4 text-center text-[13px] text-gray-600 ${
            formssubmitted ? "hidden" : ""
          }`}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              setOpenLogin(true);
            }}
            className="text-purple-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>

        <div
          className={`w-full h-[730px] flex flex-col justify-center items-center ${
            formssubmitted ? "block" : "hidden"
          }`}
        >
          <h2 className="text-[32px] text-black font-[500] mb-2">
            Verify Your E-Mail
          </h2>
          <p className="text-[#64748B] text-[14px] font-[400]">
            We have sent a verification link to your mail id
          </p>
          <span className="text-[16px] text-[#9747FF] font-[600] mb-[35px]">
            {useremail}
          </span>
          <button
            type="submit"
            onClick={handleResendMail}
            className="mt-0 w-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-0 h-[45px] text-white text-[14px] shadow-md hover:opacity-95"
          >
            Resend Verification Email
          </button>
          <p className="mt-4 text-center text-[13px] text-[#64748B]">
            Do you want to change your email ID?{" "}
            <Link
              to="/"
              className="text-purple-600 hover:underline font-medium ml-2"
            >
              Re-type Again
            </Link>
          </p>
        </div>
      </PopupOnboardingModal>
      <Loginmodule open={openLogin} onClose={() => setOpenLogin(false)} />

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
