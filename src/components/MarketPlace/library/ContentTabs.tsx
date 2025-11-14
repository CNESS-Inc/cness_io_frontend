import React from "react";

interface ContentTabsProps {
    activeTab: "overview" | "storytelling" | "reviews";
    onTabChange: (tab: "overview" | "storytelling" | "reviews") => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
    activeTab,
    onTabChange,
}) => {
    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "storytelling", label: "Storytelling" },
        { id: "reviews", label: "Reviews" },
    ] as const;

    return (
        <nav className="mt-3 grid w-full grid-cols-3" aria-label="Course sections">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-4 py-2 rounded-md text-sm ${activeTab === tab?.id ? "bg-[#7077FE] text-[#ffffff]" : "bg-white border border-slate-200 text-slate-700"}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default ContentTabs;