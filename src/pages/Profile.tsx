import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Copy,        // Posts & Collections
  PlayCircle,  // Reels
  Users,       // Connections
  AtSign,      // About
  CirclePlay,  // empty state icon
 Pen,
 Plus 
} from "lucide-react";
import MyPost from "../components/Profile/Mypost";
import MyCollection from "../components/Profile/MymultiviewCollection";
import type { CollectionBoard } from "../components/Profile/MymultiviewCollection"; // type-only import ✅

import PostPopup  from "../components/Profile/Popup";

import aware1 from "../assets/aware_1.jpg";
import aware2 from "../assets/aware_2.jpg";
import aware3 from "../assets/aware_3.jpg";
import carusol2 from "../assets/carosuel2.png";
//import carusol3 from "../assets/carosuel3.png";
import  aware4 from "../assets/carosuel4.png"

//import MyCollection from "../components/Profile/MyCollection";

type MyPostProps = React.ComponentProps<typeof MyPost>;
//type MyCollectionProps = React.ComponentProps<typeof MyCollection>;

export interface Media {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}
//sample for collections

const demoBoards: CollectionBoard[] = [
  {
    id: "c1",
    title: "Collection 1",
    updatedAt: "2d ago",
    items: [
      { id: "1", type: "image", src: aware1 },
      { id: "2", type: "image", src: aware2 },
      { id: "3", type: "video", src: "/test1.mp4", poster: "/images/party.jpg" },
      { id: "4", type: "image", src: aware3 },
    ],
  },
  {
    id: "c2",
    title: "Collection 2",
    updatedAt: "2d ago",
    items: [
      { id: "1", type: "image", src: aware4 },
      { id: "2", type: "image", src: carusol2 },
      { id: "3", type: "video", src: "/test1.mp4", poster: "/images/party.jpg" },
      { id: "4", type: "text", text: "Sustainability has become a transformative force…" },
    ],
  },
];

//sample for posts

const demoPosts: MyPostProps[] = [
  {
    media: { type: "image", src: aware1, alt: "Mindfulness" },
    likes: 423000,
    reflections: 30,
    
  },
  {
    media: { type: "video", src: "/test1.mp4", poster: "/images/yoga.jpg" },
    likes: 421000,
    reflections: 45,
  },
  {
    media: null,
    body:
      "Sustainability has become a transformative force across industries, reshaping strategy and consumer expectations alike. What began as niche initiatives is now core to brand identity: companies are redesigning products with responsibly sourced ingredients, prioritizing cruelty-free testing, and cutting unnecessary additives. Supply chains are being audited end-to-end for ethical labor practices, traceability, and lower carbon footprints,  ",
    likes: 421000,
    reflections: 45,
  },
];


type TabDef = { name: string; Icon: React.ComponentType<any> };

const tabs: TabDef[] = [
  { name: "Posts",        Icon: Copy },
  { name: "Reels",        Icon: PlayCircle },
  { name: "Connections",  Icon: Users },
  { name: "Collections",  Icon: Copy },
  { name: "About",        Icon: AtSign },
];

function TabButton({
  name,
  Icon,
  active,
  onClick,
}: {
  name: string;
  Icon: React.ComponentType<any>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "relative inline-flex items-center justify-center gap-2",
        "w-[154.6px] h-[42px]",
        "px-3",
        "rounded-t-[12px]",
        "text-sm transition-colors",
        "font-[500] leading-[100%] tracking-[0%] font-['Plus_Jakarta_Sans']",
        active
          ? "border-b-[1px] border-b-[#9747FF] text-[#9747FF] bg-transparent"
          : "border-b-[1px] border-b-transparent text-gray-700 hover:text-[#9747FF] bg-white",
      ].join(" ")}
    >
      {/* Gradient background for active state */}
      {active && (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 bottom-0 rounded-t-[12px]
                     bg-gradient-to-b from-[#FFFFFF] via-[#F5F2FF] to-[rgba(151,71,255,0.14)] z-0"
        />
      )}

      {/* Icon + Label */}
      <span className="relative z-10 flex items-center gap-2">
        <Icon
          className={`h-5 w-5 ${
            active ? "text-[#9747FF]" : "text-black-500 group-hover:text-[#9747FF]"
          }`}
        />
        <span>{name}</span>
      </span>
    </button>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string>("Posts");
const [boards, setBoards] = useState<CollectionBoard[]>([]);
  const handleAddCollection = () => setBoards(demoBoards);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<MyPostProps | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fb]">
      {/* Profile Header */}
      <div className="bg-white border-gray-100 rounded-lg">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                Lara <span className="text-gray-500">(@laracorol.com)</span>
              </h1>
              <div className="flex gap-4 text-sm">
                <span className="text-purple-500">100 Following</span>
                <span className="text-purple-500">1k Followers</span>
              </div>
            </div>
          </div>
         <button className="flex items-center gap-2 px-5 py-2 bg-[#7077FE] hover:bg-[#7077FE] text-white rounded-full text-sm transition">
  <Pen className="w-4 h-4" />
  Edit Profile
          </button>
        </div>

        {/* Tabs bar */}
        <div className="border-t border-gray-200">
  <nav className="flex justify-start items-stretch gap-5 md:gap-10 bg-white mt-4">
            {tabs.map(({ name, Icon }) => (
              <TabButton
                key={name}
                name={name}
                Icon={Icon}
                active={activeTab === name}
                onClick={() => setActiveTab(name)}
              />
            ))}
          </nav>
        </div>
      </div>


{/* Content */}
      <div className="flex-1 p-6">
        {activeTab === "Posts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPosts.length ? (
              demoPosts.map((post, i) => (
                <MyPost
                  key={i}
                  {...post}
                   onClick={() => setSelectedPost(post)}
                  onLike={() => console.log("Liked post", i)}
                  onOpenReflections={() => console.log("Open reflections for post", i)}
                />
              ))
            ) : (
              <div className="col-span-full border border-dashed border-purple-300 rounded-lg flex items-center justify-center py-16 text-center bg-[#F5F2FF]">
                <div className="flex items-center gap-2 text-[#575FFF]">
                  <CirclePlay className="h-5 w-5" strokeWidth={2} />
                  <span className="text-sm">No Post yet</span>
                </div>
              </div>
            )}
          </div>   
        )}
 {selectedPost && (
          <PostPopup
            post={{
              id: String(demoPosts.indexOf(selectedPost)),
              media: selectedPost.media!,
             
            }}
            onClose={() => setSelectedPost(null)}
          />
        )}

      
{activeTab === "Collections" && (
  boards.length === 0 ? (
    // Empty state: centered pill
    <div className="border border-dashed border-[#C4B5FD] rounded-xl bg-[#F8F6FF] py-12 flex items-center justify-center">
      <button
        onClick={handleAddCollection}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#575FFF] hover:bg-[#4b52ff] text-white text-sm font-medium shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Collection
      </button>
    </div>
  ) : (
    // Collections exist: header left text + right-aligned button
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Only You Can See What You’ve Saved</p>

        <button
          onClick={handleAddCollection}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full
                     bg-white border border-gray-200 text-gray-700 text-sm
                     hover:bg-gray-50 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      <MyCollection
        mode="boards" 
        boards={boards}
       onOpen={(id) => {
          // send the board along with navigation so the view page has data
          const board = boards.find((b) => b.id === id);
          navigate(`/dashboard/MyCollection/${id}`, { state: { board } });
        }}
      />
    </div>
  )
      )}

        {activeTab === "Reels" && (
          <div className="text-gray-400 text-center py-16">No Reels yet.</div>
        )}
        {activeTab === "Connections" && (
          <div className="text-gray-400 text-center py-16">No Connections yet.</div>
        )}
        {activeTab === "About" && (
          <div className="text-gray-400 text-center py-16">About goes here.</div>
        )}
      </div>
    </div>
  );
}
