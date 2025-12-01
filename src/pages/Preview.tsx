import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BsClockHistory } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { RiInstagramLine } from "react-icons/ri";
import { FaYoutube, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetPreviewProduct, UpdateProductStatus } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Fallback images
const defaultThumbnail = "https://cdn.cness.io/video-placeholder.webp";
const defaultStory = "https://cdn.cness.io/freame2.svg";
const defaultAvatar = "https://cdn.cness.io/frame1.svg";

const Preview = () => {
  const params = useParams();
  const id = params?.productNo || "";
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category") || "";
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [data, setData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await GetPreviewProduct(category, id);
        setData(response?.data?.data);
      } catch {
        showToast({
          message: "Failed to load Product.",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id && category) fetchProductData();
  }, [id, category]);

  const editUrl = useRef(`/dashboard/products/edit/${id}?category=${category}`);
  
    useEffect(() => {
      editUrl.current = `/dashboard/products/edit/${id}?category=${category}`;
    }, [id, category]);
  
    useEffect(() => {
      const handlePopState = (event: PopStateEvent) => {
        event.preventDefault();
        navigate(editUrl.current);
      };
  
      window.addEventListener("popstate", handlePopState);
      window.history.pushState(
        { fromPreview: true },
        "",
        window.location.pathname + window.location.search
      );
  
      return () => {
        window.removeEventListener("popstate", handlePopState);
        if (window.history.state?.fromPreview) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
          );
        }
      };
    }, [navigate, id, category]);
  
    const handleBack = () => {
      navigate(`/dashboard/products/edit/${id}?category=${category}`);
    };

  const handleSubmit = async () => {
    if (!data) return;
    setIsSubmitting(true);
    try {
      await UpdateProductStatus({ status: "published" }, id);
      showToast({
        message: "Product submitted successfully!",
        type: "success",
        duration: 3000,
      });

      navigate("/dashboard/products");
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to submit product.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!data)
    return (
      <main className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>No product data available</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-[#7077FE] text-white rounded-lg hover:bg-[#5a60ea]"
        >
          Go Back
        </button>
      </main>
    );

  // --- Render Media Component ---
  const RenderMedia = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoUrl = data?.video_details?.main_video?.video_url || "";
    const thumbnail =
      data?.video_details?.main_video?.thumbnail || defaultThumbnail;

    const isVideo = category === "videos" || category === "courses";

    return (
      <div
        className="w-full h-[326px] rounded-xl border border-gray-200 overflow-hidden relative bg-white"
        onClick={() => setIsPlaying(true)}
      >
        {!isPlaying ? (
          <>
            <img
              src={thumbnail}
              alt={data.product_title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = defaultThumbnail)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all">
              <img
                src="https://cdn-icons-png.flaticon.com/512/64/64595.png"
                alt="Play"
                className="w-[60px] h-[60px]"
              />
            </div>
          </>
        ) : (
          <>
            {isVideo ? (
              <video
                controls
                autoPlay
                src={videoUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={thumbnail}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )}
          </>
        )}
      </div>
    );
  };

  const highlights = data?.highlights || [];
  const details = [
    {
      icon: <BsClockHistory className="text-[#9747FF]" />,
      label: "Duration",
      value: data?.video_details?.duration || "N/A",
    },
    {
      icon: <MdLanguage className="text-[#9747FF]" />,
      label: "Language",
      value: data?.language || "N/A",
    },
  ];

  return (
    <main className="min-h-screen bg-white font-poppins">
      <div className="transition-all duration-300 pt-[30px] px-6 max-w-6xl mx-auto">
        {/* Product Header */}
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-[30px]">
          <div className="shrink-0 w-full md:max-w-[533px]">
            <RenderMedia />
          </div>

          <div className="flex-1 space-y-4 mt-4 md:mt-0">
            <h1 className="text-2xl font-semibold text-gray-900">
              {data.product_title}
            </h1>

            <div className="flex items-center space-x-2 text-sm">
              <img
                src={data.seller?.shop_logo || defaultAvatar}
                alt={data.seller?.shop_name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium text-gray-900">
                {data.seller?.shop_name || "Seller"}
              </span>
              <IoMdCheckmark className="text-blue-500 text-xl" />
            </div>

            <div className="flex items-center gap-3 text-gray-900">
              {data.discount_percentage &&
              parseFloat(data.discount_percentage) > 0 ? (
                <>
                  <div className="text-3xl font-semibold text-[#7077FE]">
                    ${data.final_price}
                  </div>
                  <div className="text-lg text-gray-500 line-through">
                    ${data.price}
                  </div>
                  <div className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium">
                    {data.discount_percentage}% OFF
                  </div>
                </>
              ) : (
                <div className="text-3xl font-semibold">${data.price}</div>
              )}
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-5 mt-6">
          <h2 className="font-semibold text-lg text-gray-900">Overview</h2>
          <p className="text-[16px] text-gray-700">{data.overview}</p>

          {highlights.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Highlights:</h3>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {highlights.map((h: string, i: number) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2 text-gray-900">Details:</h3>
            <div className="flex flex-wrap gap-8">
              {details.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  {d.icon}
                  <span className="font-medium text-gray-900">{d.label}:</span>
                  <span className="text-gray-700">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Storytelling */}
          {data?.video_details?.summary_of_storytelling && (
            <div className="space-y-3 mt-4">
              <h3 className="font-semibold text-lg text-gray-900">
                Storytelling
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={
                    data.video_details?.short_video?.thumbnail || defaultStory
                  }
                  alt="Story thumbnail"
                  className="w-[450px] h-[190px] rounded-lg object-cover"
                />
                <p className="text-gray-700 flex-1">
                  {data.video_details.summary_of_storytelling}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Artist Card */}
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center gap-4 mt-8">
          <img
            src={data.seller?.shop_logo || defaultAvatar}
            alt={data.seller?.shop_name || "Seller"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold flex items-center gap-1">
              {data.seller?.shop_name || "Seller"}
              <span className="bg-blue-500 rounded-full p-1 ml-1">
                <IoMdCheckmark className="text-white text-sm" />
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {data.product_category?.name || "Digital Artist"}
            </div>
          </div>

          {data.seller?.social_links && (
            <div className="ml-auto flex gap-3">
              {data.seller.social_links.instagram_url && (
                <a
                  href={data.seller.social_links.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <RiInstagramLine />
                </a>
              )}
              {data.seller.social_links.youtube_url && (
                <a
                  href={data.seller.social_links.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <FaYoutube />
                </a>
              )}
              {data.seller.social_links.facebook_url && (
                <a
                  href={data.seller.social_links.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <FaFacebookF />
                </a>
              )}
              {data.seller.social_links.twitter_url && (
                <a
                  href={data.seller.social_links.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  <FaXTwitter />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-[#7077FE] text-white hover:bg-blue-700 text-sm"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Preview;
