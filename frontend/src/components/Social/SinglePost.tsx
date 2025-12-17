import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiComment, BiShare } from "react-icons/bi";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
// @ts-ignore
import { LazyLoadImage } from "react-lazy-load-image-component";
// @ts-ignore
import Poll from "react-polls";
import PostLikeButton from "./PostLikeButton";
import RightSocial from "./RightSocial";
import LeftSocial from "./LeftSocial";
import {
  AddVote,
  GetComment,
  GetSinglePost,
  PostChildComments,
  PostCommentLike,
  PostComments,
} from "../../Common/ServerAPI";
import Button from "../ui/Button";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer/Footer";

const SinglePost = () => {
  const [disable, setDisable] = useState(true);

  // const uploadFile = async (file) => {
  //   const formData = new FormData();
  //   formData.append("files", file);
  //   const token = localStorage.getItem("jwt");

  //   try {
  //     const response = await axios.post(
  //       "https://dev.cness.ai/api/upload",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     console.log("File uploaded successfully:", response.data);
  //     setSelectedFile(response?.data);
  //     setSelectedFileId(response?.data[0]?.id);
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  const [comment, setComment] = useState("");
  const [postComment, setPostComment] = useState([]);
  const [singlepost, setSinglePost] = useState<any>(null);
  const [localLikeCount, setLocalLikeCount] = useState("");
  const [is_liked, setIs_Liked] = useState();
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, _setCurrentPage] = useState(1);
  const [totalPages, _setTotalPages] = useState(1);
  const [_userInfo, setUserInfo] = useState({
    userId: null,
    userdocumentId: null,
    firstName: "Unknown user",
    lastName: "Unknown",
    profileThumbnail: "https://via.placeholder.com/40",
    isFollowing: false,
    isFriend: false,
    followerCount: 0,
  });
  const myid = localStorage.getItem("Id");
  const urldata = `https://test.cness.ai/profile/public?id=${myid}`;
  const profilePicture = localStorage.getItem("profile_picture");
  const handleCommentChange = (event: any) => {
    const newPostContent = event.target.value;
    setComment(newPostContent);
    setDisable(newPostContent === "");
  };

  const { id } = useParams();

  useEffect(() => {
    fetchSinglePost(id);
    fetchComments(currentPage);
  }, []);
  const fetchComments = async (page = 1) => {
    console.log("🚀 ~ fetchComments ~ page:", page)
    try {
      // const formattedData = {
      //   text: comment,
      //   post_id: id,
      // };
      const res = await GetComment(id,page);
      setPostComment(res?.data?.data?.rows);
      // const newComments = res?.data;
      // setCommentCount(res.meta?.pagination?.total);
      // setPostComment(newComments);
      // setPostComment(() => {
      //   const existingIds = new Set(newComments?.map((comment:any) => comment?.id));
      //   const filteredComments = newComments.filter(
      //     (comment:any) => !existingIds.has(comment.id)
      //   );
      //   return [...filteredComments];
      // });
      // setTotalPages(res?.meta?.pagination?.pageCount);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (id: any) => {
    try {
      const formattedData = {
        text: comment,
        post_id: id,
      };
      await PostComments(formattedData);
      setCommentCount((old) => Number(old) + 1);
      setComment("");
      setDisable(true);
      await fetchComments();
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  const fetchSinglePost = async (id: any) => {
    try {
      const res = await GetSinglePost(id);
      // setCommentCount(res.data?.length)
      setSinglePost(res?.data?.data);
      // setMedia(res?.data?.media[0]);
      setLocalLikeCount(res?.data?.data?.likes_count);
      setIs_Liked(res?.data?.data?.is_liked);
      setCommentCount(res?.data?.data?.comments_count);
      setUserInfo({
        userId: res?.data?.data?.user_id,
        userdocumentId: res?.data?.userdocumentId,
        firstName: res?.data?.data?.profile?.first_name,
        lastName: res?.data?.data?.profile?.last_name,
        profileThumbnail: res?.data?.data?.profile?.profile_picture,
        isFollowing: res?.data?.data?.if_following,
        isFriend: res?.data?.data?.if_friend,
        followerCount: res?.data?.data?.followers_count,
      });
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  // const fetchLike = async () => {
  //   try {
  //     const formattedData = {
  //       post_id: id,
  //     };
  //     const res = await dispatch(
  //       apiCall("POST", "/user/posts/like", "like", formattedData, {})
  //     );
  //     if (liked) {
  //       // If already liked, unlike it
  //       setLiked(false);
  //       setLocalLikeCount((old: any) => Math.max(Number(old) - 1, 0)); // Prevent negative count
  //     } else {
  //       // If not liked, like it
  //       setLiked(true);
  //       setLocalLikeCount((old: any) => Number(old) + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching like details:", error);
  //   }
  // };

  // const fetchSavedPost = async () => {
  //   try {
  //     const formattedData = {
  //       post_id: id,
  //     };
  //     const res = await dispatch(
  //       apiCall("POST", "/user/posts/save", "saved_post", formattedData, {})
  //     );
  //     setSaved(true);
  //   } catch (error) {
  //     console.error("Error fetching selection details:", error);
  //   }
  // };

  const loadMoreComments = () => {
    // if (currentPage < totalPages) {
    //   const nextPage = currentPage + 1;
    //   setCurrentPage(nextPage);
    //   fetchComments(nextPage);
    // }
  };

  const [showReply, setShowReply] = useState(null);
  const [replyComment, setReplyComment] = useState("");

  const handleReply = async (commentId: any, post_id: any) => {
    try {

      // Prepare the data for the API call
      const formattedData = {
        text: replyComment,
        comment_id: commentId,
        post_id: post_id,
      };

      // Make the API call
      await PostChildComments(formattedData);

      fetchComments();
      // Clear input and toggle states
      setReplyComment(""); // Clear input
      setShowReply(null); // Hide input
    } catch (error) {
      console.error("Error while posting reply:", error);
    }
  };

  const handleLike = async (commentId: any, postId: any) => {
    const formattedData = {
      post_id: postId,
      comment_id: commentId,
    };
    await PostCommentLike(formattedData);
    fetchComments();
  };

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  const handleClickOutside = (event: any) => {
    //@ts-ignore
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const handleProfileClick = (user_id: any) => {
    navigate(`/directory/user-profile/${user_id}`);
  };

  const votedOptions = singlepost?.poll?.options
    ?.filter((option: any) => option?.is_voted)
    ?.map((option: any) => option?.text);

  const [is_voted, setIsVoted] = useState("");

  useEffect(() => {
    if (votedOptions?.length) {
      setIsVoted(votedOptions.join(", "));
    }
  }, [votedOptions]); // Runs when `votedOptions` updates

  const totalVotes = singlepost?.poll?.options?.reduce(
    (sum: any, option: any) => sum + Number(option?.votes || 0),
    0
  );

  const pollAnswers = singlepost?.poll?.options?.map((option: any) => ({
    option: option?.text,
    votes: Number(option?.votes || 0),
    id: option?.id,
    percentage:
      totalVotes > 0
        ? ((Number(option?.votes || 0) / totalVotes) * 100).toFixed(2) + "%"
        : "0%",
  }));

  const handleVote = async (selectedAnswer: any) => {
    const selectedOption = {
      option_id: selectedAnswer.id,
    };

    try {
      const data = await AddVote(selectedOption);

      if (data?.data?.data?.id === singlepost?.poll?.id) {
        const updatedOptions = data?.data?.data?.options || [];

        // Calculate total votes after updating
        const totalVotes = updatedOptions.reduce(
          (sum: any, opt: any) => sum + Number(opt.votes || 0),
          0
        );

        setSinglePost((prevPost: any) => ({
          ...prevPost,
          poll: {
            ...prevPost?.poll,
            options: updatedOptions.map((ans: any) => ({
              ...ans,
              votes: Number(ans.votes || 0), // Ensure votes is a number
              percentage:
                totalVotes > 0
                  ? ((Number(ans.votes || 0) / totalVotes) * 100).toFixed(2) +
                    "%"
                  : "0%",
            })),
          },
        }));
      }
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const pollStyles1 = {
    questionSeparator: true,
    questionSeparatorWidth: "question",
    questionBold: true,
    questionColor: "#303030",
    align: "center",
    theme: "purple",
  };

  return (
    <>
       <Header />
    
      <div className="flex flex-col w-full gap-4 p-4 md:flex-row">
        {/* First Part (1/3 width on medium screens and above) */}
        <div className="w-full md:w-1/4 md:sticky ">
          <LeftSocial />
        </div>

        {/* Second Part (2/3 width on medium screens and above) */}
        <div className="w-full px-4 md:w-2/4 overflow-y-auto h-[calc(100vh-100px)]">
          <div>
            {/* <h2 className="mb-6 text-2xl font-semibold leading-9">
              CNESS Journeys
            </h2> */}

            <div className="flex flex-col mt-5">
              <div className="w-full bg-[#F9F9F9] rounded-lg p-4 mb-5">
                {/* User Info */}
                <div className="flex justify-between items-center mb-4">
                  <div
                    className="flex items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleProfileClick(singlepost?.user_id)}
                  >
                    {/* <img
                      src={
                        singlepost?.profile?.profile_picture ||
                        "./image/whatsapp.png"
                      }
                      alt={singlepost?.profile?.profile_picture}
                      className="w-10 h-10 rounded-full mr-2"
                    /> */}
                    <LazyLoadImage
                      src={
                        singlepost?.profile?.profile_picture ||
                        "./image/whatsapp.png"
                      }
                      alt={singlepost?.profile?.profile_picture}
                      className="w-10 h-10 rounded-full mr-2"
                      effect="blur" // Options: "blur", "opacity", "black-and-white"
                    />
                    <div>
                      <h4 className="font-medium">
                        {singlepost?.profile?.first_name}{" "}
                        {singlepost?.profile?.last_name}
                      </h4>
                      <p className="text-gray-600">
                        {singlepost?.followers_count} Followers
                      </p>
                    </div>
                  </div>
                  <button
                    // onClick={Follow}
                    className="flex items-center px-3 py-1 rounded-full"
                  ></button>
                </div>

                {/* Post Media */}
                {singlepost?.file_type && (
                  <div className="mb-4 flex flex-col items-center">
                    {singlepost?.file_type === "video/mp4" ? (
                      <video
                        className="w-full max-h-[500px] rounded-lg"
                        controls
                      >
                        <source src={singlepost?.file} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // <img
                      //   src={singlepost?.file}
                      //   alt="Post Media"
                      //   className="w-full max-h-[500px] w-auto rounded-lg object-contain"
                      // />
                      <LazyLoadImage
                        src={singlepost?.file}
                        alt="Post Media"
                        className="w-full max-h-[500px] rounded-lg object-contain"
                        effect="blur" // Options: "blur", "opacity", "black-and-white"
                      />
                    )}
                  </div>
                )}
                {singlepost?.is_poll && (
                  <div className="mb-4 flex flex-col items-center poll">
                    <div className="bg-white shadow-md rounded-lg p-6 mt-2 mb-2 w-full text-center cursor-pointer">
                      <h2>{singlepost?.poll?.question}</h2>
                    </div>
                    <Poll
                      // question={singlepost?.poll?.question}
                      answers={pollAnswers}
                      customStyles={pollStyles1}
                      onVote={(voteAnswer: string) => {
                        const selectedOption = pollAnswers?.find(
                          (answer: any) => answer?.option === voteAnswer
                        );
                        if (selectedOption) {
                          handleVote(selectedOption);
                        }
                      }}
                      vote={is_voted}
                      // noStorage
                    />
                  </div>
                )}

                {singlepost && singlepost.content && (
                  <div className="bg-white shadow-md rounded-lg p-6 mt-2 mb-2">
                    <div
                      dangerouslySetInnerHTML={{ __html: singlepost.content }}
                    />
                  </div>
                )}

                {/* Interaction Icons */}
                <div className="flex mb-4 gap-3">
                  {is_liked !== undefined && (
                    <PostLikeButton
                      postId={id}
                      isLiked={is_liked}
                      likeCount={localLikeCount || 0}
                    />
                  )}

                  {/* <button onClick={fetchLike} className="flex items-center">
                    {is_liked === true ? (
                      <FaThumbsUp className="text-yellow-500 text-[25px]" />
                    ) : (
                      <FaRegThumbsUp className="text-yellow-500 text-[25px]" />
                    )}
                    <span className="ml-1">{localLikeCount || 0}</span>
                  </button> */}
                  <div className="relative">
                    {/* Share Button */}
                    <button className="flex items-center" onClick={toggleMenu}>
                      <BiShare className="text-[#7077FE] text-[25px]" />
                    </button>

                    {/* Submenu */}
                    {showMenu && (
                      <div
                        className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-3"
                        ref={menuRef}
                      >
                        <ul className="flex items-center gap-4">
                          <li>
                            <FacebookShareButton
                              url={urldata}
                              className="flex items-center space-x-2"
                            >
                              <FaFacebook size={32} color="#4267B2" />
                            </FacebookShareButton>
                          </li>
                          <li>
                            <LinkedinShareButton
                              url={urldata}
                              className="flex items-center space-x-2 mt-0"
                            >
                              <FaLinkedin size={32} color="#0077B5" />
                            </LinkedinShareButton>
                          </li>
                          <li>
                            <button
                              // onClick={shareToInstagram}
                              className="flex items-center space-x-2 mt-0"
                            >
                              <FaInstagram size={32} color="#C13584" />
                            </button>
                          </li>
                          <li>
                            <TwitterShareButton
                              url={urldata}
                              className="flex items-center space-x-2 mt-0"
                            >
                              <FaTwitter size={32} color="#1DA1F2" />
                            </TwitterShareButton>
                          </li>
                          <li>
                            <WhatsappShareButton
                              url={urldata}
                              className="flex items-center space-x-2 mt-0"
                            >
                              <FaWhatsapp size={32} color="#1DA1F2" />
                            </WhatsappShareButton>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* <PostSavedButton
                  postId={singlepost?.id}
                  isSaved={singlepost?.is_saved}
                /> */}
                  {/* <button
                    onClick={() => {
                      fetchSavedPost(singlepost?.post_id);
                    }}
                    className="flex items-center"
                  >
                    {singlepost?.is_saved ? (
                      <FaBookmark className="text-[#1A237E] text-[25px]" />
                    ) : (
                      <FaRegBookmark className="text-[#1A237E] text-[25px]" />
                    )}
                  </button> */}
                  <button className="flex items-center">
                    <BiComment className="text-[#7077FE] text-[25px]" />
                    <span className="ml-1">{commentCount || 0}</span>
                  </button>
                </div>
                <div className="flex flex-col">
                  {postComment?.length > 0 && (
                    <>
                      {postComment?.map((comment, index) => (
                        <div
                          key={index}
                          className="flex flex-col bg-white shadow-md rounded-lg p-4 mt-2 mb-2 w-full"
                        >
                          {/* Avatar and Comment Content */}
                          <div className="flex items-start">
                            <Link
                              to={`/directory/user-profile/${
                                (comment as any)?.profile?.user_id
                              }`}
                              state={comment}
                            >
                              {/* <img
                              src={
                                comment?.profile?.profile_picture ||
                                "https://via.placeholder.com/100"
                              }
                              alt="profile"
                              className="w-12 h-12 rounded-full mr-4"
                            /> */}
                              <LazyLoadImage
                                src={
                                  (comment as any)?.profile?.profile_picture ||
                                  "https://via.placeholder.com/100"
                                }
                                alt="profile"
                                className="w-12 h-12 rounded-full mr-4"
                                effect="blur"
                              />
                            </Link>
                            <div style={{ width: "100%" }}>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">
                                  {(comment as any)?.profile?.first_name}{" "}
                                  {(comment as any)?.profile?.last_name}
                                </h3>
                                <div
                                  className="text-gray-700 border-b border-gray-200 pb-2 mb-2"
                                  dangerouslySetInnerHTML={{
                                    __html: (comment as any)?.text,
                                  }}
                                />
                              </div>
                              {/* Reply and Like Actions */}
                              <div className="flex space-x-4 text-blue-500 text-sm mt-2">
                                <button
                                  onClick={() =>
                                    setShowReply((comment as any)?.id)
                                  }
                                  className="hover:underline"
                                >
                                  Reply
                                </button>
                                <button
                                  onClick={() =>
                                    handleLike(
                                      (comment as any)?.id,
                                      (comment as any)?.post_id
                                    )
                                  }
                                  className="hover:underline"
                                >
                                  Like({(comment as any)?.likes_count || 0})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Reply Input */}
                          {showReply === (comment as any)?.id && (
                            <div className="relative w-full bg-[#F0F0F2] rounded-lg mt-4">
                              <input
                                type="text"
                                placeholder="Add a reply..."
                                value={replyComment}
                                onChange={(e) =>
                                  setReplyComment(e.target.value)
                                }
                                className="w-full rounded-lg px-4 py-2 pr-16 focus:outline-none bg-transparent border-0 bg_input_grey"
                              />
                              <Button
                                variant="gradient-primary"
                                className="absolute right-4 top-0.5 transform px-6 py-1 rounded-[100px] self-stretch transition-colors duration-500 ease-in-out"
                                // disabled={disable}
                                onClick={() =>
                                  handleReply(
                                    (comment as any)?.id,
                                    (comment as any)?.post_id
                                  )
                                }
                              >
                                Post
                              </Button>
                            </div>
                          )}

                          {/* Render Replies */}
                          {(comment as any)?.replies &&
                            (comment as any)?.replies.length > 0 && (
                              <div className="mt-4 pl-6 border-l border-gray-300">
                                {(comment as any)?.replies
                                  .slice()
                                  .reverse()
                                  .map((reply: any) => (
                                    <div
                                      key={reply.id}
                                      className="flex items-start bg-gray-50 rounded-lg p-2 mt-2"
                                    >
                                      <Link
                                        to={`/directory/user-profile/${reply?.profile?.user_id}`}
                                        state={reply}
                                      >
                                        {/* <img
                                      src={
                                        reply?.profile?.profile_picture ||
                                        "https://via.placeholder.com/50"
                                      }
                                      alt="profile"
                                      className="w-8 h-8 rounded-full mr-2"
                                    /> */}
                                        <LazyLoadImage
                                          src={
                                            reply?.profile?.profile_picture ||
                                            "https://via.placeholder.com/50"
                                          }
                                          alt="profile"
                                          className="w-8 h-8 rounded-full mr-2"
                                          effect="blur" // Options: "blur", "opacity", "black-and-white"
                                        />
                                      </Link>
                                      <div className="flex-1">
                                        <h4 className="text-sm font-semibold">
                                          {reply.profile?.first_name}{" "}
                                          {reply.profile?.last_name}
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                          {reply.text}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      ))}

                      {/* Load More Comments Button */}
                      {currentPage < totalPages && (
                        <button
                          onClick={loadMoreComments}
                          className="px-6 py-1 rounded-full text-white bg-linear-to-r from-indigo-500 to-purple-500 font-medium  focus:outline-none focus:ring-2  mt-4"
                        >
                          Load More Comments
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex">
                  {/* <img
                  src={profilePicture}
                  alt=""
                  className="w-10 h-10 rounded-full mr-2"
                /> */}
                  {profilePicture && (
                    <LazyLoadImage
                      src={profilePicture}
                      alt=""
                      className="w-10 h-10 rounded-full mr-2 cursor-pointer"
                      effect="blur"
                      onClick={() => handleProfileClick(singlepost?.user_id)}
                    />
                  )}

                  <div className="relative w-full bg-[#F0F0F2] rounded-lg">
                    <input
                      type="text"
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Enter your comment"
                      className="w-full rounded-lg px-4 py-2 pr-16 focus:outline-none bg-transparent border-0 bg_input_grey"
                    />

                    {/* Post Button */}
                    <Button
                      variant="gradient-primary"
                      className="absolute right-4 top-0.5 transform px-6 py-1 rounded-[100px] self-stretch transition-colors duration-500 ease-in-out"
                      disabled={disable}
                      onClick={() =>
                        handleCommentSubmit(id !== undefined ? id : 0)
                      }
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Part (1/3 width on medium screens and above) */}
        <div className="w-full md:w-1/4  md:sticky">
          <RightSocial />
        </div>
      </div>

      <Footer />

    </>
  );
};

export default SinglePost;
