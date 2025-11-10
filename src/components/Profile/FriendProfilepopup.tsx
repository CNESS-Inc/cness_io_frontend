import { X } from "lucide-react";
import MyPost from "../Profile/Mypost";
import companycard from "../../assets/companycard1.png";
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  GetProfileByUserId,
  GetUserPostsByUserId,
  GetFollowingFollowersByUserId,
  SendFollowRequest,
  GetFollowStatus,
  UnFriend,
  SendFriendRequest,
} from "../../Common/ServerAPI";
import PostPopup from "./Popup";
import { useToast } from "../ui/Toast/ToastProvider";
import { iconMap } from "../../assets/icons";


type Props = {
  friend: {
    id: number;
    name: string;
    username: string;
    image: string;
  };
  onClose: () => void;
};

export default function FriendProfileModal({ friend, onClose }: Props) {
  const [profileData, setProfileData] = useState<any>(null);
  const [followingFollowers, setFollowingFollowers] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [_isFollowing, setIsFollowing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (friend.id) {
      fetchFriendData();
      checkFollowStatus();
    }
  }, [friend.id]);

  const checkFollowStatus = async () => {
    try {
      const response = await GetFollowStatus(friend.id.toString());

      // Get the logged-in user's ID from localStorage or wherever you store it
      const loggedInUserId = localStorage.getItem("Id");

      // Check if the logged-in user is in the followers list
      const followers = response.data?.data?.rows || [];
      const isUserFollowing = followers.some(
        (follower: any) => follower.follower_id === loggedInUserId
      );
      console.log("isUserFollowing-------->", isUserFollowing);
      setIsFollowing(isUserFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
      setIsFollowing(false); // Default to false on error
    }
  };

  const fetchFriendData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [profileResponse, followingResponse, postsResponse] =
        await Promise.all([
          GetProfileByUserId(friend.id.toString()),
          GetFollowingFollowersByUserId(friend.id.toString()),
          GetUserPostsByUserId(friend.id.toString()),
        ]);

      setProfileData(profileResponse.data.data);
      setFollowingFollowers(followingResponse.data.data);

      const transformedPosts = postsResponse.data.data.rows.map((item: any) => {
        // Handle multiple images (comma-separated), single image/video, or text-only
        let media = null;

        if (item.file) {
          const files = item.file
            .split(",")
            .map((f: string) => f.trim())
            .filter(Boolean);

          if (files.length === 1) {
            const fileUrl = files[0];
            const fileExtension = getFileExtension(fileUrl);
            const isVideo = isVideoFile(fileExtension);
            const isImage = isImageFile(fileExtension);

            if (isVideo) {
              media = {
                type: "video",
                src: fileUrl,
                alt: item.content || "",
                poster: getVideoPoster(fileUrl), // You can generate a poster or use a placeholder
              };
            } else if (isImage) {
              media = {
                type: "image",
                src: fileUrl,
                alt: item.content || "",
              };
            }
          } else if (files.length > 1) {
            // For multiple files, assume they're images and use the first one
            // You might want to handle mixed media types differently
            const firstFile = files[0];
            const fileExtension = getFileExtension(firstFile);
            const isVideo = isVideoFile(fileExtension);

            if (!isVideo) {
              // Only create gallery for images, not videos
              media = {
                type: "image",
                src: firstFile,
                alt: item.content || "",
                images: files, // for gallery support
              };
            } else {
              // If first file is video, treat as single video post
              media = {
                type: "video",
                src: firstFile,
                alt: item.content || "",
                poster: getVideoPoster(firstFile),
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
        };
      });

      setUserPosts(transformedPosts);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const isVideoFile = (extension: string): boolean => {
    const videoExtensions = [
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      "ogg",
      "3gp",
      "m4v",
    ];
    return videoExtensions.includes(extension);
  };

  const isImageFile = (extension: string): boolean => {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
      "heic",
    ];
    return imageExtensions.includes(extension);
  };

  const getVideoPoster = (_videoUrl: string): string => {
    // You can either:
    // 1. Use a placeholder image
    // 2. Generate a poster URL if your backend provides one
    // 3. Extract frame from video (requires additional processing)
    return "/images/video-poster-placeholder.jpg"; // placeholder
  };

  // const handleFollowToggle = async () => {
  //   setFollowLoading(true);
  //   try {
  //     const formattedData = { following_id: friend.id };
  //     await SendFollowRequest(formattedData);

  //     // Toggle the following state correctly
  //     const newFollowStatus = !isFollowing;
  //     setIsFollowing(newFollowStatus);

  //     // Update the followers count correctly
  //     setFollowingFollowers((prev: typeof followingFollowers) => ({
  //       ...prev,
  //       followerCount: newFollowStatus
  //         ? (prev?.followerCount || 0) + 1 // If now following, increase count
  //         : Math.max(0, (prev?.followerCount || 0) - 1), // If now unfollowing, decrease count
  //     }));

  //     console.log(
  //       newFollowStatus ? "Followed successfully" : "Unfollowed successfully"
  //     );
  //   } catch (error) {
  //     console.error("Error toggling follow status:", error);
  //     // Don't revert the state on error - let the user see the error and try again
  //   } finally {
  //     setFollowLoading(false);
  //   }
  // };

  const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [friendRequests, setFriendRequests] = useState<{
      [key: string]: string;
    }>({});
    const [connectingUsers, setConnectingUsers] = useState<{
      [key: string]: boolean;
    }>({});


      const getFriendStatus = (userId: string) => {
    return friendRequests[userId] || "connect";
  };


    const handleConnect = async (userId: string) => {
      try {
        setConnectingUsers((prev) => ({ ...prev, [userId]: true }));
  
        const currentStatus = friendRequests[userId];
  
        // If already connected or requested, remove the connection/request
        if (currentStatus === "connected" || currentStatus === "requested") {
          const formattedData = {
            friend_id: userId,
          };
  
          const response = await UnFriend(formattedData);
  
          if (response.success) {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "connect", // Change back to "connect" after removing
            }));
            showToast({
              message: "Friend request removed successfully",
              type: "success",
              duration: 3000,
            });
          }
        } else {
          // If not connected, send friend request
          const formattedData = {
            friend_id: userId,
          };
  
          const response = await SendFriendRequest(formattedData);
  
          if (response.success) {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "requested",
            }));
            showToast({
              message:
                response.success.message || "Friend request sent successfully",
              type: "success",
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error handling connect:", error);
        showToast({
          message: "Something went wrong. Please try again.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setConnectingUsers((prev) => ({ ...prev, [userId]: false }));
      }
    };

    const handleFollow = async (userId: string) => {
        try {
          const formattedData = {
            following_id: userId,
          };
          await SendFollowRequest(formattedData);
          setUserPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.user_id === userId
                ? { ...post, if_following: !post.if_following }
                : post
            )
          );
        } catch (error) {
          console.error("Error fetching selection details:", error);
        }
      };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        {/* Modal */}
        <div
          className="bg-white rounded-[18px] flex flex-col shadow-lg overflow-hidden"
          style={{
            width: "1176px",
            height: "725.25px",
            gap: "10px",
            padding: "12px",
          }}
        >
          <div
            className="bg-white rounded-xl border border-gray-200 flex flex-col shadow-lg overflow-hidden"
            style={{
              width: "1152px",
              height: "701.25px",
              paddingBottom: "24px",
              gap: "24px",
            }}
          >
            {/* Header */}
            <div className="shrink-0">
              <div className="relative">
                <img
                  src={companycard}
                  alt="Cover"
                  className="w-6xl h-[150px] object-cover rounded-t-2xl"
                />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div
                className="flex items-center justify-between"
                style={{
                  width: "1104px",
                  height: "77.25px",
                }}
              >
                {/* Left: Profile image + info */}
                <div className="flex items-center gap-4 mt-8 px-6">
                  <img
                    src={
                      !profileData?.profile_picture ||
                      profileData?.profile_picture === "null" ||
                      profileData?.profile_picture === "undefined" ||
                      (profileData?.profile_picture &&
                        !profileData?.profile_picture.startsWith("http")) ||
                      profileData?.profile_picture ===
                        "http://localhost:5026/file/"
                        ? !friend.image ||
                          friend.image === "null" ||
                          friend.image === "undefined" ||
                          !friend.image.startsWith("http") ||
                          friend.image === "http://localhost:5026/file/"
                          ? "/profile.png" // Default fallback image if both sources fail
                          : friend.image
                        : profileData?.profile_picture
                    }
                    alt={profileData?.first_name || friend.name}
                    style={{
                      width: "77.25px",
                      height: "77.25px",
                      borderWidth: "1.42px",
                    }}
                    className="rounded-full border-white object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/profile.png";
                    }}
                  />

                  <div>
                    <h2 className="font-medium text-gray-900">
                      {profileData
                        ? `${profileData.first_name} ${profileData.last_name}`
                        : friend.name}
                    </h2>
                    <p className="text-gray-500 text-sm">@{friend.username}</p>
                    <div className="flex gap-4 text-sm mt-1">
                      <span className="text-indigo-500">
                        {followingFollowers?.followingCount || 0} Following
                      </span>
                      <span className="text-pink-500">
                        {followingFollowers?.followerCount || 0} Followers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex gap-2 mt-8">
                  <button
                    onClick={() => handleConnect(profileData?.user_id)}
                    disabled={connectingUsers[profileData?.user_id] || false}
                    className={`hidden lg:flex justify-center items-center gap-1 text-xs lg:text-sm px-3 py-1.5 rounded-full transition-colors font-family-open-sans h-[35px]
                                                ${
                                                  getFriendStatus(
                                                    profileData?.user_id
                                                  ) === "connected"
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : getFriendStatus(
                                                        profileData?.user_id
                                                      ) === "requested"
                                                    ? "bg-gray-400 text-white" // Remove cursor-not-allowed to make it clickable
                                                    : "bg-white text-black shadow-md"
                                                }`}
                  >
                    <span className="flex items-center gap-1 text-[#0B3449]">
                      <img
                        src={iconMap["userplus"]}
                        alt="userplus"
                        className="w-4 h-4"
                      />
                      {connectingUsers[profileData?.user_id]
                        ? "Loading..."
                        : getFriendStatus(profileData?.user_id) === "connected"
                        ? "Connected"
                        : getFriendStatus(profileData?.user_id) === "requested"
                        ? "Requested" // This will now change back to "Connect" when clicked again
                        : "Connect"}
                    </span>
                  </button>
                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollow(profileData?.user_id)}
                    className={`flex w-[100px] justify-center items-center gap-1 text-xs lg:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors
                                                  ${
                                                    profileData?.if_following
                                                      ? "bg-transparent text-[#7077FE] hover:text-[#7077FE]/80"
                                                      : "bg-[#7077FE] text-white hover:bg-indigo-600 h-[35px]"
                                                  }`}
                  >
                    {profileData?.if_following ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-[#7077FE]" />{" "}
                        Resonating
                      </>
                    ) : (
                      "+ Resonate"
                    )}
                  </button>
                  {/* <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    data-testid={isFollowing}
                    className={`px-8 py-2 rounded-full border text-sm shadow hover:transition-all ${
                      isFollowing
                        ? "border-gray-300 text-[#7077FE] hover:bg-gray-50"
                        : "border-[#7077FE] bg-[#7077FE] text-white hover:bg-[#5a61d4]"
                    } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <TrendingUp className="w-4 h-4 inline-block mr-2" />
                    {followLoading
                      ? "Loading..."
                      : isFollowing
                      ? "Following"
                      : "Follow"}
                  </button> */}
                  {/* <button className="px-8 py-2 rounded-full bg-indigo-500 text-white text-sm">
                  Message
                </button> */}
                </div>
              </div>
            </div>
            <div className="border border-gray-100 mx-5 mt-3"></div>

            {/* Scrollable Posts */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="mb-4 text-[14px] font-medium text-gray-800">
                Posts
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
              ) : userPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userPosts.map((post, index) => (
                    <MyPost
                      key={post.id || index}
                      showOverlay
                      friend
                      media={post.media}
                      body={post.content}
                      likes={post.likes || 0}
                      reflections={post.reflections || 0}
                      date={post.date || new Date().toISOString()}
                      onViewPost={() => setSelectedPost(post)}
                      onLike={() => {
                        if (post.id !== undefined) {
                          // handleLikePost(post.id);
                        }
                      }}
                      onOpenReflections={() =>
                        // console.log("Open reflections for post", i)
                        setSelectedPost(post)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No posts available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
              // setDeleteConfirmation({
              //   isOpen: true,
              //   postId: String(selectedPost.id),
              // });
            }
          }}
          collection
          likesCount={selectedPost.likes ?? 0}
          insightsCount={selectedPost.reflections ?? 0}
        />
      )}
    </>
  );
}
