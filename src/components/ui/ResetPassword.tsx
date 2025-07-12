import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { ForgotPasswordDetailsSubmit } from "../../Common/ServerAPI";
import SignupAnimation from "../ui/SignupAnimation";
import Footer from "../../layout/Footer/Footer";
import cnesslogo from "../../assets/cnesslogo.png";




interface QueryParams {
  token: string | null;
}
interface ResetPasswordForm {
  new_password: string;
  confirm_password: string;
}


const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordForm>({
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getQueryParams = (): QueryParams => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    return { token };
  };
  const { token } = getQueryParams();

  const makeResetPasswordRequest = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!token) {
    alert("Invalid or missing token");
    return;
  }

  try {
    const formattedData = {
      token: token, 
      password: formData.new_password,
    };
    await ForgotPasswordDetailsSubmit(formattedData);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error) {
  }
  setFormData({ new_password: "", confirm_password: "" });
};
  return (
    
      <div className="flex flex-col min-h-screen">
      <div className="flex-1 relative">
        {/* Animated background */}
        <SignupAnimation />

  <div className="relative w-full h-[250px]">
  <div className="absolute top-1 left-5 z-30 p-0">
    <img
      src={cnesslogo}
      alt="logo"
      className="w-[150px] h-[150px] object-contain"
    />
  </div>
</div>


<div className="absolute top-[80px] sm:top-[120px] md:top-[150px] left-0 right-0 z-10 flex justify-center px-4 sm:px-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-4 sm:px-8 py-8 sm:py-10 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Reset Password
          </h2>
          <form onSubmit={makeResetPasswordRequest} className="space-y-6 mt-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                New password
              </label>
              <input
                type="password"
                name="new_password"
                placeholder="Enter Your New Password"
                value={formData.new_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-3">
              <label className="block text-gray-600 font-medium mb-2">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Enter Your Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <Button
              //   onClick={closeModal}
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
