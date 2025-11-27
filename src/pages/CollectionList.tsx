import { useEffect, useRef, useState } from "react";
import { iconMap } from "../assets/icons";
import { ChevronLeft, ChevronRight, Flag, LinkIcon, MessageSquare, Share2, ThumbsUp, TrendingUp } from "lucide-react";
import { PostsLike, SendConnectionRequest, SendFollowRequest, UnsavePost } from "../Common/ServerAPI";
import CommentBox from "./CommentBox";
import like from "../assets/like.png";

import { MoreHorizontal, Bookmark } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import defaultProfile from "../assets/altprofile.png";
import { Link } from "react-router-dom";
import SharePopup from "../components/Social/SharePopup";

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
  };
}

interface MediaItem {
  type: "image" | "video";
  url: string;
}

const PostCarousel = ({ mediaItems }: { mediaItems: MediaItem[] }) => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mediaItems[current].type !== "video") {
        setCurrent((prev) => (prev + 1) % mediaItems.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [mediaItems.length, current]);

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
    <div className="relative w-full rounded-lg overflow-hidden">
      <div className="w-full aspect-video bg-black">
        {mediaItems.map((item, index) => (
          <div
            key={index}
            className={`w-full h-full transition-opacity duration-500 ${index === current ? "block" : "hidden"
              }`}
          >
            {item.type === "image" ? (
              <img
                src={item.url}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = iconMap["companycard1"];
                }}
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="w-full h-full object-cover"
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

      {mediaItems.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {mediaItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === current ? "bg-indigo-500" : "bg-gray-300"
                }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

const CollectionList = ({ items }: { items: any[] }) => {
  const CONTENT_LIMIT = 150;
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [openMenu, setOpenMenu] = useState<{ postId: string | null; type: string | null }>({ postId: null, type: null });
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(items);
  const [connectingUsers, setConnectingUsers] = useState<Record<string, boolean>>({});
  const [friendStatus, setFriendStatus] = useState<any>({});
  const menuRef = useRef<Record<string, HTMLDivElement | null>>({});
  const loggedInUserID = localStorage.getItem("Id");
  // const [copy, setCopy] = useState<Boolean>(false);
  const { showToast } = useToast();

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const toggleExpand = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const isVideoFile = (url: string): boolean => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
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

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUsers(prev => ({ ...prev, [userId]: true }));

      const response = await SendConnectionRequest(userId);
      if (response.success) {
        setFriendStatus((prev: any) => ({ ...prev, [userId]: "requested" }));

        showToast({
          type: "success",
          message: "Connection request sent successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      showToast({
        type: "error",
        message: "Failed to send connection request",
        duration: 2000,
      });
    } finally {
      setConnectingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getFriendStatus = (userId: string): string => {
    return friendStatus[userId] || "none";
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    const isOutsideAllMenus = Object.values(menuRef.current).every(
      ref => !ref?.contains(target)
    );

    if (isOutsideAllMenus) {
      setOpenMenu({ postId: null, type: null });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (postId: string, type: string) => {
    setOpenMenu(prev => ({
      postId: prev.postId === postId && prev.type === type ? null : postId,
      type: prev.postId === postId && prev.type === type ? null : type
    }));
  };

  // const myid = localStorage.getItem("Id");
  // const urldata = `https://dev.cness.io/directory/user-profile/${myid}`;

  const handleUnsave = async (postId: string) => {
    setCollectionItems(prevItems => prevItems.filter(item => item.originalData.id !== postId));
    setOpenMenu({ postId: null, type: null });
    const response = await UnsavePost(postId);
    if (response.success) {
      showToast({
        type: "success",
        message: "Post removed from collection!",
        duration: 2000,
      });
    }
  };

  const copyPostLink = (url: string, onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
    navigator.clipboard.writeText(url)
      .then(() => onSuccess("Link copied to clipboard!"))
      .catch(() => onError("Failed to copy link"));
  };

  const buildShareUrl = () => {
    return `${window.location.origin}/post/${selectedPostId}`;
  };

  return (
    <div className="space-y-4">
      {collectionItems.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md p-3 md:p-6 w-full mx-auto mt-4 md:mt-5">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to={`/dashboard/userprofile/${item.originalData.profile.user_id}`}
                className="shrink-0"
              >
                <img
                  src={
                    item.originalData.profile.profile_picture &&
                      item.originalData.profile.profile_picture !== "null" &&
                      item.originalData.profile.profile_picture !== "undefined" &&
                      item.originalData.profile.profile_picture.trim() !== ""
                      ? item.originalData.profile.profile_picture
                      : defaultProfile
                  }
                  alt={`${item.originalData.profile.first_name} ${item.originalData.profile.last_name}`}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultProfile;
                  }}
                />
              </Link>

              <div>
                <p className="font-semibold text-sm md:text-base text-black">
                  <Link
                    to={`/dashboard/userprofile/${item.originalData.profile.user_id}`}
                  >
                    {item.originalData.profile.first_name}{" "}
                    {item.originalData.profile.last_name}
                  </Link>
                  <span className="text-[#999999] text-xs md:text-[12px] font-light">
                    {" "}
                    <Link
                      to={`/dashboard/userprofile/${item.originalData.profile.user_id}`}
                    >
                      @{item.originalData.user.username}
                    </Link>
                  </span>
                </p>
                <p className="text-xs md:text-[12px] text-[#606060]">
                  {formatMessageTime(item.originalData.createdAt)}
                </p>
              </div>
            </div>

            {item.originalData.user.id !== loggedInUserID && (
              <div className="flex gap-2">
                {/* Connect Button */}
                <button
                  onClick={() => handleConnect(item.originalData.user.id)}
                  disabled={connectingUsers[item.originalData.user.id] || false}
                  className={`hidden lg:flex justify-center items-center gap-1 text-xs lg:text-sm px-3 py-1.5 rounded-full transition-colors font-family-open-sans h-[35px]
                    ${getFriendStatus(item.originalData.user.id) === "connected"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : getFriendStatus(item.originalData.user.id) === "requested"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-white text-black shadow-md"
                    }`}
                >
                  <span className="flex items-center gap-1 text-[#0B3449]">
                    <img
                      src={iconMap["userplus"]}
                      alt="userplus"
                      className="w-4 h-4"
                    />
                    {connectingUsers[item.originalData.user.id]
                      ? "Loading..."
                      : getFriendStatus(item.originalData.user.id) === "connected"
                        ? "Connected"
                        : getFriendStatus(item.originalData.user.id) === "requested"
                          ? "Requested"
                          : "Connect"}
                  </span>
                </button>

                {/* Follow Button */}
                <button
                  onClick={() => handleFollow(item.originalData.user.id)}
                  className={`flex w-[100px] justify-center items-center gap-1 text-xs lg:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full transition-colors
                    ${item.originalData.if_following
                      ? "bg-transparent text-[#7077FE] hover:text-[#7077FE]/80"
                      : "bg-[#7077FE] text-white hover:bg-indigo-600 h-[35px]"
                    }`}
                >
                  {item.originalData.if_following ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-[#7077FE]" />
                      Resonating
                    </>
                  ) : (
                    "+ Resonate"
                  )}
                </button>

                {/* Three Dots Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(item.originalData.id, "options")}
                    className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                    title="More options"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>

                  {openMenu.postId === item.originalData.id && openMenu.type === "options" && (
                    <div
                      className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                      ref={(el) => {
                        const key = `${item.originalData.id}-options`;
                        if (el) menuRef.current[key] = el;
                        else delete menuRef.current[key];
                      }}
                    >
                      <ul className="space-y-1">
                        <li className="lg:hidden">
                          <button
                            onClick={() => handleConnect(item.originalData.user.id)}
                            disabled={connectingUsers[item.originalData.user.id] || false}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                          >
                            <img
                              src={iconMap["userplus"]}
                              alt="userplus"
                              className="w-4 h-4"
                            />
                            {connectingUsers[item.originalData.user.id]
                              ? "Loading..."
                              : getFriendStatus(item.originalData.user.id) === "requested"
                                ? "Requested"
                                : "Connect"}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              copyPostLink(
                                `${window.location.origin}/post/${item.originalData.id}`,
                                (msg) => showToast({ type: "success", message: msg, duration: 2000 }),
                                (msg) => showToast({ type: "error", message: msg, duration: 2000 })
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
                            onClick={() => handleUnsave(item.originalData.id)}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                            Unsave Act
                          </button>
                        </li>
                        <li>
                          <button
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

            {item.originalData.user.id === loggedInUserID && (
              <div className="flex gap-2">
                {/* Three Dots Menu */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(item.originalData.id, "options")}
                    className="flex items-center border-[#ECEEF2] border shadow-sm justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
                    title="More options"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>

                  {openMenu.postId === item.originalData.id && openMenu.type === "options" && (
                    <div
                      className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                      ref={(el) => {
                        const key = `${item.originalData.id}-options`;
                        if (el) menuRef.current[key] = el;
                        else delete menuRef.current[key];
                      }}
                    >
                      <ul className="space-y-1">
                        <li>
                          <button
                            onClick={() => {
                              copyPostLink(
                                `${window.location.origin}/post/${item.originalData.id}`,
                                (msg) => showToast({ type: "success", message: msg, duration: 2000 }),
                                (msg) => showToast({ type: "error", message: msg, duration: 2000 })
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
                            onClick={() => handleUnsave(item.originalData.id)}
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
            <p className="text-gray-800 font-[poppins] text-sm md:text-base mb-2 md:mb-3">
              {expandedPosts[item.id] || !item.originalData.content || item.originalData.content.length <= CONTENT_LIMIT
                ? item.originalData.content
                : `${item.originalData.content.substring(0, CONTENT_LIMIT)}...`}
              {item.originalData.content && item.originalData.content.length > CONTENT_LIMIT && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
                >
                  {expandedPosts[item.id] ? "Show less" : "Read more"}
                </button>
              )}
            </p>

            {/* Dynamic Media Block */}
            {item.originalData.file && item.originalData.file !== "https://dev.cness.io/file/" && (
              <div className="rounded-lg overflow-hidden">
                {(() => {
                  const urls: string[] = item.originalData.file
                    .split(",")
                    .map((url: string) => url.trim());
                  const mediaItems: MediaItem[] = urls.map((url: string) => ({
                    url,
                    type: (isVideoFile(url) ? "video" : "image") as "video" | "image",
                  }));

                  if (mediaItems.length > 1) {
                    return <PostCarousel mediaItems={mediaItems} />;
                  }

                  const singleItem = mediaItems[0];
                  return singleItem.type === "video" ? (
                    <video
                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl"
                      controls
                      muted
                      autoPlay
                      loop
                    >
                      <source src={singleItem.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={singleItem.url}
                      alt="Post content"
                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-3xl mb-2"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = iconMap["companycard1"];
                      }}
                    />
                  );
                })()}
              </div>
            )}
          </div>

          {/* Reactions and Action Buttons */}
          <div className="flex justify-between items-center mt-6 px-1 text-xs md:text-sm text-gray-600 gap-2">
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
                  <span className="text-xs md:text-sm text-gray-500 pl-3 md:pl-5">
                    {item.originalData.likes_count}
                  </span>
                </div>
              </div>
            </div>
            {item.originalData.comments_count > 0 && (
              <div>
                <span className="text-sm text-[#64748B]">
                  {item.originalData.comments_count} Reflections
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-[#ECEEF2] pt-4 grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5">
            <button
              onClick={() => handleLike(item.originalData.id)}
              className={`flex items-center justify-center gap-2 py-1 h-[45px] font-opensans font-semibold text-sm leading-[150%] bg-white text-[#7077FE] hover:bg-gray-50`}
            >
              <ThumbsUp
                className="w-5 h-5 md:w-6 md:h-6 shrink-0"
                fill={item.originalData.is_liked ? "#7077FE" : "none"}
                stroke={item.originalData.is_liked ? "#7077FE" : "#000"}
              />
              <span
                className={`hidden sm:flex ${item.originalData.is_liked ? "text-[#7077FE]" : "text-black"
                  }`}
              >
                Appreciate
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedPostId(item.originalData.id);
                setShowCommentBox(true);
              }}
              className={`flex items-center justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-semibold text-sm md:text-base hover:bg-gray-50 ${selectedPostId === item.originalData.id
                ? "text-[#7077FE]"
                : "text-black"
                }`}
            >
              <MessageSquare
                className="w-5 h-5 md:w-6 md:h-6 filter transiton-all"
                fill={selectedPostId === item.originalData.id ? "#7077FE" : "none"}
                stroke={selectedPostId === item.originalData.id ? "#7077FE" : "#000"}
              />{" "}
              <span
                className={`hidden sm:flex ${selectedPostId === item.originalData.id ? "#7077FE" : "text-black"
                  }`}
              >
                Reflections
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => toggleMenu(item.originalData.id, "share")}
                className={`flex items-center w-full justify-center gap-2 md:gap-4 px-6 py-1 h-[45px] md:px-6 font-semibold text-sm md:text-base hover:bg-gray-50 text-black`}
              >
                <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden sm:flex text-black">
                  Share
                </span>
              </button>
              {openMenu.postId === item.originalData.id && openMenu.type === "share" && (
                <SharePopup
                  isOpen={true}
                  onClose={() => toggleMenu(item.originalData.id, "share")}
                  url={buildShareUrl()}
                  position="bottom"
                />
              )}
            </div>
          </div>
        </div>
      ))}

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
