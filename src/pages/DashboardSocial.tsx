import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import StoryCard from "../components/Social/StoryCard";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ThumbsUp,
  TrendingUp,
  MoreVertical,
  Bookmark,
  Flag,
  Link as LinkIcon,
} from "lucide-react";
import Modal from "../components/ui/Modal";
import TopicModal from "../components/Social/Topicmodel";

// import { MdContentCopy } from "react-icons/md";

import {
  AddPost,
  AddStory,
  GetFollowingUser,
  GetStory,
  GetUserPost,
  MeDetails,
  PostsDetails,
  PostsLike,
  SendFollowRequest,
  UnFriend,
  SendFriendRequest,
  GetFriendStatus,
  SavePost,
  ReportPost,
  getTopics,
  UserSelectedTopic,
  getUserSelectedTopic,
} from "../Common/ServerAPI";

// images
// import Announcement from "../assets/Announcement.png";
import Collection from "../assets/Collection.png";
// import Leaderboard from "../assets/Leaderboard.png";
// import Mention from "../assets/Mention.png";
import people from "../assets/people.png";
import Trending from "../assets/Trending.png";
import createstory from "../assets/createstory.jpg";
import carosuel1 from "../assets/carosuel1.png";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import comment1 from "../assets/comment1.png";
import Image from "../components/ui/Image";
import CommentBox from "./CommentBox";
import { useToast } from "../components/ui/Toast/ToastProvider";
import FollowedUsersList from "./FollowedUsersList";
import CollectionList from "./CollectionList";
import Button from "../components/ui/Button";
import SharePopup from "../components/Social/SharePopup";
import { buildShareUrl, copyPostLink } from "../lib/utils";

interface Post {
  id: string;
  user_id: string;
  content: string;
  file: string | null;
  file_type: string | null;
  is_poll: boolean;
  poll_id: string | null;
  createdAt: string;
  likes_count: number;
  comments_count: number;
  if_following: boolean;
  if_friend: boolean;
  is_liked: boolean;
  is_saved: boolean;
  is_requested: boolean;
  user: {
    id: string;
    username: string;
  };
  profile: {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
}

interface FollowedUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_following: boolean;
}

// Best to put this in a separate types file or at the top of your component file
interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  originalData: {
    id: string;
    content: string;
    file: string;
    file_type: string | null;
    createdAt: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    profile: {
      first_name: string;
      last_name: string;
      profile_picture: string;
    };
    user: {
      username: string;
      id: string;
    };
  };
}

// const curatedCards = [
//   {
//     id: 1,
//     title: "Chasing Dreams",
//     subtitle: "By The Dreamers",
//     duration: "4.05 Min",
//     image: chasing,
//   },
//   {
//     id: 2,
//     title: "Into the Wild",
//     subtitle: "By Nature’s Voice",
//     duration: "5.20 Min",
//     image: Bcard1,
//   },
//   {
//     id: 3,
//     title: "Rise Up and Shine",
//     subtitle: "By Selena",
//     duration: "3.10 Min",
//     image: Bcard2,
//   },

//   {
//     id: 3,
//     title: "Rise Up and Shine",
//     subtitle: "By Selena",
//     duration: "3.10 Min",
//     image: Bcard3,
//   },
// ];

// const storyList = [
//   {
//     id: "101",
//     userIcon: "/avatars/liam.jpg",
//     userName: "Liam Anderson",
//     title: "Chasing Dreams",
//     videoSrc: "/consciousness_social_media.mp4",
//   },
//   {
//     id: "102",
//     userIcon: "/avatars/noah.jpg",
//     userName: "Noah Thompson",
//     title: "Into the Clouds",
//     videoSrc: "/test1.mp4",
//   },
//   {
//     id: "103",
//     userIcon: "/avatars/oliver.jpg",
//     userName: "Oliver Bennett",
//     title: "Zen & Peace",
//     videoSrc: "/consciousness_social_media.mp4",
//   },
//   {
//     id: "104",
//     userIcon: "/avatars/lucas.jpg",
//     userName: "Lucas Mitchell",
//     title: "Walking Free",
//     videoSrc: "/test1.mp4",
//   },

//   {
//     id: "105",
//     userIcon: "/avatars/lucas.jpg",
//     userName: "Lucas Mitchell",
//     title: "Walking Free",
//     videoSrc: "/test1.mp4",
//   },
// ];

// const dummyTopics: Topic[] = [
//   { id: "mindfulness", topic_name: "Mindfulness", slug: "mindfulness" },
//   {
//     id: "sustainability",
//     topic_name: "Sustainability",
//     slug: "sustainability",
//   },
//   { id: "community", topic_name: "Community", slug: "community" },
//   { id: "leadership", topic_name: "Leadership", slug: "leadership" },
//   { id: "innovation", topic_name: "Innovation", slug: "innovation" },
//   { id: "wellbeing", topic_name: "Wellbeing", slug: "wellbeing" },
//   { id: "mindfulness", topic_name: "Mindfulness", slug: "mindfulness" },
//   {
//     id: "sustainability",
//     topic_name: "Sustainability",
//     slug: "sustainability",
//   },
//   { id: "community", topic_name: "Community", slug: "community" },
//   { id: "leadership", topic_name: "Leadership", slug: "leadership" },
//   { id: "innovation", topic_name: "Innovation", slug: "innovation" },
//   { id: "wellbeing", topic_name: "Wellbeing", slug: "wellbeing" },
// ];

interface PostCarouselProps {
  mediaItems: Array<{
    type: "image" | "video";
    url: string;
  }>;
}

interface Story {
  id: string;
  role: string | null;
  username: string;
  profile: {
    user_id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  stories: {
    id: string;
    user_id: string;
    description: string;
    file: string;
    createdAt: string;
    updatedAt: string;
    video_file: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
  }[];
}

type Topic = {
  id: string;
  topic_name: string;
  slug: string;
};

function PostCarousel({ mediaItems }: PostCarouselProps) {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto slide every 3 seconds (only for images)
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Only auto-advance if current item is not a video
      if (mediaItems[current].type !== "video") {
        setCurrent((prev) => (prev + 1) % mediaItems.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [mediaItems.length, current]);

  // Pause videos when they're not visible
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === current && mediaItems[index].type === "video") {
          video.play().catch((e) => console.error("Video play failed:", e));
        } else {
          video.pause();
        }
      }
    });
  }, [current, mediaItems]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % mediaItems.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Media Container */}
      <div className="w-full aspect-video rounded-3xl  bg-black">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ${
              index === current ? "block" : "hidden"
            }`}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover rounded-3xl"
                controls
                muted
                loop
                playsInline
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Show arrows only if there are multiple items */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md w-8 h-8 rounded-full flex items-center justify-center z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 shadow-md w-8 h-8 rounded-full flex items-center justify-center z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Show dots only if there are multiple items */}
      {mediaItems.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {mediaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === current ? "bg-indigo-500" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

//const [isExpanded, setIsExpanded] = useState(false);
//const toggleExpand = () => setIsExpanded(!isExpanded);

export default function SocialTopBar() {
  // const navigate = useNavigate();
  // const [isExpanded, setIsExpanded] = useState(false);
  // const toggleExpand = () => setIsExpanded(!isExpanded);
  const [showPopup, setShowPopup] = useState(false);
  const [showStoryPopup, setShowStoryPopup] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [_apiMessage, setApiMessage] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [storyMessage, setStoryMessage] = useState("");
  const [selectedStoryVideo, setSelectedStoryVideo] = useState<File | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [_apiStoryMessage, setApiStoryMessage] = useState<string | null>(null);
  // const [copy, setCopy] = useState<Boolean>(false);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );
  const [postVideoPreviewUrl, setPostVideoPreviewUrl] = useState<string | null>(
    null
  );
  // const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<{
    postId: string | null;
    type: "options" | "share" | null;
  }>({ postId: null, type: null });

  const [activeView, setActiveView] = useState<
    "posts" | "following" | "collection"
  >("posts");
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  console.log("🚀 ~ SocialTopBar ~ collectionItems:", collectionItems);
  const [_isPostsLoading, setIsPostsLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  console.log("🚀 ~ SocialTopBar ~ isFollowingLoading:", isFollowingLoading);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [storiesData, setStoriesData] = useState<Story[]>([]);
  // const [addNewPost, setAddNewPost] = useState(false)

  const [userInfo, setUserInfo] = useState<any>();
  const [isAdult, setIsAdult] = useState<Boolean>(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [friendRequests, setFriendRequests] = useState<{
    [key: string]: string;
  }>({});

  const [connectingUsers, setConnectingUsers] = useState<{
    [key: string]: boolean;
  }>({});

  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState<
    string | null
  >(null);
  const [reportReason, setReportReason] = useState("");
  // const [isSavingPost, setIsSavingPost] = useState<string | null>(null);
  const [isReportingPost, setIsReportingPost] = useState<string | null>(null);
  //const [showTopicModal, setShowTopicModal] = useState(false);

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUsers((prev) => ({ ...prev, [userId]: true }));

      // Check if already connected
      if (friendRequests[userId] === "connected") {
        // If connected, delete friend
        const formattedData = {
          friend_id: userId,
        };

        const response = await UnFriend(formattedData);

        if (response.success) {
          setFriendRequests((prev) => ({
            ...prev,
            [userId]: "connect",
          }));
          showToast({
            message: "Friend removed successfully",
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
          // Immediately update the button state to "requested"
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

  // Function to get friend status
  const getFriendStatus = (userId: string) => {
    return friendRequests[userId] || "connect";
  };

  // Function to check if user is friend (you'll need to implement this based on your API)
  const checkFriendStatus = async (userId: string) => {
    try {
      const response = await GetFriendStatus(userId);
      if (response.success) {
        // The API returns data.data.rows array with all friends
        const friendsList = response.data.data.rows || [];

        // Find if this specific user is in the friends list
        const friendRecord = friendsList.find(
          (friend: any) =>
            friend.friend_id === userId || friend.user_id === userId
        );
        console.log("🚀 ~ checkFriendStatus ~ friendRecord:", friendRecord);
        if (friendRecord) {
          // Check the request_status from the database
          const status = friendRecord.request_status;

          if (status === "ACCEPT") {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "connected",
            }));
          } else if (status === "PENDING") {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "requested",
            }));
          } else if (status === "REJECT") {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "connect",
            }));
          } else {
            setFriendRequests((prev) => ({
              ...prev,
              [userId]: "connect",
            }));
          }
        } else {
          // No friend record found, set to connect
          console.log(
            "🚀 ~ checkFriendStatus ~ No friend record found, set to connect"
          );
          setFriendRequests((prev) => ({
            ...prev,
            [userId]: "connect",
          }));
        }
      }
    } catch (error) {
      console.error("Error checking friend status:", error);
      // Set default status if API fails
      setFriendRequests((prev) => ({
        ...prev,
        [userId]: "connect",
      }));
    }
  };

  // Add this function to fetch followed users
  const fetchFollowedUsers = async () => {
    setIsFollowingLoading(true);
    setActiveView("following");
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

      setFollowedUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching followed users:", error);
      // Optional: Show error to user
      showToast({
        message: "Failed to load followed users",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsFollowingLoading(false);
    }
  };

  const fetchCollectionItems = async () => {
    setIsCollectionLoading(true);
    setActiveView("collection");
    try {
      const res = await GetUserPost();

      // Transform the API response to match CollectionItem interface
      const transformedItems = res.data.data.rows.map((item: any) => {
        // Get the first image URL if available, or use profile picture as fallback
        const firstImageUrl =
          item.file &&
          item.file.split(",")[0].trim() !== "https://dev.cness.io/file/"
            ? item.file.split(",")[0].trim()
            : item.profile.profile_picture;

        return {
          id: item.id,
          title:
            item.content.length > 30
              ? `${item.content.substring(0, 30)}...`
              : item.content || "Untitled Post",
          description: `Posted by ${item.profile.first_name} ${item.profile.last_name}`,
          image_url: firstImageUrl,
          created_at: item.createdAt,
          // Add any additional fields you want to display
          originalData: item, // Keep original data if needed for navigation
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
    } finally {
      setIsCollectionLoading(false);
    }
  };

  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loggedInUserID = localStorage.getItem("Id");
  const CONTENT_LIMIT = 150;
  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getUserPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setIsPostsLoading(true);
    try {
      // Call the API to get the posts for the current page
      const res = await PostsDetails(page);
      if (res?.data) {
        const newPosts = res?.data.data.rows || [];
        const totalPages = res?.data?.data?.count / 10 || 0;

        if (newPosts.length === 0) {
          setHasMore(false); // No more posts to load
        } else {
          setUserPosts([...userPosts, ...newPosts]);

          // Check if the current page is the last page
          if (page >= totalPages) {
            setHasMore(false); // We've loaded all available pages
          } else {
            setPage(page + 1); // Load the next page
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsPostsLoading(false);
    }
  };

  const getFreshPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setIsPostsLoading(true);
    try {
      // Call the API to get the posts for the current page
      const res = await PostsDetails(1);
      if (res?.data) {
        const newPosts = res?.data.data.rows || [];
        const totalPages = res?.data?.data?.count / 10 || 0;

        if (newPosts.length === 0) {
          setHasMore(false); // No more posts to load
        } else {
          setUserPosts(newPosts);

          // Check if the current page is the last page
          if (page >= totalPages) {
            setHasMore(false); // We've loaded all available pages
          } else {
            setPage(2); // Load the next page
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
    fetchStory();
  }, []);

  useEffect(() => {
    if (userPosts.length > 0) {
      userPosts.forEach((post) => {
        if (post.user_id !== loggedInUserID) {
          checkFriendStatus(post.user_id);
        }
      });
    }
  }, [userPosts, loggedInUserID]);

  // Add another useEffect to check friend status on component mount
  useEffect(() => {
    // Check friend status for all posts when component mounts
    if (userPosts.length > 0 && loggedInUserID) {
      userPosts.forEach((post) => {
        if (post.user_id !== loggedInUserID) {
          checkFriendStatus(post.user_id);
        }
      });
    }
  }, []); // Empty dependency array to run only on mount

  // The issue is likely due to how setPage and getUserPosts interact.
  // When setPage(1) is called, if page is already 1, React will not trigger the useEffect([page]) again.
  // Also, getUserPosts uses the current value of 'page' (from closure), so calling getUserPosts() right after setPage(1) may not use the updated value.
  // Solution: When addNewPost is true, reset posts and page, then fetch posts directly.

  // useEffect(() => {
  //   if (addNewPost) {

  //   }
  //   // eslint-disable-next-line
  // }, [addNewPost]);

  // Remove the second useEffect, as it can cause duplicate fetches or race conditions.

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]); // Append new images to existing ones
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setPostVideoPreviewUrl(videoUrl);
    }
  };

  // const handleRemoveMedia = () => {
  //   setSelectedImages([]);
  //   setSelectedVideo(null);
  //   if (postVideoPreviewUrl) {
  //     URL.revokeObjectURL(postVideoPreviewUrl);
  //     setPostVideoPreviewUrl(null);
  //   }
  // };
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPost = async () => {
    if (
      !postMessage &&
      !selectedImages.length &&
      !selectedVideo &&
      !selectedTopic
    ) {
      showToast({
        message: "Please add a message, select media, or choose a topic.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", postMessage);
    formData.append("topic_id", selectedTopic);

    // Append all selected images
    selectedImages.forEach((image) => {
      formData.append("file", image);
    });

    // Append video if selected
    if (selectedVideo) {
      formData.append("file", selectedVideo);
    }

    try {
      const response = await AddPost(formData);
      if (response) {
        showToast({
          message: "Post created successfully",
          type: "success",
          duration: 3000,
        });

        getFreshPosts();

        setShowPopup(false);
        // Reset form
        setPostMessage("");
        setSelectedTopic("");
        setSelectedImages([]);
        setSelectedVideo(null);
        if (postVideoPreviewUrl) {
          URL.revokeObjectURL(postVideoPreviewUrl);
          setPostVideoPreviewUrl(null);
        }
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.error?.message || "Failed to create post",
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleStoryVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedStoryVideo(file);

      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);

      // Clean up the URL when component unmounts or when video changes
      return () => {
        URL.revokeObjectURL(videoUrl);
      };
    }
  };

  // Update the remove video handler
  const handleRemoveStoryVideo = () => {
    setSelectedStoryVideo(null);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
  };

  const handleSubmitStory = async () => {
    setApiStoryMessage(null);
    if (!selectedStoryVideo) {
      setApiStoryMessage("Please select a video.");
      return;
    }

    const formData = new FormData();
    formData.append("description", storyMessage);
    formData.append("file", selectedStoryVideo);

    try {
      setIsUploading(true); // Show loader
      const response = await AddStory(formData);

      if (response) {
        setApiStoryMessage(
          response?.success?.message || "Story added successfully"
        );
        setTimeout(async () => {
          setShowStoryPopup(false);
          // Refresh stories after successful upload
          await fetchStory();
          // setStoryData(res?.data?.data || []);
        }, 1000);

        setStoryMessage("");
        setSelectedStoryVideo(null);
      } else {
        setApiStoryMessage("Failed to create story.");
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsUploading(false); // Hide loader
    }
  };

  const fetchStory = async () => {
    try {
      const res = await GetStory();
      setStoriesData(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const openPostPopup = () => {
    setShowPopup(true);
    setApiMessage(null);
  };

  const openStoryPopup = () => {
    setShowStoryPopup(true);
    setApiStoryMessage(null);
  };

  const handleLike = async (postId: string) => {
    try {
      const formattedData = { post_id: postId };
      PostsLike(formattedData);
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: !post.is_liked,
                likes_count: post.is_liked
                  ? post.likes_count - 1
                  : post.likes_count + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error fetching like details:", error);
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

  // const handleSave = async (postId: string) => {
  //   try {
  //     setUserPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post.id === postId ? { ...post, is_saved: !post.is_saved } : post
  //       )
  //     );
  //     // Add your API call to save/unsave the post here
  //     // await savePostAPI(postId);
  //   } catch (error) {
  //     console.error("Error handling save:", error);
  //   }
  // };

  // const isImageFile = (url: string) => {
  //   return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
  // };

  const isVideoFile = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!openMenu.postId || !openMenu.type) return;

    const key = `${openMenu.postId}-${openMenu.type}`;
    const currentMenu = menuRef.current[key];

    if (currentMenu && !currentMenu.contains(event.target as Node)) {
      setOpenMenu({ postId: null, type: null });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const toggleMenu = (postId: string, type: "options" | "share") => {
    setOpenMenu((prev) => {
      if (prev.postId === postId && prev.type === type) {
        return { postId: null, type: null }; // close
      } else {
        return { postId, type }; // open
      }
    });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      getUserPosts(); // Call API when the user scrolls near the bottom
    }
  };
  //@ts-ignore
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    // Cleanup on unmount
    return () =>
      container && container.removeEventListener("scroll", handleScroll);
  }, [page, isLoading]);

  const MeDetail = async () => {
    try {
      const response = await MeDetails();
      if (response?.data?.data?.user) {
        setUserInfo(response?.data?.data?.user);
      }
      const dobString = response?.data?.data?.user?.dob;
      if (!dobString) {
        setIsAdult(false);
        return;
      }

      const dob = new Date(dobString);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age >= 18) {
        setIsAdult(true);
      } else {
        setIsAdult(false);
      }
    } catch (error) {
      console.error("Error fetching me details:", error);
      setIsAdult(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsPostsLoading(true);
      await getUserPosts();
      setIsPostsLoading(false);
    };

    fetchInitialData();
    MeDetail();
  }, []);

  /* Report Modal and Save Post Modal and Copy Post Modal */
  // Function to copy post link
  // const copyPostLink = async (postId: string) => {
  //   toggleMenu(postId, "options");
  //   const postUrl = `${window.location.origin}/post/${postId}`;

  //   try {
  //     await navigator.clipboard.writeText(postUrl);
  //     showToast({
  //       type: "success",
  //       message: "Post link copied to clipboard!",
  //       duration: 2000,
  //     });
  //   } catch (error) {
  //     showToast({
  //       type: "error",
  //       message: "Failed to copy link",
  //       duration: 2000,
  //     });
  //   }
  // };

  // Function to save post to collection
  const savePostToCollection = async (postId: string) => {
    try {
      const response = await SavePost(postId);

      if (response.success) {
        showToast({
          type: "success",
          message: "Post saved to collection successfully!",
          duration: 2000,
        });
        //setIsSavingPost(postId);
        // Update the post's saved status in your posts array
        setUserPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, is_saved: true } : post
          )
        );
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to save post to collection",
        duration: 2000,
      });
    }
  };

  // Function to report post
  const reportPost = async () => {
    if (!selectedPostForReport || !reportReason.trim()) {
      showToast({
        type: "error",
        message: "Please provide a reason for reporting",
        duration: 2000,
      });
      return;
    }

    setIsReportingPost(selectedPostForReport);
    try {
      const response = await ReportPost(selectedPostForReport, reportReason);

      if (response.success) {
        showToast({
          type: "success",
          message:
            "Post reported successfully! Admin will review it soon and take action if needed.",
          duration: 2000,
        });
        setShowReportModal(false);
        setSelectedPostForReport(null);
        setReportReason("");
      } else {
        throw new Error("Failed to report post");
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to report post",
        duration: 2000,
      });
    } finally {
      setIsReportingPost(null);
    }
  };

  // Function to open report modal
  const openReportModal = (postId: string) => {
    setSelectedPostForReport(postId);
    setShowReportModal(true);
    // setOpenMenuPostId(null); // Close the three-dot menu
  };

  useEffect(() => {
    /*const handleClickOutside = (event: MouseEvent) => {
      if (openMenuPostId && menuRef.current[openMenuPostId] &&
        !menuRef.current[openMenuPostId]!.contains(event.target as Node)) {
        setOpenMenuPostId(null);
      }
    };*/

    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenu.postId || !openMenu.type) return;

      const key = `${openMenu.postId}-${openMenu.type}`;
      const currentMenu = menuRef.current[key];

      if (currentMenu && !currentMenu.contains(event.target as Node)) {
        setOpenMenu({ postId: null, type: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedTopic, setSelectedTopic] = useState<string>(""); // dropdown state
  const [topics, setTopics] = useState<Topic[]>([]); // list of topics
  const [userSelectedTopics, setUserSelectedTopics] = useState<Topic[]>([]); // list of user selected topics
  const [visibleTopic, setVisibleTopic] = useState(10);
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Fetch topics from API (example)
  // useEffect(() => {
  //   const fetchTopics = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/topics"); // your backend API
  //       const data = await res.json();
  //       setTopics(data);
  //     } catch (err) {
  //       console.error("Error fetching topics:", err);
  //     }
  //   };

  //   fetchTopics();
  // }, []);

  // Open the modal when the page mounts
  // useEffect(() => {
  //   setShowTopicModal(true);
  // }, []);

  useEffect(() => {
    fetchUserSelectedTopics();

    // const stored = localStorage.getItem("selected_topics");
    // show overlay on first page load if nothing stored yet
    // if (!stored) setShowTopicModal(true);
  }, []);

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
        setShowTopicModal(true);
      } else {
        showToast({
          message: "Failed to load User Selected Topics.",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  const handleTopicsSelected = async (ids: string[]) => {
    if (!loggedInUserID) {
      showToast({
        message: "No user ID found.",
        type: "error",
        duration: 2000,
      });
      return;
    }
    try {
      const payload = { topicIds: ids };

      const response = await UserSelectedTopic(loggedInUserID, payload);
      if (response?.success?.statusCode === 201) {
        // const selectedIds = response?.data?.data?.map(
        //   (item: Topic) => item?.id
        // );
        // if (selectedIds?.length) {
        //   localStorage.setItem("selected_topics", JSON.stringify(selectedIds));
        // }
        setShowTopicModal(false);
        fetchUserSelectedTopics();
      } else if (response?.success?.statusCode === 200) {
        showToast({
          message:
            "Looks like you've selected every available Conscious Topics.",
          type: "error",
          duration: 3000,
        });
      } else {
        console.warn("Error during add user selected topic", response);
      }
    } catch (error) {
      console.error("Error fetching badge details:", error);
      showToast({
        message: "Something went wrong. Please try again.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {isAdult ? (
        <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-2 px-2 md:px-2 lg:px-0 w-full">
          {/* Left Side: Post & Stories - Full width on mobile */}
          <div
            className="w-full lg:max-w-[70%] overflow-y-auto h-[calc(100vh-100px)]"
            ref={containerRef}
          >
            {activeView === "posts" ? (
              <>
                {/* {isPostsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : ( */}
                <>
                  {/* Start a Post */}
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 md:p-6 rounded-xl mb-4 md:mb-5">
                    <div className="flex flex-col gap-2 md:gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            localStorage.getItem("profile_picture") ||
                            createstory
                          }
                          alt="User"
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                        />
                        <input
                          type="text"
                          placeholder="Start a Post"
                          className="flex-1 cursor-pointer px-3 py-1 md:px-4 md:py-2 rounded-full border border-gray-300 text-sm md:text-[16px] focus:outline-none bg-white"
                          onClick={() => openPostPopup()}
                          readOnly
                        />
                      </div>
                      <div className="flex justify-between md:justify-center md:gap-10 text-xs md:text-[15px] text-gray-700 mt-2 md:mt-3">
                        <button
                          className="flex items-center gap-1 md:gap-2"
                          onClick={() => openPostPopup()}
                        >
                          <Image
                            src="/youtube.png"
                            alt="youtube"
                            width={20}
                            height={14}
                            className="object-contain rounded-0 w-5 md:w-6"
                          />
                          <span className="text-black text-xs md:text-sm">
                            Video
                          </span>
                        </button>
                        <button
                          className="flex items-center gap-1 md:gap-2"
                          onClick={() => openPostPopup()}
                        >
                          <Image
                            src="/picture.png"
                            alt="picture"
                            width={20}
                            height={16}
                            className="object-contain rounded-0 w-5 md:w-6"
                          />
                          <span className="text-black text-xs md:text-sm">
                            Photo
                          </span>
                        </button>
                        {/* <button className="hidden md:flex items-center gap-1 md:gap-2">
                          <Image
                            src="/list.png"
                            alt="list"
                            width={20}
                            height={16}
                            className="object-contain rounded-0 w-5 md:w-6"
                          />
                          <span className="text-black text-xs md:text-sm">
                            List
                          </span>
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* Story Strip Wrapper */}
                  <h4 className="font-medium">Reflections</h4>
                  <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory mt-3 md:mt-4">
                    {/* Create Story Card */}
                    <div
                      onClick={() => openStoryPopup()}
                      className="w-[140px] h-[190px] md:w-[164px] md:h-[214px] rounded-[12px] overflow-hidden relative cursor-pointer shrink-0 snap-start"
                    >
                      <img
                        src={createstory}
                        alt="Create Story Background"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/profile.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <svg
                        viewBox="0 0 162 70"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 left-0 w-full h-[70px] z-10"
                      >
                        <path
                          d="M0,0 H61 C65,0 81,22 81,22 C81,22 97,0 101,0 H162 V70 H0 Z"
                          fill="#7C81FF"
                        />
                      </svg>
                      <div className="absolute bottom-[46px] left-1/2 -translate-x-1/2 z-20">
                        <div className="w-9 h-9 md:w-12 md:h-12 bg-white text-[#7C81FF] font-semibold rounded-full flex items-center justify-center text-xl shadow-md border-5">
                          +
                        </div>
                      </div>
                      <div className="absolute bottom-[14px] w-full text-center text-white text-xs md:text-[15px] font-medium z-20">
                        Create Story
                      </div>
                      <div className="w-full border-t-[5px] border-[#7C81FF] mt-4"></div>
                    </div>

                    {storiesData.map((story) => (
                      <div
                        key={story.id}
                        className="w-[140px] h-[190px] md:w-[162px] md:h-[214px] snap-start shrink-0 rounded-[12px] overflow-hidden relative"
                      >
                        <StoryCard
                          id={story.id}
                          userIcon={story.profile.profile_picture}
                          userName={`${story.profile.first_name} ${story.profile.last_name}`}
                          title={
                            story.stories[0].description || "Untitled Story"
                          }
                          videoSrc={story.stories[0].video_file}
                        />

                        <div className="absolute bottom-2 left-2 flex items-center gap-2 z-20 text-white">
                          <img
                            src={story.profile.profile_picture}
                            alt={`${story.profile.first_name} ${story.profile.last_name}`}
                            className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/profile.png";
                            }}
                          />
                          <span className="text-xs md:text-[13px] font-medium drop-shadow-sm">
                            {story.username}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full border-t-[1px] border-[#C8C8C8] mt-4 md:mt-6"></div>

                  {/* Posts Section */}
                  <div className="mt-4 px-6 py-3 bg-[rgba(112,119,254,0.1)] text-[#7077FE] font-medium rounded-xl text-center w-fit">
                    REFLECTION SCROLL
                  </div>
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-md p-3 md:p-4 w-full mx-auto mt-4 md:mt-5"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 md:gap-3">
                          <Link
                            to={`/dashboard/userprofile/${post?.profile?.id}`}
                          >
                            <img
                              src={
                                post.profile.profile_picture
                                  ? post.profile.profile_picture
                                  : "/profile.png"
                              }
                              className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                              alt="User"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/profile.png";
                              }}
                            />
                          </Link>
                          <div>
                            <p className="font-semibold text-sm md:text-base text-gray-800">
                              <Link
                                to={`/dashboard/userprofile/${post?.profile?.id}`}
                              >
                                {" "}
                                {post.profile.first_name}{" "}
                                {post.profile.last_name}
                              </Link>
                              <span className="text-gray-500 text-xs md:text-sm">
                                {" "}
                                <Link
                                  to={`/dashboard/userprofile/${post?.profile?.id}`}
                                >
                                  {" "}
                                  @{post.user.username}
                                </Link>
                              </span>
                            </p>
                            <p className="text-xs md:text-sm text-gray-400">
                              {new Date(post.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {post.user_id !== loggedInUserID && (
                          <div className="flex gap-2">
                            {/* Connect Button */}
                            <button
                              onClick={() => handleConnect(post.user_id)}
                              disabled={connectingUsers[post.user_id] || false}
                              className={`flex items-center gap-1 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors
                                ${
                                  // getFriendStatus(post.user_id) === "connected"
                                  //   ? "bg-red-500 text-white hover:bg-red-600"
                                  //   :
                                  getFriendStatus(post.user_id) === "requested"
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-white text-black shadow-md"
                                }`}
                            >
                              {connectingUsers[post.user_id]
                                ? "Loading..."
                                : // : getFriendStatus(post.user_id) === "connected"
                                // ? "Connected"
                                getFriendStatus(post.user_id) === "requested"
                                ? "Requested"
                                : "Connect"}
                            </button>
                            {/* Follow Button */}
                            <button
                              onClick={() => handleFollow(post.user_id)}
                              className={`flex items-center gap-1 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors
                                ${
                                  post.if_following
                                    ? "bg-transparent text-blue-500 hover:text-blue-600"
                                    : "bg-[#7C81FF] text-white hover:bg-indigo-600"
                                }`}
                            >
                              {post.if_following ? (
                                <>
                                  <TrendingUp className="w-5 h-5" /> Following
                                </>
                              ) : (
                                "+ Follow"
                              )}
                            </button>

                            {/* Three Dots Menu */}
                            <div className="relative">
                              <button
                                onClick={() => toggleMenu(post.id, "options")}
                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                                title="More options"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                              </button>

                              {openMenu.postId === post.id &&
                                openMenu.type === "options" && (
                                  <div
                                    className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                                    ref={(el) => {
                                      const key = `${post.id}-options`;
                                      if (el) menuRef.current[key] = el;
                                      else delete menuRef.current[key];
                                    }}
                                  >
                                    <ul className="space-y-1">
                                      <li>
                                        <button
                                          onClick={() => {
                                            copyPostLink(
                                              `${window.location.origin}/post/${post.id}`,
                                              (msg) =>
                                                showToast({
                                                  type: "success",
                                                  message: msg,
                                                  duration: 2000,
                                                }),
                                              (msg) =>
                                                showToast({
                                                  type: "error",
                                                  message: msg,
                                                  duration: 2000,
                                                })
                                            );
                                          }}
                                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <LinkIcon className="w-4 h-4" />
                                          Copy Post Link
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() =>
                                            savePostToCollection(post.id)
                                          }
                                          disabled={post.is_saved}
                                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                        >
                                          <Bookmark className="w-4 h-4" />
                                          {post.is_saved
                                            ? "Saved"
                                            : "Save Post"}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() =>
                                            openReportModal(post.id)
                                          }
                                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                          <Flag className="w-4 h-4" />
                                          Report Post
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        {post.user_id == loggedInUserID && (
                          <div className="flex gap-2">
                            {/* Three Dots Menu */}
                            <div className="relative">
                              <button
                                onClick={() => toggleMenu(post.id, "options")}
                                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                                title="More options"
                              >
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                              </button>

                              {openMenu.postId === post.id &&
                                openMenu.type === "options" && (
                                  <div
                                    className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                                    ref={(el) => {
                                      const key = `${post.id}-options`;
                                      if (el) menuRef.current[key] = el;
                                      else delete menuRef.current[key];
                                    }}
                                  >
                                    <ul className="space-y-1">
                                      <li>
                                        <button
                                          onClick={() => {
                                            copyPostLink(
                                              `${window.location.origin}/post/${post.id}`,
                                              (msg) =>
                                                showToast({
                                                  type: "success",
                                                  message: msg,
                                                  duration: 2000,
                                                }),
                                              (msg) =>
                                                showToast({
                                                  type: "error",
                                                  message: msg,
                                                  duration: 2000,
                                                })
                                            );
                                          }}
                                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                          <LinkIcon className="w-4 h-4" />
                                          Copy Post Link
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() =>
                                            savePostToCollection(post.id)
                                          }
                                          disabled={post.is_saved}
                                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                        >
                                          <Bookmark className="w-4 h-4" />
                                          {post.is_saved
                                            ? "Saved"
                                            : "Save Post"}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="mt-3 md:mt-4">
                        <p className="text-gray-800 text-sm md:text-base mb-2 md:mb-3">
                          {expandedPosts[post.id] ||
                          post?.content?.length <= CONTENT_LIMIT
                            ? post.content
                            : `${post?.content?.substring(
                                0,
                                CONTENT_LIMIT
                              )}...`}
                          {post?.content?.length > CONTENT_LIMIT && (
                            <button
                              onClick={() => toggleExpand(post.id)}
                              className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
                            >
                              {expandedPosts[post.id]
                                ? "Show less"
                                : "Read more"}
                            </button>
                          )}
                        </p>

                        {/* Dynamic Media Block */}
                        {post.file && (
                          <div className="rounded-lg overflow-hidden">
                            {(() => {
                              const urls = post.file
                                .split(",")
                                .map((url) => url.trim());
                              const mediaItems = urls.map((url) => ({
                                url,
                                type: (isVideoFile(url) ? "video" : "image") as
                                  | "video"
                                  | "image",
                              }));

                              // Use PostCarousel if there are multiple items (images or videos)
                              if (mediaItems.length > 1) {
                                return <PostCarousel mediaItems={mediaItems} />;
                              }

                              // Single item rendering
                              const item = mediaItems[0];
                              return item.type === "video" ? (
                                <video
                                  className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl"
                                  controls
                                  muted
                                  autoPlay
                                  loop
                                >
                                  <source src={item.url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={item.url}
                                  alt="Post content"
                                  className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl mb-2"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = carosuel1;
                                  }}
                                />
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Reactions and Action Buttons */}
                      <div className="flex justify-between items-center mt-3 px-1 text-xs md:text-sm text-gray-600 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 md:gap-2">
                            <div className="flex items-center -space-x-2 md:-space-x-3">
                              <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                                <img
                                  src={like}
                                  alt="Like"
                                  className="w-6 h-6 md:w-8 md:h-8"
                                />
                              </div>
                              {/* <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                                  <img
                                    src={comment}
                                    alt="Comment"
                                    className="w-6 h-6 md:w-8 md:h-8"
                                  />
                                </div> */}
                              {/* <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                                  <img
                                    src={repost}
                                    alt="Repost"
                                    className="w-6 h-6 md:w-8 md:h-8"
                                  />
                                </div> */}
                              <span className="text-xs md:text-sm text-gray-500 pl-3 md:pl-5">
                                {post.likes_count}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                              <img
                                src={comment}
                                alt="Comment"
                                className="w-6 h-6 md:w-8 md:h-8"
                              />
                            </div>
                            <span>{post.comments_count}</span>
                          </div>
                        </div>
                        {post.comments_count > 0 && (
                          <div>
                            <span className="text-sm text-[#64748B]">
                              {post.comments_count} Reflections Thread
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5">
                        <button
                          onClick={() => handleLike(post.id)}
                          disabled={isLoading}
                          className={`flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-1 h-[45px] font-opensans font-semibold text-sm leading-[150%] bg-white text-[#7077FE] hover:bg-gray-50 shadow-sm ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <ThumbsUp
                            className="w-5 h-5 md:w-6 md:h-6"
                            fill={post.is_liked ? "#7077FE" : "none"} // <-- condition here
                            stroke={post.is_liked ? "#7077FE" : "#7077FE"} // keeps border visible
                          />
                          <span>Affirmation Modal</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setShowCommentBox(true);
                          }}
                          className="flex items-center justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6  border border-[#E5E7EB] rounded-xl font-semibold text-sm md:text-base text-[#7077FE] hover:bg-gray-50 shadow-sm"
                        >
                          <img
                            src={comment1}
                            className="w-5 h-5 md:w-6 md:h-6"
                          />{" "}
                          Reflections Thread
                        </button>
                        {/* <button className="flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-blue-500 hover:bg-blue-50 shadow-sm">
                  <img src={repost1} className="w-5 h-5 md:w-6 md:h-6" /> Repost
                </button> */}
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(post.id, "share")}
                            className="flex items-center w-full justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6   border border-[#E5E7EB] rounded-xl font-semibold text-sm md:text-base text-[#7077FE] hover:bg-gray-50 shadow-sm"
                          >
                            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                            Share
                          </button>
                          {openMenu.postId === post.id &&
                            openMenu.type === "share" && (
                              <SharePopup
                                isOpen={true}
                                onClose={() => toggleMenu(post.id, "share")}
                                url={buildShareUrl()} // or pass your own URL if needed
                                position="bottom"
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
                {/* )} */}
              </>
            ) : activeView === "following" ? (
              <div className="bg-white rounded-xl shadow-md p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    People You Follow
                  </h3>
                  <button
                    onClick={() => setActiveView("posts")}
                    className="text-sm text-[#7C81FF] hover:underline"
                  >
                    Back to Posts
                  </button>
                </div>
                {isFollowingLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <FollowedUsersList
                    users={followedUsers}
                    onFollowToggle={(userId) => {
                      setFollowedUsers((prev) =>
                        prev.map((user) =>
                          user.id === userId
                            ? { ...user, is_following: !user.is_following }
                            : user
                        )
                      );
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    My Collection
                  </h3>
                  <button
                    onClick={() => setActiveView("posts")}
                    className="text-sm text-[#7C81FF] hover:underline"
                  >
                    Back to Posts
                  </button>
                </div>
                {isCollectionLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <CollectionList items={collectionItems} />
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Container */}
          <div className="w-full lg:w-[30%] flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
              <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-3 md:mb-4 px-4">
                Quick Actions
              </h3>
              <div className="w-full border-t border-[#C8C8C8] my-4"></div>
              <ul className="space-y-4 text-sm md:text-[15px] text-gray-700 px-4">
                <li
                  onClick={() => navigate("/dashboard/trendingpost")}
                  className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                >
                  <img src={Trending} className="w-5 h-5" alt="" /> Trending
                </li>
                <li
                  onClick={fetchCollectionItems}
                  className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                >
                  <img src={Collection} className="w-5 h-5" alt="" /> My
                  Collection
                </li>
                <li
                  onClick={fetchFollowedUsers}
                  className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                >
                  <img src={people} className="w-5 h-5" alt="" /> People you
                  follow
                </li>
              </ul>
            </div>

            {/* User Selected Topics Below Quick Actions */}
            {userSelectedTopics?.length > 0 && (
              <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 md:mb-4 px-4">
                  <h3 className="text-gray-700 font-semibold text-base md:text-lg">
                    My Picks
                  </h3>
                  {/* <button
                    onClick={() => setShowTopicModal(true)}
                    className="text-sm text-blue-500 hover:underline hover:text-blue-600 transition cursor-pointer"
                  >
                    Change
                  </button> */}
                </div>
                <div className="w-full border-t border-[#C8C8C8] my-4"></div>
                <ul className="space-y-3 text-sm md:text-[15px] text-gray-700 px-4">
                  {userSelectedTopics?.map((topic) => (
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
                  {userSelectedTopics?.length === 0 && (
                    <button disabled className="text-gray-400 italic">
                      No selected topics available
                    </button>
                  )}
                </ul>
              </div>
            )}

            {/* Topics BELOW User Selected Topics */}
            <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
              <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-3 md:mb-4 px-4">
                Explore Topics
              </h3>
              <div className="w-full border-t border-[#C8C8C8] my-4"></div>
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
            </div>
          </div>

          {/* Popup Modals (unchanged) */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-[18px] w-full max-w-md mx-4 shadow-lg relative">
                <div className="flex px-5 py-3 bg-[#897AFF1A] justify-between items-center">
                  <div className="w-fit h-fit">
                    <Image
                      src="/popup-plus-icon.png"
                      alt="plus-icon"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mb-0 text-[#897AFF]">
                    Create Post
                  </h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-[#E1056D] text-[26px] hover:text-black cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-4 px-3 flex items-center gap-2 md:gap-3">
                  <Link to={`/dashboard/userprofile/${userInfo?.id}`}>
                    <img
                      src={
                        userInfo.profile_picture
                          ? userInfo.profile_picture
                          : "/profile.png"
                      }
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                      alt="User"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/profile.png";
                      }}
                    />
                  </Link>
                  <div>
                    <p className="font-semibold text-sm md:text-base text-black">
                      <Link to={`/dashboard/userprofile/${userInfo?.id}`}>
                        {userInfo.name}
                      </Link>
                    </p>
                  </div>
                </div>

                {/* {apiMessage && (
                <div
                  className={`poppins text-center mb-4 ${
                    apiMessage.includes("verification")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {apiMessage}
                </div>
              )} */}
                <div className="px-3 mt-4 pb-5">
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-[#ECEEF2] text-black placeholder:text-[#64748B] text-sm rounded-md resize-none mb-3 outline-none focus:border-[#897AFF1A]"
                    placeholder={`What's on your mind? ${userInfo.main_name}...`}
                    value={postMessage}
                    onChange={(e) => setPostMessage(e.target.value)}
                  />

                  <div className="space-y-3 mb-4 flex rounded-[8px] border border-[#F07EFF1A]  justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
                    <p className="mb-0 text-sm font-semibold">
                      Add to your post :
                    </p>
                    <div className="flex justify-end gap-4 w-6/12">
                      <div>
                        <label
                          className="flex gap-2 items-center text-sm font-medium text-gray-700 mb-1"
                          htmlFor="video-upload"
                        >
                          <Image
                            src="/youtube.png"
                            alt="youtube"
                            width={24}
                            height={16}
                            className="object-contain rounded-0 cursor-pointer"
                          />
                          <span className="text-black text-sm cursor-pointer">
                            Video
                          </span>
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          id="video-upload"
                          className="w-full hidden cursor-pointer"
                          onChange={handleVideoChange}
                        />
                      </div>

                      <div>
                        <label
                          className="flex gap-2 items-center text-sm font-medium text-gray-700 mb-1 "
                          htmlFor="photo-upload"
                        >
                          <Image
                            src="/picture.png"
                            alt="picture"
                            width={22}
                            height={20}
                            className="object-contain rounded-0 cursor-pointer"
                          />
                          <span className="text-black text-sm cursor-pointer">
                            Photo
                          </span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id="photo-upload"
                          className="w-full hidden cursor-pointer"
                          multiple
                          onChange={handleImageChange}
                        />

                        {/* Show preview below input */}
                        {/* <div className="grid grid-cols-2 gap-4 mt-4">
                        {selectedImages.map((file, index) => (
                          <Image
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`Selected image ${index + 1}`}
                            className="rounded-md"
                            width={200}
                            height={200}
                          />
                        ))}
                      </div> */}
                      </div>
                    </div>
                  </div>
                  {/* Image Previews */}
                  {selectedImages.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {selectedImages.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Preview */}
                  {postVideoPreviewUrl && (
                    <div className="mb-4 relative">
                      <video
                        controls
                        className="w-full max-h-[300px] rounded-lg object-cover"
                        src={postVideoPreviewUrl}
                      />
                      <button
                        onClick={() => {
                          setSelectedVideo(null);
                          URL.revokeObjectURL(postVideoPreviewUrl);
                          setPostVideoPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3">
                    <select
                      id="topic-select"
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-80 mr-3 p-2 border border-[#ECEEF2] text-sm rounded-md outline-none focus:border-[#7077FE]"
                    >
                      <option value="" disabled>
                        -- What’s this post about? --
                      </option>
                      {topics.length > 0 ? (
                        topics.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.topic_name}
                          </option>
                        ))
                      ) : (
                        <option
                          value=""
                          disabled
                          className="text-gray-400 italic"
                        >
                          No topics available
                        </option>
                      )}
                      {topics.length > 0 && (
                        <option value={999999}>Other</option>
                      )}
                    </select>

                    <button
                      onClick={handleSubmitPost}
                      className="bg-[#7077FE] text-white px-6 py-2 rounded-full hover:bg-[#5b63e6]"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showStoryPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-[18px] w-full max-w-md mx-4 shadow-lg relative">
                <div className="flex px-5 py-3 bg-[#897AFF1A] justify-between items-center">
                  <div className="w-fit h-fit">
                    <Image
                      src="/popup-plus-icon.png"
                      alt="plus-icon"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mb-0 text-gray-800">
                    Upload Story
                  </h2>
                  <button
                    onClick={() => setShowStoryPopup(false)}
                    className="text-black text-[26px] hover:text-black cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {/* {apiStoryMessage && (
                <div
                  className={`poppins text-center mb-4 ${
                    apiStoryMessage.includes("verification")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {apiStoryMessage}
                </div>
              )} */}
                <div className="px-3 mt-5 pb-5">
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-[#ECEEF2] text-black placeholder:text-[#64748B] text-sm rounded-md resize-none mb-3 outline-none focus:border-[#897AFF1A]"
                    placeholder="Write anything about your story"
                    value={storyMessage}
                    onChange={(e) => setStoryMessage(e.target.value)}
                  />

                  {/* Video Upload Section */}
                  <div className="space-y-3 mb-4 flex rounded-[8px] border border-[#F07EFF1A] justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
                    <div className="flex justify-center gap-4 w-full">
                      <div>
                        <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                          <Image
                            src="/youtube.png"
                            alt="youtube"
                            width={24}
                            height={16}
                            className="object-contain rounded-0"
                          />
                          <span className="text-black text-sm">
                            Select Video
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            id="video-upload-story"
                            className="hidden"
                            onChange={handleStoryVideoChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Video Preview */}
                  {videoPreviewUrl && (
                    <div className="mb-4 relative">
                      <video
                        controls
                        className="w-full max-h-[300px] rounded-lg object-cover"
                        src={videoPreviewUrl}
                      />
                      <button
                        onClick={handleRemoveStoryVideo}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        ×
                      </button>
                      <div className="text-xs text-gray-500 mt-1">
                        Video preview - {selectedStoryVideo?.name}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={handleSubmitStory}
                      className="w-full py-2 text-sm rounded-[100px] bg-[#7077FE] text-white disabled:bg-gray-400"
                      disabled={!selectedStoryVideo || isUploading}
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading...
                        </div>
                      ) : (
                        "Post Story"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCommentBox && selectedPostId && (
            <CommentBox
              setUserPosts={setUserPosts}
              userPosts={userPosts}
              postId={selectedPostId}
              onClose={() => {
                setShowCommentBox(false);
                setSelectedPostId(null);
              }}
            />
          )}

          {showTopicModal && (
            <TopicModal
              topics={topics} // ← correct prop name
              onSelect={handleTopicsSelected} // ← now defined
              onClose={() => setShowTopicModal(false)}
            />
          )}
        </div>
      ) : (
        <>
          <div className="w-full min-h-[70vh] flex items-center justify-center px-4">
            <div className="bg-white max-w-2xl w-full shadow-lg rounded-xl p-8 text-center">
              <div className="py-8">
                <svg
                  className="w-20 h-20 text-purple-500 mx-auto mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  Sorry!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Only users 18 years or older can access the social media
                  feature.
                </p>
                <div className="w-full flex justify-center mt-4">
                  <Button
                    variant="gradient-primary"
                    className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                    type="submit"
                  >
                    <Link to="/dashboard/user-profile"> Update Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Post Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)}>
        <div className="p-0 lg:min-w-[450px] md:min-w-[450px] min-w-[300px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Report Post
          </h3>
          <div className="mb-4">
            <label
              htmlFor="reportReason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason why you report this post
            </label>
            <textarea
              id="reportReason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide a reason for reporting this post..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={reportPost}
              disabled={
                isReportingPost === selectedPostForReport ||
                !reportReason.trim()
              }
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReportingPost === selectedPostForReport
                ? "Submitting..."
                : "Submit Report"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
