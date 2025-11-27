import React, { useEffect, useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { SquarePen, Trash2, Plus, X, Book } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import {
  CreateArtProduct,
  GetMarketPlaceCategories,
  GetMarketPlaceMoods,
  UploadProductDocument,
  UploadProductThumbnail,
  UploadStoryTellingVideo,
} from "../Common/ServerAPI";
import AIModal from "../components/MarketPlace/AIModal";
import SampleTrackUpload from "../components/MarketPlace/SampleTrackUpload";
import CustomRichTextEditor from "../components/sections/bestPractiseHub/CustomRichTextEditor";

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
      <p className="font-['Open_Sans'] text-[14px] text-[#665B5B]">
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

const AddArtsForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
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
//const [sampleImageUrl, setSampleImageUrl] = useState<string | null>(null);
const [sampleList, setSampleList] = useState<any[]>([]);
const [storyMedia, setStoryMedia] = useState<{
  type: "audio" | "video" | null;
  url: string;
  thumbnail?: string;
  public_id?: string; 
}>({
  type: null,
  url: ""
});

const [storySummary, setStorySummary] = useState("");

const addSample = () => {
  setSampleList([...sampleList, ""]);
};

  // REMOVE a sample box
  const removeSample = (index: number) => {
    setSampleList(sampleList.filter((_, i) => i !== index));
  };

  // UPDATE uploaded sample URL
  const handleSampleUpload = (index: number, newSampleObj: any) => {
    setSampleList((prev) => {
      const updated = [...prev];
      updated[index] = newSampleObj;
      return updated;
    });
  };

  const [chapters, setChapters] = useState<any[]>([
    {
      id: 1,
      title: "Collection 1",
      chapter_files: [],
      description: "",
      order_number: 1,
      is_free: false,
    },
  ]);

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_ids: [] as string[],
    thumbnail_url: "",
    overview: "",
    highlights: [] as string[],
    language: "",
    theme: "",
    mediums: "",
    modern_trends: "",
    sample_track: "",
  });

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
        showToast({
          message: "Failed to load categories.",
          type: "error",
          duration: 3000,
        });
      }
    };

    fetchCategories();
  }, []);

  //const handleSampleTrackUpload = (sampleId: string) => {
  // Save the uploaded sample image URL
  //setSampleImageUrl(sampleId);

  // Also store in formData (used for API payload)
  //setFormData((prev) => ({
  // ...prev,
  // sample_track: sampleId,
  //}));
  //};
  //const handleRemoveSampleTrack = () => {
  //setFormData((prev) => ({
  //  ...prev,
  //  sample_track: "",
  // }));
  // };

  const handleAIGenerate = (generatedText: string) => {
    setFormData((prev) => ({
      ...prev,
      overview: generatedText,
    }));

    setErrors((prev) => ({ ...prev, overview: "" }));
    setShowAIModal(false);
  };

  const handleSelectCategory = (category: string) => {
    setShowModal(false); // Close modal first

    const routes: Record<string, string> = {
      Video: "/dashboard/products/add-video",
      Music: "/dashboard/products/add-music",
      Course: "/dashboard/products/add-course",
      Podcasts: "/dashboard/products/add-podcast",
      Ebook: "/dashboard/products/add-ebook",
      Arts: "/dashboard/products/add-arts",
    };

    const path = routes[category];
    if (path) {
      navigate(path);
    }
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

      setFormData((prev) => ({
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
        message:
          error?.response?.data?.error?.message || "Failed to upload thumbnail",
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
    setFormData((prev) => ({
      ...prev,
      image_url: "",
    }));
  };

  const handleDeleteChapter = (chapterId: number) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  };

  const handleChapterFileUpload = async (chapterId: number, file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/webp",
      "application/pdf",
      "application/zip",
    ];

    if (!validTypes.includes(file.type)) {
      showToast({
        message: "Please upload a valid file (JPG, PNG, SVG, WEBP, PDF, ZIP)",
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

    const tempFile: any = {
      url: "",
      title: file.name,
      order_number: 0,
      file: file,
      isUploading: true,
    };

    setChapters((prevChapters) =>
      prevChapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapter_files: [...chapter.chapter_files, tempFile],
            }
          : chapter
      )
    );

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("chapter_file", file);

      const response = await UploadProductDocument(
        "art-chapter",
        uploadFormData
      );
      const uploadedFileUrl = response?.data?.data?.chapter_file_url;

      setChapters((prevChapters) =>
        prevChapters.map((chapter) => {
          if (chapter.id === chapterId) {
            const updatedFiles = chapter.chapter_files.map((f: any) =>
              f.file === file
                ? {
                    url: uploadedFileUrl,
                    title: file.name,
                    order_number: chapter.chapter_files.length,
                    isUploading: false,
                  }
                : f
            );
            return { ...chapter, chapter_files: updatedFiles };
          }
          return chapter;
        })
      );

      showToast({
        message: "File uploaded successfully",
        type: "success",
        duration: 2000,
      });

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`chapter_${chapterId}`];
        return newErrors;
      });
    } catch (error: any) {
      setChapters((prevChapters) =>
        prevChapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                chapter_files: chapter.chapter_files.filter(
                  (f: any) => f.file !== file
                ),
              }
            : chapter
        )
      );

      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to upload file",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleAddFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    chapterId: number
  ) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      await handleChapterFileUpload(chapterId, file);
    }

    e.target.value = "";
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Collection ${prev.length + 1}`,
        chapter_files: [],
        description: "",
        order_number: prev.length + 1,
        is_free: false,
      },
    ]);
  };

  const toggleEditFile = (chapterId: number, fileOrderNumber: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapter_files: chapter.chapter_files.map((f: any) =>
                f.order_number === fileOrderNumber
                  ? { ...f, isEditing: !f.isEditing }
                  : f
              ),
            }
          : chapter
      )
    );
  };

  const handleEditFileName = (
    chapterId: number,
    fileOrderNumber: number,
    newTitle: string
  ) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapter_files: chapter.chapter_files.map((f: any) =>
                f.order_number === fileOrderNumber
                  ? { ...f, title: newTitle }
                  : f
              ),
            }
          : chapter
      )
    );
  };

  const saveFileName = (chapterId: number, fileOrderNumber: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapter_files: chapter.chapter_files.map((f: any) =>
                f.order_number === fileOrderNumber
                  ? { ...f, isEditing: false }
                  : f
              ),
            }
          : chapter
      )
    );
  };

  const deleteFile = (chapterId: number, fileOrderNumber: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              chapter_files: chapter.chapter_files.filter(
                (f: any) => f.order_number !== fileOrderNumber
              ),
            }
          : chapter
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

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

    if (!formData.mood_ids || formData.mood_ids.length === 0) {
      newErrors.mood_ids = "Please select at least one mood.";
    }
    if (!formData.thumbnail_url.trim())
      newErrors.thumbnail_url = "Thumbnail is required.";
    if (!formData.overview.trim()) newErrors.overview = "Overview is required.";

    if (formData.highlights.length === 0) {
      newErrors.highlights = "At least one highlight is required.";
    }

    if (chapters.length === 0) {
      newErrors.chapters = "At least one collection is required.";
    }

    chapters.forEach((chapter, index) => {
      if (chapter.chapter_files.length === 0) {
        newErrors[`chapter_${chapter.id}`] = `Collection ${
          index + 1
        } must have at least one file.`;
      }
    });

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

  const validateField = (name: string, value: any) => {
    let message = "";
    const valStr = typeof value === "string" ? value.trim() : String(value);

    switch (name) {
      case "product_title":
        if (!valStr) message = "Podcast title is required";
        break;
      case "price":
        if (!valStr || parseFloat(valStr) <= 0)
          message = "Price must be greater than 0";
        break;
      case "mood_ids":
        if (!valStr) message = "Please select a mood";
        break;
      case "thumbnail_url":
        if (!valStr) message = "Thumbnail is required";
        break;
      case "overview":
        if (!valStr) message = "Overview is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
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

    const hasUploadingFiles = chapters.some((chapter) =>
      chapter.chapter_files.some((file: any) => file.isUploading)
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
    thumbnail_url: formData.thumbnail_url,
    status: isDraft ? "draft" : "published",

  storytelling_video_url: storyMedia.url,
  storytelling_video_public_id: storyMedia.public_id,
  storytelling_description: storySummary,
 sample_files: sampleList.map((s, index) => ({
  file_url: s.file_url,
  public_id: s.public_id,
  title: s.title,
  file_type: s.file_type,
  order_number: index,
  is_ariome: s.is_ariome ?? false,
})),
     
  arts_details: {
    theme: formData.theme,
    mediums: formData.mediums,
    modern_trends: formData.modern_trends,
    sample_image_url: sampleList   ,  
  },

  chapters: chapters.map((chapter) => ({
    title: chapter.title,
    chapter_files: chapter.chapter_files.map((file: any) => ({
      url: file.url,
      title: file.title,
      order_number: file.order_number,
    })),
    description: chapter.description || "",
    order_number: chapter.order_number,
    is_free: chapter.is_free,
  })),
};
      const response = await CreateArtProduct(payload);
      const productId = response?.data?.data?.product_id;

      showToast({
        message: isDraft
          ? "Art product saved as draft successfully"
          : "Art product created successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      if (isDraft && productId) {
        navigate(`/dashboard/products/art-preview/${productId}?category=art`);
      } else {
        navigate("/dashboard/products");
      }
    } catch (error: any) {
      showToast({
        message:
          error?.message ||
          error?.response?.data?.error?.message ||
          "Failed to create art product",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //const extractPublicId = (url: string): string => {
  //try {
  // const parts = url.split("/");
  // const filename = parts.pop() || ""; // last part
  // return filename.split(".")[0]; // remove file extension
  // } catch {
  //   return "";
  // }
  //};

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      if (formData.highlights.length >= 5) {
        showToast({
          message: "Maximum 5 highlights allowed",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleEditHighlight = (index: number, newValue: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? newValue : h)),
    }));
  };

  const handleDiscard = () => {
    setShowDiscardModal(true);
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    navigate("/dashboard/products");
  };

  const handleOverviewChange = (data: any) => {
    const content = typeof data === "string" ? data : data?.content || "";
    setFormData((prev) => ({
      ...prev,
      overview: content,
    }));

    // Clear error when user starts typing
    if (errors.overview) {
      setErrors((prev) => ({
        ...prev,
        overview: "",
      }));
    }
  };

  const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isAudio = file.type.startsWith("audio/");
    const isVideo = file.type.startsWith("video/");

    if (!isAudio && !isVideo) {
      showToast({
        message: "Please upload audio or video only",
        type: "error",
        duration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("storytelling_video", file); // ✔ correct field

    try {
      const response = await UploadStoryTellingVideo(formData);
      const data = response?.data?.data;

      console.log("STORY RESPONSE:", data);

      setStoryMedia({
        type: isAudio ? "audio" : "video",
        url:
          data?.secure_url || data?.url || data?.storytelling_video_url || "",
        thumbnail: data?.thumbnail || "",
        public_id: data?.public_id || "",
      });

      showToast({
        message: `${isAudio ? "Audio" : "Video"} uploaded successfully`,
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      showToast({
        message: "Failed to upload storytelling media",
        type: "error",
        duration: 3000,
      });
    }
  };
  {
    /*mood multi select*/
  }
  const MultiSelect = ({
    label,
    options,
    selectedValues,
    onChange,
    required = false,
  }: any) => {
    const [open, setOpen] = useState(false);

    const toggleOption = (value: string) => {
      if (selectedValues.includes(value)) {
        onChange(selectedValues.filter((v: string) => v !== value));
      } else {
        onChange([...selectedValues, value]);
      }
    };

    return (
      <div className="relative">
        <label className="block font-['Open_Sans'] font-semibold text-[16px] mb-2 text-[#242E3A]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Input Box */}
        <div
          className="border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer flex flex-wrap gap-2 min-h-[42px]"
          onClick={() => setOpen(!open)}
        >
          {selectedValues.length === 0 ? (
            <span className="text-gray-400">Select Mood</span>
          ) : (
            selectedValues.map((val: string) => {
              const item = options.find((o: any) => o.id === val);
              return (
                <span
                  key={val}
                  className="bg-[#7077FE] text-white px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {item?.name}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                  />
                </span>
              );
            })
          )}
          <svg
            className="w-4 h-4 absolute right-3 text-gray-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown List */}
        {open && (
          <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-md z-20">
            {options.map((opt: any) => (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedValues.includes(opt.id)
                    ? "bg-[#EEF3FF] text-[#7077FE]"
                    : "text-gray-700"
                }`}
              >
                {opt.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        <FormSection
          title="Add Arts"
          description="Upload your digital art collections, set pricing, and make them available for buyers on the marketplace."
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
              value={
                formData.discount_percentage === 0
                  ? ""
                  : formData.discount_percentage.toString()
              }
              onChange={handleChange}
              error={errors.discount_percentage}
            />
            <div>
              <MultiSelect
                label="Mood"
                required
                options={moods}
                selectedValues={formData.mood_ids}
                onChange={(values: string[]) => {
                  setFormData((prev) => ({
                    ...prev,
                    mood_ids: values,
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    mood_ids: "",
                  }));
                }}
              />

              {errors.mood_ids && (
                <span className="text-red-500 text-sm">{errors.mood_ids}</span>
              )}

              {errors.mood_ids && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.mood_ids}
                </span>
              )}
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
                  className={`relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center transition-all ${
                    isThumbnailUploading
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
              {errors.thumbnail_url && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.thumbnail_url}
                </span>
              )}
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

              {/* Replaced textarea with CustomRichTextEditor */}
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
                placeholder="Describe your artwork..."
                error={!!errors.overview}
              />
              {errors.overview && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.overview}
                </span>
              )}
            </div>

            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights <span className="text-red-500">*</span> (Max 5)
              </label>
              <div className="space-y-3">
                {formData?.highlights?.map((highlight: any, index: number) => (
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
                ))}

                {formData.highlights.length < 5 && (
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
                  Add up to 5 key highlights about your artwork
                </p>
              </div>
              {errors.highlights && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.highlights}
                </span>
              )}
            </div>

            {/*<InputField
              label="Theme"
              placeholder="Describe the art theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              error={errors.theme}
            />*/}
            <InputField
              label="Medium"
              placeholder="Describe the art creation mediums like oils, digital tools"
              name="mediums"
              value={formData.mediums}
              onChange={handleChange}
              error={errors.mediums}
            />
            {/*<InputField
              label="Modern Trends"
              placeholder="Enter your art trends"
              name="modern_trends"
              value={formData.modern_trends}
              onChange={handleChange}
              error={errors.modern_trends}
            />*/}
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/*story telling */}

        <FormSection
          title="Storytelling"
          description="Add an video ot text description that explains the story or inspiration behind your artwork."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* MEDIA UPLOAD */}
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Upload Video (Optional)
              </label>

              <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF] transition">
                <input
                  type="file"
                  accept="audio/*, video/*"
                  className="hidden"
                  onChange={handleStoryUpload}
                />

                <svg className="absolute top-0 left-0 w-full h-full rounded-lg">
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
                  />
                </svg>

                {!storyMedia.url ? (
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#7077FE]/10 flex items-center justify-center text-[#7077FE]">
                      <img src={uploadimg} alt="Upload" className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-[poppins] text-[#242E3A]">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-[#665B5B]">Supports video</p>
                  </div>
                ) : (
                  <div className="relative w-full">
                    {storyMedia.type === "video" ? (
                      <video
                        src={storyMedia.url}
                        controls
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <audio
                        controls
                        src={storyMedia.url}
                        className="w-full"
                      ></audio>
                    )}

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setStoryMedia({ type: null, url: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </label>
            </div>

            {/* TEXT SUMMARY */}
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Summary of the artwork
              </label>

              <textarea
                value={storySummary}
                onChange={(e) => setStorySummary(e.target.value)}
                placeholder="Write about your inspiration, process or emotions behind this artwork..."
                className="w-full h-40 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              ></textarea>

              {errors.story_summary && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.story_summary}
                </p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Sample Artwork"
          description="Upload a preview sample so buyers can experience your content before purchasing."
        >
          {sampleList.map((sample, index) => (
            <div key={index} className="mb-6">
              <SampleTrackUpload
                productType="art"
                defaultValue={sample.file_url}
                onUploadSuccess={(id, url) =>
                  handleSampleUpload(index, {
                    file_url: url,
                    public_id: id,
                    title: `Sample ${index + 1}`,
                    file_type: "image",
                    order_number: index,
                    is_ariome: false,
                  })
                }
                onDonationChange={(value) => {
                  setSampleList((prev) =>
                    prev.map((s, i) =>
                      i === index ? { ...s, is_ariome: value } : s
                    )
                  );
                }}
                onRemove={() => removeSample(index)}
              />
            </div>
          ))}

          {/* ADD SAMPLE BUTTON */}
          <button
            type="button"
            onClick={addSample}
            className="flex items-center gap-2 px-4 py-2 text-[#7077FE] border border-[#7077FE] rounded-lg hover:bg-[#F4F4FF] transition"
          >
            <Plus className="w-4 h-4" />
            Add Another Sample
          </button>
        </FormSection>

        <FormSection title="Collections" description="">
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setChapters((prev) =>
                          prev.map((t) =>
                            t.id === chapter.id ? { ...t, title: newTitle } : t
                          )
                        );
                      }}
                      className="text-[16px] font-semibold text-[#242E3A] border-b border-transparent hover:border-gray-300 focus:border-[#7077FE] focus:outline-none mb-2"
                    />
                    <p className="text-sm text-[#665B5B] mb-4">
                      Upload artwork files (images, PDFs, etc.){" "}
                      <span className="text-red-500">*</span>
                    </p>
                  </div>

                  {/* Delete Chapter Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Chapter"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF]">
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
                      accept="image/*,.pdf,.zip"
                      className="hidden"
                      onChange={(e) => handleAddFile(e, chapter.id)}
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
                        JPG, PNG, PDF (max 100 MB)
                      </p>
                    </div>
                  </label>

                  <div className="space-y-3">
                    {chapter.chapter_files.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50 h-40 flex items-center justify-center">
                        No files uploaded yet
                      </div>
                    ) : (
                      chapter.chapter_files.map(
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
                                    <Book className="w-5 h-5 text-[#7077FE]" />
                                    {file.isEditing ? (
                                      <input
                                        type="text"
                                        value={file.title}
                                        onChange={(e) =>
                                          handleEditFileName(
                                            chapter.id,
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
                                      onClick={() =>
                                        saveFileName(
                                          chapter.id,
                                          file.order_number
                                        )
                                      }
                                      className="text-[#7077FE] text-sm font-semibold hover:text-[#5E65F6]"
                                    >
                                      Save
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleEditFile(
                                            chapter.id,
                                            file.order_number
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
                                          deleteFile(
                                            chapter.id,
                                            file.order_number
                                          )
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
                                  Order: {file.order_number}
                                </p>
                              </>
                            )}
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
                {errors[`chapter_${chapter.id}`] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors[`chapter_${chapter.id}`]}
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={handleAddChapter}
              className="relative w-full rounded-lg py-4 text-[#7077FE] font-medium bg-white cursor-pointer group overflow-hidden transition-all"
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
              + Add Collection
            </button>

            {errors.chapters && (
              <p className="text-red-500 text-sm mt-2">{errors.chapters}</p>
            )}
          </div>
        </FormSection>

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
            className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] hover:bg-[#5a60ea] transition-colors disabled:opacity-50"
          >
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

export default AddArtsForm;
