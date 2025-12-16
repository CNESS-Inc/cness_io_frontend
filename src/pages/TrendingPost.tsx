// pages/Trending.tsx
import { ChevronLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  GetAllTrendingPost,
  getTopics,
  getUserSelectedTopic,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

type Post = React.ComponentProps<typeof PostCard>;

export default function Trending() {
  const nav = useNavigate();
  const location = useLocation();
  const isTrendingAI = location.pathname.endsWith("/trendingai");

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);
  const { showToast } = useToast();
  const [topics, setTopics] = useState<any[]>([]); // list of topics
  const [visibleTopic, setVisibleTopic] = useState(10);
  const [userSelectedTopics, setUserSelectedTopics] = useState<any[]>([]); // list of user selected topics
  const loggedInUserID = localStorage.getItem("Id");
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const openTopics = () => setIsTopicsOpen(true);
  const closeTopics = () => setIsTopicsOpen(false);

  const navigate = useNavigate();

  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      if (
        response?.success?.statusCode === 200 &&
        response?.data?.data?.length
      ) {
        setTopics(response?.data?.data);
      } else {
        console.warn("Error during fetch topics details", response);
      }
    } catch (error) {
      console.error("Error fetching topic details:", error);
      showToast({
        message: "Failed to load Topics.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchUserSelectedTopics = async () => {
    if (!loggedInUserID) {
      showToast({
        message: "No user ID found.",
        type: "error",
        duration: 2000,
      });
      return;
    }
    try {
      const response = await getUserSelectedTopic(loggedInUserID);
      if (
        response?.success?.statusCode === 200 &&
        response?.data?.data?.length > 0
      ) {
        setUserSelectedTopics(response?.data?.data);
      } else {
        console.warn(
          "Error during fetch user selected topics details",
          response
        );
      }
    } catch (error: any) {
      console.error("Error fetching user selected topic details:", error);
      if (error?.response?.status === 404) {
        // setShowTopicModal(true);
      } else {
        showToast({
          message: "Failed to load User Selected Topics.",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  useEffect(() => {
    fetchUserSelectedTopics();
    fetchTopics();
  }, []);

  const getUserPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Pass page parameter correctly to the API
      const res = await GetAllTrendingPost(page);

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
          setPosts((prevPosts) => {
            // Avoid duplicates by checking if post already exists
            const existingIds = new Set(prevPosts.map((p) => p.id));
            const filteredNewPosts = newPosts.filter(
              (p) => !existingIds.has(p.id)
            );
            return [...prevPosts, ...filteredNewPosts];
          });

          if (page >= totalPages) {
            setHasMore(false);
          } else {
            setPage((prevPage) => prevPage + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      initialLoad.current = false;
    }
  }, [page, isLoading, hasMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !initialLoad.current) {
        getUserPosts();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasMore, getUserPosts]);

  // Initial load
  useEffect(() => {
    // Reset state when component mounts
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);

    // Load first page immediately
    const loadFirstPage = async () => {
      try {
        const res = await GetAllTrendingPost(1);
        console.log("Initial load response:", res);

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

          setPosts(newPosts);
          setHasMore(page < totalPages);
          setPage(2); // Set to next page
        }
      } catch (error) {
        console.error("Error fetching initial posts:", error);
      } finally {
        setIsLoading(false);
        initialLoad.current = false;
      }
    };

    loadFirstPage();
  }, []);

  const TopicsPanel = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-indigo-600" />
        <div className="font-medium text-gray-900">Trending Topics</div>
      </div>
      <div className="border-b border-gray-200 w-full mb-4"></div>

      <ul className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
        {topics?.slice(0, visibleTopic)?.map((topic) => (
          <button
            key={topic.id}
            onClick={() =>
              navigate(`/dashboard/feed/search?topic=${topic.slug}`, {
                state: {
                  topics,
                  userSelectedTopics,
                },
              })
            }
            className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {topic.topic_name}
          </button>
        ))}
        {visibleTopic < topics?.length && (
          <button
            onClick={() => setVisibleTopic((pre) => pre + 10)}
            className="text-sm text-blue-500 hover:underline hover:text-blue-600 transition cursor-pointer"
          >
            See more
          </button>
        )}
        {topics?.length === 0 && (
          <button disabled className="text-gray-400 italic">
            No topics available
          </button>
        )}
      </ul>

      <div className="my-5 h-px bg-gray-100" />
    </div>
  );

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTopics}
            className="xl:hidden inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50"
          >
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Topics
          </button>
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50 bg-color-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
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
              {posts.length === 0 && !isLoading ? (
                <div className="text-center py-10 text-gray-500">
                  No trending posts found
                </div>
              ) : (
                <>
                  {posts.map((p, i) => {
                    // Add ref to the last post element
                    if (posts.length === i + 1) {
                      return (
                        <div ref={lastPostElementRef} key={i}>
                          <PostCard
                            {...p}
                            onLike={() => console.log("like", i)}
                            onAffirmation={() => console.log("affirmation", i)}
                            onReflections={() => console.log("reflections", i)}
                            onShare={() => console.log("share", i)}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <PostCard
                          key={i}
                          {...p}
                          onLike={() => console.log("like", i)}
                          onAffirmation={() => console.log("affirmation", i)}
                          onReflections={() => console.log("reflections", i)}
                          onShare={() => console.log("share", i)}
                        />
                      );
                    }
                  })}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}

                  {/* No more posts message */}
                  {!hasMore && posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No more posts to load
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <Outlet />
        </div>

        {/* Topics rail (right) */}
        <aside className="hidden xl:block xl:sticky xl:top-4 self-start">
          <TopicsPanel />
        </aside>
      </div>

      {isTopicsOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeTopics}
        />
      )}
      <div
        className={`xl:hidden fixed right-0 top-0 h-full w-[85vw] max-w-[380px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isTopicsOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Trending topics"
      >
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">Trending Topics</span>
          </div>
          <button
            onClick={closeTopics}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <TopicsPanel />
        </div>
      </div>
    </div>
  );
}
