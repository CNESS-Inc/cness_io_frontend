import MoodSelector from "../components/Moodselector";
import Category from "../components/Category";
import Cnessrecommends  from "../components/Cnessrecommends";
import ProductLabel from "../components/ProductLabel";
import { useState } from "react";
import { Star,Flame } from "lucide-react";
import FeatureProduct from "../components/FeatureProduct";
import nandhiji from "../../../../assets/nandhiji.svg";
import TrendingTabs from "../components/Trendingtabs";
import ProductCard from "../components/ProductCard";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import happy from "../../../../assets/happy.svg";
import whycness from "../../../../assets/whycness.jpg";
import wbinar from "../../../../assets/webinarimg.jpg";
import Filter from "../components/Filter";
import type { ProductCategory } from "../components/ProductCard";
import Responsivefiletr from "../components/Ui/Responsivefilter";

import LoadMoreButton from "../components/Ui/LoadmoreButton";

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
  logo:string;
}

const Featureproducts = [
  {
    id: 1,
    title: 'Cosmic Dance of Siddhars',
    description: 'An ode to the Siddhars where divine wisdom flows through movement and melody.',
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: 'Music',
    categoryColor: 'bg-purple-100 text-purple-800',
    author: 'Nandhiji',
    rating: 5,
    image: 'https://cdn.cness.io/feat1.png',
    featured: true,
    logo:nandhiji
  },
  {
    id: 2,
    title: 'Mastery of Consciousness: Awaken the Inner Guru',
    description: 'The deeply spiritual, mystical wisdom of the siddhars is being revealed in this book',
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: 'Ebook',
    categoryColor: 'bg-blue-100 text-blue-800',
    author: 'Nandhiji',
    rating: 5,
    image: 'https://cdn.cness.io/feat2.jpg',
    featured: true,
    logo:nandhiji
  },
  
];


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
        logo:nandhiji
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
        logo:nandhiji
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
    image:wbinar,
        logo:nandhiji
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
    image:wbinar,
        logo:nandhiji
  },

    {
    id: 4,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Ebook",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: happy,
        logo:nandhiji
  },
    {
    id: 1,
    title: "Dance of Siddhars",
    price: 89,
    originalPrice: 99,
    discount: 10,
    category: "Podcast",
    author: "Nandhiji",
    rating: 5,
    reviews: 97,
    image: happy,
        logo:nandhiji
  },
];


export default function Categories() {
    const [page, setPage] = useState(1);
      const [activeTab, setActiveTab] = useState("trending");
const ITEMS_PER_LOAD = 5;
const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
const visibleTrendingProducts = trendingProducts.slice(0, visibleCount);

  return (
<div className="w-full flex flex-col gap-[30px] relative px-3 sm:px-0">

    
      {/* ================= MOOD SELECTOR ================= */}
      <section className="w-full px-[1px]">
        <MoodSelector />
      </section>
     {/* ================= CATEGORY + CNESSS ================= */}
    <section className="w-full px-[20px]">
  <div className="flex flex-col lg:flex-row w-full items-start gap-[20px]">
    
    {/* LEFT */}
    <div className="flex-1">
      <Category />
    </div>



    {/* RIGHT */}
    <div className="w-full lg:max-w-[300px]">
      <Cnessrecommends />
    </div>

  </div>
</section>

  <section className="w-full px-[1px]">
        <MoodSelector />
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
         <ProductLabel
        title="Featured Products"
        icon={<Star size={21} />}
        currentPage={page}
        totalItems={48}
        itemsPerPage={6}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

<div className="mt-1 sm:mt-2">
  <div className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-[20px]
    px-3 sm:px-4 lg:px-5
  ">
    {Featureproducts.map((product) => (
      <FeatureProduct key={product.id} {...product} />
    ))}
  </div>
</div>

      {/* ================= Trending PRODUCTS ================= */}
         

    <TrendingTabs
        title="On the market"
        icon={<Flame size={20} />}
        tabs={[
          { id: "trending", label: "Trending" },
          { id: "best", label: "Best Sellers" },
          { id: "latest", label: "Latest" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />


{/* Mobile Filter (Hamburger + Drawer) */}
<div className="px-4 lg:hidden">
  <Responsivefiletr title="Filters">
    <Filter />
  </Responsivefiletr>
</div>
       <div className="flex gap-6 p-4 lg:p-6">
  <div className="flex-1">

    {activeTab === "trending" && (
        <div className="grid gap-3
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
       {visibleTrendingProducts.map((p) => (
  <ProductCard key={p.id} {...p} />
))}
      </div>
    )}

{visibleCount < trendingProducts.length && (
  <LoadMoreButton
    onClick={() =>
      setVisibleCount((prev) => prev + ITEMS_PER_LOAD)
    }
  />
)}
    {activeTab === "best" && <div>Best sellers</div>}
    {activeTab === "latest" && <div>Latest products</div>}


  </div>

 <div className="hidden lg:block w-[280px]">
    <Filter />
  </div>
          </div>
          
    { /* ================= Testimonial ================= */}

  <Testimonial />
  <Footer />
         </div>

  
  );
}
