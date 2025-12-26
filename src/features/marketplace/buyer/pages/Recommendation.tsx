import MoodSelector from "../components/Moodselector";
import ProductLabel from "../components/ProductLabel";
import { useState } from "react";
import { Laugh } from "lucide-react";
import nandhiji from "../../../../assets/nandhiji.svg";
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

interface RecommendedProduct {
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




const recommendedProducts: RecommendedProduct[] = [
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


export default function Recommendation() {
    const [page, setPage] = useState(1);
const [activeTab] = useState("recommended");
const ITEMS_PER_LOAD = 5;
const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
 const visibleRecommendedProducts = recommendedProducts.slice(
    0,
    visibleCount
  );
  return (

   <>
      {/* ================= MOOD SELECTOR ================= */}

   <section className="w-full px-[8px] pt-20">
  <MoodSelector />
</section>


      {/* ================= FEATURED PRODUCTS ================= */}
         <ProductLabel
        title="Recommended For You"
        icon={<Laugh size={21} stroke="#FF7A7A"/>}
        currentPage={page}
        totalItems={48}
        itemsPerPage={6}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />
    


{/* Mobile Filter (Hamburger + Drawer) */}
<div className="px-4 lg:hidden mt-2">
  <Responsivefiletr title="Filters">
    <Filter />
  </Responsivefiletr>
</div>
       <div className="flex gap-6 p-4 lg:p-6">
  <div className="flex-1">

   
        <div className="grid gap-3
    grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
       {visibleRecommendedProducts.map((p) => (
  <ProductCard key={p.id} {...p} />
))}
      </div>


{visibleCount < recommendedProducts.length && (
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
      

  </> 
  );
}
