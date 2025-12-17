import { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams,
} from "react-router-dom";
import FollowingModal from "../components/Profile/Following";
import FollowersModal from "../components/Profile/Followers";
import {
  Copy, // Posts & Collections
  PlayCircle, // Reels
  CirclePlay, // empty state icon
} from "lucide-react";
import MyPost from "../components/Profile/Mypost";
import type { CollectionBoard } from "../components/Profile/MymultiviewCollection"; // type-only import ✅
import PostPopup from "../components/Profile/Popup";
import {
  GetFollowerUser,
  GetFollowingFollowerUsers,
  DeleteUserPost,
  PostsLike,
  GetUserReel,
  GetFollowingUser,
  DeleteUserReel,
  GetUserSocialProfileDetails,
  GetOtherUserReel,
  GetOtherUserPost, // Add this import
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import UserProfileCard from "../components/Social/UserProfileCard";

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

type MyPostProps = React.ComponentProps<typeof MyPost>;

export interface Media {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

// Define page size constant
const PAGE_SIZE = 12;

export default function SocialUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [profiles, setProfiles] = useState<any[]>([
    {
      profileImage: "/profile.png", // Default fallback
      name: "User",
      username: "user",
      following: "0",
      followers: "0",
      tabs: [
        { label: "Conscious Acts", icon: <Copy size={16} /> },
        { label: "Inspiration Reels", icon: <PlayCircle size={16} /> },
      ],
    },
  ]);
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "Conscious Acts"
  );
  const [boards, _setBoards] = useState<CollectionBoard[]>([]);
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<MyPostProps | null>(null);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [openFollowers, setopenfollowers] = useState(false);

  const [userPosts, setUserPosts] = useState<MyPostProps[]>([]);
  const [followingUsers, setFollowingUsers] = useState<FollowedUser[]>([]);
  const [followerUsers, setFollowerUsers] = useState<FollowerUser[]>([]);
  const [userReels, setUserReels] = useState<any[]>([]);

  // Add pagination states
  const [postsPage, setPostsPage] = useState(1);
  const [reelsPage, setReelsPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasMoreReels, setHasMoreReels] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingReels, setIsLoadingReels] = useState(false);

  const { showToast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string | null;
    isReel: boolean;
  }>({ isOpen: false, id: null, isReel: false });

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      let userData;

      if (userId) {
        // If viewing another user's profile
        const res = await GetUserSocialProfileDetails(userId);
        userData = res?.data?.data;
      }

      if (userData) {
        // Format profile picture URL
        const getProfilePictureUrl = (url: string | null) => {
          if (!url || url === "null" || url === "undefined") {
            return "/profile.png";
          }
          if (url.startsWith("http")) {
            return url;
          }
          // If it's a relative path, you might want to prepend your API base URL
          // Or handle it according to your backend setup
          return url;
        };

        // Combine first_name and last_name for full name
        const fullName =
          `${userData.first_name || ""} ${userData.last_name || ""}`.trim() ||
          userData.name ||
          userData.user?.username ||
          "User";

        // Update profiles state with data from API response
        setProfiles([
          {
            profileImage: getProfilePictureUrl(userData.profile_picture),
            name: fullName,
            username: userData.user?.username || "user",
            following: userData.following_count?.toString() || "0",
            followers: userData.followers_count?.toString() || "0",
            interests: userData.interests || [],
            professions: userData.professions || [],
            postCount: userData.post_count || [],
            badge: userData.badge || [],
            about: userData.about_us || [],
            tabs: [
              { label: "Conscious Acts", icon: <Copy size={16} /> },
              { label: "Inspiration Reels", icon: <CirclePlay size={16} /> },
            ],
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showToast({
        message: "Failed to load profile information",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      const res = await GetFollowingUser(userId);
      const transformedUsers = res.data.data.rows.map((item: any) => ({
        id: item.following_id,
        username: item.following_user.username,
        first_name: item.following_user.profile.first_name || "",
        last_name: item.following_user.profile.last_name || "",
        profile_picture: item.following_user.profile.profile_picture,
        is_following: true,
      }));

      setFollowingUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching followed users:", error);
      showToast({
        message: "Failed to load followed users",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchFollowerUsers = async () => {
    try {
      const res = await GetFollowerUser(userId);
      const transformedUsers = res.data.data.rows.map((item: any) => ({
        id: item.follower_id,
        username: item.follower_user.username,
        first_name: item.follower_user.profile.first_name || "",
        last_name: item.follower_user.profile.last_name || "",
        profile_picture: item.follower_user.profile.profile_picture,
        is_following: true,
      }));

      setFollowerUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching follower users:", error);
      showToast({
        message: "Failed to load follower users",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchUsersReel = async (page = 1, append = false) => {
    try {
      setIsLoadingReels(true);
      const res = userId ? await GetOtherUserReel(userId, page) : await GetUserReel(page);
      const transformReelsToPostProps = res.data.data.rows.map((reel: any) => ({
        id: reel.id,
        media: {
          type: "video" as const,
          src: reel.file || reel.video_file,
          alt: reel.description,
          poster: reel.thumbnail,
        },
        body: reel.description,
        likes: reel.likes_count,
        reflections: reel.comments_count,
        is_liked: reel.is_liked,
        user: reel.storyuser,
        profile: reel.storyuser.profile,
        date: reel.createdAt,
        duration: reel.duration,
        is_reel: true,
      }));

      // Check if we have more reels
      const hasMore = res.data.data.rows.length >= PAGE_SIZE;
      setHasMoreReels(hasMore);
      
      // Append or replace reels
      if (append) {
        setUserReels(prev => [...prev, ...transformReelsToPostProps]);
        setReelsPage(page + 1);
      } else {
        setUserReels(transformReelsToPostProps);
        setReelsPage(2); // Set next page to 2 after initial load
      }
      
    } catch (error) {
      console.error("Error fetching user reels:", error);
      showToast({
        message: "Failed to load user reels",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingReels(false);
    }
  };

  const fetchUserPosts = async (page = 1, append = false) => {
    try {
      setIsLoadingPosts(true);
      const res = await GetOtherUserPost(userId, page);
      const transformedPosts = res.data.data.rows.map((item: any) => {
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
              poster: item.file,
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
              media = {
                type: "image",
                src: files[0],
                alt: item.content || "",
                images: files,
              };
            }
          }
        }

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
          product_id: item.product_id,
        };
      });

      // Check if we have more posts
      const hasMore = res.data.data.rows.length >= PAGE_SIZE;
      setHasMorePosts(hasMore);
      
      // Append or replace posts
      if (append) {
        setUserPosts(prev => [...prev, ...transformedPosts]);
        setPostsPage(page + 1);
      } else {
        setUserPosts(transformedPosts);
        setPostsPage(2); // Set next page to 2 after initial load
      }
      
    } catch (error) {
      console.error("Error fetching user posts:", error);
      showToast({
        message: "Failed to load user posts",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchFollowingFollowerUsers = async () => {
    try {
      const res = await GetFollowingFollowerUsers();
      // Update the profile data with counts
      setProfiles((prev) =>
        prev.map((profile) => ({
          ...profile,
          following: res.data.data.followingCount?.toString() || "0",
          followers: res.data.data.followerCount?.toString() || "0",
        }))
      );
    } catch (error) {
      console.error("Error fetching follower users:", error);
      showToast({
        message: "Failed to load follower users",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleDeletePost = async (postId: string | number, isReel = false) => {
    try {
      if (isReel) {
        await DeleteUserReel(String(postId));
        if (activeTab === "Inspiration Reels") {
          setUserReels((prev) => prev.filter((r) => r.id !== postId));
        }
        showToast({
          message: "Reel deleted successfully.",
          type: "success",
          duration: 3000,
        });
      } else {
        await DeleteUserPost(String(postId));
        if (activeTab === "Conscious Acts") {
          setUserPosts((prev) => prev.filter((p) => p.id !== postId));
        }
        showToast({
          message: "Post deleted successfully.",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      showToast({
        message: `Failed to delete ${isReel ? "reel" : "post"}.`,
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
    // Fetch profile data on component mount
    fetchProfileData();

    // Check if URL has the openpost parameter and a post ID
    const shouldOpenPost = searchParams.get("openpost") === "true";
    const postIdFromUrl = searchParams.get("dataset");

    if (shouldOpenPost && postIdFromUrl && userPosts.length > 0) {
      const postToOpen = userPosts.find((post) => post.id === postIdFromUrl);
      if (postToOpen) {
        setSelectedPost(postToOpen);
      }
    }
  }, [searchParams, userPosts, navigate, location.pathname, userId]);

  // Reset pagination when tab changes
  useEffect(() => {
    setPostsPage(1);
    setReelsPage(1);
    setHasMorePosts(true);
    setHasMoreReels(true);
  }, [activeTab, userId]);

  // Fetch data when activeTab or userId changes
  useEffect(() => {
    if (activeTab === "Inspiration Reels") {
      fetchUsersReel();
    }
    if (activeTab === "Conscious Acts") {
      fetchUserPosts();
    }
    fetchFollowingFollowerUsers();
  }, [activeTab, boards.length, userId]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fb] py-2 px-2 sm:px-2 md:px-2 lg:px-2">
      {profiles.map((profile, index) => (
        <UserProfileCard
          key={index}
          {...profile}
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
      <div className="flex-1 py-4 sm:py-4">
        {activeTab === "Conscious Acts" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {userPosts.length ? (
                userPosts.map((post, i) => (
                  <MyPost
                    key={i}
                    {...post}
                    showOverlay
                    userPost
                    onViewPost={() => setSelectedPost(post)}
                    onLike={() => {
                      if (post.id !== undefined) {
                        handleLikePost(post.id);
                      }
                    }}
                    onOpenReflections={() => setSelectedPost(post)}
                    onDeletePost={() => {
                      if (post.id !== undefined) {
                        setDeleteConfirmation({
                          isOpen: true,
                          id: String(post.id),
                          isReel: false,
                        });
                      }
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full border border-dashed border-purple-300 rounded-lg flex items-center justify-center py-10 sm:py-16 text-center bg-[#F5F2FF]">
                  <div className="flex items-center gap-2 text-[#575FFF]">
                    <CirclePlay className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm">No Post yet</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Load More Button for Posts */}
            {(hasMorePosts || isLoadingPosts) && userPosts.length > 0 && (
              <div className="flex justify-center pt-6 mt-4">
                <button
                  onClick={() => fetchUserPosts(postsPage, true)}
                  disabled={!hasMorePosts || isLoadingPosts}
                  className="font-['Open_Sans'] px-6 py-3 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingPosts
                    ? "Loading..."
                    : hasMorePosts
                      ? "Load more posts"
                      : "No more posts"}
                </button>
              </div>
            )}
          </>
        )}

        {selectedPost && (
          <PostPopup
            post={{
              id: String(selectedPost.id),
              date: selectedPost.date,
              media:
                selectedPost.media ??
                ({ type: "text", src: selectedPost.body || "" } as const),
              body: selectedPost.body,
              is_reel:
                selectedPost.is_reel || activeTab === "Inspiration Reels",
            }}
            onClose={() => setSelectedPost(null)}
            onDeletePost={() => {
              if (selectedPost?.id !== undefined) {
                const isReel =
                  selectedPost?.is_reel || activeTab === "Inspiration Reels";
                setDeleteConfirmation({
                  isOpen: true,
                  id: String(selectedPost.id),
                  isReel,
                });
              }
            }}
            onPostUpdated={() => {
              if (activeTab === "Conscious Acts") {
                fetchUserPosts();
              } else if (activeTab === "Inspiration Reels") {
                fetchUsersReel();
              }
              setSelectedPost(null);
            }}
            userPost
            likesCount={selectedPost.likes ?? 0}
            insightsCount={selectedPost.reflections ?? 0}
          />
        )}

        {activeTab === "Inspiration Reels" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {userReels.length ? (
                userReels.map((reel, i) => (
                  <MyPost
                    key={i}
                    {...reel}
                    showOverlay
                    userPost
                    onViewPost={() => setSelectedPost(reel)}
                    onLike={() => {
                      if (reel.id !== undefined) {
                        handleLikePost(reel.id);
                      }
                    }}
                    onOpenReflections={() => setSelectedPost(reel)}
                    onDeletePost={() => {
                      if (reel.id !== undefined) {
                        setDeleteConfirmation({
                          isOpen: true,
                          id: String(reel.id),
                          isReel: true,
                        });
                      }
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full border border-dashed border-purple-300 rounded-lg flex items-center justify-center py-10 sm:py-16 text-center bg-[#F5F2FF]">
                  <div className="flex items-center gap-2 text-[#575FFF]">
                    <CirclePlay className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm">No Reels yet</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Load More Button for Reels */}
            {(hasMoreReels || isLoadingReels) && userReels.length > 0 && (
              <div className="flex justify-center pt-6 mt-4">
                <button
                  onClick={() => fetchUsersReel(reelsPage, true)}
                  disabled={!hasMoreReels || isLoadingReels}
                  className="font-['Open_Sans'] px-6 py-3 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingReels
                    ? "Loading..."
                    : hasMoreReels
                      ? "Load more reels"
                      : "No more reels"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <FollowingModal
        open={openFollowing}
        onClose={() => setOpenFollowing(false)}
        userProfile
        friends={followingUsers.map((user) => ({
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
        }))}
      />

      <FollowersModal
        open={openFollowers}
        onClose={() => setopenfollowers(false)}
        userProfile
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
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, id: null, isReel: false })
        }
      >
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this{" "}
            {deleteConfirmation.isReel ? "reel" : "post"}? This action cannot be
            undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: false,
                  id: null,
                  isReel: false,
                })
              }
              variant="white-outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (deleteConfirmation.id) {
                  await handleDeletePost(
                    deleteConfirmation.id,
                    deleteConfirmation.isReel
                  );
                  setDeleteConfirmation({
                    isOpen: false,
                    id: null,
                    isReel: false,
                  });
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