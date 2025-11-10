import React, { useEffect, useRef, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { GetMarketPlaceMoods, GetPreviewProduct, UpdateProductStatus, UpdateVideoProduct, UploadProductDocument } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import uploadimg from "../assets/upload1.svg";
import { Plus, X } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// const guitarImg = 'https://cdn.cness.io/VIDEO%20(1).svg';
// const storytellerImg = 'https://cdn.cness.io/freame2.svg';

// Breadcrumb component
const Breadcrumb = () => (
  <nav
    className="mb-6 px-8 text-gray-700 text-sm"
    style={{ fontFamily: "Poppins" }}
    aria-label="Breadcrumb"
  >
    <ol className="list-reset flex">
      <li>
        <a href="/dashboard/seller-dashboard" className="text-black-600">
          Home
        </a>
      </li>
      <li className="flex items-center">
        <RiArrowRightSLine className="mx-2 text-slate-500" />
      </li>
      <li>
        <a href="/dashboard/products" className="text-black-600">
          Products
        </a>
      </li>
      <li className="flex items-center">
        <RiArrowRightSLine className="mx-2 text-slate-500" />
      </li>
      <li className="text-gray-500">Edit Product</li>
    </ol>
  </nav>
);

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
  existingVideoUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  fileType,
  onUploadSuccess,
  onRemove,
  defaultPreview,
  error,
  existingVideoUrl,
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

    if (!file.type.startsWith("video/")) {
      showToast({
        message: "Please upload a video file",
        type: "error",
        duration: 3000,
      });
      return;
    }

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
      const videoURL = URL.createObjectURL(file);
      setPreview(videoURL);

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
            <img
              src={preview}
              alt="Video thumbnail"
              className="rounded-xl w-full h-54 object-cover"
            />

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/path/to/play-button.png" // replace with your play icon
                alt="Play Button"
                className="w-12 h-12"
              />
            </div>
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
      {existingVideoUrl && !preview && (
        <p className="text-sm text-gray-500 mt-2">Current video is uploaded. Upload a new one to replace it.</p>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const EditVideoProductPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params?.productNo;
  const { showToast } = useToast();
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [moods, setMoods] = useState<string[]>([]);
  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [shortVideoFile, setShortVideoFile] = useState<File | null>(null);
  const [newHighlight, setNewHighlight] = useState("");
  const [mainVideoPreview, setMainVideoPreview] = useState("");
  const [shortVideoPreview, setShortVideoPreview] = useState("");

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    video_url: "",
    thumbnail_url: "",
    overview: "",
    highlights: [] as string[],
    duration: "",
    language: "",
    short_video_url: "",
    summary: "",
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      setIsFetchingData(true);
      try {
        const response = await GetPreviewProduct('video', productId);
        const productData = response?.data?.data;

        if (productData) {
          setFormData({
            product_title: productData.product_title || "",
            price: parseFloat(productData.original_price || productData.price || "0"),
            discount_percentage: parseFloat(productData.discount_percentage || "0"),
            mood_id: productData.mood_id || "",
            video_url: productData.video_details?.video_files?.[0] || "",
            thumbnail_url: productData.video_details?.thumbnail_url || "",
            overview: productData.overview || "",
            highlights: productData.highlights || [],
            duration: productData.video_details?.duration || "",
            language: productData.language || "",
            short_video_url: productData.video_details?.short_preview_video_url || "",
            summary: productData.video_details?.summary_of_storytelling || "",
          });
        }
        setMainVideoPreview(productData.video_details?.main_video?.thumbnail);
        setShortVideoPreview(productData.video_details?.short_video?.thumbnail);

      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to load product data.",
          type: "error",
          duration: 3000,
        });
        navigate('/dashboard/products');
      } finally {
        setIsFetchingData(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const uploadVideos = async () => {
    const uploadedData: any = {};

    // Upload main video if new file is selected
    if (mainVideoFile) {
      const mainFormData = new FormData();
      mainFormData.append('video', mainVideoFile);

      try {
        const mainResponse = await UploadProductDocument('main-video', mainFormData);
        const videoData = mainResponse?.data?.data?.data;

        uploadedData.video_url = videoData?.video_id;
        uploadedData.thumbnail_url = videoData?.thumbnail;
      } catch (error: any) {
        throw new Error(error?.response?.data?.error?.message || "Failed to upload main video");
      }
    }

    // Upload short video if new file is selected (optional)
    if (shortVideoFile) {
      const shortFormData = new FormData();
      shortFormData.append('short_video', shortVideoFile);

      try {
        const shortResponse = await UploadProductDocument('short-video', shortFormData);
        const videoData = shortResponse?.data?.data;

        uploadedData.short_video_url = videoData?.video_id;
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
      // Step 1: Upload new videos first (if any)
      const uploadedData = await uploadVideos();

      // Step 2: Prepare payload with updated data
      const payload: any = {
        product_title: formData.product_title,
        price: formData.price,
        discount_percentage: formData.discount_percentage,
        overview: formData.overview,
        highlights: formData.highlights,
        duration: formData.duration,
        language: formData.language,
        summary: formData.summary,
      };

      // Add video URLs only if new videos were uploaded
      if (uploadedData.video_url) {
        payload.video_url = uploadedData.video_url;
      }
      if (uploadedData.thumbnail_url) {
        payload.thumbnail_url = uploadedData.thumbnail_url;
      }
      if (uploadedData.short_video_url) {
        payload.short_video_url = uploadedData.short_video_url;
      }

      // Step 3: Update product details
      await UpdateVideoProduct(payload, productId);

      // Step 4: Update product status
      const status = isDraft ? 'draft' : 'published';
      await UpdateProductStatus({ status }, productId);

      showToast({
        message: isDraft ? "Product saved as draft successfully" : "Product published successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      // Navigate based on action
      if (isDraft) {
        // Navigate to preview page for draft
        setTimeout(() => {
          navigate(`/dashboard/products/preview/${productId}?category=video`);
        }, 1500);
      } else {
        // Navigate to products list for published
        setTimeout(() => {
          navigate('/dashboard/products');
        }, 1500);
      }
    } catch (error: any) {
      showToast({
        message: error?.message || error?.response?.data?.error?.message || 'Failed to update product',
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

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-1 font-poppins" style={{ fontFamily: "Poppins" }}>
      <Breadcrumb />
      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        {/* Edit Video Section */}
        <FormSection
          title="Edit Video"
          description="Update your digital product details, pricing, and availability on the marketplace."
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
              description="Drag & drop or click to upload new video"
              fileType="main-video"
              onUploadSuccess={handleMainVideoUpload}
              onRemove={handleRemoveMainVideo}
              defaultPreview={mainVideoPreview}
              error={errors.video_url}
              videoFile={mainVideoFile}
              existingVideoUrl={formData.video_url}
            />
          </div>
        </FormSection>

        <FormSection
          title="Details"
          description="Update detailed information about your product."
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
                      placeholder="Add a highlight"
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
                  Add up to 3 key highlights about your video
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
          description="Update short video and description."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload
              label="Short Video (Optional)"
              description="Drag & drop or click to upload new short video"
              fileType="short-video"
              onUploadSuccess={handleShortVideoUpload}
              onRemove={handleRemoveShortVideo}
              defaultPreview={shortVideoPreview}
              videoFile={shortVideoFile}
              existingVideoUrl={formData.short_video_url}
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
            disabled={isLoading}
            className="px-5 py-3 text-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:bg-[#5a60ea] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Publishing..." : "Submit"}
          </button>
        </div>
      </div>

      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDiscardModal(false)}></div>
          <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-8 w-[450px]">
            <h3 className="text-[20px] font-semibold font-['Poppins'] text-[#242E3A] mb-4">
              Cancel Changes?
            </h3>
            <p className="text-[14px] text-[#665B5B] font-['Open_Sans'] mb-6">
              Are you sure you want to cancel? All your changes will not be saved.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={confirmDiscard}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVideoProductPage;
