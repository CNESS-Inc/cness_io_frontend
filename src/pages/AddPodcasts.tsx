import React, { useEffect, useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { Music, Plus, SquarePen, Trash2, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreatePodcastProduct, GetMarketPlaceCategories, GetMarketPlaceMoods, UploadProductDocument, UploadProductThumbnail } from "../Common/ServerAPI";
import AIModal from "../components/MarketPlace/AIModal";
import SampleTrackUpload from "../components/MarketPlace/SampleTrackUpload";

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
      <h2 className="font-[poppins] font-semibold text-[18px] text-[#242E3A] mb-1">
        {title}
      </h2>
      <p className="font-['Open_Sans'] text-[14px] text-[#665B5B]">{description}</p>
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
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const AddPodcastForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newHighlight, setNewHighlight] = useState("");
  const [thumbnailData, setThumbnailData] = useState<{
    thumbnail_url: string;
    public_id: string;
  } | null>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    thumbnail_url: "",
    overview: "",
    highlights: [] as string[],
    total_duration: "",
    language: "",
    theme: "",
    format: "",
    status: "",
    sample_track: "",
  });

  const [episodes, setEpisodes] = useState<any[]>([
    {
      id: 1,
      title: "Episode 1",
      episode_files: [],
      description: "",
      duration: "",
      order_number: 1,
      is_free: false
    },
  ]);
  console.log('episodes', episodes)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moodsResponse, categoriesResponse] = await Promise.all([
          GetMarketPlaceMoods(),
          GetMarketPlaceCategories(),
        ]);
        setMoods(moodsResponse?.data?.data || []);
        setCategories(categoriesResponse?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSampleTrackUpload = (sampleId: string) => {
    setFormData(prev => ({
      ...prev,
      sample_track: sampleId,
    }));
  };

  const handleRemoveSampleTrack = () => {
    setFormData(prev => ({
      ...prev,
      sample_track: "",
    }));
  };

  const handleAIGenerate = (generatedText: string) => {
    setFormData(prev => ({
      ...prev,
      overview: generatedText
    }));

    setErrors(prev => ({ ...prev, overview: "" }));

    handleAIGenerate
  };

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

  const handleDeleteEpisode = (episodeId: any) => {
    setEpisodes(prev => prev.filter(ch => ch.id !== episodeId));
  };

  const toggleEditFile = (episodeId: number, fileOrderNumber: number) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: episode.episode_files.map((f: any) =>
              f.order_number === fileOrderNumber ? { ...f, isEditing: !f.isEditing } : f
            ),
          }
          : episode
      )
    );
  };

  const handleEditFileName = (
    episodeId: number,
    fileOrderNumber: number,
    newTitle: string
  ) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: episode.episode_files.map((f: any) =>
              f.order_number === fileOrderNumber ? { ...f, title: newTitle } : f
            ),
          }
          : episode
      )
    );
  };

  const saveFileName = (episodeId: number, fileOrderNumber: number) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: episode.episode_files.map((f: any) =>
              f.order_number === fileOrderNumber
                ? { ...f, isEditing: false }
                : f
            ),
          }
          : episode
      )
    );
  };

  const deleteFile = (episodeId: number, fileOrderNumber: number) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: episode.episode_files.filter((f: any) => f.order_number !== fileOrderNumber)
          }
          : episode
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.product_title.trim()) newErrors.product_title = "Podcast title is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.mood_id) newErrors.mood_id = "Please select a mood";
    if (!formData.thumbnail_url.trim()) newErrors.thumbnail_url = "Thumbnail url is required.";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required";
    if (formData.highlights.length === 0) newErrors.highlights = "At least one highlight is required";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (!formData.theme.trim()) newErrors.theme = "Theme is required";
    if (!formData.format.trim()) newErrors.format = "Format is required";
    if (formData.total_duration) {
      if (!/^\d{2}:\d{2}:\d{2}$/.test(formData.total_duration)) {
        newErrors.total_duration = "Duration must be in HH:MM:SS format (e.g., 01:10:00)";
      }
    }
    if (!formData.total_duration.trim()) newErrors.total_duration = "Duration is required.";

    episodes.forEach((episode, index) => {
      if (episode.episode_files.length === 0) {
        newErrors[`episode_${index}_files`] = "At least one audio file is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field
    validateField(name, value);
  };

  const validateField = (name: string, value: any) => {
    let message = "";
    const valStr = typeof value === "string" ? value.trim() : String(value);

    switch (name) {
      case "product_title":
        if (!valStr) message = "Podcast title is required";
        break;
      case "price":
        if (!valStr || parseFloat(valStr) <= 0) message = "Price must be greater than 0";
        break;
      case "mood_id":
        if (!valStr) message = "Please select a mood";
        break;
      case "thumbnail_url":
        if (!valStr) message = "Thumbnail is required";
        break;
      case "overview":
        if (!valStr) message = "Overview is required";
        break;
      case "total_duration":
        if (!valStr) message = "Duration is required";
        if (valStr && !/^\d{2}:\d{2}:\d{2}$/.test(valStr))
          message = "Invalid duration format. Use HH:MM:SS";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast({
        message: "Please upload an image file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        message: "Image size should be less than 5MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsThumbnailUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("thumbnail", file);

      const response = await UploadProductThumbnail(uploadFormData);
      const thumbnailUrl = response?.data?.data?.thumbnail_url;
      const publicId = response?.data?.data?.public_id;

      setThumbnailData({
        thumbnail_url: thumbnailUrl,
        public_id: publicId,
      });

      setFormData(prev => ({
        ...prev,
        thumbnail_url: thumbnailUrl,
      }));

      showToast({
        message: "Thumbnail uploaded successfully",
        type: "success",
        duration: 2000,
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to upload thumbnail",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsThumbnailUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailData(null);
    setFormData(prev => ({
      ...prev,
      image_url: "",
    }));
  };

  const handleEpisodeFileUpload = async (episodeId: number, file: File) => {
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      showToast({
        message: "Please upload an audio file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showToast({
        message: "File size should be less than 50MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const tempFile: any = {
      url: "",
      title: file.name,
      order_number: 0,
      file: file,
      isUploading: true,
    };

    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((ep) =>
        ep.id === episodeId
          ? {
            ...ep,
            episode_files: [...ep.episode_files, tempFile],
          }
          : ep
      )
    );

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("audio", file);

      const response = await UploadProductDocument("podcast-audio", uploadFormData);
      const uploadedFileUrl = response?.data?.data?.audio_public_id;

      setEpisodes((prevEpisodes) =>
        prevEpisodes.map((ep) => {
          if (ep.id === episodeId) {
            const updatedFiles = ep.episode_files.map((f: any) =>
              f.file === file
                ? {
                  url: uploadedFileUrl,
                  title: file.name,
                  order_number: ep.episode_files.length,
                  isUploading: false,
                }
                : f
            );
            return { ...ep, episode_files: updatedFiles };
          }
          return ep;
        })
      );

      showToast({
        message: "Audio file uploaded successfully",
        type: "success",
        duration: 2000,
      });

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`episode_${episodeId}_files`];
        return newErrors;
      });
    } catch (error: any) {
      // Remove failed upload from state
      setEpisodes((prevEpisodes) =>
        prevEpisodes.map((ep) =>
          ep.id === episodeId
            ? {
              ...ep,
              episode_files: ep.episode_files.filter((f: any) => f.file !== file),
            }
            : ep
        )
      );

      showToast({
        message: error?.response?.data?.error?.message || "Failed to upload audio file",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleEpisodeChange = (episodeId: number, field: string, value: any) => {
    setEpisodes((prevEpisodes) =>
      prevEpisodes.map((ep) =>
        ep.id === episodeId ? { ...ep, [field]: value } : ep
      )
    );

    const episodeIndex = episodes.findIndex((ep) => ep.id === episodeId);
    if (episodeIndex !== -1) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`episode_${episodeIndex}_${field}`];
        return newErrors;
      });
    }
  };

  const handleAddEpisode = () => {
    const newEpisode: any = {
      id: Date.now(),
      title: `Episode ${episodes.length + 1}`,
      episode_files: [],
      description: "",
      duration: "",
      is_free: false,
    };
    setEpisodes([...episodes, newEpisode]);
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

    if (isThumbnailUploading) {
      showToast({
        message: "Please wait for thumbnail to finish uploading",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const hasUploadingFiles = episodes.some((ep) =>
      ep.episode_files.some((file: any) => file.isUploading)
    );

    if (hasUploadingFiles) {
      showToast({
        message: "Please wait for all files to finish uploading",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        episodes: episodes.map((ep) => ({
          title: ep.title,
          episode_files: ep.episode_files.map((file: any) => ({
            url: file.url,
            title: file.title,
            order_number: file.order_number,
          })),
          description: ep.description,
          duration: ep.duration,
          is_free: ep.is_free,
        })),
        status: isDraft ? "draft" : "published",
      };

      const response = await CreatePodcastProduct(payload);

      showToast({
        message: isDraft
          ? "Podcast saved as draft"
          : "Podcast submitted successfully",
        type: "success",
        duration: 3000,
      });
      setErrors({});

      navigate(
        isDraft
          ? `/dashboard/products/podcast-preview/${response?.data?.data?.product_id}?category=podcast`
          : "/dashboard/products"
      );
    } catch (error: any) {
      showToast({
        message:
          error?.message ||
          error?.response?.data?.error?.message ||
          "Failed to submit podcast",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
      setErrors((prev) => ({ ...prev, highlights: "" }));
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

  return (
    <>
      <Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        <FormSection
          title="Add Podcast"
          description="Upload your digital product details, set pricing, and make it available for buyers on the marketplace."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField
              label="Product Title"
              placeholder="Enter your title"
              name="product_title"
              value={formData.product_title}
              onChange={handleChange}
              error={errors.product_title}
              required
            />
            <InputField
              label="Price"
              placeholder=" $ "
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
                Mood <span className="text-red-500">*</span>
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
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Thumbnail <span className="text-red-500">*</span>
              </label>
              {thumbnailData?.thumbnail_url ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={thumbnailData.thumbnail_url}
                    alt="Thumbnail"
                    className="w-full h-40 object-cover"
                  />
                  {/* Edit/Replace Button */}
                  <label
                    htmlFor="thumbnail-replace"
                    className="absolute top-2 right-12 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition cursor-pointer"
                    title="Replace Thumbnail"
                  >
                    <SquarePen className="w-4 h-4" />
                    <input
                      id="thumbnail-replace"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                      disabled={isThumbnailUploading}
                    />
                  </label>
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                    title="Remove Thumbnail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center transition-all ${isThumbnailUploading ? "pointer-events-none opacity-70" : "bg-[#F9FAFB] hover:bg-[#EEF3FF]"
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
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                      fill="none"
                      className="transition-all duration-300 group-hover:stroke-[#7077FE]"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailUpload}
                    disabled={isThumbnailUploading}
                  />
                  {isThumbnailUploading ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
                      <p className="text-sm text-[#7077FE]">Uploading thumbnail...</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                        <img src={uploadimg} alt="Upload" className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-[poppins] text-[#242E3A]">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-[#665B5B]">
                        Recommended 266 X 149 px
                      </p>
                    </div>
                  )}
                </label>
              )}
              {errors.thumbnail_url && <span className="text-red-500 text-sm mt-1">{errors.thumbnail_url}</span>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Details" description="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A]">
                  Overview <span className="text-red-500">*</span>
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
                placeholder="Describe your podcast"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
                required
              />
              {errors.overview && <span className="text-red-500 text-sm mt-1">{errors.overview}</span>}
            </div>
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights <span className="text-red-500">*</span> (Max 3)
              </label>
              <div className="space-y-3">
                {formData?.highlights?.map((highlight: any, index: number) => (
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
                  Add up to 3 key highlights about your podcast
                </p>
              </div>
              {errors.highlights && <span className="text-red-500 text-sm mt-1">{errors.highlights}</span>}
            </div>

            <InputField
              label="Total Duration (HH:MM:SS)"
              required
              placeholder="e.g., 30:00:00"
              name="total_duration"
              value={formData.total_duration}
              onChange={handleChange}
              error={errors.total_duration}
            />
            <InputField
              label="Theme"
              placeholder="Describe the podcast theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              error={errors.theme}
            />

            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Format <span className="text-red-500">*</span>
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]">
                <option value="">Select Format</option>
                <option value="MP3">MP3</option>
                <option value="WAV">WAV</option>
                <option value="AAC">AAC</option>
                <option value="FLAC">FLAC</option>
                <option value="OGG">OGG</option>
              </select>
            </div>

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

        <FormSection
          title="Sample Track"
          description="Upload a preview sample so buyers can experience your content before purchasing."
        >
          <SampleTrackUpload
            productType="video"
            onUploadSuccess={handleSampleTrackUpload}
            onRemove={handleRemoveSampleTrack}
            defaultValue={formData.sample_track}
          />
        </FormSection>

        <FormSection title="Episodes" description="">
          <div className="space-y-6">
            {episodes.map((episode, episodeIndex) => (
              <div
                key={episode.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <input
                      type="text"
                      value={episode.title}
                      onChange={(e) =>
                        handleEpisodeChange(episode.id, "title", e.target.value)
                      }
                      className="text-[16px] font-semibold text-[#242E3A] border-b border-transparent hover:border-gray-300 focus:border-[#7077FE] focus:outline-none mb-2"
                    />
                    <p className="text-sm text-[#665B5B]">
                      Upload episode {episodeIndex + 1} audios <span className="text-red-500">*</span>
                    </p>
                  </div>

                  {/* Delete Chapter Button */}
                  {episodes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Episode"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF]">
                    <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="12" ry="12" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6,6" fill="none" className="transition-all duration-300 group-hover:stroke-[#7077FE]" />
                    </svg>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        for (const file of files) {
                          await handleEpisodeFileUpload(episode.id, file);
                        }
                        e.target.value = ""; // Reset input
                      }}
                      multiple
                    />
                    <div className="text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                        <img src={uploadimg} alt="Upload" className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-[poppins] text-[#242E3A]">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-[#665B5B]">
                        MP3, WAV, AAC (max 20 MB)
                      </p>
                    </div>
                  </label>

                  <div className="space-y-3">
                    {episode.episode_files.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50 h-40 flex items-center justify-center">
                        No files uploaded yet
                      </div>
                    ) : (
                      episode.episode_files.map((file: any, fileIndex: number) => (
                        <div
                          key={fileIndex}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 flex-1">
                              {file.isUploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7077FE]"></div>
                                  <span className="text-sm text-gray-600">Uploading...</span>
                                </>
                              ) : (
                                <>
                                  <Music className="w-5 h-5 text-[#7077FE]" />
                                  {file.isEditing ? (
                                    <input
                                      type="text"
                                      value={file.title}
                                      onChange={(e) =>
                                        handleEditFileName(
                                          episode.id,
                                          file.order_number,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                                      autoFocus
                                    />
                                  ) : (
                                    <p className="text-sm font-medium text-[#242E3A] flex-1 truncate">
                                      {file.title}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>

                            {!file.isUploading && (
                              <div className="flex items-center space-x-2">
                                {file.isEditing ? (
                                  <button
                                    type="button"
                                    onClick={() => saveFileName(episode.id, file.order_number)}
                                    className="text-[#7077FE] text-sm font-semibold hover:text-[#5E65F6]"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleEditFile(episode.id, file.order_number)
                                      }
                                      className="text-gray-500 hover:text-[#7077FE] transition-colors"
                                      title="Edit filename"
                                    >
                                      <SquarePen className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteFile(episode.id, file.order_number)}
                                      className="text-gray-500 hover:text-red-500 transition-colors"
                                      title="Delete file"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {!file.isUploading && (
                            <>
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                <span>
                                  {file.file ? formatFileSize(file.file.size) : "Uploaded"}
                                </span>
                                <span className="text-green-600 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                  Ready
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Order: {file.order_number}
                              </p>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {errors[`episode_${episode.id}`] && (
                  <p className="text-red-500 text-sm mt-2">{errors[`episode_${episode.id}`]}</p>
                )}
              </div>
            ))}

            <button
              onClick={handleAddEpisode}
              className="relative w-full rounded-lg py-4 text-[#7077FE] font-medium bg-white cursor-pointer group overflow-hidden transition-all"
            >
              <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="10" ry="10" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6,6" fill="none" className="transition-colors duration-300 group-hover:stroke-[#7077FE]" />
              </svg>
              + Add Episode
            </button>

            {errors.episodes && (
              <p className="text-red-500 text-sm mt-2">{errors.episodes}</p>
            )}
          </div>
        </FormSection>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={isLoading}
            className="px-5 py-3 text-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:text-blue-500 transition-colors disabled:opacity-50">
            Discard
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Preview"}
          </button>
          <button
            type='button'
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:bg-[#5a60ea] transition-colors disabled:opacity-50">
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
              Discard Changes?
            </h3>
            <p className="text-[14px] text-[#665B5B] font-['Open_Sans'] mb-6">
              Are you sure you want to discard? All your changes will not be saved.
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

export default AddPodcastForm;