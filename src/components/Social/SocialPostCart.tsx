import React, { useEffect, useRef, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { BiShare, BiComment } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import PostLikeButton from "./PostLikeButton.tsx";
// import PostSavedButton from "./PostSaveButton";
// @ts-ignore
import {
  LazyLoadImage,
  LazyLoadComponent,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
// @ts-ignore
import Poll from "react-polls";
import ConnectButton from "./Button/ConnectButton.tsx";
import FollowButton from "./Button/FollowButton.tsx";
import { AddVote, PostComments } from "../../Common/ServerAPI.tsx";
import Button from "../ui/Button.tsx";

interface SocialPostCartProps {
  key: any; // The key prop should match the type of the `post?.id`
  likeCount: number | undefined;
  content: string | undefined;
  documentId?: string;
  userIcon: string;
  profile_picture: string;
  userName: string;
  followers: number | string;
  postMediaSrc: string | undefined;
  postMediaType?: string;
  id: string;
  poll: any;
  userId?: string;
  isFollowing: boolean;
  is_saved: boolean;
  is_poll: boolean;
  is_liked: boolean;
  is_requested: boolean;
  isFriend?: boolean;
  user_id?: string;
  bgClass: string;
  commentCount: number | undefined;
  getUserPosts: () => void;
}

const SocialPostCart: React.FC<SocialPostCartProps> = ({
  userIcon,
  userName,
  followers,
  postMediaSrc,
  postMediaType,
  content,
  id,
  poll,
  likeCount,
  key,
  // documentId,
  isFollowing,
  isFriend,
  user_id,
  is_poll,
  bgClass,
  commentCount,
  // is_saved,
  is_liked,
  is_requested,
  profile_picture,
  getUserPosts,
}) => {
  // const [localLikeCount, setLocalLikeCount] = useState<number>(likeCount ?? 0);
  const [localcommentCount, setCommentCount] = useState<number>(
    commentCount ?? 0
  );
  const [comment, setComment] = useState<string>("");
  // const [saved, setSaved] = useState<boolean>(false);
  // const [liked, setLiked] = useState<boolean>(false);
  // const [requestRaised, setRequestRaised] = useState<boolean>(false);
  //   const [loading, setLoading] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  // const [pollAns1, setPollAns1] = useState([]);
  const [copy, setCopy] = useState<Boolean>(false)

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const loggedInUserID = localStorage.getItem("Id");

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate(`/directory/user-profile/${user_id}`);
  };

  // const docuid = localStorage.getItem("documentId");
  const myid = localStorage.getItem("Id");
  const urldata = `https://test.cness.ai/profile/public?id=${myid}`;

  // const fetchLike = async () => {
  //   try {
  //     const formattedData = { post_id: id };

  //     //   const res = await dispatch(
  //     //     apiCall("POST", "/user/posts/like", "like", formattedData)
  //     //   );

  //     if (is_liked) {
  //       // If already liked, unlike it
  //       setLiked(false);
  //       setLocalLikeCount((old) => Math.max(Number(old) - 1, 0)); // Prevent negative count
  //       // toast.success(res?.success?.message)
  //     } else {
  //       // If not liked, like it
  //       setLiked(true);
  //       setLocalLikeCount((old) => Number(old) + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching like details:", error);
  //   }
  // };

  const handleCommentSubmit = async (id: number | string) => {
    try {
      const formattedData = {
        text: comment,
        post_id: id,
      };
      await PostComments(formattedData);
      // await fetchComments();
      setCommentCount((old) => Number(old) + 1);
      setComment(""); // Assuming setComment is a function to reset a string state
      await getUserPosts();
    } catch (error: any) {
      console.error(
        "Error fetching selection details:",
        error.message || error
      );
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/social/singlepost/${id}`);
  };

  // const fetchSavedPost = async () => {
  //   try {
  //     const formattedData = {
  //       post_id: id,
  //     };
  //     //   const res = await dispatch(
  //     //     apiCall("POST", "/user/posts/save", "saved_post", formattedData, {})
  //     //   );
  //     setSaved(true);
  //   } catch (error) {
  //     console.error("Error fetching selection details:", error);
  //   }
  // };

  const votedOptions = poll?.options
    ?.filter((option: any) => option?.is_voted)
    ?.map((option: any) => option?.text);

  const [is_voted, _setis_voted] = useState(
    votedOptions?.length ? votedOptions.join(", ") : ""
  );
  const pollAnswers = poll?.options?.map((option: any) => ({
    option: option?.text,
    votes: option?.votes,
    id: option?.id,
  }));
  // const pollAnswers = poll?.options?.map((option: any) => ({
  //   option: option,
  //   votes: option,
  // }));

  const handleVote = async (
    selectedAnswer: any
    // pollAnswers: any,
    // pollNumber: any
  ) => {
    // If you need to update the votes locally:
    // const updatedPollAnswers = pollAnswers.map((answer: any) => ({
    //   ...answer,
    //   votes: answer.id === selectedAnswer.id ? answer.votes + 1 : answer.votes
    // }));
    const selectedOption = {
      option_id: selectedAnswer.id,
    };

    const data = await AddVote(selectedOption);
    const vote_data = data?.data?.data?.options?.find(
      (ans: any) => ans?.id === selectedOption?.option_id
    );

    if (data?.data?.data?.id == poll?.id) {
      poll.options = poll.options.map((ans: any) =>
        selectedOption?.option_id === ans.id
          ? { ...ans, votes: vote_data?.votes }
          : ans
      );
    }

    await getUserPosts();
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
      <div className={`w-full rounded-lg p-4 mb-5 ${bgClass}`} key={key}>
        {/* User Info */}
        <div className="flex justify-between items-center mb-4">
          <div
            className="flex items-center"
            style={{ cursor: "pointer" }}
            onClick={handleProfileClick}
          >
            {/* <img
              src={userIcon || "./images/connection.png"}
              alt={userName}
              className="w-10 h-10 rounded-full mr-2"
            /> */}
            <LazyLoadImage
              src={userIcon || "./images/connection.png"}
              effect="blur" // Options: "blur", "opacity", "black-and-white"
              alt={userName}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <h4 className="font-medium">{userName}</h4>
              <p className="text-gray-600">{followers} followers</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user_id !== loggedInUserID && (
              <>
                {/* {isFriend ? ( */}
                {/* <span className="text-gray-600">Connected</span> */}
                {/* ) : (
                )} */}
                <ConnectButton
                  isFriend={isFriend}
                  is_requested={is_requested}
                  userId={user_id}
                />
                <FollowButton user_id={user_id} isFollowing={isFollowing} />
                {/* <button
                  // onClick={() => Follow(userId)}
                  className={`flex items-center space-x-2 font-semibold py-1 ms-1 px-3 rounded-md ${isFollowing
                    ? "bg-gray-300 text-black"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-black "
                    } focus:outline-none focus:ring-2 `}
                //   disabled={loading}
                >
                  {isFollowing ? (
                    <>
                      <FaArrowTrendUp className="mr-2" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <span>{loading ? "Following..." : "Follow"}</span>
                      <span>{"Follow"}</span>
                    </>
                  )}
                </button> */}
              </>
            )}
          </div>
        </div>

        {/* Post Media */}
        {postMediaType && postMediaSrc && (
          <div
            className="mb-4 flex flex-col items-center"
            onClick={() => handleCardClick(id)}
            style={{
              cursor: "pointer",
            }}
          >
            {postMediaType === "video/mp4" ? (
              <>
                <LazyLoadComponent>
                  <video className="w-full max-h-[500px] rounded-lg" controls>
                    <source src={postMediaSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </LazyLoadComponent>
              </>
            ) : (
              <>
                <LazyLoadImage
                  src={postMediaSrc} // Image URL
                  effect="blur" // Options: "blur", "opacity", "black-and-white"
                  width="100%"
                  height="auto"
                  wrapperProps={{
                    // If you need to, you can tweak the effect transition using the wrapper style.
                    style: { transitionDelay: "1s" },
                  }}
                />
                {/* <img
                src={postMediaSrc}
                alt="Post Media"
                className="w-full max-h-[500px] rounded-lg object-contain"
              /> */}
              </>
            )}
          </div>
        )}

        {/* Post Content */}
        {content ? (
          <div
            className="bg-white shadow-md rounded-lg p-6 mt-2 mb-2"
            onClick={() => handleCardClick(id)}
            style={{
              cursor: "pointer",
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        ) : (
          ""
        )}
        {is_poll && (
          <div className="mb-4 flex flex-col items-center poll" key={key}>
            {/* <div className="bg-white shadow-md rounded-lg p-6 mt-2 mb-2 w-full text-center cursor-pointer" onClick={() => handleCardClick(id)}>
              <h2>{poll?.question}</h2>
            </div> */}
            <div className="w-full">
              <Poll
                // question={poll?.question}
                answers={pollAnswers}
                customStyles={pollStyles1}
                onVote={(voteAnswer: string) => {
                  const selectedOption = pollAnswers?.find(
                    (answer: any) => answer?.option === voteAnswer
                  );
                  // if (selectedOption) {
                  //   handleVote(selectedOption, pollAnswers, 1);
                  // }
                  if (selectedOption) {
                    handleVote(selectedOption);
                  }
                }}
                vote={is_voted}
              // noStorage
              />
            </div>
          </div>
        )}

        {/* Interaction Icons */}
        <div className="flex mb-4 gap-3">
          <PostLikeButton
            postId={id}
            isLiked={is_liked}
            likeCount={likeCount || 0}
          />
          {/* <button onClick={fetchLike} className="flex items-center" style={{cursor:"pointer"}}>
            {is_liked === true ? (
              <FaThumbsUp className="text-yellow-500 text-[25px]" />
            ) : (
              <FaRegThumbsUp className="text-yellow-500 text-[25px]" />
            )}
            <span className="ml-1">{localLikeCount || 0}</span>
          </button> */}
          <div className="relative">
            <button
              className="flex items-center"
              onClick={toggleMenu}
              style={{ cursor: "pointer" }}
            >
              <BiShare className="text-[#7077FE] text-[25px]" />
            </button>
            {showMenu && (
              <div
                className="absolute top-10 left-0 bg-white shadow-lg rounded-lg p-3 z-10"
                ref={menuRef}
              >
                <ul className="flex items-center gap-4">
                  <li>
                    <FacebookShareButton url={urldata}>
                      <FaFacebook size={32} color="#4267B2" />
                    </FacebookShareButton>
                  </li>
                  <li>
                    <LinkedinShareButton url={urldata}>
                      <FaLinkedin size={32} color="#0077B5" />
                    </LinkedinShareButton>
                  </li>
                  {/* <li>
                    <FaInstagram size={32} color="#C13584" />
                  </li> */}
                  <li>
                    <TwitterShareButton url={urldata}>
                      <FaTwitter size={32} color="#1DA1F2" />
                    </TwitterShareButton>
                  </li>
                  <li>
                    <WhatsappShareButton url={urldata}>
                      <FaWhatsapp size={32} color="#1DA1F2" />
                    </WhatsappShareButton>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(urldata);
                        setCopy(true);
                        setTimeout(() => setCopy(false), 1500);
                      }}
                      className="flex items-center relative"
                      title="Copy link"
                    >
                      <MdContentCopy size={30} className="text-gray-600" />
                      {copy && <div className="absolute w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all z-20">
                        Link Copied!
                      </div>}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* <PostSavedButton postId={id} isSaved={is_saved} /> */}
          {/* <button className="flex items-center" style={{cursor:"pointer"}}
          onClick={() => {
            fetchSavedPost()
          }}
          >
            {is_saved || saved ? (
              <FaBookmark className="text-[#7077FE] text-[25px]" />
            ) : (
              <FaRegBookmark className="text-[#7077FE] text-[25px]" />
            )}
          </button> */}
          <button className="flex items-center">
            <BiComment className="text-[#7077FE] text-[25px]" />
            <span className="ml-1">{localcommentCount || 0}</span>
          </button>
        </div>

        {/* Comment Input */}
        <div className="flex">
          {/* <img
            src={profile_picture}
            style={{ cursor: "pointer" }}
            onClick={handleProfileClick}
            alt="commenter"
            className="w-10 h-10 rounded-full mr-2"
          /> */}
          <LazyLoadImage
            src={profile_picture}
            style={{ cursor: "pointer" }}
            onClick={handleProfileClick}
            alt="commenter"
            className="w-10 h-10 rounded-full mr-2"
            effect="blur"
          />
          <div className="relative w-full bg-[#F0F0F2] rounded-lg">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Enter your comment"
              className="w-full rounded-lg px-4 py-2 pr-16 focus:outline-none bg-transparent border-0 bg_input_grey"
            />
            <Button
              variant="gradient-primary"
              className="absolute right-4 top-0.5 transform px-6 py-1 rounded-[100px] self-stretch transition-colors duration-500 ease-in-out"
              onClick={() => handleCommentSubmit(id !== undefined ? id : 0)}
              style={{ cursor: "pointer" }}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialPostCart;
