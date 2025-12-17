import React, { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import { CreateBuyerReview } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSuccess: () => void;
  existingReview?: any | null;
  viewMode?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSuccess,
  existingReview = null,
  viewMode = false,
}) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview && viewMode) {
      setRating(existingReview.rating || 0);
      setReviewTitle(existingReview.review_title || "");
      setReviewText(existingReview.review_text || "");
    } else {
      resetForm();
    }
  }, [existingReview, viewMode, isOpen]);

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewTitle("");
    setReviewText("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (viewMode) {
      handleClose();
      return;
    }

    if (rating === 0) {
      showToast({
        message: "Please select a rating",
        type: "error",
        duration: 2000,
      });
      return;
    }

    if (!reviewTitle.trim() || !reviewText.trim()) {
      showToast({
        message: "Please fill in all fields",
        type: "error",
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await CreateBuyerReview({
        product_id: productId,
        rating,
        review_title: reviewTitle,
        review_text: reviewText,
      });

      showToast({
        message: "Review submitted successfully!",
        type: "success",
        duration: 2000,
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to submit review",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-[Poppins] font-semibold text-[20px] text-[#1A1A1A]">
            {viewMode ? "Your Review" : "Write a Review"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
              Your Rating {!viewMode && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => !viewMode && setRating(star)}
                  onMouseEnter={() => !viewMode && setHoveredRating(star)}
                  onMouseLeave={() => !viewMode && setHoveredRating(0)}
                  className={`transition-transform ${!viewMode ? "hover:scale-110 cursor-pointer" : "cursor-default"
                    }`}
                  disabled={viewMode}
                >
                  <Star
                    className={`w-8 h-8 ${star <= (viewMode ? rating : hoveredRating || rating)
                        ? "fill-[#F8B814] text-[#F8B814]"
                        : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600 font-[Open_Sans]">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
              Review Title {!viewMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="e.g., Amazing product!"
              maxLength={100}
              readOnly={viewMode}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none ${viewMode
                  ? "bg-gray-50 cursor-default"
                  : "focus:border-[#7077FE]"
                } font-[Open_Sans] text-sm`}
            />
            {!viewMode && (
              <p className="text-xs text-gray-500 mt-1 font-[Open_Sans]">
                {reviewTitle.length}/100 characters
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="block font-[Poppins] font-medium text-sm text-[#1A1A1A] mb-2">
              Your Review {!viewMode && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={5}
              maxLength={500}
              readOnly={viewMode}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none ${viewMode
                  ? "bg-gray-50 cursor-default"
                  : "focus:border-[#7077FE]"
                } font-[Open_Sans] text-sm resize-none`}
            />
            {!viewMode && (
              <p className="text-xs text-gray-500 mt-1 font-[Open_Sans]">
                {reviewText.length}/500 characters
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {viewMode ? (
              <button
                type="button"
                onClick={handleClose}
                className="w-full px-4 py-3 bg-[#7077FE] text-white rounded-lg font-[Plus_Jakarta_Sans] font-medium text-sm hover:bg-[#5E65F6] transition"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-[Plus_Jakarta_Sans] font-medium text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className={`flex-1 px-4 py-3 rounded-lg font-[Plus_Jakarta_Sans] font-medium text-sm text-white transition ${isSubmitting || rating === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#7077FE] hover:bg-[#5E65F6]"
                    }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;