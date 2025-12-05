import React, { useState, useRef, useEffect } from "react";
import { CirclePlus, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { EditPost, GetSinglePost, getTopics } from "../Common/ServerAPI";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: {
    id: string;
    body?: string;
    content?: string;
    is_reel?: boolean;
    media?: {
      type: "image" | "video" | "text";
      src: string;
      alt?: string;
      images?: string[];
    };
    images?: string[];
    file?: string;
    file_type?: "image" | "video";
    topic_id?: string;
    date?: string;
  };
  topics?: Array<{
    id: string;
    topic_name: string;
  }>;
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
  posts,
  userInfo,
  onPostUpdated
}) => {
  const { showToast } = useToast();

  const [post, setPost] = useState({ ...posts });
  const [postMessage, setPostMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const topicButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 2000;
  const [topics, setTopics] = useState<any[]>([]);

  // Fetch post details when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        const response = await GetSinglePost(posts.id);

        if (response?.success?.statusCode === 200) {
          const p = response?.data?.data;

          // Parse existing files
          let filesArray: string[] = [];
          if (p.file) {
            filesArray = p.file.split(",").map((url: string) => url.trim()).filter(Boolean);
          }

          setPost({
            id: p.id,
            date: p.createdAt,
            body: p.content,
            content: p.content,
            topic_id: p.topic_id,
            is_reel: posts?.is_reel || false,
            media: {
              type: filesArray.length > 0 ? 'image' : 'text',
              src: filesArray[0] || '',
              alt: p.content,
              images: filesArray
            }
          });

          setPostMessage(p.content || "");
          setSelectedTopic(p.topic_id || "");
          setExistingImages(filesArray);
          setSelectedImages([]);
          setRemovedExistingImages([]);
        } else {
          console.warn("Error during fetch post details", response);
          showToast({
            message: "Failed to load post details.",
            type: "error",
            duration: 3000
          });
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
        showToast({
          message: "Failed to load post details.",
          type: "error",
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [isOpen, posts.id]);

  // Fetch topics
  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      if (response?.success?.statusCode === 200 && response?.data?.data?.length) {
        setTopics(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
      showToast({
        message: "Failed to load Topics.",
        type: "error",
        duration: 3000
      });
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle click outside topic dropdown
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

  const handleTopicButtonClick = () => {
    setIsTopicDropdownOpen(!isTopicDropdownOpen);
    setTopicSearchQuery("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const invalidFiles = files.filter((file) => !allowedImageTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      showToast({
        message: "Only JPG, JPEG, PNG, and WEBP image files are allowed.",
        type: "error",
        duration: 3000
      });
      e.target.value = "";
      return;
    }

    const totalImages = existingImages.length + selectedImages.length + files.length;
    if (totalImages > 10) {
      showToast({
        message: `You can only upload up to 10 images. Current: ${existingImages.length + selectedImages.length}, Adding: ${files.length}`,
        type: "error",
        duration: 3000
      });
      e.target.value = "";
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveExistingImage = (index: number) => {
    const imageUrl = existingImages[index];
    setRemovedExistingImages((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      // Reset the input value to allow selecting the same file again
      fileInputRef.current.value = '';
      fileInputRef.current.click();
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
        duration: 3000
      });
      return;
    }

    if (postMessage.length > maxChars) {
      showToast({
        message: `Message must not exceed ${maxChars} characters.`,
        type: "error",
        duration: 3000
      });
      return;
    }

    setIsPosting(true);

    try {
      const formData = new FormData();

      /**
       * Backend API Payload Structure:
       * - id: added automatically by EditPost() function
       * - content: post text content (required)
       * - topic_id: selected topic ID (optional)
       * - existing_files: JSON.stringify([urls]) - files to KEEP from current post
       * - files: multipart file uploads - NEW files to ADD
       *
       * Examples:
       * 1. Keep some + add new: existing_files=['url1.jpg'] + files=[newFile]
       * 2. Remove all + add new: no existing_files + files=[newFile1, newFile2]
       * 3. Keep all + add new: existing_files=['url1.jpg','url2.jpg'] + files=[newFile]
       * 4. Update content only: existing_files=[...all urls...] + no files
       * 5. Remove all files: no existing_files + no files
       */

      // Add content (required)
      formData.append("content", postMessage);

      // Add topic if selected (optional)
      if (selectedTopic) {
        formData.append("topic_id", selectedTopic);
      }

      // Add existing image URLs as JSON stringified array (files to KEEP)
      if (existingImages.length > 0) {
        formData.append("existing_files", JSON.stringify(existingImages));
      }

      // Add all new image files (files to ADD)
      selectedImages.forEach((image) => {
        formData.append("file", image);
      });

      console.log("Submitting form data:");
      console.log("- Content:", postMessage);
      console.log("- Topic ID:", selectedTopic);
      console.log("- Existing images (JSON array):", existingImages.length, existingImages);
      console.log("- New images (files):", selectedImages.length);

      const response = await EditPost(post.id, formData);

      if (response) {
        showToast({
          message: "Post updated successfully",
          type: "success",
          duration: 3000
        });

        resetForm();
        onClose();

        // Call the parent callback to refresh the data
        if (onPostUpdated) {
          onPostUpdated(response.data);
        }
      }
    } catch (err: any) {
      console.error("Error updating post:", err);
      showToast({
        message: err?.response?.data?.error?.message || "Failed to update post",
        type: "error",
        duration: 5000
      });
    } finally {
      setIsPosting(false);
    }
  };

  const resetForm = () => {
    setPostMessage("");
    setSelectedTopic("");
    setSelectedImages([]);
    setExistingImages([]);
    setRemovedExistingImages([]);
    setTopicSearchQuery("");
    setIsTopicDropdownOpen(false);
  };

  const hasChanges = () => {
    return (
      postMessage !== (post.body || post.content || "") ||
      selectedImages.length > 0 ||
      removedExistingImages.length > 0 ||
      selectedTopic !== (post.topic_id || "")
    );
  };

  const handleClose = () => {
    if (hasChanges()) {
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
    // TODO: Implement save draft functionality
    console.log("Edit draft saved:", {
      postMessage,
      selectedImages: selectedImages.length,
      existingImages: existingImages.length,
      removedImages: removedExistingImages.length
    });
    resetForm();
    setShowCloseConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  const totalImages = existingImages.length + selectedImages.length;

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
          {/* Header */}
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

          {/* User Info */}
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

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-200px)] relative">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-[#7077FE] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Message Input */}
                <textarea
                  rows={4}
                  className="w-full p-3 border border-[#ECEEF2] text-black placeholder:text-[#64748B] text-sm rounded-md resize-none mb-3 outline-none focus:border-[#897AFF1A]"
                  placeholder={`What's on your mind? ${userInfo?.main_name || ""}...`}
                  value={postMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= maxChars) {
                      setPostMessage(e.target.value);
                    }
                  }}
                />
                <div className="flex justify-end text-xs text-gray-500 mb-4">
                  {postMessage.length}/{maxChars}
                </div>

                {/* Images Grid */}
                {totalImages > 0 && (
                  <div className="mb-5">
                    <p className="text-sm text-gray-600 mb-2">
                      Images ({totalImages}/10):
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-2">
                      {/* Existing Images */}
                      {existingImages.map((imageUrl, index) => (
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
                            onClick={() => handleRemoveExistingImage(index)}
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
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-1 right-1 bg-[#FF9D9D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {/* Add More Button */}
                      {totalImages < 10 && (
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add Images Section (when no images) */}
                {totalImages === 0 && (
                  <div className="mb-5">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-24 border border-dashed border-[#D1D5DB] rounded-lg p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                        <div
                          className="flex flex-col items-center justify-center text-center h-full"
                          onClick={handleFileSelectClick}
                        >
                          <CirclePlus color="#7077FE" />
                          <p className="text-[#7077FE] font-medium text-xs mt-1">
                            Add image
                          </p>
                          <p className="text-[#6B7280] text-xs">Max 3 MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hidden File Input - Single source of truth */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  multiple
                  onChange={handleImageChange}
                />

                {/* Add to Post Section */}
                <div className="space-y-3 mb-4 flex rounded-lg border border-[#F07EFF1A] justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
                  <p className="mb-0 text-sm font-semibold">Add to your post:</p>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleFileSelectClick}
                      className="flex gap-2 items-center text-sm font-medium text-gray-700 hover:opacity-80"
                      title="Add images"
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
                  </div>
                </div>

                {/* Topic Selection */}
                <div className="flex justify-between items-center mt-5 relative">
                  <div className="relative w-full">
                    <button
                      ref={topicButtonRef}
                      type="button"
                      onClick={handleTopicButtonClick}
                      className="w-full p-2 border border-[#ECEEF2] text-sm rounded-md outline-none focus:border-[#7077FE] bg-white text-left flex justify-between items-center"
                    >
                      <span className={selectedTopic ? "text-black" : "text-gray-500"}>
                        {getSelectedTopicName()}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isTopicDropdownOpen ? "rotate-180" : ""
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

                    {isTopicDropdownOpen && (
                      <div
                        ref={topicDropdownRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#ECEEF2] rounded-md shadow-lg z-50"
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
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#7077FE]/10 transition-colors ${selectedTopic === topic.id
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
                              className={`w-full text-left px-4 py-2 text-sm border-t border-[#ECEEF2] hover:bg-[#7077FE]/10 transition-colors ${selectedTopic === "999999"
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
                <div className="flex justify-end items-center mt-5">
                  <button
                    onClick={handleSubmit}
                    disabled={isPosting || !postMessage.trim()}
                    className="bg-[#7077FE] text-white px-6 py-2 rounded-full hover:bg-[#5b63e6] disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center justify-center min-w-24"
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
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
                className="w-[50%] flex justify-center items-center py-2 bg-[#7077FE] text-white rounded-lg text-sm hover:bg-[#5b63e6]"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button
                className="w-[50%] flex justify-center items-center py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                className="w-[50%] flex justify-center items-center py-2 bg-gray-200 text-black rounded-lg text-sm hover:bg-gray-300"
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