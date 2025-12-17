// pages/Trending.tsx
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  GetAllTrendingPost,
  getTopics,
  getUserSelectedTopic,
  PostsLike,
  SendFollowRequest,
  UnFriend,
  SendFriendRequest,
  SavePost,
  UnsavePost,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { IoTrendingUpSharp } from "react-icons/io5";
import {
  Share2,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Link as LinkIcon,
  MoreHorizontal,
  UserRoundPlus,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import React from "react";
import CommentBox from "./CommentBox";

type Topic = {
  id: string;
  topic_name: string;
  slug: string;
};

const PAGE_LIMIT = 10;
const CONTENT_LIMIT = 150;

function PostCarousel({ mediaItems }: any) {
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
    <div className="relative w-full ">
      {/* Media Container */}
      <div className="w-full aspect-video rounded-3xl  bg-black">
        {mediaItems.map((item: any, index: any) => (
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
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-[42px] h-[42px] rounded-full flex items-center justify-center z-10"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-[42px] h-[42px] rounded-full flex items-center justify-center z-10"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Show dots only if there are multiple items */}
      {mediaItems.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {mediaItems.map((_: any, idx: any) => (
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

export default function Trending() {
  const nav = useNavigate();
  const location = useLocation();
  const isTrendingAI = location.pathname.endsWith("/trendingai");

  const { showToast } = useToast();

  // State for posts
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // State for post interactions
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );
  const [openMenu, setOpenMenu] = useState<{
    postId: string | null;
    type: "options" | "share" | null;
  }>({ postId: null, type: null });
  const [copy, setCopy] = useState<boolean>(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);

  // State for topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [visibleTopic, setVisibleTopic] = useState(10);
  const [userSelectedTopics, setUserSelectedTopics] = useState<Topic[]>([]);
  const loggedInUserID = localStorage.getItem("Id");
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const openTopics = () => setIsTopicsOpen(true);
  const closeTopics = () => setIsTopicsOpen(false);

  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      // Manually format: 01 Sep 2025, 11.52 AM
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();

      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      return `${day} ${month} ${year}, ${hours}.${minutes} ${ampm}`;
    }
  };

  const isVideoFile = (fileType: string, url: string) => {
    if (fileType === "video") return true;
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  };

  const isValidMediaUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false;

    const trimmedUrl = url.trim();

    // Check if URL is empty or just contains the base path without actual file
    if (
      !trimmedUrl ||
      trimmedUrl === "https://dev.cness.io/file/" ||
      trimmedUrl === "https://dev.cness.io/file" ||
      trimmedUrl.endsWith("/file/") ||
      trimmedUrl.endsWith("/file")
    ) {
      return false;
    }

    // Check if URL has a file extension or looks like a valid media file
    const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(trimmedUrl);
    const hasValidMediaPattern = /\.(jpg|jpeg|png|webp|mp4|webm|ogg|mov)/i.test(
      trimmedUrl
    );

    return hasFileExtension || hasValidMediaPattern;
  };

  const renderContentWithHashtags = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\#[\w]+)/g);
    return parts.map((part, idx) => {
      if (part.match(/^#[\w]+/)) {
        const tag = part.slice(1);
        return (
          <button
            key={`${part}-${idx}`}
            onClick={() =>
              nav(`/dashboard/feed/search?tag=${encodeURIComponent(tag)}`)
            }
            className="text-[#7077FE] hover:underline"
            type="button"
          >
            {part}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = async (postId: string, _event: React.MouseEvent) => {
    try {
      const formattedData = { post_id: postId };

      // Make the API call first
      const res = await PostsLike(formattedData);

      // Update karma_credits in localStorage from API response
      if (res?.data?.data?.karma_credits !== undefined) {
        localStorage.setItem(
          "karma_credits",
          res.data.data.karma_credits.toString()
        );
        window.dispatchEvent(new Event("karmaCreditsUpdated"));
      }

      // Update posts state
      setPosts((prevPosts) =>
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
      showToast({
        message: "Failed to like post",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      await SendFollowRequest(formattedData);

      // Update posts
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.user_id === userId
            ? { ...post, if_following: !post.if_following }
            : post
        )
      );

      showToast({
        message: "Follow status updated",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error fetching selection details:", error);
      showToast({
        message: "Failed to update follow status",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      // Find the post to get current status
      const post = posts.find((p) => p.user_id === userId);
      if (!post || post.user_id !== userId) return;

      // Case 1: No existing connection or pending request - Send new connection request
      if (
        post.friend_request_status !== "ACCEPT" &&
        post.friend_request_status !== "PENDING" &&
        !post.if_friend
      ) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await SendFriendRequest(formattedData);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });

        // Update the post in posts state
        setPosts((prev) =>
          prev.map((p) =>
            p.user_id === userId
              ? {
                  ...p,
                  if_friend: false,
                  friend_request_status: "PENDING",
                  is_requested: true,
                }
              : p
          )
        );
      }
      // Case 2: Cancel pending request (when status is PENDING)
      else if (post.friend_request_status === "PENDING" && !post.if_friend) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await UnFriend(formattedData);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });

        setPosts((prev) =>
          prev.map((p) =>
            p.user_id === userId
              ? {
                  ...p,
                  if_friend: false,
                  friend_request_status: null,
                  is_requested: false,
                }
              : p
          )
        );
      }
      // Case 3: Remove existing friend connection
      else if (post.friend_request_status === "ACCEPT" && post.if_friend) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await UnFriend(formattedData);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });

        setPosts((prev) =>
          prev.map((p) =>
            p.user_id === userId
              ? {
                  ...p,
                  if_friend: false,
                  friend_request_status: null,
                  is_requested: false,
                }
              : p
          )
        );
      }
    } catch (error: any) {
      console.error("Error handling friend request:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to update connection",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Function to save/unsave post to collection
  const savePostToCollection = async (postId: string) => {
    try {
      const currentPost = posts.find((post) => post.id === postId);
      const isCurrentlySaved = currentPost?.is_saved || false;

      // Use appropriate API based on current state
      const response = isCurrentlySaved
        ? await UnsavePost(postId)
        : await SavePost(postId);

      if (response.success) {
        showToast({
          type: "success",
          message: isCurrentlySaved
            ? "Post removed from collection!"
            : "Post saved to collection successfully!",
          duration: 2000,
        });

        // Update the post's saved status in posts array
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, is_saved: !isCurrentlySaved } : post
          )
        );
      } else {
        throw new Error("Failed to save/unsave post");
      }
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to save/unsave post to collection",
        duration: 2000,
      });
    }
  };

  const copyPostLink = (
    url: string,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void
  ) => {
    navigator.clipboard
      .writeText(url)
      .then(() => onSuccess("Link copied to clipboard!"))
      .catch(() => onError("Failed to copy link"));
  };

  const toggleMenu = (postId: string, type: "options" | "share") => {
    setOpenMenu((prev) => {
      if (prev.postId === postId && prev.type === type) {
        return { postId: null, type: null }; // close
      } else {
        return { postId, type }; // open
      }
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!openMenu.postId || !openMenu.type) return;

    const key = `${openMenu.postId}-${openMenu.type}`;
    const currentMenu = menuRef.current[key];

    // Close options menu if click is outside
    if (currentMenu && !currentMenu.contains(event.target as Node)) {
      setOpenMenu({ postId: null, type: null });
    }

    // Close share menu if click is outside
    if (
      shareMenuRef.current &&
      !shareMenuRef.current.contains(event.target as Node)
    ) {
      setOpenMenu({ postId: null, type: null });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

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
        // setShowTopicModal(true);
      } else {
        showToast({
          message: "Failed to load User Selected Topics.",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  useEffect(() => {
    fetchUserSelectedTopics();
    fetchTopics();
  }, []);

  const getTrendingPosts = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setIsLoadingInitial(true);
    }

    try {
      const res = await GetAllTrendingPost(page);

      if (res?.data?.data?.rows) {
        const rows: any[] = res.data.data.rows;
        const totalCount = res?.data?.data?.count || 0;
        const totalPages = Math.ceil(totalCount / PAGE_LIMIT);

        if (rows.length === 0) {
          setHasMore(false);
        } else {
          // Process each post to handle the file array structure
          const processedPosts = rows.map((post: any) => ({
            ...post,
            // Ensure file is an array even if empty
            file: post.file || [],
            // Backward compatibility: also keep a string version for existing code
            fileString: post.file
              ? post.file
                  .map((f: any) => f.file)
                  .filter(Boolean)
                  .join(",")
              : "",
          }));

          if (loadMore) {
            // Append new posts for load more
            setPosts((prevPosts) => {
              // Avoid duplicates by checking if post already exists
              const existingIds = new Set(prevPosts.map((p) => p.id));
              const filteredNewPosts = processedPosts.filter(
                (p) => !existingIds.has(p.id)
              );
              return [...prevPosts, ...filteredNewPosts];
            });
          } else {
            // Replace posts for initial load
            setPosts(processedPosts);
          }

          if (page >= totalPages) {
            setHasMore(false);
          } else {
            setPage((prevPage) => prevPage + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      if (loadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
        setIsLoadingInitial(false);
      }
    }
  };

  // Add a load more button handler
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      getTrendingPosts(true);
    }
  };

  // Initial load when component mounts
  useEffect(() => {
    // Reset state
    setPosts([]);
    setPage(1);
    setHasMore(true);
    
    // Load first page
    getTrendingPosts();
  }, []);

  const handleTopicClick = (topic: Topic) => {
    nav(`/dashboard/feed/search?topic=${topic.slug}`, {
      state: { topics, userSelectedTopics },
    });
  };

  const handleMyPickClick = (topic: Topic) => {
    nav(`/dashboard/feed/search?topic=${topic.slug}`, {
      state: { topics, userSelectedTopics },
    });
  };

  const TopicsPanel = () => (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[560px]">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-indigo-600" />
        <div className="font-medium text-gray-900">Trending Topics</div>
      </div>
      <div className="border-b border-gray-200 w-full mb-4"></div>

      {userSelectedTopics?.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="font-medium text-gray-900">My Picks</div>
          <div className="border-b border-gray-200 w-full"></div>
          <ul className="space-y-3 text-sm md:text-[15px] text-gray-700">
            {userSelectedTopics?.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleMyPickClick(topic)}
                className="flex items-center gap-2 hover:text-purple-700 cursor-pointer w-full text-left"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0"></span>
                <span className="truncate">{topic.topic_name}</span>
              </button>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 mb-2 font-medium text-gray-900">Explore Topics</div>
      <div className="border-b border-gray-200 w-full mb-4"></div>
      <ul className="space-y-3 text-sm md:text-[15px] text-gray-700">
        {topics?.slice(0, visibleTopic)?.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicClick(topic)}
            className="flex items-center gap-2 hover:text-purple-700 cursor-pointer w-full text-left"
          >
            <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0"></span>
            <span className="truncate">{topic.topic_name}</span>
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

      <div className="my-5 h-px bg-gray-100" />
    </div>
  );

  const tweetText = `Check out this post from CNESS!`;

  // Loading state
  if (isLoadingInitial) {
    return (
      <div className="w-full px-0.5 md:px-0.1 py-1">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-0.5 md:px-0.1 py-1">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h1 className="text-lg font-semibold text-gray-900">
            Trending Posts
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTopics}
            className="xl:hidden inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50"
          >
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Topics
          </button>
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50 bg-color-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <p className="mb-6 text-sm text-gray-500">
        Discover the most popular posts and conversations happening right now
      </p>

      {/* Full-width 2-col layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        {/* Feed (left) */}
        <div className="space-y-5">
          {!isTrendingAI && (
            <>
              {posts.length === 0 && !isLoading ? (
                <div className="text-center py-10 text-gray-500">
                  No trending posts found
                </div>
              ) : (
                <>
                  {posts.map((post) => {
                    const postElement = (
                      <div
                        key={post.id}
                        className="bg-white rounded-xl shadow-md p-3 md:p-4 w-full mx-auto"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Link
                              to={
                                loggedInUserID === post?.profile?.user_id
                                  ? `/dashboard/Profile`
                                  : `/dashboard/social/user-profile/${post?.profile?.user_id}`
                              }
                            >
                              <img
                                src={
                                  !post.profile.profile_picture ||
                                  post.profile.profile_picture === "null" ||
                                  post.profile.profile_picture ===
                                    "undefined" ||
                                  !post.profile.profile_picture.startsWith(
                                    "http"
                                  )
                                    ? "/profile.png"
                                    : post.profile.profile_picture
                                }
                                className="w-8 h-8 md:w-[63px] md:h-[63px] rounded-full"
                                alt="User"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/profile.png";
                                }}
                              />
                            </Link>
                            <div>
                              <p className="font-semibold text-sm md:text-base text-black">
                                <Link
                                  to={
                                    loggedInUserID === post?.profile?.user_id
                                      ? `/dashboard/Profile`
                                      : `/dashboard/social/user-profile/${post?.profile?.user_id}`
                                  }
                                >
                                  {" "}
                                  {post.profile.first_name}{" "}
                                  {post.profile.last_name}
                                </Link>
                                <span className="text-[#999999] text-xs md:text-[12px] font-light">
                                  {" "}
                                  <Link
                                    to={
                                      loggedInUserID === post?.profile?.user_id
                                        ? `/dashboard/Profile`
                                        : `/dashboard/social/user-profile/${post?.profile?.user_id}`
                                    }
                                  >
                                    {" "}
                                    @{post.user.username}
                                  </Link>
                                </span>
                              </p>
                              <p className="text-xs md:text-[12px] text-[#606060]">
                                {formatMessageTime(post.createdAt)}
                              </p>
                            </div>
                          </div>
                          {post.user_id !== loggedInUserID && (
                            <div className="flex gap-2">
                              {/* Connect Button */}
                              <button
                                onClick={() => handleConnect(post.user_id)}
                                className={`hidden lg:flex justify-center items-center gap-1 text-xs lg:text-sm px-3 py-1.5 rounded-full transition-colors font-family-open-sans h-[35px] min-w-[100px] ${
                                  post.if_friend &&
                                  post.friend_request_status === "ACCEPT"
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : !post.if_friend &&
                                      post.friend_request_status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                    : "bg-white text-black border border-gray-200"
                                }`}
                              >
                                <span className="flex items-center gap-1">
                                  <UserRoundPlus className="w-4 h-4" />
                                  {post.if_friend &&
                                  post.friend_request_status === "ACCEPT"
                                    ? "Connected"
                                    : !post.if_friend &&
                                      post.friend_request_status === "PENDING"
                                    ? "Requested"
                                    : "Connect"}
                                </span>
                              </button>
                              {/* Follow Button */}
                              <button
                                onClick={() => handleFollow(post.user_id)}
                                className={`flex justify-center items-center gap-1 text-xs lg:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors h-[35px]
                              ${
                                post.if_following
                                  ? "bg-[#7077FE] text-white hover:bg-indigo-600"
                                  : "bg-[#7077FE] text-white hover:bg-indigo-600"
                              }`}
                              >
                                {post.if_following ? (
                                  <>
                                    <IoTrendingUpSharp w-100 />
                                    Resonating
                                  </>
                                ) : (
                                  "+ Resonate"
                                )}
                              </button>

                              {/* Three Dots Menu */}
                              <div className="relative">
                                <button
                                  onClick={() => toggleMenu(post.id, "options")}
                                  className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="More options"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
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
                                        <li className="lg:hidden">
                                          <button
                                            onClick={() =>
                                              handleConnect(post.user_id)
                                            }
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                          >
                                            <UserRoundPlus className="w-4 h-4" />
                                            {post.if_friend &&
                                            post.friend_request_status ===
                                              "ACCEPT"
                                              ? "Connected"
                                              : !post.if_friend &&
                                                post.friend_request_status ===
                                                  "PENDING"
                                              ? "Requested"
                                              : "Connect"}
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() => {
                                              copyPostLink(
                                                `${window.location.origin}/social?p=${post.id}`,
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
                                            Copy Post Act
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            onClick={() =>
                                              savePostToCollection(post.id)
                                            }
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                          >
                                            <Bookmark className="w-4 h-4" />
                                            {post.is_saved
                                              ? "Unsave"
                                              : "Save Act"}
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
                                  className="flex items-center border-[#ECEEF2] border shadow-sm justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="More options"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
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
                                                `${window.location.origin}/social?p=${post.id}`,
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
                                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                          >
                                            <Bookmark className="w-4 h-4" />
                                            {post.is_saved
                                              ? "Unsave"
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
                          <p className="text-gray-800 font-[poppins] text-sm md:text-base mb-2 md:mb-3 space-y-1">
                            <span>
                              {expandedPosts[post.id] ||
                              post?.content?.length <= CONTENT_LIMIT
                                ? renderContentWithHashtags(post.content || "")
                                : renderContentWithHashtags(
                                    `${post?.content?.substring(
                                      0,
                                      CONTENT_LIMIT
                                    )}...`
                                  )}
                            </span>
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
                          {post.file && post.file.length > 0 && (
                            <div className="rounded-lg">
                              {(() => {
                                // Filter valid media items
                                const validMediaItems = post.file
                                  .filter(
                                    (item: any) =>
                                      item.file && isValidMediaUrl(item.file)
                                  )
                                  .map((item: any) => ({
                                    url: item.file,
                                    type: (isVideoFile(
                                      item.file_type,
                                      item.file
                                    )
                                      ? "video"
                                      : "image") as "video" | "image",
                                  }));

                                // If no valid media items, don't render anything
                                if (validMediaItems.length === 0) {
                                  return null;
                                }

                                // Use PostCarousel if there are multiple items
                                if (validMediaItems.length > 1) {
                                  return (
                                    // Wrap with Link if product_id exists
                                    post.product_id ? (
                                      <Link
                                        to={`/dashboard/product-detail/${post.product_id}`}
                                      >
                                        <PostCarousel
                                          mediaItems={validMediaItems}
                                        />
                                      </Link>
                                    ) : (
                                      <PostCarousel
                                        mediaItems={validMediaItems}
                                      />
                                    )
                                  );
                                }

                                // Single item rendering - wrap with Link if product_id exists
                                const item = validMediaItems[0];
                                const mediaContent =
                                  item.type === "video" ? (
                                    <video
                                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl"
                                      controls
                                      muted
                                      autoPlay
                                      loop
                                    >
                                      <source src={item.url} type="video/mp4" />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt="Post content"
                                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl mb-2"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src = ""; // Clear broken images
                                      }}
                                    />
                                  );

                                // Conditionally wrap with Link if product_id exists
                                return post.product_id ? (
                                  <Link
                                    to={`/dashboard/product-detail/${post.product_id}`}
                                  >
                                    {mediaContent}
                                  </Link>
                                ) : (
                                  mediaContent
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Reactions and Action Buttons */}
                        <div className="flex justify-between items-center mt-6 px-1 text-xs md:text-sm text-gray-600 gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 md:gap-2">
                              <div className="flex items-center -space-x-2 md:-space-x-3"></div>
                            </div>
                          </div>
                          {post.comments_count > 0 && (
                            <div>
                              <span className="text-sm text-[#64748B]">
                                {post.comments_count} Reflections
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-[#ECEEF2] grid grid-cols-3  gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5">
                          <button
                            onClick={(e) => handleLike(post.id, e)}
                            disabled={isLoading}
                            className={`flex items-center justify-center gap-2 py-1 h-[45px] font-opensans font-semibold text-sm leading-[150%] bg-white text-[#7077FE] hover:bg-gray-50 relative ${
                              isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <span className="hidden sm:flex text-lg text-black">
                              {post.likes_count}
                            </span>
                            <ThumbsUp
                              className="w-5 h-5 md:w-6 md:h-6 shrink-0"
                              fill={post.is_liked ? "#7077FE" : "none"}
                              stroke={post.is_liked ? "#7077FE" : "#000"}
                            />

                            <span
                              className={`hidden sm:flex ${
                                post.is_liked ? "text-[#7077FE]" : "text-black"
                              }`}
                            >
                              Appreciate
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPostId(post.id);
                              setShowCommentBox(true);
                            }}
                            className={`flex items-center justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6  font-semibold text-sm md:text-base  hover:bg-gray-50 ${
                              selectedPostId === post.id
                                ? "text-[#7077FE]"
                                : "text-black"
                            }`}
                          >
                            <MessageSquare
                              className="w-5 h-5 md:w-6 md:h-6 filter transiton-all"
                              fill={
                                selectedPostId === post.id ? "#7077FE" : "none"
                              }
                              stroke={
                                selectedPostId === post.id ? "#7077FE" : "#000"
                              }
                            />{" "}
                            <span
                              className={`hidden sm:flex ${
                                selectedPostId === post.id
                                  ? "#7077FE"
                                  : "text-black"
                              }`}
                            >
                              Reflections
                            </span>
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(post.id, "share")}
                              className={`flex items-center w-full justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-semibold text-sm md:text-base hover:bg-gray-50 text-black`}
                            >
                              <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                              <span className="hidden sm:flex text-black">
                                Share
                              </span>
                            </button>
                            {openMenu.postId === post.id &&
                              openMenu.type === "share" && (
                                <div
                                  className="absolute top-10 sm:left-auto sm:right-0 mt-3 bg-white shadow-lg rounded-lg p-3 z-10"
                                  ref={shareMenuRef}
                                >
                                  <ul className="flex items-center gap-4">
                                    <li>
                                      <FacebookShareButton
                                        url={`${window.location.origin}/post/${post.id}`}
                                      >
                                        <FaFacebook size={32} color="#4267B2" />
                                      </FacebookShareButton>
                                    </li>
                                    <li>
                                      <LinkedinShareButton
                                        url={`${window.location.origin}/post/${post.id}`}
                                      >
                                        <FaLinkedin size={32} color="#0077B5" />
                                      </LinkedinShareButton>
                                    </li>
                                    <TwitterShareButton
                                      url={`${window.location.origin}/post/${post.id}`}
                                      title={tweetText}
                                    >
                                      <FaTwitter size={32} color="#1DA1F2" />
                                    </TwitterShareButton>
                                    <li>
                                      <WhatsappShareButton
                                        url={`${window.location.origin}/post/${post.id}`}
                                      >
                                        <FaWhatsapp size={32} color="#1DA1F2" />
                                      </WhatsappShareButton>
                                    </li>
                                    <li>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            `${window.location.origin}/social?p=${post.id}`
                                          );
                                          setCopy(true);
                                          setTimeout(
                                            () => setCopy(false),
                                            1500
                                          );
                                        }}
                                        className="flex items-center relative"
                                        title="Copy link"
                                      >
                                        <MdContentCopy
                                          size={30}
                                          className="text-gray-600"
                                        />
                                        {copy && (
                                          <div className="absolute w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all z-20">
                                            Link Copied!
                                          </div>
                                        )}
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );

                    return postElement;
                  })}

                  {/* Loading indicator for initial load */}
                  {isLoading && posts.length === 0 && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  )}

                  {/* Load More Button */}
                  {hasMore && posts.length > 0 && (
                    <div className="flex justify-center pt-6 mt-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="font-['Open_Sans'] px-6 py-3 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors bg-white"
                      >
                        {isLoadingMore ? "Loading..." : "Load More Posts"}
                      </button>
                    </div>
                  )}

                  {/* No more posts message */}
                  {!hasMore && posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                      You've reached the end of trending posts
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <Outlet />
        </div>

        {/* Topics rail (right) */}
        <aside className="hidden xl:block xl:sticky xl:top-4 self-start">
          <TopicsPanel />
        </aside>
      </div>

      {isTopicsOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeTopics}
        />
      )}
      <div
        className={`xl:hidden fixed right-0 top-0 h-full w-[85vw] max-w-[380px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isTopicsOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Trending topics"
      >
        <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">Trending Topics</span>
          </div>
          <button
            onClick={closeTopics}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          <TopicsPanel />
        </div>
      </div>

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
    </div>
  );
}