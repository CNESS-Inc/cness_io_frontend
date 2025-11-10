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
  onUploadSuccess?: (videoFile: File) => void;
  onRemove?: () => void;
  defaultPreview?: string;
  error?: string;
  videoFile?: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  fileType,
  onUploadSuccess,
  onRemove,
  defaultPreview,
  error,
}) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setPreview(defaultPreview || null);
  }, [defaultPreview]);

  const handleClick = () => {
    if (!isUploading) {
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
      // Create temporary preview
      const videoURL = URL.createObjectURL(file);
      setPreview(videoURL);

      // Store file in state, don't upload yet
      if (onUploadSuccess) {
        onUploadSuccess(file);
      }

      showToast({
        message: `${fileType === 'main-video' ? 'Main' : 'Short'} video added`,
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: "Failed to add video",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
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
          }`}
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
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative">
            <video
              src={preview}
              className="w-full max-h-64 rounded-lg object-cover"
              controls={false}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
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
            {isUploading ? (
              <p className="font-[poppins] text-[16px] text-[#7077FE]">Adding video...</p>
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
  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [shortVideoFile, setShortVideoFile] = useState<File | null>(null);
  const [newHighlight, setNewHighlight] = useState("");

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
    short_video_url: "", // short video URL
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

  const uploadVideos = async () => {
    const uploadedData: any = {};

    if (!mainVideoFile) {
      showToast({
        message: "Main video is required.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Upload main video
    if (mainVideoFile) {
      const mainFormData = new FormData();
      mainFormData.append('video', mainVideoFile);

      try {
        const mainResponse = await UploadProductDocument('main-video', mainFormData);
        uploadedData.video_id = mainResponse?.data?.data?.video_id;
      } catch (error: any) {
        throw new Error(error?.response?.data?.error?.message || "Failed to upload main video");
      }
    }
    // Upload short video (optional)
    if (shortVideoFile) {
      const shortFormData = new FormData();
      shortFormData.append('short_video', shortVideoFile);

      try {
        const shortResponse = await UploadProductDocument('short-video', shortFormData);
        uploadedData.short_video_id = shortResponse?.data?.data?.video_id;
      } catch (error: any) {
        throw new Error(error?.response?.data?.error?.message || "Failed to upload short video");
      }
    }

    return uploadedData;
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

    setIsLoading(true);
    try {
      const uploadedData = await uploadVideos();

      const payload = {
        ...formData,
        video_url: uploadedData.video_id,
        short_video_url: uploadedData.short_video_id || "",
        status: isDraft ? 'draft' : 'published'
      };

      const response = await CreateVideoProduct(payload);
      console.log('response', response)

      showToast({
        message: isDraft ? "Product saved as draft" : "Product submitted successfully",
        type: "success",
        duration: 3000,
      });
      setErrors({});

      setTimeout(() => {
        navigate(isDraft ? `/dashboard/products/preview/${response?.data?.data?.product_id}?category=video` : '/dashboard/products');
      }, 1500);
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

  const handleMainVideoUpload = (file: File) => {
    setMainVideoFile(file);
    setErrors(prev => ({ ...prev, video_url: "" }));
  };

  const handleShortVideoUpload = (file: File) => {
    setShortVideoFile(file);
  };

  const handleRemoveMainVideo = () => {
    setMainVideoFile(null);
  };

  const handleRemoveShortVideo = () => {
    setShortVideoFile(null);
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
              error={errors.video_url}
              videoFile={mainVideoFile}
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
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Write a brief description of your product"
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
              videoFile={shortVideoFile}
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
    </>
  );
};

export default AddVideoForm;
