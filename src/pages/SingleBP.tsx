import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetSingleBestPractice,
  LikeBestpractices,
  SaveBestpractices,
  CreateBestpracticesComment,
  GetBestpracticesComment,
  SendBpFollowRequest,
  CreateBestpracticesCommentReply,
  BPCommentLike,
  CreateBestpracticesCommentReplyLike,
  GetRelatedBestPractices, // You'll need to create this API function
} from "../Common/ServerAPI";
import blush from "../assets/bg-one.png";
import image1 from "../assets/image1.png";
import DOMPurify from "dompurify";
import {
  FaBookmark,
  FaCheck,
  FaEdit,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegBookmark,
  FaTimes,
  FaTrash,
  FaTwitter,
} from "react-icons/fa";
import { ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import CreditAnimation from "../Common/CreditAnimation";
import { useToast } from "../components/ui/Toast/ToastProvider";
//import defaultImg from "../assets/profile.png";
import home from "../assets/home1.svg";
import thumbs from "../assets/thumbsup.svg";
import cnessicon from "../assets/cnessi.svg";

const SingleBP = () => {
  const [isSaved, setIs_saved] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState("");
  const [postComment, setPostComment] = useState<any>([]);
  const [commentError, setCommentError] = useState("");
  const [singlepost, setSinglePost] = useState<any>({});
  const [media, setMedia] = useState<string>("");
  const [_saved, setSaved] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [sortLatest, setSortLatest] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyErrors, setReplyErrors] = useState<{ [key: string]: string }>({});
  const [animations, _setAnimations] = useState<any[]>([]);
  const [relatedBestPractices, setRelatedBestPractices] = useState<any[]>([]);
  
  // Loading states
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const [isAppreciateLoading, setIsAppreciateLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false);
  const [isReplyLoading, setIsReplyLoading] = useState<{ [key: string]: boolean }>({}); // NEW: Reply loading state

   const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editReplyText, setEditReplyText] = useState("");
  const [isEditCommentLoading, setIsEditCommentLoading] = useState<{ [key: string]: boolean }>({});
  const [isDeleteCommentLoading, setIsDeleteCommentLoading] = useState<{ [key: string]: boolean }>({});
  const [isEditReplyLoading, setIsEditReplyLoading] = useState<{ [key: string]: boolean }>({});
  const [isDeleteReplyLoading, setIsDeleteReplyLoading] = useState<{ [key: string]: boolean }>({});


  const handleEditCommentClick = (comment: any) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.text);
  };

  const handleEditCommentChange = (event: any) => {
    setEditCommentText(event.target.value);
  };

  const handleEditCommentSubmit = async (commentId: string) => {
    try {
      if (!editCommentText.trim()) {
        showToast({
          message: "Comment cannot be empty",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setIsEditCommentLoading((prev) => ({ ...prev, [commentId]: true }));

      // await UpdateBestpracticesComment({
      //   comment_id: commentId,
      //   text: editCommentText,
      // });

      setEditingComment(null);
      setEditCommentText("");
      fetchComments();

      showToast({
        message: "Comment updated successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      showToast({
        message: "Failed to update comment",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsEditCommentLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Delete Comment Function
  const handleDeleteComment = async (commentId: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
      }

      setIsDeleteCommentLoading((prev) => ({ ...prev, [commentId]: true }));

      // await DeleteBestpracticesComment({ comment_id: commentId });

      setCommentCount((prev) => Math.max(0, prev - 1));
      fetchComments();

      showToast({
        message: "Comment deleted successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast({
        message: "Failed to delete comment",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleteCommentLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Edit Reply Functions
  const handleEditReplyClick = (reply: any) => {
    setEditingReply(reply.id);
    setEditReplyText(reply.text);
  };

  const handleEditReplyChange = (event: any) => {
    setEditReplyText(event.target.value);
  };

  const handleEditReplySubmit = async (replyId: string, _parentCommentId: string) => {
    try {
      if (!editReplyText.trim()) {
        showToast({
          message: "Reply cannot be empty",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setIsEditReplyLoading((prev) => ({ ...prev, [replyId]: true }));

      // await UpdateBestpracticesCommentReply({
      //   child_comment_id: replyId,
      //   text: editReplyText,
      //   parent_comment_id: parentCommentId,
      // });

      setEditingReply(null);
      setEditReplyText("");
      fetchComments();

      showToast({
        message: "Reply updated successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating reply:", error);
      showToast({
        message: "Failed to update reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsEditReplyLoading((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  const handleCancelEditReply = () => {
    setEditingReply(null);
    setEditReplyText("");
  };

  // Delete Reply Function
  const handleDeleteReply = async (replyId: string, _parentCommentId: string) => {
    try {
      if (!window.confirm("Are you sure you want to delete this reply?")) {
        return;
      }

      setIsDeleteReplyLoading((prev) => ({ ...prev, [replyId]: true }));

      // await DeleteBestpracticesCommentReply({
      //   child_comment_id: replyId,
      //   parent_comment_id: parentCommentId,
      // });

      fetchComments();

      showToast({
        message: "Reply deleted successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      showToast({
        message: "Failed to delete reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleteReplyLoading((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  // Check if current user is the author of comment/reply
  const isCurrentUserAuthor = (authorId: string) => {
    const currentUserId = localStorage.getItem("Id"); // Adjust based on your auth storage
    return currentUserId === authorId;
  };

  // Update the comments list rendering to include edit/delete functionality
  const renderComments = () => {
    const commentsToRender = sortLatest ? [...postComment].reverse() : postComment;

    return commentsToRender.map((comment: any) => (
      <div key={comment.id} className="space-y-4">
        {/* Main Comment */}
        <div className="flex items-start space-x-3">
          <img
            src={comment.profile?.profile_picture || "/profile.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 bg-[#F9F9F9] p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="font-semibold me-2 text-[16px] text-gray-800">
                  {comment.profile?.first_name} {comment.profile?.last_name}
                </span>
                <span className="bg-[#A1A1A1] p-0.5 me-2 rounded-full"></span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                {/* {comment.updatedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400 ml-2">(edited)</span>
                )} */}
              </div>
              
              {/* Edit/Delete Buttons for Comment */}
              {isCurrentUserAuthor(comment.user_id) && (
                <div className="flex items-center space-x-2">
                  {editingComment === comment.id ? (
                    <>
                      <button
                        onClick={() => handleEditCommentSubmit(comment.id)}
                        disabled={isEditCommentLoading[comment.id]}
                        className="text-green-600 hover:text-green-800 p-1 rounded"
                      >
                        {isEditCommentLoading[comment.id] ? (
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEditComment}
                        disabled={isEditCommentLoading[comment.id]}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditCommentClick(comment)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeleteCommentLoading[comment.id]}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        {isDeleteCommentLoading[comment.id] ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Comment Content - Editable when editing */}
            {editingComment === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editCommentText}
                  onChange={handleEditCommentChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>{2000 - editCommentText.length} characters remaining</span>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-gray-700 mt-1">{comment.text}</p>
            )}

            {/* Comment Actions */}
            <div className="flex items-center space-x-4 mt-4 text-xs text-gray-600 my-3">
              <button
                onClick={() => handleCommentLike(comment.id, comment.post_id)}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <HandThumbUpIcon className="w-6 h-6" />
                <span className="text-[12px]">{comment.likes_count}</span>
              </button>
              <div className="h-4 border-l border-gray-300"></div>
              <button
                onClick={() => handleReplyClick(comment.id)}
                className="flex items-center space-x-1 hover:text-gray-700"
              >
                <ChatBubbleLeftIcon className="w-6 h-6" />
                <span className="text-[12px]">Reply</span>
              </button>
            </div>

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="mt-4 border border-[#E0E0E0] rounded-[10px] p-3">
                <textarea
                  placeholder="Write a reply..."
                  rows={2}
                  value={replyText}
                  onChange={(e) => handleReplyChange(e, comment.id)}
                  disabled={isReplyLoading[comment.id]}
                  className={`w-full border-none focus:ring-0 focus:outline-none text-sm resize-none ${
                    isReplyLoading[comment.id] ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                ></textarea>

                {replyErrors[comment.id] && (
                  <p className="text-red-500 text-xs mt-1">{replyErrors[comment.id]}</p>
                )}
                <div className="flex justify-end items-center text-xs text-gray-400 gap-2 mt-2">
                  <span>{2000 - replyText.length} Characters remaining</span>
                  <button
                    onClick={() => handleReplySubmit(comment.id, comment.post_id)}
                    disabled={isReplyLoading[comment.id]}
                    className={`bg-linear-to-r from-purple-500 to-pink-400 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                      isReplyLoading[comment.id] ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{
                      background: "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                    }}
                  >
                    {isReplyLoading[comment.id] ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      "Reply"
                    )}
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    disabled={isReplyLoading[comment.id]}
                    className={`text-gray-500 px-3 py-1 rounded-full text-sm border border-gray-300 ${
                      isReplyLoading[comment.id] ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies Section */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-12 space-y-4 border-l-2 border-gray-200 pl-4">
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start space-x-3">
                <img
                  src={reply.profile?.profile_picture || "/profile.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 bg-[#F5F5F5] p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="font-semibold me-2 text-[14px] text-gray-800">
                        {reply.profile?.first_name} {reply.profile?.last_name}
                      </span>
                      <span className="bg-[#A1A1A1] p-0.5 me-2 rounded-full"></span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                      {/* {reply.updatedAt !== reply.createdAt && (
                        <span className="text-xs text-gray-400 ml-2">(edited)</span>
                      )} */}
                    </div>
                    
                    {/* Edit/Delete Buttons for Reply */}
                    {isCurrentUserAuthor(reply.user_id) && (
                      <div className="flex items-center space-x-2">
                        {editingReply === reply.id ? (
                          <>
                            <button
                              onClick={() => handleEditReplySubmit(reply.id, comment.id)}
                              disabled={isEditReplyLoading[reply.id]}
                              className="text-green-600 hover:text-green-800 p-1 rounded"
                            >
                              {isEditReplyLoading[reply.id] ? (
                                <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaCheck className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={handleCancelEditReply}
                              disabled={isEditReplyLoading[reply.id]}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditReplyClick(reply)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            >
                              <FaEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteReply(reply.id, comment.id)}
                              disabled={isDeleteReplyLoading[reply.id]}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                            >
                              {isDeleteReplyLoading[reply.id] ? (
                                <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaTrash className="w-3 h-3" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply Content - Editable when editing */}
                  {editingReply === reply.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editReplyText}
                        onChange={handleEditReplyChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        maxLength={2000}
                      />
                      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                        <span>{2000 - editReplyText.length} characters remaining</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[12px] text-gray-700 mt-1">{reply.text}</p>
                  )}

                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                    <button
                      onClick={() => handleReplyCommentLike(reply.id, comment.post_id, comment.id)}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <HandThumbUpIcon className="w-5 h-5" />
                      <span className="text-[12px]">{reply.likes_count}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const profile_picture = localStorage.getItem("profile_picture") || "/profile.png";
  const name = localStorage.getItem("name") || "";
  const { id } = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    fetchSinglePost(id);
    fetchComments();
    fetchRelatedBestPractices();
  }, [id]);

  const fetchComments = async () => {
    try {
      if (!id) throw new Error("Post ID is required");
      const res = await GetBestpracticesComment({ post_id: id });
      setPostComment(res?.data?.data?.rows || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentChange = (event: any) => {
    setComment(event.target.value);
    if (commentError) setCommentError("");
  };

  const handleCommentSubmit = async () => {
    try {
      if (!comment.trim()) {
        setCommentError("Please enter a comment.");
        return;
      }
      
      setIsCommentLoading(true); // Start loading
      const payload = { post_id: id, text: comment };
      await CreateBestpracticesComment(payload);
      setCommentCount((prev) => prev + 1);
      setComment("");
      fetchComments();
      
      showToast({
        message: "Comment posted successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      showToast({
        message: "Failed to post comment",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsCommentLoading(false); // End loading
    }
  };

  const fetchSinglePost = async (id: any) => {
    try {
      const res = await GetSingleBestPractice(id);
      setCommentCount(res.data?.data?.comments_count);
      setIs_saved(res.data?.data?.is_saved);
      setIsFollowing(res.data?.data?.is_bp_following);
      setSinglePost(res?.data?.data);
      setMedia(res?.data?.data?.file);
      setLocalLikeCount(res?.data?.data?.likes_count);
      setIsLiked(res.data?.data?.is_liked || false);
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  const fetchSavedPost = async () => {
    try {
      setIsSaveLoading(true);
      const res = await SaveBestpractices({ post_id: id });
      if (res?.success?.message?.toLowerCase().includes("unsave")) {
        setIs_saved(false);
        setSaved(false);
      } else if (res?.success) {
        setIs_saved(true);
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving/unsaving best practice:", error);
      showToast({
        message: "Failed to save post",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSaveLoading(false);
    }
  };

  const toggleFollowPost = async () => {
    try {
      setIsFollowLoading(true);
      const res = await SendBpFollowRequest({ bp_id: id });
      if (res?.success?.statusCode === 200) {
        const isNowFollowing = res?.data?.data !== null;
        setIsFollowing(isNowFollowing);
        showToast({
          message: isNowFollowing ? "Successfully followed" : "Successfully unfollowed",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      showToast({
        message: "Failed to update follow status",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      setIsAppreciateLoading(true);
      const res = await LikeBestpractices({ post_id: id });
      if (res?.success?.message?.includes("Unliked")) {
        setIsLiked(false);
        setLocalLikeCount((prev) => Math.max(0, Number(prev) - 1));
      } else if (res?.success) {
        setIsLiked(true);
        setLocalLikeCount((prev) => Number(prev) + 1);
        // if (triggerCreditAnimation && like) {
        //   triggerCreditAnimation(like, 10); // 10 credits for creating a comment
        // }
      }
    } catch (error) {
      console.error("Error liking/unliking the post:", error);
      showToast({
        message: "Failed to appreciate post",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsAppreciateLoading(false);
    }
  };

  // NEW: Handle comment like
  const handleCommentLike = async (commentId: string, post_id: any) => {
    try {
      // You'll need to create this API function
      await BPCommentLike({ comment_id: commentId, post_id: post_id });
      // Refresh comments to get updated like counts
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };
  const handleReplyCommentLike = async (
    commentId: string,
    post_id: any,
    id: any
  ) => {
    try {
      // You'll need to create this API function
      await CreateBestpracticesCommentReplyLike({
        child_comment_id: commentId,
        post_id: post_id,
        parent_comment_id: id,
      });
      fetchComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // NEW: Handle reply input
  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyText("");
    setReplyErrors((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleReplyChange = (event: any, commentId: string) => {
    setReplyText(event.target.value);
    if (replyErrors[commentId]) {
      setReplyErrors((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  const handleReplySubmit = async (commentId: string, post_id: any) => {
    try {
      if (!replyText.trim()) {
        setReplyErrors((prev) => ({
          ...prev,
          [commentId]: "Please enter a reply.",
        }));
        return;
      }

      // Start loading for this specific reply
      setIsReplyLoading((prev) => ({ ...prev, [commentId]: true }));

      // You'll need to create this API function
      await CreateBestpracticesCommentReply({
        comment_id: commentId,
        post_id: post_id,
        text: replyText,
      });

      setReplyingTo(null);
      setReplyText("");
      fetchComments(); // Refresh comments to show the new reply
      
      showToast({
        message: "Reply posted successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      showToast({
        message: "Failed to post reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      // End loading for this specific reply
      setIsReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleSort = () => setSortLatest(!sortLatest);
  const navigate = useNavigate();

  const fetchRelatedBestPractices = async () => {
    try {
      const response = await GetRelatedBestPractices(id);
      if (response?.data?.data?.rows) {
        setRelatedBestPractices(response.data.data.rows);
      }
    } catch (error: any) {
      console.error("Error fetching related best practices:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchRelatedBestPractices();
  }, []);

  const slugify = (str: string) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  return (
    <>
      <div className="w-full min-h-screen bg-[#F9F9FF]">
        {/* ======= Top Banner ======= */}
        <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] overflow-hidden relative">
          <img
            src={media ? media : blush}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ======= Page Container ======= */}
        <div className="max-w-7xl mx-auto -mt-10 sm:-mt-14 md:-mt-16 px-3 sm:px-6 md:px-8 relative z-10">
          <div className="bg-white rounded-[30px] shadow-lg border border-gray-200 p-5 sm:p-6 md:p-8">
            {/* ======= Breadcrumb + Icons ======= */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 mb-6 gap-3">
              {/* Breadcrumb */}
              <div className="flex flex-wrap items-center gap-2 text-gray-500">
                <img
                  src={home}
                  alt="Home"
                  className="w-[15px] h-[15px] cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                />
                <span className="text-dark text-[24px] sm:text-[30px] -mt-1.5 mx-1">
                  ›
                </span>
                <span
                  className="text-black text-[14px] cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() => navigate("/dashboard/bestpractices")}
                >
                  Best Practices
                </span>
                <span className="text-dark text-[24px] sm:text-[30px] -mt-1.5 mx-1">
                  ›
                </span>
                <span className="truncate text-[#8A8A8A]">
                  {singlepost?.profession_data?.title
                    ? singlepost?.profession_data?.title
                    : singlepost?.interest_data?.name}
                </span>
                <span className="text-dark text-[24px] sm:text-[30px] -mt-1.5 mx-1">
                  ›
                </span>
                <span className="truncate text-[#8A8A8A]">
                  {singlepost?.title}
                </span>
              </div>

              {/* Icons + Go Back */}
              <div className="flex flex-wrap items-center gap-3 text-gray-500">
                {/* Social Icons */}
                <div className="flex items-center gap-1 pr-4 border-r border-gray-300">
                  <button className="p-2 hover:text-[#7077FE] rounded-full transition">
                    <img src={cnessicon} alt="Light Mode" className="w-5 h-5" />
                  </button>

                  {/* Facebook */}
                  {singlepost?.profile?.social_links?.facebook && (
                    <a
                      href={singlepost.profile.social_links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:text-[#7077FE] rounded-full transition"
                    >
                      <FaFacebookF className="text-base" />
                    </a>
                  )}

                  {/* Twitter */}
                  {singlepost?.profile?.social_links?.twitter && (
                    <a
                      href={singlepost.profile.social_links.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:text-[#7077FE] rounded-full transition"
                    >
                      <FaTwitter className="text-base" />
                    </a>
                  )}

                  {/* LinkedIn */}
                  {singlepost?.profile?.social_links?.linkedin && (
                    <a
                      href={singlepost.profile.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:text-[#7077FE] rounded-full transition"
                    >
                      <FaLinkedinIn className="text-base" />
                    </a>
                  )}

                  {/* Instagram (if you want to add it later) */}
                  {singlepost?.profile?.social_links?.instagram && (
                    <a
                      href={singlepost.profile.social_links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:text-[#7077FE] rounded-full transition"
                    >
                      <FaInstagram className="text-base" />
                    </a>
                  )}
                </div>

                {/* Go Back Button */}
                <button
                  className="flex items-center gap-1 text-black border border-[#D77CFF] rounded-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-50 transition"
                  onClick={() => navigate("/dashboard/bestpractices")}
                >
                  Go Back
                </button>
              </div>
            </div>

            {/* ======= Header Section ======= */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-8">
                <p className="text-[#7177FE] text-sm font-medium">
                  {singlepost?.profession_data?.title
                    ? singlepost?.profession_data?.title
                    : singlepost?.interest_data?.name}
                </p>
                <h1 className="text-[34px] sm:text-3xl font-bold text-[#000000] mt-1 leading-snug">
                  {singlepost?.title}
                </h1>
              </div>

              {/* ======= Info Row - Grid Version ======= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10 relative">
                {/* Left Section - Post Info */}
                <div className="lg:col-span-7 xl:col-span-8 ">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
                    {/* Created By */}
                    <div className="flex items-center gap-3 py-2 relative">
                      <img
                        src="/profile.png"
                        alt="Author"
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {singlepost?.user?.username}
                        </p>
                        <p className="text-xs text-gray-500">Created By</p>
                      </div>
                      {/* Vertical line */}
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-[70px] w-px bg-[#E0E0E0] hidden sm:block"></div>
                    </div>

                    {/* Last Updated */}
                    <div className="flex flex-col items-start sm:items-center justify-center py-2 relative">
                      <p className="font-semibold text-gray-900">
                        {new Date(singlepost?.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      {/* Vertical line */}
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-[70px] w-px bg-[#E0E0E0] hidden sm:block"></div>
                    </div>

                    {/* Appreciate */}
                    <div className="flex justify-center gap-2 py-2 ml-6">
                      <div
                        className="flex items-center gap-1 text-base font-medium"
                        style={{
                          background:
                            "linear-gradient(129.46deg, #DB7DFF 4.29%, #7178FF 95.71%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        <img src={thumbs} alt="Likes" />
                        {localLikeCount}
                      </div>
                      <button
                        data-comment-button
                        onClick={handleLike}
                        disabled={isAppreciateLoading}
                        className={`flex border items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition whitespace-nowrap ${
                          isLiked
                            ? "border-[#7178FF] bg-[#7178FF] bg-opacity-10 text-white"
                            : "border-[#7B78FE] text-dark hover:bg-gray-100"
                        } ${isAppreciateLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isAppreciateLoading ? (
                          <div className="w-4 h-4 border-2 border-[#7178FF] border-t-transparent rounded-full animate-spin"></div>
                        ) : isLiked ? (
                          "Appreciated"
                        ) : (
                          "Appreciate"
                        )}
                      </button>
                      {animations.map((anim) => (
                        <CreditAnimation
                          key={anim.id}
                          from={anim.from}
                          to={anim.to}
                          amount={anim.amount}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 left-[70%] top-1/2 transform -translate-y-1/2 h-[70px] w-px bg-[#E0E0E0] hidden sm:block"></div>
                {/* Right Section - Actions */}
                <div className="lg:col-span-5 xl:col-span-4 ">
                  <div className="flex items-center justify-start sm:justify-end gap-3 h-full">
                    <button
                      onClick={fetchSavedPost}
                      disabled={isSaveLoading}
                      className={`flex items-center gap-2 text-black text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 whitespace-nowrap ${
                        isSaveLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSaveLoading ? (
                        <div className="w-4 h-4 border-2 border-[#D77CFF] border-t-transparent rounded-full animate-spin"></div>
                      ) : isSaved ? (
                        <FaBookmark className="text-base text-[#D77CFF]" />
                      ) : (
                        <FaRegBookmark className="text-base text-[#D77CFF]" />
                      )}
                      {isSaveLoading ? "Saving..." : isSaved ? "Saved" : "Save"}
                    </button>

                    <button
                      onClick={toggleFollowPost}
                      disabled={isFollowLoading}
                      className={`text-white px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
                        isFollowLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        background:
                          "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                      }}
                    >
                      {isFollowLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : isFollowing ? (
                        "Following"
                      ) : (
                        "+ Follow"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ======= Main Content Grid ======= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: Article Section */}
                <div className="lg:col-span-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {singlepost?.tags &&
                      singlepost?.tags.map((tag: any) => (
                        <span
                          key={tag}
                          className="text-xs font-normal text-[#8A8A8A] bg-gray-100 px-2.5 py-[5px] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Article Body */}
                  <div
                    className="rich-text-content text-gray-800 leading-relaxed text-sm sm:text-base
                               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                               [&_li]:my-1 [&_li]:pl-1
                               [&_p]:my-3
                               [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
                               [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3
                               [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2
                               [&_strong]:font-bold
                               [&_em]:italic
                               [&_u]:underline"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(singlepost.description),
                    }}
                  ></div>

                  {/* ======= Comment Section ======= */}
                  <div className="mt-10 border-t border-gray-200 pt-6">
                    <div className="text-xs text-gray-500 mb-2 flex items-center space-x-2">
                      <span>Signed in as:</span>
                      <img
                        src={profile_picture}
                        alt="User avatar"
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "/profile.png";
                        }}
                      />
                      <span className="font-semibold text-gray-700">
                        {name || ""}
                      </span>
                    </div>

                    {/* Comment Input */}
                    <div className="border border-[#E0E0E0] rounded-[20px] p-3 mb-3">
                      <textarea
                        placeholder="Post a comment..."
                        rows={4}
                        value={comment}
                        onChange={handleCommentChange}
                        disabled={isCommentLoading} // Disable textarea during loading
                        className={`w-full border-none focus:ring-0 focus:outline-none text-sm resize-none ${
                          isCommentLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      ></textarea>

                      {commentError && (
                        <p className="text-red-500 text-xs mt-1">
                          {commentError}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row justify-end items-end text-xs text-gray-400 gap-2">
                        <span>
                          {2000 - comment.length} Characters remaining
                        </span>
                        <button
                          onClick={handleCommentSubmit}
                          disabled={isCommentLoading}
                          className={`bg-linear-to-r me-2 from-purple-500 to-pink-400 text-white px-4 py-2 pb-2 rounded-full text-sm flex items-center gap-2 ${
                            isCommentLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          style={{
                            background:
                              "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                          }}
                        >
                          {isCommentLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Posting...
                            </>
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-[14px] text-gray-500 mb-4 italic">
                      Please note that this community is actively moderated
                      according to{" "}
                      <span className="text-indigo-500 cursor-pointer hover:underline">
                        CNESS
                      </span>{" "}
                      community rules.
                    </p>

                    {/* Comments List Header */}
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-[16px] font-semibold text-gray-700">
                        All Comments ({commentCount})
                      </h3>
                      <button
                        onClick={toggleSort}
                        className="flex items-center space-x-1 text-[16px] text-black hover:text-gray-700 transition"
                      >
                        <span>
                          {sortLatest ? "Latest Comments" : "Oldest Comments"}
                        </span>
                        {sortLatest ? (
                          <ChevronDownIcon className="w-4 h-4" />
                        ) : (
                          <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                      {postComment.length > 0 ? (
        renderComments()
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      )}
                    </div>
                  </div>
                </div>

                {/* ======= RIGHT: Related Section ======= */}
                <aside className="lg:col-span-4 bg-[#F9F9F9] rounded-[30px] shadow-sm p-4 h-fit">
                  <h3 className="font-semibold text-gray-900 text-[20px] mb-4">
                    Related Best Practices
                  </h3>
                  <div className="space-y-3">
                    {relatedBestPractices.length > 0 ? (
                      relatedBestPractices.map((practice) => (
                        <div
                          key={practice.id}
                          className="flex gap-3 items-start p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            navigate(
                              `/dashboard/bestpractices/${
                                practice.id
                              }/${slugify(practice.title)}`
                            );
                          }}
                        >
                          <img
                            src={practice.file || image1}
                            alt={practice.title}
                            className="w-15 h-15 rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-[13px] line-clamp-2">
                              {practice.title}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1 line-clamp-2 break-all">
                              {/* Create a text-only version of the description by stripping HTML tags */}
                              {practice.description
                                ?.replace(/<[^>]*>/g, "")
                                .substring(0, 50)}
                              ...
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No related best practices found
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBP;