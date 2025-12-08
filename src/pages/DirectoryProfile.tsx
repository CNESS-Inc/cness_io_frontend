import { MapPin, Phone, Mail, Globe, Clock4, Music, BookOpen, Star, MessageSquareMoreIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EnquiryModal from "../components/directory/Enquire";
import { GetDirectoryProfileByUserId, CreateOrUpdateDirectoryReview, GetAllDirectoryReviews, CreateDirectoryReviewReply, GetDirectoryReviewReplies, LikeDirectoryReview, LikeDirectoryReviewReply, UpdateDirectoryReviewReply, DeleteDirectoryReviewReply } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const DirectoryProfile = () => {
  const [expanded, setExpanded] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [expandedPractices, setExpandedPractices] = useState<Set<string>>(new Set());
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({ pageNo: 1, hasMore: true, loadingMore: false });
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    description: "",
  });
  const [openReplyInputs, setOpenReplyInputs] = useState<Set<string>>(new Set());
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<Record<string, boolean>>({});
  const [childReviews, setChildReviews] = useState<Record<string, any[]>>({});
  const [loadingChildReviews, setLoadingChildReviews] = useState<Record<string, boolean>>({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyTexts, setEditReplyTexts] = useState<Record<string, string>>({});
  const [submittingEditReply, setSubmittingEditReply] = useState<Record<string, boolean>>({});
  const [deletingReply, setDeletingReply] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<Record<string, { pageNo: number; hasMore: boolean; loadingMore: boolean }>>({});
  const { id } = useParams();
  // const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  // Get user_id from URL params, search params, or localStorage
  // const userId = id ? id : searchParams.get("user_id") || localStorage.getItem("Id") || "";
  const userId = id ? id : localStorage.getItem("Id") || "";

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
          if(response?.data?.data){
            setProfileData(response.data.data);
          }else{
            setProfileData({})
          }
        } else {
          showToast({
            message: response?.error?.message || "Failed to load directory profile",
            type: "error",
            duration: 3000,
          });
        }
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to load directory profile",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDirectoryProfile();
  }, [userId]);

  // Fetch reviews with pagination
  const fetchReviews = async (pageNo: number = 1, append: boolean = false) => {
    const currentUserId = profileData?.bussiness_profile?.id;

    if (!currentUserId) {
      return;
    }

    try {
      if (append) {
        setReviewsPagination(prev => ({ ...prev, loadingMore: true }));
      } else {
        setLoadingReviews(true);
      }

      const response = await GetAllDirectoryReviews(currentUserId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const reviewsData = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;

        setReviews(prev => {
          const updatedReviews = append ? [...prev, ...reviewsData] : reviewsData;
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
        setReviewsPagination(prev => ({ ...prev, loadingMore: false }));
      } else {
        setLoadingReviews(false);
      }
    }
  };

  // Load more reviews on scroll
  const loadMoreReviews = async () => {
    if (!reviewsPagination.hasMore || reviewsPagination.loadingMore) {
      return;
    }
    await fetchReviews(reviewsPagination.pageNo + 1, true);
  };

  // Initial fetch reviews
  useEffect(() => {
    if (profileData?.bussiness_profile?.id) {
      fetchReviews(1, false);
    }
  }, [profileData?.bussiness_profile?.id]);

  if (loading) {
    return (
      <main className="flex-1 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">Loading...</div>
        </div>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main className="flex-1 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#64748B]">No profile data available</div>
        </div>
      </main>
    );
  }

  const businessProfile = profileData.bussiness_profile || {};
  const userProfile = profileData.user_profile || {};
  const contactInfo = profileData.contact_information || {};
  const businessHours = contactInfo.business_hours || {};
  const photos = profileData.photos || [];
  const services = profileData.service_offered || [];
  const bestPractices = profileData.best_practies || [];
  const products = profileData.products || [];

  // Format business hours based on business_status
  const formatBusinessHours = () => {
    if (businessHours.business_status === 1 && businessHours.weekly_hours) {
      // Type 1: Regular hours with weekly schedule
      const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const displayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      return (
        <div className="grid grid-cols-2 gap-x-8 w-max">
          {displayNames.map((displayName, idx) => {
            const day = dayNames[idx];
            const dayHours = businessHours.weekly_hours.find((h: any) => h.day === day);
            let timeContent;
            if (dayHours && dayHours.is_open) {
              const openTime = new Date(`2000-01-01T${dayHours.open_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              const closeTime = new Date(`2000-01-01T${dayHours.close_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              timeContent = `${openTime} - ${closeTime}`;
            } else {
              timeContent = 'Closed';
            }
            return (
              <React.Fragment key={day}>
                <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1">{displayName}</div>
                <div className="font-['open_sans'] text-[14px] text-[#64748B] mb-1">{timeContent}</div>
              </React.Fragment>
            );
          })}
        </div>
      );
    } else if (businessHours.business_status === 2) {
      // Type 2: Temporarily closed with dates
      const startDate = businessHours.temporary_close_start_date
        ? new Date(businessHours.temporary_close_start_date).toLocaleDateString()
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
      // Type 3: Permanently closed
      return (
        <div className="text-[#64748B]">
          <p className="font-['open_sans'] text-[14px]">Permanently closed</p>
        </div>
      );
    }
    return null;
  };

  const aboutText = businessProfile.about || "";
  const shortText = aboutText.length > 140 ? aboutText.slice(0, 140) + "..." : aboutText;
  const fullText = aboutText;

  const directoryData = {
    name: businessProfile.bussiness_name || "",
    logo_url: businessProfile.logo_url || "",
    city: userProfile.state?.name || "",
    country: userProfile.country?.name || "",
    directory_info_id: businessProfile.id || ""
  };

  // Format phone number
  const formatPhone = () => {
    if (contactInfo.mobile_code && contactInfo.mobile_no) {
      return `+${contactInfo.mobile_code} ${contactInfo.mobile_no}`;
    }
    return "N/A";
  };

  // Format member since date
  const formatMemberSince = () => {
    if (userProfile.createdAt) {
      const date = new Date(userProfile.createdAt);
      return date.getFullYear().toString();
    }
    return "";
  };

  // Toggle reply input for a review
  const toggleReplyInput = (reviewId: string) => {
    setOpenReplyInputs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
        // Clear reply text when closing
        setReplyTexts(prevTexts => {
          const newTexts = { ...prevTexts };
          delete newTexts[reviewId];
          return newTexts;
        });
      } else {
        newSet.add(reviewId);
        // Fetch child reviews when opening
        fetchChildReviews(reviewId);
      }
      return newSet;
    });
  };

  // Fetch child reviews for a parent review with pagination
  const fetchChildReviews = async (reviewId: string, pageNo: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setPagination(prev => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: true }
        }));
      } else {
        setLoadingChildReviews(prev => ({ ...prev, [reviewId]: true }));
      }

      const response = await GetDirectoryReviewReplies(reviewId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const replies = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;
        const currentLoaded = append ? ((pagination[reviewId]?.pageNo || 0) * 5) + replies.length : replies.length;
        const hasMore = currentLoaded < totalCount; // Check if we have more based on total count

        setChildReviews(prev => ({
          ...prev,
          [reviewId]: append
            ? [...(prev[reviewId] || []), ...replies]
            : replies
        }));

        setPagination(prev => ({
          ...prev,
          [reviewId]: {
            pageNo: pageNo,
            hasMore: hasMore,
            loadingMore: false
          }
        }));
      }
    } catch (error: any) {
      console.error("Error fetching child reviews:", error);
    } finally {
      if (append) {
        setPagination(prev => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: false }
        }));
      } else {
        setLoadingChildReviews(prev => ({ ...prev, [reviewId]: false }));
      }
    }
  };

  // Load more child reviews on scroll
  const loadMoreChildReviews = async (reviewId: string) => {
    const paginationInfo = pagination[reviewId];
    if (!paginationInfo || !paginationInfo.hasMore || paginationInfo.loadingMore) {
      return;
    }

    await fetchChildReviews(reviewId, paginationInfo.pageNo + 1, true);
  };

  // Handle submit reply
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
      setSubmittingReply(prev => ({ ...prev, [reviewId]: true }));
      const payload = {
        directory_info_id: businessProfile.id,
        review_id: reviewId,
        text: replyText,
      };

      const response = await CreateDirectoryReviewReply(payload);

      if (response?.success?.status && response?.data?.data) {
        const newReply = response.data.data;

        // Add new reply to the top of child reviews without refreshing
        setChildReviews(prevChildReviews => {
          const currentReplies = prevChildReviews[reviewId] || [];
          return {
            ...prevChildReviews,
            [reviewId]: [newReply, ...currentReplies]
          };
        });

        // Update parent review reply count in state
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? {
                ...review,
                reply_count: (review.reply_count || 0) + 1
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

      // Clear reply text
      setReplyTexts(prev => {
        const newTexts = { ...prev };
        delete newTexts[reviewId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to submit reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingReply(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  // Handle like parent review
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

      // Update state directly instead of refreshing all reviews
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
              ...review,
              is_liked: !review.is_liked,
              likes_count: review.is_liked
                ? Math.max(0, (review.likes_count || 0) - 1)
                : (review.likes_count || 0) + 1
            }
            : review
        )
      );
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to like review",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle like child review (reply)
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

      // Update state directly instead of refreshing all child reviews
      setChildReviews(prevChildReviews => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId
            ? {
              ...reply,
              is_liked: !reply.is_liked,
              likes_count: reply.is_liked
                ? Math.max(0, (reply.likes_count || 0) - 1)
                : (reply.likes_count || 0) + 1
            }
            : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies
        };
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to like reply",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle edit reply
  const handleEditReply = (replyId: string, currentText: string) => {
    setEditingReplyId(replyId);
    setEditReplyTexts(prev => ({ ...prev, [replyId]: currentText }));
  };

  // Handle cancel edit
  const handleCancelEdit = (replyId: string) => {
    setEditingReplyId(null);
    setEditReplyTexts(prev => {
      const newTexts = { ...prev };
      delete newTexts[replyId];
      return newTexts;
    });
  };

  // Handle update reply
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
      setSubmittingEditReply(prev => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
        text: editText,
      };

      await UpdateDirectoryReviewReply(payload);

      // Update state directly
      setChildReviews(prevChildReviews => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId
            ? { ...reply, text: editText }
            : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies
        };
      });

      showToast({
        message: "Reply updated successfully",
        type: "success",
        duration: 3000,
      });

      setEditingReplyId(null);
      setEditReplyTexts(prev => {
        const newTexts = { ...prev };
        delete newTexts[replyId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to update reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingEditReply(prev => ({ ...prev, [replyId]: false }));
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    try {
      setDeletingReply(prev => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
      };

      await DeleteDirectoryReviewReply(payload);

      // Remove from state directly
      setChildReviews(prevChildReviews => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.filter((reply: any) => reply.id !== replyId);
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies
        };
      });

      // Update parent review reply count
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? {
              ...review,
              reply_count: Math.max(0, (review.reply_count || 0) - 1)
            }
            : review
        )
      );

      showToast({
        message: "Reply deleted successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to delete reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setDeletingReply(prev => ({ ...prev, [replyId]: false }));
    }
  };

  // Handle submit review
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

        // Check if user already has a review
        const existingReviewIndex = reviews.findIndex((r: any) => r.is_my_review === true);

        if (existingReviewIndex !== -1) {
          // Update existing review in state
          setReviews(prevReviews =>
            prevReviews.map((review: any, index: number) =>
              index === existingReviewIndex ? newReview : review
            )
          );
        } else {
          // Add new review to the top
          setReviews(prevReviews => [newReview, ...prevReviews]);
        }

        showToast({
          message: "Review submitted successfully",
          type: "success",
          duration: 3000,
        });

        // Reset form
        setReviewForm({
          rating: 0,
          description: "",
        });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to submit review",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingReview(false);
    }
  };
  return (

    <>
      {/* Profile Section */}
      <main className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <section className="bg-white rounded-xl p-4">
            <div className="flex items-start space-x-4">
              <img
                src={businessProfile.logo_url || "https://static.codia.ai/image/2025-12-04/DUvvvgriSA.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-[#ECEEF2] object-cover"
              />

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                    {businessProfile.bussiness_name || "Business Name"}
                  </h2>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {/* Filled stars */}
                      {Array.from({ length: Math.floor(parseFloat(businessProfile.rating_average || "0")) }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
                          strokeWidth={1.5}
                        />
                      ))}

                      {/* Empty stars */}
                      {Array.from({ length: 5 - Math.floor(parseFloat(businessProfile.rating_average || "0")) }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#94A3B8]"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="text-black">{businessProfile.rating_average || "0"}</span>
                  </div>

                  <p className="text-[#64748B] leading-6 font-['open_sans']">
                    {expanded ? fullText : shortText}

                    <button
                      onClick={() => setExpanded(!expanded)}
                      className="text-[#F07EFF] font-['open_sans'] font-semibold ml-2"
                    >
                      {expanded ? "Read less" : "Read more"}
                    </button>        </p>
                </div>

                <button
                  onClick={() => setShowEnquiry(true)}
                  className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm"
                >
                  Enquire now
                </button>


              </div>
            </div>
          </section>
          {/* User Information Section */}
          <section className="bg-white rounded-xl p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white">
                <img
                  src={userProfile.profile_picture || "https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png"}
                  alt={`${userProfile.first_name || ""} ${userProfile.last_name || ""}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  {`${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "User Name"}
                </h3>

                <div className="flex items-center space-x-2 text-[#64748B] font-['open_sans']">
                  {userProfile.state?.name && userProfile.country?.name && (
                    <>
                      <span>{userProfile.state.name}, {userProfile.country.name}</span>
                      {formatMemberSince() && (
                        <>
                          <div className="w-1 h-1 bg-[#94A3B8] rounded-full font-['open_sans']" />
                          <span>Member since {formatMemberSince()}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black">Interests</h4>

                <div className="flex flex-wrap gap-1">
                  {userProfile.interests && userProfile.interests.length > 0 ? (
                    userProfile.interests.map((interest: any) => (
                      <span
                        key={interest.id}
                        className="px-3 py-1.5 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
                      >
                        {interest.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#64748B] text-xs">No interests</span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
                <h4 className="font-[Poppins] font-medium text-black">Profession</h4>

                <div className="flex gap-2">
                  {userProfile.professions && userProfile.professions.length > 0 ? (
                    userProfile.professions.map((profession: any) => (
                      <span
                        key={profession.id}
                        className="px-5 py-1 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
                      >
                        {profession.title}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#64748B] text-xs">No professions</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2">
                {profileData.friend_profile_pics && profileData.friend_profile_pics.length > 0 ? (
                  <>
                    {profileData.friend_profile_pics.slice(0, 3).map((pic: string, i: number) => (
                      <img
                        key={i}
                        src={pic}
                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        alt={`Friend ${i + 1}`}
                      />
                    ))}
                    {profileData.friend_count > 3 && (
                      <div className="w-10 h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[#F07EFF] font-bold text-sm">{profileData.friend_count - 3}+</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-10 h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[#F07EFF] font-bold text-sm">{profileData.friend_count || 0}</span>
                  </div>
                )}
              </div>

              <button className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm">
                {profileData.is_friend ? "Connected" : "Connect now"}
              </button>
            </div>
          </section>
        </div>
        {/* Services Offered Section */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
            Services Offered
          </h3>

          <div className="flex items-center space-x-7 flex-wrap gap-2">
            {services.length > 0 ? (
              services.map((service: any) => (
                <span key={service.id} className="font-['open_sans'] font-semibold text-[#081021]">
                  {service.name}
                </span>
              ))
            ) : (
              <span className="text-[#64748B]">No services offered</span>
            )}
          </div>
        </section>
        {/* Photos Section */}
        <section className="bg-white border border-[#F7F7F7] rounded-xl p-4 space-y-4">
          <div className="flex items-end justify-between">
            <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
              Photos
            </h3>

            {photos.length > 4 && (
              <div className="flex items-center space-x-1.5 text-[#7077FE]">
                <span className="font-[Poppins] font-medium cursor-pointer">See all {photos.length} photos</span>
                <svg className="w-3 h-2" viewBox="0 0 13 10" fill="currentColor">
                  <path d="M8 1L12 5L8 9M12 5H1" />
                </svg>
              </div>
            )}
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {photos.slice(0, 4).map((photo: any) => (
                <div key={photo.id} className="aspect-square bg-[#FFE4F5] rounded-lg overflow-hidden">
                  <img
                    src={photo.file}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#64748B] text-center py-8">No photos available</div>
          )}
        </section>
        {/* Contact Information Section */}
        <section className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
            Contact Information
          </h3>

          <div className="space-y-4">

            {/* Address */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">

                <MapPin className="w-4 h-4 text-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Address</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">
                {contactInfo.address || userProfile.address || "No address provided"}
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#D1D5DB] fill-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Phone</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">{formatPhone()}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#D1D5DB]" />
                <span className="font-['open_sans'] font-semibold text-[#081021]">Email</span>
              </div>
              <p className="font-['open_sans'] text-[14px] text-[#64748B]">{contactInfo.email || "N/A"}</p>
            </div>

            {/* Website */}
            {contactInfo.website && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#D1D5DB]" />
                  <span className="font-['open_sans'] font-semibold text-[#081021]">Website</span>
                </div>
                <p className="font-['open_sans'] text-[14px] text-[#64748B]">
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-[#7077FE] hover:underline">
                    {contactInfo.website}
                  </a>
                </p>
              </div>
            )}

            {/* Business Timings */}
            {businessHours.business_status && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-[#D1D5DB] flex items-center justify-center">
                    <Clock4 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-['open_sans'] font-semibold text-[#081021]">Bussiness timings</span>
                </div>
                {formatBusinessHours()}
              </div>
            )}

          </div>
        </section>
        {/* Best Practice Section */}

        <div className="grid grid-cols-2 gap-4">
          {bestPractices.length > 0 &&
            <section className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  Best practice
                </h3>

                <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
                  View all
                </span>
              </div>

              <div className="space-y-3">
                {bestPractices.length > 0 ? (
                  bestPractices.map((item: any) => {
                    const description = item.description || "";
                    const isExpanded = expandedPractices.has(item.id);
                    const shouldTruncate = description.length >= 100;
                    const displayText = shouldTruncate && !isExpanded
                      ? description.slice(0, 100) + "..."
                      : description;

                    const toggleExpand = () => {
                      setExpandedPractices(prev => {
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
                        className="bg-white border border-[#ECEEF2] rounded-xl p-3 flex space-x-2"
                      >
                        <img
                          src={item.file}
                          alt="Practice"
                          className="w-[216px] h-[150px] rounded-lg object-cover"
                        />

                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
                              {item.title}
                            </h4>

                            <p className="font-['open_sans'] font-normal text-[14px] text-[#1F2937] leading-relaxed">
                              {displayText}
                              {shouldTruncate && (
                                <>
                                  {" "}
                                  <button
                                    onClick={toggleExpand}
                                    className="text-[#F07EFF] font-['open_sans'] font-semibold hover:underline"
                                  >
                                    {isExpanded ? "Read Less" : "Read More"}
                                  </button>
                                </>
                              )}
                            </p>
                          </div>

                          <button className="bg-[#7077FE] text-white px-6 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] tracking-[0px] text-center capitalize">
                            {item.is_following ? "Following" : "Follow"}
                          </button>

                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#64748B] text-center py-8">No best practices available</div>
                )}
              </div>
            </section>
          }

          {/* Products Section */}
          {products.length > 0 &&
            <section className="bg-white rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
                  Products
                </h3>

                <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
                  View all
                </span>
              </div>

              <div className="space-y-3">
                {products.length > 0 ? (
                  products.slice(0, 3).map((product: any, index: number) => (
                    <div
                      key={index}
                      className="bg-gradient-to-b from-[#F1F3FF] to-white border border-[#ECEEF2] rounded-xl p-4 flex space-x-4"
                    >
                      {/* IMAGE + HEART WRAPPER */}
                      <div className="relative">
                        <img
                          src={product.thumbnail_url || "https://static.codia.ai/image/2025-12-04/LfjsJkrBT4.png"}
                          alt={product.title}
                          className="w-[196px] h-[156px] rounded-3xl object-cover"
                        />

                        {/* Heart Button Over Image */}
                        <button className="absolute top-3 right-3 w-10 h-10 bg-[#1F2937] bg-opacity-90 rounded-full flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 " viewBox="0 0 20 20" stroke="white">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">

                          {/* Category Badge */}
                          <div className="inline-flex items-center space-x-3 bg-opacity-10 rounded-full px-3 py-1">
                            <span
                              className={`text-xs font-[Poppins] ${product.category === "Music" ? "text-[#F07EFF]" : "text-[#7077FE]"
                                }`}
                            >
                              {product.category}
                            </span>

                            {/* ICONS BASED ON CATEGORY */}
                            {product.category === "Music" ? (
                              <Music
                                className="w-4 h-4 text-[#F07EFF]"
                                strokeWidth={2}
                              />
                            ) : (
                              <BookOpen
                                className="w-4 h-4 text-[#7077FE]"
                                strokeWidth={2}
                              />
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
                            {product.title}
                          </h4>

                          {/* Rating Section */}
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: Math.floor(product.rating_average || 0) }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-[#FACC15] fill-[#FACC15]"
                                  strokeWidth={1.2}
                                />
                              ))}
                              {Array.from({ length: 5 - Math.floor(product.rating_average || 0) }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-[#94A3B8]"
                                  strokeWidth={1.2}
                                />
                              ))}
                            </div>

                            <div className="flex items-center space-x-1">
                              <MessageSquareMoreIcon className="w-4 h-4 text-[#9CA3AF]" />
                              <span className="text-[#9CA3AF] font-[Poppins] font-medium">{product.review_count || 0}</span>
                            </div>
                          </div>

                          {/* Author */}
                          {product.profile && (
                            <div className="flex items-center space-x-2">
                              <img
                                src={product.profile.profile_picture || "https://static.codia.ai/image/2025-12-04/EKAU1ouAu0.png"}
                                alt={`${product.profile.first_name} ${product.profile.last_name}`}
                                className="w-5 h-6 rounded-lg object-cover"
                              />
                              <span className="font-['open_sans'] font-semibold text-xs text-[#1F2937]">
                                {`${product.profile.first_name || ""} ${product.profile.last_name || ""}`.trim()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price + Button */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {product.discount_percentage && parseFloat(product.discount_percentage) > 0 && (
                              <div className="flex items-center space-x-3">
                                <span className="text-[#9CA3AF] font-[Poppins] font-medium line-through">
                                  ${product.price}
                                </span>
                                <div className="bg-[#EBF2FF] px-2 py-1 rounded text-xs font-Inter font-medium text-[#1E3A8A]">
                                  -{product.discount_percentage}%
                                </div>
                              </div>
                            )}
                            <div className="text-xl font-[Poppins] font-semibold text-[#1F2937]">
                              ${product.final_price || product.price}
                            </div>
                          </div>

                          <button className="bg-[#7077FE] text-white px-8 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] capitalize">
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[#64748B] text-center py-8">No products available</div>
                )}
              </div>
            </section>
          }
        </div>
        <section className="bg-white rounded-xl p-4 space-y-4">

          {/* Post Review Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
              Post your review
            </h3>

            {/* Star Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= reviewForm.rating
                        ? "text-[#FACC15] fill-[#FACC15]"
                        : "text-[#9CA3AF]"
                        }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              {reviewForm.rating > 0 && (
                <span className="text-black text-sm">{reviewForm.rating}</span>
              )}
            </div>

            {/* Comment Box */}
            <div className="space-y-2">
              <div className="border border-[#D1D5DB] rounded-2xl p-5 min-h-[170px] flex flex-col justify-between">
                <textarea
                  className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent"
                  placeholder="Post a comment..."
                  value={reviewForm.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 2000) {
                      setReviewForm(prev => ({ ...prev, description: value }));
                    }
                  }}
                  rows={4}
                />

                <div className="flex justify-end items-end space-x-3 mt-4">
                  <div className="bg-white px-3 py-2 rounded-full">
                    <span className="font-['open_sans'] text-[#9CA3AF] text-[12px]">
                      {2000 - reviewForm.description.length} Characters remaining
                    </span>
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    // disabled={submittingReview || !reviewForm.rating || !reviewForm.description.trim()}
                    className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white px-5 py-3 rounded-full font-[Poppins] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              <p className="font-['open_sans'] text-sm text-[#1F2937] leading-relaxed">
                Please note that this community is actively moderated according to
                <span className="text-[#6B21A8]"> CNESS community rules</span>
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
              All Reviews
            </h3>

            {loadingReviews ? (
              <div className="text-center py-8 text-[#64748B]">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div
                className="space-y-5 max-h-[800px] overflow-y-auto"
                onScroll={(e) => {
                  const target = e.target as HTMLElement;
                  const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
                  if (scrollBottom < 100 && reviewsPagination.hasMore && !reviewsPagination.loadingMore) {
                    loadMoreReviews();
                  }
                }}
              >
                {reviews.map((review: any) => {
                  const reviewDate = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                    : "";

                  return (
                    <div key={review.id} className="bg-[#F9FAFB] rounded-lg p-4 space-y-5">
                      {/* Reviewer + Comment */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {review.profile?.profile_picture && (
                            <img
                              src={review.profile.profile_picture}
                              alt={`${review.profile.first_name} ${review.profile.last_name}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <span className="font-[Poppins] font-semibold text-black">
                            {`${review.profile?.first_name || ""} ${review.profile?.last_name || ""}`.trim() || "Anonymous"}
                          </span>
                          <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
                          <span className="font-['open_sans'] text-[#9CA3AF] text-xs">{reviewDate}</span>
                          {review.is_my_review && (
                            <>
                              <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
                              <span className="font-['open_sans'] text-[#7077FE] text-xs">Your review</span>
                            </>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating
                                ? "text-[#FACC15] fill-[#FACC15]"
                                : "text-[#94A3B8]"
                                }`}
                              strokeWidth={1.2}
                            />
                          ))}
                        </div>

                        <p className="font-['open_sans'] text-xs text-[#1F2937] leading-relaxed">
                          {review.description}
                        </p>
                      </div>

                      {/* Like / Reply Section */}
                      <div className="flex items-center space-x-2 p-2">
                        {/* Like Icon */}
                        <button
                          onClick={() => handleLikeReview(review.id)}
                          className={`flex items-center space-x-1 ${review.is_liked ? "text-[#7077FE]" : "text-[#1F2937]"}`}
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={review.is_liked ? "currentColor" : "none"} stroke="currentColor">
                            <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
                          </svg>
                          {review.likes_count > 0 && (
                            <span className="font-['open_sans'] text-xs">{review.likes_count}</span>
                          )}
                        </button>

                        {/* Divider */}
                        <div className="w-px h-5 bg-[#D1D5DB]"></div>

                        {/* Reply Button */}
                        <button
                          onClick={() => toggleReplyInput(review.id)}
                          className="flex items-center space-x-1 bg-transparent px-2 py-1 rounded-full text-[#1F2937] hover:bg-gray-100"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M15.73 5.5h1.035A7.465 7.465 0 0118 9.625a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521C4.537 3.997 5.136 3.75 5.754 3.75h1.616c.483 0 .964.078 1.423.23l3.114 1.04a4.5 4.5 0 001.423.23h2.394z" />
                          </svg>
                          <span className="font-['open_sans'] text-xs">
                            Reply {review.reply_count > 0 && `(${review.reply_count})`}
                          </span>
                        </button>
                      </div>

                      {/* Reply Input Section */}
                      {openReplyInputs.has(review.id) && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-[#ECEEF2]">
                          <div className="space-y-2">
                            <div className="border border-[#D1D5DB] rounded-2xl p-4">
                              <textarea
                                className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent"
                                placeholder="Write a reply..."
                                value={replyTexts[review.id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.length <= 1000) {
                                    setReplyTexts(prev => ({
                                      ...prev,
                                      [review.id]: value
                                    }));
                                  }
                                }}
                                rows={3}
                              />
                              <div className="flex justify-end items-center space-x-3 mt-3">
                                <span className="font-['open_sans'] text-[#9CA3AF] text-[12px]">
                                  {1000 - (replyTexts[review.id]?.length || 0)} Characters remaining
                                </span>
                                <button
                                  onClick={() => toggleReplyInput(review.id)}
                                  className="px-4 py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(review.id)}
                                  disabled={submittingReply[review.id] || !replyTexts[review.id]?.trim()}
                                  className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white px-5 py-2 rounded-full font-[Poppins] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {submittingReply[review.id] ? "Submitting..." : "Reply"}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Child Reviews (Replies) */}
                          <div
                            className="space-y-3 max-h-[600px] overflow-y-auto"
                            onScroll={(e) => {
                              const target = e.target as HTMLElement;
                              const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
                              if (scrollBottom < 100 && pagination[review.id]?.hasMore && !pagination[review.id]?.loadingMore) {
                                loadMoreChildReviews(review.id);
                              }
                            }}
                          >
                            {loadingChildReviews[review.id] ? (
                              <div className="text-center py-4 text-[#64748B] text-xs">Loading replies...</div>
                            ) : childReviews[review.id] && childReviews[review.id].length > 0 ? (
                              <>
                                {childReviews[review.id].map((childReview: any) => {
                                  const childReviewDate = childReview.createdAt
                                    ? new Date(childReview.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                    : "";

                                  return (
                                    <div key={childReview.id} className="bg-white border border-[#ECEEF2] rounded-lg p-3 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          {childReview.profile?.profile_picture && (
                                            <img
                                              src={childReview.profile.profile_picture}
                                              alt={`${childReview.profile.first_name} ${childReview.profile.last_name}`}
                                              className="w-6 h-6 rounded-full object-cover"
                                            />
                                          )}
                                          <span className="font-[Poppins] font-semibold text-sm text-black">
                                            {`${childReview.profile?.first_name || ""} ${childReview.profile?.last_name || ""}`.trim() || "Anonymous"}
                                          </span>
                                          <div className="w-1 h-1 bg-[#9CA3AF] rounded-full"></div>
                                          <span className="font-['open_sans'] text-[#9CA3AF] text-xs">{childReviewDate}</span>
                                        </div>
                                        {/* Edit/Delete Buttons */}
                                        {childReview.is_my_reply && editingReplyId !== childReview.id && (
                                          <div className="flex items-center space-x-2">
                                            <button
                                              onClick={() => handleEditReply(childReview.id, childReview.text || childReview.description)}
                                              className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                              disabled={deletingReply[childReview.id]}
                                            >
                                              Edit
                                            </button>
                                            <span className="text-[#D1D5DB]">|</span>
                                            <button
                                              onClick={() => handleDeleteReply(review.id, childReview.id)}
                                              className="text-[#EF4444] hover:text-[#DC2626] font-['open_sans'] text-xs"
                                              disabled={deletingReply[childReview.id]}
                                            >
                                              {deletingReply[childReview.id] ? "Deleting..." : "Delete"}
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {/* Edit Mode or Display Mode */}
                                      {editingReplyId === childReview.id ? (
                                        <div className="space-y-2">
                                          <div className="border border-[#D1D5DB] rounded-2xl p-3">
                                            <textarea
                                              className="w-full outline-none resize-none font-['open_sans'] text-[#1F2937] bg-transparent"
                                              placeholder="Edit your reply..."
                                              value={editReplyTexts[childReview.id] || ""}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 1000) {
                                                  setEditReplyTexts(prev => ({
                                                    ...prev,
                                                    [childReview.id]: value
                                                  }));
                                                }
                                              }}
                                              rows={3}
                                            />
                                            <div className="flex justify-end items-center space-x-3 mt-2">
                                              <span className="font-['open_sans'] text-[#9CA3AF] text-[12px]">
                                                {1000 - (editReplyTexts[childReview.id]?.length || 0)} Characters remaining
                                              </span>
                                              <button
                                                onClick={() => handleCancelEdit(childReview.id)}
                                                className="px-4 py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100"
                                                disabled={submittingEditReply[childReview.id]}
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                onClick={() => handleUpdateReply(review.id, childReview.id)}
                                                disabled={submittingEditReply[childReview.id] || !editReplyTexts[childReview.id]?.trim()}
                                                className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white px-5 py-2 rounded-full font-[Poppins] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                {submittingEditReply[childReview.id] ? "Updating..." : "Update"}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="font-['open_sans'] text-xs text-[#1F2937] leading-relaxed pl-8">
                                          {childReview.text || childReview.description}
                                        </p>
                                      )}

                                      {/* Like Button for Child Review */}
                                      {editingReplyId !== childReview.id && (
                                        <div className="flex items-center pl-8 pt-1">
                                          <button
                                            onClick={() => handleLikeReply(review.id, childReview.id)}
                                            className={`flex items-center space-x-1 ${childReview.is_liked ? "text-[#7077FE]" : "text-[#1F2937]"}`}
                                          >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={childReview.is_liked ? "currentColor" : "none"} stroke="currentColor">
                                              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
                                            </svg>
                                            {childReview.likes_count > 0 && (
                                              <span className="font-['open_sans'] text-xs">{childReview.likes_count}</span>
                                            )}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {/* Load More Indicator */}
                                {pagination[review.id]?.loadingMore && (
                                  <div className="text-center py-4 text-[#64748B] text-xs">Loading more replies...</div>
                                )}
                                {pagination[review.id]?.hasMore && !pagination[review.id]?.loadingMore && (
                                  <div className="text-center py-2">
                                    <button
                                      onClick={() => loadMoreChildReviews(review.id)}
                                      className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                    >
                                      Load more replies
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-2 text-[#64748B] text-xs">No replies yet</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Load More Indicator for Parent Reviews */}
                {reviewsPagination.loadingMore && (
                  <div className="text-center py-4 text-[#64748B] text-xs">Loading more reviews...</div>
                )}
                {reviewsPagination.hasMore && !reviewsPagination.loadingMore && (
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
              <div className="text-center py-8 text-[#64748B]">No reviews yet</div>
            )}
          </div>

        </section>
      </main>
      <EnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        directory={directoryData}
      />
    </>
  )
}

export default DirectoryProfile
