import React, { useState } from "react";
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
import { LiaCreditCardSolid } from "react-icons/lia";

export default function Affiliate() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("bank");
  const dynamicKey = "CNESS1008443218";

  const handleShareToggle = () => setIsShareOpen((prev) => !prev);
  const handleShareClose = () => setIsShareOpen(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dynamicKey);
      showToast({
        message: "copied!",
        type: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Affiliate Users" },
  ];

  const cardData = [
    {
      title: "Referral Revenue",
      icon: revenue,
      value: "$ 124,576",
      change: "+10.5% vs Last Month",
      changeColor: "#60C750",
    },
    {
      title: "Commission Amount",
      icon: amount,
      value: "$ 4,576",
      change: "This Month",
      changeColor: "#60C750",
    },
    {
      title: "Affiliate",
      icon: affiliateicon,
      value: "156",
      change: "-8.3% vs Last Month",
      changeColor: "#E64646",
    },
    {
      title: "Last Withdrawal",
      icon: withdrawal,
      value: "$ 4,576",
      change: "This Month",
      changeColor: "#60C750",
    },
  ];

  const paymentMethods = [
    {
      id: "bank",
      title: "Bank Transfer",
      maskedInfo: "******4523",
      processingTime: "3-5 Business Days",
      icon: <CiBank size={30} />,
      selected: true,
    },
    {
      id: "paypal",
      title: "PayPal",
      maskedInfo: "user@example.com",
      processingTime: "Instant",
      icon: <PiPaypalLogo size={30} />,
      selected: false,
    },
    {
      id: "credit-card",
      title: "Credit Card",
      maskedInfo: "**** **** **** 1234",
      processingTime: "Instant",
      icon: <LiaCreditCardSolid size={30} />,
      selected: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab.id as "overview" | "users")}
            style={{
              fontFamily: "Plus Jakarta Sans",
            }}
            className={`w-fit min-w-[120px] p-3 ${
              activeTab === tab?.id
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
              <h3 className="text-2xl font-semibold font-['Poppins',Helvetica] bg-[linear-gradient(90deg,#6340FF_0%,#D748EA_100%)] bg-clip-text text-transparent">
                Your Affiliate
              </h3>
              <p className="text-base font-normal text-[#7A7A7A] font-['Open_Sans',Helvetica]">
                Monitor your affiliate income and handle your withdrawals
                efficiently.
              </p>
            </div>
            <div className="flex w-full h-full gap-3">
              <div className="flex flex-col gap-6 relative w-full md:w-[55%] py-[24px] px-[32px] bg-[linear-gradient(96.64deg,#7077FE_0%,#CE8FFB_79.88%,#FFF2C0_158.59%)] border border-[#ECEEF2] rounded-xl">
                <img
                  src={bg}
                  alt="affiliate bg"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-white font-['Open_Sans',Helvetica]">
                    Available Balance
                  </p>
                  <button className="bg-white py-3 px-[18px] flex gap-2 border border-[#ECEEF2] rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
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
                  $20,881.61
                </h3>
                <div className="w-full border border-[#ECEEF2]"></div>
                <p className="text-lg font-medium text-[#F7E074] font-['Poppins',Helvetica]">
                  Pending: $3,686.28
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
                  <button className="bg-[#7077FE] py-[8px] px-3 flex items-center gap-2 border border-[#ECEEF2] rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                    <img
                      src={refresh}
                      alt="fund icon"
                      className="w-[18px] h-[18px]"
                    />
                    <span className="font-normal text-base text-white font-['Open_Sans',Helvetica]">
                      Refresh
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
                        {dynamicKey}
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
                              url={dynamicKey}
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
                    https://cness.app/ref/cness2024-affiliate-xyz123
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
              <span className="font-medium text-sm text-[#9747FF] font-['Poppins',Helvetica] underline cursor-pointer">
                + Add More Payment Method
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => {
                const isSelected = method.id === selectedId;
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedId(method.id)}
                    className={`w-full h-full p-[18px] flex flex-col gap-[18px] rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)] border cursor-pointer 
                  ${
                    isSelected
                      ? "bg-[#9747FF0D] border-[#9747FF]"
                      : "bg-white border-[#ECEEF2]"
                  }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={` ${
                          isSelected
                            ? "text-[#9747FF]"
                            : "text-black"
                        }`}
                      >
                        {React.cloneElement(method.icon, {
                          size: 30,
                        })}
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
                        {method.title}
                      </p>
                      <p className="font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                        {method.maskedInfo}
                      </p>
                      <p className="font-normal text-sm text-[#9747FF] font-['Open_Sans',Helvetica]">
                        {method.processingTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-3"></div>
      )}
    </div>
  );
}
