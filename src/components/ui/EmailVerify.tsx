import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GetEmailVerify } from "../../Common/ServerAPI";
import Button from "./Button";

const EmailVerify = () => {
  const location = useLocation();
  const [loginShow, setLoginShow] = useState(false);
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    return { token };
  };

  const { token } = getQueryParams();

  const verify = async () => {
    try {
      const formattedData = {
        token: decodeURIComponent(token),
      };
      const res = await GetEmailVerify(formattedData);
      console.log("🚀 ~ verify ~ res:", res);
      setLoginShow(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-lg font-semibold">
          Your Email is verified. Click on login button to continue.
        </h1>
        {loginShow ? (
          <Button
              className="bg-[#7077FE] py-3 sm:py-[16px] px-6 sm:px-[24px] rounded-full text-sm sm:text-base w-full sm:w-auto text-center mt-3"
              withGradientOverlay
              onClick={handleLoginClick}
            >
              Login
            </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
