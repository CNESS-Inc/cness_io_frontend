// import { Link } from "react-router-dom";
// import ProductCard from "../components/MarketPlace/ProductCard";
// export default function EmptyPageLibrary() {
//   const products = [
//     {
//       id: 1,
//       image: "https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4.2,
//       reviews: 123,
//       originalPrice: 2444,
//       currentPrice: 1299,
//       discount: 50,
//       duration: "00:23:00",
//       category: ":art: creative",
//     },
//     {
//       id: 2,
//       image: "https://static.codia.ai/image/2025-10-15/uPxjuzQ1CY.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4.7,
//       reviews: 123,
//       currentPrice: 1299,
//       duration: "00:23:00",
//       category: ":dove_of_peace: Peaceful",
//     },
//     {
//       id: 3,
//       image: "https://static.codia.ai/image/2025-10-15/TjuDo2nfP0.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4.8,
//       reviews: 123,
//       originalPrice: 2444,
//       currentPrice: 1299,
//       discount: 50,
//       duration: "00:23:00",
//       category: ":pray: Grateful",
//     },
//     {
//       id: 4,
//       image: "https://static.codia.ai/image/2025-10-15/VM7Quny2Gp.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4.5,
//       reviews: 123,
//       originalPrice: 2444,
//       currentPrice: 1299,
//       discount: 50,
//       duration: "00:23:00",
//       category: ":person_in_lotus_position: Spiritual",
//     },
//     {
//       id: 5,
//       image: "https://static.codia.ai/image/2025-10-15/d9CJZoEQeE.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4,
//       reviews: 123,
//       originalPrice: 2444,
//       currentPrice: 1299,
//       discount: 50,
//       duration: "00:23:00",
//       category: ":dove_of_peace: Peaceful",
//     },
//     {
//       id: 6,
//       image: "https://static.codia.ai/image/2025-10-15/2RXhPHX82C.png",
//       title: "Soft guitar moods that heals your inner pain",
//       author: "by Redtape",
//       rating: 4.8,
//       reviews: 123,
//       originalPrice: 2444,
//       currentPrice: 1299,
//       discount: 50,
//       duration: "00:23:00",
//       category: ":dove_of_peace: Peaceful",
//     },
//   ];
//   return (
//     <div className="flex-1 min-h-screen overflow-y-auto transition-all duration-300
//       px-4 py-4 pb-14
//       sm:px-0 sm:py-0
//       md:px-0 md:py-0
//       lg:px-0 lg:py-0
//       xl:px-0 xl:py-0
//       2xl:px-0 2xl:py-0"

//     >

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         <h2
//           className="font-[Poppins] font-semibold text-[20px] leading-[100%] text-[#242E3A] mb-6
//             sm:text-[18px] sm:mt-6 sm:mb-3
//             md:text-[20px] md:mt-8 md:mb-4
//             lg:text-[20px] xl:text-[20px]
//           "
//         >
//         Library
//         </h2>
//         {/* Empty state */}
//         <div className="w-full flex justify-center items-center flex-1">
//           <div className="w-[280px] w-full h-auto flex flex-col items-center text-center gap-4
//             sm:w-[320px] sm:gap-5 sm:mt-2
//             md:w-[350px] md:gap-6 md:mt-4
//             lg:w-[367px] lg:mt-8
//           ">
//             <img
//               src="https://cdn.cness.io/library.svg"
//               alt="Empty box"
//               className="w-[180px] h-[120px] object-contain
//                 sm:w-[220px] sm:h-[150px]
//                 md:w-[260px] md:h-[180px]
//                 lg:w-[297px] lg:h-[215px]
//               "
//               onError={(e) => {
//                 (e.currentTarget as HTMLImageElement).src = "/png/featured-1.png";
//               }}
//             />
//             <div>
//               <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
//                 No digital treasures here yet!
//               </p>
//               <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
//                 Buy your first digital product and make this space yours.
//               </p>
//             </div>
//             <Link
//               to="/dashboard/market-place"
//               className="inline-flex items-center gap-2 px-4 py-2
//                 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition
//                 sm:px-5 sm:py-2 md:px-6 md:py-2.5
//               "
//             >
//               <span className="text-[13px] sm:text-[14px]">Browse Marketplace</span>
//             </Link>
//           </div>
//         </div>
//         {/* Recommended Products */}
//         <section className="px-0 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-14">
//           <div className="mb-6 sm:mb-8 md:mb-10">
//             <h3 className="text-center text-slate-800 font-semibold text-[17px] sm:text-[19px] md:text-[21px]">
//               Recommended Products
//             </h3>
//             {/* Category Tabs – add if needed */}
//           </div>
//           <div className="
//             grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2
//             mb-6 sm:gap-6 md:gap-7 lg:gap-4 xl:gap-6
//           ">
//             {products.map((product) => (
//               <ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
//             ))}
//           </div>
//           <div className="flex justify-center">
//             <button className="flex items-center space-x-2 px-5 py-2
//               border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors
//               sm:px-6 sm:py-3 md:px-8 md:py-4
//             ">
//               <span className="font-jakarta font-medium text-[14px] sm:text-[15px] md:text-[16px]">
//                 Explore videos
//               </span>
//               <img src="https://static.codia.ai/image/2025-10-15/xZLgath1fZ.png" alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
//             </button>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Search } from "lucide-react";
import { BsCameraVideo } from "react-icons/bs";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetLibraryrDetails, GetMarketPlaceBuyerProducts } from "../Common/ServerAPI";
import ProductCard from "../components/MarketPlace/ProductCard";

type LibraryProduct = {
  product_id: string;
  product_title: string;
  thumbnail_url: string;
  price: string;
  final_price: string;
  overview: string;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    shop_name: string;
  };
  purchased_at: string;
  continue_watching: any;
};

const LibraryProductCard: React.FC<{ p: LibraryProduct }> = ({ p }) => {
  const navigate = useNavigate();

  const getCategoryIcon = () => {
    switch (p.category.slug) {
      case "video":
        return "🎥";
      case "podcast":
        return "🎙️";
      case "music":
        return "🎵";
      case "ebook":
        return "📚";
      case "art":
        return "🎨";
      case "course":
        return "📖";
      default:
        return "📦";
    }
  };

  return (
    <div
      className="bg-white rounded-[14px] border-[0.5px] border-[#CBD5E1] box-border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/dashboard/product-detail/${p.product_id}`)}
    >
      <div className="relative">
        <img
          src={
            p.thumbnail_url ||
            "https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png"
          }
          alt={p.product_title}
          className="w-full h-[180px] object-cover sm:h-[150px] md:h-[180px] lg:h-[200px]"
        />
      </div>
      <div className="p-3">
        {/* Top meta: category + seller */}
        <div className="flex items-center justify-between text-[12px] mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280]">
            {getCategoryIcon()} {p.category.name}
          </span>
          <span className="text-[#6B7280] text-xs truncate max-w-[120px]">
            by {p.seller.shop_name}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-medium text-[#111827] leading-snug line-clamp-2 min-h-[38px]">
          {p.product_title}
        </h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#111827]">
            ${p.final_price}
          </span>
          {p.price !== p.final_price && (
            <span className="text-[12px] text-gray-400 line-through">
              ${p.price}
            </span>
          )}
        </div>

        {/* Watch Now button */}
        <button
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#7077FE] hover:bg-[#5a60ef] text-white text-sm font-medium py-2.5 border border-transparent rounded-lg shadow"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/product-detail/${p.product_id}`);
          }}
        >
          <Play size={20} /> Watch Now
        </button>

        {/* Bottom meta */}
        <div className="mt-3 flex items-center justify-between text-[12px] text-gray-600">
          <span className="inline-flex items-center gap-2">
            <BsCameraVideo size={18} />
            <span>{p.category.name}</span>
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(p.purchased_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [libraryProducts, setLibraryProducts] = useState<LibraryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await GetMarketPlaceBuyerProducts();

        const products = response?.data?.data?.products?.slice(0, 10) || [];
        setFeaturedProducts(products);
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const response = await GetLibraryrDetails();

      const data = response?.data?.data;
      const products = data?.library || [];

      setLibraryProducts(products);
      setPagination(data?.pagination || {});
    } catch (error: any) {
      console.error("Failed to load library:", error);
      showToast({
        message: "Failed to load library",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products by search query
  const filteredProducts = libraryProducts.filter((p) =>
    p.product_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF]">

      <div className="mx-auto px-4 sm:px-6 py-8">
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-6">
            My Library
          </h1>

          {/* Search */}
          <div className="relative max-w-md">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your products..."
              className="w-full h-11 rounded-full border border-gray-300 bg-white pl-5 pr-12 text-[16px] placeholder-gray-400 focus:outline-none focus:border-[#7077FE] focus:ring-2 focus:ring-[#7077FE]/20 transition"
            />
            <button
              type="button"
              aria-label="Search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7077FE] hover:opacity-80"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Products Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#111827]">
              Purchased Products
              {filteredProducts.length > 0 && (
                <span className="ml-2 text-gray-500 text-base">
                  ({filteredProducts.length})
                </span>
              )}
            </h2>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <BsCameraVideo size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery
                  ? "No products found"
                  : "Your library is empty"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "Try searching with different keywords"
                  : "Start exploring the marketplace and purchase your first digital product"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/dashboard/market-place")}
                  className="bg-[#7077FE] text-white px-6 py-3 rounded-lg hover:bg-[#5E65F6] transition font-medium"
                >
                  Explore Marketplace
                </button>
              )}
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <LibraryProductCard key={product.product_id} p={product} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination Info (Optional) */}
        {pagination.total > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Showing {filteredProducts.length} of {pagination.total} products
          </div>
        )}
      </div>
      {/* Recommended Products */}
      <section className="px-0 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-14">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h3 className="text-center text-slate-800 font-semibold text-[17px] sm:text-[19px] md:text-[21px]">
            Recommended Products
          </h3>
          {/* Category Tabs – add if needed */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.length > 0 ? (
            featuredProducts?.map((product, index) => {
              if (index < 10) {
                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product?.product_name,
                      author: product.author,
                      rating: product?.rating?.average,
                      reviews: product?.rating?.total_reviews,
                      currentPrice: product?.discounted_price,
                      originalPrice: product?.price,
                      discount: product.discount_percentage,
                      duration: product.video_details?.duration || product.music_details?.total_duration || "00:00:00",
                      mood: product?.mood_name,
                      image: "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                      category: product.category?.name || "",
                      isLike: product?.is_in_wishlist,
                      isCarted: product?.is_in_cart,
                    }}
                  />
                )
              }
            })
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No Recommended products found
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <button className="flex items-center space-x-2 px-5 py-2
              border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors
              sm:px-6 sm:py-3 md:px-8 md:py-4
            ">
            <span className="font-jakarta font-medium text-[14px] sm:text-[15px] md:text-[16px]">
              Explore videos
            </span>
            <img src="https://static.codia.ai/image/2025-10-15/xZLgath1fZ.png" alt="Explore" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Library;