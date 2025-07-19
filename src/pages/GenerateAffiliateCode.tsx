import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

import { GenerateAffiliateCode, getReferredUsers } from "../Common/ServerAPI";
const AffiliateGenerateCode = () => {
  // const { id } = localStorage.Id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [referredUsers, setReferredUsers] = useState<any[]>([]); // <== NEW
  const baseUrl = window.location.origin; 
  const myReferralCode = localStorage?.referral_code || null;

  useEffect(() => {
    if (myReferralCode) {
      loadReferredUsers(myReferralCode);
    }
  }, [myReferralCode]);

  const loadReferredUsers = async (referralcode: string) => {
    try {
      const payload = {
        referralcode: referralcode,
      };
      const res = (await getReferredUsers(payload));
      setReferredUsers(res.data?.data?.referralUsers); // Adjust based on actual API response
    } catch (err) {
      console.error("Failed to load referred users", err);
    }
  };

  const handleGenertateCode = async () => {
    setIsCopied(false);
    setApiMessage(null);
   try{
    const payload = {
      user_id: localStorage.Id,
    };
    const response = (await GenerateAffiliateCode(payload));
    
    if (response) {
      setApiMessage(baseUrl + '/sign-up?referral_code='+ response?.data?.data?.referral_code);
      setTimeout(() => {
        // onSuccess();
      }, 500);
      setTimeout(() => {
        setIsModalOpen(true);
      }, 1000);
      
    }
    else {
      setApiMessage("Something went wrong. Please try again.");
    }

   } catch (error: any){
    if (error?.response?.data?.error) {
    }
    else {
      // setApiMessage(error.message || "An error occurred during registration");
    }
   } 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // navigate("/log-in");
  };
  const copyToClipboard = (code: string) => {
    setIsCopied(true);
    navigator.clipboard.writeText(code);
  };

  const copyReferralCode = (link: string)=>{
    navigator.clipboard.writeText(link);
  }
  
  return (
    <>
      {!myReferralCode && (
        <div className="max-w-6xl mx-auto my-10 p-10 bg-white rounded-xl shadow-md min-h-[750px]">
          
          <h2 className="text-xl font-bold mb-4">Generate Your Affiliate Code Here</h2>

          <button
            onClick={() => handleGenertateCode()}
            className="mt-2 bg-linear-to-r from-[#7077FE] to-[#F07EFF]
  text-white px-4 py-2 cursor-pointer text-[16px] font-regular rounded-3xl"
          >
            Generate Code
          </button>
          
          
        </div>
      )} :{( 
        <div className="max-w-6xl mx-auto my-10 p-10 bg-white rounded-xl shadow-md min-h-[750px]">
          
          <h2 className="text-xl font-bold mb-4">Your Affiliate Code</h2>

          <button
            onClick={() => copyReferralCode(baseUrl + '/sign-up?referral_code='+ myReferralCode)}
            className="mt-2 bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-4 py-2 rounded-3xl cursor-pointer"
          >
            Copy Code
          </button>

          {/* Referred Users List */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">Your Referred Users</h3>
            {referredUsers.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {referredUsers.map((user, idx) => (
                  <li key={idx}>{user.username} ({user.email})</li>
                ))}
              </ul>
            ) : (
              <p>No referred users yet.</p>
            )}
          </div>
          
          
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center p-6 max-w-md">
          <div className="mx-auto flex items-center justify-center h-50 w-50 rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF] ">
            <svg
              className="h-30 w-30 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          {apiMessage && (
            <div
              className={`openSans text-center p-4 flex flex-col justify-center items-center ${
                apiMessage.includes("verification")
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              {apiMessage}
              <button
                onClick={() => copyToClipboard(apiMessage)}
                className="mt-2 bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-4 py-2 block mx-auto w-4/12 rounded-3xl cursor-pointer"
              >
                {isCopied ? "Copied..." : "Copy to Clipboard"}
              </button>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={closeModal}
              variant="gradient-primary"
              className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
            >
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AffiliateGenerateCode;
