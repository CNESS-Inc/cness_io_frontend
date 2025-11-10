import { useEffect, useState, useCallback, useRef } from "react";
import PostCard from "../components/Profile/Post";
import ConnectionsCard from "../components/Profile/Tabs";
import { TrendingUp } from "lucide-react";
import {
  getTopics,
  GetTrendingPost,
  getUserSelectedTopic,
} from "../Common/ServerAPI";
import ProfileCards from "./ProfileCards";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";

type Post = React.ComponentProps<typeof PostCard>;
type Profile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
};

export default function TrendingAI() {
  const tabs = ["Top", "Latest", "People"];
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Ai");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { showToast } = useToast();
  const [topics, setTopics] = useState<any[]>([]); // list of topics
  const [visibleTopic, setVisibleTopic] = useState(10);
  const [userSelectedTopics, setUserSelectedTopics] = useState<any[]>([]); // list of user selected topics
  // Use refs to track values without causing re-renders
  const selectedTopicRef = useRef(selectedTopic);
  const activeTabRef = useRef(activeTab);
  const loggedInUserID = localStorage.getItem("Id");

  const navigate = useNavigate();

  // Update refs when state changes
  useEffect(() => {
    selectedTopicRef.current = selectedTopic;
    activeTabRef.current = activeTab;
  }, [selectedTopic, activeTab]);

  // Create a ref for the last element
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  // Memoize the getUserPosts function with minimal dependencies
  const getData = useCallback(
    async (isNewSearch = false) => {
      if ((isLoading && !isNewSearch) || (!isNewSearch && !hasMore)) return;

      setIsLoading(true);
      try {
        const currentPage = isNewSearch ? 1 : page;

        // Use ref values instead of state to prevent recreation
        const res = await GetTrendingPost(
          selectedTopicRef.current,
          activeTabRef.current.toLowerCase(),
          currentPage // Use currentPage instead of page
        );

        if (activeTabRef.current === "People") {
          // Handle People tab response
          if (res?.data?.data?.rows) {
            const newProfiles: Profile[] = res.data.data.rows.map((el: any) => {
              return {
                id: el?.user?.id || "",
                username: el?.user?.username || "",
                firstName: el?.profile?.first_name || "",
                lastName: el?.profile?.last_name || "",
                profilePicture: el?.profile?.profile_picture || null,
              };
            });

            const totalCount = res?.data?.data?.count || 0;
            const itemsPerPage = 10;
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            if (newProfiles.length === 0) {
              setHasMore(false);
            } else {
              setProfiles((prevProfiles) =>
                isNewSearch ? newProfiles : [...prevProfiles, ...newProfiles]
              );

              if (currentPage >= totalPages) {
                setHasMore(false);
              } else if (isNewSearch) {
                setPage(2);
                setHasMore(true);
              } else {
                setPage((prevPage) => prevPage + 1);
              }
            }
          } else {
            setHasMore(false);
          }
        } else {
          // Handle Posts tabs (Top, Latest)
          if (res?.data?.data?.rows) {
            const newPosts: Post[] = res.data.data.rows.map((el: any) => {
              return {
                avatar: el?.profile?.profile_picture || null,
                name:
                  `${el?.profile?.first_name || ""} ${
                    el?.profile?.last_name || ""
                  }`.trim() || "Unknown User",
                time: el?.createdAt,
                following: el?.if_following || false,
                media: el?.file,
                likes: el?.likes_count || 0,
                reflections: el?.total_comment_count || 0,
                id: el?.id || null,
                isLiked: el?.is_liked || false,
                content: el?.content || "",
              };
            });

            const totalCount = res?.data?.data?.count || 0;
            const itemsPerPage = 10;
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            if (newPosts.length === 0) {
              setHasMore(false);
            } else {
              setPosts((prevPosts) =>
                isNewSearch ? newPosts : [...prevPosts, ...newPosts]
              );

              if (currentPage >= totalPages) {
                setHasMore(false);
              } else if (isNewSearch) {
                setPage(2);
                setHasMore(true);
              } else {
                setPage((prevPage) => prevPage + 1);
              }
            }
          } else {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [page, isLoading, hasMore]
  );

  useEffect(() => {
    fetchUserSelectedTopics();
  }, []);

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

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        getData(false);
      }
    };

    observer.current = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasMore, getData]);

  // Reset and fetch new data when tab or topic changes
  useEffect(() => {
    // Reset state
    setPosts([]);
    setProfiles([]);
    setPage(1);
    setHasMore(true);

    // Call API with new parameters
    getData(true);
  }, [selectedTopic, activeTab]);
  useEffect(() => {
    fetchTopics();
  }, []);


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

  // const handleTopicClick = (topicLabel: string) => {
  //   const topicWithoutHash = topicLabel.replace("#", "");
  //   setSelectedTopic(topicWithoutHash);
  // };

  return (
    <div className="w-full px-4 py-4">
      <ConnectionsCard
        title="Trending Hash tags"
        tabs={tabs}
        hashtags={["DeepLearning", "MachineLearning", "AI", "FutureOfWork"]}
        onSearch={(value) => setSelectedTopic(value)}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        getUserPosts={undefined}
      />

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Left Column: Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "People" ? (
            // Render profiles for People tab
            <>
              {isLoading && profiles.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : profiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {profiles.map((profile, i) => {
                    // Add ref to the last profile element
                    if (profiles.length === i + 1) {
                      return (
                        <div ref={lastElementRef} key={i} className="h-full">
                          <ProfileCards
                            id={profile.id}
                            username={profile.username}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            profilePicture={profile.profilePicture}
                            onFollow={() => console.log("follow", i)}
                            onMessage={() => console.log("message", i)}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={i} className="h-full">
                          <ProfileCards
                            id={profile.id}
                            username={profile.username}
                            firstName={profile.firstName}
                            lastName={profile.lastName}
                            profilePicture={profile.profilePicture}
                            onFollow={() => console.log("follow", i)}
                            onMessage={() => console.log("message", i)}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No profiles found for this topic
                </div>
              )}
            </>
          ) : (
            // Render posts for other tabs
            <>
              {isLoading && posts.length === 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post, i) => {
                    // Add ref to the last post element
                    if (posts.length === i + 1) {
                      return (
                        <div ref={lastElementRef} key={i}>
                          <PostCard
                            {...post}
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
                          {...post}
                          onLike={() => console.log("like", i)}
                          onAffirmation={() => console.log("affirmation", i)}
                          onReflections={() => console.log("reflections", i)}
                          onShare={() => console.log("share", i)}
                        />
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No posts found for this topic
                </div>
              )}
            </>
          )}

          {/* Loading indicator for additional content */}
          {isLoading &&
            ((activeTab === "People" && profiles.length > 0) ||
              (activeTab !== "People" && posts.length > 0)) && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

          {/* No more content message */}
          {!hasMore &&
            ((activeTab === "People" && profiles.length > 0) ||
              (activeTab !== "People" && posts.length > 0)) && (
              <div className="text-center py-4 text-gray-500">
                No more {activeTab === "People" ? "profiles" : "posts"} to load
              </div>
            )}
        </div>

        {/* Right Column: Trending Topics */}
        <aside className="lg:col-span-1 xl:sticky xl:top-4 self-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <div className="font-medium text-gray-900 ">Trending Topics</div>
            </div>

            <div className="border-b border-gray-200 w-full mb-4"></div>

            <ul className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
              {topics?.slice(0, visibleTopic)?.map((topic) => (
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
        </aside>
      </div>
    </div>
  );
}
