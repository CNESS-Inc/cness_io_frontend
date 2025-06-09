import CustomVideoPlayer from "./CustomVideoPlayer.tsx";
import { Tooltip } from "react-tooltip";
import {
  BsCardImage,
  BsEmojiSmileFill,
  BsFiletypeGif,
  BsHddStack,
} from "react-icons/bs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialPostCart from "./SocialPostCart.tsx";
import StoryCard from "./StoryCard.tsx";
import EmojiPicker from "emoji-picker-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  AddPost,
  AddStory,
  GetStory,
  PostsDetails,
} from "../../Common/ServerAPI.tsx";
import LoadingSpinner from "../ui/LoadingSpinner.tsx";
import Button from "../ui/Button.tsx";

interface Post {
  id: string;
  user_id: string;
  file: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  file_type: string;
  followers_count: number;
  likes_count: number;
  comments_count: number;
  if_follower: boolean;
  if_following: boolean;
  if_friend: boolean;
  is_requested: boolean;
  is_saved: boolean;
  is_poll: boolean;
  is_liked: boolean;
  poll: any;
  user: {
    id: string;
    username: string;
    blocked: boolean;
    role: string;
  };
  profile: {
    id: string;
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
    gender: string | null;
  };
}

type Story = {
  id: string;
  video_file: string;
  description: string;
  storyuser: {
    profile: {
      profile_picture: string;
      first_name: string;
      last_name: string;
    };
  };
};

export default function AllSocialPost() {
  // Static categories data
  // const categories = [
  //   { name: "Music", src: "./images/category-icons/bx-music.png" },
  //   { name: "Movies", src: "./images/category-icons/movie-reel.png" },
  //   { name: "Podcasts", src: "./images/category-icons/theatre.png" },
  //   { name: "Images", src: "./images/category-icons/conscious.png" },
  //   { name: "Documentaries", src: "./images/category-icons/angeles.png" },
  //   { name: "Books", src: "./images/category-icons/bx-globe.png" },
  // ];

  const [postContent, setPostContent] = useState("");
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [postImage, setPostImage] = React.useState<File | null>(null);
  const [disable, setDisable] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [gifPreview, setGifPreview] = useState<string | null>(null);
  const [pollPreview, setPollPreview] = useState<boolean | null>(null);
  const [options, setOptions] = useState(["", ""]);
  const [question, setQuestion] = useState("");
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const dummyProfilePicture =
    "data:image/jpeg;base64,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";

  // Static posts data
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  console.log("🚀 ~ AllSocialPost ~ userPosts:", userPosts);

  const getUserPosts = async () => {
    if (isLoading || !hasMore) return; // Ensure this doesn't block new fetch

    setIsLoading(true);
    try {
      setIsLoading(true);

      // Call the API to get the posts for the current page
      const res = await PostsDetails(page);
      if (res?.data) {
        const newPosts = res?.data.data.rows || [];
        const totalPages = res?.data?.data?.count / 10 || 0;

        if (newPosts.length === 0) {
          setHasMore(false); // No more posts to load
        } else {
          setUserPosts((prevPosts) => [...prevPosts, ...newPosts]);

          // Check if the current page is the last page
          if (page >= totalPages) {
            setHasMore(false); // We've loaded all available pages
          } else {
            setPage((prevPage) => prevPage + 1); // Load the next page
          }
        }

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      getUserPosts(); // Call API when the user scrolls near the bottom
    }
  };

  useEffect(() => {
    getUserPosts();
  }, []);
  //@ts-ignore
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    // Cleanup on unmount
    return () =>
      container && container.removeEventListener("scroll", handleScroll);
  }, [page, isLoading]);

  // Static story data
  const [storyData, setStoryData] = useState<Story[]>([]);

  const GetStoryData = async () => {
    try {
      // Call your API endpoint
      const res = await GetStory();
      setStoryData(res?.data?.data);
      console.log("🚀 ~ handleFileUpload ~ res:", res);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    GetStoryData();
  }, []);

  // Removed all API-related code and replaced with static data

  const handleRemoveImage = () => {
    setImagePreview(null);
    setDisable(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setDisable(false);
    }
  };

  const handleProfileClick = () => {
    navigate(`/directory/user-profile/${localStorage.getItem("Id")}`);
  };

  const handleButtonClick = () => {
    setIsHighlighted(true);
    const textarea = document.getElementById("post-textarea");
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => setIsHighlighted(false), 2000);
  };

  // const handleCategoryClick = (categoryName: any) => {
  //   if (categoryName === "Movies" || categoryName === "Documentaries") {
  //     navigate(`/cnessmedia?name=${categoryName}`);
  //   }
  // };

  // const fileuploadRef = useRef<HTMLInputElement>(null);

  const handleFileButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type.startsWith("image") ? "Image" : "Video";
      console.log(`Uploaded ${fileType}:`, file.name);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", "");

      try {
        setIsUploading(true); // Show loader before starting the API call

        const res = await AddStory(formData);
        await GetStoryData();
        console.log("🚀 ~ handleFileUpload ~ res:", res);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsUploading(false); // Hide loader after the API call finishes
      }
    }
  };

  // const toggleInsert = (text: string) => {
  //   if (postContent.includes(text)) {
  //     setPostContent(postContent.replace(text, "").trim());
  //   } else {
  //     setPostContent((prev) => (prev ? prev + " " + text : text));
  //   }
  // };

  const handleGifUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGifPreview(e.target?.result as string);
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlepolladd = () => {
    setPollPreview(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
    setShowEmojiBox(false);
    setDisable(false);
  };

  const handleRemoveGif = () => {
    setGifPreview(null);
  };

  const handleRemovepoll = () => {
    setPollPreview(false);
    setDisable(false);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeLastOption = () => {
    if (options.length > 2) {
      setOptions(options.slice(0, -1));
    }
  };

  const handleOptionChange = (index: any, value: any) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index] = value;
      return newOptions;
    });
    setDisable(false);
  };

  const CreatePost = async () => {
    setHasMore(false);

    if (postContent || postImage || pollPreview) {
      try {
        setIsUploading(true);
        const formData = new FormData();

        if (postContent) {
          formData.append("content", postContent);
        }

        if (postImage) {
          formData.append("file", postImage);
        } else if (gifPreview) {
          // Convert Base64 to Blob if necessary
          const byteCharacters = atob(gifPreview.split(",")[1]); // Remove the Base64 header
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const gifBlob = new Blob([byteArray], { type: "image/gif" });

          formData.append("file", gifBlob, "preview.gif");
        }

        if (pollPreview && question && options.length >= 2) {
          const pollData = {
            question: question,
            options: options,
          };
          formData.append("poll", JSON.stringify(pollData));
        }

        const res = await AddPost(formData);
        console.log("🚀 ~ CreatePost ~ res:", res);

        if (res?.success?.status === true) {
          // Create a new post object using the response data
          const newPost = res?.data?.data;
          console.log("🚀 ~ CreatePost ~ newPost:", newPost);

          // Immediately update userPosts state without API call
          setUserPosts((prevPosts) => [newPost, ...prevPosts]);

          // Reset input fields
          setPostContent("");
          setImagePreview("");
          setGifPreview("");
          setPollPreview(false);
          setOptions([]);
          setQuestion("");

          setHasMore(true); // Ensure more posts can be loaded
        }

        // Clear input fields
        if (pollPreview) {
          window.location.reload();
        }
        // setPostImage("");
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      console.log("No content or image to post.");
    }
  };

  return (
    <>
      {isUploading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      ) : (
        <div
          className="w-full md:w-2/4 overflow-y-auto h-[calc(100vh-100px)]"
          ref={containerRef}
        >
          <div className="bg-gray-100 flex items-end justify-center relative overflow-hidden rounded-[15px]">
            <CustomVideoPlayer videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
            <div
              className="absolute flex items-center justify-center px-4 pb-8 "
              style={{
                right: 0,
              }}
            >
              <Button
                variant="gradient-primary"
                className="rounded-[100px] py-3 px-8  self-stretch transition-colors duration-500 ease-in-out"
                onClick={handleButtonClick}
              >
                
                  Bring Your Awareness to Life
               
                {/* <div className="ml-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 11 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.62364 15.6093L10.233 7.99996L2.62364 0.390625L0.738312 2.27596L6.46231 7.99996L0.738312 13.724L2.62364 15.6093Z"
                      fill="white"
                    />
                  </svg>
                </div> */}
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <h2 className="mb-6 text-2xl font-semibold leading-9">
              Unleash Your Mindful Creations
            </h2>
            <div
              style={{
                padding: "16px",
                color: "#fff",
                borderRadius: "8px",
                margin: "auto",
              }}
            >
              <div className="flex w-full">
                <LazyLoadImage
                  src={
                    localStorage.getItem("profile_picture") ||
                    dummyProfilePicture
                  }
                  style={{ cursor: "pointer" }}
                  onClick={handleProfileClick}
                  alt="Profile Picture"
                  className="w-10 h-10 mr-2 rounded-full"
                  effect="blur"
                />
                <div className="w-full">
                  <div
                    className={`border border-black rounded-lg p-2 ${
                      isHighlighted
                        ? "border-blue-500 bg-[#F6F6F6] border-[2px] transition duration-300"
                        : ""
                    }`}
                    style={{
                      borderColor: "#292929",
                      borderRadius: "8px",
                      padding: "8px",
                      resize: "none",
                    }}
                  >
                    <textarea
                      id="post-textarea"
                      className="text-focus-remove focus-visible:outline-none"
                      value={postContent}
                      onChange={(e) => {
                        const newPostContent = e.target.value;
                        setPostContent(newPostContent);
                        setDisable(newPostContent === "");
                      }}
                      placeholder="What is happening?!"
                      style={{
                        width: "100%",
                        color: "#000",
                        borderRadius: "8px",
                        padding: "8px",
                        resize: "none",
                      }}
                    />

                    {imagePreview && (
                      <div
                        style={{
                          marginTop: "8px",
                          position: "relative",
                          width: "200px",
                        }}
                      >
                        <LazyLoadImage
                          src={imagePreview}
                          effect="blur"
                          style={{
                            width: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          onClick={handleRemoveImage}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "#ff0000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            width: "24px",
                            height: "24px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {gifPreview && (
                      <div
                        style={{
                          marginTop: "8px",
                          position: "relative",
                          width: "200px",
                        }}
                      >
                        <LazyLoadImage
                          src={gifPreview}
                          effect="blur"
                          style={{
                            width: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          onClick={handleRemoveGif}
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "4px",
                            backgroundColor: "#ff0000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            width: "24px",
                            height: "24px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {pollPreview && (
                      <div className="p-3 border rounded-md relative">
                        <form className="flex flex-col gap-3 mt-2">
                          <label className="text-sm font-bold text-gray-600">
                            Question *
                          </label>
                          <input
                            type="text"
                            name="question"
                            maxLength={60}
                            placeholder="Enter your question"
                            onChange={(e) => setQuestion(e.target.value)}
                            className="p-3 border rounded-md focus:outline-none text-black focus:ring-2 bg-gray-50 shadow-sm bg_remove"
                            required
                          />

                          <label className="text-sm font-bold text-gray-600">
                            Options *
                          </label>

                          {options.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              name={`option${index + 1}`}
                              maxLength={25}
                              placeholder={`Choice ${index + 1}`}
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(index, e.target.value)
                              }
                              className="flex-1 p-3 border rounded-md focus:outline-none text-black focus:ring-2 bg-gray-50 shadow-sm bg_remove"
                              required
                            />
                          ))}

                          {options.length < 4 && (
                            <Button
                              variant="gradient-primary"
                              className="rounded-[100px] flex justify-center py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                              type="button"
                              onClick={addOption}
                            >
                              +
                            </Button>
                          )}
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={removeLastOption}
                              className="bg-red-500 text-white py-3 px-8 rounded-full font-medium focus:ring-2"
                            >
                              ✕ Remove Option
                            </button>
                          )}
                        </form>

                        <button
                          onClick={handleRemovepoll}
                          className="absolute top-1 right-1 bg-red-500 text-white border-none rounded-full cursor-pointer w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex justify-between"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <div className="flex">
                      <label style={{ cursor: "pointer", marginRight: "20px" }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          style={{ display: "none" }}
                        />
                        <BsCardImage
                          style={{
                            color: "#7077FE",
                            fontSize: 20,
                          }}
                          data-tooltip-id="image-tooltip"
                          data-tooltip-content="Image Upload"
                        />
                        <Tooltip
                          id="image-tooltip"
                          place="bottom"
                          className="bg-gray-900 text-white text-xs p-2 rounded-md"
                          style={{
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        />
                      </label>

                      <label style={{ cursor: "pointer", marginRight: "20px" }}>
                        <input
                          type="file"
                          accept="image/gif"
                          onChange={handleGifUpload}
                          style={{ display: "none" }}
                        />
                        <BsFiletypeGif
                          style={{ color: "#7077FE", fontSize: 20 }}
                          data-tooltip-id="gif-tooltip"
                          data-tooltip-content="GIF Upload"
                        />
                        <Tooltip
                          id="gif-tooltip"
                          place="bottom"
                          className="bg-gray-900 text-white text-xs p-2 rounded-md"
                        />
                      </label>

                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginRight: "20px",
                        }}
                      >
                        <label
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowEmojiBox(!showEmojiBox)}
                        >
                          <BsEmojiSmileFill
                            style={{ color: "#7077FE", fontSize: 20 }}
                          />
                        </label>

                        {showEmojiBox && (
                          <div
                            style={{
                              position: "absolute",
                              top: "30px",
                              left: 0,
                              zIndex: 1000,
                            }}
                          >
                            <EmojiPicker
                              onEmojiClick={(emojiData) =>
                                handleEmojiSelect(emojiData.emoji)
                              }
                            />
                          </div>
                        )}
                      </div>

                      <label
                        style={{ cursor: "pointer", marginRight: "20px" }}
                        onClick={handlepolladd}
                      >
                        <BsHddStack
                          style={{ color: "#7077FE", fontSize: 20 }}
                          data-tooltip-id="poll-tooltip"
                          data-tooltip-content="Poll"
                        />
                        <Tooltip
                          id="poll-tooltip"
                          place="bottom"
                          className="bg-gray-900 text-white text-xs p-2 rounded-md"
                        />
                      </label>
                    </div>
                    <Button
                      variant="gradient-primary"
                      className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                      disabled={disable}
                      onClick={CreatePost}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full my-8 border border-black border-solid"></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-semibold leading-9">
                Share your story
              </h3>
              <Button
                variant="gradient-primary"
                className="rounded-[100px] py-1 px-3 self-stretch transition-colors duration-500 ease-in-out"
                onClick={handleFileButton}
              >
                +
              </Button>
              <input
                type="file"
                accept="image/*, video/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {storyData.map((item: any) => (
                <StoryCard
                  key={item.id}
                  videoSrc={
                    item.video_file ||
                    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                  id={item.id}
                  title={item.description}
                  userIcon={item.storyuser.profile.profile_picture}
                  userName={item.storyuser.profile.first_name}
                />
              ))}
            </div>

            <div className="flex flex-col mt-5">
              {userPosts.map((post, index) => (
                <div key={post.id}>
                  <SocialPostCart
                    likeCount={post.likes_count}
                    content={post.content}
                    userIcon={
                      post?.profile?.profile_picture || dummyProfilePicture
                    }
                    userName={
                      `${post?.profile?.first_name || ""} ${
                        post?.profile?.last_name || ""
                      }`.trim() || post?.user?.username
                    }
                    followers={post.followers_count}
                    postMediaSrc={post.file}
                    postMediaType={post.file_type}
                    id={post.id}
                    poll={post.poll}
                    isFollowing={post.if_following}
                    isFriend={post.if_friend}
                    user_id={post.user_id}
                    bgClass={index % 2 === 0 ? "bg-[#F9F9F9]" : ""}
                    commentCount={post.comments_count}
                    is_saved={post.is_saved}
                    is_liked={post.is_liked}
                    is_poll={post.is_poll}
                    is_requested={post.is_requested}
                    profile_picture={
                      localStorage.getItem("profile_picture") ||
                      dummyProfilePicture
                    }
                    key={undefined}
                    getUserPosts={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
