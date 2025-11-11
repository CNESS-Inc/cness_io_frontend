import React, { useEffect, useState } from "react";
import uploadimg from "../assets/upload1.svg";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { Music, Plus, SquarePen, Trash2, X } from "lucide-react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CreatePodcastProduct, GetMarketPlaceCategories, GetMarketPlaceMoods, UploadProductDocument } from "../Common/ServerAPI";

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

interface EpisodeFile {
  url: string;
  title: string;
  order_number: number;
  file?: File;
  isEditing?: boolean;
}

interface Episode {
  id: number;
  title: string;
  episode_files: EpisodeFile[];
  description: string;
  duration: string;
  order_number: number;
  is_free: boolean;
}

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
  const [episodes, setEpisodes] = useState<Episode[]>([
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

  const [formData, setFormData] = useState({
    product_title: "",
    price: 0,
    discount_percentage: 0,
    mood_id: "",
    overview: "",
    highlights: [] as string[],
    total_duration: "",
    language: "",
    theme: "",
    format: "",
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

  const handleAddFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    episodeId: number
  ) => {
    const files = Array.from(e.target.files || []);

    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: [
              ...episode.episode_files,
              ...files.map((file, i) => ({
                url: "",
                title: file.name,
                order_number: episode.episode_files.length + i + 1,
                file: file,
              })),
            ],
          }
          : episode
      )
    );
  };

  const handleAddEpisode = () => {
    setEpisodes((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: `Episode ${prev.length + 1}`,
        episode_files: [],
        description: "",
        duration: "",
        order_number: prev.length + 1,
        is_free: false
      },
    ]);
  };

  const toggleEditFile = (episodeId: number, fileOrderNumber: number) => {
    setEpisodes((prev) =>
      prev.map((episode) =>
        episode.id === episodeId
          ? {
            ...episode,
            episode_files: episode.episode_files.map((f) =>
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
            episode_files: episode.episode_files.map((f) =>
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
            episode_files: episode.episode_files.map((f) =>
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
            episode_files: episode.episode_files.filter((f) => f.order_number !== fileOrderNumber)
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

    const validFormats = ["MP3", "AAC", "WAV", "FLAC", "OGG"];
    if (!formData.format || !validFormats.includes(formData.format.toUpperCase())) {
      newErrors.format = "Format must be one of the following: MP3, AAC, WAV, FLAC, OGG.";
    }

    if (episodes.length === 0) {
      newErrors.episodes = "At least one episode is required.";
    }

    episodes.forEach((episode, index) => {
      if (episode.episode_files.length === 0) {
        newErrors[`episode_${episode.id}`] = `Episode ${index + 1} must have at least one audio file.`;
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
      const uploadedEpisodes = await Promise.all(
        episodes.map(async (episode) => {
          const uploadedFiles = await Promise.all(
            episode.episode_files.map(async (episodeFile) => {
              if (episodeFile.file) {
                const formData = new FormData();
                formData.append('audio', episodeFile.file);

                try {
                  const response = await UploadProductDocument('podcast-audio', formData);
                  const uploadData = response?.data?.data?.data;

                  return {
                    url: uploadData?.track_url || "",
                    title: episodeFile.title,
                    order_number: episodeFile.order_number,
                  };
                } catch (error) {
                  throw new Error(`Failed to upload ${episodeFile.title}`);
                }
              }
              return episodeFile;
            })
          );

          return {
            title: episode.title,
            episode_files: uploadedFiles,
            description: episode.description || "",
            duration: episode.duration || "00:00",
            order_number: episode.order_number,
            is_free: episode.is_free,
          };
        })
      );

      const payload = {
        product_title: formData.product_title,
        price: formData.price,
        discount_percentage: formData.discount_percentage,
        mood_id: formData.mood_id,
        overview: formData.overview,
        highlights: formData.highlights,
        total_duration: formData.total_duration || "00:00:00",
        language: formData.language,
        theme: formData.theme,
        format: formData.format,
        status: isDraft ? 'draft' : 'published',
        episodes: uploadedEpisodes,
      };

      const response = await CreatePodcastProduct(payload);
      const productId = response?.data?.data?.product_id;

      showToast({
        message: isDraft
          ? "Podcast product saved as draft successfully"
          : "Podcast product created successfully",
        type: "success",
        duration: 3000,
      });

      setErrors({});

      if (isDraft && productId) {
        setTimeout(() => {
          navigate(`/dashboard/products/podcast-preview/${productId}?category=podcast`);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/dashboard/products');
        }, 1500);
      }
    } catch (error: any) {
      showToast({
        message: error?.message || error?.response?.data?.error?.message || 'Failed to create podcast product',
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
                placeholder="Describe your podcast"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:ring-2 focus:ring-[#7077FE]"
                required
              />
              {errors.overview && <span className="text-red-500 text-sm mt-1">{errors.overview}</span>}
            </div>
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights * (Max 3)
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
                Format
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

        <FormSection title="Episodes" description="">
          <div className="space-y-6">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#242E3A] mb-2">
                      {episode.title}
                    </h3>
                    <p className="text-sm text-[#665B5B] mb-4">
                      Upload chapter {episode.id} audios
                    </p>

                  </div>

                  {/* Delete Chapter Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteEpisode(episode.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Episode"
                  >
                    <X className="w-5 h-5" />
                  </button>
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
                      onChange={(e) => handleAddFile(e, episode.id)}
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
                      <div className="text-sm text-gray-500 border border-gray-100 rounded-lg p-4 bg-gray-50">
                        No files uploaded yet
                      </div>
                    ) : (
                      episode.episode_files.map((file) => (
                        <div
                          key={file.order_number}
                          className="border border-gray-200 rounded-lg p-3 bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Music className="w-5 h-5 text-[#242E3A]" />
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
                                  className="border border-gray-300 rounded-md px-2 py-[2px] text-sm"
                                />
                              ) : (
                                <p className="text-sm font-medium text-[#242E3A]">
                                  {file.title}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {file.isEditing ? (
                                <button
                                  onClick={() => saveFileName(episode.id, file.order_number)}
                                  className="text-[#7077FE] text-sm font-semibold"
                                >
                                  Save
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleEditFile(episode.id, file.order_number)
                                    }
                                    className="text-gray-500 hover:text-[#7077FE]"
                                  >
                                    <SquarePen className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteFile(episode.id, file.order_number)}
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
    </>
  );
};

export default AddPodcastForm;