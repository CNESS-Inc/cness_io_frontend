// pages/Trending.tsx
import { ChevronLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetTrendingPost } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

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

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await GetTrendingPost("");
      console.log("🚀 ~ getUserPosts ~ res:", res);

      if (res?.data?.data?.rows) {
        const newPosts: Post[] = res.data.data.rows.map((el: any) => {

          return {
            avatar: el?.profile?.profile_picture || null,
            name: `${el?.profile?.first_name || ""} ${
              el?.profile?.last_name || ""
            }`,
            time: el?.createdAt,
            following: el?.if_following || false,
            media: el?.file,
            likes: el?.likes_count || 0,
            reflections: el?.reflections_count || 0,
            id: el?.id || null,
            content: el?.content || "",
            isLiked: el?.is_liked || false,
          };
        });

        const totalCount = res?.data?.data?.count || 0;
        const totalPages = Math.ceil(totalCount / 10);

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);

          if (page >= totalPages) {
            setHasMore(false);
          } else {
            setPage(page + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  return (
    <div className="w-full px-0.5 md:px-0.1 py-1">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-900">
            Trending Posts
          </h1>
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