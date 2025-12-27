import { Flame } from "lucide-react";
import Footer from "../../buyer/components/Footer";
import SellerProductCard from "../../buyer/components/SellerProductCard";
import Testimonial from "../../buyer/components/Testimonial";
import Revenue from "../component/Revenue";
import SellerProfile from "../component/SellerProfile";
import TopBuyers from "../component/TopBuyers";
import TopProducts from "../component/TopProducts";
import happy from "../../../../assets/happy.svg";
import whycness from "../../../../assets/whycness.jpg";
import wbinar from "../../../../assets/webinarimg.jpg";
import nandhiji from "../../../../assets/nandhiji.svg";
import { useState } from "react";
import type { ProductCategory } from "../../buyer/components/ProductCard";
import SellerReviewsSection from "../component/SellerReviewsSection";

interface TrendingProduct {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  author: string;
  rating: number;
  reviews: number;
  image: string;
  logo: string;
  creator: boolean;
}

// Define the seller data structure
const sellerData = {
  id: 1,
  title: 'Nandhiji',
  rating: 5,
  image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',
  isOnline: true,
  sellerSince: 'December 1, 2025',
  totalProducts: 16,
  revenue: '$54,000.00',
  // Optional props
  showEditButton: true,
  showHelpButton: true,
  showImageUpload: true,
  stats: [
    {
      label: 'Seller Since',
      value: 'December 1, 2025',
      icon: 'Store' as const,
    },
    {
      label: 'Total Products',
      value: '16',
      icon: 'Box' as const,
    },
    {
      label: 'Revenue',
      value: '$54,000.00',
      icon: 'Banknote' as const,
    },
    {
      label: 'Rating',
      value: '5.0',
      icon: 'Star' as const,
    },
  ]
};

const trendingProducts: TrendingProduct[] = [
  {
    id: 1,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Ebook",
    author: "Nandhiji",
    rating: 5,
    reviews: 70,
    image: happy,
    logo: nandhiji,
    creator: true
  },
  {
    id: 2,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Music",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: whycness,
    logo: nandhiji,
    creator: true
  },
  {
    id: 3,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Music",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: wbinar,
    logo: nandhiji,
    creator: true
  },
  {
    id: 4,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Music",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: wbinar,
    logo: nandhiji,
    creator: true
  },
  {
    id: 5,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Ebook",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: happy,
    logo: nandhiji,
    creator: true
  },
  {
    id: 6,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Podcast",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: happy,
    logo: nandhiji,
    creator: true
  },
];

export default function MarketPlaceSellerDashboard() {
  const ITEMS_PER_LOAD = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const visibleTrendingProducts = trendingProducts.slice(0, visibleCount);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-[30px] relative px-3 sm:px-0">
      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          w-full
          pt-4 sm:pt-[80px] sm:px-[20px]
          pb-4 sm:pb-[20px]
          grid
          grid-cols-1 md:grid-cols-12
          gap-4 sm:gap-[20px]
          "
      >
        {/* LEFT: HERO SECTION - Full width on mobile */}
        <div className="md:col-span-12">
          <SellerProfile {...sellerData} />
        </div>
        <div className="sm:col-span-4 ">
          <TopBuyers />
        </div>
        <div className="sm:col-span-4 ">
          <TopProducts />
        </div>
        <div className="sm:col-span-4 ">
          <Revenue />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-3">
            {/* Products Section - Full width on mobile, 2/3 on desktop */}
            <div className="flex-1 lg:w-2/3">
              <div className="py-2 sm:py-3">
                <div className="flex items-center gap-2 sm:gap-[10px]">
                  <div className="text-[#FF6A55] flex items-center">
                    <Flame size={18} />
                  </div>
                  <h2 className="font-[Poppins] text-base sm:text-[20px] font-medium text-[#080F20]">
                    List of Sellers
                  </h2>
                </div>
              </div>
              <div className="flex-1 mt-4.5">
                <div className="grid gap-3 sm:gap-4
                    grid-cols-2 
                    sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]
                    md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
                    lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                  {visibleTrendingProducts.map((p) => (
                    <SellerProductCard key={p.id} {...p} />
                  ))}
                </div>

                {/* Load More Button for Mobile */}
                {visibleCount < trendingProducts.length && (
                  <div className="mt-6 flex justify-center lg:hidden">
                    <button
                      onClick={() => setVisibleCount(prev => prev + ITEMS_PER_LOAD)}
                      className="px-6 py-2 bg-[#FF6A55] text-white rounded-lg font-medium hover:bg-[#E55A45] transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section - Full width on mobile, 1/3 on desktop */}
            <div className="lg:w-1/3">
              <div className="sticky top-4">
                <SellerReviewsSection />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sections */}
      <Testimonial />
      <Footer />
    </div>
  );
}