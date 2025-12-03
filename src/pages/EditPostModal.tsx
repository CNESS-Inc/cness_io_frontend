import React, { useState, useRef, useEffect } from "react";
import { CirclePlus, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { EditPost, getTopics } from "../Common/ServerAPI";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    body?: string;
    content?: string;
    media?: {
      type: "image" | "video" | "text";
      src: string;
      alt?: string;
      images?: string[]; // Add this line
    };
    images?: string[];
    file?: string;
    file_type?: "image" | "video";
    topic_id?: string;
    date?: string;
  };
  topics?: Array<{ id: string; topic_name: string }>;
  userInfo?: {
    id?: string;
    name?: string;
    profile_picture?: string;
    main_name?: string;
  };
  onPostUpdated?: (updatedPost: any) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  userInfo,
  onPostUpdated,
}) => {
  console.log("🚀 ~ EditPostModal ~ post:", post)
  const { showToast } = useToast();
  const [postMessage, setPostMessage] = useState(
    post?.body || post?.content || ""
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
const [existingMedia, setExistingMedia] = useState<{
  images: string[];
  video?: string;
  videoType?: string;
}>({
  images: post?.media?.images || [],
  video: post?.media?.type === "video" ? post.media.src : post.file,
  videoType: post.file_type === "video" ? "video" : undefined,
});
  console.log("🚀 ~ EditPostModal ~ existingMedia:", existingMedia)
  const [postVideoPreviewUrl, setPostVideoPreviewUrl] = useState<string | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState(post.topic_id || "");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const topicButtonRef = useRef<HTMLButtonElement>(null);
  const topicContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 2000;
  const [topics, setTopics] = useState<any[]>([]); // list of topics

  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      if (
        response?.success?.statusCode === 200 &&
        response?.data?.data?.length
      ) {
        setTopics(response?.data?.data);
      } else {
        console.warn("Error during fetch topics details", response);
      }
    } catch (error) {
      console.error("Error fetching topic details:", error);
      showToast({
        message: "Failed to load Topics.",
        type: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Inside the useEffect that runs when modal opens
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    // Initialize form with post data
    setPostMessage(post.body || post.content || "");
    setSelectedTopic(post.topic_id || "");
    setExistingMedia({
      images: post?.media?.images || [],
      video: post?.media?.type === "video" ? post.media.src : post.file,
      videoType: post.file_type === "video" ? "video" : undefined,
    });
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen, post]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(event.target as Node) &&
        topicButtonRef.current &&
        !topicButtonRef.current.contains(event.target as Node)
      ) {
        setIsTopicDropdownOpen(false);
      }
    };

    if (isTopicDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTopicDropdownOpen]);

  // Prevent body scroll when modal is open
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    // Initialize form with post data
    setPostMessage(post.body || post.content || "");
    setSelectedTopic(post.topic_id || "");
    setExistingMedia({
      images: post?.media?.images || post?.images || [],
      video: post?.media?.type === "video" ? post.media.src : post.file,
      videoType: post.file_type === "video" ? "video" : undefined,
    });
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [isOpen, post]);

  // Cleanup video preview URLs
  useEffect(() => {
    return () => {
      if (postVideoPreviewUrl) {
        URL.revokeObjectURL(postVideoPreviewUrl);
      }
    };
  }, [postVideoPreviewUrl]);

  const handleTopicButtonClick = () => {
    setIsTopicDropdownOpen(!isTopicDropdownOpen);
    setTopicSearchQuery("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const invalidFiles = files.filter(
      (file) => !allowedImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      showToast({
        message: "Only JPG, JPEG, PNG, and WEBP image files are allowed.",
        type: "error",
        duration: 3000,
      });
      e.target.value = "";
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
  };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const allowedVideoTypes = ["video/mp4"];

//       if (!allowedVideoTypes.includes(file.type)) {
//         showToast({
//           message: "Only MP4 video files are allowed.",
//           type: "error",
//           duration: 3000,
//         });
//         e.target.value = "";
//         return;
//       }

//       setSelectedVideo(file);
//       const videoUrl = URL.createObjectURL(file);
//       setPostVideoPreviewUrl(videoUrl);
//     }
//   };

  const handleRemoveImage = (
    index: number,
    type: "existing" | "new" = "new"
  ) => {
    if (type === "existing") {
      setExistingMedia((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

//   const handleRemoveVideo = (type: "existing" | "new" = "new") => {
//     if (type === "existing") {
//       setExistingMedia((prev) => ({
//         ...prev,
//         video: undefined,
//         videoType: undefined,
//       }));
//     } else {
//       setSelectedVideo(null);
//       if (postVideoPreviewUrl) {
//         URL.revokeObjectURL(postVideoPreviewUrl);
//         setPostVideoPreviewUrl(null);
//       }
//     }
//   };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVideoSelectClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const getSelectedTopicName = () => {
    const selected = topics.find((t) => t.id === selectedTopic);
    return selected ? selected.topic_name : "-- What's this post about? --";
  };

  const filteredTopics = topics.filter((topic) =>
    topic.topic_name.toLowerCase().includes(topicSearchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    // Validation
    if (!postMessage || postMessage.trim().length < 1) {
      showToast({
        message: "Message is required and must contain at least one character.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (postMessage.length > maxChars) {
      showToast({
        message: `Message must not exceed ${maxChars} characters.`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const invalidImages = selectedImages.filter(
      (file) => !allowedImageTypes.includes(file.type)
    );
    if (invalidImages.length > 0) {
      showToast({
        message: "Only JPG, JPEG, PNG, and WEBP image files are allowed.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (selectedVideo && !["video/mp4"].includes(selectedVideo.type)) {
      showToast({
        message: "Only MP4 video files are allowed.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsPosting(true);

    const formData = new FormData();
    formData.append("content", postMessage);
    if (selectedTopic) {
      formData.append("topic_id", selectedTopic);
    }

    // Append new images
    selectedImages.forEach((image) => {
      formData.append("file", image);
    });


    try {
        const response = await EditPost(post.id, formData);
        if (response) {
          showToast({
            message: "Post updated successfully",
            type: "success",
            duration: 3000,
          });
          onPostUpdated?.(response.data);
          resetForm();
          onClose();
        }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.error?.message || "Failed to update post",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsPosting(false);
    }
  };

  const resetForm = () => {
    setPostMessage("");
    setSelectedTopic("");
    setSelectedImages([]);
    setSelectedVideo(null);
    setExistingMedia({ images: [] });
    if (postVideoPreviewUrl) {
      URL.revokeObjectURL(postVideoPreviewUrl);
      setPostVideoPreviewUrl(null);
    }
    setTopicSearchQuery("");
    setIsTopicDropdownOpen(false);
  };

  const handleClose = () => {
    if (
      postMessage !== (post.body || post.content || "") ||
      selectedImages.length > 0 ||
      selectedVideo ||
      existingMedia.images.length !==
        (post.images?.length || (post.media?.type === "image" ? 1 : 0)) ||
      existingMedia.video !==
        (post.media?.type === "video" ? post.media.src : post.file)
    ) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    resetForm();
    setShowCloseConfirm(false);
    onClose();
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality for edit
    console.log("Edit draft saved:", {
      postMessage,
      selectedImages,
      selectedVideo,
      existingMedia,
    });
    resetForm();
    setShowCloseConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-[18px] w-full overflow-y-auto max-w-[729px] mx-4 shadow-lg relative max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex ps-4 px-5 py-1.5 bg-[#897AFF1A] justify-between items-center sticky top-0 z-10">
            <h2 className="text-[18px] leading-[31px] tracking-[-0.01em] text-[#081021] font-poppins font-medium text-center align-middle capitalize">
              Edit Post
            </h2>
            <button
              onClick={handleClose}
              className="text-[#081021] text-[26px] hover:text-black cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="px-6 pt-5 flex items-center gap-2 md:gap-3">
            {userInfo && (
              <>
                <div>
                  <img
                    src={
                      !userInfo?.profile_picture ||
                      userInfo?.profile_picture === "null" ||
                      userInfo?.profile_picture === "undefined" ||
                      !userInfo?.profile_picture.startsWith("http")
                        ? "/profile.png"
                        : userInfo?.profile_picture
                    }
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    alt="User"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/profile.png";
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-black">
                    {userInfo?.name || "User"}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-200px)] relative">
            <textarea
              rows={4}
              className="w-full p-3 border border-[#ECEEF2] text-black placeholder:text-[#64748B] text-sm rounded-md resize-none mb-3 outline-none focus:border-[#897AFF1A]"
              placeholder={`What's on your mind? ${
                userInfo?.main_name || ""
              }...`}
              value={postMessage}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) {
                  setPostMessage(e.target.value);
                }
              }}
            />
            <div className="flex justify-end text-xs text-gray-500">
              {postMessage.length}/{maxChars}
            </div>

            {/* Combined Images Previews */}
            {(existingMedia.images.length > 0 || selectedImages.length > 0) && (
              <div className="mb-5.5">
                <p className="text-sm text-gray-600 mb-2">Images:</p>
                <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2">
                  {/* Existing Images */}
                  {existingMedia.images.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index}`}
                        className="w-full h-45 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-image.png";
                        }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index, "existing")}
                        className="absolute top-1 right-1 bg-[#FF9D9D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {selectedImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index}`}
                        className="w-full h-45 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index, "new")}
                        className="absolute top-1 right-1 bg-[#FF9D9D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Add New Image Button - Only show if we haven't reached a limit */}
                  {existingMedia.images.length + selectedImages.length < 10 && ( // Example limit of 10 images
                    <div className="h-45 border border-dashed border-[#D1D5DB] rounded-lg p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                      <div
                        className="flex flex-col items-center justify-center text-center h-full"
                        onClick={handleFileSelectClick}
                      >
                        <div className="mb-1">
                          <CirclePlus color="#7077FE" />
                        </div>
                        <p className="text-[#7077FE] font-medium text-sm">
                          Add new image
                        </p>
                        <p className="text-[#6B7280] text-xs">Maximum 3 mb</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          multiple
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {existingMedia.images.length === 0 &&
              selectedImages.length === 0 && (
                <div className="mb-5.5">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-45 border border-dashed border-[#D1D5DB] rounded-lg p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                      <div
                        className="flex flex-col items-center justify-center text-center h-full"
                        onClick={handleFileSelectClick}
                      >
                        <div className="mb-1">
                          <CirclePlus color="#7077FE" />
                        </div>
                        <p className="text-[#7077FE] font-medium text-sm">
                          Add new image
                        </p>
                        <p className="text-[#6B7280] text-xs">Maximum 3 mb</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          multiple
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* "Add to your post" section */}
            <div className="space-y-3 mb-4 flex rounded-lg border border-[#F07EFF1A] justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
              <p className="mb-0 text-sm font-semibold">Add to your post :</p>
              <div className="flex justify-end gap-2 w-6/12">
              <button
                  type="button"
                  onClick={handleVideoSelectClick}
                  className="flex gap-2 items-center text-sm font-medium text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#F4A5FF"
                    className="size-6"
                  >
                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleFileSelectClick}
                  className="flex gap-2 items-center text-sm font-medium text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#F2BF97"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                
                <div>
                  <label
                    className="flex gap-2 items-center text-sm font-medium text-gray-700 mb-1"
                    htmlFor="photo-upload"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#FF6F61"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    {/* <span className="text-black text-sm cursor-pointer">
                      Photo
                    </span> */}
                  </label>
                  {/* <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    id="photo-upload"
                    className="w-full hidden cursor-pointer"
                    multiple
                    onChange={handleImageChange}
                  /> */}
                </div>
              </div>
            </div>

            {/* Topic Selection - Now with relative positioning */}
            <div className="flex justify-between items-center mt-5.5 relative" ref={topicContainerRef}>
              <div className="relative w-full">
                <button
                  ref={topicButtonRef}
                  type="button"
                  onClick={handleTopicButtonClick}
                  className="w-full p-2 border border-[#ECEEF2] text-sm rounded-md outline-none focus:border-[#7077FE] bg-white text-left flex justify-between items-center"
                >
                  <span
                    className={selectedTopic ? "text-black" : "text-gray-500"}
                  >
                    {getSelectedTopicName()}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isTopicDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Topic Dropdown - Now positioned relative to the button */}
                {isTopicDropdownOpen && (
                  <div
                    ref={topicDropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ECEEF2] rounded-md shadow-lg z-9999"
                    style={{ maxHeight: "200px" }}
                  >
                    <div className="p-2 border-b border-[#ECEEF2] sticky top-0 bg-white">
                      <input
                        type="text"
                        value={topicSearchQuery}
                        onChange={(e) => setTopicSearchQuery(e.target.value)}
                        placeholder="Search topics..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-[#7077FE]"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>

                    <div className="overflow-y-auto" style={{ maxHeight: "150px" }}>
                      {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => {
                              setSelectedTopic(topic.id);
                              setIsTopicDropdownOpen(false);
                              setTopicSearchQuery("");
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#7077FE]/10 transition-colors ${
                              selectedTopic === topic.id
                                ? "bg-[#7077FE]/20 text-[#7077FE] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {topic.topic_name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No topics found
                        </div>
                      )}

                      {topics.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTopic("999999");
                            setIsTopicDropdownOpen(false);
                            setTopicSearchQuery("");
                          }}
                          className={`w-full text-left px-4 py-2 text-sm border-t border-[#ECEEF2] hover:bg-[#7077FE]/10 transition-colors ${
                            selectedTopic === "999999"
                              ? "bg-[#7077FE]/20 text-[#7077FE] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          Other
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end items-center mt-5.5">
              <button
                onClick={handleSubmit}
                disabled={isPosting}
                className="bg-[#7077FE] text-white px-6 py-2 rounded-full hover:bg-[#5b63e6] disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center justify-center min-w-20"
              >
                {isPosting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999"
          onClick={() => setShowCloseConfirm(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Do you want to save this as a draft?
            </h3>

            <div className="flex justify-center items-center flex-col gap-3">
              <button
                className="w-[50%] flex justify-center items-center py-2 bg-[#7077FE] text-white rounded-lg text-sm"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>

              <button
                className="w-[50%] flex justify-center items-center py-2 bg-red-500 text-white rounded-lg text-sm"
                onClick={handleDiscard}
              >
                Discard
              </button>

              <button
                className="w-[50%] flex justify-center items-center py-2 bg-gray-200 text-black rounded-lg text-sm"
                onClick={() => setShowCloseConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPostModal;