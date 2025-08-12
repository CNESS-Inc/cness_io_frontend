// import PNGs
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import repost from "../../assets/repost.svg";
import {
 Pen,
 X,
} from "lucide-react";
type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string }
  | null;

export type MyPostProps = {
  id?: string | number;
  media: Media;
  body?: string;
  likes: number;
  //reflections: number;
  onLike?: () => void;
  onOpenReflections?: () => void;
onClick?: () => void;
  

  // Optional author info for Collection View
  authorName?: string;
  authorAvatar?: string;
  time?: string;
  isFollowing?: boolean;
  showFollowButton?: boolean;
  insightsCount?: number;
  reflections?: number;
 onFollowToggle?: () => void;
  
};
function formatCount(count: number) {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(0) + "K"; // no decimal
  return count.toString();
}
export default function MyPost({
  media,
  body,
  likes,
  reflections,
  onOpenReflections,
onClick,
onLike,
  // author props
  authorName,
  authorAvatar,
  time,
  isFollowing,
  showFollowButton,
  insightsCount,
   onFollowToggle,
}: MyPostProps) {
  return (
    
<article
      className="bg-white rounded-[12px] border border-gray-200 shadow-sm flex flex-col cursor-pointer group"
      style={{
        width: 367.33,
        height: 373,
        padding: "12px",
        gap: "24px",
      }}
    
    >
      {/* Optional Author Header */}
      {(authorName || authorAvatar) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {authorAvatar && (
              <img
                src={authorAvatar}
                alt={authorName || "Author"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-gray-800">{authorName}</span>
              {time && (
                <span className="text-xs text-gray-500">{time}</span>
              )}
            </div>
          </div>
          {showFollowButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle?.();
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      )}

      {/* MEDIA / BODY */}
  <div
  className="relative overflow-hidden rounded-[12px] group"
  style={{
    width: media ? 343.33 : "100%",
    height: media ? 297 : "auto",
    minHeight: !media ? 220 : undefined,
  }}
>
  {media ? (
    media.type === "image" ? (
      <img
        src={media.src}
        alt={media.alt || ""}
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={media.src}
        poster={media.poster}
        controls
        playsInline
      />
    )
  ) : (
    <div className="p-5 md:p-6 text-gray-700 leading-6 h-full">
      {body}
    </div>
  )}

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
    <button
      onClick={(e) => {
        e.stopPropagation();
        console.log("View Post clicked");
      }}
      className="px-5 py-2 rounded-full bg-white text-gray-800 font-medium text-sm shadow hover:bg-gray-100"
    >
      <Pen className="w-4 h-4 inline-block mr-1" />
      View Post
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        console.log("Delete clicked");
      }}
      className="px-5 py-2 rounded-full bg-red-500 text-white font-medium text-sm shadow hover:bg-red-600"
    >
      <X className="w-4 h-4 inline-block mr-1" />
      Delete
    </button>
  </div>
</div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 mt-auto">
        {/* Like / Comment / Repost */}
        <div className="flex items-center -space-x-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
          >
            <img src={like} className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReflections?.();
            }}
          >
            <img src={comment} className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Repost clicked");
            }}
          >
            <img src={repost} className="w-8 h-8" />
          </button>
        </div>

        <span className="whitespace-nowrap font-medium text-gray-600 text-sm">
          {formatCount(likes)}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {insightsCount !== undefined && (
            <span className="text-sm text-gray-500">
              {insightsCount} Insights Discussion
            </span>
          )}
          <span aria-hidden className="hidden sm:block h-4 w-px bg-gray-200" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReflections?.();
            }}
            className="whitespace-nowrap font-medium text-[grey] hover:text-[grey] text-sm"
          >
            {reflections !== undefined && (
              <span className="text-sm text-gray-500">
                {reflections} Reflections Thread
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}