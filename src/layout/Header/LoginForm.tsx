import { useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import {
  AccountDetails,
  LoginDetails,
  submitOrganizationDetails,
} from "../../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../../components/ui/Modal";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

interface AuthResponse {
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

interface AccountFormData {
  person_organization_complete: 1 | 2;
}

export default function LoginForm({
  onSuccess,
  onSwitchToSignup,
}: LoginFormProps) {
  const navigate = useNavigate();
  const [, setAuthenticated] = useState<boolean>(
    localStorage.getItem("authenticated") === "true"
  );
  const [activeModal, setActiveModal] = useState<
    "type" | "organization" | null
  >(null);
  const [organizationForm, setOrganizationForm] = useState({
    organization_name: "",
    domain: "",
    sub_domain: "",
    employee_size: "",
    revenue: "",
    statement: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const payload = { email, password };
      const response = (await LoginDetails(payload)) as AuthResponse;

      if (response) {
        setAuthenticated(true);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("jwt", response?.data?.data?.jwt);
        localStorage.setItem("Id", response?.data?.data?.user.id.toString());

        const completionStatus =
          response.data.data.user.person_organization_complete;

        if (completionStatus === 0) {
          // Show type selection modal
          setActiveModal("type");
        } else if (completionStatus === 1) {
          // Complete, proceed to dashboard
          onSuccess();
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else if (completionStatus === 2) {
          // Show organization form
          setActiveModal("organization");
        }
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
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
      } else {
        setActiveModal(null);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error setting account type:", error);
      toast.error("Failed to set account type. Please try again.");
    }
  };

  const handleOrganizationFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrganizationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitOrganizationDetails(organizationForm);
      setActiveModal(null);
      onSuccess();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting organization form:", error);
      toast.error("Failed to save organization information");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-10 relative">
        <h1
          className="poppins text-xl sm:text-xl md:text-2xl text-center font-bold mb-6 
           bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
           text-transparent bg-clip-text"
        >
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block openSans text-sm font-medium text-gray-700 mb-1"
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
              className="block openSans text-sm font-medium text-gray-700 mb-1"
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

          <div className="text-center openSans text-sm text-gray-600 mb-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#7077FE] hover:underline focus:outline-none"
            >
              Sign Up
            </button>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="white-outline" size="md" onClick={onSuccess}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
              variant="primary"
              withGradientOverlay
            >
              Login
            </Button>
          </div>
        </form>
      </div>

      {/* Type Selection Modal - only shows when activeModal is "type" */}
      <Modal isOpen={activeModal === "type"} onClose={closeModal}>
        <div className="bg-white p-6 rounded-lg z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">Select Account Type</h2>
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
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">Organization Information</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter organization name"
                required
              />
            </div>

            {/* Domain */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Domain*
              </label>
              <input
                type="text"
                name="domain"
                value={organizationForm.domain}
                onChange={handleOrganizationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter domain"
                required
              />
            </div>

            {/* Sub Domain */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Sub Domain
              </label>
              <input
                type="text"
                name="sub_domain"
                value={organizationForm.sub_domain}
                onChange={handleOrganizationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter sub domain"
              />
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
                required
              >
                <option value="">Select size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
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
                required
              >
                <option value="">Select revenue range</option>
                <option value="Less than $1M">Less than $1M</option>
                <option value="$1M-$10M">$1M-$10M</option>
                <option value="$10M-$50M">$10M-$50M</option>
                <option value="$50M-$100M">$50M-$100M</option>
                <option value="$100M-$1B">$100M-$1B</option>
                <option value="Over $1B">Over $1B</option>
              </select>
            </div>

            {/* Statement */}
            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Mission Statement
              </label>
              <textarea
                name="statement"
                value={organizationForm.statement}
                onChange={handleOrganizationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your organization's mission statement"
                rows={3}
              />
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
                disabled={isSubmitting}
                onClick={() => handleTypeSelection(1)}
                className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
                variant="primary"
                withGradientOverlay
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
