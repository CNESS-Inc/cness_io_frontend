import { useEffect, useRef, useState } from "react";
import { iconMap } from "../assets/icons";
import { ChevronLeft, ChevronRight, Flag, LinkIcon, MessageSquare, Share2, ThumbsUp, MoreHorizontal, Bookmark, UserRoundPlus } from "lucide-react";
import { PostsLike, SendFriendRequest, UnFriend, SendFollowRequest, UnsavePost } from "../Common/ServerAPI";
import CommentBox from "./CommentBox";
import { useToast } from "../components/ui/Toast/ToastProvider";
import defaultProfile from "../assets/altprofile.png";
import { Link } from "react-router-dom";
import { IoTrendingUpSharp } from "react-icons/io5";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  originalData: {
    if_following: any;
    id: string;
    content: string;
    file: string;
    file_type: string | null;
    createdAt: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    profile: {
      user_id: any;
      first_name: string;
      last_name: string;
      profile_picture: string;
    };
    user: {
      username: string;
      id: string;
    };
    is_friend?: boolean;
    friend_request_status?: string;
    if_friend?: boolean;
    is_requested?: boolean;
    is_saved?: boolean;
  };
}

interface MediaItem {
  type: "image" | "video";
  url: string;
}

const CONTENT_LIMIT = 150;

// PostCarousel component (same as in Topic)
const PostCarousel = ({ mediaItems }: { mediaItems: MediaItem[] }) => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Auto slide every 3 seconds (only for images)
  useEffect(() => {
    const interval = setInterval(() => {
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
      <div className="w-full aspect-video rounded-3xl bg-black">
        {mediaItems.map((mediaItem, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ${
              index === current ? "block" : "hidden"
            }`}
          >
            {mediaItem.type === "image" ? (
              <img
                src={mediaItem.url}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover rounded-3xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = iconMap["companycard1"] || "/default-image.png";
                }}
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
                <source src={mediaItem.url} type="video/mp4" />
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
};

const CollectionList = ({ items }: { items: any[] }) => {
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [openMenu, setOpenMenu] = useState<{
    postId: string | null;
    type: "options" | "share" | null;
  }>({ postId: null, type: null });
  const [copy, setCopy] = useState<boolean>(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(items);
  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const loggedInUserID = localStorage.getItem("Id");
  const { showToast } = useToast();

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

  const isVideoFile = (url: string) => {
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
              // You might want to adjust this navigation based on your routes
              window.location.href = `/dashboard/feed/search?tag=${encodeURIComponent(tag)}`
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

  const handleLike = async (postId: string) => {
    try {
      const formattedData = { post_id: postId };
      await PostsLike(formattedData);

      setCollectionItems(prevItems =>
        prevItems.map(item =>
          item.originalData.id === postId
            ? {
              ...item,
              originalData: {
                ...item.originalData,
                is_liked: !item.originalData.is_liked,
                likes_count: item.originalData.is_liked
                  ? item.originalData.likes_count - 1
                  : item.originalData.likes_count + 1,
              },
            }
            : item
        )
      );
    } catch (error) {
      console.error("Error handling like:", error);
      showToast({
        type: "error",
        message: "Failed to like post",
        duration: 2000,
      });
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      const response: any = await SendFollowRequest(formattedData);
      if (response.success) {
        setCollectionItems(prevItems =>
          prevItems.map(item =>
            item.originalData.user.id === userId
              ? {
                ...item,
                originalData: {
                  ...item.originalData,
                  if_following: !item.originalData.if_following,
                },
              }
              : item
          )
        );

        showToast({
          type: "success",
          message: response.message || "Follow status updated",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error following user:", error);
      showToast({
        type: "error",
        message: "Failed to update follow status",
        duration: 2000,
      });
    }
  };

// In your handleConnect function in CollectionList.tsx, update the state updates:

const handleConnect = async (userId: string) => {
  try {
    // Find the post in collection items
    const post = collectionItems.find(item => item.originalData.user.id === userId)?.originalData;
    if (!post) return;

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
        message: res?.success?.message || "Connection request sent",
        type: "success",
        duration: 2000,
      });

      // Update the collection item - use undefined instead of null
      setCollectionItems(prevItems =>
        prevItems.map(item =>
          item.originalData.user.id === userId
            ? {
              ...item,
              originalData: {
                ...item.originalData,
                if_friend: false,
                friend_request_status: "PENDING",
                is_requested: true,
              } as any, // Use type assertion to handle the property mismatch
            }
            : item
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
        message: res?.success?.message || "Connection request cancelled",
        type: "success",
        duration: 2000,
      });

      setCollectionItems(prevItems =>
        prevItems.map(item =>
          item.originalData.user.id === userId
            ? {
              ...item,
              originalData: {
                ...item.originalData,
                if_friend: false,
                friend_request_status: undefined, // Use undefined instead of null
                is_requested: false,
              } as any,
            }
            : item
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
        message: res?.success?.message || "Connection removed",
        type: "success",
        duration: 2000,
      });

      setCollectionItems(prevItems =>
        prevItems.map(item =>
          item.originalData.user.id === userId
            ? {
              ...item,
              originalData: {
                ...item.originalData,
                if_friend: false,
                friend_request_status: undefined, // Use undefined instead of null
                is_requested: false,
              } as any,
            }
            : item
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

// Also update the getConnectionStatus function to handle undefined:
const getConnectionStatus = (post: any) => {
  if (post.if_friend && post.friend_request_status === "ACCEPT") {
    return "Connected";
  } else if (!post.if_friend && post.friend_request_status === "PENDING") {
    return "Requested";
  } else if (post.is_requested) {
    return "Requested";
  } else {
    return "Connect";
  }
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

  const toggleMenu = (postId: string, type: "options" | "share") => {
    setOpenMenu((prev) => {
      if (prev.postId === postId && prev.type === type) {
        return { postId: null, type: null }; // close
      } else {
        return { postId, type }; // open
      }
    });
  };

  const copyPostLink = (url: string, onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
    navigator.clipboard.writeText(url)
      .then(() => onSuccess("Link copied to clipboard!"))
      .catch(() => onError("Failed to copy link"));
  };

  const handleUnsave = async (postId: string) => {
    try {
      const response = await UnsavePost(postId);
      if (response.success) {
        setCollectionItems(prevItems => prevItems.filter(item => item.originalData.id !== postId));
        setOpenMenu({ postId: null, type: null });
        showToast({
          type: "success",
          message: "Post removed from collection!",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
      showToast({
        type: "error",
        message: "Failed to remove post from collection",
        duration: 2000,
      });
    }
  };

  const tweetText = `Check out this post from CNESS!`;

  return (
    <div className="w-full px-0.5 md:px-0.1 py-1">
      <div className="space-y-5">
        {collectionItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No posts found in collection
          </div>
        ) : (
          <>
            {collectionItems.map((collectionItem) => (
              <div
                key={collectionItem.id}
                className="bg-white rounded-xl shadow-md p-3 md:p-4 w-full mx-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Link
                      to={`/dashboard/userprofile/${collectionItem.originalData.profile.user_id}`}
                    >
                      <img
                        src={
                          !collectionItem.originalData.profile.profile_picture ||
                            collectionItem.originalData.profile.profile_picture === "null" ||
                            collectionItem.originalData.profile.profile_picture ===
                            "undefined" ||
                            !collectionItem.originalData.profile.profile_picture.startsWith(
                              "http"
                            )
                            ? defaultProfile
                            : collectionItem.originalData.profile.profile_picture
                        }
                        className="w-8 h-8 md:w-[63px] md:h-[63px] rounded-full"
                        alt="User"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultProfile;
                        }}
                      />
                    </Link>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-black">
                        <Link
                          to={`/dashboard/userprofile/${collectionItem.originalData.profile.user_id}`}
                        >
                          {" "}
                          {collectionItem.originalData.profile.first_name}{" "}
                          {collectionItem.originalData.profile.last_name}
                        </Link>
                        <span className="text-[#999999] text-xs md:text-[12px] font-light">
                          {" "}
                          <Link
                            to={`/dashboard/userprofile/${collectionItem.originalData.profile.user_id}`}
                          >
                            {" "}
                            @{collectionItem.originalData.user.username}
                          </Link>
                        </span>
                      </p>
                      <p className="text-xs md:text-[12px] text-[#606060]">
                        {formatMessageTime(collectionItem.originalData.createdAt)}
                      </p>
                    </div>
                  </div>
                  {collectionItem.originalData.user.id !== loggedInUserID && (
                    <div className="flex gap-2">
                      {/* Connect Button */}
                      <button
                        onClick={() => handleConnect(collectionItem.originalData.user.id)}
                        className={`hidden lg:flex justify-center items-center gap-1 text-xs lg:text-sm px-3 py-1.5 rounded-full transition-colors font-family-open-sans h-[35px] min-w-[100px] ${
                          collectionItem.originalData.if_friend &&
                          collectionItem.originalData.friend_request_status === "ACCEPT"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : !collectionItem.originalData.if_friend &&
                              collectionItem.originalData.friend_request_status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                            : "bg-white text-black border border-gray-200"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <UserRoundPlus className="w-4 h-4" />
                          {getConnectionStatus(collectionItem.originalData)}
                        </span>
                      </button>
                      {/* Follow Button */}
                      <button
                        onClick={() => handleFollow(collectionItem.originalData.user.id)}
                        className={`flex justify-center items-center gap-1 text-xs lg:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors h-[35px]
                            ${
                          collectionItem.originalData.if_following
                            ? "bg-[#7077FE] text-white hover:bg-indigo-600"
                            : "bg-[#7077FE] text-white hover:bg-indigo-600"
                          }`}
                      >
                        {collectionItem.originalData.if_following ? (
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
                          onClick={() =>
                            toggleMenu(collectionItem.originalData.id, "options")
                          }
                          className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>

                        {openMenu.postId === collectionItem.originalData.id &&
                          openMenu.type === "options" && (
                            <div
                              className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                              ref={(el) => {
                                const key = `${collectionItem.originalData.id}-options`;
                                if (el) menuRef.current[key] = el;
                                else delete menuRef.current[key];
                              }}
                            >
                              <ul className="space-y-1">
                                <li className="lg:hidden">
                                  <button
                                    onClick={() =>
                                      handleConnect(collectionItem.originalData.user.id)
                                    }
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    <UserRoundPlus className="w-4 h-4" />
                                    {getConnectionStatus(collectionItem.originalData)}
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      copyPostLink(
                                        `${window.location.origin}/social?p=${collectionItem.originalData.id}`,
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
                                    onClick={() => handleUnsave(collectionItem.originalData.id)}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    <Bookmark className="w-4 h-4" />
                                    Unsave Act
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    onClick={() => {
                                      // Add report functionality here
                                      showToast({
                                        type: "info",
                                        message: "Report functionality to be implemented",
                                        duration: 2000,
                                      });
                                    }}
                                  >
                                    <Flag className="w-4 h-4" />
                                    Report Act
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {collectionItem.originalData.user.id == loggedInUserID && (
                    <div className="flex gap-2">
                      {/* Three Dots Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            toggleMenu(collectionItem.originalData.id, "options")
                          }
                          className="flex items-center border-[#ECEEF2] border shadow-sm justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>

                        {openMenu.postId === collectionItem.originalData.id &&
                          openMenu.type === "options" && (
                            <div
                              className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                              ref={(el) => {
                                const key = `${collectionItem.originalData.id}-options`;
                                if (el) menuRef.current[key] = el;
                                else delete menuRef.current[key];
                              }}
                            >
                              <ul className="space-y-1">
                                <li>
                                  <button
                                    onClick={() => {
                                      copyPostLink(
                                        `${window.location.origin}/post/${collectionItem.originalData.id}`,
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
                                    onClick={() => handleUnsave(collectionItem.originalData.id)}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    <Bookmark className="w-4 h-4" />
                                    Unsave Post
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
                      {expandedPosts[collectionItem.id] ||
                        collectionItem.originalData.content?.length <= CONTENT_LIMIT
                        ? renderContentWithHashtags(
                          collectionItem.originalData.content || ""
                        )
                        : renderContentWithHashtags(
                          `${collectionItem.originalData.content?.substring(
                            0,
                            CONTENT_LIMIT
                          )}...`
                        )}
                    </span>
                    {collectionItem.originalData.content?.length > CONTENT_LIMIT && (
                      <button
                        onClick={() => toggleExpand(collectionItem.id)}
                        className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
                      >
                        {expandedPosts[collectionItem.id]
                          ? "Show less"
                          : "Read more"}
                      </button>
                    )}
                  </p>

                  {/* Dynamic Media Block */}
                  {collectionItem.originalData.file && (
                    <div className="rounded-lg">
                      {(() => {
                        // Split and filter valid URLs
                        const urls = collectionItem.originalData.file
                          .split(",")
                          .map((url: string) => url.trim())
                          .filter((url: string) => isValidMediaUrl(url)); // Filter out invalid URLs

                        // If no valid media URLs after filtering, don't render anything
                        if (urls.length === 0) {
                          return null;
                        }

                        const mediaItems = urls.map((url: string) => ({
                          url,
                          type: (isVideoFile(url) ? "video" : "image") as
                            | "video"
                            | "image",
                        }));

                        // Use PostCarousel if there are multiple items
                        if (mediaItems.length > 1) {
                          return (
                            <PostCarousel mediaItems={mediaItems} />
                          );
                        }

                        // Single item rendering
                        const singleMediaItem = mediaItems[0];
                        const mediaContent =
                          singleMediaItem.type === "video" ? (
                            <video
                              className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl"
                              controls
                              muted
                              autoPlay
                              loop
                            >
                              <source src={singleMediaItem.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={singleMediaItem.url}
                              alt="Post content"
                              className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl mb-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = iconMap["companycard1"] || "/default-image.png";
                              }}
                            />
                          );

                        return mediaContent;
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
                  {collectionItem.originalData.comments_count > 0 && (
                    <div>
                      <span className="text-sm text-[#64748B]">
                        {collectionItem.originalData.comments_count} Reflections
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#ECEEF2] grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5">
                  <button
                    onClick={() => handleLike(collectionItem.originalData.id)}
                    className={`flex items-center justify-center gap-2 py-1 h-[45px] font-opensans font-semibold text-sm leading-[150%] bg-white text-[#7077FE] hover:bg-gray-50`}
                  >
                    <span className="hidden sm:flex text-lg text-black">
                      {collectionItem.originalData.likes_count}
                    </span>
                    <ThumbsUp
                      className="w-5 h-5 md:w-6 md:h-6 shrink-0"
                      fill={collectionItem.originalData.is_liked ? "#7077FE" : "none"}
                      stroke={collectionItem.originalData.is_liked ? "#7077FE" : "#000"}
                    />

                    <span
                      className={`hidden sm:flex ${
                        collectionItem.originalData.is_liked
                          ? "text-[#7077FE]"
                          : "text-black"
                        }`}
                    >
                      Appreciate
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPostId(collectionItem.originalData.id);
                      setShowCommentBox(true);
                    }}
                    className={`flex items-center justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-semibold text-sm md:text-base hover:bg-gray-50 ${
                      selectedPostId === collectionItem.originalData.id
                        ? "text-[#7077FE]"
                        : "text-black"
                      }`}
                  >
                    <MessageSquare
                      className="w-5 h-5 md:w-6 md:h-6 filter transiton-all"
                      fill={
                        selectedPostId === collectionItem.originalData.id
                          ? "#7077FE"
                          : "none"
                      }
                      stroke={
                        selectedPostId === collectionItem.originalData.id
                          ? "#7077FE"
                          : "#000"
                      }
                    />{" "}
                    <span
                      className={`hidden sm:flex ${
                        selectedPostId === collectionItem.originalData.id
                          ? "#7077FE"
                          : "text-black"
                        }`}
                    >
                      Reflections
                    </span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(collectionItem.originalData.id, "share")}
                      className={`flex items-center w-full justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-semibold text-sm md:text-base hover:bg-gray-50 text-black`}
                    >
                      <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="hidden sm:flex text-black">
                        Share
                      </span>
                    </button>
                    {openMenu.postId === collectionItem.originalData.id &&
                      openMenu.type === "share" && (
                        <div
                          className="absolute top-10 sm:left-auto sm:right-0 mt-3 bg-white shadow-lg rounded-lg p-3 z-10"
                          ref={shareMenuRef}
                        >
                          <ul className="flex items-center gap-4">
                            <li>
                              <FacebookShareButton
                                url={`${window.location.origin}/post/${collectionItem.originalData.id}`}
                              >
                                <FaFacebook size={32} color="#4267B2" />
                              </FacebookShareButton>
                            </li>
                            <li>
                              <LinkedinShareButton
                                url={`${window.location.origin}/post/${collectionItem.originalData.id}`}
                              >
                                <FaLinkedin size={32} color="#0077B5" />
                              </LinkedinShareButton>
                            </li>
                            <TwitterShareButton
                              url={`${window.location.origin}/post/${collectionItem.originalData.id}`}
                              title={tweetText}
                            >
                              <FaTwitter size={32} color="#1DA1F2" />
                            </TwitterShareButton>
                            <li>
                              <WhatsappShareButton
                                url={`${window.location.origin}/post/${collectionItem.originalData.id}`}
                              >
                                <FaWhatsapp size={32} color="#1DA1F2" />
                              </WhatsappShareButton>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/post/${collectionItem.originalData.id}`
                                  );
                                  setCopy(true);
                                  setTimeout(() => setCopy(false), 1500);
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
            ))}
          </>
        )}
      </div>
      {showCommentBox && selectedPostId && (
        <CommentBox
          postId={selectedPostId}
          onClose={() => {
            setShowCommentBox(false);
            setSelectedPostId(null);
          }}
          onCommentAdded={() =>
            setCollectionItems(prevItems => prevItems.map(item => item.originalData.id === selectedPostId
              ? {
                ...item,
                originalData: {
                  ...item.originalData,
                  comments_count: item.originalData.comments_count + 1,
                },
              }
              : item
            )
            )}
        />
      )}
    </div>
  );
};

export default CollectionList;