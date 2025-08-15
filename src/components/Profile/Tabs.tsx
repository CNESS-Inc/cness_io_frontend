import React, { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConnectionsCardProps = {
  title: string;
  subtitle?: string;
  tabs: string[];
  label?: string;
  hashtags?: string[];
  onSearch?: (value: string) => void;
  onTabChange?:(tab: string) => void;
};

const ConnectionsCard: React.FC<ConnectionsCardProps> = ({
  title,
  subtitle,
  tabs,
  label,
  hashtags = [],
  onSearch,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab); // ✅ Now it's "read" and used
    }
  };

  return (
    <div
      className="rounded-[12px] border border-gray-200 bg-white flex flex-col"
      style={{
        width: "100%",
        gap: "18px",
        paddingTop: "18px",
        paddingBottom: "18px"
      }}
    >
      {/* Top Section */}
      <div
        className="flex items-center justify-between px-6"
        style={{ height: "57px" }}
      >
        <div className="flex items-center gap-3">
          

          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          
        </div>
        {label && (
          <span className="text-xs px-2 py-1 bg-[#9747FF] text-[#9747FF] rounded-full">
            {label}
          </span>
          
        )}
        <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
      </div>

      {/* Search + Hashtags */}
<div className="flex items-center px-6 gap-4">
        {/* Search Input */}
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-[300px] bg-white">
          <span className="text-gray-500 text-sm mr-2">#</span>
          <input
            type="text"
            placeholder="AI"
            value={searchValue}
            onChange={handleSearch}
            className="flex-1 text-sm outline-none"
          />
          <Search className="w-4 h-4 text-gray-400" />
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-3 text-sm text-teal-400">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="cursor-pointer hover:underline"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
  className="flex border-t border-gray-200 -mx-6 px-6"
        style={{
          height: "50px",
          gap: "12px",
          paddingTop: "8px",
        }}
      >
      {tabs.map((tab) => (
  <button
    key={tab}
    onClick={() => handleTabClick(tab)}
    className="relative transition-colors"
    style={{
      width: "161.66px",
      height: "60px",
      paddingTop: "6px",
      paddingRight: "12px",
      paddingBottom: "12px",
      paddingLeft: "12px",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      fontStyle: "normal", // 'Medium' weight is handled by fontWeight
      lineHeight: "100%",
      letterSpacing: "0",
      color: activeTab === tab ? "#9747FF" : "#374151",
    }}
  >
            {activeTab === tab && (
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 bottom-0 rounded-t-[12px]
                     bg-gradient-to-b from-[#FFFFFF] via-[#F5F2FF] to-[rgba(151,71,255,0.14)] z-0"
              />
            )}
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#9747FF] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsCard;
