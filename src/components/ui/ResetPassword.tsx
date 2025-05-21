import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { ForgotPasswordDetailsSubmit } from "../../Common/ServerAPI";

interface QueryParams {
  token: string | null;
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
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
    try {
      const formattedData = {
        token: token,
        password: formData?.new_password,
      };
      const res = await ForgotPasswordDetailsSubmit(formattedData);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {}
    setFormData({ new_password: "", confirm_password: "" });
  };
  return (
    <>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 m-10">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
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
    </>
  );
};

export default ResetPassword;
