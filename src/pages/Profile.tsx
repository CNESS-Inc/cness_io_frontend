import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import FollowingModal from "../components/Profile/Following";
import FollowersModal from "../components/Profile/Followers";
import Connections from "../components/Profile/Connections";
import ProfileCard from "../components/Profile/Profilecard";
// import person1 from "../assets/person1.jpg";

import {
  Copy, // Posts & Collections
  PlayCircle, // Reels
  Users, // Connections
  // AtSign,      // About
  CirclePlay, // empty state icon
} from "lucide-react";
import MyPost from "../components/Profile/Mypost";
// import MyCollection from "../components/Profile/MymultiviewCollection";
import type { CollectionBoard } from "../components/Profile/MymultiviewCollection"; // type-only import ✅

import PostPopup from "../components/Profile/Popup";

// import aware1 from "../assets/aware_1.jpg";
// import aware2 from "../assets/aware_2.jpg";
// import aware3 from "../assets/aware_3.jpg";
// import carusol2 from "../assets/carosuel2.png";
// import aware4 from "../assets/carosuel4.png";

import {
  // GetFollowingUser,
  GetFollowerUser,
  GetUserPost,
  GetFollowingFollowerUsers,
  DeleteUserPost,
  PostsLike,
  GetConnectionUser,
  UnFriend,
  MeDetails,
  GetSavedPosts,
  SavePost,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

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
const userProfilePicture = localStorage.getItem("profile_picture");

const userName = localStorage.getItem("username") || "User";
const fullName = localStorage.getItem("name") || "User";

const profiles = [
  {
    profileImage:
      !userProfilePicture ||
      userProfilePicture === "null" ||
      userProfilePicture === "undefined" ||
      !userProfilePicture.startsWith("http")
        ? "/profile.png"
        : userProfilePicture,
    name: fullName,
    username: userName,
    following: "",
    followers: "",
    tabs: [
      { label: "Posts", icon: <Copy size={16} /> },
      { label: "Reels", icon: <PlayCircle size={16} /> },
      { label: "Connections", icon: <Users size={16} /> },
      { label: "Collections", icon: <Copy size={16} /> },
      // { label: "About", icon: <AtSign size={16} /> },
    ],
  },
];

// const demoBoards: CollectionBoard[] = [
//   {
//     id: "c1",
//     title: "Collection 1",
//     updatedAt: "2d ago",
//     items: [
//       { id: "1", type: "image", src: aware1 },
//       { id: "2", type: "image", src: aware2 },
//       {
//         id: "3",
//         type: "video",
//         src: "/test1.mp4",
//         poster: "/images/party.jpg",
//       },
//       { id: "4", type: "image", src: aware3 },
//     ],
//   },
//   {
//     id: "c2",
//     title: "Collection 2",
//     updatedAt: "2d ago",
//     items: [
//       { id: "1", type: "image", src: aware4 },
//       { id: "2", type: "image", src: carusol2 },
//       {
//         id: "3",
//         type: "video",
//         src: "/test1.mp4",
//         poster: "/images/party.jpg",
//       },
//       {
//         id: "4",
//         type: "text",
//         text: "Sustainability has become a transformative force…",
//       },
//     ],
//   },
// ];

/*const followersdata = [
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
*/
//sample for posts
/*
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
   {
    media: { type: "video", src: "/test1.mp4", poster: "/images/yoga.jpg" },
    likes: 421000,
    reflections: 45,
  },
   {
    media: null,
    body:
    "Sustainability has become a transformative force across industries, reshaping strategy and consumer expectations alike. What began as niche initiatives is now core to brand identity: companies are redesigning products with responsibly sourced ingredients, prioritizing cruelty-free testing, and cutting unnecessary additives. Supply chains are being audited end-to-end for ethical labor practices, traceability, and lower carbon footprints. This shift is not only about regulatory compliance but also about fostering trust, loyalty, and long-term value. Businesses that embrace sustainability are finding that it drives innovation, opens new markets, and strengthens resilience in an increasingly conscious global economy. ",
   likes: 421000,
    reflections: 45,
  },
];
*/

//type TabDef = { name: string; Icon: React.ComponentType<any> };

{
  /*const tabs: TabDef[] = [
  { name: "Posts",        Icon: Copy },
  { name: "Reels",        Icon: PlayCircle },
  { name: "Connections",  Icon: Users },
  { name: "Collections",  Icon: Copy },
  { name: "About",        Icon: AtSign },
];*/
}

export default function Profile() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || profiles[0].tabs[0].label
  );
  const [boards, _setBoards] = useState<CollectionBoard[]>([]);
  //const handleAddCollection = () => setBoards(demoBoards);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<MyPostProps | null>(null);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [openFollowers, setopenfollowers] = useState(false);

  const [userPosts, setUserPosts] = useState<MyPostProps[]>([]);
  const [followingUsers, setFollowingUsers] = useState<FollowedUser[]>([]);
  const [followerUsers, setFollowerUsers] = useState<FollowerUser[]>([]);
  const [collectionItems, setCollectionItems] = useState<any[]>([]);
  console.log("🚀 ~ Profile ~ collectionItems:", collectionItems);

  const { showToast } = useToast();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    postId: string | null;
  }>({ isOpen: false, postId: null });
  const fetchMeDetails = async () => {
    try {
      const res = await MeDetails();
      localStorage.setItem(
        "profile_picture",
        res?.data?.data?.user.profile_picture
      );
      localStorage.setItem("name", res?.data?.data?.user.name);
      localStorage.setItem("main_name", res?.data?.data?.user.main_name);
      localStorage.setItem(
        "karma_credits",
        res?.data?.data?.user?.karma_credits || 0
      );
      localStorage.setItem("username", res?.data?.data?.user?.username);
      localStorage.setItem(
        "margaret_name",
        res?.data?.data?.user.margaret_name
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchMeDetails();
  }, []);

  useEffect(() => {
    // Check if URL has the openpost parameter and a post ID
    const shouldOpenPost = searchParams.get("openpost") === "true";
    const postIdFromUrl = searchParams.get("dataset");

    if (shouldOpenPost && postIdFromUrl && userPosts.length > 0) {
      // Find the post with matching ID
      const postToOpen = userPosts.find((post) => post.id === postIdFromUrl);
      if (postToOpen) {
        setSelectedPost(postToOpen);

        // Optional: Clear the URL parameters after opening the post
        // navigate(location.pathname, { replace: true });
      }
    }
  }, [searchParams, userPosts, navigate, location.pathname]);

  const unFriendUser = async (friend_id: number | string) => {
    const formattedData = {
      friend_id: friend_id,
    };
    await UnFriend(formattedData);
    showToast({
      message: "Unfriend user successfully.",
      type: "success",
      duration: 3000,
    });
    fetchFollowingUsers();
  };

  const fetchFollowingUsers = async () => {
    try {
      const res = await GetConnectionUser();
      // Transform the API response to match FollowedUser interface
      const transformedUsers = res.data.data.rows.map((item: any) => ({
        id: item.friend_id,
        username: item.friend_user.username,
        first_name: item.friend_user.profile.first_name,
        last_name: item.friend_user.profile.last_name,
        profile_picture: item.friend_user.profile.profile_picture,
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

  const fetchCollectionItems = async () => {
    try {
      const res = await GetSavedPosts();

      // Transform the API response to match CollectionItem interface
     const transformedItems = res.data.data.rows.map((item: any) => {
        // Handle multiple images (comma-separated), single image/video, or text-only
        let media = null;
        if (item.file) {
          const ext = item.file.split("?")[0].split(".").pop()?.toLowerCase();

          if (
            item.file_type === "video" ||
            ["mp4", "mov", "avi", "mkv"].includes(ext!)
          ) {
            media = {
              type: "video",
              src: item.file,
              alt: item.content || "",
              poster: item.file, // You can adjust if you have a separate poster
            };
          } else if (
            item.file_type === "image" ||
            ["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)
          ) {
            const files = item.file
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean);
            if (files.length === 1) {
              media = {
                type: "image",
                src: files[0],
                alt: item.content || "",
              };
            } else if (files.length > 1) {
              // If your MyPost component supports multiple images, pass as array
              // Otherwise, just show the first image
              media = {
                type: "image",
                src: files[0],
                alt: item.content || "",
                images: files, // Optional: for gallery support
              };
            }
          }
        }
        // For text-only posts, media remains null

        return {
          media,
          body: item.content,
          likes: item.likes_count,
          reflections: item.comments_count,
          id: item.id,
          is_liked: item.is_liked,
          user: item.user,
          profile: item.profile,
          date: item.createdAt,
          // Add more fields if needed
        };
      });

      setCollectionItems(transformedItems);
    } catch (error) {
      console.error("Error fetching collection items:", error);
      // Optional: Show error to user
      showToast({
        message: "Failed to load collection items",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchUserPosts = async () => {
    try {
      const res = await GetUserPost();
      const transformedPosts = res.data.data.rows.map((item: any) => {
        // Handle multiple images (comma-separated), single image/video, or text-only
        let media = null;
        if (item.file) {
          const ext = item.file.split("?")[0].split(".").pop()?.toLowerCase();

          if (
            item.file_type === "video" ||
            ["mp4", "mov", "avi", "mkv"].includes(ext!)
          ) {
            media = {
              type: "video",
              src: item.file,
              alt: item.content || "",
              poster: item.file, // You can adjust if you have a separate poster
            };
          } else if (
            item.file_type === "image" ||
            ["jpg", "jpeg", "png", "gif", "webp"].includes(ext!)
          ) {
            const files = item.file
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean);
            if (files.length === 1) {
              media = {
                type: "image",
                src: files[0],
                alt: item.content || "",
              };
            } else if (files.length > 1) {
              // If your MyPost component supports multiple images, pass as array
              // Otherwise, just show the first image
              media = {
                type: "image",
                src: files[0],
                alt: item.content || "",
                images: files, // Optional: for gallery support
              };
            }
          }
        }
        // For text-only posts, media remains null

        return {
          media,
          body: item.content,
          likes: item.likes_count,
          reflections: item.comments_count,
          id: item.id,
          is_liked: item.is_liked,
          user: item.user,
          profile: item.profile,
          date: item.createdAt,
          // Add more fields if needed
        };
      });

      setUserPosts(transformedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      showToast({
        message: "Failed to load user posts",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchFollowingFollowerUsers = async () => {
    try {
      const res = await GetFollowingFollowerUsers();
      profiles[0].following = res.data.data.followingCount || "0";
      profiles[0].followers = res.data.data.followerCount || "0";
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

  const handleDeletePost = async (postId: string | number) => {
    try {
      await DeleteUserPost(String(postId)); // Call your API
      setUserPosts((prev) => prev.filter((p) => p.id !== postId)); // Remove from UI
      showToast({
        message: "Post deleted successfully.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      showToast({
        message: "Failed to delete post.",
        type: "error",
        duration: 3000,
      });
    }
  };
  const handleUnsavePost = async (postId: string | number) => {
    try {
      await SavePost(String(postId)); // Call your API
      fetchCollectionItems()
    } catch (error) {
      showToast({
        message: "Failed to delete post.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleLikePost = async (postId: string | number) => {
    try {
      const formattedData = { post_id: postId };
      await PostsLike(formattedData);
      setUserPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: !post.is_liked,
              likes: post.is_liked ? post.likes - 1 : post.likes + 1,
            };
          } else {
            return post;
          }
        })
      );
    } catch (error) {
      showToast({
        message: "Failed to like post.",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (activeTab === "Collections" && boards.length === 0) {
      // setBoards(demoBoards);
      fetchCollectionItems();
    }
    if (activeTab === "Connections") {
      fetchFollowingUsers();
    }
    if (activeTab === "Posts") {
      fetchUserPosts();
    }
    fetchFollowingFollowerUsers();
  }, [activeTab, boards.length]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fb] pt-2 px-2 sm:px-2 md:px-1 lg:px-1">
      {profiles.map((profile, index) => (
        <ProfileCard
          key={index}
          {...profile}
          // onTabChange={(tab) => setActiveTab(tab)}
          onOpenFollowing={() => {
            setOpenFollowing(true);
            fetchFollowingUsers();
          }}
          onOpenFollowers={() => {
            setopenfollowers(true);
            fetchFollowerUsers();
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      ))}

      {/* Content */}
      <div className="flex-1 py-5">
        {activeTab === "Posts" && (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {userPosts.length ? (
              userPosts.map((post, i) => (
                <MyPost
                  key={i}
                  {...post}
                  showOverlay
                  //onClick={() => setSelectedPost(post)}
                  onViewPost={() => setSelectedPost(post)}
                  onLike={() => {
                    if (post.id !== undefined) {
                      handleLikePost(post.id);
                    }
                  }}
                  onOpenReflections={() =>
                    // console.log("Open reflections for post", i)
                    setSelectedPost(post)
                  }
                  onDeletePost={() => {
                    if (post.id !== undefined) {
                      // handleDeletePost(post.id);
                      setDeleteConfirmation({
                        isOpen: true,
                        postId: String(post.id),
                      });
                    }
                  }}
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
          /*<PostPopup
            post={{
              id: String(demoPosts.indexOf(selectedPost)),
            media:
                selectedPost.media ??
                ({ type: "text", src: selectedPost.body || "" } as const),
            images: selectedPost.media && "images" in selectedPost.media ? selectedPost.media.images : undefined,
              // optional
            }}
            onClose={() => setSelectedPost(null)}
          />*/

          <PostPopup
            post={{
              id: String(selectedPost.id),
              date: selectedPost.date,
              media:
                selectedPost.media ??
                ({ type: "text", src: selectedPost.body || "" } as const),
              // optional
            }}
            onClose={() => setSelectedPost(null)}
            onDeletePost={() => {
              if (selectedPost.id !== undefined) {
                setDeleteConfirmation({
                  isOpen: true,
                  postId: String(selectedPost.id),
                });
              }
            }}
            collection
            likesCount={selectedPost.likes ?? 0}
            insightsCount={selectedPost.reflections ?? 0}
          />
        )}

        {activeTab === "Collections" &&
          (collectionItems.length === 0 ? (
            // Empty state without any button
            <div className="border border-dashed border-[#C4B5FD] rounded-xl bg-[#F8F6FF] py-12 flex items-center justify-center">
              <p className="text-sm text-gray-500">No collections yet</p>
            </div>
          ) : (
            // Collections exist: header + list
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Only You Can See What You’ve Saved
                </p>
              </div>

              {/* <MyCollection
                mode="boards"
                boards={boards}
                onOpen={(id) => {
                  const board = boards.find((b) => b.id === id);
                  navigate(`/dashboard/MyCollection/${id}`, {
                    state: { board },
                  });
                }}
              /> */}

              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {collectionItems.length ? (
                  collectionItems.map((post, i) => (
                    <MyPost
                      key={i}
                      {...post}
                      showOverlay
                      collection
                      //onClick={() => setSelectedPost(post)}
                      onViewPost={() => setSelectedPost(post)}
                      onLike={() => {
                        if (post.id !== undefined) {
                          handleLikePost(post.id);
                        }
                      }}
                      onOpenReflections={() =>
                        // console.log("Open reflections for post", i)
                        setSelectedPost(post)
                      }
                      onDeletePost={() => {
                        if (post.id !== undefined) {
                          // handleDeletePost(post.id);
                          setDeleteConfirmation({
                            isOpen: true,
                            postId: String(post.id),
                          });
                        }
                      }}
                      onDeleteSavePost={()=>{
                        if (post.id !== undefined) {
                          handleUnsavePost(post.id);
                        }
                      }}
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
            </div>
          ))}

        {activeTab === "Reels" && (
          <div className="text-gray-400 text-center py-16">No Reels yet.</div>
        )}

        {activeTab === "Connections" &&
          (followingUsers.length > 0 ? (
            <Connections
              connections={followingUsers.map((f) => ({
                id: f.id,
                name: `${f.first_name} ${f.last_name}`.trim(),
                username: `${f.first_name} ${f.last_name}`.trim(),
                profileImage:
                  !f.profile_picture ||
                  f.profile_picture === "null" ||
                  f.profile_picture === "undefined" ||
                  !f.profile_picture.startsWith("http")
                    ? "/profile.png"
                    : f.profile_picture,
              }))}
              onMessage={(id) => console.log("Connect with", id)}
              // onUnfriend={(id) => console.log("Remove connection", id)}
              onUnfriend={(id) => unFriendUser(id)}
            />
          ) : (
            <div className="text-gray-400 text-center py-16">
              No Connections yet.
            </div>
          ))}
        {activeTab === "About" && (
          <div className="text-gray-400 text-center py-16">
            About goes here.
          </div>
        )}
      </div>
      <FollowingModal
        open={openFollowing}
        onClose={() => setOpenFollowing(false)}
        friends={followingUsers.map((user) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          handle: `${user.first_name} ${user.last_name}`.trim(),
          avatar:
            !user.profile_picture ||
            user.profile_picture === "null" ||
            user.profile_picture === "undefined" ||
            !user.profile_picture.startsWith("http")
              ? "/profile.png"
              : user.profile_picture,
        }))}
      />

      <FollowersModal
        open={openFollowers}
        onClose={() => setopenfollowers(false)}
        followers={followerUsers.map((user) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          handle: user.username,
          avatar:
            !user.profile_picture ||
            user.profile_picture === "null" ||
            user.profile_picture === "undefined" ||
            !user.profile_picture.startsWith("http")
              ? "/profile.png"
              : user.profile_picture,
          isFollowing: user.is_following,
        }))}
      />

      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, postId: null })}
      >
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, postId: null })
              }
              variant="white-outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (deleteConfirmation.postId) {
                  await handleDeletePost(deleteConfirmation.postId);
                  // await fetchMineBestPractices(); // Refresh the list
                  setDeleteConfirmation({ isOpen: false, postId: null });
                  setSelectedPost(null);
                }
              }}
              className="w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
