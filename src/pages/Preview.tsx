import { BsClockHistory } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { FaYoutube, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";
import { RiInstagramLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetPreviewProduct, UpdateProductStatus } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// Use placeholder images for debugging
const guitarImg = 'https://cdn.cness.io/VIDEO%20(1).svg';
const storytellerImg = 'https://cdn.cness.io/freame2.svg';
const artistAvatar = 'https://cdn.cness.io/frame1.svg';

const Preview = () => {
  const params = useParams();
  const id = params?.productNo || {};
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [data, setData] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('fbgbgnhg', data)

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
      // Update the product status to published
      const payload = {
        status: 'published',
      };

      await UpdateProductStatus(payload, id);

      showToast({
        message: "Product submitted successfully!",
        type: "success",
        duration: 3000,
      });

      // Navigate to products list after successful submission
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
    return (
      <LoadingSpinner />
    );
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
          <div className="relative p-2 w-full">
            <img
              src={data.video_details?.main_video?.thumbnail}
              alt={data.product_title}
              className="rounded-xl w-full h-54 object-cover"
              onError={(e) => {
                e.currentTarget.src = guitarImg; // fallback image
              }}
            />

            {/* Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all">
                  <Play className="w-10 h-10 text-[#7077FE] fill-[#7077FE] ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-white rounded-full" style={{ width: "35%" }}></div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button className="hover:text-[#7077FE] transition-colors">
                      <Play className="w-5 h-5 fill-white" />
                    </button>
                    <span className="text-sm font-medium">
                      00:19 / {data.video_details?.duration || "20:00"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="hover:text-[#7077FE] transition-colors">
                      <Subtitles className="w-5 h-5" />
                    </button>
                    <button className="hover:text-[#7077FE] transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button className="hover:text-[#7077FE] transition-colors">
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button className="hover:text-[#7077FE] transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
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
          {data.video_details?.duration && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <BsClockHistory style={{ color: "#9747FF" }} />
                <span>Duration</span>
              </div>
              <span className="text-sm">{data.video_details.duration}</span>
            </div>
          )}
          {data.language && (
            <div>
              <div className="flex items-center gap-1 mb-1 font-semibold">
                <MdLanguage style={{ color: "#9747FF" }} />
                <span>Language</span>
              </div>
              <span className="text-sm" style={{ fontFamily: "Poppins" }}>{data.language}</span>
            </div>
          )}
        </div>
      </div>

      {/* Storytelling Section */}
      <div className="bg-white rounded-xl shadow-md w-full p-6 mb-8">
        <h3 className="font-semibold text-lg mb-3">Storytelling</h3>
        <div className="flex md:flex-row flex-col md:items-start gap-4">
          {data.video_details?.short_video?.videoId && (
            <div className="relative w-70 h-30">
              <img
                src={data.video_details?.short_video?.thumbnail}
                alt="Video thumbnail"
                className="rounded-lg w-70 h-30 object-cover"
                onError={(e) => {
                  e.currentTarget.src = storytellerImg; // fallback image
                }}
              />

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-200 rounded overflow-hidden">
                <div className="h-full bg-blue-500 rounded" style={{ width: "40%" }} />
              </div>
              <span className="absolute bottom-0 right-2 text-xs bg-black/70 text-white px-1 rounded">
                0:19 / 2:00
              </span>
            </div>
          )}
          {data?.video_details?.summary_of_storytelling && (
            <p className="text-gray-700 text-left justify-start flex-1" style={{ fontFamily: "Poppins" }}>
              {data.video_details.summary_of_storytelling}
            </p>
          )}
        </div>
      </div>

      {/* Artist Card */}
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
          <div className="text-sm text-gray-500">{data.product_category?.name || "Digital Artist"}</div>
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

export default Preview;
