import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { GetTrendingPost } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

type Topic = {
  id: string;
  topic_name: string;
  slug: string;
};

export default function Topic() {
  const nav = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isTrendingAI = location.pathname.endsWith("/trendingai");

  const topics: Topic[] = location.state?.topics || [];
  const userSelectedTopics: Topic[] = location.state?.userSelectedTopics || [];

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);
  const clickedTopic = topics?.find((item) => item?.slug === slug);

  const getUserPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Pass page parameter correctly to the API
      const res = await GetTrendingPost("", "", page);

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
        const res = await GetTrendingPost("", "", 1);
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

  return (
    <div className="w-full px-0.5 md:px-0.1 py-1">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">
            {clickedTopic?.topic_name} Posts
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
        Discover the {clickedTopic?.topic_name} posts and conversations
        happening right now
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
        <aside className="xl:sticky xl:top-4 self-start">
          <div className="rounded-2xl space-y-8 border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
            {userSelectedTopics?.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="font-medium text-gray-900">My Picks</div>
                </div>
                <div className="border-b border-gray-200 w-full mb-4"></div>

                <div className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
                  {userSelectedTopics?.map((topic) => (
                    <button
                      key={topic.id}
                      //   onClick={() => Navigate(`/dashboard/${topic.slug}`)}
                      className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                    >
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      {topic.topic_name}
                    </button>
                  ))}
                  {userSelectedTopics?.length === 0 && (
                    <button disabled className="text-gray-400 italic">
                      No selected topics available
                    </button>
                  )}
                </div>
              </div>
            )}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="font-medium text-gray-900">Explore Topics</div>
              </div>
              <div className="border-b border-gray-200 w-full mb-4"></div>

              <div className="space-y-3 text-sm md:text-[15px] px-4">
                {topics?.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() =>
                      navigate(`/dashboard/${topic.slug}`, {
                        state: {
                          topics,
                          userSelectedTopics,
                        },
                      })
                    }
                    className={`flex items-center gap-2 ${
                      clickedTopic?.topic_name === topic.topic_name
                        ? "text-purple-700"
                        : "text-gray-700"
                    } hover:text-purple-700 cursor-pointer`}
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {topic.topic_name}
                  </button>
                ))}
                {topics?.length === 0 && (
                  <button disabled className="text-gray-400 italic">No topics available</button>
                )}
              </div>
            </div>

            <div className="my-5 h-px bg-gray-100" />
          </div>
        </aside>
      </div>
    </div>
  );
}
