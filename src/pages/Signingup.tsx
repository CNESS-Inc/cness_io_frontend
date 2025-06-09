import { useState, type FormEvent } from "react";
import SignupAnimation from "../components/ui/SignupAnimation"; // adjust path
import { RegisterDetails } from "../Common/ServerAPI";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

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
        <div className="z-10 w-full flex justify-center items-center px-4 py-1">
          <div className="w-full max-w-[600px] min-h-[550px] bg-white rounded-2xl shadow-xl px-6 sm:px-10 py-10 sm:py-12 space-y-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign up your account
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
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
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
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    errors.username ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Email field */}
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
                  placeholder="Enter Your Email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    errors.email ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
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
                  placeholder="Enter Your Password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-[12px] border ${
                    errors.password ? "border-red-500" : "border-[#CBD5E1]"
                  } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
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
                  className="block text-[14px] font-normal leading-normal text-[#222224] font-sans mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-center text-sm gap-2 sm:gap-2">
                <label className="flex items-center gap-2">
                  Already have an account?{" "}
                </label>
                <Link to={"/log-in"} className="text-[#7F57FC] hover:underline">
                  Login
                </Link>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="submit"
                  variant="gradient-primary"
                  className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "sign up..." : "Sign Up"}
                </Button>

                <Button type="button" variant="white-outline" size="md">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
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
    </>
  );
}
