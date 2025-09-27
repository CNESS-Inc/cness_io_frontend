import { useEffect, useState } from "react";
// import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  GetSingleBestPractice,
  LikeBestpractices,
  SaveBestpractices,
  CreateBestpracticesComment,
  GetBestpracticesComment,
  SendBpFollowRequest,
  //GetBestpracticesComment
} from "../Common/ServerAPI";
import blush from "../assets/Blush.png";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { BiComment, BiLike } from "react-icons/bi";
import { iconMap } from "../assets/icons";
import CommentCard from "./CommentCard";
//import { useLocation } from "react-router-dom";

const dummyProfilePicture =
  "data:image/jpeg;base64,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";

const SingleBP = () => {
  const [isSaved, setIs_saved] = useState<boolean>(false);

  useEffect(() => {
    // getUserPosts();
    fetchComments();
  }, []);

  const [commentCount, setCommentCount] = useState(0);
  const [comment, setComment] = useState("");
  const [postComment, setPostComment] = useState<any>("");
  const [commentError, setCommentError] = useState("");
  const [singlepost, setSinglePost] = useState<any>({});
  const [media, setMedia] = useState<string>("");
  const [_saved, setSaved] = useState(false);
  const [_localLikeCount, setLocalLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  //const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  const handleCommentChange = (event: any) => {
    setComment(event.target.value);

    if (commentError) {
      setCommentError("");
    }
  };

  // const { id } = getQueryParams();
  const { id } = useParams();
  useEffect(() => {
    fetchSinglePost(id);
  }, []);
  const fetchComments = async () => {
    try {
      if (!id) throw new Error("Post ID is required"); // Add validation
      const res = await GetBestpracticesComment({ post_id: id });
      setPostComment(res?.data?.data?.rows || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (_bpid?: any) => {
    try {
      if (!comment.trim()) {
        setCommentError("Please enter a comment."); // set error message
        return;
      }
      const payload = {
        post_id: id,
        text: comment,
      };
      await CreateBestpracticesComment(payload);
      setCommentCount(commentCount + 1);
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const fetchSinglePost = async (id: any) => {
    try {
      const res = await GetSingleBestPractice(id);
      setCommentCount(res.data?.data?.comments_count);
      setIs_saved(res.data?.data?.is_saved);
      setIsFollowing(res.data?.data?.is_bp_following);
      setSinglePost(res?.data?.data);
      setMedia(res?.data?.data?.file);
      setLocalLikeCount(res?.data?.data?.likes_count);
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  //   const fetchLike = async () => {
  //     // try {
  //     //   const formattedData = {
  //     //     data: {
  //     //       post: id,
  //     //     },
  //     //   };
  //     //   const res = await PostsLike(formattedData);
  //     //   if (res.status == "alreadyLiked") {
  //     //     toast.info("Already Liked");
  //     //   } else {
  //     //     toast.success("Liked the post!");
  //     //     setLiked(true);
  //     //     setLocalLikeCount((old) => Number(old) + 1);
  //     //   }
  //     // } catch (error) {
  //     //   console.error("Error fetching selection details:", error);
  //     // }
  //   };

  const fetchSavedPost = async () => {
    try {
      const res = await SaveBestpractices({ post_id: id });

      if (res?.success?.message?.toLowerCase().includes("unsave")) {
        setIs_saved(false);
        setSaved(false);
      } else if (res?.success) {
        setIs_saved(true);
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving/unsaving best practice:", error);
    }
  };

  const toggleFollowPost = async () => {
    try {
      const res = await SendBpFollowRequest({ bp_id: id });

      if (res?.success?.statusCode === 200) {
        const isNowFollowing = res?.data?.data !== null;
        setIsFollowing(isNowFollowing);
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  //   const navigate = useNavigate();

  //const handleProfileClick = () => {
  // navigate(`/directory/user-profile/${singlepost?.user_id}`);
  // };

  const handleLike = async () => {
    try {
      const res = await LikeBestpractices({ post_id: id });

      if (res?.success?.message?.includes("Unliked")) {
        setIsLiked(false);
        setLocalLikeCount((prev) => Math.max(0, Number(prev) - 1));
      } else if (res?.success) {
        setIsLiked(true);
        setLocalLikeCount((prev) => Number(prev) + 1);
      }
    } catch (error) {
      console.error("Error liking/unliking the post:", error);
    }
  };

  {
    /*const location = useLocation();

useEffect(() => {
  if (location.state?.likesCount !== undefined) {
    setLocalLikeCount(location.state.likesCount);
  }
  if (location.state?.isLiked !== undefined) {
    setIsLiked(location.state.isLiked);
  }
  fetchSinglePost(id);
}, [id]);
*/
  }
  return (
    <>
      <div className="w-full min-h-screen bg-[#F3f1ff] pb-10">
        {" "}
        {/* ← Gray background wrapper */}
        <div className="w-full flex flex-col gap-6">
          {/* Top Default Banner */}
          <div className="relative w-full min-h-[300px] bg-[#F3f1ff">
            {/* Top Banner */}
            <div className="w-full h-[200px] overflow-hidden">
              <img
                src={blush}
                alt="banner"
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <div className="absolute inset-0 flex items-start justify-center pt-6 sm:pt-8">
                <h1 className="text-white text-xl sm:text-3xl md:text-4xl font-semibold drop-shadow-lg text-center">
                  {singlepost.title || "Best Practices"}
                </h1>
              </div>
            </div>

            {/* User Banner */}
            {media &&
              media !== "http://localhost:5026/file/" &&
              !media.endsWith("/file/") && (
                <div className="absolute top-[140px] left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] z-10">
                  <img
                    src={media}
                    alt="Best Practice Banner"
                    className="w-full max-h-[300px] object-cover rounded-xl shadow-xl"
                    onError={(e) => {
                      // Fallback in case the image fails to load
                      (e.target as HTMLImageElement).src =
                        iconMap["companycard1"];
                    }}
                  />
                </div>
              )}

            {/* Profile Image - correctly centered between top and user banner */}
            <div className="absolute z-20 top-[90px] left-1/2 transform -translate-x-1/2">
              <img
                src={
                  singlepost.profile?.profile_picture &&
                  singlepost.profile.profile_picture !==
                    "http://localhost:5026/file/"
                    ? singlepost.profile.profile_picture
                    : "/profile.png"
                }
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-xl"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              />
            </div>
          </div>
          {/* <div>
      <h4 className="font-semibold">
        {singlepost.profile?.first_name} {singlepost.profile?.last_name}
      </h4>
      <p className="text-sm text-gray-600">
        {singlepost.followers_count || 0} followers
      </p>
    
  </div>*/}
        </div>
        {/* Interaction Icons */}
        <div
          className="relative z-20 w-[90%] sm:w-[80%] md:w-[70%] mx-auto
                mt-[150px] sm:mt-[120px] md:mt-[160px] mb-4"
        >
          <div className="flex items-center justify-between">
            {/* LEFT: Like + Comment */}
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className="flex items-center gap-2"
                aria-label={isLiked ? "Unlike" : "Like"}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                    isLiked ? "bg-[#6269FF]" : "bg-[#7077EF]"
                  }`}
                >
                  <BiLike className="text-white text-base sm:text-lg" />
                </div>
                <span className="text-sm text-gray-800">
                  {_localLikeCount || 0}
                </span>
              </button>

              <button className="flex items-center gap-2" aria-label="Comments">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F07EFF] flex items-center justify-center">
                  <BiComment className="text-white text-base sm:text-lg" />
                </div>
                <span className="text-sm text-gray-800">
                  {commentCount || 0}
                </span>
              </button>
            </div>

            {/* RIGHT: Save + Follow */}
            {/* RIGHT: Save + Follow */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={fetchSavedPost}
                className="flex items-center gap-2"
                aria-label={isSaved ? "Unsave" : "Save"}
              >
                {isSaved ? (
                  <>
                    <FaBookmark className="text-[#72DBF2] text-xl" />
                    <span className="text-sm text-gray-800">Saved</span>
                  </>
                ) : (
                  <>
                    <FaRegBookmark className="text-[#72DBF2] text-xl" />
                    <span className="text-sm text-gray-800">Save</span>
                  </>
                )}
              </button>

              {!isFollowing ? (
                <button
                  className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#7077FE] hover:bg-[#6A6DEB] whitespace-nowrap"
                  onClick={toggleFollowPost}
                >
                  + Follow
                </button>
              ) : (
                <button
                  className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF] whitespace-nowrap"
                  onClick={toggleFollowPost}
                >
                  Following
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Main Content Area */}
        {/* Image/Video Section
      {media?.file_type === "video/mp4" ? (
        <video className="w-full max-h-[500px] rounded-xl" controls>
          <source src={media} type="video/mp4" />
        </video>
      ) : (
        <LazyLoadImage
          src={media}
          effect="blur"
          alt="Post media"
          className="w-full rounded-xl max-h-[500px] object-cover"
        />
      )}
 */}
        {/* Description */}
        <div className="w-[90%] sm:w-[80%] md:w-[70%] mx-auto mt-4 sm:mt-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
            <p className="text-gray-800 leading-relaxed text-justify text-sm sm:text-base">
              {singlepost.description}
            </p>
          </div>
        </div>
        {/* Comment Section */}
        {/* Comment Section */}
        <div className="w-[90%] sm:w-[80%] md:w-[70%] mx-auto mt-4 sm:mt-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <LazyLoadImage
                src={
                  localStorage.getItem("profile_picture") || dummyProfilePicture
                }
                alt="User"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              />

              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                  className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6269FF] shadow-sm "
                />
                <button
                  onClick={() => handleCommentSubmit(id || 0)}
                  className="bg-[#7077FE] hover:bg-[#6269FF] text-white text-sm font-medium px-5 py-2 rounded-full shadow cursor-pointer"
                >
                  Comment
                </button>
              </div>
            </div>
            {commentError && (
              <p className="ps-16 text-red-600 text-xs mt-1">{commentError}</p>
            )}
          </div>
        </div>
        {postComment?.length > 0 && (
          <div className="w-[90%] sm:w-[80%] md:w-[70%] mx-auto mt-4 sm:mt-6 ">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md px-4 sm:px-6 py-4 space-y-4 ">
              <>
                {postComment?.map((comment: any, index: any) => (
                  <>
                    <CommentCard
                      key={index}
                      comment={comment}
                      fetchComments={fetchComments}
                    />

                    {/* <div className="bg-white shadow-md rounded-lg p-2 mt-2 mb-2">
                      <div
                        key={index}
                        className="border-b border-gray-200 last:border-none"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: comment.content,
                          }}
                        />
                      </div>
                    </div> */}
                  </>
                ))}
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleBP;
