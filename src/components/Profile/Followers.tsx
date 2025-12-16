// components/FollowersModal.tsx
import { X, Search, Users } from "lucide-react";
//import { useState } from "react";
import { SendFollowRequest } from "../../Common/ServerAPI";

type Follower = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isFollowing?: boolean;
};

export default function FollowersModal({
  userProfile,
  open,
  onClose,
  followers,
}: {
  userProfile?:any;
  open: boolean;
  onClose: () => void;
  followers: Follower[];
}) {
  if (!open) return null;

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      await SendFollowRequest(formattedData);
      
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Centered panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-[18px] border border-gray-200 shadow-xl flex flex-col"
          style={{
            width: "591px",
            height: "616px",
            paddingBottom: "52px",
            gap: "24px",
          }}
        >
          {/* Header */}
          <div className="relative flex items-center justify-center w-full bg-[#897AFF1A] py-6 rounded-t-[18px]">
            {/* Left icon */}
            <div className="absolute left-6 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
              <Users className="w-5 h-5 text-[#7C81FF]" />
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "16.77px",
                lineHeight: "100%",
                color: "#7C81FF",
              }}
            >
              Followers
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-6 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#FF4D94]" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative px-6">
            <input
              placeholder="Search..."
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                fontSize: "11.74px",
                lineHeight: "100%",
              }}
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-5 pr-10 outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <Search className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-1">
            <ul className="space-y-4">
              {followers.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 500,
                          fontSize: "16.77px",
                          lineHeight: "100%",
                        }}
                        className="text-gray-900"
                      >
                        {f.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontWeight: 400,
                          fontSize: "11.74px",
                          lineHeight: "100%",
                        }}
                        className="text-gray-500"
                      >
                        @{f.handle}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                 {!userProfile && (
                    <div className="flex gap-2">
                      {!f.isFollowing ? (
                        <button 
                          className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#7077FE] hover:bg-[#6A6DEB]" 
                          onClick={() => handleFollow(f.id)}
                        >
                          + Follow
                        </button>
                      ) : (
                        <button className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF]">
                          Following
                        </button>
                      )}
                      <button className="px-5 py-1.5 rounded-full border border-gray-300 text-[13px] font-medium text-gray-700 hover:bg-gray-50">
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
