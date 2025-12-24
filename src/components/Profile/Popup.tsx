import React, { useState, useEffect, useRef } from "react";
import {
  GetComment,
  GetChildComments,
  PostChildComments,
  PostComments,
  FetchCommentStory,
  CommentStory,
  UpdateComment,
  UpdateChildComment,
  DeleteComment,
  DeleteChildComment,
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

// Delete confirmation modal component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isDeleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "comment" | "reply";
  isDeleting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this {type}? This action cannot be
            undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-[100px] justify-center items-center gap-1 text-xs lg:text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex w-[100px] justify-center items-center gap-1 text-xs lg:text-sm px-4 py-2 rounded-full bg-[#7077FE] text-white hover:bg-[#7077FE] disabled:bg-gray-400 disabled:cursor-not-allowed ${
                isDeleting ? "opacity-70" : ""
              }`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const loggedInUserID = localStorage.getItem("Id");

  // Edit states
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<{
    commentId: string;
    replyId: string;
  } | null>(null);
  const [editText, setEditText] = useState("");

  // Delete states
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: "comment" as "comment" | "reply",
    commentId: undefined as string | undefined,
    replyId: undefined as string | undefined,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
      console.error("Error posting comment:", error);
      showToast({
        message: "Failed to post comment",
        type: "error",
        duration: 3000,
      });
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
    setPosting(true);
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
      console.error("Error posting reply:", error);
      showToast({
        message: "Failed to post reply",
        type: "error",
        duration: 3000,
      });
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
      } catch (error) {
        console.error("Error fetching replies:", error);
        showToast({
          message: "Failed to load replies",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }
    setExpandedComments((prev) => ({ ...prev, [commentId]: true }));
  };

  // Edit functions
  const handleEditComment = (comment: CommentItem) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleEditReply = (commentId: string, reply: Reply) => {
    setEditingReply({ commentId, replyId: reply.id });
    setEditText(reply.text);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim() || !editingComment) return;

    try {
      const formattedData = {
        id: editingComment,
        text: editText,
      };

      const response = await UpdateComment(formattedData);

      if (response?.data?.data) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingComment
              ? { ...comment, text: editText }
              : comment
          )
        );
        setEditingComment(null);
        setEditText("");
        showToast({
          message: "Comment updated successfully",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error updating comment:", error.message || error);
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update comment",
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleUpdateReply = async () => {
    if (!editText.trim() || !editingReply) return;

    try {
      const formattedData = {
        id: editingReply.replyId,
        text: editText,
      };

      const response = await UpdateChildComment(formattedData);

      if (response?.data?.data) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === editingReply.commentId
              ? {
                  ...comment,
                  replies: comment.replies?.map((reply: any) =>
                    reply.id === editingReply.replyId
                      ? { ...reply, text: editText }
                      : reply
                  ),
                }
              : comment
          )
        );
        setEditingReply(null);
        setEditText("");
        showToast({
          message: "Reply updated successfully",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error updating reply:", error.message || error);
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update reply",
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditingReply(null);
    setEditText("");
  };

  // Delete functions
  const showDeleteConfirmation = (
    type: "comment" | "reply",
    commentId: string,
    replyId?: string
  ) => {
    setDeleteConfirmation({
      isOpen: true,
      type,
      commentId,
      replyId,
    });
  };

  const handleDeleteConfirm = async () => {
    const { type, commentId, replyId } = deleteConfirmation;

    if (!commentId) return;

    setIsDeleting(true);

    try {
      if (type === "comment") {
        const formattedData = {
          id: commentId,
        };
        await DeleteComment(formattedData);

        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );

        showToast({
          message: "Comment deleted successfully",
          type: "success",
          duration: 3000,
        });
      } else if (type === "reply" && replyId) {
        const formattedData = {
          id: replyId,
        };
        await DeleteChildComment(formattedData);

        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies:
                    comment.replies?.filter(
                      (reply: any) => reply.id !== replyId
                    ) || [],
                  child_comment_count: Math.max(
                    0,
                    comment.child_comment_count - 1
                  ),
                }
              : comment
          )
        );

        showToast({
          message: "Reply deleted successfully",
          type: "success",
          duration: 3000,
        });
      }

      // Close the confirmation modal
      setDeleteConfirmation({
        isOpen: false,
        type: "comment",
        commentId: undefined,
        replyId: undefined,
      });
    } catch (error: any) {
      console.error(`Error deleting ${type}:`, error.message || error);
      showToast({
        message:
          error?.response?.data?.error?.message || `Failed to delete ${type}`,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setDeleteConfirmation({
      isOpen: false,
      type: "comment",
      commentId: undefined,
      replyId: undefined,
    });
  };

  // Check if current user is the owner of comment/reply
  const isCurrentUserComment = (userId: string) => {
    return userId === loggedInUserID;
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
  const navigate = useNavigate();

  const handleUserProfileRedirection = (user_id: any) => {
    if (loggedInUserID === user_id) {
      navigate(`/dashboard/Profile`);
    } else {
      navigate(`/dashboard/social/user-profile/${user_id}`);
    }
    onClose();
  };

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
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          handleUserProfileRedirection(comment.user_id)
                        }
                      >
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
                    <div className="flex items-center gap-2">
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
                      {/* Edit/Delete buttons for comment owner */}
                      {isCurrentUserComment(comment.user_id) && !isReel && (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-sm text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              showDeleteConfirmation("comment", comment.id)
                            }
                            className="text-sm text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Comment Content or Edit Field */}
                  {editingComment === comment.id ? (
                    <div className="mt-1">
                      <textarea
                        className="w-full rounded-lg px-4 py-2 focus:outline-none bg-gray-100 border border-gray-300 resize-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleUpdateComment}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-3 px-4 text-sm text-gray-800">
                      {comment.text}
                    </div>
                  )}

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
                          {showReplyBoxFor === comment.id && (
                            <div className="ml-12 mb-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="Add a reflection..."
                                className="flex-1 rounded-full px-4 py-2 focus:outline-none bg-gray-100 border-none text-sm"
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handleReplySubmit(comment.id)
                                }
                                disabled={posting} // Add disabled state to input too
                              />
                              <button
                                className={`px-3 py-1 rounded-full text-sm ${
                                  replyInput && !posting
                                    ? "text-purple-600 hover:text-purple-700"
                                    : "text-purple-300 cursor-not-allowed"
                                }`}
                                disabled={!replyInput || posting} // Ensure posting disables button
                                onClick={() => handleReplySubmit(comment.id)}
                              >
                                {posting ? "Posting..." : "Post"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {expandedComments[comment.id] &&
                        comment.replies &&
                        comment.replies.length > 0 && (
                          <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-3">
                            {comment.replies.map((reply: any) => (
                              <div
                                key={reply.id}
                                className="flex flex-col gap-2 pt-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={
                                        reply.profile.profile_picture ||
                                        "/profile.png"
                                      }
                                      alt={`${reply.profile.first_name} ${reply.profile.last_name}`}
                                      className="w-8 h-8 rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex items-baseline gap-2">
                                      <span className="font-semibold text-sm">
                                        {reply.profile.first_name}{" "}
                                        {reply.profile.last_name}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Edit/Delete buttons for reply owner */}
                                  {isCurrentUserComment(reply.user_id) && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleEditReply(comment.id, reply)
                                        }
                                        className="text-xs text-blue-500 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          showDeleteConfirmation(
                                            "reply",
                                            comment.id,
                                            reply.id
                                          )
                                        }
                                        className="text-xs text-red-500 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Reply Content or Edit Field */}
                                {editingReply?.commentId === comment.id &&
                                editingReply?.replyId === reply.id ? (
                                  <div className="mt-1">
                                    <textarea
                                      className="w-full rounded-lg px-2 py-1 focus:outline-none bg-gray-100 border border-gray-300 resize-none text-sm"
                                      value={editText}
                                      onChange={(e) =>
                                        setEditText(e.target.value)
                                      }
                                      rows={2}
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        onClick={handleUpdateReply}
                                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={handleCancelEdit}
                                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm wrap-break-word">
                                    {reply.text}
                                  </p>
                                )}
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
        popupModalClose={onClose}
        posts={post}
        onPostUpdated={handlePostUpdatedCallback}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        type={deleteConfirmation.type}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PostPopup;
