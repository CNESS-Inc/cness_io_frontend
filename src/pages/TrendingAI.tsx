//import { useState } from "react";
import PostCard from "../components/Profile/Post";
import ConnectionsCard from "../components/Profile/Tabs"
import person1 from "../assets/person1.jpg";
import person2 from "../assets/person2.jpg";
import carousel3 from "../assets/carosuel3.png";
import {  TrendingUp } from "lucide-react";

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

export default function TrendingAI() {
  const tabs = ["Top", "Latest", "People", "Media", "Lists"];

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
          {posts.map((post, i) => (
            <PostCard
              key={i}
              {...post}
              onLike={() => console.log("like", i)}
              onAffirmation={() => console.log("affirmation", i)}
              onReflections={() => console.log("reflections", i)}
              onShare={() => console.log("share", i)}
            />
          ))}
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
    const isSelected = t.label === "#AI"; // highlight AI always in this page
    return (
      <li
        key={t.label}
        className="flex items-center justify-between font-opensans font-normal text-[14px] leading-[100%] cursor-pointer px-3 py-2 rounded-md hover:bg-[#E6E9FF] transition-all duration-200 ease-in-out transform hover:scale-y-110 w-full"
          
       
      >
        <span
          className={`transition-colors duration-200 ${
            isSelected ? "text-[#7077FE]" : "text-black hover:text-[#7077FE]"
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
