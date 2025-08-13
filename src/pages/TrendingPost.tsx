// pages/Trending.tsx
import { ChevronLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import person1 from "../assets/person1.jpg";
import person2 from "../assets/person2.jpg";
import carousel3 from "../assets/carosuel3.png";
import { Outlet, useLocation } from "react-router-dom";

type Post = React.ComponentProps<typeof PostCard>;

const posts: Post[] = [
  {
    avatar: person2,
    name: "Anu",
    time: "2 hours ago",
    following: true,
    media: { type: "image", src: carousel3, alt: "Sea" },
    likes: 421000,
    reflections: 45,
  },
  {
    avatar: person1,
    name: "Olivia Gracia",
    time: "2 hours ago",
    following: true,
    media: { type: "video", src: "/test1.mp4", poster: "/images/cover-landscape.jpg" },
    likes: 19800,
    reflections: 12,
  },
];

const trendingTopics = [
  { label: "#AI" },
  { label: "#Conscious" },
  { label: "#Social_impact", icon: "🔥" },
  { label: "#Save_water", icon: "💧" },
];

export default function Trending() {
  const nav = useNavigate();
  const location = useLocation();
  const isTrendingAI = location.pathname.endsWith("/trendingai");
  return (
    <div className="w-full px-0.5 md:px-0.1 py-1">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-900">Trending Posts</h1>
        </div>

        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50 bg-color-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Discover the most popular posts and conversations happening right now
      </p>

      {/* Full-width 2-col layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        {/* Feed (left) */}
        <div className="space-y-5">
  {!isTrendingAI && (
    <>
      {posts.map((p, i) => (
        <PostCard
          key={i}
          {...p}
          onLike={() => console.log("like", i)}
          onAffirmation={() => console.log("affirmation", i)}
          onReflections={() => console.log("reflections", i)}
          onShare={() => console.log("share", i)}
        />
      ))}
    </>
  )}

  <Outlet />
        </div>

        {/* Topics rail (right) */}
        <aside className="xl:sticky xl:top-4 self-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <div className="font-medium text-gray-900">Trending Topics</div>
            </div>
  <div className="border-b border-gray-200 w-full mb-4"></div>

            <ol className="space-y-3 text-sm">
              {trendingTopics.map((t, idx) => (
                
                <li
                  key={t.label}
                  onClick={() => nav("trendingai")}
                  className="flex items-center justify-between font-opensans font-normal text-[14px] leading-[100%] cursor-pointer px-3 py-2 rounded-md hover:bg-[#E6E9FF] transition-all duration-200 ease-in-out transform hover:scale-y-110 w-full"
                >
                  <span className="text-black hover:text-[#7077FE] transition-colors duration-200">
                    {idx + 1}. {t.label}
                  </span>
                  {t.icon && <span className="ml-2">{t.icon}</span>}
                </li>
              ))}
            </ol>

            <div className="my-5 h-px bg-gray-100" />
          </div>
        </aside>
      </div>
    </div>
  );
}
