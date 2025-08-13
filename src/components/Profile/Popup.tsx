import React from "react";

interface Media {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

interface Comment {
  user: string;
  text: string;
  time: string;
}

interface Post {
  id: string;
  media: Media;
  comments?: Comment[];
}

interface PopupProps {
  post: Post;
  onClose: () => void;
}

const PostPopup: React.FC<PopupProps> = ({ post, onClose }) => {
  // Fallback comments if none provided
  const comments = post.comments || [
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
  ];

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
          {post.media.type === "image" ? (
            <img
              src={post.media.src}
              alt={post.media.alt || ""}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <video
              src={post.media.src}
              poster={post.media.poster}
              controls
              className="w-full h-full object-cover rounded-lg"
            />
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
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
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
            />
            <button className="bg-[#7077FE] text-white rounded-full px-8 py-2 text-sm">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
