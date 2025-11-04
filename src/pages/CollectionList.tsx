import { useEffect, useRef, useState } from "react";
import { iconMap } from "../assets/icons";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { MdContentCopy } from "react-icons/md";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { PostsLike, UnsavePost } from "../Common/ServerAPI";
import CommentBox from "./CommentBox";
import like from "../assets/like.png";
import Like1 from "../assets/Like1.png";
import comment from "../assets/comment.png";
import comment1 from "../assets/comment1.png";

import { MoreHorizontal, Bookmark } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import defaultProfile from "../assets/altprofile.png";

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

const CollectionList = ({ items }: { items: CollectionItem[] }) => {
  const CONTENT_LIMIT = 150;
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(items);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const loggedInUserID = localStorage.getItem("Id");
  const [copy, setCopy] = useState<Boolean>(false);

  const [openActionMenuPostId, setOpenActionMenuPostId] = useState<string | null>(null); // for three dots
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

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
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuPostId(null);
    }
    if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
      setOpenActionMenuPostId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (postId: string) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const myid = localStorage.getItem("Id");
  const urldata = `https://dev.cness.io/directory/user-profile/${myid}`;

  const handleUnsave = async (postId: string) => {
    setCollectionItems(prevItems => prevItems.filter(item => item.originalData.id !== postId));
    setOpenActionMenuPostId(null);
    const response =  await UnsavePost(postId);
    if (response.success) {
        showToast({
          type: "success",
          message: "Post removed from collection!",
          duration: 2000,
        });
    }
  };

  return (
    <div className="space-y-4">
      {collectionItems.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md p-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3">
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
              <div>
                <p className="font-semibold text-sm md:text-base text-gray-800">
                  {item.originalData.profile.first_name} {item.originalData.profile.last_name}
                  <span className="text-gray-500 text-xs md:text-sm">
                    {" "}
                    @{item.originalData.user.username}
                  </span>
                </p>
                <p className="text-xs md:text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setOpenActionMenuPostId(item.originalData.id)}
                className="flex items-center justify-center border-[#ECEEF2] border shadow-sm w-8 h-8 rounded-[8px] hover:bg-gray-100 transition-colors"
                title="More options"
              >
                <MoreHorizontal size={20} />
              </button>
              {openActionMenuPostId === item.originalData.id && (
                <div
                  className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-50 min-w-[180px]"
                  ref={actionMenuRef}
                >
                  <ul className="space-y-1">
                    <li>
                      <button
                        onClick={() => handleUnsave(item.originalData.id)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                      >
                      <Bookmark className="w-4 h-4" /> Unsave
                      </button>
                    </li>
                  </ul>
                  
                </div>
              )}
            </div>
            {item.originalData.user.id !== loggedInUserID && (
              <button
                className={`text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white`}
              >
                Follow
              </button>
            )}
            
          </div>

          {/* Post Content */}
          <div className="mt-3 md:mt-4">
            <p className="text-gray-800 text-sm md:text-base mb-2 md:mb-3">
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
                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-lg"
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
                      className="w-full max-h-[300px] md:max-h-[400px] object-cover rounded-lg mb-2"
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
          <div className="flex justify-between items-center mt-3 px-1 text-xs md:text-sm text-gray-600">
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
            <div className="flex items-center gap-2">
              <span>{item.originalData.comments_count}</span>
              <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                <img
                  src={comment}
                  alt="Comment"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 mt-3 md:mt-5">
            <button
              onClick={() => handleLike(item.originalData.id)}
              className={`flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base ${item.originalData.is_liked ? "text-blue-600" : "text-blue-500"
                } hover:bg-blue-50 shadow-sm`}
            >
              <img
                src={item.originalData.is_liked ? like : Like1}
                className="w-5 h-5 md:w-6 md:h-6"
              />
              Like
            </button>
            <button
              onClick={() => {
                setSelectedPostId(item.originalData.id);
                setShowCommentBox(true);
              }}
              className="flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-blue-500 hover:bg-blue-50 shadow-sm"
            >
              <img src={comment1} className="w-5 h-5 md:w-6 md:h-6" />{" "}
              Comments
            </button>
            <div className="relative">
              <button
                onClick={() => toggleMenu(item.originalData.id)}
                className="flex items-center w-full justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-purple-500 hover:bg-blue-50 shadow-sm"
              >
                <Share2 size={18} className="md:w-5 md:h-5" />
              </button>
              {openMenuPostId === item.originalData.id && (
                <div
                  className="absolute top-10 sm:left-0 md:left-[auto] md:right-0 bg-white shadow-lg rounded-lg p-3 z-10"
                  ref={menuRef}
                >
                  <ul className="flex items-center gap-4">
                    <li>
                      <FacebookShareButton url={urldata}>
                        <FaFacebook size={32} color="#4267B2" />
                      </FacebookShareButton>
                    </li>
                    <li>
                      <LinkedinShareButton url={urldata}>
                        <FaLinkedin size={32} color="#0077B5" />
                      </LinkedinShareButton>
                    </li>
                    {/* <li>
                      <FaInstagram size={32} color="#C13584" />
                    </li> */}
                    <li>
                      <TwitterShareButton url={urldata}>
                        <FaTwitter size={32} color="#1DA1F2" />
                      </TwitterShareButton>
                    </li>
                    <li>
                      <WhatsappShareButton url={urldata}>
                        <FaWhatsapp size={32} color="#1DA1F2" />
                      </WhatsappShareButton>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(urldata);
                          setCopy(true);
                          setTimeout(() => setCopy(false), 1500);
                        }}
                        className="flex items-center relative"
                        title="Copy link"
                      >
                        <MdContentCopy size={30} className="text-gray-600" />
                        {copy && <div className="absolute w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all z-20">
                          Link Copied!
                        </div>}
                      </button>
                    </li>
                  </ul>
                </div>
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
          onCommentAdded={() => // Update the comments count when a new comment is added
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