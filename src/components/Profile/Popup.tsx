import React, { useState, useEffect, useRef } from "react";
import {
  GetComment,
  GetChildComments,
  PostChildComments,
  PostComments,
  FetchCommentStory,
  CommentStory,
} from "../../Common/ServerAPI";
import { BsThreeDots } from "react-icons/bs";
import { FiEdit2, FiLink2, FiSend, FiTrash2, FiX } from "react-icons/fi";
import { useToast } from "../ui/Toast/ToastProvider";
import { FaRegSmile } from "react-icons/fa";
import SharePopup from "../Social/SharePopup";
import { copyPostLink } from "../../lib/utils";
import like from "../../assets/like.svg";
import comment from "../../assets/comment.svg";
import EditPostModal from "../../pages/EditPostModal";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";

interface Media {
  type: "image" | "video" | "text";
  src: string;
  alt?: string;
  poster?: string;
  images?: string[]; // for multi-image support
}

type CommentItem = {
  id: string;
  user_id: string;
  text: string;
  createdAt: string;
  likes_count?: number;
  child_comment_count?: number;
  replies?: Reply[];
  profile: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  is_liked?: boolean;
};

interface Post {
  is_reel?: any;
  id: string;
  date: string;
  media: Media;
  images?: string[]; // for multi-image support
  comments?: CommentItem[];
  body?: any;
}

type Reply = {
  id: string;
  user_id: string;
  text: string;
  createdAt: string;
  likes_count?: number;
  profile: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  is_liked?: boolean;
};

interface PopupProps {
  post: Post;
  onClose: () => void;
  onDeletePost: () => void;
  insightsCount?: number;
  likesCount?: number;
  collection?: boolean;
  userPost?: boolean;
  onPostUpdated?: () => void;
}

const PostPopup: React.FC<PopupProps> = ({
  post,
  onClose,
  onDeletePost,
  likesCount,
  insightsCount,
  collection,
  userPost,
  onPostUpdated,
}) => {
  const isReel = post.is_reel;
  const [comments, setComments] = useState<any[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(true);
  const [openLeftMenu, setOpenLeftMenu] = useState(false);
  const [openRightMenu, setOpenRightMenu] = useState(false);
  const [posting, setPosting] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [showReplyBoxFor, setShowReplyBoxFor] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );

  const { showToast } = useToast();

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

  const handlePostComment = async () => {
    if (!commentInput.trim()) return;
    setPosting(true);

    try {
      if (isReel) {
        await CommentStory({ story_id: post.id, text: commentInput });
      } else {
        await PostComments({ post_id: post.id, text: commentInput });
      }

      setCommentInput("");

      // Refresh comments after posting
      const refreshData = isReel
        ? FetchCommentStory(post.id)
        : GetComment(post.id, 1);
      refreshData
        .then((data) => {
          const rows = data.data.data?.rows || [];
          const mapped: CommentItem[] = rows.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            text: item.text || "",
            createdAt: item.createdAt,
            likes_count: item.likes_count,
            child_comment_count: item.child_comment_count,
            replies: [],
            profile: {
              first_name: item.profile.first_name,
              last_name: item.profile.last_name,
              profile_picture: item.profile.profile_picture || "",
            },
            is_liked: item.is_liked,
          }));
          setComments(mapped);
        })
        .catch(() => setComments([]));
    } catch (error) {
      // Handle error
      console.error("Error posting comment:", error);
    }
    setPosting(false);
  };

  function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  function formatCount(count: number) {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
    if (count >= 1_000) return (count / 1_000).toFixed(0) + "K";
    return String(count);
  }

  useEffect(() => {
    setIsCommentsLoading(true);

    if (isReel) {
      // Use reel comment APIs
      FetchCommentStory(post.id)
        .then((data) => {
          const rows = data.data.data?.rows || [];
          const mapped: CommentItem[] = rows.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            text: item.text || "",
            createdAt: item.createdAt,
            likes_count: item.likes_count,
            child_comment_count: item.child_comment_count,
            replies: [],
            profile: {
              first_name: item.profile.first_name,
              last_name: item.profile.last_name,
              profile_picture: item.profile.profile_picture || "",
            },
            is_liked: item.is_liked,
          }));
          setComments(mapped);
        })
        .catch(() => setComments([]))
        .finally(() => setIsCommentsLoading(false));
    } else {
      // Use post comment APIs (existing code)
      GetComment(post.id, 1)
        .then((data) => {
          const rows = data.data.data?.rows || [];
          const mapped: CommentItem[] = rows.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            text: item.text || "",
            createdAt: item.createdAt,
            likes_count: item.likes_count,
            child_comment_count: item.child_comment_count,
            replies: [],
            profile: {
              first_name: item.profile.first_name,
              last_name: item.profile.last_name,
              profile_picture: item.profile.profile_picture || "",
            },
            is_liked: item.is_liked,
          }));
          setComments(mapped);
        })
        .catch(() => setComments([]))
        .finally(() => setIsCommentsLoading(false));
    }
  }, [post.id, isReel]);

  const handleReplySubmit = async (id: string) => {
    if (!replyInput.trim()) return;
    // setPosting(true);
    try {
      await PostChildComments({
        post_id: post.id,
        comment_id: id,
        text: replyInput,
      });
      setReplyInput("");
      setShowReplyBoxFor("");
      // Refresh comments after posting
      GetComment(post.id, 1)
        .then((data) => {
          const rows = data.data.data?.rows || [];
          const mapped: CommentItem[] = rows.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            text: item.text || "",
            createdAt: item.createdAt,
            likes_count: item.likes_count,
            child_comment_count: item.child_comment_count,
            replies: [],
            profile: {
              first_name: item.profile.first_name,
              last_name: item.profile.last_name,
              profile_picture: item.profile.profile_picture || "",
            },
            is_liked: item.is_liked,
          }));
          setComments(mapped);
        })
        .catch(() => setComments([]));
    } catch (error) {
      // Optionally show error to user
    }
    setPosting(false);
  };

  const fetchAndToggleReplies = async (commentId: string) => {
    if (expandedComments[commentId]) {
      setExpandedComments((prev) => ({ ...prev, [commentId]: false }));
      return;
    }
    if (!comments.find((c) => c.id === commentId)?.replies?.length) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      try {
        const res = await GetChildComments(commentId);
        const rows = res?.data?.data?.rows || [];
        const mappedReplies: Reply[] = rows.map((child: any) => ({
          id: child.id,
          user_id: child.user_id,
          text: child.text,
          createdAt: child.createdAt,
          likes_count: child.likes_count,
          profile: {
            first_name: child.profile.first_name,
            last_name: child.profile.last_name,
            profile_picture: child.profile.profile_picture,
          },
          is_liked: child.is_liked,
        }));
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, replies: mappedReplies } : c
          )
        );
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }
    setExpandedComments((prev) => ({ ...prev, [commentId]: true }));
  };

  // Menu component to avoid duplication
  const MenuContent = ({ side }: { side: "left" | "right" }) => {
    const [showSharePopup, setShowSharePopup] = useState(false);
    const shareButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useClickOutside(() => {
      if (side === "left") setOpenLeftMenu(false);
      if (side === "right") setOpenRightMenu(false);
    });
    return (
      <div
        ref={menuRef}
        className={`absolute ${
          side === "left" ? "right-0" : "right-0"
        } top-10 mt-2 w-56 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50`}
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-4 py-4 bg-[rgba(137,122,255,0.1)]">
          <button
            // className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shadow-gray-200/60 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition"
            onClick={() =>
              side === "left" ? setOpenLeftMenu(false) : setOpenRightMenu(false)
            }
          >
            {/* <BsThreeDots className="text-gray-800" /> */}
          </button>
          <button
            onClick={() =>
              side === "left" ? setOpenLeftMenu(false) : setOpenRightMenu(false)
            }
            className="text-pink-500"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Menu items */}
        <div className="px-3 py-3 flex flex-col">
          {!collection && !userPost && (
            <>
              <button
                className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0] transition-colors duration-200 w-full text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePost?.();
                  side === "left"
                    ? setOpenLeftMenu(false)
                    : setOpenRightMenu(false);
                }}
                aria-label="Delete post"
              >
                <FiTrash2 className="text-red-500" />
                Delete
              </button>
              <button
                className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0] transition-colors duration-200 w-full text-left"
                onClick={() => {
                  setIsEditModalOpen(true);
                  side === "left"
                    ? setOpenLeftMenu(false)
                    : setOpenRightMenu(false);
                }}
                aria-label="Edit post"
              >
                <FiEdit2 className="text-green-500" />
                Edit
              </button>
            </>
          )}
          <button
            className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 border-b border-[#E2E8F0]"
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
              side === "left"
                ? setOpenLeftMenu(false)
                : setOpenRightMenu(false);
            }}
          >
            <FiLink2 className="text-red-500" /> Copy Link
          </button>
          <div className="relative">
            <button
              ref={shareButtonRef}
              className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 w-full text-left"
              onClick={() => setShowSharePopup(!showSharePopup)}
            >
              <FiSend className="text-blue-500" /> Share to..
            </button>

            {showSharePopup && shareButtonRef.current && (
              <div
                style={{
                  position: "fixed",
                  top: `${
                    shareButtonRef.current.getBoundingClientRect().bottom
                  }px`,
                  left: `${
                    shareButtonRef.current.getBoundingClientRect().left
                  }px`,
                }}
                className="z-50"
              >
                <SharePopup
                  isOpen={true}
                  onClose={() => setShowSharePopup(false)}
                  url={`${window.location.origin}/post/${post.id}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const shouldShowMediaSection =
    post?.media?.type === "image" || post?.media?.type === "video";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePostUpdatedCallback = () => {
    setIsEditModalOpen(false);
    if (onPostUpdated) {
      onPostUpdated();
    }
  };
  const navigate = useNavigate()

  const handleUserProfileRedirection = (user_id:any) =>{
    navigate(`/dashboard/social/user-profile/${user_id}`) 
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className={`flex flex-col lg:flex-row rounded-2xl justify-between bg-black h-[90vh] lg:h-[80vh] w-full max-w-7xl mx-4 xl:mx-auto ${
          !shouldShowMediaSection ? "lg:max-w-2xl!" : ""
        }`}
      >
        {/* Left side - media (conditionally rendered) */}
        {shouldShowMediaSection && (
          <div className="flex-1 lg:basis-[60%] min-w-0 flex h-full">
            <div className="bg-black rounded-2xl p-2 sm:p-4 lg:p-6 w-full flex h-full">
              <div className="bg-white rounded-xl w-full flex flex-col p-3 sm:p-5 shadow-sm">
                <div className="relative flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-gray-800 font-medium">Posted On</h5>
                    <p className="text-xs md:text-sm text-gray-400">
                      {post?.date ? new Date(post.date).toLocaleString() : "—"}
                    </p>
                  </div>

                  {/* Dots button - Left side */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-sm shadow-gray-200/60 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition"
                      onClick={() => setOpenLeftMenu(!openLeftMenu)}
                    >
                      <BsThreeDots className="text-gray-800" />
                    </button>
                    <button
                      onClick={onClose}
                      className="visible lg:invisible w-8 h-8 flex lg:hidden items-center justify-center rounded-lg hover:bg-gray-100 transition shadow-sm"
                    >
                      <span className="text-pink-500 text-lg font-bold">✕</span>
                    </button>
                  </div>

                  {/* Left side menu */}
                  {openLeftMenu && <MenuContent side="left" />}
                </div>

                {/* Media area */}
                <div className="relative flex-1 min-h-[200px] sm:min-h-[280px] rounded-lg overflow-hidden bg-gray-50">
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
                      poster={
                        post.media.poster || "/default-video-thumbnail.jpg"
                      }
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
        )}

        {/* Right side - comments */}
        <div
          className={`w-full ${
            shouldShowMediaSection
              ? "lg:w-[40%] rounded-r-2xl"
              : "lg:w-full rounded-2xl"
          } flex flex-col bg-white pb-6 overflow-y-auto border-t lg:border-l lg:border-t-0 border-[#E5E7EB] h-full`}
        >
          {/* Close button and three dots menu - Right side */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 mx-4 lg:mx-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Reflection Threads
            </h2>
            <div className="flex items-center gap-2">
              {!shouldShowMediaSection ? (
                <>
                  <div className="relative">
                    {/* Three dots button - Right side */}
                    <button
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-white shadow-sm shadow-gray-200/60 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition"
                      onClick={() => setOpenRightMenu(!openRightMenu)}
                    >
                      <BsThreeDots className="text-gray-800" />
                    </button>

                    {/* Right side menu */}
                    {openRightMenu && <MenuContent side="right" />}
                  </div>
                </>
              ) : (
                ""
              )}
              <button
                onClick={onClose}
                className="invisible lg:visible w-8 h-8 hidden lg:flex items-center justify-center rounded-lg hover:bg-gray-100 transition shadow-sm"
              >
                <span className="text-pink-500 text-lg font-bold">✕</span>
              </button>
            </div>
          </div>

          <p className="p-6">{post?.body || "No media available"}</p>

          {/* Comments section */}
          <div className="pt-4 lg:pt-8 flex-1 overflow-y-auto space-y-4 w-full px-4 lg:px-6">
            {isCommentsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-gray-500 text-sm">No comments yet</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <div className="cursor-pointer" onClick={()=>handleUserProfileRedirection(comment.user_id)}>
                        <img
                          src={
                            comment.profile.profile_picture || "/profile.png"
                          }
                          alt={`${comment.profile.first_name} ${comment.profile.last_name}`}
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.profile.first_name} {comment.profile.last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    {!isReel && (
                      <button
                        className="text-sm text-blue-500 hover:underline"
                        onClick={() =>
                          setShowReplyBoxFor(
                            showReplyBoxFor === comment.id ? null : comment.id
                          )
                        }
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 px-4 text-sm text-gray-800">
                    {comment.text}
                  </div>

                  {!isReel && (
                    <>
                      <div className="flex items-center text-xs text-gray-500">
                        {comment.child_comment_count ? (
                          <button
                            className="hover:underline flex items-center"
                            onClick={() => fetchAndToggleReplies(comment.id)}
                            disabled={!!loadingReplies[comment.id]}
                          >
                            {loadingReplies[comment.id]
                              ? "Loading..."
                              : expandedComments[comment.id]
                              ? "— Close replies"
                              : `— View Replies (${comment.child_comment_count})`}
                          </button>
                        ) : null}
                      </div>

                      {showReplyBoxFor === comment.id && (
                        <div className="ml-12 mb-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a reflection..."
                            className="flex-1 rounded-full px-4 py-2 focus:outline-none bg-gray-100 border-none text-sm"
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleReplySubmit(comment.id)
                            }
                          />
                          <button
                            className={`px-3 py-1 rounded-full text-sm ${
                              replyInput
                                ? "text-purple-600 hover:text-purple-700"
                                : "text-purple-300 cursor-not-allowed"
                            }`}
                            disabled={!replyInput}
                            onClick={() => handleReplySubmit(comment.id)}
                          >
                            Post
                          </button>
                        </div>
                      )}

                      {expandedComments[comment.id] &&
                        comment.replies &&
                        comment.replies.length > 0 && (
                          <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-3">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex gap-3 pt-2">
                                <img
                                  src={
                                    reply.profile.profile_picture ||
                                    "/profile.png"
                                  }
                                  alt={`${reply.profile.first_name} ${reply.profile.last_name}`}
                                  className="w-8 h-8 rounded-full object-cover shrink-0"
                                />
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm">
                                      {reply.profile.first_name}{" "}
                                      {reply.profile.last_name}
                                    </span>
                                    <p className="text-sm wrap-break-word">
                                      {reply.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Actions row */}
          <div className="border-t border-gray-300 px-4 lg:px-6">
            <div className="mt-3 flex items-center justify-between gap-3 text-gray-600">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2 sm:-space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    <img
                      src={like}
                      alt="Like"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                    <img
                      src={comment}
                      alt="Comment"
                      className="w-6 h-6 sm:w-8 sm:h-8"
                    />
                  </div>
                  {typeof likesCount === "number" && (
                    <span className="pl-3 sm:pl-5 text-xs sm:text-sm text-gray-500">
                      {formatCount(likesCount)}
                    </span>
                  )}
                </div>
              </div>
              {typeof insightsCount === "number" && (
                <button
                  onClick={() => {
                    const el = document.getElementById("popup-comments-top");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-[13px] sm:text-sm text-[#64748B] hover:text-[#475569] font-medium whitespace-nowrap"
                >
                  {comments.length} Reflections Thread
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 px-4 lg:px-6">
            <div className="relative flex items-center w-full">
              <FaRegSmile className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Add a Reflection..."
                className="flex-1 border border-gray-300 rounded-full pl-10 pr-28 py-3 text-sm"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={posting}
              />
              <button
                className="absolute right-2 rounded-full bg-[#7077FE] hover:bg-[#5b63e6] text-white px-5 py-2 text-sm"
                onClick={handlePostComment}
                disabled={posting || !commentInput.trim()}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal - placed outside to avoid z-index issues */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        posts={post}
        onPostUpdated={handlePostUpdatedCallback}
      />
    </div>
  );
};

export default PostPopup;
