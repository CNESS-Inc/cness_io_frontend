import { useEffect, useState, type FormEvent } from "react";
import Button from "../../components/ui/Button";
import {
  AccountDetails,
  GetAllFormDetails,
  GetDomainDetails,
  GetReadinessQuestionDetails,
  GetSubDomainDetails,
  LoginDetails,
  submitOrganizationDetails,
  submitPersonDetails,
} from "../../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../../components/ui/Modal";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

interface SubDomain {
  id: string;
  name: string;
}
interface OrganizationForm {
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
interface QuestionAnswer {
  question_id: string;
  answer: string;
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
    | "type"
    | "organization"
    | "person"
    | "personPricing"
    | "organizationPricing"
    | null
  >(null);
  console.log("🚀 ~ activeModal:", activeModal);
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm>({
    organization_name: "",
    domain: "",
    sub_domain: "",
    employee_size: "",
    revenue: "",
    question: [], // Changed from 'question' to 'questions' to match interface
  });
  console.log("🚀 ~ organizationForm:", organizationForm);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subDomain, setsubDomain] = useState<SubDomain[] | null>();

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
          // onSuccess();
          // setTimeout(() => {
          //   navigate("/dashboard");
          // }, 2000);
          setActiveModal("person");
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
      } else if (type === 1) {
        setActiveModal("person");
      } else {
        setActiveModal(null);
        // navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error setting account type:", error);
      toast.error("Failed to set account type. Please try again.");
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

    const [isAnnual, setIsAnnual] = useState(false);
  const [personPricing, setPersonPricing] = useState([]);
  const [organizationpricingPlans, setorganizationpricingPlans] = useState([]);
  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await submitOrganizationDetails(organizationForm);
      const plansByRange: Record<string, any> = {};
      res?.data?.data?.plan.forEach((plan: any) => {
        if (!plansByRange[plan.plan_range]) {
          plansByRange[plan.plan_range] = {};
        }
        plansByRange[plan.plan_range][plan.plan_type] = plan;
      });
      console.log("🚀 ~ handleOrganizationSubmit ~ plansByRange:", plansByRange)

      // Create combined plan objects with both monthly and yearly data
      const updatedPlans = Object.values(plansByRange).map((planGroup: any) => {
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
      });

      setorganizationpricingPlans(updatedPlans);
      setActiveModal("organizationPricing");
      // onSuccess();
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting organization form:", error);
      toast.error("Failed to save organization information");
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const question_payload: PartialOrganizationFormData = {
        question: organizationForm.question,
      };
      const res = await submitPersonDetails(
        question_payload as any
      );

      // Group plans by their range (Basic Plan, Pro Plan, etc.)
      const plansByRange: Record<string, any> = {};
      res?.data?.data?.plan.forEach((plan: any) => {
        if (!plansByRange[plan.plan_range]) {
          plansByRange[plan.plan_range] = {};
        }
        plansByRange[plan.plan_range][plan.plan_type] = plan;
      });
      console.log("🚀 ~ handlePersonSubmit ~ plansByRange:", plansByRange)

      // Create combined plan objects with both monthly and yearly data
      const updatedPlans = Object.values(plansByRange).map((planGroup: any) => {
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
      });

      setPersonPricing(updatedPlans);
      setActiveModal("personPricing");
    } catch (error) {
      console.error("Error submitting organization form:", error);
      toast.error("Failed to save organization information");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update pricing when isAnnual changes
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

  const [domains, setDomains] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [OrganizationSize, setOrganizationSize] = useState([]);
  const [readlineQuestion, setReadlineQuestion] = useState([]);
  const fetchAllDataDetails = async () => {
    try {
      const response = await GetAllFormDetails()
      setDomains((response as any)?.data?.data?.domain);
      setReadlineQuestion(response?.data?.data?.questions);
      setOrganizationSize(response?.data?.data?.organization_size);
      setRevenue(response?.data?.data?.revenue);
    } catch (error) {}
  };

  useEffect(() => {
    if (activeModal === "organization" ||  activeModal === "person") {
      fetchAllDataDetails()
    }
  }, [activeModal]);


  return (
    <>
      <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4 z-10 relative">
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
              className="w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
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
              className="w-full px-3 py-2 rounded-[12px] border border-[#CBD5E1] border-opacity-100 bg-white placeholder-[#AFB1B3] focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                Domain*
              </label>
              <select
                name="domain"
                value={organizationForm.domain}
                onChange={handleOrganizationFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <>
                  <option value="">Select domain</option>
                  {domains?.map((domain: any) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </>
              </select>
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
                required
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
                <>
                  <option value="">Select Sub domain</option>
                  {OrganizationSize?.map((orgsize: any) => (
                    <option key={orgsize.id} value={orgsize.id}>
                      {orgsize.name}
                    </option>
                  ))}
                </>
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
                <>
                  <option value="">Select Sub domain</option>
                  {revenue?.map((revenue: any) => (
                    <option key={revenue.id} value={revenue.id}>
                      {revenue.revenue_range}
                    </option>
                  ))}
                </>
              </select>
            </div>

            {/* Statement */}
            <div className="space-y-4">
              {readlineQuestion?.map((question: any) => {
                // TypeScript now knows the shape of questions array elements
                const existingAnswer =
                  organizationForm.question.find(
                    (q: QuestionAnswer) => q.question_id === question.id
                  )?.answer || "";

                return (
                  <div key={question.id} className="mb-4">
                    <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                      {question.question}
                    </label>
                    <textarea
                      name={`question_${question.id}`}
                      value={existingAnswer}
                      onChange={handleOrganizationFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={`Enter your answer`}
                      rows={3}
                    />
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
                disabled={isSubmitting}
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

      <Modal isOpen={activeModal === "person"} onClose={closeModal}>
        <div className=" p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4">Person Information</h2>
          <form onSubmit={handlePersonSubmit}>
            {/* Statement */}
            {readlineQuestion.map((question: any) => {
              // TypeScript now knows the shape of questions array elements
              const existingAnswer =
                organizationForm.question.find(
                  (q: QuestionAnswer) => q.question_id === question.id
                )?.answer || "";

              return (
                <div key={question.id} className="mb-4">
                  <label className="block openSans text-sm font-medium text-gray-700 mb-1">
                    {question.question}
                  </label>
                  <textarea
                    name={`question_${question.id}`}
                    value={existingAnswer}
                    onChange={handleOrganizationFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={`Enter your answer`}
                    rows={3}
                  />
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
                disabled={isSubmitting}
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
                  <span className="text-gray-500">
                    /month
                  </span>
                  {plan.billingNote && (
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.billingNote}
                    </p>
                  )}
                </div>
                <Button
                  className={`bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out ${plan.buttonClass}`}
                  variant="primary"
                  withGradientOverlay
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
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


      <Modal isOpen={activeModal === "organizationPricing"} onClose={closeModal}>
        <div className=" p-6 rounded-lg w-full mx-auto z-10 relative">
          <h2 className="text-xl poppins font-bold mb-4 text-center">
            Person Pricing Plan
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
                  <span className="text-gray-500">
                    /month
                  </span>
                  {plan.billingNote && (
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.billingNote}
                    </p>
                  )}
                </div>
                <Button
                  className={`bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out ${plan.buttonClass}`}
                  variant="primary"
                  withGradientOverlay
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
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

    </>
  );
}
