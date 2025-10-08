//import React from "react";

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
  onToggleFollow?: (id: string) => void;
};

export default function BestPracticeCard({
  id,
  name,
  username,
  profileImage,
  coverImage,
  title,
  description,
  link,
  ifFollowing,
  onToggleFollow
}: BestPracticeCardProps) {

  return (
    <div
      className="
        flex flex-col cursor-pointer
        rounded-[12px] border border-[#ECEEF2] bg-white
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

      {/* Cover Image (keeps proportion, fits different widths) */}
      <div className="w-full overflow-hidden rounded-[8px] h-[250px] xl:h-[150px] 2xl:h-[200px] bg-gray-100">
        <img
          src={coverImage || "/placeholder.png"}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col mt-1 sm:mt-2 flex-1">
        <h4 className="font-['Open_Sans'] font-semibold text-[14px] sm:text-[15px] text-[#0F1728]">
          {title}
        </h4>

        {/* Clamp to keep row heights tidy; remove if you want full text */}
        <p className="mt-1 text-[12px] sm:text-[13px] text-[#475467] leading-[18px] sm:leading-[20px] line-clamp-1">
          {description}
        </p>

        {link && (
          <a
            href={link}
            className="inline-flex items-center text-[12px] sm:text-[13px] font-semibold text-[#D748EA] hover:underline self-start"
          >
            Read More
          </a>
        )}

        {onToggleFollow && (
          <div className="flex justify-end mt-auto pt-3">
            {ifFollowing ? (
              <button
                className="w-full inline-block rounded-full bg-[#F396FF] px-4 py-2
                font-opensans text-[14px] font-semibold text-white
                shadow transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(id? id : "");
                }}
              >
                Following
              </button>
            ) : (
              <button
                className="w-full rounded-full bg-[#7077FE] px-3 py-2
                              font-opensans text-[14px] font-semibold text-white
                              shadow hover:bg-[#5A61E8] transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(id? id : "");
                }}
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
