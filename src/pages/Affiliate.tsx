import { useState } from "react";

export default function Affiliate() {
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Affiliate Users" },
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
            className={`w-fit min-w-[120px] p-[12px] ${
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
              <div className="w-full md:w-[55%] py-[24px] px-[32px] bg-[linear-gradient(96.64deg,#7077FE_0%,#CE8FFB_79.88%,#FFF2C0_158.59%)] border border-[#ECEEF2] rounded-xl"></div>
              <div className="w-full md:w-[45%]"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-3"></div>
      )}
    </div>
  );
}
