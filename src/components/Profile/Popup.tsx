import React, { useState, useEffect, useRef } from "react";
import { GetComment, PostComments } from "../../Common/ServerAPI";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2, FiLink2, FiSend, FiTrash2, FiX } from "react-icons/fi";
import { useToast } from "../ui/Toast/ToastProvider";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaLinkedin,
  FaRegSmile,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
interface Media {
  type: "image" | "video" | "text";
  src: string;
  alt?: string;
  poster?: string;
  images?: string[]; // for multi-image support
}

interface Comment {
  user: string;
  text: string;
  time: string;
  userimage: string;
}

interface Post {
  id: string;
  date: string;
  media: Media;
  images?: string[]; // for multi-image support
  comments?: Comment[];
}

interface PopupProps {
  post: Post;
  onClose: () => void;
  onDeletePost: () => void;
  insightsCount?: number;
}

const PostPopup: React.FC<PopupProps> = ({ post, onClose, onDeletePost, insightsCount }) => {
  const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);
  const { showToast } = useToast();
  const [openMenu, setOpenMenu] = useState<{
    postId: string | null;
    type: "options" | "share" | null;
  }>({ postId: null, type: null });
  const myid = localStorage.getItem("Id");
  const urldata = `https://dev.cness.io/directory/user-profile/${myid}`;

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    setPosting(true);
    try {
      await PostComments({ post_id: post.id, text: commentInput });
      setCommentInput("");
      // Refresh comments after posting
      GetComment(post.id)
        .then((data) => {
          const rows = data.data.data?.rows || [];
          const mapped = rows.map((item: any) => ({
            user: item.profile.first_name + item.profile.last_name || "Unknown",
            userimage: item.profile.profile_picture || "",
            text: item.text || "",
            time: timeAgo(item.createdAt),
          }));
          setComments(mapped);
        })
        .catch(() => setComments([]));
    } catch (error) {
      // Optionally show error to user
    }
    setPosting(false);
  };

  useEffect(() => {
    GetComment(post.id)
      .then((data) => {
        const rows = data.data.data?.rows || [];
        const mapped = rows.map((item: any) => ({
          user: item.profile.first_name + item.profile.last_name || "Unknown",
          userimage: item.profile.profile_picture || "",
          text: item.text || "",
          time: timeAgo(item.createdAt), // You can use a helper to format time
        }));
        setComments(mapped);
      })
      .catch(() => setComments([]));
  }, [post.id]);

  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  // Use comments from props or fallback
  /*const comments = post.comments || [
    {
      user: "Olivia Brown",
      text: "Could you elaborate on your third point? I’m not sure I follow.",
      time: "2 hours ago",
    },
    {
      user: "Noah Williams",
      text: "This is a game-changer. We should implement this immediately.",
      time: "1 hour ago",
    },
    {
      user: "Liam Smith",
      text: "I totally agree! This was a fantastic read, very insightful.",
      time: "4 hours ago",
    },
    {
      user: "Sophia Rodriguez",
      text: "I have a different perspective. Have you considered the potential drawbacks?",
      time: "37 minutes ago",
    },
  ];*/

  // Carousel state for images
  const images =
    (post.images && post.images.length > 1 && post.images) ||
    (post.media.images && post.media.images.length > 1 && post.media.images) ||
    undefined;
  const [currentImage, setCurrentImage] = useState(0);

  // Helper for carousel navigation
  const handlePrev = () =>
    setCurrentImage((prev) =>
      images ? (prev - 1 + images.length) % images.length : 0
    );
  const handleNext = () =>
    setCurrentImage((prev) => (images ? (prev + 1) % images.length : 0));

  const toggleMenu = (postId: string, type: "options" | "share") => {
    setOpenMenu((prev) => {
      if (prev.postId === postId && prev.type === type) {
        return { postId: null, type: null }; // close
      } else {
        return { postId, type }; // open
      }
    });
  };

  const copyPostLink = async (postId: string) => {
    toggleMenu(postId, "options");
    const postUrl = `${window.location.origin}/post/${postId}`;

    try {
      await navigator.clipboard.writeText(postUrl);
      showToast({
        type: "success",
        message: "Post link copied to clipboard!",
        duration: 2000,
      });
    } catch (error) {
      showToast({
        type: "error",
        message: "Failed to copy link",
        duration: 2000,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="flex flex-col md:flex-row justify-between bg-black h-[80vh] w-full max-w-7xl">
        {/* Left side - media */}
        <div className="flex-1 basis-[60%] min-w-0 flex">
          <div className="bg-black rounded-2xl p-3 sm:p-4 md:p-6 w-full flex">
            <div className="bg-white rounded-xl w-full flex flex-col p-3 sm:p-5 shadow-sm">
              <div className="relative flex items-start justify-between mb-4">
                <div>
                  <h5 className="text-gray-800 font-medium">Posted On</h5>
                  <p className="text-xs md:text-sm text-gray-400">
                    {post?.date ? new Date(post.date).toLocaleString() : "—"}
                  </p>
                </div>

                {/* Dots button */}
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-sm shadow-gray-200/60 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition"
                  onClick={() => setOpen(!open)}
                >
                  <BsThreeDots className="text-gray-800" />
                </button>
                {open && (
                  <div className="absolute -right-32 top-10 mt-2 w-56 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
                    {/* Header with close */}
                    <div className="flex items-center justify-between px-4 py-4 bg-[rgba(137,122,255,0.1)]">
                      <button
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shadow-gray-200/60 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition"
                        onClick={() => setOpen(!open)}
                      >
                        <BsThreeDots className="text-gray-800" />
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        className="text-pink-500"
                      >
                        <FiX size={18} />
                      </button>
                    </div>

                    {/* Menu items */}
                    <div className="px-3 py-3 flex flex-col">
                      <button
                        className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePost?.();
                          setOpen(false);
                          onClose?.();
                        }}
                      >
                        <FiTrash2 className="text-red-500" /> Delete
                      </button>
                      <button className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0]">
                        <FiEdit2 className="text-green-500" /> Edit
                      </button>
                      <button
                        className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0]"
                        onClick={() => {
                          copyPostLink(post.id);
                        }}
                      >
                        <FiLink2 className="text-red-500" /> Copy Link
                      </button>
                      <button
                        className="relative flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50"
                        onClick={() => toggleMenu(post.id, "share")}
                      >
                        <FiSend className="text-blue-500" /> Share to..
                        {openMenu.postId === post.id &&
                          openMenu.type === "share" && (
                            <div
                              className="absolute -top-14 left-0 bg-white shadow-lg rounded-lg p-3 z-10"
                              ref={(el) => {
                                const key = `${post.id}-share`;
                                if (el) menuRef.current[key] = el;
                                else delete menuRef.current[key];
                              }}
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
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Media area */}
              <div className="relative flex-1 min-h-[280px] rounded-lg overflow-hidden bg-gray-50">
                {Array.isArray(images) && images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImage]}
                      alt={post?.media?.alt || ""}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gallery controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xl bg-white/80 backdrop-blur hover:bg-white transition shadow"
                          aria-label="Previous"
                        >
                          &#8592;
                        </button>
                        <button
                          onClick={handleNext}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xl bg-white/80 backdrop-blur hover:bg-white transition shadow"
                          aria-label="Next"
                        >
                          &#8594;
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.map((_, idx) => (
                            <span
                              key={idx}
                              className={`inline-block w-2 h-2 rounded-full ${
                                idx === currentImage
                                  ? "bg-gray-800"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : post?.media?.type === "image" ? (
                  <img
                    src={post.media.src}
                    alt={post.media.alt || ""}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : post?.media?.type === "video" ? (
                  <video
                    src={post.media.src}
                    poster={post.media.poster || "/default-video-thumbnail.jpg"}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <p className="text-gray-600 text-sm">
                      {post?.media?.src || "No media available"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - comments */}
        <div
          className="w-[40%] flex flex-col bg-white px-6 pb-6 overflow-y-auto border border-[#E5E7EB]"
          // style={{
          //   width: 610,
          //   height: "80vh",
          //   paddingRight: 24,
          //   paddingBottom: 24,
          //   paddingLeft: 24,
          //   borderWidth: 1,
          //   borderColor: "#E5E7EB",
          //   gap: 24,
          // }}
        >
          {/* Close button */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Reflection Threads
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              <span className="text-pink-500 text-lg font-bold">✕</span>
            </button>
          </div>

          {/* Comments section */}
          <div className="pt-8 flex-1 overflow-y-auto space-y-4 w-full">
            {comments.map((comment, idx) => (
              <div key={idx} className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex justify-start items-center gap-2">
                    <img
                      src={comment.userimage}
                      alt={comment.user}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {comment.user}
                    </span>
                    <span className="text-sm text-gray-500">
                      {comment.time}
                    </span>
                  </div>
                  <button className="text-sm text-blue-500 hover:underline">
                    Reply
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 px-4 text-sm text-gray-800">
                  {comment.text}
                </div>
              </div>
            ))}
          </div>

          {/* Add comment input */}
          <div className="mt-auto flex gap-2">
            {/* <div className="ml-auto flex items-center gap-2">
              {insightsCount !== undefined && (
                <span className="text-sm text-gray-500">
                  {insightsCount} Insights Discussion
                </span>
              )}
              <span
                aria-hidden
                className="hidden sm:block h-4 w-px bg-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReflections?.();
                }}
                className="whitespace-nowrap font-medium text-[grey] hover:text-[grey] text-sm"
              >
                {reflections !== undefined && (
                  <span className="text-sm text-gray-500">
                    {reflections} Reflections Thread
                  </span>
                )}
              </button>
            </div> */}
            <div className="relative flex items-center w-full">
              <FaRegSmile className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Add a Reflection..."
                className="flex-1 border border-gray-300 rounded-full pl-10 pr-4 py-3 text-sm"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={posting}
              />
            </div>
            <button
              className="bg-[#7077FE] text-white rounded-full px-8 py-2 text-sm"
              onClick={handlePostComment}
              disabled={posting || !commentInput.trim()}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
