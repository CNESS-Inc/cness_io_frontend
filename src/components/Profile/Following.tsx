// components/FollowingModal.tsx
import { useState, useEffect } from "react";
import { X, Search, Users } from "lucide-react";
import { SendFollowRequest } from "../../Common/ServerAPI";
import { useNavigate } from "react-router-dom";

type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  following?: boolean;
};

export default function FollowingModal({
  userProfile,
  open,
  onClose,
  friends,
}: {
  userProfile?: any;
  open: boolean;
  onClose: () => void;
  friends: Friend[];
}) {
  const [localFriends, setLocalFriends] = useState<Friend[]>([]);
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem("Id");

  useEffect(() => {
    setLocalFriends(friends);
  }, [friends, open]);

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      await SendFollowRequest(formattedData);
      // Remove the unfollowed user from the local state
      setLocalFriends((prev) => prev.filter((f) => f.id !== userId));
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  if (!open) return null;

  const userProfileNavigation = (id: any) => {
    if(loggedInUserID === id){
    navigate(`/dashboard/Profile`);
    }else{
    navigate(`/dashboard/social/user-profile/${id}`);
    }
    onClose()
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* panel */}
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
          {/* Title & Close */}
          <div className="relative flex items-center justify-center w-full  bg-[#897AFF1A] py-6">
            {/* Left icon */}
            <div className="absolute left-6 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
              <Users className="w-5 h-5 text-[#7C81FF]" />
            </div>

            {/* Center text */}
            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "16.77px",
                lineHeight: "100%",
                color: "#7C81FF",
              }}
            >
              Following
            </div>

            {/* Right close button */}
            <button
              onClick={onClose}
              className="absolute right-6 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#FF4D94]" />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
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
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto px-6 py-1">
            <ul className="space-y-4">
              {localFriends.map((f) => (
                <li key={f.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => userProfileNavigation(f.id)}
                    >
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
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
                  {!userProfile && (
                    <button
                      className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF]"
                      onClick={() => handleFollow(f.id)}
                    >
                      Unfollow
                    </button>
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
