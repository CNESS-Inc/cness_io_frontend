import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, CircleCheckBig, Trash2, Maximize } from "lucide-react";

interface Connection {
  id: string | number;
  name: string;
  username: string;
  profileImage: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number | string;
  conversationId?: string | number;
}

type FriendCardProps = {
  image: string;
  name: string;
  username: string;
  connection: Connection;
  actions?: Array<"chat" | "accept" | "reject">;
  onChat?: (connection: Connection) => void;
  onAccept?: () => void;
  onReject?: () => void;
  onMaximize?: () => void;
};

const FriendCard: React.FC<FriendCardProps> = ({
  image,
  name,
  username,
  connection,
  actions = [],
  onChat,
  onAccept,
  onReject,
  onMaximize,
}) => {
  const navigate = useNavigate();
  const profileImage = image && image.trim() !== "" ? image : "/profile.png";

  // Function to handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).tagName === "BUTTON"
    ) {
      return;
    }
    
    // Navigate to user profile page
    navigate(`/dashboard/social/user-profile/${connection.id}`);
  };

  // Function to handle maximize button click
  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onMaximize) onMaximize();
  };

  // Function to handle chat button click
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onChat) onChat(connection);
  };

  // Function to handle accept button click
  const handleAcceptClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onAccept) onAccept();
  };

  // Function to handle reject button click
  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onReject) onReject();
  };

  return (
    <div 
      className="flex-none bg-white w-full lg:max-w-full max-w-[263px] h-[291px] rounded-xl p-3 pb-[18px] shadow border border-gray-200 mx-auto cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
    >
      {/* Image */}
      <div className="relative w-full h-[209px] xs:h-[160px]">
        <img
          src={
            !profileImage ||
              profileImage === "null" ||
              profileImage === "undefined" ||
              !profileImage.startsWith("http") ||
              profileImage === "http://localhost:5026/file/"
              ? '/profile.png'
              : profileImage
          }
          alt={name}
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          onClick={handleMaximizeClick}
          className="absolute top-2 right-2 bg-white p-1 rounded-lg shadow hover:bg-gray-100"
          aria-label="Maximize"
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Info + Actions */}
      <div className="mt-3 flex items-center justify-between gap-1">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{name}</p>
          <p className="text-gray-500 text-xs sm:text-sm truncate">@{username}</p>
        </div>

        <div className="flex gap-2">
          {actions.includes("chat") && (
            <button
              onClick={handleChatClick}
              className="p-2 rounded-full bg-[#7077FE] text-white hover:opacity-90"
              aria-label="Chat"
            >
              <MessageCircle size={16} />
            </button>
          )}
          {actions.includes("accept") && (
            <button
              onClick={handleAcceptClick}
              className="p-2 rounded-lg bg-[#31C48D] text-white hover:opacity-90"
              aria-label="Accept"
            >
              <CircleCheckBig size={16} />
            </button>
          )}
          {actions.includes("reject") && (
            <button
              onClick={handleRejectClick}
              className="p-2 rounded-lg bg-[#F87171] text-white hover:opacity-90"
              aria-label="Reject"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;