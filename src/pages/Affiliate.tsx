import React, { useEffect, useState } from "react";
import bg from "../assets/affiliate-bg.png";
import fund from "../assets/fund.svg";
import affiliate from "../assets/affiliate-icon.svg";
import refresh from "../assets/refresh.svg";
import share from "../assets/share-black.svg";
import copy from "../assets/copy.svg";
import affiliateicon from "../assets/affiliate.svg";
import amount from "../assets/amount.svg";
import revenue from "../assets/revenue.svg";
import withdrawal from "../assets/withdrawal.svg";
import payment from "../assets/payment.svg";
import { useToast } from "../components/ui/Toast/ToastProvider";
import SharePopup from "../components/Social/SharePopup";
import { CiBank } from "react-icons/ci";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiPaypalLogo } from "react-icons/pi";
import AffiliateUsers from "../components/affiliate/AffiliateUsers";
import { DeletePaymentMethod, GenerateAffiliateCode, getMyRefferralCode, getPaymentMethodById, getPaymentMethods, getReferralEarning, getReferredUsers, withdrawalAmount } from "../Common/ServerAPI";
import Button from "../components/ui/Button";
import Select from "react-select";
import Modal from "../components/ui/Modal";
import AddPaymentMethodModal from "../components/affiliate/AddPaymentMethodModal";
import { HelpCircle } from "lucide-react";

interface ReferredUser {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  joined_date: string;
  last_activity: string;
  commission_earned: string;
  approved_commission: string;
  pending_commission: string;
  commission_status: "NO_COMMISSION" | "APPROVED" | "PENDING" | "PAID";
  total_payments: number;
  subscription_type: string;
  subscription_amount: string;
  payment_status: "Completed" | "Pending" | "Failed";
  commission_history: any[];
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Affiliate Users" },
];

const countryCode = [
  "+1", "+20", "+30", "+32", "+33", "+34", "+36", "+39", "+44", "+44", "+44",
  "+49", "+51", "+53", "+55", "+56", "+57", "+58", "+60", "+61", "+61", "+61",
  "+62", "+64", "+65", "+66", "+81", "+82", "+84", "+86", "+91", "+92", "+93",
  "+94", "+95", "+98", "+1242", "+1246", "+1264", "+1268", "+1284", "+1340",
  "+1441", "+1473", "+1671", "+1684", "+1767", "+1849", "+1876", "+1939",
  "+212", "+213", "+216", "+218", "+220", "+221", "+222", "+223", "+224",
  "+225", "+226", "+227", "+228", "+229", "+230", "+231", "+232", "+233",
  "+234", "+235", "+236", "+237", "+238", "+239", "+240", "+241", "+242",
  "+243", "+244", "+245", "+246", "+248", "+249", "+250", "+251", "+252",
  "+253", "+254", "+255", "+256", "+257", "+258", "+260", "+261", "+262",
  "+263", "+264", "+265", "+266", "+267", "+268", "+269", "+290", "+291",
  "+297", "+298", "+299", "+350", "+351", "+352", "+353", "+354", "+355",
  "+356", "+357", "+358", "+358", "+359", "+370", "+371", "+372", "+373",
  "+374", "+375", "+376", "+377", "+378", "+379", "+380", "+381", "+382",
  "+383", "+385", "+386", "+387", "+389", "+420", "+421", "+423", "+500",
  "+500", "+501", "+502", "+503", "+504", "+505", "+506", "+507", "+508",
  "+509", "+590", "+590", "+591", "+592", "+593", "+594", "+595", "+596",
  "+597", "+598", "+599", "+672", "+673", "+675", "+676", "+677", "+678",
  "+679", "+680", "+681", "+682", "+683", "+685", "+686", "+687", "+688",
  "+689", "+690", "+691", "+692", "+850", "+852", "+853", "+855", "+856",
  "+880", "+886", "+960", "+961", "+962", "+963", "+964", "+965", "+966",
  "+967", "+968", "+970", "+971", "+972", "+973", "+974", "+975", "+976",
  "+977", "+992", "+993", "+994", "+995", "+996", "+998"
];

export default function Affiliate() {
  const myReferralCode = localStorage.getItem("referral_code");
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("bank");
  const [currentReferralCode, setCurrentReferralCode] = useState<string | null>(myReferralCode);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [referreEarning, setReferreEarning] = useState<string>("0");
  const [pendingAmount, setPendingAmount] = useState<string>("0");
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState<any[]>([]);
  const [editMethodId, setEditMethodId] = useState<string | null>(null);
  const [editInitialData, setEditInitialData] = useState<any | null>(null);
  const [statistics, setStatistics] = useState({
    referral_revenue: { amount: "$0.00", change: "+0.0% vs Last Month", is_positive: true },
    commission_amount: { amount: "$0.00" },
    affiliate_count: { count: 0, change: "+0.0% vs Last Month", is_positive: true },
    last_withdrawal: { amount: "$0.00", total_this_month: "$0.00" }
  });
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCountryCode, setWithdrawCountryCode] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const countryCodeOptions = countryCode.map((code) => ({
    value: code,
    label: code,
  }));

  const totalPages = Math.ceil(referredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = Math.min(startIndex + usersPerPage, referredUsers.length);
  const currentUsers = referredUsers.slice(startIndex, endIndex);

  const baseUrl = window.location.origin;

  const handleShareToggle = () => setIsShareOpen((prev) => !prev);
  const handleShareClose = () => setIsShareOpen(false);

  useEffect(() => {
    handleGetPaymentMethod();
    let userID = localStorage.getItem("Id");
    if (userID) {
      myRefferralCode(userID);
      loadReferralEarning();
    }
  }, []);

  const cardData = [
    {
      title: "Referral Revenue",
      icon: revenue,
      value: statistics.referral_revenue.amount,
      change: statistics.referral_revenue.change,
      changeColor: statistics.referral_revenue.is_positive ? "#60C750" : "#E64646",
    },
    {
      title: "Commission Amount",
      icon: amount,
      value: statistics.commission_amount.amount,
      change: "This Month",
      changeColor: "#60C750",
    },
    {
      title: "Affiliate",
      icon: affiliateicon,
      value: statistics.affiliate_count.count.toString(),
      change: statistics.affiliate_count.change,
      changeColor: statistics.affiliate_count.is_positive ? "#60C750" : "#E64646",
    },
    {
      title: "Last Withdrawal",
      icon: withdrawal,
      value: statistics.last_withdrawal.amount,
      change: statistics.last_withdrawal.total_this_month,
      changeColor: "#60C750",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentReferralCode ? currentReferralCode : '');
      showToast({
        message: "copied!",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleGetPaymentMethod = async () => {
    try {
      const response = await getPaymentMethods();
      if (response.success) {
        setPaymentMethodsList(response.data?.data?.payment_methods || []);
        if (response.data?.data?.payment_methods?.length > 0) {
          const defaultMethod = response.data.data.payment_methods.find((m: any) => m.is_default);
          setSelectedId(defaultMethod?.id || response.data.data.payment_methods[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load payment methods", error);
      showToast({
        message: "Failed to load payment methods",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) {
      return;
    }

    try {
      const response = await DeletePaymentMethod(id);
      if (response.success) {
        showToast({
          message: "Payment method deleted successfully",
          type: "success",
          duration: 3000,
        });
        handleGetPaymentMethod();
      } else {
        showToast({
          message: response.error?.message || "Failed to delete payment method",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      showToast({
        message: "Failed to delete payment method",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleEditPaymentMethod = async (id: string) => {
    try {
      const res = await getPaymentMethodById(id);
      if (res.success) {
        const data = res.data?.data;
        setEditMethodId(id);
        setEditInitialData(data);
        setIsAddPaymentModalOpen(true);
      } else {
        showToast({
          message: res.error?.message || 'Failed to fetch payment method',
          type: 'error',
          duration: 3000
        });
      }
    } catch (e) {
      console.error('Error fetching payment method:', e);
      showToast({
        message: 'Failed to fetch payment method',
        type: 'error',
        duration: 3000
      });
    }
  };

  const myRefferralCode = async (userID: any) => {
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

  const handleGenerateCode = async () => {
    setIsRefreshing(true);
    try {
      const userId = localStorage.getItem("Id");
      if (!userId) {
        showToast({
          message: "User ID not found. Please login again.",
          type: "error",
          duration: 3000,
        });
        setIsRefreshing(false);
        return;
      }

      const payload = {
        user_id: userId,
      };
      const response = await GenerateAffiliateCode(payload);

      if (response?.data?.data?.referral_code) {
        const referralCode = response.data.data.referral_code;
        localStorage.setItem("referral_code", referralCode);
        setCurrentReferralCode(referralCode);

        showToast({
          message: "Referral code refreshed successfully!",
          type: "success",
          duration: 2000,
        });
      } else {
        showToast({
          message: "Failed to generate referral code. Please try again.",
          type: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating code", error);
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const withdrawalRequest = () => {
    const balance = Number(referreEarning);
    if (isNaN(balance) || balance < 50) {
      showToast({
        message: "Please wait .. minimum withdrawal limit is $50",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsWithdrawModalOpen(true);
    setWithdrawAmount('');
    setWithdrawCountryCode(countryCode[0]); // Set default country code
    setWithdrawPhone('');
    setWithdrawError('');
  };

  const loadReferralEarning = async () => {
    try {
      const userpayload = {
        user_id: localStorage.getItem("Id"),
      };
      const userData = await getReferralEarning(userpayload);

      const data = userData.data?.data;

      setReferreEarning(data?.available_amount || '0');
      setPendingAmount(data?.pending_commission || '0');

      if (data?.statistics) {
        setStatistics({
          referral_revenue: data.statistics.referral_revenue || {
            amount: "$0.00",
            change: "+0.0% vs Last Month",
            is_positive: true
          },
          commission_amount: data.statistics.commission_amount || {
            amount: "$0.00"
          },
          affiliate_count: data.statistics.affiliate_count || {
            count: 0,
            change: "+0.0% vs Last Month",
            is_positive: true
          },
          last_withdrawal: data.statistics.last_withdrawal || {
            amount: "$0.00",
            total_this_month: "$0.00"
          }
        });
      }
    } catch (err) {
      console.error("Failed to load referral earnings", err);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawError('Enter a valid amount.');
      return;
    }
    if (amountNum < 50) {
      setWithdrawError('Minimum withdrawal amount is $50.');
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
      const response = await withdrawalAmount(payload); // Replace with your API
      // console.log('Withdrawal response:', response);
      if (response.success) {
        setIsWithdrawModalOpen(false);
        showToast({
          message: 'Withdrawal request submitted successfully.',
          type: "success",
          duration: 5000,
        });
      }
      else {
        setIsWithdrawModalOpen(false);
        showToast({
          message: response.error?.message,
          type: "error",
          duration: 5000,
        });
      }
    } catch (err) {
      setWithdrawError('Failed to submit request. Try again.');
    }
  };

  const loadReferredUsers = async (referralcode: string) => {
    try {
      const payload = { referralcode };
      const res = await getReferredUsers(payload);

      const usersData = res.data?.data?.referrals?.map((user: any) => ({
        ...user,
        payment_status: user.commission_status === "PAID" || user.commission_status === "APPROVED"
          ? "Completed"
          : user.commission_status === "PENDING"
            ? "Pending"
            : "Failed"
      })) || [];
      setReferredUsers(usersData);
    } catch (err) {
      console.error("Failed to load referred users", err);
      setReferredUsers([]);
    }
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'bank_transfer':
        return <CiBank size={30} />;
      case 'paypal':
        return <PiPaypalLogo size={30} />;
      default:
        return <CiBank size={30} />;
    }
  };

  const formatPaymentType = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      default:
        return type;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 mt-2 px-1">
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => {
              setActiveTab(tab.id as "overview" | "users");
              if (tab.id === "users" && currentReferralCode) {
                loadReferredUsers(currentReferralCode);
              }
            }}
            style={{
              fontFamily: "Plus Jakarta Sans",
            }}
            className={`w-fit min-w-[120px] p-3 ${activeTab === tab?.id
              ? "bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(151,71,255,0.2)_100%)] backdrop-blur-sm border-b border-[#9747FF]"
              : "bg-transparent"
              }  text-[#9747FF] font-medium text-sm`}
          >
            {tab?.label}
          </button>
        ))}
      </div>
      {activeTab === "overview" ? (
        <div className="w-full h-full flex flex-col gap-3">
          <div className="flex flex-col gap-[24px] p-[24px] rounded-xl bg-white">
            <div className="flex flex-col gap-3">
  <div className="flex items-center gap-2">
    <h3 className="text-2xl font-semibold font-['Poppins',Helvetica] bg-[linear-gradient(90deg,#6340FF_0%,#D748EA_100%)] bg-clip-text text-transparent">
      Your Affiliate
    </h3>

    {/* Tooltip Wrapper */}
    <div className="relative group cursor-pointer">
      <HelpCircle className="h-5 w-5 text-gray-400 hover:text-gray-700" />

      {/* Tooltip Content */}
      <div className="absolute left-1/2 -translate-x-1/2 mt-4 hidden group-hover:block 
                      whitespace-nowrap bg-gray-900 text-white text-sm py-2 px-3 rounded shadow-lg z-10">
Share CNESS with others and enjoy a 10% reward 
<br></br>each time your referred users make a platform fee.
      </div>
    </div>
  </div>

  <p className="text-base font-normal text-[#7A7A7A] font-['Open_Sans',Helvetica]">
    Monitor your affiliate income and handle your withdrawals efficiently.
  </p>
</div>
            <div className="flex w-full h-full gap-3">
              <div className="flex flex-col gap-6 relative w-full md:w-[55%] py-[24px] px-[32px] bg-[linear-gradient(96.64deg,#7077FE_0%,#CE8FFB_79.88%,#FFF2C0_158.59%)] border border-[#ECEEF2] rounded-xl">
                <img
                  src={bg}
                  alt="affiliate bg"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative flex items-center justify-between">
                  <p className="text-base font-semibold text-white font-['Open_Sans',Helvetica]">
                    Available Balance
                  </p>
                  <button
                    onClick={withdrawalRequest}
                    className="bg-white py-3 px-[18px] flex gap-2 border border-[#ECEEF2] rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] cursor-pointer">
                    <img
                      src={fund}
                      alt="fund icon"
                      className="w-[18px] h-[18px]"
                    />
                    <span className="font-normal text-sm text-[#222224] font-['Open_Sans',Helvetica]">
                      Withdraw Funds
                    </span>
                  </button>
                </div>
                <h3 className="text-[42px] font-bold font-['Open_Sans',Helvetica] text-white">
                  ${referreEarning}
                </h3>
                <div className="w-full border border-[#ECEEF2]"></div>
                <p className="text-lg font-medium text-[#F7E074] font-['Poppins',Helvetica]">
                  Pending: ${pendingAmount}
                </p>
              </div>
              <div className="w-full md:w-[45%] bg-white border border-[#ECEEF2] p-3 rounded-xl flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={affiliate}
                      alt="fund icon"
                      className="w-[32px] h-[32px]"
                    />
                    <p className="font-medium text-base text-[#222224] font-['Poppins',Helvetica]">
                      Affiliate
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateCode}
                    disabled={isRefreshing}
                    className="bg-[#7077FE] py-[8px] px-3 flex items-center gap-2 border border-[#ECEEF2] rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                    <img
                      src={refresh}
                      alt="fund icon"
                      className="w-[18px] h-[18px]"
                    />
                    <span className="font-normal text-base text-white font-['Open_Sans',Helvetica]">
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </span>
                  </button>
                </div>
                <div className="px-[4px] flex flex-col gap-[18px]">
                  <div className="flex flex-col gap-[18px]">
                    <p className="font-semibold text-sm text-[#242424] font-['Poppins',Helvetica]">
                      Code :
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-semibold font-['Poppins',Helvetica] text-[#7077FE]">
                        {currentReferralCode}
                      </h3>
                      <div className="py-[8px] flex gap-[11px]">
                        <img
                          src={copy}
                          alt="copy icon"
                          className="w-[20px] h-[20px] cursor-pointer"
                          onClick={handleCopy}
                        />
                        <div className="relative">
                          <img
                            src={share}
                            alt="share icon"
                            className="w-[20px] h-[20px] cursor-pointer"
                            onClick={handleShareToggle}
                          />
                          {isShareOpen && (
                            <SharePopup
                              isOpen={true}
                              onClose={handleShareClose}
                              url={currentReferralCode ? currentReferralCode : ''}
                              position="left"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[9px]">
                  <p className="font-medium text-sm text-[#242424] font-['Poppins',Helvetica]">
                    Affiliate Link:
                  </p>
                  <p className="font-medium text-sm text-[#64748B] font-['Poppins',Helvetica]">
                    {baseUrl}/sign-up?referral_code={currentReferralCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {cardData.map((card, idx) => (
              <div
                key={idx}
                className="bg-white w-full min-h-[234px] border border-[#ECEEF2] p-3 flex flex-col gap-5 rounded-xl hover:shadow-lg transition-transform duration-300"
              >
                <div className="pb-3 border-b border-[#0000001A] flex items-center gap-3.5">
                  <img
                    src={card.icon}
                    alt={`${card.title} icon`}
                    className="w-[32px] h-[32px]"
                  />
                  <p className="font-medium text-base text-[#222224] font-['Poppins',Helvetica]">
                    {card.title}
                  </p>
                </div>
                <div className="px-[8px] flex flex-col gap-[18px]">
                  <h3 className="text-[32px] font-semibold font-['Poppins',Helvetica] text-[#222224]">
                    {card.value}
                  </h3>
                  <p
                    className="font-medium text-base font-['Poppins',Helvetica]"
                    style={{ color: card.changeColor }}
                  >
                    {card.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5 p-3 rounded-xl bg-white border border-[#ECEEF2]">
            <div className="pb-3 border-b border-[#0000001A] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <img
                  src={payment}
                  alt="payment icon"
                  className="w-[32px] h-[32px]"
                />
                <p className="font-medium text-base text-[#222224] font-['Poppins',Helvetica]">
                  Payment Methods
                </p>
              </div>
              <span
                onClick={() => setIsAddPaymentModalOpen(true)}
                className="font-medium text-sm text-[#9747FF] font-['Poppins',Helvetica] underline cursor-pointer">
                + Add More Payment Method
              </span>
            </div>
            {paymentMethodsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <p className="text-[#7A7A7A] font-['Open_Sans',Helvetica]">
                  No payment methods added yet
                </p>
              <button
  onClick={() => setIsAddPaymentModalOpen(true)}
  className="rounded-full px-[20px] py-[10px] text-base font-normal text-white disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                  }}
>
  Add Your First Payment Method
</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {paymentMethodsList.map((method) => {
                  const isSelected = method.id === selectedId;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedId(method.id)}
                      className={`w-full h-full p-[18px] flex flex-col gap-[18px] rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] border cursor-pointer transition-all duration-200
                  ${isSelected
                          ? "bg-[#9747FF0D] border-[#9747FF]"
                          : "bg-white border-[#ECEEF2]"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`${isSelected ? "text-[#9747FF]" : "text-black"}`}>
                          {getPaymentIcon(method.payment_type)}
                        </div>
                        {isSelected && (
                          <IoIosCheckmarkCircleOutline
                            className="text-[#9747FF]"
                            size={30}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="font-semibold text-base text-[#222224] font-['Open_Sans',Helvetica]">
                          {formatPaymentType(method.payment_type)}
                        </p>

                        {/* Display info based on payment type */}
                        {method.payment_type === 'bank_transfer' && (
                          <p className="font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                            {method.display_text || method.account_number_masked}
                          </p>
                        )}

                        {method.payment_type === 'paypal' && (
                          <p className="font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                            {method.display_text || method.paypal_email}
                          </p>
                        )}

                        <div className="flex justify-between items-center gap-3">
                          <p className="font-normal text-sm text-[#9747FF] font-['Open_Sans',Helvetica]">
                            {method.processing_time}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePaymentMethod(method.id);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
                              title="Delete payment method"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            {method.id === selectedId && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPaymentMethod(method.id);
                                }}
                                className="px-3 py-1 rounded-full text-sm bg-[#9747FF0D] text-[#9747FF] hover:bg-[#9747FF1A] transition-colors"
                                title="Edit payment method"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
          <AffiliateUsers
            users={referredUsers}
            totalPages={totalPages}
            currentUsers={currentUsers}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </div>
      )
      }
      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => {
          setIsAddPaymentModalOpen(false);
          setEditMethodId(null);
          setEditInitialData(null);
        }}
        onSuccess={() => {
          handleGetPaymentMethod();
          setEditMethodId(null);
          setEditInitialData(null);
        }}
        editMode={!!editMethodId}
        methodId={editMethodId || undefined}
        initialData={editInitialData || undefined}
      />
      <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)}>
        <form onSubmit={handleWithdrawSubmit} className="p-0 min-w-[400px] w-full">
          <h2 className="text-lg font-bold mb-4">Withdrawal Request</h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
              Request Amount
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none"
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm text-[#222224] font-['Poppins',Helvetica]">
              Phone Number (with country code)
            </label>
            <div className="flex gap-2">
              <Select
                options={countryCodeOptions}
                value={countryCodeOptions.find(
                  (option) => option.value === withdrawCountryCode
                )}
                onChange={(selectedOption) =>
                  setWithdrawCountryCode(selectedOption?.value ?? '')
                }
                isSearchable={true}
                placeholder="Code"
                className="w-[120px]"
              />
              <input
                type="text"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#7077FE] focus:border-transparent outline-none"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {withdrawError && (
            <div className="text-red-500 text-sm mb-2">{withdrawError}</div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="white-outline"
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-6 py-2 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="px-6 py-2 rounded-full"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div >
  );
}
