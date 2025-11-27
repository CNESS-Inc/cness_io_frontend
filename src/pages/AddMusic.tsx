import React, { useEffect, useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { Music, Plus, SquarePen, Trash2, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreateMusicProduct, GetMarketPlaceCategories, GetMarketPlaceMoods, UploadProductDocument, UploadProductThumbnail } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
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

const AddMusicForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [thumbnailData, setThumbnailData] = useState<{
    thumbnail_url: string;
    public_id: string;
  } | null>(null);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
  const [newHighlight, setNewHighlight] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [sampleFiles, setSampleFiles] = useState<any[]>([]);

const [storyMedia, setStoryMedia] = useState<{
  type: "audio" | "video" | null;
  url: string;
  thumbnail?: string;
    public_id?: string;

}>({
  type: null,
  url: "",
});
const [storySummary, setStorySummary] = useState("");

  const [tracks, setTracks] = useState<any[]>([
    {
      id: 1,
      title: "Track 1",
      track_files: [],
      description: "",
      duration: "",
      order_number: 1,
      is_free: false
    },
  ]);

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
   mood_ids: [] as string[],
    overview: "",
    highlights: [] as string[],
    total_duration: "",
    language: "",
    theme: "",
    format: "",
    status: "",
    thumbnail_url: "",
    sample_track_url: "",
  });

const [sampleList, setSampleList] = useState([0]); 
const [sampleFiles, setSampleFiles] = useState<{
  file_url: string;
  public_id: string;
  title: string;
  file_type: string;
  order_number: number;
  is_ariome: boolean;
}[]>([]);
const addSample = () => setSampleList(prev => [...prev, prev.length]);
const removeSample = (index: number) =>
  setSampleList(prev => prev.filter((_, i) => i !== index));

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
const handleSampleTrackUpload = (
  sampleUrl: string,
  publicId?: string,
  title?: string
) => {
  setSampleFiles((prev) => [
    ...prev,
    {
      file_url: sampleUrl,
      public_id: publicId || "",
      title: title || "",
      file_type: "audio",
      order_number: prev.length,
      is_ariome: false,
    },
  ]);
};

  //const handleRemoveSampleTrack = () => {
   // setFormData(prev => ({
    //  ...prev,
     // sample_track_url: "",
    //}));
  //};

  const handleAIGenerate = (generatedText: string) => {
    setFormData(prev => ({
      ...prev,
      overview: generatedText
    }));

    setErrors(prev => ({ ...prev, overview: "" }));

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
      Art: "/dashboard/products/add-arts",
    };

    const path = routes[category];
    if (path) {
      navigate(path);
    }
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

  // Add new track
  const handleAddTrack = () => {
    setTracks((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Track ${prev.length + 1}`,
        track_files: [],
        description: "",
        duration: "",
        order_number: prev.length + 1,
        is_free: false
      },
    ]);
  };

  // Edit file name
  const toggleEditFile = (trackId: number, fileOrderNumber: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
            ...track,
            track_files: track.track_files.map((f: any) =>
              f.order_number === fileOrderNumber ? { ...f, isEditing: !f.isEditing } : f
            ),
          }
          : track
      )
    );
  };

  const handleEditFileName = (
    trackId: number,
    fileOrderNumber: number,
    newTitle: string
  ) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
            ...track,
            track_files: track.track_files.map((f: any) =>
              f.order_number === fileOrderNumber ? { ...f, title: newTitle } : f
            ),
          }
          : track
      )
    );
  };

  const saveFileName = (trackId: number, fileOrderNumber: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
            ...track,
            track_files: track.track_files.map((f: any) =>
              f.order_number === fileOrderNumber
                ? { ...f, isEditing: false }
                : f
            ),
          }
          : track
      )
    );
  };

  const deleteFile = (trackId: number, fileOrderNumber: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? {
            ...track,
            track_files: track.track_files.filter((f: any) => f.order_number !== fileOrderNumber)
          }
          : track
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

    if (!formData.product_title.trim()) newErrors.product_title = "Product title is required.";

    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number.";
    }

    if (isNaN(formData.discount_percentage)) {
      newErrors.discount_percentage = "Discount percentage must be a number.";
    } else if (formData.discount_percentage < 0 || formData.discount_percentage > 100) {
      newErrors.discount_percentage = "Discount percentage must be between 0 and 100.";
    }

if (!formData.mood_ids || formData.mood_ids.length === 0) {
  newErrors.mood_ids = "Please select at least one mood.";
}
    if (!formData.thumbnail_url.trim()) newErrors.thumbnail_url = "Thumbnail url is required.";

    if (!formData.overview.trim()) newErrors.overview = "Overview is required.";

    if (formData.highlights.length === 0) {
      newErrors.highlights = "At least one highlight is required.";
    }

   // if (formData.total_duration) {
     // if (!/^\d{2}:\d{2}:\d{2}$/.test(formData.total_duration)) {
     //   newErrors.total_duration = "Duration must be in HH:MM:SS format (e.g., 01:10:00)";
    //  }
    //}
    //if (!formData.total_duration.trim()) newErrors.total_duration = "Duration is required.";

    const validFormats = ["MP3", "AAC", "WAV", "FLAC", "OGG"];
    if (!formData.format || !validFormats.includes(formData.format.toUpperCase())) {
      newErrors.format = "Format must be one of the following: MP3, AAC, WAV, FLAC, OGG.";
    }

    if (tracks.length === 0) {
      newErrors.tracks = "At least one track is required.";
    }

    // Validate each track has at least one file
    tracks.forEach((track, index) => {
      if (track.track_files.length === 0) {
        newErrors[`track_${track.id}`] = `Track ${index + 1} must have at least one audio file.`;
      }
    });

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
    const target = e.target;
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

      case "mood_ids":
        if (!valStr) message = "Mood Selection is required";
        break;

      case "thumbnail_url":
        if (!valStr) message = "Thumbnail is required";
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

      case "total_duration":
        if (!valStr) message = "Duration is required";
        if (valStr && !/^\d{2}:\d{2}:\d{2}$/.test(valStr)) message = "Invalid duration format. Use HH:MM:SS";
        break;

      case "status":
        const validStatuses = ["draft", "published"];
        if (valStr && !validStatuses.includes(valStr)) message = "Status must be either 'draft' or 'published'.";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  const handleTrackFileUpload = async (trackId: number, file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      showToast({
        message: "Please upload an audio file",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Validate file size (50MB max)
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

    setTracks((prevTracks) =>
      prevTracks.map((track) =>
        track.id === trackId
          ? {
            ...track,
            track_files: [...track.track_files, tempFile],
          }
          : track
      )
    );

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("track", file);

      const response = await UploadProductDocument("music-track", uploadFormData);
      const uploadedFileUrl = response?.data?.data?.track_url;

      setTracks((prevTracks) =>
        prevTracks.map((track) => {
          if (track.id === trackId) {
            const updatedFiles = track.track_files.map((f: any) =>
              f.file === file
                ? {
                  url: uploadedFileUrl,
                  title: file.name,
                  order_number: track.track_files.length,
                  isUploading: false,
                }
                : f
            );
            return { ...track, track_files: updatedFiles };
          }
          return track;
        })
      );

      showToast({
        message: "Audio file uploaded successfully",
        type: "success",
        duration: 2000,
      });

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`track_${trackId}`];
        return newErrors;
      });
    } catch (error: any) {
      setTracks((prevTracks) =>
        prevTracks.map((track) =>
          track.id === trackId
            ? {
              ...track,
              track_files: track.track_files.filter((f: any) => f.file !== file),
            }
            : track
        )
      );

      showToast({
        message: error?.response?.data?.error?.message || "Failed to upload audio file",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleAddFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    trackId: number
  ) => {
    const files = Array.from(e.target.files || []);

    // Upload each file
    for (const file of files) {
      await handleTrackFileUpload(trackId, file);
    }

    // Reset input
    e.target.value = "";
  };

  const handleDeleteTrack = (trackId: any) => {
    setTracks(prev => prev.filter(ch => ch.id !== trackId));
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

    const hasUploadingFiles = tracks.some((track) =>
      track.track_files.some((file: any) => file.isUploading)
    );

    if (hasUploadingFiles) {
      showToast({
        message: "Please wait for all audio files to finish uploading",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const tracksData = tracks.map((track) => ({
        title: track.title,
        track_files: track.track_files.map((trackFile: any) => ({
          url: trackFile.url,
          title: trackFile.title,
          order_number: trackFile.order_number,
        })),
        description: track.description || "",
        duration: track.duration || "00:00",
        order_number: track.order_number,
        is_free: track.is_free,
      }));

      const payload = {
        product_title: formData.product_title,
        price: formData.price,
        discount_percentage: formData.discount_percentage,
        mood_ids: formData.mood_ids,
        overview: formData.overview,
        highlights: formData.highlights,
        total_duration: formData.total_duration || "00:00",
        language: formData.language,
        theme: formData.theme,
        format: formData.format,
        thumbnail_url: formData.thumbnail_url,
sample_files: sampleFiles,
        status: isDraft ? 'draft' : 'published',
storytelling_video_url: storyMedia.url,
// storytelling_video_public_id: storyMedia.public_id,
storytelling_description: storySummary,

        tracks: tracksData,       
      };

      const response = await CreateMusicProduct(payload);
      const productId = response?.data?.data?.product_id;

      showToast({
        message: isDraft
          ? "Music product saved as draft successfully"
          : "Music product created successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      // Navigate based on action
      if (isDraft && productId) {
        navigate(`/dashboard/products/music-preview/${productId}?category=music`);
      } else {
        navigate('/dashboard/products');
      }
    } catch (error: any) {
      showToast({
        message: error?.message || error?.response?.data?.error?.message || 'Failed to create music product',
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

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

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
      message: "Please upload audio or video file only.",
      type: "error",
      duration: 3000,
    });
    return;
  }

  const formData = new FormData();
  formData.append("storytelling_video", file); // ✔ Correct field name

  try {
    const response = await UploadStoryTellingVideo(formData);
    const data = response?.data?.data;

   setStoryMedia({
  type: isAudio ? "audio" : "video",
  url:
    data?.url ||
    data?.secure_url ||
    data?.storytelling_video_url ||
    data?.video_url ||
    data?.file_url ||
    data?.path ||
    "",
  thumbnail: data?.thumbnail,
  public_id: data?.public_id,
});

    showToast({
      message: `Storytelling ${isAudio ? "audio" : "video"} uploaded successfully`,
      type: "success",
      duration: 3000,
    });
  } catch {
    showToast({
      message: "Failed to upload storytelling media",
      type: "error",
      duration: 3000,
    });
  }
};

{/*mood multi select*/}
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
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
        {/* Add Music Section */}
        <FormSection
          title="Add Music"
          description="Upload your tracks, set pricing, and publish them to the marketplace."
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

        {/* Details Section */}
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
                  className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-[#7077FE] to-[#5E65F6] text-white rounded-lg hover:shadow-lg transition-all duration-300 group"
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
                  const overviewText = formData.overview.replace(/<[^>]*>/g, '').trim();
                  if (!overviewText) {
                    setErrors((prev) => ({
                      ...prev,
                      overview: "Overview is required",
                    }));
                  }
                }}
                placeholder="Describe your artwork, including inspiration, techniques used, and what makes it special..."
                error={!!errors.overview}
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

            {/*<InputField
              label="Duration (HH:MM:SS)"
              required
              placeholder="e.g., 01:10:00"
              name="total_duration"
              value={formData.total_duration}
              onChange={handleChange}
              error={errors.total_duration}
            />
            <InputField
              label="Theme"
              placeholder="Describe the music theme"
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              error={errors.theme}
            />*/}

            {/* Format dropdown */}
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
               {/* <option value="AAC">AAC</option>
                <option value="FLAC">FLAC</option>
                <option value="OGG">OGG</option>*/}
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
  title="Storytelling"
  description="Add an video or text description that explains your music content."
>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    {/* MEDIA UPLOAD CARD */}
    <div>
      <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
        Upload Video (Optional)
      </label>

      <label
        className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF] transition-colors"
      >
        <input
          type="file"
          accept="audio/*, video/*"
          className="hidden"
          onChange={handleStoryUpload}
        />

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
            {/* Preview */}
            {storyMedia.type === "video" ? (
              <video
                src={storyMedia.url}
                controls
                className="w-full h-32 object-cover rounded-lg"
              />
            ) : (
              <audio controls src={storyMedia.url} className="w-full"></audio>
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => setStoryMedia({ type: null, url: "" })}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              title="Remove Media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </label>
    </div>

    {/* TEXT DESCRIPTION */}
    <div>
      <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
        Summary of the Storytelling
      </label>

      <textarea
        value={storySummary}
        onChange={(e) => setStorySummary(e.target.value)}
        placeholder="Describe the idea, inspiration, or meaning behind your music..."
        className="w-full h-40 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
      ></textarea>
    </div>

  </div>
</FormSection>
        

    <FormSection
  title="Sample Track"
  description="Upload a preview sample so buyers can experience your content before purchasing."
>
  {sampleList.map((_, i) => (
    <div key={i} className="mb-6">
    <SampleTrackUpload
  productType="music"
  onUploadSuccess={(publicId, sampleUrl, title) =>
    handleSampleTrackUpload(sampleUrl, publicId, title)
  }

  onDonationChange={(value) => {
    setSampleFiles(prev =>
      prev.map((sample, i) =>
        i === prev.length - 1
          ? { ...sample, is_ariome: value }
          : sample
      )
    );
  }}

  onRemove={() => removeSample(i)}
/>
    
    </div>
  ))}

  {/* ➕ ADD SAMPLE BUTTON */}
  <button
    type="button"
    onClick={addSample}
    className="mt-2 text-[#7077FE] font-medium flex items-center gap-2"
  >
    <span className="text-2xl">＋</span> Add Another Sample
  </button>
</FormSection>

        {/* Uploads Section */}
        <FormSection title="Uploads" description="">
          <div className="space-y-6">
            {tracks.map((track, trackIndex) => (
              <div
                key={track.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <input
                      type="text"
                      value={track.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setTracks(prev => prev.map(t =>
                          t.id === track.id ? { ...t, title: newTitle } : t
                        ));
                      }}
                      className="text-[16px] font-semibold text-[#242E3A] border-b border-transparent hover:border-gray-300 focus:border-[#7077FE] focus:outline-none mb-2"
                    />
                    <p className="text-sm text-[#665B5B]">
                      Upload track {trackIndex + 1} audio files <span className="text-red-500">*</span>
                    </p>
                  </div>

                  {tracks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTrack(track.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Track"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF] transition-colors">
                    <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                      <rect
                        x="1"
                        y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx="12"
                        ry="12"
                        stroke={errors[`track_${track.id}`] ? "#EF4444" : "#CBD5E1"}
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        fill="none"
                        className="transition-all duration-300 group-hover:stroke-[#7077FE]"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => handleAddFile(e, track.id)}
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
                        MP3, WAV (max 50 MB)
                      </p>
                    </div>
                  </label>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {track.track_files.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50 h-40 flex items-center justify-center">
                        No files uploaded yet
                      </div>
                    ) : (
                      track.track_files.map((file: any, fileIndex: number) => (
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
                                        handleEditFileName(track.id, file.order_number, e.target.value)
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
                                    onClick={() => saveFileName(track.id, file.order_number)}
                                    className="text-[#7077FE] text-sm font-semibold hover:text-[#5E65F6]"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => toggleEditFile(track.id, file.order_number)}
                                      className="text-gray-500 hover:text-[#7077FE] transition-colors"
                                      title="Edit filename"
                                    >
                                      <SquarePen className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteFile(track.id, file.order_number)}
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
                {errors[`track_${track.id}`] && (
                  <p className="text-red-500 text-sm mt-2">{errors[`track_${track.id}`]}</p>
                )}
              </div>
            ))}

            {/* Add Track Button */}
            <button
              onClick={handleAddTrack}
              className="relative w-full rounded-lg py-4 text-[#7077FE] font-medium bg-white cursor-pointer group overflow-hidden transition-all"
            >
              <svg
                className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
              >
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
              + Add Track
            </button>
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
            className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Preview"}
          </button>
          <button
            type='button'
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0] hover:bg-[#5a60ea] transition-colors disabled:opacity-50">
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

export default AddMusicForm;
