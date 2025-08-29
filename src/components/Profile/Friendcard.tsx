import React from "react";
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
  onChat?: (connection: Connection) => void; // Update this prop
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
  return (
    <div className="flex-none bg-white w-full lg:max-w-[100%] max-w-[263px] h-[291px] rounded-[12px] p-[12px] pb-[18px] shadow border border-gray-200 mx-auto">
      {/* Image */}
      <div className="relative w-full h-[209px] xs:h-[160px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[12px]"
        />
        <button
          onClick={onMaximize}
          className="absolute top-2 right-2 bg-white p-1 rounded-lg shadow hover:bg-gray-100"
          aria-label="Maximize"
        >
          <Maximize size={16} />
        </button>
      </div>

      {/* Info + Actions */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm sm:text-base">{name}</p>
          <p className="text-gray-500 text-xs sm:text-sm">@{username}</p>
        </div>

        <div className="flex gap-2">
          {actions.includes("chat") && (
            <button
              onClick={() => onChat?.(connection)} // Pass connection to callback
              className="p-2 rounded-full bg-[#7077FE] text-white hover:opacity-90"
              aria-label="Chat"
            >
              <MessageCircle size={16} />
            </button>
          )}
          {actions.includes("accept") && (
            <button
              onClick={onAccept}
              className="p-2 rounded-lg bg-[#31C48D] text-white hover:opacity-90"
              aria-label="Accept"
            >
              <CircleCheckBig size={16} />
            </button>
          )}
          {actions.includes("reject") && (
            <button
              onClick={onReject}
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