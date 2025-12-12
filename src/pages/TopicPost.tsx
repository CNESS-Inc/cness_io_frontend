import { ChevronLeft, TrendingUp } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { FeedPostsDetails } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

type Topic = {
  id: string;
  topic_name: string;
  slug: string;
};
const PAGE_LIMIT = 10;

export default function Topic() {
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get both topic and tag from URL search params
  const topicSlug = searchParams.get("topic");
  const tagSlug = searchParams.get("tag");
  
  console.log("🚀 ~ Topic ~ tagSlug:", tagSlug);
  console.log("🚀 ~ Topic ~ topicSlug:", topicSlug);

  const topics: Topic[] = location.state?.topics || [];
  const userSelectedTopics: Topic[] = location.state?.userSelectedTopics || [];

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);

  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const openTopics = () => setIsTopicsOpen(true);
  const closeTopics = () => setIsTopicsOpen(false);

  // Determine which type of feed we're showing
  const isTagFeed = !!tagSlug;
  const isTopicFeed = !!topicSlug;
  
  // Get the display title based on what we're showing
  const getDisplayTitle = () => {
    if (isTagFeed) {
      return `#${tagSlug}`;
    }
    if (isTopicFeed) {
      const topic = topics?.find(item => item?.slug === topicSlug);
      return topic?.topic_name || "Topic";
    }
    return "Posts";
  };

  // Get the description based on what we're showing
  const getDescription = () => {
    if (isTagFeed) {
      return `Explore posts tagged with #${tagSlug}.`;
    }
    if (isTopicFeed) {
      const topic = topics?.find(item => item?.slug === topicSlug);
      return `Join the community sharing insights about ${topic?.topic_name || "this topic"}.`;
    }
    return "Explore posts from the community.";
  };

  const mapApiRowToPost = (el: any): Post => ({
    avatar: el?.profile?.profile_picture || null,
    name: `${el?.profile?.first_name || ""} ${el?.profile?.last_name || ""
      }`.trim(),
    time: el?.createdAt,
    following: el?.if_following || false,
    media: el?.file,
    likes: el?.likes_count || 0,
    reflections: el?.reflections_count || 0,
    id: el?.id || null,
    content: el?.content || "",
    isLiked: el?.is_liked || false,
  });

  const getUserPosts = useCallback(
    async (requestedPage = page) => {
      // Don't fetch if loading, no more data, or no parameters
      if (isLoading || !hasMore || (!tagSlug && !topicSlug)) return;

      setIsLoading(true);
      try {
        // Call FeedPostsDetails with both tag and topic parameters
        // The API should handle filtering by either or both
        const res = await FeedPostsDetails(
          requestedPage,
          tagSlug || null,  // Pass null if no tag
          topicSlug || null  // Pass null if no topic
        );

        if (res?.data?.data?.rows) {
          const rows: any[] = res?.data?.data?.rows ?? [];

          const rawCount = res?.data?.data?.count;
          const totalCount =
            typeof rawCount === "number"
              ? rawCount
              : Array.isArray(rawCount)
                ? rawCount.length
                : Number(rawCount) || 0;
          const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

          if (rows.length === 0) {
            setHasMore(false);
          } else {
            const newPosts = rows.map(mapApiRowToPost);
            setPosts((prevPosts) => {
              // Avoid duplicates by checking if post already exists
              const existingIds = new Set(prevPosts.map((p) => p.id));
              const filteredNewPosts = newPosts.filter(
                (p) => !existingIds.has(p.id)
              );
              return [...prevPosts, ...filteredNewPosts];
            });

            if (requestedPage >= totalPages) {
              setHasMore(false);
            } else {
              setPage((prev) => Math.max(prev, requestedPage + 1));
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
    },
    [page, isLoading, hasMore, tagSlug, topicSlug]
  );

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
      observer.current = null;
    }

    if (!lastPostElementRef.current || isLoading || !hasMore) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        const ent = entries[0];
        if (
          ent &&
          ent.isIntersecting &&
          !initialLoad.current &&
          !isLoading &&
          hasMore
        ) {
          getUserPosts();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.current.observe(lastPostElementRef.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [posts.length, isLoading, hasMore, getUserPosts]);

  // Initial load when component mounts or parameters change
  useEffect(() => {
    // Reset state when there are no parameters
    if (!tagSlug && !topicSlug) {
      setPosts([]);
      setHasMore(false);
      setPage(1);
      setIsLoading(false);
      return;
    }

    // Reset state when parameters change
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    initialLoad.current = true;

    // Load first page immediately
    const loadFirstPage = async () => {
      try {
        const res = await FeedPostsDetails(1, tagSlug || null, topicSlug || null);
        console.log("Initial load response:", res);

        const rows: any[] = res?.data?.data?.rows ?? [];
        const rawCount = res?.data?.data?.count;
        const totalCount =
          typeof rawCount === "number"
            ? rawCount
            : Array.isArray(rawCount)
              ? rawCount.length
              : Number(rawCount) || 0;

        const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

        const newPosts = rows.map(mapApiRowToPost);
        setPosts(newPosts);

        setPage(2);
        setHasMore(1 < totalPages);
      } catch (error) {
        console.error("Error fetching initial posts:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
        initialLoad.current = false;
      }
    };

    loadFirstPage();
  }, [tagSlug, topicSlug]);

  // Navigation handler for topic clicks
  const handleTopicClick = (topic: Topic) => {
    nav(`/dashboard/feed/search?topic=${topic.slug}`, {
      state: { topics, userSelectedTopics },
    });
  };

  // Navigation handler for "My Picks" topics
  const handleMyPickClick = (topic: Topic) => {
    nav(`/dashboard/feed/search?topic=${topic.slug}`, {
      state: { topics, userSelectedTopics },
    });
  };

  const TopicsPanel = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
      {userSelectedTopics?.length > 0 && (
        <div className="space-y-3">
          <div className="font-medium text-gray-900">My Picks</div>
          <div className="border-b border-gray-200 w-full"></div>
          <ul className="space-y-3 text-sm md:text-[15px] text-gray-700">
            {userSelectedTopics?.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleMyPickClick(topic)}
                className="flex items-center gap-2 hover:text-purple-700 cursor-pointer w-full text-left"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0"></span>
                <span className="truncate">{topic.topic_name}</span>
              </button>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 mb-2 font-medium text-gray-900">Explore Topics</div>
      <div className="border-b border-gray-200 w-full mb-4"></div>
      <ul className="space-y-3 text-sm md:text-[15px] text-gray-700">
        {topics?.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className="flex items-center gap-2 hover:text-purple-700 cursor-pointer w-full text-left"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0"></span>
            <span className="truncate">{topic.topic_name}</span>
          </button>
        ))}
        {topics?.length === 0 && (
          <button disabled className="text-gray-400 italic w-full text-left">
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
          <h1 className="text-lg font-semibold text-gray-900">
            {getDisplayTitle()} Posts
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
        {getDescription()}
      </p>

      {/* Full-width 2-col layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        {/* Feed (left) */}
        <div className="space-y-5">
          {posts.length === 0 && !isLoading ? (
            <div className="text-center py-10 text-gray-500">
              No posts found
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
        className={`xl:hidden fixed right-0 top-0 h-full w-[85vw] max-w-[380px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isTopicsOpen ? "translate-x-0" : "translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Topics"
      >
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b flex items-center justify-between">
          <span className="font-medium">Topics</span>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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