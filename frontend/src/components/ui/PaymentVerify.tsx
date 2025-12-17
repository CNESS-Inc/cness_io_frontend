import { useEffect, useState } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import { GetPaymentVerify } from "../../Common/ServerAPI";
import Button from "./Button";
import { useToast } from "./Toast/ToastProvider";
import SignupAnimation from "./SignupAnimation";
import { Link } from "react-router-dom";


interface PaymentVerifyData {
  session_id: string;
}

const PaymentVerify = () => {
  const location = useLocation();
  const [loginShow, setLoginShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

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
        session_id: decodedToken,
      };

      const res = await GetPaymentVerify(verifyData);
      console.log("Verification response:", res);
      setLoginShow(true);
    } catch (error: any) {
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
    localStorage.setItem("completed_step", "2");
    navigate("/dashboard");
  };

  return (
    <>
      <div className="relative min-h-screen flex flex-col bg-white">
        <div className="relative w-full h-[250px]">
          {/* Diagonal Gradient Background */}
          <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[200px] lg:h-[300px] z-0">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                //background: "linear-gradient(135deg, #7F57FC, #F07EFF, #7FD9F2)",
                clipPath: "polygon(0 0, 100% 0, 100% 40%, 0% 100%)",
              }}
            />
            <SignupAnimation />
          </div>

          <div className="relative w-full h-[250px]">
            <div className="absolute top-1 left-5 z-30 p-0">
              <Link to="/">
                <img
                  src={`https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd`}
                  alt="logo"
                  className="w-[150px] h-[150px] object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className=" flex flex-col">
          <div className="absolute top-[100px] sm:top-[140px] md:top-[180px] left-0 right-0 flex justify-center z-10 px-4">
            <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl px-4 sm:px-10 py-8 sm:py-12 space-y-10">
              <div className="flex items-center justify-center h-[200px">
                <div className="text-center flex flex-col">
                    {error ? (
              <>
                <h1 className="text-xl font-semibold text-red-600">
                  We couldn’t confirm your payment.
                </h1>
                <p className="text-sm text-gray-600">{error}</p>

                <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/pricing"
                    className="inline-flex justify-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
                  >
                    Retry Payment
                  </Link>
                  
                </div>
              </>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentVerify;
