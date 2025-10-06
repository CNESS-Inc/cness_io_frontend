import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import like from "../../../assets/sociallike.svg";
import StoryCard from "../../../components/Social/StoryCard";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  MoreHorizontal,
  Bookmark,
  Flag,
  Link as LinkIcon,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import { iconMap } from "../../../assets/icons";

import SignupModel from "../../OnBoarding/Signup";
import { CiCircleRemove } from "react-icons/ci";
import {
  AddStory,
  GetStory,
  MeDetails,
  GetFriendStatus,
  ReportPost,
  getAllTopics,
  GetPostsDetails,
  GetAllStory,
  FeedPostsDetails,
} from "../../../Common/ServerAPI";

import createstory from "../../../assets/createstory.jpg";
import carosuel1 from "../../../assets/carosuel1.png";
// import comment from "../../../assets/comment.png";
import Image from "../../../components/ui/Image";
import CommentBox from "../../../pages/CommentBox";
import { useToast } from "../../../components/ui/Toast/ToastProvider";
import FollowedUsersList from "../../../pages/FollowedUsersList";
import CollectionList from "../../../pages/CollectionList";
import SharePopup from "../../../components/Social/SharePopup";
import { buildShareUrl } from "../../../lib/utils";

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
    <div className="relative w-full overflow-visible ">
      {/* Media Container */}
      <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black">
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
        <div className="flex justify-center gap-1 mt-4 mb-4">
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

export default function SocialFeed() {
  const [showPopup, setShowPopup] = useState(false);
  const [showStoryPopup, setShowStoryPopup] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postMessage, setPostMessage] = useState("");
  const [_apiMessage] = useState<string | null>(null);
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
  const [expandedPosts] = useState<Record<string, boolean>>({});
  const [postVideoPreviewUrl, setPostVideoPreviewUrl] = useState<string | null>(
    null
  );
  // const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<{
    postId: string | null;
    type: "options" | "share" | null;
  }>({ postId: null, type: null });

  const [activeView] = useState<"posts" | "following" | "collection">("posts");
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [collectionItems] = useState<CollectionItem[]>([]);

  const [_isPostsLoading, setIsPostsLoading] = useState(false);
  const [isFollowingLoading] = useState(false);

  const [isCollectionLoading] = useState(false);
  const [storiesData, setStoriesData] = useState<Story[]>([]);
  console.log('storiesData', storiesData);
  // const [addNewPost, setAddNewPost] = useState(false)

  const [userInfo, setUserInfo] = useState<any>();
  // const [isAdult, setIsAdult] = useState<Boolean>(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [friendRequests, setFriendRequests] = useState<{
    [key: string]: string;
  }>({});

  const [connectingUsers] = useState<{
    [key: string]: boolean;
  }>({});

  const [showReportModal, setShowReportModal] = useState(false);

  const [selectedPostForReport, setSelectedPostForReport] = useState<
    string | null
  >(null);
  const [reportReason, setReportReason] = useState("");
  // const [isSavingPost, setIsSavingPost] = useState<string | null>(null);
  const [isReportingPost, setIsReportingPost] = useState<string | null>(null);
  const [openSignup, setOpenSignup] = useState(false);
  // const [wheelCount, setWheelCount] = useState(0);

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

  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loggedInUserID = localStorage.getItem("Id");
  const CONTENT_LIMIT = 150;

  useEffect(() => {
    // Reset wheel count on component mount (fresh start)
    sessionStorage.removeItem("wheelCount");
    sessionStorage.removeItem("signupShown");
    console.log("Reset wheel count and signup status");

    let scrollCount = 0;
    let lastScrollTime = 0;
    const SCROLL_THRESHOLD = 200; // Minimum time between scrolls in ms

    const checkAndShowSignup = () => {
      // Check if signup has already been shown in this session
      const hasShownSignup = sessionStorage.getItem("signupShown") === "true";

      if (hasShownSignup) {
        console.log("Signup already shown, ignoring");
        return false; // Don't do anything if already shown
      }

      console.log("Showing signup popup");
      setOpenSignup(true);
      sessionStorage.setItem("signupShown", "true");
      return true;
    };

    const handleWheel = () => {
      const now = Date.now();

      // Only count if enough time has passed since last scroll
      if (now - lastScrollTime > SCROLL_THRESHOLD) {
        scrollCount += 1;
        lastScrollTime = now;
        console.log("Wheel scroll count:", scrollCount);

        if (scrollCount >= 4) {
          console.log("Showing signup popup after 4 wheel scrolls");
          checkAndShowSignup();
        }
      } else {
        console.log("Wheel scroll too soon, ignoring (debounced)");
      }
    };

    const handleScroll = () => {
      // Calculate scroll percentage
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;

      console.log("Scroll position:", Math.round(scrollPercentage) + "%");

      // Show signup when user reaches 30% of scrollable content
      if (scrollPercentage >= 30) {
        console.log("Reached 30% scroll position, showing signup popup");
        checkAndShowSignup();
      }
    };

    // Add both event listeners
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getUserPosts = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setIsPostsLoading(true);
    try {
      // Call the API to get the posts for the current page
      let res;
      if (loggedInUserID) {
        // res = await PostsDetails(page);
        res = await FeedPostsDetails(page);
      } else {
        res = await GetPostsDetails(page);
      }

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

  useEffect(() => {
    if (loggedInUserID) {
      navigate("/dashboard/feed");
    } else {
      getUserPosts();
      fetchStory();
      fetchTopics();
      setTimeout(() => {
        setOpenSignup(true);
      }, 60000);
    }
  }, []);

  useEffect(() => {
    if (loggedInUserID) {
      if (userPosts.length > 0) {
        userPosts.forEach((post) => {
          if (post.user_id !== loggedInUserID) {
            checkFriendStatus(post.user_id);
          }
        });
      }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]); // Append new images to existing ones
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setPostVideoPreviewUrl(videoUrl);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
      let res;
      if (loggedInUserID) {
        res = await await GetStory();
      } else {
        res = await GetAllStory();
      }

      setStoriesData(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

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
      getUserPosts();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOpenSignup(true);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

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
        // setIsAdult(false);
        return;
      }

      const dob = new Date(dobString);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
    } catch (error) {
      console.error("Error fetching me details:", error);
      // setIsAdult(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsPostsLoading(true);
      setIsPostsLoading(false);
    };

    if (loggedInUserID) {
      fetchInitialData();
      MeDetail();
    }
  }, []);

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

  useEffect(() => {
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

  const fetchTopics = async () => {
    try {
      const response = await getAllTopics();
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

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-2 px-2 md:px-2 lg:px-0 w-full">
        {/* Left Side: Post & Stories - Full width on mobile */}
        <div className="w-full lg:max-w-[75%]" ref={containerRef}>
          {activeView === "posts" ? (
            <>
              {/* Start a Post */}
              <div className="bg-gradient-to-r from-[#7077fe36] to-[#f07eff21] p-4 md:p-6 rounded-xl mb-4 md:mb-5">
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        localStorage.getItem("profile_picture") || createstory
                      }
                      alt="User"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Create a Conscious Act"
                      className="flex-1 cursor-pointer px-3 py-1 md:px-4 md:py-2 rounded-full border border-gray-300 text-sm md:text-[16px] focus:outline-none bg-white"
                      onClick={() => setOpenSignup(true)}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-between md:justify-center md:gap-10 text-xs md:text-[15px] text-gray-700 mt-2 md:mt-3">
                    <button
                      className="flex items-center gap-1 md:gap-2"
                      onClick={() => setOpenSignup(true)}
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
                      onClick={() => setOpenSignup(true)}
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
                  </div>
                </div>
              </div>

              {/* Story Strip Wrapper */}
              <h4 className="font-medium">Reflections</h4>
              <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory mt-3 md:mt-4">
                {/* Create Story Card */}
                <div
                  onClick={() => setOpenSignup(true)}
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
                    <div className="w-9 h-9 md:w-12 md:h-12 bg-white text-[#7C81FF] font-semibold rounded-full flex items-center justify-center text-xl  border-5">
                      <img
                        src={iconMap["storyplus"]}
                        alt="storyplus"
                        className="w-4 h-4 transition duration-200 group-hover:brightness-0 group-hover:invert"
                      />
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
                    className="w-[140px] h-[190px] md:w-[162px] md:h-[214px] snap-start shrink-0 rounded-[12px] overflow-hidden relative mohan"
                    onClick={() => setOpenSignup(true)}
                  >
                    <StoryCard
                      id={story.id}
                      userIcon={story.profile.profile_picture}
                      userName={`${story.profile.first_name} ${story.profile.last_name}`}
                      title={story.stories[0].description || "Untitled Story"}
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

              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-md p-3 md:p-4 w-full mx-auto mt-4 md:mt-5"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Link to={`/dashboard/userprofile/${post?.profile?.id}`}>
                        <img
                          src={
                            post.profile.profile_picture
                              ? post.profile.profile_picture
                              : "/profile.png"
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
                        <p className="font-semibold text-sm md:text-base text-gray-800">
                          <Link
                            to={`/dashboard/userprofile/${post?.profile?.id}`}
                          >
                            {" "}
                            {post.profile.first_name} {post.profile.last_name}
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
                        <p className="text-xs md:text-[12px] text-[#606060]">
                          {formatMessageTime(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    {post.user_id !== loggedInUserID && (
                      <div className="flex gap-2">
                        {/* Connect Button */}
                        <button
                          onClick={() => setOpenSignup(true)}
                          disabled={connectingUsers[post.user_id] || false}
                          className={`flex w-[100px] justify-center items-center gap-1 text-[12px] md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors font-family-open-sans h-[35px]
                                ${
                                  // getFriendStatus(post.user_id) === "connected"
                                  //   ? "bg-red-500 text-white hover:bg-red-600"
                                  //   :
                                  getFriendStatus(post.user_id) === "requested"
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-white text-black shadow-md"
                                }`}
                        >
                          <img
                            src={iconMap["userplus"]}
                            alt="userplus"
                            className="w-4 h-4"
                          />
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
                          onClick={() => setOpenSignup(true)}
                          className={`flex w-[100px] justify-center items-center gap-1 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors
                                ${
                                  post.if_following
                                    ? "bg-transparent text-blue-500 hover:text-blue-600"
                                    : "bg-[#7C81FF] text-white hover:bg-indigo-600"
                                }`}
                        >
                          {post.if_following ? (
                            <>
                              <TrendingUp className="w-5 h-5" /> Resonating
                            </>
                          ) : (
                            "+ Resonate"
                          )}
                        </button>

                        {/* Three Dots Menu */}
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(post.id, "options")}
                            className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-[8px] hover:bg-gray-100 transition-colors"
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
                                      onClick={() => setOpenSignup(true)}
                                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                      Copy Act Link
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => setOpenSignup(true)}
                                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                    >
                                      <Bookmark className="w-4 h-4" />
                                      {post.is_saved ? "Unsave" : "Save Act"}
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => setOpenSignup(true)}
                                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                      <Flag className="w-4 h-4" />
                                      Report Act
                                    </button>
                                  </li>
                                  {getFriendStatus(post.user_id) ===
                                    "connected" && (
                                    <li>
                                      <button
                                        onClick={() => setOpenSignup(true)}
                                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                      >
                                        <CiCircleRemove className="w-4 h-4 text-black" />
                                        Remove Connection
                                      </button>
                                    </li>
                                  )}
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
                            className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-[8px] hover:bg-gray-100 transition-colors"
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
                                      onClick={() => setOpenSignup(true)}
                                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                      Copy Post Link
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      onClick={() => setOpenSignup(true)}
                                      className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                                    >
                                      <Bookmark className="w-4 h-4" />
                                      {post.is_saved ? "Unsave" : "Save Post"}
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
                        : `${post?.content?.substring(0, CONTENT_LIMIT)}...`}
                      {post?.content?.length > CONTENT_LIMIT && (
                        <button
                          onClick={() => setOpenSignup(true)}
                          className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
                        >
                          {expandedPosts[post.id] ? "Show less" : "Read more"}
                        </button>
                      )}
                    </p>

                    {/* Dynamic Media Block */}
                    {post.file && (
                      <div className="rounded-lg">
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
                              alt="Home Icon"
                              className="w-8 h-8 transition duration-200 group-hover:brightness-0 group-hover:invert"
                            />
                          </div>

                          <span className="text-[14px] text-[#64748B] pl-3 md:pl-5">
                            {post.likes_count}
                          </span>
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                              <img
                                src={comment}
                                alt="Comment"
                                className="w-6 h-6 md:w-8 md:h-8"
                              />
                            </div>
                            <span>{post.comments_count}</span>
                          </div> */}
                    </div>
                    {post.comments_count > 0 && (
                      <div>
                        <span className="text-sm text-[#64748B]">
                          {post.comments_count} Reflections Thread
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5 border-t border-[#ECEEF2] py-4">
                    <button
                      onClick={() => setOpenSignup(true)}
                      disabled={isLoading}
                      className={`flex items-center justify-center gap-2 py-1 h-[45px] font-opensans font-normal text-sm md:text-base leading-[150%] rounded-md bg-white text-[#7077FE] hover:bg-gray-50 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <ThumbsUp
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill={post.is_liked ? "#7077FE" : "none"} // <-- condition here
                        stroke={post.is_liked ? "#7077FE" : "#000"} // keeps border visible
                      />
                      <span
                        className={`${
                          post.is_liked ? "#7077FE" : "text-black"
                        }`}
                      >
                        {" "}
                        Appreciate
                      </span>
                    </button>
                    <button
                      onClick={() => setOpenSignup(true)}
                      className="flex items-center justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6  font-normal text-sm md:text-base rounded-md hover:bg-gray-50"
                    >
                      <MessageSquare
                        className="w-5 h-5 md:w-6 md:h-6 filter transiton-all"
                        fill={selectedPostId === post.id ? "#7077FE" : "none"}
                        stroke={selectedPostId === post.id ? "#7077FE" : "#000"}
                      />{" "}
                      <span
                        className={`${
                          selectedPostId === post.id ? "#7077FE" : "text-black"
                        }`}
                      >
                        Reflections
                      </span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setOpenSignup(true)}
                        className="flex items-center w-full justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-normal text-sm md:text-base rounded-md hover:bg-gray-50 text-black"
                      >
                        <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-black">Share</span>
                      </button>
                      {openMenu.postId === post.id &&
                        openMenu.type === "share" && (
                          <SharePopup
                            isOpen={true}
                            onClose={() => navigate("/log-in")}
                            url={buildShareUrl()} // or pass your own URL if needed
                            position="bottom"
                          />
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : activeView === "following" ? (
            <div className="bg-white rounded-xl shadow-md p-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  People You Follow
                </h3>
                <button
                  onClick={() => setOpenSignup(true)}
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
                  onClick={() => setOpenSignup(true)}
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
          <button
            className="mt-10 mb-10 w-[214px] h-[45px] bg-[#20B9EB] text-white rounded-[100px] mx-auto block"
            onClick={() => setOpenSignup(true)}
          >
            Show more result
          </button>
        </div>

        {/* Right Sidebar Container */}
        <div className="w-full lg:w-[25%] flex flex-col gap-4">
          {/* Quick Actions */}
          <div className="w-full h-fit bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm">
            <h3 className="text-black flex items-center gap-2 font-semibold text-base md:text-lg mb-3 md:mb-4 px-4">
              <img
                src={iconMap["socialtrending"]}
                alt="Home Icon"
                className="w-7 h-7 transition duration-200 group-hover:brightness-0 group-hover:invert"
              />{" "}
              Trending Topics
            </h3>
            <div className="w-full border-t border-[#C8C8C8] my-4"></div>
            <ul className="space-y-4 text-sm md:text-[15px] text-gray-700 px-4">
              {/* Replace with actual trending topics */}
              {topics.map((topic, index) => (
                <li
                  key={index}
                  onClick={() => setOpenSignup(true)}
                  className="flex items-center gap-2 hover:text-purple-700 cursor-pointer"
                >
                  {index + 1}. #{topic.topic_name}
                </li>
              ))}
              {topics?.length === 0 && (
                <button disabled className="text-gray-400 italic">
                  No Trending topics available
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
                      onClick={() => setOpenSignup(true)}
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
                    {topics.length > 0 && <option value={999999}>Other</option>}
                  </select>

                  <button
                    onClick={() => setOpenSignup(true)}
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
                  onClick={() => setOpenSignup(true)}
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
                        <span className="text-black text-sm">Select Video</span>
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
      </div>

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

      {/* Register popup */}
      {/*
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
        <form onSubmit={handleRegisterSubmit} className="flex items-center justify-center">
          <div className="w-6/12">
            <Image src="/registerwelcome.png" alt="registerwelcome" width={'100%'} height={'650px'} className="object-contain rounded-0" />
          </div>
          <div className="w-6/12 relative pl-8">
            <h2 className="text-2xl font-bold text-center text-gray-900">Create a Free Account</h2>
            <p className="text-sm text-gray-500 text-center mt-1">✓ Forever free plan &nbsp; ✓ Setup in minutes</p>
            <button 
            type="button"
            onClick={() => {
              login();
              navigate("/log-in", {
                state: { autoGoogleLogin: true },
              });
            }}
            className="mt-6 w-full flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition">
              <img
                src="/google-icon-logo.svg"  alt="Google" className="h-5 w-5 mr-2"
              /> Register with Google
            </button>
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-sm text-gray-500">Or sign up with</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                placeholder="Username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" 
                required
              />
            </div>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>
          
            <div className="flex justify-between">
              <div className="mb-4 w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Type your password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="mb-4 w-[48%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Re-type Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Re-type your password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0 mb-4">
              Password must be at least 8 characters with uppercase, number, and special character
            </p>
            <div className="flex flex-col gap-2 justify-between ">
              <div className="mb-4 w-[100%]">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral code (optional)</label>
                <input
                  type="text"
                  name="referralCode"
                  value={registerForm.referralCode}
                  onChange={handleRegisterChange}
                  placeholder="Enter your referral code"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="mb-6 w-[100%]">
                <div className="w-full h-16 rounded-md flex items-center justify-center  text-gray-500">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    style={{ width: '100%' }}
                  />
                  {errors.recaptcha && (
                    <p className="mt-1 text-sm text-red-600">{errors.recaptcha}</p>
                  )}
                </div>
              </div>
            </div>
            {registerError && (
              <p className="text-sm text-red-600 mb-2">{registerError}</p>
            )}
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden cursor-pointer bg-gradient-to-r from-[#7077FE] to-[#F07EFF] hover:from-[#7077FE] hover:to-[#7077FE] text-white relative flex items-center gap-2 font-[Poppins] font-medium text-[15px] leading-5 flex justify-center rounded-[100px] py-3 px-10 self-stretch transition-colors duration-500 ease-in-out"
              disabled={registerLoading || !recaptchaValue}
            >
              {registerLoading ? "Signing Up..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/log-in" className="text-purple-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </form>
      </RegisterModal>
      */}

      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </>
  );
}
