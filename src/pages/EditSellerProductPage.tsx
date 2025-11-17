import React, { useEffect, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import uploadimg from "../assets/upload1.svg";
import {
  Plus,
  X,
  Music,
  Book,
  Video,
  Image as ImageIcon,
  FileText,
  SquarePen,
  Trash2,
  Check,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import {
  DeleteArtChapter,
  DeleteCourseChapter,
  DeleteEbookChapter,
  DeleteMusicTrack,
  DeletPodcastEpisode,
  GetMarketPlaceMoods,
  GetPreviewProduct,
  UpdateArtProduct,
  UpdateCourseProduct,
  UpdateEbookProduct,
  UpdateMusicProduct,
  UpdatePodcastProduct,
  UpdateProductStatus,
  UpdateVideoProduct,
  UploadProductDocument,
  UploadProductThumbnail,
} from "../Common/ServerAPI";
import SampleTrackUpload from "../components/MarketPlace/SampleTrackUpload";
import AIModal from "../components/MarketPlace/AIModal";
import CustomRichTextEditor from "../components/sections/bestPractiseHub/CustomRichTextEditor";

// Breadcrumb Component
const Breadcrumb: React.FC<{ category: string }> = ({ category }) => (
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
      <li className="text-gray-500">Edit {category}</li>
    </ol>
  </nav>
);

// Form Section Component
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

// Input Field Component
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
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

// Helper Functions
const getAcceptedFileTypes = (category: string) => {
  switch (category) {
    case "music":
    case "podcast":
      return "audio/*";
    case "ebook":
      return ".pdf,.epub,.mobi,.azw3,.txt";
    case "course":
      return "video/*,audio/*,image/*,.pdf";
    case "art":
      return "image/*,.pdf,.zip";
    default:
      return "*";
  }
};

const getFileTypeDescription = (category: string) => {
  switch (category) {
    case "music":
      return "MP3, WAV, FLAC (max 50 MB)";
    case "podcast":
      return "MP3, WAV, AAC (max 50 MB)";
    case "ebook":
      return "PDF, EPUB, MOBI (max 50 MB)";
    case "course":
      return "Videos, audios, PDFs, images (max 100 MB)";
    case "art":
      return "JPG, PNG, SVG, WEBP, PDF, ZIP (max 100 MB)";
    default:
      return "Supported files (max 100 MB)";
  }
};

const getFileType = (fileName: string): "video" | "audio" | "image" | "pdf" => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["mp4", "mov", "avi", "mkv", "wmv", "webm"].includes(ext || ""))
    return "video";
  if (["mp3", "wav", "aac", "flac", "ogg"].includes(ext || "")) return "audio";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
    return "image";
  if (ext === "pdf") return "pdf";
  return "video";
};

const getFileIcon = (category: string, fileType?: string) => {
  if (category === "course") {
    switch (fileType) {
      case "video":
        return <Video className="w-5 h-5 text-[#242E3A]" />;
      case "audio":
        return <Music className="w-5 h-5 text-[#242E3A]" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-[#242E3A]" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-[#242E3A]" />;
      default:
        return <Video className="w-5 h-5 text-[#242E3A]" />;
    }
  }

  switch (category) {
    case "music":
    case "podcast":
      return <Music className="w-5 h-5 text-[#242E3A]" />;
    case "ebook":
      return <Book className="w-5 h-5 text-[#242E3A]" />;
    case "art":
      return fileType?.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
        <ImageIcon className="w-5 h-5 text-[#242E3A]" />
      ) : (
        <FileText className="w-5 h-5 text-[#242E3A]" />
      );
    default:
      return <FileText className="w-5 h-5 text-[#242E3A]" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getContentItemLabel = (category: string) => {
  switch (category) {
    case "music":
      return "Track";
    case "podcast":
      return "Episode";
    case "ebook":
      return "Chapter";
    case "course":
      return "Lesson";
    case "art":
      return "Collection";
    default:
      return "Item";
  }
};

// Type definitions for content items
interface TrackFile {
  url: string;
  title: string;
  order_number: number;
  file?: File;
  isUploading?: boolean;
  isEditing?: boolean;
}

interface Track {
  id: number;
  track_id?: string;
  title: string;
  delete_files: any;
  track_files: TrackFile[];
  order_number: number;
}

interface EpisodeFile {
  url: string;
  title: string;
  order_number: number;
  file?: File;
  isUploading?: boolean;
  isEditing?: boolean;
}

interface Episode {
  id: number;
  episode_id?: string;
  title: string;
  description?: string;
  duration?: string;
  is_free?: boolean;
  delete_files: any;
  episode_files: EpisodeFile[];
  order_number: number;
}

interface ChapterFile {
  url: string;
  title: string;
  order_number: number;
  file?: File;
  isUploading?: boolean;
  isEditing?: boolean;
}

interface Chapter {
  id: number;
  chapter_id?: string;
  title: string;
  description?: string;
  is_free?: boolean;
  delete_files: any;
  chapter_files: ChapterFile[];
  order_number: number;
}

interface LessonFile {
  url: string;
  title: string;
  order_number: number;
  file_type: "video" | "audio" | "image" | "pdf";
  file?: File;
  isUploading?: boolean;
  isEditing?: boolean;
}

interface Lesson {
  id: number;
  chapter_id?: string;
  title: string;
  delete_files: any;
  chapter_files: LessonFile[];
  order_number: number;
}

interface CollectionFile {
  url: string;
  title: string;
  order_number: number;
  file?: File;
  isUploading?: boolean;
  isEditing?: boolean;
}

interface Collection {
  id: number;
  chapter_id?: string;
  title: string;
  description?: string;
  is_free?: boolean;
  delete_files: any;
  chapter_files: CollectionFile[];
  order_number: number;
}

// Main Component
const EditSellerProductPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const productId = params?.productNo;
  const category = searchParams.get("category") || "video";
  const { showToast } = useToast();

  // UI States
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  // Data States
  const [moods, setMoods] = useState<any[]>([]);
  const [newHighlight, setNewHighlight] = useState("");

  const [showAIModal, setShowAIModal] = useState(false);
  const [sampleTrackUrl, setSampleTrackUrl] = useState("");

  // Thumbnail States (for non-video categories)
  const [thumbnailData, setThumbnailData] = useState<{
    thumbnail_url: string;
    public_id: string;
  } | null>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);

  // Video States (for video category)
  // const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  // const [shortVideoFile, setShortVideoFile] = useState<File | null>(null);
  const [mainVideoPreview, setMainVideoPreview] = useState("");
  const [shortVideoPreview, setShortVideoPreview] = useState("");
  const [isMainVideoUploading, setIsMainVideoUploading] = useState(false);
  const [isShortVideoUploading, setIsShortVideoUploading] = useState(false);

  // Content Items States
  const [contentItems, setContentItems] = useState<
    (Track | Episode | Chapter | Lesson | Collection)[]
  >([]);
  console.log("contentItems", contentItems);
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());

  // Form Data State (dynamic based on category)
  const [formData, setFormData] = useState<any>({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    overview: "",
    highlights: [] as string[],
    language: "",
    thumbnail_url: "",
    // Video specific
    video_url: "",
    duration: "",
    short_video_url: "",
    summary: "",
    // Music/Podcast specific
    total_duration: "",
    format: "",
    theme: "",
    // Ebook specific
    author: "",
    pages: 0,
    // Course specific
    storytelling: "",
    requirements: "",
    // Art specific
    mediums: "",
    modern_trends: "",
  });

  // Fetch Product Data on Mount
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      setIsFetchingData(true);
      try {
        const response = await GetPreviewProduct(category, productId);
        const productData = response?.data?.data;

        if (productData) {
          // Common fields
          const commonData: any = {
            product_title: productData.product_title || "",
            price: parseFloat(
              productData.original_price || productData.price || "0"
            ),
            discount_percentage: parseFloat(
              productData.discount_percentage || "0"
            ),
            mood_id:
              category === "ebook"
                ? productData?.mood?.id || ""
                : productData.mood_id || "",
            overview: productData.overview || "",
            highlights: productData.highlights || [],
            language: productData.language || "",
          };

          // Category-specific fields
          if (category === "video") {
            commonData.video_url =
              productData.video_details?.video_files?.[0] || "";
            commonData.thumbnail_url =
              productData.video_details?.thumbnail_url || "";
            commonData.duration = productData.video_details?.duration || "";
            commonData.short_video_url =
              productData.video_details?.short_preview_video_url || "";
            commonData.summary =
              productData.video_details?.summary_of_storytelling || "";

            setMainVideoPreview(
              productData.video_details?.main_video?.thumbnail || ""
            );
            setShortVideoPreview(
              productData.video_details?.short_video?.thumbnail || ""
            );
          } else {
            // Non-video categories have thumbnail
            commonData.thumbnail_url = productData.thumbnail_url || "";
            if (productData.thumbnail_url) {
              setThumbnailData({
                thumbnail_url: productData.thumbnail_url,
                public_id: productData.public_id || "",
              });
            }

            // Music/Podcast specific
            if (category === "music" || category === "podcast") {
              commonData.total_duration =
                productData.music_details?.total_duration ||
                productData.podcast_details?.total_duration ||
                "";
              commonData.format =
                productData.music_details?.format ||
                productData.podcast_details?.format ||
                "";
              commonData.theme =
                productData.music_details?.theme ||
                productData.podcast_details?.theme ||
                "";
              commonData.sample_track_url =
                productData.music_details?.sample_track_url ||
                productData.podcast_details?.sample_track_url ||
                "";
            }

            // Ebook specific
            if (category === "ebook") {
              commonData.author = productData.ebook_details?.author || "";
              commonData.pages = parseInt(
                productData.ebook_details?.pages || "0"
              );
              commonData.format = productData.ebook_details?.format || "";
              commonData.theme = productData.ebook_details?.theme || "";
            }

            // Course specific
            if (category === "course") {
              commonData.storytelling =
                productData.course_details?.storytelling || "";
              commonData.duration = productData.course_details?.duration || "";
              commonData.requirements =
                productData.course_details?.requirements || "";
              commonData.format = productData.course_details?.format || "video";
              commonData.theme = productData.course_details?.theme || "";
            }

            // Art specific
            if (category === "art") {
              commonData.mediums = productData.arts_details?.mediums || "";
              commonData.modern_trends =
                productData.arts_details?.modern_trends || "";
              commonData.theme = productData.arts_details?.theme || "";
            }

            // Load content items (tracks, episodes, chapters, lessons, collections)
            let items: any[] = [];

            if (
              category === "music" &&
              productData.content_items &&
              productData.content_items.length > 0
            ) {
              items = productData?.content_items?.map(
                (item: any, index: number) => ({
                  id: item.id,
                  track_id: item.id,
                  title: item.title || `Track ${index + 1}`,
                  description: item.description || "",
                  duration: item.duration || "00:00",
                  order_number: item.order_number || index + 1,
                  is_free: item.is_free || false,
                  track_files:
                    item.files?.map((file: any) => ({
                      file_id: file.id,
                      url: file.file_url,
                      title: file.title,
                      order_number: file.order_number,
                      file_type: file.file_type,
                      duration: file.duration,
                      format: file.format,
                      is_free: file.is_free,
                    })) || [],
                })
              );
            } else if (
              category === "podcast" &&
              productData.content_items &&
              productData.content_items.length > 0
            ) {
              items = productData.content_items.map(
                (item: any, index: number) => ({
                  id: item.id,
                  episode_id: item.id,
                  title: item.title || `Episode ${index + 1}`,
                  description: item.description || "",
                  duration: item.duration || "",
                  order_number: item.order_number || index + 1,
                  is_free: item.is_free || false,
                  episode_files:
                    item.files?.map((file: any) => ({
                      file_id: file.id,
                      url: file.url,
                      title: file.title,
                      order_number: file.order_number,
                    })) || [],
                })
              );
            } else if (
              category === "ebook" &&
              productData.content_items &&
              productData.content_items.length > 0
            ) {
              items = productData.content_items.map(
                (chapter: any, index: number) => ({
                  id: chapter.id,
                  chapter_id: chapter.id,
                  title: chapter.title || `Chapter ${index + 1}`,
                  chapter_files:
                    chapter.files?.map((file: any) => ({
                      file_id: file.id,
                      url: file.url,
                      title: file.title,
                      order_number: file.order_number,
                    })) || [],
                  description: chapter.description || "",
                  order_number: chapter.order_number || index + 1,
                  is_free: chapter.is_free || false,
                })
              );
            } else if (
              category === "course" &&
              productData.content_items &&
              productData.content_items.length > 0
            ) {
              items = productData.content_items.map(
                (lesson: any, index: number) => ({
                  id: lesson.id,
                  chapter_id: lesson.id,
                  title: lesson.title || `Lesson ${index + 1}`,
                  order_number: lesson.order_number || index + 1,
                  chapter_files:
                    lesson.files?.map((file: any) => ({
                      file_id: file.id,
                      url: file.url,
                      title: file.title,
                      order_number: file.order_number,
                      file_type: file.file_type || "video",
                    })) || [],
                })
              );
            } else if (
              category === "art" &&
              productData.content_items &&
              productData.content_items.length > 0
            ) {
              items = productData.content_items.map(
                (collection: any, index: number) => ({
                  id: collection.id,
                  chapter_id: collection.id,
                  title: collection.title || `Collection ${index + 1}`,
                  description: collection.description || "",
                  order_number: collection.order_number || index + 1,
                  is_free: collection.is_free || false,
                  chapter_files:
                    collection.files?.map((file: any) => ({
                      file_id: file.id,
                      url: file.url,
                      title: file.title,
                      order_number: file.order_number,
                    })) || [],
                })
              );
            }

            setContentItems(items);
          }
          setSampleTrackUrl(commonData?.sample_track_url || "");
          setFormData(commonData);
        }
      } catch (error: any) {
        showToast({
          message:
            error?.response?.data?.error?.message ||
            "Failed to load product data.",
          type: "error",
          duration: 3000,
        });
        navigate("/dashboard/products");
      } finally {
        setIsFetchingData(false);
      }
    };

    if (productId && category) {
      fetchProductData();
    }
  }, [productId, category]);

  // Fetch Moods
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

  const handleAIGenerate = (generatedText: string) => {
    setFormData((prev: any) => ({
      ...prev,
      overview: generatedText,
    }));

    if (errors.overview) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.overview;
        return newErrors;
      });
    }
  };

  const handleSampleTrackUpload = (sampleUrl: string) => {
    setSampleTrackUrl(sampleUrl);
  };

  const handleRemoveSampleTrack = () => {
    console.log("Removing sample track");
    setSampleTrackUrl("");
  };

  // Thumbnail Upload Handler (for non-video categories) - UPLOADS ON CHANGE
  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        message: "Please upload an image file",
        type: "error",
        duration: 3000,
      });
      return;
    }

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

      // Remove old thumbnail and store new one
      setThumbnailData({
        thumbnail_url: thumbnailUrl,
        public_id: publicId,
      });

      setFormData((prev: any) => ({
        ...prev,
        thumbnail_url: thumbnailUrl,
      }));

      showToast({
        message: "Thumbnail uploaded successfully",
        type: "success",
        duration: 2000,
      });

      if (errors.thumbnail_url) {
        setErrors((prev) => ({ ...prev, thumbnail_url: "" }));
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to upload thumbnail",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsThumbnailUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailData(null);
    setFormData((prev: any) => ({
      ...prev,
      thumbnail_url: "",
    }));
  };

  // Main Video Upload Handler (for video category) - UPLOADS ON CHANGE
  const handleMainVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    if (file.size > 500 * 1024 * 1024) {
      showToast({
        message: "Video size should be less than 500MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsMainVideoUploading(true);
    const videoURL = URL.createObjectURL(file);
    setMainVideoPreview(videoURL);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("video", file);

      const response = await UploadProductDocument(
        "main-video",
        uploadFormData
      );
      const videoData = response?.data?.data?.data;

      setFormData((prev: any) => ({
        ...prev,
        video_url: videoData?.video_id,
        thumbnail_url: videoData?.thumbnail,
      }));

      showToast({
        message: "Main video uploaded successfully",
        type: "success",
        duration: 2000,
      });

      if (errors.video_url) {
        setErrors((prev) => ({ ...prev, video_url: "" }));
      }
    } catch (error: any) {
      setMainVideoPreview("");
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to upload main video",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsMainVideoUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveMainVideo = () => {
    setMainVideoPreview("");
    setFormData((prev: any) => ({
      ...prev,
      video_url: "",
      thumbnail_url: "",
    }));
  };

  // Short Video Upload Handler (for video category) - UPLOADS ON CHANGE
  const handleShortVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        message: "Short video size should be less than 100MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsShortVideoUploading(true);
    const videoURL = URL.createObjectURL(file);
    setShortVideoPreview(videoURL);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("short_video", file);

      const response = await UploadProductDocument(
        "short-video",
        uploadFormData
      );
      const videoData = response?.data?.data;

      setFormData((prev: any) => ({
        ...prev,
        short_video_url: videoData?.video_id,
      }));

      showToast({
        message: "Short video uploaded successfully",
        type: "success",
        duration: 2000,
      });
    } catch (error: any) {
      setShortVideoPreview("");
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to upload short video",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsShortVideoUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveShortVideo = () => {
    setShortVideoPreview("");
    setFormData((prev: any) => ({
      ...prev,
      short_video_url: "",
    }));
  };

  // File Upload Handler for Content Items - UPLOADS ON CHANGE
  const handleContentFileUpload = async (itemId: number, file: File) => {
    if (!file) return;

    // Validate file based on category
    let maxSize = 100 * 1024 * 1024; // 100MB default
    let validTypes: string[] = [];

    switch (category) {
      case "music":
      case "podcast":
        validTypes = [
          "audio/mpeg",
          "audio/mp3",
          "audio/wav",
          "audio/aac",
          "audio/flac",
          "audio/ogg",
        ];
        maxSize = 50 * 1024 * 1024;
        break;
      case "ebook":
        validTypes = [".pdf", ".epub", ".mobi", ".azw3", ".txt"];
        maxSize = 50 * 1024 * 1024;
        break;
      case "course":
        validTypes = ["video/*", "audio/*", "image/*", "application/pdf"];
        maxSize = 100 * 1024 * 1024;
        break;
      case "art":
        validTypes = ["image/*", "application/pdf", "application/zip"];
        maxSize = 100 * 1024 * 1024;
        break;
    }

    if (!validTypes) {
      showToast({
        message: `Invalid file type. Please select a valid file type.`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (file.size > maxSize) {
      showToast({
        message: `File size should be less than ${maxSize / (1024 * 1024)}MB`,
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Create temp file with uploading state
    const fileType = category === "course" ? getFileType(file.name) : undefined;
    const tempFile: any = {
      url: "",
      title: file.name,
      order_number: 0,
      file: file,
      isUploading: true,
      isEditing: false,
      ...(fileType && { file_type: fileType }),
    };

    // Add temp file to the content item
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const fileArray = getFileArray(item);
          return {
            ...item,
            ...(category === "music" && {
              track_files: [...fileArray, tempFile],
            }),
            ...(category === "podcast" && {
              episode_files: [...fileArray, tempFile],
            }),
            ...(category === "ebook" && {
              chapter_files: [...fileArray, tempFile],
            }),
            ...(category === "course" && {
              chapter_files: [...fileArray, tempFile],
            }),
            ...(category === "art" && {
              chapter_files: [...fileArray, tempFile],
            }),
          };
        }
        return item;
      })
    );

    try {
      const uploadFormData = new FormData();
      let uploadKey = "";
      let uploadType = "";

      // Set upload key based on category
      switch (category) {
        case "music":
          uploadKey = "track";
          uploadType = "music-track";
          break;
        case "podcast":
          uploadKey = "audio";
          uploadType = "podcast-audio";
          break;
        case "ebook":
          uploadKey = "chapter_pdf";
          uploadType = "ebook-chapter";
          break;
        case "course":
          uploadKey = "chapter_file";
          uploadType = "course-chapter";
          break;
        case "art":
          uploadKey = "chapter_file";
          uploadType = "art-chapter";
          break;
      }

      uploadFormData.append(uploadKey, file);

      const response = await UploadProductDocument(uploadType, uploadFormData);
      const uploadData = response?.data?.data;

      // Extract URL based on response structure
      let uploadedUrl = "";
      if (category === "course" && fileType === "video") {
        uploadedUrl = uploadData?.video_id || "";
      } else if (category === "music") {
        uploadedUrl = uploadData?.track_public_id || "";
      } else if (category === "podcast") {
        uploadedUrl = uploadData?.audio_public_id || "";
      } else if (category === "ebook") {
        uploadedUrl = uploadData?.chapter_pdf_public_id || "";
      } else if (category === "art") {
        uploadedUrl = uploadData?.chapter_file_public_id || "";
      } else {
        uploadedUrl =
          uploadData?.data?.document_url || uploadData?.chapter_file_url || "";
      }

      // Update the file with uploaded URL
      setContentItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const fileArray = getFileArray(item);
            const updatedFiles = fileArray.map((f: any) =>
              f.file === file
                ? {
                  ...f,
                  url: uploadedUrl,
                  order_number: fileArray.length - 1,
                  isUploading: false,
                }
                : f
            );

            return {
              ...item,
              ...(category === "music" && { track_files: updatedFiles }),
              ...(category === "podcast" && { episode_files: updatedFiles }),
              ...(category === "ebook" && { chapter_files: updatedFiles }),
              ...(category === "course" && { chapter_files: updatedFiles }),
              ...(category === "art" && { chapter_files: updatedFiles }),
            };
          }
          return item;
        })
      );

      showToast({
        message: "File uploaded successfully",
        type: "success",
        duration: 2000,
      });

      // Clear error for this item
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`item_${itemId}`];
        return newErrors;
      });
    } catch (error: any) {
      // Remove temp file on error
      setContentItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            const fileArray = getFileArray(item);
            const filteredFiles = fileArray.filter((f: any) => f.file !== file);

            return {
              ...item,
              ...(category === "music" && { track_files: filteredFiles }),
              ...(category === "podcast" && { episode_files: filteredFiles }),
              ...(category === "ebook" && { chapter_files: filteredFiles }),
              ...(category === "course" && { chapter_files: filteredFiles }),
              ...(category === "art" && { chapter_files: filteredFiles }),
            };
          }
          return item;
        })
      );

      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to upload file",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle multiple files upload
  const handleAddFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: number
  ) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      await handleContentFileUpload(itemId, file);
    }

    e.target.value = "";
  };

  // Helper to get file array from content item
  const getFileArray = (item: any) => {
    if (item.track_files) return item.track_files;
    if (item.episode_files) return item.episode_files;
    if (item.chapter_files) return item.chapter_files;
    return [];
  };

  // File name edit handlers
  const toggleEditFile = (itemId: number, fileId: number) => {
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const fileArray = getFileArray(item);
          const updatedFiles = fileArray.map((f: any) => ({
            ...f,
            isEditing: f.file_id === fileId ? !f.isEditing : f.isEditing,
          }));

          return {
            ...item,
            ...(category === "music" && { track_files: updatedFiles }),
            ...(category === "podcast" && { episode_files: updatedFiles }),
            ...(category === "ebook" && { chapter_files: updatedFiles }),
            ...(category === "course" && { chapter_files: updatedFiles }),
            ...(category === "art" && { chapter_files: updatedFiles }),
          };
        }
        return item;
      })
    );
  };

  const handleEditFileName = (
    itemId: number,
    fileId: string,
    newTitle: string
  ) => {
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const fileArray = getFileArray(item);
          const updatedFiles = fileArray.map((f: any) =>
            f.file_id === fileId ? { ...f, title: newTitle } : f
          );

          return {
            ...item,
            ...(category === "music" && { track_files: updatedFiles }),
            ...(category === "podcast" && { episode_files: updatedFiles }),
            ...(category === "ebook" && { chapter_files: updatedFiles }),
            ...(category === "course" && { chapter_files: updatedFiles }),
            ...(category === "art" && { chapter_files: updatedFiles }),
          };
        }
        return item;
      })
    );
  };

  const saveFileName = (itemId: string, fileId: string) => {
    setContentItems((prevItems) =>
      prevItems.map((item: any) => {
        if (item.id === itemId) {
          const fileArray = getFileArray(item);
          const updatedFiles = fileArray.map((f: any) =>
            f.file_id === fileId ? { ...f, isEditing: false } : f
          );

          return {
            ...item,
            ...(category === "music" && { track_files: updatedFiles }),
            ...(category === "podcast" && { episode_files: updatedFiles }),
            ...(category === "ebook" && { chapter_files: updatedFiles }),
            ...(category === "course" && { chapter_files: updatedFiles }),
            ...(category === "art" && { chapter_files: updatedFiles }),
          };
        }
        return item;
      })
    );

    showToast({
      message: "File name updated",
      type: "success",
      duration: 2000,
    });
  };

  // Delete file handler
  const deleteFile = (itemId: number, fileId: string) => {
    setContentItems((prevItems) =>
      prevItems.map((item) => {
        console.log("item.id, itemId", item?.delete_files, itemId);
        if (item.id === itemId) {
          const fileArray = getFileArray(item);
          const deletedFile = fileArray.find((f: any) => f.file_id === fileId);
          const filteredFiles = fileArray.filter(
            (f: any) => f.file_id !== fileId
          );

          return {
            ...item,

            ...(category === "music" && { track_files: filteredFiles }),
            ...(category === "podcast" && { episode_files: filteredFiles }),
            ...(category === "ebook" && { chapter_files: filteredFiles }),
            ...(category === "course" && { chapter_files: filteredFiles }),
            ...(category === "art" && { chapter_files: filteredFiles }),
            delete_files: [...(item.delete_files || []), deletedFile?.file_id],
          };
        }
        console.log("item", item);
        return item;
      })
    );

    showToast({
      message: "File removed successfully",
      type: "success",
      duration: 2000,
    });
  };

  // Add new content item handler
  const handleAddContentItem = () => {
    const newId = Date.now();
    const newOrderNumber = contentItems.length;

    let newItem: any;

    switch (category) {
      case "music":
        newItem = {
          id: newId,
          title: `Track ${contentItems.length + 1}`,
          track_files: [],
          order_number: newOrderNumber,
        };
        break;
      case "podcast":
        newItem = {
          id: newId,
          title: `Episode ${contentItems.length + 1}`,
          // description: "",
          // duration: "",
          // is_free: false,
          episode_files: [],
          // order_number: newOrderNumber,
        };
        break;
      case "ebook":
        newItem = {
          id: newId,
          title: `Chapter ${contentItems.length + 1}`,
          description: "",
          is_free: false,
          chapter_files: [],
          order_number: newOrderNumber,
        };
        break;
      case "course":
        newItem = {
          id: newId,
          title: `Lesson ${contentItems.length + 1}`,
          chapter_files: [],
          // order_number: newOrderNumber,
        };
        break;
      case "art":
        newItem = {
          id: newId,
          title: `Collection ${contentItems.length + 1}`,
          // description: "",
          // is_free: false,
          chapter_files: [],
          // order_number: newOrderNumber,
        };
        break;
      default:
        return;
    }

    setContentItems((prev) => [...prev, newItem]);
  };

  // Delete content item handler (calls API if it has ID)
  const handleDeleteContentItem = async (item: any) => {
    const itemId = item.track_id || item.episode_id || item.chapter_id;

    // If item has server ID, call delete API
    if (itemId) {
      setDeletingItems((prev) => new Set(prev).add(itemId));

      try {
        let deletePromise;

        switch (category) {
          case "music":
            deletePromise = DeleteMusicTrack(productId, itemId);
            break;
          case "podcast":
            deletePromise = DeletPodcastEpisode(productId, itemId);
            break;
          case "ebook":
            deletePromise = DeleteEbookChapter(productId, itemId);
            break;
          case "course":
            deletePromise = DeleteCourseChapter(productId, itemId);
            break;
          case "art":
            deletePromise = DeleteArtChapter(productId, itemId);
            break;
          default:
            throw new Error("Invalid category");
        }

        await deletePromise;

        showToast({
          message: `${getContentItemLabel(category)} deleted successfully`,
          type: "success",
          duration: 2000,
        });

        // Remove from state
        setContentItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch (error: any) {
        showToast({
          message:
            error?.response?.data?.error?.message ||
            `Failed to delete ${getContentItemLabel(category).toLowerCase()}`,
          type: "error",
          duration: 3000,
        });
      } finally {
        setDeletingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    } else {
      // Item not saved yet, just remove from state
      setContentItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast({
        message: `${getContentItemLabel(category)} removed`,
        type: "success",
        duration: 2000,
      });
    }
  };

  // Common form handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Highlights handlers
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

      setFormData((prev: any) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");

      if (errors.highlights) {
        setErrors((prev) => ({ ...prev, highlights: "" }));
      }
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      highlights: prev.highlights.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleEditHighlight = (index: number, newValue: string) => {
    setFormData((prev: any) => ({
      ...prev,
      highlights: prev.highlights.map((h: any, i: number) =>
        i === index ? newValue : h
      ),
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Common validations
    if (!formData.product_title.trim())
      newErrors.product_title = "Product title is required.";
    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (isNaN(formData.discount_percentage)) {
      newErrors.discount_percentage = "Discount percentage must be a number.";
    } else if (
      formData.discount_percentage < 0 ||
      formData.discount_percentage > 100
    ) {
      newErrors.discount_percentage =
        "Discount percentage must be between 0 and 100.";
    }
    if (!formData.mood_id.trim())
      newErrors.mood_id = "Mood Selection is required.";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required.";

    if (formData.highlights.length === 0) {
      newErrors.highlights = "At least one highlight is required.";
    }

    // Category-specific validations
    if (category === "video") {
      if (!formData.video_url && !mainVideoPreview)
        newErrors.video_url = "Main video is required.";
      if (formData.duration && !/^\d{2}:\d{2}:\d{2}$/.test(formData.duration)) {
        newErrors.duration =
          "Duration must be in HH:MM:SS format (e.g., 01:10:00)";
      }
      if (!formData.summary?.trim()) newErrors.summary = "Summary is required.";
    } else {
      // Non-video categories need thumbnail
      if (!formData.thumbnail_url && !thumbnailData?.thumbnail_url) {
        newErrors.thumbnail_url = "Thumbnail is required.";
      }

      // Validate content items
      if (contentItems.length === 0) {
        newErrors.contentItems = `At least one ${getContentItemLabel(
          category
        ).toLowerCase()} is required.`;
      } else {
        contentItems.forEach((item, index) => {
          const fileArray = getFileArray(item);
          if (fileArray.length === 0) {
            newErrors[
              `item_${index}`
            ] = `Please upload at least one file for ${item.title}`;
          }
        });
      }

      // Music/Podcast specific
      if (category === "music" || category === "podcast") {
        if (
          formData.total_duration &&
          !/^\d{2}:\d{2}:\d{2}$/.test(formData.total_duration)
        ) {
          newErrors.total_duration =
            "Total duration must be in HH:MM:SS format (e.g., 30:00:00)";
        }
      }

      // Ebook specific
      if (category === "ebook") {
        if (!formData.author?.trim()) newErrors.author = "Author is required.";
        if (!formData.pages || formData.pages <= 0)
          newErrors.pages = "Pages must be a positive number.";
      }

      // Course specific
      if (category === "course") {
        if (!formData.duration?.trim())
          newErrors.duration = "Duration is required.";
      }
    }

    if (!formData.language?.trim())
      newErrors.language = "Language is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".text-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  // Prepare payload based on category
  const preparePayload = () => {
    const basePayload: any = {
      product_title: formData.product_title,
      price: formData.price,
      discount_percentage: formData.discount_percentage,
      overview: formData.overview,
      highlights: formData.highlights,
      language: formData.language,
    };
    console.log("sampleTrackUrl", sampleTrackUrl);
    basePayload.sample_track_url = sampleTrackUrl;
    // if (sampleTrackUrl) {
    //   basePayload.sample_track_url = sampleTrackUrl;
    // }

    // Category-specific payload preparation
    if (category === "video") {
      return {
        ...basePayload,
        video_url: formData.video_url,
        thumbnail_url: formData.thumbnail_url,
        duration: formData.duration,
        summary: formData.summary,
        short_video_url: formData.short_video_url || "",
      };
    } else if (category === "music") {
      console.log("contentItems sfdgdf", contentItems);
      const tracks = contentItems.map((item: any, index) => ({
        track_id: item.track_id,
        title: item.title,
        description: "",
        duration: "",
        order_number: index + 1,
        delete_files: item.delete_files || [],
        track_files: item.track_files
          .filter((f: any) => f.url)
          .map((file: any, fileIndex: number) => ({
            file_id: file.file_id,
            url: file.url,
            title: file.title,
            order_number: fileIndex + 1,
          })),
      }));

      return {
        ...basePayload,
        thumbnail_url: formData.thumbnail_url,
        total_duration: formData.total_duration,
        format: formData.format,
        theme: formData.theme,
        tracks,
      };
    } else if (category === "podcast") {
      const episodes = contentItems.map((item: any) => ({
        episode_id: item.episode_id,
        title: item.title,
        // description: item.description || "",
        // duration: item.duration || "",
        // is_free: item.is_free || false,
        // order_number: index,
        episode_files: item.episode_files
          .filter((f: any) => f.url)
          .map((file: any, fileIndex: number) => ({
            file_id: file.file_id,
            url: file.url,
            title: file.title,
            order_number: fileIndex,
          })),
      }));

      return {
        ...basePayload,
        thumbnail_url: formData.thumbnail_url,
        total_duration: formData.total_duration,
        format: formData.format,
        theme: formData.theme,
        episodes,
      };
    } else if (category === "ebook") {
      const chapters = contentItems.map((item: any) => ({
        chapter_id: item.chapter_id,
        title: item.title,
        // description: item.description || "",
        // is_free: item.is_free || false,
        // order_number: index,
        chapter_files: item.chapter_files
          .filter((f: any) => f.url)
          .map((file: any, fileIndex: number) => ({
            file_id: file.file_id,
            url: file.url,
            title: file.title,
            order_number: fileIndex,
          })),
      }));

      return {
        ...basePayload,
        thumbnail_url: formData.thumbnail_url,
        author: formData.author,
        pages: formData.pages,
        format: formData.format,
        theme: formData.theme,
        chapters,
      };
    } else if (category === "course") {
      const chapters = contentItems.map((item: any) => ({
        chapter_id: item.chapter_id,
        title: item.title,
        // order_number: index,
        chapter_files: item.chapter_files
          .filter((f: any) => f.url)
          .map((file: any, fileIndex: number) => ({
            file_id: file.file_id,
            url: file.url,
            title: file.title,
            order_number: fileIndex + 1,
            file_type: file.file_type,
          })),
      }));

      return {
        ...basePayload,
        thumbnail_url: formData.thumbnail_url,
        storytelling: formData.storytelling || "",
        duration: formData.duration,
        requirements: formData.requirements || "",
        format: formData.format,
        theme: formData.theme,
        chapters,
      };
    } else if (category === "art") {
      const chapters = contentItems.map((item: any, index) => ({
        chapter_id: item.chapter_id,
        title: item.title,
        description: item.description || "",
        is_free: item.is_free || false,
        order_number: index,
        chapter_files: item.chapter_files
          .filter((f: any) => f.url)
          .map((file: any, fileIndex: number) => ({
            file_id: file.file_id,
            url: file.url,
            title: file.title,
            order_number: fileIndex,
          })),
      }));

      return {
        ...basePayload,
        thumbnail_url: formData.thumbnail_url,
        mediums: formData.mediums || "",
        modern_trends: formData.modern_trends || "",
        theme: formData.theme,
        chapters,
      };
    }

    return basePayload;
  };

  // Main submit handler
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
      // Prepare the payload
      const payload = preparePayload();
      console.log("payload dfsdfsdsdfsf", payload);
      // Update product based on category
      let updatePromise;
      switch (category) {
        case "video":
          updatePromise = UpdateVideoProduct(payload, productId);
          break;
        case "music":
          updatePromise = UpdateMusicProduct(payload, productId);
          break;
        case "podcast":
          updatePromise = UpdatePodcastProduct(payload, productId);
          break;
        case "ebook":
          updatePromise = UpdateEbookProduct(payload, productId);
          break;
        case "course":
          updatePromise = UpdateCourseProduct(payload, productId);
          break;
        case "art":
          updatePromise = UpdateArtProduct(payload, productId);
          break;
        default:
          throw new Error("Invalid category");
      }

      await updatePromise;

      // Update product status
      const status = isDraft ? "draft" : "published";
      await UpdateProductStatus({ status }, productId);

      showToast({
        message: isDraft
          ? "Product saved as draft successfully"
          : "Product updated successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      // Navigate based on action
      if (isDraft) {
        // Navigate to preview page for draft
        if (category === "video") {
          navigate(
            `/dashboard/products/preview/${productId}?category=${category}`
          );
        } else if (category === "music") {
          navigate(
            `/dashboard/products/music-preview/${productId}?category=${category}`
          );
        } else if (category === "podcast") {
          navigate(
            `/dashboard/products/podcast-preview/${productId}?category=${category}`
          );
        } else if (category === "ebook") {
          navigate(
            `/dashboard/products/ebook-preview/${productId}?category=${category}`
          );
        } else if (category === "course") {
          navigate(
            `/dashboard/products/course-preview/${productId}?category=${category}`
          );
        } else if (category === "art") {
          navigate(
            `/dashboard/products/art-preview/${productId}?category=${category}`
          );
        } else {
          navigate(
            `/dashboard/products/preview/${productId}?category=${category}`
          );
        }
      } else {
        // Navigate to products list for published
        navigate("/dashboard/products");
      }
    } catch (error: any) {
      showToast({
        message:
          error?.message ||
          error?.response?.data?.error?.message ||
          "Failed to update product",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleOverviewChange = (content: string) => {
    setFormData((prev: any) => ({ ...prev, overview: content }));

    // Clear error when content is added
    if (errors.overview && content.replace(/<[^>]*>/g, "").trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.overview;
        return newErrors;
      });
    }
  };

  return (
    <>
      <div
        className="min-h-screen py-1 font-poppins"
        style={{ fontFamily: "Poppins" }}
      >
        <Breadcrumb category={category} />
        <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
          {/* Basic Info Section */}
          <FormSection
            title={`Edit ${category.charAt(0).toUpperCase() + category.slice(1)
              }`}
            description="Update your digital product details, pricing, and availability on the marketplace."
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
                placeholder="Enter the $ amount"
                name="price"
                type="number"
                value={formData.price === 0 ? "" : formData.price.toString()}
                onChange={handleChange}
                error={errors.price}
                required
              />
              <InputField
                label="Discount in %"
                placeholder="Enter discount in %"
                name="discount_percentage"
                type="number"
                value={
                  formData.discount_percentage === 0
                    ? ""
                    : formData.discount_percentage.toString()
                }
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
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent cursor-pointer"
                >
                  <option value="">Select Mood</option>
                  {moods?.map((mood: any) => (
                    <option key={mood.id} value={mood.id}>
                      {mood.name}
                    </option>
                  ))}
                </select>
                {errors.mood_id && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.mood_id}
                  </span>
                )}
              </div>
            </div>

            {/* Video Category - Main Video Upload */}
            {category === "video" && (
              <div className="mt-8">
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Upload Video <span className="text-red-500">*</span>
                </label>
                {mainVideoPreview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <video
                      src={mainVideoPreview}
                      className="w-full h-64 object-cover"
                      controls
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMainVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                      title="Remove Main Video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 rounded-full p-4">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label
                    className={`relative flex flex-col items-center justify-center h-64 cursor-pointer rounded-lg p-6 text-center transition-all ${isMainVideoUploading
                        ? "pointer-events-none opacity-70"
                        : "bg-[#F9FAFB] hover:bg-[#EEF3FF]"
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
                        stroke={errors.video_url ? "#EF4444" : "#CBD5E1"}
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        fill="none"
                        className="transition-all duration-300 group-hover:stroke-[#7077FE]"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleMainVideoUpload}
                      disabled={isMainVideoUploading}
                    />
                    {isMainVideoUploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
                        <p className="text-sm text-[#7077FE]">
                          Uploading main video...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                          <img
                            src={uploadimg}
                            alt="Upload"
                            className="w-6 h-6"
                          />
                        </div>
                        <p className="text-sm font-[poppins] text-[#242E3A]">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-[#665B5B]">
                          MP4, MOV, AVI (max 500 MB)
                        </p>
                      </div>
                    )}
                  </label>
                )}
                {errors.video_url && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.video_url}
                  </span>
                )}
                {formData.video_url && !mainVideoPreview && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current video is uploaded. Upload a new one to replace it.
                  </p>
                )}
              </div>
            )}

            {/* Non-Video Categories - Thumbnail Upload */}
            {category !== "video" && (
              <div className="mt-8">
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
                    className={`relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center transition-all ${isThumbnailUploading
                        ? "pointer-events-none opacity-70"
                        : "bg-[#F9FAFB] hover:bg-[#EEF3FF]"
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
                        stroke={errors.thumbnail_url ? "#EF4444" : "#CBD5E1"}
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
                        <p className="text-sm text-[#7077FE]">
                          Uploading thumbnail...
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                          <img
                            src={uploadimg}
                            alt="Upload"
                            className="w-6 h-6"
                          />
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
                {errors.thumbnail_url && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.thumbnail_url}
                  </span>
                )}
              </div>
            )}
          </FormSection>

          {/* Details Section - All Categories */}
          <FormSection
            title="Details"
            description="Update detailed information about your product."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overview - All Categories */}
              {/* Overview - All Categories */}
              <div className={category === "video" ? "" : "lg:col-span-2"}>
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A]">
                    Overview <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAIModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition-all duration-300 group text-sm"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="font-medium">Generate with AI</span>
                    <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                  </button>
                </div>

                <CustomRichTextEditor
                  value={formData.overview}
                  onChange={handleOverviewChange}
                  onBlur={() => {
                    // Validate on blur
                    const overviewText = formData.overview
                      .replace(/<[^>]*>/g, "")
                      .trim();
                    if (!overviewText) {
                      setErrors((prev) => ({
                        ...prev,
                        overview: "Overview is required",
                      }));
                    }
                  }}
                  placeholder="Write a detailed overview or click 'Generate with AI'"
                  error={!!errors.overview}
                />

                {errors.overview && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.overview}
                  </span>
                )}
              </div>

              {/* Highlights - All Categories */}
              <div className={category === "video" ? "" : "lg:col-span-2"}>
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Highlights <span className="text-red-500">*</span> (Max 3)
                </label>
                <div className="space-y-3">
                  {formData?.highlights?.map(
                    (highlight: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 border border-gray-200 rounded-md bg-white"
                      >
                        <span className="text-[#7077FE] font-bold mt-1">•</span>
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) =>
                            handleEditHighlight(index, e.target.value)
                          }
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
                    )
                  )}

                  {formData.highlights.length < 3 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
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
                    Add up to 3 key highlights about your {category}
                  </p>
                </div>
                {errors.highlights && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.highlights}
                  </span>
                )}
              </div>

              {/* Video Category - Duration */}
              {category === "video" && (
                <InputField
                  label="Duration (HH:MM:SS)"
                  placeholder="e.g., 01:10:00"
                  name="duration"
                  value={formData.duration || ""}
                  onChange={handleChange}
                  error={errors.duration}
                />
              )}

              {/* Music & Podcast - Total Duration */}
              {(category === "music" || category === "podcast") && (
                <InputField
                  label="Total Duration (HH:MM:SS)"
                  placeholder="e.g., 30:00:00"
                  name="total_duration"
                  value={formData.total_duration || ""}
                  onChange={handleChange}
                  error={errors.total_duration}
                />
              )}

              {/* Ebook - Author */}
              {category === "ebook" && (
                <InputField
                  label="Author"
                  placeholder="Enter author name"
                  name="author"
                  value={formData.author || ""}
                  onChange={handleChange}
                  error={errors.author}
                  required
                />
              )}

              {/* Ebook - Pages */}
              {category === "ebook" && (
                <InputField
                  label="Pages"
                  placeholder="Enter number of pages"
                  name="pages"
                  type="number"
                  value={formData.pages === 0 ? "" : formData.pages.toString()}
                  onChange={handleChange}
                  error={errors.pages}
                  required
                />
              )}

              {/* Course - Duration */}
              {category === "course" && (
                <InputField
                  label="Duration"
                  placeholder="e.g., 10 hours"
                  name="duration"
                  value={formData.duration || ""}
                  onChange={handleChange}
                  error={errors.duration}
                  required
                />
              )}

              {/* Music/Podcast/Ebook - Format */}
              {(category === "music" || category === "podcast") && (
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Format
                  </label>
                  <select
                    name="format"
                    value={formData.format || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                  >
                    <option value="">Select Format</option>
                    <option value="MP3">MP3</option>
                    <option value="WAV">WAV</option>
                    <option value="AAC">AAC</option>
                    <option value="FLAC">FLAC</option>
                    <option value="OGG">OGG</option>
                  </select>
                </div>
              )}

              {category === "ebook" && (
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Format
                  </label>
                  <select
                    name="format"
                    value={formData.format || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                  >
                    <option value="">Select Format</option>
                    <option value="PDF">PDF</option>
                    <option value="EPUB">EPUB</option>
                    <option value="MOBI">MOBI</option>
                  </select>
                </div>
              )}

              {/* Course - Format */}
              {category === "course" && (
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Format
                  </label>
                  <select
                    name="format"
                    value={formData.format || "video"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                  >
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="text">Text</option>
                  </select>
                </div>
              )}

              {/* Music/Podcast/Ebook/Course - Theme */}
              {(category === "music" ||
                category === "podcast" ||
                category === "ebook" ||
                category === "course" ||
                category === "art") && (
                  <InputField
                    label="Theme"
                    placeholder="Describe the theme"
                    name="theme"
                    value={formData.theme || ""}
                    onChange={handleChange}
                    error={errors.theme}
                  />
                )}

              {/* Art - Mediums */}
              {category === "art" && (
                <InputField
                  label="Mediums"
                  placeholder="e.g., Oil, Watercolor"
                  name="mediums"
                  value={formData.mediums || ""}
                  onChange={handleChange}
                />
              )}

              {/* Art - Modern Trends */}
              {category === "art" && (
                <InputField
                  label="Modern Trends"
                  placeholder="e.g., Abstract, Contemporary"
                  name="modern_trends"
                  value={formData.modern_trends || ""}
                  onChange={handleChange}
                />
              )}

              {/* All Categories - Language */}
              <div>
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Language <span className="text-red-500">*</span>
                </label>
                <select
                  name="language"
                  value={formData.language || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                </select>
                {errors.language && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.language}
                  </span>
                )}
              </div>

              {/* Course - Storytelling (lg:col-span-2) */}
              {category === "course" && (
                <div className="lg:col-span-2">
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Storytelling
                  </label>
                  <textarea
                    name="storytelling"
                    value={formData.storytelling || ""}
                    onChange={handleChange}
                    placeholder="Describe the course narrative"
                    className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                  />
                </div>
              )}

              {/* Course - Requirements (lg:col-span-2) */}
              {category === "course" && (
                <div className="lg:col-span-2">
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements || ""}
                    onChange={handleChange}
                    placeholder="List course prerequisites"
                    className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                  />
                </div>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Sample Track (Optional)"
            description="Upload a preview sample so buyers can experience your content before purchasing."
          >
            <SampleTrackUpload
              productType="music"
              onUploadSuccess={handleSampleTrackUpload}
              onRemove={handleRemoveSampleTrack}
              defaultValue={sampleTrackUrl}
            />
          </FormSection>

          {/* Video-specific Storytelling Section */}
          {category === "video" && (
            <FormSection
              title="Storytelling"
              description="Update short video and description"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Short Video Upload */}
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Short Preview Video (Optional)
                  </label>
                  {shortVideoPreview ? (
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 h-40">
                      <video
                        src={shortVideoPreview}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveShortVideo}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                        title="Remove Short Video"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black bg-opacity-50 rounded-full p-4">
                          <svg
                            className="w-12 h-12 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label
                      className={`relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center transition-all ${isShortVideoUploading
                          ? "pointer-events-none opacity-70"
                          : "bg-[#F9FAFB] hover:bg-[#EEF3FF]"
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
                        accept="video/*"
                        className="hidden"
                        onChange={handleShortVideoUpload}
                        disabled={isShortVideoUploading}
                      />
                      {isShortVideoUploading ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
                          <p className="text-sm text-[#7077FE]">
                            Uploading short video...
                          </p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                            <Video className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-[poppins] text-[#242E3A]">
                            Upload Short Video
                          </p>
                          <p className="text-xs text-[#665B5B]">
                            MP4, MOV (max 100 MB)
                          </p>
                        </div>
                      )}
                    </label>
                  )}
                  {formData.short_video_url && !shortVideoPreview && (
                    <p className="text-sm text-gray-500 mt-2">
                      Current short video is uploaded. Upload a new one to
                      replace it.
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Summary of the video <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary || ""}
                    onChange={handleChange}
                    placeholder="Write a brief description of your storytelling"
                    className={`w-full h-40 px-3 py-2 border ${errors.summary ? "border-red-500" : "border-gray-200"
                      } rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]`}
                  />
                  {errors.summary && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.summary}
                    </span>
                  )}
                </div>
              </div>
            </FormSection>
          )}

          {/* Content Upload Section - Category Specific (Not for video) */}
          {category !== "video" && (
            <FormSection
              title={
                category === "music"
                  ? "Tracks"
                  : category === "podcast"
                    ? "Episodes"
                    : category === "ebook"
                      ? "Chapters"
                      : category === "course"
                        ? "Lessons"
                        : category === "art"
                          ? "Collections"
                          : "Content"
              }
              description={`Manage your ${category} content`}
            >
              <div className="space-y-6">
                {contentItems.map((item: any, itemIndex) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setContentItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id ? { ...i, title: newTitle } : i
                              )
                            );
                          }}
                          className="text-[16px] font-semibold text-[#242E3A] border-b border-transparent hover:border-gray-300 focus:border-[#7077FE] focus:outline-none mb-2 w-full"
                        />
                        <p className="text-sm text-[#665B5B]">
                          Upload {category} {itemIndex + 1} files
                        </p>
                      </div>

                      {contentItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteContentItem(item)}
                          disabled={deletingItems.has(
                            item.track_id || item.episode_id || item.chapter_id
                          )}
                          className="text-red-500 hover:text-red-700 transition-colors ml-4"
                          title={`Delete ${getContentItemLabel(category)}`}
                        >
                          {deletingItems.has(
                            item.track_id || item.episode_id || item.chapter_id
                          ) ? (
                            <span className="text-sm">Deleting...</span>
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Additional fields for podcast/ebook/art */}
                    {/* {(category === "podcast" ||
                      category === "ebook" ||
                      category === "art") && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-[#242E3A] mb-1">
                            Description
                          </label>
                          <textarea
                            value={item.description || ""}
                            onChange={(e) => {
                              const newDesc = e.target.value;
                              setContentItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id ? { ...i, description: newDesc } : i
                                )
                              );
                            }}
                            placeholder="Brief description"
                            className="w-full h-20 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE] text-sm"
                          />
                        </div>
                      )} */}

                    {/* Duration and Free checkbox for podcast */}
                    {/* {category === "podcast" && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-[#242E3A] mb-1">
                            Duration (HH:MM:SS)
                          </label>
                          <input
                            type="text"
                            value={item.duration || ""}
                            onChange={(e) => {
                              const newDur = e.target.value;
                              setContentItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id ? { ...i, duration: newDur } : i
                                )
                              );
                            }}
                            placeholder="00:45:30"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] text-sm"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.is_free || false}
                              onChange={(e) => {
                                setContentItems((prev) =>
                                  prev.map((i) =>
                                    i.id === item.id
                                      ? { ...i, is_free: e.target.checked }
                                      : i
                                  )
                                );
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                            />
                            <span className="text-sm text-[#242E3A]">
                              Free Episode
                            </span>
                          </label>
                        </div>
                      </div>
                    )} */}

                    {/* Free checkbox for ebook/art */}
                    {/* {(category === "ebook" || category === "art") && (
                      <div className="mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.is_free || false}
                            onChange={(e) => {
                              setContentItems((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? { ...i, is_free: e.target.checked }
                                    : i
                                )
                              );
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-[#7077FE] focus:ring-2 focus:ring-[#7077FE]"
                          />
                          <span className="text-sm text-[#242E3A]">
                            Free {category === "ebook" ? "Chapter" : "Collection"}
                          </span>
                        </label>
                      </div>
                    )} */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* LEFT Upload Area */}
                      <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF] transition-colors">
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
                          accept={getAcceptedFileTypes(category)}
                          className="hidden"
                          onChange={(e) => handleAddFile(e, item.id)}
                          multiple
                        />
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                            <img
                              src={uploadimg}
                              alt="Upload"
                              className="w-6 h-6"
                            />
                          </div>
                          <p className="text-sm font-[poppins] text-[#242E3A]">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-[#665B5B]">
                            {getFileTypeDescription(category)}
                          </p>
                        </div>
                      </label>

                      {/* RIGHT Uploaded Files */}
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {getFileArray(item).length === 0 ? (
                          <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50 h-40 flex items-center justify-center">
                            No files uploaded yet
                          </div>
                        ) : (
                          getFileArray(item).map(
                            (file: any, fileIndex: number) => (
                              <div
                                key={fileIndex}
                                className="border border-gray-200 rounded-lg p-3 bg-white"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2 flex-1">
                                    {file.isUploading ? (
                                      <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7077FE]"></div>
                                        <span className="text-sm text-gray-600">
                                          Uploading...
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        {getFileIcon(category, file.file_type)}
                                        {file.isEditing ? (
                                          <input
                                            type="text"
                                            value={file.title}
                                            onChange={
                                              (e) =>
                                                handleEditFileName(
                                                  item.id,
                                                  file.file_id,
                                                  e.target.value
                                                ) // ✅ Pass item.id and file.file_id
                                            }
                                            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
                                            autoFocus
                                          />
                                        ) : (
                                          <p className="text-sm font-medium text-[#242E3A] flex-1 truncate">
                                            {file.title}
                                          </p>
                                        )}
                                        {file.file_type && (
                                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                            {file.file_type}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>

                                  {!file.isUploading && (
                                    <div className="flex items-center space-x-2">
                                      {file.isEditing ? (
                                        <>
                                          {/* <input
                                            type="text"
                                            value={file.title}
                                            onChange={
                                              (e) =>
                                                handleEditFileName(
                                                  item.id,
                                                  file.file_id,
                                                  e.target.value
                                                ) // ✅ Pass item.id and file.file_id
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                          /> */}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              saveFileName(
                                                item.id,
                                                file.file_id
                                              )
                                            }
                                            className="text-[#7077FE] text-sm font-semibold hover:text-[#5E65F6]"
                                          >
                                            <Check className="w-5 h-5" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              toggleEditFile(
                                                item.id,
                                                file.file_id
                                              )
                                            }
                                            className="text-gray-500 hover:text-[#7077FE] transition-colors"
                                            title="Edit filename"
                                          >
                                            <SquarePen className="w-4 h-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              deleteFile(item.id, file.file_id)
                                            }
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
                                        {file.file
                                          ? formatFileSize(file.file.size)
                                          : "Uploaded"}
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
                                      Order: {file.order_number + 1}
                                    </p>
                                  </>
                                )}
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                    {errors[`item_${itemIndex}`] && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors[`item_${itemIndex}`]}
                      </p>
                    )}
                  </div>
                ))}

                {/* Add Content Item Button */}
                <button
                  type="button"
                  onClick={handleAddContentItem}
                  className="relative w-full rounded-lg py-4 text-[#7077FE] font-medium bg-white cursor-pointer group overflow-hidden transition-all hover:bg-[#EEF3FF]"
                >
                  <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="10"
                      ry="10"
                      stroke="#CBD5E1"
                      strokeWidth="2"
                      strokeDasharray="6,6"
                      fill="none"
                      className="transition-colors duration-300 group-hover:stroke-[#7077FE]"
                    />
                  </svg>
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Add {getContentItemLabel(category)}</span>
                  </div>
                </button>

                {errors.contentItems && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.contentItems}
                  </p>
                )}
              </div>
            </FormSection>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 pb-8">
            <button
              type="button"
              onClick={() => setShowDiscardModal(true)}
              disabled={isLoading}
              className="px-5 py-3 text-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={
                isLoading ||
                isThumbnailUploading ||
                isMainVideoUploading ||
                isShortVideoUploading
              }
              className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Preview"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={
                isLoading ||
                isThumbnailUploading ||
                isMainVideoUploading ||
                isShortVideoUploading
              }
              className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:bg-[#5a60ea] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Discard Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDiscardModal(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-8 w-[450px]">
            <h3 className="text-[20px] font-semibold font-['Poppins'] text-[#242E3A] mb-4">
              Discard Changes?
            </h3>
            <p className="text-[14px] text-[#665B5B] font-['Open_Sans'] mb-6">
              Are you sure you want to discard? All your changes will not be
              saved.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardModal(false);
                  navigate("/dashboard/products");
                }}
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
        productType={
          category as "video" | "music" | "course" | "podcast" | "ebook" | "art"
        }
        onGenerate={handleAIGenerate}
      />
    </>
  );
};

export default EditSellerProductPage;
