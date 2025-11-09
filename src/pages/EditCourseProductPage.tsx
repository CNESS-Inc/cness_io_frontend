import React, { useEffect, useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate, useParams } from "react-router-dom";
import { Video, SquarePen, Trash2, Plus, X, FileText, Music, Image } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import {
  UpdateCourseProduct,
  GetMarketPlaceCategories,
  GetMarketPlaceMoods,
  GetPreviewProduct,
  UploadProductDocument,
  UpdateProductStatus,
  DeleteCourseChapter
} from "../Common/ServerAPI";
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
      {label}
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

interface ChapterFile {
  url: string;
  title: string;
  order_number: number;
  file_type: "video" | "audio" | "image" | "pdf";
  file?: File;
  isEditing?: boolean;
}

interface Chapter {
  id: number;
  chapter_id?: string;
  title: string;
  chapter_files: ChapterFile[];
}

const EditCourseForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params?.productNo;
  const { showToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [moods, setMoods] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newHighlight, setNewHighlight] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [deletingChapters, setDeletingChapters] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    overview: "",
    highlights: [] as string[],
    storytelling: "",
    duration: "",
    language: "",
    format: "video",
    requirements: "",
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;

      setIsFetchingData(true);
      try {
        const response = await GetPreviewProduct('course', productId);
        const productData = response?.data?.data;

        if (productData) {
          setFormData({
            product_title: productData.product_title || "",
            price: parseFloat(productData.price || "0"),
            discount_percentage: parseFloat(productData.discount_percentage || "0"),
            mood_id: productData.mood_id || "",
            overview: productData.overview || "",
            highlights: productData.highlights ? (typeof productData.highlights === 'string' ? productData.highlights.split(',').map((h: string) => h.trim()) : productData.highlights) : [],
            storytelling: productData.course_details?.storytelling || "",
            duration: productData.course_details?.duration || "",
            language: productData.language || "",
            format: productData.course_details?.format || "video",
            requirements: productData.course_details?.requirements || "",
          });

          if (productData.content_items && productData.content_items.length > 0) {
            setChapters(productData.content_items.map((item: any, index: number) => ({
              id: index + 1,
              chapter_id: item.id,
              title: item.title || `Lesson ${index + 1}`,
              chapter_files: item.file_urls?.map((file: any) => ({
                url: file.url,
                title: file.title,
                order_number: file.order_number,
                file_type: file.file_type || 'video',
              })) || [],
            })));
          }
        }
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

    fetchProductData();
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

  const handleSelectCategory = () => {
    setShowModal(false);
  };

  const getFileType = (fileName: string): "video" | "audio" | "image" | "pdf" => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv', 'wmv', 'webm'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'aac', 'flac', 'ogg'].includes(ext || '')) return 'audio';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    return 'video';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'video':
        return <Video className="w-5 h-5 text-[#242E3A]" />;
      case 'audio':
        return <Music className="w-5 h-5 text-[#242E3A]" />;
      case 'image':
        return <Image className="w-5 h-5 text-[#242E3A]" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-[#242E3A]" />;
      default:
        return <Video className="w-5 h-5 text-[#242E3A]" />;
    }
  };

  const handleAddFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    chapterId: number
  ) => {
    const files = Array.from(e.target.files || []);

    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
            ...chapter,
            chapter_files: [
              ...chapter.chapter_files,
              ...files.map((file, i) => ({
                url: "",
                title: file.name,
                order_number: chapter.chapter_files.length + i + 1,
                file_type: getFileType(file.name),
                file: file,
              })),
            ],
          }
          : chapter
      )
    );
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      { id: prev.length + 1, title: `Lesson ${prev.length + 1}`, chapter_files: [] },
    ]);
  };

  const handleDeleteChapter = async (chapterId: any) => {
      if (chapterId) {
        setDeletingChapters(prev => new Set(prev).add(chapterId));
  
        try {
          await DeleteCourseChapter(productId, chapterId);
  
          setChapters(prev => prev.filter(ch => ch.chapter_id !== chapterId));
  
          showToast({
            message: "Chapter deleted successfully",
            type: "success",
            duration: 2000,
          });
        } catch (error: any) {
          showToast({
            message: error?.response?.data?.error?.message || "Failed to delete chapter",
            type: "error",
            duration: 3000,
          });
        } finally {
          setDeletingChapters(prev => {
            const newSet = new Set(prev);
            newSet.delete(chapterId);
            return newSet;
          });
        }
      } else {
        setChapters(prev => prev.filter(ch => ch.chapter_id !== chapterId));
      }
    };

  const toggleEditFile = (chapterId: number, fileOrderNumber: number) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
            ...chapter,
            chapter_files: chapter.chapter_files.map((f) =>
              f.order_number === fileOrderNumber ? { ...f, isEditing: !f.isEditing } : f
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
            chapter_files: chapter.chapter_files.map((f) =>
              f.order_number === fileOrderNumber ? { ...f, title: newTitle } : f
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
            chapter_files: chapter.chapter_files.map((f) =>
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
            chapter_files: chapter.chapter_files.filter((f) => f.order_number !== fileOrderNumber)
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

    if (chapters.length === 0) {
      newErrors.chapters = "At least one lesson is required.";
    }

    chapters.forEach((chapter, index) => {
      if (chapter.chapter_files.length === 0) {
        newErrors[`chapter_${chapter.id}`] = `Lesson ${index + 1} must have at least one file.`;
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

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
      const uploadedChapters = await Promise.all(
        chapters.map(async (chapter) => {
          const uploadedFiles = await Promise.all(
            chapter.chapter_files.map(async (chapterFile) => {
              if (chapterFile.file) {
                const formDataUpload = new FormData();
                formDataUpload.append('chapter_file', chapterFile.file);

                try {
                  const uploadResponse = await UploadProductDocument('course-chapter', formDataUpload);
                  const uploadData = uploadResponse?.data?.data;

                  return {
                    url: uploadData?.video_id || uploadData?.document_url || uploadData?.track_url || uploadData?.image_url || "",
                    title: chapterFile.title,
                    order_number: chapterFile.order_number,
                    file_type: chapterFile.file_type,
                  };
                } catch (error) {
                  throw new Error(`Failed to upload ${chapterFile.title}`);
                }
              }
              return {
                url: chapterFile.url,
                title: chapterFile.title,
                order_number: chapterFile.order_number,
                file_type: chapterFile.file_type,
              };
            })
          );

          return {
            ...(chapter.chapter_id && { chapter_id: chapter.chapter_id }),
            title: chapter.title,
            chapter_files: uploadedFiles,
          };
        })
      );

      const payload = {
        product_title: formData.product_title,
        price: formData.price,
        discount_percentage: formData.discount_percentage,
        mood_id: formData.mood_id,
        overview: formData.overview,
        highlights: formData.highlights.join(', '),
        storytelling: formData.storytelling,
        duration: formData.duration || "00:00:00",
        language: formData.language,
        format: formData.format,
        requirements: formData.requirements,
        chapters: uploadedChapters,
      };

      await UpdateCourseProduct(payload, productId);

      const status = isDraft ? 'draft' : 'published';
      await UpdateProductStatus({ status }, productId);

      showToast({
        message: isDraft ? "Course product saved as draft successfully" : "Course product updated successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      if (isDraft) {
        setTimeout(() => {
          navigate(`/dashboard/products/course-preview/${productId}?category=course`);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/dashboard/products');
        }, 1500);
      }
    } catch (error: any) {
      showToast({
        message: error?.message || error?.response?.data?.error?.message || 'Failed to update course product',
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isFetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />

      <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        <FormSection
          title="Edit Course"
          description="Update your course details, lessons, and publish changes to the marketplace."
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
        </FormSection>

        <FormSection title="Details" description="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Describe your course"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
                required
              />
              {errors.overview && <span className="text-red-500 text-sm mt-1">{errors.overview}</span>}
            </div>
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights * (Max 5)
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

                {formData.highlights.length < 5 && (
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
                  Add up to 5 key highlights about your course
                </p>
              </div>
              {errors.highlights && <span className="text-red-500 text-sm mt-1">{errors.highlights}</span>}
            </div>

            <div>
              <label className="block font-semibold text-[16px] text-[#242E3A] mb-2">
                Storytelling
              </label>
              <textarea
                name="storytelling"
                value={formData.storytelling}
                onChange={handleChange}
                placeholder="What will students learn from this course?"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
              />
            </div>

            <InputField
              label="Duration (HH:MM:SS)"
              placeholder="e.g., 105:30:00"
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

            <InputField
              label="Requirements"
              placeholder="Enter the course requirements for attendees"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
            />

            <div>
              <label className="block font-semibold text-[16px] text-[#242E3A] mb-2">
                Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]">
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Lessons" description="">
          <div className="space-y-6">
            {chapters.map((chapter: any) => (
              <div
                key={chapter.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#242E3A] mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-sm text-[#665B5B] mb-4">
                      Upload lesson {chapter.id} materials (videos, audios, PDFs, images)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteChapter(chapter.chapter_id)}
                    disabled={deletingChapters.has(chapter.chapter_id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Chapter"
                  >
                    {deletingChapters.has(chapter.chapter_id) ? (
                      <span className="text-sm">Deleting...</span>
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <label className="relative flex flex-col items-center justify-center h-40 cursor-pointer rounded-lg p-6 text-center bg-[#F9FAFB] hover:bg-[#EEF3FF]">
                    <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="12" ry="12" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6,6" fill="none" className="transition-all duration-300 group-hover:stroke-[#7077FE]" />
                    </svg>
                    <input
                      type="file"
                      accept="video/*,audio/*,image/*,.pdf"
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
                        Videos, audios, PDFs, images
                      </p>
                    </div>
                  </label>

                  <div className="space-y-3">
                    {chapter.chapter_files.length === 0 ? (
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50">
                        No files uploaded yet
                      </div>
                    ) : (
                      chapter.chapter_files.map((file: any) => (
                        <div
                          key={file.order_number}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.file_type)}
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
                                  className="border border-gray-300 rounded-md px-2 py-[2px] text-sm"
                                />
                              ) : (
                                <p className="text-sm font-medium text-[#242E3A]">
                                  {file.title}
                                </p>
                              )}
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {file.file_type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.isEditing ? (
                                <button
                                  onClick={() => saveFileName(chapter.id, file.order_number)}
                                  className="text-[#7077FE] text-sm font-semibold"
                                >
                                  Save
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleEditFile(chapter.id, file.order_number)
                                    }
                                    className="text-gray-500 hover:text-[#7077FE]"
                                  >
                                    <SquarePen className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteFile(chapter.id, file.order_number)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>{file.file ? formatFileSize(file.file.size) : "Uploaded"}</span>
                            <span className="text-green-600">✓ Ready</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: '100%' }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {errors[`chapter_${chapter.id}`] && (
                  <p className="text-red-500 text-sm mt-2">{errors[`chapter_${chapter.id}`]}</p>
                )}
              </div>
            ))}

            <button
              onClick={handleAddChapter}
              className="relative w-full rounded-lg py-4 text-[#7077FE] font-medium bg-white cursor-pointer group overflow-hidden transition-all"
            >
              <svg className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none">
                <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="10" ry="10" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6,6" fill="none" className="transition-colors duration-300 group-hover:stroke-[#7077FE]" />
              </svg>
              + Add Lesson
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
            {isLoading ? "Updating..." : "Update"}
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
    </>
  );
};

export default EditCourseForm;