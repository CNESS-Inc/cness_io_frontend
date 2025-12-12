import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock4,
  Music,
  BookOpen,
  Star,
  MessageSquareMoreIcon,
  UserRoundMinus,
  UserRoundPlus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EnquiryModal from "../components/directory/Enquire";
import {
  GetDirectoryProfileByUserId,
  CreateOrUpdateDirectoryReview,
  GetAllDirectoryReviews,
  CreateDirectoryReviewReply,
  GetDirectoryReviewReplies,
  LikeDirectoryReview,
  LikeDirectoryReviewReply,
  UpdateDirectoryReviewReply,
  DeleteDirectoryReviewReply,
  SendBpFollowRequest,
  SendFriendRequest,
  UnFriend,
  AcceptFriendRequest,
  RejectFriendRequest,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Modal from "../components/ui/Modal";

const levels = [
  {
    key: "Aspiring",
    label: "ASPIRED",
    img: "https://cdn.cness.io/aspiringlogo.svg",
  },
  {
    key: "Inspired",
    label: "INSPIRED",
    img: "https://cdn.cness.io/inspired1.svg",
  },
  {
    key: "Leader",
    label: "LEADER",
    img: "https://cdn.cness.io/leader1.webp",
  },
];

const DirectoryProfile = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [expandedPractices, setExpandedPractices] = useState<Set<string>>(
    new Set()
  );
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    pageNo: 1,
    hasMore: true,
    loadingMore: false,
  });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    description: "",
  });
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [openReplyInputs, setOpenReplyInputs] = useState<Set<string>>(
    new Set()
  );
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<
    Record<string, boolean>
  >({});
  const [childReviews, setChildReviews] = useState<Record<string, any[]>>({});
  const [loadingChildReviews, setLoadingChildReviews] = useState<
    Record<string, boolean>
  >({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyTexts, setEditReplyTexts] = useState<Record<string, string>>(
    {}
  );
  const [submittingEditReply, setSubmittingEditReply] = useState<
    Record<string, boolean>
  >({});
  const [deletingReply, setDeletingReply] = useState<Record<string, boolean>>(
    {}
  );
  const [pagination, setPagination] = useState<
    Record<string, { pageNo: number; hasMore: boolean; loadingMore: boolean }>
  >({});
  const [infoId, setInfoId] = useState<string | null>(null);
  const { id } = useParams();
  const { showToast } = useToast();
  const userId = id ? id : localStorage.getItem("Id") || "";
  const isLoggedIn = localStorage.getItem("Id");
  const [connecting, setConnecting] = useState(false);
  const [acceptingRequest, setAcceptingRequest] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    reviewId: string | null;
    replyId: string | null;
  }>({
    isOpen: false,
    reviewId: null,
    replyId: null,
  });

  const badgeImg = profileData?.badge?.level
    ? levels.find((el) => el.key === profileData.badge?.level)?.img
    : "";

  useEffect(() => {
    const fetchDirectoryProfile = async () => {
      if (!userId) {
        showToast({
          message: "User ID is required",
          type: "error",
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await GetDirectoryProfileByUserId(userId);
        if (response?.success?.status) {
          if (response?.data?.data) {
            setInfoId(response.data.data.bussiness_profile?.id || null);
            setProfileData(response.data.data);
          } else {
            setProfileData({});
          }
        } else {
          showToast({
            message:
              response?.error?.message || "Failed to load directory profile",
            type: "error",
            duration: 3000,
          });
        }
      } catch (error: any) {
        showToast({
          message:
            error?.response?.data?.error?.message ||
            "Failed to load directory profile",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryProfile();
  }, [userId]);

  const fetchReviews = async (pageNo: number = 1, append: boolean = false) => {
    const currentUserId = profileData?.bussiness_profile?.id;

    if (!currentUserId) {
      return;
    }

    try {
      if (append) {
        setReviewsPagination((prev) => ({ ...prev, loadingMore: true }));
      } else {
        setLoadingReviews(true);
      }

      const response = await GetAllDirectoryReviews(currentUserId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const reviewsData = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;

        setReviews((prev) => {
          const updatedReviews = append
            ? [...prev, ...reviewsData]
            : reviewsData;
          const currentLoaded = updatedReviews.length;
          const hasMore = currentLoaded < totalCount;

          setReviewsPagination({ pageNo, hasMore, loadingMore: false });
          return updatedReviews;
        });
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      if (append) {
        setReviewsPagination((prev) => ({ ...prev, loadingMore: false }));
      } else {
        setLoadingReviews(false);
      }
    }
  };

  const loadMoreReviews = async () => {
    if (!reviewsPagination.hasMore || reviewsPagination.loadingMore) {
      return;
    }
    await fetchReviews(reviewsPagination.pageNo + 1, true);
  };

  useEffect(() => {
    if (profileData?.bussiness_profile?.id) {
      fetchReviews(1, false);
    }
  }, [profileData?.bussiness_profile?.id]);

  useEffect(() => {
    // Fetch child reviews for all reviews when component mounts
    reviews.forEach((review) => {
      if (review.id && !childReviews[review.id]) {
        fetchChildReviews(review.id);
      }
    });
  }, [reviews]);

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">Loading...</div>
        </div>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">No profile data available</div>
        </div>
      </main>
    );
  }

  const handleConnection = async () => {
    if (!userId || connecting) return;

    try {
      setConnecting(true);

      // Get current friend status
      const isCurrentlyFriend = profileData?.is_friend || false;
      const requestStatus = profileData?.friend_request_status;
      const friendId = userId;

      if (isCurrentlyFriend) {
        // Remove friend connection
        const formattedData = {
          friend_id: friendId,
        };
        const res = await UnFriend(formattedData);

        if (res?.success?.message) {
          showToast({
            message: res.success.message,
            type: "success",
            duration: 2000,
          });

          // Update the profile data
          setProfileData((prev: any) => ({
            ...prev,
            is_friend: false,
            friend_request_status: null,
          }));
        }
      } else if (requestStatus === "PENDING") {
        const formattedData = {
          friend_id: friendId,
        };

        const res = await SendFriendRequest(formattedData);

        if (res?.success?.message) {
          showToast({
            message: res.success.message || "Friend request cancelled",
            type: "success",
            duration: 2000,
          });

          setProfileData((prev: any) => ({
            ...prev,
            is_friend: false,
            friend_request_status: null,
          }));
        }
      } else {
        // Send friend request
        const formattedData = {
          friend_id: friendId,
        };
        const res = await SendFriendRequest(formattedData);

        if (res?.success?.message) {
          showToast({
            message: res.success.message,
            type: "success",
            duration: 2000,
          });

          // Update the profile data
          setProfileData((prev: any) => ({
            ...prev,
            is_friend: false,
            friend_request_status: "PENDING",
          }));
        }
      }
    } catch (error: any) {
      console.error("Error handling friend request:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to update connection",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!userId) return;

    try {
      setAcceptingRequest(true);
      const formattedData = { friend_id: userId };

      // You need to import AcceptFriendRequest from your ServerAPI
      const res = await AcceptFriendRequest(formattedData);

      if (res?.success?.message) {
        showToast({
          message: res.success.message || "Friend request accepted!",
          type: "success",
          duration: 2000,
        });

        // Update the profile data
        setProfileData((prev: any) => ({
          ...prev,
          is_friend: true,
          friend_request_status: "ACCEPT",
          reciver_request_status: null,
        }));
      }
    } catch (error: any) {
      console.error("Error accepting friend request:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to accept friend request",
        type: "error",
        duration: 3000,
      });
    } finally {
      setAcceptingRequest(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!userId) return;

    try {
      setRejectingRequest(true);
      const formattedData = { friend_id: userId };

      // You need to import RejectFriendRequest from your ServerAPI
      const res = await RejectFriendRequest(formattedData);

      if (res?.success?.message) {
        showToast({
          message: res.success.message || "Friend request rejected",
          type: "success",
          duration: 2000,
        });

        // Update the profile data
        setProfileData((prev: any) => ({
          ...prev,
          is_friend: false,
          friend_request_status: null,
          reciver_request_status: null,
        }));
      }
    } catch (error: any) {
      console.error("Error rejecting friend request:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to reject friend request",
        type: "error",
        duration: 3000,
      });
    } finally {
      setRejectingRequest(false);
    }
  };

  // Add this function to get the button text and style
  const getConnectionButtonState = () => {
    const requestStatus = profileData?.friend_request_status;
    const receiverStatus = profileData?.reciver_request_status;

    // Check if user has received a pending request
    if (receiverStatus === "PENDING") {
      return {
        showAcceptReject: true,
        text: "Respond to Request",
        className: "bg-white text-gray-700 border border-gray-300",
      };
    }

    if (requestStatus === "ACCEPT") {
      return {
        showAcceptReject: false,
        text: "Connected",
        className:
          "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200",
      };
    }

    if (requestStatus === "PENDING") {
      return {
        showAcceptReject: false,
        text: "Requested",
        className:
          "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200",
      };
    }

    return {
      showAcceptReject: false,
      text: "Connect now",
      className: "bg-[#7077FE] text-white hover:bg-[#5b63e6]",
    };
  };
  const connectionButtonState = getConnectionButtonState();

  const businessProfile = profileData.bussiness_profile || {};
  const userProfile = profileData.user_profile || {};
  const contactInfo = profileData.contact_information || {};
  const businessHours = contactInfo.business_hours || {};
  const photos = profileData.photos || [];
  const services = profileData.service_offered || [];
  const bestPractices = profileData.best_practies || [];
  const products = profileData.products || [];

  const formatBusinessHours = () => {
    if (businessHours.business_status === 1 && businessHours.weekly_hours) {
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const displayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      return (
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 w-full">
          {displayNames.map((displayName, idx) => {
            const day = dayNames[idx];
            const dayHours = businessHours.weekly_hours.find(
              (h: any) => h.day === day
            );
            let timeContent;
            if (dayHours && dayHours.is_open) {
              const openTime = new Date(
                `2000-01-01T${dayHours.open_time}`
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              const closeTime = new Date(
                `2000-01-01T${dayHours.close_time}`
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
              timeContent = `${openTime} - ${closeTime}`;
            } else {
              timeContent = "Closed";
            }
            return (
              <React.Fragment key={day}>
                <div className="flex">
                  {/* Solution 1: Using fixed width for day column */}
                  <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1 w-32">
                    {displayName}
                  </div>
                  <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1">
                    {timeContent}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      );
    } else if (businessHours.business_status === 2) {
      const startDate = businessHours.temporary_close_start_date
        ? new Date(
            businessHours.temporary_close_start_date
          ).toLocaleDateString()
        : "";
      const endDate = businessHours.temporary_close_end_date
        ? new Date(businessHours.temporary_close_end_date).toLocaleDateString()
        : "";
      return (
        <div className="text-[#64748B]">
          <p className="font-['open_sans'] text-[14px]">Temporarily closed</p>
          {startDate && endDate && (
            <p className="font-['open_sans'] text-[14px] mt-1">
              From {startDate} to {endDate}
            </p>
          )}
        </div>
      );
    } else if (businessHours.business_status === 3) {
      return (
        <div className="text-[#64748B]">
          <p className="font-['open_sans'] text-[14px]">Permanently closed</p>
        </div>
      );
    }
    return null;
  };

  const aboutText = businessProfile.about || "";
  const shortText =
    aboutText.length > 140 ? aboutText.slice(0, 140) + "..." : aboutText;
  const fullText = aboutText;

  const directoryData = {
    name: businessProfile.bussiness_name || "",
    logo_url: businessProfile.logo_url || "",
    city: userProfile.state?.name || "",
    country: userProfile.country?.name || "",
    directory_info_id: businessProfile.id || "",
  };

  const formatPhone = () => {
    if (contactInfo.mobile_code && contactInfo.mobile_no) {
      return `+${contactInfo.mobile_code} ${contactInfo.mobile_no}`;
    }
    return "N/A";
  };

  const formatMemberSince = () => {
    if (userProfile.createdAt) {
      const date = new Date(userProfile.createdAt);
      return date.getFullYear().toString();
    }
    return "";
  };

  const toggleReplyInput = (reviewId: string) => {
    setOpenReplyInputs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
        setReplyTexts((prevTexts) => {
          const newTexts = { ...prevTexts };
          delete newTexts[reviewId];
          return newTexts;
        });
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const fetchChildReviews = async (
    reviewId: string,
    pageNo: number = 1,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setPagination((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: true },
        }));
      } else {
        setLoadingChildReviews((prev) => ({ ...prev, [reviewId]: true }));
      }

      const response = await GetDirectoryReviewReplies(reviewId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const replies = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;
        const currentLoaded = append
          ? (pagination[reviewId]?.pageNo || 0) * 5 + replies.length
          : replies.length;
        const hasMore = currentLoaded < totalCount;

        setChildReviews((prev) => ({
          ...prev,
          [reviewId]: append
            ? [...(prev[reviewId] || []), ...replies]
            : replies,
        }));

        setPagination((prev) => ({
          ...prev,
          [reviewId]: {
            pageNo: pageNo,
            hasMore: hasMore,
            loadingMore: false,
          },
        }));
      }
    } catch (error: any) {
      console.error("Error fetching child reviews:", error);
    } finally {
      if (append) {
        setPagination((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: false },
        }));
      } else {
        setLoadingChildReviews((prev) => ({ ...prev, [reviewId]: false }));
      }
    }
  };

  const loadMoreChildReviews = async (reviewId: string) => {
    const paginationInfo = pagination[reviewId];
    if (
      !paginationInfo ||
      !paginationInfo.hasMore ||
      paginationInfo.loadingMore
    ) {
      return;
    }

    await fetchChildReviews(reviewId, paginationInfo.pageNo + 1, true);
  };

  const handleSubmitReply = async (reviewId: string) => {
    const replyText = replyTexts[reviewId]?.trim();

    if (!replyText) {
      showToast({
        message: "Please enter a reply",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!businessProfile.id) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));
      const payload = {
        directory_info_id: businessProfile.id,
        review_id: reviewId,
        text: replyText,
      };

      const response = await CreateDirectoryReviewReply(payload);

      if (response?.success?.status && response?.data?.data) {
        const newReply = response.data.data;

        setChildReviews((prevChildReviews) => {
          const currentReplies = prevChildReviews[reviewId] || [];
          return {
            ...prevChildReviews,
            [reviewId]: [newReply, ...currentReplies],
          };
        });

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  reply_count: (review.reply_count || 0) + 1,
                }
              : review
          )
        );
      }

      showToast({
        message: "Reply submitted successfully",
        type: "success",
        duration: 3000,
      });

      setReplyTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[reviewId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to submit reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!businessProfile.id) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const payload = {
        directory_info_id: businessProfile.id,
        review_id: reviewId,
      };

      await LikeDirectoryReview(payload);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                is_liked: !review.is_liked,
                likes_count: review.is_liked
                  ? Math.max(0, (review.likes_count || 0) - 1)
                  : (review.likes_count || 0) + 1,
              }
            : review
        )
      );
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to like review",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleLikeReply = async (reviewId: string, replyId: string) => {
    if (!businessProfile.id) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const payload = {
        directory_info_id: businessProfile.id,
        review_id: reviewId,
        reply_id: replyId,
      };

      await LikeDirectoryReviewReply(payload);

      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId
            ? {
                ...reply,
                is_liked: !reply.is_liked,
                likes_count: reply.is_liked
                  ? Math.max(0, (reply.likes_count || 0) - 1)
                  : (reply.likes_count || 0) + 1,
              }
            : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to like reply",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleEditReply = (replyId: string, currentText: string) => {
    setEditingReplyId(replyId);
    setEditReplyTexts((prev) => ({ ...prev, [replyId]: currentText }));
  };

  const handleCancelEdit = (replyId: string) => {
    setEditingReplyId(null);
    setEditReplyTexts((prev) => {
      const newTexts = { ...prev };
      delete newTexts[replyId];
      return newTexts;
    });
  };

  const handleUpdateReply = async (reviewId: string, replyId: string) => {
    const editText = editReplyTexts[replyId]?.trim();

    if (!editText) {
      showToast({
        message: "Please enter a reply",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingEditReply((prev) => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
        text: editText,
      };

      await UpdateDirectoryReviewReply(payload);

      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId ? { ...reply, text: editText } : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });

      showToast({
        message: "Reply updated successfully",
        type: "success",
        duration: 3000,
      });

      setEditingReplyId(null);
      setEditReplyTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[replyId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingEditReply((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  const showDeleteConfirmation = (reviewId: string, replyId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      reviewId,
      replyId,
    });
  };

  // Actually delete the reply after confirmation
  const handleConfirmDelete = async (reviewId: string, replyId: string) => {
    try {
      setDeletingReply((prev) => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
      };

      await DeleteDirectoryReviewReply(payload);

      // Update child reviews
      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.filter(
          (reply: any) => reply.id !== replyId
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });

      // Update parent review count
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reply_count: Math.max(0, (review.reply_count || 0) - 1),
              }
            : review
        )
      );

      showToast({
        message: "Reply deleted successfully",
        type: "success",
        duration: 3000,
      });

      // Close the modal
      setDeleteConfirmation({
        isOpen: false,
        reviewId: null,
        replyId: null,
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to delete reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setDeletingReply((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.rating || !reviewForm.description.trim()) {
      showToast({
        message: "Please provide both rating and description",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!businessProfile.id) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingReview(true);
      const payload = {
        directory_info_id: businessProfile.id,
        description: reviewForm.description.trim(),
        rating: reviewForm.rating,
      };

      const response = await CreateOrUpdateDirectoryReview(payload);

      if (response?.success?.status && response?.data?.data) {
        const newReview = response.data.data;

        const existingReviewIndex = reviews.findIndex(
          (r: any) => r.is_my_review === true
        );

        if (existingReviewIndex !== -1) {
          setReviews((prevReviews) =>
            prevReviews.map((review: any, index: number) =>
              index === existingReviewIndex ? newReview : review
            )
          );
        } else {
          setReviews((prevReviews) => [newReview, ...prevReviews]);
        }

        showToast({
          message: "Review submitted successfully",
          type: "success",
          duration: 3000,
        });

        setReviewForm({
          rating: 0,
          description: "",
        });
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to submit review",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleFollow = async (bpId: string) => {
    if (followLoading[bpId]) return;

    try {
      setFollowLoading((prev) => ({ ...prev, [bpId]: true }));
      const res = await SendBpFollowRequest({ bp_id: bpId });

      if (res?.success?.statusCode === 200) {
        const isFollowing = res?.data?.data !== null;

        // Update the specific best practice in the profileData
        setProfileData((prev: any) => {
          if (!prev || !prev.best_practies) return prev;

          return {
            ...prev,
            best_practies: prev.best_practies.map((practice: any) => {
              if (practice.id === bpId) {
                return { ...practice, is_following: isFollowing };
              }
              return practice;
            }),
          };
        });

        showToast({
          message: isFollowing
            ? "Added to followed practices"
            : "Removed from followed practices",
          type: "success",
          duration: 2000,
        });
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
        showToast({
          message: "Something went wrong. Please try again.",
          type: "warning",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      showToast({
        message: "Failed to update follow status",
        type: "error",
        duration: 2000,
      });
    } finally {
      setFollowLoading((prev) => ({ ...prev, [bpId]: false }));
    }
  };

  return (
    <>
      <main className="flex-1 p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Business Profile Section */}
          <section className="bg-white rounded-xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <img
                src={
                  businessProfile.logo_url ||
                  "https://static.codia.ai/image/2025-12-04/DUvvvgriSA.png"
                }
                alt="Profile"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#ECEEF2] object-cover self-center sm:self-start"
              />

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021] text-center sm:text-left">
                    {businessProfile.bussiness_name || "Business Name"}
                  </h2>

                  <div className="flex items-center justify-center sm:justify-start space-x-3">
                    <div className="flex items-center space-x-1">
                      {Array.from({
                        length: Math.floor(
                          parseFloat(businessProfile.rating_average || "0")
                        ),
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#FACC15] fill-[#FACC15]"
                          strokeWidth={1.5}
                        />
                      ))}

                      {Array.from({
                        length:
                          5 -
                          Math.floor(
                            parseFloat(businessProfile.rating_average || "0")
                          ),
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#94A3B8]"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="text-black text-sm sm:text-base">
                      {businessProfile.rating_average || "0"}
                    </span>
                  </div>

                  <p className="text-[#64748B] leading-6 font-['open_sans'] text-sm sm:text-base text-center sm:text-left">
                    {expanded ? fullText : shortText}
                    {aboutText.length > 140 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[#F07EFF] font-['open_sans'] font-semibold ml-2"
                      >
                        {expanded ? "Read less" : "Read more"}
                      </button>
                    )}
                  </p>
                </div>
                {services.length > 0 && isLoggedIn !== id ? (
                  <div className="flex justify-center sm:justify-start">
                    <button
                      onClick={() => setShowEnquiry(true)}
                      className="bg-[#7077FE] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm w-full sm:w-auto"
                    >
                      Enquire now
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>

          {/* User Information Section */}
          <section className="bg-white rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              {/* <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white">
                <img
                  src={
                    userProfile.profile_picture ||
                    "https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png"
                  }
                  alt={`${userProfile.first_name || ""} ${
                    userProfile.last_name || ""
                  }`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png";
                  }}
                />
              </div> */}
              <div className="relative w-[120px] h-20 shrink-0 flex items-center">
                {/* Badge image (background) - you can update this with actual badge logic */}
                <div className="absolute top-[50%] translate-y-[-50%] right-1.5 w-[70px] h-[70px] object-contain z-0 border flex justify-center items-center border-gray-400 rounded-full">
                  <img
                    src={badgeImg}
                    alt="Badge"
                    className="w-[35px] h-[35px] object-contain z-0"
                  />
                </div>

                {/* Profile image (front) */}
                <img
                  src={
                    userProfile.profile_picture ||
                    "https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png"
                  }
                  alt="Profile"
                  className="w-[75px] h-[75px] rounded-full object-cover border-2 border-white z-10"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
                  {`${userProfile.first_name || ""} ${
                    userProfile.last_name || ""
                  }`.trim() || "User Name"}
                </h3>

                <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 text-[#64748B] font-['open_sans'] text-sm">
                  {userProfile.state?.name && userProfile.country?.name && (
                    <>
                      <span>
                        {userProfile.state.name}, {userProfile.country.name}
                      </span>
                      {formatMemberSince() && (
                        <>
                          <div className="hidden sm:block w-1 h-1 bg-[#94A3B8] rounded-full" />
                          <span className="mt-1 sm:mt-0">
                            Member since {formatMemberSince()}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black text-center sm:text-left">
                  Interests
                </h4>
                <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                  {userProfile.interests && userProfile.interests.length > 0 ? (
                    userProfile.interests.slice(0, 3).map((interest: any) => (
                      <span
                        key={interest.id}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#FCFCFD] border-[0.6px] border-[#CBD5E1] rounded-full text-xs text-[#64748B]"
                      >
                        {interest.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#64748B] text-xs">No interests</span>
                  )}
                  {userProfile.interests &&
                    userProfile.interests.length > 3 && (
                      <span className="px-2 py-1 bg-[#FCFCFD] border-[0.6px] border-[#CBD5E1] rounded-full text-xs text-[#64748B]">
                        +{userProfile.interests.length - 3}
                      </span>
                    )}
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black text-center sm:text-left">
                  Profession
                </h4>
                <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                  {userProfile.professions &&
                  userProfile.professions.length > 0 ? (
                    userProfile.professions
                      .slice(0, 2)
                      .map((profession: any) => (
                        <span
                          key={profession.id}
                          className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#FCFCFD] border-[0.6px] border-[#CBD5E1] rounded-full text-xs text-[#64748B]"
                        >
                          {profession.title}
                        </span>
                      ))
                  ) : (
                    <span className="text-[#64748B] text-xs">
                      No professions
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center -space-x-2">
                {profileData.friend_profile_pics &&
                profileData.friend_profile_pics.length > 0 ? (
                  <>
                    {profileData.friend_profile_pics
                      .slice(0, 3)
                      .map((pic: string, i: number) => (
                        <img
                          key={i}
                          src={pic ? pic : "/profile.png"}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                          alt={`Friend ${i + 1}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/profile.png"; // Clear broken images
                          }}
                        />
                      ))}
                    {profileData.friend_count > 3 && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[#F07EFF] font-bold text-xs sm:text-sm">
                          {profileData.friend_count - 3}+
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[#F07EFF] font-bold text-xs sm:text-sm">
                      {profileData.friend_count || 0}
                    </span>
                  </div>
                )}
              </div>
              {isLoggedIn !== id && (
                <div className="w-full sm:w-auto">
                  {connectionButtonState.showAcceptReject ? (
                    // Show Accept/Reject buttons when user has received a pending request
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={handleAcceptRequest}
                        disabled={acceptingRequest}
                        className={`px-4 py-2 rounded-full font-semibold text-xs sm:text-sm w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 disabled:opacity-50`}
                      >
                        {acceptingRequest ? (
                          "Accepting..."
                        ) : (
                          <>
                            <UserRoundPlus className="w-4 h-4" />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleRejectRequest}
                        disabled={rejectingRequest}
                        className={`px-4 py-2 rounded-full font-semibold text-xs sm:text-sm w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50`}
                      >
                        {rejectingRequest ? (
                          "Rejecting..."
                        ) : (
                          <>
                            <UserRoundMinus className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    // Show regular Connect/Requested/Connected button
                    <button
                      onClick={handleConnection}
                      disabled={connecting}
                      className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm w-full sm:w-auto transition-colors duration-300 ${connectionButtonState.className}`}
                    >
                      {connecting
                        ? "Connecting..."
                        : connectionButtonState.text}
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Services Offered Section */}
        <section className="bg-white rounded-xl p-4 md:p-6 space-y-4">
          <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
            Services Offered
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-7 justify-center sm:justify-start">
            {services.length > 0 ? (
              services.map((service: any) => (
                <span
                  key={service.id}
                  className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base"
                >
                  {service.name}
                </span>
              ))
            ) : (
              <span className="text-[#64748B]">No services offered</span>
            )}
          </div>
        </section>

        {/* Photos Section */}
        <section className="bg-white border border-[#F7F7F7] rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between space-y-2 sm:space-y-0">
            <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
              Photos
            </h3>
            {photos.length > 4 && (
              <div className="flex items-center space-x-1.5 text-[#7077FE] self-end">
                <span className="font-[Poppins] font-medium text-sm cursor-pointer">
                  See all {photos.length} photos
                </span>
                <svg
                  className="w-3 h-2"
                  viewBox="0 0 13 10"
                  fill="currentColor"
                >
                  <path d="M8 1L12 5L8 9M12 5H1" />
                </svg>
              </div>
            )}
          </div>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {photos.slice(0, 4).map((photo: any) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-[#FFE4F5] rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.file}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#64748B] text-center py-8">
              No photos available
            </div>
          )}
        </section>

        {/* Contact Information Section */}
        <section className="bg-white rounded-xl p-4 md:p-6 space-y-4">
          <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
            Contact Information
          </h3>
          <div className="space-y-4">
            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                <span className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base">
                  Address
                </span>
              </div>
              <p className="font-['open_sans'] text-[13px] sm:text-[14px] text-[#64748B] pl-6">
                {contactInfo.address ||
                  userProfile.address ||
                  "No address provided"}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D1D5DB] fill-[#D1D5DB] shrink-0" />
                <span className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base">
                  Phone
                </span>
              </div>
              <p className="font-['open_sans'] text-[13px] sm:text-[14px] text-[#64748B] pl-6">
                {formatPhone()}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                <span className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base">
                  Email
                </span>
              </div>
              <p className="font-['open_sans'] text-[13px] sm:text-[14px] text-[#64748B] pl-6">
                {contactInfo.email || "N/A"}
              </p>
            </div>

            {/* Website */}
            {contactInfo.website && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#D1D5DB] shrink-0" />
                  <span className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base">
                    Website
                  </span>
                </div>
                <p className="font-['open_sans'] text-[13px] sm:text-[14px] text-[#64748B] pl-6">
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7077FE] hover:underline break-all"
                  >
                    {contactInfo.website}
                  </a>
                </p>
              </div>
            )}

            {/* Business Timings */}
            {businessHours.business_status && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#D1D5DB] flex items-center justify-center shrink-0">
                    <Clock4 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-['open_sans'] font-semibold text-[#081021] text-sm sm:text-base">
                    Business timings
                  </span>
                </div>
                <div className="pl-6 sm:pl-7">{formatBusinessHours()}</div>
              </div>
            )}
          </div>
        </section>

        {/* Best Practice and Products Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Best Practice Section */}
          {bestPractices.length > 0 && (
            <section className="bg-white rounded-xl p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
                  Best practice
                </h3>
                <button
                  onClick={() =>
                    navigate(`/dashboard/userprofile/${id}`, {
                      state: { activeTab: "best" },
                    })
                  }
                  className="text-[#F07EFF] font-semibold text-xs cursor-pointer hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {bestPractices.map((item: any) => {
                  const description = item.description || "";
                  const isExpanded = expandedPractices.has(item.id);
                  const shouldTruncate = description.length >= 100;
                  const displayText =
                    shouldTruncate && !isExpanded
                      ? description.slice(0, 100) + "..."
                      : description;

                  const toggleExpand = () => {
                    setExpandedPractices((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(item.id)) {
                        newSet.delete(item.id);
                      } else {
                        newSet.add(item.id);
                      }
                      return newSet;
                    });
                  };

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-[#ECEEF2] rounded-xl p-3 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
                    >
                      <img
                        src={item.file}
                        alt="Practice"
                        className="w-full sm:w-[150px] md:w-[216px] h-[150px] rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-[Poppins] font-semibold text-[#1F2937] text-sm sm:text-base">
                            {item.title}
                          </h4>
                          <p className="font-['open_sans'] font-normal text-[13px] sm:text-[14px] text-[#1F2937] leading-relaxed">
                            {displayText}
                            {shouldTruncate && (
                              <button
                                onClick={toggleExpand}
                                className="text-[#F07EFF] font-['open_sans'] font-semibold hover:underline ml-1"
                              >
                                {isExpanded ? "Read Less" : "Read More"}
                              </button>
                            )}
                          </p>
                        </div>
                        {/* Updated Follow Button */}
                        <button
                          onClick={() => toggleFollow(item.id)}
                          className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full font-Rubik font-normal text-[13px] sm:text-[14px] leading-[100%] text-center capitalize w-full sm:w-auto ${
                            item.is_following
                              ? "bg-[#F396FF] text-white"
                              : "bg-[#7077FE] text-white hover:bg-[#6A6DEB]"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          disabled={followLoading[item.id]}
                        >
                          {followLoading[item.id] ? (
                            <div className="flex items-center justify-center">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                              <span>Loading...</span>
                            </div>
                          ) : item.is_following ? (
                            "Following"
                          ) : (
                            "+ Follow"
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <section className="bg-white rounded-xl p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#081021]">
                  Products
                </h3>
                <span
                  className="text-[#F07EFF] font-semibold text-xs cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/shop-detail/${profileData.shop_id}`)
                  }
                >
                  View all
                </span>
              </div>
              <div className="space-y-4">
                {products.slice(0, 3).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="bg-linear-to-b from-[#F1F3FF] to-white border border-[#ECEEF2] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
                  >
                    <div className="relative w-full sm:w-[150px] md:w-[196px] shrink-0">
                      <img
                        src={
                          product.thumbnail_url ||
                          "https://static.codia.ai/image/2025-12-04/LfjsJkrBT4.png"
                        }
                        alt={product.title}
                        className="w-full h-[150px] sm:h-[156px] rounded-xl sm:rounded-3xl object-cover"
                      />
                      <button className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#1F2937] bg-opacity-90 rounded-full flex items-center justify-center shadow-md">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          viewBox="0 0 20 20"
                          stroke="white"
                        >
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <div className="inline-flex items-center space-x-2 bg-opacity-10 rounded-full px-2 py-1">
                          <span
                            className={`text-xs font-[Poppins] ${
                              product.category === "Music"
                                ? "text-[#F07EFF]"
                                : "text-[#7077FE]"
                            }`}
                          >
                            {product.category}
                          </span>
                          {product.category === "Music" ? (
                            <Music
                              className="w-3 h-3 sm:w-4 sm:h-4 text-[#F07EFF]"
                              strokeWidth={2}
                            />
                          ) : (
                            <BookOpen
                              className="w-3 h-3 sm:w-4 sm:h-4 text-[#7077FE]"
                              strokeWidth={2}
                            />
                          )}
                        </div>
                        <h4 className="font-[Poppins] font-semibold text-[#1F2937] text-sm sm:text-base">
                          {product.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {Array.from({
                              length: Math.floor(product.rating_average || 0),
                            }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4 text-[#FACC15] fill-[#FACC15]"
                                strokeWidth={1.2}
                              />
                            ))}
                            {Array.from({
                              length:
                                5 - Math.floor(product.rating_average || 0),
                            }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4 text-[#94A3B8]"
                                strokeWidth={1.2}
                              />
                            ))}
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquareMoreIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#9CA3AF]" />
                            <span className="text-[#9CA3AF] font-[Poppins] font-medium text-xs sm:text-sm">
                              {product.review_count || 0}
                            </span>
                          </div>
                        </div>
                        {product.profile && (
                          <div className="flex items-center space-x-2">
                            <img
                              src={
                                product.profile.profile_picture ||
                                "https://static.codia.ai/image/2025-12-04/EKAU1ouAu0.png"
                              }
                              alt={`${product.profile.first_name} ${product.profile.last_name}`}
                              className="w-5 h-5 rounded-lg object-cover"
                            />
                            <span className="font-['open_sans'] font-semibold text-xs text-[#1F2937]">
                              {`${product.profile.first_name || ""} ${
                                product.profile.last_name || ""
                              }`.trim()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                        <div className="space-y-1">
                          {product.discount_percentage &&
                            parseFloat(product.discount_percentage) > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-[#9CA3AF] font-[Poppins] font-medium text-xs sm:text-sm line-through">
                                  ${product.price}
                                </span>
                                <div className="bg-[#EBF2FF] px-2 py-1 rounded text-xs font-Inter font-medium text-[#1E3A8A]">
                                  -{product.discount_percentage}%
                                </div>
                              </div>
                            )}
                          <div className="text-lg sm:text-xl font-[Poppins] font-semibold text-[#1F2937]">
                            ${product.final_price || product.price}
                          </div>
                        </div>
                        <button
                          className="bg-[#7077FE] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-Rubik font-normal text-[13px] sm:text-[14px] leading-[100%] capitalize w-full sm:w-auto"
                          onClick={() =>
                            navigate(`/dashboard/product-detail/${product?.id}`)
                          }
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Reviews Section */}
        {businessProfile.id ? (
          <>
            <section className="bg-white rounded-xl p-4 md:p-6 space-y-6">
              {/* Post Review Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
                  Post your review
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewForm.rating
                              ? "text-[#FACC15] fill-[#FACC15]"
                              : "text-[#9CA3AF]"
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                  {reviewForm.rating > 0 && (
                    <span className="text-black text-sm">
                      {reviewForm.rating}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="border border-[#D1D5DB] rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 min-h-[150px] sm:min-h-[170px] flex flex-col justify-between">
                    <textarea
                      className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent text-sm sm:text-base"
                      placeholder="Post a comment..."
                      value={reviewForm.description}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 2000) {
                          setReviewForm((prev) => ({
                            ...prev,
                            description: value,
                          }));
                        }
                      }}
                      rows={3}
                    />
                    <div className="flex flex-col sm:flex-row justify-end items-end space-y-2 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-4">
                      <div className="bg-white px-3 py-2 rounded-full w-full sm:w-auto text-center">
                        <span className="font-['open_sans'] text-[#9CA3AF] text-[11px] sm:text-[12px]">
                          {2000 - reviewForm.description.length} Characters
                          remaining
                        </span>
                      </div>
                      <button
                        onClick={handleSubmitReview}
                        className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full font-[Poppins] font-semibold text-sm w-full sm:w-auto"
                      >
                        {submittingReview ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                  <p className="font-['open_sans'] text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                    Please note that this community is actively moderated
                    according to
                    <span className="text-[#6B21A8]">
                      {" "}
                      CNESS community rules
                    </span>
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              {/* In the Reviews List section, modify the review rendering */}
              <div className="space-y-4">
                <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
                  All Reviews
                </h3>
                {loadingReviews ? (
                  <div className="text-center py-8 text-[#64748B]">
                    Loading reviews...
                  </div>
                ) : reviews.length > 0 ? (
                  <div
                    className="space-y-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto pr-2"
                    onScroll={(e) => {
                      const target = e.target as HTMLElement;
                      const scrollBottom =
                        target.scrollHeight -
                        target.scrollTop -
                        target.clientHeight;
                      if (
                        scrollBottom < 100 &&
                        reviewsPagination.hasMore &&
                        !reviewsPagination.loadingMore
                      ) {
                        loadMoreReviews();
                      }
                    }}
                  >
                    {reviews.map((review: any) => {
                      const reviewDate = review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "";

                      return (
                        <div
                          key={review.id}
                          className="bg-[#F9FAFB] rounded-lg p-3 sm:p-4 space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-[Poppins] font-semibold text-black text-sm sm:text-base">
                                {`${review.profile?.first_name || ""} ${
                                  review.profile?.last_name || ""
                                }`.trim() || "Anonymous"}
                              </span>
                              <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
                              <span className="font-['open_sans'] text-[#9CA3AF] text-xs">
                                {reviewDate}
                              </span>
                            </div>
                            <p className="font-['open_sans'] text-xs sm:text-sm text-[#1F2937] leading-relaxed">
                              {review.description}
                            </p>
                          </div>

                          {/* Action buttons - Keep these */}
                          <div className="flex items-center space-x-2 p-2">
                            <button
                              onClick={() => handleLikeReview(review.id)}
                              className={`flex items-center space-x-1 ${
                                review.is_liked
                                  ? "text-[#7077FE]"
                                  : "text-[#1F2937]"
                              }`}
                            >
                              <svg
                                className="w-5 h-5 sm:w-6 sm:h-6"
                                viewBox="0 0 24 24"
                                fill={review.is_liked ? "currentColor" : "none"}
                                stroke="currentColor"
                              >
                                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
                              </svg>
                              {review.likes_count > 0 && (
                                <span className="font-['open_sans'] text-xs">
                                  {review.likes_count}
                                </span>
                              )}
                            </button>
                            <div className="w-px h-5 bg-[#D1D5DB]"></div>
                            <button
                              onClick={() => toggleReplyInput(review.id)}
                              className="flex items-center space-x-1 bg-transparent px-2 py-1 rounded-full text-[#1F2937] hover:bg-gray-100"
                            >
                              <img src="/reply.png" />
                              <span className="font-['open_sans'] text-xs">
                                Reply{" "}
                                {review.reply_count > 0 &&
                                  `(${review.reply_count})`}
                              </span>
                            </button>
                          </div>

                          {/* Reply input section - Only show when reply button is clicked */}
                          {openReplyInputs.has(review.id) && (
                            <div className="mt-4 space-y-3 pl-3 sm:pl-4 border-l-2 border-[#ECEEF2]">
                              <div className="space-y-2">
                                <div className="border border-[#D1D5DB] rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                  <textarea
                                    className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent text-sm sm:text-base"
                                    placeholder="Write a reply..."
                                    value={replyTexts[review.id] || ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value.length <= 1000) {
                                        setReplyTexts((prev) => ({
                                          ...prev,
                                          [review.id]: value,
                                        }));
                                      }
                                    }}
                                    rows={2}
                                  />
                                  <div className="flex flex-col sm:flex-row justify-end items-end space-y-2 sm:space-y-0 sm:space-x-3 mt-2 sm:mt-3">
                                    <span className="font-['open_sans'] text-[#9CA3AF] text-[11px] sm:text-[12px]">
                                      {1000 -
                                        (replyTexts[review.id]?.length ||
                                          0)}{" "}
                                      Characters remaining
                                    </span>
                                    <button
                                      onClick={() =>
                                        toggleReplyInput(review.id)
                                      }
                                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100 w-full sm:w-auto"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSubmitReply(review.id)
                                      }
                                      disabled={
                                        submittingReply[review.id] ||
                                        !replyTexts[review.id]?.trim()
                                      }
                                      className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-[Poppins] font-semibold text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {submittingReply[review.id]
                                        ? "Submitting..."
                                        : "Reply"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Child reviews section - ALWAYS SHOW (moved outside openReplyInputs) */}
                          {childReviews[review.id] &&
                            childReviews[review.id].length > 0 && (
                              <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-[#ECEEF2]">
                                <div
                                  className="space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1"
                                  onScroll={(e) => {
                                    const target = e.target as HTMLElement;
                                    const scrollBottom =
                                      target.scrollHeight -
                                      target.scrollTop -
                                      target.clientHeight;
                                    if (
                                      scrollBottom < 100 &&
                                      pagination[review.id]?.hasMore &&
                                      !pagination[review.id]?.loadingMore
                                    ) {
                                      loadMoreChildReviews(review.id);
                                    }
                                  }}
                                >
                                  {loadingChildReviews[review.id] ? (
                                    <div className="text-center py-4 text-[#64748B] text-xs">
                                      Loading replies...
                                    </div>
                                  ) : childReviews[review.id] &&
                                    childReviews[review.id].length > 0 ? (
                                    <>
                                      {childReviews[review.id].map(
                                        (childReview: any) => {
                                          const childReviewDate =
                                            childReview.createdAt
                                              ? new Date(
                                                  childReview.createdAt
                                                ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                                })
                                              : "";

                                          return (
                                            <div
                                              key={childReview.id}
                                              className="bg-white border border-[#ECEEF2] rounded-lg p-3 space-y-2"
                                            >
                                              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                                                <div className="flex items-center space-x-2">
                                                  {childReview.profile
                                                    ?.profile_picture && (
                                                    <img
                                                      src={
                                                        childReview.profile
                                                          .profile_picture
                                                      }
                                                      alt={`${childReview.profile.first_name} ${childReview.profile.last_name}`}
                                                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                                                    />
                                                  )}
                                                  <span className="font-[Poppins] font-semibold text-sm text-black">
                                                    {`${
                                                      childReview.profile
                                                        ?.first_name || ""
                                                    } ${
                                                      childReview.profile
                                                        ?.last_name || ""
                                                    }`.trim() || "Anonymous"}
                                                  </span>
                                                  <div className="w-1 h-1 bg-[#9CA3AF] rounded-full"></div>
                                                  <span className="font-['open_sans'] text-[#9CA3AF] text-xs">
                                                    {childReviewDate}
                                                  </span>
                                                </div>
                                                {childReview.is_my_reply &&
                                                  editingReplyId !==
                                                    childReview.id && (
                                                    <div className="flex items-center space-x-2">
                                                      <button
                                                        onClick={() =>
                                                          handleEditReply(
                                                            childReview.id,
                                                            childReview.text ||
                                                              childReview.description
                                                          )
                                                        }
                                                        className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                                        disabled={
                                                          deletingReply[
                                                            childReview.id
                                                          ]
                                                        }
                                                      >
                                                        Edit
                                                      </button>
                                                      <span className="text-[#D1D5DB]">
                                                        |
                                                      </span>
                                                      <button
                                                        onClick={() =>
                                                          showDeleteConfirmation(
                                                            review.id,
                                                            childReview.id
                                                          )
                                                        }
                                                        className="text-[#EF4444] hover:text-[#DC2626] font-['open_sans'] text-xs"
                                                        disabled={
                                                          deletingReply[
                                                            childReview.id
                                                          ]
                                                        }
                                                      >
                                                        {deletingReply[
                                                          childReview.id
                                                        ]
                                                          ? "Deleting..."
                                                          : "Delete"}
                                                      </button>
                                                    </div>
                                                  )}
                                              </div>
                                              {editingReplyId ===
                                              childReview.id ? (
                                                <div className="space-y-2">
                                                  <div className="border border-[#D1D5DB] rounded-xl sm:rounded-2xl p-3">
                                                    <textarea
                                                      className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent text-sm sm:text-base"
                                                      placeholder="Edit your reply..."
                                                      value={
                                                        editReplyTexts[
                                                          childReview.id
                                                        ] || ""
                                                      }
                                                      onChange={(e) => {
                                                        const value =
                                                          e.target.value;
                                                        if (
                                                          value.length <= 1000
                                                        ) {
                                                          setEditReplyTexts(
                                                            (prev) => ({
                                                              ...prev,
                                                              [childReview.id]:
                                                                value,
                                                            })
                                                          );
                                                        }
                                                      }}
                                                      rows={2}
                                                    />
                                                    <div className="flex flex-col sm:flex-row justify-end items-end space-y-2 sm:space-y-0 sm:space-x-3 mt-2">
                                                      <span className="font-['open_sans'] text-[#9CA3AF] text-[11px] sm:text-[12px]">
                                                        {1000 -
                                                          (editReplyTexts[
                                                            childReview.id
                                                          ]?.length || 0)}{" "}
                                                        Characters remaining
                                                      </span>
                                                      <button
                                                        onClick={() =>
                                                          handleCancelEdit(
                                                            childReview.id
                                                          )
                                                        }
                                                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100 w-full sm:w-auto"
                                                        disabled={
                                                          submittingEditReply[
                                                            childReview.id
                                                          ]
                                                        }
                                                      >
                                                        Cancel
                                                      </button>
                                                      <button
                                                        onClick={() =>
                                                          handleUpdateReply(
                                                            review.id,
                                                            childReview.id
                                                          )
                                                        }
                                                        disabled={
                                                          submittingEditReply[
                                                            childReview.id
                                                          ] ||
                                                          !editReplyTexts[
                                                            childReview.id
                                                          ]?.trim()
                                                        }
                                                        className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-[Poppins] font-semibold text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                      >
                                                        {submittingEditReply[
                                                          childReview.id
                                                        ]
                                                          ? "Updating..."
                                                          : "Update"}
                                                      </button>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <p className="font-['open_sans'] text-xs sm:text-sm text-[#1F2937] leading-relaxed pl-6 sm:pl-8">
                                                  {childReview.text ||
                                                    childReview.description}
                                                </p>
                                              )}
                                              {editingReplyId !==
                                                childReview.id && (
                                                <div className="flex items-center pl-6 sm:pl-8 pt-1">
                                                  <button
                                                    onClick={() =>
                                                      handleLikeReply(
                                                        review.id,
                                                        childReview.id
                                                      )
                                                    }
                                                    className={`flex items-center space-x-1 ${
                                                      childReview.is_liked
                                                        ? "text-[#7077FE]"
                                                        : "text-[#1F2937]"
                                                    }`}
                                                  >
                                                    <svg
                                                      className="w-4 h-4 sm:w-5 sm:h-5"
                                                      viewBox="0 0 24 24"
                                                      fill={
                                                        childReview.is_liked
                                                          ? "currentColor"
                                                          : "none"
                                                      }
                                                      stroke="currentColor"
                                                    >
                                                      <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
                                                    </svg>
                                                    {childReview.likes_count >
                                                      0 && (
                                                      <span className="font-['open_sans'] text-xs">
                                                        {
                                                          childReview.likes_count
                                                        }
                                                      </span>
                                                    )}
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                      {pagination[review.id]?.loadingMore && (
                                        <div className="text-center py-4 text-[#64748B] text-xs">
                                          Loading more replies...
                                        </div>
                                      )}
                                      {pagination[review.id]?.hasMore &&
                                        !pagination[review.id]?.loadingMore && (
                                          <div className="text-center py-2">
                                            <button
                                              onClick={() =>
                                                loadMoreChildReviews(review.id)
                                              }
                                              className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                            >
                                              Load more replies
                                            </button>
                                          </div>
                                        )}
                                    </>
                                  ) : (
                                    <div className="text-center py-2 text-[#64748B] text-xs">
                                      No replies yet
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      );
                    })}
                    {reviewsPagination.loadingMore && (
                      <div className="text-center py-4 text-[#64748B] text-xs">
                        Loading more reviews...
                      </div>
                    )}
                    {reviewsPagination.hasMore &&
                      !reviewsPagination.loadingMore && (
                        <div className="text-center py-2">
                          <button
                            onClick={loadMoreReviews}
                            className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                          >
                            Load more reviews
                          </button>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#64748B]">
                    No reviews yet
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          ""
        )}
      </main>
      <EnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        directory={directoryData}
        infoId={infoId}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            reviewId: null,
            replyId: null,
          })
        }
      >
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-[#081021] mb-3 sm:mb-4">
            Confirm Deletion
          </h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-[#64748B]">
            Are you sure you want to delete this reply? This action cannot be
            undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: false,
                  reviewId: null,
                  replyId: null,
                })
              }
              className="px-4 py-2 rounded-full border border-[#D1D5DB] text-[#64748B] font-medium hover:bg-gray-50 w-full sm:w-auto"
              disabled={deletingReply[deleteConfirmation.replyId || ""]}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (deleteConfirmation.reviewId && deleteConfirmation.replyId) {
                  await handleConfirmDelete(
                    deleteConfirmation.reviewId,
                    deleteConfirmation.replyId
                  );
                }
              }}
              className="px-4 py-2 rounded-full bg-[#EF4444] text-white font-medium hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={deletingReply[deleteConfirmation.replyId || ""]}
            >
              {deletingReply[deleteConfirmation.replyId || ""] ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DirectoryProfile;
