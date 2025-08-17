import React, { useState, useEffect } from "react";
import {
 GetComment,
 PostComments,
} from "../../Common/ServerAPI";
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
  media: Media;
  images?: string[]; // for multi-image support
  comments?: Comment[];
}

interface PopupProps {
  post: Post;
  onClose: () => void;
}

const PostPopup: React.FC<PopupProps> = ({ post, onClose }) => {

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);

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
          user: item.profile.first_name + item.profile.last_name  || "Unknown",
          userimage: item.profile.profile_picture || "",
          text: item.text || "",
          time: timeAgo(item.createdAt), // You can use a helper to format time
        }));
        setComments(mapped);
      }).catch(() => setComments([]));
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
  const handlePrev = () => setCurrentImage((prev) => (images ? (prev - 1 + images.length) % images.length : 0));
  const handleNext = () => setCurrentImage((prev) => (images ? (prev + 1) % images.length : 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Outer container */}
      <div
        className="flex justify-between bg-black"
        style={{
          width: 1301,
          height: 816,
          paddingLeft: 32,
        }}
      >
        {/* Left side - media */}
        <div
          className="flex items-center justify-center bg-white"
          style={{
            width: 610,
            height: 816,
            padding: 24,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          {/* Image carousel */}
          {images ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[currentImage]}
                alt={post.media.alt || ""}
                className="w-full h-full object-cover rounded-lg"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-70 rounded-full px-3 py-1 text-xl"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 bg-opacity-70 rounded-full px-3 py-1 text-xl"
                  >
                    &#8594;
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? "bg-blue-500" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : post.media.type === "image" ? (
            <img
              src={post.media.src}
              alt={post.media.alt || ""}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : post.media.type === "video" ? (
            <video
              src={post.media.src}
              poster={post.media.poster}
              controls
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <p className="text-gray-800 text-base leading-relaxed">
                {post.media.src}
              </p>
            </div>
          )}
        </div>

        {/* Right side - comments */}
        <div
          className="flex flex-col bg-white overflow-y-auto"
          style={{
            width: 610,
            height: 816,
            paddingRight: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            gap: 24,
          }}
        >
          {/* Close button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Comments section */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {comments.map((comment, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
                  <img 
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  src={comment.userimage}
                  />
                </div>
                {/* Comment content */}
                <div>
                  <div className="text-sm font-semibold">{comment.user}</div>
                  <div className="text-sm text-gray-500 mb-1">
                    {comment.time}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add comment input */}
          <div className="mt-auto flex gap-2">
            <input
              type="text"
              placeholder="Add a Reflection..."
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              disabled={posting}
            />
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