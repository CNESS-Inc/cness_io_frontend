import { Link } from "react-router-dom";
import ProductCard from "../components/MarketPlace/ProductCard";
export default function EmptyPageLibrary() {
  const products = [
    {
      id: 1,
      image: "https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.2,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: ":art: creative",
    },
    {
      id: 2,
      image: "https://static.codia.ai/image/2025-10-15/uPxjuzQ1CY.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.7,
      reviews: 123,
      currentPrice: 1299,
      duration: "00:23:00",
      category: ":dove_of_peace: Peaceful",
    },
    {
      id: 3,
      image: "https://static.codia.ai/image/2025-10-15/TjuDo2nfP0.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: ":pray: Grateful",
    },
    {
      id: 4,
      image: "https://static.codia.ai/image/2025-10-15/VM7Quny2Gp.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.5,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: ":person_in_lotus_position: Spiritual",
    },
    {
      id: 5,
      image: "https://static.codia.ai/image/2025-10-15/d9CJZoEQeE.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: ":dove_of_peace: Peaceful",
    },
    {
      id: 6,
      image: "https://static.codia.ai/image/2025-10-15/2RXhPHX82C.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: ":dove_of_peace: Peaceful",
    },
  ];
  return (
    <div className="w-full min-h-screen flex flex-col
      px-4 pb-14
      sm:px-6 sm:pb-16 sm:pt-[10px]
      md:px-8 md:pb-20 md:pt-[12px]
      lg:px-10 lg:pb-24 lg:pt-[14px]
      xl:px-12 xl:pb-28 xl:pt-[16px]
      2xl:px-16 2xl:pb-32 2xl:pt-[18px]
      "
    >
      
      {/* Main content */}
      <div className="max-w-[1160px] mx-auto flex-1 flex flex-col">
        <h2
          className="mt-4 mb-2 text-[18px] font-semibold text-slate-900
            sm:text-[22px] sm:mt-6 sm:mb-3
            md:text-[24px] md:mt-8 md:mb-4
            lg:text-[26px] xl:text-[28px]
          "
        >
          Library
        </h2>
        {/* Empty state */}
        <div className="w-full flex justify-center items-center flex-1">
          <div className="w-[280px] max-w-full h-auto flex flex-col items-center text-center gap-4
            sm:w-[320px] sm:gap-5 sm:mt-2
            md:w-[350px] md:gap-6 md:mt-4
            lg:w-[367px] lg:mt-8
          ">
            <img
              src="https://cdn.cness.io/library.svg"
              alt="Empty box"
              className="w-[180px] h-[120px] object-contain
                sm:w-[220px] sm:h-[150px]
                md:w-[260px] md:h-[180px]
                lg:w-[297px] lg:h-[215px]
              "
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/png/featured-1.png";
              }}
            />
            <div>
              <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
                No digital treasures here yet!
              </p>
              <p className="text-[12px] text-slate-500 sm:text-[13px] md:text-[14px]">
                Buy your first digital product and make this space yours.
              </p>
            </div>
            <Link
              to="/dashboard/market-place"
              className="inline-flex items-center gap-2 px-4 py-2
                rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition
                sm:px-5 sm:py-2 md:px-6 md:py-2.5
              "
            >
              <span className="text-[13px] sm:text-[14px]">Browse Marketplace</span>
            </Link>
          </div>
        </div>
        {/* Recommended Products */}
        <section className="px-0 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-center text-slate-800 font-semibold text-[17px] sm:text-[19px] md:text-[21px]">
              Recommended Products
            </h3>
            {/* Category Tabs – add if needed */}
          </div>
          <div className="
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5
            mb-6 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-10
          ">
            {products.map((product) => (
              <ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
            ))}
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
    </div>
  );
}