import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  BPCommentLike,
  CreateBestpracticesCommentReply,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const CommentCard = ({ comment, depth = 0, fetchComments }: any) => {
  const [replayComment, setReplayComment] = useState("");
  const [likeCount, setLikeCount] = useState(comment?.likes_count);
  const [showReplayCommenent, setShowReplayCommenent] = useState(false);
  const { showToast } = useToast();

  const handlebpcommentlike = async (post_id: any, comment_id: any) => {
    try {
      const formattedData = {
        post_id: post_id,
        comment_id: comment_id,
      };
      const res = await BPCommentLike(formattedData);
      if (res?.success?.message?.includes("Unliked")) {
        setLikeCount((prev: any) => Math.max(0, Number(prev) - 1));
      } else if (res?.success) {
        setLikeCount((prev: any) => Number(prev) + 1);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handlebpcommentreplay = async (_id: any) => {
    try {
      if (replayComment != "") {
        const formattedData = {
          text: replayComment,
          post_id: comment?.post_id,
          comment_id: comment?.id,
        };
        await CreateBestpracticesCommentReply(formattedData);
        setShowReplayCommenent(!showReplayCommenent);
        fetchComments();
        setReplayComment("");
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <div
      className={`flex items-start border-b border-gray-200 py-4 ml-${
        depth * 4
      }`}
    >
      <LazyLoadImage
        src={
          comment?.profile?.profile_picture || "https://via.placeholder.com/156"
        }
        alt={comment?.profile?.first_name}
        className="w-12 h-12 rounded-full object-cover mr-4"
        effect="blur"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/profile.png";
        }}
      />

      <div className="flex-1">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">
            {comment?.profile?.first_name} {comment?.profile?.last_name}
          </h3>
          <p className="text-gray-700">{comment.text}</p>
        </div>

        {showReplayCommenent == false ? (
          <div className="flex space-x-4 text-blue-500 text-sm">
            {/* Only show Reply button for top-level comments (depth === 0) */}
            {depth === 0 && (
              <button
                onClick={(_e) => setShowReplayCommenent(!showReplayCommenent)}
                className="hover:underline"
              >
                Reply
              </button>
            )}
            {depth === 0 && (
            <button
              onClick={(_e) =>
                handlebpcommentlike(comment?.post_id, comment?.id)
              }
              className="hover:underline"
            >
              Like({likeCount})
            </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full rounded-lg">
            <input
              type="text"
              placeholder="Add a comment..."
              value={replayComment}
              onChange={(e) => setReplayComment(e.target.value)}
              className="w-full bg-white rounded-full border border-gray-300 px-5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6269FF] shadow-sm"
            />
            <button
              onClick={(_e) => handlebpcommentreplay(comment?.id)}
              className="bg-[#7077FE] hover:bg-[#6269FF] text-white text-sm font-medium px-5 py-2 rounded-full shadow"
            >
              Comment
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply: any) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                depth={depth + 1}
                fetchComments={fetchComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
