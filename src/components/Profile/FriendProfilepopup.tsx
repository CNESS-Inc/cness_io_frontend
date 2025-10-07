import { X } from "lucide-react";
import MyPost from "../Profile/Mypost";
import companycard from "../../assets/companycard1.png"
// import whychess from "../../assets/whycness.jpg";
// import webinar from "../../assets/webinarimg.jpg";
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { GetProfileByUserId, GetUserPostsByUserId, GetFollowingFollowersByUserId, SendFollowRequest, GetFollowStatus } from "../../Common/ServerAPI";

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
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Add useEffect to fetch data when modal opens
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
      const loggedInUserId = localStorage.getItem('Id');

      // Check if the logged-in user is in the followers list
      const followers = response.data?.data?.rows || [];
      const isUserFollowing = followers.some((follower: any) =>
        follower.follower_id === loggedInUserId
      );
      console.log('isUserFollowing-------->', isUserFollowing);
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
      const [profileResponse, followingResponse, postsResponse] = await Promise.all([
        GetProfileByUserId(friend.id.toString()),
        GetFollowingFollowersByUserId(friend.id.toString()),
        GetUserPostsByUserId(friend.id.toString())
      ]);

      setProfileData(profileResponse.data.data.rows);
      setFollowingFollowers(followingResponse.data.data);

      // setIsFollowing(followingResponse.data.data?.isFollowing || false);

      const transformedPosts = postsResponse.data.data.rows.map((item: any) => {
        // Handle multiple images (comma-separated), single image/video, or text-only
        let media = null;
        if (item.file && item.file_type === "video") {
          media = {
            type: "video",
            src: item.file,
            alt: item.content || "",
            poster: item.file, // You can adjust if you have a separate poster
          };
        } else if (item.file && item.file_type === "image") {
          const files = item.file.split(",").map((f: string) => f.trim()).filter(Boolean);
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
        // For text-only posts, media remains null

        return {
          media,
          body: item.content,
          likes: item.likes_count,
          reflections: item.comments_count,
          id: item.id,
          is_liked: item.is_liked,
          // Add more fields if needed
        };
      });

      setUserPosts(transformedPosts);
      // setUserPosts(postsResponse.data?.data?.rows || []);
    } catch (error) {
      console.error("Error fetching friend data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    setFollowLoading(true);
    try {
      const formattedData = { following_id: friend.id };
      await SendFollowRequest(formattedData);

      // Toggle the following state correctly
      const newFollowStatus = !isFollowing;
      setIsFollowing(newFollowStatus);

      // Update the followers count correctly
      setFollowingFollowers((prev: typeof followingFollowers) => ({
        ...prev,
        followerCount: newFollowStatus
          ? (prev?.followerCount || 0) + 1  // If now following, increase count
          : Math.max(0, (prev?.followerCount || 0) - 1)  // If now unfollowing, decrease count
      }));

      console.log(newFollowStatus ? "Followed successfully" : "Unfollowed successfully");
    } catch (error) {
      console.error("Error toggling follow status:", error);
      // Don't revert the state on error - let the user see the error and try again
    } finally {
      setFollowLoading(false);
    }
  };

  return (
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
          className="bg-white rounded-[12px] border border-gray-200 flex flex-col shadow-lg overflow-hidden"
          style={{
            width: "1152px",
            height: "701.25px",
            paddingBottom: "24px",
            gap: "24px",
          }}
        >
          {/* Header */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={companycard}
                alt="Cover"
                className="w-[1152px] h-[150px] object-cover rounded-t-[16px]"
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
                      (profileData?.profile_picture && !profileData?.profile_picture.startsWith("http")) ||
                      profileData?.profile_picture === "http://localhost:5026/file/"
                      ? (!friend.image ||
                        friend.image === "null" ||
                        friend.image === "undefined" ||
                        !friend.image.startsWith("http") ||
                        friend.image === "http://localhost:5026/file/"
                        ? "/profile.png"  // Default fallback image if both sources fail
                        : friend.image)
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
                    {profileData ? `${profileData.first_name} ${profileData.last_name}` : friend.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    @{profileData?.first_name || friend.username}
                  </p>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="text-indigo-500">{followingFollowers?.followingCount || 0} Following</span>
                    <span className="text-pink-500">{followingFollowers?.followerCount || 0} Followers</span>
                  </div>

                </div>
              </div>

              {/* Right: Buttons */}
              <div className="flex gap-2 mt-8">
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  data-testid={isFollowing}
                  className={`px-8 py-2 rounded-full border text-sm shadow hover:transition-all ${isFollowing
                      ? 'border-gray-300 text-[#7077FE] hover:bg-gray-50'
                      : 'border-[#7077FE] bg-[#7077FE] text-white hover:bg-[#5a61d4]'
                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <TrendingUp className="w-4 h-4 inline-block mr-2" />
                  {followLoading
                    ? 'Loading...'
                    : (isFollowing ? 'Following' : 'Follow')
                  }
                </button>
                {/* <button className="px-8 py-2 rounded-full bg-indigo-500 text-white text-sm">
      Message
    </button> */}
              </div>
            </div>
          </div>
          <div className="border border-gray-100 mx-5 mt-3"></div>


          {/* Scrollable Posts */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-4 text-[14px] font-medium text-gray-800">Posts</h3>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userPosts.map((post, index) => (
                  <MyPost
                    key={post.id || index}
                    media={post.media}
                    body={post.content}
                    likes={post.likes || 0}
                    reflections={post.reflections || 0}
                    date={post.date || new Date().toISOString()}
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
  );
}
