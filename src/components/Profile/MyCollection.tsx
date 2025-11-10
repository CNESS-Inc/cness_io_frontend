// import PNGs
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import repost from "../../assets/repost.svg";

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

  

  // Optional author info for Collection View
  authorName?: string;
  authorAvatar?: string;
  time?: string;
  isFollowing?: boolean;
  showFollowButton?: boolean;
  insightsCount?: number;
  reflections?: number;
 onFollowToggle?: () => void;
  onClick?: () => void;
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
  authorName,
  authorAvatar,
  time,
  isFollowing,
  showFollowButton,
  insightsCount,
  onFollowToggle,
  onClick, // <-- bring it in from props
}: MyPostProps) {
  console.log("🚀 ~ MyPost ~ authorAvatar:", authorAvatar)
  return (
    <article
      onClick={onClick}
      className="bg-white rounded-[12px] border border-gray-200 shadow-sm flex flex-col cursor-pointer
                 w-full max-w-sm sm:max-w-md md:max-w-lg p-3 sm:p-4 gap-3"
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
              {time && <span className="text-xs text-gray-500">{time}</span>}
            </div>
          </div>
          {showFollowButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowToggle?.();
              }}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
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
      {media ? (
        <div className="relative overflow-hidden rounded-[12px] w-full aspect-[4/3]">
          {media.type === "image" ? (
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
              preload="metadata"
            />
          )}
        </div>
      ) : (
        <div className="p-4 text-gray-700 leading-6 min-h-[150px] sm:min-h-[200px]">
          {body}
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-3 mt-auto flex-wrap">
        <div className="flex items-center -space-x-2 shrink-0">
          <button onClick={(e) => e.stopPropagation()}>
            <img src={like} className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <button onClick={(e) => e.stopPropagation()}>
            <img src={comment} className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
          <button onClick={(e) => e.stopPropagation()}>
            <img src={repost} className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>
        </div>

        <span className="whitespace-nowrap font-medium text-gray-600 text-sm">
          {formatCount(likes)}
        </span>

        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {insightsCount !== undefined && (
            <span className="text-sm text-gray-500">
              {insightsCount} Insights Discussion
            </span>
          )}
          <span
            aria-hidden
            className="hidden sm:block h-4 w-px bg-gray-200"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReflections?.();
            }}
            className="whitespace-nowrap font-medium text-gray-500 hover:text-gray-700 text-sm"
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
