import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GetFollowingUser } from "../../../Common/ServerAPI";

interface DreamBuilder {
  userId: string;
  userDocumentId: string;
  profile?: {
    profile_picture?: string;
    first_name?: string;
    last_name?: string;
    user_id?: string;
  };
}

const MyDreamBuilders: React.FC = () => {
  const [dreambuilders, setDreamBuilders] = useState<DreamBuilder[]>([]);
  const navigate = useNavigate();

  // Static data instead of API call
  const staticDreamBuilders: DreamBuilder[] = [
    {
      userId: "1",
      userDocumentId: "doc1",
      profile: {
        profile_picture: "https://example.com/user1.jpg",
        first_name: "John",
        last_name: "Doe",
        user_id: "1",
      },
    },
    {
      userId: "2",
      userDocumentId: "doc2",
      profile: {
        profile_picture: "https://example.com/user2.jpg",
        first_name: "Jane",
        last_name: "Smith",
        user_id: "2",
      },
    },
    {
      userId: "3",
      userDocumentId: "doc3",
      profile: {
        profile_picture: "https://example.com/user3.jpg",
        first_name: "Bob",
        last_name: "Johnson",
        user_id: "3",
      },
    },
  ];

  const getDreamBuilder = async () => {
    try {
      const res = await GetFollowingUser();
      setDreamBuilders(res);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleProfileClick = (user_id: string) => {
    // navigate(`/profile/public?id=${user_id}`);
  };

  useEffect(() => {
    getDreamBuilder();
  }, []);

  return (
    <>
      <h3 className="size-4 text-nowrap text-[#7077FE] mb-6">My favorites</h3>
      <ul className="mb-4 space-y-4">
        {dreambuilders.length > 0 ? (
          dreambuilders.map((user, index) => (
            <li
              key={index}
              className="flex items-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleProfileClick(user.profile?.user_id || "")}
            >
              <span
                className={`w-2 h-2 rounded-full mr-3 ${
                  user ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <LazyLoadImage
                className="w-8 h-8 mr-3 rounded-full"
                src={user.profile?.profile_picture}
                alt={user.profile?.first_name || "User"}
                effect="blur"
              />
              <span className="text-black size-4 text-nowrap">
                {`${user.profile?.first_name ?? ""} ${
                  user.profile?.last_name ?? ""
                }`.trim() || "Unknown User"}
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

export default MyDreamBuilders;
