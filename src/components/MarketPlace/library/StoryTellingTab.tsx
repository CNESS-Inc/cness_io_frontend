import React from "react";

interface StoryTellingTabProps {
    storytelling_video_url?: string;
    storytelling_description?: string;
}

const StoryTellingTab: React.FC<StoryTellingTabProps> = ({
    storytelling_video_url,
    storytelling_description,
}) => {
    return (
        <div>
            <h3 className="text-[18px] font-bold mb-2">Storytelling</h3>
            {storytelling_video_url ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <video
                        src={storytelling_video_url}
                        controls
                        className="w-full aspect-video object-contain bg-black"
                        playsInline
                        preload="metadata"
                    />
                </div>
            ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                    <img
                        src="https://cdn.cness.io/video1.svg"
                        className="w-full h-[260px] object-cover"
                        alt="Storytelling placeholder"
                    />
                </div>
            )}
            {storytelling_description && (
                <p className="font-['Open_Sans'] font-normal text-[16px] leading-[24px] text-black bg-white w-full max-w-[843px] opacity-100 py-2">
                    {storytelling_description}
                </p>
            )}
        </div>
    );
};

export default StoryTellingTab;