import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { GetConnectionUser } from "../../../Common/ServerAPI";

interface User {
  userId: string;
  userDocumentId: string;
  username: string;
  thumbnail?: string;
  friend_user?: {
    profile: {
      user_id: string;
      first_name: string;
      last_name: string;
      profile_picture?: string;
    };
  };
}

const MyConnections: React.FC = () => {
  const [connections, setConnections] = useState<any>([]);

  const getConnections = async () => {
    try {
      const res = await GetConnectionUser()
      setConnections(res)
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  const navigate = useNavigate();

  const handleProfileClick = (user_id: string) => {
    // navigate(`/profile/public?id=${user_id}`);
  };

  return (
    <>
      <h3 className="size-4 text-nowrap text-[#7077FE] mb-6">My Connections</h3>
      <ul className="mb-4 space-y-4">
        {Array.isArray(connections?.data?.data?.rows) && connections?.data?.data?.rows.length > 0 ? (
          connections?.data?.data?.rows?.map((user: any, index: any) => (
            <li
              key={index}
              className="flex items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleProfileClick(user?.friend_user?.profile?.user_id)}
            >
              <span
                className={`w-2 h-2 rounded-full mr-3 ${user ? "bg-green-500" : "bg-gray-400"}`}
              />

              {user?.friend_user?.profile?.profile_picture ? (
                <LazyLoadImage
                  className="w-8 h-8 mr-3 rounded-full"
                  src={user?.friend_user?.profile?.profile_picture}
                  alt={user?.friend_user?.profile?.first_name || "User"}
                  effect="blur"
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gray-200 rounded-full">
                  <span className="px-2 text-black">
                    {user?.friend_user?.profile?.first_name?.charAt(0) || "U"}
                  </span>
                </div>
              )}

              <span className="text-black size-4 text-nowrap">
                {`${user.friend_user.profile.first_name ?? ""} ${user.friend_user.profile.last_name ?? ""}`.trim() || "Unknown User"}
              </span>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </>
  );
};

export default MyConnections;