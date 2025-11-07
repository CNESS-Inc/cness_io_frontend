import React, { useState, useEffect } from "react";
import { LuImagePlus } from "react-icons/lu";
import { RiArrowRightSLine } from "react-icons/ri";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { X } from "lucide-react";

// ✅ Breadcrumb Component
const Breadcrumb = () => (
  <nav className="mb-6 px-2 text-gray-700 text-sm" style={{ fontFamily: "Poppins" }}>
    <ol className="list-reset flex">
      <li><a href="/dashboard/seller-dashboard" className="text-black-600">Home</a></li>
      <li className="flex items-center"><RiArrowRightSLine className="mx-2 text-slate-500" /></li>
      <li><a href="/dashboard/products" className="text-black-600">Products</a></li>
      <li className="flex items-center"><RiArrowRightSLine className="mx-2 text-slate-500" /></li>
      <li className="text-gray-500">Edit Product</li>
    </ol>
  </nav>
);

// ✅ Category Configuration
const categoryConfig = {
  video: { mediaLabel: "Video", mediaType: "video", editable: true },
  podcast: { mediaLabel: "Audio", mediaType: "audio", editable: true },
  ebook: { mediaLabel: "Cover Image", mediaType: "image", editable: true },
  course: { mediaLabel: "Course Preview", mediaType: "video", editable: false }, // read-only
  art: { mediaLabel: "Artwork", mediaType: "image", editable: true },
  music: { mediaLabel: "Music File", mediaType: "audio", editable: true },
  audio: { mediaLabel: "Audio", mediaType: "audio", editable: true },
};

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { category, productNo } = useParams();
  const location = useLocation();
  const passedProduct = location.state?.product;

  const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.video;

  const [product, setProduct] = useState<any>({
    title: "",
    price: "",
    discount: "",
    mood: "",
    overview: "",
    highlights: [],
    duration: "",
    language: "",
    mediaUrl: "",
    coverUrl: "",
    storyThumbnail: "",
    summary: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Sample data for fallback
  useEffect(() => {
    if (passedProduct) {
      setProduct(JSON.parse(JSON.stringify(passedProduct)));
    } else {
      setProduct({
        title: "Mindfulness for Beginners",
        price: "$499",
        discount: "15%",
        mood: "Calm",
        overview: "Learn the basics of mindfulness meditation and relaxation.",
        highlights: [
          "Practical techniques for stress relief",
          "Step-by-step guided sessions",
          "Enhance focus and emotional well-being",
        ],
        duration: "25 Mins",
        language: "English",
        mediaUrl:
          category === "audio" || category === "podcast" || category === "music"
            ? "https://www.w3schools.com/html/horse.mp3"
            : "https://www.w3schools.com/html/mov_bbb.mp4",
        coverUrl: "https://cdn.cness.io/sample-image.png",
        storyThumbnail: "https://cdn.cness.io/collection1.svg",
        summary:
          "This short course helps you begin your mindfulness journey with simple yet powerful tools for calm and clarity.",
      });
    }
    setLoading(false);
  }, [passedProduct, category]);

  const handleChange = (field: string, value: any) => {
    setProduct((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreview = () => navigate(`/dashboard/products/${category}/preview/${productNo}`);

  const handleSave = async () => {
    setSaving(true);
    alert("✅ Product saved successfully (static mode)");
    setSaving(false);
  };

  // ✅ Handle Media Upload (for video/audio/image)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange("mediaUrl", url);
    }
  };

  // ✅ Story Thumbnail Upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange("storyThumbnail", url);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">No product data</div>;

  return (
    <div className="min-h-screen py-2 font-poppins" style={{ fontFamily: "Poppins" }}>
      <div className="max-w-8xl mx-auto">
        <Breadcrumb />

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">Edit Product</h2>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-md rounded-2xl p-8 space-y-8">
          {/* --- Product Basic Info --- */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1 text-[#1A1A1A]">Product Title *</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                value={product.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#1A1A1A]">Price</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                value={product.price || ""}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#1A1A1A]">Discount in %</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                value={product.discount || ""}
                onChange={(e) => handleChange("discount", e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-[#1A1A1A]">Mood</label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                value={product.mood || ""}
                onChange={(e) => handleChange("mood", e.target.value)}
              >
                <option value="">Select mood</option>
                <option value="Happy">Happy</option>
                <option value="Calm">Calm</option>
                <option value="Focused">Focused</option>
              </select>
            </div>
          </div>

          {/* --- Media Section --- */}
          <div className="pt-4">
            <label className="block font-medium mb-2 text-[#1A1A1A]">{config.mediaLabel}</label>

            <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 bg-black">
              {config.mediaType === "video" ? (
                <video src={product.mediaUrl} controls className="w-full h-[320px] object-cover" />
              ) : config.mediaType === "audio" ? (
                <div className="bg-white flex flex-col items-center justify-center p-6">
                  <audio src={product.mediaUrl} controls className="w-full max-w-[500px]" />
                </div>
              ) : (
                <img
                  src={product.coverUrl}
                  alt="media"
                  className="w-full h-[320px] object-cover"
                />
              )}

              {/* ✅ Upload overlay for editable types */}
              {config.editable && (
                <>
                  <LuImagePlus
                    className="absolute top-1/2 left-1/2 text-5xl text-white opacity-80 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => document.getElementById("mediaUpload")?.click()}
                  />
                  <input
                    type="file"
                    id="mediaUpload"
                    className="hidden"
                    accept={
                      config.mediaType === "video"
                        ? "video/*"
                        : config.mediaType === "audio"
                        ? "audio/*"
                        : "image/*"
                    }
                    onChange={handleMediaUpload}
                  />
                </>
              )}
            </div>
          </div>

          {/* --- Details Section --- */}
          <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-[#1A1A1A]">Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1 text-[#1A1A1A]">Overview</label>
                <textarea
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                  rows={5}
                  value={product.overview || ""}
                  onChange={(e) => handleChange("overview", e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#1A1A1A]">Highlights</label>
                <textarea
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none text-sm"
                  rows={5}
                  value={(product.highlights || []).join("\n")}
                  onChange={(e) =>
                    handleChange("highlights", e.target.value.split("\n"))
                  }
                  placeholder="Enter each highlight on a new line"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#1A1A1A]">Duration</label>
                <input
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                  value={product.duration || ""}
                  onChange={(e) => handleChange("duration", e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[#1A1A1A]">Language</label>
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                  value={product.language || ""}
                  onChange={(e) => handleChange("language", e.target.value)}
                >
                  <option value="">Select</option>
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Storytelling Section --- */}
          <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-[#1A1A1A]">Storytelling</h3>
            <div className="grid grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">Short Video</p>
                <p className="text-xs text-gray-500 mb-3">
                  Add a quick video to explain what your original content is about
                </p>

                <div className="relative">
                  <img
                    src={product.storyThumbnail || "https://cdn.cness.io/collection1.svg"}
                    alt="short video"
                    className="rounded-lg object-cover h-[140px] w-full border border-gray-200 cursor-pointer"
                    onClick={() => document.getElementById("storyThumbnailUpload")?.click()}
                  />
                  {product.storyThumbnail && (
                    <button
                      type="button"
                      onClick={() => handleChange("storyThumbnail", "")}
                      className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <input
                    type="file"
                    id="storyThumbnailUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2 text-[#1A1A1A]">Summary of the video</label>
                <textarea
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#7077FE] focus:outline-none"
                  rows={5}
                  value={product.summary || ""}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  placeholder="Write your video summary here..."
                />
              </div>
            </div>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              className="text-gray-600 border px-6 py-2 rounded-lg hover:bg-gray-100 transition-all"
              onClick={() => navigate(-1)}
            >
              Discard
            </button>
            <button
              className="border border-[#7077FE] text-[#7077FE] px-6 py-2 rounded-lg hover:bg-[#7077FE]/10 transition-all"
              onClick={handlePreview}
            >
              Preview
            </button>
            <button
              className="bg-[#7077FE] text-white px-6 py-2 rounded-lg hover:bg-[#5C63F2] transition-all"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
