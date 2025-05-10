import { useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import { RegisterDetails } from "../../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void; // New prop to handle switching to login modal
}
interface AuthResponse {
  success: any;
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
export default function SignupForm({
  onSuccess,
  onSwitchToLogin,
}: SignupFormProps) {
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useState<boolean>(
    localStorage.getItem("authenticated") === "true"
  );
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Handle form submission logic here (e.g., API call)
    console.log({ username, email, password });

    try {
      const payload = { username, email, password };
      const response = (await RegisterDetails(payload)) as AuthResponse;

      if (response) {
        onSuccess();
        toast.success(response?.success?.message)
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-10 relative">
      <h1
        className="jakarta text-xl sm:text-xl md:text-2xl text-center font-bold mb-6 
           bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
           text-transparent bg-clip-text"
      >
        Sign Up
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">
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
          <Button variant="white-outline" size="md" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
            variant="primary"
            withGradientOverlay
          >
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
