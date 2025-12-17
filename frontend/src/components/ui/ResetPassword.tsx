import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { ForgotPasswordDetailsSubmit } from "../../Common/ServerAPI";
import SignupAnimation from "../ui/SignupAnimation";
import Footer from "../../layout/Footer/Footer";
import { Link } from "react-router-dom";
import { useToast } from "./Toast/ToastProvider";

interface QueryParams {
  token: string | null;
}
interface ResetPasswordForm {
  new_password: string;
  confirm_password: string;
}

const PASSWORD_MIN_LENGTH = 8;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordForm>({
    new_password: "",
    confirm_password: "",
  });
  const { showToast } = useToast();

  const [touched, setTouched] = useState({
    new_password: false,
    confirm_password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const getQueryParams = (): QueryParams => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    return { token };
  };
  const { token } = getQueryParams();

  useEffect(() => {
    // just trigger rerender on change, validation handled separately
  }, [formData.new_password]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name as keyof typeof t]: true }));
  };

  const isNewPasswordValid = () => {
    const pwd = formData.new_password;
    return pwd.length >= PASSWORD_MIN_LENGTH;
  };

  const isConfirmPasswordValid = () => {
    return (
      formData.confirm_password === formData.new_password &&
      formData.confirm_password.length > 0
    );
  };

  const isFormValid = () => {
    return isNewPasswordValid() && isConfirmPasswordValid();
  };

  const makeResetPasswordRequest = async (e: FormEvent) => {
    e.preventDefault();

    setTouched({ new_password: true, confirm_password: true });

    if (!token) {
      alert("Invalid or missing token");
      return;
    }

    if (!isNewPasswordValid()) {
      showToast({
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
        type: "error",
        duration: 5000,
      });
      return;
    }

    if (!isConfirmPasswordValid()) {
      showToast({
        message: "Confirm password does not match.",
        type: "error",
        duration: 5000,
      });
      return;
    }

    try {
      const formattedData = {
        token: token,
        password: formData.new_password,
      };
      const res = await ForgotPasswordDetailsSubmit(formattedData);
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setFormData({ new_password: "", confirm_password: "" });
      setTouched({ new_password: false, confirm_password: false });
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 relative">
        {/* Animated background */}
        <SignupAnimation />

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

        <div className="absolute top-[80px] sm:top-[120px] md:top-[150px] left-0 right-0 z-10 flex justify-center px-4 sm:px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-4 sm:px-8 py-8 sm:py-10 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
              Reset Password
            </h2>
            <form
              onSubmit={makeResetPasswordRequest}
              className="space-y-6 mt-4"
            >
              <div>
                <label
                  htmlFor="new_password"
                  className="block text-gray-600 font-medium mb-2"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    placeholder="Enter Your New Password"
                    value={formData.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-2 border rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      touched.new_password && !isNewPasswordValid()
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-2 text-sm px-2 py-1 rounded-md bg-gray-100"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {touched.new_password && !isNewPasswordValid() && (
                  <p className="text-xs text-red-500 mt-2">
                    Password must be at least {PASSWORD_MIN_LENGTH} characters
                    long.
                  </p>
                )}
              </div>

              <div className="mt-3">
                <label className="block text-gray-600 font-medium mb-2">
                  Confirm password
                </label>
                <input
                  id="confirm_password"
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm your new password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    touched.confirm_password && !isConfirmPasswordValid()
                      ? "border-red-300"
                      : ""
                  }`}
                />
                {touched.confirm_password && !isConfirmPasswordValid() && (
                  <p className="text-xs text-red-500 mt-2">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <Button
                disabled={!isFormValid()}
                variant="gradient-primary"
                className="rounded-[100px] mt-3 py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
