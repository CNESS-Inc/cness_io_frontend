//import { useState } from "react";
import { useEffect, useState } from "react";
import PostCard from "../components/Profile/Post";
import ConnectionsCard from "../components/Profile/Tabs"
// import person1 from "../assets/person1.jpg";
// import person2 from "../assets/person2.jpg";
// import carousel3 from "../assets/carosuel3.png";
import { TrendingUp } from "lucide-react";

import { GetTrendingPost } from "../Common/ServerAPI";

type Post = React.ComponentProps<typeof PostCard>;

// const postss: Post[] = [
//   {
//     avatar: person2,
//     name: "Anu",
//     time: "2 hours ago",
//     following: true,
//     media: { type: "image", src: carousel3, alt: "Sea" },
//     likes: 421000,
//     reflections: 45,
//   },
//   {
//     avatar: person1,
//     name: "Olivia Gracia",
//     time: "2 hours ago",
//     following: true,
//     media: { type: "video", src: "/test1.mp4", poster: "/images/cover-landscape.jpg" },
//     likes: 19800,
//     reflections: 12,
//   },
// ];





export default function TrendingAI() {
  const tabs = ["Top", "Latest", "People", "Media", "Lists"];
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Ai"); // Default to "Ai"




  const getUserPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await GetTrendingPost(selectedTopic); // Use selectedTopic here
      console.log("🚀 ~ getUserPosts ~ res:", res)

      if (res?.data) {
        const newPosts: Post[] = res?.data.data.rows?.map((el: any) => {
          return {
            avatar: el?.profile?.profile_picture || null,
            name: `${el?.profile?.first_name || ''} ${el?.profile?.last_name || ''}`,
            time: el?.createdAt,
            following: el?.if_following || false,
            media: {
              type: el?.file_type,
              src: el?.file,
              poster: "/images/cover-landscape.jpg"
            },
            likes: el?.likes_count,
            reflections: el?.reflections_count || 0,
          }
        }) || [];

        const totalPages = res?.data?.data?.count / 10 || 0;

        if (newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);

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

  const trendingTopics = [
    { label: "#AI" },
    { label: "#Conscious" },
    { label: "#Social_impact", icon: "🔥" },
    { label: "#Save_water", icon: "💧" },
  ];

  const handleTopicClick = (topicLabel: string) => {
    const topicWithoutHash = topicLabel.replace('#', '');
    setSelectedTopic(topicWithoutHash);
    setPosts([]); // Clear existing posts
    setPage(1); // Reset pagination
    setHasMore(true); // Reset hasMore
  };

  useEffect(() => {
    getUserPosts();
  }, [selectedTopic]); // Add selectedTopic as dependency



  return (
    <div className="w-full px-0.5 py-0.5">

      <ConnectionsCard
        title="Trending Hash tags"
        //subtitle="Explore the latest updates"
        tabs={tabs}
        hashtags={["DeepLearning", "MachineLearning", "AI", "FutureOfWork"]}
        onSearch={(value) => console.log("Searching:", value)}
      //onBack={() => console.log("Back button clicked")}
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
        {/* Topics rail (right) */}
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
