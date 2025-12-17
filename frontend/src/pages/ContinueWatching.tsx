import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import MarketHeader from "../components/MarketPlace/Buyerheader";
import { useNavigate } from "react-router-dom";
import { GetContinueWatchingProductList } from "../Common/ServerAPI";

type ContinueWatchingProduct = {
  progress_id: string;
  product_id: string;
  product_name: string;
  thumbnail_url: string;
  category: {
    name: string;
    slug: string;
  };
  price: string;
  final_price: string;
  progress_percentage: number;
  is_completed: boolean;
  last_watched_at: string;
  current_content: any;
};

const ContinueWatchingThumb: React.FC<{
  product: ContinueWatchingProduct;
}> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="relative rounded-t-xl overflow-hidden group cursor-pointer"
        onClick={() =>
          navigate(`/dashboard/library/course/${product.product_id}`)
        }
      >
        <img
          src={
            product.thumbnail_url ||
            "https://cdn.cness.io/collection1.svg"
          }
          alt={product.product_name}
          className="w-full h-[150px] object-cover"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
          <div className="w-10 h-10 rounded-full bg-[#7077FEBF] flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Progress Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#D9D9D9]">
          <div
            className="h-full bg-[#7077FE] transition-all"
            style={{ width: `${product.progress_percentage}%` }}
          ></div>
        </div>

        {/* Progress Percentage Badge */}
        {/* <div className="absolute top-2 right-2 bg-[#7077FEBF] text-white text-xs px-2 py-1 rounded-full">
        {product.progress_percentage}%
      </div> */}
      </div>
      <p className="mt-2 text-[14px] text-[#111827] font-semibold leading-snug line-clamp-2">
        {product.product_name}
      </p>
    </div>
  );
};

const ContinueWatching: React.FC = () => {
  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingProduct[]
  >([]);

  useEffect(() => {
    fetchContinueWatching();
  }, []);

  const fetchContinueWatching = async () => {
    try {
      const response = await GetContinueWatchingProductList();
      const data = response?.data?.data;
      setContinueWatching(data?.continue_watching || []);
    } catch (error: any) {
      console.error("Failed to load continue watching:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Marketplace / Library header */}
      <MarketHeader />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[18px] sm:text-xl font-semibold text-[#111827]">Continue watching</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {continueWatching?.map((product) => (
            <ContinueWatchingThumb
              key={product.progress_id}
              product={product}
            />
          ))}
          {continueWatching.length === 0 && (
            <p className="text-gray-500">No courses to continue watching.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;