import { useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { SendFollowRequest } from "../../../Common/ServerAPI";
import Button from "../../ui/Button";

interface FollowButtonProps {
  user_id: any;
  isFollowing: any;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  user_id,
  isFollowing,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [is_Following, set_IsFollowing] = useState<boolean>(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const formattedData = {
        following_id: user_id,
      };
      const res = await SendFollowRequest(formattedData);
      set_IsFollowing(res?.success?.status);
    } catch (error) {
      console.error("Error fetching selection details:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFollow}
      variant="gradient-primary"
      className={`rounded-[100px] py-1 px-4 self-stretch transition-colors duration-500 ease-in-out flex items-center space-x-2 font-semibold ms-1 ${
        isFollowing || is_Following ? "bg-gray-300 text-black" : "text-white"
      }`}
    >
      {isFollowing || is_Following ? (
        <>
          <FaArrowTrendUp className="mr-2" />
          <span>Following</span>
        </>
      ) : (
        <span>{loading ? "Following..." : "Follow"}</span>
      )}
    </Button>
  );
};

export default FollowButton;
