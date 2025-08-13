// components/Social/PostCard.tsx
import {
  MessageSquare,
  Share2,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";  

type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

type Props = {
  avatar: string;
  name: string;
  time: string;              // e.g. "2 hours ago"
  following?: boolean;       // shows "Following" chip on the right
  media: Media;
  likes: number;             // 421000 => 421K
  reflections: number;       // 45
  onLike?: () => void;
  onAffirmation?: () => void;
  onReflections?: () => void;
  onShare?: () => void;
};

const k = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M` :
  n >= 1e3 ? `${Math.round(n / 1e3)}K` : `${n}`;

export default function PostCard({
  avatar,
  name,
  time,
  following = true,
  media,
  likes,
  reflections,
  onLike,
  onAffirmation,
  onReflections,
  onShare,
}: Props) {
  return (
    <article className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 sm:p-5">
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-11 h-11 rounded-full object-cover"
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

      {/* media */}
      <div className="mt-4">
        <div className="overflow-hidden rounded-xl">
          {media.type === "image" ? (
            <img
              src={media.src}
              alt={media.alt || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              src={media.src}
              poster={media.poster}
              controls
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>

      {/* chip row: overlapped icons + likes + reflections right */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <button
              onClick={onLike}
              className="relative z-30 inline-flex w-8 h-8 items-center justify-center rounded-full bg-[#6C7BFF]/90 shadow"
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
          onClick={onAffirmation}
className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-opensans font-semibold text-[14px] leading-[150%] text-[#7077FE] hover:bg-gray-50"
        >
          <ThumbsUp className="w-4 h-4 text-[#7077FE]" />
          <span>Affirmation Modal</span>
        </button>
        <button
          onClick={onReflections}
className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 font-opensans font-semibold text-[14px] leading-[150%] text-[#7077FE] hover:bg-gray-50"
        >
          <MessageSquare className="w-4 h-4 text-[#7077FE]" />
          <span>Reflections Thread</span>
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
  );
}
