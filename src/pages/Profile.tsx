import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useEffect } from "react"; // at top
import FollowingModal from "../components/Profile/Following";
import FollowersModal from "../components/Profile/Followers";
import Connections from "../components/Profile/Connections";
import ProfileCard from "../components/Profile/Profilecard";



import {
  Copy,        // Posts & Collections
  PlayCircle,  // Reels
  Users,       // Connections
  AtSign,      // About
  CirclePlay,  // empty state icon
 
 
} from "lucide-react";
import MyPost from "../components/Profile/Mypost";
import MyCollection from "../components/Profile/MymultiviewCollection";
import type { CollectionBoard } from "../components/Profile/MymultiviewCollection"; // type-only import ✅

import PostPopup  from "../components/Profile/Popup";

import aware1 from "../assets/aware_1.jpg";
import aware2 from "../assets/aware_2.jpg";
import aware3 from "../assets/aware_3.jpg";
import carusol2 from "../assets/carosuel2.png";
import  aware4 from "../assets/carosuel4.png"

import {
  GetFollowingUser, 
  GetFollowerUser, 
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

interface FollowedUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_following: boolean;
}
interface FollowerUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_following?: boolean; // Optional, since this is for followers
}

//import MyCollection from "../components/Profile/MyCollection";

type MyPostProps = React.ComponentProps<typeof MyPost>;

export interface Media {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}
//sample for collections

const profiles = [
  {
    profileImage: person1,
    name: "Lara",
    username: "laracorol.com",
    following: "100",
    followers: "1k",
    tabs: [
      { label: "Posts", icon: <Copy size={16} /> },
      { label: "Reels", icon: <PlayCircle size={16} /> },
      { label: "Connections", icon: <Users size={16} /> },
      { label: "Collections", icon: <Copy size={16} /> },
      { label: "About", icon: <AtSign size={16} /> },
    ],
  },
];


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

const followersdata = [
  { id: "1", name: "Chloe",  handle: "chloejane",    avatar: "/assets/person1.jpg" },
  { id: "2", name: "Noah",   handle: "noahsky",      avatar: "/assets/person2.jpg" },
  { id: "3", name: "Liam",   handle: "iamstone",     avatar: "/assets/person3.jpg" },
  { id: "4", name: "Lara",   handle: "laracorol.com",avatar: "/assets/person4.jpg" },
  { id: "5", name: "Mia",    handle: "miachen",      avatar: "/assets/person5.jpg" },
  { id: "6", name: "Ethan",  handle: "ethan.green",  avatar: "/assets/person6.jpg" },
  { id: "7", name: "David",  handle: "david",  avatar: "/assets/person6.jpg" },
  { id: "8", name: "Rocky",  handle: "rocky.green",  avatar: "/assets/person6.jpg" },
  { id: "9", name: "John",  handle: "john",  avatar: "/assets/person6.jpg" },
  { id: "10", name: "Sam",  handle: "sam.green",  avatar: "/assets/person6.jpg" },
  { id: "11", name: "Nicki",  handle: "nic.green",  avatar: "/assets/person6.jpg" },
  { id: "12", name: "Lily",  handle: "lil.green",  avatar: "/assets/person6.jpg" },
  { id: "13", name: "Jasmin",  handle: "Jas.red",  avatar: "/assets/person6.jpg" },
];

const friendsdata = [
  { id: "1", name: "Chloe",  handle: "chloejane",    avatar: aware1},
  { id: "2", name: "Noah",   handle: "noahsky",      avatar: "/assets/person2.jpg" },
  { id: "3", name: "Liam",   handle: "iamstone",     avatar: "/assets/person3.jpg" },
  { id: "4", name: "Lara",   handle: "laracorol.com",avatar: "/assets/person4.jpg" },
  { id: "5", name: "Mia",    handle: "miachen",      avatar: "/assets/person5.jpg" },
  { id: "6", name: "Ethan",  handle: "ethan.green",  avatar: "/assets/person6.jpg" },
]
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


//type TabDef = { name: string; Icon: React.ComponentType<any> };

{/*const tabs: TabDef[] = [
  { name: "Posts",        Icon: Copy },
  { name: "Reels",        Icon: PlayCircle },
  { name: "Connections",  Icon: Users },
  { name: "Collections",  Icon: Copy },
  { name: "About",        Icon: AtSign },
];*/}


export default function Profile() {
  const location = useLocation();
const [activeTab, setActiveTab] = useState(
  location.state?.activeTab || profiles[0].tabs[0].label
);
const [boards, setBoards] = useState<CollectionBoard[]>([]);
  //const handleAddCollection = () => setBoards(demoBoards);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<MyPostProps | null>(null);
  const [openFollowing, setOpenFollowing] = useState(false);
    const [openFollowers ,setopenfollowers] = useState(false);
  


  const [followingUsers, setFollowingUsers] = useState<FollowedUser[]>([]);
  const [followerUsers, setFollowerUsers] = useState<FollowerUser[]>([]);
  
  const userProfilePicture = localStorage.getItem('profile_picture') || "/profile.png";

  const userName = localStorage.getItem('name') +' '+ localStorage.getItem('margaret_name')  || "User";

  const { showToast } = useToast();

  const fetchFollowingUsers = async () => {
      
      try {
        const res = await GetFollowingUser();
        // Transform the API response to match FollowedUser interface
        const transformedUsers = res.data.data.rows.map((item: any) => ({
          id: item.following_id,
          username: item.following_user.username,
          first_name: item.following_user.profile.first_name,
          last_name: item.following_user.profile.last_name,
          profile_picture: item.following_user.profile.profile_picture,
          is_following: true, // Since these are users you're following
        }));
  
        setFollowingUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching followed users:", error);
        // Optional: Show error to user
        showToast({
          message: "Failed to load followed users",
          type: "error",
          duration: 3000,
        });
      } 
  };
  
  const fetchFollowerUsers = async () => {
      
      try {
        const res = await GetFollowerUser();
        // Transform the API response to match FollowedUser interface
        const transformedUsers = res.data.data.rows.map((item: any) => ({
          id: item.follower_id,
          username: item.follower_user.username,
          first_name: item.follower_user.profile.first_name,
          last_name: item.follower_user.profile.last_name,
          profile_picture: item.follower_user.profile.profile_picture,
          is_following: true, // Since these are users you're following
        }));
  
        setFollowerUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching follower users:", error);
        // Optional: Show error to user
        showToast({
          message: "Failed to load follower users",
          type: "error",
          duration: 3000,
        });
      } 
  };

  useEffect(() => {
    if (activeTab === "Collections" && boards.length === 0) {
      setBoards(demoBoards);
    }
  }, [activeTab, boards.length]);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fb]">
       
   {profiles.map((profile, index) => (
        <ProfileCard
          key={index}
          {...profile}
         // onTabChange={(tab) => setActiveTab(tab)}
           onOpenFollowing={() => setOpenFollowing(true)}
  onOpenFollowers={() => setopenfollowers(true)}
  activeTab={activeTab}
  onTabChange={setActiveTab}
        />
      ))}


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
    // Empty state without any button
    <div className="border border-dashed border-[#C4B5FD] rounded-xl bg-[#F8F6FF] py-12 flex items-center justify-center">
      <p className="text-sm text-gray-500">No collections yet</p>
    </div>
  ) : (
    // Collections exist: header + list
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Only You Can See What You’ve Saved</p>
      </div>

      <MyCollection
        mode="boards"
        boards={boards}
        onOpen={(id) => {
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
  followersdata.length > 0 ? (
    <Connections
  connections={friendsdata.map(f => ({
    id: f.id,
    name: f.name,
    username: f.handle,
    profileImage: f.avatar
  }))}
  onMessage={(id) => console.log("Connect with", id)}
  onUnfriend={(id) => console.log("Remove connection", id)}
/>
  ) : (
    <div className="text-gray-400 text-center py-16">
      No Connections yet.
    </div>
  )
)}
        {activeTab === "About" && (
          <div className="text-gray-400 text-center py-16">About goes here.</div>
        )}
      </div>
      <FollowingModal
      open={openFollowing}
      onClose={() => setOpenFollowing(false)}
      friends={followingUsers.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        handle: user.username,
        avatar: user.profile_picture ? user.profile_picture : "/profile.png",
      }))}
    />

    <FollowersModal
      open={openFollowers}
      onClose={() => setopenfollowers(false)}
      followers={followerUsers.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        handle: user.username,
        avatar: user.profile_picture ? user.profile_picture : "/profile.png",
        isFollowing: user.is_following,
      }))}
    />
    </div>

    
  );
}
