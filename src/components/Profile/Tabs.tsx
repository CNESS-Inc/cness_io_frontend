import React, { useState } from "react";
// import { Search, ArrowLeft } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConnectionsCardProps = {
  title: string;
  subtitle?: string;
  tabs: string[];
  label?: string;
  hashtags?: string[];
  onSearch?: (value: string) => void;
  onTabChange?: (tab: string) => void;
  activeTab:any,
  setActiveTab:any
  getUserPosts:any
};

const ConnectionsCard: React.FC<ConnectionsCardProps> = ({
  title,
  subtitle,
  tabs,
  label,
  hashtags = [],
  // onSearch,
  onTabChange,
  activeTab,
  setActiveTab,
  getUserPosts
}) => {
  const navigate = useNavigate();
  const [_searchValue, _setSearchValue] = useState("");

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchValue(e.target.value);
  //   onSearch?.(e.target.value);
  // };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
    getUserPosts("AI",tab)
  };

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white flex flex-col gap-4 p-4 sm:p-6 w-full">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        {label && (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full self-start sm:self-center">
            {label}
          </span>
        )}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 self-start sm:self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Search + Hashtags */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        {/* Search Input */}
        {/*
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 w-full sm:w-80 bg-white">
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
        */} 
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
      <div className="flex flex-wrap border-t border-gray-200 pt-3 gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`relative transition-colors px-4 py-2 rounded-t-lg text-sm font-medium
              ${activeTab === tab ? "text-purple-600" : "text-gray-700"}`}
          >
            {activeTab === tab && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-t-[12px] bg-gradient-to-b from-white via-purple-50 to-purple-50 z-0"
              />
            )}
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsCard;
