import React, { useState, useRef, useEffect } from "react";
import { CirclePlus, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { EditPost, GetSinglePost, getTopics, GetConnectionUser, GetCountryDetails } from "../Common/ServerAPI";
import { Link } from "react-router-dom";

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
  userInfo: propUserInfo,
  onPostUpdated
}) => {
  const { showToast } = useToast();

  // Get userInfo from props or localStorage
  const [userInfo] = useState(() => {
    if (propUserInfo) return propUserInfo;

    // Fallback to localStorage if userInfo not provided
    const storedName = localStorage.getItem("Name");
    const storedId = localStorage.getItem("Id");
    const storedProfilePic = localStorage.getItem("profile_picture");

    return {
      id: storedId || undefined,
      name: storedName || undefined,
      main_name: storedName || undefined,
      profile_picture: storedProfilePic || undefined,
    };
  });
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

  // New fields: feeling, location, tags
  const [feeling, setFeeling] = useState<string>("");
  const [feelingEmoji, setFeelingEmoji] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationId, setLocationId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);

  // Popup states for feeling, location, and tags modals
  const [isFeelingPopupOpen, setIsFeelingPopupOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isTagsPopupOpen, setIsTagsPopupOpen] = useState(false);
  const [feelingSearchQuery, setFeelingSearchQuery] = useState<string>("");
  const [locationSearchQuery, setLocationSearchQuery] = useState<string>("");

  // Friends and countries list state
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState<string>("");
  const [countries, setCountries] = useState<any[]>([]);

  const topicDropdownRef = useRef<HTMLDivElement>(null);
  const topicButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 2000;
  const [topics, setTopics] = useState<any[]>([]);

  // Predefined feelings list
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

  // Helper function to fetch and set location name from location_id
  const fetchAndSetLocation = async (locationId: string) => {
    try {
      const response = await GetCountryDetails();
      if (response?.data?.data) {
        const country = response.data.data.find((c: any) => c.id === locationId);
        if (country) {
          setLocation(country.name);
        }
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

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

          // Load feeling, location, and tags
          if (p.feeling) {
            setFeeling(p.feeling);
            // Find emoji for this feeling
            const feelingData = feelings.find(f => f.label === p.feeling);
            if (feelingData) {
              setFeelingEmoji(feelingData.emoji);
            }
          }

          // Load location
          if (p.location_id) {
            setLocationId(p.location_id.toString());
            // Fetch country name from GetCountryDetails API
            fetchAndSetLocation(p.location_id);
          }

          // Load tagged users
          if (p.tagged_users && Array.isArray(p.tagged_users) && p.tagged_users.length > 0) {
            const userNames = p.tagged_users.map((user: any) =>
              `${user.first_name || ''} ${user.last_name || ''}`.trim()
            );
            const userIds = p.tagged_users.map((user: any) => user.id.toString());

            setTags(userNames);
            setTagIds(userIds);

            // Convert tagged_users to match friend structure for selectedFriends
            const friendsFormat = p.tagged_users.map((user: any) => ({
              id: user.id,
              user_id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              profile_picture: user.profile_picture,
              friend_user: null
            }));
            setSelectedFriends(friendsFormat);
          }
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

    if (isOpen && isTagsPopupOpen) {
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

    if (isOpen && isLocationPopupOpen) {
      fetchCountries();
    }
  }, [isOpen, isLocationPopupOpen]);

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

  // Filter feelings based on search query
  const filteredFeelings = feelings.filter((feeling) =>
    feeling.label.toLowerCase().includes(feelingSearchQuery.toLowerCase())
  );

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

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

  // Handle toggling friend selection
  const handleToggleFriend = (friend: any) => {
    const friendUserId = friend.friend_user?.id || friend.user_id || friend.id;
    const isSelected = selectedFriends.find(f => {
      const selectedId = f.friend_user?.id || f.user_id || f.id;
      return selectedId?.toString() === friendUserId?.toString();
    });
    if (isSelected) {
      setSelectedFriends(selectedFriends.filter(f => {
        const selectedId = f.friend_user?.id || f.user_id || f.id;
        return selectedId?.toString() !== friendUserId?.toString();
      }));
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

      {/* Feeling Popup Modal - Modern Apple-Style Design */}
      {isFeelingPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseFeelingPopup}
        >
          <div
            className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
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
              <div className="w-10"></div>
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
                  {filteredFeelings.map((feel) => {
                    const isSelected = feeling === feel.label;
                    return (
                      <button
                        key={feel.label}
                        onClick={() => handleSelectFeeling(feel.label, feel.emoji)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-3xl transition-all duration-200 ${
                          isSelected
                            ? "bg-[#7077FE]/8 shadow-sm ring-2 ring-[#7077FE]/30"
                            : "bg-white/60 hover:bg-white/90 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-2xl">{feel.emoji}</span>
                        </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-[#0F1320] text-base truncate">{feel.label}</p>
                      </div>
                    </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[#0F1320] font-semibold text-base mb-1">No matches found</p>
                  <p className="text-gray-500 text-sm">Try searching with a different feeling</p>
                </div>
              )}
            </div>

            {/* Done Button */}
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
          className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseLocationPopup}
        >
          <div
            className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
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
              <div className="w-10"></div>
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
                  {filteredCountries.map((country) => {
                    const isSelected = locationId === country.id.toString();
                    return (
                      <button
                        key={country.id}
                        onClick={() => handleSelectLocation(country)}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-200 ${
                          isSelected
                            ? "bg-[#7077FE]/8 shadow-sm ring-2 ring-[#7077FE]/30"
                            : "bg-white/60 hover:bg-white/90 hover:shadow-sm"
                        }`}
                      >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
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
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-bold text-gray-900 text-base truncate">{country.name}</p>
                        <p className="text-sm text-gray-500 font-medium">{country.name}</p>
                      </div>
                    </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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

            {/* Done Button */}
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
          className="fixed inset-0 flex items-center justify-center z-[60] p-4 backdrop-blur-md bg-black/40"
          onClick={handleCloseTagPopup}
        >
          <div
            className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
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
              <div className="w-10"></div>
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
                    // Get the actual user ID from friend (could be in different places)
                    const friendUserId = friend.friend_user?.id || friend.user_id || friend.id;
                    // Check if this friend is selected by comparing all possible ID variations
                    const isSelected = selectedFriends.find(f => {
                      const selectedId = f.friend_user?.id || f.user_id || f.id;
                      return selectedId?.toString() === friendUserId?.toString();
                    });
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
                        <div className="relative flex-shrink-0">
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
                          <p className="text-sm text-gray-500 font-medium">@{username}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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