import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
import StoryCard from "../components/Social/StoryCard";
import { Share2 } from "lucide-react";
import {
  AddPost,
  AddStory,
  GetStory,
  PostsDetails,
  PostsLike,
  SendFollowRequest,
} from "../Common/ServerAPI";

// images
import Announcement from "../assets/Announcement.png";
import Collection from "../assets/Collection.png";
import Leaderboard from "../assets/Leaderboard.png";
import Mention from "../assets/Mention.png";
import people from "../assets/people.png";
import Trending from "../assets/Trending.png";
import createstory from "../assets/createstory.jpg";
import carosuel1 from "../assets/carosuel1.png";
import like from "../assets/like.png";
import Like1 from "../assets/Like1.png";
import comment from "../assets/comment.png";
import comment1 from "../assets/comment1.png";
import Image from "../components/ui/Image";
import CommentBox from "./CommentBox";
import { useToast } from "../components/ui/Toast/ToastProvider";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

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
    user_id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
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

const storyList = [
  {
    id: "101",
    userIcon: "/avatars/liam.jpg",
    userName: "Liam Anderson",
    title: "Chasing Dreams",
    videoSrc: "/consciousness_social_media.mp4",
  },
  {
    id: "102",
    userIcon: "/avatars/noah.jpg",
    userName: "Noah Thompson",
    title: "Into the Clouds",
    videoSrc: "/test1.mp4",
  },
  {
    id: "103",
    userIcon: "/avatars/oliver.jpg",
    userName: "Oliver Bennett",
    title: "Zen & Peace",
    videoSrc: "/consciousness_social_media.mp4",
  },
  {
    id: "104",
    userIcon: "/avatars/lucas.jpg",
    userName: "Lucas Mitchell",
    title: "Walking Free",
    videoSrc: "/test1.mp4",
  },

  {
    id: "105",
    userIcon: "/avatars/lucas.jpg",
    userName: "Lucas Mitchell",
    title: "Walking Free",
    videoSrc: "/test1.mp4",
  },
];
// function PostCarousel() {
//   const images = [carosuel1, carosuel2, carosuel3, carosuel4];
//   const [current, setCurrent] = useState(0);

//   // Auto slide every 3 seconds
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % images.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [images.length]);

//   const handlePrev = () => {
//     setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
//   };

//   const handleNext = () => {
//     setCurrent((prev) => (prev + 1) % images.length);
//   };

//   return (
//     <div className="relative w-full rounded-lg overflow-hidden">
//       <img
//         src={images[current]}
//         alt={`Slide ${current}`}
//         className="w-full object-cover max-h-[300px] transition duration-500 rounded-lg"
//       />

//       {/* Arrows */}
//       <button
//         onClick={handlePrev}
//         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-8 h-8 rounded-full flex items-center justify-center"
//       >
//         <ChevronLeft size={20} />
//       </button>
//       <button
//         onClick={handleNext}
//         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-8 h-8 rounded-full flex items-center justify-center"
//       >
//         <ChevronRight size={20} />
//       </button>

//       {/* Dots */}
//       <div className="flex justify-center gap-1 mt-2">
//         {images.map((_, idx) => (
//           <span
//             key={idx}
//             className={`w-2 h-2 rounded-full ${
//               idx === current ? "bg-indigo-500" : "bg-gray-300"
//             }`}
//           ></span>
//         ))}
//       </div>
//     </div>
//   );
// }

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
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const { showToast } = useToast();
  const menuRef = useRef<HTMLDivElement | null>(null);
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
    try {
      // Call the API to get the posts for the current page
      const res = await PostsDetails(page);
      if (res?.data) {
        const newPosts = res?.data.data.rows || [];
        const totalPages = res?.data?.data?.count / 10 || 0;

        if (newPosts.length === 0) {
          setHasMore(false); // No more posts to load
        } else {
          setUserPosts((prevPosts) => [...prevPosts, ...newPosts]);

          // Check if the current page is the last page
          if (page >= totalPages) {
            setHasMore(false); // We've loaded all available pages
          } else {
            setPage((prevPage) => prevPage + 1); // Load the next page
          }
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    // Clear video selection if images are selected
    setSelectedVideo(null);
    setPostVideoPreviewUrl(null);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      // Clear image selection if video is selected
      setSelectedImages([]);

      // Create preview URL
      const videoUrl = URL.createObjectURL(file);
      setPostVideoPreviewUrl(videoUrl);
    }
  };

  const handleRemoveMedia = () => {
    setSelectedImages([]);
    setSelectedVideo(null);
    if (postVideoPreviewUrl) {
      URL.revokeObjectURL(postVideoPreviewUrl);
      setPostVideoPreviewUrl(null);
    }
  };
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitPost = async () => {
    setApiMessage(null);
    if (!postMessage && !selectedImages.length && !selectedVideo) {
      setApiMessage("Please add a message or select media.");
      return;
    }

    const formData = new FormData();
    formData.append("content", postMessage);

    // Handle multiple images or single video
    if (selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("file", image);
      });
    } else if (selectedVideo) {
      formData.append("file", selectedVideo);
    }

    try {
      const response = await AddPost(formData);

      if (response) {
        setApiMessage(
          response?.success?.message || "Post created successfully"
        );
        await getUserPosts();
        setTimeout(() => {
          setShowPopup(false);
          // Clear all states
          setPostMessage("");
          setSelectedImages([]);
          setSelectedVideo(null);
          if (postVideoPreviewUrl) {
            URL.revokeObjectURL(postVideoPreviewUrl);
            setPostVideoPreviewUrl(null);
          }
        }, 1000);
      } else {
        setApiMessage("Failed to create post.");
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.error?.message,
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
          await GetStory();
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

  const isImageFile = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null;
  };

  const isVideoFile = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov)$/i) !== null;
  };

  const myid = localStorage.getItem("Id");
  const urldata = `https://dev.cness.io/directory/user-profile/${myid}`;

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuPostId(null);
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

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-6 px-2 md:px-4 lg:px-6 w-full">
      {/* Left Side: Post & Stories - Full width on mobile */}
      <div
        className="w-full lg:max-w-[70%] overflow-y-auto h-[calc(100vh-100px)]"
        ref={containerRef}
      >
        {/* Start a Post */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 md:p-6 rounded-xl mb-4 md:mb-5">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex items-center gap-3">
              <img
                src={createstory}
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
              <button className="flex items-center gap-1 md:gap-2">
                <Image
                  src="/youtube.png"
                  alt="youtube"
                  width={20}
                  height={14}
                  className="object-contain rounded-0 w-5 md:w-6"
                />
                <span className="text-black text-xs md:text-sm">Video</span>
              </button>
              <button className="flex items-center gap-1 md:gap-2">
                <Image
                  src="/picture.png"
                  alt="picture"
                  width={20}
                  height={16}
                  className="object-contain rounded-0 w-5 md:w-6"
                />
                <span className="text-black text-xs md:text-sm">Photo</span>
              </button>
              <button className="flex items-center gap-1 md:gap-2">
                <Image
                  src="/list.png"
                  alt="list"
                  width={20}
                  height={16}
                  className="object-contain rounded-0 w-5 md:w-6"
                />
                <span className="text-black text-xs md:text-sm">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Story Strip Wrapper */}
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
            <div className="absolute bottom-[46px] left-1/2 -translate-x-1/2 z-20 w-8 h-8 md:w-10 md:h-10 bg-white text-[#7C81FF] rounded-full flex items-center justify-center text-xl shadow-md leading-0">
              +
            </div>
            <div className="absolute bottom-[14px] w-full text-center text-white text-xs md:text-[15px] font-medium z-20">
              Create Story
            </div>
            <div className="w-full border-t-[5px] border-[#7C81FF] mt-4"></div>
          </div>

          {storyList.map((story) => (
            <div
              key={story.id}
              className="w-[140px] h-[190px] md:w-[162px] md:h-[214px] snap-start shrink-0 rounded-[12px] overflow-hidden relative"
            >
              <StoryCard {...story} />
              <div className="absolute bottom-2 left-2 flex items-center gap-2 z-20 text-white">
                <img
                  src={story.userIcon}
                  alt={story.userName}
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full object-cover border border-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/profile.png";
                  }}
                />
                <span className="text-xs md:text-[13px] font-medium drop-shadow-sm">
                  {story.userName}
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
            className="bg-white rounded-xl shadow-md p-3 md:p-4 w-full mx-auto mt-4 md:mt-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3">
                <img
                  src={post.profile.profile_picture}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                  alt="User"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/profile.png";
                  }}
                />
                <div>
                  <p className="font-semibold text-sm md:text-base text-gray-800">
                    {post.profile.first_name} {post.profile.last_name}
                    <span className="text-gray-500 text-xs md:text-sm">
                      {" "}
                      @{post.user.username}
                    </span>
                  </p>
                  <p className="text-xs md:text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {post.user_id !== loggedInUserID && (
                <button
                  onClick={() => handleFollow(post.user_id)}
                  className={`text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full ${
                    post.if_following
                      ? "bg-gray-200 text-gray-800"
                      : "bg-[#7C81FF] text-white"
                  } hover:bg-indigo-600 hover:text-white`}
                >
                  {post.if_following ? "Following" : "+ Follow"}
                </button>
              )}
            </div>

            {/* Post Content */}
            <div className="mt-3 md:mt-4">
              <p className="text-gray-800 text-sm md:text-base mb-2 md:mb-3">
                {expandedPosts[post.id] || post.content.length <= CONTENT_LIMIT
                  ? post.content
                  : `${post.content.substring(0, CONTENT_LIMIT)}...`}
                {post.content.length > CONTENT_LIMIT && (
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="text-blue-500 ml-1 text-xs md:text-sm font-medium hover:underline focus:outline-none"
                  >
                    {expandedPosts[post.id] ? "Show less" : "Read more"}
                  </button>
                )}
              </p>

              {/* Dynamic Media Block */}
              {post.file && (
                <div className="rounded-lg overflow-hidden">
                  {(() => {
                    const urls = post.file.split(",").map((url) => url.trim());
                    const isMultiple = urls.length > 1;

                    return urls.map((url, index) => {
                      const isImage =
                        post.file_type === "image" || isImageFile(url);
                      const isVideo =
                        post.file_type === "video/mp4" || isVideoFile(url);

                      if (isVideo) {
                        return (
                          <video
                            key={index}
                            className={`w-full ${
                              isMultiple
                                ? "h-32 md:h-48"
                                : "max-h-[200px] md:max-h-[300px]"
                            } object-cover rounded-lg`}
                            controls
                            muted
                            autoPlay
                            loop
                          >
                            <source src={url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      } else if (isImage) {
                        return (
                          <img
                            key={index}
                            src={url}
                            alt={`Post content ${index + 1}`}
                            className={`${
                              isMultiple
                                ? "w-full h-32 md:h-48"
                                : "w-full max-h-[200px] md:max-h-[300px]"
                            } object-cover rounded-lg mb-2`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = carosuel1;
                            }}
                          />
                        );
                      } else {
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            View File {isMultiple ? index + 1 : ""}
                          </a>
                        );
                      }
                    });
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
                <span>{post.comments_count}</span>
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
                onClick={() => handleLike(post.id)}
                className={`flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base ${
                  post.is_liked ? "text-blue-600" : "text-blue-500"
                } hover:bg-blue-50 shadow-sm`}
              >
                <img
                  src={post.is_liked ? like : Like1}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
                Like
              </button>
              <button
                onClick={() => {
                  setSelectedPostId(post.id);
                  setShowCommentBox(true);
                }}
                className="flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-blue-500 hover:bg-blue-50 shadow-sm"
              >
                <img src={comment1} className="w-5 h-5 md:w-6 md:h-6" />{" "}
                Comments
              </button>
              {/* <button className="flex items-center justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-blue-500 hover:bg-blue-50 shadow-sm">
                <img src={repost1} className="w-5 h-5 md:w-6 md:h-6" /> Repost
              </button> */}
              <div className="relative">
                <button
                  onClick={() => toggleMenu(post.id)}
                  className="flex items-center w-full justify-center gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 border border-[#E5E7EB] rounded-xl text-xs md:text-base text-purple-500 hover:bg-blue-50 shadow-sm"
                >
                  <Share2 size={18} className="md:w-5 md:h-5" />
                </button>
                {openMenuPostId === post.id && (
                  <div
                    className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-3 z-10"
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
                      <li>
                        <FaInstagram size={32} color="#C13584" />
                      </li>
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
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Quick Actions - Full width on mobile, appears below */}
      <div className="w-full lg:w-[100%] lg:max-w-[30%] h-auto lg:h-[438px] bg-white rounded-[12px] pt-4 pb-4 px-3 md:pt-6 md:pb-6 shadow-sm order-first lg:order-last mb-4 lg:mb-0">
        <h3 className="text-gray-700 font-semibold text-base md:text-lg mb-3 md:mb-4">
          Quick Actions
        </h3>
        <ul className="space-y-4 md:space-y-6 text-sm md:text-[15px] text-gray-700">
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Trending} className="w-4 h-4 md:w-5 md:h-5" /> Trending
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Mention} className="w-4 h-4 md:w-5 md:h-5" /> Mention &
            tags
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Collection} className="w-4 h-4 md:w-5 md:h-5" /> My
            Collection
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={people} className="w-4 h-4 md:w-5 md:h-5" /> People you
            follow
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Leaderboard} className="w-4 h-4 md:w-5 md:h-5" />{" "}
            Leaderboard
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Announcement} className="w-4 h-4 md:w-5 md:h-5" />{" "}
            Announcements
          </li>
        </ul>
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
              <h2 className="text-lg font-semibold mb-0 text-gray-800">
                Create Post
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-black text-[26px] hover:text-black cursor-pointer"
              >
                ×
              </button>
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
            <div className="px-3 mt-5 pb-5">
              <textarea
                rows={4}
                className="w-full p-3 border border-[#ECEEF2] text-black placeholder:text-[#64748B] text-sm rounded-md resize-none mb-3 outline-none focus:border-[#897AFF1A]"
                placeholder="What's on your mind?"
                value={postMessage}
                onChange={(e) => setPostMessage(e.target.value)}
              />

              <div className="space-y-3 mb-4 flex rounded-[8px] border border-[#F07EFF1A]  justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
                <p className="mb-0 text-sm font-semibold">Add to your post :</p>
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
                        className="object-contain rounded-0"
                      />
                      <span className="text-black text-sm">Video</span>
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      id="video-upload"
                      className="w-full hidden"
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
                        className="object-contain rounded-0"
                      />
                      <span className="text-black text-sm">Photo</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="photo-upload"
                      className="w-full hidden"
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
                  {/* Optional: Keep the "Remove All" button if you still want that functionality */}
                  {/* <button
                    onClick={() => {
                      setSelectedImages([]);
                    }}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remove All Images
                  </button> */}
                </div>
              )}

              {postVideoPreviewUrl && (
                <div className="mb-4 relative">
                  <video
                    controls
                    className="w-full max-h-[300px] rounded-lg object-cover"
                    src={postVideoPreviewUrl}
                  />
                  <button
                    onClick={handleRemoveMedia}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="text-xs text-gray-500 mt-1">
                    Video preview - {selectedVideo?.name}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={handleSubmitPost}
                  className="w-[93px] h-[36px] me-0 py-1 text-sm ms-auto rounded-[100px] bg-[#7077FE] text-white"
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
