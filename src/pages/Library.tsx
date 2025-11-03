import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/MarketPlace/Filter";
import { Star, Play, Search, Clock, ChevronDown } from "lucide-react";
import filter from "../assets/filter.svg";
import { BsCameraVideo } from "react-icons/bs";

type Product = {
  id: number;
  image: string;
  title: string;
  author: string;
  rating: number;
  reviews: number;
  currentPrice?: number;
  originalPrice?: number;
  discount?: number;
  duration?: string;
  category: string;
};

const CATEGORY_TABS = ["Videos", "Podcasts", "Music", "Ebooks", "Arts", "Courses"] as const;
type Category = (typeof CATEGORY_TABS)[number];

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    image: "https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png",
    title: "Soft guitar moods that heals your inner pain",
    author: "by Redtape",
    rating: 4.2,
    reviews: 123,
    currentPrice: 1299,
    originalPrice: 2444,
    discount: 50,
    duration: "00:23:00",
    category: "Videos",
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
    category: "Videos",
  },
  {
    id: 3,
    image: "https://static.codia.ai/image/2025-10-15/TjuDo2nfP0.png",
    title: "Soft guitar moods that heals your inner pain",
    author: "by Redtape",
    rating: 4.8,
    reviews: 123,
    currentPrice: 1299,
    originalPrice: 2444,
    discount: 50,
    duration: "00:23:00",
    category: "Videos",
  },
  {
    id: 4,
    image: "https://static.codia.ai/image/2025-10-15/VM7Quny2Gp.png",
    title: "Soft guitar moods that heals your inner pain",
    author: "by Redtape",
    rating: 4.5,
    reviews: 123,
    currentPrice: 1299,
    originalPrice: 2444,
    discount: 50,
    duration: "00:23:00",
    category: "Videos",
  },
  {
    id: 5,
    image: "https://static.codia.ai/image/2025-10-15/d9CJZoEQeE.png",
    title: "Soft guitar moods that heals your inner pain",
    author: "by Redtape",
    rating: 4,
    reviews: 123,
    currentPrice: 1299,
    duration: "00:23:00",
    category: "Videos",
  },
  {
    id: 6,
    image: "https://static.codia.ai/image/2025-10-15/2RXhPHX82C.png",
    title: "Soft guitar moods that heals your inner pain",
    author: "by Redtape",
    rating: 4.8,
    reviews: 123,
    currentPrice: 1299,
    originalPrice: 2444,
    discount: 50,
    duration: "00:23:00",
    category: "Videos",
  },
];

const Thumb: React.FC<{ src: string; label?: string }> = ({ src, label }) => (
  <div className="relative rounded-xl overflow-hidden group">
    <img src={src} alt={label || "thumb"} className="w-full h-32 object-cover" />
    <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
      <span className="flex items-center gap-2 text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
        <Play size={16} />
        Watch
      </span>
    </button>
  </div>
);

const ProductCard: React.FC<{ p: Product }> = ({ p }) => (
  <div className="bg-white w-[225px] h-[380px] rounded-[14px] border-[0.5px] border-[#CBD5E1] box-border shadow-sm overflow-hidden">
    <div className="relative">
      <img src={p.image} alt={p.title} className="w-full h-[180px] object-cover" />
    </div>
    <div className="p-2">
      {/* Top meta: mood pill + rating */}
      <div className="flex items-center justify-between text-[12px] mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280]">🕊️ Peaceful</span>
        <span className="inline-flex items-center gap-1 text-[#6B7280]">
          <Star size={14} className="text-[#7077FE] fill-[#7077FE]" />
          <span className="text-[#111827] font-medium">{p.rating.toFixed(1)}</span>
          <span className="text-gray-500">({p.reviews})</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-medium text-[#111827] leading-snug line-clamp-2 min-h-[38px]">{p.title}</h3>

      {/* Author */}
      <div className="mt-2 text-[12px] text-gray-600">{p.author}</div>

      {/* Watch Now button inside content */}
      <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#7077FE] hover:bg-[#5a60ef] text-white text-sm font-medium py-2.5 border border-transparent rounded-[3px] shadow">
        <Play size={20} /> Watch Now
      </button>

      {/* Bottom meta row: Videos on left, duration on right */}
      <div className="mt-3 flex items-center justify-between text-[12px] text-gray-600">
        <span className="inline-flex items-center gap-2">
          <BsCameraVideo size={18} />
          <span>Videos</span>
        </span>
        <span className="inline-flex items-center gap-1 text-gray-500">
          <Clock size={14} /> {p.duration ?? "00:00:00"}
        </span>
      </div>
    </div>
  </div>
);

const Library: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("Videos");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("Recently Added");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const products = useMemo(() => {
    const byCat = DUMMY_PRODUCTS.filter((p) => p.category === activeCategory);
    const byQuery = query ? byCat.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())) : byCat;
    return byQuery;
  }, [activeCategory, query]);

  // Count items per category (reflecting current search query)
  const countsByCategory = useMemo(() => {
    const lower = query.toLowerCase();
    const map: Record<string, number> = {};
    CATEGORY_TABS.forEach((cat) => {
      map[cat] = DUMMY_PRODUCTS.filter(
        (p) => p.category === cat && (!query || p.title.toLowerCase().includes(lower))
      ).length;
    });
    return map;
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-0 py-2 grid grid-cols-1 md:grid-cols-[1fr_267px] gap-6">
        {/* Main content (left) */}
        <main className="space-y-6">
          {/* Continue watching */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] sm:text-lg font-semibold text-[#111827]">Continue watching</h2>
              <button className="text-[#7077FE] text-sm" onClick={() => navigate('/dashboard/continue-watching')}>View all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {[
                "https://cdn.cness.io/collection1.svg",
                "https://cdn.cness.io/collection2.svg",
                "https://cdn.cness.io/collection3.svg",
                
              ].map((src, i) => (
                <Thumb key={i} src={src} />
              ))}
            </div>
          </section>

          {/* My Collections */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] sm:text-lg font-semibold text-[#111827]">My Collections</h2>
              <button className="text-[#7077FE] text-sm" onClick={() => navigate('/dashboard/collections')}>View all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {[
                { label: "Motivated", src: "https://cdn.cness.io/collection1.svg" },
                { label: "Ebook", src: "https://cdn.cness.io/collection3.svg" },
                { label: "Yoga", src: "https://cdn.cness.io/collection2.svg" },
              ].map((c) => (
                <Thumb key={c.label} src={c.src} label={c.label} />
              ))}
            </div>
          </section>

          {/* Search and sort */}
          <section className="grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:items-center gap-3">
            <div className="relative sm:justify-self-start">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-[450px] h-9 rounded-[20px] border border-gray-200 bg-white pl-4 pr-10 text-[16px] leading-[150%] tracking-[-0.019em] placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"
                
              />
              <button
                type="button"
                aria-label="Search"
                onClick={() => {
                  // search is live via query; click kept for UX parity
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7077FE] hover:opacity-80"
              >
                <Search size={18} />
              </button>
            </div>
            <div className="relative w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-2 px-4 py-[10px] bg-white border border-[#7077FE] rounded-full shadow-sm text-[#7077FE] font-medium text-sm md:text-base hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <img src={filter} alt="filter" className="w-5 h-5" />
                  <span className="truncate">{selected}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="absolute top-full mt-2 w-full sm:w-60 bg-white border border-[#7077FE] rounded-2xl shadow-lg z-10 p-4 space-y-3">
                  {[
                    "Recently Added",
                    "Newest Arrival",
                    "Most Popular",
                    "Price : High to Low",
                    "Price : Low to High",
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelected(option);
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left font-poppins font-normal text-[16px] leading-[100%] px-2 py-1 rounded-lg transition-colors ${
                        selected === option
                          ? "text-[#7077FE] font-semibold"
                          : "text-gray-700 hover:text-[#7077FE]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Category chips with item counts (no toggle icon) */}
          <section className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${active ? "bg-[#EEF2FF] border-[#7077FE] text-[#3F51F5]" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>{c}</span>
                  <span className="ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs border border-gray-200 text-gray-600 bg-white">
                    {countsByCategory[c] ?? 0}
                  </span>
                </button>
              );
            })}
          </section>

          {/* My products grid */}
          <section>
            <h3 className="text-[16px] sm:text-lg font-semibold text-[#111827] mb-3">My products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 justify-items-start">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar (right) */}
  <FilterSidebar mobileTopOffset={143} />
      </div>
    </div>
  );
};

export default Library;
