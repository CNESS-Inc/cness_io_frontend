import { useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

interface FollowButtonProps {
  user_id: any;
  isFollowing: any;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user_id,isFollowing }) => {
  console.log("🚀 ~ isFollowing:", isFollowing)
  const [loading, setLoading] = useState<boolean>(false);
  const [is_Following, set_IsFollowing] = useState<boolean>(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const formattedData = {
        following_id: user_id,
      };
      // const res = await dispatch(
      //   apiCall("POST", "/user/follow", "follow", formattedData)
      // );
      // console.log("🚀 ~ handleSendConnectionRequest ~ res:", res);
      // set_IsFollowing(res?.success?.status)
    } catch (error) {
      console.error("Error fetching selection details:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`flex items-center space-x-2 font-semibold py-1 ms-1 px-3 rounded-md ${
        isFollowing || is_Following
          ? "bg-gray-300 text-black"
          : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white "
      } focus:outline-none focus:ring-2 `}
    >
      {isFollowing || is_Following ? (
        <>
          <FaArrowTrendUp className="mr-2" />
          <span>Following</span>
        </>
      ) : (
        <span>{loading ? "Following..." : "Follow"}</span>
      )}
    </button>
  );
};

export default FollowButton;
