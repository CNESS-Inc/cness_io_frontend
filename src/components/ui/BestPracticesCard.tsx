import React, { useState } from "react";
import DOMPurify from "dompurify";

type BestPracticeCardProps = {
  id?: string;
  name: string;
  username: string;
  profileImage: string;
  coverImage: string;
  title: string;
  description: string;
  link?: string;
  ifFollowing?: boolean;
  onToggleFollow?: (id: string) => void | Promise<void>;
  expandedDescriptions?: Record<string, boolean>;
  toggleDescription?: (e: React.MouseEvent, id: string) => void;
};

export default function BestPracticeCard({
  id,
  name,
  username,
  profileImage,
  coverImage,
  title,
  description,
  ifFollowing,
  onToggleFollow,
  expandedDescriptions,
  toggleDescription
}: BestPracticeCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Use shared expanded state if provided, otherwise use local state
  const isDescriptionExpanded = expandedDescriptions && id 
    ? expandedDescriptions[id] || false 
    : isExpanded;

  const handleToggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (toggleDescription && id) {
      toggleDescription(e, id);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!onToggleFollow || isLoading || !id) return;
    
    setIsLoading(true);
    try {
      await onToggleFollow(id);
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine description to show
  const displayDescription = isDescriptionExpanded 
    ? description 
    : truncateText(description, 100);

  // Check if description needs truncation
  const needsTruncation = description.length > 100;

  return (
    <div
      className="
        flex flex-col cursor-pointer
        rounded-xl border border-[#ECEEF2] bg-white
        pt-3 pr-3 pb-6 pl-3
        gap-2.5
        shadow-sm hover:shadow-md transition-shadow h-full
      "
    >
      {/* Header - Profile */}
      <div className="flex items-center gap-2">
        <img
          src={profileImage}
          alt={name}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/profile.png";
          }}
        />
        <div className="min-w-0">
          <span className="block font-['Open_Sans'] font-semibold text-[14px] sm:text-[15px] text-[#0F1728] truncate">
            {name}
          </span>
          <span className="block text-[12px] sm:text-[13px] text-[#667085] truncate">
            @{username}
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="w-full overflow-hidden rounded-lg h-[250px] xl:h-[150px] 2xl:h-[200px] bg-gray-100">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://cdn.cness.io/banner.webp";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col mt-1 sm:mt-2 flex-1">
        <h4 className="font-['Open_Sans'] font-semibold text-[14px] sm:text-[15px] text-[#0F1728] mb-2">
          {title}
        </h4>

        {/* Description with HTML sanitization */}
        <div className="text-[12px] sm:text-[13px] text-[#475467] leading-[18px] sm:leading-5 wrap-break-word whitespace-pre-line mb-2">
          <span
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(displayDescription)
            }}
          />
          {needsTruncation && (
            <span
              className="text-purple-600 underline cursor-pointer ml-1"
              onClick={handleToggleDescription}
            >
              {isDescriptionExpanded ? "Read Less" : "Read More"}
            </span>
          )}
        </div>

        {onToggleFollow && id && (
          <div className="flex justify-end mt-auto pt-3">
            {isLoading ? (
              // Loading state
              <button
                disabled
                className="w-full inline-flex items-center justify-center rounded-full bg-gray-300 px-4 py-2
                font-opensans text-[14px] font-semibold text-gray-500
                shadow transition cursor-not-allowed"
                onClick={(e) => e.stopPropagation()}
              >
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </button>
            ) : ifFollowing ? (
              // Following state
              <button
                className="w-full inline-block rounded-full bg-[#F396FF] px-4 py-2
                font-opensans text-[14px] font-semibold text-white
                shadow transition hover:bg-[#e885f5]"
                onClick={handleToggleFollow}
              >
                Following
              </button>
            ) : (
              // Follow state
              <button
                className="w-full rounded-full bg-[#7077FE] px-3 py-2
                font-opensans text-[14px] font-semibold text-white
                shadow hover:bg-[#5A61E8] transition"
                onClick={handleToggleFollow}
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}