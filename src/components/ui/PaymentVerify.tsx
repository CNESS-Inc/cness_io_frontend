import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetPaymentVerify } from "../../Common/ServerAPI";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";

interface PaymentVerifyData {
  session_id: string;
}

const PaymentVerify = () => {
  const location = useLocation();
  const [loginShow, setLoginShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast()
  
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const session_id = params.get("session_id");
    return { session_id };
  };

  const { session_id } = getQueryParams();

  const verify = async () => {
    try {
      if (!session_id) {
        throw new Error("No verification verification id provided in the URL");
      }
      
      const decodedToken = decodeURIComponent(session_id);
      
      // Create the proper data structure expected by the API
      const verifyData: PaymentVerifyData = {
        session_id: decodedToken
      };
      
      const res = await GetPaymentVerify(verifyData);
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
     localStorage.setItem("completed_step","2");
    navigate("/dashboard");
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
                ? "Your Payment is confirmed. Click on Go to Dashboard button to continue."
                : "Verifying your payment..."}
            </h1>
            {loginShow && (
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 sm:py-[16px] px-6 sm:px-[24px] rounded-full text-sm sm:text-base w-full sm:w-auto text-center mt-3"
                withGradientOverlay
                onClick={handleLoginClick}
              >
                Go To Dashboard
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;