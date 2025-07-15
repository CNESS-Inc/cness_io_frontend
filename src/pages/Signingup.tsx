import { useRef, useState, type FormEvent } from "react";
import SignupAnimation from "../components/ui/SignupAnimation"; // adjust path
import { RegisterDetails, GoogleLoginDetails } from "../Common/ServerAPI";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import cnesslogo from "../assets/cnesslogo.png";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { useGoogleLogin } from "@react-oauth/google";
import ReCAPTCHA from "react-google-recaptcha";
import Fcopyright from "../layout/Header/Fcopyright";


// interface SignupFormProps {
//   onSuccess: () => void;
//   onSwitchToLogin: () => void;
// }

interface AuthResponse {
  success: { message: string };
  data: {
    data: {
      jwt: string;
      user: {
        id: number;
        person_organization_complete: number;
        [key: string]: any;
      };
    };
  };
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  recaptcha?: string;
}

export default function Signingup() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [emailFocused, setEmailFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Add your site key (replace with your actual key)
  const RECAPTCHA_SITE_KEY = "6LcmM3YrAAAAAIoMONSmkAGazWwUXdCE6fzI473L";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));

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

  const handleCaptchaChange = (value: string | null) => {
    setRecaptchaValue(value);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.recaptcha;
      return newErrors;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

    // Reset CAPTCHA on each submission attempt
    recaptchaRef.current?.reset();
    setRecaptchaValue(null);

    const form = e.currentTarget;
    const formData = {
      username: form.username.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      confirmPassword: form.confirmPassword.value.trim(),
    };

    if (!validateForm(formData)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const response = (await RegisterDetails(payload)) as AuthResponse;
      console.log("🚀 ~ handleSubmit ~ response:", response);

      if (response) {
        setApiMessage(response?.success?.message || "Registration successful");
        setTimeout(() => {
          // onSuccess();
        }, 500);
        setTimeout(() => {
          setIsModalOpen(true);
        }, 1000);
        setIsSubmitting(false);
      } else {
        setApiMessage("Registration failed");
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
        setApiMessage(serverErrors.message);
        setIsSubmitting(false);
      } else {
        setApiMessage(error.message || "An error occurred during registration");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/log-in");
  };

  const handleGoogleLoginSuccess = async (tokenResponse: any) => {
    const token = tokenResponse.access_token;

    try {
      const data = await GoogleLoginDetails(token); // ✅ use your centralized API call
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

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => {
      console.error("Google login failed");
      alert("Google login failed.");
    },
  });

  return (
    <>
      <div className="relative min-h-screen flex flex-col bg-white">
        <div className="relative w-full h-[250px]">
          {/* Diagonal Gradient Background */}
          <div className="absolute top-0 left-0 w-full h-[300px] sm:h-[400px] lg:h-[600px] z-0">
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
        src={cnesslogo}
        alt="logo"
        className="w-[150px] h-[150px] object-contain"
      />
    </Link>
  </div>
</div>
       
 </div>
        {/* Sign In Form */}
<div className="min-h-screen flex flex-col">

        <div className="absolute top-[100px] sm:top-[140px] md:top-[180px] left-0 right-0 flex justify-center z-10 px-4">
          <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl px-4 sm:px-10 py-8 sm:py-12 space-y-10">
            <h2 >
              Sign up
            </h2>

            {apiMessage && (
              <div
                className={`poppins text-center mb-4 ${
                  apiMessage.includes("verification")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {apiMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="mb-4 relative group">
                {/* Google Sign-In Button */}
                <div className="flex justify-center gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      login()
                      navigate("/log-in", { state: { autoGoogleLogin: true } });
                    }}
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-2 bg-white hover:shadow-md hover:font-bold hover:cursor-pointer"
                    >
                    <img
                      src="/google-icon-logo.svg"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Sign up with Google
                    </span>
                  </button>
                </div>

                {/* Divider with "Or sign up with" */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white  px-3">
                      Or sign up with
                    </span>
                  </div>
                </div>
                <label
                  htmlFor="username"
                  className="block"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter Your Username"
                  value={formValues.username}
                  onChange={handleInputChange}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    errors.username ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />

                {/* Tooltip on focus/hover */}
                {isUsernameFocused && (
                  <div className="absolute top-10 right-0 max-w-[240px] bg-gray-700 text-white text-xs px-3 py-2 rounded-md shadow-md z-20 animate-fadeIn">
                    Username must be 3–40 characters and only contain letters,
                    numbers, and underscores.
                  </div>
                )}

                {/* Error message after submission */}
                {errors.username && !isUsernameFocused && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email field */}
              <div className="mb-4 relative">
                <label
                  htmlFor="email"
                  className="block"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    errors.email ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />

                <FiMail
                  className={`absolute right-3 top-9 text-gray-400 transition-opacity duration-300 ${
                    emailFocused ? "opacity-100" : "opacity-0"
                  }`}
                  size={18}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              {/* Password field */}
              <div className="mb-4 relative">
                <label
                  htmlFor="password"
                   className="block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 pr-10 py-2 rounded-[12px] border ${
                      errors.password ? "border-red-500" : "border-[#CBD5E1]"
                    } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </div>
                </div>
                {errors.password ? (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 8 characters with uppercase,
                    number, and special character
                  </p>
                )}
              </div>
              {/* Confirm Password field */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                   className="block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Your Password"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-[12px] border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[#CBD5E1]"
                    } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </div>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Divider with "Or sign up with" */}
              <div className="relative my-6">
               
               
              </div>
              <div className="my-4 flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
                {errors.recaptcha && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.recaptcha}
                  </p>
                )}
              </div>

              {/* Facebook (still inactive) 
  <button
    type="button"
    disabled
    title="Coming soon"
    className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md w-12 h-12 opacity-50 cursor-not-allowed bg-white dark:bg-gray-900"
  >
    <img src="/Facebook_Logo.png" alt="Facebook" className="w-7 h-7" />
  </button>

*/}
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-center text-sm gap-2 sm:gap-2">
                <label className="flex items-center gap-2">
                  Already have an account?{" "}
                </label>
                <Link to={"/log-in"} className="text-[#7F57FC] hover:underline">
                  Login
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Button
                  type="submit"
                  variant="gradient-primary"
                  className="w-full flex justify-center rounded-[100px] py-3 px-10 self-stretch transition-colors duration-500 ease-in-out"
                  disabled={isSubmitting || !recaptchaValue}
                >
                  {isSubmitting ? "sign up..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-gradient-to-r from-[#7077FE] to-[#9747FF] ">
            <svg
              className="h-30 w-30 text-white"
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
                apiMessage.includes("verification")
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
      <Fcopyright />
    </>
  );
}
