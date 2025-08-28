import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/Profile/Post";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { getPostByTopicId } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

type Topic = {
  id: string;
  topic_name: string;
  slug: string;
};
const PAGE_LIMIT = 10;

export default function Topic() {
  const nav = useNavigate();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const topics: Topic[] = location.state?.topics || [];
  const userSelectedTopics: Topic[] = location.state?.userSelectedTopics || [];

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement>(null);
  const initialLoad = useRef(true);

  const clickedTopic: Topic | undefined = topics?.find(
    (item) => item?.slug === slug
  );

  const mapApiRowToPost = (el: any): Post => ({
    avatar: el?.profile?.profile_picture || null,
    name: `${el?.profile?.first_name || ""} ${
      el?.profile?.last_name || ""
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
      if (!clickedTopic?.id || isLoading || !hasMore) return;

      setIsLoading(true);
      try {
        const res = await getPostByTopicId(
          clickedTopic.id,
          requestedPage,
          PAGE_LIMIT
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

            if (page >= totalPages) {
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
    [page, isLoading, hasMore, clickedTopic]
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
          getUserPosts(); // loads using current `page`
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.current.observe(lastPostElementRef.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [posts.length, clickedTopic?.id, isLoading, hasMore, getUserPosts]);

  // Initial load
  useEffect(() => {
    if (!clickedTopic?.id) {
      setPosts([]);
      setHasMore(false);
      setPage(1);
      return;
    }

    // Reset state when component mounts
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    initialLoad.current = true;

    // Load first page immediately
    const loadFirstPage = async () => {
      try {
        const res = await getPostByTopicId(clickedTopic.id, 1, PAGE_LIMIT);
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
  }, [clickedTopic]);

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
        Join the community sharing insights about {clickedTopic?.topic_name}.
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
        <aside className="xl:sticky xl:top-4 space-y-4 self-start">
          {/* <div className="rounded-2xl space-y-8 border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]"> */}
            {userSelectedTopics?.length > 0 && (
              <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
                <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-3 md:mb-4 px-4">
                  My Picks
                </h3>
                <div className="w-full border-t border-[#C8C8C8] my-4"></div>
                <ul className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
                  {userSelectedTopics?.map((topic) => (
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
                </ul>
              </div>
            )}
            <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
              <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-3 md:mb-4 px-4">
                Explore Topics
              </h3>
              <div className="w-full border-t border-[#C8C8C8] my-4"></div>
              <ul className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
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
                    className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {topic.topic_name}
                  </button>
                ))}
                {topics?.length === 0 && (
                  <button disabled className="text-gray-400 italic">
                    No topics available
                  </button>
                )}
              </ul>
            </div>

            <div className="my-5 h-px bg-gray-100" />
          {/* </div> */}
        </aside>
      </div>
    </div>
  );
}
