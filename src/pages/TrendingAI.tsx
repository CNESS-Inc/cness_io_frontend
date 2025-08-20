import { useEffect, useState, useCallback, useRef } from "react";
import PostCard from "../components/Profile/Post";
import ConnectionsCard from "../components/Profile/Tabs";
import { TrendingUp } from "lucide-react";
import { GetTrendingPost } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

export default function TrendingAI() {
  const tabs = ["Top", "Latest", "People"];
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Ai");
  const [activeTab, setActiveTab] = useState(tabs[0]);
  
  // Use refs to track values without causing re-renders
  const selectedTopicRef = useRef(selectedTopic);
  const activeTabRef = useRef(activeTab);
  
  // Update refs when state changes
  useEffect(() => {
    selectedTopicRef.current = selectedTopic;
    activeTabRef.current = activeTab;
  }, [selectedTopic, activeTab]);

  // Memoize the getUserPosts function with minimal dependencies
  const getUserPosts = useCallback(async (isNewSearch = false) => {
    if ((isLoading && !isNewSearch) || (!isNewSearch && !hasMore)) return;

    setIsLoading(true);
    try {
      const currentPage = isNewSearch ? 1 : page;
      
      // Use ref values instead of state to prevent recreation
      const res = await GetTrendingPost(
        selectedTopicRef.current, 
        activeTabRef.current.toLowerCase()
      );
      
      console.log("🚀 ~ getUserPosts ~ res:", res);

      if (res?.data?.data?.rows) {
        const newPosts: Post[] = res.data.data.rows.map((el: any) => {
          return {
            avatar: el?.profile?.profile_picture || null,
            name: `${el?.profile?.first_name || ''} ${el?.profile?.last_name || ''}`.trim() || 'Unknown User',
            time: el?.createdAt,
            following: el?.if_following || false,
            media: el?.file,
            likes: el?.likes_count || 0,
            reflections: el?.total_comment_count || 0,
            id: el?.id || null,
            isLiked: el?.is_liked || false,
            content: el?.content || '',
          };
        });

        const totalCount = res?.data?.data?.count || 0;
        const itemsPerPage = 10;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prevPosts => isNewSearch ? newPosts : [...prevPosts, ...newPosts]);
          
          if (currentPage >= totalPages) {
            setHasMore(false);
          } else if (isNewSearch) {
            setPage(2);
            setHasMore(true);
          } else {
            setPage(prevPage => prevPage + 1);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]); // Removed selectedTopic and activeTab from dependencies

  // Reset and fetch new posts when tab or topic changes
  useEffect(() => {
    // Reset state
    setPosts([]);
    setPage(1);
    setHasMore(true);
    
    // Call API with new parameters
    getUserPosts(true);
  }, [selectedTopic, activeTab]); // Removed getUserPosts from dependencies

  const trendingTopics = [
    { label: "#AI" },
    { label: "#Conscious" },
    { label: "#Social_impact", icon: "🔥" },
    { label: "#Save_water", icon: "💧" },
  ];

  const handleTopicClick = (topicLabel: string) => {
    const topicWithoutHash = topicLabel.replace('#', '');
    setSelectedTopic(topicWithoutHash);
  };

  return (
    <div className="w-full px-0.5 py-0.5">
      <ConnectionsCard
        title="Trending Hash tags"
        tabs={tabs}
        hashtags={["DeepLearning", "MachineLearning", "AI", "FutureOfWork"]}
        onSearch={(value) => console.log("Searching:", value)}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        getUserPosts={() => getUserPosts(true)}
      />

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        {/* Left Column: Posts */}
        <div className="lg:col-span-3 space-y-4">
          {isLoading && posts.length === 0 ? (
            <div>Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map((post, i) => (
              <PostCard
                key={i}
                {...post}
                onLike={() => console.log("like", i)}
                onAffirmation={() => console.log("affirmation", i)}
                onReflections={() => console.log("reflections", i)}
                onShare={() => console.log("share", i)}
              />
            ))
          ) : (
            <div>No posts found</div>
          )}
        </div>
        
        {/* Right Column: Trending Topics */}
        <aside className="xl:sticky xl:top-4 self-start">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <div className="font-medium text-gray-900 ">Trending Topics</div>
            </div>

            <div className="border-b border-gray-200 w-full mb-4"></div>

            <ol className="space-y-3 text-sm">
              {trendingTopics.map((t, idx) => {
                const topicWithoutHash = t.label.replace('#', '');
                const isSelected = topicWithoutHash === selectedTopic;
                return (
                  <li
                    key={t.label}
                    className={`flex items-center justify-between font-opensans font-normal text-[14px] leading-[100%] cursor-pointer px-3 py-2 rounded-md hover:bg-[#E6E9FF] transition-all duration-200 ease-in-out transform hover:scale-y-110 w-full ${isSelected ? "bg-[#E6E9FF]" : ""
                      }`}
                    onClick={() => handleTopicClick(t.label)}
                  >
                    <span
                      className={`transition-colors duration-200 ${isSelected ? "text-[#7077FE]" : "text-black hover:text-[#7077FE]"
                        }`}
                    >
                      {idx + 1}. {t.label}
                    </span>
                    {t.icon && <span className="ml-2">{t.icon}</span>}
                  </li>
                );
              })}
            </ol>
            <div className="my-5 h-px bg-gray-100" />
          </div>
        </aside>
      </div>
    </div>
  );
}