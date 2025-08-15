import React from "react";
import { MessageCircle, CircleCheckBig, Trash2, Maximize } from "lucide-react";

type FriendCardProps = {
  image: string;
  name: string;
  username: string;
  actions?: Array<"chat" | "accept" | "reject">;
  onChat?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
   onMaximize?: () => void;
};

const FriendCard: React.FC<FriendCardProps> = ({
  image,
  name,
  username,
  actions = [], // default: no buttons
  onChat,
  onAccept,
  onReject,
  onMaximize,
}) => {
  return (
    <div className="bg-white w-[263px] h-[291px] rounded-[12px] p-[12px] pb-[18px] shadow border border-gray-200">
      {/* Image */}
      <div className="relative w-[239px] h-[209px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[12px]"
        />
      <button
  onClick={onMaximize} // Trigger parent handler
  className="absolute top-2 right-2 bg-white p-1 rounded-lg shadow hover:bg-gray-100"
>
  <Maximize size={16} />
</button>
      </div>

      {/* Info + Actions in one row */}
      <div className="mt-3 flex items-center justify-between">
        {/* Name + Username */}
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-gray-500 text-sm">@{username}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {actions.includes("chat") && (
            <button
              onClick={onChat}
              className="p-2 rounded-full bg-[#7077FE] text-white hover:opacity-90"
            >
              <MessageCircle size={16} />
            </button>
          )}
          {actions.includes("accept") && (
            <button
              onClick={onAccept}
              className="p-2 rounded-lg bg-[#31C48D] text-white  hover:opacity-90"
            >
              <CircleCheckBig size={16} />
            </button>
          )}
          {actions.includes("reject") && (
            <button
              onClick={onReject}
              className="p-2 rounded-lg bg-[#F87171] text-white hover:opacity-90"
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
