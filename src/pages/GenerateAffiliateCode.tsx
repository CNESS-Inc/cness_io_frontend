import { useState, useRef, useEffect } from "react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { 
  GenerateAffiliateCode, 
  getReferredUsers, 
  getMyRefferralCode, 
  getReferralEarning,
  withdrawalAmount
} from "../Common/ServerAPI";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import Select from "react-select";

import { useToast } from "../components/ui/Toast/ToastProvider";

interface ReferredUser {
  id: string;
  username: string;
  email: string;
  completed_step?: number;
}

const AffiliateGenerateCode = () => {
  const myReferralCode = localStorage.getItem("referral_code");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [referreEarning, setReferreEarning] = useState(null);
  const [activeTab, setActiveTab] = useState<'users' | 'code'>('code');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  
  const [currentReferralCode, setCurrentReferralCode] = useState<string | null>(myReferralCode);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const baseUrl = window.location.origin;

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCountryCode, setWithdrawCountryCode] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const { showToast } = useToast();

  const countryCode = ["+376", "+971", "+93", "+1268", "+355", "+1264", "+374", "+244", "+672", "+54", "+1684", "+43", "+61", "+297", "+358", "+994", "+387", "+1246", "+880", "+32", "+226", "+359", "+973", "+257", "+229", "+590", "+1441", "+673", "+591", "+55", "+1242", "+975", "+267", "+375", "+501", "+1", "+61", "+243", "+236", "+242", "+41", "+225", "+682", "+56", "+237", "+86", "+57", "+506", "+53", "+238", "+61", "+357", "+420", "+49", "+253", "+45", "+1767", "+1849", "+213", "+593", "+372", "+20", "+291", "+34", "+251", "+358", "+679", "+500", "+691", "+298", "+33", "+241", "+44", "+1473", "+995", "+594", "+44", "+233", "+350", "+299", "+220", "+224", "+590", "+240", "+30", "+500", "+502", "+1671", "+245", "+595", "+852", "+504", "+385", "+509", "+36", "+62", "+353", "+972", "+44", "+91", "+246", "+964", "+98", "+354", "+39", "+44", "+1876", "+962", "+81"];

  const countryCodeOptions = countryCode.map((code) => ({
    value: code,
    label: code,
  }));


  useEffect(() => {
    let userID = localStorage.getItem("Id");
    if (userID) {
      myRefferralCode(userID);
    }
  }, []);

  const myRefferralCode = async (userID: any) =>{
    try {
      const payload = {
        user_id: userID,
      };
      const res = await getMyRefferralCode(payload);
      const referralCode = res.data?.data?.referral_code;
      if (referralCode) {
        setCurrentReferralCode(referralCode);
        localStorage.setItem("referral_code", referralCode);
      }
      } catch (err) {
        console.error("Failed to load referred users", err);
      }
  };
 
  const loadReferredUsers = async (referralcode: string) => {
    try {
      const userpayload = {
        user_id: localStorage.getItem("Id"),
      };
      const userData = await getReferralEarning(userpayload);
      
      setReferreEarning(userData.data?.data?.referralEarning?.referral_amount || '0');

      const payload = { referralcode };
      const res = await getReferredUsers(payload);
      setReferredUsers(res.data?.data?.referralUsers || []);
    } catch (err) {
      console.error("Failed to load referred users", err);
    }
  };


  const handleGenertateCode = async () => {
    setIsCopied(false);
    setApiMessage(null);
    try {
      const payload = {
        user_id: localStorage.getItem("Id"),
      };
      const response = await GenerateAffiliateCode(payload);

      if (response?.data?.data?.referral_code) {
        const referralCode = response.data.data.referral_code;
        const referralLink = `${baseUrl}/sign-up?referral_code=${response.data.data.referral_code}`;
        // Save the generated code to localStorage
        localStorage.setItem("referral_code", referralCode);

        setCurrentReferralCode(referralCode);

        setApiMessage(referralLink);
        setTimeout(() => setIsModalOpen(true), 1000);
      } else {
        setApiMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error generating code", error);
      setApiMessage("Something went wrong. Please try again.");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const copyToClipboard = (text: string) => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
  };

  const copyReferralCode = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const tweetText = `Earned the CNESS Inspired Certification! Proud to lead with conscious values. Join us at cness.io`;
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const withdrawalRequest = () => {
    setIsWithdrawModalOpen(true);
    setWithdrawAmount('');
    setWithdrawCountryCode(countryCode[0]); // Set default country code
    setWithdrawPhone('');
    setWithdrawError('');
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError('Enter a valid amount.');
      return;
    }
    if (amountNum > Number(referreEarning)) {
      setWithdrawError('Requested amount exceeds your referral earning.');
      return;
    }
    if (!withdrawPhone.trim()) {
      setWithdrawError('Enter your phone number.');
      return;
    }
    
    try {
      // Example payload
      const payload = {
        user_id: localStorage.getItem("Id"),
        amount: amountNum,
        country_code: withdrawCountryCode,
        phone: withdrawPhone,
      };
      const response =  await withdrawalAmount(payload); // Replace with your API
      // console.log('Withdrawal response:', response);
      if(response.data?.status !== 'success'){
        setIsWithdrawModalOpen(false);
        showToast({
          message: 'Withdrawal request submitted successfully.',
          type: "error",
          duration: 5000,
        });
      }
    } catch (err) {
      setWithdrawError('Failed to submit request. Try again.');
    }
  };

  return (
    <>
      <div className="w-full min-h-screen mt-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 border-b border-gray-200 mb-6 mt-8 px-4 sm:px-6">
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'code' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('code')}
          >
            Affiliate Code
          </button>
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => {
              setActiveTab('users');
              // Load referred users when this tab is clicked
              if (currentReferralCode) {
                loadReferredUsers(currentReferralCode);
              }
            }}
          >
            Affiliate Users
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="min-h-screen bg-white px-4 py-6 sm:px-6 font-sans">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold mb-4">Your Referral Earning: {referreEarning}</h3>
              
              <div>
                <Button
                  type="button"
                  onClick={withdrawalRequest}
                  >
                  Withdraw
                </Button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4">Your Referred Users</h3>

            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referral User Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  </tr>
                </thead>
                
                  {referredUsers.length > 0 ? (
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referredUsers.map((user, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.completed_step === 2 ? (
                              <span>Paid</span>
                            ) : (
                              <span>Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={3} className="text-center px-4 py-2">No referred users yet.</td>
                      </tr>
                    </tbody>
                    
                  )}

                
              </table>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'code' && (
          <div className="min-h-screen bg-white p-6 font-sans">
            {!currentReferralCode ? (
              <>
                <h2 className="text-xl text-[#222224] font-bold mb-4">Generate Your Affiliate Code Here</h2>
                <button
                  onClick={handleGenertateCode}
                  className="mt-2 bg-[#7077fe] text-white px-4 py-2 cursor-pointer text-[16px] font-regular rounded-3xl"
                >
                  Generate Code
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Affiliate Details</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-sm"><span className="font-bold">Code:</span> <span>{currentReferralCode} </span></p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <p className="text-sm"><span className="font-bold">Affiliate Link:</span>  <span>{baseUrl}/sign-up?referral_code={currentReferralCode}</span></p>
                    <div className="relative w-fit ms-3 ">
                      <button
                        className="bg-white border cursor-pointer border-gray-200 text-[#64748B] text-sm font-medium px-5 py-2 h-full rounded-full shadow-md"
                        onClick={toggleMenu}
                        style={{ cursor: "pointer" }}
                      >
                        Share
                      </button>
                      {showMenu && (
                        <div
                          className="absolute top-10 right-0 mt-3 bg-white shadow-lg rounded-lg p-3 z-10 min-w-[200px] max-w-[300px]"
                          ref={menuRef}
                        >
                          <ul className="flex items-center gap-4">
                            <li>
                              <FacebookShareButton url={`${baseUrl}/sign-up?referral_code=${myReferralCode}`}>
                                <FaFacebook size={32} color="#4267B2" />
                              </FacebookShareButton>
                            </li>
                            <li>
                              <LinkedinShareButton url={`${baseUrl}/sign-up?referral_code=${myReferralCode}`}>
                                <FaLinkedin size={32} color="#0077B5" />
                              </LinkedinShareButton>
                            </li>
                            <li>
                              <FaInstagram size={32} color="#C13584" />
                            </li>
                            <TwitterShareButton url={`${baseUrl}/sign-up?referral_code=${myReferralCode}`} title={tweetText}>
                              <FaTwitter size={32} color="#1DA1F2" />
                            </TwitterShareButton>
                            <li>
                              <WhatsappShareButton url={`${baseUrl}/sign-up?referral_code=${myReferralCode}`}>
                                <FaWhatsapp size={32} color="#1DA1F2" />
                              </WhatsappShareButton>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>


                    <button
                      onClick={() => copyReferralCode(`${baseUrl}/sign-up?referral_code=${myReferralCode}`)}
                      className="mt-0 ms-3 text-sm bg-[#7077fe] text-white px-5 py-2 rounded-3xl cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center px-4 py-6 max-w-md w-full">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-[#7077FE] to-[#F07EFF]">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {apiMessage && (
            <div className="openSans text-center p-4">
              <p className="mb-2">{apiMessage}</p>
              <button
                onClick={() => copyToClipboard(apiMessage)}
                className="mt-2 bg-[#7077fe] text-white px-4 py-2 rounded-3xl cursor-pointer"
              >
                {isCopied ? "Copied..." : "Copy to Clipboard"}
              </button>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={closeModal}
              variant="gradient-primary"
              className="bg-white border cursor-pointer border-gray-200 text-[#64748B] text-sm font-medium px-5 py-2 h-full rounded-full shadow-md"
            >
              Got it!
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)}>
        <form onSubmit={handleWithdrawSubmit} className="p-0 min-w-[400px] w-full">
          <h2 className="text-lg font-bold mb-4">Withdrawal Request</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Request Money</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Phone Number (with country code)</label>
            <div className="flex justify-between ">
              <Select
                options={countryCodeOptions}
                value={countryCodeOptions.find(option => option.value === withdrawCountryCode)}
                onChange={(selectedOption) =>
                  setWithdrawCountryCode(selectedOption?.value ?? '')
                }
                isSearchable={false}
                placeholder="Code"
              />
              <input
                type="text"
                value={withdrawPhone}
                onChange={e => setWithdrawPhone(e.target.value)}
                className="ml-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Enter phone number"
                required
              />
            </div>
            
          </div>
          {withdrawError && <div className="text-red-500 mb-2">{withdrawError}</div>}
          <div className="flex justify-between flex-row-reverse gap-3 mt-4">
            <Button type="submit" variant="gradient-primary">Submit</Button>
            <Button type="button" variant="white-outline" onClick={() => setIsWithdrawModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AffiliateGenerateCode;
