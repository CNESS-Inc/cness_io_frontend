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
  GoogleLoginDetails,
  ResendVerificationMail,
} from "../../Common/ServerAPI";
//import { Button } from "@headlessui/react";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  referralCode?: string;
  recaptcha?: string;
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

export default function SignupModalOld({ open = true, onClose = () => { } }: SignupModalProps) {
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

  const RECAPTCHA_SITE_KEY = "6LcmM3YrAAAAAIoMONSmkAGazWwUXdCE6fzI473L";

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

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
    validateForm({ ...registerForm, [name]: value });
    setErrors((prevErrors) => {
      if (prevErrors[name as keyof FormErrors]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      }
      return prevErrors;
    });
  };

  const validateForm = (formData: {
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

    const isValid = validateForm(formData);

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

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    const token = tokenResponse.access_token;

    try {
      const data = await GoogleLoginDetails(token);
      console.log("Backend response:", data);

      if (data) {
        localStorage.setItem("token", data.jwt);
        navigate("/log-in");
      } else {
        alert("Google login succeeded, but no JWT received.");
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
            // onClick={() => {
            //   login();
            //   // navigate("/log-in", {
            //   //   state: { autoGoogleLogin: true },
            //   // });
            // }}
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
                validateForm(registerForm);
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
                validateForm(registerForm);
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
                  validateForm(registerForm);
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
                  validateForm(registerForm);
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
                    validateForm(registerForm);
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
          className={`mt-4 text-center text-[13px] text-gray-600 ${formssubmitted ? "hidden" : ""
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
          className={`w-full h-[730px] flex flex-col justify-center items-center ${formssubmitted ? "block" : "hidden"
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
    </>
  );
}
