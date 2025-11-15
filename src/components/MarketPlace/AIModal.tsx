import React, { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../ui/Toast/ToastProvider";
import { ExpandProductOverview, ImproveProductOverview } from "../../Common/ServerAPI";

interface AIModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  productType?: "video" | "music" | "course" | "podcast" | "ebook" | "art";
  onGenerate: (generatedText: string) => void;
  isFreeType?: boolean;
}

const AIModal: React.FC<AIModalProps> = ({
  showModal,
  setShowModal,
  productType,
  onGenerate,
  isFreeType = false,
}) => {
  const { showToast } = useToast();
  const [aiShortText, setAiShortText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateOverview = async () => {
    if (!aiShortText.trim()) {
      showToast({
        message: "Please enter a brief description",
        type: "error",
        duration: 2000,
      });
      return;
    }
  
    setIsGenerating(true);
    try {
      let response;
      if (isFreeType) {
        response = await ImproveProductOverview({ overview: aiShortText.trim() });
      } else {
        response = await ExpandProductOverview({
          short_text: aiShortText.trim(),
          product_type: productType,  
        });
      }

      const expandedText = isFreeType ? response?.data?.data?.improved_overview_plain : response?.data?.data?.expanded_text_plain;

      if (expandedText) {
        onGenerate(expandedText);
        setShowModal(false);
        setAiShortText("");

        showToast({
          message: "Overview generated successfully! ✨",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to generate overview",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setShowModal(false);
      setAiShortText("");
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7077FE] to-[#5E65F6] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-['Poppins'] font-semibold text-lg">
                  AI Overview Generator
                </h3>
                <p className="text-white/80 text-xs font-['Open_Sans']">
                  Powered by Advanced AI ✨
                </p>
              </div>
            </div>
            {!isGenerating && (
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block font-['Open_Sans'] font-semibold text-sm text-gray-700 mb-2">
              Brief Description
            </label>
            <textarea
              value={aiShortText}
              onChange={(e) => setAiShortText(e.target.value)}
              placeholder={`e.g., ${productType === "video"
                ? "Learn guitar in 30 days"
                : productType === "music"
                  ? "Relaxing piano music for meditation"
                  : productType === "course"
                    ? "Complete web development course"
                    : productType === "podcast"
                      ? "Weekly tech news and interviews"
                      : productType === "ebook"
                        ? "Guide to financial independence"
                        : "Beautiful landscape photography"
                }`}
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
              disabled={isGenerating}
              maxLength={200}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500 font-['Open_Sans']">
                Describe your {productType} in a few words
              </p>
              <span className="text-xs text-gray-400">
                {aiShortText.length}/200
              </span>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex gap-2">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-xs text-blue-800 font-['Open_Sans'] leading-relaxed">
                  AI will create a detailed, professional overview based on your
                  input. You can edit it after generation.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-['Open_Sans'] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateOverview}
              disabled={isGenerating || !aiShortText.trim()}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-['Open_Sans'] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;