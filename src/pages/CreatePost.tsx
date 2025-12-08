import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// import Image from "../components/ui/Image";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { AddPost, GetConnectionUser, GetCountryDetails } from "../Common/ServerAPI";
import { CirclePlus, 
    // Smile,
    //  UserPlus 
    } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo?: {
    id?: string;
    name?: string;
    profile_picture?: string;
    main_name?: string;
  };
  onPostCreated?: (newPost: any) => void;
  topics?: Array<{ id: string; topic_name: string }>;
}

// interface Topic {
//   id: string;
//   topic_name: string;
//   slug: string;
// }

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  userInfo,
  onPostCreated,
  topics = [],
}) => {
  const { showToast } = useToast();
  const [postMessage, setPostMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [postVideoPreviewUrl, setPostVideoPreviewUrl] = useState<string | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // New fields: feeling, location, tags
  const [feeling, setFeeling] = useState<string>("");
  const [feelingEmoji, setFeelingEmoji] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationId, setLocationId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  // const [tagInput, setTagInput] = useState<string>("");

  // Popup states for feeling, location, and tags modals
  const [isFeelingPopupOpen, setIsFeelingPopupOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isTagsPopupOpen, setIsTagsPopupOpen] = useState(false);
  const [feelingSearchQuery, setFeelingSearchQuery] = useState<string>("");

  // Friends list state
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>("");

  // Countries list state
  const [countries, setCountries] = useState<any[]>([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>("");

  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 2000;

  // Predefined feelings list - expanded for two-column grid
  const feelings = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😍", label: "Loved" },
    { emoji: "😎", label: "Cool" },
    { emoji: "🎉", label: "Excited" },
    { emoji: "😌", label: "Blessed" },
    { emoji: "😆", label: "Grateful" },
    { emoji: "🤗", label: "Thankful" },
    { emoji: "😇", label: "Peaceful" },
    { emoji: "🥰", label: "Adored" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😤", label: "Frustrated" },
  ];


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(event.target as Node)
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
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Cleanup video preview URLs
  useEffect(() => {
    return () => {
      if (postVideoPreviewUrl) {
        URL.revokeObjectURL(postVideoPreviewUrl);
      }
    };
  }, [postVideoPreviewUrl]);

  // Fetch friends for tagging
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await GetConnectionUser(friendSearchQuery, 1, 100);
        if (response?.data?.data?.rows) {
          setFriends(response.data.data.rows);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    if (isOpen || isTagsPopupOpen) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        fetchFriends();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, isTagsPopupOpen, friendSearchQuery]);

  // Fetch countries for location
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await GetCountryDetails();
        if (response?.data?.data) {
          setCountries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    if (isOpen || isLocationPopupOpen) {
      fetchCountries();
    }
  }, [isOpen, isLocationPopupOpen]);

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

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    setSelectedVideo(null);
    if (postVideoPreviewUrl) {
      URL.revokeObjectURL(postVideoPreviewUrl);
      setPostVideoPreviewUrl(null);
    }
  };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
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

  // Handle adding tags
  // const handleAddTag = () => {
  //   if (tagInput.trim() && !tags.includes(tagInput.trim())) {
  //     setTags([...tags, tagInput.trim()]);
  //     setTagInput("");
  //   }
  // };

  // const handleRemoveTag = (tagToRemove: string) => {
  //   setTags(tags.filter(tag => tag !== tagToRemove));
  // };

  // const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     handleAddTag();
  //   }
  // };

  // Handle selecting a feeling
  const handleSelectFeeling = (feelingLabel: string, emoji: string) => {
    setFeeling(feelingLabel);
    setFeelingEmoji(emoji);
    setIsFeelingPopupOpen(false);
    setFeelingSearchQuery("");
  };

  // Handle closing feeling popup
  const handleCloseFeelingPopup = () => {
    setIsFeelingPopupOpen(false);
    setFeelingSearchQuery("");
  };

  // Filter feelings based on search query
  const filteredFeelings = feelings.filter((feeling) =>
    feeling.label.toLowerCase().includes(feelingSearchQuery.toLowerCase())
  );

  // Handle selecting a location
  const handleSelectLocation = (country: any) => {
    setLocation(country.name);
    setLocationId(country.id.toString());
    setIsLocationPopupOpen(false);
    setLocationSearchQuery("");
  };

  // Handle closing location popup
  const handleCloseLocationPopup = () => {
    setIsLocationPopupOpen(false);
    setLocationSearchQuery("");
  };

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // Handle toggling friend selection
  const handleToggleFriend = (friend: any) => {
    const isSelected = selectedFriends.find(f => f.id === friend.id);
    if (isSelected) {
      setSelectedFriends(selectedFriends.filter(f => f.id !== friend.id));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  // Handle confirming friend tags
  const handleConfirmTags = () => {
    const friendNames = selectedFriends.map(f =>
      `${f.friend_user?.profile?.first_name || f.first_name} ${f.friend_user?.profile?.last_name || f.last_name}`
    );
    const friendIds = selectedFriends.map(f => {
      // Get the actual user ID from friend_user or fallback to friend id
      const userId = f.friend_user?.id || f.user_id || f.id;
      return userId.toString();
    });
    setTags(friendNames);
    setTagIds(friendIds);
    setIsTagsPopupOpen(false);
    setFriendSearchQuery("");
  };

  // Handle closing tag popup
  const handleCloseTagPopup = () => {
    setIsTagsPopupOpen(false);
    setFriendSearchQuery("");
  };

  // Generate formatted display sentence
  // const getFormattedSentence = () => {
  //   const userName = userInfo?.name || userInfo?.main_name || "User";
  //   let sentence = userName;

  //   // Add feeling
  //   if (feeling) {
  //     sentence += ` is feeling ${feeling}`;
  //   }

  //   // Add tagged friends
  //   if (tags.length > 0) {
  //     if (tags.length === 1) {
  //       sentence += ` with ${tags[0]}`;
  //     } else if (tags.length === 2) {
  //       sentence += ` with ${tags[0]} and ${tags[1]}`;
  //     } else {
  //       sentence += ` with ${tags[0]} and ${tags.length - 1} ${tags.length - 1 === 1 ? 'other' : 'others'}`;
  //     }
  //   }

  //   // Add location
  //   if (location) {
  //     sentence += ` at ${location}`;
  //   }

  //   return sentence;
  // };

  const handleSubmitPost = async () => {
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

    // Add feeling, location, and tags
    if (feeling) {
      formData.append("feeling", feeling);
    }

    if (locationId) {
      formData.append("location_id", locationId);
    }

    if (tagIds.length > 0) {
      formData.append("tag_ids", JSON.stringify(tagIds));
    }

    selectedImages.forEach((image) => {
      formData.append("file", image);
    });

    if (selectedVideo) {
      formData.append("file", selectedVideo);
    }

    try {
      const response = await AddPost(formData);

      if (response) {
        showToast({
          message: "Post created successfully",
          type: "success",
          duration: 3000,
        });

        if (response.data && response.data.data) {
          const newPost = response.data.data;

          // Transform to match your Post interface
          const transformedPost = {
            id: newPost.id,
            user_id: newPost.user_id,
            content: newPost.content,
            file: newPost.file,
            file_type: newPost.file_type,
            is_poll: newPost.is_poll,
            poll_id: newPost.poll_id,
            createdAt: newPost.createdAt,
            likes_count: newPost.likes_count,
            comments_count: newPost.comments_count,
            if_following: newPost.if_following,
            if_friend: newPost.if_friend,
            is_liked: newPost.is_liked,
            is_saved: newPost.is_saved,
            is_requested: newPost.is_requested,
            product_id: null,
            user: {
              id: newPost.user.id,
              username: newPost.user.username,
            },
            profile: {
              id: newPost.profile.id,
              user_id: newPost.profile.user_id,
              first_name: newPost.profile.first_name,
              last_name: newPost.profile.last_name,
              profile_picture: newPost.profile.profile_picture,
            },
            friend_request_status: "",
          };

          onPostCreated?.(transformedPost);
        }

        // Reset form
        resetForm();
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.error?.message || "Failed to create post",
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
    if (postVideoPreviewUrl) {
      URL.revokeObjectURL(postVideoPreviewUrl);
      setPostVideoPreviewUrl(null);
    }
    setTopicSearchQuery("");
    setFeeling("");
    setFeelingEmoji("");
    setLocation("");
    setLocationId("");
    setTags([]);
    setTagIds([]);
    // setTagInput("");
    setSelectedFriends([]);
    setFriendSearchQuery("");
  };

  const handleClose = () => {
    if (postMessage.trim() || selectedImages.length > 0 || selectedVideo) {
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
    console.log("Draft saved:", { postMessage, selectedImages, selectedVideo });
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
          className="bg-white rounded-[18px] w-full overflow-y-auto max-w-[729px] mx-4 shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex ps-4 px-5 py-1.5 bg-[#897AFF1A] justify-between items-center">
            <h2 className="text-[18px] leading-[31px] tracking-[-0.01em] text-[#081021] font-poppins font-medium text-center align-middle capitalize">
              Create Post
            </h2>
            <button
              onClick={handleClose}
              className="text-[#081021] text-[26px] hover:text-black cursor-pointer"
            >
              ×
            </button>
          </div>

          <div className="px-6 pt-5 flex items-center gap-2 md:gap-3">
            <Link to={`/dashboard/userprofile/${userInfo?.id}`}>
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
            </Link>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1 text-sm md:text-base">
                <Link to={`/dashboard/userprofile/${userInfo?.id}`} className="font-semibold text-black hover:underline">
                  {userInfo?.name || "User"}
                </Link>
                {/* Formatted sentence: "is feeling Happy with John and 2 others at New York" */}
                {(feeling || tags.length > 0 || location) && (
                  <>
                    {feeling && (
                      <>
                        <span className="text-gray-600 text-xs md:text-sm">is feeling</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F2BF97]/30 rounded-full font-medium text-gray-800 text-xs">
                          <button
                            onClick={() => setIsFeelingPopupOpen(true)}
                            className="hover:underline inline-flex items-center gap-1"
                          >
                            {feelingEmoji && <span className="text-sm">{feelingEmoji}</span>}
                            {feeling}
                          </button>
                          <button
                            onClick={() => {
                              setFeeling("");
                              setFeelingEmoji("");
                            }}
                            className="hover:text-red-500"
                            title="Remove feeling"
                          >
                            ×
                          </button>
                        </span>
                      </>
                    )}
                    {tags.length > 0 && (
                      <>
                        <span className="text-gray-600 text-xs md:text-sm">with</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4A5FF]/30 rounded-full font-medium text-gray-800 text-xs">
                          <button
                            onClick={() => setIsTagsPopupOpen(true)}
                            className="hover:underline"
                          >
                            {tags.length === 1 ? (
                              tags[0]
                            ) : (
                              `${tags[0]} and ${tags.length - 1} More`
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setTags([]);
                              setTagIds([]);
                              setSelectedFriends([]);
                            }}
                            className="hover:text-red-500"
                            title="Remove all tags"
                          >
                            ×
                          </button>
                        </span>
                      </>
                    )}
                    {location && (
                      <>
                        <span className="text-gray-600 text-xs md:text-sm">at</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FF6F61]/30 rounded-full font-medium text-gray-800 text-xs">
                          <button
                            onClick={() => setIsLocationPopupOpen(true)}
                            className="hover:underline"
                          >
                            {location}
                          </button>
                          <button
                            onClick={() => {
                              setLocation("");
                              setLocationId("");
                            }}
                            className="hover:text-red-500"
                            title="Remove location"
                          >
                            ×
                          </button>
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
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

            {/* Image Previews */}
            <div className="mb-5.5">
              <div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto pr-2">
                {selectedImages.length > 0 && (
                  <>
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-full h-45 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-[#FF9D9D] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <span>X</span>
                        </button>
                      </div>
                    ))}
                  </>
                )}
                <div className="mb-6 h-45 border border-dashed border-[#D1D5DB] rounded-lg p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                  <div
                    className="flex flex-col items-center justify-center text-center h-full"
                    onClick={handleFileSelectClick}
                  >
                    {/* Icon */}
                    <div className="mb-1">
                      <CirclePlus color="#7077FE" />
                    </div>

                    {/* Text */}
                    <p className="text-[#7077FE] font-medium text-sm">
                      Add image
                    </p>
                    <p className="text-[#6B7280] text-xs">Maximum 3 mb</p>

                    {/* Hidden file input */}
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

            {/* Video Preview */}
            {postVideoPreviewUrl && (
              <div className="mb-4 relative">
                <video
                  controls
                  className="w-full max-h-[300px] rounded-lg object-cover"
                  src={postVideoPreviewUrl}
                />
                <button
                  onClick={handleRemoveVideo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            {/* "Add to your post" section */}
            <div className="space-y-3 mb-4 flex rounded-lg border border-[#F07EFF1A] justify-between items-center px-6 py-4 bg-[#F07EFF1A]">
              <p className="mb-0 text-sm font-semibold">Add to your post :</p>
              <div className="flex justify-end gap-2 w-6/12">
                {/* Tag Friends Icon */}
                <button
                  type="button"
                  onClick={() => setIsTagsPopupOpen(true)}
                  className="flex gap-2 items-center text-sm font-medium text-gray-700 cursor-pointer hover:opacity-80"
                  title="Tag Friends"
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

                {/* Feeling Icon */}
                <button
                  type="button"
                  onClick={() => setIsFeelingPopupOpen(true)}
                  className="flex gap-2 items-center text-sm font-medium text-gray-700 cursor-pointer hover:opacity-80"
                  title="Add Feeling"
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

                {/* Location Icon */}
                <button
                  type="button"
                  onClick={() => setIsLocationPopupOpen(true)}
                  className="flex gap-2 items-center text-sm font-medium text-gray-700 cursor-pointer hover:opacity-80"
                  title="Add Location"
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
                </button>
              </div>
            </div>


            <div className="flex justify-between items-center mt-5.5">
              <div className="relative w-full " ref={topicDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
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

                {isTopicDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#ECEEF2] rounded-md shadow-lg max-h-64 overflow-hidden">
                    <div className="p-2 border-b border-[#ECEEF2] sticky top-0 bg-white">
                      <input
                        type="text"
                        value={topicSearchQuery}
                        onChange={(e) => setTopicSearchQuery(e.target.value)}
                        placeholder="Search topics..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-[#7077FE]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
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
            <div className="flex justify-end items-center mt-5.5">
              <button
                onClick={handleSubmitPost}
                disabled={isPosting}
                className="bg-[#7077FE] text-white px-6 py-2 rounded-full hover:bg-[#5b63e6] disabled:opacity-50 disabled:cursor-not-allowed relative flex items-center justify-center min-w-20"
              >
                {isPosting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting...
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close Confirmation Modal */}
      {showCloseConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999"
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

      {/* Feeling Popup Modal - Modern Apple-Style Design */}
      {isFeelingPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseFeelingPopup}
        >
          <div
            className="bg-white rounded-4xl w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with background #897AFF1A */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#897AFF1A]">
              <button
                onClick={handleCloseFeelingPopup}
                className="w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-[#0F1320] tracking-tight">How are you feeling?</h3>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Search Bar */}
            <div className="px-6 pt-6 pb-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={feelingSearchQuery}
                  onChange={(e) => setFeelingSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/60 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7077FE]/20 focus:border-[#7077FE]/40 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Emoji Grid - Two Column Layout */}
            <div className="px-6 pb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filteredFeelings.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredFeelings.map((feel) => (
                    <button
                      key={feel.label}
                      onClick={() => handleSelectFeeling(feel.label, feel.emoji)}
                      className="flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-200 bg-white/60 hover:bg-white/90 hover:shadow-sm"
                    >
                      {/* Circular emoji container */}
                      <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl">{feel.emoji}</span>
                      </div>
                      {/* Feeling label */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-[#0F1320] text-base truncate">{feel.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#0F1320] font-semibold text-base mb-1">No matches found</p>
                  <p className="text-gray-500 text-sm">Try searching with a different feeling</p>
                </div>
              )}
            </div>

            {/* Done Button - Primary button color #7077FE */}
            <div className="px-6 pb-6">
              <button
                onClick={handleCloseFeelingPopup}
                className="w-full py-3 bg-[#7077FE] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#7077FE]/25 hover:shadow-xl hover:shadow-[#7077FE]/30 hover:bg-[#5b63e6] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Popup Modal - Modern Apple-Style Design */}
      {isLocationPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseLocationPopup}
        >
          <div
            className="bg-white rounded-4xl w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with background #897AFF1A */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#897AFF1A]">
              <button
                onClick={handleCloseLocationPopup}
                className="w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Search for location</h3>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Search Bar */}
            <div className="px-6 pt-6 pb-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/60 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7077FE]/20 focus:border-[#7077FE]/40 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Location List */}
            <div className="px-4 pb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {filteredCountries.length > 0 ? (
                <div className="space-y-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleSelectLocation(country)}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-200 bg-white/60 hover:bg-white/90 hover:shadow-sm"
                    >
                      {/* Circular icon container */}
                      <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {/* Location text */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-gray-900 text-base truncate">{country.name}</p>
                        <p className="text-sm text-gray-500 font-medium">{country.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-semibold text-base mb-1">
                    {locationSearchQuery ? "No matches found" : "No locations available"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {locationSearchQuery ? "Try searching with a different name" : "No locations to display"}
                  </p>
                </div>
              )}
            </div>

            {/* Done Button - Primary button color #7077FE */}
            <div className="px-6 pb-6">
              <button
                onClick={handleCloseLocationPopup}
                className="w-full py-3 bg-[#7077FE] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#7077FE]/25 hover:shadow-xl hover:shadow-[#7077FE]/30 hover:bg-[#5b63e6] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag People Popup - Modern Apple-Style Design */}
      {isTagsPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60 p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseTagPopup}
        >
          <div
            className="bg-white rounded-4xl w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with background #897AFF1A */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#897AFF1A]">
              <button
                onClick={handleCloseTagPopup}
                className="w-10 h-10 rounded-full bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-xl font-bold text-[#0F1320] tracking-tight">Tag people</h3>
              <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            {/* Search Bar with Done Button */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={friendSearchQuery}
                    onChange={(e) => setFriendSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200/60 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7077FE]/20 focus:border-[#7077FE]/40 transition-all"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleConfirmTags}
                  disabled={selectedFriends.length === 0}
                  className="px-6 py-3 bg-[#7077FE] text-white rounded-full font-semibold text-sm shadow-lg shadow-[#7077FE]/25 hover:shadow-xl hover:shadow-[#7077FE]/30 hover:bg-[#5b63e6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Selected Count Badge */}
            {selectedFriends.length > 0 && (
              <div className="px-6 pb-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#7077FE]/10 rounded-full border border-[#7077FE]/20">
                  <div className="w-2 h-2 rounded-full bg-[#7077FE]"></div>
                  <span className="text-sm font-semibold text-[#0F1320]">
                    {selectedFriends.length} {selectedFriends.length === 1 ? 'person' : 'people'} selected
                  </span>
                </div>
              </div>
            )}

            {/* People List */}
            <div className="px-4 pb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {friends.length > 0 ? (
                <div className="space-y-2">
                  {friends.map((friend) => {
                    const isSelected = selectedFriends.find(f => f.id === friend.id);
                    const firstName = friend.friend_user?.profile?.first_name || friend.first_name || 'User';
                    const lastName = friend.friend_user?.profile?.last_name || friend.last_name || '';
                    const profilePic = friend.friend_user?.profile?.profile_picture || friend.profile_picture || '/profile.png';
                    const username = friend.friend_user?.username || friend.username || 'user';

                    return (
                      <button
                        key={friend.id}
                        onClick={() => handleToggleFriend(friend)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-200 ${
                          isSelected
                            ? "bg-[#7077FE]/8 shadow-sm"
                            : "bg-white/60 hover:bg-white/90 hover:shadow-sm"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={profilePic}
                            alt={`${firstName} ${lastName}`}
                            className="w-14 h-14 rounded-full object-cover shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/profile.png";
                            }}
                          />
                          {isSelected && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#7077FE] rounded-full flex items-center justify-center shadow-md border-2 border-white">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-bold text-[#0F1320] text-base truncate">{firstName} {lastName}</p>
                          <p className="text-sm text-gray-500 font-medium">
                            {/* You can add friend count or other info here */}
                            @{username}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-[#0F1320] font-semibold text-base mb-1">
                    {friendSearchQuery ? "No matches found" : "No friends available"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {friendSearchQuery ? "Try searching with a different name" : "Connect with friends to tag them"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostModal;
