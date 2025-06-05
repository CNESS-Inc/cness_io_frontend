import React, { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { toast } from "react-toastify";
import { PostsLike } from "../../Common/ServerAPI";

interface PostLikeButtonProps {
    postId: any;
    isLiked: boolean;
    likeCount: any;
}

const PostLikeButton: React.FC<PostLikeButtonProps> = ({  postId, isLiked, likeCount}) => {
    const [localIsLiked, setLocalIsLiked] = useState<boolean>(isLiked);
    const [localLikeCount, setLocalLikeCount] = useState<number>(likeCount);

    const handleLikeClick = async () => {
        try {
            const formattedData = { post_id: postId };
            const res = await PostsLike(formattedData)
            setLocalIsLiked(!localIsLiked);
            // console.log("🚀 ~ handleLikeClick ~ res:", res)
            // toast?.success(res?.success?.message)
            setLocalLikeCount(localIsLiked ? localLikeCount - 1 : localLikeCount + 1);
        } catch (error) {
            console.error("Error fetching like details:", error);
        }
    };
    return (
        <button onClick={handleLikeClick} className="flex items-center" style={{ cursor: "pointer" }}>
            {localIsLiked ? (
                <FaThumbsUp className="text-[#7077FE] text-[25px]" />
            ) : (
                <FaRegThumbsUp className="text-[#7077FE] text-[25px]" />
            )}
            <span className="ml-1">{localLikeCount}</span>
        </button>
    );
};

export default PostLikeButton;
