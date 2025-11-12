import { BsClockHistory } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { FaYoutube, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { RiInstagramLine } from "react-icons/ri";
import { Mic2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetPreviewProduct, UpdateProductStatus } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const artistAvatar = 'https://cdn.cness.io/frame1.svg';

const PodcastPreview = () => {
  const params = useParams();
  const id = params?.productNo || {};
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await GetPreviewProduct(category, id);
        setData(response?.data?.data);
      } catch (error: any) {
        showToast({
          message: "Failed to load Product.",
          type: "error",
          duration: 3000,
        });
      }
    };

    if (id && category) {
      fetchProductData();
    }
  }, [id, category]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!data) return;

    setIsSubmitting(true);
    try {
      const payload = {
        status: 'published',
      };

      await UpdateProductStatus(payload, id);

      showToast({
        message: "Podcast product submitted successfully!",
        type: "success",
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/dashboard/products');
      }, 1500);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to submit product.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No product data available</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-[#7077FE] text-white rounded-lg hover:bg-[#5a60ea]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-left py-2 px-2">
      <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] mb-2">
        Preview
      </h2>

      {/* Main Product Card */}
      <div className="bg-white rounded-xl shadow-md w-full mb-8 flex flex-col">
        <div className="flex flex-col md:flex-row">
          {/* Podcast Icon Display */}
          <div className="relative p-2 w-full">
            <img
              src={data.thumbnail_url}
              alt={data.product_title}
              className="rounded-xl w-full h-54 object-cover"
              onError={() => {
                return (
                  <div className="rounded-xl w-full h-54 bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D] flex items-center justify-center">
                    <Mic2 className="w-32 h-32 text-white opacity-80" />
                  </div>
                )
              }}
            />
          </div>

          <div className="p-6 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-2xl md:text-2xl font-bold mb-2" style={{ fontFamily: "Poppins" }}>
                {data.product_title}
              </h2>
              <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "Poppins" }}>
                <img
                  src={data.seller?.shop_logo || artistAvatar}
                  alt={data.seller?.shop_name || "Seller"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{data.seller?.shop_name || "Seller"}</span>
                <span className="ml-2 text-blue-500 text-xl"><IoMdCheckmark /></span>
              </div>
              <div className="flex items-center gap-3">
                {data.discount_percentage && parseFloat(data.discount_percentage) > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-[#7077FE]">
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
                  <div className="text-2xl font-bold">${data.price}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow-md w-full p-6 mb-8">
        <h3 className="font-semibold text-lg mb-3" style={{ fontFamily: "Poppins" }}>Overview</h3>
        <p className="mb-4 text-gray-700" style={{ fontFamily: "Poppins" }}>
          {data.overview}
        </p>
        {data.highlights && data.highlights.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">Highlights:</h4>
            <ul className="list-disc ml-6 mb-4 text-gray-700" style={{ fontFamily: "Poppins" }}>
              {data.highlights.map((highlight: any, index: number) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </>
        )}
        <h4 className="font-semibold mb-2">Details:</h4>
        <div className="flex gap-10 text-gray-700 mb-2">
          {data.podcast_details?.total_duration && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <BsClockHistory style={{ color: "#FF6B6B" }} />
                <span>Duration</span>
              </div>
              <span className="text-sm">{data.podcast_details.total_duration}</span>
            </div>
          )}
          {data.language && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <MdLanguage style={{ color: "#FF6B6B" }} />
                <span>Language</span>
              </div>
              <span className="text-sm" style={{ fontFamily: "Poppins" }}>{data.language}</span>
            </div>
          )}
          {data.podcast_details?.format && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <Mic2 className="w-4 h-4" style={{ color: "#FF6B6B" }} />
                <span>Format</span>
              </div>
              <span className="text-sm" style={{ fontFamily: "Poppins" }}>{data.podcast_details.format}</span>
            </div>
          )}
          {data.podcast_details?.theme && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <span>🎨</span>
                <span>Theme</span>
              </div>
              <span className="text-sm" style={{ fontFamily: "Poppins" }}>{data.podcast_details.theme}</span>
            </div>
          )}
        </div>
      </div>

      {/* Episode List Section */}
      {data.content_items && data.content_items.length > 0 && (
        <div className="bg-white rounded-xl shadow-md w-full p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4" style={{ fontFamily: "Poppins" }}>Episode List</h3>
          <div className="space-y-3">
            {data.content_items.map((episode: any) => (
              <div key={episode.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#FFD93D] rounded-full flex items-center justify-center">
                      <Mic2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#242E3A]">{episode.title}</h4>
                      {episode.description && (
                        <p className="text-sm text-gray-600">{episode.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Episode {episode.order_number}
                        </span>
                        {episode.duration && (
                          <span className="text-xs text-gray-500">
                            {episode.duration}
                          </span>
                        )}
                        {episode.is_free && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {episode.file_urls && episode.file_urls.length > 0 && (
                    <div className="text-sm text-gray-500">
                      {episode.file_urls.length} file{episode.file_urls.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Episode Files */}
                {episode.file_urls && episode.file_urls.length > 0 && (
                  <div className="mt-3 pl-14 space-y-2">
                    {episode.file_urls.map((file: any, fileIndex: number) => (
                      <div key={fileIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 bg-[#FF6B6B] rounded-full"></span>
                        <span>{file.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Podcaster Card */}
      <div className="bg-white rounded-xl shadow-md w-full p-4 flex items-center gap-4">
        <img
          src={data.seller?.shop_logo || artistAvatar}
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
          <div className="text-sm text-gray-500">{data.product_category?.name || "Podcaster"}</div>
        </div>

        {data.seller?.social_links && (
          <div className="ml-6 flex gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
              <FiSun />
            </button>
            {data.seller.social_links.instagram_url && (
              <a
                href={data.seller.social_links.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition"
              >
                <RiInstagramLine />
              </a>
            )}
            {data.seller.social_links.youtube_url && (
              <a
                href={data.seller.social_links.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition"
              >
                <FaYoutube />
              </a>
            )}
            {data.seller.social_links.facebook_url && (
              <a
                href={data.seller.social_links.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition"
              >
                <FaFacebookF />
              </a>
            )}
            {data.seller.social_links.twitter_url && (
              <a
                href={data.seller.social_links.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition"
              >
                <FaXTwitter />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
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
    </div>
  );
};

export default PodcastPreview;