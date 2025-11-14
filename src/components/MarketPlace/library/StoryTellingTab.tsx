import React from "react";

interface OverviewTabProps {
    summary?: any;
    shortVideo?: string;
}

const StoryTellingTab: React.FC<OverviewTabProps> = ({
    summary,
    shortVideo,
}) => {
    return (
        <div>
            <h3 className="text-[18px] font-bold mb-2">Storytelling</h3>
            <div className="rounded-xl overflow-hidden border border-slate-200">
                <img src={shortVideo ? shortVideo : "https://cdn.cness.io/video1.svg"} className="w-full h-[260px] object-cover" alt="Storytelling" />
            </div>
            <p className="font-['Open_Sans'] font-normal text-[16px] leading [10] text-black bg-white w-full max-w-[843px] opacity-100 py-2">
                {summary}
            </p>
        </div>
    );
};

export default StoryTellingTab;