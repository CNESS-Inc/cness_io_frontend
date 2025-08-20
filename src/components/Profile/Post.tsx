import {
  MessageSquare,
  Share2,
  ThumbsUp,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CommentBox from "../../pages/CommentBox";
import { PostsLike } from "../../Common/ServerAPI";

// PostCarousel component for handling multiple media items
function PostCarousel({
  mediaItems,
}: {
  mediaItems: Array<{ type: "image" | "video"; url: string }>;
}) {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto slide every 3 seconds (only for images)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-advance if current item is not a video
      if (mediaItems[current].type !== "video") {
        setCurrent((prev) => (prev + 1) % mediaItems.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [mediaItems.length, current]);

  // Pause videos when they're not visible
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === current && mediaItems[index].type === "video") {
          video.play().catch((e) => console.error("Video play failed:", e));
        } else {
          video.pause();
        }
      }
    });
  }, [current, mediaItems]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % mediaItems.length);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {/* Media Container */}
      <div className="w-full aspect-video bg-black">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ${
              index === current ? "block" : "hidden"
            }`}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/fallback-image.png";
                }}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover"
                controls
                muted
                loop
                playsInline
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Show arrows only if there are multiple items */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md w-8 h-8 rounded-full flex items-center justify-center z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md w-8 h-8 rounded-full flex items-center justify-center z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Show dots only if there are multiple items */}
      {mediaItems.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {mediaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === current ? "bg-indigo-500" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string }
  | { type: "text"; src: string };

type Props = {
  id: number;
  avatar: string;
  name: string;
  time: string; // e.g. "2 hours ago"
  following?: boolean; // shows "Following" chip on the right
  media: Media;
  likes: number; // 421000 => 421K
  reflections: number; // 45
  onLike?: () => void;
  onAffirmation?: () => void;
  onReflections?: () => void;
  onShare?: () => void;
  isLiked: any;
  content: any;
  // Add these new props to match SocialTopBar functionality
  file?: string | null | Array<{ file: string; file_type: string }>;
  file_type?: string | null;
};

const k = (n: number) =>
  n >= 1e6
    ? `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`
    : n >= 1e3
    ? `${Math.round(n / 1e3)}K`
    : `${n}`;

// Helper function to check if a file is a video
const isVideoFile = (url: string) => {
  return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
};

export default function PostCard({
  id,
  avatar,
  name,
  time,
  following = true,
  media,
  likes: initialLikes,
  reflections,
  onLike,
  onReflections,
  onShare,
  isLiked,
  content,
  file,
  file_type,
}: Props) {
  console.log("🚀 ~ PostCard ~ media:", media);
  const [selectedPostId, setSelectedPostId] = useState<any | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [likes, setLikes] = useState(initialLikes);
  const [isLike, setIsLiked] = useState(isLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  const CONTENT_LIMIT = 150;
  const toggleExpand = (postId: any) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = async (postId: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const formattedData = { post_id: postId };
      const response = await PostsLike(formattedData);

      if (response.success) {
        if (isLike) {
          setLikes((prev) => prev - 1);
        } else {
          setLikes((prev) => prev + 1);
        }
        setIsLiked(!isLike); // Use local state here
        onLike?.();
      } else {
        console.error("Failed to like/unlike post:", response.message);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if a URL is a video based on file_type if available
  const isVideoFromType = (
    url: string,
    fileType: string | null | undefined
  ) => {
    if (fileType) {
      return fileType.startsWith("video/");
    }
    return isVideoFile(url);
  };

  // Function to process file data from API response
  const processFileData = () => {
    if (!file) return null;

    // Case 1: file is an array of objects (new format)
    if (Array.isArray(file)) {
      return file.map((item) => ({
        url: item.file,
        type: isVideoFromType(item.file, item.file_type)
          ? ("video" as const)
          : ("image" as const),
      }));
    }

    // Case 2: file is a string (comma-separated URLs - old format)
    if (typeof file === "string") {
      const urls = file.split(",").map((url) => url.trim());
      return urls.map((url) => ({
        url,
        type: isVideoFromType(url, file_type)
          ? ("video" as const)
          : ("image" as const),
      }));
    }

    return null;
  };

  // Function to render media content similar to SocialTopBar
  const renderMediaContent = () => {
    const processedFiles = processFileData();

    // If we have processed file data, use that
    if (processedFiles && processedFiles.length > 0) {
      ``;
      // Use PostCarousel if there are multiple items
      if (processedFiles.length > 1) {
        return <PostCarousel mediaItems={processedFiles} />;
      }

      // Single item rendering
      const item = processedFiles[0];
      return item.type === "video" ? (
        <video
          className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-lg"
          controls
          muted
          autoPlay
          loop
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={item.url}
          alt="Post content"
          className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-lg mb-2"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/fallback-image.png";
          }}
        />
      );
    }

    // Fallback to original media prop if no file data
    // Handle multiple media items in the original media prop if needed
    if (Array.isArray(media)) {
      const mediaItems = media?.map((item) => ({
        url: item.file,
        type: item.file_type === "video" ? ("video" as const) : ("image" as const),
      }));
      return <PostCarousel mediaItems={mediaItems} />;
    }

    // Single media item fallback
    return (
      <div className="overflow-hidden rounded-xl">
        {media?.type === "image" ? (
          <img
            src={media.src}
            alt={media.alt || ""}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/fallback-image.png";
            }}
          />
        ) : media?.type === "video" ? (
          <video
            className="w-full h-full object-cover"
            src={media.src}
            poster={media.poster}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <p className="p-4 text-gray-800 whitespace-pre-wrap">{media?.src}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <article className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5">
        {/* header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="relative">
              <img
                src={avatar ? avatar : "/profile.png"}
                alt={name}
                className="w-11 h-11 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              />
              <span className="absolute -bottom-0 -right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>

            <div>
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-xs text-gray-500">{time}</div>
            </div>
          </div>

          {following && (
            <span className="inline-flex items-center gap-2 font-semibold text-[14px] leading-[150%] text-[#7077FE]">
              <TrendingUp className="w-4 h-4" />
              Following
            </span>
          )}
        </div>

        <p className="text-gray-800 text-sm md:text-base mb-2 md:mb-3">
          {expandedPosts[id] || content?.length <= CONTENT_LIMIT
            ? content
            : `${content?.substring(0, CONTENT_LIMIT)}...`}
          {content?.length > CONTENT_LIMIT && (
            <button
              onClick={() => toggleExpand(id)}
              className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
            >
              {expandedPosts[id] ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* media - using the new renderMediaContent function */}
        <div className="mt-4">{renderMediaContent()}</div>

        {/* chip row: overlapped icons + likes + reflections right */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <button
                onClick={() => handleLike(id)}
                disabled={isLoading}
                className={`relative z-30 inline-flex w-8 h-8 items-center justify-center rounded-full shadow ${
                  isLike ? "bg-[#6C7BFF]" : "bg-[#6C7BFF]/90"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label="Like"
              >
                <ThumbsUp className="w-4 h-4 text-white" />
              </button>
              <div className="relative z-20 inline-flex w-8 h-8 items-center justify-center rounded-full bg-[#F07EFF]/90 shadow">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="relative z-10 inline-flex w-8 h-8 items-center justify-center rounded-full bg-[#35C79A]/90 shadow">
                <Share2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <span className="text-sm text-gray-600">{k(likes)}</span>
          </div>

          <button
            onClick={onReflections}
            className="text-sm text-gray-500 hover:text-indigo-600"
          >
            {reflections} Reflections Thread
          </button>
        </div>

        {/* action pills */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLike(id)}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 font-opensans font-semibold text-[14px] leading-[150%] bg-white text-[#7077FE] hover:bg-gray-50 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ThumbsUp
              className="w-4 h-4"
              fill={isLike ? "#7077FE" : "none"} // <-- condition here
              stroke={isLike ? "#7077FE" : "#7077FE"} // keeps border visible
            />
            <span>Like</span>
          </button>

          <button
            onClick={() => {
              setSelectedPostId(id);
              setShowCommentBox(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-opensans font-semibold text-[14px] leading-[150%] text-[#7077FE] hover:bg-gray-50"
          >
            <MessageSquare className="w-4 h-4 text-[#7077FE]" />
            <span>Comment</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-opensans font-semibold text-[14px] leading-[150%] text-[#7077FE] hover:bg-gray-50"
          >
            <Share2 className="w-4 h-4 text-[#7077FE]" />
            <span>Share</span>
          </button>
        </div>
      </article>

      {showCommentBox && selectedPostId && (
        <CommentBox
          setUserPosts={setUserPosts}
          userPosts={userPosts}
          postId={selectedPostId}
          onClose={() => {
            setShowCommentBox(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </>
  );
}
