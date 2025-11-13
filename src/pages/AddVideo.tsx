import React, { useState, useRef, useEffect } from "react";
import uploadimg from "../assets/upload1.svg";
//import { ChevronRight } from "lucide-react";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreateVideoProduct, GetMarketPlaceCategories, GetMarketPlaceMoods, UploadProductDocument } from "../Common/ServerAPI";
import { Plus, X } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import AIModal from "../components/MarketPlace/AIModal";

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => (
  <section className="space-y-5">
    <div>
      <h2 className="font-[poppins] font-semibold text-[18px] leading-[100%] text-[#242E3A] mb-1">
        {title}
      </h2>
      <p className="font-['Open_Sans'] text-[14px] leading-[26px] text-[#665B5B]">
        {description}
      </p>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {children}
    </div>
  </section>
);

interface InputFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required = false,
  type = "text",
  name,
  value,
  onChange,
  error = "",
}) => (
  <div className="flex flex-col">
    <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

interface FileUploadProps {
  label?: string;
  description: string;
  fileType: 'main-video' | 'short-video';
  onUploadSuccess?: (videoId: string, thumbnailUrl: string, videoUrl: string) => void;
  onRemove?: () => void;
  defaultThumbnail?: string;
  error?: string;
  isUploading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  fileType,
  onUploadSuccess,
  onRemove,
  defaultThumbnail,
  error,
  isUploading: externalUploading = false,
}) => {
  const [thumbnail, setThumbnail] = useState<string | null>(defaultThumbnail || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setThumbnail(defaultThumbnail || null);
  }, [defaultThumbnail]);

  const handleClick = () => {
    if (!isUploading && !externalUploading) {
      fileRef.current?.click();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      showToast({
        message: "Please upload a video file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Validate file size (100MB max for videos)
    if (file.size > 100 * 1024 * 1024) {
      showToast({
        message: "File size should be less than 100MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (fileType === 'main-video') {
        formData.append('video', file);
      } else {
        formData.append('short_video', file);
      }

      const response = await UploadProductDocument(fileType, formData);
      const videoData = response?.data?.data;

      setThumbnail(videoData.thumbnail);

      if (onUploadSuccess) {
        onUploadSuccess(videoData.video_id, videoData.thumbnail, videoData.video_url);
      }

      showToast({
        message: `${fileType === 'main-video' ? 'Main' : 'Short'} video uploaded successfully`,
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to upload video",
        type: "error",
        duration: 3000,
      });
      setThumbnail(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileRef.current) {
        fileRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setThumbnail(null);
    if (onRemove) {
      onRemove();
    }
    // Reset file input
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <div>
      {label && (
        <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
          {label}
        </label>
      )}
      <div
        onClick={handleClick}
        className={`relative rounded-lg p-6 text-center cursor-pointer transition-all ${error ? 'bg-red-50' : 'bg-[#F9FAFB] hover:bg-[#EEF3FF]'
          } ${(isUploading || externalUploading) ? 'pointer-events-none opacity-70' : ''}`}
      >
        {/* ✅ SVG Dashed Border */}
        <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="12"
            ry="12"
            stroke={error ? "#EF4444" : "#CBD5E1"}
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
            className="transition-colors duration-300 group-hover:stroke-[#7077FE]"
          />
        </svg>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading || externalUploading}
        />

        {thumbnail ? (
          <div className="relative">
            <img
              src={thumbnail}
              alt="Video Thumbnail"
              className="w-full max-h-64 rounded-lg object-cover"
            />
            {/* Edit/Replace Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="absolute top-2 right-12 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
              title="Replace Video"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            {/* Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              title="Remove Video"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-50 rounded-full p-4">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <img src={uploadimg} alt="upload" className="w-10 h-10 mt-6" />
            {isUploading || externalUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
                <p className="font-[poppins] text-[16px] text-[#7077FE]">Uploading video...</p>
              </div>
            ) : (
              <p className="font-[poppins] text-[16px] text-[#242E3A]">{description}</p>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const AddVideoForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newHighlight, setNewHighlight] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);

  const [mainVideoData, setMainVideoData] = useState<{
    video_id: string;
    thumbnail: string;
    video_url: string;
  } | null>(null);

  const [shortVideoData, setShortVideoData] = useState<{
    video_id: string;
    thumbnail: string;
    video_url: string;
  } | null>(null);

  const handleSelectCategory = (category: string) => {
    setShowModal(false); // Close modal first

    const routes: Record<string, string> = {
      Video: "/dashboard/products/add-video",
      Music: "/dashboard/products/add-music",
      Course: "/dashboard/products/add-course",
      Podcasts: "/dashboard/products/add-podcast",
      Ebook: "/dashboard/products/add-ebook",
      Art: "/dashboard/products/add-arts",
    };

    const path = routes[category];
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await GetMarketPlaceMoods();
        setMoods(response?.data?.data);
      } catch (error: any) {
        showToast({
          message: "Failed to load moods.",
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchMoods();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await GetMarketPlaceCategories();
        if (response?.data?.data) {
          setCategories(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error?.message || "Failed to load categories.";
        showToast({
          message: errorMessage,
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    video_url: "", // video_id
    overview: "",
    highlights: [] as string[],
    duration: "",
    language: "",
    short_video_url: "", // short video_id
    summary: "",
    status: "",
  });

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.product_title.trim()) newErrors.product_title = "Product title is required.";
    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (isNaN(formData.discount_percentage)) {
      newErrors.discount_percentage = "Discount percentage must be a number.";
    } else if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
      newErrors.discount_percentage = "Discount percentage must be between 0 and 100.";
    }
    if (!formData.mood_id.trim()) newErrors.mood_id = "Mood Selection is required.";
    // if (!formData.video_url.trim()) newErrors.video_url = "Main video is required.";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required.";

    if (formData.highlights.length === 0) {
      newErrors.highlights = "At least one highlight is required.";
    }

    if (formData.duration) {
      if (!/^\d{2}:\d{2}:\d{2}$/.test(formData.duration)) {
        newErrors.duration = "Duration must be in HH:MM:SS format (e.g., 01:10:00)";
      }
    }

    if (!formData.summary.trim()) newErrors.summary = "Summary is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    const { name, value } = target;

    setFormData(prev => ({ ...prev, [name]: value }));

    const toStr = (v: unknown) => (v === undefined || v === null ? "" : String(v));
    const valStr = toStr(value).trim();

    let message = "";
    switch (name) {
      case "product_title":
        if (!valStr) message = "Product title is required";
        break;

      case "price":
        if (value === "" || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          message = "Price must be a positive number";
        }
        break;

      case "discount_percentage":
        const discount = parseFloat(value);
        if (value === "" || isNaN(discount)) {
          message = "Discount percentage must be a number";
        } else if (discount < 0 || discount > 100) {
          message = "Discount percentage must be between 0 and 100";
        }
        break;

      case "mood_id":
        if (!valStr) message = "Mood Selection is required";
        break;

      case "video_url":
        if (!valStr) message = "Video URL is required";
        break;

      case "overview":
        if (!valStr) message = "Overview is required";
        break;

      case "highlights":
        if (Array.isArray(value) && value.length === 0) {
          message = "At least one highlight is required";
        } else if (Array.isArray(value) && value.some((highlight: string) => !highlight.trim())) {
          message = "Highlights cannot contain empty values";
        }
        break;

      case "duration":
        if (valStr && !/^\d{2}:\d{2}:\d{2}$/.test(valStr)) message = "Invalid duration format. Use HH:MM:SS";
        break;

      case "summary":
        if (!valStr) message = "Summary is required";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: message }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm()) {
      showToast({
        message: "Please fill all required fields correctly",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!mainVideoData?.video_id) {
      showToast({
        message: "Please upload main video",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        video_url: mainVideoData.video_id,
        short_video_url: shortVideoData?.video_id || "",
        status: isDraft ? 'draft' : 'published'
      };

      const response = await CreateVideoProduct(payload);

      showToast({
        message: isDraft ? "Product saved as draft" : "Product submitted successfully",
        type: "success",
        duration: 3000,
      });
      setErrors({});

      navigate(isDraft ? `/dashboard/products/preview/${response?.data?.data?.product_id}?category=video` : '/dashboard/products');
    } catch (error: any) {
      showToast({
        message: error?.message || error?.response?.data?.error?.message || 'Failed to submit product',
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIGenerate = (generatedText: string) => {
    setFormData(prev => ({
      ...prev,
      overview: generatedText
    }));

    setErrors(prev => ({ ...prev, overview: "" }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      if (formData.highlights.length >= 3) {
        showToast({
          message: "Maximum 3 highlights allowed",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }));
      setNewHighlight("");

      if (errors.highlights) {
        setErrors(prev => ({ ...prev, highlights: "" }));
      }
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleEditHighlight = (index: number, newValue: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? newValue : h)
    }));
  };

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    navigate('/dashboard/products');
  };

  const handleMainVideoUpload = (videoId: string, thumbnailUrl: string, videoUrl: string) => {
    setMainVideoData({
      video_id: videoId,
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
    });

    // Update formData with video_id
    setFormData(prev => ({
      ...prev,
      video_url: videoId,
    }));

    // Clear error
    setErrors(prev => ({ ...prev, video_url: "" }));
  };

  const handleShortVideoUpload = (videoId: string, thumbnailUrl: string, videoUrl: string) => {
    setShortVideoData({
      video_id: videoId,
      thumbnail: thumbnailUrl,
      video_url: videoUrl,
    });

    // Update formData with short_video_id
    setFormData(prev => ({
      ...prev,
      short_video_url: videoId,
    }));
  };

  const handleRemoveMainVideo = () => {
    setMainVideoData(null);
    setFormData(prev => ({
      ...prev,
      video_url: "",
    }));
  };

  const handleRemoveShortVideo = () => {
    setShortVideoData(null);
    setFormData(prev => ({
      ...prev,
      short_video_url: "",
    }));
  };

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      <Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        {/* Add Video Section */}
        <FormSection
          title="Add Video"
          description="Upload your digital product details, set pricing, and make it available for buyers on the marketplace."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField
              label="Product Title *"
              placeholder="Enter your title"
              name="product_title"
              value={formData.product_title}
              onChange={handleChange}
              error={errors.product_title}
              required
            />
            <InputField
              label="Price *"
              placeholder="Enter the $ amount"
              name="price"
              value={formData.price === 0 ? "" : formData.price.toString()}
              onChange={handleChange}
              error={errors.price}
              required
            />
            <InputField
              label="Discount in %"
              placeholder="Enter discount in %"
              name="discount_percentage"
              value={formData.discount_percentage === 0 ? "" : formData.discount_percentage.toString()}
              onChange={handleChange}
              error={errors.discount_percentage}
            />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Mood *
              </label>
              <select
                name="mood_id"
                value={formData.mood_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent cursor-pointer">
                <option value="">Select Mood</option>
                {moods?.map((mood: any) => (
                  <option key={mood.id} value={mood.id}>
                    {mood.name}
                  </option>
                ))}
              </select>
              {errors.mood_id && <span className="text-red-500 text-sm mt-1">{errors.mood_id}</span>}
            </div>
          </div>

          <div className="mt-8">
            <FileUpload
              label="Upload Video *"
              description="Drag & drop or click to upload"
              fileType="main-video"
              onUploadSuccess={handleMainVideoUpload}
              onRemove={handleRemoveMainVideo}
              defaultThumbnail={mainVideoData?.thumbnail}
              error={errors.video_url}
            />
          </div>
        </FormSection>

        {/* Details Section */}
        <FormSection
          title="Details"
          description="Add detailed information about your product."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A]">
                  Overview *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition-all duration-300 group"
                >
                  <svg
                    className="w-4 h-4 animate-pulse"
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
                  <span className="text-sm font-medium">Generate with AI</span>
                  <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                </button>
              </div>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Write a brief description of your product or use AI to generate one..."
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                required
              />
              {errors.overview && <span className="text-red-500 text-sm mt-1">{errors.overview}</span>}
            </div>
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights * (Max 3)
              </label>
              <div className="space-y-3">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 border border-gray-200 rounded-md bg-white">
                    <span className="text-[#7077FE] font-bold mt-1">•</span>
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleEditHighlight(index, e.target.value)}
                      className="flex-1 border-none focus:outline-none text-[#242E3A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.highlights.length < 3 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      placeholder="Add a highlight (e.g., Guided relaxation for stress relief)"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-[#7077FE] text-white rounded-md hover:bg-[#5a60ea] transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Add up to 3 key highlights about your video (e.g., "Guided relaxation for stress relief", "Mindfulness and breathing techniques")
                </p>
              </div>
              {errors.highlights && <span className="text-red-500 text-sm mt-1">{errors.highlights}</span>}
            </div>
            <InputField
              label="Duration (HH:MM:SS)"
              placeholder="e.g., 01:10:00"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              error={errors.duration}
            />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]">
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
              {errors.language && <span className="text-red-500 text-sm mt-1">{errors.language}</span>}
            </div>
          </div>
        </FormSection>

        {/* Storytelling Section */}
        <FormSection
          title="Storytelling"
          description="Add a short video and description to explain your content."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload
              label="Short Video (Optional)"
              description="Drag & drop or click to upload"
              fileType="short-video"
              onUploadSuccess={handleShortVideoUpload}
              onRemove={handleRemoveShortVideo}
              defaultThumbnail={shortVideoData?.thumbnail}
            />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Summary of the video *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a brief description of your storytelling"
                className="w-full h-38 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                required
              />
              {errors.summary && <span className="text-red-500 text-sm mt-1">{errors.summary}</span>}
            </div>
          </div>
        </FormSection>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleDiscard}
            className=" px-5 py-3 text-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0]  hover:text-blue-500 transition-colors">
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0] hover:bg-gray-300 transition-colors">
            {isLoading ? "Saving..." : "Preview"}
          </button>
          <button
            type='button'
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0] hover:bg-[#5a60ea] transition-colors">
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      {showModal && (
        <CategoryModel
          open={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectCategory}
          category={categories}
        />
      )}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDiscardModal(false)}></div>
          <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-8 w-[450px]">
            <h3 className="text-[20px] font-semibold font-['Poppins'] text-[#242E3A] mb-4">
              Discard Product?
            </h3>
            <p className="text-[14px] text-[#665B5B] font-['Open_Sans'] mb-6">
              Are you sure you want to discard this product? All your entered details will not be saved.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDiscard}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}
      <AIModal
        showModal={showAIModal}
        setShowModal={setShowAIModal}
        productType="video"
        onGenerate={handleAIGenerate}
      />
    </>
  );
};

export default AddVideoForm;
