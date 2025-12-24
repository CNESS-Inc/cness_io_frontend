import type { ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
}

interface TrendingTabsProps {
  title: string;
  icon?: ReactNode;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function TrendingTabs({
  title,
  icon,
  tabs,
  activeTab,
  onTabChange,
}: TrendingTabsProps) {
  return (
<div className="flex flex-col gap-[10px] sm:flex-row sm:items-center sm:gap-[20px]">
  
  {/* LEFT: Icon + Title */}
  <div className="flex items-center gap-[10px]">
    {icon && (
      <div className="text-[#FF6A55] flex items-center">
        {icon}
      </div>
    )}
    <h2 className="font-[Poppins] text-[20px] font-medium text-[#080F20]">
      {title}
    </h2>
  </div>

  {/* RIGHT: Tabs (now near header) */}
  <div className="flex gap-[8px] flex-wrap">
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;

      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            px-[14px]
            py-[6px]
            rounded-full
            text-[13px]
            font-medium
            transition-all
            border
            ${
              isActive
                ? "bg-[#6C6CF5] text-white border-[#6C6CF5]"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#6C6CF5] hover:text-[#6C6CF5]"
            }
          `}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
         
    </div>
  );
}
