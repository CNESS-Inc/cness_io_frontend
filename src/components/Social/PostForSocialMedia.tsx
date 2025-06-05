import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {LazyLoadImage } from "react-lazy-load-image-component";
import { GetTrendingPost } from "../../Common/ServerAPI";
import LoadingSpinner from "../ui/LoadingSpinner";

export default function PostForSocialMedia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [postData, setPostData] = useState<any[]>([]);

  const GetPostData = async () => {
    setLoading(true);
    try {
      const res = await GetTrendingPost()
      if (res?.success?.status) {
        setPostData(res?.data?.data?.rows); // Ensure it's an array
      } else {
        console.log("Error fetching post");
      }
    } catch (error) {
      console.error("Error fetching selection details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetPostData();
  }, []);

  const handleReadMore = (id: string) => {
    navigate(`/social/singlepost?id=${id}`);
  };

  return (
    <div
      className="grid grid-cols-1 gap-6 overflow-y-auto"
      style={{
        maxHeight: "500px",
        scrollbarWidth: "thin" /* For Firefox */,
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : postData.length > 0 ? (
        <>
          {postData?.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg shadow p-2 mx-auto"
              style={{ width: "87%" }}
            >
              <div className="flex-1">
                {/* <img className="w-full max-h-[500px] rounded-lg object-contain" src={post.file} alt="User Post" /> */}
                <LazyLoadImage
                  className="w-full max-h-[500px] rounded-lg object-contain"
                  src={post.file}
                  alt="User Post"
                  effect="blur" // Options: "blur", "opacity", "black-and-white"
                />
                <p className="mt-2 text-gray-700 line-clamp-1 overflow-hidden">
                  {post.content}
                </p>
                <button
                  onClick={() => handleReadMore(post.id)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Read more...
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p className="text-gray-600 mt-4">No posts available.</p>
      )}
    </div>
  );
}
