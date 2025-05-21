import { type FormEvent, useState } from "react";
import Button from "../../components/ui/Button";
import { RegisterDetails } from "../../Common/ServerAPI";
import Modal from "../../components/ui/Modal";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

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

export default function SignupForm({
  onSuccess,
  onSwitchToLogin,
}: SignupFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      } else {
        setApiMessage(error.message || "An error occurred during registration");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    onSuccess();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-10 relative">
        <h1 className="popins text-xl sm:text-xl md:text-2xl text-center font-bold mb-6 bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
          Sign Up
        </h1>
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
        <form onSubmit={handleSubmit}>
          {/* Username field */}
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
                Password must be at least 8 characters with uppercase, number,
                and special character
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
                errors.confirmPassword ? "border-red-500" : "border-[#CBD5E1]"
              } border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="text-center openSans text-sm text-gray-600 mb-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-[#7077FE] hover:underline focus:outline-none"
            >
              Login
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="white-outline"
              size="md"
              onClick={onSuccess}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </div>
        </form>
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
