import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetEmailVerify } from "../../Common/ServerAPI";
import Button from "./Button";

interface EmailVerifyData {
  token: string;
}

const EmailVerify = () => {
  const location = useLocation();
  const [loginShow, setLoginShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    return { token };
  };

  const { token } = getQueryParams();

  const verify = async () => {
    try {
      if (!token) {
        throw new Error("No verification token provided in the URL");
      }
      
      const decodedToken = decodeURIComponent(token);
      
      // Create the proper data structure expected by the API
      const verifyData: EmailVerifyData = {
        token: decodedToken
      };
      
      const res = await GetEmailVerify(verifyData);
      console.log("Verification response:", res);
      setLoginShow(true);
    } catch (error:any) {
      console.error("Error verifying email:", error);
      setError(error instanceof Error ? error.message : "Verification failed");
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/log-in");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {error ? (
          <h1 className="text-lg font-semibold text-red-500">{error}</h1>
        ) : (
          <>
            <h1 className="text-lg font-semibold">
              {loginShow 
                ? "Your Email is verified. Click on login button to continue."
                : "Verifying your email..."}
            </h1>
            {loginShow && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 sm:py-[16px] px-6 sm:px-[24px] rounded-full text-sm sm:text-base w-full sm:w-auto text-center mt-3"
                withGradientOverlay
                onClick={handleLoginClick}
              >
                Login
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;