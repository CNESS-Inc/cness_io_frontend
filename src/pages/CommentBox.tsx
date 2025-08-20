import { useState, useEffect, useRef } from "react";
import {
  GetComment,
  PostComments,
  PostChildComments,
  PostCommentLike,
  PostChildCommentLike,
  GetChildComments,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

interface Comment {
  child_comment_count: number;
  id: string;
  user_id: string;
  text: string;
  createdAt: string;
  likes_count: number;
  replies: Reply[];
  profile: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  is_liked?: boolean;
}

interface Reply {
  id: string;
  user_id: string;
  text: string;
  createdAt: string;
  likes_count: number;
  profile: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  is_liked?: boolean;
}

interface CommentBoxProps {
  postId: string;
  setUserPosts?: any;
  userPosts?: any;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentBox = ({
  postId,
  onClose,
  onCommentAdded,
  setUserPosts,
}: CommentBoxProps) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showReply, setShowReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const commentBoxRef = useRef<HTMLDivElement>(null);
  const profilePicture =
    localStorage.getItem("profile_picture") || "/profile.png";
  const { showToast } = useToast();
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await GetComment(postId);
      setComments(res?.data?.data?.rows || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    try {
      const formattedData = {
        text: commentText,
        post_id: postId,
      };

      const response = await PostComments(formattedData);

      if (response?.data?.data) {
        console.log("response.data.data", response.data.data);
        setComments((prev) => [
          {
            ...response.data.data,
            is_liked: false,
            likes_count: 0,
            replies: [],
          },
          ...prev,
        ]);
        setUserPosts((prevPosts: any) =>
          prevPosts.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  comments_count: post.comments_count + 1,
                }
              : post
          )
        );
      } else {
        const newComment: Comment = {
          id: Date.now().toString(),
          user_id: "current_user_id",
          text: commentText,
          createdAt: new Date().toISOString(),
          likes_count: 0,
          replies: [],
          is_liked: false,
          profile: {
            first_name: "Your",
            last_name: "Name",
            profile_picture: profilePicture,
          },
          child_comment_count: 0,
        };
        setComments((prev) => [newComment, ...prev]);
      }
      setCommentText("");

      // Call the onCommentAdded callback if it exists
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      console.error("Error posting comment:", error.message || error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const formattedData = {
        text: replyText,
        comment_id: commentId,
        post_id: postId,
      };

      const response = await PostChildComments(formattedData);

      if (response?.data?.data) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [
                  { ...response.data.data, is_liked: false, likes_count: 0 },
                  ...(comment.replies || []),
                ],
              };
            }
            return comment;
          })
        );
      } else {
        const newReply: Reply = {
          id: Date.now().toString(),
          user_id: "current_user_id",
          text: replyText,
          createdAt: new Date().toISOString(),
          likes_count: 0,
          profile: {
            first_name: "Your",
            last_name: "Name",
            profile_picture: profilePicture,
          },
        };

        setComments((prev) =>
          prev?.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [newReply, ...(comment.replies || [])],
              };
            }
            return comment;
          })
        );
      }

      setReplyText("");
      setShowReply(null);

      // Call the onCommentAdded callback if it exists
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error: any) {
      console.error("Error posting reply:", error.message || error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleLikeComment = async (
    commentId: string,
    isReply: boolean = false,
    replyId: string | null = null
  ) => {
    try {
      console.log("click to like");
      const formattedData = {
        post_id: postId,
        comment_id: commentId,
      };

      const chaildFormData = {
        post_id: postId,
        parent_comment_id: commentId,
        child_comment_id: replyId,
      };

      if (isReply) {
        await PostChildCommentLike(chaildFormData);
      } else {
        await PostCommentLike(formattedData);
      }

      setComments((prev) =>
        prev.map((comment) => {
          if (isReply) {
            // Handle reply like
            const updatedReplies = comment?.replies?.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes_count: reply.is_liked
                    ? reply.likes_count - 1
                    : reply.likes_count + 1,
                  is_liked: !reply.is_liked,
                };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          } else {
            console.log(comment.id, commentId, "commentId commentId");
            // Handle main comment like
            if (comment.id === commentId) {
              return {
                ...comment,
                likes_count: comment.is_liked
                  ? comment.likes_count - 1
                  : comment.likes_count + 1,
                is_liked: !comment.is_liked,
              };
            }
            return comment;
          }
        })
      );
    } catch (error: any) {
      console.error("Error liking comment:", error.message || error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const fetchGetChildComments = async (commentId: string) => {
    // Toggle if already expanded
    if (expandedComments[commentId]) {
      setExpandedComments((prev) => ({ ...prev, [commentId]: false }));
      return;
    }

    // Only fetch if we don't already have replies
    if (!comments.find((c) => c.id === commentId)?.replies?.length) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      try {
        const response = await GetChildComments(commentId);
        const childComments = response?.data?.data?.rows || [];

        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: childComments.map((child: any) => ({
                  id: child.id,
                  user_id: child.user_id,
                  text: child.text,
                  createdAt: child.createdAt,
                  likes_count: child.likes_count,
                  is_liked: child.is_liked,
                  profile: {
                    first_name: child.profile.first_name,
                    last_name: child.profile.last_name,
                    profile_picture: child.profile.profile_picture,
                  },
                })),
              };
            }
            return comment;
          })
        );
      } catch (error) {
        console.error("Error fetching child comments:", error);
        showToast({
          message: "Failed to load replies",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }

    // Toggle expanded state
    setExpandedComments((prev) => ({ ...prev, [commentId]: true }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-transparent" onClick={handleClose} />

      <div
        ref={commentBoxRef}
        className={`relative w-full max-w-xl bg-white rounded-t-2xl shadow-xl transition-all duration-300 transform ${
          isClosing ? "translate-y-full" : "translate-y-0"
        }`}
        style={{
          maxHeight: "90vh",
          animation: !isClosing ? "slideUp 0.3s ease-out forwards" : "none",
        }}
      >
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="font-semibold text-lg">Comments</h3>
          <div className="w-6"></div>
        </div>

        <div
          className="overflow-y-auto px-4"
          style={{
            maxHeight: "calc(90vh - 120px)",
            scrollBehavior: "smooth",
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
              <p>No comments yet</p>
              <p>Be the first to comment</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col">
                  {/* Main Comment */}
                  <div className="flex gap-3 py-2">
                    <img
                      src={comment.profile.profile_picture ? comment.profile.profile_picture : "/profile.png"}
                      alt={`${comment.profile.first_name} ${comment.profile.last_name}`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/profile.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold">
                            {comment.profile.first_name}{" "}
                            {comment.profile.last_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                          <button
                            onClick={() =>
                              setShowReply(
                                showReply === comment.id ? null : comment.id
                              )
                            }
                            className="hover:underline text-[#7077FE]"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 break-words bg-[#F7F7F7] rounded-[8px] py-[14px] pl-[24px]">
                        {comment.text}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                        {/* <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`hover:underline ${
                            comment.is_liked ? "text-blue-500" : ""
                          }`}
                        >
                          Like ({comment.likes_count})
                        </button>
                        <button
                          onClick={() =>
                            setShowReply(
                              showReply === comment.id ? null : comment.id
                            )
                          }
                          className="hover:underline"
                        >
                          Reply
                        </button> */}
                        {comment.child_comment_count > 0 && (
                          <button
                            className="hover:underline flex items-center"
                            onClick={() => fetchGetChildComments(comment.id)}
                            disabled={loadingReplies[comment.id]}
                          >
                            {loadingReplies[comment.id] ? (
                              <span className="inline-block h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></span>
                            ) : expandedComments[comment.id] ? (
                              "— Close replies"
                            ) : (
                              `— View Replies (${comment.child_comment_count})`
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rest of your code (reply input and replies display) remains the same */}
                  {showReply === comment.id && (
                    <div className="ml-12 mb-2 flex gap-2">
                      <img
                        src={profilePicture}
                        alt="Your profile"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/profile.png";
                        }}
                      />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 rounded-full px-4 py-2 focus:outline-none bg-gray-100 border-none text-sm"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleReplySubmit(comment.id)
                          }
                        />
                        <button
                          className={`px-3 py-1 rounded-full text-sm ${
                            replyText
                              ? "text-purple-600 hover:text-purple-700"
                              : "text-purple-300 cursor-not-allowed"
                          }`}
                          disabled={!replyText}
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  {expandedComments[comment.id] &&
                    comment.replies &&
                    comment.replies.length > 0 && (
                      <div className="ml-12 space-y-3 border-l-2 border-gray-200 pl-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 pt-2">
                            <img
                              src={reply.profile.profile_picture}
                              alt={`${reply.profile.first_name} ${reply.profile.last_name}`}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/profile.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm">
                                  {reply.profile.first_name}{" "}
                                  {reply.profile.last_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm break-words">
                                {reply.text}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                                <button
                                  onClick={() =>
                                    handleLikeComment(
                                      comment.id,
                                      true,
                                      reply.id
                                    )
                                  }
                                  className={`hover:underline ${
                                    reply.is_liked ? "text-blue-500" : ""
                                  }`}
                                >
                                  Like ({reply.likes_count})
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t sticky bottom-0 bg-white">
          <div className="flex items-center gap-2">
            <img
              src={profilePicture}
              alt="Your profile"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/profile.png";
              }}
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 rounded-full px-4 py-2 focus:outline-none bg-gray-100 border-none"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <button
              className={`px-4 py-2 rounded-full font-medium ${
                commentText
                  ? "text-purple-600 hover:text-purple-700"
                  : "text-purple-300 cursor-not-allowed"
              }`}
              disabled={!commentText}
              onClick={handleSubmitComment}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default CommentBox;
